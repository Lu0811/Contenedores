import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  // Obtener todas las tareas al cargar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar las tareas');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    try {
      await axios.post(`${API_URL}/tasks`, formData);
      setFormData({ title: '', description: '' });
      setError('');
      fetchTasks(); // Recargar las tareas
    } catch (err) {
      setError('Error al crear la tarea');
      console.error('Error creating task:', err);
    }
  };

  const toggleTaskComplete = async (taskId, currentStatus) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, {
        completed: !currentStatus
      });
      fetchTasks(); // Recargar las tareas
    } catch (err) {
      setError('Error al actualizar la tarea');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await axios.delete(`${API_URL}/tasks/${taskId}`);
        fetchTasks(); // Recargar las tareas
      } catch (err) {
        setError('Error al eliminar la tarea');
        console.error('Error deleting task:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Gestor de Tareas</h1>
        <p>Organiza tus actividades de manera eficiente</p>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="task-form">
        <h2>Agregar Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ingresa el título de la tarea"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe los detalles de la tarea (opcional)"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Agregar Tarea
          </button>
        </form>
      </div>

      <div className="tasks-container">
        <div className="tasks-header">
          <h2>Mis Tareas ({tasks.length})</h2>
        </div>

        {loading ? (
          <div className="loading">Cargando tareas...</div>
        ) : tasks.length === 0 ? (
          <div className="no-tasks">
            No tienes tareas registradas. ¡Agrega tu primera tarea arriba!
          </div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="task-item">
              <div className="task-content">
                <div className={`task-title ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </div>
                {task.description && (
                  <div className="task-description">
                    {task.description}
                  </div>
                )}
                <div className="task-date">
                  Creado: {formatDate(task.createdAt)}
                </div>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => toggleTaskComplete(task._id, task.completed)}
                  className="btn btn-success"
                >
                  {task.completed ? 'Desmarcar' : 'Completar'}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
