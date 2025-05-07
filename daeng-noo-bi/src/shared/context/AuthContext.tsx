// shared/context/AuthContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
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
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = getAuth();
  const functions = getFunctions();

  const isDev = import.meta.env.MODE !== "production";
  if (isDev) {
    connectFunctionsEmulator(functions, "localhost", 5001);
    console.log(`[DEV] Firebase Functions Emulator 연결됨`);
  }

  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {
      console.warn("Persistence 설정 실패");
    });

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        const data = snap.exists() ? snap.data() : {};
        setUser({
          id: fbUser.uid,
          email: fbUser.email || "",
          favorites: (data.favorites as string[]) || [],
          nickname: (data.nickname as string) || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const sendVerificationCode = async (email: string, code: string) => {
    if (isDev) {
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

  const signup = async (email: string, password: string, nickname: string) => {
    // signup 호출 시 이미 email verified 상태라고 가정
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      nickname,
      favorites: [] as string[],
      isVerified: true, // 이미 인증된 이메일
    });
    await firebaseSignOut(auth);
  };

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    const data = snap.exists() ? snap.data() : {};
    if (!data?.isVerified) {
      await firebaseSignOut(auth);
      const err = new Error(
        "이메일 인증이 필요합니다. 메일함을 확인해주세요."
      ) as any;
      err.code = "auth/email-not-verified";
      throw err;
    }
  };

  // Google 로그인 함수
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    // 팝업을 통해 로그인
    const cred = await signInWithPopup(auth, provider);
    const fbUser = cred.user;

    // Firestore 사용자 문서 경로
    const userRef = doc(db, "users", fbUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: fbUser.email,
        nickname: "", // 초기값, 추후 입력 유도 가능
        favorites: [],
        isVerified: true, // 구글은 이메일 인증 불필요
      });
    }

    // 상태는 onAuthStateChanged에서 자동 반영됨
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sendVerificationCode,
        signup,
        login,
        logout,
        loginWithGoogle,
      }}
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
