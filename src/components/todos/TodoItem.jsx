import {useState} from 'react';
import dateUtils from '../../utils/dateUtils';

function TodoItem ({todo, onToggle, onDelete, onEdit}) {
    const[isDeleting, setIsDeleting]=useState(false);
    const isOverdue=dateUtils.isTaskOverdue(todo);
    const overdueTime= isOverdue ? dateUtils.getOverdueTime(todo) : null;

    const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 300);
  };

  const handleDoubleClick = () => {
    if (!todo.completed) {
      onEdit(todo.id);
    }
  };

  return (
    <div 
      className={`task-card priority-${todo.priority || 2} ${todo.completed ? 'completed' : ''} ${isDeleting ? 'deleting' : ''} ${isOverdue ? 'overdue' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      <input
        type="checkbox"
        id={`todo-${todo.id}`}
        className="task-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <label className="custom-checkbox" htmlFor={`todo-${todo.id}`}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="transparent">
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
        </svg>
      </label>
      
      <div className="todo-list">
        <label htmlFor={`todo-${todo.id}`} className={`todo-text ${isOverdue ? 'overdue-text' : ''}`}>
          {todo.title}
        </label>
        
        {todo.description && (
          <p className={`task-description ${isOverdue ? 'overdue-text' : ''}`}>
            {todo.description}
          </p>
        )}
        
        {(todo.time || overdueTime) && (
          <span className={`task-time ${isOverdue ? 'overdue-time' : ''}`}>
            {todo.time && dateUtils.formatTime(todo.time)}
            {todo.time && overdueTime && ' • '}
            {overdueTime}
          </span>
        )}
      </div>
      
      <button className="delete-btn" onClick={handleDelete} aria-label="Delete todo">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#fff">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </button>
    </div>
  );
}

export default TodoItem;