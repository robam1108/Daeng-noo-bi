import { createContext, ReactNode, useEffect, useState } from "react";
import { browserLocalPersistence, getAuth, setPersistence, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

// AuthProvider가 받을 Props 타입
interface AuthProviderProps {
    children: ReactNode;
}

export interface AuthUser {
    id: string;
    email: string;
    favorites?: string[];
}

export const AuthContext = createContext<AuthUser | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const auth = getAuth();
        // 로그인 상태 localStorage에 유지
        setPersistence(auth, browserLocalPersistence).catch(() => {
            console.warn("Persistence 설정 실패");
        })

        const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
            if (fbUser) {
                // Firestore에서 찜목록 가져오기
                const favSnap = await getDoc(doc(db, "users", fbUser.uid));
                const favorites = favSnap.exists() ? favSnap.data().favorites || [] : [];
                // Context에 저장
                setUser({ id: fbUser.uid, email: fbUser.email!, favorites });
            } else {
                // 로그아웃 시 Context 초기화
                setUser(null);
            }
        });

        // 언마운트 시 리스너 해제
        return () => unsubscribe();
    }, []);


    return <AuthContext.Provider value={user}> {children} </AuthContext.Provider>;
};
