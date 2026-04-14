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
};
