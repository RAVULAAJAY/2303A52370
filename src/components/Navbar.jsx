import MenuIcon from '@mui/icons-material/Menu';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { AppBar, Badge, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material';

export function Navbar({ onMenuClick, unreadCount, onRefresh }) {
  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ gap: 2, minHeight: 80 }}>
        <IconButton
          color="inherit"
          aria-label="open navigation"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            Campus Notifications
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.82 }}>
            Centralized alerts, read states, and priority routing
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Badge badgeContent={unreadCount} color="warning" max={999}>
            <NotificationsActiveOutlinedIcon />
          </Badge>
          <IconButton color="inherit" aria-label="refresh notifications" onClick={onRefresh}>
            <RefreshOutlinedIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}