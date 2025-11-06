// /frontend/src/App.js
import React, { useState, useEffect } from 'react';
import api from './services/api';
import KanbanBoard from './components/KanbanBoard'; // Vamos criar em breve
import './App.css'; // Vamos criar em breve

function App() {
  // --- Estados ---
  // tasks: A lista de tarefas vinda da API
  const [tasks, setTasks] = useState([]); 

  // loading: true quando estamos buscando dados
  const [loading, setLoading] = useState(true); 

  // error: Guarda qualquer mensagem de erro da API
  const [error, setError] = useState(null); 

  // --- Efeito ---
  // useEffect com [] no final roda UMA VEZ quando o componente é montado.
  // Perfeito para buscar dados iniciais.
  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Funções de API ---

  // (R)ead
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      // A API Go retorna 'null' se não houver tarefas. 
      // Garantimos que 'tasks' seja sempre um array.
      setTasks(response.data || []); 
      setError(null); // Limpa erros antigos
    } catch (err) {
      setError('Falha ao buscar tarefas. O servidor backend está rodando?');
      console.error(err);
    } finally {
      setLoading(false); // Para de carregar, independentemente de sucesso ou erro
    }
  };

  // (C)reate
  const handleAddTask = async (title, description) => {
    try {
      const newTask = { title, description, status: 'A Fazer' };
      const response = await api.post('/tasks', newTask);

      // Adiciona a nova tarefa (retornada pela API, com ID) ao estado local
      setTasks([...tasks, response.data]);
    } catch (err) {
      setError('Falha ao adicionar tarefa.');
    }
  };

  // (U)pdate - Usado para mover colunas E editar
  const handleUpdateTask = async (taskToUpdate, newStatus) => {
    const updatedTask = { ...taskToUpdate, status: newStatus };

    try {
      const response = await api.put(`/tasks/${taskToUpdate.id}`, updatedTask);

      // Atualiza o estado local
      // Mapeia as tarefas antigas. Se o ID for o mesmo, substitui pela nova.
      setTasks(tasks.map(t => (t.id === taskToUpdate.id ? response.data : t)));
    } catch (err) {
      setError('Falha ao mover/atualizar tarefa.');
    }
  };

  // (D)elete
  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      // Atualiza o estado local removendo a tarefa
      setTasks(tasks.filter(t => t.id !== id)); 
    } catch (err) {
      setError('Falha ao excluir tarefa.');
    }
  };

  // --- Renderização ---
  return (
    <div className="App">
      <header className="app-header">
        <h1>Mini Kanban</h1>

        {/* Botão simples para adicionar tarefa */}
        <button 
          className="add-task-btn"
          onClick={() => {
            const title = prompt('Título da nova tarefa:');
            if (title) { // Só adiciona se o usuário não cancelar
              const desc = prompt('Descrição (opcional):');
              handleAddTask(title, desc);
            }
          }}
        >
          + Nova Tarefa
        </button>
      </header>

      {/* Feedbacks Visuais (requisito do desafio) */}
      {loading && <p className="feedback-loading">Carregando tarefas...</p>}
      {error && <p className="feedback-error">{error}</p>}

      {/* Só mostra o quadro se não estiver carregando e não tiver erro */}
      {!loading && !error && (
        <KanbanBoard
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default App;