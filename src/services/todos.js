const XANO_TODO_URL = "https://x8ki-letl-twmt.n7.xano.io/api:ksKp7BtD";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${XANO_TODO_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }
  
  return response.json();
}

export async function getTodos() {
  return request("/todo");
}

export async function createTodo(todoData) {
  return request("/todo", {
    method: "POST",
    body: JSON.stringify(todoData),
  });
}

export async function updateTodo(id, updates) {
  return request(`/todo/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteTodo(id) {
  return request(`/todo/${id}`, {
    method: "DELETE",
  });
}