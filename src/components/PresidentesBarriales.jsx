import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const PresidentesBarriales = () => {
  const { user, token } = useAuth();
  const [presidentes, setPresidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPresidente, setEditingPresidente] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({ total: 0, activos: 0, inactivos: 0 });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    barrio: '',
    direccion: '',
    password: '',
    estado: 'activo',
    descripcion: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    loadPresidentes();
    loadStats();
  }, []);

  const loadPresidentes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/presidentes-barriales`, {
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPresidentes(data.presidentes || []);
      } else {
        throw new Error('Error al cargar presidentes barriales');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Error al cargar los presidentes barriales', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/presidentes-barriales/stats`, {
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleOpenDialog = (presidente = null) => {
    if (presidente) {
      setEditingPresidente(presidente);
      setFormData({
        nombre: presidente.nombre,
        apellido: presidente.apellido,
        cedula: presidente.cedula,
        telefono: presidente.telefono,
        email: presidente.email,
        barrio: presidente.barrio,
        direccion: presidente.direccion,
        password: '',
        estado: presidente.estado,
        descripcion: presidente.descripcion || ''
      });
    } else {
      setEditingPresidente(null);
      setFormData({
        nombre: '',
        apellido: '',
        cedula: '',
        telefono: '',
        email: '',
        barrio: '',
        direccion: '',
        password: '',
        estado: 'activo',
        descripcion: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPresidente(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = editingPresidente 
        ? `${API_BASE_URL}/presidentes-barriales/${editingPresidente.id}`
        : `${API_BASE_URL}/presidentes-barriales`;
      
      const method = editingPresidente ? 'PUT' : 'POST';
      const body = editingPresidente 
        ? { ...formData, password: formData.password || undefined }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const message = editingPresidente 
          ? 'Presidente barrial actualizado exitosamente'
          : 'Presidente barrial creado exitosamente';
        showSnackbar(message, 'success');
        handleCloseDialog();
        loadPresidentes();
        loadStats();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la operación');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(error.message || 'Error en la operación', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este presidente barrial?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/presidentes-barriales/${id}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showSnackbar('Presidente barrial eliminado exitosamente', 'success');
        loadPresidentes();
        loadStats();
      } else {
        throw new Error('Error al eliminar el presidente barrial');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Error al eliminar el presidente barrial', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCall = (telefono) => {
    window.open(`tel:${telefono}`, '_blank');
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleLocation = (direccion) => {
    const encodedAddress = encodeURIComponent(direccion);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          <BusinessIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Presidentes Barriales
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#8B4513', '&:hover': { backgroundColor: '#654321' } }}
        >
          Nuevo Presidente
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Presidentes
              </Typography>
              <Typography variant="h4" component="div">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Activos
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {stats.activos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Inactivos
              </Typography>
              <Typography variant="h4" component="div" color="error.main">
                {stats.inactivos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Barrio</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {presidentes.map((presidente) => (
              <TableRow key={presidente.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PersonIcon sx={{ mr: 1, color: '#8B4513' }} />
                    <Box>
                      <Typography variant="subtitle2">
                        {presidente.nombre} {presidente.apellido}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        C.I: {presidente.cedula}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={presidente.barrio} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {presidente.telefono}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCall(presidente.telefono)}
                      color="success"
                    >
                      <PhoneIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {presidente.email}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEmail(presidente.email)}
                      color="primary"
                    >
                      <EmailIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={presidente.estado} 
                    size="small" 
                    color={presidente.estado === 'activo' ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleLocation(presidente.direccion)}
                      color="warning"
                      title="Ver ubicación"
                    >
                      <LocationIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(presidente)}
                      color="primary"
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(presidente.id)}
                      color="error"
                      title="Eliminar"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPresidente ? 'Editar Presidente Barrial' : 'Nuevo Presidente Barrial'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cédula"
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                required
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Barrio"
                name="barrio"
                value={formData.barrio}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                required
                multiline
                rows={2}
              />
            </Grid>
            {!editingPresidente && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingPresidente}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  label="Estado"
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción (opcional)"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ backgroundColor: '#8B4513', '&:hover': { backgroundColor: '#654321' } }}
          >
            {editingPresidente ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PresidentesBarriales;
