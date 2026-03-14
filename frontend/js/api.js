const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const apiRequest = async (endpoint, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  if (getToken()) headers["Authorization"] = `Bearer ${getToken()}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

const authAPI = {
  register: (data) => apiRequest("/auth/register", "POST", data),
  login:    (data) => apiRequest("/auth/login", "POST", data),
  getMe:    ()     => apiRequest("/auth/me")
};

const productAPI = {
  getAll:  (query = "") => apiRequest(`/products${query}`),
  getOne:  (id)         => apiRequest(`/products/${id}`),
  create:  (data)       => apiRequest("/products", "POST", data),
  update:  (id, data)   => apiRequest(`/products/${id}`, "PUT", data),
  remove:  (id)         => apiRequest(`/products/${id}`, "DELETE")
};

const cartAPI = {
  validate: (items) => apiRequest("/cart/validate", "POST", { items })
};

const orderAPI = {
  create:       (data)       => apiRequest("/orders", "POST", data),
  getMyOrders:  ()           => apiRequest("/orders/myorders"),
  getAll:       ()           => apiRequest("/orders"),
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, "PUT", { status })
};