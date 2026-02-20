import { BrowserRouter } from 'react-router-dom';

import { AppProviders } from '@/app/providers/AppProviders';
import { AppRouter } from '@/app/router';

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  );
}
