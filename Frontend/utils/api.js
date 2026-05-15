import { useAuthStore } from "../src/store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const TOKEN_KEY = "access_token";

const buildHeaders = (body, customHeaders = {}) => {
  const token = useAuthStore.getState().token || localStorage.getItem(TOKEN_KEY);
  const isFormData = body instanceof FormData;

  return {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
};

const handleTokenExpiration = () => {
  clearAuthToken();
  useAuthStore.getState().logout();
  window.location.href = "/";
};

const request = async (method, endpoint, data, options = {}) => {
  const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: buildHeaders(data, options.headers),
    body,
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      handleTokenExpiration();
      return;
    }
    const error = new Error(result?.message || "API request failed");
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
};

export const api = {
  get: (endpoint, options) => request("GET", endpoint, undefined, options),
  post: (endpoint, data, options) => request("POST", endpoint, data, options),
  put: (endpoint, data, options) => request("PUT", endpoint, data, options),
  delete: (endpoint, options) => request("DELETE", endpoint, undefined, options),
};

export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);

export const login = async (data) => {
  const response = await api.post("/login", data);

  if (response.access_token) {
    setAuthToken(response.access_token);
    useAuthStore.getState().setLogin({
      token: response.access_token,
      user: response.user,
    });
  }

  return response;
};

export const logout = () => {
  clearAuthToken();
  useAuthStore.getState().logout();
};

export const getDashboard = () => api.get("/dashboard");

export const getDepartments = () => api.get("/departments");
export const createDepartment = (data) => api.post("/departments", data);
export const updateDepartment = (id, data) => api.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

export const getNotices = () => api.get("/notices");
export const createNotice = (data) => api.post("/add-notice", data);
export const updateNotice = (id, data) => api.post(`/edit-notice/${id}`, data);
export const deleteNotice = (id) => api.delete(`/delete-notice/${id}`);

export const getTenders = () => api.get("/tenders");
export const createTender = (data) => api.post("/add-tender", data);
export const updateTender = (id, data) => api.post(`/edit-tender/${id}`, data);
export const deleteTender = (id) => api.delete(`/delete-tender/${id}`);

export const getNewsEvents = () => api.get("/news-events");
export const createNewsEvent = (data) => api.post("/add-news-events", data);
export const updateNewsEvent = (id, data) => api.post(`/edit-news-events/${id}`, data);
export const deleteNewsEvent = (id) => api.delete(`/delete-news-events/${id}`);

export const getIlms = () => api.get("/ilms");
export const createIlms = (data) => api.post("/add-ilms", data);
export const updateIlms = (id, data) => api.post(`/edit-ilms/${id}`, data);
export const deleteIlms = (id) => api.delete(`/delete-ilms/${id}`);

export const getResearchProjects = () => api.get("/research-projects");
export const createResearchProject = (data) => api.post("/add-research-project", data);
export const updateResearchProject = (id, data) => api.post(`/edit-research-project/${id}`, data);
export const deleteResearchProject = (id) => api.delete(`/delete-research-project/${id}`);

export const getWorkshopSeminars = () => api.get("/workshop-seminars");
export const createWorkshopSeminar = (data) => api.post("/add-workshop-seminar", data);
export const updateWorkshopSeminar = (id, data) => api.post(`/edit-workshop-seminar/${id}`, data);
export const deleteWorkshopSeminar = (id) => api.delete(`/delete-workshop-seminar/${id}`);

export const getPublications = () => api.get("/publications");
export const createPublication = (data) => api.post("/add-publication", data);
export const updatePublication = (id, data) => api.post(`/edit-publication/${id}`, data);
export const deletePublication = (id) => api.delete(`/delete-publication/${id}`);

export const getAchievements = () => api.get("/achievements");
export const createAchievement = (data) => api.post("/add-achievement", data);
export const updateAchievement = (id, data) => api.post(`/edit-achievement/${id}`, data);
export const deleteAchievement = (id) => api.delete(`/delete-achievement/${id}`);

export const getResearchScholars = () => api.get("/research-scholars");
export const createResearchScholar = (data) => api.post("/add-research-scholar", data);
export const updateResearchScholar = (id, data) => api.post(`/edit-research-scholar/${id}`, data);
export const deleteResearchScholar = (id) => api.delete(`/delete-research-scholar/${id}`);

export const getResearchSupervisors = () => api.get("/research-supervisors");
export const createResearchSupervisor = (data) => api.post("/add-research-supervisor", data);
export const updateResearchSupervisor = (id, data) => api.post(`/edit-research-supervisor/${id}`, data);
export const deleteResearchSupervisor = (id) => api.delete(`/delete-research-supervisor/${id}`);

export const getUsers = () => api.get("/users");
export const createUser = (data) => api.post("/register", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Full data access endpoints (without department filtering)
export const getAllNotices = () => api.get("/admin/notices");
export const getAllTenders = () => api.get("/admin/tenders");
export const getAllNewsEvents = () => api.get("/admin/news-events");
export const getAllIlms = () => api.get("/admin/ilms");
export const getAllResearchProjects = () => api.get("/admin/research-projects");
export const getAllWorkshopSeminars = () => api.get("/admin/workshop-seminars");
export const getAllFaculty = () => api.get("/admin/faculty");
export const getAllPublications = () => api.get("/admin/publications");
export const getAllAchievements = () => api.get("/admin/achievements");
export const getAllScholars = () => api.get("/admin/research-scholars");
export const getAllSupervisors = () => api.get("/admin/research-supervisors");
export const getAllGallery = () => api.get("/admin/photo-gallery");

export default api;
