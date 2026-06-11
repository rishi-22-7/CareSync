import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/admin/login", { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post("/admin/register", { name, email, password });
    return response.data;
  },
  changePassword: async (adminId, oldPassword, newPassword) => {
    const response = await api.post("/admin/change-password", {
      admin_id: adminId,
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

export const patientService = {
  getPatients: async (adminId) => {
    const response = await api.get(`/patients/${adminId}`);
    return response.data;
  },
  createPatient: async (patientData) => {
    const response = await api.post("/patients", patientData);
    return response.data;
  },
  updatePatient: async (patientId, updateData) => {
    const response = await api.put(`/patients/${patientId}`, updateData);
    return response.data;
  },
  deletePatient: async (patientId) => {
    const response = await api.delete(`/patients/${patientId}`);
    return response.data;
  },
};

export const medicationService = {
  getMedications: async (patientId) => {
    const response = await api.get(`/medications/${patientId}`);
    return response.data;
  },
  createMedication: async (medicationData) => {
    const response = await api.post("/medications", medicationData);
    return response.data;
  },
  updateMedication: async (medicationId, updateData) => {
    const response = await api.put(`/medications/${medicationId}`, updateData);
    return response.data;
  },
  deleteMedication: async (medicationId) => {
    const response = await api.delete(`/medications/${medicationId}`);
    return response.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.image_url;
  },
};

export const configService = {
  getSandboxKeyword: async () => {
    const response = await api.get("/api/config");
    return response.data.twilio_sandbox_keyword;
  },
};

export default api;
