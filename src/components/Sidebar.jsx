import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import {
  Badge,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

const drawerWidth = 288;

const navItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: 'All Notifications',
    path: '/notifications',
    icon: <NotificationsOutlinedIcon />,
  },
  {
    label: 'Priority Notifications',
    path: '/priority',
    icon: <PriorityHighOutlinedIcon />,
  },
];

function SidebarContent({ unreadCount, onNavigate }) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', px: 2, py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>
          Campus Pulse
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Notifications Hub
        </Typography>
      </Box>

      <List sx={{ gap: 1, display: 'grid' }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={onNavigate}
              sx={{
                borderRadius: 3,
                color: 'inherit',
                backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.09)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 42, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {item.path === '/notifications' ? (
                <Badge color="warning" badgeContent={unreadCount} max={999} />
              ) : null}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.12)' }} />

      <Box sx={{ mt: 'auto', p: 2, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Read status sync
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', mt: 0.5 }}>
          Local storage persistence keeps read and unread states across reloads.
        </Typography>
      </Box>
    </Box>
  );
}

export function Sidebar({ mobileOpen, onClose, unreadCount, onNavigate }) {
  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent unreadCount={unreadCount} onNavigate={onNavigate} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        open
      >
        <SidebarContent unreadCount={unreadCount} onNavigate={onNavigate} />
      </Drawer>
    </Box>
  );
}

export { drawerWidth };