import { writable } from 'svelte/store';

/**
 * @typedef {Object} NavigationState
 * @property {boolean} isMenuOpen - Whether the mobile menu is open
 * @property {boolean} isScrolled - Whether the page has been scrolled past threshold
 * @property {'up'|'down'} scrollDirection - Current scroll direction
 * @property {number} lastScrollY - Last recorded scroll position
 */

const createNavigationStore = () => {
  const { subscribe, update } = writable(/** @type {NavigationState} */ ({
    isMenuOpen: false,
    isScrolled: false,
    scrollDirection: 'up',
    lastScrollY: 0
  }));
  
  return {
    subscribe,
    toggleMenu: () => {
      update(state => ({ ...state, isMenuOpen: !state.isMenuOpen }));
    },
    closeMenu: () => {
      update(state => ({ ...state, isMenuOpen: false }));
    },
    /**
     * @param {number} scrollY
     */
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
