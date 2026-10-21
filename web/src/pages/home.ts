export function home(): string {
  return `
<main>
  <p class="badge">Interactive race strategy</p>
  <h1>Every second counts.</h1>
  <p class="lede">
    Understand the strategy behind motorsport. Explore tyre performance,
    pit stops, and race decisions through interactive simulations.
  </p>

  <div class="cards">
    <a class="card" href="#/learn">
      <div class="card-head">
        <svg class="icon" aria-hidden="true"><use href="/icons.svg#cap" /></svg>
        <span class="tag">Start here</span>
      </div>
      <h2>Learn</h2>
      <p>Discover race strategy step by step with interactive examples.</p>
      <span class="btn primary">Start learning &rarr;</span>
    </a>

    <a class="card" href="#/playground">
      <div class="card-head">
        <svg class="icon" aria-hidden="true"><use href="/icons.svg#sliders" /></svg>
      </div>
      <h2>Playground</h2>
      <p>Build your own strategies and experiment with the simulation.</p>
      <span class="btn">Open playground &rarr;</span>
    </a>
  </div>
</main>`;
}
