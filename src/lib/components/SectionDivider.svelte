<div class="divider" aria-hidden="true"></div>

<style>
  .divider {
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      color-mix(in oklab, var(--brand) 55%, transparent) 40%,
      color-mix(in oklab, var(--brand-2) 55%, transparent) 60%,
      transparent);
    opacity: .7;
    position: relative;
    overflow: hidden;
    margin: 1.25rem 0;
  }
  .divider::after {
    content: '';
    position: absolute;
    top: -1px;
    left: -20%;
    width: 20%;
    height: 3px;
    background: color-mix(in oklab, white 60%, var(--brand) 40%);
    filter: blur(2px);
    animation: sweep 2.6s linear infinite;
  }
  @keyframes sweep {
    to {
      transform: translateX(600%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .divider::after {
      animation: none;
    }
  }
</style>
