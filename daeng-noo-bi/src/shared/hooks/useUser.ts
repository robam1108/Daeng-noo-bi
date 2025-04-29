import { useEffect, useState } from "react";
import { fetchUser } from "./../api/UserApi";
import { User } from "../shared/types/User";

export function useUser(userId: string) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!userId) return;

        async function loadUser() {
            setLoading(true);
            const userData = await fetchUser(userId);
            setUser(userData);
            setLoading(false);
        }

        loadUser();
    }, [userId]);

    return { user, loading };
}