<script>
  import { onMount } from 'svelte';
  
  let visible = true;
  
  onMount(() => {
    // Hide loading spinner after page loads
    const timer = setTimeout(() => {
      visible = false;
    }, 1000);
    
    return () => clearTimeout(timer);
  });
</script>

{#if visible}
  <div class="loading-overlay">
    <div class="loading-spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <div class="loading-text">AlgoRhythmics</div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  
  .loading-spinner {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: var(--space-6);
  }
  
  .spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top: 3px solid var(--voyage-blue);
    border-radius: 50%;
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  
  .spinner-ring:nth-child(1) {
    animation-delay: -0.45s;
    border-top-color: var(--voyage-blue);
  }
  
  .spinner-ring:nth-child(2) {
    animation-delay: -0.3s;
    border-top-color: var(--aurora-purple);
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
  }
  
  .spinner-ring:nth-child(3) {
    animation-delay: -0.15s;
    border-top-color: var(--signal-yellow);
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
  }
  
  .spinner-ring:nth-child(4) {
    border-top-color: var(--cherry-red);
    width: 40%;
    height: 40%;
    top: 30%;
    left: 30%;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .loading-text {
    font-size: var(--text-headline);
    font-weight: var(--weight-bold);
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }
</style>
