// /frontend/src/components/KanbanBoard.js
import React from 'react';
import KanbanColumn from './KanbanColumn';

// As colunas fixas do nosso quadro
const COLUMNS = ['A Fazer', 'Em Progresso', 'Concluídas'];

function KanbanBoard({ tasks, onUpdateTask, onDeleteTask }) {

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map(status => (
        <KanbanColumn
          key={status} 
          status={status}
          tasks={getTasksByStatus(status)} 
          onUpdateTask={onUpdateTask}     
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;