// /frontend/src/components/TaskCard.js
import React from 'react';

function TaskCard({ task, onUpdateTask, onDeleteTask }) {

  // Funções helper para os botões de mover
  const handleMoveLeft = () => {
    const newStatus = task.status === 'Em Progresso' ? 'A Fazer' : 'Em Progresso';
    onUpdateTask(task, newStatus);
  };

  const handleMoveRight = () => {
    const newStatus = task.status === 'A Fazer' ? 'Em Progresso' : 'Concluídas';
    onUpdateTask(task, newStatus);
  };

  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      
      {task.description && <p>{task.description}</p>}

      <div className="task-actions">
        {/* Lógica para mostrar botões de mover */}
        {task.status !== 'A Fazer' && (
          <button onClick={handleMoveLeft}>&larr; Mover</button> // &larr; é a seta ←
        )}

        {/* O botão de "Editar" do MVP. Usamos 'alert' para simplicidade. */}
        <button onClick={() => alert('Função de Editar: Implementar um Modal!')}>
          Editar
        </button>

        <button className="delete-btn" onClick={() => onDeleteTask(task.id)}>
          Excluir
        </button>

        {task.status !== 'Concluídas' && (
          <button onClick={handleMoveRight}>Mover &rarr;</button> // &rarr; é a seta →
        )}
      </div>
    </div>
  );
}

export default TaskCard;