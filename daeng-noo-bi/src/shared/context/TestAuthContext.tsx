import { createContext, ReactNode, useContext } from "react";
import { AuthUser } from "./AuthContext"; // 기존 AuthContext에서 사용자 타입 가져오기

// 테스트용 기본 사용자 정보 정의
const defaultTestUser: AuthUser = {
    id: "test-user",
    email: "test@example.com",
    favorites: ['3440844', '3112063', '129501'], // 예시 찜목록
};

// '3440844', '3112063', '129501', '126747', '2783557', '2638475', '2402981', '300076', '3111840', '2470006', '1906334', '3006915', '2003909', '264311', '753981', '2781318', '729167', '822384', '3112044', '126943'

// TestAuthContext 생성: 기본값으로 테스트 사용자 제공
export const TestAuthContext = createContext<AuthUser>(defaultTestUser);

interface TestAuthProviderProps {
    children: ReactNode;
    user?: AuthUser; // 프로바이더에 전달할 테스트 유저 객체를 선택적으로 받을 수 있음
}

// TestAuthProvider 컴포넌트: 로그인 기능이 없을 때 임시로 테스트 유저를 공급
export function TestAuthProvider({ children, user = defaultTestUser }: TestAuthProviderProps) {
    return (
        <TestAuthContext.Provider value={user}>
            {children}
        </TestAuthContext.Provider>
    );
}

export function useTestAuth() {
    const user = useContext(TestAuthContext);
    return user;
}