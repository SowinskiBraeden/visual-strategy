import './style.css';
import { header } from './components/header.ts';
import { footer } from './components/footer.ts';
import { home } from './pages/home.ts';
import { learn } from './pages/learn.ts';
import { playground } from './pages/playground.ts';
import { loadSimulation } from './simulation/wasm.ts';

const routes: Record<string, () => string> = {
  '/': home,
  '/learn': learn,
  '/playground': playground,
};

const app = document.querySelector<HTMLDivElement>('#app')!;

function render(): void {
  const path = location.hash.slice(1) || '/';
  const page = routes[path] ?? home;
  app.innerHTML = [header(path), page(), footer()].join('\n');
}

addEventListener('hashchange', render);
render();

await loadSimulation();
