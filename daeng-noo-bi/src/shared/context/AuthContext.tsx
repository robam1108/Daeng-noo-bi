// shared/context/AuthContext.tsx
import {
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
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  UserInfo,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
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
  icon?: number;
  providerData: UserInfo[];
}

interface AuthContextType {
  user: AuthUser | null;
  sendVerificationCode: (email: string, code: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  addFavorite: (contentId: string) => Promise<void>;
  removeFavorite: (contentId: string) => Promise<void>;

  updateNickname: (nickname: string) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateUserIcon: (iconNumber: number) => Promise<void>;
  reauthenticate: (password: string) => Promise<void>;
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
    // console.log(`[DEV] Firebase Functions Emulator 연결됨`);
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
          providerData: fbUser.providerData,
          favorites: (data.favorites as string[]) || [],
          nickname: (data.nickname as string) || "",
          icon: (data.icon as number) || 0,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const sendVerificationCode = async (email: string, code: string) => {
    if (import.meta.env.MODE === "development") {
      console.log(`[DEV] 인증코드: ${code} → ${email}`);
      return;
    }

    const res = await fetch("/api/sendVerificationCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error("메일 전송 실패: " + errText);
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

    await setDoc(
      userRef,
      {
        email: fbUser.email || "",
        nickname: fbUser.displayName || "",
        favorites: snap.exists() ? (snap.data().favorites as string[]) : [],
        isVerified: true,
      },
      { merge: true }
    );
    setUser({
      id: fbUser.uid,
      email: fbUser.email || "",
      providerData: fbUser.providerData,
      nickname: fbUser.displayName || "",
      favorites: snap.exists() ? (snap.data().favorites as string[]) : [],
    });
    // 상태는 onAuthStateChanged에서 자동 반영됨
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  // 찜 추가
  const addFavorite = async (contentId: string) => {
    if (!auth.currentUser) throw new Error("로그인이 필요합니다.");
    const uid = auth.currentUser.uid;
    const userDoc = doc(db, "users", uid);

    await updateDoc(userDoc, { favorites: arrayUnion(contentId) });

    // 로컬 상태도 즉시 반영
    setUser(
      (prev) =>
        prev && {
          ...prev,
          favorites: prev.favorites?.includes(contentId)
            ? prev.favorites
            : [...(prev.favorites || []), contentId],
        }
    );
  };

  // 찜 제거
  const removeFavorite = async (contentId: string) => {
    if (!auth.currentUser) throw new Error("로그인이 필요합니다.");
    const uid = auth.currentUser.uid;
    const userDoc = doc(db, "users", uid);

    await updateDoc(userDoc, { favorites: arrayRemove(contentId) });

    setUser(
      (prev) =>
        prev && {
          ...prev,
          favorites: prev.favorites?.filter((id) => id !== contentId) || [],
        }
    );
  };

  // 닉네임 변경
  const updateNickname = async (nickname: string) => {
    if (!auth.currentUser) throw new Error("로그인이 필요합니다.");
    // Firebase Auth 프로필 업데이트
    await firebaseUpdateProfile(auth.currentUser, { displayName: nickname });
    // Firestore users 문서에 반영
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, "users", uid), { nickname });
    // 로컬 상태 업데이트
    setUser((prev) => (prev ? { ...prev, nickname } : prev));
  };

  // 이메일 변경
  const updateEmail = async (newEmail: string) => {
    if (!auth.currentUser) throw new Error("로그인이 필요합니다.");
    // Firebase Auth 이메일 업데이트
    await firebaseUpdateEmail(auth.currentUser, newEmail);
    // Firestore users 문서에 반영
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, "users", uid), { email: newEmail });
    // 로컬 상태 업데이트
    setUser((prev) => (prev ? { ...prev, email: newEmail } : prev));
  };

  // 비밀번호 재인증
  const reauthenticate = async (password: string) => {
    if (!auth.currentUser?.email) {
      throw new Error("유저 정보가 없습니다.");
    }
    const cred = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, cred);
  };

  // 비밀번호 변경
  const updatePassword = async (newPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email)
      throw new Error("로그인이 필요합니다.");
    // 비밀번호 업데이트
    await firebaseUpdatePassword(auth.currentUser, newPassword);
  };

  // 프로필 아이콘 변경
  const updateUserIcon = async (iconNumber: number) => {
    if (!auth.currentUser) throw new Error("로그인이 필요합니다.");
    // 1~9 범위 검증
    if (iconNumber < 1 || iconNumber > 9) {
      console.error("iconNumber는 1~9 사이여야 합니다.");
      return;
    }
    const userRef = doc(db, "users", auth.currentUser.uid);
    try {
      // Firestore에 icon 필드만 업데이트
      await updateDoc(userRef, { icon: iconNumber });
      // 로컬 컨텍스트 상태도 즉시 반영
      setUser((prev) => (prev ? { ...prev, icon: iconNumber } : prev));
    } catch (error) {
      console.error("아이콘 업데이트 실패:", error);
    }
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
        addFavorite,
        removeFavorite,
        updateNickname,
        updateEmail,
        updatePassword,
        updateUserIcon,
        reauthenticate
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
