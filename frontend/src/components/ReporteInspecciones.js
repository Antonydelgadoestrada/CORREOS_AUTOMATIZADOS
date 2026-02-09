import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { apiService } from '../utils/apiService';

// Util: descargar contenido como archivo
const descargarArchivo = (nombre, contenido, tipo) => {
  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// Util: eliminar etiquetas HTML y espacios extra
const stripTags = (input) => {
  if (input === null || input === undefined) return '';
  try {
    return String(input).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  } catch (e) {
    return String(input);
  }
};

const ReporteInspecciones = () => {
  const [inspecciones, setInspecciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async (anioParam = anio, mesParam = mes) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.obtenerInspeccionesPorMes(anioParam, mesParam);
      setInspecciones(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarMes = () => {
    cargarReporte(anio, mes);
  };

  const handleMesAnterior = () => {
    let nuevoMes = mes - 1;
    let nuevoAnio = anio;
    if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAnio -= 1;
    }
    setMes(nuevoMes);
    setAnio(nuevoAnio);
    cargarReporte(nuevoAnio, nuevoMes);
  };

  const handleMesSiguiente = () => {
    let nuevoMes = mes + 1;
    let nuevoAnio = anio;
    if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAnio += 1;
    }
    setMes(nuevoMes);
    setAnio(nuevoAnio);
    cargarReporte(nuevoAnio, nuevoMes);
  };

  // Función para calcular el estado de la inspección
  const calcularEstado = (inspeccion) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaInicio = new Date(inspeccion.fecha_inicio);
    const fechaFin = new Date(inspeccion.fecha_fin);
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(0, 0, 0, 0);

    if (inspeccion.estado === 'reprogramada') {
      return { estado: 'Reprogramada', color: 'default', icon: '🔄' };
    }

    if (hoy >= fechaInicio && hoy <= fechaFin) {
      return { estado: 'En proceso', color: 'info', icon: '⏳' };
    }

    if (hoy > fechaFin) {
      return { estado: 'Finalizada', color: 'success', icon: '✅' };
    }

    return { estado: 'Programada', color: 'warning', icon: '📋' };
  };

  const obtenerResumen = () => {
    const estados = {};
    inspecciones.forEach((insp) => {
      const estadoInfo = calcularEstado(insp);
      estados[estadoInfo.estado] = (estados[estadoInfo.estado] || 0) + 1;
    });
    return estados;
  };

  const resumen = obtenerResumen();
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Exportar CSV (abrible en Excel)
  const exportarCSV = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const encabezados = [
      'Estado',
      'Operador',
      'Número Operador',
      'Auditor',
      'Fecha Inicio',
      'Fecha Fin',
      'Días',
      'Norma',
      'Alcance',
      'Tipo',
      'Modalidad',
      'Cultivo/Producto',
      'Lugar',
      'Persona Contacto',
    ];

    const filas = data.map((insp) => {
      const estadoInfo = calcularEstado(insp);
      return [
        estadoInfo.estado,
        stripTags(insp.operador) || '',
        stripTags(insp.numero_operador) || '',
        stripTags(insp.auditor) || '',
        formatearFecha(insp.fecha_inicio) || '',
        formatearFecha(insp.fecha_fin) || '',
        insp.dias_inspeccion || '',
        stripTags(insp.norma) || '',
        stripTags(insp.alcance) || '',
        stripTags(insp.tipo) || '',
        stripTags(insp.modalidad) || '',
        stripTags(insp.cultivo_producto) || '',
        stripTags(insp.lugar) || '',
        stripTags(insp.persona_contacto) || '',
      ];
    });

    const csvContent = [encabezados, ...filas]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const nombre = `inspecciones_${mes}-${anio}.csv`;
    descargarArchivo(nombre, csvContent, 'text/csv;charset=utf-8;');
  };

  // Exportar PDF (abre ventana de impresión — el usuario puede guardar como PDF)
  const exportarPDF = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const titulo = `Reporte de inspecciones - ${meses[mes - 1]} ${anio}`;
    const estilo = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 6px; font-size: 12px; }
        th { background: #f5f5f5; }
        h2 { margin-bottom: 8px; }
      </style>
    `;

    const filasHtml = data
      .map((insp) => {
        const estadoInfo = calcularEstado(insp);
        return `
          <tr>
            <td>${estadoInfo.estado}</td>
            <td>${stripTags(insp.operador) || ''}</td>
            <td>${stripTags(insp.numero_operador) || ''}</td>
            <td>${stripTags(insp.auditor) || ''}</td>
            <td>${formatearFecha(insp.fecha_inicio)}</td>
            <td>${formatearFecha(insp.fecha_fin)}</td>
            <td>${insp.dias_inspeccion || ''}</td>
            <td>${stripTags(insp.norma) || ''}</td>
            <td>${stripTags(insp.alcance) || ''}</td>
            <td>${stripTags(insp.tipo) || ''}</td>
            <td>${stripTags(insp.modalidad) || ''}</td>
            <td>${stripTags(insp.cultivo_producto) || ''}</td>
            <td>${stripTags(insp.lugar) || ''}</td>
            <td>${stripTags(insp.persona_contacto) || ''}</td>
          </tr>
        `;
      })
      .join('');

    const html = `
      <html>
        <head><meta charset="utf-8" />${estilo}</head>
        <body>
          <h2>${titulo}</h2>
          <table>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Operador</th>
                <th>Nº Operador</th>
                <th>Auditor</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Días</th>
                <th>Norma</th>
                <th>Alcance</th>
                <th>Tipo</th>
                <th>Modalidad</th>
                <th>Cultivo/Producto</th>
                <th>Lugar</th>
                <th>Persona Contacto</th>
              </tr>
            </thead>
            <tbody>
              ${filasHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const w = window.open('', '_blank', 'noopener');
    if (!w) {
      alert('No se pudo abrir la ventana de impresión. Revisa el bloqueador de ventanas.');
      return;
    }
    w.document.write(html);
    w.document.close();
    // Esperar que cargue y lanzar diálogo de impresión
    w.focus();
    setTimeout(() => {
      w.print();
    }, 500);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardHeader title="📊 Reporte de Inspecciones" />
        <CardContent>
          {/* Selector de Mes/Año */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={handleMesAnterior}>
              ◀ Anterior
            </Button>

            <Typography variant="h6" sx={{ minWidth: '200px', textAlign: 'center' }}>
              {meses[mes - 1]} {anio}
            </Typography>

            <Button variant="outlined" onClick={handleMesSiguiente}>
              Siguiente ▶
            </Button>

            <TextField
              type="number"
              label="Año"
              value={anio}
              onChange={(e) => setAnio(parseInt(e.target.value))}
              size="small"
              sx={{ width: '100px' }}
            />

            <TextField
              type="number"
              label="Mes"
              value={mes}
              onChange={(e) => setMes(Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))}
              size="small"
              sx={{ width: '100px' }}
              inputProps={{ min: 1, max: 12 }}
            />

            <Button variant="contained" onClick={handleCambiarMes}>
              🔍 Buscar
            </Button>
            <Button variant="outlined" onClick={() => exportarCSV(inspecciones)}>
              📥 Exportar Excel (CSV)
            </Button>
            <Button variant="outlined" onClick={() => exportarPDF(inspecciones)}>
              📄 Exportar PDF
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Resumen */}
          {!loading && inspecciones.length > 0 && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                📈 Resumen del mes
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                      {resumen['Programada'] || 0}
                    </Typography>
                    <Typography variant="caption">Programadas</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                      {resumen['En proceso'] || 0}
                    </Typography>
                    <Typography variant="caption">En Proceso</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                      {resumen['Finalizada'] || 0}
                    </Typography>
                    <Typography variant="caption">Finalizadas</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#9e9e9e', fontWeight: 'bold' }}>
                      {resumen['Reprogramada'] || 0}
                    </Typography>
                    <Typography variant="caption">Reprogramadas</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tabla de Inspecciones */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : inspecciones.length === 0 ? (
            <Alert severity="info">No hay inspecciones para este mes</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Operador</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Auditor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha Inicio</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha Fin</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Norma</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Alcance</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Lugar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inspecciones.map((insp) => {
                    const estadoInfo = calcularEstado(insp);
                    return (
                      <TableRow key={insp.id} hover>
                        <TableCell>
                          <Chip
                            icon={<span>{estadoInfo.icon}</span>}
                            label={estadoInfo.estado}
                            color={estadoInfo.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{stripTags(insp.operador)}</TableCell>
                        <TableCell>{stripTags(insp.auditor)}</TableCell>
                        <TableCell>{formatearFecha(insp.fecha_inicio)}</TableCell>
                        <TableCell>{formatearFecha(insp.fecha_fin)}</TableCell>
                        <TableCell>{stripTags(insp.norma)}</TableCell>
                        <TableCell>{stripTags(insp.alcance)}</TableCell>
                        <TableCell>{stripTags(insp.lugar)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Información adicional */}
          {!loading && inspecciones.length > 0 && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
              <Typography variant="caption" color="textSecondary">
                <strong>Total de inspecciones:</strong> {inspecciones.length}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                📋 <strong>Leyenda de estados:</strong>
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                📋 Programada = Inspección programada para futuro
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                ⏳ En proceso = Inspección ocurriendo hoy
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                ✅ Finalizada = Inspección completada
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                🔄 Reprogramada = Inspección que fue reprogramada
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReporteInspecciones;
