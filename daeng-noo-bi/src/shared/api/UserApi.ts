import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "../types/User";

export async function fetchUser(userId: string): Promise<User | null> {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data() as User; // 타입 단언
        } else {
            console.warn("해당 유저 문서가 존재하지 않습니다.");
            return null;
        }
    } catch (error) {
        console.error("유저 데이터 가져오기 실패:", error);
        return null;
    }
}