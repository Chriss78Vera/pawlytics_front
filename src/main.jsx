import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App.jsx';
import { NotificationsProvider } from './app/context/NotificationsContext.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </BrowserRouter>
);
