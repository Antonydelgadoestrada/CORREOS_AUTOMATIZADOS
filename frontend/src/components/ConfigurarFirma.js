import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Alert,
  Paper,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiService } from '../utils/apiService';

const ConfigurarFirma = () => {
  const fileInputRef = useRef(null);
  const [firma, setFirma] = useState({
    nombre: '',
    cargo: '',
    empresa_nombre: '',
    telefono: '',
    email: '',
    web: '',
    contenido_html: '',
    imagen_base64: null,
    nombre_imagen: '',
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [previewImagen, setPreviewImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar firma al montar
  useEffect(() => {
    cargarFirma();
  }, []);

  const cargarFirma = async () => {
    try {
      const data = await apiService.obtenerFirma();
      if (data) {
        setFirma(data);
        if (data.imagen_base64) {
          setPreviewImagen(data.imagen_base64);
        }
      }
    } catch (error) {
      console.error('Error cargando firma:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFirma({
      ...firma,
      [name]: value,
    });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage('La imagen no debe exceder 2MB');
        setMessageType('error');
        return;
      }

      // Validar tipo
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setMessage('Solo se aceptan archivos JPG, PNG, GIF o WEBP');
        setMessageType('error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImagen(event.target.result);
        setFirma({
          ...firma,
          imagen_base64: event.target.result,
          nombre_imagen: file.name,
        });
        setMessage('Imagen cargada exitosamente');
        setMessageType('success');
        setTimeout(() => setMessage(null), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEliminarImagen = () => {
    setPreviewImagen(null);
    setFirma({
      ...firma,
      imagen_base64: null,
      nombre_imagen: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMessage('Imagen eliminada');
    setMessageType('info');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleGuardar = async () => {
    try {
      setLoading(true);

      if (!firma.nombre || !firma.cargo || !firma.empresa_nombre) {
        setMessage('Por favor completa los campos: Nombre, Cargo y Empresa');
        setMessageType('error');
        setLoading(false);
        return;
      }

      const response = await apiService.actualizarFirma(firma);
      
      setMessage('Firma guardada exitosamente');
      setMessageType('success');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error guardando firma:', error);
      setMessage('Error al guardar la firma');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="Configurar Firma de Empresa"
          subheader="Personaliza tu firma que aparecerá en todos los correos enviados"
        />
        <Divider />
        <CardContent>
          {message && (
            <Alert
              severity={messageType}
              onClose={() => setMessage(null)}
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Sección de datos personales */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                📋 Información Personal
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    name="nombre"
                    value={firma.nombre}
                    onChange={handleInputChange}
                    placeholder="ej: Juan García López"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cargo"
                    name="cargo"
                    value={firma.cargo}
                    onChange={handleInputChange}
                    placeholder="ej: Auditor Senior"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Sección de datos empresa */}
            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 'bold' }}>
                🏢 Información de Empresa
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre de Empresa"
                    name="empresa_nombre"
                    value={firma.empresa_nombre}
                    onChange={handleInputChange}
                    placeholder="ej: AGROCERT SAC"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={firma.telefono}
                    onChange={handleInputChange}
                    placeholder="ej: +51 987 654 321"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={firma.email}
                    onChange={handleInputChange}
                    placeholder="ej: contacto@agrocert.com"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sitio Web (Opcional)"
                    name="web"
                    value={firma.web}
                    onChange={handleInputChange}
                    placeholder="ej: www.agrocert.com"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Sección de imagen */}
            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 'bold' }}>
                🖼️ Logo/Imagen de Firma
              </Typography>
              <Box sx={{ mb: 2 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Subir Imagen (JPG, PNG, GIF - Máx 2MB)
                </Button>
                {firma.nombre_imagen && (
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                    📁 {firma.nombre_imagen}
                  </Typography>
                )}
              </Box>

              {previewImagen && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Vista previa:
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      textAlign: 'center',
                      maxWidth: '300px',
                    }}
                  >
                    <img
                      src={previewImagen}
                      alt="Vista previa"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '150px',
                        objectFit: 'contain',
                      }}
                    />
                  </Paper>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleEliminarImagen}
                    sx={{ mt: 1 }}
                  >
                    Eliminar Imagen
                  </Button>
                </Box>
              )}
            </Grid>

            {/* Sección de contenido HTML personalizado */}
            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 'bold' }}>
                💬 Contenido Personalizado (Opcional)
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'gray' }}>
                Agrega texto adicional que aparecerá en la firma (puedes usar HTML básico)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Contenido HTML"
                name="contenido_html"
                value={firma.contenido_html}
                onChange={handleInputChange}
                placeholder='ej: <p>Certified by ISO 17021</p>'
              />
            </Grid>

            {/* Vista previa de firma */}
            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 'bold' }}>
                👁️ Vista Previa de Firma
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: '#fafafa',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {firma.nombre}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  {firma.cargo}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">{firma.empresa_nombre}</Typography>
                {firma.telefono && (
                  <Typography variant="caption">
                    ☎️ {firma.telefono}
                  </Typography>
                )}
                {firma.email && (
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    📧 {firma.email}
                  </Typography>
                )}
                {firma.web && (
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    🌐 {firma.web}
                  </Typography>
                )}
                {previewImagen && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={previewImagen}
                      alt="Logo firma"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100px',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                )}
                {firma.contenido_html && (
                  <Box
                    sx={{ mt: 2 }}
                    dangerouslySetInnerHTML={{ __html: firma.contenido_html }}
                  />
                )}
              </Paper>
            </Grid>

            {/* Botón de guardar */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleGuardar}
                disabled={loading}
                fullWidth
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {loading ? 'Guardando...' : 'Guardar Firma'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConfigurarFirma;
