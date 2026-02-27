import { create } from "zustand";

const commonStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  department: localStorage.getItem("department") || null,

  setTokenandRole: (token, role, department = "") => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (department) {
      localStorage.setItem("department", department);
    }

    set({
      token,
      role,
      department: department || null,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("department");

    set({
      token: null,
      role: null,
      department: null,
    });
  },
}));

export default commonStore;