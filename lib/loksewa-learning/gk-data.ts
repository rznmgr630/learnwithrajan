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
];
