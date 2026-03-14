const saveUser = (userData) => {
  localStorage.setItem("token", userData.token);
  localStorage.setItem("user", JSON.stringify({
    _id: userData._id, name: userData.name,
    email: userData.email, isAdmin: userData.isAdmin
  }));
};

const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};

const isLoggedIn = () => !!localStorage.getItem("token");

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
};

const requireLogin = () => {
  if (!isLoggedIn()) window.location.href = "login.html";
};

const updateNavbar = () => {
  const user = getUser();
  const navAuth = document.getElementById("nav-auth");
  const navAdmin = document.getElementById("nav-admin");
  if (!navAuth) return;
  if (user) {
    navAuth.innerHTML = `
      <span style="color:var(--text2);font-size:0.88rem;padding:0 0.5rem;">Hi, ${user.name.split(' ')[0]}</span>
      <a href="orders.html">My Orders</a>
      <a href="#" onclick="logout()" style="color:var(--danger)!important;">Logout</a>
    `;
    if (navAdmin && user.isAdmin) navAdmin.style.display = "flex";
  } else {
    navAuth.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html" style="background:var(--accent);color:white!important;padding:0.4rem 1rem;border-radius:8px;">Register</a>
    `;
  }
};

const showToast = (msg, type = "success") => {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  const icon = type === "success" ? "✓" : "✕";
  toast.innerHTML = `<span style="color:${type==='success'?'var(--success)':'var(--danger)'}">${icon}</span> ${msg}`;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = `toast ${type}`; }, 3000);
};