import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, Box, Grid, Typography, Chip, Dialog, DialogContent, DialogTitle, Button, Alert, CircularProgress, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { apiService } from '../utils/apiService';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReprogramarDialog, setOpenReprogramarDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevaFechaInicio, setNuevaFechaInicio] = useState('');
  const [nuevaFechaFin, setNuevaFechaFin] = useState('');

  // Cargar eventos de la BD
  useEffect(() => {
    cargarEventos();
  }, []);

  // Función para calcular el estado de la inspección
  const calcularEstado = (evento) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaInicio = new Date(evento.fecha_inicio);
    const fechaFin = new Date(evento.fecha_fin);
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(0, 0, 0, 0);

    // Si fue reprogramada previamente
    if (evento.estado === 'reprogramada') {
      return { estado: 'Reprogramada', color: '#9e9e9e', icon: '🔄' };
    }

    // Si está dentro del rango de fechas (hoy es igual o después al inicio y antes o igual al fin)
    if (hoy >= fechaInicio && hoy <= fechaFin) {
      return { estado: 'En proceso', color: '#2196f3', icon: '⏳' };
    }

    // Si ya pasó la fecha fin
    if (hoy > fechaFin) {
      return { estado: 'Finalizada', color: '#4caf50', icon: '✅' };
    }

    // Si es futura
    return { estado: 'Programada', color: '#ff9800', icon: '📋' };
  };

  const cargarEventos = async () => {
    try {
      setLoading(true);
      const data = await apiService.obtenerEventos();
      
      // Convertir eventos de la BD al formato de FullCalendar
      const eventosFormateados = data.map(evento => {
        const estadoInfo = calcularEstado(evento);
        return {
          id: evento.id.toString(),
          title: `${estadoInfo.icon} ${evento.operador} - ${evento.auditor}`,
          start: evento.fecha_inicio,
          end: evento.fecha_fin,
          backgroundColor: estadoInfo.color,
          borderColor: estadoInfo.color,
          extendedProps: {
            id: evento.id,
            operador: evento.operador,
            numero_operador: evento.numero_operador,
            dias_inspeccion: evento.dias_inspeccion,
            auditor: evento.auditor,
            norma: evento.norma,
            alcance: evento.alcance,
            tipo: evento.tipo,
            modalidad: evento.modalidad,
            cultivo_producto: evento.cultivo_producto,
            lugar: evento.lugar,
            persona_contacto: evento.persona_contacto,
            estadoDb: evento.estado,
            estadoCalculado: estadoInfo.estado,
          },
        };
      });
        
      setEvents(eventosFormateados);
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleOpenReprogramarDialog = () => {
    if (selectedEvent) {
      const fechaInicio = selectedEvent.start.toISOString().split('T')[0];
      // Si el evento no tiene end (evento de 1 día), usar la misma fecha de inicio
      const fechaFin = selectedEvent.end 
        ? selectedEvent.end.toISOString().split('T')[0]
        : fechaInicio;
      
      setNuevaFechaInicio(fechaInicio);
      setNuevaFechaFin(fechaFin);
      setOpenReprogramarDialog(true);
    }
  };

  const handleCloseReprogramarDialog = () => {
    setOpenReprogramarDialog(false);
    setNuevaFechaInicio('');
    setNuevaFechaFin('');
  };

  const handleConfirmarReprogramacion = async () => {
    try {
      if (!nuevaFechaInicio || !nuevaFechaFin) {
        alert('Por favor completa ambas fechas');
        return;
      }

      const response = await apiService.reprogramarInspeccion(
        selectedEvent.extendedProps.id,
        nuevaFechaInicio,
        nuevaFechaFin
      );

      if (response.mensaje) {
        alert('Inspección reprogramada exitosamente');
        handleCloseReprogramarDialog();
        handleCloseDialog();
        cargarEventos();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al reprogramar la inspección');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'Programada':
        return 'warning';
      case 'En proceso':
        return 'info';
      case 'Finalizada':
        return 'success';
      case 'Reprogramada':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader title="📅 Calendario de Inspecciones" />
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            locale="es"
          />
        </CardContent>
      </Card>

      {/* Dialog con detalles del evento */}
      {selectedEvent && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📋 Detalles de Inspección</span>
            <Button onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </Button>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Estado
                  </Typography>
                  <Chip 
                    label={selectedEvent.extendedProps.estadoCalculado} 
                    color={obtenerColorEstado(selectedEvent.extendedProps.estadoCalculado)}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Operador
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedEvent.extendedProps.operador}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Número de Operador
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.extendedProps.numero_operador}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Fecha Inicio
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatearFecha(selectedEvent.start)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Fecha Fin
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatearFecha(selectedEvent.end)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Días de Inspección
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.extendedProps.dias_inspeccion}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Auditor
                  </Typography>
                  <Chip label={selectedEvent.extendedProps.auditor} color="primary" variant="outlined" />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Norma
                  </Typography>
                  <Chip label={selectedEvent.extendedProps.norma} size="small" />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Alcance
                  </Typography>
                  <Chip label={selectedEvent.extendedProps.alcance} size="small" />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Tipo
                  </Typography>
                  <Chip label={selectedEvent.extendedProps.tipo} size="small" />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Modalidad
                  </Typography>
                  <Chip label={selectedEvent.extendedProps.modalidad} size="small" />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Cultivo/Producto
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.extendedProps.cultivo_producto}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Lugar
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.extendedProps.lugar}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Persona de Contacto
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.extendedProps.persona_contacto || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    onClick={handleOpenReprogramarDialog}
                  >
                    🔄 Reprogramar Inspección
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para reprogramar */}
      <Dialog open={openReprogramarDialog} onClose={handleCloseReprogramarDialog} maxWidth="sm" fullWidth>
        <DialogTitle>🔄 Reprogramar Inspección</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
              Datos del Inspector
            </Typography>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 3 }}>
              <Typography variant="body2"><strong>Operador:</strong> {selectedEvent?.extendedProps.operador}</Typography>
              <Typography variant="body2"><strong>Auditor:</strong> {selectedEvent?.extendedProps.auditor}</Typography>
              <Typography variant="body2"><strong>Norma:</strong> {selectedEvent?.extendedProps.norma}</Typography>
            </Box>

            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Nueva Fecha de Inicio
            </Typography>
            <TextField
              type="date"
              value={nuevaFechaInicio}
              onChange={(e) => setNuevaFechaInicio(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Nueva Fecha de Fin
            </Typography>
            <TextField
              type="date"
              value={nuevaFechaFin}
              onChange={(e) => setNuevaFechaFin(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleCloseReprogramarDialog}>
            ❌ Cancelar
          </Button>
          <Button variant="contained" color="secondary" onClick={handleConfirmarReprogramacion}>
            ✅ Guardar Reprogramación
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default Calendar;
