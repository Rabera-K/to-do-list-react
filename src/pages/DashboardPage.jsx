import { useState, useEffect } from 'react';
// import Header from '../components/layout/Header';
// import CalendarMini from '../components/calendar/CalendarMini';
import TodoList from '../components/todos/TodoList';
import CompletedSection from '../components/todos/CompletedSection';
import EmptyState from '../components/todos/EmptyState';
import AddTodoButton from '../components/todos/AddTodoButton';
import TodoModal from '../components/todos/TodoModal';
// import CalendarModal from '../components/calendar/CalendarModal';
import  useTodos  from '../hooks/useTodos';
import useAuth from '../hooks/useAuth';
import  dateUtils  from '../utils/dateUtils';
// import { useNotification } from '../hooks/useNotification';

function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(2);
  
  const { todos, loading, error, addTodo, updateTodo, deleteTodo, toggleTodoCompletion } = useTodos();
  const { logout } = useAuth();
  
  // Filter tasks for selected date
  const filteredTodos = todos.filter(task => 
    dateUtils.isSameDay(new Date(task.date), selectedDate)
  );
  
  const activeTasks = filteredTodos.filter(task => !task.completed);
  const completedTasks = filteredTodos.filter(task => task.completed);
  
  // Overdue tasks calculation
  const overdueTasks = activeTasks.filter(task => dateUtils.isTaskOverdue(task));
  const nonOverdueTasks = activeTasks.filter(task => !dateUtils.isTaskOverdue(task));
  const sortedActiveTasks = [...overdueTasks, ...nonOverdueTasks];
  
  const handleAddTask = async (taskData) => {
    const todoData = {
      ...taskData,
      priority: selectedPriority,
      date: selectedDate,
    };
    
    await addTodo(todoData);
    setShowTaskModal(false);
  };
  
  const handleEditTask = (taskId) => {
    const task = todos.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setSelectedPriority(task.priority || 2);
      setShowTaskModal(true);
    }
  };
  
  const handleUpdateTask = async (taskData) => {
    await updateTodo(editingTask.id, {
      ...taskData,
      priority: selectedPriority,
    });
    setShowTaskModal(false);
    setEditingTask(null);
  };
  
  useNotification(todos); // Your notification system
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <main className="todo-main">
      <Header 
        selectedDate={selectedDate}
        onCalendarClick={() => setShowCalendarModal(true)}
        onLogout={logout}
      />
      
      <CalendarMini 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      <div id="active-tasks">
        <TodoList 
          todos={sortedActiveTasks}
          onToggle={toggleTodoCompletion}
          onDelete={deleteTodo}
          onEdit={handleEditTask}
        />
      </div>
      
      <CompletedSection 
        tasks={completedTasks}
        onToggle={toggleTodoCompletion}
        onDelete={deleteTodo}
        count={completedTasks.length}
      />
      
      {filteredTodos.length === 0 && <EmptyState />}
      
      <AddTodoButton onClick={() => {
        setEditingTask(null);
        setShowTaskModal(true);
      }} />
      
      {showTaskModal && (
        <TodoModal
          task={editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? handleUpdateTask : handleAddTask}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
        />
      )}
      
      {showCalendarModal && (
        <CalendarModal
          selectedDate={selectedDate}
          onClose={() => setShowCalendarModal(false)}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setShowCalendarModal(false);
          }}
        />
      )}
    </main>
  );
}

export default DashboardPage;