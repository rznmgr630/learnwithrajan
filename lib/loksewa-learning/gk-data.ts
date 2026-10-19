export type GkItem = {
  term: string;
  meaning: string;
};

export type GkTopic = {
  id: number;
  title: string;
  items: GkItem[];
};

export const LOKSEWA_GK_TOPICS: GkTopic[] = [
  {
    id: 1,
    title: "Types of Doctors",
    items: [
      { term: "Doctor of Heart", meaning: "Cardiologist" },
      { term: "Doctor of Skin", meaning: "Dermatologist" },
      { term: "Doctor of Bone", meaning: "Orthopedic" },
      { term: "Doctor of Brain", meaning: "Neurologist" },
      { term: "Doctor of Child", meaning: "Pediatrician" },
      { term: "Doctor of Eyes", meaning: "Ophthalmologist" },
      { term: "Doctor of Teeth", meaning: "Dentist" },
      { term: "Doctor of Kidney", meaning: "Nephrologist" },
      { term: "Doctor of Surgery", meaning: "Surgeon" },
      { term: "Doctor of Cancer", meaning: "Oncologist" },
      { term: "Doctor of Mind", meaning: "Psychiatrist" },
      { term: "Doctor of Liver", meaning: "Hepatologist" },
      { term: "Doctor of Women", meaning: "Gynaecologist" },
      { term: "Doctor of Stomach", meaning: "Gastroenterologist" },
      { term: "Doctor of Ears", meaning: "Otolaryngologist" },
      { term: "Doctor of Lungs", meaning: "Pulmonologist" },
      { term: "Doctor of Animals", meaning: "Veterinarian" },
    ],
  },
  {
    id: 2,
    title: "Generations by Birth Year",
    items: [
      { term: "1883–1900", meaning: "Lost Generation" },
      { term: "1901–1927", meaning: "Greatest Generation" },
      { term: "1928–1945", meaning: "Silent Generation" },
      { term: "1946–1964", meaning: "Baby Boomers" },
      { term: "1965–1980", meaning: "Generation X" },
      { term: "1981–1996", meaning: "Millennials" },
      { term: "1997–2012", meaning: "Generation Z" },
      { term: "2013–2024", meaning: "Generation Alpha" },
      { term: "2025–2039", meaning: "Generation Beta" },
      { term: "2040–2054", meaning: "Generation Gamma" },
      { term: "2055–2069", meaning: "Generation Delta" },
    ],
  },
];
