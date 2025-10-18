import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const result = await login(username, password);
      
      if (result.success) {
        // Redirigir según el rol
        const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
        
        if (userRoles.includes('Superadministrador')) {
          navigate('/admin-dashboard');
        } else if (userRoles.includes('TIC')) {
          navigate('/tic-dashboard');
        } else if (userRoles.includes('Comunicación')) {
          navigate('/comunicacion-dashboard');
        } else if (userRoles.includes('Participación Ciudadana')) {
          navigate('/dashboard');
        } else if (userRoles.includes('Transparencia')) {
          navigate('/transparencia-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || "Error en el inicio de sesión");
      }
    } catch (err) {
      setError("Error interno del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Header className="text-center">
          <h3>GAD Pajan</h3>
          <p className="text-muted">Sistema de Gestión Documental</p>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                name="username"
                type="text"
                placeholder="Ingrese su usuario"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Ingrese su contraseña"
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Form>

          <div className="mt-3 text-center">
            <small className="text-muted">
              <strong>Usuarios de prueba:</strong><br />
              admin / password123 (Superadministrador)<br />
              comunicacion / password123 (Comunicación)<br />
              transparencia / password123 (Transparencia)<br />
              tic / password123 (TIC)<br />
              participacion / password123 (Participación Ciudadana)
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
