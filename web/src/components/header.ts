const links = [
  { path: '/learn', label: 'Learn' },
  { path: '/playground', label: 'Playground' },
];

export function header(path: string): string {
  const nav = links
    .map(
      (l) =>
        `<a href="#${l.path}"${path === l.path ? ' aria-current="page"' : ''}>${l.label}</a>`,
    )
    .join('\n      ');

  return `
<header>
  <a class="brand" href="#/">
    <span class="mark">
      <svg class="icon" aria-hidden="true"><use href="/icons.svg#flag" /></svg>
    </span>
    Stint.
  </a>
  <nav>
      ${nav}
  </nav>
</header>`;
}
