import init from 'visual-strategy';

let loading: ReturnType<typeof init> | null = null;

// Instantiates the Rust/WebAssembly module once, however many callers ask.
export function loadSimulation(): ReturnType<typeof init> {
  loading ??= init();
  return loading;
}
