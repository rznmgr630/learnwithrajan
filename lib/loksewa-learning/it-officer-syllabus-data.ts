export interface ITOfficerConcept {
  id: number;
  section: string;
  title: string;
  tagline: string;
  description: string;
  note?: string;
  tags: string[];
}

export const IT_OFFICER_SECTIONS = ["Computer Fundamentals"] as const;

export const IT_OFFICER_CONCEPTS: ITOfficerConcept[] = [
  // ─────────────────────────────────────────────
  // COMPUTER FUNDAMENTALS
  // ─────────────────────────────────────────────
  {
    id: 1,
    section: "Computer Fundamentals",
    title: "Introduction to Computer",
    tagline: "What a computer is, and what makes it a computer",
    description:
      "A computer is an electronic device that takes input, processes it according to a set of instructions, and produces output — it cannot think on its own, it only follows the instructions given to it.\n\n<b>Definition</b>\n• A computer is an electronic machine that accepts data as input, processes that data using stored instructions (a program), and produces output\n• The word \"computer\" originally meant \"one who computes\" — a person who performed calculations — before it came to mean the machine\n  ↳ Basic cycle: Input → Process → Output → Storage\n\n<b>Characteristics of Computers</b>\n• <b>Speed</b> — a computer can perform millions of instructions per second, far faster than any human\n• <b>Accuracy</b> — computers give error-free results as long as the input and instructions are correct\n  ↳ \"Garbage in, garbage out\" — wrong input always produces wrong output\n• <b>Diligence</b> — a computer can repeat the same task millions of times without getting tired or losing accuracy\n• <b>Versatility</b> — the same computer can be used for calculations, writing documents, playing media, or controlling machines\n• <b>Storage capacity</b> — a computer can store huge amounts of data and retrieve it instantly whenever needed\n• <b>No IQ / no feelings</b> — a computer only does what it is told; it has no intelligence or emotions of its own",
    note:
      "Every computer, no matter how advanced, is built around the same input → process → output → storage cycle. If a device doesn't do all four, it isn't a computer in the technical sense.",
    tags: ["Computer Basics", "Definition", "Characteristics"],
  },
  {
    id: 2,
    section: "Computer Fundamentals",
    title: "History of Computer",
    tagline: "From the abacus to the first electronic computer",
    description:
      "Computers didn't appear overnight — they evolved gradually as people looked for faster and more reliable ways to calculate and store information.\n\n<b>Manual Era</b>\n• Abacus — one of the earliest calculating tools, used in ancient China, Rome, and Egypt for counting and simple arithmetic using beads on rods\n• Napier's Bones (1617) — a set of numbered rods invented by John Napier that simplified multiplication and division into a series of additions\n• Slide Rule (1622) — a mechanical device using logarithmic scales for multiplication, division, roots, and trigonometry, used until electronic calculators took over\n\n<b>Mechanical Era</b>\n• Pascaline (1642) — Blaise Pascal's mechanical adding machine, one of the first machines that could add and subtract automatically using gears\n• Difference Engine (1822) and Analytical Engine (1837) — designed by Charles Babbage; the Analytical Engine is considered the first design for a general-purpose, programmable computer, with a memory, a processing unit, and input/output — the same building blocks every modern computer still uses\n  ↳ Babbage is called the \"Father of the Computer\"\n• Ada Lovelace wrote the first algorithm intended to run on the Analytical Engine, earning her the title \"first computer programmer\"\n\n<b>Electro-Mechanical to Electronic Era</b>\n• Harvard Mark I (1944) — an electro-mechanical computer that used relays and switches instead of purely mechanical gears\n• ENIAC (1945) — the first fully electronic, general-purpose digital computer, built with vacuum tubes\n  ↳ ENIAC marks the beginning of the modern computer era — the point where the five generations (covered next) begin",
    note:
      "History moves in one direction — mechanical devices (gears, levers) → electro-mechanical devices (relays) → fully electronic devices (vacuum tubes and beyond). Each shift made computers faster and smaller.",
    tags: ["History", "Abacus", "Pascaline", "Charles Babbage", "ENIAC"],
  },
  {
    id: 3,
    section: "Computer Fundamentals",
    title: "Generation of Computer",
    tagline: "Five generations, five core technologies",
    description:
      "Computers are grouped into five generations based on the core technology used to build them — each new technology made computers smaller, faster, cheaper, and easier to use.\n\n<b>First generation (1940–1956) — Vacuum Tubes</b>\n• Used vacuum tubes for circuitry and magnetic drums for memory\n• Extremely large, expensive to operate, and generated enormous heat\n• Programmed in machine language; could solve only one problem at a time\n  ↳ Examples: ENIAC, UNIVAC\n\n<b>Second generation (1956–1963) — Transistors</b>\n• Vacuum tubes were replaced by transistors, which were smaller, faster, cheaper, and more energy-efficient\n• Moved from machine language to assembly language, making programming easier\n• Still generated heat and relied on punch cards for input, but were far more reliable than the first generation\n\n<b>Third generation (1964–1971) — Integrated Circuits (ICs)</b>\n• Multiple transistors were combined onto a single silicon chip (the integrated circuit), increasing speed and efficiency while shrinking size further\n• Introduced keyboards and monitors, and an operating system that could run many applications at once\n• Computers became affordable enough for businesses, not just governments and universities\n\n<b>Fourth generation (1971–present) — Microprocessors</b>\n• Thousands of integrated circuits were packed onto a single microprocessor chip, putting an entire CPU on one chip\n• Led directly to the personal computer (PC), since machines became small and cheap enough for individual use\n• Introduced GUIs, mice, and storage devices such as hard disks and, later, flash drives\n\n<b>Fifth generation (present and beyond) — Artificial Intelligence</b>\n• Based on artificial intelligence, allowing devices to accept natural language input and improve through learning rather than fixed instructions\n• Uses technologies such as machine learning, natural language processing, voice recognition, and parallel processing\n  ↳ Still evolving — this is the generation we are currently living in",
    note:
      "Each generation is named after its core technology — vacuum tube → transistor → IC → microprocessor → AI. Remembering one keyword per generation is usually enough to answer most exam questions.",
    tags: ["Generations", "Vacuum Tubes", "Transistors", "Integrated Circuits", "Microprocessor", "AI"],
  },
  {
    id: 4,
    section: "Computer Fundamentals",
    title: "Types of Computer",
    tagline: "Analog, digital, and hybrid — classified by the data they process",
    description:
      "Computers can be classified by the type of data they process — analog, digital, or a mix of both.\n\n<b>Analog Computer</b>\n• Processes data that is continuous, such as voltage, temperature, pressure, or speed, rather than discrete numbers\n• Works by measuring physical quantities rather than counting them\n• Fast for the specific physical process it is built for, but less accurate and not general-purpose\n  ↳ Examples: a speedometer, a thermometer, an analog voltmeter\n\n<b>Digital Computer</b>\n• Processes data in discrete form, converting everything into binary digits (0s and 1s) before processing\n• Highly accurate, general-purpose, and can be reprogrammed for many different tasks\n• This is the type of computer used every day — desktops, laptops, smartphones, and servers are all digital computers\n\n<b>Hybrid Computer</b>\n• Combines the features of analog and digital computers — it can accept both continuous (analog) and discrete (digital) input\n• An analog part measures physical quantities and converts them into digital form for accurate processing, then converts the result back if needed\n  ↳ Common in hospitals: an ICU machine that continuously measures a patient's heartbeat (analog) and displays the exact digital reading on a screen",
    note:
      "If a question asks which computer type is used in an ICU or petrol pump, the answer is almost always hybrid — it needs both continuous measurement and precise digital output.",
    tags: ["Types of Computer", "Analog", "Digital", "Hybrid"],
  },
  {
    id: 5,
    section: "Computer Fundamentals",
    title: "Classification of Computer",
    tagline: "Micro to super — classified by size and processing power",
    description:
      "Beyond analog/digital, computers are also classified by their size, processing power, and intended use — from a phone-sized device to a machine that fills an entire room.\n\n<b>Microcomputer</b>\n• The smallest and cheapest category, built around a single microprocessor chip\n• Designed for a single user at a time\n  ↳ Examples: desktop PCs, laptops, tablets, smartphones\n\n<b>Minicomputer</b>\n• Mid-sized computers, more powerful than a microcomputer but smaller and cheaper than a mainframe\n• Designed to support multiple users at once, typically within a single department or organization\n  ↳ Examples: PDP-11, IBM AS/400 — historically used for tasks like manufacturing process control and small-business data processing\n\n<b>Mainframe Computer</b>\n• Large, powerful computers used by big organizations (banks, airlines, government agencies) to process massive volumes of data reliably\n• Built for very high throughput, uptime, and security, supporting hundreds or thousands of users simultaneously\n  ↳ Example: IBM z-series mainframes, still used today for large-scale transaction processing\n\n<b>Supercomputer</b>\n• The fastest and most powerful category, capable of performing trillions of calculations per second\n• Used for extremely complex, compute-heavy tasks: weather forecasting, nuclear simulations, space research, and scientific modelling\n  ↳ Examples: Fugaku, Summit — measured in FLOPS (floating point operations per second)",
    note:
      "A simple size-to-power ladder for exams: Microcomputer < Minicomputer < Mainframe < Supercomputer — each step up trades portability for raw processing power.",
    tags: ["Classification", "Microcomputer", "Minicomputer", "Mainframe", "Supercomputer"],
  },
];

export const IT_OFFICER_CONCEPT_COUNT = IT_OFFICER_CONCEPTS.length;
