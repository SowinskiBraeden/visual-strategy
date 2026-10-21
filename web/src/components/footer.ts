const REPO = 'https://git.sowinski.dev/SowinskiBraeden/visual-strategy';

export function footer(): string {
  return `
<footer>
  <svg class="icon" aria-hidden="true"><use href="/icons.svg#chip" /></svg>
  <span>Rust/WebAssembly demo</span>
  <span class="dot">&middot;</span>
  <a href="${REPO}" target="_blank" rel="noreferrer">
    <svg class="icon" aria-hidden="true"><use href="/icons.svg#gitea" /></svg>
    Source
  </a>
</footer>`;
}
