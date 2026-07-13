export interface LoksewaQA {
  id: number;
  questionEn: string;
  questionNe: string;
  answerEn: string;
  answerNe: string;
}

export const LOKSEWA_GEOGRAPHY_QA: LoksewaQA[] = [
  {
    id: 1,
    questionEn: "Which is the most explored satellite?",
    questionNe: "सबैभन्दा बढी खोज गरिएको उपग्रह?",
    answerEn: "The Moon",
    answerNe: "चन्द्रमा",
  },
  {
    id: 2,
    questionEn: "Which was the first spacecraft to reach the Moon's surface?",
    questionNe: "चन्द्र धरातलमा पुग्ने पहिलो अन्तरिक्ष यान?",
    answerEn: "Luna 2",
    answerNe: "लुना २",
  },
  {
    id: 3,
    questionEn: "When did it reach?",
    questionNe: "कहिले पुग्यो?",
    answerEn: "In 1959",
    answerNe: "सन् १९५९",
  },
  {
    id: 4,
    questionEn: "Who was the first person to walk on the Moon / first to step on the lunar surface?",
    questionNe: "चन्द्रमामा हिँड्ने पहिलो व्यक्ति, चन्द्र धरातलमा पाइला टेक्ने पहिलो व्यक्ति?",
    answerEn: "Neil Armstrong",
    answerNe: "निल आर्मस्ट्रङ",
  },
  {
    id: 5,
    questionEn: "Where was he from?",
    questionNe: "कहाँका हुन्?",
    answerEn: "From America",
    answerNe: "अमेरिकाका",
  },
  {
    id: 6,
    questionEn: "How many people went?",
    questionNe: "कति जना गएका थिए?",
    answerEn: "3 people",
    answerNe: "३ जना",
  },
  {
    id: 7,
    questionEn: "Who were they?",
    questionNe: "को को थिए?",
    answerEn: "Neil Armstrong, Edwin Aldrin, Michael Collins (who did not descend to the lunar surface)",
    answerNe: "निल आर्मस्ट्रङ, एडविन एल्ड्रिन, माइकल कोलिन्स (जो चन्द्र धरातलमा ओर्लेनन्)",
  },
  {
    id: 8,
    questionEn: "When did they reach?",
    questionNe: "कहिले पुगे?",
    answerEn: "On 21 July 1969",
    answerNe: "सन् १९६९ जुलाई २१ मा",
  },
  {
    id: 9,
    questionEn: "From which spacecraft?",
    questionNe: "कुन यानबाट?",
    answerEn: "\"Apollo 11\"",
    answerNe: "\"एपोलो ११\"",
  },
  {
    id: 10,
    questionEn: "Where is the Sea of Tranquility located?",
    questionNe: "Sea of Tranquility कहाँ पर्छ?",
    answerEn: "On the Moon (the place where spacecraft Apollo 11 landed)",
    answerNe: "चन्द्रमामा (अन्तरिक्षयान एपोलो ११ उत्रेको ठाउँ)",
  },
  {
    id: 11,
    questionEn: "What is a Nano Second?",
    questionNe: "Nano Second के हो?",
    answerEn: "A unit used to measure time for space purposes (1 nanosecond = one-billionth of a second)",
    answerNe: "अन्तरिक्ष प्रयोजनका लागि समय नाप्न प्रयोग गरिने एकाई (1 नानो सेकेन्ड)",
  },
  {
    id: 12,
    questionEn: "Who announced the Apollo mission?",
    questionNe: "एपोलो अभियानको घोषणा कसले गरे?",
    answerEn: "American President John F. Kennedy",
    answerNe: "अमेरिकि राष्ट्रपति जोन एफ केनेडीले",
  },
];

export const LOKSEWA_GEOGRAPHY_QA_COUNT = LOKSEWA_GEOGRAPHY_QA.length;
