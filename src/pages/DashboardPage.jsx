import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import  useTodos  from '../hooks/useTodos';

function DashboardPage() {
  const { user, logout } = useAuthContext();
  const { todos, loading, error } = useTodos();

  useEffect(() => {
    // You can fetch todos here or in the useTodos hook
  }, []);

  if (loading) {
    return <div>Loading todos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
      <div>
        <h2>Your Todos</h2>
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;