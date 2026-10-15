import React, { useState, useEffect, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Tooltip,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import html2canvas from 'html2canvas';
import { apiService } from '../utils/apiService';

const EmailForm = () => {
  const [plantillas, setPlantillas] = useState([]);
  const [opciones, setOpciones] = useState({});
  const [selectedPlantilla, setSelectedPlantilla] = useState('');
  const [firma, setFirma] = useState(null);
  
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
  const [copiando, setCopiando] = useState(false);
  const [copiadoExito, setCopiadoExito] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [datosParaConfirmar, setDatosParaConfirmar] = useState(null);
  const [enviarComoImagen, setEnviarComoImagen] = useState(true);
  const previewRef = useRef(null);

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

      // Cargar firma del backend
      const firmaData = await apiService.obtenerFirma();
      if (firmaData) {
        setFirma(firmaData);
      }
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

    try {
      // Validar que haya plantilla seleccionada
      const plantilla = plantillas.find(p => p.id === parseInt(selectedPlantilla));
      
      if (!plantilla) {
        setMessageType('error');
        setMessage('❌ Selecciona una plantilla');
        return;
      }

      // Construir contenido de TEXTO PLANO (para guardar en BD)
      let contenidoTexto = plantilla.nombre === 'Planificación Interna' 
        ? generarContenidoInterna(formData)
        : plantilla.nombre === 'Planificación Externa'
        ? generarContenidoExterna(formData)
        : generarContenidoOrdenTrabajo(formData);

      // AGREGAR FIRMA AL TEXTO PLANO
      contenidoTexto += generarFirmaTexto();

      // Construir contenido HTML (para mailto en Outlook)
      let contenidoHTML = plantilla.nombre === 'Planificación Interna' 
        ? generarHTMLInterna(formData)
        : plantilla.nombre === 'Planificación Externa'
        ? generarHTMLExterna(formData)
        : generarHTMLOrdenTrabajo(formData);

      // AGREGAR FIRMA AL HTML (insensible a saltos de línea antes del cierre del body)
      if (/<\/body\s*>/i.test(contenidoHTML)) {
        contenidoHTML = contenidoHTML.replace(/<\/body\s*>/i, `${generarFirmaHTML()}</body>`);
      } else {
        contenidoHTML += generarFirmaHTML();
      }

      const asunto = formData.operador 
        ? `${plantilla.nombre} - ${formData.operador}`
        : plantilla.nombre;

      // Guardar datos para confirmación
      setDatosParaConfirmar({
        destinatario: formData.destinatario,
        asunto: asunto,
        contenidoTexto: contenidoTexto,
        contenidoHTML: contenidoHTML,
        productor: formData.operador,
      });

      // Mostrar diálogo de confirmación
      setOpenConfirmDialog(true);
    } catch (error) {
      setMessageType('error');
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  // Copia el afiche institucional directamente al portapapeles del sistema
  const handleCopiarPortapapeles = async () => {
    if (!previewRef.current) return;
    setCopiando(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setMessage('❌ No se pudo procesar la imagen para el portapapeles.');
          setMessageType('error');
          setCopiando(false);
          return;
        }

        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopiadoExito(true);
            setMessage('📋 ¡Afiche institucional copiado al portapapeles! Puedes pegarlo directamente en tu Outlook con Ctrl + V.');
            setMessageType('success');
            setTimeout(() => setCopiadoExito(false), 4000);
          } else {
            setMessage('⚠️ Tu navegador no admite copiado directo de imágenes.');
            setMessageType('warning');
          }
        } catch (clipErr) {
          console.error('Error al copiar al portapapeles:', clipErr);
          setMessage('⚠️ Permiso denegado para el portapapeles. Puedes usar el borrador .eml descargado.');
          setMessageType('warning');
        } finally {
          setCopiando(false);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error capturando afiche:', err);
      setMessage(`❌ Error al capturar afiche: ${err.message}`);
      setMessageType('error');
      setCopiando(false);
    }
  };

  const handleConfirmarEnvio = async () => {
    setLoading(true);
    try {
      // Capturar imagen si el toggle está activado
      let imagenBase64 = null;
      if (enviarComoImagen && previewRef.current) {
        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0,
        });
        imagenBase64 = canvas.toDataURL('image/png');
      }

      const data = await apiService.enviarCorreo({
        destinatario: datosParaConfirmar.destinatario,
        asunto: datosParaConfirmar.asunto,
        contenido: datosParaConfirmar.contenidoTexto,
        productor: datosParaConfirmar.productor,
        contenido_html: datosParaConfirmar.contenidoHTML,
        imagen_base64: imagenBase64,
        modo_envio: enviarComoImagen ? 'imagen' : 'html',
      });

      setMessageType('success');
      setMessage(`✅ Correo registrado (ID: ${data.id}). Abriendo borrador en Outlook de escritorio...`);

      const fechaFin = calcularFechaFin(formData.fecha_inicio, formData.dias_inspeccion);

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

      // Abrir borrador en Outlook con destinatario, asunto y cuerpo pre-rellenados
      abrirBorradorOutlook(
        datosParaConfirmar.destinatario,
        datosParaConfirmar.asunto,
        datosParaConfirmar.contenidoHTML,
        imagenBase64,
        datosParaConfirmar.contenidoTexto
      );

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
          analisis: '',
          viaticos: '',
          tema_formacion: '',
          fecha_formacion: '',
          horario_formacion: '',
          responsable_formacion: '',
        });
        setSelectedPlantilla('');
        setOpenConfirmDialog(false);
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

  // Helper institucional para estructurar afiches y comunicados ejecutivos oficiales
  const generarPlantillaInstitucionalHTML = ({
    titulo,
    subtitulo = 'Comunicado Oficial de Inspección y Certificación',
    saludo,
    explicacion,
    filas = [],
    aviso = null,
  }) => {
    const filasHTML = filas
      .filter(([_, valor]) => valor !== undefined && valor !== null && valor !== '')
      .map(([etiqueta, valor, estilo]) => {
        let valorRender = valor;
        if (estilo === 'norma') {
          valorRender = `<span style="background-color:#e0f2fe;color:#0369a1;padding:4px 10px;border-radius:4px;font-weight:700;font-size:12.5px;display:inline-block;border:1px solid #bae6fd;">${valor}</span>`;
        } else if (estilo === 'tipo') {
          valorRender = `<span style="background-color:#f1f5f9;color:#334155;padding:4px 10px;border-radius:4px;font-weight:600;font-size:12px;display:inline-block;border:1px solid #cbd5e1;">${valor}</span>`;
        } else if (estilo === 'modalidad') {
          valorRender = `<span style="background-color:#fef3c7;color:#92400e;padding:4px 10px;border-radius:4px;font-weight:600;font-size:12px;display:inline-block;border:1px solid #fde68a;">${valor}</span>`;
        } else if (estilo === 'destacado') {
          valorRender = `<span style="font-weight:700;color:#0f172a;">${valor}</span>`;
        }

        return `
          <tr>
            <td style="background-color:#f8fafc;padding:11px 16px;font-size:12px;font-weight:700;color:#334155;width:38%;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.5px;">
              ${etiqueta}
            </td>
            <td style="background-color:#ffffff;padding:11px 16px;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">
              ${valorRender}
            </td>
          </tr>`;
      })
      .join('');

    const avisoHTML = aviso
      ? `
        <div style="background-color:#eff6ff;border-left:4px solid #2563eb;border-radius:4px;padding:14px 18px;margin:22px 0 12px 0;color:#1e40af;font-size:13px;line-height:1.5;">
          ${aviso}
        </div>`
      : '';

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo}</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#f4f6f8;font-family:'Segoe UI',Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f6f8;">
    <tr>
      <td align="center">
        <!--[if mso]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="680">
        <tr>
        <td align="center" valign="top" width="680">
        <![endif]-->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;background-color:#ffffff;border:1px solid #dcdfe6;border-radius:8px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06);text-align:left;">
          <!-- Banner Superior Institucional -->
          <tr>
            <td style="background-color:#0a2540;padding:24px 28px;border-top:5px solid #0099cc;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size:11px;letter-spacing:2px;color:#38bdf8;font-weight:700;text-transform:uppercase;margin-bottom:6px;">
                      CAAE PERÚ &bull; SISTEMA DE GESTIÓN Y AUDITORÍAS
                    </div>
                    <div style="font-size:20px;font-weight:700;color:#ffffff;margin:0 0 4px 0;letter-spacing:-0.2px;">
                      ${titulo}
                    </div>
                    <div style="font-size:12.5px;color:#94a3b8;margin:0;">
                      ${subtitulo}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenido Principal -->
          <tr>
            <td style="padding:28px;">
              <p style="font-size:14px;color:#334155;line-height:1.6;margin:0 0 8px 0;font-weight:600;">
                ${saludo}
              </p>
              <p style="font-size:13.5px;color:#475569;line-height:1.6;margin:0 0 20px 0;">
                ${explicacion}
              </p>

              <!-- Tabla de Ficha Técnica -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;margin-bottom:12px;">
                <thead>
                  <tr>
                    <th colspan="2" style="background-color:#f1f5f9;padding:10px 16px;font-size:11.5px;font-weight:700;color:#475569;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #e2e8f0;text-align:left;">
                      Detalles de la Inspección / Auditoría
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${filasHTML}
                </tbody>
              </table>

              ${avisoHTML}

              <!-- Pie Institucional -->
              <div style="border-top:1px solid #e2e8f0;margin-top:24px;padding-top:14px;font-size:11px;color:#64748b;line-height:1.5;">
                Aviso: Este es un comunicado oficial emitido por el Sistema de Planificación de Inspecciones. La información contenida es de carácter confidencial e institucional.
              </div>
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  const generarHTMLInterna = (data) => {
    return generarPlantillaInstitucionalHTML({
      titulo: 'PLANIFICACIÓN DE AUDITORÍA INTERNA',
      saludo: 'Estimado compañero(s),',
      explicacion: 'Mediante el presente comunicado, quiero informarte que se ha programado una auditoría oficial según la siguiente ficha técnica:',
      filas: [
        ['Operador', data.operador, 'destacado'],
        ['Número de Operador', data.numero_operador],
        ['Fecha de Auditoría (Inicio)', data.fecha_inicio, 'destacado'],
        ['Fecha de Auditoría (Fin)', calcularFechaFin(data.fecha_inicio, data.dias_inspeccion), 'destacado'],
        ['Número de Días de Inspección', `${data.dias_inspeccion} día(s)`],
        ['Auditor Asignado', data.auditor, 'destacado'],
        ['Norma', data.norma, 'norma'],
        ['Alcance', data.alcance],
        ['Tipo', data.tipo, 'tipo'],
        ['Modalidad', data.modalidad, 'modalidad'],
        ['Cultivo / Producto', data.cultivo_producto],
        ['Lugar / Ubicación', data.lugar],
        ['Análisis', data.analisis],
        ['Viáticos', data.viaticos],
        ['Persona de Contacto', data.persona_contacto],
      ],
      aviso: '<strong>📌 Coordinación Logística:</strong> @ Administración CAAE Perú; favor de coordinar logística para la auditoría.',
    });
  };

  const generarHTMLExterna = (data) => {
    return generarPlantillaInstitucionalHTML({
      titulo: 'PLANIFICACIÓN DE AUDITORÍA EXTERNA',
      saludo: 'Estimados, reciban un cordial saludo.',
      explicacion: 'Mediante el presente correo, notificamos formalmente que se ha programado una auditoría para su representada con los siguientes datos:',
      filas: [
        ['Operador', data.operador, 'destacado'],
        ['Número de Operador', data.numero_operador],
        ['Fecha de Auditoría (Inicio)', data.fecha_inicio, 'destacado'],
        ['Fecha de Auditoría (Fin)', calcularFechaFin(data.fecha_inicio, data.dias_inspeccion), 'destacado'],
        ['Número de Días de Inspección', `${data.dias_inspeccion} día(s)`],
        ['Auditor Asignado', data.auditor, 'destacado'],
        ['Norma', data.norma, 'norma'],
        ['Alcance', data.alcance],
        ['Tipo', data.tipo, 'tipo'],
        ['Modalidad', data.modalidad, 'modalidad'],
        ['Cultivo / Producto', data.cultivo_producto],
        ['Lugar / Ubicación', data.lugar],
        ['Viáticos', data.viaticos],
      ],
      aviso: '<strong>ℹ️ Información al Operador:</strong> Agradecemos brindar las facilidades necesarias al auditor asignado para el correcto desarrollo de la inspección programada.',
    });
  };

  const generarHTMLOrdenTrabajo = (data) => {
    return generarPlantillaInstitucionalHTML({
      titulo: 'ORDEN DE TRABAJO (OT)',
      saludo: 'Estimados auditores,',
      explicacion: 'Asignar la OT (ORDEN DE TRABAJO) correspondiente según las especificaciones técnicas del siguiente cuadro:',
      filas: [
        ['Operador', data.operador, 'destacado'],
        ['Número de Operador', data.numero_operador],
        ['Fecha (Inicio)', data.fecha_inicio, 'destacado'],
        ['Fecha (Fin)', calcularFechaFin(data.fecha_inicio, data.dias_inspeccion), 'destacado'],
        ['Número de Días de Inspección', `${data.dias_inspeccion} día(s)`],
        ['Auditor Responsable', data.auditor, 'destacado'],
        ['Norma', data.norma, 'norma'],
        ['Alcance', data.alcance],
        ['Tipo', data.tipo, 'tipo'],
        ['Tema de Formación', data.tema_formacion],
        ['Fecha de Formación', data.fecha_formacion],
        ['Horario de Formación', data.horario_formacion],
        ['Responsable de Formación', data.responsable_formacion],
      ],
      aviso: '<strong>⚠️ Requisito del Auditor:</strong> @ enviar tu descarte de conflicto de interés oportunamente.',
    });
  };

  // Convierte texto UTF-8 a Base64 sin pérdida de caracteres en español
  const stringToBase64 = (str) => {
    if (!str) return '';
    try {
      const bytes = new TextEncoder().encode(str);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } catch (e) {
      console.error('Error codificando a base64:', e);
      return '';
    }
  };

  // Divide líneas a máximo 76 caracteres para cumplir con RFC 2045 (evita imágenes en blanco en Outlook)
  const wrap76 = (str) => {
    if (!str) return '';
    return str.match(/.{1,76}/g)?.join('\r\n') || '';
  };

  // Codifica asuntos con caracteres especiales según RFC 2047
  const encodeSubjectRFC2047 = (subject) => {
    if (!subject) return 'Sin Asunto';
    if (/^[\x20-\x7E]*$/.test(subject)) {
      return subject;
    }
    const b64 = stringToBase64(subject);
    return `=?UTF-8?B?${b64}?=`;
  };

  // Genera un archivo .eml profesional conforme a RFC y lo abre en Outlook como borrador pre-rellenado
  const abrirBorradorOutlook = (destinatario, asunto, contenidoHTML, imagenBase64 = null, contenidoTexto = '') => {
    let emlContent;
    const boundaryRelated = `----=_Part_Rel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const boundaryAlt = `----=_Part_Alt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const subjectEncoded = encodeSubjectRFC2047(asunto);
    const dateRfc2822 = new Date().toUTCString();
    const messageId = `<${Date.now()}.${Math.random().toString(36).substring(2, 9)}@institucion.local>`;

    if (imagenBase64) {
      const base64Data = imagenBase64.replace(/^data:image\/[^;]+;base64,/, '');
      const wrappedImage = wrap76(base64Data);

      // Plantilla HTML optimizada para Outlook de escritorio que referencia la imagen por CID
      const htmlParaOutlook = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:16px 0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f6f8;">
    <tr>
      <td align="center" style="padding:10px 0;">
        <!--[if mso]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="680">
        <tr>
        <td align="center" valign="top" width="680">
        <![endif]-->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;background-color:#ffffff;border:1px solid #dcdfe6;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          <tr>
            <td align="center" style="padding:0;margin:0;line-height:0;font-size:0;">
              <img src="cid:afiche_institucional" alt="${asunto}" border="0" width="680" style="display:block;width:100%;max-width:680px;height:auto;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;">
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

      const wrappedText = wrap76(stringToBase64(contenidoTexto || asunto));
      const wrappedHtml = wrap76(stringToBase64(htmlParaOutlook));

      emlContent = [
        'X-Unsent: 1',
        'MIME-Version: 1.0',
        `To: ${destinatario || ''}`,
        `Subject: ${subjectEncoded}`,
        `Date: ${dateRfc2822}`,
        `Message-ID: ${messageId}`,
        `Content-Type: multipart/related; boundary="${boundaryRelated}"; type="multipart/alternative"`,
        '',
        `--${boundaryRelated}`,
        `Content-Type: multipart/alternative; boundary="${boundaryAlt}"`,
        '',
        `--${boundaryAlt}`,
        'Content-Type: text/plain; charset=UTF-8; format=flowed',
        'Content-Transfer-Encoding: base64',
        '',
        wrappedText,
        '',
        `--${boundaryAlt}`,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        wrappedHtml,
        '',
        `--${boundaryAlt}--`,
        '',
        `--${boundaryRelated}`,
        'Content-Type: image/png; name="afiche_institucional.png"',
        'Content-Transfer-Encoding: base64',
        'Content-ID: <afiche_institucional>',
        'Content-Disposition: inline; filename="afiche_institucional.png"',
        '',
        wrappedImage,
        '',
        `--${boundaryRelated}--`,
      ].join('\r\n');
    } else {
      const wrappedText = wrap76(stringToBase64(contenidoTexto || asunto));
      const wrappedHtml = wrap76(stringToBase64(contenidoHTML));

      emlContent = [
        'X-Unsent: 1',
        'MIME-Version: 1.0',
        `To: ${destinatario || ''}`,
        `Subject: ${subjectEncoded}`,
        `Date: ${dateRfc2822}`,
        `Message-ID: ${messageId}`,
        `Content-Type: multipart/alternative; boundary="${boundaryAlt}"`,
        '',
        `--${boundaryAlt}`,
        'Content-Type: text/plain; charset=UTF-8; format=flowed',
        'Content-Transfer-Encoding: base64',
        '',
        wrappedText,
        '',
        `--${boundaryAlt}`,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        wrappedHtml,
        '',
        `--${boundaryAlt}--`,
      ].join('\r\n');
    }

    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedOp = (formData.operador || 'Inspeccion').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `Borrador_${sanitizedOp}_${Date.now()}.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Extrae contenido limpio del <body> para el preview sin contaminar el componente React
  const extraerParaPreview = (htmlCompleto) => {
    if (!htmlCompleto) return '';
    const bodyMatch = htmlCompleto.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : htmlCompleto;
  };

  // Cálculo de fecha fin seguro contra desfases horarios (UTC-5 Lima)
  const calcularFechaFin = (fechaInicio, dias) => {
    if (!fechaInicio || !dias) return '';
    const partes = String(fechaInicio).split('-');
    if (partes.length !== 3) return fechaInicio;
    const anio = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const dia = parseInt(partes[2], 10);
    const fecha = new Date(anio, mes, dia);
    fecha.setDate(fecha.getDate() + parseInt(dias, 10) - 1);
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const generarFirmaHTML = () => {
    if (!firma) return '';
    
    let firmaHTML = '<hr style="border: none; border-top: 2px solid #cccccc; margin: 20px 0;">';
    firmaHTML += '<div style="font-family: Arial, sans-serif; color: #333; font-size: 12px; margin-top: 20px;">';
    
    if (firma.nombre) {
      firmaHTML += `<div style="font-weight: bold; font-size: 13px; margin-bottom: 5px;">${firma.nombre}</div>`;
    }
    
    if (firma.cargo) {
      firmaHTML += `<div style="color: #666; margin-bottom: 5px;">${firma.cargo}</div>`;
    }
    
    if (firma.empresa_nombre) {
      firmaHTML += `<div style="font-weight: bold; margin-bottom: 10px;">${firma.empresa_nombre}</div>`;
    }
    
    if (firma.telefono || firma.email || firma.web) {
      firmaHTML += '<div style="margin-bottom: 10px;">';
      if (firma.telefono) firmaHTML += `<div>☎️ ${firma.telefono}</div>`;
      if (firma.email) firmaHTML += `<div>📧 <a href="mailto:${firma.email}">${firma.email}</a></div>`;
      if (firma.web) firmaHTML += `<div>🌐 <a href="https://${firma.web}" target="_blank">${firma.web}</a></div>`;
      firmaHTML += '</div>';
    }
    
    if (firma.imagen_base64) {
      const maxWidth = '150px';
      firmaHTML += `<div style="margin-top: 10px;"><img src="${firma.imagen_base64}" style="max-width: ${maxWidth}; height: auto;"></div>`;
    }
    
    if (firma.contenido_html) {
      firmaHTML += `<div style="margin-top: 10px; color: #666;">${firma.contenido_html}</div>`;
    }
    
    firmaHTML += '</div>';
    return firmaHTML;
  };

  const generarFirmaTexto = () => {
    if (!firma) return '';
    
    let firmaTexto = '\n\n' + '─'.repeat(60) + '\n';
    
    if (firma.nombre) {
      firmaTexto += `${firma.nombre}\n`;
    }
    
    if (firma.cargo) {
      firmaTexto += `${firma.cargo}\n`;
    }
    
    if (firma.empresa_nombre) {
      firmaTexto += `${firma.empresa_nombre}\n`;
    }
    
    if (firma.telefono || firma.email || firma.web) {
      firmaTexto += '\n';
      if (firma.telefono) firmaTexto += `☎️ ${firma.telefono}\n`;
      if (firma.email) firmaTexto += `📧 ${firma.email}\n`;
      if (firma.web) firmaTexto += `🌐 ${firma.web}\n`;
    }
    
    if (firma.contenido_html) {
      // Quitar tags HTML para el texto plano
      const textoLimpio = firma.contenido_html.replace(/<[^>]*>/g, '');
      firmaTexto += `\n${textoLimpio}\n`;
    }
    
    return firmaTexto;
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
            {loading ? 'Preparando...' : 'Vista previa y enviar'}
          </Button>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <strong>Cómo funciona:</strong> Completa el formulario y haz clic en "Vista previa y enviar".
          Se abre un diálogo donde puedes ver exactamente cómo quedará el correo, elegir si enviarlo como
          <strong> imagen</strong> o <strong>HTML</strong>, y al confirmar se descarga automáticamente un
          archivo <strong>.eml</strong> que abre Outlook con el destinatario, asunto y cuerpo ya rellenados — solo tienes que darle a Enviar.
        </Alert>
      </CardContent>

      {/* Diálogo de Confirmación con Preview */}
      <Dialog open={openConfirmDialog} onClose={() => !loading && setOpenConfirmDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Confirmar Envío de Correo</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {/* Datos del correo */}
          {datosParaConfirmar && (
            <Box sx={{ backgroundColor: '#f5f5f5', p: 1.5, borderRadius: 1, mb: 2, fontSize: 13 }}>
              <strong>Para:</strong> {datosParaConfirmar.destinatario} &nbsp;|&nbsp;
              <strong>Asunto:</strong> {datosParaConfirmar.asunto}
            </Box>
          )}

          {/* Toggle imagen / HTML */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Tooltip title="Convierte el correo a imagen PNG antes de enviarlo — renderizado idéntico en cualquier cliente de correo">
              <FormControlLabel
                control={
                  <Switch
                    checked={enviarComoImagen}
                    onChange={(e) => setEnviarComoImagen(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {enviarComoImagen
                      ? <><ImageIcon fontSize="small" color="primary" /> <span>Enviar como <strong>imagen</strong></span></>
                      : <><CodeIcon fontSize="small" /> <span>Enviar como <strong>HTML</strong></span></>
                    }
                  </Box>
                }
              />
            </Tooltip>
            <Chip
              size="small"
              label={enviarComoImagen ? 'Recomendado — se ve igual en todos los clientes' : 'Puede variar según el cliente de correo'}
              color={enviarComoImagen ? 'success' : 'warning'}
              variant="outlined"
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Vista previa del correo {enviarComoImagen ? '(se enviará como imagen de esta vista)' : '(se enviará como HTML)'}
          </Typography>

          {/* Preview del correo / Afiche institucional */}
          <Box
            sx={{
              border: '1px solid #dcdfe6',
              borderRadius: 2,
              backgroundColor: '#f4f6f8',
              maxHeight: 460,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              ref={previewRef}
              sx={{
                width: '100%',
                maxWidth: '680px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{
                __html: datosParaConfirmar?.contenidoHTML
                  ? extraerParaPreview(datosParaConfirmar.contenidoHTML)
                  : '',
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1, flexWrap: 'wrap' }}>
          <Button onClick={() => setOpenConfirmDialog(false)} variant="outlined" disabled={loading || copiando}>
            Corregir
          </Button>
          <Button
            onClick={handleCopiarPortapapeles}
            variant="outlined"
            color="secondary"
            disabled={loading || copiando}
            startIcon={copiando ? <CircularProgress size={16} /> : (copiadoExito ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />)}
          >
            {copiando ? 'Copiando...' : (copiadoExito ? '¡Copiado!' : 'Copiar Afiche (Ctrl+V)')}
          </Button>
          <Button
            onClick={handleConfirmarEnvio}
            variant="contained"
            disabled={loading || copiando}
            startIcon={loading ? <CircularProgress size={16} /> : (enviarComoImagen ? <ImageIcon /> : <CodeIcon />)}
          >
            {loading
              ? (enviarComoImagen ? 'Capturando afiche...' : 'Guardando...')
              : `Abrir en Outlook (${enviarComoImagen ? 'Afiche PNG' : 'HTML'})`
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EmailForm;
