import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { apiService } from '../utils/apiService';

const EmailForm = () => {
  const [plantillas, setPlantillas] = useState([]);
  const [opciones, setOpciones] = useState({});
  const [selectedPlantilla, setSelectedPlantilla] = useState('');
  
  const [formData, setFormData] = useState({
    destinatario: '',
    operador: '',
    numero_operador: '',
    fecha_inicio: '',
    dias_inspeccion: 0,
    auditor: '',
    norma: '',
    alcance: '',
    tipo: '',
    modalidad: '',
    cultivo_producto: '',
    lugar: '',
    persona_contacto: '',
    analisis: '',
    viaticos: '',
    tema_formacion: '',
    fecha_formacion: '',
    horario_formacion: '',
    responsable_formacion: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  // Cargar plantillas y opciones al montar
  useEffect(() => {
    cargarPlantillasYOpciones();
  }, []);

  const cargarPlantillasYOpciones = async () => {
    try {
      // Simular carga de plantillas
      setPlantillas([
        { id: 1, nombre: 'Planificación Interna', tipo: 'interna' },
        { id: 2, nombre: 'Planificación Externa', tipo: 'externa' },
        { id: 3, nombre: 'Orden de Trabajo', tipo: 'orden_trabajo' },
      ]);

      // Cargar opciones del backend
      const data = await apiService.obtenerOpciones();
      setOpciones(data);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
      // Opciones por defecto
      setOpciones({
        Norma: ['NOP', 'RTPO', '848PT', 'JAS', 'BIOSUISSE', 'LPO', 'GLOBALG.A.P.'],
        Alcance: ['Producción', 'Procesamiento', 'Empaque', 'Almacenamiento', 'Transporte'],
        Modalidad: ['Presencial', 'Remota', 'Híbrida'],
        Auditor: ['Auditor 1', 'Auditor 2', 'Auditor 3', 'Auditor 4'],
        Tipo: ['Inicial', 'Seguimiento', 'Cambio de alcance', 'Re-certificación'],
      });
    }
  };

  const handlePlantillaChange = (e) => {
    setSelectedPlantilla(e.target.value);
    // Limpiar campos específicos de otras plantillas
    setFormData({
      ...formData,
      analisis: '',
      viaticos: '',
      tema_formacion: '',
      fecha_formacion: '',
      horario_formacion: '',
      responsable_formacion: '',
      persona_contacto: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Calcular fecha fin si se cambian dias_inspeccion
    if (name === 'dias_inspeccion' && formData.fecha_inicio) {
      const fechaInicio = new Date(formData.fecha_inicio);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + parseInt(value));
      // Puedes guardar fecha_fin si lo necesitas
    }
  };

  const handleOpenOutlook = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generar contenido del correo basado en plantilla seleccionada
      const plantilla = plantillas.find(p => p.id === parseInt(selectedPlantilla));
      
      if (!plantilla) {
        setMessageType('error');
        setMessage('❌ Selecciona una plantilla');
        setLoading(false);
        return;
      }

      // Construir contenido de TEXTO PLANO (para guardar en BD)
      let contenidoTexto = plantilla.nombre === 'Planificación Interna' 
        ? generarContenidoInterna(formData)
        : plantilla.nombre === 'Planificación Externa'
        ? generarContenidoExterna(formData)
        : generarContenidoOrdenTrabajo(formData);

      // Construir contenido HTML (para mailto en Outlook)
      let contenidoHTML = plantilla.nombre === 'Planificación Interna' 
        ? generarHTMLInterna(formData)
        : plantilla.nombre === 'Planificación Externa'
        ? generarHTMLExterna(formData)
        : generarHTMLOrdenTrabajo(formData);

      const asunto = plantilla.nombre;

      // Guardar en base de datos con TEXTO PLANO
      const data = await apiService.enviarCorreo({
        destinatario: formData.destinatario,
        asunto: asunto,
        contenido: contenidoTexto,
        productor: formData.operador,
        contenidoHTML: contenidoHTML,
      });

      setMessageType('success');
      setMessage(`✅ Correo registrado. ID: ${data.id}. Guardando en calendario...`);

      // Calcular fecha fin
      const fechaFin = calcularFechaFin(formData.fecha_inicio, formData.dias_inspeccion);

      // Guardar evento en calendario
      await apiService.crearEvento({
        operador: formData.operador,
        numero_operador: formData.numero_operador,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: fechaFin,
        dias_inspeccion: formData.dias_inspeccion,
        auditor: formData.auditor,
        norma: formData.norma,
        alcance: formData.alcance,
        tipo: formData.tipo,
        modalidad: formData.modalidad,
        cultivo_producto: formData.cultivo_producto,
        lugar: formData.lugar,
        persona_contacto: formData.persona_contacto,
      });

      setTimeout(() => {
        // Crear link mailto con HTML para que Outlook lo reciba con tabla bonita
        const mailtoLink = `mailto:${encodeURIComponent(formData.destinatario)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(contenidoHTML)}`;
        
        // Abrir en nueva pestaña/ventana
        window.open(mailtoLink, '_blank');

        setTimeout(() => {
          setFormData({
            destinatario: '',
            operador: '',
            numero_operador: '',
            fecha_inicio: '',
            dias_inspeccion: 0,
            auditor: '',
            norma: '',
            alcance: '',
            tipo: '',
            modalidad: '',
            cultivo_producto: '',
            lugar: '',
            persona_contacto: '',
          });
          setSelectedPlantilla('');
        }, 500);
      }, 1500);
    } catch (error) {
      setMessageType('error');
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generarContenidoInterna = (data) => {
    return `PLANIFICACIÓN INTERNA

Estimado compañero(s),

Mediante el presente correo, quiero informarte que se está programando una auditoria según el siguiente cuadro:

OPERADOR: ${data.operador}
NÚMERO DE OPERADOR: ${data.numero_operador}
FECHA DE AUDITORÍA (INICIO): ${data.fecha_inicio}
FECHA DE AUDITORÍA (FIN): ${calcularFechaFin(data.fecha_inicio, data.dias_inspeccion)}
NÚMERO DE DÍAS DE INSPECCIÓN: ${data.dias_inspeccion}
AUDITOR: ${data.auditor}
NORMA: ${data.norma}
ALCANCE: ${data.alcance}
TIPO: ${data.tipo}
MODALIDAD: ${data.modalidad}
CULTIVO/PRODUCTO: ${data.cultivo_producto}
LUGAR: ${data.lugar}
ANÁLISIS: ${data.analisis}
VIÁTICOS: ${data.viaticos}
PERSONA DE CONTACTO: ${data.persona_contacto}

@ Administración CAAE Perú; favor de coordinar logística para la auditoria.`;
  };

  const generarHTMLInterna = (data) => {
    return `<html><body style="font-family: Arial, sans-serif;">
<p>Estimado compañero(s),</p>
<p>Mediante el presente correo, quiero informarte que se está programando una auditoria según el siguiente cuadro:</p>
<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
  <tr style="background-color: #003366; color: white;">
    <td style="font-weight: bold; width: 40%;">OPERADOR</td>
    <td>${data.operador}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">NÚMERO DE OPERADOR</td>
    <td>${data.numero_operador}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">FECHA DE AUDITORÍA (INICIO)</td>
    <td>${data.fecha_inicio}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">FECHA DE AUDITORÍA (FIN)</td>
    <td>${calcularFechaFin(data.fecha_inicio, data.dias_inspeccion)}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">NÚMERO DE DÍAS DE INSPECCIÓN</td>
    <td>${data.dias_inspeccion}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">AUDITOR</td>
    <td>${data.auditor}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">NORMA</td>
    <td>${data.norma}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">ALCANCE</td>
    <td>${data.alcance}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">TIPO</td>
    <td>${data.tipo}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">MODALIDAD</td>
    <td>${data.modalidad}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">CULTIVO/PRODUCTO</td>
    <td>${data.cultivo_producto}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">LUGAR</td>
    <td>${data.lugar}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">ANÁLISIS</td>
    <td>${data.analisis}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">VIÁTICOS</td>
    <td>${data.viaticos}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">PERSONA DE CONTACTO</td>
    <td>${data.persona_contacto}</td>
  </tr>
</table>
<p>@ Administración CAAE Perú; favor de coordinar logística para la auditoria.</p>
</body></html>`;
  };

  const generarContenidoExterna = (data) => {
    return `PLANIFICACIÓN EXTERNA

Estimados, reciban un cordial saludo.

Mediante el presente correo, quiero informarles que se está programando una auditoria para su representada según se detalla en el siguiente cuadro:

OPERADOR: ${data.operador}
NÚMERO DE OPERADOR: ${data.numero_operador}
FECHA DE AUDITORÍA (INICIO): ${data.fecha_inicio}
FECHA DE AUDITORÍA (FIN): ${calcularFechaFin(data.fecha_inicio, data.dias_inspeccion)}
NÚMERO DE DÍAS DE INSPECCIÓN: ${data.dias_inspeccion}
AUDITOR: ${data.auditor}
NORMA: ${data.norma}
ALCANCE: ${data.alcance}
TIPO: ${data.tipo}
MODALIDAD: ${data.modalidad}
CULTIVO/PRODUCTO: ${data.cultivo_producto}
LUGAR: ${data.lugar}
VIÁTICOS: ${data.viaticos}`;
  };

  const generarHTMLExterna = (data) => {
    return `<html><body style="font-family: Arial, sans-serif;">
<p>Estimados, reciban un cordial saludo.</p>
<p>Mediante el presente correo, quiero informarles que se está programando una auditoria para su representada según se detalla en el siguiente cuadro:</p>
<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
  <tr style="background-color: #003366; color: white;">
    <td style="font-weight: bold; width: 40%;">OPERADOR</td>
    <td>${data.operador}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">NÚMERO DE OPERADOR</td>
    <td>${data.numero_operador}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">FECHA DE AUDITORÍA (INICIO)</td>
    <td>${data.fecha_inicio}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">FECHA DE AUDITORÍA (FIN)</td>
    <td>${calcularFechaFin(data.fecha_inicio, data.dias_inspeccion)}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">NÚMERO DE DÍAS DE INSPECCIÓN</td>
    <td>${data.dias_inspeccion}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">AUDITOR</td>
    <td>${data.auditor}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">NORMA</td>
    <td>${data.norma}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">ALCANCE</td>
    <td>${data.alcance}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">TIPO</td>
    <td>${data.tipo}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">MODALIDAD</td>
    <td>${data.modalidad}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">CULTIVO/PRODUCTO</td>
    <td>${data.cultivo_producto}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">LUGAR</td>
    <td>${data.lugar}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">VIÁTICOS</td>
    <td>${data.viaticos}</td>
  </tr>
</table>
</body></html>`;
  };

  const generarContenidoOrdenTrabajo = (data) => {
    return `ORDEN DE TRABAJO

Estimados,

Asignar la OT (ORDEN DE TRABAJO) según el cuadro siguiente:

OPERADOR: ${data.operador}
NÚMERO DE OPERADOR: ${data.numero_operador}
FECHA (INICIO): ${data.fecha_inicio}
FECHA (FIN): ${calcularFechaFin(data.fecha_inicio, data.dias_inspeccion)}
NÚMERO DE DÍAS DE INSPECCIÓN: ${data.dias_inspeccion}
AUDITOR: ${data.auditor}
NORMA: ${data.norma}
ALCANCE: ${data.alcance}
TIPO: ${data.tipo}
TEMA DE FORMACIÓN: ${data.tema_formacion}
FECHA DE FORMACIÓN: ${data.fecha_formacion}
HORARIO DE FORMACIÓN: ${data.horario_formacion}
RESPONSABLE DE FORMACIÓN: ${data.responsable_formacion}

@ enviar tu descarte de conflicto de interés.`;
  };

  const generarHTMLOrdenTrabajo = (data) => {
    return `<html><body style="font-family: Arial, sans-serif;">
<p>Estimados,</p>
<p>Asignar la OT (ORDEN DE TRABAJO) según el cuadro siguiente:</p>
<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
  <tr style="background-color: #003366; color: white;">
    <td style="font-weight: bold; width: 40%;">OPERADOR</td>
    <td>${data.operador}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">NÚMERO DE OPERADOR</td>
    <td>${data.numero_operador}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">FECHA (INICIO)</td>
    <td>${data.fecha_inicio}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">FECHA (FIN)</td>
    <td>${calcularFechaFin(data.fecha_inicio, data.dias_inspeccion)}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">NÚMERO DE DÍAS DE INSPECCIÓN</td>
    <td>${data.dias_inspeccion}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">AUDITOR</td>
    <td>${data.auditor}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">NORMA</td>
    <td>${data.norma}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">ALCANCE</td>
    <td>${data.alcance}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">TIPO</td>
    <td>${data.tipo}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">TEMA DE FORMACIÓN</td>
    <td>${data.tema_formacion}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">FECHA DE FORMACIÓN</td>
    <td>${data.fecha_formacion}</td>
  </tr>
  <tr>
    <td style="font-weight: bold;">HORARIO DE FORMACIÓN</td>
    <td>${data.horario_formacion}</td>
  </tr>
  <tr style="background-color: #f0f0f0;">
    <td style="font-weight: bold;">RESPONSABLE DE FORMACIÓN</td>
    <td>${data.responsable_formacion}</td>
  </tr>
</table>
<p>@ enviar tu descarte de conflicto de interés.</p>
</body></html>`;
  };

  const calcularFechaFin = (fechaInicio, dias) => {
    if (!fechaInicio || !dias) return '';
    const fecha = new Date(fechaInicio);
    // Restar 1 porque el conteo empieza desde el día de inicio
    fecha.setDate(fecha.getDate() + parseInt(dias) - 1);
    return fecha.toISOString().split('T')[0];
  };

  return (
    <Card sx={{ maxWidth: 800, margin: '0 auto' }}>
      <CardHeader title="📧 Enviar Correo - Sistema de Plantillas" />
      <CardContent>
        {message && <Alert severity={messageType} sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleOpenOutlook}>
          {/* Selector de Plantilla */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Selecciona Plantilla</InputLabel>
            <Select
              value={selectedPlantilla}
              label="Selecciona Plantilla"
              onChange={handlePlantillaChange}
              required
            >
              {plantillas.map(p => (
                <MenuItem key={p.id} value={String(p.id)}>{p.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campos comunes */}
          <TextField
            fullWidth
            label="Email Destinatario"
            name="destinatario"
            type="email"
            value={formData.destinatario}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Operador"
            name="operador"
            value={formData.operador}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Número de Operador"
            name="numero_operador"
            value={formData.numero_operador}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Fecha de Inicio"
            name="fecha_inicio"
            type="date"
            value={formData.fecha_inicio}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          {formData.fecha_inicio && (
            <TextField
              fullWidth
              label="Fecha Fin (Calculada)"
              value={calcularFechaFin(formData.fecha_inicio, formData.dias_inspeccion)}
              margin="normal"
              disabled
              InputLabelProps={{ shrink: true }}
            />
          )}

          <TextField
            fullWidth
            label="Número de Días de Inspección"
            name="dias_inspeccion"
            type="number"
            value={formData.dias_inspeccion}
            onChange={handleChange}
            margin="normal"
            required
          />

          {/* CAMPOS PARA PLANTILLA 1 (Interna) y 2 (Externa) */}
          {(selectedPlantilla === '1' || selectedPlantilla === '2') && (
            <>
              {/* Auditor - Para Interna y Externa */}
              {opciones.Auditor && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Auditor</InputLabel>
                  <Select
                    name="auditor"
                    value={formData.auditor}
                    label="Auditor"
                    onChange={handleChange}
                  >
                    {opciones.Auditor.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {opciones.Norma && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Norma</InputLabel>
                  <Select
                    name="norma"
                    value={formData.norma}
                    label="Norma"
                    onChange={handleChange}
                    required
                  >
                    {opciones.Norma.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {opciones.Alcance && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Alcance</InputLabel>
                  <Select
                    name="alcance"
                    value={formData.alcance}
                    label="Alcance"
                    onChange={handleChange}
                  >
                    {opciones.Alcance.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {opciones.Tipo && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    label="Tipo"
                    onChange={handleChange}
                  >
                    {opciones.Tipo.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {opciones.Modalidad && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Modalidad</InputLabel>
                  <Select
                    name="modalidad"
                    value={formData.modalidad}
                    label="Modalidad"
                    onChange={handleChange}
                  >
                    {opciones.Modalidad.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                fullWidth
                label="Cultivo/Producto"
                name="cultivo_producto"
                value={formData.cultivo_producto}
                onChange={handleChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Lugar"
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          {/* CAMPOS PARA PLANTILLA 3 (Orden de Trabajo) */}
          {selectedPlantilla === '3' && (
            <>
              {opciones.Auditor && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Auditor</InputLabel>
                  <Select
                    name="auditor"
                    value={formData.auditor}
                    label="Auditor"
                    onChange={handleChange}
                  >
                    {opciones.Auditor.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {opciones.Norma && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Norma</InputLabel>
                  <Select
                    name="norma"
                    value={formData.norma}
                    label="Norma"
                    onChange={handleChange}
                  >
                    {opciones.Norma.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {opciones.Alcance && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Alcance</InputLabel>
                  <Select
                    name="alcance"
                    value={formData.alcance}
                    label="Alcance"
                    onChange={handleChange}
                  >
                    {opciones.Alcance.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {opciones.Tipo && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    label="Tipo"
                    onChange={handleChange}
                  >
                    {opciones.Tipo.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}

          {/* PLANIFICACIÓN INTERNA - Campos adicionales */}
          {selectedPlantilla === '1' && (
            <>
              <TextField
                fullWidth
                label="Análisis"
                name="analisis"
                value={formData.analisis}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Viáticos"
                name="viaticos"
                value={formData.viaticos}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          {/* PLANIFICACIÓN EXTERNA - Campos adicionales */}
          {selectedPlantilla === '2' && (
            <TextField
              fullWidth
              label="Viáticos"
              name="viaticos"
              value={formData.viaticos}
              onChange={handleChange}
              margin="normal"
            />
          )}

          {/* ORDEN DE TRABAJO - Campos de Formación */}
          {selectedPlantilla === '3' && (
            <>
              <TextField
                fullWidth
                label="Tema de Formación"
                name="tema_formacion"
                value={formData.tema_formacion}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Fecha de Formación"
                name="fecha_formacion"
                type="date"
                value={formData.fecha_formacion}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Horario de Formación"
                name="horario_formacion"
                value={formData.horario_formacion}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Responsable de Formación"
                name="responsable_formacion"
                value={formData.responsable_formacion}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          {/* Campo Persona de Contacto solo para Planificación Interna */}
          {selectedPlantilla === '1' && (
            <TextField
              fullWidth
              label="Persona de Contacto"
              name="persona_contacto"
              value={formData.persona_contacto}
              onChange={handleChange}
              margin="normal"
            />
          )}

          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 3 }}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} /> : <OpenInNewIcon />}
          >
            {loading ? 'Preparando...' : 'Abrir en Outlook'}
          </Button>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <strong>ℹ️ Cómo funciona:</strong> Selecciona una plantilla, completa los campos y haz clic en "Abrir en Outlook". 
          La fecha final se calcula automáticamente basada en los días de inspección.
        </Alert>
      </CardContent>
    </Card>
  );
};

export default EmailForm;
