export type SyllabusPoint = {
  title: string;
  subPoints?: string[];
};

export type SyllabusSection = {
  title: string;
  points: SyllabusPoint[];
};

export type SyllabusChapter = {
  id: number;
  title: string;
  sections: SyllabusSection[];
};

export const IT_OFFICER_SYLLABUS: SyllabusChapter[] = [
  {
    id: 1,
    title: "1. Introduction to Computers",
    sections: [
      {
        title: "Computer Basics",
        points: [
          { title: "Definition of computer" },
          { title: "Characteristics of computers" },
          { title: "History of computers" },
          {
            title: "Computer generations",
            subPoints: [
              "First generation",
              "Second generation",
              "Third generation",
              "Fourth generation",
              "Fifth generation",
            ],
          },
        ],
      },
      {
        title: "Types of Computers",
        points: [
          { title: "Analog computer" },
          { title: "Digital computer" },
          { title: "Hybrid computer" },
        ],
      },
      {
        title: "Classification",
        points: [
          { title: "Microcomputer" },
          { title: "Minicomputer" },
          { title: "Mainframe computer" },
          { title: "Supercomputer" },
        ],
      },
    ],
  },
];
