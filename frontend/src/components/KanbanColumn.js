// /frontend/src/components/KanbanColumn.js
import React from 'react';
import TaskCard from './TaskCard';

function KanbanColumn({ status, tasks, onUpdateTask, onDeleteTask }) {
  return (
    <div className="kanban-column">
      {/* Título da Coluna */}
      <h3>{status} <span className="task-count">({tasks.length})</span></h3>

      {/* Lista de Tarefas */}
      <div className="tasks-list">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
        {/* Mensagem se a coluna estiver vazia */}
        {tasks.length === 0 && <p className="empty-column-msg">Vazio</p>}
      </div>
    </div>
  );
}

export default KanbanColumn;
