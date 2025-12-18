const XANO_BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:g9e8m6-t";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
}

export async function signup(userData) {
  return request(`${XANO_BASE_URL}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function login(email, password) {
  return request(`${XANO_BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
