import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiService } from '../utils/apiService';

const AdminOpciones = () => {
  const [opciones, setOpciones] = useState({});
  const [selectedCategoria, setSelectedCategoria] = useState('Norma');
  const [nuevaOpcion, setNuevaOpcion] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const categorias = ['Norma', 'Alcance', 'Modalidad', 'Auditor', 'Tipo'];

  // Cargar opciones al montar
  useEffect(() => {
    cargarOpciones();
  }, []);

  const cargarOpciones = async () => {
    try {
      const data = await apiService.obtenerOpciones();
      setOpciones(data);
    } catch (error) {
      console.error('Error cargando opciones:', error);
      // Usar opciones por defecto si hay error
      setOpciones({
        Norma: ['NOP', 'RTPO', '848PT', 'JAS', 'BIOSUISSE', 'LPO', 'GLOBALG.A.P.'],
        Alcance: ['Producción', 'Procesamiento', 'Empaque', 'Almacenamiento', 'Transporte'],
        Modalidad: ['Presencial', 'Remota', 'Híbrida'],
        Auditor: ['Auditor 1', 'Auditor 2', 'Auditor 3', 'Auditor 4'],
        Tipo: ['Inicial', 'Seguimiento', 'Cambio de alcance', 'Re-certificación'],
      });
    }
  };

  const agregarOpcion = async () => {
    if (!nuevaOpcion.trim()) {
      setMessageType('error');
      setMessage('❌ Ingresa una opción válida');
      return;
    }

    if (opciones[selectedCategoria]?.includes(nuevaOpcion)) {
      setMessageType('error');
      setMessage('❌ Esta opción ya existe');
      return;
    }

    try {
      const opcionGuardada = nuevaOpcion;
      await apiService.agregarOpcion(selectedCategoria, opcionGuardada);
      setOpciones({
        ...opciones,
        [selectedCategoria]: [
          ...(opciones[selectedCategoria] || []),
          opcionGuardada,
        ],
      });
      setMessageType('success');
      setMessage(`✅ Opción "${opcionGuardada}" agregada a ${selectedCategoria}`);
      setNuevaOpcion('');
    } catch (error) {
      console.error('Error:', error);
      setMessageType('error');
      setMessage('❌ Error de conexión');
    }
  };

  const eliminarOpcion = async (categoria, opcion) => {
    try {
      await apiService.eliminarOpcion(categoria, opcion);
      setOpciones({
        ...opciones,
        [categoria]: opciones[categoria].filter(o => o !== opcion),
      });
      setMessageType('success');
      setMessage(`✅ Opción "${opcion}" eliminada`);
    } catch (error) {
      console.error('Error:', error);
      setMessageType('error');
      setMessage('❌ Error al eliminar la opción');
    }
  };

  return (
    <Card sx={{ maxWidth: 900, margin: '2rem auto' }}>
      <CardHeader title="⚙️ Administrar Opciones de Desplegables" />
      <CardContent>
        {message && <Alert severity={messageType} sx={{ mb: 2 }}>{message}</Alert>}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Selecciona Categoría</InputLabel>
          <Select
            value={selectedCategoria}
            label="Selecciona Categoría"
            onChange={(e) => setSelectedCategoria(e.target.value)}
          >
            {categorias.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Nueva opción"
              value={nuevaOpcion}
              onChange={(e) => setNuevaOpcion(e.target.value)}
              placeholder="Ej: Nueva Norma"
              fullWidth
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  agregarOpcion();
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={agregarOpcion}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Agregar
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {opciones[selectedCategoria]?.map((opcion, idx) => (
              <Chip
                key={idx}
                label={opcion}
                onDelete={() => eliminarOpcion(selectedCategoria, opcion)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Alert severity="info">
          <strong>💡 Cómo usar:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>Selecciona una categoría (Norma, Alcance, Auditor, etc.)</li>
            <li>Escribe una nueva opción y presiona Enter o haz clic en "Agregar"</li>
            <li>Haz clic en el chip (X) para eliminar una opción</li>
            <li>Los cambios se guardan automáticamente en la base de datos</li>
          </ul>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AdminOpciones;
