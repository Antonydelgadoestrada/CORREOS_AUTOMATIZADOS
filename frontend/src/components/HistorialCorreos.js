import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Typography,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import { apiService } from '../utils/apiService';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { descargarHTMLComoImagen } from '../utils/htmlToImage';

// Detectar si una cadena contiene HTML (por ejemplo una tabla)
const isHTMLString = (str) => {
  if (!str || typeof str !== 'string') return false;
  return /<\s*(table|tr|td|th|tbody|thead|tfoot)[^>]*>/i.test(str);
};

const HistorialCorreos = () => {
  const [correos, setCorreos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [selectedCorreo, setSelectedCorreo] = useState(null);
  const [descargando, setDescargando] = useState(false);

  // Filtros
  const [filtroProductor, setFiltroProductor] = useState('');
  const [filtroDestinatario, setFiltroDestinatario] = useState('');
  const [filtroAsunto, setFiltroAsunto] = useState('');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');

  // Cargar correos al montar
  useEffect(() => {
    cargarCorreos();
  }, []);

  const cargarCorreos = async () => {
    try {
      setLoading(true);
      const data = await apiService.obtenerCorreos();
      setCorreos(data || []);
    } catch (error) {
      console.error('Error:', error);
      setMessageType('error');
      setMessage('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (correo) => {
    setSelectedCorreo(correo);
  };

  const handleCloseDetalle = () => {
    setSelectedCorreo(null);
  };

  const handleDescargarComoImagen = async () => {
    if (!selectedCorreo || !selectedCorreo.contenido_html) {
      setMessageType('warning');
      setMessage('⚠️ No hay contenido HTML disponible para descargar');
      return;
    }

    try {
      setDescargando(true);
      const nombreArchivo = `Plantilla_${selectedCorreo.asunto.replace(/\s+/g, '_')}_${selectedCorreo.id}`;
      await descargarHTMLComoImagen(selectedCorreo.contenido_html, nombreArchivo);
      
      setMessageType('success');
      setMessage('✅ Imagen descargada exitosamente');
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error descargando imagen:', error);
      setMessageType('error');
      setMessage('❌ Error al descargar la imagen');
    } finally {
      setDescargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filtrarCorreos = () => {
    if (!correos || !Array.isArray(correos)) {
      return [];
    }
    
    let filtered = correos;

    // Filtro por productor
    if (filtroProductor) {
      filtered = filtered.filter(c => 
        c.productor.toLowerCase().includes(filtroProductor.toLowerCase())
      );
    }

    // Filtro por destinatario
    if (filtroDestinatario) {
      filtered = filtered.filter(c =>
        c.destinatario.toLowerCase().includes(filtroDestinatario.toLowerCase())
      );
    }

    // Filtro por asunto (tipo de plantilla)
    if (filtroAsunto) {
      filtered = filtered.filter(c =>
        c.asunto.toLowerCase().includes(filtroAsunto.toLowerCase())
      );
    }

    // Filtro por fecha inicio
    if (filtroFechaInicio) {
      const fechaInicio = new Date(filtroFechaInicio);
      filtered = filtered.filter(c => {
        const fechaCorreo = new Date(c.fecha_envio || c.created_at);
        return fechaCorreo >= fechaInicio;
      });
    }

    // Filtro por fecha fin
    if (filtroFechaFin) {
      const fechaFin = new Date(filtroFechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      filtered = filtered.filter(c => {
        const fechaCorreo = new Date(c.fecha_envio || c.created_at);
        return fechaCorreo <= fechaFin;
      });
    }

    return filtered;
  };

  const limpiarFiltros = () => {
    setFiltroProductor('');
    setFiltroDestinatario('');
    setFiltroAsunto('');
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Aplicar filtros
  const correosFiltrados = filtrarCorreos();

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tabla de correos - ancho completo para máxima legibilidad */}
      <Card sx={{ width: '100%' }}>
        <CardHeader title="📧 Historial de Correos Enviados" />
        <CardContent>
          {message && <Alert severity={messageType} sx={{ mb: 2 }}>{message}</Alert>}

          {/* Filtros */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>🔍 Filtros</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Productor"
                  size="small"
                  fullWidth
                  value={filtroProductor}
                  onChange={(e) => setFiltroProductor(e.target.value)}
                  placeholder="Buscar productor..."
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Destinatario"
                  size="small"
                  fullWidth
                  value={filtroDestinatario}
                  onChange={(e) => setFiltroDestinatario(e.target.value)}
                  placeholder="Buscar destinatario..."
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Plantilla</InputLabel>
                  <Select
                    value={filtroAsunto}
                    label="Tipo de Plantilla"
                    onChange={(e) => setFiltroAsunto(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Planificación Interna">Planificación Interna</MenuItem>
                    <MenuItem value="Planificación Externa">Planificación Externa</MenuItem>
                    <MenuItem value="Orden de Trabajo">Orden de Trabajo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<ClearIcon />}
                  onClick={limpiarFiltros}
                >
                  Limpiar
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Desde"
                  type="date"
                  size="small"
                  fullWidth
                  value={filtroFechaInicio}
                  onChange={(e) => setFiltroFechaInicio(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Hasta"
                  type="date"
                  size="small"
                  fullWidth
                  value={filtroFechaFin}
                  onChange={(e) => setFiltroFechaFin(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Total: {correosFiltrados.length} correo(s) encontrado(s)
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {correosFiltrados.length === 0 ? (
            <Alert severity="info">
              {correos.length === 0 ? 'No hay correos en el historial' : 'No hay correos que coincidan con los filtros'}
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc' }}>
                    <TableCell><strong>Productor</strong></TableCell>
                    <TableCell><strong>Destinatario</strong></TableCell>
                    <TableCell><strong>Asunto</strong></TableCell>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {correosFiltrados.map((correo) => (
                    <TableRow key={correo.id} hover>
                      <TableCell>{correo.productor}</TableCell>
                      <TableCell>{correo.destinatario}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {correo.asunto}
                      </TableCell>
                      <TableCell>{formatearFecha(correo.fecha_envio || correo.created_at)}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleVerDetalle(correo)}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Modal Dialog de detalles del correo (abierto al hacer clic en Ver) */}
      <Dialog
        open={Boolean(selectedCorreo)}
        onClose={handleCloseDetalle}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 0.5,
          },
        }}
      >
        {selectedCorreo && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 1.5,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  📋 Detalles del Correo
                </Typography>
                <Chip
                  label={`#${selectedCorreo.id}`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label={selectedCorreo.productor}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <IconButton onClick={handleCloseDetalle} size="small" aria-label="Cerrar">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2.5 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Destinatario
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                    {selectedCorreo.destinatario}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Fecha de Envío
                  </Typography>
                  <Typography variant="body1">
                    {formatearFecha(selectedCorreo.fecha_envio || selectedCorreo.created_at)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Asunto
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {selectedCorreo.asunto}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Contenido del Correo
              </Typography>

              {/* Contenedor del contenido del correo - estilo hoja con formato original */}
              <Paper
                elevation={2}
                sx={{
                  p: 2.5,
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  borderRadius: 2,
                  maxHeight: 460,
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  '& table': {
                    width: '100%',
                    borderCollapse: 'collapse',
                  },
                  '& td, & th': {
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    color: '#1e293b',
                  },
                  '& tr:nth-child(even)': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                {selectedCorreo.imagen_base64 && selectedCorreo.modo_envio === 'imagen' ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <img
                      src={selectedCorreo.imagen_base64}
                      alt={selectedCorreo.asunto}
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }}
                    />
                  </Box>
                ) : selectedCorreo.contenido_html || isHTMLString(selectedCorreo.contenido) ? (
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: selectedCorreo.contenido_html || selectedCorreo.contenido,
                    }}
                  />
                ) : (
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      m: 0,
                    }}
                  >
                    {selectedCorreo.contenido}
                  </Typography>
                )}
              </Paper>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1, borderTop: (theme) => `1px solid ${theme.palette.divider}`, gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<GetAppIcon />}
                onClick={handleDescargarComoImagen}
                disabled={descargando || !selectedCorreo.contenido_html}
              >
                {descargando ? <CircularProgress size="1.25rem" color="inherit" /> : 'Descargar como Imagen'}
              </Button>
              <Button onClick={handleCloseDetalle} variant="outlined" color="inherit">
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default HistorialCorreos;
