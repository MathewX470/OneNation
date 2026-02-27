import { create } from "zustand";

const commonStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  staffId: localStorage.getItem("staffId") || null,
  department: localStorage.getItem("department") || null,

  setTokenandRole: (token, role, department = "", staffId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    if (department) {
      localStorage.setItem("department", department);
    }
    if (staffId) {
      localStorage.setItem("staffId", staffId);
    }

    set({
      token,
      role,
      department: department || null,
      staffId: staffId || null,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("department");
    localStorage.removeItem("staffId");

    set({
      token: null,
      role: null,
      department: null,
      staffId: null,
    });
  },
}));

export default commonStore;
