import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Log } from '../services/logger';

export function NavigationLogger() {
  const location = useLocation();

  useEffect(() => {
    void Log('frontend', 'info', 'navigation', `Navigated to ${location.pathname}`);
  }, [location.pathname, location.search]);

  return null;
}