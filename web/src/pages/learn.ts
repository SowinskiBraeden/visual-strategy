import { stages, stageIndex } from '../stages/index.ts';

export function learn(param?: string): string {
  const index = stageIndex(param);
  const stage = stages[index]!;

  const dots = stages
    .map(
      (s, i) =>
        `<a class="dot${i === index ? ' on' : ''}" href="#/learn/${i + 1}" aria-label="Stage ${i + 1}: ${s.title}"></a>`,
    )
    .join('');

  const next =
    index < stages.length - 1
      ? `<a class="btn primary" href="#/learn/${index + 2}">Next &rarr;</a>`
      : `<a class="btn primary" href="#/playground">Open playground &rarr;</a>`;

  return `
<main class="page learn">
  <p class="eyebrow">Stage ${index + 1} of ${stages.length}</p>
  <h1>${stage.title}</h1>
  <p class="lede">${stage.lede}</p>

  <div class="stage-body">${stage.render()}</div>

  <nav class="stage-nav">
    <a class="btn" href="${index === 0 ? '#/' : `#/learn/${index}`}">&larr; Back</a>
    <span class="dots">${dots}</span>
    ${next}
  </nav>
</main>`;
}

export function mountLearn(root: HTMLElement, param?: string): void {
  const body = root.querySelector<HTMLElement>('.stage-body');
  if (body) stages[stageIndex(param)]?.mount?.(body);
}
