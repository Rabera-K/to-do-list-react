import TodoItem from './TodoItem';


function TodoList({ 
  todos, 
  onToggle, 
  onDelete, 
  onEdit 
}) {
  if (todos.length === 0) {
    return null; // Will be handled by EmptyState
  }

  return (
    <div className="todo-list-container">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default TodoList;