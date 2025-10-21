/// <reference types="@sveltejs/kit" />

import type { DOMPurifyI } from 'dompurify';

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

declare module 'isomorphic-dompurify' {
  const DOMPurify: DOMPurifyI;
  export default DOMPurify;
}

export {};
