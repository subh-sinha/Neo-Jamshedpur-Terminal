import api from "./client";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload).then((res) => res.data),
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data),
  me: () => api.get("/auth/me").then((res) => res.data),
  updateProfile: (payload) => api.put("/auth/profile", payload).then((res) => res.data),
  resetPassword: (payload) => api.post("/auth/reset-password", payload).then((res) => res.data)
};

export const jobsApi = {
  list: (params) => api.get("/jobs", { params }).then((res) => res.data),
  detail: (id) => api.get(`/jobs/${id}`).then((res) => res.data),
  create: (payload) => api.post("/jobs", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/jobs/${id}`, payload).then((res) => res.data),
  myJobs: () => api.get("/jobs/mine/listings").then((res) => res.data),
  myApplications: () => api.get("/jobs/mine/applications").then((res) => res.data),
  apply: (id, payload) => api.post(`/jobs/${id}/apply`, payload).then((res) => res.data),
  decideApplication: (jobId, applicationId, payload) =>
    api.post(`/jobs/${jobId}/applications/${applicationId}/decision`, payload).then((res) => res.data),
  updateStatus: (id, payload) => api.post(`/jobs/${id}/status`, payload).then((res) => res.data),
  dispute: (id, payload) => api.post(`/jobs/${id}/dispute`, payload).then((res) => res.data),
  cancel: (id, payload) => api.post(`/jobs/${id}/cancel`, payload).then((res) => res.data),
  delete: (id) => api.delete(`/jobs/${id}`).then((res) => res.data)
};

export const tradesApi = {
  list: (params) => api.get("/trades", { params }).then((res) => res.data),
  detail: (id) => api.get(`/trades/${id}`).then((res) => res.data),
  create: (payload) => api.post("/trades", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/trades/${id}`, payload).then((res) => res.data),
  myTrades: () => api.get("/trades/mine/listings").then((res) => res.data),
  history: () => api.get("/trades/history/all").then((res) => res.data),
  createOffer: (tradeId, payload) => api.post(`/trades/${tradeId}/offers`, payload).then((res) => res.data),
  getOffer: (tradeId, offerId) => api.get(`/trades/${tradeId}/offers/${offerId}`).then((res) => res.data),
  counterOffer: (tradeId, offerId, payload) => api.post(`/trades/${tradeId}/offers/${offerId}/counter`, payload).then((res) => res.data),
  acceptOffer: (tradeId, offerId) => api.post(`/trades/${tradeId}/offers/${offerId}/accept`).then((res) => res.data),
  rejectOffer: (tradeId, offerId) => api.post(`/trades/${tradeId}/offers/${offerId}/reject`).then((res) => res.data),
  delete: (id) => api.delete(`/trades/${id}`).then((res) => res.data)
};

export const pulseApi = {
  list: (params) => api.get("/pulse", { params }).then((res) => res.data),
  detail: (id) => api.get(`/pulse/${id}`).then((res) => res.data),
  create: (payload) => api.post("/pulse", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/pulse/${id}`, payload).then((res) => res.data),
  react: (id, payload) => api.post(`/pulse/${id}/react`, payload).then((res) => res.data),
  bookmark: (id) => api.post(`/pulse/${id}/bookmark`).then((res) => res.data),
  saved: () => api.get("/pulse/saved/me").then((res) => res.data),
  history: () => api.get("/pulse/history/me").then((res) => res.data),
  moderate: (id, payload) => api.post(`/pulse/${id}/moderate`, payload).then((res) => res.data),
  delete: (id) => api.delete(`/pulse/${id}`).then((res) => res.data)
};

export const notificationApi = {
  list: () => api.get("/notifications").then((res) => res.data),
  readAll: () => api.post("/notifications/read-all").then((res) => res.data)
};

export const userApi = {
  get: (id) => api.get(`/users/${id}`).then((res) => res.data),
  activity: (id) => api.get(`/users/${id}/activity`).then((res) => res.data),
  reputation: (id) => api.get(`/users/${id}/reputation`).then((res) => res.data)
};

export const adminApi = {
  analytics: () => api.get("/admin/analytics").then((res) => res.data),
  users: () => api.get("/admin/users").then((res) => res.data)
};

export const searchApi = {
  global: (q) => api.get("/search", { params: { q } }).then((res) => res.data)
};
