import type { PersonalDevVideo } from "@/lib/personal-development/types";

export interface DevotionMantra {
  title: string;
  deity: string;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  nepaliMeaning: string;
}

export const FEATURED_MANTRA: DevotionMantra = {
  title: "Om Namo Bhagavate Vasudevaya",
  deity: "Vishnu / Krishna",
  sanskrit: "ॐ नमो भगवते वासुदेवाय",
  transliteration: "Om Namo Bhagavate Vasudevaya",
  meaning: "I bow to the divine presence of Vasudeva, Lord Krishna.",
  nepaliMeaning: "म भगवान् कृष्ण, वासुदेवको दिव्य स्वरूपलाई नमन गर्छु।",
};

export const DEVOTION_MANTRAS: DevotionMantra[] = [
  {
    title: "Krishna Prayer",
    deity: "Krishna",
    sanskrit: "कृष्णाय वासुदेवाय हरये परमात्मने ।\nप्रणतः क्लेशनाशाय गोविन्दाय नमो नमः ॥",
    transliteration: "Krishnaya Vasudevaya Haraye Paramatmane, Pranatah Kleshanashaya Govindaya Namo Namah.",
    meaning: "Salutations to Krishna, Vasudeva, Hari, the supreme self, and Govinda, who eases suffering.",
    nepaliMeaning: "कृष्ण, वासुदेव, हरि, परमात्मा र दुःख हटाउने गोविन्दलाई बारम्बार नमन छ।",
  },
  {
    title: "Hanuman Prayer",
    deity: "Hanuman",
    sanskrit: "नमो हनुमते तुभ्यं नमो मारुतसूनवे ।\nनमः श्रीराम भक्ताय श्यामास्याय च ते नमः ॥",
    transliteration: "Namo Hanumate Tubhyam Namo Marutasunave, Namah Shri Rama Bhaktaya Shyamasyaaya Cha Te Namah.",
    meaning: "Salutations to Hanuman, son of the wind and devoted servant of Lord Rama.",
    nepaliMeaning: "वायुपुत्र र श्रीरामका परम भक्त हनुमानलाई नमन छ।",
  },
  {
    title: "Lakshmi Sahodara Mantra",
    deity: "Vishnu",
    sanskrit: "ॐ श्री लक्ष्मी सहोदराय नमः",
    transliteration: "Om Shri Lakshmi Sahodaraya Namah",
    meaning: "I bow to the divine companion of Lakshmi.",
    nepaliMeaning: "म लक्ष्मीका दिव्य सहचरलाई नमन गर्छु।",
  },
  {
    title: "Hanuman Invocation",
    deity: "Hanuman",
    sanskrit: "ॐ हं हनुमते नमः",
    transliteration: "Om Ham Hanumate Namah",
    meaning: "Salutations to Hanuman.",
    nepaliMeaning: "हनुमानलाई नमन छ।",
  },
];

export const DEVOTION_VIDEOS: PersonalDevVideo[] = [
  { id: "6rADqP4UZmo", label: "Hanuman Chalisa" },
];
