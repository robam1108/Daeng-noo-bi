// shared/context/AuthContext.tsx
import {
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
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";

export interface AuthUser {
  id: string;
  email: string;
  favorites?: string[];
  nickname?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  sendVerificationCode: (email: string, code: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addFavorite: (contentId: string) => Promise<void>;
  removeFavorite: (contentId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const auth = getAuth();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {
      console.warn("Persistence 설정 실패");
    });

    const unsubscribe = onAuthStateChanged(
      auth,
      async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          // Firestore 에서 즐겨찾기 + 닉네임 불러오기
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
      }
    );
    return () => unsubscribe();
  }, [auth]);

  // 회원가입: Auth 생성 후 Firestore 에 프로필 저장
  const signup = async (email: string, password: string, nickname: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Firestore 'users' 컬렉션에 document 생성
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      nickname,
      favorites: [] as string[],
    });
    // onAuthStateChanged 가 자동으로 Context 에 반영합니다.
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  // 찜 추가
  const addFavorite = async (contentId: string) => {
    if (!auth.currentUser) throw new Error('로그인이 필요합니다.');
    const uid = auth.currentUser.uid;
    const userDoc = doc(db, 'users', uid);

    await updateDoc(userDoc, { favorites: arrayUnion(contentId) });

    // 로컬 상태도 즉시 반영
    setUser(prev => prev && ({
      ...prev,
      favorites: prev.favorites?.includes(contentId)
        ? prev.favorites
        : [...(prev.favorites || []), contentId]
    }));
  };

  // 찜 제거
  const removeFavorite = async (contentId: string) => {
    if (!auth.currentUser) throw new Error('로그인이 필요합니다.');
    const uid = auth.currentUser.uid;
    const userDoc = doc(db, 'users', uid);

    await updateDoc(userDoc, { favorites: arrayRemove(contentId) });

    setUser(prev => prev && ({
      ...prev,
      favorites: prev.favorites?.filter(id => id !== contentId) || []
    }));
  };

  return (
    <AuthContext.Provider
      value={{ user, sendVerificationCode, signup, login, logout, addFavorite, removeFavorite }}
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
