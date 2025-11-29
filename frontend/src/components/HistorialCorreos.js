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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { apiService } from '../utils/apiService';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';

const HistorialCorreos = () => {
  const [correos, setCorreos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [selectedCorreo, setSelectedCorreo] = useState(null);

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
    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* Tabla de correos */}
      <Card sx={{ flex: 1 }}>
        <CardHeader title="📧 Historial de Correos Enviados" />
        <CardContent>
          {message && <Alert severity={messageType} sx={{ mb: 2 }}>{message}</Alert>}

          {/* Filtros */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
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
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
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

      {/* Panel de detalles */}
      {selectedCorreo && (
        <Card sx={{ width: 400, maxHeight: '80vh', overflowY: 'auto', position: 'sticky', top: 20 }}>
          <CardHeader
            title="📋 Detalles del Correo"
            action={
              <Button
                size="small"
                onClick={handleCloseDetalle}
                startIcon={<CloseIcon />}
              >
                Cerrar
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  ID del Correo
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  #{selectedCorreo.id}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Productor
                </Typography>
                <Chip label={selectedCorreo.productor} color="primary" variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email Destinatario
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    wordBreak: 'break-all',
                    backgroundColor: '#f5f5f5',
                    padding: 1,
                    borderRadius: 1
                  }}
                >
                  {selectedCorreo.destinatario}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Asunto
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {selectedCorreo.asunto}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Fecha de Envío
                </Typography>
                <Typography variant="body2">
                  {formatearFecha(selectedCorreo.fecha_envio || selectedCorreo.created_at)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  Contenido del Correo
                </Typography>
                {selectedCorreo.contenido_html ? (
                  <Box
                    sx={{
                      backgroundColor: '#f9f9f9',
                      padding: 1.5,
                      borderRadius: 1,
                      maxHeight: 300,
                      overflowY: 'auto',
                      border: '1px solid #e0e0e0',
                      '& table': {
                        width: '100%',
                        borderCollapse: 'collapse',
                      },
                      '& td': {
                        padding: '8px',
                        border: '1px solid #ddd',
                      },
                      '& tr:nth-child(even)': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedCorreo.contenido_html }}
                  />
                ) : (
                  <Box
                    sx={{
                      backgroundColor: '#f9f9f9',
                      padding: 1.5,
                      borderRadius: 1,
                      maxHeight: 300,
                      overflowY: 'auto',
                      fontSize: '0.85rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      border: '1px solid #e0e0e0',
                      fontFamily: 'monospace',
                    }}
                  >
                    {selectedCorreo.contenido}
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default HistorialCorreos;
