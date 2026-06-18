import { alpha, createTheme } from '@mui/material/styles';

export const campusTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1d4ed8',
    },
    background: {
      default: '#eef4f2',
      paper: '#ffffff',
    },
    success: {
      main: '#15803d',
    },
    warning: {
      main: '#d97706',
    },
    error: {
      main: '#b91c1c',
    },
    info: {
      main: '#0ea5e9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontWeight: 800, letterSpacing: '-0.03em' },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: [
            'radial-gradient(circle at top left, rgba(15, 118, 110, 0.14), transparent 28%)',
            'radial-gradient(circle at right top, rgba(29, 78, 216, 0.1), transparent 24%)',
            'linear-gradient(180deg, #f7fbfa 0%, #eef4f2 100%)',
          ].join(','),
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #0f766e 100%)',
          boxShadow: '0 14px 44px rgba(15, 23, 42, 0.24)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha('#0f172a', 0.08)}`,
          boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
          backdropFilter: 'blur(14px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
          color: '#ffffff',
          borderRight: 'none',
        },
      },
    },
  },
});