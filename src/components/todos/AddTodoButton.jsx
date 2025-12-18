export default function AddTodoButton({ onClick }) {
  return (
    <button 
      className="add-btn" 
      aria-label="Add a task"
      onClick={onClick}
    >
      +
    </button>
  );
}