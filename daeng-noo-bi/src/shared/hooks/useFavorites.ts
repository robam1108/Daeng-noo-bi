import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export function useFavorites() {
    const { user, addFavorite, removeFavorite } = useAuth();
    const favs = user?.favorites || [];

    const toggleFavorite = useCallback(async (contentId: string) => {
        if (favs.includes(contentId)) {
            await removeFavorite(contentId);
        } else {
            await addFavorite(contentId);
        }
    }, [favs, addFavorite, removeFavorite]);

    const isFavorite = (contentId: string) => favs.includes(contentId);

    return { user, favs, isFavorite, toggleFavorite };
}
