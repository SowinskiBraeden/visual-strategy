export function home(): string {
  return `
<main>
  <p class="badge">STRATEGY WORKSTATION / SIM ONLINE</p>
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
      <p>Work through race strategy step by step using live, interactive data views.</p>
      <span class="btn primary">Start learning &rarr;</span>
    </a>

    <a class="card" href="#/playground">
      <div class="card-head">
        <svg class="icon" aria-hidden="true"><use href="/icons.svg#sliders" /></svg>
      </div>
      <h2>Playground</h2>
      <p>Configure a strategy, adjust its inputs, and inspect the simulation output.</p>
      <span class="btn">Open playground &rarr;</span>
    </a>
  </div>
</main>`;
}
