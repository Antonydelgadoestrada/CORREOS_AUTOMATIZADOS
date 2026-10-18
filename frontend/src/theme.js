import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#1976d2',
              light: '#42a5f5',
              dark: '#1565c0',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#0284c7',
            },
            background: {
              default: '#f8fafc',
              paper: '#ffffff',
            },
            text: {
              primary: '#0f172a',
              secondary: '#475569',
            },
            divider: 'rgba(0, 0, 0, 0.08)',
            action: {
              hover: 'rgba(0, 0, 0, 0.04)',
              selected: 'rgba(25, 118, 210, 0.08)',
            },
          }
        : {
            primary: {
              main: '#38bdf8',
              light: '#7dd3fc',
              dark: '#0284c7',
              contrastText: '#0b1120',
            },
            secondary: {
              main: '#818cf8',
            },
            background: {
              default: '#0b1120',
              paper: '#131d33',
            },
            text: {
              primary: '#f8fafc',
              secondary: '#94a3b8',
            },
            divider: 'rgba(255, 255, 255, 0.08)',
            action: {
              hover: 'rgba(255, 255, 255, 0.05)',
              selected: 'rgba(56, 189, 248, 0.12)',
            },
          }),
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'dark' ? '#0b1120' : '#f8fafc',
            color: mode === 'dark' ? '#f8fafc' : '#0f172a',
            transition: 'background-color 0.25s ease, color 0.25s ease',
            scrollbarColor: mode === 'dark' ? '#334155 #0b1120' : '#cbd5e1 #f4f6f9',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: mode === 'dark' ? '#334155' : '#cbd5e1',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 12,
            border:
              mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow:
              mode === 'dark'
                ? '0 4px 20px 0 rgba(0, 0, 0, 0.35)'
                : '0 2px 12px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
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
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'dark' ? '#0f172a' : '#1565c0',
            borderBottom:
              mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
            boxShadow:
              mode === 'dark'
                ? '0 4px 20px 0 rgba(0, 0, 0, 0.4)'
                : '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            minHeight: 48,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor:
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)',
          },
          head: {
            backgroundColor:
              mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
            fontWeight: 700,
          },
        },
      },
    },
  });
