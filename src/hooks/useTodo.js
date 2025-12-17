import {useState, useEffect, useCallback} from 'react';
import {getTodo, createTodo, updateTodo, deleteTodo} from '../services/todos.js';
import dateUtils from'../utils/dateUtils';

function useTodos(){
    const[todos, setTodos]=useState([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);


const fetchTodos=useCallback(sync ()=>{
    try{
        setLoading(true);
    const tasksData = await todoService.getTodos();
      
      const transformedTasks = tasksData.map((task) => ({
        ...task,
        completed: task.completed,
        date: new Date(task.created_at),
        time: task.time ? dateUtils.timestampToTimeString(task.time) : "",
      }));

      setTodos(transformedTasks);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (todoData) => {
    try {
      const xanoTask = {
        title: todoData.title,
        description: todoData.description,
        priority: todoData.priority,
        completed: false,
        time: todoData.time ? dateUtils.timeStringToTimestamp(todoData.time, todoData.date) : null,
      };

      const savedTask = await todoService.createTodo(xanoTask);
      
      const newTodo = {
        ...savedTask,
        date: new Date(savedTask.created_at),
        time: savedTask.time ? dateUtils.timestampToTimeString(savedTask.time) : "",
      };

      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (id, updates) => {
    try {
      const xanoUpdates = {};
      if (updates.title !== undefined) xanoUpdates.title = updates.title;
      if (updates.description !== undefined) xanoUpdates.description = updates.description;
      if (updates.completed !== undefined) xanoUpdates.completed = updates.completed;
      if (updates.priority !== undefined) xanoUpdates.priority = updates.priority;
      if (updates.time !== undefined) {
        xanoUpdates.time = updates.time
          ? dateUtils.timeStringToTimestamp(updates.time, updates.date || new Date())
          : null;
      }

      const updatedTask = await todoService.updateTodo(id, xanoUpdates);
      
      const transformedTask = {
        ...updatedTask,
        completed: updatedTask.completed,
        date: new Date(updatedTask.created_at),
        time: updatedTask.time ? dateUtils.timestampToTimeString(updatedTask.time) : "",
      };

      setTodos(prev => prev.map(todo => 
        todo.id === id ? transformedTask : todo
      ));

      return transformedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const toggleTodoCompletion = useCallback(async (id) => {
    const task = todos.find(t => t.id === id);
    if (!task) return;

    const newCompletedStatus = !task.completed;
    
    try {
      await updateTodo(id, { completed: newCompletedStatus });
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  }, [todos, updateTodo]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
    refetch: fetchTodos,
  };
}

export default useTodo;