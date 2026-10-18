import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  CssBaseline,
  ThemeProvider,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import EmailForm from './components/EmailForm';
import Calendar from './components/Calendar';
import HistorialCorreos from './components/HistorialCorreos';
import AdminOpciones from './components/AdminOpciones';
import ReporteInspecciones from './components/ReporteInspecciones';
import { getAppTheme } from './theme';
import './App.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  // Inicializar modo oscuro desde localStorage (por defecto 'dark' para una experiencia moderna)
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  // Sincronizar el atributo data-theme en el elemento raíz para CSS (ej. FullCalendar)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" data-theme={mode}>
        <AppBar position="sticky" elevation={mode === 'dark' ? 0 : 2}>
          <Toolbar>
            <MailIcon sx={{ mr: 1.5, fontSize: 28, color: mode === 'dark' ? '#38bdf8' : 'inherit' }} />
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Gestor de Correos
              </Typography>
              <Chip
                label="Agroexportadora"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  backgroundColor: mode === 'dark' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.2)',
                  color: mode === 'dark' ? '#38bdf8' : '#ffffff',
                  border: mode === 'dark' ? '1px solid rgba(56, 189, 248, 0.3)' : 'none',
                }}
              />
            </Box>

            {/* Botón de alternar Modo Oscuro / Claro */}
            <Tooltip title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.15)',
                  border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.25)',
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.25)',
                  },
                }}
                aria-label="Alternar modo oscuro"
              >
                {mode === 'dark' ? (
                  <LightModeIcon sx={{ color: '#facc15', fontSize: 22 }} />
                ) : (
                  <DarkModeIcon sx={{ color: '#ffffff', fontSize: 22 }} />
                )}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="Navegación del sistema"
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab icon={<MailIcon />} iconPosition="start" label="Enviar Correo" />
              <Tab icon={<EventIcon />} iconPosition="start" label="Calendario" />
              <Tab icon={<AssessmentIcon />} iconPosition="start" label="Reporte" />
              <Tab icon={<HistoryIcon />} iconPosition="start" label="Historial" />
              <Tab icon={<SettingsIcon />} iconPosition="start" label="Opciones" />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <EmailForm />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <Calendar />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <ReporteInspecciones />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <HistorialCorreos />
          </TabPanel>
          <TabPanel value={currentTab} index={4}>
            <AdminOpciones />
          </TabPanel>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
