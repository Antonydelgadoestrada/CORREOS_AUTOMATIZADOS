import React, { useState } from 'react';
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
  createTheme,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailForm from './components/EmailForm';
import Calendar from './components/Calendar';
import HistorialCorreos from './components/HistorialCorreos';
import AdminOpciones from './components/AdminOpciones';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <AppBar position="static">
          <Toolbar>
            <MailIcon sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              🌾 Gestor de Correos - Agroexportadora
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="navigation">
              <Tab icon={<MailIcon />} iconPosition="start" label="Enviar Correo" />
              <Tab icon={<EventIcon />} iconPosition="start" label="Calendario" />
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
            <HistorialCorreos />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <AdminOpciones />
          </TabPanel>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
