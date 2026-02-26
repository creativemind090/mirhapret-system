import { create } from 'zustand';

interface UIState {
  // Navigation
  isHeaderScrolled: boolean;
  setIsHeaderScrolled: (scrolled: boolean) => void;

  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Notifications
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;

  // Filters
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;

  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
  setSortBy: (sort: 'newest' | 'price-low' | 'price-high' | 'popular') => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Navigation
  isHeaderScrolled: false,
  setIsHeaderScrolled: (scrolled) => set({ isHeaderScrolled: scrolled }),

  // Modals
  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),

  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),

  // Notifications
  notifications: [],
  addNotification: (message, type) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now().toString(),
          message,
          type,
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // Filters
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  priceRange: [0, 50000],
  setPriceRange: (range) => set({ priceRange: range }),

  sortBy: 'newest',
  setSortBy: (sort) => set({ sortBy: sort }),
}));
