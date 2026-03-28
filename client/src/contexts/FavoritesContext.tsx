import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface FavoritesState {
  questions: string[];
  modalities: string[];
  worksheets: string[];
}

interface FavoritesContextType {
  favorites: FavoritesState;
  toggleFavorite: (type: keyof FavoritesState, id: string) => void;
  isFavorite: (type: keyof FavoritesState, id: string) => boolean;
  clearAll: () => void;
  count: number;
}

const STORAGE_KEY = "tmg-favorites";

function loadFavorites(): FavoritesState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { questions: [], modalities: [], worksheets: [] };
}

function saveFavorites(state: FavoritesState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritesState>(loadFavorites);

  const toggleFavorite = useCallback((type: keyof FavoritesState, id: string) => {
    setFavorites(prev => {
      const list = prev[type];
      const next = list.includes(id)
        ? { ...prev, [type]: list.filter(x => x !== id) }
        : { ...prev, [type]: [...list, id] };
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((type: keyof FavoritesState, id: string) => {
    return favorites[type].includes(id);
  }, [favorites]);

  const clearAll = useCallback(() => {
    const empty: FavoritesState = { questions: [], modalities: [], worksheets: [] };
    setFavorites(empty);
    saveFavorites(empty);
  }, []);

  const count = favorites.questions.length + favorites.modalities.length + favorites.worksheets.length;

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearAll, count }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
