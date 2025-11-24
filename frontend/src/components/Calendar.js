import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, Box, Grid, Typography, Chip, Dialog, DialogContent, DialogTitle, Button, Alert, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { apiService } from '../utils/apiService';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar eventos de la BD
  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      setLoading(true);
      const data = await apiService.obtenerEventos();
      
      // Convertir eventos de la BD al formato de FullCalendar
      const eventosFormateados = data.map(evento => ({
          id: evento.id.toString(),
          title: `${evento.operador} - ${evento.auditor}`,
          start: evento.fecha_inicio,
          end: evento.fecha_fin,
          backgroundColor: evento.estado === 'completada' ? '#4caf50' : '#1976d2',
          borderColor: evento.estado === 'completada' ? '#2e7d32' : '#1565c0',
          extendedProps: {
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
            estado: evento.estado,
          },
        }));
        
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

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
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
                  <Typography variant="subtitle2" color="textSecondary">
                    Estado
                  </Typography>
                  <Chip 
                    label={selectedEvent.extendedProps.estado} 
                    color={selectedEvent.extendedProps.estado === 'completada' ? 'success' : 'primary'}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Calendar;
