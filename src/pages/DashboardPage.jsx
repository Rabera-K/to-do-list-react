// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import useTodos from "../hooks/useTodos";
import dateUtils from "../utils/dateUtils";
import Header from "../components/layout/Header";
import CalendarMini from "../components/calendar/CalendarMini";
import TodoList from "../components/todos/TodoList";
import CompletedSection from "../components/todos/CompletedSection";
import EmptyState from "../components/todos/EmptyState";
import AddTodoButton from "../components/todos/AddTodoButton";
import TodoModal from "../components/todos/TodoModal";
import CalendarModal from "../components/calendar/CalendarModal";

function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(2);

  const { logout, user } = useAuthContext();
  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
  } = useTodos();

  const navigate = useNavigate();

  // // Redirect if not logged in
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [user, navigate]);

  // Notification system
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      const overdueTasks = todos.filter(
        (task) => !task.completed && dateUtils.isTaskOverdue(task)
      );

      // Only log if there are actually overdue tasks
      if (overdueTasks.length > 0) {
        console.log(`Found ${overdueTasks.length} overdue tasks`);
        // You can implement notifications
      }
    };

    // Check immediately
    checkOverdueTasks();

    // Check every 5 minutes
    const interval = setInterval(checkOverdueTasks, 5 * 60000);
    return () => clearInterval(interval);
  }, [todos]);

  // Filter tasks for selected date
  const filteredTodos = todos.filter((task) =>
    dateUtils.isSameDay(new Date(task.date), selectedDate)
  );

  // Separate active and completed tasks
  const activeTasks = filteredTodos.filter((task) => !task.completed);
  const completedTasks = filteredTodos.filter((task) => task.completed);

  // Sort active tasks: overdue first, then others
  const overdueTasks = activeTasks.filter((task) =>
    dateUtils.isTaskOverdue(task)
  );
  const nonOverdueTasks = activeTasks.filter(
    (task) => !dateUtils.isTaskOverdue(task)
  );
  const sortedActiveTasks = [...overdueTasks, ...nonOverdueTasks];

  // Handlers
  const handleAddTask = async (taskData) => {
    try {
      const todoData = {
        ...taskData,
        date: selectedDate,
        completed: false,
      };

      await addTodo(todoData);
      setShowTaskModal(false);
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("Failed to save task. Please try again.");
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      await updateTodo(editingTask.id, taskData);
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTodo(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  const handleEditClick = (taskId) => {
    const task = todos.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setSelectedPriority(task.priority || 2);
      setShowTaskModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading && todos.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Tasks</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      {/* Fixed position logout button */}
      <button className="logout-btn" id="logoutBtn" onClick={logout}>
        Logout ({user.name})
      </button>

      <main className="todo-main">
        <Header
          selectedDate={selectedDate}
          onCalendarClick={() => setShowCalendarModal(true)}
          onLogout={handleLogout}
        />

        <CalendarMini
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Active Tasks Section */}
        <div id="active-tasks">
          <TodoList
            todos={sortedActiveTasks}
            onToggle={toggleTodoCompletion}
            onDelete={handleDeleteTask}
            onEdit={handleEditClick}
          />
        </div>

        {/* Completed Tasks Section */}
        <CompletedSection
          tasks={completedTasks}
          onToggle={toggleTodoCompletion}
          onDelete={handleDeleteTask}
          onEdit={handleEditClick}
          count={completedTasks.length}
        />

        {/* Empty State */}
        {filteredTodos.length === 0 && <EmptyState />}

        {/* Add Task Button */}
        <AddTodoButton
          onClick={() => {
            setEditingTask(null);
            setSelectedPriority(2);
            setShowTaskModal(true);
          }}
        />

        {/* Task Modal */}
        <TodoModal
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          initialTask={editingTask}
        />

        {/* Calendar Modal */}
        <CalendarModal
          isOpen={showCalendarModal}
          onClose={() => setShowCalendarModal(false)}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </main>
    </>
  );
}
export default DashboardPage;
