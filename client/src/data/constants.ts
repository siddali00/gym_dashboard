export const ROLE_INFO: Record<string, { icon: string; titleKey: string }> = {
  cliente:         { icon: "🧑‍🦱", titleKey: "role_client" },
  medico:          { icon: "🩺",   titleKey: "role_doctor" },
  nutrizionista:   { icon: "🥗",   titleKey: "role_nutritionist" },
  fabbro:          { icon: "🛠️",   titleKey: "role_blacksmith" },
  coach_di_ferro:  { icon: "🏋️",   titleKey: "role_iron_coach" },
};

export const GDPR_ITEMS = [
  { id: "privacy", req: true, label: "Informativa Privacy (Art. 13 GDPR)", text: "Ho letto e accetto l'Informativa Privacy di Salute di Ferro ai sensi del Reg. UE 2016/679 e del D.Lgs. 196/2003 modificato dal D.Lgs. 101/2018." },
  { id: "health", req: true, label: "Trattamento Dati Sanitari (Art. 9 GDPR)", text: "Acconsento esplicitamente al trattamento dei miei dati sanitari ai sensi dell'Art. 9 par. 2 lett. a) GDPR." },
  { id: "sharing", req: false, label: "Condivisione con Specialisti Selezionati", text: "Acconsento alla condivisione selettiva dei miei dati con i professionisti da me approvati. Revocabile in qualsiasi momento." },
  { id: "analytics", req: false, label: "Analisi Aggregata (opzionale)", text: "Acconsento all'utilizzo anonimo dei miei dati per il miglioramento del servizio." },
];

export interface MetricField {
  k: string;
  l: string;
  u: string;
  t?: string;
}

export interface MetricCategory {
  label: string;
  icon: string;
  fields: MetricField[];
}

export const METRIC_CATS: Record<string, MetricCategory> = {
  corpo: {
    label: "Corporee",
    icon: "⚖️",
    fields: [
      { k: "peso", l: "Peso", u: "kg" },
      { k: "massa_grassa", l: "Massa Grassa", u: "%" },
      { k: "massa_muscolare", l: "Massa Muscolare", u: "kg" },
      { k: "altezza", l: "Altezza", u: "cm" },
      { k: "acqua", l: "Acqua Corporea", u: "%" },
    ],
  },
  misure: {
    label: "Circonferenze",
    icon: "📐",
    fields: [
      { k: "vita", l: "Vita", u: "cm" },
      { k: "fianchi", l: "Fianchi", u: "cm" },
      { k: "petto", l: "Petto", u: "cm" },
      { k: "braccia", l: "Braccia", u: "cm" },
      { k: "coscia", l: "Coscia", u: "cm" },
      { k: "polpacci", l: "Polpacci", u: "cm" },
    ],
  },
  cardio: {
    label: "Cardiovascolare",
    icon: "❤️",
    fields: [
      { k: "pres_sist", l: "Pressione Sistolica", u: "mmHg" },
      { k: "pres_diast", l: "Pressione Diastolica", u: "mmHg" },
      { k: "fc_riposo", l: "FC a Riposo", u: "bpm" },
      { k: "spo2", l: "Saturazione O₂", u: "%" },
      { k: "hrv", l: "HRV", u: "ms" },
    ],
  },
  metabolica: {
    label: "Metabolica",
    icon: "🩸",
    fields: [
      { k: "glicemia_dig", l: "Glicemia Digiuno", u: "mg/dL" },
      { k: "glicemia_pp", l: "Glicemia Post-Pasto 2h", u: "mg/dL" },
      { k: "chetoni", l: "Chetoni", u: "mmol/L" },
      { k: "temperatura", l: "Temperatura", u: "°C" },
    ],
  },
  sonno: {
    label: "Sonno",
    icon: "😴",
    fields: [
      { k: "ore_sonno", l: "Ore di Sonno", u: "h" },
      { k: "qualita", l: "Qualità (1-10)", u: "/10" },
      { k: "addorm", l: "Ora Addorm.", u: "", t: "time" },
      { k: "risveglio", l: "Ora Risveglio", u: "", t: "time" },
      { k: "risvegli", l: "N° Risvegli", u: "" },
    ],
  },
  attivita: {
    label: "Attività",
    icon: "🏃",
    fields: [
      { k: "passi", l: "Passi", u: "" },
      { k: "cal_bruciate", l: "Calorie Bruciate", u: "kcal" },
      { k: "min_attivita", l: "Min. Attività", u: "min" },
      { k: "distanza", l: "Distanza", u: "km" },
    ],
  },
};

export const MEAL_NAMES = [
  { name: "Colazione", time: "07:30" },
  { name: "Spuntino mattina", time: "10:00" },
  { name: "Pranzo", time: "13:00" },
  { name: "Spuntino pomeriggio", time: "16:30" },
  { name: "Cena", time: "20:00" },
];

export const REPORT_TYPES = [
  "Analisi del Sangue",
  "Risultato Laboratorio",
  "Visita Medica",
  "Prescrizione",
  "Imaging Diagnostico",
  "Referto Specialistico",
  "Altro",
];
