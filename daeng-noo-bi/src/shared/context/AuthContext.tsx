// shared/context/AuthContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
} from "firebase/functions";

export interface AuthUser {
  id: string;
  email: string;
  favorites?: string[];
  nickname?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  sendVerificationCode: (email: string, code: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 1) Firebase Auth
  const auth = getAuth();
  // 2) Functions 인스턴스 얻기
  const functions = getFunctions();

  // 3) 개발 모드면 로컬 에뮬레이터에 연결
  if (import.meta.env.MODE !== "production") {
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {
      console.warn("Persistence 설정 실패");
    });

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userSnap = await getDoc(doc(db, "users", fbUser.uid));
        const data = userSnap.exists() ? userSnap.data() : {};
        setUser({
          id: fbUser.uid,
          email: fbUser.email!,
          favorites: (data.favorites as string[]) || [],
          nickname: (data.nickname as string) || "",
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // 인증 코드 발송 (httpsCallable 사용)
  const sendVerificationCode = async (email: string, code: string) => {
    const isDev = import.meta.env.MODE !== "production";
    if (isDev) {
      // 이 콘솔 메시지가 보이면, 인증 코드 로직이 정상 동작 중
      console.log(`[DEV] sendVerificationCode → ${email}: ${code}`);
      return;
    }

    const fn = httpsCallable<
      { email: string; code: string },
      { success: boolean }
    >(functions, "sendVerificationCode");
    const res = await fn({ email, code });
    if (!res.data.success) {
      throw new Error("인증 메일 전송에 실패했습니다.");
    }
  };

  // 회원가입
  const signup = async (email: string, password: string, nickname: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      nickname,
      favorites: [] as string[],
    });
    await firebaseSignOut(auth);
  };

  // 로그인
  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error("이메일 인증이 필요합니다. 메일함을 확인해주세요.");
    }
    const userDoc = await getDoc(doc(db, "users", cred.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        nickname: "",
        favorites: [],
      });
    }
  };

  // 로그아웃
  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, sendVerificationCode, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 내부에서만 호출할 수 있습니다.");
  }
  return ctx;
};
