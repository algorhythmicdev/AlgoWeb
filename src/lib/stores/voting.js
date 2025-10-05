import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * @typedef {Record<string, boolean>} Votes
 */

const createVotingStore = () => {
  // Load votes from localStorage
  const getInitialVotes = () => {
    if (!browser) return {};
    
    const stored = localStorage.getItem('featureVotes');
    return stored ? JSON.parse(stored) : {};
  };
  
  const { subscribe, set, update } = writable(getInitialVotes());
  
  const saveToLocalStorage = (/** @type {Votes} */ votes) => {
    if (browser) {
      localStorage.setItem('featureVotes', JSON.stringify(votes));
    }
  };
  
  return {
    subscribe,
    vote: (/** @type {string} */ featureId) => {
      update((/** @type {Votes} */ votes) => {
        const newVotes = { ...votes };
        
        // Toggle vote
        if (newVotes[featureId]) {
          delete newVotes[featureId];
        } else {
          newVotes[featureId] = true;
        }
        
        saveToLocalStorage(newVotes);
        return newVotes;
      });
    },
    hasVoted: (/** @type {string} */ featureId, /** @type {Votes} */ votes) => {
      return !!votes[featureId];
    },
    clear: () => {
      set({});
      if (browser) {
        localStorage.removeItem('featureVotes');
      }
    }
  };
};

export const voting = createVotingStore();
