import { createRoot } from 'react-dom/client';
import './styles/global.scss';
import Root from './components/Root';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(<Root />);
}
