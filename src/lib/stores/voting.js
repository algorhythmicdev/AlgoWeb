import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const createVotingStore = () => {
  // Load votes from localStorage
  const getInitialVotes = () => {
    if (!browser) return {};
    
    const stored = localStorage.getItem('featureVotes');
    return stored ? JSON.parse(stored) : {};
  };
  
  const { subscribe, set, update } = writable(getInitialVotes());
  
  const saveToLocalStorage = (votes) => {
    if (browser) {
      localStorage.setItem('featureVotes', JSON.stringify(votes));
    }
  };
  
  return {
    subscribe,
    vote: (featureId) => {
      update(votes => {
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
    hasVoted: (featureId, votes) => {
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
