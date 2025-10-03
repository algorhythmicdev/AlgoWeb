import { writable } from 'svelte/store';

const createNavigationStore = () => {
  const { subscribe, set, update } = writable({
    isMenuOpen: false,
    isScrolled: false,
    scrollDirection: 'up',
    lastScrollY: 0
  });
  
  return {
    subscribe,
    toggleMenu: () => {
      update(state => ({ ...state, isMenuOpen: !state.isMenuOpen }));
    },
    closeMenu: () => {
      update(state => ({ ...state, isMenuOpen: false }));
    },
    updateScroll: (scrollY) => {
      update(state => {
        const scrollDirection = scrollY > state.lastScrollY ? 'down' : 'up';
        return {
          ...state,
          isScrolled: scrollY > 50,
          scrollDirection,
          lastScrollY: scrollY
        };
      });
    }
  };
};

export const navigation = createNavigationStore();
