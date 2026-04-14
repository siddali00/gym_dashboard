const BASE = "/api";

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore del server");
  return data;
}

export const api = {
  register: (body: any) => request<any>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: any) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request<any>("/auth/logout", { method: "POST" }),
  me: () => request<any>("/auth/me"),

  updateProfile: (body: any) => request<any>("/profile", { method: "PUT", body: JSON.stringify(body) }),

  getMetrics: () => request<any[]>("/metrics"),
  addMetric: (body: any) => request<any>("/metrics", { method: "POST", body: JSON.stringify(body) }),
  updateMetric: (id: number, body: any) => request<any>(`/metrics/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteMetric: (id: number) => request<any>(`/metrics/${id}`, { method: "DELETE" }),

  getFoodDaysCount: () => request<{ count: number }>("/food/days-count"),
  getFoodDay: (date: string) => request<any>(`/food/day/${date}`),
  saveFoodDay: (date: string, meals: any) => request<any>(`/food/day/${date}`, { method: "PUT", body: JSON.stringify({ meals }) }),
  getCustomFoods: () => request<any[]>("/food/custom-foods"),
  addCustomFood: (body: any) => request<any>("/food/custom-foods", { method: "POST", body: JSON.stringify(body) }),

  getReports: () => request<any[]>("/reports"),
  uploadReport: (formData: FormData) =>
    fetch(`${BASE}/reports`, { method: "POST", credentials: "include", body: formData }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      return d;
    }),

  getAppointments: () => request<any[]>("/appointments"),
  addAppointment: (body: any) => request<any>("/appointments", { method: "POST", body: JSON.stringify(body) }),
  updateAppointment: (id: number, body: any) => request<any>(`/appointments/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteAppointment: (id: number) => request<any>(`/appointments/${id}`, { method: "DELETE" }),

  deleteReport: (id: number) => request<any>(`/reports/${id}`, { method: "DELETE" }),

  // Multi-role: data modules
  getBiomarkers: () => request<any[]>("/biomarkers"),
  addBiomarker: (body: any) => request<any>("/biomarkers", { method: "POST", body: JSON.stringify(body) }),
  updateBiomarker: (id: number, body: any) => request<any>(`/biomarkers/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteBiomarker: (id: number) => request<any>(`/biomarkers/${id}`, { method: "DELETE" }),

  getNutritionPlans: () => request<any[]>("/nutrition"),
  addNutritionPlan: (body: any) => request<any>("/nutrition", { method: "POST", body: JSON.stringify(body) }),
  updateNutritionPlan: (id: number, body: any) => request<any>(`/nutrition/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteNutritionPlan: (id: number) => request<any>(`/nutrition/${id}`, { method: "DELETE" }),

  getWorkouts: () => request<any[]>("/workouts"),
  addWorkout: (body: any) => request<any>("/workouts", { method: "POST", body: JSON.stringify(body) }),
  updateWorkout: (id: number, body: any) => request<any>(`/workouts/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteWorkout: (id: number) => request<any>(`/workouts/${id}`, { method: "DELETE" }),

  getSupplements: () => request<any[]>("/supplements"),
  addSupplement: (body: any) => request<any>("/supplements", { method: "POST", body: JSON.stringify(body) }),
  updateSupplement: (id: number, body: any) => request<any>(`/supplements/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteSupplement: (id: number) => request<any>(`/supplements/${id}`, { method: "DELETE" }),

  // Professional-client links
  getMyClients: () => request<any[]>("/links/my-clients"),
  getMyProfessionals: () => request<any[]>("/links/my-professionals"),
  getAllProfessionals: () => request<any[]>("/links/all-professionals"),
  getAllClients: () => request<any[]>("/links/all-clients"),
  linkClient: (clientId: number) => request<any>("/links", { method: "POST", body: JSON.stringify({ clientId }) }),
  unlinkClient: (clientId: number) => request<any>(`/links/${clientId}`, { method: "DELETE" }),
  addProfessional: (profId: number) => request<any>("/links/add-professional", { method: "POST", body: JSON.stringify({ profId }) }),
  removeProfessional: (profId: number) => request<any>(`/links/remove-professional/${profId}`, { method: "DELETE" }),
};
