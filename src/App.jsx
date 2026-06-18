import { useEffect } from 'react';
import { Log } from './services/logger';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  useEffect(() => {
    void Log('frontend', 'info', 'app', 'Application started');
  }, []);

  return <AppRoutes />;
}