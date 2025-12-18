import { useState, useEffect } from 'react';
import PrioritySelector from './PrioritySelector';

function TodoModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialTask = null 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState(2);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setTime(initialTask.time || '');
      setPriority(initialTask.priority || 2);
    } else {
      resetForm();
    }
  }, [initialTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTime('');
    setPriority(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      time: time || null,
      priority,
      completed: false,
    };

    onSubmit(taskData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal" id="task-modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <h3 id="modal-title">
          {initialTask ? 'Edit Task' : 'Add New Task'}
        </h3>
        
        <form id="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              type="text"
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="task-time">Time</label>
            <input
              type="time"
              id="task-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Priority</label>
            <PrioritySelector
              selectedPriority={priority}
              onPriorityChange={setPriority}
            />
          </div>
          
          <div className="modal-buttons">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {initialTask ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoModal;