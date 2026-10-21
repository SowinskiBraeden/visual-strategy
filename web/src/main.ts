import './style.css';
import { header } from './components/header.ts';
import { footer } from './components/footer.ts';
import { home } from './pages/home.ts';
import { learn, mountLearn } from './pages/learn.ts';
import { playground } from './pages/playground.ts';
import { loadSimulation } from './simulation/wasm.ts';

interface Route {
  view(param?: string): string;
  mount?(root: HTMLElement, param?: string): void;
}

const routes: Record<string, Route> = {
  '': { view: home },
  learn: { view: learn, mount: mountLearn },
  playground: { view: playground },
};

const app = document.querySelector<HTMLDivElement>('#app')!;

function render(): void {
  const [section = '', param] = location.hash.replace(/^#\/?/, '').split('/');
  const route = routes[section] ?? routes['']!;

  app.innerHTML = [header(`/${section}`), route.view(param), footer()].join('\n');
  route.mount?.(app, param);
}

addEventListener('hashchange', render);
render();

await loadSimulation();
