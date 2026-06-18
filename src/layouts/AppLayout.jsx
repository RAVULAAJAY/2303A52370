import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Alert, Box, Snackbar, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Navbar } from '../components/Navbar';
import { NavigationLogger } from '../components/NavigationLogger';
import { Sidebar, drawerWidth } from '../components/Sidebar';
import { useNotifications } from '../context/NotificationContext';

export function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { unreadCount, snackbar, closeSnackbar, refreshNotifications } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = () => {
    setMobileOpen(false);
  };

  const contentMargin = useMemo(
    () => ({
      md: `${drawerWidth}px`,
    }),
    [],
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        unreadCount={unreadCount}
        onRefresh={() => void refreshNotifications()}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        unreadCount={unreadCount}
        onNavigate={handleNavigate}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4 },
          py: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: isDesktop ? contentMargin : 0,
        }}
      >
        <Toolbar sx={{ minHeight: '80px !important' }} />
        <NavigationLogger />
        <Outlet />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}