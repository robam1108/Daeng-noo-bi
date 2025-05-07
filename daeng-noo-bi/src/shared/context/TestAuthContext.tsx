import { createContext, ReactNode, useContext, useState } from "react";
import { AuthContextType, AuthUser } from "./AuthContext";

// 테스트용 기본 사용자 정보
const defaultTestUser: AuthUser = {
    id: "test-user",
    email: "test@example.com",
    nickname: "테스트 사용자",
    favorites: [
        '3440844', '3112063', '129501',
        '126747', '2783557', '2638475',
        '2402981',
    ],
};

// AuthContextType 전체를 모킹한 기본값
const defaultTestAuth: AuthContextType = {
    user: defaultTestUser,
    sendVerificationCode: async () => { /* 테스트용 더미 */ },
    signup: async () => { /* 테스트용 더미 */ },
    login: async () => { /* 테스트용 더미 */ },
    logout: async () => { /* 테스트용 더미 */ },
    addFavorite: async (contentId: string) => { /* 초기값은 동작 안 함 */ },
    removeFavorite: async (contentId: string) => { /* 초기값은 동작 안 함 */ },
};

// TestAuthContext 생성
export const TestAuthContext = createContext<AuthContextType>(defaultTestAuth);

interface TestAuthProviderProps {
    children: ReactNode;
    // 초기 사용자 상태를 덮어쓸 수 있도록 옵션 제공
    initialUser?: Partial<AuthUser>;
}

/**
 * TestAuthProvider
 * - 테스트 환경에서 AuthContext 역할을 대신합니다.
 * - 내부적으로 user 상태를 관리하고, add/remove favorite 로직을 시뮬레이트합니다.
 */
export function TestAuthProvider({ children, initialUser }: TestAuthProviderProps) {
    // 기본값 + overrides로 초기 user 설정
    const [user, setUser] = useState<AuthUser>({
        ...defaultTestUser,
        ...initialUser,
    });

    // 즐겨찾기 추가 로직 (state만 변경)
    const addFavorite = async (contentId: string) => {
        setUser(prev => ({
            ...prev,
            favorites: prev.favorites?.includes(contentId)
                ? prev.favorites
                : [...(prev.favorites || []), contentId],
        }));
    };

    // 즐겨찾기 제거 로직 (state만 변경)
    const removeFavorite = async (contentId: string) => {
        setUser(prev => ({
            ...prev,
            favorites: prev.favorites?.filter(id => id !== contentId) || [],
        }));
    };

    // 실제 Context에 전달할 값
    const contextValue: AuthContextType = {
        ...defaultTestAuth,
        user,
        addFavorite,
        removeFavorite,
    };

    return (
        <TestAuthContext.Provider value={contextValue}>
            {children}
        </TestAuthContext.Provider>
    );
}

/**
 * useTestAuth 훅
 * - TestAuthContext에서 제공하는 값을 반환합니다.
 */
export function useTestAuth() {
    return useContext(TestAuthContext);
}
