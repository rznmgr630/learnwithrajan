export interface ITOfficerConcept {
  id: number;
  slug: string;
  section: string;
  /** Slug of the parent concept, for nested sidebar sub-menus (e.g. SRAM's parent is "ram"). Omit for top-level items within a section. */
  parentSlug?: string;
  /** Slugs of other existing concepts to also list as sidebar children here, without duplicating their content or changing their own parentSlug. */
  crossLinkSlugs?: string[];
  title: string;
  tagline: string;
  description: string;
  note?: string;
  diagram?: string;
  /** Source code example, rendered as a VS-Code-style block with a copy button. */
  code?: string;
  /** Label shown in the code block's header (e.g. "C"). */
  codeLanguage?: string;
  tags: string[];
}

export const IT_OFFICER_SECTIONS = ["Computer Fundamentals", "Programming", "Data Structures & Algorithms", "Database Management System", "Operating Systems", "Computer Networks"] as const;

export const IT_OFFICER_CONCEPTS: ITOfficerConcept[] = [
  // ─────────────────────────────────────────────
  // COMPUTER FUNDAMENTALS
  // ─────────────────────────────────────────────
  {
    id: 34,
    slug: "computer-basics",
    section: "Computer Fundamentals",
    title: "Computer Basics",
    tagline: "What a computer is, its history, generations, and how it's classified",
    description:
      "<b>What This Covers</b>\nComputer Basics is the foundation of the whole syllabus — what a computer actually is, how it evolved over time, and the different ways it can be classified.\n\n<b>What You'll Learn Here</b>\n• <b>Introduction to Computer</b> — the definition of a computer, its core characteristics (speed, accuracy, GIGO, diligence, and more), and its real-world advantages, disadvantages, and applications\n• <b>History of Computer</b> — how calculating devices evolved from the abacus through mechanical calculators to the first electronic computers\n• <b>Generation of Computer</b> — the five generations of computing technology, from vacuum tubes to artificial intelligence\n• <b>Types of Computer</b> — analog, digital, and hybrid computers, classified by the kind of data they process\n• <b>Classification of Computer</b> — how computers are further grouped by size, purpose, performance, and data handling\n  ↳ Each of these is covered in full in its own card next.",
    note:
      "This section builds up in order: first what a computer even is, then how it got here (history and generations), then the different ways one can be categorized (types and classification). Exam questions often mix these categories, so know which lens (data type vs. size vs. purpose) each classification uses.",
    diagram:
      "  COMPUTER BASICS — how the topics build on each other\n\n  Introduction    History of     Generation of    Types of       Classification\n  to Computer ──► Computer   ──► Computer     ──► Computer   ──► of Computer\n  (what it is)    (how we        (which tech       (analog/         (by size, purpose,\n                   got here)      built each         digital/         performance,\n                                  era)               hybrid)          data handling)",
    tags: ["Computer Basics", "Computer Fundamentals", "Introduction", "History", "Generations", "Classification"],
  },
  {
    id: 1,
    slug: "introduction-to-computer",
    section: "Computer Fundamentals",
    parentSlug: "computer-basics",
    title: "Introduction to Computer",
    tagline: "What a computer is, and what makes it a computer",
    description:
      "The word \"computer\" comes from the Latin word \"computare\", meaning \"to calculate\". Until the early 1900s, \"computer\" actually meant a person whose job was to do calculations by hand — the machine only took over that name later.\n\n<b>Definition</b>\nA computer is an electronic device that accepts data as input, processes that data by following a set of stored instructions (called a program), and produces a result as output. It also stores data so it can be used again later.\n  ↳ This is usually remembered as one cycle: Input → Process → Output → Storage. Every computer, from a simple calculator to a supercomputer, works this way.\n\n<b>Characteristics of Computers</b>\n• <b>Speed</b> — a computer can carry out billions of instructions every single second, and it can keep working at that speed for hours without slowing down. A task that would take a human days of manual calculation can be finished by a computer in a fraction of a second.\n• <b>Accuracy</b> — a computer gives the exact same correct result every time it is given the exact same input and instructions; it does not make careless mistakes the way a tired human might.\n  ↳ Any wrong result almost always comes from wrong data or wrong instructions, not from the machine \"getting confused.\"\n• <b>GIGO — Garbage In, Garbage Out</b> — a specific rule exams like to test: if the input given to a computer is wrong or incomplete, the output will also be wrong, no matter how powerful the computer is. Accuracy is only ever as good as the data it starts with.\n• <b>Diligence</b> — a computer can repeat the same task millions of times in a row without getting tired, bored, or losing concentration — something no human can do.\n• <b>Reliability</b> — a computer keeps producing correct, consistent results over long periods of continuous use, with very few breakdowns compared to manual work.\n• <b>Automation</b> — once a computer has been given a program, it can carry out the entire sequence of steps on its own, without a person guiding it through every single step.\n• <b>Versatility</b> — the same computer can be turned into a calculator, a typewriter, a music player, a camera, or a communication device simply by running a different program — one machine replaces many separate tools.\n• <b>Storage capacity</b> — a computer can hold enormous amounts of data (measured in kilobytes, megabytes, gigabytes, and terabytes) and can find and retrieve any piece of it almost instantly.\n• <b>No IQ / no feelings</b> — despite everything above, a computer has no intelligence, judgment, or emotion of its own. It only does exactly what its instructions tell it to do; it cannot decide, on its own, to do something it was never programmed for.\n\n<b>What Computer Fundamentals Covers</b>\nComputer fundamentals, as a subject, is the umbrella for everything in this syllabus — history, generations, types, and classification — plus topics not detailed in their own card, such as computer components (input/output devices), memory and storage, CPU architecture (the ALU and CU), software, operating systems, and basic networking.\n\n<b>Advantages of Computers</b>\nComputers are now used in almost every domain — education, research, medicine, law, retail, and business — which is why society has grown so dependent on them. That dependency brings real advantages, but also real disadvantages, and exams often test both sides together.\n• <b>Efficient processing</b> — analyses huge amounts of data in a fraction of the time a person would need, going beyond raw speed by changing what's practically possible to calculate at all\n• <b>Automates repetitive work</b> — takes over repetitive tasks completely once programmed, freeing people from doing them by hand\n• <b>Quick access to stored information</b> — holds vast amounts of data and retrieves any of it almost instantly, whenever it's needed\n• <b>Handles complex problem-solving</b> — supports complex calculations, decision-making, and multitasking that would be impractical to do manually\n• <b>Cost savings</b> — cuts down on paperwork and paper use, which also reduces environmental impact\n• <b>Data security and backup</b> — protects data with access controls and keeps backup copies so information isn't lost\n• <b>Global reach</b> — connects people and systems across the world instantly over networks\n\n<b>Applications of Computers</b>\n• <b>Business and industry</b> — reduces manual work, increases productivity, and manages huge amounts of organizational data\n• <b>Education</b> — enables online learning, digital resources, e-books, and journals, giving easy access to study material\n• <b>Healthcare</b> — manages patient records and tracks patient health using medical software and artificial intelligence\n• <b>Communication and entertainment</b> — powers instant communication through social media, collaboration tools, and global connectivity\n• <b>Science and research</b> — processes large datasets and powers digital platforms that speed up scientific discovery\n• <b>Finance and accounting</b> — tracks transactions, manages accounts, and analyses market trends\n• <b>Government, transportation, agriculture, and security</b> — used across all of these too, from public administration and traffic systems to farm monitoring and national defense\n\n<b>Disadvantages of Computers</b>\n• <b>Health issues</b> — long hours in front of a screen, especially for students gaming or on related apps for extended periods, cause real physical and mental health problems\n• <b>Total dependency on instructions</b> — a computer has no judgment of its own, so it cannot catch or correct a mistake in its own programming; the outcome always traces back to whoever wrote the instructions or supplied the data\n• <b>Exposure to harmful content</b> — easy internet access has also made it easy to spread harmful material, including pornography, which is a genuine risk especially for younger users\n• <b>Viruses and hacking attacks</b> — unwanted programs can enter a computer through a network or the internet, steal information, damage the system, or lock other programs so the computer can't be used properly\n• <b>Environmental impact</b> — growing use of computers and automated devices consumes significant energy and generates electronic waste, which is a real threat to the environment\n• <b>Network failures</b> — since most modern data lives on servers, an attack or failure that takes down a network can seriously disrupt communication and every system depending on it\n• <b>Cybercrime</b> — using a computer to commit fraud, identity theft, privacy violations, or the trafficking of illegal material has become more common as computers have spread through business, entertainment, and government\n• <b>Data and privacy violations</b> — sharing someone's data with a third party without their permission is a breach of confidentiality, and the data's owner can pursue legal action to recover any resulting losses",
    note:
      "If an exam question describes wrong output caused by wrong input, that is GIGO — not accuracy. If it describes a machine repeating a task without getting tired, that is diligence — not speed. Characteristics describe what a computer inherently is; advantages describe the real-world benefit that trait produces; disadvantages describe the risk that comes with the same technology. Exams often test all three separately, so don't collapse them into one idea.",
    tags: ["Computer Basics", "Definition", "Characteristics", "GIGO", "Advantages", "Disadvantages", "Applications"],
  },
  {
    id: 2,
    slug: "history-of-computer",
    section: "Computer Fundamentals",
    parentSlug: "computer-basics",
    title: "History of Computer",
    tagline: "From the abacus to the first electronic computer",
    description:
      "Computers didn't appear overnight — they evolved gradually as people looked for faster and more reliable ways to calculate and store information.\n\n<b>Manual Era — calculating without electricity</b>\n• Abacus (around 2700 BC) — the earliest known calculating device; uses beads sliding on rods to count and do simple arithmetic, and is still used in parts of Asia today for teaching arithmetic.\n• Napier's Bones (1617) — invented by John Napier, a set of numbered rods that turned multiplication and division into simple addition and subtraction.\n• Slide Rule (17th century) — a mechanical device using logarithmic scales for multiplication, division, roots, and trigonometry, used right up until electronic calculators became common in the 1970s.\n\n<b>Mechanical Era — the first calculating machines</b>\n• Pascaline (1642) — built by the French mathematician Blaise Pascal, the first mechanical adding machine; it used a series of gears to add and subtract numbers automatically.\n• Stepped Reckoner (1694) — designed by the German mathematician Gottfried Leibniz, an early mechanical calculator that used a stepped-drum mechanism to add, subtract, multiply, and divide.\n• Jacquard's Loom (early 1800s) — not a computer itself, but an important idea: it used punched cards to control a weaving pattern automatically. This punch-card idea was later borrowed directly by early computers to store instructions and data.\n• Arithmometer (1820) — the first mechanical calculator reliable and simple enough to be mass-produced and used in everyday business.\n• Charles Babbage's Difference Engine (1822) and Analytical Engine (1837) — Babbage designed (though never fully built in his lifetime) the Analytical Engine, which included a memory, a processing unit, and a way to take input and give output — the same basic parts every modern computer still has. This is why Babbage is called the \"Father of the Computer.\"\n  ↳ Ada Lovelace wrote a set of instructions meant to run on the Analytical Engine, considered the first computer program ever written — earning her the title \"the first computer programmer.\"\n• Comptometer (1887) and Comptograph (1889) — early key-driven adding machines that let a user enter numbers by pressing keys instead of turning dials, speeding up calculation in offices.\n• Herman Hollerith's Tabulating Machine (1890) — used punched cards to process the results of the US census far faster than counting by hand; Hollerith's company later became part of what is now IBM.\n• The Millionaire (1893) — the first commercially successful calculator able to perform direct multiplication, instead of multiplying by repeated addition.\n\n<b>Electro-Mechanical to Electronic Era</b>\n• Z3 (1941) — built by the German engineer Konrad Zuse, the first working programmable, fully automatic digital computer; it used electromechanical relays and binary floating-point numbers, ideas that would define computing for decades afterward.\n• Harvard Mark I (1944) — built by Howard H. Aiken, an electro-mechanical computer that used electrically powered relays and switches instead of hand-turned gears.\n• ENIAC (1946) — short for Electronic Numerical Integrator and Computer, the first general-purpose, fully electronic computer, built using thousands of vacuum tubes.\n  ↳ ENIAC marks the start of the \"computer generations\" — the five stages of computer technology covered next.\n\n<b>Beyond ENIAC — Into the Modern Era</b>\n• Stored-program computers (late 1940s) — introduced the idea that a computer's instructions could be kept in memory alongside its data, instead of being wired in by hand for every new task. The Manchester Baby (1948) and EDSAC (1949) were among the first machines built this way, and this stored-program design is still how virtually every computer works today.\n  ↳ The five generations covered separately trace how the hardware running this stored-program idea evolved — vacuum tubes → transistors → ICs → microprocessors → AI\n• Minicomputers (1960s) — smaller, cheaper computers such as the DEC PDP-8 (1965) brought computing within reach of university departments and small businesses, well before the personal computer existed.\n• Graphical user interfaces (1970s–1980s) — the Xerox Alto (1973) was the first computer built around windows, icons, and a mouse; the idea was popularized commercially by the Apple Macintosh (1984) and Microsoft Windows (1985), replacing text-only command screens for most everyday users.\n• The Internet and the World Wide Web (1969–1991) — ARPANET, first connected in 1969, was the early US research network that became the basis of the modern Internet. Computer scientist Tim Berners-Lee then invented the World Wide Web between 1989 and 1991, adding web pages, hyperlinks, and browsers on top of the existing Internet.\n• Portable computing (1980s–present) — laptops, then smartphones, and then tablets shrank the personal computer down to something that fits in a bag or a pocket, making computing something people carry everywhere rather than sit down at.\n• Cloud computing and AI (present) — modern computing increasingly runs on remote data-centre servers accessed over the Internet (\"the cloud\") rather than on the device in front of the user, while artificial intelligence has moved from a research idea into everyday tools for speech recognition, image processing, and natural language.\n  ↳ Covered in more depth, alongside its hardware (ULSI, parallel processing), in the Fifth Generation section of the \"Generation of Computer\" card",
    note:
      "Notice the pattern: mechanical gears (Pascaline, Stepped Reckoner) → punched cards for storing instructions (Jacquard's Loom, Hollerith) → electro-mechanical relays (Z3, Harvard Mark I) → fully electronic vacuum tubes (ENIAC) → stored-program design → networked, cloud-based, AI-driven computing today. Each step removed one more physical limitation and replaced it with something faster or more connected.",
    tags: ["History", "Charles Babbage", "Ada Lovelace", "Hollerith", "ENIAC", "Internet & WWW", "Cloud Computing"],
  },
  {
    id: 3,
    slug: "generation-of-computer",
    section: "Computer Fundamentals",
    parentSlug: "computer-basics",
    title: "Generation of Computer",
    tagline: "Five generations, five core technologies",
    description:
      "Computers are grouped into five generations based on the core technology used to build them — each new technology made computers smaller, faster, cheaper, and easier to use.\n\n<b>Basic Terms</b>\n• Vacuum Tube — a fragile glass device that controls the flow of electrons in a vacuum; used in early switches, amplifiers, radios, and televisions before transistors replaced it\n• Transistor — a small semiconductor device that controls the flow of electricity, acting as either an amplifier or an on/off switch\n• Integrated Circuit (IC) — a silicon chip that packs many circuit elements, such as transistors and resistors, into one tiny piece\n• Microprocessor — a single chip that contains an entire CPU along with its supporting circuits\n• Central Processing Unit (CPU) — often called the \"brain\" of the computer; it carries out processing and calculations\n• Magnetic Drum and Magnetic Core — early storage technologies: a magnetic drum is a rotating cylinder coated with magnetic material, while magnetic core storage uses small magnetic rings arranged in arrays; both were used to hold data before modern memory chips existed\n• Machine Language — the raw binary (0s and 1s) language a computer's hardware directly understands; the lowest-level programming language\n• Memory — the part of a computer that stores data, instructions, and programs for use during processing\n\n<b>First generation (1940s–1950s) — Vacuum Tubes</b>\n• Built using vacuum tubes for circuits, with no operating system; programmed directly in machine language, which made writing and fixing programs slow and difficult.\n• Extremely heavy, bulky, and unreliable — often needed a full room, consumed huge amounts of electricity, and generated a lot of heat, so vacuum tubes burned out and failed often.\n• Punched cards and paper tape were used for input, with magnetic tape and magnetic drums for storage.\n  ↳ Main component: vacuum tube · Memory: magnetic tape and magnetic drum · Input/output: punched cards and paper tape\n  ↳ Examples: ENIAC (built by J. Presper Eckert and John V. Mauchly, contained around 18,000 vacuum tubes), EDVAC (designed by John von Neumann, could store instructions as well as data, which increased speed), UNIVAC I (1952, by Eckert and Mauchly), IBM 650, IBM 701\n\n<b>Second generation (1950s–1960s) — Transistors</b>\n• Vacuum tubes were replaced with transistors, invented at Bell Labs — smaller, faster, more power-efficient, and generating far less heat than vacuum tubes.\n• Programming moved from machine language toward assembly language and the first high-level languages, such as FORTRAN (1956), ALGOL (1958), and COBOL (1959), making programs considerably easier to write.\n• Used magnetic core memory alongside magnetic tape and disk, with punched cards still common for input.\n  ↳ Main component: transistor · Memory: magnetic core, magnetic tape/disk · Input/output: punched cards, magnetic tape\n  ↳ Examples: IBM 1400 series, IBM 7090 and 7094, PDP-8, UNIVAC 1107, CDC 3600\n\n<b>Third generation (1960s–1970s) — Integrated Circuits (ICs)</b>\n• Many transistors, resistors, and other components were combined onto a single silicon chip (the integrated circuit), improving speed, reliability, and power efficiency while shrinking size further.\n• Operating systems appeared, letting a single machine run multiple jobs at once, and programming moved to high-level languages such as BASIC.\n• Keyboards, monitors, and printers became standard input/output devices, and minicomputers emerged during this generation.\n  ↳ Main component: integrated circuits (ICs) · Memory: large magnetic core, magnetic tape/disk · Input/output: keyboard, monitor, printer, magnetic tape\n  ↳ Examples: IBM 360, IBM 370, PDP-11, NCR 395, B6500, UNIVAC 1108\n\n<b>Fourth generation (1970s–present) — Microprocessors</b>\n• Large-Scale Integration (LSI), and later Very-Large-Scale Integration (VLSI), packed thousands and then hundreds of thousands of transistors onto a single chip — the microprocessor — putting an entire CPU on one piece of silicon.\n• The Intel 4004 (1971) combined the CPU, memory, and input/output control onto one chip, shrinking computers dramatically and giving rise to the personal computer (PC).\n• Introduced multiprocessing, multiprogramming, time-sharing, virtual memory, graphical user interfaces (GUIs), and eventually computer networks, making computers far more capable and user-friendly.\n  ↳ Main component: microprocessor (VLSI) · Memory: semiconductor memory (RAM, ROM) · Input/output: keyboard, monitor, printer, pointing devices, optical scanning\n  ↳ Examples: Intel 4004, IBM PC, Apple II, Apple Macintosh, STAR 1000, Altair 8800\n\n<b>Fifth generation (present and beyond) — Artificial Intelligence</b>\n• Based on artificial intelligence, using Ultra Large-Scale Integration (ULSI — millions of transistors on a single chip) and parallel processing, where two or more processors run tasks at the same time instead of one after another.\n• Aims to let computers understand and respond to natural human language, seen today in voice recognition, medical applications, and game-playing systems capable of beating human competitors.\n• The smallest and fastest generation so far, with input methods such as touchscreens, trackpads, and speech/voice recognition.\n  ↳ Main component: AI, ULSI, and parallel processing · Language: natural (human) language · Input/output: touchscreen, trackpad, speech input, light scanner\n  ↳ Examples: modern desktops, laptops, tablets, and smartphones",
    note:
      "Match each generation to one keyword: vacuum tube → transistor → IC → microprocessor → AI. If a question names a specific machine (like ENIAC, IBM 360, or the IBM PC) or asks about its memory/input device, work backward from that detail to the generation number.",
    tags: ["Generations", "Vacuum Tubes", "Transistors", "Integrated Circuits", "Microprocessor", "AI"],
  },
  {
    id: 4,
    slug: "types-of-computer",
    section: "Computer Fundamentals",
    parentSlug: "computer-basics",
    title: "Types of Computer",
    tagline: "Analog, digital, and hybrid — classified by the data they process",
    description:
      "Computers can be classified by the type of data they process — analog, digital, or a mix of both.\n\n<b>Analog Computer</b>\n• Processes data that changes continuously, such as voltage, temperature, pressure, or speed — physical quantities that can take any value within a range, not numbers counted one at a time.\n• Works by directly measuring a physical quantity rather than converting it into digital numbers first.\n• Was most widely used through the 1950s and 1960s, especially in aircraft, ships, submarines, and everyday appliances like refrigerators and speedometers. Digital computers have since replaced most analog computers, though analog machines are still used wherever continuous, real-world data needs to be measured or simulated directly.\n• Very fast at measuring the one specific physical process it was built for, but generally less accurate than a digital computer and not general-purpose — it usually cannot be reprogrammed to do a completely different job.\n  ↳ Examples: a thermometer, a car speedometer, an analog voltmeter, radar systems that measure distance from reflected waves\n\n<b>Types of Analog Computers</b>\n• <b>Mechanical analog computers</b> — use physical mechanisms such as gears, levers, and rotating disks to model and solve mathematical equations\n  ↳ Example: mechanical analysers used for tasks like tide or navigation calculations\n• <b>Electrical analog computers</b> — use electrical circuits to represent and solve equations\n  ↳ Examples: spectrometers, oscilloscopes\n• <b>Optical analog computers</b> — use light and optics for computation\n  ↳ Example: the Norden bombsight, a World War II-era optical device used for aiming bombs\n• <b>Analog-digital hybrid computers</b> — combine analog and digital processing so continuous and discrete data can both be handled in one machine, covered in full below\n  ↳ Example: Hycomp 250; petrol pumps that convert a fuel-flow measurement into a quantity and a price\n\n<b>Digital Computer</b>\n• Processes data in discrete form — every piece of data, whether a number, a letter, or an image, is first converted into binary digits (0s and 1s) before the computer works on it.\n• Because everything is reduced to exact binary values, digital computers are highly accurate, and since they can be reprogrammed with new software they are general-purpose — the same machine can do accounting, gaming, or web browsing.\n• This is the type of computer almost everyone uses every day — personal computers, smartphones, servers, and supercomputers are all digital computers.\n• Digital computers are further split by size and processing power into microcomputers, minicomputers, mainframe computers, and supercomputers.\n  ↳ Covered in full, with characteristics and examples for each, in the \"Classification of Computer\" card\n\n<b>Hybrid Computer</b>\n• Combines the features of both analog and digital computers, so it can accept continuous (analog) input and discrete (digital) input at the same time. Hybrid computers are built to handle highly intricate computations, including the logical, technical, and differential-equation problems that matter to large organizations.\n\n<b>Key features of hybrid computers</b>\n• <b>Analog and digital components</b> — integrates both, so it can process continuous real-world signals and also run precise digital computations\n• <b>Fast data conversion</b> — efficiently converts analog data into digital format, so real-world measurements can feed directly into decisions\n• <b>High-speed processing</b> — handles complex mathematical operations and simulations quickly\n• <b>Real-time analysis</b> — excels at analysing continuous data as it happens, not after the fact\n• <b>Complex simulations</b> — supports scientific and engineering simulations that combine mathematical modelling with real-world data\n• <b>Accuracy and precision</b> — produces reliable, precise results across different applications\n• <b>Customization</b> — the balance of analog to digital components can be adjusted, so the same design can be specialised for different uses\n\n<b>Where hybrid computers are used</b>\n• <b>Control systems</b> — manufacturing, aerospace, and automotive systems that need real-time data processing, precise control, and low power consumption\n• <b>Scientific research</b> — physics, chemistry, and biology, where simulations require combining continuous and discrete data\n• <b>Medical imaging</b> — processing data from devices such as MRI and CT scanners\n• <b>Weather prediction</b> — meteorology, since weather modelling needs both ongoing physical processes and detailed numerical models\n• <b>Complex calculations</b> — nuclear reactor simulations and fluid-dynamics studies that combine real-time analysis with heavy numerical computation\n• <b>Optimization problems</b> — problems needing both continuous adjustment and discrete decision-making\n• <b>Energy efficiency</b> — hybrid designs can be more power-efficient than fully digital ones, since some computation is handed off to analog components\n  ↳ Example: an ICU patient-monitoring machine continuously measures a patient's heartbeat and blood pressure (analog signals) and shows the exact reading as a precise digital number on screen\n  ↳ Example: a dialysis machine continuously senses a patient's vital signs (analog) while digitally controlling the treatment process",
    note:
      "If an exam question describes a machine that both measures something continuous in the real world and shows an exact number, that is almost always describing a hybrid computer, not analog or digital alone. And if a question asks how digital computers are further split, that's by size — micro, mini, mainframe, super — detailed in the Classification of Computer card.",
    tags: ["Types of Computer", "Analog", "Digital", "Hybrid", "Mechanical Analog", "Optical Analog"],
  },
  {
    id: 5,
    slug: "classification-of-computer",
    section: "Computer Fundamentals",
    parentSlug: "computer-basics",
    title: "Classification of Computer",
    tagline: "By size, purpose, performance, and data handling",
    description:
      "Beyond how they process data, computers are also classified by their size, their intended purpose, their performance level, and how they handle data.\n\n<b>By Size</b>\n• <b>Supercomputer</b> — the most powerful category, built for extremely complex computations such as scientific simulations, weather forecasting, and modelling natural phenomena. Uses high-performance processors and memory, can perform billions to trillions of calculations per second, and needs a specially cooled environment because of the heat and cost involved.\n  ↳ Examples: IBM Blue Gene, Cray XT5, and current record-holders such as Japan's Fugaku and the USA's Frontier\n• <b>Mainframe Computer</b> — large and powerful, built to process vast amounts of data quickly and reliably. Used by banks, insurance companies, and government institutions for transaction processing and large-scale enterprise applications; can support thousands of users at the same time and runs in high-security, high-uptime environments.\n  ↳ Examples: IBM Z Series, Unisys ClearPath\n• <b>Minicomputer (mid-range computer)</b> — smaller and less powerful than a mainframe but still able to run several programs at once and support up to hundreds of users. Historically used in manufacturing control, research labs, and medium-sized organizations.\n  ↳ Examples: DEC VAX and other Digital Equipment Corporation (DEC) systems\n• <b>Microcomputer (personal computer)</b> — the most common type, built around a single microprocessor chip, designed for general-purpose personal or office tasks like browsing, word processing, and gaming. Smaller, cheaper, and more user-friendly than the categories above.\n  ↳ Examples: desktop PCs, laptops, tablets, smartphones\n• <b>Embedded Computer</b> — a specialized computer built into another device to perform one specific job, rather than existing as a stand-alone machine. Runs on low power with limited resources, needs little to no user interaction, and is commonly used where real-time control of a single task is required.\n  ↳ Examples: smart TVs, washing machines, car control systems, microwave ovens\n\n<b>By Purpose</b>\n• <b>General-purpose computer</b> — designed to handle a wide variety of tasks by running many different types of software; flexible enough for personal, educational, business, and entertainment use, and can be reprogrammed as needs change.\n  ↳ Examples: personal computers, laptops, workstations\n• <b>Special-purpose computer</b> — built and optimized to perform one specific task, or a narrow set of tasks, and cannot be reprogrammed for anything else; usually more efficient than a general-purpose machine at that one job.\n  ↳ Examples: gaming consoles, calculators, traffic signal controllers, ATM machines, microwave ovens\n\n<b>By Performance</b>\n• <b>Workstation</b> — a high-performance computer built for technical or professional work that needs more processing power than a regular PC, such as 3D rendering, video editing, or computer-aided design (CAD). Has strong multi-core processors, large expandable memory, and advanced graphics hardware.\n  ↳ Examples: CAD workstations used by engineers and architects, video-editing workstations, scientific research workstations\n• <b>Server</b> — a computer built to manage, store, and provide resources or services to other computers (clients) over a network, rather than being used directly by one person. Built for high availability and strong processing power, and often runs continuously with extra storage redundancy.\n  ↳ Examples: web servers (Apache, Nginx), database servers (MySQL, Microsoft SQL Server), file servers, mail servers\n\n<b>By Data Handling</b>\n• <b>Batch processing system</b> — collects data over a period of time and processes it all at once in a scheduled batch, with no need for the user to interact while it runs. Efficient for large volumes of data that don't need an instant response.\n  ↳ Examples: payroll systems, end-of-day bank transaction processing, monthly utility billing, retail inventory updates\n• <b>Real-time system</b> — processes data immediately as it arrives and must respond within a strict time limit (a deadline), since any delay could cause safety or operational problems.\n  ↳ Examples: air traffic control systems, industrial automation and robotics, medical monitoring devices, autonomous vehicles\n• <b>Online processing system</b> — a form of real-time handling where the computer stays connected to a server or database so the user can interact with it continuously, with each action processed and reflected immediately.\n  ↳ Examples: e-commerce checkouts, online banking transfers, flight and hotel reservation systems\n\n<b>Note on functionality</b>\nComputers are also classified as analog, digital, or hybrid based on the type of data they process — that breakdown is covered separately in the \"Types of Computer\" card.",
    note:
      "A simple ladder to remember for size: Microcomputer < Minicomputer < Mainframe < Supercomputer. But size is only one lens — the same real machine can be labelled by several classifications at once. A bank's mainframe, for example, is also a special-purpose, high-performance, real-time system.",
    tags: ["Classification", "Size", "Purpose", "Performance", "Data Handling", "Supercomputer", "Mainframe", "Workstation", "Server"],
  },
  // ─────────────────────────────────────────────
  // COMPUTER ARCHITECTURE
  // ─────────────────────────────────────────────
  {
    id: 35,
    slug: "computer-architecture",
    section: "Computer Fundamentals",
    title: "Computer Architecture",
    tagline: "Inside the CPU — how it's built, how it runs instructions, and how its speed is measured",
    description:
      "<b>What This Covers</b>\nComputer Architecture looks inside the CPU itself — the parts it's built from, the exact sequence it follows to run every instruction, and how its speed is actually measured and compared.\n\n<b>What You'll Learn Here</b>\n• <b>CPU (Central Processing Unit)</b> — the ALU, Control Unit, and registers that make up the CPU, and what each one actually does\n• <b>Instruction Cycle</b> — the Fetch → Decode → Execute → Store loop the CPU repeats for every single instruction, billions of times a second\n• <b>CPU Performance</b> — clock speed, CPI, and MIPS, plus the difference between multiprocessing, multiprogramming, and parallel processing\n  ↳ These three build directly on each other: first the CPU's parts, then how those parts cooperate to run one instruction, then how to measure and compare that speed across different CPUs.",
    note:
      "Read these three in order — Instruction Cycle only makes sense once you know what the ALU, Control Unit, and registers (from the CPU card) actually are, and CPU Performance builds on the Instruction Cycle to explain why some CPUs get through instructions faster than others.",
    diagram:
      "  COMPUTER ARCHITECTURE — how the topics build on each other\n\n   CPU               Instruction Cycle          CPU Performance\n  (ALU, Control  ──►  (Fetch→Decode→        ──►  (Clock Speed, CPI,\n   Unit, Registers)    Execute→Store loop)         MIPS, Parallel Processing)",
    tags: ["Computer Architecture", "CPU", "Instruction Cycle", "CPU Performance"],
  },
  {
    id: 6,
    slug: "cpu",
    section: "Computer Fundamentals",
    parentSlug: "computer-architecture",
    title: "CPU (Central Processing Unit)",
    tagline: "The brain of the computer — ALU, Control Unit, and registers working together",
    description:
      "The CPU (Central Processing Unit) is often called the \"brain\" of the computer — it is the component that actually carries out the instructions of a program, doing every calculation and every decision the computer makes.\n\n<b>What the CPU Does</b>\nEvery instruction a program gives, whether it's adding two numbers or comparing two values, is carried out inside the CPU. It is built from two main functional parts — the ALU and the CU — plus a small set of very fast internal registers that hold data while it's being worked on.\n  ↳ Analogy: think of the CPU as a small office — the ALU is the person doing the math, the CU is the manager telling that person what to do and when, and the registers are the sticky notes on the desk holding the numbers currently in use.\n\n<b>Arithmetic Logic Unit (ALU)</b>\nThe ALU is the part of the CPU that actually performs calculations.\n• Carries out arithmetic operations — addition, subtraction, multiplication, division\n• Carries out logic operations — AND, OR, NOT, and comparisons such as equal-to, greater-than, and less-than\n• Takes its inputs from registers, performs the operation, and places the result back into a register\n  ↳ If a question asks \"which part of the CPU actually does the math,\" the answer is always the ALU, not the CU.\n\n<b>Control Unit (CU)</b>\nThe CU doesn't do any calculation itself — its job is to direct and coordinate every other part of the CPU.\n• Fetches instructions from memory and decodes what they mean\n• Generates the timing and control signals that tell the ALU, registers, and memory when to act and in what order\n• Manages the overall flow of data between the CPU, memory, and input/output devices\n  ↳ Think of the CU as traffic control — it doesn't move any of the cars (data) itself, it just tells everyone else when to go.\n\n<b>Registers</b>\nRegisters are tiny, extremely fast storage locations built directly into the CPU, used to hold data and instructions that are in immediate use. They are much smaller than RAM but far faster, since the CPU doesn't need to reach outside itself to use them.\n• <b>Instruction Register (IR)</b> — holds the instruction that is currently being decoded and executed by the CPU\n• <b>Program Counter (PC)</b> — holds the memory address of the next instruction to be fetched; it is automatically incremented after each fetch so the CPU always knows where to go next\n• <b>Accumulator (ACC)</b> — a general-purpose register that holds the intermediate results of arithmetic and logic operations while the ALU is working\n  ↳ A simple way to remember the three: the Program Counter says \"where to go next,\" the Instruction Register says \"what I'm doing right now,\" and the Accumulator says \"what I've got so far.\"\n  ↳ How these registers get used every single cycle, step by step, is covered in full in the \"Instruction Cycle\" card right after this one.",
    note:
      "Exam favourite: the ALU calculates, the CU controls — the CU itself never performs a calculation. Keep the three registers straight by what question each answers: PC = \"where next?\", IR = \"what now?\", ACC = \"what so far?\"",
    tags: ["CPU", "ALU", "Control Unit", "Registers", "Program Counter", "Instruction Register", "Accumulator"],
  },
  {
    id: 7,
    slug: "instruction-cycle",
    section: "Computer Fundamentals",
    parentSlug: "computer-architecture",
    title: "Instruction Cycle (Fetch → Decode → Execute → Store)",
    tagline: "The repeating four-step loop the CPU uses to run every single instruction",
    description:
      "Every instruction a CPU runs — whether it's something as simple as adding two numbers or something far more complex — goes through the exact same four-step loop. This loop is called the instruction cycle, or sometimes the machine cycle, and it runs over and over, billions of times every second, for as long as the computer is switched on.\n\n<b>The Four Steps</b>\n• <b>Fetch</b> — the Control Unit (CU) looks at the Program Counter (PC), which holds the memory address of the next instruction, and retrieves that instruction from memory. The instruction is loaded into the Instruction Register (IR), and the PC is immediately moved forward so it's already pointing at the following instruction.\n• <b>Decode</b> — the CU looks at whatever instruction is now sitting in the IR and works out what it actually means: which operation is being asked for (add, compare, move data, and so on), and which registers or memory locations it needs.\n• <b>Execute</b> — the CU sends the decoded operation to the part of the CPU that actually does the work, usually the ALU. This is the step where the real calculation, comparison, or data movement happens.\n• <b>Store</b> — the result produced by the Execute step is written somewhere it can be used again, usually into a register such as the Accumulator (ACC), or back out to memory.\n  ↳ As soon as Store finishes, the cycle goes straight back to Fetch, for the very next instruction, whose address is already waiting in the PC.\n\n<b>Why It Never Stops</b>\nA computer program is really just a long list of instructions sitting in memory. The instruction cycle is the mechanism that walks through that list one instruction at a time, in order, unless something (like a jump or a branch instruction) tells the PC to point somewhere else instead. Because this loop runs so fast, it feels to the user like the computer is doing many things \"at once,\" even though, at the hardware level, each individual CPU core is really still working through one instruction cycle after another.\n\n<b>Worked Example — Adding Two Numbers</b>\nSay a program needs to compute 5 + 3.\n1. <b>Fetch</b> — the CU fetches the instruction \"add the value at address X to the Accumulator\" from memory into the IR.\n2. <b>Decode</b> — the CU works out this is an ADD operation, and that it needs the value currently in the Accumulator (say, 5) and the value stored at address X (say, 3).\n3. <b>Execute</b> — the ALU actually adds 5 + 3, producing 8.\n4. <b>Store</b> — the result, 8, is written back into the Accumulator, replacing the old value of 5.\n  ↳ The CPU is now ready to fetch whatever instruction comes next — perhaps one that saves this 8 somewhere permanent, or uses it in another calculation.\n\n<b>Fetch vs. Execute — A Common Mix-Up</b>\nExams sometimes test whether you can tell these two steps apart. Fetch is only about retrieving the instruction itself from memory — no calculation happens yet. Execute is where the instruction is actually carried out. Mixing the two up is one of the most common mistakes on this topic.",
    note:
      "The order Fetch → Decode → Execute → Store never changes — learn it in that exact sequence. Fetch reads the instruction, Decode figures out what it means, Execute does the actual work, Store saves the result. Also remember: the Program Counter (PC) always holds the address of the NEXT instruction, not the current one — it's already been moved forward by the time Execute runs.",
    diagram:
      "  FETCH ──► DECODE ──► EXECUTE ──► STORE\n    │                                  │\n    └───────────◄──────────────────────┘\n      loop repeats for the next instruction\n\n  FETCH    Program Counter (PC) points to an address in memory.\n           CU loads the instruction at that address into the\n           Instruction Register (IR). PC then moves to the\n           next address.\n\n  DECODE   CU reads what's now in the IR and works out which\n           operation this is, and what data or registers it needs.\n\n  EXECUTE  CU sends the decoded operation to the ALU (or another\n           CPU part). The actual work happens here — add,\n           compare, move data, etc.\n\n  STORE    The result is written into a register (often the\n           Accumulator) or back out to memory.",
    tags: ["Instruction Cycle", "Machine Cycle", "Fetch", "Decode", "Execute", "Store", "Program Counter", "Instruction Register", "Accumulator"],
  },
  {
    id: 8,
    slug: "cpu-performance",
    section: "Computer Fundamentals",
    parentSlug: "computer-architecture",
    title: "CPU Performance",
    tagline: "Clock speed, CPI, and MIPS — how CPU speed is actually measured",
    description:
      "\"How fast is this CPU?\" isn't answered with just one number — it usually takes a few related measurements together, plus an understanding of how a CPU can do more than one thing at a time.\n\n<b>Clock Speed</b>\nEvery CPU has an internal clock that ticks at a fixed rate, and each tick is called a clock cycle. Clock speed is simply how many of these cycles happen every second, measured in Hertz (Hz). Modern CPUs run in the gigahertz (GHz) range — billions of cycles per second.\n• A higher clock speed generally lets a CPU get through more work per second.\n• But clock speed alone doesn't tell the whole story — two CPUs with the same clock speed can still perform very differently, because they may need a different number of cycles to finish the same instruction.\n\n<b>CPI — Cycles Per Instruction</b>\nCPI is the average number of clock cycles a CPU needs to complete one instruction. Some instructions are simple and finish in a single cycle; others, like multiplication, take several. CPI is the average across every instruction a program actually runs.\n• A lower CPI means the CPU is getting more done per cycle — it's more efficient, even at the same clock speed.\n\n<b>MIPS — Million Instructions Per Second</b>\nMIPS combines clock speed and CPI into one throughput number: literally, how many million instructions the CPU completes every second.\n\n<b>MIPS = Clock Speed ÷ (CPI × 10^6)</b>\n\n<b>Worked Example</b>\nSay a CPU runs at a clock speed of 2,000,000,000 Hz (2 GHz) and has an average CPI of 4.\nMIPS = 2,000,000,000 ÷ (4 × 1,000,000) = 2,000,000,000 ÷ 4,000,000 = 500 MIPS\n  ↳ That CPU completes about 500 million instructions every second. If its CPI improved to 2 (more efficient), MIPS would double to 1,000 — showing that a lower CPI pushes MIPS up just as much as a higher clock speed does.\n  ↳ MIPS can be misleading when comparing two very different CPU designs, since one \"instruction\" doesn't always do the same amount of work on every architecture.\n\n<b>Parallel Processing</b>\nParallel processing means splitting one large task into smaller parts and running those parts at the same time, either across multiple cores inside one CPU or across multiple separate processors, so the whole task finishes faster than doing every part one after another.\n  ↳ Example: adding up a list of a million numbers can be split into four smaller lists, added on four cores at the same time, then the four sub-totals are combined at the end.\n\n<b>Multiprocessing</b>\nMultiprocessing means a computer system is physically built with two or more CPUs (or processor cores), and it genuinely runs multiple processes at the same time — one process really is running on each processor, simultaneously. This increases overall throughput, and adds reliability too, since one processor failing doesn't necessarily stop the whole system.\n\n<b>Multiprocessing vs. Multiprogramming vs. Parallel Processing</b>\nThese three terms are commonly confused, but they describe different things.\n• <b>Multiprocessing</b> — multiple real, physical CPUs or cores, each genuinely running a task at the same moment.\n• <b>Multiprogramming</b> — only one CPU, rapidly switching between several programs so it looks like they're all running together, when really only one is executing at any single instant.\n• <b>Parallel processing</b> — one single task deliberately split into pieces that run simultaneously across multiple processors, aimed at finishing that one task faster.\n  ↳ A simple way to tell them apart: multiprocessing is about how many physical processors a system has; multiprogramming is about one processor juggling many programs; parallel processing is about breaking up one job to finish it quicker.",
    note:
      "Memorize the formula in the exact direction it's usually asked: MIPS = Clock Speed ÷ (CPI × 10^6). A lower CPI or a higher clock speed both push MIPS up. And keep the three \"multi-\" words strictly separate: multiprocessing = multiple physical CPUs really running at once, multiprogramming = one CPU switching between programs, parallel processing = one task split across processors to finish faster.",
    diagram:
      "  MULTIPROGRAMMING (1 CPU, switching between programs)\n\n  CPU:   [ Program A ][ Program B ][ Program A ][ Program C ]...\n           time slice    time slice   time slice   time slice\n         → only ONE program is actually running at any instant\n\n  ──────────────────────────────────────────────────────────\n\n  MULTIPROCESSING (2+ CPUs, each running a program at once)\n\n  CPU 1:  [ Program A ][ Program A ][ Program A ]...\n  CPU 2:  [ Program B ][ Program B ][ Program B ]...\n         → A and B genuinely run at the same time, on different CPUs\n\n  ──────────────────────────────────────────────────────────\n\n  PARALLEL PROCESSING (1 task split across processors)\n\n  Task: add 1,000,000 numbers\n  CPU 1: adds numbers 1–250,000          ┐\n  CPU 2: adds numbers 250,001–500,000    ├─► combine sub-totals → final result\n  CPU 3: adds numbers 500,001–750,000    │\n  CPU 4: adds numbers 750,001–1,000,000  ┘",
    tags: ["CPU Performance", "Clock Speed", "CPI", "MIPS", "Parallel Processing", "Multiprocessing", "Multiprogramming"],
  },
  // ─────────────────────────────────────────────
  // MEMORY ORGANIZATION
  // ─────────────────────────────────────────────
  {
    id: 36,
    slug: "memory-organization",
    section: "Computer Fundamentals",
    title: "Memory Organization",
    tagline: "How a computer stores data — from Primary Memory and Secondary Storage to the full Memory Hierarchy",
    description:
      "<b>What This Covers</b>\nMemory Organization looks at every place a computer stores data — the fast, volatile primary memory the CPU works with directly, the permanent secondary storage that survives a power-off, and how all of these layers fit together into one overall hierarchy.\n\n<b>What You'll Learn Here</b>\n• <b>Primary Memory</b> — RAM (including SRAM and DRAM) and ROM (including PROM, EPROM, and EEPROM), the memory the CPU can access directly\n• <b>Secondary Storage</b> — HDD, SSD, optical storage, and flash memory, the non-volatile storage that holds everything permanently\n• <b>Memory Hierarchy</b> — how registers, cache, RAM, and secondary storage all fit together in one pyramid, trading off speed, size, and cost\n  ↳ Each is covered in full in its own card next, working from the fastest, smallest memory down to the largest, slowest storage.",
    note:
      "Primary Memory and Secondary Storage each go deep on one layer of the hierarchy; Memory Hierarchy then ties all of those layers together into a single picture, so it's worth reading last of the three.",
    tags: ["Memory Organization", "Primary Memory", "Secondary Storage", "Memory Hierarchy"],
  },
  {
    id: 9,
    slug: "primary-memory",
    section: "Computer Fundamentals",
    parentSlug: "memory-organization",
    title: "Primary Memory",
    tagline: "The CPU's direct-access memory — where running programs and data live",
    description:
      "<b>What Primary Memory Is</b>\nPrimary memory (also called main memory) is the memory the CPU can access directly and immediately, without going through a slower storage layer like a hard disk or SSD. Whatever program is currently running, and whatever data it's currently working on, lives in primary memory while the CPU uses it.\n  ↳ Contrast this with secondary memory (hard disks, SSDs, pen drives) — the CPU cannot work on data sitting in secondary memory directly; it must first be loaded into primary memory.\n\n<b>Two Types of Primary Memory</b>\nPrimary memory is split into two families based on one key property: whether it loses its data when the power turns off.\n• <b>RAM (Random Access Memory)</b> — volatile memory; the CPU can both read and write to it, and it holds programs and data actively in use. Loses everything the instant power is cut.\n• <b>ROM (Read Only Memory)</b> — non-volatile memory; keeps its contents even when the power is off. Traditionally the CPU could only read from it, not write to it (hence the name), and it typically stores fixed, permanent instructions like the computer's startup firmware.\n\n<b>Volatile vs Non-Volatile — the Core Distinction</b>\n• <b>Volatile</b> — memory that loses all its stored data as soon as power is removed. RAM is volatile.\n  ↳ This is why unsaved work disappears if a computer suddenly loses power — it was sitting only in RAM.\n• <b>Non-volatile</b> — memory that keeps its stored data even without power. ROM is non-volatile.\n  ↳ This is why a computer still \"remembers\" how to start itself up even after being completely unplugged — that startup code sits in ROM, not RAM.\n\n<b>Why This Split Matters</b>\nA computer needs both kinds. It needs RAM so the CPU has fast, changeable working space for whatever program is currently running. And it needs ROM so there is always a fixed, unerasable set of instructions available the moment the machine is switched on — before any operating system has even loaded from disk.\n  ↳ Each of RAM's two internal types (SRAM, DRAM) and each stage in ROM's family (ROM, PROM, EPROM, EEPROM) is covered in its own card next.",
    note:
      "If a question asks \"which memory loses data on power-off\", the answer is RAM (volatile). If it asks \"which memory survives a power cut\", the answer is ROM (non-volatile). Primary memory = RAM + ROM together; secondary memory (disks) is a separate topic.",
    diagram:
      "                    PRIMARY MEMORY\n                          │\n            ┌─────────────┴─────────────┐\n            │                           │\n           RAM                         ROM\n   (volatile, read/write)      (non-volatile, mostly read-only)\n            │                           │\n      ┌─────┴─────┐         ┌───────────┼────────────┐\n     SRAM        DRAM      ROM        PROM    EPROM  EEPROM\n   (fast,       (slower,  (fixed at  (write   (UV    (electrically\n    cache)       main RAM) factory)   once)    erase) erasable)",
    tags: ["Primary Memory", "RAM", "ROM", "Volatile", "Non-Volatile", "Main Memory"],
  },
  {
    id: 10,
    slug: "ram",
    section: "Computer Fundamentals",
    parentSlug: "primary-memory",
    title: "RAM (Random Access Memory)",
    tagline: "The CPU's fast, volatile workspace for active programs and data",
    description:
      "<b>What RAM Is</b>\nRAM (Random Access Memory) is the main working memory of a computer. Whatever program is currently running and whatever data it's currently using sits in RAM so the CPU can read and write to it almost instantly.\n  ↳ \"Random access\" means the CPU can jump straight to any memory location in roughly the same amount of time, instead of having to read through memory in order — unlike, say, an old cassette tape.\n\n<b>Key Properties</b>\n• <b>Volatile</b> — RAM loses everything it's holding the instant power is switched off. This is why unsaved work in an open document disappears if the computer suddenly loses power.\n• <b>Read and write</b> — unlike ROM, the CPU can both read data from RAM and write new data into it, constantly, while a program runs.\n• <b>Fast</b> — RAM is dramatically faster to access than secondary storage like a hard disk or SSD, which is exactly why the CPU keeps active data there instead of reading it from disk every time.\n• <b>Directly addressable</b> — every location in RAM has its own address, and the CPU can access any of them directly.\n\n<b>Why More RAM Helps</b>\nThe more RAM a computer has, the more programs and data it can keep ready for the CPU at once, without needing to constantly swap things in and out from the slower disk. This is why \"my computer is slow\" is very often solved by adding more RAM.\n\n<b>The Two Types of RAM</b>\nRAM itself comes in two different technologies, each with different speed, cost, and design trade-offs:\n• <b>SRAM (Static RAM)</b> — faster and more expensive, used for small amounts of memory like CPU cache\n• <b>DRAM (Dynamic RAM)</b> — slower and cheaper, used for a computer's main RAM in bulk\n  ↳ Both are covered in full, with a side-by-side comparison, in their own cards next.",
    note:
      "RAM is defined by two words: volatile (loses data on power-off) and read/write (the CPU can change what's stored, not just read it). ROM, covered later in this section, is the opposite on both counts.",
    tags: ["RAM", "Random Access Memory", "Volatile", "Main Memory", "Read/Write"],
  },
  {
    id: 11,
    slug: "sram",
    section: "Computer Fundamentals",
    parentSlug: "ram",
    title: "SRAM (Static RAM)",
    tagline: "Fast, expensive RAM built from flip-flops, used for CPU cache",
    description:
      "<b>What SRAM Is</b>\nSRAM (Static Random Access Memory) is a type of RAM built from tiny circuits called flip-flops (usually six transistors per bit). A flip-flop holds its bit of data steadily, using continuous power, without needing anything else to keep refreshing it.\n  ↳ \"Static\" refers to this — the data stays put on its own, as long as power is supplied, with no refreshing needed.\n\n<b>Key Characteristics</b>\n• <b>Very fast</b> — SRAM can be read and written much faster than DRAM, since a flip-flop can be accessed immediately without any refresh delay.\n• <b>No refresh needed</b> — the data holds steady by itself as long as power stays on, unlike DRAM which needs constant refreshing.\n• <b>More expensive per bit</b> — each SRAM bit needs about six transistors, versus roughly one transistor plus a capacitor for a DRAM bit, so SRAM takes up more physical chip space and costs more to manufacture for the same amount of storage.\n• <b>Still volatile</b> — like all RAM, SRAM loses its data the instant power is removed.\n\n<b>Where SRAM Is Used</b>\nBecause it's fast but expensive, SRAM is used only in small amounts, exactly where speed matters most — the CPU's cache memory (L1, L2, and often L3 cache), which stores the small chunks of data and instructions the CPU is most likely to need again immediately.\n  ↳ It would be far too expensive to build an entire computer's main memory out of SRAM — that's what the cheaper DRAM, covered next, is for.",
    note:
      "Memory trick: Static RAM = Stable, no refresh needed, but more expensive — used for small, fast CPU cache. If an exam question mentions \"cache memory\" or \"no refresh required,\" it's talking about SRAM.",
    diagram:
      "  SRAM vs DRAM — quick comparison\n\n  Property             SRAM              DRAM\n  ──────────────────────────────────────────────────\n  Built from           flip-flop (6      capacitor + 1\n                       transistors)      transistor\n  Refresh needed?      No                Yes (constantly)\n  Speed                Faster            Slower\n  Cost per bit         Higher            Lower\n  Typical use          CPU cache         Main system RAM\n  Density (bits/chip)  Lower             Higher",
    tags: ["SRAM", "Static RAM", "Cache Memory", "Flip-Flop", "Volatile"],
  },
  {
    id: 12,
    slug: "dram",
    section: "Computer Fundamentals",
    parentSlug: "ram",
    title: "DRAM (Dynamic RAM)",
    tagline: "Cheaper, denser RAM that needs constant refreshing, used as main RAM",
    description:
      "<b>What DRAM Is</b>\nDRAM (Dynamic Random Access Memory) is the type of RAM used for a computer's main memory — the RAM sticks/modules installed on the motherboard. Each bit of data is stored as a tiny electric charge in a capacitor, alongside a single transistor that controls access to it.\n  ↳ \"Dynamic\" refers to this — a capacitor's charge naturally leaks away over time, so the data doesn't hold steady on its own the way SRAM's does.\n\n<b>Why DRAM Needs Refreshing</b>\nBecause the capacitor's charge leaks away within milliseconds, DRAM needs to be \"refreshed\" — read and rewritten — thousands of times per second, for every single cell, or the stored data would simply fade away and be lost. This refreshing happens automatically, handled by the memory controller, and is invisible to the user, but it does use up a small amount of time and power that SRAM doesn't need.\n\n<b>Key Characteristics</b>\n• <b>Cheaper per bit</b> — needing only one transistor and one capacitor per bit (versus SRAM's six transistors), DRAM packs far more storage into the same chip space, at a much lower cost.\n• <b>Slower than SRAM</b> — the refresh cycles and the way a capacitor's charge must be read add a small delay that flip-flop-based SRAM doesn't have.\n• <b>Higher density</b> — because each cell is so much smaller, DRAM chips can hold far more total memory than SRAM chips of a similar size.\n• <b>Still volatile</b> — all data is lost the instant power is switched off, refresh or no refresh.\n\n<b>Where DRAM Is Used</b>\nDRAM is what's installed as the main RAM in virtually every desktop, laptop, and phone — the modules specified as \"8GB RAM\" or \"16GB RAM\" are DRAM. Its low cost per bit is what makes it practical to have gigabytes of it, whereas an equivalent amount of SRAM would be far too expensive and physically large.\n  ↳ Common real-world variants: DDR4 and DDR5 (Double Data Rate) are the DRAM types found in most modern computers.",
    note:
      "Memory trick: Dynamic RAM = needs constant refreshing (capacitor charge leaks), cheaper, higher density — used for a computer's main RAM. If a question mentions \"needs to be refreshed\" or \"capacitor-based,\" it's talking about DRAM.",
    tags: ["DRAM", "Dynamic RAM", "Main Memory", "Capacitor", "Refresh Cycle", "Volatile"],
  },
  {
    id: 13,
    slug: "rom",
    section: "Computer Fundamentals",
    parentSlug: "primary-memory",
    title: "ROM (Read Only Memory)",
    tagline: "Non-volatile memory that stores fixed instructions permanently",
    description:
      "<b>What ROM Is</b>\nROM (Read Only Memory) is non-volatile memory — it keeps its stored data permanently, even when the power is switched off. As the name suggests, in its original form the CPU can only read from it, not write new data into it.\n\n<b>Why Computers Need ROM</b>\nWhen a computer is first switched on, it needs some fixed set of instructions to begin with, before an operating system has even been loaded from disk into RAM. ROM holds exactly this — permanent, unchanging startup instructions (commonly called firmware, such as the BIOS or UEFI) that tell the computer how to begin booting up.\n  ↳ Because ROM is non-volatile, this startup code is always there, ready, the instant power is applied — nothing needs to be loaded into it first.\n\n<b>Key Characteristics</b>\n• <b>Non-volatile</b> — retains its data indefinitely, with or without power.\n• <b>Read-only (originally)</b> — traditional ROM is written once, at the factory, during manufacturing, and can never be changed afterward.\n• <b>Slower than RAM</b> — ROM is generally slower to access than RAM, which is fine since it's used for small amounts of fixed startup code, not for actively running programs.\n• <b>Stores firmware</b> — used for permanent, low-level instructions rather than user programs or documents.\n\n<b>The Problem With Original ROM</b>\nTraditional (masked) ROM is programmed permanently during manufacturing, using a fixed pattern burned directly into the chip. This means even a single error, or any need to update the code later, requires manufacturing a brand new chip from scratch — there is no way to fix or update the one already in the computer.\n  ↳ This limitation is exactly what led to the family of \"programmable\" ROM variants — PROM, EPROM, and EEPROM — each solving this problem a little better than the last. Covered in the next three cards, in that exact order.",
    note:
      "ROM's defining pair: non-volatile (keeps data without power) and, in its original form, read-only (fixed forever at manufacture). Everything about PROM, EPROM, and EEPROM is really the story of engineers finding ways to make that second part less permanent.",
    diagram:
      "  THE ROM FAMILY — increasing flexibility over time\n\n  ROM ────────► PROM ────────► EPROM ────────► EEPROM\n  fixed at      written once   erased with     erased and\n  factory       by the user,   UV light,       rewritten\n  (masked)      never again    then rewritten  electrically,\n                                (whole chip)    byte-by-byte,\n                                                no removal needed\n\n  Each step to the right removes one more restriction on\n  \"how do I change what's stored after manufacturing?\"",
    tags: ["ROM", "Read Only Memory", "Non-Volatile", "Firmware", "BIOS"],
  },
  {
    id: 14,
    slug: "prom",
    section: "Computer Fundamentals",
    parentSlug: "rom",
    title: "PROM (Programmable ROM)",
    tagline: "Blank ROM chips a user can write to exactly once",
    description:
      "<b>What PROM Is</b>\nPROM (Programmable Read Only Memory) is a type of ROM chip that comes blank from the factory, rather than pre-written. A user (or manufacturer) can then write — or \"burn\" — their own data or program into it using a special device called a PROM programmer.\n\n<b>The One Big Rule: Write Once</b>\nOnce data has been burned into a PROM chip, it becomes permanent, exactly like a masked ROM — it cannot be erased or rewritten again, ever. If even one bit needs to change, the entire chip has to be thrown away and a fresh blank one programmed instead.\n  ↳ Physically, this works by literally destroying (\"blowing\") tiny internal fuses in specific positions to represent 0s and 1s — a blown fuse can't grow back, which is exactly why PROM can only ever be written once.\n\n<b>Why PROM Was an Improvement</b>\nBefore PROM, a ROM chip's contents had to be decided at the factory during manufacturing, which meant huge minimum order quantities and no room for last-minute changes. PROM let manufacturers (or even end users) buy generic blank chips and burn in their own custom program afterward, which was faster and cheaper for small production runs or one-off custom devices.\n\n<b>Key Characteristics</b>\n• <b>Non-volatile</b> — like all ROM, keeps its data with or without power.\n• <b>Write once</b> — can be programmed by the user, but only a single time.\n• <b>Not reusable</b> — a mistake, or any need for an update, means discarding the chip entirely.\n  ↳ This exact limitation is what led to EPROM next — a ROM chip that actually can be erased and reused.",
    note:
      "PROM = blank chip + burn once. Nothing can be undone afterward — that's the one fact exams test most on PROM, since it's the detail that separates PROM from EPROM and EEPROM.",
    tags: ["PROM", "Programmable ROM", "Write Once", "Fuse", "Non-Volatile"],
  },
  {
    id: 15,
    slug: "eprom",
    section: "Computer Fundamentals",
    parentSlug: "rom",
    title: "EPROM (Erasable PROM)",
    tagline: "Reusable ROM erased with ultraviolet light through a quartz window",
    description:
      "<b>What EPROM Is</b>\nEPROM (Erasable Programmable Read Only Memory) is a ROM chip that solves PROM's biggest weakness — being stuck permanently after one write. An EPROM chip can be erased and reprogrammed many times, not just once.\n\n<b>How Erasing Actually Works</b>\nAn EPROM chip has a small transparent quartz window built into its casing. To erase it, the entire chip is exposed to strong ultraviolet (UV) light through that window, typically for around 15–20 minutes, using a device called a UV EPROM eraser. This UV exposure resets every single memory cell on the chip back to blank, all at once — there is no way to erase just one part of it.\n  ↳ Once erased, the whole chip can then be reprogrammed from scratch, again using a PROM-style programmer device.\n\n<b>Key Characteristics</b>\n• <b>Non-volatile</b> — keeps its data indefinitely without power, exactly like every ROM variant.\n• <b>Reusable</b> — unlike PROM, an EPROM chip can go through many erase-and-rewrite cycles over its lifetime.\n• <b>Erased as a whole</b> — erasing is all-or-nothing across the entire chip; individual bytes cannot be erased on their own.\n• <b>Must be physically removed</b> — the chip generally has to be taken out of the circuit and placed under a UV eraser device to be erased; it cannot be erased while still installed and running in the computer.\n\n<b>The Remaining Problem</b>\nHaving to physically remove the chip and shine UV light on it for many minutes is slow and inconvenient — completely impractical for any situation where data needs to be updated often or automatically, while the chip stays installed.\n  ↳ This is exactly the problem EEPROM was built to solve next.",
    note:
      "EPROM's signature detail: erased using UV light through a visible quartz window, and always erased entirely, never just part of it. If an exam question mentions a \"quartz window\" or \"UV light,\" it's describing EPROM specifically, not EEPROM.",
    tags: ["EPROM", "Erasable PROM", "UV Light", "Quartz Window", "Reusable", "Non-Volatile"],
  },
  {
    id: 16,
    slug: "eeprom",
    section: "Computer Fundamentals",
    parentSlug: "rom",
    title: "EEPROM (Electrically Erasable PROM)",
    tagline: "Reusable ROM erased and rewritten with electrical signals, byte by byte",
    description:
      "<b>What EEPROM Is</b>\nEEPROM (Electrically Erasable Programmable Read Only Memory) is the most flexible member of the ROM family. Instead of needing UV light and physical removal like EPROM, an EEPROM chip can be erased and rewritten using ordinary electrical signals, while it stays installed inside the running device.\n\n<b>What Makes It Different From EPROM</b>\n• <b>Electrical erasing, not UV light</b> — erasing is done by applying an electrical voltage, not by exposing the chip to ultraviolet light, so there's no quartz window and no separate eraser device needed.\n• <b>No physical removal needed</b> — an EEPROM chip can be erased and reprogrammed right where it sits on the circuit board, in-system, without ever taking it out.\n• <b>Byte-level erasing</b> — EEPROM can typically erase and rewrite one individual byte at a time, rather than being forced to wipe the entire chip at once like EPROM.\n\n<b>Key Characteristics</b>\n• <b>Non-volatile</b> — retains data with or without power, like every ROM variant.\n• <b>Reusable, many times over</b> — supports a large number of erase/write cycles (commonly around 100,000 to a million, depending on the chip), though not truly unlimited.\n• <b>Slower to write than to read</b> — writing/erasing an EEPROM cell takes noticeably longer than simply reading from it, so it isn't used as a substitute for RAM.\n\n<b>Where EEPROM Is Used Today</b>\nEEPROM is commonly used for small amounts of data that need to change occasionally but must survive power loss — such as a computer's BIOS/UEFI settings, configuration data in routers and appliances, and small persistent settings on embedded devices.\n  ↳ Modern flash memory (used in USB drives, SSDs, and memory cards) is actually a direct descendant of EEPROM technology, refined for much higher speed and storage density.",
    note:
      "EEPROM's signature detail: erased electrically, in-system, byte by byte — no UV light, no quartz window, no removing the chip. The clean progression to remember: ROM (fixed forever) → PROM (write once) → EPROM (erase with UV, whole chip, chip removed) → EEPROM (erase electrically, byte by byte, no removal).",
    tags: ["EEPROM", "Electrically Erasable", "Flash Memory", "Byte-Level", "Reusable", "Non-Volatile"],
  },
  {
    id: 17,
    slug: "secondary-storage",
    section: "Computer Fundamentals",
    parentSlug: "memory-organization",
    title: "Secondary Storage",
    tagline: "Permanent, non-volatile storage the CPU cannot access directly",
    description:
      "<b>What Secondary Storage Is</b>\nSecondary storage (also called auxiliary storage) is where a computer keeps data and programs permanently — files, documents, installed software, the operating system itself — even when the power is switched off. Unlike primary memory, the CPU cannot work on data sitting in secondary storage directly; it must first be loaded into RAM before the CPU can use it.\n  ↳ This is why opening a large file feels slower the first time (loading it from secondary storage into RAM) but instant the second time if it's still cached in RAM.\n\n<b>Secondary vs Primary Memory</b>\n• <b>Non-volatile</b> — secondary storage keeps its data indefinitely, with or without power, unlike RAM.\n• <b>Much slower</b> — secondary storage is far slower to access than RAM, since data must travel through more layers of hardware (and, for some types, physically moving parts) before reaching the CPU.\n• <b>Much larger capacity</b> — a typical computer has far more secondary storage (hundreds of gigabytes to several terabytes) than primary memory (a few to a few dozen gigabytes of RAM), since it's much cheaper per unit of storage.\n• <b>Not directly addressable by the CPU</b> — the CPU cannot execute instructions or process data straight from secondary storage; everything has to be copied into RAM first.\n\n<b>The Four Common Types</b>\n• <b>HDD (Hard Disk Drive)</b> — traditional magnetic storage using spinning platters, the long-standing default for bulk storage\n• <b>SSD (Solid State Drive)</b> — flash-based storage with no moving parts, now the standard for speed\n• <b>Optical Storage</b> — CDs, DVDs, and Blu-ray discs, read using a laser\n• <b>Flash Memory</b> — small, portable solid-state storage such as USB drives and memory cards\n  ↳ Each is covered in its own card next, with a full comparison of speed, cost, and how it physically stores data.",
    note:
      "If a question asks which memory the CPU can use directly, the answer is never secondary storage — data always has to be loaded into RAM first. Secondary storage's whole purpose is permanent, large-capacity storage, not speed.",
    diagram:
      "        SECONDARY STORAGE (non-volatile, large capacity, slow)\n                       │\n     ┌─────────┬───────┴────────┬─────────────┐\n    HDD        SSD          Optical         Flash\n (magnetic,  (flash chips, (CD/DVD/         Memory\n  spinning    no moving     Blu-ray,        (USB drives,\n  platters)   parts)        laser read)     memory cards)",
    tags: ["Secondary Storage", "Non-Volatile", "HDD", "SSD", "Optical Storage", "Flash Memory"],
  },
  {
    id: 18,
    slug: "hdd",
    section: "Computer Fundamentals",
    parentSlug: "secondary-storage",
    title: "HDD (Hard Disk Drive)",
    tagline: "Magnetic spinning-platter storage — the traditional workhorse of bulk storage",
    description:
      "<b>What an HDD Is</b>\nA Hard Disk Drive (HDD) stores data magnetically on one or more spinning circular platters coated with a magnetic material. A read/write head, mounted on an arm that moves across the platter, reads and writes data as the platter spins beneath it.\n\n<b>How It Works</b>\n• The platters spin at high speed (commonly 5,400 or 7,200 RPM — revolutions per minute).\n• Data is stored as tiny magnetized regions arranged in concentric circular tracks, further divided into sectors.\n• The read/write head physically moves in and out across the platter to reach the correct track, then waits for the platter's rotation to bring the correct sector underneath it — these two delays are called seek time and rotational latency.\n  ↳ Together, seek time and rotational latency are why an HDD is much slower than an SSD, especially for random access to many small, scattered files.\n\n<b>Key Characteristics</b>\n• <b>Non-volatile</b> — retains data with the power off, exactly like all secondary storage.\n• <b>Mechanical, moving parts</b> — the spinning platters and moving read/write head make an HDD more fragile and prone to damage from physical shock (drops, bumps) than an SSD.\n• <b>Slower</b> — the physical movement needed to reach data makes an HDD considerably slower than an SSD, especially for random reads/writes.\n• <b>Cheaper per gigabyte</b> — HDDs remain the cheapest way to buy large amounts of storage, which is why they're still common for bulk, archival storage.\n• <b>Noisy and power-hungry (relatively)</b> — the spinning platters and moving head produce audible noise and use more power than a solid-state alternative.\n\n<b>Where HDDs Are Still Used</b>\nDespite SSDs taking over as the default for everyday computers, HDDs remain common in servers, backup systems, network-attached storage (NAS), and anywhere a large amount of storage is needed at the lowest possible cost per gigabyte, and top speed isn't the priority.",
    note:
      "HDD's signature detail: physical moving parts — spinning platters and a moving read/write head — which is exactly why it's slower and more fragile than an SSD, but also why it's cheaper per gigabyte.",
    tags: ["HDD", "Hard Disk Drive", "Magnetic Storage", "Secondary Storage", "Non-Volatile"],
  },
  {
    id: 19,
    slug: "ssd",
    section: "Computer Fundamentals",
    parentSlug: "secondary-storage",
    title: "SSD (Solid State Drive)",
    tagline: "Flash-based storage with no moving parts — faster, more durable than an HDD",
    description:
      "<b>What an SSD Is</b>\nA Solid State Drive (SSD) stores data electronically in flash memory chips, with no spinning platters and no moving read/write head. Data is stored and retrieved purely through electrical signals, the same underlying technology family as EEPROM and USB flash drives.\n\n<b>Why SSDs Are Faster</b>\nBecause there's nothing to physically move or wait to spin into place, an SSD can access any stored location almost instantly, with none of the seek time or rotational latency that slows an HDD down. This makes SSDs dramatically faster, especially for tasks involving many small files or random access, such as starting up an operating system or launching applications.\n\n<b>Key Characteristics</b>\n• <b>Non-volatile</b> — retains data with the power off, like every secondary storage type.\n• <b>No moving parts</b> — makes an SSD more durable and resistant to physical shock than an HDD, and silent in operation.\n• <b>Faster</b> — significantly quicker read and write speeds than an HDD, particularly for random access.\n• <b>More expensive per gigabyte</b> — SSDs still generally cost more than HDDs for the same amount of storage, though the gap has been shrinking.\n• <b>Limited write cycles</b> — like flash memory generally, each cell in an SSD can only be erased and rewritten a limited number of times before it wears out, though modern SSDs are engineered to last for years of normal use through wear-levelling.\n• <b>Lower power consumption</b> — uses less electricity than a spinning HDD, which also helps battery life in laptops.\n\n<b>Where SSDs Are Used</b>\nSSDs are now the standard primary drive in most new laptops and desktops, prized for making an entire operating system feel noticeably faster to boot and use, and are increasingly used in servers too wherever speed matters more than the lowest possible cost per gigabyte.",
    note:
      "SSD's signature detail: no moving parts, purely electronic — which is exactly why it's faster, quieter, and more durable than an HDD, but comes at a higher cost per gigabyte.",
    diagram:
      "  HDD vs SSD — quick comparison\n\n  Property             HDD                 SSD\n  ─────────────────────────────────────────────────\n  Storage method       magnetic platters   flash memory chips\n  Moving parts?        Yes (spinning,      No\n                       moving head)\n  Speed                Slower              Faster\n  Durability           Less durable        More durable\n                       (shock-sensitive)   (no moving parts)\n  Cost per GB          Lower               Higher\n  Noise                Audible             Silent",
    tags: ["SSD", "Solid State Drive", "Flash Storage", "Secondary Storage", "Non-Volatile"],
  },
  {
    id: 20,
    slug: "optical-storage",
    section: "Computer Fundamentals",
    parentSlug: "secondary-storage",
    title: "Optical Storage",
    tagline: "CDs, DVDs, and Blu-ray — data read and written using a laser",
    description:
      "<b>What Optical Storage Is</b>\nOptical storage keeps data on a flat, circular disc as a spiral track of microscopic pits and flat areas (called \"lands\"), which a laser reads by measuring how light reflects off the disc's surface. The pattern of pits and lands is interpreted as binary 0s and 1s.\n\n<b>The Three Common Formats</b>\n• <b>CD (Compact Disc)</b> — the earliest common format, holding around 700 MB, originally designed for audio before being adapted for general data storage.\n• <b>DVD (Digital Versatile Disc)</b> — holds far more than a CD, typically 4.7 GB single-layer or 8.5 GB dual-layer, using a more tightly packed spiral track and a shorter-wavelength laser.\n• <b>Blu-ray Disc</b> — holds even more, commonly 25 GB single-layer or 50 GB dual-layer, using an even shorter-wavelength blue-violet laser (which is where the name comes from) to pack data more densely still.\n  ↳ Pattern to remember: CD → DVD → Blu-ray is a straight line of increasing capacity, achieved mainly by using a laser with a progressively shorter wavelength, which can read and write smaller, more tightly packed pits.\n\n<b>Key Characteristics</b>\n• <b>Non-volatile</b> — a written disc keeps its data indefinitely without power, as long as the disc itself isn't damaged.\n• <b>Removable and portable</b> — a disc can be taken out of one drive and read in another compatible drive, making it easy to physically distribute software, movies, or backups.\n• <b>Slower than HDD or SSD</b> — reading and writing via a laser and spinning disc is considerably slower than either magnetic or flash-based storage.\n• <b>Read-only, write-once, or rewritable variants</b> — discs come in different types: pressed-at-the-factory read-only discs (like most movie DVDs), write-once discs (CD-R, DVD-R, burned once by the user), and rewritable discs (CD-RW, DVD-RW, which can be erased and rewritten many times).\n\n<b>Where Optical Storage Is Used Today</b>\nOptical storage has become far less common for everyday computer use, since USB flash drives, cloud storage, and streaming have taken over most of its old roles. It's still used for physical software/game distribution in some regions, official archival copies, and Blu-ray for high-definition video.",
    note:
      "Exam favourite: the capacity order is always CD < DVD < Blu-ray, and the reason is the laser's wavelength getting shorter each time, letting it read smaller, more densely packed pits.",
    tags: ["Optical Storage", "CD", "DVD", "Blu-ray", "Laser", "Secondary Storage"],
  },
  {
    id: 21,
    slug: "flash-memory",
    section: "Computer Fundamentals",
    parentSlug: "secondary-storage",
    title: "Flash Memory",
    tagline: "Small, portable, solid-state storage — USB drives, memory cards, and SSDs' foundation",
    description:
      "<b>What Flash Memory Is</b>\nFlash memory is a type of non-volatile, electronically erasable storage, built from the same underlying technology family as EEPROM. It stores data in memory cells that can be erased and rewritten in large blocks at once (which is where the name \"flash\" comes from — an entire block is erased in a single, fast operation, rather than one bit at a time).\n\n<b>Flash Memory vs EEPROM</b>\nFlash memory is really a descendant of EEPROM, refined to be faster and denser. The key practical difference is how erasing works: classic EEPROM can typically erase a single byte at a time, while flash memory erases in larger blocks, which is less flexible per-byte but much faster and cheaper to manufacture at large capacities — which is exactly why flash memory, not classic EEPROM, is what ended up inside USB drives, memory cards, and SSDs.\n\n<b>Common Forms of Flash Memory</b>\n• <b>USB flash drive (pen drive)</b> — a small, portable stick that plugs directly into a USB port, commonly used for moving files between computers.\n• <b>Memory card (SD card, microSD card)</b> — small removable flash storage used in cameras, smartphones, and other portable devices.\n• <b>Solid state drive (SSD)</b> — uses flash memory internally as its storage medium, covered in full in its own card.\n• <b>Embedded flash storage</b> — the fixed internal storage built into smartphones, tablets, and many other devices, that isn't a physically removable drive.\n\n<b>Key Characteristics</b>\n• <b>Non-volatile</b> — retains its data indefinitely without power.\n• <b>No moving parts</b> — entirely electronic, making it durable, shock-resistant, and silent.\n• <b>Small and portable</b> — commonly packaged into small chips or sticks, making it easy to physically carry data around.\n• <b>Limited write/erase cycles</b> — like all flash-based storage, each cell can only be erased and rewritten a finite number of times before it wears out, though this limit is high enough for years of normal use.\n• <b>Fast, but erases in blocks</b> — quick to read and write, but an entire block must be erased together, which is why flash storage uses special software (like wear-levelling and garbage collection) to manage this efficiently.\n\n<b>Why Flash Memory Matters</b>\nFlash memory is the technology that made small, fast, durable, portable storage possible — from a tiny USB drive that survives being dropped and thrown in a bag, to the SSD that has replaced the HDD as the default drive in most new computers.",
    note:
      "Flash memory's signature detail: erased in blocks, not byte-by-byte like classic EEPROM — that trade-off (less fine-grained control, but much faster and cheaper at scale) is exactly why flash memory took over for USB drives, memory cards, and SSDs.",
    tags: ["Flash Memory", "USB Drive", "Memory Card", "EEPROM", "Non-Volatile", "Secondary Storage"],
  },
  {
    id: 22,
    slug: "memory-hierarchy",
    section: "Computer Fundamentals",
    parentSlug: "memory-organization",
    crossLinkSlugs: ["ram", "secondary-storage"],
    title: "Memory Hierarchy",
    tagline: "The pyramid of memory — from tiny, blazing-fast registers to huge, slow secondary storage",
    description:
      "<b>What Memory Hierarchy Means</b>\nA computer doesn't rely on just one kind of memory — it uses several different kinds arranged in layers, from the tiniest and fastest right down to the largest and slowest. This layered arrangement is called the memory hierarchy, and it exists because of one unavoidable trade-off: memory that is fast and built close to the CPU is also small in capacity and expensive per byte, while memory that is cheap and can hold huge amounts of data is also much slower to access.\n\n<b>The Four Levels, Fastest to Slowest</b>\n• <b>Registers</b> — tiny storage locations built directly inside the CPU, holding the data currently being worked on right this instant. Fastest of all, but there are only a handful of them, each holding just a few bytes.\n• <b>Cache</b> — a small, very fast memory sitting between the CPU and RAM, holding copies of the data and instructions the CPU is likely to need again very soon. Much bigger than registers, but still small compared to RAM.\n• <b>RAM (Primary Memory)</b> — the computer's main working memory, holding whatever programs and data are currently active. Far larger than cache, but noticeably slower to access.\n• <b>Secondary Storage</b> — permanent, non-volatile storage (HDD, SSD, and similar), holding everything not currently in active use. By far the largest capacity, but also by far the slowest of the four.\n  ↳ As you move down this list: speed goes down, capacity goes up, and cost per byte goes down.\n\n<b>Why Build Memory This Way?</b>\nBuilding an entire computer's memory purely out of the fastest technology (like a register or cache) would be far too expensive and physically impossible at any real scale. Building it entirely out of the cheapest, largest technology (like a hard disk) would make every single CPU operation painfully slow, since the CPU would have to wait for the slowest tier every single time.\n  ↳ Instead, the hierarchy keeps only the small amount of data the CPU needs \"right now\" in the fastest tiers, while everything else waits in progressively larger, slower, cheaper tiers, ready to be pulled up only when actually needed.\n\n<b>Principle of Locality — Why This Actually Works</b>\nThe entire hierarchy depends on one observed pattern in how real programs behave, called the principle of locality:\n• <b>Temporal locality</b> — if a piece of data was used recently, it's likely to be used again soon (e.g. a loop counter used over and over).\n• <b>Spatial locality</b> — if one piece of data was used, data stored near it is also likely to be used soon (e.g. reading through an array in order).\n  ↳ Because of locality, keeping recently-used data in a small, fast cache genuinely does save time most of the time — it's not a lucky guess, it's a predictable pattern in how software runs.",
    note:
      "Learn the order top to bottom and what changes as you go down: Registers → Cache → RAM → Secondary Storage. Speed and cost per byte fall as you descend; capacity rises. Everything about caching (and why it works) comes back to the principle of locality — recently used data, and data near it, is likely to be needed again soon.",
    diagram:
      "        FASTEST, SMALLEST, MOST EXPENSIVE PER BYTE\n                        ▲\n                  ┌───────────┐\n                  │ REGISTERS │   a few bytes, inside the CPU\n                  ├───────────┤\n                  │   CACHE   │   KBs–MBs, L1/L2/L3\n                  ├───────────┤\n                  │    RAM    │   GBs, main memory\n                  ├───────────┤\n                  │ SECONDARY │   TBs, HDD/SSD/etc.\n                  │  STORAGE  │\n                  └───────────┘\n                        ▼\n        SLOWEST, LARGEST, CHEAPEST PER BYTE",
    tags: ["Memory Hierarchy", "Registers", "Cache", "RAM", "Secondary Storage", "Locality"],
  },
  {
    id: 23,
    slug: "register",
    section: "Computer Fundamentals",
    parentSlug: "memory-hierarchy",
    title: "Register",
    tagline: "The CPU's own tiny, built-in storage — the very top of the memory hierarchy",
    description:
      "<b>What a Register Is</b>\nA register is a very small storage location built directly inside the CPU itself, holding a single small piece of data — typically 32 or 64 bits, matching the CPU's word size — that the CPU is actively working with right now.\n\n<b>Why Registers Are at the Top of the Hierarchy</b>\nBecause registers are built directly into the CPU's own circuitry, the CPU can access them in a single clock cycle, with no need to travel out to any external memory chip at all. This makes registers, by a wide margin, the fastest memory a computer has — but also the smallest: a typical CPU has only a few dozen general-purpose registers in total.\n\n<b>Common Types of Registers</b>\n• <b>Program Counter (PC)</b> — holds the memory address of the next instruction to fetch\n• <b>Instruction Register (IR)</b> — holds the instruction currently being decoded and executed\n• <b>Accumulator (ACC)</b> — holds the intermediate result of arithmetic and logic operations\n• <b>General-purpose registers</b> — small, flexible storage a program can use for whatever values it's currently working with\n  ↳ These three core registers (PC, IR, ACC) and how they're used every single instruction cycle are covered in full in the \"CPU\" and \"Instruction Cycle\" cards.\n\n<b>Key Characteristics</b>\n• <b>Fastest memory in the entire hierarchy</b> — accessed in a single CPU clock cycle.\n• <b>Extremely small capacity</b> — holds only a handful of individual values at any moment, nowhere near enough for a whole running program.\n• <b>Volatile</b> — loses its contents the instant power is switched off, exactly like RAM.\n• <b>Not directly addressable by a memory address the way RAM is</b> — each register is referred to by name (like \"ACC\" or \"PC\"), not by a memory address.\n\n<b>Where Registers Fit In</b>\nBecause there are so few registers and they're so small, the CPU cannot keep an entire program in them — only the exact handful of values needed for the instruction happening right now. Everything else waits one level down, in cache.",
    note:
      "Registers are defined by two extremes at once: the fastest memory that exists, and the smallest. If an exam question describes memory \"built into the CPU\" or accessed \"in a single clock cycle,\" it's describing a register.",
    tags: ["Register", "Program Counter", "Instruction Register", "Accumulator", "Memory Hierarchy", "Volatile"],
  },
  {
    id: 24,
    slug: "cache",
    section: "Computer Fundamentals",
    parentSlug: "memory-hierarchy",
    title: "Cache",
    tagline: "The fast buffer between CPU and RAM — L1, L2, and L3",
    description:
      "<b>What Cache Memory Is</b>\nCache memory is a small, very fast memory that sits between the CPU and RAM, storing copies of the data and instructions the CPU has used recently, or is likely to need again soon. It exists purely to bridge the huge speed gap between the CPU's registers and the much slower main RAM.\n\n<b>Why Cache Exists</b>\nA CPU can execute instructions far faster than RAM can supply data. Without cache, the CPU would constantly sit idle, waiting on RAM for nearly every single operation. Cache absorbs most of this wait by keeping a small, frequently-reused subset of data physically much closer to the CPU, built from fast SRAM rather than the slower DRAM used for main RAM.\n  ↳ Cache is built using SRAM technology specifically because SRAM needs no refresh cycle and can be accessed almost instantly — see the \"SRAM\" card for the full technical reason.\n\n<b>The Three Common Cache Levels</b>\n• <b>L1 Cache</b> — the smallest and fastest level, built directly into each individual CPU core, typically holding only tens of kilobytes.\n• <b>L2 Cache</b> — larger than L1 but slightly slower, usually also dedicated to a single core, typically a few hundred kilobytes to a few megabytes.\n• <b>L3 Cache</b> — the largest and slowest of the three, usually shared across all the CPU's cores, typically several megabytes to tens of megabytes.\n  ↳ As you move from L1 → L2 → L3, size goes up and speed goes down — the exact same trade-off pattern seen across the whole memory hierarchy, just repeated in miniature within cache itself.\n\n<b>Cache Hit vs. Cache Miss</b>\n• <b>Cache hit</b> — the CPU asks for a piece of data, and it's already sitting in cache; it's returned almost instantly.\n• <b>Cache miss</b> — the requested data isn't in cache, so the CPU must fetch it from the slower RAM instead (and a copy is usually then stored in cache, in case it's needed again soon).\n  ↳ A program with a high cache hit rate runs noticeably faster, since it spends less time waiting on RAM. This is exactly why the principle of locality (covered in the \"Memory Hierarchy\" card) matters so much in practice.\n\n<b>Key Characteristics</b>\n• <b>Volatile</b> — like RAM and registers, cache loses its contents when power is removed.\n• <b>Much faster than RAM, much smaller</b> — cache trades capacity for speed, exactly as the memory hierarchy predicts.\n• <b>Automatically managed by hardware</b> — a program doesn't explicitly choose what goes into cache; the CPU and memory controller decide this automatically based on what's being accessed.",
    note:
      "Keep the cache-level order straight: L1 is smallest and fastest, closest to a single core; L3 is largest and slowest, shared across cores. And remember the vocabulary pair exams love: cache hit (found it, fast) vs. cache miss (not found, fall back to RAM).",
    diagram:
      "  CPU ── L1 Cache ── L2 Cache ── L3 Cache ── RAM ── Secondary Storage\n         (smallest,    (bigger,     (biggest,   (much      (largest,\n          fastest,      slower       slowest,    bigger,    slowest)\n          per-core)      than L1)    often        much\n                                     shared)      slower)\n\n  CACHE HIT  → data found in cache → returned almost instantly\n  CACHE MISS → data not in cache  → fetched from RAM instead (slower)",
    tags: ["Cache", "L1 Cache", "L2 Cache", "L3 Cache", "Cache Hit", "Cache Miss", "SRAM", "Memory Hierarchy"],
  },
  // ─────────────────────────────────────────────
  // NUMBER SYSTEM
  // ─────────────────────────────────────────────
  {
    id: 25,
    slug: "number-system",
    section: "Computer Fundamentals",
    title: "Number System",
    tagline: "How computers represent numbers — decimal, binary, octal, and hexadecimal",
    description:
      "<b>What a Number System Is</b>\nA number system is simply a way of writing down numbers using a fixed set of symbols (called digits) and a fixed \"base\" (also called the radix) — the count of different digits available before you have to carry over into the next column.\n  ↳ Everyday counting uses the decimal system, base 10, with the ten digits 0–9. Computers, internally, use other bases too — binary, octal, and hexadecimal — because of how their electronic circuits work.\n\n<b>Why Computers Don't Just Use Decimal</b>\nA computer's electronic circuits are built from switches that are only ever in one of two states: on or off, high voltage or low voltage. This naturally maps to exactly two symbols, 0 and 1, which is exactly what the binary number system uses. Every number, letter, image, and instruction inside a computer is ultimately stored and processed as binary, even though humans usually prefer to read numbers in decimal, octal, or hexadecimal instead, since long strings of 0s and 1s are hard for people to read.\n\n<b>Positional Notation — the Idea Behind Every Number System</b>\nIn any number system, the position of a digit determines its value, based on powers of the base. For example, in decimal (base 10), the number 345 means:\n(3 × 10²) + (4 × 10¹) + (5 × 10⁰) = 300 + 40 + 5 = 345\n  ↳ This exact same idea — digit × (base raised to its position) — applies to every number system covered below; only the base changes.\n\n<b>The Four Number Systems Used in Computing</b>\n• <b>Decimal (Base 10)</b> — the number system people use every day, with ten digits: 0–9.\n• <b>Binary (Base 2)</b> — the number system computer hardware actually runs on internally, with just two digits: 0 and 1.\n• <b>Octal (Base 8)</b> — uses eight digits, 0–7; historically used as a shorter, more human-readable stand-in for binary.\n• <b>Hexadecimal (Base 16)</b> — uses sixteen symbols, 0–9 followed by A–F (where A=10, B=11, C=12, D=13, E=14, F=15); widely used today as a compact, human-readable stand-in for binary, especially in memory addresses and color codes.\n  ↳ Each is covered in its own card next, followed by the conversion methods used to move a number between these systems.",
    note:
      "The one idea to remember across all four systems: a digit's value = digit × base raised to its position, counting position from 0 on the right. Only the base (10, 2, 8, or 16) and the available digits change.",
    diagram:
      "  Number System     Base    Digits Used\n  ─────────────────────────────────────────────\n  Decimal             10     0 1 2 3 4 5 6 7 8 9\n  Binary                2     0 1\n  Octal                 8     0 1 2 3 4 5 6 7\n  Hexadecimal          16     0 1 2 3 4 5 6 7 8 9 A B C D E F",
    tags: ["Number System", "Decimal", "Binary", "Octal", "Hexadecimal", "Positional Notation", "Base", "Radix"],
  },
  {
    id: 26,
    slug: "decimal-number-system",
    section: "Computer Fundamentals",
    parentSlug: "number-system",
    title: "Decimal",
    tagline: "Base 10 — the everyday number system people use",
    description:
      "<b>What Decimal Is</b>\nThe decimal number system is the base-10 system used in everyday life, built from ten digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9. \"Deci\" comes from the Latin word for ten, matching the ten digits available.\n\n<b>How Position Gives Each Digit Its Value</b>\nEach digit's actual value depends on its position, using powers of 10, counted from the right starting at position 0.\n  ↳ Example: the number 5,047 breaks down as:\n(5 × 10³) + (0 × 10²) + (4 × 10¹) + (7 × 10⁰) = 5000 + 0 + 40 + 7 = 5047\n\n<b>Why Decimal Is Natural for Humans</b>\nMost historians trace the popularity of base 10 to something very simple — people have ten fingers, which made counting in groups of ten natural long before any formal number system existed.\n\n<b>Decimal's Role Alongside Computers</b>\nEven though a computer's hardware works internally in binary, decimal is still how people enter and read most numbers when interacting with a computer — from typing 250 into a form, to seeing a file size shown as 4.2 GB. The computer silently converts between decimal (for humans) and binary (for its own circuits) behind the scenes.\n  ↳ How that conversion actually works, step by step, is covered in the \"Decimal to Binary\" and \"Binary to Decimal\" cards.",
    note:
      "Decimal is simply base 10 — ten digits (0–9), each column worth a power of 10. Every other number system covered here works exactly the same way, just with a different base and a different digit set.",
    tags: ["Decimal", "Base 10", "Number System", "Positional Notation"],
  },
  {
    id: 27,
    slug: "binary-number-system",
    section: "Computer Fundamentals",
    parentSlug: "number-system",
    title: "Binary",
    tagline: "Base 2 — the only number system a computer's hardware actually understands",
    description:
      "<b>What Binary Is</b>\nThe binary number system is base-2, built from just two digits: 0 and 1. Each binary digit is called a bit (short for \"binary digit\") — the smallest unit of data a computer can store or process.\n\n<b>Why Computers Use Binary</b>\nA computer's circuits are made of billions of tiny electronic switches, and each switch can only be in one of two physical states — on or off, representing high or low voltage. Binary's two digits, 0 and 1, map directly onto these two states, which is exactly why every single piece of data inside a computer — numbers, text, images, sound, instructions — is ultimately stored as binary, no matter how it's displayed to a human.\n\n<b>How Position Gives Each Digit Its Value</b>\nJust like decimal, each binary digit's value depends on its position, but using powers of 2 instead of powers of 10.\n  ↳ Example: the binary number 1011 breaks down as:\n(1 × 2³) + (0 × 2²) + (1 × 2¹) + (1 × 2⁰) = 8 + 0 + 2 + 1 = 11 (in decimal)\n\n<b>Common Binary Terms</b>\n• <b>Bit</b> — a single binary digit, 0 or 1\n• <b>Nibble</b> — a group of 4 bits\n• <b>Byte</b> — a group of 8 bits, the standard unit computers use to measure most data (a single character of text is commonly stored in 1 byte)\n• <b>Word</b> — the natural chunk of bits a particular CPU processes at once, commonly 32 or 64 bits on modern computers\n\n<b>Why Binary Is Hard for Humans</b>\nBinary numbers get very long very quickly — the decimal number 250, for example, is 11111010 in binary. This is exactly why octal and hexadecimal exist: as shorter, more human-readable stand-ins that still map cleanly onto binary underneath.",
    note:
      "Binary is the one number system that isn't just a convenience — it's the literal physical reality of how a computer's hardware works, since a transistor's on/off state has only two possible values. Everything else (decimal for humans, hex for compactness) is a layer of translation on top of it.",
    diagram:
      "  BIT SIZES\n\n  1 bit      = 0 or 1\n  4 bits     = 1 nibble          e.g. 1011\n  8 bits     = 1 byte            e.g. 11111010\n  32/64 bits = 1 word (typical CPU word size)",
    tags: ["Binary", "Base 2", "Bit", "Byte", "Nibble", "Number System"],
  },
  {
    id: 28,
    slug: "octal-number-system",
    section: "Computer Fundamentals",
    parentSlug: "number-system",
    title: "Octal",
    tagline: "Base 8 — a compact, historical stand-in for binary",
    description:
      "<b>What Octal Is</b>\nThe octal number system is base-8, built from eight digits: 0, 1, 2, 3, 4, 5, 6, and 7. \"Oct\" comes from the Latin/Greek word for eight, matching the eight digits available.\n\n<b>Why Octal Exists</b>\nOctal became popular in early computing because it converts to and from binary very cleanly: exactly 3 binary bits make up 1 octal digit, since 2³ = 8. This let programmers and engineers write and read binary-related values in a shorter, less error-prone form, especially on older computer systems that grouped memory in multiples of 3 bits.\n\n<b>How Position Gives Each Digit Its Value</b>\nEach octal digit's value depends on its position, using powers of 8.\n  ↳ Example: the octal number 372 breaks down as:\n(3 × 8²) + (7 × 8¹) + (2 × 8⁰) = 192 + 56 + 2 = 250 (in decimal)\n\n<b>Octal ↔ Binary — the Quick Grouping Trick</b>\nBecause 1 octal digit always equals exactly 3 binary bits, converting between octal and binary just means grouping bits in 3s, without needing to go through decimal at all.\n  ↳ Binary 011 111 010 → group in 3s → octal 3 7 2\n\n<b>Where Octal Is Used Today</b>\nOctal has mostly been replaced by hexadecimal in modern computing, but it still shows up in a few specific places — most notably Unix/Linux file permission codes (like chmod 755), where each digit represents a combination of read, write, and execute permissions.",
    note:
      "The key octal fact exams test: 1 octal digit = exactly 3 binary bits, since 2³ = 8. That relationship is also exactly why grouping binary digits in 3s converts straight to octal, with no decimal step needed.",
    tags: ["Octal", "Base 8", "Number System", "Unix Permissions"],
  },
  {
    id: 29,
    slug: "hexadecimal-number-system",
    section: "Computer Fundamentals",
    parentSlug: "number-system",
    title: "Hexadecimal",
    tagline: "Base 16 — today's compact stand-in for binary, using 0–9 and A–F",
    description:
      "<b>What Hexadecimal Is</b>\nThe hexadecimal number system is base-16, built from sixteen symbols: the ten digits 0–9, followed by six letters A–F standing in for the values 10 through 15 (A=10, B=11, C=12, D=13, E=14, F=15). \"Hexa\" is Greek for six, and \"deci\" for ten — six plus ten symbols.\n\n<b>Why Hexadecimal Exists</b>\nHexadecimal is popular in modern computing because it converts to and from binary even more cleanly than octal: exactly 4 binary bits make up 1 hexadecimal digit, since 2⁴ = 16. Since 4 bits is also exactly half a byte (a \"nibble\"), a full byte can always be written as exactly 2 hexadecimal digits — a neat, compact match that modern computer architecture is built around.\n\n<b>How Position Gives Each Digit Its Value</b>\nEach hexadecimal digit's value depends on its position, using powers of 16.\n  ↳ Example: the hexadecimal number 2F breaks down as:\n(2 × 16¹) + (15 × 16⁰) = 32 + 15 = 47 (in decimal, since F = 15)\n\n<b>Hex ↔ Binary — the Quick Grouping Trick</b>\nBecause 1 hex digit always equals exactly 4 binary bits, converting between hex and binary just means grouping bits in 4s.\n  ↳ Binary 0010 1111 → group in 4s → hex 2 F\n\n<b>Where Hexadecimal Is Used Today</b>\n• <b>Memory addresses</b> — displayed in hex because it's far shorter than the equivalent binary\n• <b>Color codes</b> — web colors like #FF5733 are hexadecimal, where each pair of digits represents the amount of red, green, and blue (0–255 each, matching 00–FF in hex)\n• <b>Error codes and debugging</b> — memory dumps, crash reports, and low-level debugging tools commonly display raw data in hex rather than binary, since it's far more compact and easier for a human to scan\n• <b>MAC addresses</b> — a network device's hardware address is written as a series of hex digit pairs",
    note:
      "The key hex fact exams test: 1 hex digit = exactly 4 binary bits, since 2⁴ = 16 — and 4 bits is exactly half a byte, so any full byte always converts to exactly 2 hex digits. This is exactly why hex, not octal, has become the modern standard for showing raw computer data.",
    diagram:
      "  Hex Digit   Binary (4 bits)   Decimal\n  ───────────────────────────────────\n  0           0000              0\n  1           0001              1\n  ...         ...               ...\n  9           1001              9\n  A           1010              10\n  B           1011              11\n  C           1100              12\n  D           1101              13\n  E           1110              14\n  F           1111              15",
    tags: ["Hexadecimal", "Base 16", "Number System", "Memory Address", "Color Code"],
  },
  {
    id: 30,
    slug: "number-system-conversions",
    section: "Computer Fundamentals",
    parentSlug: "number-system",
    title: "Conversions",
    tagline: "How to move a number between decimal, binary, octal, and hexadecimal",
    description:
      "<b>Why Conversion Matters</b>\nA computer stores everything in binary, but humans usually read and enter numbers in decimal, and often work with hexadecimal or octal for compactness. Being able to convert a number between these systems — by hand, using the base and positional notation covered in the \"Number System\" card — is one of the most commonly tested skills in this syllabus area.\n\n<b>The General Idea</b>\nEvery conversion method below comes down to one of two directions:\n• <b>Converting INTO decimal</b> — multiply each digit by its position's power of the base, and add the results together (the same positional-notation formula used to explain any number system).\n• <b>Converting OUT OF decimal</b> — repeatedly divide the decimal number by the target base, and read the remainders in reverse order.\n\n<b>The Three Conversions Covered Here</b>\n• <b>Binary → Decimal</b> — reading a binary number's true decimal value\n• <b>Decimal → Binary</b> — converting an everyday decimal number into the binary a computer actually stores\n• <b>Hexadecimal → Decimal</b> — reading a hex value's true decimal value\n  ↳ The reverse conversions (Decimal → Hex, Decimal → Octal, Octal → Decimal, and direct Binary ↔ Octal/Hex grouping) all follow the exact same two general methods above — once you understand these three, the rest are the same steps with a different base.",
    note:
      "Two directions, two methods: converting INTO decimal always means multiply-and-add by powers of the base; converting OUT OF decimal always means divide-and-read-remainders-backwards. Every conversion in this section is one of these two patterns.",
    tags: ["Number System Conversion", "Binary to Decimal", "Decimal to Binary", "Hexadecimal to Decimal"],
  },
  {
    id: 31,
    slug: "binary-to-decimal",
    section: "Computer Fundamentals",
    parentSlug: "number-system-conversions",
    title: "Binary → Decimal",
    tagline: "Multiply each bit by its power of 2, then add",
    description:
      "<b>The Method</b>\nTo convert a binary number to decimal, multiply each bit by 2 raised to its position (counting from 0 on the right), then add every result together.\n\n<b>Worked Example — Converting 101101 to Decimal</b>\nWrite out each bit's position, counting from the right starting at 0:\n\nPosition:   5  4  3  2  1  0\nBit:        1  0  1  1  0  1\n\nNow multiply each bit by 2 raised to its position, and add:\n(1×2⁵) + (0×2⁴) + (1×2³) + (1×2²) + (0×2¹) + (1×2⁰)\n= 32 + 0 + 8 + 4 + 0 + 1\n= 45\n\nSo binary 101101 equals decimal 45.\n\n<b>The Shortcut: Only Add Where the Bit Is 1</b>\nSince multiplying by 0 always gives 0, you only actually need to add up the powers of 2 where the bit is 1 — skip the 0s entirely.\n  ↳ In the example above: 32 + 8 + 4 + 1 = 45 — same answer, fewer steps.\n\n<b>Common Powers of 2 Worth Memorizing</b>\n2⁰=1, 2¹=2, 2²=4, 2³=8, 2⁴=16, 2⁵=32, 2⁶=64, 2⁷=128, 2⁸=256\n  ↳ Knowing these by heart makes binary-to-decimal conversion much faster in an exam setting.",
    note:
      "Fastest exam method: write the powers of 2 above each bit, then just add up the powers where the bit is 1 and ignore every 0 bit completely.",
    diagram:
      "  Convert binary 101101 to decimal\n\n  Position:   5    4    3    2    1    0\n  Power:     2⁵   2⁴   2³   2²   2¹   2⁰\n  Value:     32   16    8    4    2    1\n  Bit:        1    0    1    1    0    1\n              │         │    │         │\n              32   +    8  + 4    +    1   =  45",
    tags: ["Binary to Decimal", "Conversion", "Number System", "Powers of 2"],
  },
  {
    id: 32,
    slug: "decimal-to-binary",
    section: "Computer Fundamentals",
    parentSlug: "number-system-conversions",
    title: "Decimal → Binary",
    tagline: "Repeatedly divide by 2, then read the remainders backwards",
    description:
      "<b>The Method</b>\nTo convert a decimal number to binary, repeatedly divide it by 2, writing down the remainder (0 or 1) at each step, until the number reaches 0. Then read all the remainders from bottom to top (last one first) to get the binary result.\n\n<b>Worked Example — Converting 45 to Binary</b>\n45 ÷ 2 = 22  remainder 1\n22 ÷ 2 = 11  remainder 0\n11 ÷ 2 =  5  remainder 1\n 5 ÷ 2 =  2  remainder 1\n 2 ÷ 2 =  1  remainder 0\n 1 ÷ 2 =  0  remainder 1\n\nReading the remainders from bottom to top: 1 0 1 1 0 1\n\nSo decimal 45 equals binary 101101 — matching the Binary → Decimal example exactly in reverse.\n\n<b>Why You Read the Remainders Backwards</b>\nThe first remainder you calculate corresponds to the smallest place value (2⁰, the rightmost bit), and the last remainder you calculate corresponds to the largest place value. So the very last remainder produced becomes the leftmost (most significant) bit, and the very first remainder produced becomes the rightmost (least significant) bit — which is exactly why you read bottom to top.",
    note:
      "The single most common mistake on this method: forgetting to reverse the order of the remainders at the end. Divide-by-2 always produces the least-significant bit first, so the final answer is always read bottom-to-top.",
    diagram:
      "  Convert decimal 45 to binary\n\n  45 ÷ 2 = 22   remainder 1   ┐\n  22 ÷ 2 = 11   remainder 0   │\n  11 ÷ 2 =  5   remainder 1   │  read remainders\n   5 ÷ 2 =  2   remainder 1   │  bottom → top\n   2 ÷ 2 =  1   remainder 0   │\n   1 ÷ 2 =  0   remainder 1   ┘\n\n  Result:  1 0 1 1 0 1  =  binary 101101",
    tags: ["Decimal to Binary", "Conversion", "Number System", "Division Method"],
  },
  {
    id: 33,
    slug: "hex-to-decimal",
    section: "Computer Fundamentals",
    parentSlug: "number-system-conversions",
    title: "Hexadecimal → Decimal",
    tagline: "Multiply each hex digit by its power of 16, then add",
    description:
      "<b>The Method</b>\nTo convert a hexadecimal number to decimal, multiply each hex digit by 16 raised to its position (counting from 0 on the right), converting any letter digit (A–F) to its decimal value first, then add every result together.\n\n<b>Worked Example — Converting 1F4 to Decimal</b>\nWrite out each digit's position, counting from the right starting at 0:\n\nPosition:   2   1   0\nDigit:      1   F   4\n\nConvert the letter digit to its decimal value first: F = 15.\n\nNow multiply each digit by 16 raised to its position, and add:\n(1×16²) + (15×16¹) + (4×16⁰)\n= 256 + 240 + 4\n= 500\n\nSo hexadecimal 1F4 equals decimal 500.\n\n<b>Letter Digits to Remember</b>\nA=10, B=11, C=12, D=13, E=14, F=15\n  ↳ These six values are worth memorizing outright, since every hex-to-decimal conversion depends on converting any letter digit correctly first.\n\n<b>Common Powers of 16 Worth Memorizing</b>\n16⁰=1, 16¹=16, 16²=256, 16³=4096\n  ↳ Most exam-level hex numbers are 2–3 digits long, so knowing 16⁰, 16¹, and 16² by heart covers the majority of questions.",
    note:
      "Two things trip people up on this conversion: forgetting to convert a letter digit (A–F) to its decimal value before multiplying, and misplacing which position is which. Always write the positions out first, right to left starting at 0, before doing any multiplication.",
    diagram:
      "  Convert hexadecimal 1F4 to decimal\n\n  Position:    2      1      0\n  Power:      16²    16¹    16⁰\n  Value:      256     16      1\n  Digit:       1      F=15    4\n               │       │      │\n              256  +  240  +  4   =  500",
    tags: ["Hexadecimal to Decimal", "Conversion", "Number System", "Powers of 16"],
  },
  {
    id: 37,
    slug: "boolean-algebra-digital-logic",
    section: "Computer Fundamentals",
    title: "Boolean Algebra & Digital Logic",
    tagline: "The logic (true/false) math behind every digital circuit a computer is built from",
    description:
      "<b>What Boolean Algebra Is</b>\nBoolean algebra is a branch of mathematics that works with only two values — true and false, usually written as 1 and 0 — instead of the full range of numbers used in ordinary algebra. It was developed by the mathematician George Boole in the 1800s, long before computers existed, but it turned out to be exactly the mathematics needed to describe how digital circuits behave.\n\n<b>Why It Matters for Computers</b>\nEvery digital circuit inside a computer — from a single logic gate to an entire CPU — is really just Boolean algebra built out of physical hardware. A circuit's output is always some Boolean expression (an AND, an OR, a NOT, or a combination of these) applied to its inputs, and that same expression can equally be written down as a mathematical formula, a truth table, or an actual arrangement of transistors.\n\n<b>What You'll Learn Here</b>\n• <b>Logic Gates</b> — the basic building blocks (AND, OR, NOT, NAND, NOR, XOR, XNOR) that every digital circuit is assembled from\n• <b>Boolean Laws</b> — De Morgan's theorem and Boolean simplification, the rules used to rewrite a Boolean expression into a simpler, equivalent one\n• <b>Digital Circuits</b> — how logic gates combine into genuinely useful building blocks: adders (that do binary arithmetic), flip-flops (that store a single bit), registers, and counters\n  ↳ These build on each other in order: gates first, then the laws used to simplify circuits built from gates, then the actual circuits (adders, flip-flops, registers, counters) that gates combine to create.",
    note:
      "Everything in this whole topic reduces to one idea: a digital circuit's output is a Boolean expression of its inputs. Logic gates are the smallest expressions; laws simplify bigger expressions; adders/flip-flops/registers/counters are gates wired together to do something useful (add numbers, store a bit, count).",
    diagram:
      "  BOOLEAN ALGEBRA & DIGITAL LOGIC — how the topics build on each other\n\n   Logic Gates          Boolean Laws            Digital Circuits\n  (AND, OR, NOT,   ──►  (De Morgan's,      ──►  (Half/Full Adder,\n   NAND, NOR,            Simplification)         Flip-Flops,\n   XOR, XNOR)                                     Registers, Counters)",
    tags: ["Boolean Algebra", "Digital Logic", "Logic Gates", "Boolean Laws", "Digital Circuits"],
  },
  {
    id: 38,
    slug: "logic-gates",
    section: "Computer Fundamentals",
    parentSlug: "boolean-algebra-digital-logic",
    title: "Logic Gates",
    tagline: "The seven basic building blocks every digital circuit is assembled from",
    description:
      "<b>What a Logic Gate Is</b>\nA logic gate is the smallest possible digital circuit — a tiny piece of hardware (built from transistors) that takes one or more binary inputs (0s and 1s) and produces exactly one binary output, based on a fixed rule. Every digital circuit in a computer, no matter how complex, is ultimately built by wiring many logic gates together.\n\n<b>The Seven Gates Covered Here</b>\n• <b>AND</b> — output is 1 only if every input is 1\n• <b>OR</b> — output is 1 if at least one input is 1\n• <b>NOT</b> — flips a single input (the only gate with just one input)\n• <b>NAND</b> — AND, then flipped (NOT-AND)\n• <b>NOR</b> — OR, then flipped (NOT-OR)\n• <b>XOR</b> — output is 1 only if the inputs are different\n• <b>XNOR</b> — XOR, then flipped (output is 1 only if the inputs are the same)\n  ↳ Each gate's full truth table, symbol, and use is covered in its own card next.\n\n<b>Truth Tables — the Universal Way to Define a Gate</b>\nEvery logic gate is fully described by a truth table: a list of every possible combination of inputs, alongside the output the gate produces for each one. Since a gate typically has just 2 inputs, there are only 4 possible input combinations (00, 01, 10, 11) to check.\n\n<b>Why Only These Seven?</b>\nAND, OR, and NOT are considered the three fundamental gates, since every other gate (and every possible digital circuit) can be built purely from combinations of these three. NAND and NOR are each, individually, \"universal\" — either one alone is enough to build any other gate, which is why NAND and NOR gates are so common in real chip manufacturing. XOR and XNOR are especially useful for comparison and arithmetic circuits, such as the adders covered later in this section.",
    note:
      "NAND and NOR are called universal gates because either one, by itself, can build every other gate (including AND, OR, and NOT) — this is why real chips are so often built almost entirely out of just NAND or just NOR gates.",
    tags: ["Logic Gates", "AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR", "Truth Table"],
  },
  {
    id: 39,
    slug: "and-gate",
    section: "Computer Fundamentals",
    parentSlug: "logic-gates",
    title: "AND Gate",
    tagline: "Output is 1 only if every input is 1",
    description:
      "<b>What the AND Gate Does</b>\nAn AND gate takes two (or more) binary inputs and produces an output of 1 only when every single input is 1. If even one input is 0, the output is 0.\n\n<b>Everyday Analogy</b>\nThink of a car that only starts if the driver's seatbelt is buckled AND the key is turned — both conditions have to be true at the same time, or the car doesn't start.\n\n<b>Boolean Notation</b>\nThe AND operation is written as A · B, or simply AB, or sometimes A ∧ B.\n\n<b>Where AND Gates Are Used</b>\nAND gates are used anywhere a result should only happen when multiple conditions are all satisfied at once — for example, inside a full adder's carry logic (covered later in this section), or in an enable circuit that only lets data through when several control signals all agree.",
    note:
      "The one fact to remember: AND needs ALL inputs to be 1 to output 1. Even a single 0 input forces the output to 0.",
    diagram:
      "  AND Gate\n\n  A   B  │ Output\n  ───────┼───────\n  0   0  │   0\n  0   1  │   0\n  1   0  │   0\n  1   1  │   1\n\n  A ──┐\n      ├─[AND]── Output\n  B ──┘",
    tags: ["AND Gate", "Logic Gates", "Truth Table", "Boolean Algebra"],
  },
  {
    id: 40,
    slug: "or-gate",
    section: "Computer Fundamentals",
    parentSlug: "logic-gates",
    title: "OR Gate",
    tagline: "Output is 1 if at least one input is 1",
    description:
      "<b>What the OR Gate Does</b>\nAn OR gate takes two (or more) binary inputs and produces an output of 1 if at least one of the inputs is 1. The output is 0 only when every input is 0.\n\n<b>Everyday Analogy</b>\nThink of a room light that turns on if you flip the switch by the door OR the switch by the bed — either one alone is enough to turn the light on.\n\n<b>Boolean Notation</b>\nThe OR operation is written as A + B, or sometimes A ∨ B.\n\n<b>Where OR Gates Are Used</b>\nOR gates are used anywhere a result should happen if any one of several conditions is met — for example, an alarm circuit that should trigger if any one of several sensors detects a problem.",
    note:
      "The one fact to remember: OR only needs ONE input to be 1 to output 1. The output is 0 only in the single case where every input is 0.",
    diagram:
      "  OR Gate\n\n  A   B  │ Output\n  ───────┼───────\n  0   0  │   0\n  0   1  │   1\n  1   0  │   1\n  1   1  │   1\n\n  A ──┐\n      ├─[OR]── Output\n  B ──┘",
    tags: ["OR Gate", "Logic Gates", "Truth Table", "Boolean Algebra"],
  },
  {
    id: 41,
    slug: "not-gate",
    section: "Computer Fundamentals",
    parentSlug: "logic-gates",
    title: "NOT Gate",
    tagline: "Flips a single input — the only gate with just one input",
    description:
      "<b>What the NOT Gate Does</b>\nA NOT gate (also called an inverter) takes a single binary input and flips it: a 0 input becomes a 1 output, and a 1 input becomes a 0 output. It's the only gate on this list with just one input instead of two.\n\n<b>Boolean Notation</b>\nThe NOT operation is written as Ā (A with a bar over it), or ¬A, or sometimes A'.\n\n<b>Where NOT Gates Are Used</b>\nA NOT gate is used anywhere a signal needs to be inverted — for example, turning an \"active-low\" enable signal into an \"active-high\" one, or building the NAND and NOR gates covered next, both of which are literally just AND/OR followed by a NOT.",
    note:
      "The one fact to remember: NOT is the only single-input gate on this list — it simply flips whatever it's given. NAND = AND + NOT, and NOR = OR + NOT, which is exactly why they're covered right after this card.",
    diagram:
      "  NOT Gate (Inverter)\n\n  A  │ Output\n  ───┼───────\n  0  │   1\n  1  │   0\n\n  A ──[NOT]── Output",
    tags: ["NOT Gate", "Inverter", "Logic Gates", "Truth Table", "Boolean Algebra"],
  },
  {
    id: 42,
    slug: "nand-gate",
    section: "Computer Fundamentals",
    parentSlug: "logic-gates",
    title: "NAND Gate",
    tagline: "AND, then flipped — output is 0 only if every input is 1",
    description:
      "<b>What the NAND Gate Does</b>\nA NAND gate (\"NOT-AND\") is an AND gate immediately followed by a NOT gate — it produces the exact opposite output of a plain AND gate for every input combination. The output is 0 only when every input is 1; otherwise the output is 1.\n\n<b>Boolean Notation</b>\nThe NAND operation is written as (A · B)‾, or ¬(A · B).\n\n<b>Why NAND Is Called a Universal Gate</b>\nA NAND gate, wired up in different combinations with itself, can be used to build every other logic gate — AND, OR, NOT, NOR, XOR, and XNOR — which is why it's called a universal gate. Because of this, and because NAND gates are simple and cheap to manufacture using transistors, most real digital chips are built almost entirely out of NAND gates internally, even when the final circuit behaves like an AND, OR, or anything else.\n  ↳ Example: wiring both inputs of a single NAND gate together produces a NOT gate.",
    note:
      "The key exam fact: NAND is a universal gate — any other gate can be built from NAND gates alone, which is exactly why real chip manufacturing relies on it so heavily.",
    diagram:
      "  NAND Gate\n\n  A   B  │ Output\n  ───────┼───────\n  0   0  │   1\n  0   1  │   1\n  1   0  │   1\n  1   1  │   0\n\n  A ──┐\n      ├─[AND]──[NOT]── Output\n  B ──┘",
    tags: ["NAND Gate", "Universal Gate", "Logic Gates", "Truth Table", "Boolean Algebra"],
  },
  {
    id: 43,
    slug: "nor-gate",
    section: "Computer Fundamentals",
    parentSlug: "logic-gates",
    title: "NOR Gate",
    tagline: "OR, then flipped — output is 1 only if every input is 0",
    description:
      "<b>What the NOR Gate Does</b>\nA NOR gate (\"NOT-OR\") is an OR gate immediately followed by a NOT gate — it produces the exact opposite output of a plain OR gate for every input combination. The output is 1 only when every input is 0; if any input is 1, the output is 0.\n\n<b>Boolean Notation</b>\nThe NOR operation is written as (A + B)‾, or ¬(A + B).\n\n<b>Why NOR Is Also a Universal Gate</b>\nJust like NAND, a NOR gate, wired up in different combinations with itself, can be used to build every other logic gate. NOR-based chip designs are less common than NAND-based ones in practice, but the principle is exactly the same — either universal gate alone is mathematically enough to build any digital circuit.",
    note:
      "NOR is the mirror image of NAND: both are universal gates (either one alone can build every other gate), but NOR outputs 1 only when every input is 0, the exact opposite condition from when NAND outputs 0.",
    diagram:
      "  NOR Gate\n\n  A   B  │ Output\n  ───────┼───────\n  0   0  │   1\n  0   1  │   0\n  1   0  │   0\n  1   1  │   0\n\n  A ──┐\n      ├─[OR]──[NOT]── Output\n  B ──┘",
    tags: ["NOR Gate", "Universal Gate", "Logic Gates", "Truth Table", "Boolean Algebra"],
  },
  {
    id: 44,
    slug: "xor-gate",
    section: "Computer Fundamentals",
    parentSlug: "logic-gates",
    title: "XOR Gate",
    tagline: "Exclusive OR — output is 1 only if the inputs are different",
    description:
      "<b>What the XOR Gate Does</b>\nAn XOR gate (\"exclusive OR\") produces an output of 1 only when its two inputs are different from each other (one is 0 and the other is 1). If both inputs are the same (both 0, or both 1), the output is 0.\n\n<b>How XOR Differs From Plain OR</b>\nA regular OR gate outputs 1 for THREE of the four input combinations (00→0, 01→1, 10→1, 11→1). XOR outputs 1 for only TWO of them (01→1, 10→1), specifically excluding the case where both inputs are 1 — which is exactly why it's called \"exclusive\" OR.\n\n<b>Boolean Notation</b>\nThe XOR operation is written as A ⊕ B.\n\n<b>Where XOR Gates Are Used</b>\nXOR is the natural \"are these two bits different?\" gate, which makes it central to binary addition — adding two bits with XOR gives the correct sum bit, ignoring carry (covered in full in the \"Half Adder\" card next). XOR is also widely used for parity checking (detecting data errors) and simple encryption.",
    note:
      "The exam-friendly way to remember XOR: it's OR, minus the \"both are 1\" case. Output is 1 only when the two inputs disagree.",
    diagram:
      "  XOR Gate\n\n  A   B  │ Output\n  ───────┼───────\n  0   0  │   0\n  0   1  │   1\n  1   0  │   1\n  1   1  │   0\n\n  A ──┐\n      ├─[XOR]── Output\n  B ──┘",
    tags: ["XOR Gate", "Exclusive OR", "Logic Gates", "Truth Table", "Boolean Algebra"],
  },
  {
    id: 45,
    slug: "xnor-gate",
    section: "Computer Fundamentals",
    parentSlug: "logic-gates",
    title: "XNOR Gate",
    tagline: "Exclusive NOR — output is 1 only if the inputs are the same",
    description:
      "<b>What the XNOR Gate Does</b>\nAn XNOR gate (\"exclusive NOR\") produces an output of 1 only when its two inputs are the same as each other (both 0, or both 1). If the inputs are different, the output is 0 — the exact opposite of XOR.\n\n<b>Boolean Notation</b>\nThe XNOR operation is written as (A ⊕ B)‾, sometimes shown as A ⊙ B.\n\n<b>Where XNOR Gates Are Used</b>\nBecause XNOR outputs 1 exactly when its two inputs match, it's the natural \"are these two bits equal?\" gate — used to build equality comparators, which check whether two binary numbers are the same, bit by bit.",
    note:
      "XNOR is simply XOR flipped: output 1 when inputs match, output 0 when they differ — the mirror image of XOR's \"different inputs\" rule.",
    diagram:
      "  XNOR Gate\n\n  A   B  │ Output\n  ───────┼───────\n  0   0  │   1\n  0   1  │   0\n  1   0  │   0\n  1   1  │   1\n\n  A ──┐\n      ├─[XOR]──[NOT]── Output\n  B ──┘",
    tags: ["XNOR Gate", "Exclusive NOR", "Logic Gates", "Truth Table", "Boolean Algebra"],
  },
  {
    id: 46,
    slug: "boolean-laws",
    section: "Computer Fundamentals",
    parentSlug: "boolean-algebra-digital-logic",
    title: "Boolean Laws",
    tagline: "The rules used to rewrite a Boolean expression into a simpler, equivalent one",
    description:
      "<b>Why Boolean Laws Matter</b>\nA digital circuit built directly from a raw Boolean expression is often bigger, slower, and more expensive than it needs to be — the same true/false behavior can usually be produced by a much simpler expression, using fewer gates. Boolean laws are the set of proven rules that let you rewrite one Boolean expression into a different, but logically equivalent, expression.\n\n<b>What You'll Learn Here</b>\n• <b>De Morgan's Theorem</b> — two specific rules for rewriting the NOT of an AND or an OR, which are essential for converting a circuit into all-NAND or all-NOR form\n• <b>Boolean Simplification</b> — the broader set of laws (identity, null, idempotent, complement, distributive, absorption, and more) used to reduce any Boolean expression to its simplest equivalent form\n  ↳ De Morgan's theorem is really just the two most famous, most commonly tested simplification laws — covered in its own card first because of how often it comes up on its own.",
    note:
      "Simplifying a Boolean expression before building the circuit means fewer gates, less cost, and a faster circuit — all while producing the exact same true/false output for every possible input.",
    tags: ["Boolean Laws", "De Morgan's Theorem", "Boolean Simplification", "Boolean Algebra"],
  },
  {
    id: 47,
    slug: "de-morgans-theorem",
    section: "Computer Fundamentals",
    parentSlug: "boolean-laws",
    title: "De Morgan's Theorem",
    tagline: "Two rules for rewriting the NOT of an AND or an OR",
    description:
      "<b>The Two Rules</b>\nDe Morgan's theorem gives two rules for pushing a NOT through an AND or an OR, named after the mathematician Augustus De Morgan.\n• <b>Rule 1</b>: NOT(A AND B) = (NOT A) OR (NOT B) — in symbols, (A·B)‾ = Ā + B̄\n• <b>Rule 2</b>: NOT(A OR B) = (NOT A) AND (NOT B) — in symbols, (A+B)‾ = Ā · B̄\n\n<b>The Pattern to Remember</b>\nIn both rules, three things happen at once: the NOT moves inside onto each individual variable, AND becomes OR (or OR becomes AND), and the overall NOT on the outside disappears.\n  ↳ Simple memory trick: \"break the line, change the sign\" — breaking the bar over (A·B) or (A+B) into separate bars over A and B flips AND to OR (or OR to AND).\n\n<b>Worked Example</b>\nSimplify (A · B)‾ using De Morgan's Rule 1:\n(A · B)‾ = Ā + B̄\n\nSo instead of building \"NOT the AND of A and B\" directly, the exact same result can be built as \"NOT A, OR'd with NOT B\" — useful because it shows a NAND gate (A·B)‾ can be built purely from OR and NOT gates instead.\n\n<b>Why De Morgan's Theorem Matters</b>\nDe Morgan's theorem is the mathematical reason NAND and NOR gates are universal (covered in the \"NAND Gate\" and \"NOR Gate\" cards) — it's what lets any AND/OR/NOT expression be rewritten entirely in terms of NAND, or entirely in terms of NOR, which is exactly how real chips are manufactured.",
    note:
      "Memorize the pattern, not just the formula: NOT distributes onto each variable, and AND/OR swap with each other. This single idea answers the vast majority of De Morgan's exam questions, even ones with more than two variables.",
    diagram:
      "  DE MORGAN'S THEOREM\n\n  Rule 1:  (A · B)‾   =   Ā + B̄\n           \"NOT(A AND B)\"  =  \"(NOT A) OR (NOT B)\"\n\n  Rule 2:  (A + B)‾   =   Ā · B̄\n           \"NOT(A OR B)\"   =  \"(NOT A) AND (NOT B)\"\n\n  Pattern: break the bar → each variable gets its own NOT\n           AND ↔ OR swap places",
    tags: ["De Morgan's Theorem", "Boolean Laws", "NAND", "NOR", "Boolean Algebra"],
  },
  {
    id: 48,
    slug: "boolean-simplification",
    section: "Computer Fundamentals",
    parentSlug: "boolean-laws",
    title: "Boolean Simplification",
    tagline: "The core laws used to reduce any Boolean expression to its simplest form",
    description:
      "<b>Why Simplify</b>\nA Boolean expression written straight from a truth table is often longer and messier than it needs to be. Boolean simplification uses a small set of proven laws to rewrite that expression into an equivalent one that uses fewer terms and fewer gates, without changing its true/false behavior for any input.\n\n<b>The Core Laws</b>\n• <b>Identity Law</b> — A + 0 = A, and A · 1 = A (OR-ing with 0, or AND-ing with 1, changes nothing)\n• <b>Null Law</b> — A + 1 = 1, and A · 0 = 0 (OR-ing with 1 always gives 1; AND-ing with 0 always gives 0)\n• <b>Idempotent Law</b> — A + A = A, and A · A = A (combining a variable with itself changes nothing)\n• <b>Complement Law</b> — A + Ā = 1, and A · Ā = 0 (a variable OR'd with its own opposite is always true; AND'd with its own opposite is always false)\n• <b>Double Negation</b> — (Ā)‾ = A (NOT-ing something twice gets back the original)\n• <b>Commutative Law</b> — A + B = B + A, and A · B = B · A (order doesn't matter)\n• <b>Distributive Law</b> — A · (B + C) = (A · B) + (A · C) (works the same way as multiplying out brackets in ordinary algebra)\n• <b>Absorption Law</b> — A + (A · B) = A, and A · (A + B) = A (a bigger term gets \"absorbed\" into a smaller one already present)\n\n<b>Worked Example</b>\nSimplify Y = A · B + A · B̄:\nY = A · (B + B̄)     [factor out A, using the distributive law]\nY = A · 1            [B + B̄ = 1, by the complement law]\nY = A                 [A · 1 = A, by the identity law]\n\nSo the original 4-term expression (A·B + A·B̄) is exactly equivalent to just A — the same output, built with a far simpler circuit.\n\n<b>How This Connects to De Morgan's Theorem</b>\nDe Morgan's theorem (covered in its own card) is really two more laws in this same family, specifically for pushing a NOT through an AND or OR — it's grouped separately here only because it comes up so often on its own.",
    note:
      "Simplification exam questions are almost always solved the same way: spot a pattern that matches one of these laws (often the distributive or absorption law), apply it, and repeat until nothing more can be reduced. Work one step at a time and name the law used at each step.",
    tags: ["Boolean Simplification", "Boolean Laws", "Distributive Law", "Absorption Law", "Boolean Algebra"],
  },
  {
    id: 49,
    slug: "digital-circuits",
    section: "Computer Fundamentals",
    parentSlug: "boolean-algebra-digital-logic",
    title: "Digital Circuits",
    tagline: "Gates wired together into genuinely useful building blocks — adders, flip-flops, registers, and counters",
    description:
      "<b>What This Covers</b>\nOnce you know the individual logic gates and the laws used to simplify them, the next step is seeing how gates combine into real, useful circuits — the same building blocks every CPU and digital device is made from.\n\n<b>What You'll Learn Here</b>\n• <b>Half Adder</b> — a small circuit that adds two single bits together\n• <b>Full Adder</b> — an adder that also accepts a carry-in, so many of them can be chained to add much larger binary numbers\n• <b>Flip-Flops</b> — the basic circuit that stores a single bit of data, the building block behind every register, counter, and RAM cell\n• <b>Registers</b> — a group of flip-flops wired together to store multiple bits as one unit\n• <b>Counters</b> — a chain of flip-flops arranged to count in a fixed sequence, such as counting up in binary\n  ↳ These build on each other in order: adders show gates doing arithmetic; flip-flops show gates storing memory; registers and counters then show flip-flops combined into bigger, more useful building blocks.",
    note:
      "Notice the progression: adders are gates with no memory (their output only depends on the current input); flip-flops are the opposite — pure memory, storing a bit even after the input changes; registers and counters are just multiple flip-flops wired together for a specific job (holding a group of bits, or counting).",
    tags: ["Digital Circuits", "Half Adder", "Full Adder", "Flip-Flops", "Registers", "Counters"],
  },
  {
    id: 50,
    slug: "half-adder",
    section: "Computer Fundamentals",
    parentSlug: "digital-circuits",
    title: "Half Adder",
    tagline: "A small circuit that adds two single bits together",
    description:
      "<b>What a Half Adder Does</b>\nA half adder is a digital circuit that adds two single binary digits (bits) together, producing two outputs: a Sum bit and a Carry bit. It's called \"half\" because it doesn't accept a carry-in from a previous addition — it can only handle the very first, simplest addition step.\n\n<b>How It's Built</b>\nA half adder is built from exactly two gates:\n• An <b>XOR gate</b> produces the Sum: Sum = A ⊕ B\n• An <b>AND gate</b> produces the Carry: Carry = A · B\n\n<b>Why XOR Gives the Sum</b>\nAdding two bits works exactly like ordinary binary addition: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (which is 0 with a carry of 1). Look closely: the Sum column (0,1,1,0) is exactly the XOR truth table, and the Carry column (0,0,0,1) is exactly the AND truth table — which is precisely why a half adder is just one XOR gate and one AND gate.\n\n<b>The Limitation</b>\nA half adder can only add the very first pair of bits in a larger addition — it has no way to also add in a carry coming from a previous, lower-value bit position. Adding two full multi-bit binary numbers needs a chain of adders that CAN accept a carry-in, which is exactly what a full adder (covered next) provides.",
    note:
      "The whole half adder can be summarized in two formulas: Sum = A ⊕ B, Carry = A · B. If a question asks which single gate produces the sum bit on its own, the answer is always XOR.",
    diagram:
      "  HALF ADDER\n\n  A   B  │ Sum  Carry\n  ───────┼───────────\n  0   0  │  0    0\n  0   1  │  1    0\n  1   0  │  1    0\n  1   1  │  0    1\n\n  A ──┬──[XOR]── Sum\n      │\n  B ──┼──[AND]── Carry\n      │\n      └──(same A, B feed both gates)",
    tags: ["Half Adder", "Digital Circuits", "XOR", "AND", "Binary Addition"],
  },
  {
    id: 51,
    slug: "full-adder",
    section: "Computer Fundamentals",
    parentSlug: "digital-circuits",
    title: "Full Adder",
    tagline: "An adder that also accepts a carry-in, so many can chain together",
    description:
      "<b>What a Full Adder Does</b>\nA full adder is a digital circuit that adds three single bits together — two data bits (A and B) plus a Carry-In bit from a previous addition — producing a Sum bit and a Carry-Out bit. Unlike a half adder, it can be chained together with other full adders to add binary numbers of any length, one bit position at a time.\n\n<b>How It's Built</b>\nA full adder can be built from two half adders plus one extra OR gate:\n• The first half adder adds A and B, producing an intermediate sum and an intermediate carry.\n• The second half adder adds that intermediate sum to the Carry-In, producing the final Sum.\n• An OR gate combines the two intermediate carries to produce the final Carry-Out.\n\n<b>The Formulas</b>\nSum = A ⊕ B ⊕ Cin\nCarry-Out = (A · B) + (Cin · (A ⊕ B))\n\n<b>Chaining Full Adders — Adding Real Binary Numbers</b>\nTo add two multi-bit binary numbers, one full adder is used per bit position, with each adder's Carry-Out wired into the next adder's Carry-In — this arrangement is called a ripple carry adder, since the carry \"ripples\" from the lowest bit position up to the highest.\n  ↳ Example: adding two 8-bit numbers needs 8 full adders chained together (the very first one can be a half adder, since there's no carry-in yet at the lowest bit position).",
    note:
      "The key difference from a half adder: a full adder has THREE inputs (A, B, and Carry-In), not two, which is exactly what lets multiple full adders be chained together to add numbers of any length — a half adder alone cannot do this.",
    diagram:
      "  FULL ADDER\n\n  A  B  Cin │ Sum  Cout\n  ──────────┼───────────\n  0  0   0  │  0    0\n  0  0   1  │  1    0\n  0  1   0  │  1    0\n  0  1   1  │  0    1\n  1  0   0  │  1    0\n  1  0   1  │  0    1\n  1  1   0  │  0    1\n  1  1   1  │  1    1\n\n  RIPPLE CARRY ADDER (chaining full adders)\n\n  A0,B0 ─►[Full Adder]─► Sum0\n              │ Cout\n              ▼\n  A1,B1 ─►[Full Adder]─► Sum1\n              │ Cout\n              ▼\n           ...continues for every bit position",
    tags: ["Full Adder", "Digital Circuits", "Ripple Carry Adder", "Binary Addition"],
  },
  {
    id: 52,
    slug: "flip-flops",
    section: "Computer Fundamentals",
    parentSlug: "digital-circuits",
    title: "Flip-Flops",
    tagline: "The basic circuit that stores a single bit of data",
    description:
      "<b>What a Flip-Flop Is</b>\nA flip-flop is a digital circuit that stores a single bit of data (a 0 or a 1) and holds onto it — even after its inputs change — until it's deliberately told to store something new. It's the fundamental building block of computer memory: every register, counter, and even a SRAM cell (covered in the \"SRAM\" card) is ultimately built from flip-flops.\n\n<b>Why Flip-Flops Are Different From Gates Like AND or OR</b>\nA logic gate like AND or OR is purely combinational — its output depends only on its CURRENT inputs, with no memory of the past. A flip-flop is sequential — its output depends on its current input AND its previous stored state, which is exactly what lets it \"remember\" a bit over time.\n\n<b>Common Types of Flip-Flops</b>\n• <b>SR (Set-Reset) Flip-Flop</b> — the simplest type; a Set input forces the stored bit to 1, a Reset input forces it to 0\n• <b>D (Data) Flip-Flop</b> — stores whatever single bit is on its Data input at the moment a clock signal ticks, and holds that value until the next tick\n• <b>JK Flip-Flop</b> — an improved version of the SR flip-flop that also defines a valid behavior for the case SR left undefined (both inputs active at once)\n• <b>T (Toggle) Flip-Flop</b> — flips (toggles) its stored bit every time the clock ticks, provided its Toggle input is 1\n\n<b>Clocked vs. Unclocked</b>\nMany flip-flops are clocked — they only update their stored bit at the exact moment a clock signal ticks (rather than continuously reacting to their inputs), which keeps every part of a larger circuit changing state in careful, predictable sync with each other.",
    note:
      "The one distinction that matters most: a gate has no memory (output depends only on current input); a flip-flop has memory (output depends on current input AND whatever was stored before). This is exactly why flip-flops, not gates, are what build registers and counters.",
    diagram:
      "  D FLIP-FLOP (most common type)\n\n  Data ──►┌─────────┐\n          │    D   Q ├──► Output (stored bit)\n  Clock ─►│  CLK     │\n          └─────────┘\n\n  On each clock tick: Output (Q) becomes whatever Data currently is,\n  then holds that value steady until the next clock tick.",
    tags: ["Flip-Flops", "SR Flip-Flop", "D Flip-Flop", "JK Flip-Flop", "T Flip-Flop", "Digital Circuits", "Sequential Circuit"],
  },
  {
    id: 53,
    slug: "registers-digital-circuit",
    section: "Computer Fundamentals",
    parentSlug: "digital-circuits",
    title: "Registers",
    tagline: "A group of flip-flops wired together to store multiple bits as one unit",
    description:
      "<b>What a Register Is</b>\nA register, in digital circuit terms, is simply a group of flip-flops wired together, with one flip-flop per bit, so the whole group can store and move a multi-bit value as a single unit. An 8-bit register, for example, is just 8 flip-flops sharing one clock signal.\n  ↳ This is the circuit-level view of the same registers already introduced conceptually in the \"Register\" card under Memory Hierarchy (PC, IR, ACC) — this card focuses on how a register is actually built and how data moves in and out of it.\n\n<b>Loading Data Into a Register</b>\n• <b>Parallel load</b> — every bit of the register is loaded at the same time, in a single clock tick; fast, but needs one input wire per bit.\n• <b>Serial load</b> — bits are loaded one at a time, a single bit per clock tick, shifting the previous bits along to make room; slower, but needs only one input wire no matter how many bits the register holds.\n\n<b>Shift Registers</b>\nA shift register is a register specifically built to move its stored bits left or right by one position on every clock tick — useful for converting data between serial (one bit at a time) and parallel (all bits at once) form, which is exactly how much real-world data communication works.\n\n<b>Where Registers Are Used</b>\nEvery CPU register (Program Counter, Instruction Register, Accumulator, and general-purpose registers) is built this way — a set of flip-flops, one per bit, sharing a clock, loaded and read as a single unit each time the CPU needs to use that value.",
    note:
      "Circuit-level takeaway: an N-bit register is just N flip-flops, one per bit, sharing a single clock. Parallel load moves all N bits at once; serial load (used in shift registers) moves them one at a time, trading speed for fewer wires.",
    diagram:
      "  4-BIT REGISTER (built from 4 D flip-flops)\n\n  Bit 3 ──►[D Flip-Flop]── Q3\n  Bit 2 ──►[D Flip-Flop]── Q2\n  Bit 1 ──►[D Flip-Flop]── Q1\n  Bit 0 ──►[D Flip-Flop]── Q0\n           ▲  ▲  ▲  ▲\n           └──┴──┴──┘\n         all 4 share one Clock signal\n\n  PARALLEL LOAD: all 4 bits loaded in 1 clock tick\n  SERIAL LOAD (shift register): 1 bit loaded per tick, shifting the rest along",
    tags: ["Registers", "Shift Register", "Flip-Flops", "Digital Circuits", "Parallel Load", "Serial Load"],
  },
  {
    id: 54,
    slug: "counters",
    section: "Computer Fundamentals",
    parentSlug: "digital-circuits",
    title: "Counters",
    tagline: "A chain of flip-flops arranged to count in a fixed sequence",
    description:
      "<b>What a Counter Is</b>\nA counter is a digital circuit, built from flip-flops, that steps through a fixed sequence of binary values, one step per clock tick — most commonly counting upward in binary (000, 001, 010, 011, ...) before wrapping back around to 000 and repeating.\n\n<b>Asynchronous (Ripple) Counters</b>\nIn an asynchronous counter, only the very first flip-flop is driven directly by the main clock signal; each following flip-flop is triggered by the output of the one before it, so a change has to \"ripple\" through the chain one flip-flop at a time.\n• Simple to build, using very few extra components.\n• Slower for larger counters, since each bit has to wait for every bit before it to finish changing first.\n\n<b>Synchronous Counters</b>\nIn a synchronous counter, every flip-flop shares the exact same clock signal directly, so all bits that need to change, change at the same instant.\n• Needs more wiring/logic than a ripple counter.\n• Much faster and more predictable, since there's no rippling delay — this is why synchronous counters are preferred in most real, high-speed circuits.\n\n<b>Where Counters Are Used</b>\nCounters are used anywhere something needs to be counted or sequenced automatically — clock dividers (producing a slower clock signal from a faster one), digital clocks and timers, and sequencing the steps of more complex digital circuits.",
    note:
      "The key exam distinction: asynchronous (ripple) counters are simple but slow, since each flip-flop waits for the one before it; synchronous counters share one clock across every flip-flop, making them faster and used far more often in real high-speed designs.",
    diagram:
      "  3-BIT BINARY COUNTER SEQUENCE\n\n  Count:  000 → 001 → 010 → 011 → 100 → 101 → 110 → 111 → 000 (repeats)\n\n  ASYNCHRONOUS (RIPPLE) COUNTER\n  Clock ─►[FF0]─►[FF1]─►[FF2]\n           each flip-flop triggers the next — changes ripple through\n\n  SYNCHRONOUS COUNTER\n  Clock ─┬─►[FF0]\n         ├─►[FF1]\n         └─►[FF2]\n           all flip-flops share the same clock — change together",
    tags: ["Counters", "Asynchronous Counter", "Synchronous Counter", "Ripple Counter", "Digital Circuits", "Flip-Flops"],
  },
  // ─────────────────────────────────────────────
  // PROGRAMMING
  // ─────────────────────────────────────────────
  {
    id: 55,
    slug: "c-programming",
    section: "Programming",
    title: "C Programming",
    tagline: "A foundational, low-level programming language still taught as the basis for how computers really execute code",
    description:
      "<b>What C Is</b>\nC is a general-purpose programming language created by Dennis Ritchie at Bell Labs in 1972. It's considered a \"low-level\" high-level language — it lets a programmer write readable code (unlike raw machine language or assembly), while still staying close to how the computer's hardware actually works, including direct memory access through pointers.\n\n<b>Why C Is Still Taught</b>\nMany modern languages (C++, Java, C#, JavaScript, Python) borrow their basic syntax — curly braces, semicolons, if/for/while loops — directly from C. Learning C first builds a mental model of how a program actually works underneath (memory, compilation, execution) that these newer, more abstracted languages otherwise hide from a beginner.\n\n<b>How This Section Is Organized</b>\n• <b>Basics</b> — the structure of a C program, how it turns into a running executable, and the fundamental building blocks (variables, data types, constants, and keywords) every C program is written from\n  ↳ Each of these building blocks is covered in its own card next.",
    note:
      "C is often called \"the mother of all languages\" for good reason — most languages used in exams and in industry today borrow C's syntax directly, so understanding C's basics carries over almost immediately.",
    tags: ["C Programming", "Programming", "Dennis Ritchie", "Low-Level Language"],
  },
  {
    id: 56,
    slug: "c-basics",
    section: "Programming",
    parentSlug: "c-programming",
    title: "Basics",
    tagline: "The structure, compilation process, and fundamental building blocks of a C program",
    description:
      "<b>What This Covers</b>\nBefore writing any real logic, every C programmer needs to know how a C program is laid out, how that written code actually turns into a running program, and the basic vocabulary (variables, data types, constants, keywords) every single line of C code is built from.\n\n<b>Why Start Here</b>\nEvery later topic in C — operators, control flow, functions, and beyond — assumes you already know how to declare a variable, pick the right data type, and recognize a C program's basic shape. Skipping these basics makes everything after them harder to follow.\n\n<b>How This Section Is Organized</b>\n• <b>Structure of C Program</b> — the standard sections every C source file is organized into\n• <b>Compilation Process</b> — the steps that turn human-readable C code into a machine-executable program\n• <b>Variables</b> — named storage locations that hold data a program can use and change\n• <b>Data Types</b> — the different kinds of values a variable can hold, and how much memory each takes\n• <b>Constants</b> — fixed values that don't change while a program runs\n• <b>Keywords</b> — the reserved words built into the C language itself, which can't be used as variable names\n  ↳ These build on each other in order: first how a program is structured and compiled, then the core vocabulary used to write the actual code inside it.",
    note:
      "Read these in order: Structure and Compilation Process explain how a C program comes together as a whole; Variables, Data Types, Constants, and Keywords are the actual vocabulary used inside that structure.",
    tags: ["C Basics", "C Programming", "Structure", "Compilation", "Variables", "Data Types"],
  },
  {
    id: 57,
    slug: "structure-of-c-program",
    section: "Programming",
    parentSlug: "c-basics",
    title: "Structure of C Program",
    tagline: "The standard sections every C source file is organized into",
    description:
      "<b>What This Structure Is</b>\nEvery C program, no matter how big or small, is generally organized into the same sections, in the same order.\n\n<b>Why It's Structured This Way</b>\nA fixed, predictable layout lets the compiler know exactly where to look for library includes, global data, and the program's actual starting point — and lets any C programmer immediately recognize the shape of a program they've never seen before.\n\n<b>How the Sections Work</b>\n• <b>Documentation section</b> — comments at the very top (using // or /* */) describing what the program does; ignored entirely by the compiler, purely for humans reading the code.\n• <b>Preprocessor directives</b> — lines starting with #, most commonly #include, which pulls in code from library files (like stdio.h for input/output functions) before compilation actually begins.\n• <b>Global declarations</b> — variables and function prototypes declared outside of any function, visible to every function in the file.\n• <b>main() function</b> — every C program must have exactly one main() function; this is where the program actually starts running, and where execution begins the moment the program is launched.\n• <b>User-defined functions</b> — additional functions the programmer writes, called from main() or from each other, to organize the program's logic into reusable pieces.\n\n<b>A Minimal C Program</b>\nThe code example below shows the smallest complete, valid C program.\n\n<b>Reading the Minimal Example</b>\n• #include <stdio.h> — a preprocessor directive that pulls in the Standard Input/Output library, giving access to printf().\n• int main() — declares the main function; int means main() returns a whole number back to the operating system when it finishes.\n• printf(\"Hello, World!\") — calls a library function to print text to the screen.\n• return 0 — ends main(), returning 0 to signal the program finished successfully (a non-zero return value conventionally signals an error occurred).",
    note:
      "Every valid C program must have exactly one main() function — it's the fixed starting point execution always begins from, no matter how many other functions the file also contains.",
    code: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, World!\");\n    return 0;\n}",
    codeLanguage: "C",
    diagram:
      "  STRUCTURE OF A C PROGRAM\n\n  ┌───────────────────────────────┐\n  │ Documentation (comments)      │  ignored by the compiler\n  ├───────────────────────────────┤\n  │ Preprocessor directives       │  #include <stdio.h>\n  ├───────────────────────────────┤\n  │ Global declarations            │  variables/prototypes\n  ├───────────────────────────────┤\n  │ int main() { ... }             │  execution starts here\n  ├───────────────────────────────┤\n  │ User-defined functions         │  called from main()\n  └───────────────────────────────┘",
    tags: ["Structure of C Program", "main() function", "Preprocessor Directives", "C Basics"],
  },
  {
    id: 58,
    slug: "compilation-process",
    section: "Programming",
    parentSlug: "c-basics",
    title: "Compilation Process",
    tagline: "The steps that turn human-readable C code into a machine-executable program",
    description:
      "<b>What Compilation Is</b>\nCompilation is the process that translates human-readable C code into a machine-executable program, in several distinct stages.\n\n<b>Why Compilation Is Needed</b>\nA CPU only understands machine language (raw binary instructions) — it cannot run C source code directly, so this translation step is mandatory before any C program can actually run.\n\n<b>How Compilation Works — the Four Stages</b>\n• <b>Preprocessing</b> — the preprocessor handles every line starting with #, such as #include (pasting in library file contents) and #define (replacing macros with their defined value), producing a single expanded source file with no # directives left.\n• <b>Compilation</b> — the compiler translates the preprocessed C code into assembly language, checking for syntax errors along the way; if the code doesn't follow C's grammar rules, compilation stops here with an error.\n• <b>Assembly</b> — an assembler translates the assembly code into object code (machine code specific to the target CPU), producing a .o (or .obj) file — but this file isn't runnable yet, since it may still reference functions defined elsewhere (like printf from the C library).\n• <b>Linking</b> — the linker combines the object code with the actual library code it references (such as the Standard I/O library), and any other object files, producing a single, complete, runnable executable file.\n\n<b>Where Errors Show Up</b>\n• A missing semicolon or misspelled keyword is caught at the <b>compilation</b> stage (a syntax error).\n• A missing function definition the linker can't find anywhere is caught at the <b>linking</b> stage (a linker error, e.g. \"undefined reference\").",
    note:
      "The exam-favourite order: Preprocessing → Compilation → Assembly → Linking. A syntax error (like a typo) is caught during Compilation; a missing function/library is caught later, during Linking — these are two different kinds of errors from two different stages.",
    diagram:
      "  COMPILATION PROCESS\n\n  source.c\n     │\n     ▼\n  PREPROCESSING   (expands #include, #define)\n     │\n     ▼\n  COMPILATION      (C code → assembly code; syntax errors caught here)\n     │\n     ▼\n  ASSEMBLY         (assembly code → object code, e.g. source.o)\n     │\n     ▼\n  LINKING          (object code + library code → final executable;\n     │              missing function errors caught here)\n     ▼\n  a.out / program.exe  (runnable program)",
    tags: ["Compilation Process", "Preprocessing", "Linking", "Assembler", "C Basics"],
  },
  {
    id: 59,
    slug: "c-variables",
    section: "Programming",
    parentSlug: "c-basics",
    title: "Variables",
    tagline: "Named storage locations that hold data a program can use and change",
    description:
      "<b>What a Variable Is</b>\nA variable is a named location in memory that holds a value a program can read and change while it runs. Every variable in C must be declared with a data type before it's used, telling the compiler how much memory to reserve and what kind of value it will hold.\n\n<b>Why Variables Matter</b>\nWithout variables, a program could only work with fixed, hardcoded values. Variables let a program store, change, and reuse data as it runs, which is the basis for literally every computation a program performs.\n\n<b>How to Declare and Use One</b>\nint age;          // declaration — reserves memory, no value yet\nage = 25;          // assignment — stores a value into that memory\nint score = 100;   // declaration + initialization in one line\n\n<b>Rules for Naming a Variable</b>\n• Must start with a letter or an underscore (never a digit).\n• Can contain letters, digits, and underscores after the first character.\n• Cannot be a C keyword (like int or return — covered in the \"Keywords\" card).\n• Is case-sensitive — score and Score are two completely different variables.\n\n<b>Local vs. Global Variables</b>\n• <b>Local variable</b> — declared inside a function, only exists and is only accessible while that function is running.\n• <b>Global variable</b> — declared outside every function, exists for the entire time the program runs, and is accessible from any function in the file.",
    note:
      "A variable must always be declared with a type before use in C — unlike some newer languages, C never guesses a variable's type from the value assigned to it.",
    tags: ["Variables", "Declaration", "Local Variable", "Global Variable", "C Basics"],
  },
  {
    id: 60,
    slug: "c-data-types",
    section: "Programming",
    parentSlug: "c-basics",
    title: "Data Types",
    tagline: "The different kinds of values a variable can hold, and how much memory each takes",
    description:
      "<b>What a Data Type Is</b>\nA data type tells the compiler what kind of value a variable will hold — a whole number, a decimal number, a single character, or nothing at all.\n\n<b>Why Data Types Matter</b>\nA variable's data type tells the compiler exactly how much memory to set aside for it, and how to interpret the bits stored there — the same sequence of bits means something completely different depending on whether it's read as an integer, a character, or a floating-point number.\n\n<b>How the Basic Data Types Work</b>\n• <b>int</b> — a whole number (no decimal point), typically 4 bytes, e.g. 42, -7\n• <b>float</b> — a single-precision decimal number, typically 4 bytes, e.g. 3.14\n• <b>double</b> — a double-precision decimal number (more accurate than float), typically 8 bytes, e.g. 3.14159265\n• <b>char</b> — a single character, typically 1 byte, e.g. 'A' (stored internally as its ASCII numeric value)\n• <b>void</b> — represents \"no value at all\" — used for a function that returns nothing, or a generic pointer type\n\n<b>Modifiers</b>\nType modifiers adjust the size or range of a basic type:\n• <b>short</b> / <b>long</b> — reduce or increase the number of bytes used (e.g. short int, long int)\n• <b>signed</b> / <b>unsigned</b> — signed allows negative numbers (the default); unsigned uses that same space to represent only non-negative numbers, doubling the largest positive value it can hold\n\n<b>Worked Example</b>\nAn unsigned char uses all 8 bits for the magnitude, giving a range of 0 to 255. A signed char uses 1 bit for the sign, giving a range of -128 to 127 — the same 8 bits, interpreted differently.",
    note:
      "Exam favourite: signed vs. unsigned doesn't change how many bits are used — it changes how those bits are interpreted, trading the ability to represent negative numbers for a larger positive range.",
    diagram:
      "  COMMON C DATA TYPES\n\n  Type     Typical Size   Example\n  ──────────────────────────────────\n  char        1 byte      'A'\n  int         4 bytes      42\n  float       4 bytes      3.14\n  double      8 bytes      3.14159265\n  void        —            (no value)",
    tags: ["Data Types", "int", "float", "double", "char", "Signed", "Unsigned", "C Basics"],
  },
  {
    id: 61,
    slug: "c-constants",
    section: "Programming",
    parentSlug: "c-basics",
    title: "Constants",
    tagline: "Fixed values that don't change while a program runs",
    description:
      "<b>What a Constant Is</b>\nA constant is a value that, once set, cannot be changed while the program runs — unlike a variable, which can be reassigned at any time. Constants are used for values that are meant to stay fixed, such as a mathematical constant or a fixed configuration value.\n\n<b>Why Use Constants</b>\nA fixed value used throughout a program (like PI, or a maximum array size) is easier to update correctly, and harder to accidentally change by mistake, when it's defined once as a constant instead of retyped as a raw number everywhere it's needed.\n\n<b>How to Define One</b>\n• <b>const keyword</b> — const float PI = 3.14; declares a normal, typed variable that the compiler then refuses to let any later code modify.\n• <b>#define preprocessor macro</b> — #define PI 3.14 tells the preprocessor to literally replace every occurrence of PI with 3.14 in the source code, before compilation even begins — it isn't a variable at all, just a text substitution.\n\n<b>Types of Constants (Literal Values)</b>\n• <b>Integer constants</b> — whole numbers, e.g. 10, -5\n• <b>Floating-point constants</b> — decimal numbers, e.g. 3.14\n• <b>Character constants</b> — a single character in single quotes, e.g. 'A'\n• <b>String constants</b> — a sequence of characters in double quotes, e.g. \"Hello\"",
    note:
      "const vs. #define: const creates a real, typed variable the compiler protects from being changed; #define is a preprocessor text substitution done before compilation, with no type checking at all.",
    tags: ["Constants", "const", "#define", "Literals", "C Basics"],
  },
  {
    id: 62,
    slug: "c-keywords",
    section: "Programming",
    parentSlug: "c-basics",
    title: "Keywords",
    tagline: "The reserved words built into the C language itself",
    description:
      "<b>What a Keyword Is</b>\nA keyword is a word that's reserved by the C language itself, with a fixed, built-in meaning to the compiler — it can never be used as the name of a variable, function, or anything else a programmer defines.\n\n<b>Why Keywords Are Reserved</b>\nIf keywords could be redefined as variable names, the compiler could no longer reliably tell code apart from data — reserving them guarantees every C compiler interprets if, for, int, and the rest exactly the same way, everywhere.\n\n<b>How Keywords Are Grouped</b>\n• <b>Data type keywords</b> — int, float, double, char, void\n• <b>Control flow keywords</b> — if, else, switch, case, for, while, do, break, continue\n• <b>Storage/qualifier keywords</b> — const, static, extern, volatile\n• <b>Structure/organization keywords</b> — struct, union, enum, typedef\n• <b>Function-related keywords</b> — return, sizeof\n\n<b>The Rule</b>\nC has exactly 32 keywords in the original C standard (a few more were added in later revisions). None of them can ever be redefined or used as an identifier — trying to write int int; would be a compilation error, since int is reserved.",
    note:
      "If a question asks whether a given word can be used as a variable name, check whether it's a C keyword first — a keyword always loses that fight, no matter how convenient a name it would otherwise make.",
    tags: ["Keywords", "Reserved Words", "C Basics"],
  },
  {
    id: 63,
    slug: "operators",
    section: "Programming",
    parentSlug: "c-programming",
    title: "Operators",
    tagline: "The symbols C uses to perform calculations, comparisons, and logical decisions",
    description:
      "<b>What an Operator Is</b>\nAn operator is a symbol that tells the compiler to perform a specific operation on one or more values (called operands) — adding two numbers, comparing two values, or combining true/false conditions.\n\n<b>Why Operators Matter</b>\nAlmost every useful line of C code involves at least one operator — calculating a total, checking a condition, or combining multiple true/false tests. Operators are the smallest building blocks every larger expression is made from.\n\n<b>How This Section Is Organized</b>\n• <b>Arithmetic</b> — the basic math operators: +, -, *, /, %\n• <b>Relational</b> — operators that compare two values and produce a true/false result: ==, !=, >, <, >=, <=\n• <b>Logical</b> — operators that combine true/false conditions: && (AND), || (OR), ! (NOT)\n• <b>Bitwise</b> — operators that work directly on the individual bits of a value: &, |, ^, ~, <<, >>\n• <b>Assignment</b> — operators that store a value into a variable: =, and the shorthand combined forms like +=, -=\n  ↳ Each is covered in its own card next, with a full list of operators and worked examples.",
    note:
      "Every operator category answers a different question: Arithmetic asks \"what's the result?\", Relational asks \"is this true or false?\", Logical asks \"how do multiple conditions combine?\", Bitwise asks \"what does this look like at the bit level?\", and Assignment asks \"what gets stored where?\"",
    tags: ["Operators", "C Programming", "Arithmetic", "Relational", "Logical", "Bitwise", "Assignment"],
  },
  {
    id: 64,
    slug: "arithmetic-operators",
    section: "Programming",
    parentSlug: "operators",
    title: "Arithmetic Operators",
    tagline: "The basic math operators: +, -, *, /, %",
    description:
      "<b>What Arithmetic Operators Are</b>\nArithmetic operators perform the basic math operations on numeric values: addition, subtraction, multiplication, division, and finding a remainder.\n\n<b>Why They Matter</b>\nAny calculation a C program performs — totals, averages, prices, counters — is ultimately built from these five operators.\n\n<b>How to Use Them</b>\n• <b>+</b> (addition) — a + b\n• <b>-</b> (subtraction) — a - b\n• <b>*</b> (multiplication) — a * b\n• <b>/</b> (division) — a / b\n• <b>%</b> (modulus) — a % b, the remainder left over after dividing a by b\n\n<b>Integer Division — a Common Surprise</b>\nWhen both operands of / are integers, C performs integer division, truncating (cutting off) any decimal part rather than rounding — 7 / 2 gives 3, not 3.5. To get a decimal result, at least one operand must be a float or double.\n\n<b>The Modulus Operator (%)</b>\n% only works with integers, and gives the remainder of a division — 7 % 2 gives 1, since 7 divided by 2 is 3 remainder 1. It's commonly used to check if a number is even or odd (n % 2 == 0 means even).",
    note:
      "Exam favourite: 7 / 2 = 3 (integer division truncates, doesn't round), but 7 % 2 = 1 (the remainder). Mixing these two up is one of the most common C mistakes.",
    code: "int a = 7, b = 2;\nprintf(\"%d\\n\", a + b);  // 9\nprintf(\"%d\\n\", a - b);  // 5\nprintf(\"%d\\n\", a * b);  // 14\nprintf(\"%d\\n\", a / b);  // 3  (integer division)\nprintf(\"%d\\n\", a % b);  // 1  (remainder)",
    codeLanguage: "C",
    tags: ["Arithmetic Operators", "Operators", "Modulus", "Integer Division", "C Programming"],
  },
  {
    id: 65,
    slug: "relational-operators",
    section: "Programming",
    parentSlug: "operators",
    title: "Relational Operators",
    tagline: "Compare two values, producing a true (1) or false (0) result",
    description:
      "<b>What Relational Operators Are</b>\nRelational operators compare two values and produce a true/false result, used to test whether one value is equal to, greater than, or less than another.\n\n<b>Why They Matter</b>\nEvery conditional statement in C (if, while, for) relies on a relational operator, or a combination of them, to decide whether its condition is actually true.\n\n<b>How to Use Them</b>\n• <b>==</b> — equal to\n• <b>!=</b> — not equal to\n• <b>></b> — greater than\n• <b><</b> — less than\n• <b>>=</b> — greater than or equal to\n• <b><=</b> — less than or equal to\n\n<b>What They Return</b>\nEvery relational operator produces exactly one of two results: 1 (true) or 0 (false) — C has no separate boolean type in its original standard, so true/false is just represented as an integer.\n\n<b>== vs. = — a Classic Beginner Mistake</b>\n== compares two values for equality; = assigns a value to a variable. Writing if (x = 5) instead of if (x == 5) is a very common bug — it assigns 5 to x (which is always \"truthy\" if non-zero) instead of checking whether x equals 5, and the code still compiles without any error.",
    note:
      "The single most common C bug this topic causes: confusing = (assignment) with == (comparison) inside an if condition. Both compile fine, but they do completely different things.",
    code: "int x = 5, y = 10;\nprintf(\"%d\\n\", x == y);  // 0 (false)\nprintf(\"%d\\n\", x != y);  // 1 (true)\nprintf(\"%d\\n\", x < y);   // 1 (true)",
    codeLanguage: "C",
    tags: ["Relational Operators", "Operators", "Comparison", "C Programming"],
  },
  {
    id: 66,
    slug: "logical-operators",
    section: "Programming",
    parentSlug: "operators",
    title: "Logical Operators",
    tagline: "Combine true/false conditions: && (AND), || (OR), ! (NOT)",
    description:
      "<b>What Logical Operators Are</b>\nLogical operators combine multiple true/false conditions into a single true/false result — used whenever a decision depends on more than one thing being true at once.\n\n<b>Why They Matter</b>\nReal-world conditions are rarely just one check — \"old enough AND has ID\" needs a way to combine two separate relational tests into one overall decision, which is exactly what logical operators do.\n\n<b>How to Use Them</b>\n• <b>&&</b> (logical AND) — true only if both conditions are true\n• <b>||</b> (logical OR) — true if at least one condition is true\n• <b>!</b> (logical NOT) — flips a condition's truth value\n  ↳ These behave exactly like the AND, OR, and NOT logic gates covered in the \"Logic Gates\" card — same truth tables, just written as C operators applied to conditions instead of physical circuit inputs.\n\n<b>Short-Circuit Evaluation</b>\nC stops evaluating a && or || expression as soon as the overall result is already certain, without ever checking the remaining condition(s):\n• In a && b, if a is false, the whole expression is already false, so b is never evaluated.\n• In a || b, if a is true, the whole expression is already true, so b is never evaluated.\n  ↳ This matters in real code: if (ptr != NULL && ptr->value > 0) safely skips checking ptr->value when ptr is NULL, avoiding a crash — the second condition never runs if the first is false.",
    note:
      "Short-circuit evaluation isn't just an optimization — it's a safety mechanism programmers rely on, letting a first condition guard against a second condition that would otherwise fail or crash.",
    code: "int age = 20;\nint hasId = 1;\n\nif (age >= 18 && hasId) {\n    printf(\"Entry allowed\\n\");\n}\n\nif (!hasId) {\n    printf(\"ID required\\n\");\n}",
    codeLanguage: "C",
    tags: ["Logical Operators", "Operators", "Short-Circuit Evaluation", "C Programming"],
  },
  {
    id: 67,
    slug: "bitwise-operators",
    section: "Programming",
    parentSlug: "operators",
    title: "Bitwise Operators",
    tagline: "Operators that work directly on the individual bits of a value",
    description:
      "<b>What Bitwise Operators Are</b>\nBitwise operators work directly on the individual bits making up a value, rather than treating it as a single whole number.\n\n<b>Why They Matter</b>\nSetting or checking individual flag bits, packing several small values into one integer, and fast multiplication/division by powers of 2 all rely on manipulating bits directly, which is exactly what bitwise operators are for.\n\n<b>How to Use Them</b>\n• <b>&</b> (bitwise AND) — compares each bit position, giving 1 only where both bits are 1\n• <b>|</b> (bitwise OR) — gives 1 where at least one bit is 1\n• <b>^</b> (bitwise XOR) — gives 1 where the bits are different\n• <b>~</b> (bitwise NOT / complement) — flips every bit\n• <b><<</b> (left shift) — shifts every bit left by a given number of positions, filling with 0s (equivalent to multiplying by a power of 2)\n• <b>>></b> (right shift) — shifts every bit right by a given number of positions (equivalent to dividing by a power of 2, for unsigned/positive values)\n  ↳ These are the exact same operations as the AND/OR/XOR/NOT logic gates, just applied bit-by-bit across an entire integer at once rather than to a single true/false condition.\n\n<b>Worked Example</b>\n5 in binary is 0101, and 3 in binary is 0011.\n5 & 3 = 0001 = 1\n5 | 3 = 0111 = 7\n5 ^ 3 = 0110 = 6\n\n<b>Where Bitwise Operators Are Used</b>\nBitwise operators are common in low-level code: setting or checking individual flag bits in a status register, fast multiplication/division by powers of 2 using shifts, and packing multiple small values into a single integer.",
    note:
      "Don't confuse bitwise (&, |) with logical (&&, ||) operators — logical operators produce a single true/false result from whole conditions, while bitwise operators produce a full integer result by operating on individual bits.",
    code: "int a = 5;   // 0101\nint b = 3;   // 0011\n\nprintf(\"%d\\n\", a & b);   // 1  (0001)\nprintf(\"%d\\n\", a | b);   // 7  (0111)\nprintf(\"%d\\n\", a ^ b);   // 6  (0110)\nprintf(\"%d\\n\", a << 1);  // 10 (shift left = ×2)\nprintf(\"%d\\n\", a >> 1);  // 2  (shift right = ÷2)",
    codeLanguage: "C",
    tags: ["Bitwise Operators", "Operators", "Bit Shift", "C Programming"],
  },
  {
    id: 68,
    slug: "assignment-operators",
    section: "Programming",
    parentSlug: "operators",
    title: "Assignment Operators",
    tagline: "Store a value into a variable — plain =, and shorthand combined forms",
    description:
      "<b>What Assignment Operators Are</b>\nAssignment operators store a value into a variable — from the simple = sign, to shorthand combined forms that update a variable based on its own current value.\n\n<b>Why They Matter</b>\nWithout assignment, a variable's value could never change after it's first declared — assignment is the basic operation that lets a program actually update its own state as it runs.\n\n<b>How to Use Them</b>\n= stores the value on its right-hand side into the variable on its left — x = 5 stores 5 into x. It's important not to confuse this with == (relational equality, covered in the \"Relational Operators\" card).\n\n<b>Compound (Shorthand) Assignment Operators</b>\nC provides shorthand operators that combine an arithmetic or bitwise operation with assignment in one step:\n• <b>+=</b> — x += 5 means x = x + 5\n• <b>-=</b> — x -= 5 means x = x - 5\n• <b>*=</b> — x *= 5 means x = x * 5\n• <b>/=</b> — x /= 5 means x = x / 5\n• <b>%=</b> — x %= 5 means x = x % 5\n  ↳ The same shorthand pattern also exists for bitwise operators: &=, |=, ^=, <<=, >>=.\n\n<b>Increment and Decrement</b>\nC also provides ++ (increment by 1) and -- (decrement by 1) as an even shorter form of += 1 and -= 1.\n• <b>Prefix</b> (++x) — increments x first, then uses the new value\n• <b>Postfix</b> (x++) — uses the current value first, then increments x",
    note:
      "The prefix vs. postfix distinction (++x vs x++) only matters when the result is used immediately in the same expression — used on its own line, both do exactly the same thing.",
    code: "int x = 10;\nx += 5;   // x is now 15\nx -= 3;   // x is now 12\n\nint a = 5;\nint b = a++;  // b = 5, then a becomes 6\nint c = ++a;  // a becomes 7, then c = 7",
    codeLanguage: "C",
    tags: ["Assignment Operators", "Operators", "Increment", "Decrement", "C Programming"],
  },
  {
    id: 69,
    slug: "control-flow",
    section: "Programming",
    parentSlug: "c-programming",
    title: "Control Flow",
    tagline: "The statements that decide which code runs, and how many times",
    description:
      "<b>What Control Flow Means</b>\nBy default, a C program runs one line after another, top to bottom. Control flow statements let a program branch — running different code depending on a condition — or repeat a block of code multiple times.\n\n<b>Why Control Flow Matters</b>\nA program that could only run top-to-bottom, with no branching or repeating, could never react to different input, or process more than a fixed amount of data — control flow is what makes real, useful programs possible.\n\n<b>How This Section Is Organized</b>\n• <b>if</b> — run a block of code only if a condition is true\n• <b>if-else</b> — run one block if a condition is true, a different block if it's false\n• <b>switch</b> — choose between many possible blocks based on the value of a single variable\n• <b>for loop</b> — repeat a block a set number of times, with a counter\n• <b>while</b> — repeat a block as long as a condition stays true, checked before each run\n• <b>do-while</b> — repeat a block as long as a condition stays true, checked after each run (so it always runs at least once)\n  ↳ Each is covered in its own card next, with syntax and a worked code example.",
    note:
      "Split control flow into two families: branching (if, if-else, switch) picks ONE path to run; looping (for, while, do-while) repeats the SAME path multiple times.",
    tags: ["Control Flow", "C Programming", "if", "switch", "Loops"],
  },
  {
    id: 70,
    slug: "if-statement",
    section: "Programming",
    parentSlug: "control-flow",
    title: "if",
    tagline: "Run a block of code only if a condition is true",
    description:
      "<b>What if Does</b>\nAn if statement runs the block of code inside its curly braces only when its condition evaluates to true (any non-zero value); if the condition is false (0), the block is skipped entirely and execution continues after it.\n\n<b>Why Use if</b>\nA program often needs to behave differently depending on some condition — if is the most basic tool for making that decision, running code only when it's actually needed.\n\n<b>How to Use It</b>\nif (condition) {\n    // runs only if condition is true\n}",
    note:
      "A condition doesn't have to be a comparison — any expression that evaluates to non-zero counts as true in C, and 0 counts as false. This is why if (x) is valid and means \"if x is non-zero.\"",
    code: "int age = 20;\n\nif (age >= 18) {\n    printf(\"You can vote.\\n\");\n}",
    codeLanguage: "C",
    tags: ["if Statement", "Control Flow", "Conditional", "C Programming"],
  },
  {
    id: 71,
    slug: "if-else-statement",
    section: "Programming",
    parentSlug: "control-flow",
    title: "if-else",
    tagline: "Run one block if a condition is true, a different block if it's false",
    description:
      "<b>What if-else Does</b>\nAn if-else statement runs one block of code if its condition is true, and a completely different block if the condition is false — exactly one of the two blocks always runs.\n\n<b>Why Use if-else</b>\nMany decisions naturally have two or more alternatives, not just one condition to check — if-else guarantees exactly one path runs, covering both the case that's true and the case that isn't.\n\n<b>How to Use It — Chaining Multiple Conditions With else if</b>\nMultiple conditions can be chained using else if, checked in order from top to bottom; the first one that's true has its block run, and every later condition is skipped.\n\n<b>Syntax</b>\nif (condition1) {\n    // runs if condition1 is true\n} else if (condition2) {\n    // runs if condition1 is false AND condition2 is true\n} else {\n    // runs if every condition above is false\n}",
    note:
      "Only ONE block in an if / else if / else chain ever runs, even if more than one condition would technically be true — C stops checking as soon as it finds the first true condition.",
    code: "int marks = 75;\n\nif (marks >= 90) {\n    printf(\"Grade A\\n\");\n} else if (marks >= 60) {\n    printf(\"Grade B\\n\");\n} else {\n    printf(\"Grade C\\n\");\n}\n// Output: Grade B",
    codeLanguage: "C",
    tags: ["if-else Statement", "else if", "Control Flow", "C Programming"],
  },
  {
    id: 72,
    slug: "switch-statement",
    section: "Programming",
    parentSlug: "control-flow",
    title: "switch",
    tagline: "Choose between many possible blocks based on the value of a single variable",
    description:
      "<b>What switch Does</b>\nA switch statement compares one variable's value against a list of possible case values, and runs the block matching whichever case equals that value — a cleaner alternative to a long chain of else if statements, when checking one variable against many exact values.\n\n<b>Why Use switch</b>\nChecking one variable against many possible exact values with a long chain of else if statements gets repetitive and harder to read — switch expresses \"pick the matching case\" far more directly.\n\n<b>How to Use It — the Role of break</b>\nWithout a break statement at the end of each case, execution \"falls through\" into the next case's code as well, continuing to run every case below it until a break is hit or the switch ends. This fall-through is legal C, but almost always unintentional if left in by accident.\n\n<b>The default Case</b>\ndefault is optional, and runs if none of the listed case values match — similar to the final else in an if-else chain.\n\n<b>Syntax</b>\nswitch (value) {\n    case 1:\n        // runs if value == 1\n        break;\n    case 2:\n        // runs if value == 2\n        break;\n    default:\n        // runs if no case matched\n}",
    note:
      "Forgetting break is one of the most common switch bugs in C — execution silently falls through into the next case's code instead of stopping, unless break (or the switch's final case) is reached.",
    code: "int day = 3;\n\nswitch (day) {\n    case 1:\n        printf(\"Monday\\n\");\n        break;\n    case 2:\n        printf(\"Tuesday\\n\");\n        break;\n    case 3:\n        printf(\"Wednesday\\n\");\n        break;\n    default:\n        printf(\"Another day\\n\");\n}\n// Output: Wednesday",
    codeLanguage: "C",
    tags: ["switch Statement", "break", "default", "Control Flow", "C Programming"],
  },
  {
    id: 73,
    slug: "for-loop",
    section: "Programming",
    parentSlug: "control-flow",
    title: "for Loop",
    tagline: "Repeat a block a set number of times, with a counter",
    description:
      "<b>What a for Loop Does</b>\nA for loop repeats a block of code, automatically managing a counter variable across three parts written in one line: an initialization (run once, before the loop starts), a condition (checked before every repeat), and an update (run after every repeat).\n\n<b>Why Use a for Loop</b>\nWhenever the number of repeats is known ahead of time — like looping through every element of an array — a for loop keeps the counter's setup, condition, and update all together in one place, instead of scattered across the code.\n\n<b>How It Works</b>\nfor (initialization; condition; update) {\n    // repeats while condition is true\n}\n\nStep by step:\n1. The initialization runs once, at the very start.\n2. The condition is checked — if false, the loop ends immediately without running its block.\n3. If the condition is true, the block runs.\n4. The update runs.\n5. Back to step 2, and repeat.",
    note:
      "All three parts of a for loop's header — initialization, condition, update — are optional and can be left blank, but the two semicolons separating them are always required, even when a part is empty.",
    code: "for (int i = 1; i <= 5; i++) {\n    printf(\"%d \", i);\n}\n// Output: 1 2 3 4 5",
    codeLanguage: "C",
    tags: ["for Loop", "Loops", "Control Flow", "C Programming"],
  },
  {
    id: 74,
    slug: "while-loop",
    section: "Programming",
    parentSlug: "control-flow",
    title: "while",
    tagline: "Repeat a block as long as a condition stays true, checked before each run",
    description:
      "<b>What a while Loop Does</b>\nA while loop repeats its block of code for as long as its condition stays true, checking that condition BEFORE every single run — including the very first one. If the condition is false from the start, the block never runs at all.\n\n<b>Why Use a while Loop</b>\nWhen the number of repeats isn't known ahead of time, and instead depends on a condition that changes while the loop runs — like reading input until a specific value is entered — a while loop fits naturally, without needing a counter at all.\n\n<b>How to Use It</b>\nwhile (condition) {\n    // repeats while condition is true\n}",
    note:
      "The key difference from a for loop: while doesn't have a built-in counter or update step — the programmer is fully responsible for updating whatever the condition depends on, or the loop never ends (an infinite loop).",
    code: "int count = 1;\n\nwhile (count <= 5) {\n    printf(\"%d \", count);\n    count++;\n}\n// Output: 1 2 3 4 5",
    codeLanguage: "C",
    tags: ["while Loop", "Loops", "Control Flow", "C Programming"],
  },
  {
    id: 75,
    slug: "do-while-loop",
    section: "Programming",
    parentSlug: "control-flow",
    title: "do-while",
    tagline: "Repeat a block as long as a condition stays true, checked after each run",
    description:
      "<b>What a do-while Loop Does</b>\nA do-while loop is just like a while loop, except its condition is checked AFTER each run of the block, instead of before. This guarantees the block always runs at least once, even if the condition is false from the very start.\n\n<b>Why Use do-while</b>\nSome tasks genuinely need to happen at least once before it even makes sense to check whether to repeat — like showing a menu to the user before asking whether to show it again — and do-while is the only loop that guarantees this.\n\n<b>How to Use It</b>\ndo {\n    // runs at least once\n} while (condition);\n\nUnlike if, for, and while, a do-while statement ends with a semicolon after its closing while (condition) — a detail that's easy to forget.",
    note:
      "The single fact that separates do-while from while: do-while ALWAYS runs its block at least once, since the condition is checked only after the first run. A plain while loop can run zero times if its condition is false immediately.",
    code: "int num;\n\ndo {\n    printf(\"Enter a positive number: \");\n    scanf(\"%d\", &num);\n} while (num <= 0);\n// The prompt shows at least once, even before num is checked",
    codeLanguage: "C",
    tags: ["do-while Loop", "Loops", "Control Flow", "C Programming"],
  },
  {
    id: 76,
    slug: "functions",
    section: "Programming",
    parentSlug: "c-programming",
    title: "Functions",
    tagline: "Named, reusable blocks of code that take input and can send back a result",
    description:
      "<b>What a Function Is</b>\nA function is a named, self-contained block of code that performs a specific task, which can be called (run) from anywhere in a program, as many times as needed, instead of rewriting the same logic repeatedly.\n\n<b>Why Functions Matter</b>\nWithout functions, any logic used more than once would need to be copy-pasted everywhere it's needed. Functions let that logic be written once, and reused as many times as needed, from anywhere in the program.\n\n<b>How This Section Is Organized</b>\n• <b>Function Declaration</b> — how a function's name, parameters, and return type are defined\n• <b>Parameters</b> — the values passed into a function when it's called\n• <b>Return Values</b> — the single value a function can send back to whoever called it\n• <b>Recursion</b> — a function that calls itself, used to solve problems that break down into smaller versions of themselves\n  ↳ Each is covered in its own card next, with a worked code example.",
    note:
      "Functions exist to avoid repeating the same code — every C program you've already seen relies on this, since main() itself is just a function, and printf() is a function from the C standard library.",
    tags: ["Functions", "C Programming", "Parameters", "Return Values", "Recursion"],
  },
  {
    id: 77,
    slug: "function-declaration",
    section: "Programming",
    parentSlug: "functions",
    title: "Function Declaration",
    tagline: "How a function's name, parameters, and return type are defined",
    description:
      "<b>What a Function Declaration Is</b>\nA function declaration defines a function's name, its return type, and the parameters it accepts — the \"shape\" the compiler needs to know before that function can be called.\n\n<b>Why It Matters</b>\nThe compiler needs to know a function's shape before it can correctly check any call to that function — a declaration is what provides that shape, and lets the compiler catch mistakes like passing the wrong number of arguments.\n\n<b>How to Declare and Define a Function — the Three Parts</b>\nreturnType functionName(parameterList) {\n    // function body\n}\n• <b>Return type</b> — the data type of the value the function sends back (or void, if it sends nothing back)\n• <b>Function name</b> — how the function is referred to when it's called\n• <b>Parameter list</b> — the values the function accepts as input, each with its own data type (covered in full in the \"Parameters\" card)\n\n<b>Function Prototype vs. Function Definition</b>\n• <b>Prototype</b> — a declaration without a body (e.g. int add(int a, int b);), telling the compiler a function exists and what it looks like, before its actual code appears later in the file.\n• <b>Definition</b> — the full function, including its body — the actual code that runs when it's called.\n  ↳ A prototype lets a function be called from code written above where the function is actually defined, since the compiler already knows its signature.\n\n<b>Calling a Function</b>\nOnce declared, a function is called (run) by writing its name followed by parentheses containing any arguments it needs.",
    note:
      "A function prototype is essentially a promise to the compiler: \"this function exists, here's its shape\" — the actual code can come later in the file, as long as the prototype comes first.",
    code: "// Function prototype\nint add(int a, int b);\n\nint main() {\n    int result = add(3, 4);   // calling the function\n    printf(\"%d\\n\", result);   // 7\n    return 0;\n}\n\n// Function definition\nint add(int a, int b) {\n    return a + b;\n}",
    codeLanguage: "C",
    tags: ["Function Declaration", "Function Prototype", "Functions", "C Programming"],
  },
  {
    id: 78,
    slug: "parameters",
    section: "Programming",
    parentSlug: "functions",
    title: "Parameters",
    tagline: "The values passed into a function when it's called",
    description:
      "<b>What Parameters Are</b>\nParameters are the values a function accepts as input, named inside the function's own definition, filled in with real arguments each time the function is called.\n\n<b>Why Parameters Matter</b>\nWithout parameters, a function could only ever work with fixed, hardcoded values. Parameters are what let the exact same function behave differently depending on what it's given each time it's called.\n\n<b>How Parameters Work</b>\n• <b>Parameter</b> — the name used inside a function's own definition to refer to an incoming value (e.g. int a in int add(int a, int b)).\n• <b>Argument</b> — the actual value supplied when the function is called (e.g. the 3 in add(3, 4)).\n  ↳ These terms are often used loosely to mean the same thing, but a parameter is the placeholder, and an argument is what actually fills it.\n\n<b>Pass by Value (C's Default)</b>\nIn C, arguments are passed by value — the function receives a COPY of the argument's value, not the original variable itself. Changing a parameter inside the function has no effect on the original variable back where the function was called from.\n\n<b>Passing by Reference (Using Pointers)</b>\nTo let a function actually modify a caller's variable, C requires passing a pointer to that variable instead of the value itself — the function then follows the pointer back to the original memory location to make its change.",
    note:
      "The default pass-by-value behavior is the single most commonly tested fact about C parameters: a function can never change the caller's original variable unless it's given a pointer to it.",
    code: "void increment(int x) {\n    x = x + 1;   // only changes the local copy\n}\n\nvoid incrementByPointer(int *x) {\n    *x = *x + 1;  // changes the original variable\n}\n\nint main() {\n    int num = 5;\n    increment(num);\n    printf(\"%d\\n\", num);          // still 5\n    incrementByPointer(&num);\n    printf(\"%d\\n\", num);          // now 6\n    return 0;\n}",
    codeLanguage: "C",
    tags: ["Parameters", "Arguments", "Pass by Value", "Pointers", "Functions", "C Programming"],
  },
  {
    id: 79,
    slug: "return-values",
    section: "Programming",
    parentSlug: "functions",
    title: "Return Values",
    tagline: "The single value a function can send back to whoever called it",
    description:
      "<b>What a Return Value Is</b>\nA return value is the single result a function sends back to the code that called it, using the return keyword. Once return runs, the function ends immediately — any code written after it inside that function never runs.\n\n<b>Why Return Values Matter</b>\nA function that only changes things internally, with no way to send a result back, is far less useful than one that can hand its answer directly back to whoever called it — return is what makes a function's result usable by the rest of the program.\n\n<b>How to Use return — the void Return Type</b>\nA function declared with return type void doesn't send back any value at all; it can still use a plain return; (with no value) to end early, but it cannot return a value.\n\n<b>A Function Can Only Return One Value</b>\nUnlike some languages, a C function can only return a single value directly. To send back multiple results, a function typically uses pointers (writing results into variables the caller provides) or bundles multiple values into a single struct.",
    note:
      "Once a function hits its return statement, it exits immediately — no code after return inside that function ever executes, even if it looks reachable in the source.",
    code: "int square(int n) {\n    return n * n;   // function ends here, sending n*n back\n}\n\nint main() {\n    int result = square(5);\n    printf(\"%d\\n\", result);  // 25\n    return 0;\n}",
    codeLanguage: "C",
    tags: ["Return Values", "return", "void", "Functions", "C Programming"],
  },
  {
    id: 80,
    slug: "recursion",
    section: "Programming",
    parentSlug: "functions",
    title: "Recursion",
    tagline: "A function that calls itself, used to solve problems that break down into smaller versions of themselves",
    description:
      "<b>What Recursion Is</b>\nRecursion is when a function calls itself, either directly or indirectly, to solve a problem by breaking it down into a smaller version of the exact same problem — repeating this until the problem becomes small enough to answer directly.\n\n<b>Why Use Recursion</b>\nSome problems are naturally defined in terms of smaller versions of themselves — a factorial, a tree traversal, a folder full of subfolders — and recursion lets the code mirror that natural, self-similar structure directly, often more clearly than an equivalent loop.\n\n<b>How It Works — the Two Required Parts</b>\n• <b>Base case</b> — the simplest version of the problem, answered directly without any further recursive call; this is what eventually stops the recursion.\n• <b>Recursive case</b> — the function calls itself again, with input that's one step closer to the base case.\n  ↳ Without a base case (or if it's never actually reached), a recursive function calls itself forever, eventually crashing with a stack overflow once it runs out of memory for all the pending calls.\n\n<b>Worked Example — Factorial</b>\nfactorial(4) = 4 × factorial(3)\n             = 4 × (3 × factorial(2))\n             = 4 × (3 × (2 × factorial(1)))\n             = 4 × (3 × (2 × 1))          [factorial(1) is the base case]\n             = 24\n\n<b>Recursion vs. a Loop</b>\nAnything recursion can do, a loop can also do (and vice versa) — recursion is often more elegant and easier to read for problems that are naturally defined in terms of smaller versions of themselves (like factorials, or traversing a tree), but a loop typically uses less memory, since it doesn't build up a stack of pending function calls.",
    note:
      "Every recursive function needs a base case that's actually reachable — forgetting it, or writing a recursive case that never gets closer to it, causes infinite recursion and a stack overflow crash.",
    code: "int factorial(int n) {\n    if (n == 0) {\n        return 1;          // base case\n    }\n    return n * factorial(n - 1);  // recursive case\n}\n\nint main() {\n    printf(\"%d\\n\", factorial(4));  // 24\n    return 0;\n}",
    codeLanguage: "C",
    tags: ["Recursion", "Base Case", "Recursive Case", "Factorial", "Functions", "C Programming"],
  },
  {
    id: 81,
    slug: "arrays",
    section: "Programming",
    parentSlug: "c-programming",
    title: "Arrays",
    tagline: "A single variable that holds multiple values of the same type, in a fixed-size, ordered block of memory",
    description:
      "<b>What Arrays Are</b>\nAn array is a collection of values, all of the same data type, stored together in memory under a single variable name, and accessed using an index number instead of a separate variable name for each value.\n\n<b>Why Arrays Matter</b>\nWithout arrays, a program needing to store 100 exam scores would need 100 separate variable names, handled individually, with no way to write a loop that processes them. Arrays let a program hold, loop through, and process any number of related values using one variable and a changing index.\n\n<b>How This Section Is Organized</b>\n• <b>One-Dimensional Array</b> — a simple, single list of values, such as a list of exam scores\n• <b>Two-Dimensional Array</b> — a grid of values arranged in rows and columns, such as a table or a matrix\n  ↳ Both are covered in their own cards next, with declaration syntax and worked examples.",
    note:
      "An array's size is fixed once it's declared — C does not let an array grow or shrink afterward. Needing a resizable collection is exactly the kind of problem the \"Memory Management\" cards (malloc, realloc) later in this section are built to solve.",
    tags: ["Arrays", "C Programming", "One-Dimensional Array", "Two-Dimensional Array"],
  },
  {
    id: 82,
    slug: "one-dimensional-array",
    section: "Programming",
    parentSlug: "arrays",
    title: "One-Dimensional Array",
    tagline: "A simple, single list of values, accessed by index",
    description:
      "<b>What a One-Dimensional Array Is</b>\nA one-dimensional array is a simple, single list of values of the same type, each accessed by one index number, starting from 0.\n\n<b>Why Use One</b>\nStoring 5 exam scores in 5 separate variables (score1, score2, ...) makes it impossible to write a loop that processes them, or to write code that works the same way no matter how many scores there are. A one-dimensional array solves both problems at once.\n\n<b>How to Declare and Use One</b>\nint scores[5];                          // declares an array of 5 ints, values unset\nint scores[5] = {90, 85, 77, 92, 88};   // declares and initializes in one line\n\nEvery element is accessed using an index in square brackets, starting from 0, not 1 — scores[0] is 90 (the first element), and scores[4] is 88 (the fifth and last element); there is no scores[5] in a 5-element array. A for loop is the natural way to visit every element in order, using the loop's counter as the index.\n\n<b>Array Size in Memory</b>\nAn array's total size in memory is simply (number of elements) × (size of one element) — a 5-element int array, where int is typically 4 bytes, uses 20 contiguous bytes total.",
    note:
      "The single most common array bug: accessing an index one past the end (like scores[5] in a 5-element array). C does not stop this at compile time or runtime — it silently reads whatever memory happens to sit just past the array, which is undefined behavior.",
    code: "int scores[5] = {90, 85, 77, 92, 88};\n\nfor (int i = 0; i < 5; i++) {\n    printf(\"%d \", scores[i]);\n}\n// Output: 90 85 77 92 88",
    codeLanguage: "C",
    tags: ["One-Dimensional Array", "Arrays", "Indexing", "C Programming"],
  },
  {
    id: 83,
    slug: "two-dimensional-array",
    section: "Programming",
    parentSlug: "arrays",
    title: "Two-Dimensional Array",
    tagline: "A grid of values arranged in rows and columns",
    description:
      "<b>What a Two-Dimensional Array Is</b>\nA two-dimensional array is a grid of values of the same type, arranged in rows and columns, each element accessed with two index numbers instead of one.\n\n<b>Why Use One</b>\nMany real-world things are naturally grid-shaped — a spreadsheet, a chessboard, a mathematical matrix, a photo's pixels. A two-dimensional array lets a program represent and process that grid directly, using the same row/column shape the data naturally has.\n\n<b>How to Declare and Use One</b>\nint grid[2][3];                              // 2 rows, 3 columns, values unset\nint grid[2][3] = {{1, 2, 3}, {4, 5, 6}};     // declares and initializes in one line\n\nEach element is accessed with two indexes: grid[row][column], both starting from 0 — grid[0][0] is 1 (first row, first column), and grid[1][2] is 6 (second row, third column). A 2D array is normally visited with two nested for loops — the outer loop walks through each row, and the inner loop walks through each column within that row.\n\n<b>How It's Actually Stored</b>\nEven though it looks like a grid, a 2D array is really still stored as one single, contiguous block of memory, laid out row by row (row-major order) — grid[0][0], grid[0][1], grid[0][2], then grid[1][0], and so on.",
    note:
      "A 2D array's memory layout is row-major: every element of row 0 comes before any element of row 1. This is why looping with the row index as the OUTER loop and column index as the INNER loop matches memory order, and is usually the more cache-friendly way to visit every element.",
    code: "int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};\n\nfor (int row = 0; row < 2; row++) {\n    for (int col = 0; col < 3; col++) {\n        printf(\"%d \", grid[row][col]);\n    }\n}\n// Output: 1 2 3 4 5 6",
    codeLanguage: "C",
    tags: ["Two-Dimensional Array", "Arrays", "Matrix", "Row-Major Order", "C Programming"],
  },
  {
    id: 84,
    slug: "strings",
    section: "Programming",
    parentSlug: "c-programming",
    title: "Strings",
    tagline: "Text in C, stored as a character array ending in a special null terminator",
    description:
      "<b>What a String Is in C</b>\nUnlike some languages, C has no dedicated \"string\" data type. A string in C is simply an array of char values, ending with a special null character ('\\0') that marks where the text stops.\n\n<b>Why Strings Need Their Own Section</b>\nBecause C strings are really just character arrays with one extra rule (the null terminator), they behave differently from other arrays in several ways that trip up beginners — sizing them correctly, and using a dedicated set of library functions instead of ordinary array operations.\n\n<b>How This Section Is Organized</b>\n• <b>Character Arrays</b> — how a string is actually declared and stored, including the null terminator\n• <b>String Functions</b> — the standard library functions (strlen, strcpy, strcat, strcmp) used to work with strings\n  ↳ Both are covered in their own cards next.",
    note:
      "Every C string ends with a hidden '\\0' character that never gets printed — it's what tells a function like printf where the text actually stops, since a char array has no separate \"length\" stored anywhere else.",
    tags: ["Strings", "C Programming", "Character Arrays", "String Functions", "Null Terminator"],
  },
  {
    id: 85,
    slug: "character-arrays",
    section: "Programming",
    parentSlug: "strings",
    title: "Character Arrays",
    tagline: "How a string is actually declared and stored, including the null terminator",
    description:
      "<b>What a Character Array Is</b>\nA character array is a fixed-size block of char values — a string in C is stored exactly this way, with one extra rule: the text must end with a special null character ('\\0') marking where it stops.\n\n<b>Why the Null Terminator Matters</b>\nA char array with no '\\0' isn't treated as a valid string by string functions or printf's %s — they keep reading memory past the array's actual data until they happen to hit a 0 byte somewhere, which is undefined behavior and a common source of crashes or garbage output. The '\\0' is what tells these functions exactly where the real text ends.\n\n<b>How to Declare a String</b>\nchar name[6] = \"Hello\";           // shorthand — the compiler adds '\\0' automatically\nchar name[6] = {'H','e','l','l','o','\\0'};  // the exact same thing, written out manually\n\nThe word \"Hello\" is 5 characters long, but the array is declared with size 6 — the extra slot holds the null terminator. Reading a string with scanf doesn't need the address operator, since an array's name already acts like a pointer to it: scanf(\"%s\", name);",
    note:
      "A string of N visible characters always needs an array of at least N+1 — the +1 is for the invisible '\\0' terminator, which is easy to forget when sizing a char array.",
    code: "char greeting[6] = \"Hello\";\nprintf(\"%s\\n\", greeting);   // Hello\nprintf(\"%d\\n\", greeting[5]); // 0  ('\\0' printed as its numeric value)",
    codeLanguage: "C",
    tags: ["Character Arrays", "Strings", "Null Terminator", "C Programming"],
  },
  {
    id: 86,
    slug: "string-functions",
    section: "Programming",
    parentSlug: "strings",
    title: "String Functions",
    tagline: "The standard library functions used to measure, copy, join, and compare strings",
    description:
      "<b>What String Functions Are</b>\nString functions are ready-made functions, provided by C's standard library, for measuring, copying, joining, and comparing strings — declared in the string.h header, which must be included with #include <string.h> before any of them can be used.\n\n<b>Why Use Library Functions Instead of Writing Your Own</b>\nManually looping through a char array to find its length, or to compare it to another string, is repetitive and easy to get subtly wrong (especially around the null terminator). The standard library's string functions have already solved these problems correctly, and are the version every other C programmer will recognize immediately.\n\n<b>How to Use the Core String Functions</b>\n• <b>strlen(s)</b> — returns the length of string s, NOT counting the null terminator\n• <b>strcpy(dest, src)</b> — copies the string src into dest, overwriting whatever was there\n• <b>strcat(dest, src)</b> — appends (joins) the string src onto the end of dest\n• <b>strcmp(s1, s2)</b> — compares two strings, returning 0 if they're exactly equal, a negative number if s1 comes before s2 alphabetically, or a positive number if it comes after\n\n<b>strcmp Doesn't Return true/false</b>\nA common mistake is checking if (strcmp(s1, s2)) expecting it to mean \"equal\" — but strcmp returns 0 (falsy) when the strings ARE equal, the opposite of what many beginners assume. The correct check for equality is if (strcmp(s1, s2) == 0).",
    note:
      "The single most common strcmp mistake: 0 means the strings are equal, not \"false/different.\" Always compare explicitly against 0 rather than treating strcmp's result as a plain true/false.",
    code: "#include <string.h>\n\nchar a[20] = \"Hello\";\nchar b[] = \" World\";\n\nprintf(\"%lu\\n\", strlen(a));      // 5\nstrcat(a, b);\nprintf(\"%s\\n\", a);               // Hello World\nprintf(\"%d\\n\", strcmp(\"cat\", \"cat\"));  // 0 (equal)",
    codeLanguage: "C",
    tags: ["String Functions", "strlen", "strcpy", "strcat", "strcmp", "Strings", "C Programming"],
  },
  {
    id: 87,
    slug: "pointers",
    section: "Programming",
    parentSlug: "c-programming",
    title: "Pointers",
    tagline: "Variables that store a memory address instead of an ordinary value",
    description:
      "<b>What a Pointer Is</b>\nA pointer is a variable whose value is a memory address — instead of holding a number or a character directly, it holds the location in memory where that value actually lives.\n\n<b>Why Pointers Matter in C</b>\nPointers are what let a function modify a caller's variable (covered in the \"Parameters\" card), let a program manage memory dynamically at runtime (covered in \"Memory Management\"), and let code work efficiently with arrays and strings without copying their entire contents around.\n\n<b>How This Section Is Organized</b>\n• <b>Pointer Variables</b> — how to declare and use a pointer\n• <b>Address Operator (&)</b> — getting the memory address of an existing variable\n• <b>Dereference Operator (*)</b> — following a pointer to read or change the value it points to\n• <b>Pointer Arithmetic</b> — moving a pointer forward or backward through memory, especially through an array\n  ↳ Each is covered in its own card next, in an order that builds on the one before it.",
    note:
      "Pointers are widely considered the single hardest concept for C beginners — but every one of these four cards builds on the last, so working through them in order (variables → address → dereference → arithmetic) makes each step much smaller.",
    tags: ["Pointers", "C Programming", "Address Operator", "Dereference Operator", "Pointer Arithmetic"],
  },
  {
    id: 88,
    slug: "pointer-variables",
    section: "Programming",
    parentSlug: "pointers",
    title: "Pointer Variables",
    tagline: "How to declare a variable that holds a memory address",
    description:
      "<b>What a Pointer Variable Is</b>\nA pointer variable is a variable declared to hold a memory address rather than an ordinary value — its own stored value is simply a number (typically 8 bytes on a modern 64-bit system), regardless of whether it points to an int, a char, or a whole struct.\n\n<b>Why Pointers Exist</b>\nSome tasks are impossible without a way to refer to a variable's location rather than its value — letting a function change a caller's variable, or letting code work with a large block of data without copying it, both require a pointer.\n\n<b>How to Declare and Initialize One</b>\nint *p;      // p is a pointer that will hold the address of an int\nchar *c;     // c is a pointer that will hold the address of a char\n\nThe asterisk (*) in a declaration marks the variable as a pointer, and the type before it tells the compiler what type of value the pointer will point to. A pointer that isn't pointing at any valid memory should be explicitly set to NULL (int *p = NULL;), and checked before use (if (p != NULL)).",
    note:
      "An uninitialized pointer holds garbage — some leftover, meaningless address — not automatically NULL. Always initialize a pointer, either to a real address or explicitly to NULL, before using it.",
    code: "int age = 25;\nint *p;      // declare a pointer to an int\np = &age;    // p now holds age's memory address\n\nprintf(\"%d\\n\", *p);  // 25 (the value p points to)",
    codeLanguage: "C",
    tags: ["Pointer Variables", "Pointers", "NULL", "C Programming"],
  },
  {
    id: 89,
    slug: "address-operator",
    section: "Programming",
    parentSlug: "pointers",
    title: "Address Operator (&)",
    tagline: "Gets the memory address of an existing variable",
    description:
      "<b>What the Address Operator Is</b>\nThe address operator (&), placed directly before a variable's name, returns that variable's memory address instead of its value — &age doesn't mean \"the value of age,\" it means \"where age lives in memory.\"\n\n<b>Why It's Needed</b>\nA pointer variable needs a real address to point at before it's useful — the address operator is how that address is actually obtained from an existing variable in the first place.\n\n<b>How to Use It</b>\nint age = 25;\nint *p = &age;   // p now holds the address of age\n\nscanf also needs the address of a variable to write into, not its current value, which is exactly why scanf(\"%d\", &age) uses & — without it, scanf would have no way to reach back and actually change age.",
    note:
      "& answers \"where does this live?\", while * (covered next) answers \"what's actually stored there?\" — they're opposite operations, and mixing them up is one of the most common pointer mistakes.",
    code: "int age = 25;\nprintf(\"%p\\n\", &age);  // prints age's memory address, e.g. 0x7ffee3a2b91c",
    codeLanguage: "C",
    tags: ["Address Operator", "Pointers", "&", "C Programming"],
  },
  {
    id: 90,
    slug: "dereference-operator",
    section: "Programming",
    parentSlug: "pointers",
    title: "Dereference Operator (*)",
    tagline: "Follows a pointer to read or change the value it points to",
    description:
      "<b>What the Dereference Operator Is</b>\nOnce a variable is already declared as a pointer, using * before it in an expression means \"go to the address this pointer holds, and give me the value actually stored there\" — this is called dereferencing.\n\n<b>Why It's Needed</b>\nA pointer on its own only holds an address — dereferencing is the operation that actually reaches that address and reads (or changes) the real value sitting there, which is the entire point of having a pointer in the first place.\n\n<b>How to Use It</b>\nint age = 25;\nint *p = &age;\nprintf(\"%d\\n\", *p);   // 25 — follows p to age, and reads its value\n\n*p = 30;              // follows p to age, and changes its value to 30\nprintf(\"%d\\n\", age);  // 30 — age itself has genuinely changed\n\n<b>The Same Symbol, Two Different Meanings</b>\n* means two different things depending on context: in a declaration (int *p), it marks p as a pointer; in an expression (*p), it dereferences an existing pointer to reach the value it points to.",
    note:
      "*p = 30; doesn't change p itself — p still holds the same address. It changes whatever p is POINTING AT. This is the exact mechanism that lets a function modify a caller's variable through a pointer parameter.",
    code: "int age = 25;\nint *p = &age;\n\n*p = 30;              // changes age, through p\nprintf(\"%d\\n\", age);  // 30",
    codeLanguage: "C",
    tags: ["Dereference Operator", "Pointers", "*", "C Programming"],
  },
  {
    id: 91,
    slug: "pointer-arithmetic",
    section: "Programming",
    parentSlug: "pointers",
    title: "Pointer Arithmetic",
    tagline: "Moving a pointer forward or backward through memory, especially through an array",
    description:
      "<b>What Pointer Arithmetic Is</b>\nPointer arithmetic is adding or subtracting a number from a pointer to move it forward or backward through memory — measured in units of whatever type it points to, not in raw bytes.\n\n<b>Why It's Useful</b>\nPointer arithmetic is what lets code walk through an array one element at a time using a pointer instead of index brackets, and is the reason a function can process an array of any length just by being given a starting pointer and a count.\n\n<b>How It Works</b>\nint arr[3] = {10, 20, 30};\nint *p = arr;        // p points to arr[0]\nprintf(\"%d\\n\", *p);     // 10\nprintf(\"%d\\n\", *(p+1)); // 20 — moved forward by 1 int's worth of bytes (usually 4)\nprintf(\"%d\\n\", *(p+2)); // 30\n\nAn array's name, used on its own, decays into a pointer to its first element — this is exactly why arr[i] and *(arr + i) mean the same thing in C.",
    note:
      "arr[i] is really just shorthand for *(arr + i) — this identity is exactly why array indexing and pointer arithmetic are two ways of writing the same underlying operation in C.",
    code: "int arr[3] = {10, 20, 30};\nint *p = arr;\n\nfor (int i = 0; i < 3; i++) {\n    printf(\"%d \", *(p + i));\n}\n// Output: 10 20 30",
    codeLanguage: "C",
    tags: ["Pointer Arithmetic", "Pointers", "Arrays", "C Programming"],
  },
  {
    id: 92,
    slug: "structures",
    section: "Programming",
    parentSlug: "c-programming",
    title: "Structures",
    tagline: "Ways to group different pieces of data together under one name",
    description:
      "<b>What This Group Covers</b>\nArrays only hold multiple values of the SAME type. Structures, unions, and enums are three different ways C lets a program group related pieces of data — often of DIFFERENT types — together as one meaningful unit.\n\n<b>Why These Matter</b>\nReal-world data is rarely just one number or one string — a student has a name AND an age AND a GPA, all at once. Without a way to group these together, a program would need to manage several separately-named variables per \"thing\" it represents, with no way to pass \"one student\" around as a single value.\n\n<b>How This Section Is Organized</b>\n• <b>Structure</b> — groups several different variables together under one name, each keeping its own separate storage\n• <b>Union</b> — groups several different variables together under one name, but all of them share the SAME storage\n• <b>Enum</b> — gives a set of named integer constants readable names, instead of using plain, unlabeled numbers\n  ↳ Each is covered in its own card next.",
    note:
      "The one distinction to keep straight: a struct's members each get their OWN memory; a union's members all SHARE the same memory (only one is valid at a time). Enum isn't a data-grouping tool at all — it's just readable names for integer constants.",
    tags: ["Structures", "Structure", "Union", "Enum", "C Programming"],
  },
  {
    id: 93,
    slug: "structure",
    section: "Programming",
    parentSlug: "structures",
    title: "Structure",
    tagline: "Groups several different variables together under one name, each with its own storage",
    description:
      "<b>What a Structure Is</b>\nA structure (struct) groups several variables, possibly of different types, together under one name, so they can be treated as a single unit — for example, a Student structure might hold a name, an age, and a grade all in one place.\n\n<b>Why Use One</b>\nWithout a struct, representing \"one student\" would mean juggling separate name, age, and gpa variables (or separate arrays) with no guarantee they stay matched together correctly. A struct bundles them into one real, passable, storable unit.\n\n<b>How to Declare and Use One</b>\nstruct Student {\n    char name[20];\n    int age;\n    float gpa;\n};\n\nstruct Student s1 = {\"Rita\", 20, 3.8};\nprintf(\"%s is %d\\n\", s1.name, s1.age);\n\nAn individual field (called a member) is accessed using the dot (.) operator. If accessing a member through a pointer to a struct, the arrow (->) operator is used instead (ptr->name), which is shorthand for (*ptr).name. Every member of a struct gets its own separate storage, so a Student struct's total size is roughly the sum of all its members' sizes.",
    note:
      "Use . when you have the struct variable itself, and -> when you have a POINTER to a struct — ptr->name is just shorthand for (*ptr).name, following the pointer first, then accessing the member.",
    code: "struct Student {\n    char name[20];\n    int age;\n    float gpa;\n};\n\nint main() {\n    struct Student s1 = {\"Rita\", 20, 3.8};\n    printf(\"%s is %d, GPA %.1f\\n\", s1.name, s1.age, s1.gpa);\n    return 0;\n}",
    codeLanguage: "C",
    tags: ["Structure", "struct", "Structures", "C Programming"],
  },
  {
    id: 94,
    slug: "union",
    section: "Programming",
    parentSlug: "structures",
    title: "Union",
    tagline: "Groups several different variables together, but all of them share the same storage",
    description:
      "<b>What a Union Is</b>\nA union looks almost identical to a struct in how it's declared, but behaves very differently in memory: every member of a union shares the exact same block of memory, so only ONE member holds a valid, meaningful value at any given time.\n\n<b>Why Use One</b>\nWhen a variable only ever needs to hold ONE of several possible types at a time — never more than one simultaneously — a union uses far less memory than a struct with the same members would, since it doesn't need separate space for each one.\n\n<b>How to Declare and Use One</b>\nunion Value {\n    int i;\n    float f;\n    char c;\n};\n\nunion Value v;\nv.i = 65;\nprintf(\"%d\\n\", v.i);   // 65 — valid, i was just set\nv.f = 3.14;\nprintf(\"%d\\n\", v.i);   // garbage — writing to f overwrote i's memory\n\nA union's total size is only as large as its LARGEST single member, since every member overlaps the same memory — unlike a struct, whose size is roughly the sum of every member's size.",
    note:
      "The size test is the fastest way to tell struct and union apart on an exam: a struct's size is roughly the SUM of its members' sizes; a union's size is only as big as its LARGEST member, since they all share one space.",
    code: "union Value {\n    int i;\n    float f;\n};\n\nint main() {\n    union Value v;\n    v.i = 65;\n    printf(\"%d\\n\", v.i);   // 65\n    v.f = 3.14;             // overwrites the same memory i used\n    printf(\"%d\\n\", v.i);   // no longer 65 — garbage\n    return 0;\n}",
    codeLanguage: "C",
    tags: ["Union", "Structures", "Memory Sharing", "C Programming"],
  },
  {
    id: 95,
    slug: "enum",
    section: "Programming",
    parentSlug: "structures",
    title: "Enum",
    tagline: "Gives a set of named integer constants readable names",
    description:
      "<b>What an Enum Is</b>\nAn enum (short for \"enumeration\") defines a set of named integer constants, making code far more readable than using plain, unlabeled numbers to represent a fixed set of options.\n\n<b>Why Use One</b>\nWriting if (today == WEDNESDAY) is far more readable, and far less error-prone, than writing if (today == 2) — the enum name documents its own meaning directly in the code, and the compiler still treats it as a plain integer underneath.\n\n<b>How to Declare and Use One</b>\nenum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };\n\nenum Day today = WEDNESDAY;\nif (today == WEDNESDAY) {\n    printf(\"Midweek!\\n\");\n}\n\nBy default, an enum's first name is assigned 0, and each following name automatically gets the next integer (MONDAY=0, TUESDAY=1, and so on). Specific numbers can also be assigned manually, and any names after a manual value continue counting up from there.",
    note:
      "An enum value is really just a named integer constant — it doesn't create a genuinely new type the way a struct does; it exists purely to make numeric constants readable and self-documenting.",
    code: "enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };\n\nint main() {\n    enum Day today = WEDNESDAY;\n    printf(\"%d\\n\", today);   // 2\n    return 0;\n}",
    codeLanguage: "C",
    tags: ["Enum", "Structures", "Named Constants", "C Programming"],
  },
  {
    id: 96,
    slug: "memory-management",
    section: "Programming",
    parentSlug: "c-programming",
    title: "Memory Management",
    tagline: "Requesting and releasing memory at runtime, instead of only using fixed-size arrays",
    description:
      "<b>What Dynamic Memory Management Is</b>\nDynamic memory management is requesting and releasing memory at runtime, based on a program's actual data, instead of only using fixed-size arrays whose size is locked in at compile time.\n\n<b>Why It's Needed</b>\nAn ordinary array's size is fixed the moment it's declared. Dynamic memory lets a program request exactly the amount of memory it needs while it's actually running — for example, sizing an array based on how many records are actually in a file, discovered only once the program is already running.\n\n<b>How This Section Is Organized</b>\n• <b>malloc()</b> — allocates a block of memory of a given size\n• <b>calloc()</b> — allocates a block of memory and initializes every byte to 0\n• <b>realloc()</b> — resizes a block of memory that was already allocated\n• <b>free()</b> — releases previously allocated memory back to the system\n  ↳ Each is covered in its own card next, with a worked code example.\n\n<b>Where This Memory Lives</b>\nMemory allocated this way comes from a region called the heap, separate from a program's normal local variables (which live on the stack) — heap memory persists until it's explicitly freed, even after the function that allocated it has returned.",
    note:
      "Every successful malloc/calloc/realloc call must eventually be matched with exactly one free() call — forgetting this causes a memory leak, where memory stays reserved for the rest of the program's life even though nothing uses it anymore.",
    tags: ["Memory Management", "malloc", "calloc", "realloc", "free", "Heap", "C Programming"],
  },
  {
    id: 97,
    slug: "malloc",
    section: "Programming",
    parentSlug: "memory-management",
    title: "malloc()",
    tagline: "Allocates a block of memory of a given size, without initializing it",
    description:
      "<b>What malloc() Does</b>\nmalloc(size) requests a block of memory of size bytes from the heap, and returns a pointer to the start of that block — or NULL if the allocation failed.\n\n<b>Why Use It</b>\nmalloc is the most basic way to get memory whose size isn't known until the program is running — for example, allocating exactly enough room for however many records a user says they want to enter.\n\n<b>How to Use It</b>\nint *arr = (int *) malloc(5 * sizeof(int));   // room for 5 ints\nif (arr == NULL) {\n    printf(\"Allocation failed\\n\");\n}\n\nThe sizeof(int) part calculates exactly how many bytes one int actually takes on the current system. Memory from malloc is NOT set to any particular value — it contains whatever leftover data happened to already be there, so reading it before writing to it first gives garbage.",
    note:
      "malloc's memory is uninitialized garbage, not zeroed — if you need memory that starts at 0, use calloc (covered next) instead of malloc.",
    code: "int *arr = (int *) malloc(5 * sizeof(int));\nif (arr == NULL) {\n    printf(\"Allocation failed\\n\");\n    return 1;\n}\n\nfor (int i = 0; i < 5; i++) {\n    arr[i] = i * 10;\n}\nprintf(\"%d\\n\", arr[2]);  // 20\n\nfree(arr);",
    codeLanguage: "C",
    tags: ["malloc", "Memory Management", "Heap", "C Programming"],
  },
  {
    id: 98,
    slug: "calloc",
    section: "Programming",
    parentSlug: "memory-management",
    title: "calloc()",
    tagline: "Allocates a block of memory and initializes every byte to 0",
    description:
      "<b>What calloc() Does</b>\ncalloc(count, size) requests memory for count elements, each size bytes, and — unlike malloc — guarantees every byte of that memory starts out set to 0.\n\n<b>Why Use It Instead of malloc</b>\nWhenever a program needs to be certain memory starts clean (for example, a running total that must begin at 0), calloc removes the risk of accidentally reading malloc's uninitialized garbage before writing a real value.\n\n<b>How to Use It</b>\nint *arr = (int *) calloc(5, sizeof(int));   // 5 ints, all starting at 0\nif (arr == NULL) {\n    return 1;\n}\nprintf(\"%d\\n\", arr[0]);  // 0 — guaranteed by calloc\n\ncalloc takes the element count and element size SEPARATELY (unlike malloc's single total byte count), at a small performance cost for the zeroing step.",
    note:
      "The exam-favourite difference: calloc always zero-initializes its memory; malloc never does. Both otherwise serve the same purpose — requesting a block of heap memory.",
    code: "int *arr = (int *) calloc(5, sizeof(int));\nif (arr == NULL) {\n    return 1;\n}\n\nprintf(\"%d\\n\", arr[0]);  // 0 — guaranteed by calloc\n\nfree(arr);",
    codeLanguage: "C",
    tags: ["calloc", "Memory Management", "Heap", "C Programming"],
  },
  {
    id: 99,
    slug: "realloc",
    section: "Programming",
    parentSlug: "memory-management",
    title: "realloc()",
    tagline: "Resizes a block of memory that was already allocated",
    description:
      "<b>What realloc() Does</b>\nrealloc(ptr, newSize) resizes a previously allocated block of memory (from malloc, calloc, or an earlier realloc) to a new size, and returns a pointer to the resized block — which may or may not be the same address as before.\n\n<b>Why Use It</b>\nWithout realloc, growing a dynamically-sized collection would require manually allocating a whole new block, copying every old value over by hand, and freeing the old block — realloc does all of that in one call.\n\n<b>How to Use It</b>\nint *arr = (int *) malloc(5 * sizeof(int));\n// ...later, need more room...\narr = (int *) realloc(arr, 10 * sizeof(int));\n\nrealloc preserves the existing contents up to the smaller of the old and new sizes. Because realloc may need to move the block to a completely different address, always capture its return value (usually back into the same pointer variable) rather than assuming the address stayed the same.",
    note:
      "Never keep using the OLD pointer after calling realloc — if realloc had to move the block, the old pointer may now point to memory that's been freed or reused elsewhere, leading to undefined behavior.",
    code: "int *arr = (int *) malloc(5 * sizeof(int));\n// ... arr is used, then more space is needed ...\narr = (int *) realloc(arr, 10 * sizeof(int));\nif (arr == NULL) {\n    return 1;\n}\n// arr now has room for 10 ints; the first 5 values are preserved\n\nfree(arr);",
    codeLanguage: "C",
    tags: ["realloc", "Memory Management", "Heap", "C Programming"],
  },
  {
    id: 100,
    slug: "free",
    section: "Programming",
    parentSlug: "memory-management",
    title: "free()",
    tagline: "Releases previously allocated memory back to the system",
    description:
      "<b>What free() Does</b>\nfree(ptr) releases a block of memory that was previously allocated by malloc, calloc, or realloc, returning it to the heap so it can be reused by later allocations.\n\n<b>Why It Matters</b>\nMemory that's never freed stays reserved for the rest of the program's run (a memory leak), which can eventually exhaust all available memory in a long-running program — free is what closes the loop that malloc/calloc/realloc opened.\n\n<b>How to Use It</b>\nint *arr = (int *) malloc(5 * sizeof(int));\nif (arr != NULL) {\n    // ... use arr ...\n    free(arr);\n    arr = NULL;   // avoid accidentally using the freed memory\n}\n\nNever use a pointer again after it's been freed (a \"use-after-free\" bug), and never free the same pointer twice (a \"double free\") — both are undefined behavior.",
    note:
      "Three rules to avoid the most common free() bugs: free every block exactly once, never free the same block twice, and never use a pointer again after it's been freed (set it to NULL if there's any chance it might be reused by mistake).",
    code: "int *arr = (int *) malloc(5 * sizeof(int));\nif (arr != NULL) {\n    // ... use arr ...\n    free(arr);\n    arr = NULL;   // avoid accidentally using the freed memory\n}",
    codeLanguage: "C",
    tags: ["free", "Memory Management", "Memory Leak", "Dangling Pointer", "C Programming"],
  },
  {
    id: 101,
    slug: "file-handling",
    section: "Programming",
    parentSlug: "c-programming",
    title: "File Handling",
    tagline: "Reading from and writing to files on disk, from inside a C program",
    description:
      "<b>What File Handling Is</b>\nFile handling is reading from and writing to files on disk from inside a C program, using a FILE * pointer returned by fopen() to identify exactly which open file every later operation acts on.\n\n<b>Why It's Needed</b>\nEverything a program keeps in ordinary variables disappears the moment the program ends. File handling lets a C program save data permanently to disk, and read it back again later, even after the program has closed and reopened.\n\n<b>How This Section Is Organized</b>\n• <b>fopen()</b> — opens a file, in a chosen mode (read, write, append, etc.)\n• <b>fclose()</b> — closes a file that was previously opened\n• <b>Reading</b> — pulling data out of an already-open file\n• <b>Writing</b> — putting data into an already-open file\n  ↳ Each is covered in its own card next, following the same open → use → close pattern every time.",
    note:
      "The standard pattern for every file operation is the same: open it (fopen), check it actually opened (compare to NULL), do the read/write work, then close it (fclose) — skipping the close step can leave data unsaved or the file locked.",
    tags: ["File Handling", "fopen", "fclose", "Reading", "Writing", "C Programming"],
  },
  {
    id: 102,
    slug: "fopen",
    section: "Programming",
    parentSlug: "file-handling",
    title: "fopen()",
    tagline: "Opens a file, in a chosen mode, and returns a pointer used for every later operation",
    description:
      "<b>What fopen() Does</b>\nfopen(filename, mode) opens the file named filename in the given mode, and returns a FILE * pointer used for every later read/write/close operation on that file — or NULL if the file couldn't be opened.\n\n<b>Why the Mode Matters</b>\nThe mode decides what's actually allowed to happen to the file, and whether its existing contents survive — picking the wrong mode can silently erase data that was meant to be kept.\n\n<b>How to Use It</b>\nFILE *fp = fopen(\"data.txt\", \"w\");\nif (fp == NULL) {\n    printf(\"Could not open file\\n\");\n    return 1;\n}\n\nCommon modes: \"r\" (read; file must already exist), \"w\" (write; creates a new file or erases an existing one), \"a\" (append; adds to the end without erasing), \"r+\" (read and write; file must already exist). A file might fail to open for many reasons, so fopen's return value should always be checked before it's used.",
    note:
      "\"w\" mode silently erases an existing file's contents the moment it's opened — if the goal is to add to a file without losing what's already there, \"a\" (append) is the mode to use instead.",
    code: "FILE *fp = fopen(\"data.txt\", \"w\");\nif (fp == NULL) {\n    printf(\"Could not open file\\n\");\n    return 1;\n}\n// ... use fp to write, then close it (see fclose) ...",
    codeLanguage: "C",
    tags: ["fopen", "File Handling", "FILE pointer", "C Programming"],
  },
  {
    id: 103,
    slug: "fclose",
    section: "Programming",
    parentSlug: "file-handling",
    title: "fclose()",
    tagline: "Closes a file that was previously opened, saving any pending writes",
    description:
      "<b>What fclose() Does</b>\nfclose(fp) closes a previously opened file, flushing (actually writing out) any data that was still sitting in a temporary buffer, and releasing the file so it can be accessed again.\n\n<b>Why It Matters</b>\nWrites to a file often aren't immediately saved to disk — they can sit buffered in memory for efficiency, and only get written out for real when the file is closed. Skipping fclose() risks losing data that looked like it was written, but never actually made it to disk.\n\n<b>How to Use It</b>\nFILE *fp = fopen(\"data.txt\", \"w\");\nif (fp != NULL) {\n    fprintf(fp, \"Hello, file!\\n\");\n    fclose(fp);   // ensures the write is actually saved\n}\n\nEvery file successfully opened with fopen() should eventually be closed with fclose() exactly once, mirroring the malloc/free pairing pattern for memory.",
    note:
      "Forgetting fclose() is the file-handling equivalent of forgetting free() — data can appear to have been written but never actually gets saved to disk if the file is never properly closed.",
    code: "FILE *fp = fopen(\"data.txt\", \"w\");\nif (fp != NULL) {\n    fprintf(fp, \"Hello, file!\\n\");\n    fclose(fp);   // ensures the write is actually saved\n}",
    codeLanguage: "C",
    tags: ["fclose", "File Handling", "C Programming"],
  },
  {
    id: 104,
    slug: "reading",
    section: "Programming",
    parentSlug: "file-handling",
    title: "Reading",
    tagline: "Pulling data out of an already-open file",
    description:
      "<b>What Reading From a File Means</b>\nReading pulls data out of an already-open file, using functions like fscanf, fgets, or fgetc, until there's no more data left (signaled by a special return value such as EOF or NULL).\n\n<b>Why Different Functions Exist</b>\nDifferent situations call for reading different amounts at a time — a single character, a whole line of text, or specifically-formatted values — so C provides a separate function suited to each case rather than one universal reader.\n\n<b>How to Read a File Line by Line</b>\nFILE *fp = fopen(\"data.txt\", \"r\");\nchar line[100];\nwhile (fgets(line, 100, fp) != NULL) {\n    printf(\"%s\", line);\n}\nfclose(fp);\n\nfgets reads one full line into buffer, stopping at a newline or once size-1 characters have been read, and is generally the safer choice since it takes an explicit buffer size and won't read past it.",
    note:
      "fgets is generally the safer choice for reading text a line at a time, since it takes an explicit buffer size and won't read past it — unlike some older functions that can overflow a buffer if a line is longer than expected.",
    code: "FILE *fp = fopen(\"data.txt\", \"r\");\nif (fp == NULL) {\n    return 1;\n}\n\nchar line[100];\nwhile (fgets(line, 100, fp) != NULL) {\n    printf(\"%s\", line);\n}\n\nfclose(fp);",
    codeLanguage: "C",
    tags: ["Reading", "fscanf", "fgets", "File Handling", "C Programming"],
  },
  {
    id: 105,
    slug: "writing",
    section: "Programming",
    parentSlug: "file-handling",
    title: "Writing",
    tagline: "Putting data into an already-open file",
    description:
      "<b>What Writing To a File Means</b>\nWriting puts data into an already-open file, using functions like fprintf, fputs, or fputc, which work the same way as their console-output equivalents (printf, puts, putchar) but target a file instead of the screen.\n\n<b>Why fprintf Is the Most Common Choice</b>\nfprintf supports the exact same format specifiers as printf (%d, %s, %f), so a programmer already comfortable formatting console output can write formatted data to a file with almost no new syntax to learn.\n\n<b>How to Use It</b>\nFILE *fp = fopen(\"data.txt\", \"w\");\nif (fp == NULL) {\n    return 1;\n}\nfprintf(fp, \"Name: %s, Age: %d\\n\", \"Rita\", 20);\nfclose(fp);\n\nWhich mode the file was opened in determines what writing actually does: \"w\" mode erases any existing content first, while \"a\" mode adds new content to the end without erasing what's already there.",
    note:
      "fprintf to a file works exactly like printf to the screen, just redirected to a FILE * instead — anyone comfortable with printf's format specifiers (%d, %s, %f) already knows most of what fprintf needs.",
    code: "FILE *fp = fopen(\"data.txt\", \"w\");\nif (fp == NULL) {\n    return 1;\n}\n\nfprintf(fp, \"Name: %s, Age: %d\\n\", \"Rita\", 20);\nfclose(fp);",
    codeLanguage: "C",
    tags: ["Writing", "fprintf", "fputs", "File Handling", "C Programming"],
  },
  // ─────────────────────────────────────────────
  // OBJECT-ORIENTED PROGRAMMING
  // ─────────────────────────────────────────────
  {
    id: 106,
    slug: "object-oriented-programming",
    section: "Programming",
    title: "Object-Oriented Programming",
    tagline: "A programming style that models a program as a set of interacting objects, each bundling its own data and behavior together",
    description:
      "<b>What OOP Is</b>\nObject-Oriented Programming (OOP) is a programming style built around objects — self-contained units that bundle data (attributes) and the behavior that acts on that data (methods) together, instead of keeping data and the functions that operate on it completely separate, the way plain C does.\n\n<b>Why OOP Is Taught After C</b>\nC has no built-in concept of a class or object — it only has structs (pure data) and separate functions. OOP languages add classes and objects on top of that same basic syntax, letting a program group related data and logic into one reusable unit that models a real-world thing directly. JavaScript added a class keyword in ES6 (2015) — under the hood it's still built on JS's older prototype system, but it's written and read the same way as a class in any other OOP language.\n\n<b>How This Section Is Organized</b>\n• <b>Class</b> — the blueprint that defines what data and behavior every object built from it will have\n• <b>Object</b> — an actual instance created from a class, with its own real values\n• <b>Encapsulation</b> — bundling data and methods together, and hiding internal details from outside code\n• <b>Inheritance</b> — letting one class reuse and extend another class's data and behavior\n• <b>Polymorphism</b> — letting the same method call behave differently depending on which object it's actually called on\n• <b>Abstraction</b> — showing only the essential details of an object, hiding the complex implementation behind a simple interface\n  ↳ These four — Encapsulation, Inheritance, Polymorphism, Abstraction — are the four pillars of OOP, an exam-favourite list to have memorized in order.",
    note:
      "The four pillars of OOP, in the order they're usually asked: Encapsulation, Inheritance, Polymorphism, Abstraction (easy to remember as \"EIPA\"). Class and Object come first because every one of the four pillars is explained in terms of them.",
    tags: ["Object-Oriented Programming", "OOP", "Programming", "Class", "Object", "JavaScript"],
  },
  {
    id: 107,
    slug: "class",
    section: "Programming",
    parentSlug: "object-oriented-programming",
    title: "Class",
    tagline: "The blueprint that defines what data and behavior every object built from it will have",
    description:
      "<b>What a Class Is</b>\nA class is a blueprint (or template) that defines what data (attributes) and behavior (methods) any object created from it will have — the class itself doesn't hold any real values, it just describes the shape every object of that type will follow.\n\n<b>Why Classes Matter</b>\nWithout a class, a program modeling many similar things (many students, many bank accounts) would need to repeat the same set of variables and functions for each one. A class lets that shared shape be written once, and reused to create as many objects as needed.\n\n<b>How a Class Is Defined in JavaScript</b>\nA class is declared with the class keyword. A constructor(...) method runs automatically every time a new object is created from the class, and is where each object's own attributes get set up; every other method defined inside the class becomes behavior shared by every object created from it.\n\n<b>Class vs. a Plain Object Literal</b>\nA plain object literal ({ name: \"Rita\", age: 20 }) is just one single object with no reusable shape behind it. A class is the reusable shape itself — the same class can stamp out any number of separate objects, each following that same structure.",
    note:
      "A class defines the shape; it doesn't exist as real, usable data by itself — nothing is actually created in memory until an actual object is made from it with new (see the \"Object\" card next).",
    code: "class Student {\n    constructor(name, age) {\n        this.name = name;   // attribute\n        this.age = age;      // attribute\n    }\n\n    display() {              // method\n        console.log(`${this.name} is ${this.age} years old`);\n    }\n}",
    codeLanguage: "JavaScript",
    tags: ["Class", "Object-Oriented Programming", "Blueprint", "Attributes", "Methods"],
  },
  {
    id: 108,
    slug: "object",
    section: "Programming",
    parentSlug: "object-oriented-programming",
    title: "Object",
    tagline: "An actual instance created from a class, with its own real values",
    description:
      "<b>What an Object Is</b>\nAn object is an actual instance created from a class — where the class is just a blueprint, an object is a real, usable thing built from that blueprint, with its own actual values stored in memory.\n\n<b>Why Objects Matter</b>\nA class alone can't do anything — a program needs at least one object before it has any real data to work with. Many separate objects can be created from the exact same class, each with its own independent set of values.\n\n<b>How an Object Is Created</b>\nThe new keyword creates an object from a class, running the class's constructor to set up that object's own attributes. Any number of separate objects can be created from the same class, each getting its own independent copy of those attributes — changing one object's data never affects any other object made from the same class.\n\n<b>Class vs. Object — the Core Distinction</b>\nA class is the blueprint (e.g. Student); an object is one specific instance built from it (e.g. s1, holding the actual values \"Rita\", 20).",
    note:
      "Exam favourite: a class is declared once, but many objects can be instantiated from it, each with its own independent attribute values — changing s1.age never affects s2.age.",
    code: "const s1 = new Student(\"Rita\", 20);\ns1.display();   // Rita is 20 years old\n\nconst s2 = new Student(\"Hari\", 22);   // a second, completely separate object\ns2.display();   // Hari is 22 years old",
    codeLanguage: "JavaScript",
    tags: ["Object", "Instance", "Object-Oriented Programming", "Class"],
  },
  {
    id: 109,
    slug: "encapsulation",
    section: "Programming",
    parentSlug: "object-oriented-programming",
    title: "Encapsulation",
    tagline: "Bundling data and methods together, and hiding internal details from outside code",
    description:
      "<b>What Encapsulation Is</b>\nEncapsulation is bundling an object's data (attributes) and the methods that operate on that data together into one class, while hiding the data's internal details from code outside the class — outside code can only interact with that data through the class's own methods.\n\n<b>Why Encapsulation Matters</b>\nWithout encapsulation, any part of a program could directly change an object's data in an invalid way (like setting a negative balance). Encapsulation forces all changes to go through controlled methods, which can validate a value before accepting it, protecting the object's data from being put into an invalid state.\n\n<b>How to Encapsulate Data in JavaScript</b>\nA class field prefixed with # (e.g. #balance) is a true private field — it can only be read or changed from inside the class itself; any attempt to access it from outside code fails. Fields without a # are public by default, and are normally used for the methods that provide controlled access to the private data.\n\n<b>Getter and Setter Methods</b>\nA getter method reads a private field's value; a setter method changes it, usually after validating the new value first — this is the standard, controlled way outside code is allowed to interact with private data.",
    note:
      "Exam favourite: encapsulation is often summarized as \"data hiding\" — making attributes private (# fields in JS) and only exposing them through public methods that can validate every change.",
    code: "class Account {\n    #balance = 0;   // private field — hidden from outside code\n\n    deposit(amount) {\n        if (amount > 0) {\n            this.#balance += amount;   // validated before changing\n        }\n    }\n\n    getBalance() {   // getter\n        return this.#balance;\n    }\n}\n\nconst acc = new Account();\nacc.deposit(100);\nconsole.log(acc.getBalance());   // 100\n// acc.#balance             // SyntaxError — not accessible from outside",
    codeLanguage: "JavaScript",
    tags: ["Encapsulation", "Data Hiding", "Private Fields", "Object-Oriented Programming", "Pillars of OOP"],
  },
  {
    id: 110,
    slug: "inheritance",
    section: "Programming",
    parentSlug: "object-oriented-programming",
    title: "Inheritance",
    tagline: "Letting one class reuse and extend another class's data and behavior",
    description:
      "<b>What Inheritance Is</b>\nInheritance lets one class (the <b>derived</b> or <b>child</b> class) reuse the attributes and methods of another class (the <b>base</b> or <b>parent</b> class), while also adding its own new attributes and methods, or overriding existing ones.\n\n<b>Why Inheritance Matters</b>\nMany real-world things are naturally specialized versions of a more general thing — a Car and a Truck are both specialized kinds of Vehicle, sharing common attributes (speed, fuel) while each also having their own. Inheritance lets that shared part be written once in the base class, instead of duplicated in every derived class.\n\n<b>How to Inherit in JavaScript</b>\nThe extends keyword makes one class inherit from another. Inside the derived class's constructor, super(...) must be called first — it runs the base class's constructor, setting up the attributes the base class defines, before the derived class sets up its own.\n\n<b>Types of Inheritance</b>\n• <b>Single</b> — one derived class, one base class\n• <b>Multilevel</b> — a chain, e.g. Vehicle → Car → SportsCar\n• <b>Hierarchical</b> — multiple derived classes share one base class, e.g. Car and Truck both inherit from Vehicle\n• <b>Multiple</b> — one derived class inherits from more than one base class at once (JavaScript classes only support extending exactly one base class — there is no true multiple inheritance)",
    note:
      "Exam favourite: the syntax class Car extends Vehicle means Car is the derived class inheriting from Vehicle, the base class — get the direction right, since it's easy to mix up which side is the parent.",
    code: "class Vehicle {\n    constructor(speed) {\n        this.speed = speed;\n    }\n\n    move() {\n        console.log(\"Moving\");\n    }\n}\n\nclass Car extends Vehicle {\n    constructor(speed, numDoors) {\n        super(speed);        // runs Vehicle's constructor first\n        this.numDoors = numDoors;\n    }\n}\n\nconst c = new Car(100, 4);\nconsole.log(c.speed);     // 100 — inherited from Vehicle\nconsole.log(c.numDoors);  // 4 — Car's own attribute\nc.move();                  // inherited method, works on Car too",
    codeLanguage: "JavaScript",
    tags: ["Inheritance", "Base Class", "Derived Class", "extends", "super", "Object-Oriented Programming", "Pillars of OOP"],
  },
  {
    id: 111,
    slug: "polymorphism",
    section: "Programming",
    parentSlug: "object-oriented-programming",
    title: "Polymorphism",
    tagline: "Letting the same method call behave differently depending on which object it's actually called on",
    description:
      "<b>What Polymorphism Is</b>\nPolymorphism (\"many forms\") lets the same method name behave differently depending on which object it's called on — the same call, sound(), can produce completely different behavior for a Dog object versus a Cat object.\n\n<b>Why Polymorphism Matters</b>\nIt lets code written once (like a loop that calls sound() on a list of different Animal objects) automatically work correctly for every specific kind of animal, without needing a separate if/else check for each one.\n\n<b>How Polymorphism Works — Two Kinds</b>\n• <b>Compile-time (static) polymorphism — function overloading</b>: in languages like C++ and Java, multiple methods can share the same name but take different parameters, and the compiler picks which one to call. JavaScript does not support this — a class can only have one method with a given name, so the same effect is instead achieved with default parameters or by checking typeof/arguments.length inside a single method.\n• <b>Run-time (dynamic) polymorphism — method overriding</b>: a derived class redefines a method already defined in its base class; which version actually runs is decided while the program is running, based on the actual object's type. This is the main, natural form of polymorphism in JavaScript.\n\n<b>Worked Example — Overriding</b>\nEvery class below defines its own sound() method. Calling a.sound() runs whichever version belongs to a's actual class — Animal, Dog, or Cat — even though the calling code (makeSound) never checks which one it is.",
    note:
      "Exam favourite: overloading (same method name, different parameters) happens at compile-time in languages like C++/Java, but is not supported in JavaScript; overriding (derived class redefines a base class's method) is decided at run-time in every OOP language, including JavaScript.",
    code: "class Animal {\n    sound() {\n        console.log(\"Some sound\");\n    }\n}\n\nclass Dog extends Animal {\n    sound() {                  // overrides Animal's version\n        console.log(\"Bark\");\n    }\n}\n\nclass Cat extends Animal {\n    sound() {\n        console.log(\"Meow\");\n    }\n}\n\nfunction makeSound(animal) {\n    animal.sound();   // calls the correct version based on the actual object\n}\n\nmakeSound(new Dog());   // Bark\nmakeSound(new Cat());   // Meow",
    codeLanguage: "JavaScript",
    tags: ["Polymorphism", "Overloading", "Overriding", "extends", "Object-Oriented Programming", "Pillars of OOP"],
  },
  {
    id: 112,
    slug: "abstraction",
    section: "Programming",
    parentSlug: "object-oriented-programming",
    title: "Abstraction",
    tagline: "Showing only the essential details of an object, hiding the complex implementation behind a simple interface",
    description:
      "<b>What Abstraction Is</b>\nAbstraction means showing only the essential, relevant details of an object to the outside world, while hiding the complex implementation behind a simple interface — a driver uses a car's steering wheel and pedals without needing to know how the engine actually works internally.\n\n<b>Why Abstraction Matters</b>\nIt lets code that uses a class stay simple and stable, even if the class's internal implementation later changes — as long as the public interface (the method names and what they do) stays the same, code calling those methods doesn't need to change at all.\n\n<b>How Abstraction Is Simulated in JavaScript</b>\nUnlike C++ or Java, JavaScript has no built-in abstract keyword or pure virtual functions. The same idea is simulated by hand:\n• <b>Abstract class</b> — a base class whose constructor checks new.target and throws an error if the class is instantiated directly, forcing it to only ever be used through a derived class.\n• <b>\"Pure virtual\" method</b> — a method in the base class that simply throws an error (e.g. \"draw() must be implemented\"), forcing every derived class to override it with a real implementation.\n\n<b>Abstraction vs. Encapsulation — a Common Mix-Up</b>\nEncapsulation hides an object's data (making fields private with #); abstraction hides an object's implementation complexity (exposing only a simple set of methods, regardless of how complicated the internal code behind them actually is).",
    note:
      "Exam favourite: a class with even one \"pure virtual\" method becomes an abstract class in concept, and should never be instantiated directly — only through a derived class that implements every such method. JavaScript doesn't enforce this at the language level, so it has to be enforced by hand, unlike C++'s = 0 syntax.",
    code: "class Shape {\n    constructor() {\n        if (new.target === Shape) {\n            throw new Error(\"Shape is abstract and cannot be instantiated directly\");\n        }\n    }\n\n    draw() {\n        throw new Error(\"draw() must be implemented\");   // \"pure virtual\" method\n    }\n}\n\nclass Circle extends Shape {\n    draw() {\n        console.log(\"Drawing a circle\");   // must implement draw()\n    }\n}\n\nconst s = new Circle();\ns.draw();          // Drawing a circle\n// new Shape();    // throws — Shape is abstract",
    codeLanguage: "JavaScript",
    tags: ["Abstraction", "Abstract Class", "Object-Oriented Programming", "Pillars of OOP"],
  },
  // ─────────────────────────────────────────────
  // DATA STRUCTURES & ALGORITHMS
  // ─────────────────────────────────────────────
  {
    id: 113,
    slug: "data-structures",
    section: "Data Structures & Algorithms",
    title: "Data Structures & Algorithms",
    tagline: "Ways of organizing and storing data so it can be accessed and changed efficiently, plus the step-by-step procedures that work on it",
    description:
      "<b>What Data Structures & Algorithms (DSA) Is, in Plain English</b>\nImagine you own a small shop. A <b>data structure</b> is simply how you organize your stock — everything piled in one big heap on the floor, versus everything sorted onto labeled shelves. An <b>algorithm</b> is the exact set of steps you follow to do something with that stock, like finding one specific item. The same task (finding an item) is fast or painfully slow depending entirely on how the stock was organized in the first place — that's the whole idea behind DSA.\n\n<b>Why DSA Matters</b>\nThe same task — searching for a value, adding an item, removing an item — can take wildly different amounts of time depending on how the underlying data is organized. Picking the right data structure is often the single biggest factor in whether a program runs instantly or grinds to a halt as the amount of data grows.\n\n<b>Linear vs. Non-Linear Data Structures</b>\n• <b>Linear</b> — elements are arranged in a sequence, one after another, with a single path from the first element to the last (Array, Linked List, Stack, Queue).\n• <b>Non-linear</b> — elements branch out or connect in more complex ways, with no single sequential path (Tree, Heap, Graph).\n\n<b>How This Section Is Organized</b>\n• <b>Linear Data Structure</b> — Array, Linked List, Stack, and Queue, each covered with their own operations and applications\n• <b>Non-Linear Data Structure</b> — Tree (Binary Tree, BST, AVL Tree), Heap, and Graph (with BFS, DFS, and shortest-path algorithms)\n• <b>Algorithms</b> — Searching, Sorting, and Complexity analysis (Big O, time, and space)\n  ↳ Each is covered in its own card next, with every sub-topic broken out.",
    note:
      "Exam favourite: a data structure is about *how data is stored*; an algorithm is about *what steps operate on it* — the two terms aren't interchangeable, even though they're always taught together.",
    tags: ["Data Structures", "Algorithms", "DSA", "Linear Data Structure", "Non-Linear Data Structure"],
  },
  {
    id: 114,
    slug: "linear-data-structures",
    section: "Data Structures & Algorithms",
    parentSlug: "data-structures",
    title: "Linear Data Structure",
    tagline: "Data structures where every element is arranged sequentially, one after another, with a single path from the first element to the last",
    description:
      "<b>What a Linear Data Structure Is, in Plain English</b>\nThink of people standing in a single-file line — one behind the other, in one straight path. That's a linear data structure: every element has exactly one \"next\" element (except the last one), with no branching off in different directions.\n\n<b>Why Linear Structures Matter</b>\nMost of the data structures asked about in the exam — Array, Linked List, Stack, Queue — are linear, and each one exists to solve a different practical limitation of the others (fixed size, slow insertion, needing a specific order like LIFO or FIFO).\n\n<b>How This Section Is Organized</b>\n• <b>Array</b> — a fixed-size collection of elements stored in contiguous memory, accessed by index, like numbered lockers in a row\n• <b>Linked List</b> — a chain of nodes, each pointing to the next, like a treasure hunt where every clue points to the next location\n• <b>Stack</b> — a LIFO (Last In, First Out) structure, like a stack of plates\n• <b>Queue</b> — a FIFO (First In, First Out) structure, like a line of people waiting at a shop counter\n  ↳ Each is covered in its own card next, along with the specific operations and variations the exam asks about.",
    note:
      "Exam favourite: \"linear\" doesn't mean \"simple\" — Stack and Queue are still linear data structures, they just restrict *which end* elements can be added or removed from.",
    tags: ["Linear Data Structure", "Array", "Linked List", "Stack", "Queue", "Data Structures"],
  },
  {
    id: 115,
    slug: "array",
    section: "Data Structures & Algorithms",
    parentSlug: "linear-data-structures",
    title: "Array",
    tagline: "A collection of elements of the same type, stored in contiguous memory and accessed directly by index",
    description:
      "<b>What an Array Is, in Plain English</b>\nPicture a row of numbered lockers, side by side, all the same size. An array is exactly that: a collection of same-type values, stored right next to each other in memory, each one labeled with a number (its index) starting from 0 — locker 0, locker 1, locker 2, and so on.\n\n<b>Why Arrays Matter</b>\nBecause every element sits in one contiguous block of memory, an array gives direct, constant-time access to any element just by its index — arr[7] is exactly as fast to read as arr[0], no matter how large the array is, the same way you can walk straight to locker #7 without checking lockers 0 through 6 first.\n\n<b>How This Section Is Organized</b>\n• <b>Traversal</b> — visiting every element once, to read or process each value\n• <b>Searching</b> — finding whether a target value exists in the array, and where\n• <b>Sorting</b> — arranging the array's elements into a defined order\n  ↳ Each is covered in its own card next.\n\n<b>Array in JavaScript</b>\nUnlike a fixed-size array in C, a JavaScript array can grow or shrink dynamically — but the exam's array questions (indexing, traversal, searching, sorting) work exactly the same way regardless of language.",
    note:
      "Exam favourite: direct index access (arr[i]) is O(1) — constant time — because the array's contiguous memory layout lets the computer calculate any element's exact address directly, without walking through the elements before it.",
    diagram:
      "  AN ARRAY IS A ROW OF NUMBERED LOCKERS\n\n  Index:   0    1    2    3    4\n         ┌────┬────┬────┬────┬────┐\n  Value: │ 90 │ 85 │ 77 │ 92 │ 88 │\n         └────┴────┴────┴────┴────┘\n           ▲                   ▲\n        scores[0]           scores[4]",
    code: "const scores = [90, 85, 77, 92, 88];\n\nconsole.log(scores[0]);     // 90 — first element\nconsole.log(scores[4]);     // 88 — last element\nconsole.log(scores.length); // 5",
    codeLanguage: "JavaScript",
    tags: ["Array", "Indexing", "Linear Data Structure", "Data Structures"],
  },
  {
    id: 116,
    slug: "traversal",
    section: "Data Structures & Algorithms",
    parentSlug: "array",
    title: "Traversal",
    tagline: "Visiting every element of an array exactly once, typically to read or process each value",
    description:
      "<b>What Traversal Is, in Plain English</b>\nTraversal is simply walking down the row of lockers, opening each one in order and looking inside — locker 0, then locker 1, then locker 2, and so on, until every locker has been checked exactly once.\n\n<b>Why Traversal Matters</b>\nAlmost every array-based task — finding a total, printing a list, checking every value against a condition — starts with a traversal. Without a way to visit every element, an array's data is not being used, no matter how it's stored.\n\n<b>How to Traverse an Array</b>\nA for loop is the standard way to traverse an array, using the loop's counter as the index — starting at 0, and continuing while the counter is less than the array's length.\n\n<b>Time Complexity</b>\nTraversal always takes O(n) time — visiting n elements always takes n steps, no matter how the elements are arranged; there's no way to visit every element faster than one at a time.",
    note:
      "Exam favourite: traversal is always O(n) — one of the few operations whose time complexity never changes, since every element must be visited at least once by definition.",
    diagram:
      "  TRAVERSING [90, 85, 77, 92, 88] LEFT TO RIGHT\n\n  →90   85   77   92   88\n   ↓\n     →85   77   92   88\n          ↓\n            →77   92   88   ... and so on, one step at a time",
    code: "const scores = [90, 85, 77, 92, 88];\n\nfor (let i = 0; i < scores.length; i++) {\n    console.log(scores[i]);\n}\n// Or, using JS's built-in iterator:\nfor (const score of scores) {\n    console.log(score);\n}",
    codeLanguage: "JavaScript",
    tags: ["Traversal", "Array", "for loop", "Data Structures"],
  },
  {
    id: 117,
    slug: "searching",
    section: "Data Structures & Algorithms",
    parentSlug: "array",
    title: "Searching",
    tagline: "Finding whether a target value exists in an array, and at which index",
    description:
      "<b>What Searching Is, in Plain English</b>\nSearching is looking for one specific item among many. Think of two ways to find a name in a phone book: flipping through every single page from the start (slow), or opening to the middle, deciding which half the name must be in, and repeating that trick on just that half (much faster) — those are exactly the two searching methods below.\n\n<b>Why Searching Matters</b>\nLooking something up by value, rather than by a known index, is one of the most common things a program needs to do with a collection of data — how that lookup is done has a huge effect on performance as the array grows large.\n\n<b>Linear Search</b>\nLinear search checks every element one by one, from the start, until it finds the target or reaches the end — like flipping through the phone book page by page. It works on any array, sorted or not, but takes O(n) time in the worst case.\n\n<b>Binary Search</b>\nBinary search only works on a sorted array. It repeatedly checks the middle element, and — since the array is sorted — immediately discards the entire half that can't contain the target, cutting the remaining search space in half every step. This gives it O(log n) time, dramatically faster than linear search on a large array.",
    note:
      "Exam favourite: binary search's O(log n) speed is only possible because the array is sorted first — the moment the array isn't sorted, binary search cannot be used at all, and linear search (O(n)) is the only option.",
    diagram:
      "  BINARY SEARCH FOR 23 IN [4, 8, 15, 16, 23, 42, 50]\n\n  Step 1: low=0 high=6 mid=3 → arr[3]=16 < 23 → search right half\n  Step 2: low=4 high=6 mid=5 → arr[5]=42 > 23 → search left half\n  Step 3: low=4 high=4 mid=4 → arr[4]=23 = 23 → found at index 4",
    code: "function linearSearch(arr, target) {\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i] === target) return i;\n    }\n    return -1;\n}\n\nfunction binarySearch(arr, target) {   // arr must already be sorted\n    let low = 0, high = arr.length - 1;\n    while (low <= high) {\n        const mid = Math.floor((low + high) / 2);\n        if (arr[mid] === target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}",
    codeLanguage: "JavaScript",
    tags: ["Searching", "Linear Search", "Binary Search", "Array", "Data Structures"],
  },
  {
    id: 118,
    slug: "sorting",
    section: "Data Structures & Algorithms",
    parentSlug: "array",
    title: "Sorting",
    tagline: "Arranging an array's elements into a defined order, usually ascending or descending",
    description:
      "<b>What Sorting Is, in Plain English</b>\nSorting is arranging things into order — like lining up a shelf of books from shortest to tallest, or arranging playing cards in your hand from lowest to highest.\n\n<b>Why Sorting Matters</b>\nMany other operations depend on data already being sorted (binary search is the clearest example) — and sorted data is simply easier for people to read and compare.\n\n<b>Simple Sorts — O(n²)</b>\n• <b>Bubble Sort</b> — repeatedly compares adjacent elements and swaps them if they're in the wrong order, letting the largest unsorted value \"bubble up\" to its correct position each pass.\n• <b>Selection Sort</b> — repeatedly finds the smallest remaining element and swaps it into its correct position at the front.\n• <b>Insertion Sort</b> — builds the sorted array one element at a time, inserting each new element into its correct position among the already-sorted elements, the way a card player sorts new cards into an already-sorted hand.\n\n<b>Efficient Sorts — O(n log n)</b>\n• <b>Merge Sort</b> — splits the array in half repeatedly until each piece has one element, then merges the pieces back together in sorted order.\n• <b>Quick Sort</b> — picks a \"pivot\" element, partitions the array so smaller elements come before it and larger elements come after, then sorts each partition the same way.",
    note:
      "Exam favourite complexity table: Bubble/Selection/Insertion Sort are all O(n²) in the worst case; Merge Sort and Quick Sort are O(n log n) — the reason \"efficient\" sorts are preferred for large datasets.",
    diagram:
      "  SORTING ALGORITHM COMPLEXITY (WORST CASE)\n\n  Algorithm         Time        Space\n  ───────────────────────────────────\n  Bubble Sort       O(n²)       O(1)\n  Selection Sort    O(n²)       O(1)\n  Insertion Sort    O(n²)       O(1)\n  Merge Sort        O(n log n)  O(n)\n  Quick Sort        O(n²)*      O(log n)\n                    *O(n log n) average case",
    code: "function bubbleSort(arr) {\n    for (let i = 0; i < arr.length - 1; i++) {\n        for (let j = 0; j < arr.length - 1 - i; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];   // swap\n            }\n        }\n    }\n    return arr;\n}\n\nconsole.log(bubbleSort([5, 2, 9, 1, 5]));   // [1, 2, 5, 5, 9]",
    codeLanguage: "JavaScript",
    tags: ["Sorting", "Bubble Sort", "Merge Sort", "Quick Sort", "Array", "Data Structures"],
  },
  {
    id: 119,
    slug: "linked-list",
    section: "Data Structures & Algorithms",
    parentSlug: "linear-data-structures",
    title: "Linked List",
    tagline: "A chain of nodes, each pointing to the next, that can grow or shrink without needing contiguous memory",
    description:
      "<b>What a Linked List Is, in Plain English</b>\nImagine a treasure hunt: each clue you find doesn't tell you the location of every remaining clue — it only tells you where to find the very next one. A linked list works the same way. It's a chain of nodes, where each node holds a value and a reference (pointer) to the next node in the chain — unlike an array, its nodes don't need to sit next to each other in memory.\n\n<b>Why Linked Lists Matter</b>\nAn array has a fixed size and requires contiguous memory, which makes inserting or removing an element from the middle expensive (every following element has to shift). A linked list can grow or shrink one node at a time, and inserting or removing a node (once you're already at that position) only means updating a couple of pointers — like re-writing one clue to point to a new location, instead of moving every treasure box in the hunt.\n\n<b>How This Section Is Organized</b>\n• <b>Singly Linked List</b> — each node points to only the next node\n• <b>Doubly Linked List</b> — each node points to both the next and the previous node\n• <b>Circular Linked List</b> — the last node points back to the first, forming a loop\n  ↳ Each is covered in its own card next.\n\n<b>Array vs. Linked List — the Core Trade-Off</b>\nAn array gives O(1) direct access by index, but O(n) insertion/deletion in the middle (shifting required). A linked list gives O(n) access (must walk from the head), but O(1) insertion/deletion once you're already at the right node.",
    note:
      "Exam favourite: a linked list has no fixed size and needs no contiguous memory block — the trade-off is that finding the nth element always takes O(n), since there's no way to jump directly to it the way an array's index can.",
    diagram:
      "  SINGLY LINKED LIST — LIKE A TREASURE HUNT'S CHAIN OF CLUES\n\n  HEAD\n   │\n   ▼\n  [10 | •]──▶[20 | •]──▶[30 | null]\n  (each clue only reveals where the next one is)",
    code: "class Node {\n    constructor(value) {\n        this.value = value;\n        this.next = null;\n    }\n}\n\nconst head = new Node(10);\nhead.next = new Node(20);\nhead.next.next = new Node(30);",
    codeLanguage: "JavaScript",
    tags: ["Linked List", "Node", "Linear Data Structure", "Data Structures"],
  },
  {
    id: 120,
    slug: "singly-linked-list",
    section: "Data Structures & Algorithms",
    parentSlug: "linked-list",
    title: "Singly Linked List",
    tagline: "Each node points to only the next node in the list, in one direction",
    description:
      "<b>What a Singly Linked List Is, in Plain English</b>\nThe simplest version of the treasure hunt: every clue points forward to exactly one next clue, and the very last clue simply says \"the end\" — there's no way to go backward once you've moved past a clue.\n\n<b>Why It's the Simplest Form</b>\nA singly linked list uses the least memory per node (only one pointer), making it the default choice whenever a linked list only ever needs to be walked in one direction.\n\n<b>How to Traverse One</b>\nStarting from head, keep following .next until reaching null — this visits every node in the list exactly once, the same O(n) traversal cost as an array.",
    note:
      "Exam favourite: the last node's next is always null — that's the signal a traversal loop checks for to know it has reached the end of the list, since a linked list doesn't have a fixed \"length\" property the way an array does.",
    diagram:
      "  head ──▶ [10|•] ──▶ [20|•] ──▶ [30|null]\n           (one-way arrows only — forward, never back)",
    code: "class Node {\n    constructor(value) {\n        this.value = value;\n        this.next = null;\n    }\n}\n\nfunction traverse(head) {\n    let current = head;\n    while (current !== null) {\n        console.log(current.value);\n        current = current.next;\n    }\n}\n\nconst head = new Node(10);\nhead.next = new Node(20);\nhead.next.next = new Node(30);\ntraverse(head);   // 10, 20, 30",
    codeLanguage: "JavaScript",
    tags: ["Singly Linked List", "Linked List", "Node", "Data Structures"],
  },
  {
    id: 121,
    slug: "doubly-linked-list",
    section: "Data Structures & Algorithms",
    parentSlug: "linked-list",
    title: "Doubly Linked List",
    tagline: "Each node points to both the next AND the previous node, allowing traversal in both directions",
    description:
      "<b>What a Doubly Linked List Is, in Plain English</b>\nNow imagine each clue in the treasure hunt tells you where the next clue is AND where the previous clue was — a doubly linked list's nodes each hold two references, one to the next node and one to the previous node, so the chain can be walked forward or backward from any point.\n\n<b>Why the Extra Pointer Matters</b>\nWith only a next reference (as in a singly linked list), deleting a node requires walking from the head just to find the PREVIOUS node (needed to reroute its next pointer). With a prev reference already available, that lookup is skipped entirely — deletion given a node reference becomes O(1) instead of O(n).\n\n<b>The Trade-Off</b>\nEvery node in a doubly linked list uses extra memory for its second pointer, compared to a singly linked list — a direct trade-off of memory for traversal flexibility and faster deletion.",
    note:
      "Exam favourite: a doubly linked list trades extra memory (one more pointer per node) for the ability to traverse backward and delete a known node in O(1), without needing to search for its predecessor first.",
    diagram:
      "  null ⟵── [10] ⟷ [20] ⟷ [30] ──⟶ null\n           each node points both forward and backward",
    code: "class Node {\n    constructor(value) {\n        this.value = value;\n        this.next = null;\n        this.prev = null;\n    }\n}\n\nconst first = new Node(10);\nconst second = new Node(20);\nfirst.next = second;\nsecond.prev = first;   // the extra link a singly linked list doesn't have",
    codeLanguage: "JavaScript",
    tags: ["Doubly Linked List", "Linked List", "Node", "Data Structures"],
  },
  {
    id: 122,
    slug: "circular-linked-list",
    section: "Data Structures & Algorithms",
    parentSlug: "linked-list",
    title: "Circular Linked List",
    tagline: "The last node points back to the first node instead of to null, forming a loop",
    description:
      "<b>What a Circular Linked List Is, in Plain English</b>\nImagine a group of kids playing musical chairs in a circle — after the last kid, play continues back at the first kid, not off into nowhere. A circular linked list works the same way: the last node's next reference points back to the first node (the head) instead of to null, so there is no \"end,\" just a continuous loop.\n\n<b>Why Use One</b>\nA circular linked list is a natural fit for anything that needs to cycle through a fixed set of items repeatedly and predictably — round-robin CPU task scheduling, or looping through players taking turns in a game, are classic examples.\n\n<b>The Traversal Trap</b>\nBecause there's no null to signal the end, a traversal loop written the same way as a singly linked list's (\"keep going until next is null\") never stops — it must instead stop after returning to the starting node, or after a known number of steps.",
    note:
      "Exam favourite: traversing a circular linked list the same way as a normal linked list (checking for null) causes an infinite loop — the stopping condition must instead check \"have I gotten back to the node I started at?\"",
    diagram:
      "        ┌────────────────────────┐\n        ▼                        │\n  head [10|•]──▶[20|•]──▶[30|•]──┘\n   (the last node points back to the first, not to null)",
    code: "class Node {\n    constructor(value) {\n        this.value = value;\n        this.next = null;\n    }\n}\n\nfunction traverseCircular(head) {\n    let current = head;\n    do {\n        console.log(current.value);\n        current = current.next;\n    } while (current !== head);   // stop when we're back at the start\n}",
    codeLanguage: "JavaScript",
    tags: ["Circular Linked List", "Linked List", "Round-Robin", "Data Structures"],
  },
  {
    id: 123,
    slug: "stack",
    section: "Data Structures & Algorithms",
    parentSlug: "linear-data-structures",
    title: "Stack",
    tagline: "A linear data structure that follows LIFO (Last In, First Out) — the last element added is the first removed",
    description:
      "<b>What a Stack Is, in Plain English</b>\nThink of a stack of plates on a kitchen counter: you always add a new plate to the top, and you always take a plate off the top too — never from the middle or the bottom. A stack (the data structure) works exactly the same way, following LIFO order (Last In, First Out): the most recently added element is always the first one removed.\n\n<b>Why Stacks Matter</b>\nA huge number of real problems are naturally \"undo the most recent thing first\" — undoing an action, backtracking out of a dead end, or unwinding function calls when a program returns — and a stack models that exactly.\n\n<b>How This Section Is Organized</b>\n• <b>Push</b> — adds a new element to the top of the stack\n• <b>Pop</b> — removes and returns the top element of the stack\n• <b>Applications</b> — real problems solved using a stack's LIFO behavior\n  ↳ Each is covered in its own card next.",
    note:
      "Exam favourite: LIFO (Last In, First Out) is the one term that defines a stack — if a question describes \"the most recently added item comes out first,\" it's describing a stack.",
    diagram:
      "  A STACK OF PLATES\n\n  push ──▶ ┌──────────┐\n           │ 30 (top) │ ◀── pop removes this one first\n           ├──────────┤\n           │    20     │\n           ├──────────┤\n           │    10     │\n           └──────────┘",
    tags: ["Stack", "LIFO", "Linear Data Structure", "Data Structures"],
  },
  {
    id: 124,
    slug: "push",
    section: "Data Structures & Algorithms",
    parentSlug: "stack",
    title: "Push",
    tagline: "Adds a new element to the top of the stack",
    description:
      "<b>What Push Does, in Plain English</b>\nPush is placing a new plate on top of the stack — it adds a new element to the top, making it the new \"most recently added\" element, the next one that pop will remove.\n\n<b>Why Push Matters</b>\nPush is how anything gets onto a stack in the first place — every stack-based algorithm starts by pushing elements on, in whatever order they need to come back off in reverse.\n\n<b>How to Implement It</b>\nA stack is commonly implemented using a plain array, where push adds to the end of the array — JavaScript's built-in Array.prototype.push() already does exactly this, on the same end an array-based stack treats as its \"top.\"\n\n<b>Stack Overflow</b>\nIf a stack has a fixed maximum size (common in low-level or embedded implementations) and is already full, attempting to push further causes a <b>stack overflow</b> — the same term used when too many nested function calls exhaust the call stack's memory.",
    note:
      "Exam favourite: JavaScript's array push()/pop() naturally behave like a stack already, since both operate on the same end (the end of the array) — no extra bookkeeping needed to track \"the top.\"",
    diagram:
      "  BEFORE push(30)      AFTER push(30)\n  ┌────┐               ┌────┐\n  │ 20 │ ◀ top          │ 30 │ ◀ new top\n  ├────┤               ├────┤\n  │ 10 │               │ 20 │\n  └────┘               ├────┤\n                        │ 10 │\n                        └────┘",
    code: "class Stack {\n    #items = [];\n\n    push(value) {\n        this.#items.push(value);   // adds to the top\n    }\n\n    peek() {\n        return this.#items[this.#items.length - 1];\n    }\n}\n\nconst s = new Stack();\ns.push(10);\ns.push(20);\ns.push(30);\nconsole.log(s.peek());   // 30 — the top of the stack",
    codeLanguage: "JavaScript",
    tags: ["Push", "Stack", "LIFO", "Data Structures"],
  },
  {
    id: 125,
    slug: "pop",
    section: "Data Structures & Algorithms",
    parentSlug: "stack",
    title: "Pop",
    tagline: "Removes and returns the top element of the stack",
    description:
      "<b>What Pop Does, in Plain English</b>\nPop is lifting the top plate off the stack — it removes the top element (the most recently pushed one) and returns its value; after a pop, the plate that was second-from-top becomes the new top.\n\n<b>Why Pop Matters</b>\nPop is how a stack-based algorithm retrieves elements back out, always in the reverse order they were pushed in — this reversal is exactly what makes a stack useful for undo operations and for unwinding nested calls.\n\n<b>How to Implement It</b>\nJavaScript's built-in Array.prototype.pop() removes and returns the last element of an array — the same end push() adds to, making array push()/pop() a ready-made stack.\n\n<b>Stack Underflow</b>\nCalling pop on an already-empty stack is called <b>stack underflow</b> — a well-behaved stack implementation should check isEmpty() first and handle this case explicitly, rather than letting it silently return undefined or crash.",
    note:
      "Exam favourite: stack overflow happens when pushing onto a full stack; stack underflow happens when popping an empty stack — the two failure modes are opposites, and easy to mix up under exam pressure.",
    diagram:
      "  BEFORE pop()         AFTER pop() → returns 30\n  ┌────┐               ┌────┐\n  │ 30 │ ◀ top          │ 20 │ ◀ new top\n  ├────┤               ├────┤\n  │ 20 │               │ 10 │\n  ├────┤               └────┘\n  │ 10 │\n  └────┘",
    code: "class Stack {\n    #items = [];\n\n    push(value) {\n        this.#items.push(value);\n    }\n\n    pop() {\n        if (this.#items.length === 0) {\n            throw new Error(\"Stack underflow\");\n        }\n        return this.#items.pop();\n    }\n\n    isEmpty() {\n        return this.#items.length === 0;\n    }\n}\n\nconst s = new Stack();\ns.push(10);\ns.push(20);\nconsole.log(s.pop());   // 20 — the most recently pushed element",
    codeLanguage: "JavaScript",
    tags: ["Pop", "Stack", "LIFO", "Stack Underflow", "Data Structures"],
  },
  {
    id: 126,
    slug: "applications",
    section: "Data Structures & Algorithms",
    parentSlug: "stack",
    title: "Applications",
    tagline: "Real-world and programming problems solved using a stack's LIFO behavior",
    description:
      "<b>What This Covers, in Plain English</b>\nA stack's LIFO behavior — \"undo the most recent thing first\" — turns out to model a surprising number of everyday problems directly, not just plates on a counter.\n\n<b>Common Applications</b>\n• <b>Undo/Redo</b> — each action is pushed onto a stack; undo pops the most recent action off and reverses it.\n• <b>Function call stack & recursion</b> — every function call is pushed onto the call stack, and popped off when it returns; this is literally how recursion (a function calling itself) is managed by the language runtime.\n• <b>Balanced parentheses / brackets checking</b> — push every opening bracket seen; on a closing bracket, pop and check it matches. If the stack isn't empty at the end, or a pop doesn't match, the brackets are unbalanced.\n• <b>Expression evaluation</b> — converting and evaluating infix expressions (like 3 + 4 * 2) commonly uses a stack to track operators and operands.\n• <b>Backtracking algorithms</b> — exploring a maze or puzzle and undoing the last move when hitting a dead end.\n• <b>Browser back button</b> — each visited page is pushed onto a history stack; the back button pops the most recent one, taking you back one page at a time.",
    note:
      "Exam favourite: \"checking balanced parentheses\" is the single most commonly asked stack application question — the algorithm is always the same: push opening brackets, pop and match on closing brackets.",
    diagram:
      "  BROWSER BACK BUTTON, AS A STACK OF VISITED PAGES\n\n  push(Home) → push(Search) → push(Article)\n\n  ┌─────────┐\n  │ Article │ ◀ current page\n  ├─────────┤\n  │ Search  │\n  ├─────────┤\n  │ Home    │\n  └─────────┘\n  Clicking \"Back\" pops \"Article\" off, returning you to \"Search\".",
    code: "function isBalanced(expr) {\n    const stack = [];\n    const pairs = { \")\": \"(\", \"]\": \"[\", \"}\": \"{\" };\n\n    for (const char of expr) {\n        if (char === \"(\" || char === \"[\" || char === \"{\") {\n            stack.push(char);\n        } else if (char === \")\" || char === \"]\" || char === \"}\") {\n            if (stack.pop() !== pairs[char]) return false;\n        }\n    }\n    return stack.length === 0;\n}\n\nconsole.log(isBalanced(\"{[()]}\"));   // true\nconsole.log(isBalanced(\"{[(])}\"));   // false",
    codeLanguage: "JavaScript",
    tags: ["Applications", "Stack", "Balanced Parentheses", "Recursion", "Data Structures"],
  },
  {
    id: 127,
    slug: "queue",
    section: "Data Structures & Algorithms",
    parentSlug: "linear-data-structures",
    title: "Queue",
    tagline: "A linear data structure that follows FIFO (First In, First Out) — the first element added is the first removed",
    description:
      "<b>What a Queue Is, in Plain English</b>\nThink of people lining up at a shop counter: whoever joined the line first gets served first, and everyone new joins at the back — nobody cuts in line. A queue (the data structure) works exactly the same way, adding elements at one end (the rear) and removing them from the other end (the front), following FIFO order (First In, First Out).\n\n<b>Why Queues Matter</b>\nAnything that needs to be processed in the exact order it arrived — print jobs, requests waiting for a server, people in a line — is naturally modeled by a queue.\n\n<b>How This Section Is Organized</b>\n• <b>Simple Queue</b> — the basic form; strict first-arrived, first-served order\n• <b>Circular Queue</b> — wraps the rear pointer back to the front of the storage array, reusing freed space\n• <b>Priority Queue</b> — the highest-priority element is served first, regardless of arrival order\n  ↳ Each is covered in its own card next.\n\n<b>Stack vs. Queue — a Common Mix-Up</b>\nA stack removes the most recently added element (LIFO), like a stack of plates; a queue removes the least recently added element (FIFO), like a line at a shop — both only allow adding/removing from restricted ends, but from opposite ends of \"most recent.\"",
    note:
      "Exam favourite: FIFO (First In, First Out) defines a queue, exactly the opposite of a stack's LIFO — a line of people waiting is a queue; a stack of plates is a stack.",
    diagram:
      "  A LINE AT A SHOP COUNTER\n\n  new customers ──▶ [10] [20] [30] ──▶ served next\n                    rear           front\n                    (10 joined first, so 10 is served first — FIFO)",
    tags: ["Queue", "FIFO", "Linear Data Structure", "Data Structures"],
  },
  {
    id: 128,
    slug: "simple-queue",
    section: "Data Structures & Algorithms",
    parentSlug: "queue",
    title: "Simple Queue",
    tagline: "The basic form of a queue — elements are added at the rear and removed from the front, in strict arrival order",
    description:
      "<b>What a Simple Queue Is, in Plain English</b>\nThis is the plain, ordinary line at a shop counter — every new person joins at the back (enqueue), and only the person at the front is ever served and leaves (dequeue), in the exact order they arrived. No cutting in line, no priorities.\n\n<b>Why It's the Default Form</b>\nMost real-world \"waiting in line\" scenarios are exactly this: strict arrival order, no cutting in line, no reprioritizing — a simple queue models that directly with no extra rules.\n\n<b>How to Implement One</b>\nA simple queue is commonly implemented with a plain array — enqueue adds to the end (push), and dequeue removes from the front. JavaScript's Array.prototype.shift() removes the first element, but has to shift every remaining element down by one, making it O(n) rather than the O(1) a queue's dequeue ideally should be.",
    note:
      "Exam favourite: a naive array-based queue's dequeue (using shift()) is O(n), not O(1), because every remaining element has to shift down — this inefficiency is exactly the problem a circular queue is built to solve.",
    diagram:
      "  enqueue(40) ──▶ [10] [20] [30] ──▶ dequeue() returns 10\n                  front           rear\n\n  after: dequeue() removed 10, enqueue(40) added 40\n         [20] [30] [40]\n         front       rear",
    code: "class SimpleQueue {\n    #items = [];\n\n    enqueue(value) {\n        this.#items.push(value);        // add to the rear\n    }\n\n    dequeue() {\n        return this.#items.shift();     // remove from the front — O(n)\n    }\n}\n\nconst q = new SimpleQueue();\nq.enqueue(10);\nq.enqueue(20);\nconsole.log(q.dequeue());   // 10 — the first one enqueued, leaves first",
    codeLanguage: "JavaScript",
    tags: ["Simple Queue", "Queue", "FIFO", "Data Structures"],
  },
  {
    id: 129,
    slug: "circular-queue",
    section: "Data Structures & Algorithms",
    parentSlug: "queue",
    title: "Circular Queue",
    tagline: "A queue that treats its storage array as circular, wrapping the rear pointer back to index 0 once it reaches the end",
    description:
      "<b>What a Circular Queue Is, in Plain English</b>\nImagine a circular buffet table with numbered plates — once you reach the last plate position and walk past it, you loop back around to plate #1 instead of walking off into a dead end. A circular queue works the same way: it's a queue implemented on a fixed-size array where the rear pointer wraps back around to index 0 once it reaches the end of the array.\n\n<b>Why Circular Queues Matter</b>\nIn a plain array-based queue, once elements have been dequeued from the front, that freed space at the beginning of the array just sits unused — the rear pointer keeps moving forward and eventually \"runs out of room,\" even though there's free space at the start. A circular queue reuses that freed space instead of wasting it.\n\n<b>How the Wraparound Works</b>\nThe rear (and front) pointer is advanced using the modulo operator: rear = (rear + 1) % size. Once rear reaches size - 1 and advances again, the modulo wraps it back to 0 — landing exactly on the freed slot at the start of the array, as long as it isn't still occupied.",
    note:
      "Exam favourite: the % (modulo) operator is what makes a circular queue \"circular\" — rear = (rear + 1) % size is the standard formula for wrapping an index back to 0 once it passes the last valid index.",
    diagram:
      "  CIRCULAR QUEUE (size 5), after some enqueues/dequeues\n\n        [ _ ][ _ ][30][40][50]\n index:   0    1    2   3   4\n                 ▲              ▲\n               front           rear\n\n  Next enqueue wraps rear to index 0 (freed by earlier dequeues),\n  instead of reporting the queue as full.",
    code: "class CircularQueue {\n    #items;\n    #front = 0;\n    #rear = 0;\n    #size = 0;\n\n    constructor(capacity) {\n        this.#items = new Array(capacity);\n    }\n\n    enqueue(value) {\n        if (this.#size === this.#items.length) throw new Error(\"Queue is full\");\n        this.#items[this.#rear] = value;\n        this.#rear = (this.#rear + 1) % this.#items.length;   // wraps around\n        this.#size++;\n    }\n\n    dequeue() {\n        if (this.#size === 0) throw new Error(\"Queue is empty\");\n        const value = this.#items[this.#front];\n        this.#front = (this.#front + 1) % this.#items.length;\n        this.#size--;\n        return value;\n    }\n}",
    codeLanguage: "JavaScript",
    tags: ["Circular Queue", "Queue", "Modulo", "Data Structures"],
  },
  {
    id: 130,
    slug: "priority-queue",
    section: "Data Structures & Algorithms",
    parentSlug: "queue",
    title: "Priority Queue",
    tagline: "A queue where each element has a priority, and the highest-priority element is served first, regardless of arrival order",
    description:
      "<b>What a Priority Queue Is, in Plain English</b>\nThink of a hospital emergency room: patients aren't treated strictly in the order they walked in — the most critical patient is seen first, even if they arrived last. A priority queue works the same way: every element is given a priority, and the element with the highest priority is always removed first, with arrival order only used as a tie-breaker.\n\n<b>Why Priority Queues Matter</b>\nMany real scheduling problems aren't strictly first-come-first-served — an operating system may need to run an urgent task before an older, low-priority one.\n\n<b>How to Implement One</b>\n• <b>Sorted array/list</b> — insert each new element into its correct sorted position; simple, but insertion takes O(n) since elements may need to shift.\n• <b>Heap (binary heap)</b> — the standard, efficient implementation; keeps the highest (or lowest) priority element easily accessible at the root, giving O(log n) insertion and removal instead of a sorted list's O(n).\n\n<b>Where Priority Queues Are Used</b>\nCPU task scheduling, Dijkstra's shortest-path algorithm, and Huffman coding (data compression) all rely on a priority queue to always process the most urgent/nearest/most-frequent item next.",
    note:
      "Exam favourite: a naive sorted-array priority queue has O(n) insertion; a heap-based priority queue reduces that to O(log n) — this is why the heap is described as the \"standard\" way to implement a priority queue.",
    diagram:
      "  EMERGENCY ROOM, AS A PRIORITY QUEUE\n\n  Arrived: Ticket#1 (priority 1) → Ticket#2 (priority 5) → Ticket#3 (priority 2)\n\n  Served in priority order, not arrival order:\n  Ticket#2 (priority 5) → Ticket#3 (priority 2) → Ticket#1 (priority 1)",
    code: "class PriorityQueue {\n    #items = [];   // each item: { value, priority }\n\n    enqueue(value, priority) {\n        this.#items.push({ value, priority });\n        this.#items.sort((a, b) => b.priority - a.priority);   // highest priority first\n    }\n\n    dequeue() {\n        return this.#items.shift()?.value;   // removes the highest-priority element\n    }\n}\n\nconst pq = new PriorityQueue();\npq.enqueue(\"Low-priority ticket\", 1);\npq.enqueue(\"Server down!\", 5);\npq.enqueue(\"Typo fix\", 2);\nconsole.log(pq.dequeue());   // \"Server down!\" — highest priority, served first",
    codeLanguage: "JavaScript",
    tags: ["Priority Queue", "Queue", "Heap", "Dijkstra", "Data Structures"],
  },
  {
    id: 131,
    slug: "non-linear-data-structures",
    section: "Data Structures & Algorithms",
    parentSlug: "data-structures",
    title: "Non-Linear Data Structure",
    tagline: "Data structures where elements branch out or connect in multiple directions, with no single sequential path from first to last",
    description:
      "<b>What a Non-Linear Data Structure Is, in Plain English</b>\nThink of a family tree instead of a queue at a shop counter — one person can have several children, and those children have children of their own, branching outward instead of forming one straight line. That's a non-linear data structure: an element can connect to more than one other element, so there's no single \"next\" that gets you from the first element to the last.\n\n<b>Why Non-Linear Structures Matter</b>\nMany real problems aren't naturally sequential — a file system's folders, a company's org chart, a social network's friendships, or a road map's cities and routes. Linear structures like Array or Linked List can't represent these relationships efficiently; Tree, Heap, and Graph exist specifically to model branching and many-to-many connections.\n\n<b>How This Section Is Organized</b>\n• <b>Tree</b> — a hierarchical structure where each element (node) has exactly one parent and any number of children, like Binary Tree, BST, and AVL Tree\n• <b>Heap</b> — a special tree-shaped structure that always keeps the smallest or largest element easy to find at the root\n• <b>Graph</b> — the most general structure, where any node can connect to any other node, with algorithms like BFS, DFS, and shortest path used to explore and analyse it\n  ↳ Each is covered in its own card next, with every sub-topic broken out.",
    note:
      "Exam favourite: a Tree is actually a restricted kind of Graph — one with no cycles and exactly one path between any two nodes. Every tree is a graph, but not every graph is a tree.",
    tags: ["Non-Linear Data Structure", "Tree", "Heap", "Graph", "Data Structures"],
  },
  {
    id: 132,
    slug: "tree",
    section: "Data Structures & Algorithms",
    parentSlug: "non-linear-data-structures",
    title: "Tree",
    tagline: "A hierarchical structure of nodes, where each node has one parent (except the root) and any number of children",
    description:
      "<b>What a Tree Is, in Plain English</b>\nA tree is exactly like a family tree turned upside down — one ancestor at the top (the root), branching down into children, and those children branching into their own children, and so on. Every node has exactly one parent (except the topmost node, the root, which has none), but can have any number of children.\n\n<b>Key Terms</b>\n• <b>Root</b> — the single topmost node, with no parent\n• <b>Parent / Child</b> — a node directly above / below another, connected by an edge\n• <b>Leaf</b> — a node with no children\n• <b>Height</b> — the number of edges on the longest path from the root down to a leaf\n\n<b>Why Trees Matter</b>\nTrees model naturally hierarchical data — file systems, HTML/DOM structure, organization charts, and decision-making processes — and specialised trees like BST and AVL Tree let a program search, insert, and delete data far faster than scanning through a list.\n\n<b>How This Section Is Organized</b>\n• <b>Binary Tree</b> — a tree where every node has at most two children\n• <b>Binary Search Tree (BST)</b> — a binary tree that keeps its values in sorted order, enabling fast search\n• <b>AVL Tree</b> — a self-balancing BST that keeps operations fast even in the worst case\n  ↳ Each is covered in its own card next.",
    note:
      "Exam favourite: a tree with n nodes always has exactly n − 1 edges — one edge for every node except the root.",
    diagram:
      "  A TREE, ROOTED AT THE TOP\n\n           A          ← root\n         /   \\\n        B     C\n       / \\     \\\n      D   E     F     ← D, E, F are leaves (no children)",
    tags: ["Tree", "Root", "Leaf", "Height", "Non-Linear Data Structure", "Data Structures"],
  },
  {
    id: 133,
    slug: "binary-tree",
    section: "Data Structures & Algorithms",
    parentSlug: "tree",
    title: "Binary Tree",
    tagline: "A tree in which every node has at most two children, conventionally called the left child and the right child",
    description:
      "<b>What a Binary Tree Is, in Plain English</b>\nA binary tree is a tree with a strict rule: every node can have at most two children — a left child and a right child, either of which may be missing.\n\n<b>Why Binary Trees Matter</b>\nRestricting each node to two children makes a binary tree simple to reason about and traverse, and it's the foundation every more advanced tree (BST, AVL Tree, Heap) builds on top of.\n\n<b>Types of Binary Tree</b>\n• <b>Full binary tree</b> — every node has either 0 or 2 children, never exactly 1\n• <b>Complete binary tree</b> — every level is completely filled except possibly the last, which fills left to right\n• <b>Perfect binary tree</b> — every internal node has exactly 2 children and every leaf is at the same depth\n\n<b>Traversal Orders</b>\n• <b>Pre-order</b> (root → left → right) — visit the node first, then its subtrees\n• <b>In-order</b> (left → root → right) — visits nodes in sorted order for a BST\n• <b>Post-order</b> (left → right → root) — visit both subtrees before the node itself\n• <b>Level-order</b> — visit node by node, level by level, using a queue (this is a breadth-first traversal)",
    note:
      "Exam favourite: in-order traversal of a Binary Search Tree always produces the values in ascending sorted order — a detail exams love to test directly.",
    diagram:
      "  IN-ORDER TRAVERSAL VISITS: LEFT → ROOT → RIGHT\n\n         2\n       /   \\\n      1     3\n\n  In-order: 1, 2, 3",
    code: "class Node {\n    constructor(value) {\n        this.value = value;\n        this.left = null;\n        this.right = null;\n    }\n}\n\nfunction inOrder(node, result = []) {\n    if (!node) return result;\n    inOrder(node.left, result);\n    result.push(node.value);\n    inOrder(node.right, result);\n    return result;\n}",
    codeLanguage: "JavaScript",
    tags: ["Binary Tree", "Tree Traversal", "In-order", "Pre-order", "Post-order", "Data Structures"],
  },
  {
    id: 134,
    slug: "binary-search-tree",
    section: "Data Structures & Algorithms",
    parentSlug: "tree",
    title: "Binary Search Tree (BST)",
    tagline: "A binary tree where every node's left subtree holds smaller values and its right subtree holds larger values",
    description:
      "<b>What a BST Is, in Plain English</b>\nA Binary Search Tree is a binary tree with one extra rule that makes searching fast: for every node, everything in its left subtree is smaller, and everything in its right subtree is larger. That one rule is what lets a search skip half the remaining nodes at every step, the same trick binary search uses on a sorted array.\n\n<b>Why BSTs Matter</b>\nA BST gives average O(log n) search, insertion, and deletion — much faster than a linear structure's O(n) — while still allowing values to be inserted and removed one at a time, unlike a plain sorted array where insertion means shifting elements.\n\n<b>How Searching Works</b>\nStart at the root. If the target is smaller, go left; if larger, go right; if equal, found it. Repeat until found or a null child is reached.\n\n<b>The Worst Case</b>\nIf values are inserted in already-sorted order, a BST degenerates into a straight line (essentially a linked list), and every operation drops to O(n). This is exactly the weakness an AVL Tree is built to fix.",
    note:
      "Exam favourite: a BST's O(log n) speed depends entirely on the tree staying roughly balanced — an unbalanced BST offers no speed advantage over a linked list at all.",
    diagram:
      "  A VALID BST\n\n           8\n         /   \\\n        3     10\n       / \\      \\\n      1   6      14\n\n  Left subtree of 8 (1, 3, 6) — all < 8\n  Right subtree of 8 (10, 14) — all > 8",
    code: "function insert(node, value) {\n    if (!node) return { value, left: null, right: null };\n    if (value < node.value) node.left = insert(node.left, value);\n    else node.right = insert(node.right, value);\n    return node;\n}\n\nfunction search(node, target) {\n    if (!node) return false;\n    if (node.value === target) return true;\n    return target < node.value ? search(node.left, target) : search(node.right, target);\n}",
    codeLanguage: "JavaScript",
    tags: ["Binary Search Tree", "BST", "Tree", "Searching", "Data Structures"],
  },
  {
    id: 135,
    slug: "avl-tree",
    section: "Data Structures & Algorithms",
    parentSlug: "tree",
    title: "AVL Tree",
    tagline: "A self-balancing Binary Search Tree that automatically re-balances itself after every insertion or deletion",
    description:
      "<b>What an AVL Tree Is, in Plain English</b>\nAn AVL Tree is a Binary Search Tree with a built-in fix for the BST's biggest weakness: it never lets itself become lopsided. After every insertion or deletion, it checks whether it's become unbalanced and, if so, immediately rotates a few nodes to straighten itself back out.\n\n<b>The Balance Factor</b>\nEvery node tracks a balance factor: the height of its left subtree minus the height of its right subtree. An AVL Tree requires this to always be −1, 0, or 1 for every node — the moment it goes outside that range, a rotation is triggered.\n\n<b>Rotations</b>\nFour rotation cases fix an imbalance: Left-Left, Right-Right, Left-Right, and Right-Left, named after which side became too heavy. A rotation rearranges a small number of nodes locally, in O(1) time, without rebuilding the whole tree.\n\n<b>Why AVL Trees Matter</b>\nBy staying balanced at all times, an AVL Tree guarantees O(log n) search, insertion, and deletion in every case — not just on average — solving the plain BST's worst-case O(n) problem.",
    note:
      "Exam favourite: AVL stands for Adelson-Velsky and Landis, the two Soviet inventors who introduced it in 1962 — the first self-balancing binary search tree ever described.",
    diagram:
      "  BALANCE FACTOR = height(left) − height(right), must stay in {-1, 0, 1}\n\n  Unbalanced (factor = 2)        After Left-Left rotation (balanced)\n        3                                2\n       /                                / \\\n      2                4               1   3\n     /\n    1",
    tags: ["AVL Tree", "Self-Balancing", "Binary Search Tree", "Rotation", "Data Structures"],
  },
  {
    id: 136,
    slug: "heap",
    section: "Data Structures & Algorithms",
    parentSlug: "non-linear-data-structures",
    title: "Heap",
    tagline: "A tree-shaped structure that always keeps the smallest (or largest) element instantly accessible at the root",
    description:
      "<b>What a Heap Is, in Plain English</b>\nA heap is a complete binary tree with one guarantee: every parent is always smaller (or always larger) than its children. That guarantee means the smallest — or largest — value in the entire structure is always sitting right at the root, ready to be read in O(1) time.\n\n<b>Min-Heap vs. Max-Heap</b>\n• <b>Min-heap</b> — every parent is ≤ its children, so the minimum value is always at the root\n• <b>Max-heap</b> — every parent is ≥ its children, so the maximum value is always at the root\n\n<b>Core Operations</b>\n• <b>Insert</b> — add the new value at the end, then repeatedly swap it upward (\"heapify up\") until the heap property is restored — O(log n)\n• <b>Extract (remove root)</b> — remove the root, move the last element into its place, then repeatedly swap it downward (\"heapify down\") — O(log n)\n\n<b>Why Heaps Matter</b>\nA heap is the standard way to implement a Priority Queue, and it powers algorithms like heap sort and Dijkstra's shortest path, wherever the \"next smallest/largest item\" needs to be found and removed repeatedly and efficiently.",
    note:
      "Exam favourite: a heap is NOT a Binary Search Tree — it only guarantees parent-vs-child ordering, not left-vs-right ordering, so in-order traversal of a heap does not produce sorted output.",
    diagram:
      "  A MIN-HEAP — every parent ≤ its children\n\n           1\n         /   \\\n        3     5\n       / \\\n      4   8\n\n  Root (1) is always the minimum value in the heap",
    tags: ["Heap", "Min-Heap", "Max-Heap", "Priority Queue", "Non-Linear Data Structure", "Data Structures"],
  },
  {
    id: 137,
    slug: "graph",
    section: "Data Structures & Algorithms",
    parentSlug: "non-linear-data-structures",
    title: "Graph",
    tagline: "A collection of nodes (vertices) connected by edges, where any node can connect to any number of other nodes",
    description:
      "<b>What a Graph Is, in Plain English</b>\nA graph is the most flexible data structure of them all: a set of points (vertices, or nodes) connected by lines (edges), with no rule at all about how many connections a node can have or in what pattern. A road map, a social network, and the internet's link structure are all graphs.\n\n<b>Key Terms</b>\n• <b>Vertex (node)</b> — a single point in the graph\n• <b>Edge</b> — a connection between two vertices\n• <b>Directed graph</b> — edges have a direction (A → B doesn't mean B → A), like a one-way street\n• <b>Undirected graph</b> — edges go both ways, like a two-way friendship\n• <b>Weighted graph</b> — each edge carries a cost or distance, like the length of a road\n\n<b>How Graphs Are Stored</b>\n• <b>Adjacency matrix</b> — a grid of size V×V, where cell [i][j] marks whether an edge exists between vertex i and j; simple, but wastes space on sparse graphs\n• <b>Adjacency list</b> — each vertex keeps a list of the vertices it directly connects to; the standard choice, since most real graphs are sparse\n\n<b>How This Section Is Organized</b>\n• <b>BFS</b> — explores a graph level by level, outward from a starting node\n• <b>DFS</b> — explores a graph by going as deep as possible down one path before backtracking\n• <b>Shortest Path</b> — algorithms that find the lowest-cost route between two nodes\n  ↳ Each is covered in its own card next.",
    note:
      "Exam favourite: a tree is just a graph with no cycles and exactly one path between any two nodes — every tree is a graph, but a graph is not necessarily a tree.",
    diagram:
      "  AN UNDIRECTED, WEIGHTED GRAPH\n\n      A ──5── B\n      │       │\n      2       1\n      │       │\n      C ──3── D",
    tags: ["Graph", "Vertex", "Edge", "Adjacency List", "Non-Linear Data Structure", "Data Structures"],
  },
  {
    id: 138,
    slug: "bfs",
    section: "Data Structures & Algorithms",
    parentSlug: "graph",
    title: "BFS (Breadth-First Search)",
    tagline: "Explores a graph level by level, visiting every neighbour of the current node before moving deeper",
    description:
      "<b>What BFS Is, in Plain English</b>\nBFS explores a graph the way ripples spread across a pond — it visits everything one step away first, then everything two steps away, then three, and so on, expanding outward in complete rings rather than shooting off down one path.\n\n<b>How It Works</b>\nStart at a source node, mark it visited, and add it to a queue. Then repeatedly: remove a node from the front of the queue, and add each of its unvisited neighbours to the back of the queue, marking them visited immediately so they aren't queued twice.\n\n<b>Why It Uses a Queue</b>\nA queue (FIFO) guarantees nodes are processed in the order they were discovered — which is exactly what makes BFS explore level by level instead of diving deep down one branch.\n\n<b>Why BFS Matters</b>\nBFS is the standard way to find the shortest path between two nodes when every edge has the same weight (or no weight at all), because the first time it reaches a node, it's guaranteed to be by the fewest possible edges.",
    note:
      "Exam favourite: BFS uses a Queue; DFS uses a Stack (or recursion, which behaves like a stack) — this single distinction is one of the most commonly tested facts about graph traversal.",
    diagram:
      "  BFS FROM A — visits level by level\n\n        A            Level 0: A\n       / \\           Level 1: B, C\n      B   C          Level 2: D, E\n      |   |\n      D   E\n\n  Visit order: A, B, C, D, E",
    code: "function bfs(graph, start) {\n    const visited = new Set([start]);\n    const queue = [start];\n    const order = [];\n\n    while (queue.length > 0) {\n        const node = queue.shift();\n        order.push(node);\n        for (const neighbour of graph[node]) {\n            if (!visited.has(neighbour)) {\n                visited.add(neighbour);\n                queue.push(neighbour);\n            }\n        }\n    }\n    return order;\n}",
    codeLanguage: "JavaScript",
    tags: ["BFS", "Breadth-First Search", "Graph", "Queue", "Shortest Path", "Data Structures"],
  },
  {
    id: 139,
    slug: "dfs",
    section: "Data Structures & Algorithms",
    parentSlug: "graph",
    title: "DFS (Depth-First Search)",
    tagline: "Explores a graph by going as far as possible down one path before backtracking to try another",
    description:
      "<b>What DFS Is, in Plain English</b>\nDFS explores a graph the way someone solving a maze might: pick a direction and keep going as deep as possible, and only turn back (backtrack) once you hit a dead end, then try the next unexplored direction.\n\n<b>How It Works</b>\nStart at a source node, mark it visited, then recursively visit an unvisited neighbour, going as deep as possible before returning to try the next neighbour. This can be written recursively, or iteratively using an explicit stack instead of the call stack.\n\n<b>Why It Uses a Stack</b>\nA stack (LIFO) always processes the most recently discovered node next, which is exactly what sends DFS deeper down one path instead of spreading outward level by level like BFS.\n\n<b>Why DFS Matters</b>\nDFS is used to detect cycles, check whether a graph is connected, find connected components, and perform topological sorting — problems where exploring an entire path fully matters more than finding the shortest one.",
    note:
      "Exam favourite: DFS is naturally written with recursion because a function's own call stack behaves exactly like an explicit stack — this is why DFS pseudocode looks so much shorter than BFS's.",
    diagram:
      "  DFS FROM A — goes deep before backtracking\n\n        A\n       / \\\n      B   C\n      |\n      D\n\n  Visit order: A, B, D (dead end, backtrack), C",
    code: "function dfs(graph, start, visited = new Set(), order = []) {\n    visited.add(start);\n    order.push(start);\n    for (const neighbour of graph[start]) {\n        if (!visited.has(neighbour)) {\n            dfs(graph, neighbour, visited, order);\n        }\n    }\n    return order;\n}",
    codeLanguage: "JavaScript",
    tags: ["DFS", "Depth-First Search", "Graph", "Stack", "Recursion", "Data Structures"],
  },
  {
    id: 140,
    slug: "shortest-path",
    section: "Data Structures & Algorithms",
    parentSlug: "graph",
    title: "Shortest Path",
    tagline: "Algorithms that find the lowest-cost route between two nodes in a graph",
    description:
      "<b>What Shortest Path Means, in Plain English</b>\nGiven a starting point and a destination on a map, the shortest path problem asks: what's the cheapest way to get from one to the other, where \"cheapest\" might mean fewest roads, shortest distance, or least time, depending on what each edge's weight represents?\n\n<b>Unweighted Graphs — Use BFS</b>\nWhen every edge counts the same (no weights), BFS alone finds the shortest path, since it always reaches a node by the fewest possible edges first.\n\n<b>Weighted Graphs — Dijkstra's Algorithm</b>\nWhen edges have different weights (e.g. real distances), Dijkstra's algorithm finds the shortest path from a single source to every other node. It repeatedly picks the closest unvisited node (using a Priority Queue for efficiency), then updates its neighbours' distances if going through that node is cheaper than what's currently known.\n  ↳ Dijkstra's algorithm requires all edge weights to be non-negative — it fails on graphs with negative weights.\n\n<b>Negative Weights — Bellman-Ford Algorithm</b>\nWhen a graph can have negative edge weights, Bellman-Ford is used instead — slower than Dijkstra's (O(V·E) vs O((V+E) log V)), but able to also detect negative-weight cycles, which would otherwise make \"shortest path\" undefined.",
    note:
      "Exam favourite: Dijkstra's algorithm is a greedy algorithm — at every step it commits to the closest node found so far and never reconsiders that choice, which is exactly why it breaks on negative weights.",
    diagram:
      "  DIJKSTRA FROM A — shortest distance to each node\n\n      A ──4── B          Distances from A:\n      │       │          A = 0\n      2       1          C = 2\n      │       │          D = 2 + 3 = 5\n      C ──3── D           (cheaper than A→B→D = 4+1=5, tie; picks lower total)",
    tags: ["Shortest Path", "Dijkstra", "Bellman-Ford", "Graph", "BFS", "Priority Queue", "Data Structures"],
  },
  {
    id: 141,
    slug: "algorithms",
    section: "Data Structures & Algorithms",
    parentSlug: "data-structures",
    title: "Algorithms",
    tagline: "The core searching, sorting, and complexity-analysis techniques every data structure question builds on",
    description:
      "<b>What This Covers</b>\nWhile Linear and Non-Linear Data Structures cover how data is organized, this section covers what you actually do with that data — finding a value, putting it in order, and measuring how efficient an approach is compared to another.\n\n<b>Why Algorithms Matter</b>\nThe same data structure can be searched or sorted many different ways, and each way has a real, measurable cost. Knowing which algorithm to reach for — and being able to state its time and space complexity — is one of the most heavily tested skills in the DSA portion of the exam.\n\n<b>How This Section Is Organized</b>\n• <b>Searching</b> — Linear Search and Binary Search, the two standard ways to find a value\n• <b>Sorting</b> — Bubble, Selection, Insertion, Merge, and Quick Sort, the five sorting algorithms most commonly asked about\n• <b>Complexity</b> — Big O notation, time complexity, and space complexity, the language used to measure and compare every algorithm above\n  ↳ Each is covered in its own card next, with every sub-topic broken out.",
    note:
      "Exam favourite: always be ready to state an algorithm's best, average, and worst-case time complexity separately — Quick Sort, for example, is O(n log n) on average but degrades to O(n²) in the worst case.",
    tags: ["Algorithms", "Searching", "Sorting", "Complexity", "Data Structures"],
  },
  {
    id: 142,
    slug: "searching-algorithms",
    section: "Data Structures & Algorithms",
    parentSlug: "algorithms",
    title: "Searching",
    tagline: "Finding whether a target value exists within a collection, and where",
    description:
      "<b>What Searching Is, in Plain English</b>\nSearching answers one question: is this value present, and if so, where? The two standard approaches trade off simplicity against speed, depending on whether the data is already sorted.\n\n<b>Why Searching Matters</b>\nLooking a value up is one of the most frequent operations any program performs, and the exam consistently tests the difference in speed, requirements, and use case between the two core searching algorithms.\n\n<b>How This Section Is Organized</b>\n• <b>Linear Search</b> — checks every element one by one; works on any collection, sorted or not\n• <b>Binary Search</b> — repeatedly halves the search space; requires the collection to already be sorted\n  ↳ Each is covered in its own card next.",
    note:
      "Exam favourite: binary search's O(log n) speed is only possible because the data is sorted first — sorting itself costs at least O(n log n), so binary search only pays off when the same sorted data will be searched many times.",
    tags: ["Searching", "Linear Search", "Binary Search", "Algorithms", "Data Structures"],
  },
  {
    id: 143,
    slug: "linear-search",
    section: "Data Structures & Algorithms",
    parentSlug: "searching-algorithms",
    title: "Linear Search",
    tagline: "Checks every element one by one, from the start, until it finds the target or reaches the end",
    description:
      "<b>What Linear Search Is, in Plain English</b>\nLinear search is the most straightforward way to find something: start at the first element and check it, then the next, then the next, stopping the moment the target is found — exactly like flipping through a phone book page by page from the very first page.\n\n<b>How It Works</b>\nCompare the target against each element in order. If a match is found, return its index. If the end of the collection is reached with no match, the target isn't present.\n\n<b>Time and Space Complexity</b>\n• Best case — O(1), the target is the very first element\n• Worst case / average case — O(n), the target is last, or absent entirely\n• Space — O(1), no extra memory is needed beyond the input itself\n\n<b>Why Use Linear Search</b>\nIt's the only option when the data isn't sorted, and it's simple enough that for small collections, its O(n) cost barely matters in practice.",
    note:
      "Exam favourite: linear search works on any collection, sorted or not — that flexibility is exactly what binary search trades away for speed.",
    diagram:
      "  LINEAR SEARCH FOR 23 IN [4, 8, 15, 16, 23, 42]\n\n  Check 4≠23 → check 8≠23 → check 15≠23 → check 16≠23 → check 23=23 ✓ found at index 4",
    code: "function linearSearch(arr, target) {\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i] === target) return i;\n    }\n    return -1;\n}",
    codeLanguage: "JavaScript",
    tags: ["Linear Search", "Searching", "Algorithms", "Data Structures"],
  },
  {
    id: 144,
    slug: "binary-search",
    section: "Data Structures & Algorithms",
    parentSlug: "searching-algorithms",
    title: "Binary Search",
    tagline: "Repeatedly checks the middle of a sorted collection, discarding the half that can't contain the target",
    description:
      "<b>What Binary Search Is, in Plain English</b>\nBinary search is the phone-book trick: open to the middle, decide which half the name must be in based on alphabetical order, then repeat that same trick on just that half — throwing away half the remaining possibilities at every single step.\n\n<b>How It Works</b>\nCompare the target to the middle element. If they're equal, done. If the target is smaller, discard the right half and search the left half; if larger, discard the left half and search the right half. Repeat until found or the search space is empty.\n\n<b>Requirement</b>\nBinary search only works on a sorted collection — the moment the data isn't sorted, this halving trick no longer guarantees which side the target is on.\n\n<b>Time and Space Complexity</b>\n• Time — O(log n), since the search space is cut in half every step\n• Space — O(1) for the iterative version, or O(log n) for a recursive version, due to the call stack",
    note:
      "Exam favourite: doubling the size of the input only adds one extra step to binary search — this is the defining property of logarithmic time, and a favourite exam trick question.",
    diagram:
      "  BINARY SEARCH FOR 23 IN [4, 8, 15, 16, 23, 42, 50]\n\n  Step 1: low=0 high=6 mid=3 → arr[3]=16 < 23 → search right half\n  Step 2: low=4 high=6 mid=5 → arr[5]=42 > 23 → search left half\n  Step 3: low=4 high=4 mid=4 → arr[4]=23 = 23 → found at index 4",
    code: "function binarySearch(arr, target) {   // arr must already be sorted\n    let low = 0, high = arr.length - 1;\n    while (low <= high) {\n        const mid = Math.floor((low + high) / 2);\n        if (arr[mid] === target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}",
    codeLanguage: "JavaScript",
    tags: ["Binary Search", "Searching", "Algorithms", "Data Structures"],
  },
  {
    id: 145,
    slug: "sorting-algorithms",
    section: "Data Structures & Algorithms",
    parentSlug: "algorithms",
    title: "Sorting",
    tagline: "Arranging a collection's elements into a defined order, using one of several algorithms with different trade-offs",
    description:
      "<b>What Sorting Is, in Plain English</b>\nSorting means rearranging a collection so its elements go from smallest to largest (or largest to smallest). It sounds like one problem, but there are many different ways to do it, and each one trades off speed, memory use, and simplicity differently.\n\n<b>Why Sorting Matters</b>\nSorted data unlocks faster algorithms elsewhere — binary search, for one — and comparing the five algorithms below by time complexity, space complexity, and whether they're stable is one of the most exam-tested topics in all of DSA.\n\n<b>How This Section Is Organized</b>\n• <b>Bubble Sort</b> — repeatedly swaps adjacent out-of-order pairs; simplest, but slowest\n• <b>Selection Sort</b> — repeatedly picks the smallest remaining element and places it\n• <b>Insertion Sort</b> — builds the sorted portion one element at a time, like sorting a hand of playing cards\n• <b>Merge Sort</b> — splits the collection in half repeatedly, sorts each half, then merges them back together\n• <b>Quick Sort</b> — picks a pivot and partitions the rest around it, recursively\n  ↳ Each is covered in its own card next.",
    note:
      "Exam favourite: Bubble, Selection, and Insertion Sort are all O(n²) in the worst case; Merge Sort and Quick Sort are the O(n log n) upgrades — know which category each algorithm falls into.",
    tags: ["Sorting", "Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "Algorithms", "Data Structures"],
  },
  {
    id: 146,
    slug: "bubble-sort",
    section: "Data Structures & Algorithms",
    parentSlug: "sorting-algorithms",
    title: "Bubble Sort",
    tagline: "Repeatedly steps through the collection, swapping adjacent elements that are in the wrong order",
    description:
      "<b>What Bubble Sort Is, in Plain English</b>\nBubble sort compares each pair of neighbouring elements and swaps them if they're in the wrong order, then moves to the next pair — repeating full passes over the collection until nothing needs swapping anymore. Larger values \"bubble up\" toward the end with each pass, which is where the name comes from.\n\n<b>How It Works</b>\nOn each pass, compare every adjacent pair left to right, swapping when the left element is bigger than the right. After each full pass, the largest unsorted element is guaranteed to be in its final position, so the next pass can ignore it.\n\n<b>Time and Space Complexity</b>\n• Best case — O(n), if the collection is already sorted and an early-exit check is used\n• Worst case / average case — O(n²)\n• Space — O(1), sorts in place\n\n<b>Why It's Rarely Used in Practice</b>\nBubble sort is almost always the slowest of the O(n²) sorts in practice, despite sharing the same worst-case complexity as Selection and Insertion Sort — it's taught mainly because it's the simplest sort to understand and trace by hand.",
    note:
      "Exam favourite: adding an early-exit flag (stop if no swaps happened in a pass) is what gives bubble sort its best-case O(n) — without it, bubble sort is always O(n²), even on already-sorted input.",
    diagram:
      "  ONE PASS OF BUBBLE SORT ON [5, 1, 4, 2]\n\n  [5,1,4,2] → compare 5,1 → swap → [1,5,4,2]\n  → compare 5,4 → swap → [1,4,5,2]\n  → compare 5,2 → swap → [1,4,2,5]   ← 5 is now in its final position",
    code: "function bubbleSort(arr) {\n    for (let i = 0; i < arr.length - 1; i++) {\n        for (let j = 0; j < arr.length - 1 - i; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n            }\n        }\n    }\n    return arr;\n}",
    codeLanguage: "JavaScript",
    tags: ["Bubble Sort", "Sorting", "Algorithms", "Data Structures"],
  },
  {
    id: 147,
    slug: "selection-sort",
    section: "Data Structures & Algorithms",
    parentSlug: "sorting-algorithms",
    title: "Selection Sort",
    tagline: "Repeatedly finds the smallest remaining element and moves it into its correct position",
    description:
      "<b>What Selection Sort Is, in Plain English</b>\nSelection sort divides the collection into a sorted part (at the front, initially empty) and an unsorted part. On each pass, it scans the entire unsorted part to find the smallest value, then swaps it into the next open slot at the end of the sorted part.\n\n<b>How It Works</b>\nFor each position, scan the rest of the collection to find the minimum value, then swap it into the current position. Move to the next position and repeat, scanning one fewer element each time.\n\n<b>Time and Space Complexity</b>\n• All cases — O(n²), since a full scan for the minimum is required on every pass, even if the collection is already sorted\n• Space — O(1), sorts in place\n\n<b>Selection Sort vs. Bubble Sort</b>\nBoth are O(n²), but selection sort makes far fewer swaps — at most n − 1 total swaps, versus bubble sort's potentially many swaps per pass — which matters when swapping is an expensive operation.",
    note:
      "Exam favourite: selection sort's worst case, best case, and average case are all O(n²) — unlike bubble or insertion sort, it has no best-case speedup for already-sorted input, since it always scans the full remaining unsorted portion.",
    diagram:
      "  ONE PASS OF SELECTION SORT ON [5, 1, 4, 2]\n\n  Scan all → smallest is 1 (index 1) → swap with index 0 → [1, 5, 4, 2]\n  Next pass scans [5, 4, 2] → smallest is 2 → swap → [1, 2, 4, 5]",
    code: "function selectionSort(arr) {\n    for (let i = 0; i < arr.length - 1; i++) {\n        let minIndex = i;\n        for (let j = i + 1; j < arr.length; j++) {\n            if (arr[j] < arr[minIndex]) minIndex = j;\n        }\n        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];\n    }\n    return arr;\n}",
    codeLanguage: "JavaScript",
    tags: ["Selection Sort", "Sorting", "Algorithms", "Data Structures"],
  },
  {
    id: 148,
    slug: "insertion-sort",
    section: "Data Structures & Algorithms",
    parentSlug: "sorting-algorithms",
    title: "Insertion Sort",
    tagline: "Builds the sorted portion one element at a time, inserting each new element into its correct position",
    description:
      "<b>What Insertion Sort Is, in Plain English</b>\nInsertion sort works the way most people sort a hand of playing cards: pick up one card at a time from the unsorted pile, and slide it into its correct position among the cards already sorted in your hand.\n\n<b>How It Works</b>\nStarting from the second element, compare it to the elements before it, shifting larger elements one position to the right, until the correct spot is found for the current element to be inserted.\n\n<b>Time and Space Complexity</b>\n• Best case — O(n), if the collection is already sorted, since each element only needs to be compared once before it's confirmed in place\n• Worst case / average case — O(n²)\n• Space — O(1), sorts in place\n\n<b>Why It's Actually Useful</b>\nUnlike bubble and selection sort, insertion sort's best-case O(n) makes it genuinely fast on nearly-sorted data, and it's the algorithm many real sorting libraries fall back to for small sub-arrays inside a larger merge sort or quick sort.",
    note:
      "Exam favourite: insertion sort is stable (it never reorders equal elements relative to each other) and adaptive (it speeds up on nearly-sorted input) — two properties bubble and selection sort don't both guarantee as reliably.",
    diagram:
      "  INSERTING 2 INTO THE SORTED PORTION [1, 4, 5]\n\n  [1, 4, 5 | 2, 3]   ← 2 is the next card to insert\n  Shift 5 right, shift 4 right, insert 2 → [1, 2, 4, 5 | 3]",
    code: "function insertionSort(arr) {\n    for (let i = 1; i < arr.length; i++) {\n        const current = arr[i];\n        let j = i - 1;\n        while (j >= 0 && arr[j] > current) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = current;\n    }\n    return arr;\n}",
    codeLanguage: "JavaScript",
    tags: ["Insertion Sort", "Sorting", "Algorithms", "Data Structures"],
  },
  {
    id: 149,
    slug: "merge-sort",
    section: "Data Structures & Algorithms",
    parentSlug: "sorting-algorithms",
    title: "Merge Sort",
    tagline: "Splits the collection in half recursively, sorts each half, then merges the sorted halves back together",
    description:
      "<b>What Merge Sort Is, in Plain English</b>\nMerge sort follows the classic \"divide and conquer\" idea: split the collection in half, split each half in half again, and keep going until each piece is a single element (trivially sorted) — then merge pairs of sorted pieces back together, in sorted order, all the way back up.\n\n<b>How It Works</b>\n• <b>Divide</b> — split the collection into two halves, recursively, until each piece has one element\n• <b>Merge</b> — repeatedly combine two sorted pieces into one sorted piece, by comparing their front elements and taking the smaller one each time\n\n<b>Time and Space Complexity</b>\n• All cases — O(n log n), since splitting takes log n levels and merging at each level costs O(n) total\n• Space — O(n), since merging needs a separate array to build each merged result\n\n<b>Why Merge Sort Matters</b>\nMerge sort's O(n log n) holds in every case, not just on average — unlike quick sort — making it a reliable choice when worst-case performance matters, at the cost of using extra memory.",
    note:
      "Exam favourite: merge sort is stable and has a guaranteed O(n log n) worst case, but needs O(n) extra space — this space cost is exactly what quick sort avoids by sorting in place.",
    diagram:
      "  MERGE SORT ON [5, 1, 4, 2]\n\n  Divide:  [5,1,4,2] → [5,1] [4,2] → [5][1] [4][2]\n  Merge:   [5][1] → [1,5]     [4][2] → [2,4]\n  Merge:   [1,5] + [2,4] → [1,2,4,5]",
    code: "function mergeSort(arr) {\n    if (arr.length <= 1) return arr;\n    const mid = Math.floor(arr.length / 2);\n    const left = mergeSort(arr.slice(0, mid));\n    const right = mergeSort(arr.slice(mid));\n    return merge(left, right);\n}\n\nfunction merge(left, right) {\n    const result = [];\n    let i = 0, j = 0;\n    while (i < left.length && j < right.length) {\n        result.push(left[i] <= right[j] ? left[i++] : right[j++]);\n    }\n    return [...result, ...left.slice(i), ...right.slice(j)];\n}",
    codeLanguage: "JavaScript",
    tags: ["Merge Sort", "Sorting", "Divide and Conquer", "Algorithms", "Data Structures"],
  },
  {
    id: 150,
    slug: "quick-sort",
    section: "Data Structures & Algorithms",
    parentSlug: "sorting-algorithms",
    title: "Quick Sort",
    tagline: "Picks a pivot element and partitions the rest around it, then recursively sorts each partition",
    description:
      "<b>What Quick Sort Is, in Plain English</b>\nQuick sort picks one element (the pivot), then rearranges the rest so everything smaller than the pivot ends up on its left and everything larger ends up on its right — after which the pivot itself is already in its final sorted position. It then repeats the same trick on the left and right partitions independently.\n\n<b>How It Works</b>\n• <b>Choose a pivot</b> — commonly the last element, first element, or a random one\n• <b>Partition</b> — rearrange elements so everything smaller than the pivot comes before it, everything larger comes after\n• <b>Recurse</b> — apply the same process to the left and right partitions\n\n<b>Time and Space Complexity</b>\n• Best case / average case — O(n log n)\n• Worst case — O(n²), if the pivot chosen is repeatedly the smallest or largest element (e.g. an already-sorted array with a naive pivot choice)\n• Space — O(log n) for the recursion stack, since it sorts in place rather than allocating new arrays\n\n<b>Why Quick Sort Matters</b>\nQuick sort is usually faster in practice than merge sort despite having a worse worst case, because it sorts in place (less memory allocation overhead) and its average case is very close to its best case for most real-world data. A random or median pivot choice makes the O(n²) worst case extremely unlikely.",
    note:
      "Exam favourite: quick sort's worst case (O(n²)) happens specifically when the pivot is always the smallest or largest remaining element — this is why a poor pivot choice on an already-sorted array is a classic exam trap.",
    diagram:
      "  QUICK SORT ON [5, 1, 4, 2], PIVOT = LAST ELEMENT (2)\n\n  Partition around 2 → [1] 2 [5, 4]   ← 2 is now in its final position\n  Recurse left  [1] → already sorted\n  Recurse right [5,4] → pivot 4 → [4] then [5] → [4,5]\n  Result: [1, 2, 4, 5]",
    code: "function quickSort(arr) {\n    if (arr.length <= 1) return arr;\n    const pivot = arr[arr.length - 1];\n    const left = [], right = [];\n    for (let i = 0; i < arr.length - 1; i++) {\n        (arr[i] < pivot ? left : right).push(arr[i]);\n    }\n    return [...quickSort(left), pivot, ...quickSort(right)];\n}",
    codeLanguage: "JavaScript",
    tags: ["Quick Sort", "Sorting", "Divide and Conquer", "Algorithms", "Data Structures"],
  },
  {
    id: 151,
    slug: "complexity",
    section: "Data Structures & Algorithms",
    parentSlug: "algorithms",
    title: "Complexity",
    tagline: "The language used to describe how an algorithm's runtime and memory use grow as the input size grows",
    description:
      "<b>What Complexity Means, in Plain English</b>\nComplexity answers one question: if the input gets bigger, how much slower (or more memory-hungry) does the algorithm get? It's not about how fast an algorithm runs on one specific machine — it's about the growth pattern, which stays true regardless of hardware.\n\n<b>Why Complexity Matters</b>\nComparing two algorithms by complexity, rather than by a single timed run, is what lets you predict which one will still be usable when the input grows from 100 items to 10 million — a linear search that feels instant on 100 items can take minutes on 10 million.\n\n<b>How This Section Is Organized</b>\n• <b>Big O Notation</b> — the notation used to express complexity, describing the worst-case growth rate\n• <b>Time Complexity</b> — how an algorithm's runtime grows with input size\n• <b>Space Complexity</b> — how much extra memory an algorithm needs as input size grows\n  ↳ Each is covered in its own card next.",
    note:
      "Exam favourite: Big O describes growth rate, not exact runtime — two algorithms can both be O(n), yet one is consistently twice as fast as the other, because Big O ignores constant factors.",
    tags: ["Complexity", "Big O Notation", "Time Complexity", "Space Complexity", "Algorithms", "Data Structures"],
  },
  {
    id: 152,
    slug: "big-o-notation",
    section: "Data Structures & Algorithms",
    parentSlug: "complexity",
    title: "Big O Notation",
    tagline: "A notation that describes an algorithm's worst-case growth rate as input size approaches infinity",
    description:
      "<b>What Big O Notation Is, in Plain English</b>\nBig O notation is a shorthand for answering \"how does this algorithm's cost scale?\" — written as O(something), where the something describes how the cost grows relative to the input size n, ignoring constant factors and smaller lower-order terms.\n\n<b>Common Complexity Classes, Fastest to Slowest</b>\n• <b>O(1)</b> — constant time; cost doesn't change with input size (e.g. array index access)\n• <b>O(log n)</b> — logarithmic; cost grows very slowly as input doubles (e.g. binary search)\n• <b>O(n)</b> — linear; cost grows directly proportional to input size (e.g. traversal)\n• <b>O(n log n)</b> — linearithmic; typical of efficient sorting algorithms (e.g. merge sort)\n• <b>O(n²)</b> — quadratic; typical of simple sorting algorithms with nested loops (e.g. bubble sort)\n• <b>O(2ⁿ)</b> — exponential; cost doubles with every additional input element (e.g. naive recursive Fibonacci)\n\n<b>Why It Ignores Constants</b>\nO(3n) and O(n) are both just written O(n), because as n grows large enough, the constant factor (3) becomes irrelevant compared to how the algorithm scales — Big O cares about the shape of the growth curve, not one specific number.",
    note:
      "Exam favourite: know this order by heart, since exams frequently ask you to rank algorithms: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).",
    diagram:
      "  GROWTH RATE AS INPUT SIZE (n) INCREASES\n\n  Cost\n   ↑                                          O(2ⁿ)\n   │                                    O(n²)\n   │                          O(n log n)\n   │                O(n)\n   │        O(log n)\n   │ O(1)\n   └──────────────────────────────────────────→ n",
    tags: ["Big O Notation", "Complexity", "Algorithms", "Data Structures"],
  },
  {
    id: 153,
    slug: "time-complexity",
    section: "Data Structures & Algorithms",
    parentSlug: "complexity",
    title: "Time Complexity",
    tagline: "A measure of how an algorithm's execution time grows as the size of its input grows",
    description:
      "<b>What Time Complexity Is, in Plain English</b>\nTime complexity measures how many steps an algorithm takes, relative to its input size, not how many seconds it takes on a particular computer — the same algorithm run on a faster machine still has the same time complexity, just a smaller constant factor.\n\n<b>Best, Average, and Worst Case</b>\n• <b>Best case</b> — the fewest steps possible, given the most favourable input (e.g. linear search finding the target immediately at index 0)\n• <b>Average case</b> — the expected number of steps across typical inputs\n• <b>Worst case</b> — the most steps possible, given the least favourable input; this is what Big O notation almost always describes\n\n<b>Why Worst Case Is the Default</b>\nExams and interviews default to worst-case complexity because it's a guarantee — you know an algorithm will never be slower than its worst case, which matters far more for reliability than knowing how fast it usually runs.\n\n<b>Examples Across This Syllabus</b>\n• Linear Search — O(n) worst case\n• Binary Search — O(log n)\n• Bubble/Selection/Insertion Sort — O(n²) worst case\n• Merge Sort — O(n log n), guaranteed in every case\n• Quick Sort — O(n log n) average, O(n²) worst case",
    note:
      "Exam favourite: Quick Sort's average-case O(n log n) versus worst-case O(n²) is one of the single most repeated complexity facts across DSA exams.",
    tags: ["Time Complexity", "Big O Notation", "Complexity", "Algorithms", "Data Structures"],
  },
  {
    id: 154,
    slug: "space-complexity",
    section: "Data Structures & Algorithms",
    parentSlug: "complexity",
    title: "Space Complexity",
    tagline: "A measure of how much extra memory an algorithm needs as the size of its input grows",
    description:
      "<b>What Space Complexity Is, in Plain English</b>\nSpace complexity measures how much additional memory an algorithm needs beyond the input itself — extra arrays, recursion call stacks, or any other working memory it allocates while running.\n\n<b>In-Place vs. Extra Memory</b>\n• <b>In-place algorithms</b> — sort or process data using only the original input's memory (or a small constant amount extra), giving O(1) space; Bubble, Selection, Insertion, and Quick Sort (excluding its recursion stack) all sort in place\n• <b>Extra-memory algorithms</b> — need additional space proportional to the input; Merge Sort needs O(n) extra space to hold the arrays being merged\n\n<b>Recursion's Hidden Cost</b>\nA recursive algorithm's space complexity includes its call stack, since every recursive call adds a frame to memory until it returns — this is why Quick Sort's recursive implementation is O(log n) space, not O(1), even though it partitions in place.\n\n<b>Why Space Complexity Matters</b>\nTwo algorithms with identical time complexity can have very different space costs — Merge Sort's guaranteed O(n log n) time comes at the cost of O(n) extra space, while Quick Sort achieves the same average time with only O(log n) space, which is exactly why quick sort is often preferred in memory-constrained environments.",
    note:
      "Exam favourite: don't forget recursive call-stack space when asked for an algorithm's space complexity — it's the most commonly missed part of the answer.",
    tags: ["Space Complexity", "Big O Notation", "Complexity", "Algorithms", "Data Structures"],
  },
  // ─────────────────────────────────────────────
  // DATABASE MANAGEMENT SYSTEM
  // ─────────────────────────────────────────────
  {
    id: 155,
    slug: "dbms",
    section: "Database Management System",
    title: "DBMS",
    tagline: "Where database theory begins — the vocabulary every other topic in this section builds on",
    description:
      "<b>What This Covers</b>\nDBMS is the foundation of this whole syllabus section — before touching data models, ER diagrams, SQL, or advanced topics, you need to be precise about the handful of terms that get mixed up constantly on exams: database, DBMS, RDBMS, schema, and instance.\n\n<b>How This Section Is Organized</b>\n• <b>Database Basics</b> — Database, DBMS, RDBMS, Schema, and Instance — the five foundational terms\n• <b>Data Models</b> — the different ways data has been structured over time (hierarchical, network, relational, object-oriented)\n  ↳ Each is covered in its own card next, always contrasted against the term or model right before it.",
    note:
      "Exam favourite: database vs DBMS is the single most repeated confusion in this chapter — database is the organized data itself, DBMS is the software that manages it.",
    diagram:
      "  DBMS TERMINOLOGY — HOW THE PIECES FIT TOGETHER\n\n  Application\n      │\n      ▼\n  DBMS   (the software — MySQL, PostgreSQL...)\n      │   RDBMS = a DBMS that is specifically relational (tables + SQL)\n      ▼\n  Database  (the organized data itself)\n      │\n      ├── Schema    = the structure/blueprint (rarely changes)\n      └── Instance  = the actual data right now (changes constantly)",
    tags: ["DBMS", "Database", "RDBMS", "Schema", "Instance"],
  },
  {
    id: 156,
    slug: "database-basics",
    section: "Database Management System",
    parentSlug: "dbms",
    title: "Database Basics",
    tagline: "Five terms exams love to mix up: database, DBMS, RDBMS, schema, and instance",
    description:
      "<b>What This Covers</b>\nDatabase Basics nails down the five terms most exams test right at the start of any DBMS syllabus — the difference between the data itself, the software managing it, its relational flavour, its blueprint, and its live content.\n\n<b>How This Section Is Organized</b>\n• <b>Database</b> — the organized data itself\n• <b>DBMS</b> — the software layer that manages that data\n• <b>RDBMS</b> — a DBMS that specifically stores data as related tables\n• <b>Schema</b> — the structural blueprint the data follows\n• <b>Instance</b> — the actual data present at one specific moment\n  ↳ Each is covered in its own card next, always contrasted against the term before it.",
    note:
      "Exam favourite: schema vs instance is the second most repeated confusion here — schema is the design (changes rarely, via migrations), instance is the data snapshot right now (changes with every insert/update/delete).",
    tags: ["Database Basics", "DBMS", "Fundamentals"],
  },
  {
    id: 157,
    slug: "database",
    section: "Database Management System",
    parentSlug: "database-basics",
    title: "Database",
    tagline: "An organized collection of related data stored for easy access, management, and updates",
    description:
      "<b>What a Database Is, in Plain English</b>\nA database is a digital filing cabinet: instead of paper folders, data lives in structured files on a disk; instead of searching drawer by drawer, you query directly for the record you need; and multiple people can read and update the same cabinet at the same time, safely.\n\n<b>Why Not Just Use a Spreadsheet or a Text File?</b>\n• Files do not enforce structure — anyone can type anything anywhere\n• Files do not handle multiple simultaneous writers safely\n• Files have no built-in way to search, filter, or relate data across tables\n• Files cannot easily enforce rules like \"age must be a number\" or \"email must be unique\"\n\n<b>Common Examples</b>\n• A banking app storing account balances and transactions\n• An e-commerce site storing products, orders, and customers\n• A social app storing users, posts, and comments",
    note:
      "Exam favourite: a database is just the data itself. The software that lets you create, read, update, and delete that data is a separate thing, called a DBMS — don't collapse the two words into one idea.",
    code:
      "-- A tiny slice of a real database: one table, two rows\n\nCREATE TABLE customers (\n  id    INT PRIMARY KEY,\n  name  VARCHAR(100),\n  email VARCHAR(100) UNIQUE\n);\n\nINSERT INTO customers (id, name, email) VALUES\n  (1, 'Asha Gurung', 'asha@example.com'),\n  (2, 'Bikash Rai',  'bikash@example.com');\n\n-- The DATABASE is the stored data (the customers table + its rows).\n-- The software that ran these commands is the DBMS.",
    codeLanguage: "SQL",
    tags: ["Database", "Data Storage", "Fundamentals"],
  },
  {
    id: 158,
    slug: "dbms-definition",
    section: "Database Management System",
    parentSlug: "database-basics",
    title: "DBMS",
    tagline: "The software layer that creates, reads, updates, deletes, and protects a database",
    description:
      "<b>What a DBMS Is, in Plain English</b>\nA DBMS (Database Management System) is the software that sits between users/applications and the actual data files, handling every operation safely and efficiently — the engine that runs the filing cabinet from the previous card.\n\n<b>What a DBMS Actually Does</b>\n• Stores and organizes data on disk\n• Lets applications create, read, update, and delete records (CRUD)\n• Enforces rules — data types, uniqueness, required fields\n• Controls who can access what (security and permissions)\n• Manages multiple users reading/writing at the same time without corrupting data\n• Recovers data after a crash (backups, logs)\n\n<b>Why It Matters</b>\nWithout a DBMS, every application would need to write its own file-reading, locking, and validation logic from scratch — and two users updating the same record at once could easily corrupt it.\n\n<b>Examples of DBMS Software</b>\n• MySQL, PostgreSQL, Oracle, SQL Server → relational (RDBMS)\n• MongoDB, Redis, Cassandra → non-relational (NoSQL)",
    note:
      "Exam favourite: don't just say 'software that stores data' — mention the four things a DBMS guarantees: structure enforcement, concurrent access control, security, and recovery.",
    diagram:
      "  Application\n      │\n      │  SQL query / API call\n      ▼\n  ┌──────────────────────────┐\n  │           DBMS            │  ← enforces rules, manages access,\n  │  (MySQL / PostgreSQL...)   │    handles concurrency, recovery\n  └──────────────────────────┘\n      │\n      ▼\n  Database files on disk",
    tags: ["DBMS", "CRUD", "Concurrency", "Data Integrity"],
  },
  {
    id: 159,
    slug: "rdbms",
    section: "Database Management System",
    parentSlug: "database-basics",
    title: "RDBMS",
    tagline: "A DBMS that organizes data into related tables, enforced by rules and keys",
    description:
      "<b>What an RDBMS Is, in Plain English</b>\nAn RDBMS (Relational Database Management System) is a DBMS that stores data in tables (relations) made of rows and columns, and lets those tables reference each other through keys — every RDBMS is a DBMS, but not every DBMS is relational.\n\n<b>What Makes It \"Relational\"</b>\n• Data lives in tables — each table represents one type of entity (customers, orders, products)\n• Tables relate to each other through foreign keys (an order references a customer)\n• Every RDBMS enforces schema rules: fixed columns, defined data types, constraints\n\n<b>RDBMS vs Plain DBMS</b>\n• MongoDB is a DBMS but not an RDBMS — it stores flexible JSON-like documents, not related tables\n• MySQL, PostgreSQL, Oracle, SQL Server are RDBMS — they speak SQL and enforce table relationships\n\n<b>Why RDBMS Became the Industry Default</b>\n• Strong consistency — the same customer id always means the same customer\n• Powerful querying across related tables via JOINs\n• Decades of tooling, transactions, and standardization around SQL",
    note:
      "Exam favourite litmus test: 'Does it store data as tables linked by foreign keys and enforce a fixed schema?' If yes → RDBMS. If it stores flexible documents/key-value pairs without enforced relationships → NoSQL DBMS.",
    diagram:
      "  customers                  orders\n  ┌────┬─────────┐           ┌────┬─────────────┬────────┐\n  │ id │ name    │           │ id │ customer_id │ total  │\n  ├────┼─────────┤           ├────┼─────────────┼────────┤\n  │ 1  │ Asha    │ ◄─────────┤101 │      1      │ 49.99  │\n  │ 2  │ Bikash  │ ◄─────────┤102 │      2      │ 19.50  │\n  └────┴─────────┘  foreign  └────┴─────────────┴────────┘\n                      key",
    code:
      "CREATE TABLE customers (\n  id   INT PRIMARY KEY,\n  name VARCHAR(100)\n);\n\nCREATE TABLE orders (\n  id          INT PRIMARY KEY,\n  customer_id INT REFERENCES customers(id),  -- foreign key: the 'relational' part\n  total       DECIMAL(10,2)\n);\n\n-- JOIN across the relationship\nSELECT c.name, o.total\nFROM orders o\nJOIN customers c ON o.customer_id = c.id;",
    codeLanguage: "SQL",
    tags: ["RDBMS", "Tables", "Foreign Key", "SQL"],
  },
  {
    id: 160,
    slug: "schema",
    section: "Database Management System",
    parentSlug: "database-basics",
    title: "Schema",
    tagline: "The blueprint that defines what tables, columns, types, and rules a database has",
    description:
      "<b>What a Schema Is, in Plain English</b>\nA schema is the structural blueprint of a database, like the floor plan of a house: the floor plan shows where each room is and what it's for, while the furniture and people inside (the actual data) can change every day. The floor plan itself changes rarely, and only through deliberate renovation.\n\n<b>What a Schema Includes</b>\n• Table names and their columns\n• Data types per column (`INT`, `VARCHAR`, `DATE`, ...)\n• Constraints (`NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, `CHECK`)\n• Relationships between tables\n\n<b>Schema vs Data</b>\n• Schema = structure (rarely changes)\n• Data = the actual rows stored inside that structure (changes constantly)\n• Changing a schema (adding a column, renaming a table) is called a migration",
    note:
      "Exam favourite: contrast schema with instance directly — schema is the design (changes rarely, via migrations); instance is the data snapshot at a given moment (changes constantly). This pairing is a classic DBMS question.",
    diagram:
      "  SCHEMA (structure — defined once)\n  Table: users\n  ┌──────────┬──────────────┬──────────┐\n  │ column   │ type         │ rule     │\n  ├──────────┼──────────────┼──────────┤\n  │ id       │ INT          │ PRIMARY  │\n  │ email    │ VARCHAR(255) │ UNIQUE   │\n  │ created  │ DATE         │ NOT NULL │\n  └──────────┴──────────────┴──────────┘\n\n  DATA (rows — changes constantly)\n  1 | asha@example.com   | 2026-01-04\n  2 | bikash@example.com | 2026-02-11",
    code:
      "-- This CREATE TABLE statement defines the schema\nCREATE TABLE users (\n  id      INT PRIMARY KEY,\n  email   VARCHAR(255) UNIQUE NOT NULL,\n  created DATE NOT NULL DEFAULT CURRENT_DATE\n);\n\n-- Altering the schema later (a migration)\nALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;",
    codeLanguage: "SQL",
    tags: ["Schema", "Constraints", "Migration", "Structure"],
  },
  {
    id: 161,
    slug: "instance",
    section: "Database Management System",
    parentSlug: "database-basics",
    title: "Instance",
    tagline: "The actual data stored in a database at one specific moment in time",
    description:
      "<b>What an Instance Is, in Plain English</b>\nUsing the floor-plan analogy again: schema is the floor plan (fixed structure), and instance is a photo of the house right now, with people and furniture in their current positions.\n\n<b>Why the Distinction Matters</b>\n• The schema for a `users` table never changes just because someone signs up\n• But the instance changes every single time a row is inserted, updated, or deleted\n• Two databases can share the exact same schema but have completely different instances (e.g. a production database and a test database with the same table structure but different rows)\n\n<b>Instance in Practice</b>\n• `SELECT * FROM users;` returns the current instance of that table\n• Backups capture an instance at a specific timestamp\n• \"Restore to yesterday\" means going back to yesterday's instance under today's schema",
    note:
      "Exam favourite trap: 'what changes more often, schema or instance?' Answer instance — schema changes are deliberate migrations, instance changes with every ordinary insert/update/delete.",
    diagram:
      "  Schema (fixed):  users(id, name, email)\n\n  Instance at 9:00am:         Instance at 9:05am:\n  1 | Asha   | asha@...       1 | Asha   | asha@...\n  2 | Bikash | bikash@...     2 | Bikash | bikash@...\n                              3 | Kiran  | kiran@...   ← new row inserted\n\n  Same schema, different instance.",
    code:
      "-- Schema stays the same, instance changes with every write\nINSERT INTO users (id, name, email) VALUES (3, 'Kiran Thapa', 'kiran@example.com');\n\n-- The instance right now:\nSELECT * FROM users;\n-- returns whatever rows currently exist -- this result set IS the instance",
    codeLanguage: "SQL",
    tags: ["Instance", "Schema", "Data Snapshot"],
  },
  {
    id: 162,
    slug: "data-models",
    section: "Database Management System",
    parentSlug: "dbms",
    title: "Data Models",
    tagline: "The different ways database designers have structured data over time — trees, graphs, tables, and objects",
    description:
      "<b>What This Covers</b>\nBefore the relational model became the industry standard, database designers experimented with different ways to structure data — as a tree, as a graph, as related tables, and as objects. This section covers all four, and why the relational model won.\n\n<b>How This Section Is Organized</b>\n• <b>Hierarchical Model</b> — data organized as a tree, one parent per child\n• <b>Network Model</b> — data organized as a graph, multiple parents allowed\n• <b>Relational Model</b> — data organized as tables linked by key values, not pointers\n• <b>Object-Oriented Model</b> — data stored as objects with classes and inheritance\n  ↳ Each model solved a limitation of the one before it — read them in order to see the progression.",
    note:
      "Exam favourite: know the ONE limitation each model fixed — hierarchical's one-parent rule, network's manual pointer navigation, and object-oriented's impedance mismatch with relational storage.",
    diagram:
      "  EVOLUTION OF DATA MODELS\n\n  Hierarchical  ──►  Network  ──►  Relational  ──►  Object-Oriented\n  (tree, 1 parent)   (graph,        (tables,          (objects, classes,\n                      many parents)  key values)       inheritance)",
    tags: ["Data Models", "Hierarchical Model", "Network Model", "Relational Model"],
  },
  {
    id: 163,
    slug: "hierarchical-model",
    section: "Database Management System",
    parentSlug: "data-models",
    title: "Hierarchical Model",
    tagline: "Data organized as a tree — each child has exactly one parent",
    description:
      "<b>What the Hierarchical Model Is, in Plain English</b>\nThink of a company org chart: the CEO is the root, each manager reports to exactly one person above them, and each employee has exactly one manager. The hierarchical model organizes data the same way — as a tree, where each record (child) has exactly one parent record, and a parent can have many children.\n\n<b>How It Works</b>\n• Data is linked with parent-child pointers, like a file system with folders and subfolders\n• To find a record, you traverse the tree from the root down\n\n<b>Limitations</b>\n• A child can only have one parent — real-world relationships are often many-to-many (a student takes many courses, a course has many students), which trees cannot represent naturally\n• Restructuring the tree requires touching many linked records\n\n<b>Where It's Still Used</b>\n• File systems (folders and files)\n• XML and JSON document structures\n• IBM's IMS (Information Management System), one of the earliest DBMS products",
    note:
      "Exam favourite: if asked to name a real system still using the hierarchical model, say 'file systems' — folders and files are a textbook hierarchical structure everyone already understands.",
    diagram:
      "              [Company]\n              /        \\\n       [Engineering]   [Sales]\n         /      \\           \\\n   [Backend]  [Frontend]   [Sales Rep]\n\n  Each box has exactly ONE parent above it.",
    tags: ["Hierarchical Model", "Tree Structure", "Data Model"],
  },
  {
    id: 164,
    slug: "network-model",
    section: "Database Management System",
    parentSlug: "data-models",
    title: "Network Model",
    tagline: "Data organized as a graph — a child can have multiple parents",
    description:
      "<b>What the Network Model Is, in Plain English</b>\nThe network model is an extension of the hierarchical model that allows a child record to have multiple parent records, forming a graph instead of a strict tree — the hierarchical model's one-parent rule couldn't represent real relationships like 'a student enrolls in many courses, and a course has many students.'\n\n<b>How It Works</b>\n• Records are connected through explicit pointers called 'sets'\n• A single record can participate as a child in multiple sets — i.e. have multiple parents\n\n<b>Limitations</b>\n• Navigating the graph requires following pointer chains manually in application code — there's no simple query language like SQL\n• Any structural change means updating pointers throughout the graph\n\n<b>Where It's Used Today</b>\n• Mostly historical (CODASYL databases from the 1970s)\n• Conceptually lives on in graph databases (Neo4j), which solved the same many-to-many problem with a modern query language",
    note:
      "Exam favourite: what problem did the network model solve that hierarchical couldn't? Many-to-many relationships. What replaced it? The relational model, using junction tables instead of manual pointers.",
    diagram:
      "  [Course: Math]     [Course: Physics]\n        \\                /\n         \\              /\n        [Student: Asha]\n         /              \\\n        /                \\\n  [Course: Chemistry]  [Student: Bikash]\n\n  Asha (a child record) has TWO parent courses — not possible in a strict tree.",
    tags: ["Network Model", "Many-to-Many", "Graph Structure", "CODASYL"],
  },
  {
    id: 165,
    slug: "relational-model",
    section: "Database Management System",
    parentSlug: "data-models",
    title: "Relational Model",
    tagline: "Data organized as tables of rows and columns, connected through keys",
    description:
      "<b>What the Relational Model Is, in Plain English</b>\nThe relational model, introduced by Edgar F. Codd in 1970, organizes data into tables (relations) made of rows (tuples) and columns (attributes), with relationships expressed through shared key values rather than physical pointers.\n\n<b>Why It Was Revolutionary</b>\n• No pointers to navigate manually — you query by value using a declarative language (SQL): \"give me all orders where customer_id = 1\"\n• Any table can relate to any other table simply by matching key values\n• Adding a new relationship doesn't require rewiring pointers, just adding a foreign key column\n\n<b>Core Building Blocks</b>\n• Table (relation) — a named collection of rows about one entity type\n• Row (tuple) — one record\n• Column (attribute) — one field of that record\n• Primary key — uniquely identifies a row\n• Foreign key — links a row to a row in another table\n\n<b>Why It Won</b>\n• Simpler mental model than trees/graphs\n• SQL gave a standard, powerful query language\n• Strong mathematical foundation (set theory, relational algebra) made it provably consistent",
    note:
      "Exam favourite: who invented the relational model and why it matters — Edgar F. Codd, 1970. The key insight was relating data by value (matching keys via SQL) instead of by physical pointer.",
    diagram:
      "  students             enrollments               courses\n  ┌────┬───────┐       ┌────────────┬───────────┐  ┌────┬─────────┐\n  │ id │ name  │       │ student_id │ course_id │  │ id │ name    │\n  ├────┼───────┤       ├────────────┼───────────┤  ├────┼─────────┤\n  │ 1  │ Asha  │◄──────┤     1      │    10     ├─►│ 10 │ Math    │\n  │ 2  │Bikash │◄──────┤     1      │    20     ├─►│ 20 │ Physics │\n  └────┴───────┘       └────────────┴───────────┘  └────┴─────────┘\n\n  No pointers — just matching key VALUES across tables.",
    code:
      "CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(100));\nCREATE TABLE courses  (id INT PRIMARY KEY, name VARCHAR(100));\nCREATE TABLE enrollments (\n  student_id INT REFERENCES students(id),\n  course_id  INT REFERENCES courses(id),\n  PRIMARY KEY (student_id, course_id)\n);\n\n-- Query the relationship by VALUE, not by pointer traversal\nSELECT s.name, c.name AS course\nFROM enrollments e\nJOIN students s ON e.student_id = s.id\nJOIN courses  c ON e.course_id  = c.id;",
    codeLanguage: "SQL",
    tags: ["Relational Model", "Codd", "SQL", "Tables", "Keys"],
  },
  {
    id: 166,
    slug: "object-oriented-model",
    section: "Database Management System",
    parentSlug: "data-models",
    title: "Object-Oriented Model",
    tagline: "Data stored as objects, with classes, inheritance, and behavior bundled together",
    description:
      "<b>What the Object-Oriented Model Is, in Plain English</b>\nThe object-oriented model stores data as objects — the same kind of object you'd use in OOP code — bundling both the data (attributes) and the behavior (methods) together, and supporting inheritance between object types.\n\n<b>How It Differs From the Relational Model</b>\n• Relational: data is flat rows in tables; there is no built-in inheritance or behavior\n• Object-oriented: data is stored as objects with classes, and a `Manager` class can inherit from an `Employee` class, reusing its structure\n\n<b>Why It Appeared</b>\n• In the 1980s–90s, applications were increasingly written in object-oriented languages (C++, Java)\n• Every time an object was saved to a relational database, it had to be manually flattened into rows — the 'object-relational impedance mismatch'\n• Object-oriented databases aimed to store objects directly, with no translation step\n\n<b>Where the Idea Lives On Today</b>\n• Rarely used as a standalone DBMS today (db4o, ObjectDB are niche)\n• The core idea survives in ORMs (Object-Relational Mappers) like Prisma, Sequelize, Hibernate — they let you code against objects while the ORM handles translating to relational tables underneath",
    note:
      "Exam favourite: why didn't object-oriented databases replace relational ones? The relational model's mathematical simplicity, SQL, and tooling ecosystem won — the impedance mismatch is instead solved today with ORMs layered on relational databases.",
    diagram:
      "  class Employee { name; salary; }\n  class Manager extends Employee { teamSize; }   ← inheritance\n\n  Object-oriented DB stores the OBJECT directly:\n  Manager { name: 'Asha', salary: 90000, teamSize: 5 }\n\n  vs. relational model needing it split across flat tables:\n  employees(id, name, salary) + managers(employee_id, team_size)",
    tags: ["Object-Oriented Model", "Inheritance", "ORM", "Impedance Mismatch"],
  },
  {
    id: 167,
    slug: "er-model",
    section: "Database Management System",
    title: "ER Model",
    tagline: "The visual planning stage before any table gets created — entities, attributes, relationships, and cardinality",
    description:
      "<b>What This Covers</b>\nBefore any table gets created, a database designer sketches out an Entity-Relationship (ER) diagram — a visual plan of what real-world things need storing, what describes them, and how they connect to each other.\n\n<b>How This Section Is Organized</b>\n• <b>Entity</b> — a real-world thing or concept to store data about\n• <b>Attribute</b> — a property that describes an entity\n• <b>Relationship</b> — how two or more entities connect\n• <b>Cardinality</b> — how many instances of one entity relate to instances of another\n  ↳ Each concept builds on the one before it: entities have attributes, entities connect via relationships, and cardinality defines the numbers in that relationship.",
    note:
      "Exam favourite: the ER-to-schema translation is a guaranteed question type — entity becomes a table, attribute becomes a column, relationship becomes a foreign key or a junction table.",
    diagram:
      "  ER MODEL — HOW THE PIECES FIT TOGETHER\n\n  ┌──────────┐  attribute\n  │ Entity A │◄──────────  (describes the entity)\n  └────┬─────┘\n       │ relationship (diamond)\n       ▼            cardinality (1:1, 1:N, M:N)\n  ┌──────────┐\n  │ Entity B │\n  └──────────┘",
    tags: ["ER Model", "Entity", "Attribute", "Relationship", "Cardinality"],
  },
  {
    id: 168,
    slug: "entity",
    section: "Database Management System",
    parentSlug: "er-model",
    title: "Entity",
    tagline: "A real-world thing or concept that a database stores information about",
    description:
      "<b>What an Entity Is, in Plain English</b>\nAn entity is a real-world object or concept that you want to store data about — a student, a product, an order, a car. In a relational database, each entity typically becomes one table.\n\n<b>Entity vs Entity Instance</b>\n• Entity = the general concept, e.g. \"Student\"\n• Entity instance = one specific occurrence, e.g. \"Asha Gurung, id 1\"\n• A table represents the entity type; each row represents one entity instance\n\n<b>Strong vs Weak Entities</b>\n• Strong entity — has its own primary key and can exist independently (e.g. `Student`)\n• Weak entity — depends on another entity for identification (e.g. `Dependent` of an employee, identified only in combination with the employee's key)\n\n<b>In an ER Diagram</b>\n• Entities are typically drawn as rectangles",
    note:
      "Exam favourite: state the ER-to-schema rule directly — entity → table, attribute → column, entity instance → row.",
    diagram:
      "  ┌───────────┐        ┌───────────┐\n  │  Student  │        │  Course   │   ← entities (rectangles)\n  └───────────┘        └───────────┘\n\n  Entity instance: Student(id=1, name='Asha')",
    code:
      "-- The Student entity becomes a table; each row is an entity instance\nCREATE TABLE students (\n  id   INT PRIMARY KEY,\n  name VARCHAR(100)\n);\n\nINSERT INTO students (id, name) VALUES (1, 'Asha Gurung');  -- one entity instance",
    codeLanguage: "SQL",
    tags: ["Entity", "ER Model", "Strong Entity", "Weak Entity"],
  },
  {
    id: 169,
    slug: "er-attribute",
    section: "Database Management System",
    parentSlug: "er-model",
    title: "Attribute",
    tagline: "A property or characteristic that describes an entity",
    description:
      "<b>What an Attribute Is, in Plain English</b>\nAn attribute is a specific piece of data that describes an entity — a Student entity might have attributes like name, age, and email.\n\n<b>Types of Attributes</b>\n• Simple attribute — cannot be divided further (e.g. `age`)\n• Composite attribute — can be split into smaller parts (e.g. `name` → `first_name` + `last_name`)\n• Single-valued attribute — holds one value (e.g. one `date_of_birth`)\n• Multi-valued attribute — can hold multiple values (e.g. a person can have several `phone_numbers`)\n• Derived attribute — calculated from another attribute, not stored directly (e.g. `age` derived from `date_of_birth`)\n\n<b>In an ER Diagram</b>\n• Attributes are typically drawn as ovals connected to their entity\n• Multi-valued attributes get a double oval; derived attributes get a dashed oval",
    note:
      "Exam favourite: how do you store a multi-valued attribute in a relational table? Not 'comma-separated in one column' — the correct answer is a separate linked table, keeping the design in proper normal form.",
    diagram:
      "        (name)   (age)\n           \\       /\n         ┌───────────┐\n         │  Student  │\n         └───────────┘\n           /        \\\n     (email)   ((phone_numbers))  ← double oval = multi-valued",
    code:
      "-- Simple + single-valued attributes map directly to columns\nCREATE TABLE students (\n  id    INT PRIMARY KEY,\n  name  VARCHAR(100),\n  age   INT\n);\n\n-- A multi-valued attribute (phone_numbers) needs its own table\nCREATE TABLE student_phones (\n  student_id INT REFERENCES students(id),\n  phone      VARCHAR(20)\n);",
    codeLanguage: "SQL",
    tags: ["Attribute", "ER Model", "Multi-valued", "Derived Attribute"],
  },
  {
    id: 170,
    slug: "relationship",
    section: "Database Management System",
    parentSlug: "er-model",
    title: "Relationship",
    tagline: "How two or more entities are connected to each other",
    description:
      "<b>What a Relationship Is, in Plain English</b>\nA relationship describes how two or more entities are associated with each other — a Student enrolls in a Course, an Employee manages a Department.\n\n<b>Degree of a Relationship</b>\n• Unary (degree 1) — an entity relates to itself (an Employee supervises another Employee)\n• Binary (degree 2) — the most common — two entities relate (Student enrolls in Course)\n• Ternary (degree 3) — three entities participate together (Supplier supplies Part to Project)\n\n<b>Participation</b>\n• Total participation — every instance of the entity must participate in the relationship (every Order must have a Customer)\n• Partial participation — participation is optional (not every Employee manages a Department)\n\n<b>In an ER Diagram</b>\n• Relationships are drawn as diamonds connecting the related entities",
    note:
      "Exam favourite: in the final relational schema, a relationship usually becomes a foreign key (for one-to-many) or an entirely separate junction table (for many-to-many).",
    diagram:
      "  ┌──────────┐        ┌───────────┐        ┌──────────┐\n  │ Student  ├──────< │ enrolls in │ >──────┤  Course  │\n  └──────────┘        └───────────┘        └──────────┘\n                        (diamond)",
    code:
      "-- Binary relationship 'enrolls in' between Student and Course\n-- becomes a junction table for many-to-many\nCREATE TABLE enrollments (\n  student_id INT REFERENCES students(id),\n  course_id  INT REFERENCES courses(id),\n  PRIMARY KEY (student_id, course_id)\n);",
    codeLanguage: "SQL",
    tags: ["Relationship", "ER Model", "Participation", "Degree"],
  },
  {
    id: 171,
    slug: "cardinality",
    section: "Database Management System",
    parentSlug: "er-model",
    title: "Cardinality",
    tagline: "How many instances of one entity can relate to instances of another",
    description:
      "<b>What Cardinality Is, in Plain English</b>\nCardinality defines the numerical relationship between two entities — how many instances of Entity A can be associated with how many instances of Entity B.\n\n<b>The Four Cardinality Types</b>\n• One-to-One (1:1) — one Employee has one Parking Spot, one Parking Spot belongs to one Employee\n• One-to-Many (1:N) — one Customer places many Orders, but each Order belongs to one Customer\n• Many-to-One (N:1) — the reverse view of the same 1:N relationship, seen from the 'many' side\n• Many-to-Many (M:N) — many Students enroll in many Courses, and vice versa\n\n<b>How Cardinality Is Implemented in Tables</b>\n• 1:1 — foreign key on either table (often with a UNIQUE constraint)\n• 1:N — foreign key placed on the 'many' side table\n• M:N — needs a separate junction/bridge table, since neither table alone can hold multiple foreign keys per row cleanly",
    note:
      "Exam favourite: 'where does the foreign key go?' Rule — the foreign key goes on the 'many' side in a 1:N relationship; many-to-many always needs its own junction table.",
    diagram:
      "  1:1     Employee ──────── ParkingSpot\n  1:N     Customer ───────< Order          (FK lives on Order)\n  M:N     Student  >─────── Course          (needs a junction table)",
    code:
      "-- 1:N — foreign key on the 'many' side (orders)\nCREATE TABLE orders (\n  id          INT PRIMARY KEY,\n  customer_id INT REFERENCES customers(id)\n);\n\n-- M:N — needs a junction table, no single FK column works\nCREATE TABLE enrollments (\n  student_id INT REFERENCES students(id),\n  course_id  INT REFERENCES courses(id),\n  PRIMARY KEY (student_id, course_id)\n);",
    codeLanguage: "SQL",
    tags: ["Cardinality", "One-to-Many", "Many-to-Many", "ER Model"],
  },
  {
    id: 172,
    slug: "relational-database",
    section: "Database Management System",
    title: "Relational Database",
    tagline: "The formal vocabulary of relational theory — relation, tuple, attribute, and domain",
    description:
      "<b>What This Covers</b>\nOnce an ER diagram is translated into tables, the vocabulary shifts to the formal terms relational database theory actually uses — relation, tuple, attribute, and domain — the same ideas as \"table\", \"row\", and \"column\", but with the mathematical precision Codd's original model defined.\n\n<b>How This Section Is Organized</b>\n• <b>Relation</b> — the formal name for a table\n• <b>Tuple</b> — the formal name for a row\n• <b>Attribute</b> — a named column of a relation\n• <b>Domain</b> — the set of valid values an attribute may hold\n  ↳ Each of these formal terms maps directly onto something you already know from writing SQL — this section just gives it the exact textbook name.",
    note:
      "Exam favourite: relation = table, tuple = row, attribute = column. If a question uses the formal term, translate it mentally before answering.",
    tags: ["Relational Database", "Relation", "Tuple", "Domain"],
  },
  {
    id: 173,
    slug: "relation",
    section: "Database Management System",
    parentSlug: "relational-database",
    title: "Relation",
    tagline: "The formal name for a table — a set of tuples sharing the same attributes",
    description:
      "<b>What a Relation Is, in Plain English</b>\nIn relational database theory, a relation is the formal term for what we casually call a table — a set of tuples (rows), each having the same set of attributes (columns).\n\n<b>Properties of a Relation</b>\n• Each row (tuple) is unique — no two rows are entirely identical\n• The order of rows does not matter\n• The order of columns does not matter\n• Each cell holds a single, atomic value (no lists or nested tables inside a cell)\n\n<b>Relation vs Table</b>\n• 'Relation' is the mathematical/theoretical term from Codd's original 1970 paper\n• 'Table' is the everyday, practical term used in SQL and by developers\n• They mean the same thing in day-to-day work",
    note:
      "Exam favourite: where does the term 'relational database' come from? A 'relation' is the formal name for a table, from Codd's 1970 paper — not because tables 'relate' to each other via foreign keys, a common misconception.",
    diagram:
      "  Relation: students\n  ┌────┬─────────┐\n  │ id │ name    │   ← attributes (columns)\n  ├────┼─────────┤\n  │ 1  │ Asha    │   ← tuple (row)\n  │ 2  │ Bikash  │   ← tuple (row)\n  └────┴─────────┘",
    code:
      "-- This CREATE TABLE defines a relation named 'students'\nCREATE TABLE students (\n  id   INT PRIMARY KEY,\n  name VARCHAR(100)\n);",
    codeLanguage: "SQL",
    tags: ["Relation", "Table", "Relational Model"],
  },
  {
    id: 174,
    slug: "tuple",
    section: "Database Management System",
    parentSlug: "relational-database",
    title: "Tuple",
    tagline: "The formal name for a single row in a relation",
    description:
      "<b>What a Tuple Is, in Plain English</b>\nA tuple is the formal term for a single row in a relation (table) — one complete record, holding one value for each attribute.\n\n<b>Key Properties</b>\n• A tuple represents one entity instance — e.g. one specific student\n• Every tuple in a relation must be unique (no two identical rows)\n• The values within a tuple are ordered according to the relation's attribute order, but the tuples themselves have no inherent order\n\n<b>Tuple vs Row</b>\n• 'Tuple' is the formal relational-algebra term\n• 'Row' or 'record' is the everyday SQL term for the same thing",
    note:
      "Exam favourite: a table with zero tuples is still a valid relation — an empty table. The schema (attributes/columns) can exist before any tuples (rows) are inserted.",
    diagram:
      "  students\n  ┌────┬─────────┬────────────────────┐\n  │ id │ name    │ email              │\n  ├────┼─────────┼────────────────────┤\n  │ 1  │ Asha    │ asha@example.com   │  ← one tuple\n  │ 2  │ Bikash  │ bikash@example.com │  ← another tuple\n  └────┴─────────┴────────────────────┘",
    code:
      "INSERT INTO students (id, name, email)\nVALUES (1, 'Asha Gurung', 'asha@example.com');  -- inserts one tuple",
    codeLanguage: "SQL",
    tags: ["Tuple", "Row", "Relational Model"],
  },
  {
    id: 175,
    slug: "relation-attribute",
    section: "Database Management System",
    parentSlug: "relational-database",
    title: "Attribute",
    tagline: "A named column of a relation, holding one type of value per tuple",
    description:
      "<b>What an Attribute Is, in Plain English</b>\nIn relational database theory, an attribute is a named column of a relation — a single property that every tuple in that relation has a value for.\n\n<b>Key Properties</b>\n• Every attribute has a name and a defined domain (the set of allowed values)\n• Every tuple supplies exactly one value per attribute (or NULL, if allowed)\n• Attributes are what you SELECT, filter with WHERE, and JOIN across tables\n\n<b>Attribute vs Column</b>\n• 'Attribute' is the formal relational-model term\n• 'Column' or 'field' is the everyday SQL term for the same thing\n\n<b>Why Attributes Must Be Atomic</b>\n• The relational model requires each attribute value to be a single, indivisible value (this is the basis of First Normal Form) — no storing a list of values inside one cell",
    note:
      "Exam favourite: this is the same underlying concept as the 'Attribute' card under ER Model — an ER diagram's attribute becomes a relational database's attribute (column) once the design is implemented as tables, and must hold atomic values to satisfy 1NF.",
    diagram:
      "  Relation: orders\n  ┌────┬─────────────┬────────┐\n  │ id │ customer_id │ total  │  ← attributes\n  └────┴─────────────┴────────┘",
    code:
      "SELECT id, customer_id, total   -- selecting specific attributes\nFROM orders\nWHERE total > 100;              -- filtering by an attribute's value",
    codeLanguage: "SQL",
    tags: ["Attribute", "Column", "Domain", "Relational Model"],
  },
  {
    id: 176,
    slug: "domain",
    section: "Database Management System",
    parentSlug: "relational-database",
    title: "Domain",
    tagline: "The set of valid values that an attribute is allowed to hold",
    description:
      "<b>What a Domain Is, in Plain English</b>\nA domain is the complete set of legal, allowed values for a given attribute. Every attribute is defined over exactly one domain.\n\n<b>Examples of Domains</b>\n• `age` → domain is positive integers, typically 0–120\n• `gender` → domain might be a fixed enum like {'M', 'F', 'Other'}\n• `email` → domain is strings matching a valid email pattern\n• `status` → domain might be {'pending', 'shipped', 'delivered'}\n\n<b>How Domains Are Enforced in SQL</b>\n• Data types (`INT`, `VARCHAR`, `DATE`) enforce the broad shape of the domain\n• `CHECK` constraints narrow the domain further (e.g. `CHECK (age >= 0)`)\n• `ENUM` types or foreign keys to a lookup table restrict values to an exact allowed set\n\n<b>Why Domains Matter</b>\n• They stop invalid data from ever entering the database\n• Two attributes are 'domain-compatible' only if they share the same domain — this matters for operations like UNION in relational algebra, which requires matching domains",
    note:
      "Exam favourite: a domain is stricter than just a data type. `INT` is a data type; 'an integer between 0 and 120' is the actual domain — CHECK constraints are how you express the full domain, not just the type.",
    diagram:
      "  Attribute: age        Domain: integers 0-120\n  Attribute: status     Domain: {'pending','shipped','delivered'}\n  Attribute: email      Domain: strings matching a valid email format",
    code:
      "CREATE TABLE students (\n  id     INT PRIMARY KEY,\n  age    INT CHECK (age BETWEEN 0 AND 120),      -- domain enforced\n  status VARCHAR(20) CHECK (status IN ('pending','shipped','delivered'))\n);",
    codeLanguage: "SQL",
    tags: ["Domain", "Constraints", "Data Integrity", "CHECK"],
  },
  {
    id: 177,
    slug: "sql",
    section: "Database Management System",
    title: "SQL",
    tagline: "The language every relational database is operated with — five command categories, one job each",
    description:
      "<b>What This Covers</b>\nSQL (Structured Query Language) is how every relational database is actually operated — creating structure, changing data, reading data, controlling access, and managing transactions. Its commands are grouped into five categories, each with a distinct job.\n\n<b>How This Section Is Organized</b>\n• <b>Commands</b> — the five SQL command categories: DDL, DML, DQL, DCL, and TCL, and exactly which commands belong to each\n  ↳ Covered in full, one category per card, in the next section.",
    note:
      "Exam favourite: examiners love asking you to sort a list of commands (CREATE, SELECT, GRANT, COMMIT, DELETE...) into their correct category — know all five groups cold.",
    diagram:
      "  SQL COMMAND CATEGORIES\n\n  DDL  → structure    (CREATE, ALTER, DROP)\n  DML  → data         (INSERT, UPDATE, DELETE)\n  DQL  → read data    (SELECT)\n  DCL  → permissions  (GRANT, REVOKE)\n  TCL  → transactions (COMMIT, ROLLBACK)",
    tags: ["SQL", "DDL", "DML", "DQL", "DCL", "TCL"],
  },
  {
    id: 178,
    slug: "sql-commands",
    section: "Database Management System",
    parentSlug: "sql",
    title: "Commands",
    tagline: "The five SQL command categories, grouped by what they actually do",
    description:
      "<b>What This Covers</b>\nEvery SQL statement you'll ever write belongs to one of five categories, based on what it actually does — defining structure, manipulating data, querying data, controlling access, or managing transactions.\n\n<b>How This Section Is Organized</b>\n• <b>DDL</b> — CREATE, ALTER, DROP — defines the database's structure\n• <b>DML</b> — INSERT, UPDATE, DELETE — manipulates the data inside tables\n• <b>DQL</b> — SELECT — reads data without modifying it\n• <b>DCL</b> — GRANT, REVOKE — controls who can access what\n• <b>TCL</b> — COMMIT, ROLLBACK — manages transaction boundaries\n  ↳ Each is covered in its own card next, with its full command list and an example.",
    note:
      "Exam favourite: DQL has only one command (SELECT) — the easiest category to remember for exactly that reason.",
    tags: ["SQL Commands", "DDL", "DML", "DQL", "DCL", "TCL"],
  },
  {
    id: 179,
    slug: "ddl",
    section: "Database Management System",
    parentSlug: "sql-commands",
    title: "DDL — Data Definition Language",
    tagline: "SQL commands that define and modify the structure of the database itself",
    description:
      "<b>What DDL Is, in Plain English</b>\nDDL (Data Definition Language) is the group of SQL commands used to define, modify, and remove the structure of database objects — tables, schemas, indexes — not the data inside them.\n\n<b>The Three Core DDL Commands</b>\n• `CREATE` — builds a new database object (table, index, view, schema)\n• `ALTER` — modifies the structure of an existing object (add/drop/rename a column, change a data type)\n• `DROP` — permanently deletes an object and all the data inside it\n\n<b>Key Trait: Auto-Commit</b>\n• In most databases, DDL statements auto-commit immediately — you generally cannot roll back a `DROP TABLE` the way you can roll back a data change\n\n<b>DDL vs DML</b>\n• DDL changes the shape of the database (the schema)\n• DML changes the data living inside that shape",
    note:
      "Exam favourite: remember DDL with the phrase 'shapes the schema' — if a command changes what a table looks like (its columns, types, or existence) rather than the rows inside it, it's DDL.",
    diagram:
      "  DDL — changes STRUCTURE\n\n  CREATE  → build a new table/index/schema\n  ALTER   → modify an existing table's structure\n  DROP    → permanently remove a table/object",
    code:
      "-- CREATE: define a new table's structure\nCREATE TABLE products (\n  id    INT PRIMARY KEY,\n  name  VARCHAR(100),\n  price DECIMAL(10,2)\n);\n\n-- ALTER: modify the structure\nALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT true;\n\n-- DROP: remove the object entirely\nDROP TABLE products;",
    codeLanguage: "SQL",
    tags: ["DDL", "CREATE", "ALTER", "DROP", "SQL Commands"],
  },
  {
    id: 180,
    slug: "dml",
    section: "Database Management System",
    parentSlug: "sql-commands",
    title: "DML — Data Manipulation Language",
    tagline: "SQL commands that insert, update, and delete the data inside existing tables",
    description:
      "<b>What DML Is, in Plain English</b>\nDML (Data Manipulation Language) is the group of SQL commands used to manipulate the actual data stored inside tables — without changing the table's structure.\n\n<b>The Three Core DML Commands</b>\n• `INSERT` — adds new rows to a table\n• `UPDATE` — modifies values in existing rows\n• `DELETE` — removes existing rows\n\n<b>Key Trait: Transactional</b>\n• Unlike DDL, DML statements are typically part of a transaction and can be rolled back with `ROLLBACK` before being made permanent with `COMMIT`\n\n<b>DML vs DDL</b>\n• DML changes what's inside the table (the rows)\n• DDL changes the table's shape itself (columns, types, existence)",
    note:
      "Exam favourite: always run `UPDATE`/`DELETE` with a tested `WHERE` clause — omitting it modifies or deletes every row in the table. Wrapping the statement in a transaction lets you `ROLLBACK` if something looks wrong.",
    diagram:
      "  DML — changes DATA inside existing tables\n\n  INSERT  → add new rows\n  UPDATE  → modify existing rows\n  DELETE  → remove existing rows",
    code:
      "-- INSERT: add a new row\nINSERT INTO products (id, name, price) VALUES (1, 'Keyboard', 29.99);\n\n-- UPDATE: modify existing rows\nUPDATE products SET price = 24.99 WHERE id = 1;\n\n-- DELETE: remove rows\nDELETE FROM products WHERE id = 1;",
    codeLanguage: "SQL",
    tags: ["DML", "INSERT", "UPDATE", "DELETE", "SQL Commands"],
  },
  {
    id: 181,
    slug: "dql",
    section: "Database Management System",
    parentSlug: "sql-commands",
    title: "DQL — Data Query Language",
    tagline: "The single SQL command used to read and retrieve data — SELECT",
    description:
      "<b>What DQL Is, in Plain English</b>\nDQL (Data Query Language) consists of a single command — `SELECT` — used purely to retrieve data from one or more tables without modifying it.\n\n<b>Why SELECT Gets Its Own Category</b>\n• Unlike DDL (structure) and DML (write operations), `SELECT` is read-only\n• It is by far the most frequently used SQL command in everyday application code\n\n<b>What SELECT Can Do</b>\n• Choose specific columns to return\n• Filter rows with `WHERE`\n• Combine data across tables with `JOIN`\n• Group and summarize with `GROUP BY` and aggregate functions (`COUNT`, `SUM`, `AVG`)\n• Sort results with `ORDER BY`, limit results with `LIMIT`\n\n<b>DQL vs DML</b>\n• Some textbooks fold `SELECT` into DML since it's technically 'manipulating' a result set\n• Most modern courses separate it into its own DQL category because it never writes data",
    note:
      "Exam favourite: 'which SQL category has only one command?' Answer: DQL — just SELECT. It's the easiest of the five categories to remember for exactly that reason.",
    diagram:
      "  DQL — reads DATA, never modifies it\n\n  SELECT columns\n  FROM table\n  WHERE condition\n  JOIN other_table\n  GROUP BY column\n  ORDER BY column",
    code:
      "SELECT p.name, p.price\nFROM products p\nWHERE p.price > 20\nORDER BY p.price DESC\nLIMIT 10;",
    codeLanguage: "SQL",
    tags: ["DQL", "SELECT", "SQL Commands"],
  },
  {
    id: 182,
    slug: "dcl",
    section: "Database Management System",
    parentSlug: "sql-commands",
    title: "DCL — Data Control Language",
    tagline: "SQL commands that grant or revoke access permissions on database objects",
    description:
      "<b>What DCL Is, in Plain English</b>\nDCL (Data Control Language) is the group of SQL commands used to control who is allowed to access or modify specific database objects — permissions and security, not data or structure.\n\n<b>The Two Core DCL Commands</b>\n• `GRANT` — gives a user or role a specific permission (e.g. SELECT, INSERT, UPDATE on a table)\n• `REVOKE` — removes a previously granted permission\n\n<b>Why DCL Matters</b>\n• Not every application or user should be able to do everything — a reporting dashboard might only need `SELECT`, never `DELETE`\n• Following the principle of least privilege (only grant the minimum access needed) reduces the damage a bug or compromised credential can do",
    note:
      "Exam favourite: mention the principle of least privilege — grant only the exact permissions a role needs, and use REVOKE to tighten access as requirements change.",
    diagram:
      "  DCL — controls WHO can do WHAT\n\n  GRANT   → give a permission to a user/role\n  REVOKE  → take a permission away",
    code:
      "-- Give a reporting user read-only access\nGRANT SELECT ON products TO reporting_user;\n\n-- Give an app user full data access, but not structural changes\nGRANT SELECT, INSERT, UPDATE, DELETE ON products TO app_user;\n\n-- Revoke a permission that's no longer needed\nREVOKE DELETE ON products FROM app_user;",
    codeLanguage: "SQL",
    tags: ["DCL", "GRANT", "REVOKE", "Permissions", "Security"],
  },
  {
    id: 183,
    slug: "tcl",
    section: "Database Management System",
    parentSlug: "sql-commands",
    title: "TCL — Transaction Control Language",
    tagline: "SQL commands that manage the boundaries of a transaction",
    description:
      "<b>What TCL Is, in Plain English</b>\nTCL (Transaction Control Language) is the group of SQL commands used to manage transactions — grouping multiple DML statements so they succeed or fail together.\n\n<b>The Two Core TCL Commands</b>\n• `COMMIT` — permanently saves all changes made in the current transaction\n• `ROLLBACK` — undoes all changes made in the current transaction, reverting to the state before it began\n\n<b>Why TCL Matters</b>\n• Some operations require multiple steps to be atomic — e.g. transferring money means debiting one account and crediting another; both must succeed, or neither should\n• Without TCL, a crash halfway through could leave the database in an inconsistent state (money deducted but never credited)\n\n<b>Related Command</b>\n• `SAVEPOINT` — marks an intermediate point inside a transaction that you can roll back to, without undoing the entire transaction",
    note:
      "Exam favourite: the money-transfer example is the classic way to explain TCL — debit account A, credit account B, COMMIT only if both succeed, ROLLBACK if either fails, so money is never lost or duplicated.",
    diagram:
      "  BEGIN TRANSACTION\n      │\n      ├── UPDATE accounts SET balance = balance - 100 WHERE id = 1;  (debit)\n      ├── UPDATE accounts SET balance = balance + 100 WHERE id = 2;  (credit)\n      │\n      ├── all good?  → COMMIT    (both changes saved permanently)\n      └── error?     → ROLLBACK  (both changes undone, as if nothing happened)",
    code:
      "BEGIN TRANSACTION;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\n-- If both updates succeeded:\nCOMMIT;\n\n-- If something went wrong instead:\n-- ROLLBACK;",
    codeLanguage: "SQL",
    tags: ["TCL", "COMMIT", "ROLLBACK", "Transactions", "SQL Commands"],
  },
  {
    id: 184,
    slug: "advanced-database",
    section: "Database Management System",
    title: "Advanced Database",
    tagline: "Beyond CRUD — normalization, performance, automation, and safety under concurrent load",
    description:
      "<b>What This Covers</b>\nAdvanced Database moves past basic CRUD into the topics that separate a working database from a well-designed, reliable, and performant one — normalization, performance tools like indexes and views, automation like stored procedures and triggers, and the guarantees transactions provide under concurrent load.\n\n<b>How This Section Is Organized</b>\n• <b>Normalization</b> — organizing tables to remove redundancy (1NF through BCNF)\n• <b>Indexing</b> — speeding up reads without scanning every row\n• <b>Views</b> — saved, virtual tables built from a query\n• <b>Stored Procedures & Triggers</b> — logic that lives inside the database itself\n• <b>Transactions & ACID Properties</b> — the all-or-nothing guarantee behind every safe multi-step change\n• <b>Concurrency Control, Locking & Deadlock</b> — how multiple transactions run at once without corrupting data\n  ↳ Each is covered in its own card next.",
    note:
      "Exam favourite: ACID properties and normalization forms (1NF/2NF/3NF/BCNF) are the two most frequently tested topics in this entire chapter — know both cold.",
    diagram:
      "  ADVANCED DATABASE — HOW THE TOPICS RELATE\n\n  Normalization                          ──► clean table design\n  Indexing, Views                        ──► faster reads\n  Stored Procedures, Triggers            ──► logic inside the database\n  Transactions, ACID                     ──► safety guarantees\n  Concurrency Control, Locking, Deadlock ──► safety under simultaneous access",
    tags: ["Advanced Database", "Normalization", "ACID", "Transactions", "Concurrency Control"],
  },
  {
    id: 185,
    slug: "normalization",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "Normalization",
    tagline: "The process of organizing tables to reduce redundancy and avoid data anomalies",
    description:
      "<b>What Normalization Is, in Plain English</b>\nNormalization is the step-by-step process of structuring tables to minimize data redundancy and prevent update, insert, and delete anomalies. It progresses through a series of 'normal forms,' each stricter than the last.\n\n<b>First Normal Form (1NF)</b>\n• Every column must hold a single, atomic value — no lists or repeating groups in one cell\n• Fix: split multi-valued data into its own row or table\n\n<b>Second Normal Form (2NF)</b>\n• Must already be in 1NF\n• Every non-key column must depend on the entire primary key, not just part of it (only matters with composite primary keys)\n• Fix: move columns that depend on only part of the key into their own table\n\n<b>Third Normal Form (3NF)</b>\n• Must already be in 2NF\n• No non-key column may depend on another non-key column (no 'transitive dependency')\n• Fix: move the transitively dependent column into its own table\n\n<b>Boyce-Codd Normal Form (BCNF)</b>\n• A stricter version of 3NF\n• Every determinant (a column that determines another column's value) must be a candidate key\n• Handles rare edge cases 3NF misses, usually involving overlapping candidate keys\n\n<b>Why Normalize</b>\n• Prevents the same fact from being stored in multiple places, which could go out of sync\n• Makes updates safer — change a fact in exactly one place",
    note:
      "Exam favourite: define each normal form by the anomaly it fixes — 1NF fixes repeating groups, 2NF fixes partial key dependency, 3NF fixes transitive dependency, BCNF fixes edge cases with overlapping candidate keys.",
    diagram:
      "  UNNORMALIZED (repeating group)          1NF (atomic rows)         3NF (price moved out)\n  order:1, items:                         id | item | price          orders(order_id, item)\n   ['pen,$1','pad,$3']      ───split──►    1  | pen  | $1     ──►    items(item, price)\n                                           1  | pad  | $3            no repeated price fact",
    code:
      "-- BEFORE (violates 1NF): items stored as a comma list in one column\n-- orders(id, items_and_prices)  ->  1, 'pen:$1, pad:$3'\n\n-- AFTER 1NF: atomic values, one row per item\nCREATE TABLE order_items (\n  order_id INT,\n  item     VARCHAR(50),\n  price    DECIMAL(10,2)\n);\n\n-- AFTER 3NF: price depends only on the item, not the order,\n-- so it moves to its own table to avoid repeating/inconsistent prices\nCREATE TABLE items (\n  name  VARCHAR(50) PRIMARY KEY,\n  price DECIMAL(10,2)\n);\nCREATE TABLE order_items (\n  order_id INT REFERENCES orders(id),\n  item     VARCHAR(50) REFERENCES items(name)\n);",
    codeLanguage: "SQL",
    tags: ["Normalization", "1NF", "2NF", "3NF", "BCNF", "Redundancy"],
  },
  {
    id: 186,
    slug: "indexing",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "Indexing",
    tagline: "A lookup structure that lets the database find rows without scanning the whole table",
    description:
      "<b>What Indexing Is, in Plain English</b>\nAn index is an auxiliary data structure (usually a B-tree) built on one or more columns that lets the database jump directly to matching rows instead of scanning every row — like a book's index at the back: without it, finding \"quantum physics\" means reading every page; with it, you jump straight to page 214.\n\n<b>How It Works</b>\n• The database maintains a sorted structure mapping column values to row locations\n• A query filtering on an indexed column can binary-search the index instead of scanning every row (a full table scan)\n\n<b>The Trade-Off</b>\n• Reads (`SELECT ... WHERE`) become much faster on indexed columns\n• Writes (`INSERT`/`UPDATE`/`DELETE`) become slightly slower, since every index on the table must also be updated\n• Indexes use extra disk space\n\n<b>What to Index</b>\n• Columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses\n• Avoid over-indexing tables that are written to far more often than they're read",
    note:
      "Exam favourite: 'why not index every column?' Answer with the write cost — every index must be updated on every INSERT/UPDATE/DELETE, so indexing a rarely-queried, frequently-written column wastes performance for no read benefit.",
    diagram:
      "  WITHOUT INDEX (full table scan)\n  Row1 → Row2 → Row3 → ... → Row10000   (check every row for a match)\n\n  WITH INDEX (B-tree on 'email')\n            [m]\n          /     \\\n       [b-l]   [n-z]\n       /   \\     /   \\\n    ...    ...  ...   ...\n  → jump directly to the matching branch, skip everything else",
    code:
      "-- Without an index, this scans every row in a large table\nSELECT * FROM users WHERE email = 'asha@example.com';\n\n-- Add an index to make that lookup fast\nCREATE INDEX idx_users_email ON users(email);\n\n-- Now the same query can use the index instead of a full scan\nEXPLAIN SELECT * FROM users WHERE email = 'asha@example.com';",
    codeLanguage: "SQL",
    tags: ["Indexing", "B-Tree", "Performance", "Query Optimization"],
  },
  {
    id: 187,
    slug: "views",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "Views",
    tagline: "A saved, virtual table defined by a query — computed on the fly, not stored",
    description:
      "<b>What a View Is, in Plain English</b>\nA view is a saved SQL query that behaves like a virtual table. It doesn't store data itself — every time you query the view, the underlying query runs fresh against the real tables.\n\n<b>Why Use a View</b>\n• Simplify a complex, frequently-used JOIN into a single simple `SELECT * FROM view_name`\n• Restrict access — expose only certain columns/rows to a user, without giving them the base table's full contents\n• Provide a stable interface — the view's shape stays the same even if the underlying table structure changes internally\n\n<b>Regular View vs Materialized View</b>\n• Regular view — no data stored, runs the query every time (always up to date, but no faster than the underlying query)\n• Materialized view — the query result IS physically stored and must be refreshed periodically; faster to read, but can be stale until refreshed",
    note:
      "Exam favourite: a view is not a performance optimization by itself — only a materialized view actually caches results, at the cost of the data being potentially stale until the next refresh.",
    diagram:
      "  CREATE VIEW → stores the QUERY, not the data\n\n  active_customers VIEW\n      │\n      │  defined as: SELECT * FROM customers WHERE status = 'active'\n      ▼\n  Querying the view re-runs that SELECT against the real customers table",
    code:
      "-- Create a view hiding inactive customers and sensitive columns\nCREATE VIEW active_customers AS\nSELECT id, name, email\nFROM customers\nWHERE status = 'active';\n\n-- Query it exactly like a table\nSELECT * FROM active_customers WHERE name LIKE 'A%';\n\n-- A materialized view, refreshed on demand (PostgreSQL)\nCREATE MATERIALIZED VIEW customer_totals AS\nSELECT customer_id, SUM(total) AS lifetime_spend FROM orders GROUP BY customer_id;\n\nREFRESH MATERIALIZED VIEW customer_totals;",
    codeLanguage: "SQL",
    tags: ["Views", "Materialized View", "Query Abstraction"],
  },
  {
    id: 188,
    slug: "stored-procedures",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "Stored Procedures",
    tagline: "Precompiled SQL logic saved in the database and executed on demand",
    description:
      "<b>What a Stored Procedure Is, in Plain English</b>\nA stored procedure is a named block of SQL (and often procedural logic like loops and conditionals) saved inside the database itself and executed with a single call.\n\n<b>Why Use Them</b>\n• Bundle multi-step logic (several INSERTs/UPDATEs, validation, conditionals) into one reusable unit\n• Reduce network round-trips — the application sends one call instead of several separate queries\n• Precompiled and optimized by the database, often faster than sending equivalent ad-hoc queries repeatedly\n• Centralize business logic that must run consistently regardless of which application calls it\n\n<b>Trade-Offs</b>\n• Harder to version control and test compared to application code\n• Ties business logic to a specific database vendor's procedural SQL dialect\n• Many modern teams prefer keeping business logic in the application layer, reserving stored procedures for tight, database-specific operations",
    note:
      "Exam favourite: use a stored procedure when several statements must run as a single fast, atomic unit close to the data — keep general business logic in the application layer for easier testing and portability.",
    diagram:
      "  Application\n      │\n      │  CALL transfer_funds(1, 2, 100);   ← one call\n      ▼\n  ┌──────────────────────────────┐\n  │  Stored Procedure (in DB)      │\n  │  1. debit account 1             │\n  │  2. credit account 2            │\n  │  3. log the transaction          │\n  └──────────────────────────────┘\n  All three steps run inside the database, as one unit.",
    code:
      "CREATE PROCEDURE transfer_funds(sender_id INT, receiver_id INT, amount DECIMAL)\nLANGUAGE plpgsql AS $$\nBEGIN\n  UPDATE accounts SET balance = balance - amount WHERE id = sender_id;\n  UPDATE accounts SET balance = balance + amount WHERE id = receiver_id;\n  INSERT INTO transaction_log (sender_id, receiver_id, amount) VALUES (sender_id, receiver_id, amount);\nEND;\n$$;\n\n-- Calling it from the application\nCALL transfer_funds(1, 2, 100);",
    codeLanguage: "SQL",
    tags: ["Stored Procedures", "Business Logic", "Performance"],
  },
  {
    id: 189,
    slug: "triggers",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "Triggers",
    tagline: "Code that automatically runs in response to an INSERT, UPDATE, or DELETE",
    description:
      "<b>What a Trigger Is, in Plain English</b>\nA trigger is a block of code attached to a table that automatically executes when a specific event happens — before or after an `INSERT`, `UPDATE`, or `DELETE`.\n\n<b>Common Uses</b>\n• Auditing — automatically log every change to a sensitive table\n• Enforcing complex business rules that a simple `CHECK` constraint can't express\n• Keeping a derived/summary value in sync (e.g. updating a `product_count` whenever a row is inserted or deleted)\n• Preventing invalid changes (e.g. blocking a `DELETE` on a record that still has active dependents)\n\n<b>BEFORE vs AFTER Triggers</b>\n• `BEFORE` trigger — runs before the change is applied; can validate or modify the incoming data\n• `AFTER` trigger — runs after the change is applied; typically used for logging or cascading updates\n\n<b>Caution</b>\n• Triggers run silently and automatically — they can make debugging harder if a developer doesn't know a trigger exists and is modifying data behind the scenes",
    note:
      "Exam favourite real-world example: audit logging is the safest, most universally-accepted trigger use case — an AFTER trigger on UPDATE/DELETE that writes the old row values into an audit_log table, with zero risk of blocking the original operation.",
    diagram:
      "  INSERT INTO orders (...) VALUES (...);\n      │\n      ▼\n  Trigger fires automatically (AFTER INSERT)\n      │\n      ▼\n  UPDATE customers SET order_count = order_count + 1 WHERE id = NEW.customer_id;\n\n  The application never explicitly ran that UPDATE — the trigger did it.",
    code:
      "CREATE TRIGGER increment_order_count\nAFTER INSERT ON orders\nFOR EACH ROW\nEXECUTE FUNCTION bump_customer_order_count();\n\nCREATE FUNCTION bump_customer_order_count() RETURNS TRIGGER AS $$\nBEGIN\n  UPDATE customers SET order_count = order_count + 1 WHERE id = NEW.customer_id;\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;",
    codeLanguage: "SQL",
    tags: ["Triggers", "Automation", "Auditing", "BEFORE/AFTER"],
  },
  {
    id: 190,
    slug: "transactions",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "Transactions",
    tagline: "A group of one or more SQL operations executed as a single, all-or-nothing unit",
    description:
      "<b>What a Transaction Is, in Plain English</b>\nA transaction is a sequence of one or more SQL operations grouped together so they either all succeed or all fail — there is no in-between, partially-applied state. Transferring money between two bank accounts requires two updates: debit account A, credit account B — if only the debit succeeds and the credit fails (e.g. a crash), money disappears, which is exactly what a transaction prevents.\n\n<b>Lifecycle of a Transaction</b>\n• `BEGIN` (or `START TRANSACTION`) — marks the start\n• One or more DML statements\n• `COMMIT` — makes all changes permanent\n• `ROLLBACK` — undoes all changes since `BEGIN`, as if none of it happened\n\n<b>Why Transactions Matter</b>\n• They are the mechanism that makes ACID guarantees possible in practice\n• Without transactions, a crash or error partway through a multi-step operation can leave the database in an inconsistent state",
    note:
      "Exam favourite: define a transaction with 'all-or-nothing' — partial completion is never an acceptable outcome, enforced through COMMIT and ROLLBACK.",
    diagram:
      "  BEGIN\n    │\n    ├── UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n    ├── UPDATE accounts SET balance = balance + 100 WHERE id = 2;\n    │\n    ▼\n  COMMIT   ← both changes become permanent together\n  (or ROLLBACK → both changes undone together)",
    code:
      "BEGIN;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\nCOMMIT;  -- both updates are now permanent, or neither happened if it failed before this line",
    codeLanguage: "SQL",
    tags: ["Transactions", "ACID", "COMMIT", "ROLLBACK"],
  },
  {
    id: 191,
    slug: "acid-properties",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "ACID Properties",
    tagline: "The four guarantees that make database transactions safe and reliable",
    description:
      "<b>What ACID Is, in Plain English</b>\nACID is an acronym for the four properties that guarantee a database transaction behaves safely and predictably, even under failures or concurrent access.\n\n<b>Atomicity</b>\n• A transaction is all-or-nothing — either every operation inside it succeeds, or none of them take effect\n• Example: a money transfer's debit and credit either both happen or neither does\n\n<b>Consistency</b>\n• A transaction can only move the database from one valid state to another valid state, never violating defined rules (constraints, keys, triggers)\n• Example: a `CHECK (balance >= 0)` constraint prevents a transaction from ever leaving an account negative\n\n<b>Isolation</b>\n• Concurrent transactions do not interfere with each other's intermediate state — each transaction behaves as if it were running alone\n• Example: two people transferring money at the same time should not see each other's half-finished updates\n\n<b>Durability</b>\n• Once a transaction is committed, its changes survive permanently — even a power failure or crash immediately after\n• Example: after `COMMIT` returns success, that data is written to durable storage, not just held in memory",
    note:
      "Exam favourite: remember ACID with the money-transfer example for all four letters at once — Atomicity (both legs happen or neither), Consistency (balances never go invalid), Isolation (concurrent transfers don't see each other's half-done state), Durability (once confirmed, it survives a crash).",
    diagram:
      "  A — Atomicity     : all steps succeed, or none do\n  C — Consistency   : constraints/rules always hold, before and after\n  I — Isolation      : concurrent transactions don't see each other's half-done work\n  D — Durability     : once committed, survives crashes/power loss",
    code:
      "BEGIN;\n\n-- Atomicity: both updates commit together or not at all\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\n-- Consistency: a CHECK constraint on the table (e.g. CHECK (balance >= 0))\n-- would reject this transaction if it drove a balance negative\n\nCOMMIT;  -- Durability: guaranteed to survive a crash right after this line",
    codeLanguage: "SQL",
    tags: ["ACID", "Atomicity", "Consistency", "Isolation", "Durability"],
  },
  {
    id: 192,
    slug: "concurrency-control",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "Concurrency Control",
    tagline: "The mechanisms that let multiple transactions run at once without corrupting data",
    description:
      "<b>What Concurrency Control Is, in Plain English</b>\nConcurrency control is the set of techniques a DBMS uses to let multiple transactions execute at the same time while still preserving correctness — no lost updates, no reading half-finished changes from another transaction.\n\n<b>Problems Concurrency Control Prevents</b>\n• <b>Lost update</b> — two transactions read the same value, both update it, and one update silently overwrites the other\n• <b>Dirty read</b> — a transaction reads data written by another transaction that hasn't committed yet, and that data later gets rolled back\n• <b>Non-repeatable read</b> — a transaction reads the same row twice and gets different values because another transaction updated it in between\n• <b>Phantom read</b> — a transaction re-runs the same query and sees new rows that appeared due to another transaction's insert\n\n<b>Main Techniques</b>\n• Locking — transactions acquire locks on the data they touch (see: Locking)\n• Optimistic concurrency control — proceed without locks, then check for conflicts before committing (used when conflicts are rare)\n• Multi-Version Concurrency Control (MVCC) — keep multiple versions of a row so readers never block writers (used by PostgreSQL, MySQL InnoDB)\n\n<b>Isolation Levels</b>\n• Databases let you choose how strictly to prevent these problems via isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable — each trading some performance for stricter correctness",
    note:
      "Exam favourite: list the four classic concurrency anomalies in severity order — dirty read (worst), non-repeatable read, phantom read, lost update — then map each to which isolation level prevents it.",
    diagram:
      "  Without concurrency control (LOST UPDATE):\n  T1: read balance = 100\n  T2: read balance = 100\n  T1: write balance = 100 - 30 = 70\n  T2: write balance = 100 - 50 = 50   ← overwrites T1's update, $30 debit is lost!\n\n  With concurrency control (locking):\n  T1: lock row → read 100 → write 70 → unlock\n  T2: (waits for lock) → read 70 → write 20 → unlock   ← correct final balance",
    code:
      "-- Isolation level controls how strictly anomalies are prevented\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n\nBEGIN;\nSELECT balance FROM accounts WHERE id = 1;   -- read\nUPDATE accounts SET balance = balance - 30 WHERE id = 1;\nCOMMIT;\n\n-- Under SERIALIZABLE, a concurrent conflicting transaction\n-- would be forced to retry rather than silently lose this update",
    codeLanguage: "SQL",
    tags: ["Concurrency Control", "Isolation Levels", "MVCC", "Lost Update"],
  },
  {
    id: 193,
    slug: "locking",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "Locking",
    tagline: "Reserving access to data so other transactions must wait before touching it",
    description:
      "<b>What Locking Is, in Plain English</b>\nLocking is the mechanism where a transaction reserves a piece of data (a row, page, or table) so that other transactions cannot conflict with it until the lock is released.\n\n<b>Types of Locks</b>\n• Shared lock (read lock) — multiple transactions can hold a shared lock on the same data at once; used for reading\n• Exclusive lock (write lock) — only one transaction can hold it at a time; used for writing; blocks both reads and writes from others\n\n<b>Lock Granularity</b>\n• Row-level locking — locks only the specific rows touched; allows high concurrency\n• Table-level locking — locks the entire table; simpler, but blocks far more concurrent work\n\n<b>Two-Phase Locking (2PL)</b>\n• Growing phase — a transaction acquires all the locks it needs\n• Shrinking phase — once it starts releasing locks, it cannot acquire any new ones\n• This protocol guarantees the transaction schedule is serializable (behaves as if transactions ran one at a time)\n\n<b>The Cost of Locking</b>\n• Locks prevent corruption, but they also make other transactions wait — too much locking, or locks held too long, causes contention and slows the whole system down",
    note:
      "Exam favourite: `SELECT ... FOR UPDATE` is the go-to example of explicit row-level locking — it tells the database 'I'm about to modify this row, block anyone else from touching it until I commit.'",
    diagram:
      "  T1: BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n      → acquires EXCLUSIVE lock on row id=1\n\n  T2: UPDATE accounts SET balance = balance + 50 WHERE id = 1;\n      → BLOCKS, waiting for T1's lock to release\n\n  T1: COMMIT;  → lock released\n  T2: → now proceeds with its update",
    code:
      "-- Explicitly lock a row for update, blocking other writers until COMMIT\nBEGIN;\nSELECT * FROM accounts WHERE id = 1 FOR UPDATE;  -- exclusive row lock\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;  -- lock released here",
    codeLanguage: "SQL",
    tags: ["Locking", "Shared Lock", "Exclusive Lock", "Two-Phase Locking"],
  },
  {
    id: 194,
    slug: "deadlock",
    section: "Database Management System",
    parentSlug: "advanced-database",
    title: "Deadlock",
    tagline: "Two transactions each waiting on a lock the other is holding — neither can proceed",
    description:
      "<b>What a Deadlock Is, in Plain English</b>\nA deadlock happens when two (or more) transactions each hold a lock the other one needs, and each is waiting for the other to release it — neither can ever proceed on its own.\n\n<b>The Classic Scenario</b>\n• Transaction 1 locks Row A, then tries to lock Row B\n• Transaction 2 locks Row B, then tries to lock Row A\n• T1 waits for T2's lock on B; T2 waits for T1's lock on A — permanent standstill\n\n<b>How Databases Handle It</b>\n• Most DBMSs run a deadlock detection algorithm that periodically checks for these circular waits\n• When found, the database picks one transaction as the 'victim,' forcibly rolls it back, and lets the other proceed\n• The application receives a deadlock error on the rolled-back transaction and should retry it\n\n<b>How to Avoid Deadlocks in Application Design</b>\n• Always acquire locks on multiple rows/tables in a consistent, agreed order across all parts of the application\n• Keep transactions as short as possible — the shorter the window, the less chance of overlapping lock requests\n• Use appropriate isolation levels rather than over-locking manually",
    note:
      "Exam favourite: how do you prevent deadlocks at the application level? Consistent lock ordering — always acquire locks on resources in the same fixed order (e.g. always the lower account id first) across every code path.",
    diagram:
      "  T1: locks Row A ──┐              T2: locks Row B ──┐\n                      │                                 │\n  T1: wants Row B ◄───┼── held by T2                    │\n                      │                                 │\n  T2: wants Row A ◄───┴─────────────────────────────────┘  held by T1\n\n  T1 waits on T2, T2 waits on T1 — circular wait = DEADLOCK\n  Database detects this and rolls back one transaction (the 'victim').",
    code:
      "-- Transaction 1                             -- Transaction 2\nBEGIN;                                        BEGIN;\nUPDATE accounts SET balance = balance - 10    UPDATE accounts SET balance = balance - 5\n  WHERE id = 1;   -- locks row 1                 WHERE id = 2;   -- locks row 2\nUPDATE accounts SET balance = balance + 10    UPDATE accounts SET balance = balance + 5\n  WHERE id = 2;   -- waits for T2's lock          WHERE id = 1;   -- waits for T1's lock\n                                               -- DEADLOCK: database rolls back one, e.g. T2\nCOMMIT;                                       -- app catches the error and retries T2",
    codeLanguage: "SQL",
    tags: ["Deadlock", "Locking", "Concurrency", "Lock Ordering"],
  },
  // ─────────────────────────────────────────────
  // OPERATING SYSTEMS
  // ─────────────────────────────────────────────
  {
    id: 195,
    slug: "os-basics",
    section: "Operating Systems",
    title: "OS Basics",
    tagline: "What an operating system is, what it does, and the different types of OS in use",
    description:
      "<b>What This Covers</b>\nOS Basics is the foundation of this whole syllabus section — what an operating system actually is, the jobs it performs behind every program you run, and the different ways an OS can be built depending on what it needs to optimize for.\n\n<b>What You'll Learn Here</b>\n• <b>OS Functions</b> — the core responsibilities every operating system handles: process management, memory management, file management, device management, security, and the user interface\n• <b>Types of OS</b> — Batch, Time-Sharing, Distributed, and Real-Time operating systems, each built around a different priority (throughput, fairness, scale, or deadlines)\n  ↳ Once these two are clear, the rest of the syllabus — Process Management, Deadlock, Memory Management, and File System — is really just zooming into one OS function at a time.",
    note:
      "Think of an OS as a resource manager first, and an interface second. Exams often ask 'what is an OS' expecting the manager definition — a program that manages hardware resources and provides a platform for applications to run on — not just 'the software you see on screen.'",
    diagram:
      "  WHERE THE OS SITS\n\n   User\n    │\n    ▼\n  Application Software   (browser, word processor, games)\n    │\n    ▼\n  OPERATING SYSTEM   ← manages everything below, serves everything above\n    │\n    ▼\n  Hardware   (CPU, RAM, disk, keyboard, screen, network card)",
    tags: ["Operating System", "OS Basics", "OS Functions", "Types of OS"],
  },
  {
    id: 196,
    slug: "os-functions",
    section: "Operating Systems",
    parentSlug: "os-basics",
    title: "OS Functions",
    tagline: "The core jobs every operating system does behind the scenes",
    description:
      "<b>What an OS Is, in Plain English</b>\nAn operating system (OS) is the software layer that sits between the raw hardware of a computer and every application you run — it manages the hardware's resources and gives programs a consistent, simplified way to use them, so a developer never has to write code that talks directly to a physical disk head or a specific keyboard chip.\n  ↳ Analogy: think of the OS as the manager of a busy hotel — it doesn't cook the food or clean the rooms itself, but it schedules staff, allocates rooms, and makes sure guests (programs) never collide with each other while sharing the same building (hardware).\n\n<b>Core Functions of an OS</b>\n• <b>Process Management</b> — decides which program gets the CPU and for how long, creates and terminates processes, and switches between them so multiple programs appear to run at once\n  ↳ Covered in full in the Process Management chapter\n• <b>Memory Management</b> — allocates RAM to running programs, keeps one program's memory from being overwritten by another, and moves data between RAM and disk when memory runs low\n  ↳ Covered in full in the Memory Management chapter\n• <b>File Management</b> — organizes data into files and directories on storage devices, and controls how programs create, read, write, and delete them\n  ↳ Covered in full in the File System chapter\n• <b>Device Management</b> — controls communication with hardware devices (keyboard, mouse, printer, disk) through device drivers, so applications don't need device-specific code\n• <b>Security and Access Control</b> — authenticates users, and controls which users and programs are allowed to read, write, or execute which files and resources\n• <b>User Interface</b> — provides a way for humans to interact with the computer, either a Command Line Interface (CLI, typed commands) or a Graphical User Interface (GUI, windows/icons/menus)\n\n<b>Real-World Example</b>\nWhen you double-click a video file: the OS's file management locates the file on disk, device management reads the data through the disk driver, memory management loads chunks of the video into RAM, and process management gives the video player enough CPU time to decode and play it smoothly — all six functions working together for one click.",
    note:
      "Exam favourite: if a question lists 'process, memory, file, device, security, UI' and asks which is NOT an OS function, watch for compiler, linker, or application software slipped into the list — those are separate software, not OS responsibilities.",
    diagram:
      "  ONE OS, SIX JOBS\n\n           ┌─────────────────────────┐\n           │     Operating System     │\n           └─────────────────────────┘\n              │      │      │      │\n        Process  Memory  File   Device\n        Mgmt     Mgmt    Mgmt   Mgmt\n              │      │      │      │\n           Security      User Interface\n           & Access      (CLI / GUI)\n           Control",
    tags: ["OS Functions", "Process Management", "Memory Management", "File Management", "Device Management", "Security"],
  },
  {
    id: 197,
    slug: "types-of-os",
    section: "Operating Systems",
    parentSlug: "os-basics",
    title: "Types of OS",
    tagline: "Batch, Time-Sharing, Distributed, and Real-Time — each optimized for a different priority",
    description:
      "<b>Why There's More Than One Type</b>\nNot every computer needs the same thing from its OS — a bank's overnight payroll run cares about total throughput, a university's shared server cares about fairness between users, a global company cares about coordinating machines across locations, and a heart monitor cares about never missing a deadline. Each of the four types below is an OS built around one of those priorities.\n\n<b>The Four Types, at a Glance</b>\n• <b>Batch OS</b> — collects jobs and runs them one after another with no user interaction, optimized for maximum throughput\n• <b>Time-Sharing OS</b> — rapidly switches the CPU between multiple users so each feels like they have the whole machine to themselves, optimized for fairness and responsiveness\n• <b>Distributed OS</b> — manages a group of separate, networked computers so they behave like one single system, optimized for scale and resource sharing\n• <b>Real-Time OS (RTOS)</b> — guarantees that a task completes within a strict time limit, optimized for predictability over raw speed\n  ↳ Each is covered in full in its own card next, with real-world examples.",
    note:
      "A simple way to remember all four: Batch = no user waiting, run it all together. Time-Sharing = many users, one CPU, switched fast. Distributed = many computers, one system. Real-Time = a deadline that must never be missed.",
    diagram:
      "  TYPES OF OS — what each one optimizes for\n\n  Batch OS            Time-Sharing OS        Distributed OS        Real-Time OS\n  (throughput,    vs  (fairness across   vs  (many machines,   vs  (strict deadlines,\n   no interaction)     many users)             one system)          predictability)",
    tags: ["Types of OS", "Batch OS", "Time-Sharing OS", "Distributed OS", "Real-Time OS"],
  },
  {
    id: 198,
    slug: "batch-os",
    section: "Operating Systems",
    parentSlug: "types-of-os",
    title: "Batch OS",
    tagline: "Jobs are grouped into batches and run one after another, with no user sitting at the machine",
    description:
      "<b>What a Batch OS Is, in Plain English</b>\nA Batch Operating System collects similar jobs into a group (a batch) and executes them one after another without any user interaction in between — a human sets up the batch in advance, and the computer works through the whole pile on its own.\n\n<b>How It Works</b>\n• Jobs with similar needs (e.g. all needing the same compiler, or all reading from tape) are grouped together by an operator\n• A special program called the batch monitor (or resident monitor) loads and runs each job in sequence, with no user present to respond to prompts\n• Once a job finishes, the next one in the batch starts automatically — there is no interactive back-and-forth\n\n<b>Why It Was Used</b>\n• Reduced CPU idle time between jobs, since the operator didn't need to manually load and configure each one\n• Made sense when computers were extremely expensive and had to be kept as busy as possible around the clock\n\n<b>Drawbacks</b>\n• No interaction — if a job has an error, the whole batch may need to be re-run from scratch\n• A single long job can block every job behind it in the queue\n• Poor response time makes it completely unsuitable for anything needing quick user feedback\n  ↳ Real-world examples: payroll processing, bank statement generation, end-of-day transaction batches, printing utility bills — all cases where a large volume of similar work is queued up and run overnight with no one watching.",
    note:
      "Exam favourite: the defining trait of Batch OS is 'no user interaction during execution' — if a question describes any interactivity at all, it's not a pure batch system.",
    diagram:
      "  BATCH OS — jobs run one after another, unattended\n\n  Job 1 ──► Job 2 ──► Job 3 ──► Job 4\n  (payroll)  (statements) (billing)  (reports)\n\n  Operator queues all 4 jobs in advance,\n  then the batch monitor runs them straight through — no user waits in between.",
    tags: ["Batch OS", "Batch Processing", "Batch Monitor", "Throughput"],
  },
  {
    id: 199,
    slug: "time-sharing-os",
    section: "Operating Systems",
    parentSlug: "types-of-os",
    title: "Time-Sharing OS",
    tagline: "The CPU is rapidly switched between users so each one feels like they have the machine to themselves",
    description:
      "<b>What a Time-Sharing OS Is, in Plain English</b>\nA Time-Sharing Operating System lets multiple users share one computer at the same time by giving each user a very small slice of CPU time in rapid rotation — the switching happens so fast that every user feels like they have the entire machine's undivided attention, even though dozens of others are logged in at once.\n\n<b>How It Works</b>\n• Each user (or task) is given a small unit of CPU time called a time slice or quantum\n• The OS switches rapidly from one user's task to the next, giving the illusion of simultaneous execution\n• This constant switching between tasks is called multitasking, and it's built on the same context switching mechanism covered in the Process Management chapter\n\n<b>Why It's an Improvement Over Batch OS</b>\n• Interactive — a user gets to see results and respond immediately, unlike batch systems where you wait for the whole batch to finish\n• Fair — every user gets a turn on the CPU in a predictable rotation, instead of one long job blocking everyone else\n\n<b>Trade-offs</b>\n• More overhead than Batch OS — the constant switching between tasks itself consumes CPU time\n• Response time depends on how many users are sharing the system; too many users slow everyone down\n  ↳ Real-world examples: multiple students logged into a shared university server, each editing and running their own programs simultaneously; modern multi-user Linux/UNIX systems accessed by many people over a network.",
    note:
      "Exam favourite: don't confuse Time-Sharing with Real-Time. Time-Sharing optimizes for fairness among multiple users; Real-Time optimizes for meeting a strict deadline for one critical task. A system can feel 'fast' without being real-time.",
    diagram:
      "  TIME-SHARING OS — rapid rotation gives the illusion of 'all at once'\n\n  CPU time:  [User A][User B][User C][User A][User B][User C]...\n              10ms    10ms    10ms    10ms    10ms    10ms\n\n  Each slice is so short every user feels like they have\n  the whole CPU to themselves.",
    tags: ["Time-Sharing OS", "Multitasking", "Time Slice", "Multi-User"],
  },
  {
    id: 200,
    slug: "distributed-os",
    section: "Operating Systems",
    parentSlug: "types-of-os",
    title: "Distributed OS",
    tagline: "Multiple independent computers, connected over a network, working together as one system",
    description:
      "<b>What a Distributed OS Is, in Plain English</b>\nA Distributed Operating System manages a group of physically separate computers connected by a network so that, from a user's point of view, they behave like a single unified system — the user doesn't need to know or care which physical machine actually does the work.\n\n<b>How It Works</b>\n• Multiple autonomous computers (nodes), each with its own CPU and memory, are connected over a network\n• The distributed OS coordinates communication and resource sharing between nodes, and can move a task from an overloaded node to a free one\n• Resources like files, printers, and processing power are shared transparently across the whole network\n\n<b>Why It's Used</b>\n• Scalability — more nodes can be added to handle more load, rather than being limited by one machine's hardware ceiling\n• Fault tolerance — if one node fails, the system can often continue running using the remaining nodes\n• Resource sharing — expensive resources (storage, specialized processors) can be shared across many users instead of duplicated on every machine\n\n<b>Trade-offs</b>\n• Much more complex to design and manage than a single-machine OS — coordinating many machines over a network introduces communication delays and failure scenarios a single-machine OS never has to deal with\n• Network failures can affect the whole system's ability to function\n  ↳ Real-world examples: cloud computing platforms (Google, AWS) that spread workloads across thousands of machines; large-scale search engines where a single query is processed by many machines in parallel.",
    note:
      "Exam favourite: the defining trait of Distributed OS is transparency — the user issues one request and never has to know which of the many physical machines actually served it.",
    diagram:
      "  DISTRIBUTED OS — many machines, one logical system\n\n   Node A ── Node B ── Node C ── Node D\n     │         │         │         │\n     └─────────┴────network─┴─────────┘\n                    │\n              User sees ONE system,\n              not four separate computers",
    tags: ["Distributed OS", "Distributed Systems", "Scalability", "Fault Tolerance"],
  },
  {
    id: 201,
    slug: "real-time-os",
    section: "Operating Systems",
    parentSlug: "types-of-os",
    title: "Real-Time OS",
    tagline: "Guarantees a task finishes within a strict deadline — predictability matters more than raw speed",
    description:
      "<b>What a Real-Time OS Is, in Plain English</b>\nA Real-Time Operating System (RTOS) is built to guarantee that a specific task completes within a fixed, predictable time limit (a deadline) — being predictable matters more than being fast on average, because in a real-time system, a late result can be as bad as a wrong one.\n\n<b>Hard vs. Soft Real-Time</b>\n• <b>Hard real-time</b> — missing a deadline causes total system failure or is unacceptable; there is no tolerance at all\n  ↳ Examples: airbag deployment systems, pacemakers, aircraft flight-control systems\n• <b>Soft real-time</b> — missing a deadline degrades quality but the system keeps working; occasional lateness is tolerated\n  ↳ Examples: video streaming (a dropped frame is annoying, not catastrophic), online gaming\n\n<b>How It Achieves Predictability</b>\n• Uses priority-based scheduling so the most time-critical task always preempts less urgent ones (see Priority Scheduling in the Process Management chapter)\n• Minimizes unpredictable delays — interrupt handling and task switching are kept as fast and consistent as possible\n• Trades away some average-case throughput in exchange for a guarantee on worst-case response time\n\n<b>RTOS vs. a Regular OS</b>\n• A regular desktop OS (Windows, general Linux) optimizes for good average performance across many tasks, with no hard guarantee on any single task's timing\n• An RTOS is willing to sacrifice average throughput specifically to guarantee that the most critical task never misses its deadline\n  ↳ Real-world examples: air traffic control systems, industrial robotic arms on an assembly line, medical monitoring equipment, anti-lock braking systems (ABS) in cars.",
    note:
      "Exam favourite: if a scenario says missing the deadline is catastrophic or unacceptable, it's hard real-time. If it says missing the deadline just degrades quality, it's soft real-time. Both still need an RTOS — the difference is the cost of being late.",
    diagram:
      "  REAL-TIME OS — the deadline is the whole point\n\n  Task arrives ──► Must finish by deadline T ──► Result delivered\n                        │\n                        ▼\n              Missed deadline?\n              Hard RT: system failure (e.g. airbag too late)\n              Soft RT: degraded quality (e.g. dropped video frame)",
    tags: ["Real-Time OS", "RTOS", "Hard Real-Time", "Soft Real-Time", "Deadline"],
  },
  {
    id: 202,
    slug: "process-management",
    section: "Operating Systems",
    title: "Process Management",
    tagline: "How the OS represents, tracks, and shares the CPU across every running program",
    description:
      "<b>What This Covers</b>\nProcess Management looks at how the OS keeps track of every running program, switches the CPU between them, and decides who gets to run next — the machinery that makes multitasking possible.\n\n<b>What You'll Learn Here</b>\n• <b>Process</b> — a program in execution, and the states it moves through from creation to termination\n• <b>Thread</b> — a lighter-weight unit of execution living inside a process\n• <b>PCB (Process Control Block)</b> — the data structure the OS uses to remember everything about a process\n• <b>Context Switching</b> — how the CPU saves one process's state and loads another's\n• <b>CPU Scheduling</b> — the algorithms that decide which process runs next (FCFS, SJF, Round Robin, Priority Scheduling)\n  ↳ These build on each other in order: first what a process and thread actually are, then how the OS remembers a process's state (PCB), then how it swaps between processes (context switching), then the rules it uses to decide who goes next (scheduling algorithms).",
    note:
      "Read this chapter in order — Context Switching only makes sense once you know what's stored in a PCB, and CPU Scheduling only makes sense once you understand that a context switch is what actually happens every time the scheduler picks a new process.",
    diagram:
      "  PROCESS MANAGEMENT — how the topics build on each other\n\n  Process /      PCB              Context           CPU\n  Thread    ──►  (state saved  ──►  Switching   ──►  Scheduling\n  (the unit)      per process)      (swap in/out)     (who's next?)",
    tags: ["Process Management", "Process", "Thread", "PCB", "Context Switching", "CPU Scheduling"],
  },
  {
    id: 203,
    slug: "process",
    section: "Operating Systems",
    parentSlug: "process-management",
    title: "Process",
    tagline: "A program in execution — code that's actually running, not just sitting on disk",
    description:
      "<b>What a Process Is, in Plain English</b>\nA process is a program in execution. A program is just a passive file sitting on disk (like an .exe or a compiled binary); the moment you run it, the OS creates a process for it — an active entity with its own memory, its own state, and its own place in line for the CPU.\n  ↳ Analogy: a program is like a recipe written on paper — it doesn't do anything by itself. A process is that recipe actually being cooked right now, with ingredients (memory) laid out and a specific step (instruction) currently underway.\n\n<b>What a Process Contains</b>\n• <b>Program code (text section)</b> — the actual instructions being executed\n• <b>Program counter</b> — tracks which instruction is currently being run\n• <b>Process stack</b> — holds temporary data like function parameters, return addresses, and local variables\n• <b>Data section</b> — holds global variables\n• <b>Heap</b> — memory dynamically allocated while the process runs\n\n<b>Process States</b>\nEvery process moves through a well-defined set of states during its lifetime:\n• <b>New</b> — the process is being created\n• <b>Ready</b> — the process is loaded into memory and waiting for the CPU, but isn't running yet\n• <b>Running</b> — the process's instructions are currently being executed by the CPU\n• <b>Waiting (blocked)</b> — the process is paused, waiting for some event (like I/O completion) before it can continue\n• <b>Terminated</b> — the process has finished execution and is being removed\n\n<b>One Program, Many Processes</b>\nA single program can be run multiple times, creating multiple independent processes — opening three browser tabs of the same browser executable creates three separate processes, each with its own memory and state, even though they all started from the identical program file.",
    note:
      "Exam favourite: 'program vs process' is a top confusion. A program is a passive file on disk (static); a process is that program actively running in memory (dynamic), with its own state and resources.",
    diagram:
      "  PROCESS STATE DIAGRAM\n\n        ┌────┐  admitted   ┌───────┐  scheduler dispatch   ┌─────────┐\n        │ New│────────────►│ Ready │──────────────────────►│ Running │\n        └────┘              └───────┘◄──────────────────────└─────────┘\n                                ▲       time-out / preempted        │\n                                │                                    │ I/O or event wait\n                                │           I/O or event complete    ▼\n                                └───────────────────────────────┌─────────┐\n                                                                 │ Waiting │\n                                                                 └─────────┘\n                                                                      │\n                        Running ──► exit ──► ┌────────────┐          │\n                                              │ Terminated │◄─────────┘ (rare direct path)\n                                              └────────────┘",
    tags: ["Process", "Process States", "Program Counter", "Ready Queue", "Multitasking"],
  },
  {
    id: 204,
    slug: "thread",
    section: "Operating Systems",
    parentSlug: "process-management",
    title: "Thread",
    tagline: "A lightweight unit of execution inside a process — multiple threads can share the same memory",
    description:
      "<b>What a Thread Is, in Plain English</b>\nA thread is the smallest unit of execution within a process. A single process can contain multiple threads, and all of them share the same memory space (code, data, heap) belonging to that process, while each thread keeps its own program counter, stack, and set of registers.\n  ↳ Analogy: if a process is a whole restaurant kitchen, threads are the individual chefs working in it — they share the same ingredients, counters, and equipment (the process's memory), but each chef is independently working on their own dish (their own instruction stream) at the same time.\n\n<b>Why Threads Exist</b>\n• Creating a new process is expensive — it needs its own separate memory space allocated and set up\n• Creating a new thread inside an existing process is much cheaper, since it reuses the process's already-allocated memory\n• Threads let a single application do several things concurrently — for example, a word processor might use one thread to accept keystrokes and another to run spell-check in the background, without either one freezing the other\n\n<b>Process vs. Thread</b>\n• A process has its own independent memory space; threads within one process share that same memory space\n• Switching between processes is expensive (a full context switch, including memory mapping); switching between threads of the same process is cheaper, since memory doesn't need to be re-mapped\n• If one process crashes, it generally doesn't affect other processes; if one thread crashes badly enough, it can bring down the whole process (and every thread in it) since they share memory\n\n<b>Multithreading</b>\nRunning multiple threads within a single process, allowing several tasks to progress at once — used heavily in web servers (each client request handled by its own thread while sharing the same loaded application code) and in modern applications like browsers (one thread per tab, sharing the same browser process resources).",
    note:
      "Exam favourite: 'threads of the same process share memory, but each has its own stack and program counter.' If a question says two execution units crash independently of each other, that points to separate processes, not threads of the same process.",
    diagram:
      "  ONE PROCESS, MULTIPLE THREADS\n\n  ┌─────────────────────────── Process ───────────────────────────┐\n  │  Shared: Code, Data, Heap, Open Files                           │\n  │                                                                  │\n  │   Thread 1          Thread 2          Thread 3                  │\n  │   own stack         own stack         own stack                 │\n  │   own registers      own registers     own registers             │\n  │   own program        own program       own program               │\n  │   counter             counter           counter                  │\n  └──────────────────────────────────────────────────────────────┘",
    tags: ["Thread", "Multithreading", "Process vs Thread", "Concurrency"],
  },
  {
    id: 205,
    slug: "pcb",
    section: "Operating Systems",
    parentSlug: "process-management",
    title: "PCB (Process Control Block)",
    tagline: "The data structure the OS uses to remember absolutely everything about a process",
    description:
      "<b>What a PCB Is, in Plain English</b>\nA Process Control Block (PCB) is a data structure the operating system maintains for every single process — it's essentially the process's identity card and memory of itself, holding all the information the OS needs to pause a process and later resume it exactly where it left off.\n\n<b>What's Stored in a PCB</b>\n• <b>Process ID (PID)</b> — a unique number identifying the process\n• <b>Process state</b> — whether it's currently New, Ready, Running, Waiting, or Terminated\n• <b>Program counter</b> — the address of the next instruction to execute for this specific process\n• <b>CPU registers</b> — the exact values held in the CPU's registers when this process was last paused, so they can be restored precisely\n• <b>CPU scheduling information</b> — the process's priority, and pointers to scheduling queues it belongs to\n• <b>Memory management information</b> — the base and limit registers, page tables, or segment tables belonging to this process\n• <b>Accounting information</b> — CPU time used so far, time limits, process ID of its parent\n• <b>I/O status information</b> — the list of I/O devices allocated to this process, and any open files\n\n<b>Why the PCB Matters</b>\nThe PCB is exactly what makes context switching possible — when the OS pauses Process A to run Process B, it saves every piece of Process A's current state into Process A's PCB. Later, when Process A is scheduled to run again, the OS reloads the CPU with the exact values stored in that PCB, so Process A resumes as if it was never interrupted at all.",
    note:
      "Exam favourite: the PCB is the single source of truth the OS uses during a context switch — 'save state into the old process's PCB, load state from the new process's PCB' is the exact two-step description examiners look for.",
    diagram:
      "  PROCESS CONTROL BLOCK (PCB)\n\n  ┌───────────────────────────────┐\n  │ Process ID (PID)               │\n  │ Process State (Ready/Running..)│\n  │ Program Counter                │\n  │ CPU Registers                  │\n  │ CPU Scheduling Info (priority) │\n  │ Memory Management Info         │\n  │ Accounting Info (CPU time used)│\n  │ I/O Status Info (open files)   │\n  └───────────────────────────────┘\n     ↑ one of these exists per process,\n       maintained by the OS the entire time it exists",
    tags: ["PCB", "Process Control Block", "Process State", "Context Switching"],
  },
  {
    id: 206,
    slug: "context-switching",
    section: "Operating Systems",
    parentSlug: "process-management",
    title: "Context Switching",
    tagline: "How the CPU saves one process's state and loads another's, so multitasking is possible",
    description:
      "<b>What Context Switching Is, in Plain English</b>\nContext switching is the process of saving the state of a currently running process (into its PCB) and loading the previously saved state of another process, so the CPU can switch from running one process to running another. This is the exact mechanism that makes multitasking work — the CPU is really only ever running one process at a time (per core), but switches between them fast enough that it looks simultaneous.\n\n<b>What Happens During a Context Switch, Step by Step</b>\n1. The scheduler decides Process A must be paused (its time slice ended, it's blocked waiting on I/O, or a higher-priority process arrived)\n2. The OS saves Process A's current CPU register values and program counter into Process A's PCB\n3. The OS loads Process B's previously saved register values and program counter from Process B's PCB\n4. The CPU resumes execution of Process B, continuing exactly where it last left off\n\n<b>Why Context Switching Has a Real Cost</b>\n• No useful work gets done during the switch itself — it's pure overhead, spent purely on saving and restoring state\n• Frequent, unnecessary context switching (called thrashing at the scheduling level) can waste enough CPU time that overall system throughput actually drops\n• This overhead is exactly why an OS doesn't switch processes constantly for no reason — schedulers try to balance responsiveness against the cost of switching too often\n\n<b>Where This Connects</b>\nEvery context switch is a change of the process's state (see Process) and is driven by the OS reading from and writing to the PCB — and it happens every single time the CPU Scheduling algorithm decides a different process should run next.",
    note:
      "Exam favourite: context switching itself does zero useful computation — it's pure overhead. If a question asks 'what is lost during a context switch,' the answer is CPU time that could have gone to actual process execution.",
    diagram:
      "  CONTEXT SWITCH — from Process A to Process B\n\n  Process A running ──► interrupt / time slice ends\n         │\n         ▼\n  Save Process A's state → Process A's PCB\n         │\n         ▼\n  Load Process B's state ← Process B's PCB\n         │\n         ▼\n  Process B resumes running exactly where it left off\n\n  (No useful work happens during the save/load — pure overhead.)",
    tags: ["Context Switching", "PCB", "Multitasking", "Scheduler", "Overhead"],
  },
  {
    id: 207,
    slug: "cpu-scheduling",
    section: "Operating Systems",
    parentSlug: "process-management",
    title: "CPU Scheduling",
    tagline: "The rules the OS uses to decide which ready process gets the CPU next",
    description:
      "<b>What CPU Scheduling Is, in Plain English</b>\nCPU scheduling is the set of rules the OS uses to decide, among all the processes currently in the Ready state, which one gets the CPU next. Since there's usually only one CPU (or a small number of cores) and many more processes wanting to run than there are CPUs available, the scheduler's job is to pick fairly and efficiently.\n\n<b>Key Terms Used to Measure Scheduling</b>\n• <b>Arrival time</b> — when a process enters the ready queue\n• <b>Burst time</b> — how much CPU time a process actually needs to finish\n• <b>Completion time</b> — when a process finishes execution\n• <b>Turnaround time</b> — completion time minus arrival time (the total time from arrival to finishing)\n• <b>Waiting time</b> — turnaround time minus burst time (the time a process spent waiting in the ready queue, not actually running)\n• <b>Response time</b> — the time from arrival until the process gets the CPU for the very first time\n\n<b>Preemptive vs. Non-Preemptive Scheduling</b>\n• <b>Non-preemptive</b> — once a process starts running, it keeps the CPU until it finishes or voluntarily gives it up (e.g. to wait for I/O); the scheduler can't interrupt it\n• <b>Preemptive</b> — the scheduler can forcibly pause a running process (e.g. because its time slice ran out, or a higher-priority process arrived) and give the CPU to someone else\n\n<b>The Algorithms Covered Next</b>\n• <b>FCFS (First Come, First Served)</b> — simplest possible rule: whoever arrived first runs first, non-preemptive\n• <b>SJF (Shortest Job First)</b> — the process with the shortest burst time runs first\n• <b>Round Robin</b> — every process gets a fixed, small time slice in rotation, preemptive by design\n• <b>Priority Scheduling</b> — the process with the highest priority runs first\n  ↳ Each is worked through with a full example (arrival times, burst times, a Gantt chart, and the resulting average waiting/turnaround times) in its own card next.",
    note:
      "Exam favourite: memorize the formulas — Turnaround Time = Completion Time − Arrival Time, and Waiting Time = Turnaround Time − Burst Time. Nearly every scheduling numerical question is built entirely on these two formulas.",
    diagram:
      "  SCHEDULING TIMELINE VOCABULARY\n\n  Arrival ────wait in ready queue────► Start running ────burst time────► Completion\n     │                                       │                                │\n     └──────────────── Waiting Time ─────────┘                                │\n     │                                                                        │\n     └───────────────────────── Turnaround Time ─────────────────────────────┘",
    tags: ["CPU Scheduling", "Burst Time", "Waiting Time", "Turnaround Time", "Preemptive", "Non-Preemptive"],
  },
  {
    id: 208,
    slug: "fcfs-scheduling",
    section: "Operating Systems",
    parentSlug: "cpu-scheduling",
    title: "FCFS (First Come, First Served)",
    tagline: "Whoever arrives first runs first — the simplest scheduling rule, but far from the fairest",
    description:
      "<b>What FCFS Is, in Plain English</b>\nFirst Come, First Served is the simplest CPU scheduling algorithm: processes are executed strictly in the order they arrive in the ready queue, exactly like a single-line queue at a bank counter — whoever joined the line first gets served first, and once someone reaches the counter they aren't interrupted until they're done.\n• Non-preemptive — once a process starts running, it keeps the CPU until it finishes completely\n• Implemented using a simple FIFO (First In, First Out) queue\n\n<b>The Convoy Effect — FCFS's Biggest Weakness</b>\nIf a long process arrives first, every short process behind it must wait for the entire long process to finish, even though each of them individually needs very little CPU time — this pileup of short jobs stuck behind one long job is called the convoy effect, and it's the single most common criticism of FCFS on exams.\n\n<b>Worked Example</b>\nThree processes arrive at the ready queue:\n• P1: arrival time 0, burst time 5\n• P2: arrival time 1, burst time 3\n• P3: arrival time 2, burst time 8\n\nSince FCFS runs strictly in arrival order:\n• P1 runs from 0 to 5\n• P2 runs from 5 to 8 (even though it arrived at 1, it waits for P1)\n• P3 runs from 8 to 16\n\nCompletion times: P1 = 5, P2 = 8, P3 = 16\nTurnaround time (Completion − Arrival): P1 = 5−0 = 5, P2 = 8−1 = 7, P3 = 16−2 = 14\nWaiting time (Turnaround − Burst): P1 = 5−5 = 0, P2 = 7−3 = 4, P3 = 14−8 = 6\nAverage waiting time = (0 + 4 + 6) / 3 = 3.33",
    note:
      "Exam favourite: FCFS has the simplest logic of all scheduling algorithms but tends to produce a poor average waiting time whenever a long job arrives early — that pileup effect is called the convoy effect, and examiners love asking you to name it.",
    diagram:
      "  FCFS GANTT CHART (P1 arr=0 burst=5, P2 arr=1 burst=3, P3 arr=2 burst=8)\n\n  |----- P1 -----|--- P2 ---|-------- P3 --------|\n  0              5          8                    16\n\n  P2 arrived at time 1 but had to wait until time 5 —\n  it sat behind P1 the whole time, even though its own burst is short.",
    code:
      "// FCFS: sort by arrival time, run each to completion in that order\nstruct Process { int pid, arrival, burst; };\n\nvoid fcfs(struct Process p[], int n) {\n    // sort processes by arrival time first\n    int time = 0;\n    for (int i = 0; i < n; i++) {\n        if (time < p[i].arrival) time = p[i].arrival;\n        int start = time;\n        time += p[i].burst;              // process runs to completion\n        int completion = time;\n        int turnaround = completion - p[i].arrival;\n        int waiting = turnaround - p[i].burst;\n        printf(\"P%d: waiting=%d turnaround=%d\\n\", p[i].pid, waiting, turnaround);\n    }\n}",
    codeLanguage: "C",
    tags: ["FCFS", "CPU Scheduling", "Convoy Effect", "Non-Preemptive"],
  },
  {
    id: 209,
    slug: "sjf-scheduling",
    section: "Operating Systems",
    parentSlug: "cpu-scheduling",
    title: "SJF (Shortest Job First)",
    tagline: "The process with the shortest burst time runs first — provably optimal for average waiting time",
    description:
      "<b>What SJF Is, in Plain English</b>\nShortest Job First always picks the ready process with the smallest burst time (the least CPU time needed) to run next. Among all algorithms that don't use priorities, SJF gives the lowest possible average waiting time — mathematically, running short jobs first minimizes how long, on average, everyone waits.\n\n<b>Non-Preemptive vs. Preemptive SJF</b>\n• <b>Non-preemptive SJF</b> — once the shortest available job starts, it runs to completion, even if a shorter job arrives while it's running\n• <b>Preemptive SJF (also called Shortest Remaining Time First, SRTF)</b> — if a new process arrives with a burst time shorter than the remaining time of the currently running process, the CPU is immediately taken away and given to the new, shorter process\n\n<b>The Big Catch — It Needs to Know the Future</b>\nSJF requires knowing each process's burst time in advance, which is rarely possible in a real system — the OS can only estimate future burst time based on a process's past behavior, so pure SJF is mostly a theoretical benchmark rather than something used exactly as-is in production schedulers.\n\n<b>Worked Example (Non-Preemptive)</b>\nFour processes, all considered as if arriving at time 0 for simplicity:\n• P1: burst 6, P2: burst 8, P3: burst 7, P4: burst 3\n\nSJF runs shortest burst first: P4 (3) → P1 (6) → P3 (7) → P2 (8)\n• P4: 0 to 3\n• P1: 3 to 9\n• P3: 9 to 16\n• P2: 16 to 24\n\nWaiting time = start time (since all arrived at 0): P4 = 0, P1 = 3, P3 = 9, P2 = 16\nAverage waiting time = (0 + 3 + 9 + 16) / 4 = 7",
    note:
      "Exam favourite: SJF minimizes average waiting time among non-preemptive algorithms — but it can cause starvation, where a long process keeps getting pushed back forever because shorter processes keep arriving and jumping ahead of it.",
    diagram:
      "  SJF GANTT CHART (all arrive at t=0: P1=6, P2=8, P3=7, P4=3)\n\n  |-- P4 --|----- P1 -----|------ P3 ------|-------- P2 --------|\n  0        3              9               16                   24\n\n  Shortest burst (P4=3) always goes first, longest (P2=8) goes last.",
    code:
      "// Non-preemptive SJF: pick the ready process with smallest burst time each time\nstruct Process { int pid, arrival, burst, done; };\n\nvoid sjf(struct Process p[], int n) {\n    int time = 0, completed = 0;\n    while (completed < n) {\n        int idx = -1, minBurst = 999999;\n        for (int i = 0; i < n; i++) {\n            if (!p[i].done && p[i].arrival <= time && p[i].burst < minBurst) {\n                minBurst = p[i].burst;\n                idx = i;\n            }\n        }\n        if (idx == -1) { time++; continue; }   // no process ready yet\n        time += p[idx].burst;                  // run to completion\n        p[idx].done = 1;\n        completed++;\n    }\n}",
    codeLanguage: "C",
    tags: ["SJF", "SRTF", "CPU Scheduling", "Starvation", "Optimal Waiting Time"],
  },
  {
    id: 210,
    slug: "round-robin-scheduling",
    section: "Operating Systems",
    parentSlug: "cpu-scheduling",
    title: "Round Robin",
    tagline: "Every process gets a fixed time slice in rotation — fair, preemptive, and the basis of Time-Sharing OS",
    description:
      "<b>What Round Robin Is, in Plain English</b>\nRound Robin gives every process in the ready queue a fixed, small unit of CPU time called a time quantum, in strict rotation. If a process doesn't finish within its quantum, it's paused (preempted), placed at the back of the ready queue, and the next process in line gets its turn — the CPU keeps cycling through the queue this way until every process finishes.\n\n<b>Why It's Fair</b>\n• Every process gets guaranteed, regular access to the CPU — no process can be starved forever, unlike SJF or Priority Scheduling\n• This is the scheduling algorithm behind Time-Sharing OS — the rapid rotation between users described there is exactly Round Robin in action\n\n<b>Choosing the Time Quantum</b>\n• Too small — the system spends too much time context switching relative to actual work done, hurting overall throughput\n• Too large — Round Robin starts behaving just like FCFS, since most processes finish within one long quantum anyway, losing its fairness advantage\n• A well-chosen quantum balances responsiveness against context-switching overhead\n\n<b>Worked Example (Time Quantum = 4)</b>\nThree processes, all arriving at time 0:\n• P1: burst 10, P2: burst 5, P3: burst 8\n\n• P1 runs 0→4 (6 remaining), P2 runs 4→8 (1 remaining), P3 runs 8→12 (4 remaining)\n• P1 runs 12→16 (2 remaining), P2 runs 16→17 (0 remaining, done), P3 runs 17→21 (0 remaining, done)\n• P1 runs 21→23 (0 remaining, done)\n\nCompletion times: P1 = 23, P2 = 17, P3 = 21\nTurnaround time: P1 = 23, P2 = 17, P3 = 21\nWaiting time: P1 = 23−10 = 13, P2 = 17−5 = 12, P3 = 21−8 = 13\nAverage waiting time = (13 + 12 + 13) / 3 = 12.67",
    note:
      "Exam favourite: Round Robin's defining trait is preemptive fairness via a fixed time quantum. If a question says every process gets a repeated, bounded turn regardless of length, that's Round Robin — the classic Time-Sharing OS scheduler.",
    diagram:
      "  ROUND ROBIN GANTT CHART (quantum = 4; P1=10, P2=5, P3=8, all arrive t=0)\n\n  |P1(4)|P2(4)|P3(4)|P1(4)|P2(1)|P3(4)|P1(2)|\n  0     4     8    12    16    17    21    23\n\n  Every process gets a bounded slice, cycles back to the queue if unfinished,\n  and eventually every process completes — no one waits forever.",
    code:
      "// Round Robin: each process gets `quantum` time, then cycles to the back of the queue\nstruct Process { int pid, remaining; };\n\nvoid roundRobin(struct Process p[], int n, int quantum) {\n    int time = 0, completed = 0;\n    while (completed < n) {\n        for (int i = 0; i < n; i++) {\n            if (p[i].remaining <= 0) continue;\n            int slice = (p[i].remaining < quantum) ? p[i].remaining : quantum;\n            time += slice;\n            p[i].remaining -= slice;\n            if (p[i].remaining == 0) completed++;  // finished within/at this slice\n        }\n    }\n}",
    codeLanguage: "C",
    tags: ["Round Robin", "Time Quantum", "CPU Scheduling", "Preemptive", "Time-Sharing OS"],
  },
  {
    id: 211,
    slug: "priority-scheduling",
    section: "Operating Systems",
    parentSlug: "cpu-scheduling",
    title: "Priority Scheduling",
    tagline: "The highest-priority process runs first — powerful, but prone to starving low-priority work",
    description:
      "<b>What Priority Scheduling Is, in Plain English</b>\nPriority Scheduling assigns every process a priority number, and the CPU always goes to the ready process with the highest priority. Lower numbers usually mean higher priority in most textbook conventions (priority 1 runs before priority 5), though the opposite convention is also used depending on the system — always check which direction a given question uses.\n\n<b>Preemptive vs. Non-Preemptive Priority Scheduling</b>\n• <b>Non-preemptive</b> — once a process starts running, it keeps the CPU until it finishes, even if a higher-priority process arrives afterward\n• <b>Preemptive</b> — if a new process arrives with higher priority than the one currently running, the CPU is immediately taken away and given to the new arrival\n\n<b>The Big Problem — Starvation</b>\nA low-priority process can wait indefinitely if higher-priority processes keep arriving ahead of it — in the worst case, it may never get the CPU at all. This is called starvation.\n• <b>Fix — Aging</b> — the OS gradually increases the priority of a process the longer it waits in the ready queue, guaranteeing that even a low-priority process will eventually become the highest-priority one and get its turn\n\n<b>Worked Example</b>\nFour processes, all arriving at time 0 (lower number = higher priority):\n• P1: burst 4, priority 2\n• P2: burst 3, priority 1\n• P3: burst 2, priority 4\n• P4: burst 5, priority 3\n\nRun order by priority (1 → 4): P2 (priority 1, burst 3) → P1 (priority 2, burst 4) → P4 (priority 3, burst 5) → P3 (priority 4, burst 2)\n• P2 runs 0→3, P1 runs 3→7, P4 runs 7→12, P3 runs 12→14\n\nWaiting time (start time, since all arrive at 0): P2 = 0, P1 = 3, P4 = 7, P3 = 12\nAverage waiting time = (0 + 3 + 7 + 12) / 4 = 5.5\n  ↳ Notice P3 has the shortest burst (2) but the lowest priority (4), so it's forced to wait the longest — exactly the starvation risk this algorithm carries.",
    note:
      "Exam favourite: priority scheduling can starve low-priority processes indefinitely. The named fix is aging — gradually raising the priority of processes that have waited a long time so they eventually get scheduled.",
    diagram:
      "  PRIORITY SCHEDULING GANTT CHART (lower number = higher priority, all arrive t=0)\n\n  |---- P2(pri 1) ----|------- P1(pri 2) -------|---------- P4(pri 3) ----------|-- P3(pri 4) --|\n  0                    3                         7                              12               14\n\n  P3 has the shortest burst time (2) but the lowest priority — it runs dead last.",
    code:
      "// Priority scheduling: always pick the ready process with the highest priority (lowest number)\nstruct Process { int pid, arrival, burst, priority, done; };\n\nvoid priorityScheduling(struct Process p[], int n) {\n    int time = 0, completed = 0;\n    while (completed < n) {\n        int idx = -1, bestPriority = 999999;\n        for (int i = 0; i < n; i++) {\n            if (!p[i].done && p[i].arrival <= time && p[i].priority < bestPriority) {\n                bestPriority = p[i].priority;\n                idx = i;\n            }\n        }\n        if (idx == -1) { time++; continue; }\n        time += p[idx].burst;      // non-preemptive: runs to completion\n        p[idx].done = 1;\n        completed++;\n    }\n}",
    codeLanguage: "C",
    tags: ["Priority Scheduling", "Starvation", "Aging", "CPU Scheduling", "Preemptive"],
  },
  {
    id: 212,
    slug: "os-deadlock",
    section: "Operating Systems",
    title: "Deadlock",
    tagline: "Multiple processes stuck forever, each waiting for a resource another one is holding",
    description:
      "<b>What This Covers</b>\nDeadlock looks at what happens when multiple processes each hold a resource another one needs, creating a standstill that never resolves on its own — and the four different strategies an OS can use to deal with it.\n\n<b>What You'll Learn Here</b>\n• <b>Conditions for Deadlock</b> — the four conditions (Coffman conditions) that must all hold at once for a deadlock to be possible\n• <b>Deadlock Prevention</b> — designing the system so at least one of those four conditions can never occur\n• <b>Deadlock Avoidance</b> — allowing all four conditions to be possible, but carefully checking every resource request in advance to avoid an unsafe state\n• <b>Deadlock Detection</b> — allowing deadlocks to happen, then detecting and recovering from them after the fact\n  ↳ These four represent an escalating spectrum: prevent it from being possible at all → avoid it dynamically → detect and recover after it's already happened. Each trades some performance or flexibility for a stronger guarantee.",
    note:
      "This is a different 'deadlock' from the one covered in the Database Management System section (transaction locks) — the underlying idea (circular waiting) is the same, but here it's about OS-level resources like memory, printers, and files, not database rows.",
    diagram:
      "  DEADLOCK — a spectrum of strategies\n\n  Prevention        Avoidance             Detection\n  (make deadlock ──► (allow conditions ──► (let it happen,\n   impossible by       but check every       then find and\n   design)              request first)       recover from it)",
    tags: ["Deadlock", "Coffman Conditions", "Deadlock Prevention", "Deadlock Avoidance", "Deadlock Detection"],
  },
  {
    id: 213,
    slug: "deadlock-conditions",
    section: "Operating Systems",
    parentSlug: "os-deadlock",
    title: "Conditions for Deadlock",
    tagline: "The four conditions (Coffman conditions) that must ALL hold at once for a deadlock to occur",
    description:
      "<b>What a Deadlock Actually Is</b>\nA deadlock is a situation where a group of processes are each waiting for a resource that another process in the same group is holding, and none of them can proceed — a permanent standstill with no external intervention.\n\n<b>The Four Necessary Conditions (Coffman Conditions)</b>\nAll four of these must be true at the same time for a deadlock to be possible — if even one is broken, deadlock cannot occur.\n• <b>Mutual Exclusion</b> — at least one resource must be held in a non-shareable way; only one process can use that resource at a time\n  ↳ Example: a printer can only be used by one process at a time\n• <b>Hold and Wait</b> — a process is holding at least one resource while simultaneously waiting to acquire additional resources currently held by other processes\n  ↳ Example: Process A holds a printer and is waiting for a scanner, while still refusing to give up the printer\n• <b>No Preemption</b> — a resource can only be released voluntarily by the process holding it; the OS cannot forcibly take it away\n  ↳ Example: the OS cannot forcibly grab the printer back from Process A — Process A must release it on its own\n• <b>Circular Wait</b> — there exists a circular chain of two or more processes, where each is waiting for a resource held by the next process in the chain\n  ↳ Example: Process A waits for a resource held by Process B, Process B waits for a resource held by Process C, and Process C waits for a resource held by Process A\n\n<b>Worked Example — Putting All Four Together</b>\nProcess A holds Printer 1 and wants Scanner 1. Process B holds Scanner 1 and wants Printer 1.\n• Mutual exclusion — both the printer and scanner can only be used by one process at a time ✓\n• Hold and wait — each process holds one resource while waiting for the other ✓\n• No preemption — neither the OS nor the other process can force a release ✓\n• Circular wait — A waits on B, B waits on A — a cycle of exactly two ✓\nAll four hold at once — this is a genuine deadlock; neither process can ever proceed.",
    note:
      "Exam favourite: all four conditions must hold simultaneously — memorize them as Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait (often abbreviated MHNC or remembered as 'a process holds one thing, waits for another, can't be forced to give it up, in a circle').",
    diagram:
      "  CIRCULAR WAIT — the simplest deadlock, two processes\n\n  Process A ── holds ──► Printer\n      │                              ▲\n      │ wants                        │ held by\n      ▼                              │\n   Scanner ──────── holds ──── Process B\n\n  A holds Printer, wants Scanner (held by B).\n  B holds Scanner, wants Printer (held by A).\n  Neither can proceed — circular wait.",
    tags: ["Deadlock Conditions", "Coffman Conditions", "Mutual Exclusion", "Hold and Wait", "Circular Wait", "No Preemption"],
  },
  {
    id: 214,
    slug: "deadlock-prevention",
    section: "Operating Systems",
    parentSlug: "os-deadlock",
    title: "Deadlock Prevention",
    tagline: "Design the system so at least one of the four necessary conditions can never actually occur",
    description:
      "<b>What Deadlock Prevention Is, in Plain English</b>\nDeadlock prevention works by designing the system so that at least one of the four necessary conditions for deadlock (see Conditions for Deadlock) is structurally impossible — since all four must hold at once for a deadlock to happen, removing even one guarantees deadlock can never occur.\n\n<b>Attacking Each Condition</b>\n• <b>Attacking Mutual Exclusion</b> — make resources shareable wherever possible (e.g. read-only files can be opened by many processes at once); not always possible, since some resources (a printer) are inherently exclusive by nature\n• <b>Attacking Hold and Wait</b> — require a process to request and be granted all the resources it will ever need before it starts running, or require it to release everything it currently holds before requesting anything new\n  ↳ Downside: leads to low resource utilization, since a process might reserve resources it won't use until much later\n• <b>Attacking No Preemption</b> — if a process holding some resources requests another that isn't available, forcibly take away (preempt) its current resources instead of making it wait\n  ↳ Downside: only works cleanly for resources whose state can be easily saved and restored (like CPU registers), not for resources like a partially-printed document\n• <b>Attacking Circular Wait</b> — impose a strict, fixed numerical ordering on all resource types, and require every process to request resources only in increasing order\n  ↳ Example: if printers are numbered lower than scanners, a process must always request its printer before its scanner, never the reverse — this makes a circular chain of waiting mathematically impossible\n\n<b>The Most Practical Fix</b>\nAttacking Circular Wait through resource ordering is generally considered the most practical and widely-used prevention technique, since it doesn't waste resources the way 'grab everything up front' does, and it applies cleanly to almost any resource type.",
    note:
      "Exam favourite: 'how do you prevent deadlock without giving up too much resource efficiency?' Answer: enforce a strict resource ordering, breaking circular wait — the same principle used to prevent deadlock in database locking (see Locking in the Database Management System section).",
    diagram:
      "  PREVENTING DEADLOCK BY BREAKING CIRCULAR WAIT\n\n  Rule: resources must always be requested in increasing numeric order\n  (e.g. Printer = 1, Scanner = 2)\n\n  Process A: request Printer(1) → request Scanner(2)   ✓ increasing order\n  Process B: request Printer(1) → request Scanner(2)   ✓ same order for everyone\n\n  Neither process can ever request Scanner before Printer,\n  so the circular 'A waits for B, B waits for A' chain can never form.",
    tags: ["Deadlock Prevention", "Circular Wait", "Hold and Wait", "Resource Ordering"],
  },
  {
    id: 215,
    slug: "deadlock-avoidance",
    section: "Operating Systems",
    parentSlug: "os-deadlock",
    title: "Deadlock Avoidance",
    tagline: "Allow all four conditions to be possible, but check every resource request in advance to stay in a safe state",
    description:
      "<b>What Deadlock Avoidance Is, in Plain English</b>\nUnlike prevention (which removes a condition entirely), deadlock avoidance allows all four necessary conditions to remain possible, but the OS carefully evaluates every resource request in advance and only grants it if doing so keeps the system in a safe state — a state from which every process can still eventually finish, no matter what order they request resources in.\n\n<b>Safe State vs. Unsafe State</b>\n• <b>Safe state</b> — there exists at least one order in which every process could finish, even if all of them requested their maximum resource needs\n• <b>Unsafe state</b> — no such guaranteed order exists; the system might or might not deadlock depending on what happens next\n  ↳ An unsafe state doesn't necessarily mean deadlock has happened yet — it means deadlock has become possible, so the avoidance algorithm refuses to enter it in the first place.\n\n<b>The Banker's Algorithm</b>\nThe most famous deadlock avoidance algorithm, named after how a bank manages loans so it never lends out more than it can safely cover:\n• Each process declares its maximum possible resource need up front\n• Before granting any resource request, the OS pretends to grant it, then checks whether the system would still be in a safe state afterward\n• If granting the request would leave the system in a safe state, it's approved; if it would lead to an unsafe state, the request is denied (or delayed) even though the resource is currently available\n\n<b>Worked Example</b>\nA bank has 10 units of a resource. Three processes have declared these maximum needs: P1 needs up to 7, P2 needs up to 5, P3 needs up to 3.\n• Currently allocated: P1 has 3, P2 has 2, P3 has 2 (7 units allocated, 3 free)\n• Remaining need: P1 needs 4 more, P2 needs 3 more, P3 needs 1 more\n• With 3 units free, the OS checks: can any process finish with what's currently free? P3 needs only 1 more — yes, P3 can finish, releasing its 2 units back (making 5 free)\n• With 5 free, P2 needs 3 more — P2 can finish, releasing its resources (making 7 free)\n• With 7 free, P1 needs 4 more — P1 can finish\n• Since a completion order (P3 → P2 → P1) exists, this is a safe state, and any request that keeps this ordering possible is granted.",
    note:
      "Exam favourite: the Banker's Algorithm's whole point is to answer one question before granting any request — 'if I approve this, does at least one safe completion order still exist?' If yes, grant it; if no, deny it, even if the resource is technically available right now.",
    diagram:
      "  BANKER'S ALGORITHM — check before granting\n\n  New resource request arrives\n         │\n         ▼\n  Pretend to grant it (simulate)\n         │\n         ▼\n  Is there still an order in which\n  every process can finish?\n     │             │\n    YES            NO\n     │             │\n  GRANT it     DENY / DELAY it\n  (safe state)  (would be unsafe state)",
    tags: ["Deadlock Avoidance", "Banker's Algorithm", "Safe State", "Unsafe State"],
  },
  {
    id: 216,
    slug: "deadlock-detection",
    section: "Operating Systems",
    parentSlug: "os-deadlock",
    title: "Deadlock Detection",
    tagline: "Allow deadlocks to happen, then find and recover from them after the fact",
    description:
      "<b>What Deadlock Detection Is, in Plain English</b>\nDeadlock detection takes the most permissive approach of all: it doesn't prevent or avoid deadlocks at all — it lets the system run freely, periodically checks whether a deadlock has actually occurred, and if one is found, recovers from it. This trades a small amount of ongoing overhead (avoidance's constant request-checking) for the risk of occasionally having to recover after the fact.\n\n<b>How Detection Works — The Wait-For Graph</b>\n• The OS builds a wait-for graph: each process is a node, and an edge from Process A to Process B means 'A is waiting for a resource held by B'\n• If this graph contains a cycle, a deadlock exists among the processes in that cycle\n• The OS runs a cycle-detection algorithm over this graph periodically (or whenever a resource request would have to wait)\n\n<b>Recovery Once a Deadlock Is Detected</b>\n• <b>Process termination</b> — kill one or more processes in the deadlock cycle to break it, either killing all of them at once, or killing them one at a time until the cycle is broken\n• <b>Resource preemption</b> — forcibly take a resource away from one of the deadlocked processes and give it to another, rolling that process back to a safe earlier point so it can be restarted later\n\n<b>Choosing a Victim</b>\nWhen only one process needs to be terminated or have its resources preempted, the OS typically picks a victim based on factors like: how much CPU time it's already used (minimizing wasted work), how many resources it holds, and how many more resources it still needs — trying to pick the process whose rollback costs the least.\n\n<b>Detection vs. Avoidance vs. Prevention</b>\n• Prevention — removes a condition, deadlock is structurally impossible, but can waste resources\n• Avoidance — checks every request in advance (Banker's Algorithm), deadlock never happens, but has ongoing per-request overhead\n• Detection — allows deadlock to happen, checks for it periodically, and recovers when found — lowest overhead during normal operation, but recovery (killing a process) can be costly when it does occur",
    note:
      "Exam favourite: a cycle in the wait-for graph is the textbook signal of deadlock in a single-instance-per-resource-type system. If asked for the two recovery options once detected, the answer is always process termination or resource preemption.",
    diagram:
      "  WAIT-FOR GRAPH — a cycle means deadlock\n\n  Process A ──waits for──► Process B\n      ▲                         │\n      │                         │ waits for\n      └────── Process C ◄───────┘\n\n  A waits for B, B waits for C, C waits for A — a cycle.\n  The OS's cycle-detection algorithm finds this and\n  either kills one process or preempts one of its resources.",
    tags: ["Deadlock Detection", "Wait-For Graph", "Recovery", "Process Termination", "Resource Preemption"],
  },
  {
    id: 217,
    slug: "os-memory-management",
    section: "Operating Systems",
    title: "Memory Management",
    tagline: "How the OS divides, tracks, and extends RAM across every running process",
    description:
      "<b>What This Covers</b>\nMemory Management looks at how the OS gives every process the memory it needs, keeps processes from overwriting each other's memory, and stretches limited physical RAM to make it look bigger than it really is.\n\n<b>What You'll Learn Here</b>\n• <b>Paging</b> — dividing memory into fixed-size blocks (pages and frames) so a process's memory doesn't need to sit in one continuous chunk\n• <b>Segmentation</b> — dividing memory into variable-size logical chunks (segments) that match how a program is actually structured\n• <b>Virtual Memory</b> — using disk space to make a system behave as if it has more RAM than it physically does\n• <b>Page Replacement</b> — the algorithms (FIFO, LRU, Optimal) that decide which page to evict from RAM when it's full and a new page needs to be brought in\n  ↳ These build on each other: paging and segmentation are two different ways to divide memory up, virtual memory is what lets a system run programs bigger than physical RAM, and page replacement is the decision virtual memory has to make constantly once RAM fills up.",
    note:
      "Paging and Segmentation are often compared side by side on exams: paging divides memory into fixed-size blocks (simpler, avoids external fragmentation, but has internal fragmentation), while segmentation divides memory into variable-size logical blocks that match a program's structure (no internal fragmentation, but has external fragmentation).",
    diagram:
      "  MEMORY MANAGEMENT — how the topics connect\n\n  Paging /              Virtual Memory           Page Replacement\n  Segmentation   ──►    (disk extends      ──►   (which page to evict\n  (dividing memory)      RAM's limit)              when RAM is full)",
    tags: ["Memory Management", "Paging", "Segmentation", "Virtual Memory", "Page Replacement"],
  },
  {
    id: 218,
    slug: "paging",
    section: "Operating Systems",
    parentSlug: "os-memory-management",
    title: "Paging",
    tagline: "Dividing memory into fixed-size blocks so a process's memory never needs to be one continuous chunk",
    description:
      "<b>What Paging Is, in Plain English</b>\nPaging is a memory management scheme that divides a process's logical memory into fixed-size blocks called pages, and divides physical RAM into equal-size blocks called frames. A process's pages can be scattered across any free frames in RAM, in any order — they don't need to sit next to each other — because the OS keeps a page table that maps each page to whichever frame it's actually stored in.\n  ↳ Analogy: think of a book split into individually numbered pages that can be stored in any drawer of a filing cabinet, in any order — as long as there's an index card (the page table) recording which drawer holds page 1, which holds page 2, and so on, you can still read the book in the right order.\n\n<b>How Address Translation Works</b>\n• A logical (virtual) address a program uses is split into a page number and an offset within that page\n• The CPU looks up the page number in the page table to find which physical frame it's stored in\n• The offset is added to the frame's starting address to get the actual physical address in RAM\n\n<b>Internal Fragmentation</b>\nBecause pages are a fixed size, a process's last page is rarely completely full — the unused leftover space inside that final page is wasted, and this wasted space inside an allocated block is called internal fragmentation.\n  ↳ Example: if a page is 4 KB and a process's last page only uses 1 KB of actual data, the remaining 3 KB inside that page is wasted (internal fragmentation) — it can't be given to any other process.\n\n<b>Why Paging Solves External Fragmentation</b>\nSince any page can go into any free frame, there's never a situation where a process can't run just because free memory isn't contiguous — free frames scattered all over RAM can still all be used, unlike schemes that require one continuous block.",
    note:
      "Exam favourite: paging trades external fragmentation (which it eliminates, since pages don't need to be contiguous) for internal fragmentation (wasted space inside the last, partially-used page). This is the exact opposite trade-off from Segmentation.",
    diagram:
      "  PAGING — logical pages map to scattered physical frames\n\n  Process's Logical Memory        Physical RAM (Frames)\n  ┌──────────┐                    ┌──────────┐\n  │ Page 0   │──────────────────► │ Frame 2  │\n  ├──────────┤          ┌───────► │ Frame 5  │\n  │ Page 1   │──────────┘         ├──────────┤\n  ├──────────┤                    │ Frame 0  │ ← used by another process\n  │ Page 2   │────────────────────► Frame 7  │\n  └──────────┘                    └──────────┘\n\n  Page Table: Page 0→Frame 2, Page 1→Frame 5, Page 2→Frame 7\n  (Pages don't need to be next to each other in physical RAM.)",
    tags: ["Paging", "Page Table", "Frames", "Internal Fragmentation", "Address Translation"],
  },
  {
    id: 219,
    slug: "segmentation",
    section: "Operating Systems",
    parentSlug: "os-memory-management",
    title: "Segmentation",
    tagline: "Dividing memory into variable-size logical chunks that match how a program is actually structured",
    description:
      "<b>What Segmentation Is, in Plain English</b>\nSegmentation is a memory management scheme that divides a process's memory into variable-size logical units called segments, where each segment represents a meaningful part of the program — for example, one segment for its code, one for its global data, one for its stack, and one for each major function or module. Unlike paging's uniform fixed-size blocks, segments can be as large or small as the piece of the program they represent actually needs.\n  ↳ Analogy: instead of chopping a book into identical-size pages regardless of content, segmentation is like keeping the book split by chapter — each chapter (segment) is exactly as long as it needs to be, rather than forced into a fixed page count.\n\n<b>How Address Translation Works</b>\n• A logical address is split into a segment number and an offset within that segment\n• The OS keeps a segment table listing, for each segment, its base address (where it starts in physical memory) and its limit (how large it is)\n• The CPU looks up the segment number to find its base address, then adds the offset (after checking it doesn't exceed the limit) to get the physical address\n\n<b>External Fragmentation</b>\nBecause segments are variable in size, as segments are allocated and freed over time, physical memory ends up with small, scattered free gaps between segments that are individually too small to fit a new segment, even though the total free memory might be enough — this wasted memory between allocated blocks is called external fragmentation.\n\n<b>Segmentation vs. Paging</b>\n• Segmentation divides memory by logical meaning (code, stack, a specific function) — paging divides memory by fixed physical size with no regard for what's inside\n• Segmentation suffers from external fragmentation (gaps between segments); paging suffers from internal fragmentation (wasted space inside a page)\n• Some systems combine both, using segments made up of multiple pages, getting logical structure and avoiding pure external fragmentation at the same time",
    note:
      "Exam favourite: segmentation matches the programmer's logical view of a program (code, data, stack as separate segments) and suffers from external fragmentation — the direct opposite of paging, which matches physical memory's fixed-size view and suffers from internal fragmentation instead.",
    diagram:
      "  SEGMENTATION — variable-size logical segments\n\n  Process's Segments                Segment Table\n  ┌───────────────┐                 Segment | Base | Limit\n  │ Code segment  │  (large)        --------|------|------\n  ├───────────────┤                 Code    | 1000 | 2500\n  │ Stack segment │  (small)        Data    | 6000 |  800\n  ├───────────────┤                 Stack   | 4200 |  300\n  │ Data segment  │  (medium)\n  └───────────────┘\n\n  Each segment maps to its own base address + limit in physical memory —\n  segments don't need to be the same size like pages do.",
    tags: ["Segmentation", "Segment Table", "External Fragmentation", "Logical Memory"],
  },
  {
    id: 220,
    slug: "virtual-memory",
    section: "Operating Systems",
    parentSlug: "os-memory-management",
    title: "Virtual Memory",
    tagline: "Using disk space to let a system run programs bigger than the physical RAM it actually has",
    description:
      "<b>What Virtual Memory Is, in Plain English</b>\nVirtual memory is a technique that lets a computer run programs whose total memory needs exceed the amount of physical RAM actually installed, by using space on the disk as an extension of RAM — from a program's point of view, it appears to have access to a huge, continuous block of memory, even though only a portion of it is really sitting in physical RAM at any given moment.\n\n<b>Demand Paging</b>\nVirtual memory is typically implemented through demand paging — instead of loading a process's entire memory into RAM the moment it starts, the OS only loads a page when it's actually needed (referenced by an instruction).\n• If the CPU tries to access a page that isn't currently in RAM, this triggers a page fault\n• On a page fault, the OS pauses the process, fetches the required page from disk into a free RAM frame, updates the page table, and resumes the process at the exact instruction that caused the fault\n\n<b>Swapping</b>\nWhen RAM is full and a new page needs to come in, the OS may need to swap out (write back to disk) a page that's currently in RAM to free up a frame — this is exactly the decision that Page Replacement algorithms are responsible for making.\n\n<b>Why Virtual Memory Matters</b>\n• Lets a system run more, and larger, programs than physical RAM alone would allow\n• Lets each process believe it has its own private, large address space, isolated from every other process\n• Comes at a real performance cost — disk access is dramatically slower than RAM access, so too many page faults in a row (a condition called thrashing) can slow a system down far more than if it simply had more physical RAM to begin with",
    note:
      "Exam favourite: a page fault is not an error in the everyday sense — it's the normal, expected trigger that tells the OS 'go fetch this page from disk into RAM now.' Only excessive, back-to-back page faults (thrashing) indicate a real performance problem.",
    diagram:
      "  VIRTUAL MEMORY — RAM extended by disk\n\n  Process's Virtual Address Space (looks huge and continuous)\n  ┌───────────────────────────────────────────┐\n  │ Page A (in RAM) │ Page B (on disk) │ Page C (in RAM) │ ...\n  └───────────────────────────────────────────┘\n         │                    │                    │\n         ▼                    ▼                    ▼\n     Physical RAM         PAGE FAULT!          Physical RAM\n     (fast access)     OS fetches Page B      (fast access)\n                       from disk into RAM",
    tags: ["Virtual Memory", "Demand Paging", "Page Fault", "Swapping", "Thrashing"],
  },
  {
    id: 221,
    slug: "page-replacement",
    section: "Operating Systems",
    parentSlug: "os-memory-management",
    title: "Page Replacement",
    tagline: "Deciding which page to evict from RAM when it's full and a new page must be brought in",
    description:
      "<b>What Page Replacement Is, in Plain English</b>\nPage replacement is the decision the OS has to make when a page fault occurs but RAM has no free frames left — it must choose an existing page currently in RAM to evict (write back to disk if it's been modified, or simply discard if not) to make room for the page that's actually needed right now. The algorithm chosen for this decision directly affects how often future page faults happen.\n\n<b>The Shared Worked Example</b>\nAll three algorithms covered next (FIFO, LRU, Optimal) are worked through using the exact same reference string and the exact same number of frames, so their results can be compared directly:\n• Reference string (the sequence of pages requested, in order): 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2\n• Number of available frames: 3\n\n<b>What a 'Page Fault' Means Here</b>\nEvery time a requested page is not currently held in one of the 3 frames, that's a page fault, and the algorithm must decide which of the 3 currently-held pages to evict to make room for it. If the requested page is already in a frame, that's a hit, and no eviction is needed.\n\n<b>Comparing the Three</b>\n• <b>FIFO</b> — evicts whichever page has been in RAM the longest, regardless of how recently or often it was used\n• <b>LRU (Least Recently Used)</b> — evicts the page that hasn't been used for the longest time, on the theory that recently-used pages are likely to be used again soon\n• <b>Optimal</b> — evicts the page that won't be needed again for the longest time in the future; this needs to know the future, so it's used only as a theoretical best-case benchmark to measure the other algorithms against\n  ↳ Each is worked through fully, frame-by-frame, in its own card next.",
    note:
      "Exam favourite: Optimal always produces the fewest (or tied-fewest) page faults of any algorithm on the same reference string, since it has perfect future knowledge — it's the ceiling every real algorithm is compared against, not something you can actually implement.",
    diagram:
      "  PAGE REPLACEMENT — same reference string, three strategies\n\n  Reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2   (3 frames)\n\n  FIFO      — evict the OLDEST page in RAM\n  LRU       — evict the page unused for the LONGEST time\n  Optimal   — evict the page needed FURTHEST in the future",
    tags: ["Page Replacement", "Page Fault", "FIFO", "LRU", "Optimal Page Replacement"],
  },
  {
    id: 222,
    slug: "fifo-page-replacement",
    section: "Operating Systems",
    parentSlug: "page-replacement",
    title: "FIFO Page Replacement",
    tagline: "Evicts whichever page has been sitting in RAM the longest, regardless of how it's actually being used",
    description:
      "<b>What FIFO Page Replacement Is, in Plain English</b>\nFIFO (First In, First Out) page replacement evicts the page that has been in RAM the longest, treating all frames like a simple queue — the very first page that was loaded in is the very first one evicted when room is needed, no matter how recently or frequently it's actually been used since.\n\n<b>Worked Example</b>\nReference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2 — with 3 frames.\n\n• 7 → fault, frames: [7, _, _]\n• 0 → fault, frames: [7, 0, _]\n• 1 → fault, frames: [7, 0, 1]\n• 2 → fault, evict 7 (oldest), frames: [2, 0, 1]\n• 0 → hit (0 is in frames), frames: [2, 0, 1]\n• 3 → fault, evict 0 (oldest now), frames: [2, 3, 1]\n• 0 → fault, evict 1 (oldest now), frames: [2, 3, 0]\n• 4 → fault, evict 2 (oldest now), frames: [4, 3, 0]\n• 2 → fault, evict 3 (oldest now), frames: [4, 2, 0]\n• 3 → fault, evict 0 (oldest now), frames: [4, 2, 3]\n• 0 → fault, evict 4 (oldest now), frames: [0, 2, 3]\n• 3 → hit, frames: [0, 2, 3]\n• 2 → hit, frames: [0, 2, 3]\n\nTotal page faults: 10 (out of 13 requests)\n\n<b>Belady's Anomaly</b>\nFIFO has a famously counter-intuitive flaw: for some reference strings, adding MORE frames can actually increase the number of page faults, instead of decreasing it as you'd expect. This surprising behavior is called Belady's Anomaly, and FIFO is the classic example used to demonstrate it — most other algorithms (like LRU) don't have this problem.",
    note:
      "Exam favourite: FIFO is the only algorithm here prone to Belady's Anomaly (more frames → more faults, counter-intuitively). If a question mentions 'more frames caused more page faults,' the answer is always FIFO.",
    diagram:
      "  FIFO — reference string 7,0,1,2,0,3,0,4,2,3,0,3,2 (3 frames)\n\n  Ref:    7   0   1   2   0   3   0   4   2   3   0   3   2\n  Frame1: 7   7   7   2   2   2   2   4   4   4   0   0   0\n  Frame2: -   0   0   0   0   3   3   3   2   2   2   2   2\n  Frame3: -   -   1   1   1   1   0   0   0   3   3   3   3\n  Fault:  F   F   F   F   .   F   F   F   F   F   F   .   .\n\n  Total faults = 10   (evicts the OLDEST page in the frame each time)",
    code:
      "// FIFO page replacement using a queue of frame indices\nint frames[3] = {-1, -1, -1};\nint queueOrder[3];   // tracks insertion order (oldest at index 0)\nint faults = 0, nextEvict = 0;\n\nvoid accessPage(int page) {\n    for (int i = 0; i < 3; i++)\n        if (frames[i] == page) return;      // hit, nothing to do\n\n    frames[nextEvict] = page;               // evict the oldest slot\n    nextEvict = (nextEvict + 1) % 3;         // rotate to the next oldest\n    faults++;\n}",
    codeLanguage: "C",
    tags: ["FIFO", "Page Replacement", "Belady's Anomaly", "Page Fault"],
  },
  {
    id: 223,
    slug: "lru-page-replacement",
    section: "Operating Systems",
    parentSlug: "page-replacement",
    title: "LRU (Least Recently Used) Page Replacement",
    tagline: "Evicts the page that hasn't been used for the longest time — recently-used pages are likely needed again soon",
    description:
      "<b>What LRU Is, in Plain English</b>\nLRU (Least Recently Used) page replacement evicts the page that hasn't been accessed for the longest stretch of time, based on the reasonable real-world assumption that a page used recently is likely to be used again soon (this pattern is called locality of reference), while a page that hasn't been touched in a long time probably won't be needed again soon either.\n\n<b>Worked Example</b>\nReference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2 — with 3 frames.\n\n• 7 → fault, frames: [7, _, _]\n• 0 → fault, frames: [7, 0, _]\n• 1 → fault, frames: [7, 0, 1]\n• 2 → fault, evict 7 (least recently used), frames: [2, 0, 1]\n• 0 → hit, frames: [2, 0, 1] (0's last-used time updates)\n• 3 → fault, evict 1 (least recently used — 7 already gone, 1 unused longest), frames: [2, 0, 3]\n• 0 → hit, frames: [2, 0, 3]\n• 4 → fault, evict 2 (least recently used), frames: [4, 0, 3]\n• 2 → fault, evict 3 (least recently used), frames: [4, 0, 2]\n• 3 → fault, evict 4 (least recently used), frames: [3, 0, 2]\n• 0 → hit, frames: [3, 0, 2]\n• 3 → hit, frames: [3, 0, 2]\n• 2 → hit, frames: [3, 0, 2]\n\nTotal page faults: 8 (out of 13 requests) — fewer than FIFO's 10 on this same reference string, because LRU keeps page 0 in RAM the whole time once it notices how frequently it's reused, while FIFO evicted it purely because of when it first arrived.\n\n<b>The Cost of LRU</b>\nLRU needs to track exactly when each page was last used, which requires extra bookkeeping — either a counter/timestamp updated on every access, or a linked list that moves a page to the front every time it's touched. This makes LRU more expensive to implement precisely than FIFO, though it usually performs noticeably better in practice.",
    note:
      "Exam favourite: LRU does NOT suffer from Belady's Anomaly — it belongs to a class of algorithms (called stack algorithms) that are mathematically guaranteed to never get worse when given more frames. That's the key contrast with FIFO.",
    diagram:
      "  LRU — reference string 7,0,1,2,0,3,0,4,2,3,0,3,2 (3 frames)\n\n  Ref:    7   0   1   2   0   3   0   4   2   3   0   3   2\n  Frame1: 7   7   7   2   2   2   2   4   4   4   0   0   0\n  Frame2: -   0   0   0   0   0   0   0   2   2   2   2   2\n  Frame3: -   -   1   1   1   3   3   3   3   3   3   3   3\n  Fault:  F   F   F   F   .   F   .   F   F   F   .   .   .\n\n  Total faults = 8   (evicts the page unused for the LONGEST time — page 0 survives\n  because it keeps getting re-used, unlike in FIFO)",
    code:
      "// LRU page replacement using a 'last used' timestamp per frame\nint frames[3] = {-1, -1, -1};\nint lastUsed[3] = {0, 0, 0};\nint faults = 0, clock = 0;\n\nvoid accessPage(int page) {\n    clock++;\n    for (int i = 0; i < 3; i++) {\n        if (frames[i] == page) { lastUsed[i] = clock; return; }   // hit\n    }\n    int evictIdx = 0;\n    for (int i = 1; i < 3; i++)\n        if (lastUsed[i] < lastUsed[evictIdx]) evictIdx = i;        // find LRU frame\n\n    frames[evictIdx] = page;\n    lastUsed[evictIdx] = clock;\n    faults++;\n}",
    codeLanguage: "C",
    tags: ["LRU", "Page Replacement", "Locality of Reference", "Page Fault"],
  },
  {
    id: 224,
    slug: "optimal-page-replacement",
    section: "Operating Systems",
    parentSlug: "page-replacement",
    title: "Optimal Page Replacement",
    tagline: "Evicts the page that won't be needed for the longest time in the future — the theoretical best case",
    description:
      "<b>What Optimal Page Replacement Is, in Plain English</b>\nOptimal page replacement evicts whichever page in RAM will not be used again for the longest time in the future, guaranteeing the fewest possible page faults for a given reference string and number of frames. It requires knowing the entire future sequence of page requests in advance, which is impossible in a real running system — Optimal exists purely as a benchmark to measure how close a real algorithm (like FIFO or LRU) comes to the best possible result.\n\n<b>Worked Example</b>\nReference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2 — with 3 frames.\n\n• 7 → fault, frames: [7, _, _]\n• 0 → fault, frames: [7, 0, _]\n• 1 → fault, frames: [7, 0, 1]\n• 2 → fault — look ahead: 7 is never used again, 0 is used again soon, 1 is never used again → evict 7 (or 1; both never reused, pick either), evict 7, frames: [2, 0, 1]\n• 0 → hit, frames: [2, 0, 1]\n• 3 → fault — look ahead: 2 is used again (at position 9), 0 is used again very soon, 1 is never used again → evict 1, frames: [2, 0, 3]\n• 0 → hit, frames: [2, 0, 3]\n• 4 → fault — look ahead: 2 is used again soon (position 9), 0 is used again very soon, 3 is used again soon too, but 2's next use is furthest away among them → evict 2, frames: [4, 0, 3]\n• 2 → fault — look ahead: 4 is never used again, 0 is used again soon, 3 is used again soon → evict 4, frames: [2, 0, 3]\n• 3 → hit, frames: [2, 0, 3]\n• 0 → hit, frames: [2, 0, 3]\n• 3 → hit, frames: [2, 0, 3]\n• 2 → hit, frames: [2, 0, 3]\n\nTotal page faults: 7 (out of 13 requests) — fewer than both FIFO (10) and LRU (8) on the exact same reference string, confirming Optimal really is the best possible result.",
    note:
      "Exam favourite: Optimal is never actually implemented in a real OS — it's purely a yardstick used to evaluate how well a real, implementable algorithm (FIFO, LRU) performs compared to the theoretical best case on the same reference string.",
    diagram:
      "  OPTIMAL — reference string 7,0,1,2,0,3,0,4,2,3,0,3,2 (3 frames)\n\n  Ref:    7   0   1   2   0   3   0   4   2   3   0   3   2\n  Frame1: 7   7   7   2   2   2   2   2   2   2   2   2   2\n  Frame2: -   0   0   0   0   0   0   0   0   0   0   0   0\n  Frame3: -   -   1   1   1   3   3   4   4   3   3   3   3\n  Fault:  F   F   F   F   .   F   .   F   F   .   .   .   .\n\n  Total faults = 7   (fewest of all three — evicts whichever page is\n  needed FURTHEST in the future, or never again)",
    tags: ["Optimal Page Replacement", "Page Replacement", "Page Fault", "Belady's Anomaly"],
  },
  {
    id: 225,
    slug: "file-system",
    section: "Operating Systems",
    title: "File System",
    tagline: "How the OS organizes, allocates, and protects data stored on disk",
    description:
      "<b>What This Covers</b>\nFile System looks at how the OS turns a raw storage disk into organized, named files and folders that applications and users can actually work with — how space on disk is handed out to files, how those files are organized into a browsable structure, and how access to them is controlled.\n\n<b>What You'll Learn Here</b>\n• <b>File Allocation Methods</b> — contiguous, linked, and indexed allocation: the different ways disk blocks belonging to one file can be arranged on disk\n• <b>Directory Structure</b> — single-level, two-level, tree-structured, and acyclic-graph directory structures: the different ways files can be organized and found\n• <b>File Permissions</b> — read, write, and execute permissions for the owner, group, and others, controlling who can do what to a file\n  ↳ These three cover the full lifecycle: how a file's data is physically laid out on disk, how it's found and organized logically, and who's allowed to touch it once found.",
    note:
      "Exam favourite: don't confuse a file allocation method (how a single file's own blocks are arranged on disk) with a directory structure (how many different files and folders are organized so users can browse and find them) — they solve two completely different problems.",
    diagram:
      "  FILE SYSTEM — how the topics divide up the job\n\n  File Allocation        Directory Structure       File Permissions\n  (how ONE file's   ──►  (how MANY files/folders──►  (who can read/write/\n   blocks sit on disk)    are organized to be found)   execute a file)",
    tags: ["File System", "File Allocation", "Directory Structure", "File Permissions"],
  },
  {
    id: 226,
    slug: "file-allocation-methods",
    section: "Operating Systems",
    parentSlug: "file-system",
    title: "File Allocation Methods",
    tagline: "Contiguous, linked, and indexed — three different ways a file's blocks can be arranged on disk",
    description:
      "<b>What File Allocation Is, in Plain English</b>\nA file on disk is really stored as a set of individual disk blocks, and a file allocation method is the strategy the OS uses to decide how those blocks are arranged and linked together on the physical disk.\n\n<b>Contiguous Allocation</b>\nEach file is stored as one single continuous run of blocks on disk, back to back, like a single unbroken shelf of books.\n• <b>Advantage</b> — very fast to read, since the disk head doesn't need to jump around; also very simple, since only the starting block and the length need to be recorded\n• <b>Disadvantage</b> — suffers from external fragmentation, since files are created and deleted over time leaving disk space in scattered gaps; also makes it hard for a file to grow if the blocks right after it are already taken by another file\n\n<b>Linked Allocation</b>\nEach file is stored as a linked list of blocks scattered anywhere on disk, where every block holds a pointer to the location of the next block in the file.\n• <b>Advantage</b> — no external fragmentation, since blocks can be scattered anywhere on disk; files can also grow freely by simply linking on a new block wherever one is free\n• <b>Disadvantage</b> — slow for random access, since reaching block 100 of a file means following 99 pointers in sequence from the start; also risky, since a single corrupted pointer can break the whole chain from that point onward\n\n<b>Indexed Allocation</b>\nEach file gets its own dedicated index block, which simply stores a list of pointers to every block that belongs to the file — no chaining between data blocks at all.\n• <b>Advantage</b> — supports fast direct/random access (just look up the Nth entry in the index block, no need to follow a chain); also avoids external fragmentation, like linked allocation\n• <b>Disadvantage</b> — the index block itself uses extra disk space, and for very large files a single index block might not be able to hold pointers to every block the file needs\n\n<b>Which One Real File Systems Use</b>\nMost modern file systems (like NTFS, ext4) use indexed allocation or a close variant of it, because it gives fast random access without contiguous allocation's fragmentation problem.",
    note:
      "Exam favourite: match each method to its defining weakness — Contiguous → external fragmentation. Linked → slow random access (must follow pointers one by one). Indexed → extra space for the index block itself. Most real file systems today are indexed-based.",
    diagram:
      "  THREE FILE ALLOCATION METHODS\n\n  CONTIGUOUS:  [Block5][Block6][Block7][Block8]   ← one continuous run\n\n  LINKED:      [Block2 → Block9] → [Block9 → Block3] → [Block3 → NULL]\n               (scattered, each block points to the next)\n\n  INDEXED:     [Index Block: →5, →2, →9, →3]   ← one block just lists pointers\n                   │    │    │    │\n                   ▼    ▼    ▼    ▼\n                [B5] [B2] [B9] [B3]   (scattered, no chaining between them)",
    tags: ["File Allocation", "Contiguous Allocation", "Linked Allocation", "Indexed Allocation", "External Fragmentation"],
  },
  {
    id: 227,
    slug: "directory-structure",
    section: "Operating Systems",
    parentSlug: "file-system",
    title: "Directory Structure",
    tagline: "Single-level, two-level, tree-structured, and acyclic-graph — how files get organized so they can be found",
    description:
      "<b>What a Directory Structure Is, in Plain English</b>\nA directory structure is the way an OS organizes files into a browsable hierarchy, so users and applications can locate a specific file among potentially millions on a disk without knowing its exact physical location.\n\n<b>Single-Level Directory</b>\nAll files for every user sit in one single, flat directory with no subfolders at all.\n• <b>Limitation</b> — no two files anywhere on the system can share the same name, which becomes completely impractical once there's more than one user or more than a handful of files.\n\n<b>Two-Level Directory</b>\nEach user gets their own separate directory, with all of that user's files inside it — one level of separation between users.\n• <b>Improvement</b> — two different users can now each have a file with the same name, since they live in separate per-user directories\n• <b>Limitation</b> — still doesn't let a single user organize their own files into further subfolders\n\n<b>Tree-Structured Directory</b>\nDirectories can contain both files and other directories (subdirectories), nested to any depth — exactly like the folder structure on a modern computer.\n• <b>Advantage</b> — users can organize files into as many nested subfolders as they like (e.g. Documents → Projects → 2026 → report.docx)\n• <b>Limitation</b> — in a strict tree, each file or subdirectory can only have exactly one parent — there's no way for one file to legitimately appear in two different folders at once\n\n<b>Acyclic-Graph Directory</b>\nAllows directories to share subdirectories or files, so the same file can appear in more than one folder (through links or shortcuts) without being duplicated — as long as no cycle is created (a folder can't eventually contain itself).\n• <b>Advantage</b> — lets multiple users or multiple locations share the exact same file without wasteful, hard-to-keep-in-sync duplicate copies\n• <b>Limitation</b> — more complex bookkeeping is needed (like reference counting) to know when a file can actually be deleted, since it might still be linked from another location",
    note:
      "Exam favourite: the four types build in complexity — single-level (no folders at all) → two-level (one folder per user) → tree (folders inside folders, one parent each) → acyclic graph (folders/files can be shared/linked from multiple places, no cycles allowed).",
    diagram:
      "  DIRECTORY STRUCTURES — increasing flexibility\n\n  Single-Level:     [file1] [file2] [file3]   ← all in one flat list\n\n  Two-Level:        UserA/[f1][f2]   UserB/[f1][f3]   ← one folder per user\n\n  Tree-Structured:  root/ → Docs/ → Projects/ → report.docx\n                         → Photos/ → 2026/\n\n  Acyclic-Graph:    root/ → Docs/ → shared.txt\n                         → Team/ → shared.txt  ← SAME file, linked from two places",
    tags: ["Directory Structure", "Single-Level Directory", "Tree-Structured Directory", "Acyclic-Graph Directory"],
  },
  {
    id: 228,
    slug: "file-permissions",
    section: "Operating Systems",
    parentSlug: "file-system",
    title: "File Permissions",
    tagline: "Read, write, and execute rights, controlled separately for the owner, the group, and everyone else",
    description:
      "<b>What File Permissions Are, in Plain English</b>\nFile permissions are the rules the OS enforces to control which users are allowed to read, modify, or run a given file. In UNIX/Linux-style systems, permissions are grouped into three categories of access, each with three types of rights.\n\n<b>Three Rights</b>\n• <b>Read (r)</b> — view the file's contents\n• <b>Write (w)</b> — modify or delete the file's contents\n• <b>Execute (x)</b> — run the file as a program (or, for a directory, enter and list it)\n\n<b>Three Categories of Users</b>\n• <b>Owner</b> — the specific user who owns the file\n• <b>Group</b> — other users who belong to the same group as the file\n• <b>Others</b> — every other user on the system\n\n<b>Reading a Permission String</b>\nA UNIX permission string like `-rwxr-xr--` breaks down as: the type (`-` for a regular file, `d` for directory), then three groups of `rwx` for owner, group, and others in that order.\n• `rwx` for owner — the owner can read, write, and execute\n• `r-x` for group — the group can read and execute, but not write\n• `r--` for others — everyone else can only read\n\n<b>Numeric (Octal) Permission Notation</b>\nEach right is assigned a number — read = 4, write = 2, execute = 1 — and they're added together per category: full permission (rwx) = 4+2+1 = 7, read+execute (r-x) = 4+1 = 5, read-only (r--) = 4.\n• `chmod 755 file.sh` sets owner = 7 (rwx), group = 5 (r-x), others = 5 (r-x) — a very common setting for a script the owner can edit and everyone can run\n• `chmod 644 file.txt` sets owner = 6 (rw-), group = 4 (r--), others = 4 (r--) — a common setting for a regular document only the owner can edit",
    note:
      "Exam favourite: memorize the numeric values — read=4, write=2, execute=1 — and be able to add them per category. `chmod 755` and `chmod 644` are the two most commonly tested numeric examples.",
    diagram:
      "  READING: -rwxr-xr--\n\n   -     rwx      r-x      r--\n   │      │        │        │\n  type  OWNER    GROUP    OTHERS\n        (r+w+x)  (r+x)    (r only)\n\n  Numeric:  rwx=4+2+1=7   r-x=4+0+1=5   r--=4+0+0=4\n  So -rwxr-xr-- is written as: chmod 754",
    code:
      "# Give the owner full control, group and others read+execute only\nchmod 755 deploy.sh\n\n# Give the owner read+write, group and others read-only\nchmod 644 report.txt\n\n# View a file's current permissions\nls -l deploy.sh\n# -rwxr-xr-x  1 rajan  staff  1240 Aug  4 10:00 deploy.sh",
    codeLanguage: "Bash",
    tags: ["File Permissions", "chmod", "Read Write Execute", "Owner Group Others"],
  },
  // ─────────────────────────────────────────────
  // COMPUTER NETWORKS
  // ─────────────────────────────────────────────
  {
    id: 229,
    slug: "network-basics",
    section: "Computer Networks",
    title: "Network Basics",
    tagline: "What a computer network is, and the four types classified by how far they reach",
    description:
      "<b>What This Covers</b>\nNetwork Basics introduces what a computer network actually is, then classifies networks by one simple lens: geographic scale — how far apart the connected devices actually are.\n\n<b>What a Computer Network Is, in Plain English</b>\nA computer network is a group of two or more computers (or other devices) connected together so they can share data, resources (like a printer or an internet connection), and communicate with each other — from two laptops sharing a home Wi-Fi router, to the entire global internet connecting billions of devices.\n\n<b>What You'll Learn Here</b>\n• <b>LAN</b> — Local Area Network, covering a single building or campus\n• <b>MAN</b> — Metropolitan Area Network, covering a city\n• <b>WAN</b> — Wide Area Network, covering countries or continents\n• <b>PAN</b> — Personal Area Network, covering just a few meters around one person\n  ↳ Each is covered in full next, ordered from smallest geographic reach to largest.",
    note:
      "A simple ladder to remember scale: PAN (a few meters) < LAN (one building) < MAN (one city) < WAN (countries/continents). Exams frequently ask you to classify a described scenario into one of these four.",
    diagram:
      "  NETWORK TYPES — smallest to largest reach\n\n  PAN          LAN              MAN              WAN\n  (a few   <   (one building/ <  (one city)   <   (countries/\n   meters)      campus)                             continents)",
    tags: ["Computer Network", "Network Basics", "LAN", "MAN", "WAN", "PAN"],
  },
  {
    id: 230,
    slug: "lan",
    section: "Computer Networks",
    parentSlug: "network-basics",
    title: "LAN (Local Area Network)",
    tagline: "A network confined to a single building or campus, usually owned and managed by one organization",
    description:
      "<b>What a LAN Is, in Plain English</b>\nA Local Area Network (LAN) connects computers and devices within a limited physical area — a single office, home, school, or campus — usually owned, controlled, and maintained by one organization rather than a public telecom provider.\n\n<b>Key Characteristics</b>\n• Covers a small geographic area, typically up to a few kilometers\n• Very high data transfer speeds (commonly 100 Mbps to several Gbps) because connections are short and privately owned\n• Low latency and low cost per connection, since the organization owns the cabling and equipment\n• Typically built using Ethernet cables or Wi-Fi, connected through switches\n\n<b>Real-World Example</b>\nAll the computers, printers, and Wi-Fi-connected laptops inside one office building, connected to the same switch and sharing the same office internet connection, form a single LAN.",
    note:
      "Exam favourite: LAN is defined by ownership and scale together — a single organization owns the infrastructure, and it fits within one building or campus. If a question describes multiple cities or a public carrier's infrastructure, it's no longer a LAN.",
    diagram:
      "  LAN — one building, one owner\n\n  [PC1]──┐\n  [PC2]──┼──[Switch]──[Router]──► Internet\n  [PC3]──┘      │\n              [Printer]",
    tags: ["LAN", "Local Area Network", "Ethernet", "Network Basics"],
  },
  {
    id: 231,
    slug: "man",
    section: "Computer Networks",
    parentSlug: "network-basics",
    title: "MAN (Metropolitan Area Network)",
    tagline: "A network spanning a city, often connecting multiple LANs together",
    description:
      "<b>What a MAN Is, in Plain English</b>\nA Metropolitan Area Network (MAN) spans a larger area than a LAN — typically a whole city or a large campus spread across several buildings — and often works by connecting multiple separate LANs together into one larger network.\n\n<b>Key Characteristics</b>\n• Covers a city-sized area, larger than a LAN but smaller than a WAN\n• Often built and operated by a single organization, a consortium of organizations, or a telecom provider, using technologies like fiber-optic cables\n• Moderate to high data transfer speeds, though generally not as fast as a private LAN, since distances are much greater\n\n<b>Real-World Example</b>\nA city government connecting all of its municipal offices, libraries, and schools across the city into one shared network, or a cable TV network that also provides internet across an entire metropolitan area.",
    note:
      "Exam favourite: MAN sits between LAN and WAN — if a question describes a network confined to one city (not one building, not multiple countries), the answer is MAN.",
    diagram:
      "  MAN — connects multiple LANs across one city\n\n  [LAN: Office A]───┐\n  [LAN: Office B]───┼───[Metropolitan Backbone]\n  [LAN: Office C]───┘",
    tags: ["MAN", "Metropolitan Area Network", "Network Basics"],
  },
  {
    id: 232,
    slug: "wan",
    section: "Computer Networks",
    parentSlug: "network-basics",
    title: "WAN (Wide Area Network)",
    tagline: "A network spanning countries or continents — the internet itself is the largest WAN",
    description:
      "<b>What a WAN Is, in Plain English</b>\nA Wide Area Network (WAN) spans a very large geographic area — countries, or even continents — usually connecting multiple LANs and MANs together over long distances using infrastructure leased from telecom providers, satellites, or undersea cables.\n\n<b>Key Characteristics</b>\n• Covers the largest geographic area of all four types, with no real upper limit — the internet itself is the largest WAN in existence\n• Typically slower and higher-latency than a LAN, since data travels much further, often through many intermediate networks\n• Usually more expensive to build and maintain, and often relies on third-party telecom infrastructure rather than privately owned cabling\n\n<b>Real-World Example</b>\nA multinational company connecting its offices in Kathmandu, Tokyo, and New York into one private network over leased lines or VPN links, so employees in every office can access the same internal systems — and, at the largest scale, the global internet connecting billions of devices worldwide.",
    note:
      "Exam favourite: 'the internet is the largest example of a WAN' is one of the most frequently tested one-liners in this whole topic.",
    diagram:
      "  WAN — connects networks across countries/continents\n\n  [LAN: Kathmandu Office]───┐\n  [LAN: Tokyo Office]───────┼───[Wide Area Network / Internet]\n  [LAN: New York Office]────┘",
    tags: ["WAN", "Wide Area Network", "Internet", "Network Basics"],
  },
  {
    id: 233,
    slug: "pan",
    section: "Computer Networks",
    parentSlug: "network-basics",
    title: "PAN (Personal Area Network)",
    tagline: "The smallest network of all — devices connected within just a few meters of one person",
    description:
      "<b>What a PAN Is, in Plain English</b>\nA Personal Area Network (PAN) is the smallest type of network, connecting devices within just a few meters of a single person — typically the devices someone carries or wears themselves.\n\n<b>Key Characteristics</b>\n• Very short range — usually no more than about 10 meters\n• Often wireless, built on technologies like Bluetooth, Infrared, or NFC (Near Field Communication), though it can also be a short wired connection\n• Connects a small number of personal devices, rather than serving an organization or building\n\n<b>Real-World Example</b>\nA smartphone connected via Bluetooth to a wireless earbud and a smartwatch at the same time — all three devices, owned by one person, communicating over a few meters, form a PAN.",
    note:
      "Exam favourite: if a scenario describes Bluetooth, a smartwatch, or wireless earbuds paired to a phone, that's a PAN — the smallest of the four network types by far.",
    diagram:
      "  PAN — devices within a few meters of one person\n\n     [Smartwatch]\n          \\\n           \\ Bluetooth\n  [Earbuds]──[Phone]──Bluetooth──[Laptop]",
    tags: ["PAN", "Personal Area Network", "Bluetooth", "Network Basics"],
  },
  {
    id: 234,
    slug: "osi-model",
    section: "Computer Networks",
    title: "OSI Model",
    tagline: "The 7-layer reference model describing how data travels from one computer to another",
    description:
      "<b>What the OSI Model Is, in Plain English</b>\nThe OSI (Open Systems Interconnection) Model is a conceptual, 7-layer framework that describes how data moves from one application, through a network, to another application on a different device — each layer has one clearly defined job, and only talks to the layers directly above and below it.\n\n<b>Why It's Layered</b>\n• Splitting networking into layers means each layer can be designed, understood, and troubleshot independently — a hardware engineer can focus purely on the Physical layer without needing to understand how HTTP works at the Application layer\n• Standardizing these layers means equipment and software from completely different vendors can still work together, as long as each side implements the same layer's responsibilities correctly\n\n<b>The 7 Layers, Top to Bottom</b>\n• <b>Layer 7 — Application</b> — where the user-facing software lives (browsers, email clients)\n• <b>Layer 6 — Presentation</b> — formats, encrypts, and compresses data for the application\n• <b>Layer 5 — Session</b> — establishes, manages, and ends communication sessions\n• <b>Layer 4 — Transport</b> — reliable end-to-end delivery, using TCP or UDP\n• <b>Layer 3 — Network</b> — logical addressing (IP) and routing between networks\n• <b>Layer 2 — Data Link</b> — physical addressing (MAC) and framing on the local network\n• <b>Layer 1 — Physical</b> — the actual electrical signals, light pulses, or radio waves on the wire or air\n  ↳ Each layer is covered in full in its own card next, top-to-bottom order (7 → 1) matching how data is wrapped as it's sent, and bottom-to-top (1 → 7) matching how it's unwrapped as it's received.",
    note:
      "The classic memory trick, top to bottom (7→1): 'All People Seem To Need Data Processing' → Application, Presentation, Session, Transport, Network, Data Link, Physical.",
    diagram:
      "  OSI MODEL — 7 layers\n\n  7  Application    ┐\n  6  Presentation   │ Upper layers — deal with data/user-facing concerns\n  5  Session        ┘\n  4  Transport       ← where TCP/UDP live\n  3  Network         ← where IP addressing/routing live\n  2  Data Link       ┐\n  1  Physical        ┘ Lower layers — deal with hardware/wires/signals",
    tags: ["OSI Model", "7 Layers", "Networking Fundamentals"],
  },
  {
    id: 235,
    slug: "osi-physical-layer",
    section: "Computer Networks",
    parentSlug: "osi-model",
    title: "Physical Layer (Layer 1)",
    tagline: "The actual electrical signals, light pulses, or radio waves that carry raw bits over the medium",
    description:
      "<b>What the Physical Layer Does, in Plain English</b>\nThe Physical layer is the lowest layer of the OSI model — it's responsible for transmitting raw bits (0s and 1s) as actual physical signals over a transmission medium, without understanding anything about what those bits mean.\n\n<b>What It Defines</b>\n• The physical medium itself — copper cables, fiber-optic cables, or wireless radio frequencies\n• How a bit (0 or 1) is represented physically — as a voltage level on a wire, a light pulse in fiber, or a radio wave frequency in wireless\n• Physical characteristics like cable types, connector shapes (e.g. RJ-45), and transmission rates\n\n<b>What It Doesn't Care About</b>\nThe Physical layer has no concept of 'where this data is going' or 'what this data means' — it simply moves a stream of bits from one end of a physical connection to the other; addressing and meaning are handled entirely by higher layers.\n\n<b>Devices Operating at This Layer</b>\nHubs and repeaters operate purely at the Physical layer — they work with raw electrical signals and have no awareness of addresses or data structure at all.\n  ↳ Real-world example: an Ethernet cable carrying electrical pulses between a laptop and a switch, or a Wi-Fi radio signal carrying data between a phone and a router.",
    note:
      "Exam favourite: the Physical layer deals only with raw bits and physical signals — no addressing at all happens here. If a question mentions MAC addresses, that's already one layer up, at Data Link.",
    diagram:
      "  PHYSICAL LAYER — bits as physical signals\n\n  Data Link layer's bits: 1 0 1 1 0 0 1 0\n           │\n           ▼\n  Physical layer converts to:\n  Copper:  voltage HIGH-LOW-HIGH-HIGH-LOW-LOW-HIGH-LOW\n  Fiber:   light PULSE-off-PULSE-PULSE-off-off-PULSE-off\n  Wireless: radio wave frequency/amplitude changes",
    tags: ["Physical Layer", "OSI Model", "Bits", "Hub", "Repeater"],
  },
  {
    id: 236,
    slug: "osi-data-link-layer",
    section: "Computer Networks",
    parentSlug: "osi-model",
    title: "Data Link Layer (Layer 2)",
    tagline: "Packages bits into frames, adds MAC addresses, and moves data across one local network hop",
    description:
      "<b>What the Data Link Layer Does, in Plain English</b>\nThe Data Link layer takes the raw bit stream from the Physical layer and organizes it into structured units called frames, and is responsible for reliably moving those frames between two devices on the same local network (one 'hop'), using physical (MAC) addresses rather than IP addresses.\n\n<b>Key Responsibilities</b>\n• <b>Framing</b> — groups bits into frames, each with a clear start and end, so the receiver knows where one unit of data ends and the next begins\n• <b>Physical (MAC) addressing</b> — every network interface has a unique MAC (Media Access Control) address burned into its hardware, and Data Link uses these addresses to deliver a frame to the correct device on the local network\n• <b>Error detection</b> — adds a checksum (like a CRC, Cyclic Redundancy Check) to each frame so the receiver can detect if the frame was corrupted in transit\n• <b>Access control</b> — manages how multiple devices sharing the same physical medium (like Wi-Fi) take turns transmitting without constantly colliding\n\n<b>Devices Operating at This Layer</b>\nSwitches operate at the Data Link layer — they read the destination MAC address in each frame and forward it only to the correct port, unlike a hub which blindly broadcasts to every port.\n  ↳ Real-world example: Ethernet and Wi-Fi (802.11) are both Data Link layer technologies, defining exactly how frames are structured and addressed.",
    note:
      "Exam favourite: Data Link uses MAC addresses (physical, hardware-based), while the layer right above it (Network) uses IP addresses (logical, software-assigned). Don't mix the two up.",
    diagram:
      "  DATA LINK LAYER — bits become addressed frames\n\n  ┌──────────┬──────────────┬─────────┬─────┐\n  │ Dest MAC │ Source MAC   │  Data   │ CRC │  ← one Ethernet frame\n  └──────────┴──────────────┴─────────┴─────┘\n\n  Switch reads Dest MAC → forwards frame only to the port\n  where that MAC address lives (not to every port, unlike a hub)",
    tags: ["Data Link Layer", "OSI Model", "MAC Address", "Frame", "Switch", "Ethernet"],
  },
  {
    id: 237,
    slug: "osi-network-layer",
    section: "Computer Networks",
    parentSlug: "osi-model",
    title: "Network Layer (Layer 3)",
    tagline: "Logical (IP) addressing and routing — getting a packet across multiple networks to its destination",
    description:
      "<b>What the Network Layer Does, in Plain English</b>\nThe Network layer is responsible for moving data (organized into packets) from a source device to a destination device that may be on a completely different network, potentially across many intermediate networks — this is where routing decisions actually happen.\n\n<b>Key Responsibilities</b>\n• <b>Logical (IP) addressing</b> — assigns and uses IP addresses, which (unlike MAC addresses) are organized hierarchically by network, making it possible to figure out roughly where an address lives without a global lookup table\n  ↳ Covered in full in the IP Addressing chapter\n• <b>Routing</b> — determines the best path for a packet to travel from source to destination across multiple interconnected networks, often through many intermediate hops\n• <b>Packet forwarding</b> — each router along the path examines a packet's destination IP address and forwards it toward the next hop on the best available path\n\n<b>Devices Operating at This Layer</b>\nRouters operate at the Network layer — they connect entirely different networks together and make forwarding decisions based on IP addresses and routing tables, unlike switches, which only operate within a single local network using MAC addresses.\n  ↳ Real-world example: when you load a website hosted in another country, the Network layer is what routes your request through dozens of intermediate routers across the internet to reach that server, and routes the response back.",
    note:
      "Exam favourite: Network layer = IP addresses + routing across multiple networks. Data Link layer = MAC addresses + delivery within one local network. A router works at Layer 3; a switch works at Layer 2.",
    diagram:
      "  NETWORK LAYER — routing across multiple networks\n\n  [Your PC] ──► [Router 1] ──► [Router 2] ──► [Router 3] ──► [Destination Server]\n\n  Each router reads the packet's destination IP address\n  and forwards it toward the next hop on the best path.",
    tags: ["Network Layer", "OSI Model", "IP Address", "Routing", "Router", "Packet"],
  },
  {
    id: 238,
    slug: "osi-transport-layer",
    section: "Computer Networks",
    parentSlug: "osi-model",
    title: "Transport Layer (Layer 4)",
    tagline: "End-to-end delivery between applications — reliable (TCP) or fast-and-simple (UDP)",
    description:
      "<b>What the Transport Layer Does, in Plain English</b>\nThe Transport layer is responsible for end-to-end communication between the actual applications running on the source and destination devices, not just device-to-device like the layers below it. It breaks data into segments, and decides whether that delivery needs to be reliable or just fast.\n\n<b>Key Responsibilities</b>\n• <b>Segmentation</b> — breaks data from the upper layers into smaller segments for transmission, and reassembles them correctly at the destination\n• <b>Port numbers</b> — uses port numbers to identify exactly which application on a device a piece of data is meant for (e.g. port 80 for a web server, port 25 for a mail server), letting one device run many network applications at once\n• <b>Reliability (when needed)</b> — can guarantee data arrives completely, in order, and without corruption, using acknowledgments and retransmission\n• <b>Flow control</b> — prevents a fast sender from overwhelming a slower receiver\n\n<b>TCP vs. UDP</b>\nThe Transport layer offers two very different protocols, covered in full in the Protocols chapter:\n• <b>TCP</b> — connection-oriented and reliable, used when correctness matters more than speed\n• <b>UDP</b> — connectionless and fast, used when speed matters more than guaranteed delivery\n\n<b>Real-World Example</b>\nWhen a browser (destination port 443 for HTTPS) and a mail client (destination port 25 for SMTP) are both running on the same laptop at the same time, the Transport layer's port numbers are exactly what let incoming data reach the correct application instead of getting confused between the two.",
    note:
      "Exam favourite: the Transport layer is the first layer that's truly 'end-to-end between applications,' not just device-to-device — and port numbers are what make that application-level addressing possible.",
    diagram:
      "  TRANSPORT LAYER — port numbers route data to the right app\n\n  Same laptop, one IP address, many apps:\n  Browser  ── listening on port 443 (HTTPS)\n  Mail app ── listening on port 25  (SMTP)\n  Game     ── listening on port 27015 (UDP)\n\n  Incoming data + destination port number → delivered to the correct app",
    tags: ["Transport Layer", "OSI Model", "TCP", "UDP", "Port Numbers", "Segmentation"],
  },
  {
    id: 239,
    slug: "osi-session-layer",
    section: "Computer Networks",
    parentSlug: "osi-model",
    title: "Session Layer (Layer 5)",
    tagline: "Establishes, manages, and cleanly ends the communication session between two applications",
    description:
      "<b>What the Session Layer Does, in Plain English</b>\nThe Session layer manages sessions — a session being the ongoing conversation between two applications for as long as they need to keep exchanging data. It's responsible for opening that conversation, keeping it organized and synchronized while it's active, and closing it down cleanly when it's done.\n\n<b>Key Responsibilities</b>\n• <b>Session establishment</b> — sets up a session between two communicating applications before any real data exchange begins\n• <b>Session maintenance</b> — keeps track of whose turn it is to transmit (in systems where communication is one direction at a time) and keeps the session organized over time\n• <b>Synchronization</b> — inserts checkpoints into a long data exchange, so if the connection drops partway through, the session can resume from the last checkpoint instead of starting completely over\n• <b>Session termination</b> — properly closes the session once the applications are done communicating, releasing any resources held for it\n\n<b>Why This Layer Is Often Overlooked</b>\nIn practice, many modern applications handle session-like behavior themselves at the Application layer (e.g. login sessions in a web app), which is why the Session layer is one of the least visible layers day-to-day — but conceptually, it's still the layer responsible for the idea of a 'session' in the OSI model.\n  ↳ Real-world example: a video call staying connected for an hour, with the Session layer conceptually responsible for keeping that one continuous session alive and organized from start to end.",
    note:
      "Exam favourite: Session, Presentation, and Application (layers 5, 6, 7) are the three 'upper layers' that deal with data and user-facing concerns, as opposed to the four 'lower layers' that deal with actually moving bits across a network.",
    diagram:
      "  SESSION LAYER — manages one ongoing conversation\n\n  Establish session ──► exchange data (with sync checkpoints) ──► Terminate session\n       │                        │                                      │\n   'let's talk'          keeps things organized                 'we're done talking'\n                         if connection drops mid-way,\n                         can resume from last checkpoint",
    tags: ["Session Layer", "OSI Model", "Session Management"],
  },
  {
    id: 240,
    slug: "osi-presentation-layer",
    section: "Computer Networks",
    parentSlug: "osi-model",
    title: "Presentation Layer (Layer 6)",
    tagline: "Translates, encrypts, and compresses data so the Application layer receives it in a usable format",
    description:
      "<b>What the Presentation Layer Does, in Plain English</b>\nThe Presentation layer acts as a translator between the data format an application uses and the format used for transmission over the network — it makes sure data sent by one application, possibly using a completely different internal data representation, arrives in a format the receiving application can actually understand.\n\n<b>Key Responsibilities</b>\n• <b>Translation</b> — converts data between different formats or character encodings (e.g. between ASCII and Unicode) so systems using different internal representations can still communicate\n• <b>Encryption and decryption</b> — encrypts data before sending it and decrypts it upon arrival, so data can travel securely across an otherwise untrusted network\n• <b>Compression</b> — reduces the size of data before transmission (and decompresses it on arrival), so it takes up less bandwidth and transmits faster\n\n<b>Real-World Example</b>\nTLS/SSL encryption (the 'S' in HTTPS) is a Presentation-layer concept — it encrypts the data before it leaves your browser, and decrypts it once it reaches the destination server, so anyone intercepting the traffic in between only sees scrambled data.\n  ↳ Image and video formats like JPEG and MP4 also represent Presentation-layer thinking — they define a standard, agreed-upon format so data encoded on one system can be correctly decoded and displayed on a completely different one.",
    note:
      "Exam favourite: 'encryption, compression, and format translation' — if a question describes any of these three, it's describing the Presentation layer, not the Session layer above it or the Application layer below it in the description order.",
    diagram:
      "  PRESENTATION LAYER — translate, encrypt, compress\n\n  Application's raw data\n         │\n         ▼\n  Presentation layer: encode format, encrypt (TLS), compress\n         │\n         ▼\n  Sent over the network ──► received ──► decrypt, decompress, decode\n         │\n         ▼\n  Delivered to the receiving Application in a usable format",
    tags: ["Presentation Layer", "OSI Model", "Encryption", "Compression", "TLS/SSL"],
  },
  {
    id: 241,
    slug: "osi-application-layer",
    section: "Computer Networks",
    parentSlug: "osi-model",
    title: "Application Layer (Layer 7)",
    tagline: "The topmost layer — where user-facing software and network protocols like HTTP and DNS live",
    description:
      "<b>What the Application Layer Does, in Plain English</b>\nThe Application layer is the topmost layer of the OSI model, and the one closest to the actual user — it's where network-aware software (browsers, email clients, file-transfer tools) and the protocols they rely on actually live.\n\n<b>What It's Responsible For</b>\n• Provides the network services that applications directly use — requesting a web page, sending an email, transferring a file, looking up a domain name\n• Defines the protocols that structure exactly how those requests and responses are formatted, so a browser from one vendor can talk to a web server from a completely different vendor without issue\n\n<b>Important Clarification</b>\nThe Application layer is not the application itself (like a specific browser) — it's the layer that defines the network protocols the application uses to communicate. A browser is software that uses the Application-layer protocol HTTP/HTTPS; DNS resolution, file transfer, and email delivery follow the same idea with their own protocols.\n\n<b>The Protocols Covered Next</b>\nHTTP, HTTPS, FTP, SMTP, DNS, and DHCP are all Application-layer protocols, each covered in full detail in the Protocols chapter — this is exactly where the OSI model's most visible, everyday layer connects to real-world tools you use constantly.",
    note:
      "Exam favourite: don't confuse 'the Application layer' with 'an application.' The layer defines protocols (HTTP, DNS, FTP); the application (a specific browser or email client) is software that implements and uses those protocols.",
    diagram:
      "  APPLICATION LAYER — where everyday protocols live\n\n  Browser  ──uses──► HTTP / HTTPS\n  Mail app ──uses──► SMTP\n  File tool──uses──► FTP\n  Every device──uses──► DNS (to resolve names), DHCP (to get an IP)",
    tags: ["Application Layer", "OSI Model", "HTTP", "DNS", "Protocols"],
  },
  {
    id: 242,
    slug: "tcp-ip-model",
    section: "Computer Networks",
    title: "TCP/IP Model",
    tagline: "The 4-layer model the real internet is actually built on, simpler and older than OSI",
    description:
      "<b>What the TCP/IP Model Is, in Plain English</b>\nThe TCP/IP Model is a 4-layer networking framework that predates the OSI Model and is what the actual internet runs on today — while OSI is mostly used as a teaching and reference framework, TCP/IP is the model real-world protocols were built around from the start.\n\n<b>The 4 Layers, Top to Bottom</b>\n• <b>Application</b> — combines OSI's Application, Presentation, and Session layers into one; where protocols like HTTP, FTP, SMTP, and DNS live\n• <b>Transport</b> — matches OSI's Transport layer exactly; TCP and UDP live here\n• <b>Internet</b> — matches OSI's Network layer; handles IP addressing and routing\n• <b>Network Access</b> — combines OSI's Data Link and Physical layers into one; handles MAC addressing, framing, and the physical transmission of bits\n\n<b>Why Two Different Models Exist</b>\n• OSI is a general-purpose, 7-layer theoretical reference model, designed to describe networking conceptually and independently of any specific protocol\n• TCP/IP is a practical, 4-layer model designed around the protocols that actually run the internet — it came first, historically, and OSI was developed afterward as a more detailed, protocol-independent teaching framework\n  ↳ Each of TCP/IP's 4 layers is covered in its own card next.",
    note:
      "Exam favourite: TCP/IP has 4 layers, OSI has 7 — but they describe the same real communication process at different levels of detail. Being able to map OSI's 7 layers onto TCP/IP's 4 is one of the most commonly tested skills in this whole networking section.",
    diagram:
      "  OSI (7 layers)  vs  TCP/IP (4 layers)\n\n  7  Application    ┐\n  6  Presentation   ├──►  Application\n  5  Session        ┘\n  4  Transport       ──►  Transport\n  3  Network         ──►  Internet\n  2  Data Link       ┐\n  1  Physical        ┴──►  Network Access",
    tags: ["TCP/IP Model", "Networking Fundamentals", "OSI Model"],
  },
  {
    id: 243,
    slug: "tcpip-network-access-layer",
    section: "Computer Networks",
    parentSlug: "tcp-ip-model",
    title: "Network Access Layer",
    tagline: "TCP/IP's bottom layer — combines OSI's Physical and Data Link layers into one",
    description:
      "<b>What the Network Access Layer Does, in Plain English</b>\nThe Network Access layer (sometimes called the Link layer) is the lowest layer of the TCP/IP model, and it takes on the combined responsibilities of OSI's Physical and Data Link layers together: getting raw bits physically transmitted, and organizing them into addressed frames on the local network.\n\n<b>What It Handles</b>\n• Physical transmission of bits over cables, fiber, or radio waves (matching OSI's Physical layer)\n• Framing and MAC (physical hardware) addressing on the local network (matching OSI's Data Link layer)\n• Technologies like Ethernet and Wi-Fi are defined at this combined layer\n\n<b>Why TCP/IP Merges These Two</b>\nTCP/IP was designed with practical simplicity in mind — from an internet protocol design point of view, 'get bits onto the local wire correctly addressed' is really one job, so TCP/IP treats it as one layer instead of OSI's more theoretically separated two.",
    note:
      "Exam favourite: Network Access = Physical + Data Link combined. If a question asks what OSI layers TCP/IP's Network Access layer covers, the answer is exactly those two.",
    diagram:
      "  NETWORK ACCESS LAYER = Physical + Data Link combined\n\n  OSI:     Layer 2 (Data Link)  +  Layer 1 (Physical)\n  TCP/IP:            Network Access Layer",
    tags: ["Network Access Layer", "TCP/IP Model", "Ethernet", "MAC Address"],
  },
  {
    id: 244,
    slug: "tcpip-internet-layer",
    section: "Computer Networks",
    parentSlug: "tcp-ip-model",
    title: "Internet Layer",
    tagline: "TCP/IP's layer for IP addressing and routing — matches OSI's Network layer exactly",
    description:
      "<b>What the Internet Layer Does, in Plain English</b>\nThe Internet layer handles logical (IP) addressing and routing — deciding how a packet gets from a source device to a destination device, potentially across many different networks. This layer maps directly onto OSI's Network layer, with no real difference in responsibility between the two models here.\n\n<b>What It Handles</b>\n• Assigns and interprets IP addresses (IPv4 and IPv6, covered in full in the IP Addressing chapter)\n• Routes packets across multiple interconnected networks toward their destination\n• The IP protocol itself lives at this layer — it's literally where the 'IP' in TCP/IP comes from\n\n<b>Why It's Named 'Internet'</b>\nThis layer is called the Internet layer specifically because it's what makes internetworking possible — connecting separate, independent networks together into one larger network (an 'internet' in the general sense, of which the public Internet is the largest example).",
    note:
      "Exam favourite: Internet Layer = Network Layer (OSI), one-to-one — this is the cleanest, most direct mapping between the two models, unlike the Application and Network Access layers which each combine multiple OSI layers.",
    diagram:
      "  INTERNET LAYER = Network Layer (OSI), one-to-one match\n\n  OSI:     Layer 3 (Network) — IP addressing, routing\n  TCP/IP:            Internet Layer — same job, same name change only",
    tags: ["Internet Layer", "TCP/IP Model", "IP Address", "Routing"],
  },
  {
    id: 245,
    slug: "tcpip-transport-layer",
    section: "Computer Networks",
    parentSlug: "tcp-ip-model",
    title: "Transport Layer",
    tagline: "TCP/IP's layer for end-to-end delivery between applications — matches OSI's Transport layer exactly",
    description:
      "<b>What the Transport Layer Does, in Plain English</b>\nJust like in the OSI model, TCP/IP's Transport layer handles end-to-end communication between applications on the source and destination devices — breaking data into segments, using port numbers to identify the right application, and choosing between reliable or fast-and-simple delivery.\n\n<b>What It Handles</b>\n• <b>TCP (Transmission Control Protocol)</b> — connection-oriented, reliable delivery with acknowledgments and retransmission\n• <b>UDP (User Datagram Protocol)</b> — connectionless, fast delivery with no delivery guarantee\n  ↳ Both are covered in full detail in the Protocols chapter\n• Port numbers, which identify exactly which application on a device a segment is destined for\n\n<b>Why This Layer Maps Directly to OSI</b>\nUnlike Network Access (which merges two OSI layers) and Application (which merges three), TCP/IP's Transport layer is a direct, one-to-one match with OSI's Transport layer — both models agree this is exactly where reliable/fast end-to-end delivery decisions belong.",
    note:
      "Exam favourite: TCP/IP's name literally comes from its two most important protocols — TCP at the Transport layer, and IP at the Internet layer, one from each of the model's two middle layers.",
    diagram:
      "  TRANSPORT LAYER = Transport Layer (OSI), one-to-one match\n\n  OSI:     Layer 4 (Transport) — TCP / UDP, ports, segmentation\n  TCP/IP:            Transport Layer — identical job, identical name",
    tags: ["Transport Layer", "TCP/IP Model", "TCP", "UDP", "Port Numbers"],
  },
  {
    id: 246,
    slug: "tcpip-application-layer",
    section: "Computer Networks",
    parentSlug: "tcp-ip-model",
    title: "Application Layer",
    tagline: "TCP/IP's top layer — combines OSI's Session, Presentation, and Application layers into one",
    description:
      "<b>What the Application Layer Does, in Plain English</b>\nTCP/IP's Application layer is the topmost layer, and it takes on the combined responsibilities of OSI's Session, Presentation, and Application layers all in one — session management, data formatting/encryption, and the actual user-facing network protocols are all treated as a single layer.\n\n<b>What It Handles</b>\n• All the everyday network protocols: HTTP, HTTPS, FTP, SMTP, DNS, DHCP (each covered in full in the Protocols chapter)\n• Session-like behavior (matching OSI's Session layer) — in practice, handled by the specific protocol or application itself (e.g. a web session token)\n• Data formatting and encryption (matching OSI's Presentation layer) — e.g. TLS encryption for HTTPS is considered part of this combined Application layer in the TCP/IP model\n\n<b>Why TCP/IP Merges These Three</b>\nIn practice, real-world protocols like HTTP handle session behavior, data formatting, and application logic all together within the same protocol design, rather than as cleanly separated concerns — so TCP/IP's simpler, protocol-driven model reflects that by treating all three as one layer.",
    note:
      "Exam favourite: TCP/IP's Application layer = OSI's Session + Presentation + Application (layers 5, 6, and 7) combined. This is the most-tested layer mapping between the two models, alongside Network Access = Physical + Data Link.",
    diagram:
      "  APPLICATION LAYER = Session + Presentation + Application combined\n\n  OSI:     Layer 7 (Application) + Layer 6 (Presentation) + Layer 5 (Session)\n  TCP/IP:                    Application Layer",
    tags: ["Application Layer", "TCP/IP Model", "HTTP", "DNS"],
  },
  {
    id: 247,
    slug: "protocols",
    section: "Computer Networks",
    title: "Protocols",
    tagline: "The agreed-upon rules that let two different devices communicate correctly",
    description:
      "<b>What This Covers</b>\nProtocols covers the actual named rulebooks that make networking work in practice — grouped by which layer of the TCP/IP model each one operates at.\n\n<b>What a Protocol Is, in Plain English</b>\nA protocol is a set of agreed-upon rules that defines exactly how two devices should format, send, and interpret data, so that devices built by completely different manufacturers, running completely different software, can still understand each other perfectly.\n\n<b>What You'll Learn Here</b>\n• <b>Application Layer Protocols</b> — HTTP, HTTPS, FTP, SMTP, DNS, DHCP\n• <b>Transport Layer Protocols</b> — TCP, UDP\n  ↳ Each protocol is covered in its own card next, with what it's for, its port number, and a concrete real-world example.",
    note:
      "A protocol's port number is one of the most tested details in this chapter — memorize the well-known ports: HTTP=80, HTTPS=443, FTP=20/21, SMTP=25, DNS=53, DHCP=67/68.",
    diagram:
      "  PROTOCOLS BY LAYER\n\n  Application Layer:  HTTP · HTTPS · FTP · SMTP · DNS · DHCP\n  Transport Layer:    TCP · UDP",
    tags: ["Protocols", "Application Layer", "Transport Layer", "Networking Fundamentals"],
  },
  {
    id: 248,
    slug: "application-layer-protocols",
    section: "Computer Networks",
    parentSlug: "protocols",
    title: "Application Layer Protocols",
    tagline: "HTTP, HTTPS, FTP, SMTP, DNS, and DHCP — the protocols behind everyday internet use",
    description:
      "<b>What This Covers</b>\nApplication Layer Protocols are the rules behind the everyday things you do on the internet — loading a webpage, sending an email, getting an IP address automatically, or turning a domain name into a server's actual address.\n\n<b>The Six Protocols Covered Next</b>\n• <b>HTTP</b> — loads regular (unencrypted) web pages, port 80\n• <b>HTTPS</b> — loads web pages securely, encrypted with TLS, port 443\n• <b>FTP</b> — transfers files between a client and a server, ports 20/21\n• <b>SMTP</b> — sends email from a client to a mail server (and between mail servers), port 25\n• <b>DNS</b> — translates human-readable domain names into IP addresses, port 53\n• <b>DHCP</b> — automatically assigns an IP address to a device joining a network, ports 67/68\n  ↳ Each is covered in full in its own card next.",
    note:
      "Group these by what they actually do: HTTP/HTTPS = viewing content, FTP = moving files, SMTP = sending mail, DNS = name-to-address lookup, DHCP = automatic address assignment. Grouping by purpose, not just memorizing names, makes exam recall far easier.",
    diagram:
      "  APPLICATION LAYER PROTOCOLS — grouped by purpose\n\n  View content:    HTTP (80)  ·  HTTPS (443)\n  Move files:      FTP (20/21)\n  Send mail:       SMTP (25)\n  Name lookup:     DNS (53)\n  Auto-assign IP:  DHCP (67/68)",
    tags: ["Application Layer Protocols", "HTTP", "HTTPS", "FTP", "SMTP", "DNS", "DHCP"],
  },
  {
    id: 249,
    slug: "http-protocol",
    section: "Computer Networks",
    parentSlug: "application-layer-protocols",
    title: "HTTP (HyperText Transfer Protocol)",
    tagline: "The protocol that loads a webpage — a request from a client, a response from a server, unencrypted",
    description:
      "<b>What HTTP Is, in Plain English</b>\nHTTP (HyperText Transfer Protocol) is the protocol web browsers use to request web pages from web servers, and the protocol servers use to send those pages back. It runs on port 80 by default and, critically, sends its data in plain text — anyone intercepting the traffic in between can read exactly what was sent.\n\n<b>How It Works</b>\n• The client (a browser) sends an HTTP request specifying a method (like `GET` to retrieve a page, or `POST` to submit data) and a URL\n• The server processes the request and sends back an HTTP response, including a status code (like `200 OK`, `404 Not Found`, or `500 Internal Server Error`) and the requested content\n• HTTP is stateless — each request is handled independently, with no memory of previous requests, unless the application layers something like cookies or sessions on top\n\n<b>Why HTTPS Exists</b>\nBecause HTTP sends everything in plain text, anyone on the same network (a shared Wi-Fi, an ISP, an attacker) can potentially read or tamper with the data in transit — this is exactly the gap HTTPS closes by adding encryption on top of the same request/response model.",
    note:
      "Exam favourite: HTTP is stateless and unencrypted, running on port 80 by default. If a question describes secure, encrypted web traffic, that's HTTPS (port 443), not plain HTTP.",
    diagram:
      "  HTTP — request/response, plain text, port 80\n\n  Browser ──GET /index.html──► Web Server\n  Browser ◄──200 OK + HTML content────Web Server\n\n  (Anyone intercepting this traffic can read it — no encryption.)",
    code:
      "GET /index.html HTTP/1.1\nHost: example.com\n\nHTTP/1.1 200 OK\nContent-Type: text/html\n\n<html>...</html>",
    codeLanguage: "HTTP",
    tags: ["HTTP", "Application Layer Protocols", "Port 80", "Stateless"],
  },
  {
    id: 250,
    slug: "https-protocol",
    section: "Computer Networks",
    parentSlug: "application-layer-protocols",
    title: "HTTPS (HTTP Secure)",
    tagline: "HTTP with a layer of encryption (TLS) added, so data can't be read or tampered with in transit",
    description:
      "<b>What HTTPS Is, in Plain English</b>\nHTTPS (HTTP Secure) is exactly the same request/response model as HTTP, but wrapped in an encryption layer called TLS (Transport Layer Security) — every request and response is encrypted before it's sent, so anyone intercepting the traffic in between only sees scrambled, unreadable data. It runs on port 443 by default.\n\n<b>What TLS Adds on Top of HTTP</b>\n• <b>Encryption</b> — data is unreadable to anyone except the intended sender and receiver\n• <b>Integrity</b> — TLS detects if data was tampered with in transit\n• <b>Authentication</b> — a TLS certificate proves the server is actually who it claims to be (e.g. that you're really talking to your bank's server, not an impostor), which is why browsers show a padlock icon for HTTPS sites\n\n<b>Why It Matters</b>\nAny time sensitive data is sent — passwords, credit card numbers, personal information — HTTPS is essential, since plain HTTP would expose that data to anyone able to intercept network traffic between the browser and the server. Modern browsers now actively warn users when a site is served over plain HTTP instead of HTTPS.",
    note:
      "Exam favourite: HTTPS = HTTP + TLS encryption, port 443. The 'S' stands for Secure, and the security is provided by TLS (which itself lives conceptually at the Presentation layer of the OSI model).",
    diagram:
      "  HTTPS — HTTP wrapped in TLS encryption, port 443\n\n  Browser ──[TLS handshake: verify server's certificate]──► Web Server\n  Browser ──[ENCRYPTED] GET /login──► Web Server\n  Browser ◄──[ENCRYPTED] 200 OK + page────Web Server\n\n  (Anyone intercepting this only sees encrypted, unreadable data.)",
    tags: ["HTTPS", "TLS/SSL", "Application Layer Protocols", "Port 443", "Encryption"],
  },
  {
    id: 251,
    slug: "ftp-protocol",
    section: "Computer Networks",
    parentSlug: "application-layer-protocols",
    title: "FTP (File Transfer Protocol)",
    tagline: "Transfers files between a client and a server, using separate connections for commands and data",
    description:
      "<b>What FTP Is, in Plain English</b>\nFTP (File Transfer Protocol) is a protocol specifically designed to upload and download files between a client and a server over a network — built for moving whole files efficiently, rather than viewing content like HTTP.\n\n<b>Two Separate Connections</b>\n• <b>Control connection (port 21)</b> — used to send commands (like login credentials, or 'list files in this folder') and receive responses\n• <b>Data connection (port 20)</b> — used purely to transfer the actual file content\n  ↳ Keeping these separate means commands and file data never interfere with each other on the same channel.\n\n<b>Authentication</b>\nFTP typically requires a username and password to log in before any file operations are allowed, though 'anonymous FTP' servers exist that allow public, unauthenticated downloads for some files.\n\n<b>A Security Weakness</b>\nStandard FTP sends both login credentials and file data in plain text, just like HTTP — this is why more secure variants like FTPS (FTP over TLS) or SFTP (a completely different protocol built on SSH) are preferred for anything sensitive.\n  ↳ Real-world example: a web developer uploading updated website files to a hosting server using an FTP client.",
    note:
      "Exam favourite: FTP uses two ports — 21 for control (commands/login) and 20 for the actual data transfer. Also remember plain FTP is unencrypted, just like plain HTTP.",
    diagram:
      "  FTP — two separate connections\n\n  Client ──Control connection (port 21): login, LIST, GET──► Server\n  Client ◄──Data connection (port 20): actual file bytes────Server",
    tags: ["FTP", "Application Layer Protocols", "Port 21", "Port 20", "File Transfer"],
  },
  {
    id: 252,
    slug: "smtp-protocol",
    section: "Computer Networks",
    parentSlug: "application-layer-protocols",
    title: "SMTP (Simple Mail Transfer Protocol)",
    tagline: "Sends email from a client to a mail server, and relays it between mail servers",
    description:
      "<b>What SMTP Is, in Plain English</b>\nSMTP (Simple Mail Transfer Protocol) is the protocol used to send email — from an email client (or app) to its mail server, and then between mail servers as the message is relayed toward the recipient's mail server. It runs on port 25 by default (with port 587 commonly used for authenticated client submission today).\n\n<b>Why SMTP Is Only for Sending</b>\nSMTP handles the outgoing/sending side of email exclusively — it does not retrieve or read email. Retrieving email from a mailbox uses entirely separate protocols like IMAP or POP3, which SMTP doesn't handle at all.\n\n<b>How It Works, Roughly</b>\n1. Your email client connects to your outgoing mail server via SMTP and hands off the message\n2. Your mail server looks up the recipient's mail server (using DNS) and relays the message to it, again via SMTP\n3. The message sits in the recipient's mailbox until they retrieve it (via IMAP or POP3, not SMTP)\n  ↳ Real-world example: hitting 'send' on an email is the moment your client hands the message to your mail provider's server over SMTP.",
    note:
      "Exam favourite: SMTP sends email; IMAP and POP3 retrieve it. If a question describes reading or downloading email into an inbox, that's not SMTP — it's IMAP or POP3.",
    diagram:
      "  SMTP — sending and relaying email\n\n  Your Email Client ──SMTP──► Your Mail Server ──SMTP──► Recipient's Mail Server\n                                                                  │\n                                                     (message waits here until\n                                                      recipient retrieves it via\n                                                      IMAP/POP3 — not SMTP)",
    tags: ["SMTP", "Application Layer Protocols", "Port 25", "Email"],
  },
  {
    id: 253,
    slug: "dns-protocol",
    section: "Computer Networks",
    parentSlug: "application-layer-protocols",
    title: "DNS (Domain Name System)",
    tagline: "Translates human-readable domain names into the IP addresses computers actually use",
    description:
      "<b>What DNS Is, in Plain English</b>\nDNS (Domain Name System) is the protocol and system that translates human-friendly domain names (like `example.com`) into the numeric IP addresses computers actually use to find each other on a network — it's essentially the internet's phone book, letting people type memorable names instead of having to remember an IP address for every website. It runs on port 53.\n\n<b>How a DNS Lookup Works, Step by Step</b>\n1. You type `example.com` into your browser\n2. Your device asks a DNS resolver (usually run by your ISP or a public service) 'what's the IP address for example.com?'\n3. The resolver checks its cache first; if it doesn't already know, it queries a hierarchy of DNS servers (root servers → top-level domain servers → the domain's own authoritative name server) until it finds the answer\n4. The resolver returns the IP address to your device, and your browser connects directly to that IP address to load the actual page\n\n<b>Why This Hierarchy Exists</b>\nNo single server could possibly hold the address of every domain on the internet — splitting the lookup into root → top-level domain (.com, .org, .np) → authoritative server for that specific domain lets the system scale to handle every domain name in existence.",
    note:
      "Exam favourite: DNS runs on port 53 and its whole job is name-to-IP-address translation. If a question describes 'turning a domain name into an IP address,' the answer is always DNS.",
    diagram:
      "  DNS LOOKUP — turning a name into an address\n\n  Browser: \"What's the IP for example.com?\"\n       │\n       ▼\n  DNS Resolver ──► Root Server ──► .com TLD Server ──► example.com's Authoritative Server\n       │                                                          │\n       └──────────────── \"It's 93.184.216.34\" ◄───────────────────┘\n       │\n       ▼\n  Browser connects directly to 93.184.216.34",
    code:
      "# Look up the IP address behind a domain name\ndig example.com\n\n# or, on many systems:\nnslookup example.com",
    codeLanguage: "Bash",
    tags: ["DNS", "Application Layer Protocols", "Port 53", "Domain Name"],
  },
  {
    id: 254,
    slug: "dhcp-protocol",
    section: "Computer Networks",
    parentSlug: "application-layer-protocols",
    title: "DHCP (Dynamic Host Configuration Protocol)",
    tagline: "Automatically assigns an IP address to a device the moment it joins a network",
    description:
      "<b>What DHCP Is, in Plain English</b>\nDHCP (Dynamic Host Configuration Protocol) automatically assigns an IP address (along with other network settings) to a device the moment it connects to a network, so no one has to manually type in an IP address every time a laptop, phone, or printer joins a Wi-Fi network. It uses ports 67 (server) and 68 (client).\n\n<b>How It Works — DORA</b>\nThe DHCP process is often remembered as DORA:\n• <b>Discover</b> — the new device broadcasts a message asking 'is there a DHCP server that can give me an IP address?'\n• <b>Offer</b> — a DHCP server on the network responds, offering an available IP address\n• <b>Request</b> — the device replies, formally requesting to use that specific offered address\n• <b>Acknowledge</b> — the DHCP server confirms the assignment, and the device is now configured with that IP address (plus settings like the subnet mask, default gateway, and DNS server)\n\n<b>Why This Matters</b>\nWithout DHCP, every device joining a network would need someone to manually assign it a unique, non-conflicting IP address — completely impractical on any network with more than a handful of devices, especially one where phones and laptops constantly join and leave (like a home or office Wi-Fi network).\n  ↳ Real-world example: connecting a new phone to a coffee shop's Wi-Fi and automatically getting internet access within seconds, with no manual network configuration at all — that's DHCP working in the background.",
    note:
      "Exam favourite: memorize the four DHCP steps in order — Discover, Offer, Request, Acknowledge (DORA). This exact sequence is one of the most frequently tested details in networking.",
    diagram:
      "  DHCP — DORA sequence\n\n  New Device                          DHCP Server\n     │──DISCOVER (broadcast)──────────────►│\n     │◄─────────────OFFER (an IP)──────────│\n     │──REQUEST (I'll take that IP)───────►│\n     │◄─────────ACKNOWLEDGE (confirmed)─────│\n\n  Device is now configured: IP address, subnet mask,\n  default gateway, and DNS server — all automatic.",
    tags: ["DHCP", "Application Layer Protocols", "Port 67", "Port 68", "DORA", "IP Address"],
  },
  {
    id: 255,
    slug: "transport-layer-protocols",
    section: "Computer Networks",
    parentSlug: "protocols",
    title: "Transport Layer Protocols",
    tagline: "TCP and UDP — the two ways data can travel end-to-end between applications",
    description:
      "<b>What This Covers</b>\nTransport Layer Protocols covers the two fundamentally different approaches to end-to-end delivery between applications: TCP's reliable, connection-based approach, and UDP's fast, connectionless approach.\n\n<b>The Two Protocols, at a Glance</b>\n• <b>TCP (Transmission Control Protocol)</b> — connection-oriented, guarantees reliable, in-order, error-checked delivery, at the cost of extra overhead\n• <b>UDP (User Datagram Protocol)</b> — connectionless, no delivery guarantee, no ordering guarantee, but very low overhead and low latency\n  ↳ Each is covered in full in its own card next, including exactly which real-world applications choose each one and why.",
    note:
      "The core trade-off to remember: TCP trades speed for reliability; UDP trades reliability for speed. Neither one is universally 'better' — the right choice depends entirely on whether the application can tolerate lost or out-of-order data.",
    diagram:
      "  TCP vs UDP — the core trade-off\n\n  TCP: reliable, ordered, connection-based   ──  slower, more overhead\n  UDP: unreliable, unordered, connectionless ──  faster, less overhead",
    tags: ["Transport Layer Protocols", "TCP", "UDP"],
  },
  {
    id: 256,
    slug: "tcp-protocol",
    section: "Computer Networks",
    parentSlug: "transport-layer-protocols",
    title: "TCP (Transmission Control Protocol)",
    tagline: "Connection-oriented and reliable — guarantees data arrives complete, in order, and error-free",
    description:
      "<b>What TCP Is, in Plain English</b>\nTCP (Transmission Control Protocol) is a connection-oriented transport protocol that guarantees reliable delivery — every piece of data sent is acknowledged by the receiver, lost data is automatically retransmitted, and data arrives at the application in the exact order it was sent, even if individual packets took different paths or arrived out of order over the network.\n\n<b>The Three-Way Handshake</b>\nBefore any actual data is exchanged, TCP establishes a connection using a three-step handshake:\n1. <b>SYN</b> — the client sends a SYN (synchronize) message to the server, proposing to start a connection\n2. <b>SYN-ACK</b> — the server responds with a SYN-ACK, acknowledging the client's request and proposing its own synchronization\n3. <b>ACK</b> — the client sends a final ACK, confirming the connection is now established\n  ↳ Only after this handshake completes does actual application data start flowing.\n\n<b>How Reliability Is Achieved</b>\n• Every segment sent is acknowledged by the receiver; if an acknowledgment isn't received within an expected time, the sender retransmits\n• Segments carry sequence numbers, so the receiver can reorder them correctly even if they arrive out of sequence, and detect if any are missing\n• Flow control prevents a fast sender from overwhelming a slow receiver's buffer\n\n<b>When TCP Is Used</b>\nAny time correctness matters more than raw speed — web browsing (HTTP/HTTPS), email (SMTP), and file transfer (FTP) all run over TCP, since a corrupted or missing webpage, email, or file is unacceptable.",
    note:
      "Exam favourite: memorize the three-way handshake in order — SYN → SYN-ACK → ACK. This exact sequence is one of the most frequently tested details in the entire networking section.",
    diagram:
      "  TCP THREE-WAY HANDSHAKE\n\n  Client                          Server\n    │────────── SYN ─────────────►│   \"Let's connect\"\n    │◄──────── SYN-ACK ───────────│   \"OK, let's connect\"\n    │────────── ACK ──────────────►│   \"Confirmed, connection open\"\n    │                              │\n    │◄════ reliable data flow ════►│   (retransmits anything lost,\n    │                              │    reorders anything out of sequence)",
    tags: ["TCP", "Transport Layer Protocols", "Three-Way Handshake", "Connection-Oriented", "Reliable Delivery"],
  },
  {
    id: 257,
    slug: "udp-protocol",
    section: "Computer Networks",
    parentSlug: "transport-layer-protocols",
    title: "UDP (User Datagram Protocol)",
    tagline: "Connectionless and unreliable by design — trades guarantees for speed and low overhead",
    description:
      "<b>What UDP Is, in Plain English</b>\nUDP (User Datagram Protocol) is a connectionless transport protocol that sends data (as datagrams) without establishing a connection first, without acknowledging receipt, and without guaranteeing delivery, order, or error correction — it fires data out as fast as possible and trusts the application above it to handle any problems, if it cares to at all.\n\n<b>Why 'Unreliable' Isn't Automatically Bad</b>\nUDP's lack of guarantees means far less overhead than TCP — no handshake delay, no waiting for acknowledgments, no retransmission delays. For applications where a little lost data is fine, or where an old, retransmitted packet would actually be worse than just skipping it, this trade-off is exactly right.\n\n<b>When UDP Is Used</b>\n• <b>Video/audio streaming and voice/video calls</b> — a dropped frame or a moment of static is far less disruptive than the call freezing to wait for a retransmitted packet that's now outdated anyway\n• <b>Online gaming</b> — an old position update, retransmitted after a delay, is worse than useless; the game needs the newest data now, not a guaranteed-but-late one\n• <b>DNS queries</b> — a DNS lookup is small and quick; if the response is lost, the client can just ask again far faster than TCP's connection setup would take\n\n<b>TCP vs. UDP, Side by Side</b>\n• TCP: connection-oriented, reliable, ordered, higher overhead — web pages, email, file transfer\n• UDP: connectionless, unreliable, unordered, low overhead — streaming, gaming, DNS",
    note:
      "Exam favourite: UDP is preferred exactly when speed matters more than perfect delivery — streaming, gaming, and DNS are the three classic examples examiners expect. Don't say UDP is 'worse' than TCP — it's a deliberate trade-off, not a limitation.",
    diagram:
      "  UDP — fire and forget, no handshake\n\n  Client ──datagram──► Server   (no handshake, no acknowledgment expected)\n  Client ──datagram──► Server   (if this one is lost, no automatic retransmission)\n  Client ──datagram──► Server\n\n  Much lower overhead than TCP — no connection setup delay,\n  no waiting on acknowledgments — but no delivery guarantee either.",
    tags: ["UDP", "Transport Layer Protocols", "Connectionless", "Streaming", "Gaming", "DNS"],
  },
  {
    id: 258,
    slug: "networking-devices",
    section: "Computer Networks",
    title: "Networking Devices",
    tagline: "The physical hardware that actually moves data through a network — Hub, Switch, Router, Gateway, Firewall",
    description:
      "<b>What This Covers</b>\nNetworking Devices covers the actual physical (or virtual) hardware responsible for moving data around a network, connecting different networks together, and protecting a network from unwanted traffic.\n\n<b>What You'll Learn Here</b>\n• <b>Hub</b> — the simplest, dumbest device; broadcasts to every port with no intelligence at all\n• <b>Switch</b> — smarter than a hub; forwards data only to the correct port using MAC addresses\n• <b>Router</b> — connects entirely different networks together using IP addresses and routing\n• <b>Gateway</b> — connects networks that use completely different protocols or architectures\n• <b>Firewall</b> — filters traffic based on security rules, blocking unwanted or dangerous traffic\n  ↳ These are ordered roughly by which OSI layer they operate at, and by increasing intelligence — a hub has none, a firewall actively makes security decisions.",
    note:
      "A good way to remember these: Hub = no intelligence, broadcasts everywhere. Switch = local intelligence, uses MAC addresses. Router = connects networks, uses IP addresses. Gateway = protocol translator between different network types. Firewall = security filter.",
    diagram:
      "  NETWORKING DEVICES — increasing intelligence\n\n  Hub          Switch           Router            Gateway            Firewall\n  (broadcasts  (MAC address  ►  (IP address,   ►   (translates    ►   (security\n   to all)      table)           routing)          protocols)          filtering)",
    tags: ["Networking Devices", "Hub", "Switch", "Router", "Gateway", "Firewall"],
  },
  {
    id: 259,
    slug: "hub-device",
    section: "Computer Networks",
    parentSlug: "networking-devices",
    title: "Hub",
    tagline: "The simplest networking device — broadcasts every incoming signal to every other port, with no intelligence",
    description:
      "<b>What a Hub Is, in Plain English</b>\nA hub is the simplest networking device — a basic connector for multiple devices on a local network that has zero intelligence: whenever it receives data on one port, it blindly broadcasts that data out to every other port, whether or not that data was actually meant for the device on that port.\n\n<b>Why This Is a Problem</b>\n• <b>Wasted bandwidth</b> — every device connected to the hub receives every single piece of traffic, even data meant for someone else, wasting bandwidth and forcing every device to filter out data that isn't meant for it\n• <b>Collisions</b> — since a hub creates one shared 'collision domain,' if two devices happen to transmit at the same moment, their signals collide and both have to retransmit, which gets worse as more devices are added\n• <b>No security or addressing awareness</b> — a hub operates purely at the Physical layer (Layer 1) — it has no concept of MAC addresses or IP addresses at all, so it cannot make any intelligent forwarding decision\n\n<b>Why Hubs Are Rarely Used Today</b>\nSwitches solve every one of these problems (targeted forwarding using MAC addresses, no unnecessary collisions) at a similar cost, which is why hubs have been almost entirely replaced by switches in modern networks.",
    note:
      "Exam favourite: a hub operates at the Physical layer (Layer 1) and has no addressing intelligence at all — it simply repeats a signal to every port. This is the single biggest contrast with a switch, which is intelligent and operates at Layer 2.",
    diagram:
      "  HUB — broadcasts to every port, no intelligence\n\n  [PC1]──┐\n  [PC2]──┼──[HUB]   Data from PC1 to PC3 is ALSO sent to PC2 and PC4\n  [PC3]──┤          (PC2 and PC4 just ignore data not addressed to them)\n  [PC4]──┘",
    tags: ["Hub", "Networking Devices", "Physical Layer", "Collision Domain"],
  },
  {
    id: 260,
    slug: "switch-device",
    section: "Computer Networks",
    parentSlug: "networking-devices",
    title: "Switch",
    tagline: "Forwards data only to the port where the destination device actually lives, using MAC addresses",
    description:
      "<b>What a Switch Is, in Plain English</b>\nA switch connects multiple devices on a local network, just like a hub, but with real intelligence — it learns which MAC address lives on which port, and forwards incoming data only to the specific port where the destination device actually is, instead of broadcasting to everyone.\n\n<b>How a Switch Learns</b>\n• A switch maintains a MAC address table, mapping each MAC address it has seen to the port it arrived from\n• When a frame arrives, the switch checks the destination MAC address against this table and forwards the frame only out the correct port\n• If the destination MAC isn't in the table yet (the switch hasn't 'learned' it), it floods the frame to every port just once, but records the reply's source port to learn that address for next time\n\n<b>Why Switches Replaced Hubs</b>\n• Massively reduces wasted bandwidth, since traffic between two devices no longer reaches every other device on the network\n• Eliminates most collisions, since each connection effectively gets its own dedicated path rather than sharing one collision domain across every port\n• Operates at the Data Link layer (Layer 2), giving it MAC-address-based intelligence a hub simply doesn't have\n\n<b>Real-World Example</b>\nAn office network where 20 computers are all plugged into one switch — when Computer 1 sends a file to Computer 2, only Computer 2's port carries that traffic; the other 18 computers never see it at all.",
    note:
      "Exam favourite: switch = Layer 2 device, uses a MAC address table, forwards only to the correct port. This is the exact contrast to a hub (Layer 1, broadcasts to all) and the exact contrast to a router (Layer 3, uses IP addresses instead of MAC addresses).",
    diagram:
      "  SWITCH — forwards only to the correct port\n\n  [PC1]──┐                         MAC Address Table:\n  [PC2]──┼──[SWITCH]                Port 1 → PC1's MAC\n  [PC3]──┤                          Port 2 → PC2's MAC\n  [PC4]──┘                          Port 3 → PC3's MAC\n\n  Data from PC1 to PC3 is sent ONLY out Port 3 —\n  PC2 and PC4 never see this traffic at all.",
    tags: ["Switch", "Networking Devices", "Data Link Layer", "MAC Address Table"],
  },
  {
    id: 261,
    slug: "router-device",
    section: "Computer Networks",
    parentSlug: "networking-devices",
    title: "Router",
    tagline: "Connects entirely different networks together and forwards traffic between them using IP addresses",
    description:
      "<b>What a Router Is, in Plain English</b>\nA router connects two or more different networks together — most commonly, it's what connects your home or office's local network (LAN) to the wider internet (WAN). Unlike a switch, which forwards traffic within a single local network using MAC addresses, a router forwards traffic between different networks using IP addresses.\n\n<b>What a Router Does</b>\n• <b>Routing</b> — examines a packet's destination IP address and consults a routing table to decide the best path to forward it toward that destination, potentially through several other routers along the way\n• <b>Connecting different networks</b> — a home router, for example, connects your private local network (using private IP addresses like `192.168.1.x`) to your ISP's public network\n• <b>NAT (Network Address Translation)</b> — most home/office routers also translate the many private IP addresses on the local network into one shared public IP address when talking to the internet, and vice versa\n\n<b>Router vs. Switch</b>\n• A switch operates within one local network (Layer 2, MAC addresses) — a router operates between different networks (Layer 3, IP addresses)\n• A home 'router' you buy is usually actually a combo device — router + switch + Wi-Fi access point all in one box, which is why the distinction can get confusing in casual conversation\n\n<b>Real-World Example</b>\nThe device sitting in your home connecting all your Wi-Fi devices to your internet provider is a router — it routes traffic between your home's private local network and the wider public internet.",
    note:
      "Exam favourite: a router operates at the Network layer (Layer 3), using IP addresses and routing tables — a switch operates at the Data Link layer (Layer 2), using MAC addresses. If a question describes connecting two DIFFERENT networks, that's a router's job, not a switch's.",
    diagram:
      "  ROUTER — connects two DIFFERENT networks\n\n  [Home LAN: 192.168.1.x]───[ROUTER]───[ISP's Network]───► Internet\n\n  Router examines destination IP address,\n  checks its routing table, forwards toward the internet.",
    tags: ["Router", "Networking Devices", "Network Layer", "Routing Table", "NAT"],
  },
  {
    id: 262,
    slug: "gateway-device",
    section: "Computer Networks",
    parentSlug: "networking-devices",
    title: "Gateway",
    tagline: "Connects networks that use completely different protocols or architectures, translating between them",
    description:
      "<b>What a Gateway Is, in Plain English</b>\nA gateway is a networking device (or software) that connects two networks using entirely different protocols or architectures, translating data between them so devices on each side can still communicate — it's a broader, more general-purpose translator than a router, which typically connects networks that already speak the same protocol family (IP).\n\n<b>Gateway vs. Router</b>\n• A router connects networks that use the same underlying protocol (IP) and simply forwards packets between them based on IP addresses\n• A gateway can connect networks using entirely different protocols altogether, actively translating data formats so the two sides can understand each other — a router forwards, a gateway translates\n\n<b>The 'Default Gateway'</b>\nIn everyday networking, the term 'default gateway' refers to the device (usually your router) that a computer sends traffic to whenever the destination is outside its own local network — every device on a LAN is configured with a default gateway IP address, and any traffic not meant for the local network gets sent there first.\n  ↳ This is why, in practice, a home router is often casually called 'the gateway' — it's the router acting in the role of a gateway between your local network and everything outside it.\n\n<b>Real-World Example</b>\nAn email gateway that translates between two completely different email systems using different internal formats, or a VoIP gateway that converts a regular telephone call into digital data packets so it can travel over an internet connection.",
    note:
      "Exam favourite: 'default gateway' is a heavily tested networking term — it's the IP address a device sends traffic to whenever the destination is outside its own local network, almost always your router's local IP address.",
    diagram:
      "  DEFAULT GATEWAY — the exit point out of your local network\n\n  [Your PC: 192.168.1.10]\n         │  \"destination is outside my network — send to my gateway\"\n         ▼\n  [Default Gateway: 192.168.1.1]  (usually your router)\n         │\n         ▼\n  Onward to the internet / another network",
    tags: ["Gateway", "Default Gateway", "Networking Devices", "Protocol Translation"],
  },
  {
    id: 263,
    slug: "firewall-device",
    section: "Computer Networks",
    parentSlug: "networking-devices",
    title: "Firewall",
    tagline: "Filters network traffic based on security rules, blocking anything that doesn't meet policy",
    description:
      "<b>What a Firewall Is, in Plain English</b>\nA firewall is a security device (which can be hardware, software, or both) that monitors and controls incoming and outgoing network traffic based on a defined set of security rules, acting as a barrier between a trusted internal network and untrusted external networks (like the public internet).\n\n<b>How a Firewall Decides What to Allow</b>\n• <b>Packet filtering</b> — the simplest approach; examines each packet's source/destination IP address and port number against a set of rules, and allows or blocks it accordingly, with no memory of past packets\n• <b>Stateful inspection</b> — a smarter approach that tracks the state of active connections, and only allows incoming traffic that's a legitimate response to a connection the internal network itself initiated\n• <b>Application-level filtering</b> — the most granular approach; inspects traffic at the Application layer, able to block or allow based on the specific application or content involved, not just IP/port\n\n<b>What a Firewall Protects Against</b>\n• Unauthorized access attempts from outside the network\n• Malicious traffic patterns associated with known attacks\n• Restricting which internal services are exposed to the outside world at all (e.g. blocking every port except 80 and 443 on a public web server)\n\n<b>Real-World Example</b>\nA company's firewall configured to allow outgoing web traffic (port 443) from employee computers, but block any unsolicited incoming connection attempts from the internet toward those same computers — letting employees browse freely while protecting them from external attacks.",
    note:
      "Exam favourite: a firewall's core job is to filter traffic based on rules — packet filtering (simplest, per-packet, no memory) vs. stateful inspection (smarter, tracks connection state) is the most commonly tested distinction.",
    diagram:
      "  FIREWALL — filters traffic at the network boundary\n\n  Internet (untrusted) ────► [FIREWALL: checks rules] ────► Internal Network (trusted)\n\n  ALLOWED:  outgoing web requests, replies to connections we started\n  BLOCKED:  unsolicited incoming connection attempts, traffic on disallowed ports",
    tags: ["Firewall", "Networking Devices", "Packet Filtering", "Stateful Inspection", "Network Security"],
  },
  {
    id: 264,
    slug: "ip-addressing",
    section: "Computer Networks",
    title: "IP Addressing",
    tagline: "How every device on a network gets a unique address, and how that address space is divided up",
    description:
      "<b>What This Covers</b>\nIP Addressing looks at how devices are actually identified and located on a network — the two IP address formats in use today, and the two techniques used to divide a large address space into smaller, manageable, efficiently-allocated pieces.\n\n<b>What You'll Learn Here</b>\n• <b>IPv4</b> — the original, 32-bit addressing scheme still in widespread use, and its looming shortage of available addresses\n• <b>IPv6</b> — the 128-bit successor designed specifically to solve that shortage\n• <b>Subnetting</b> — dividing one network into multiple smaller sub-networks\n• <b>CIDR</b> — the modern, flexible slash-notation system for allocating address blocks of any size\n  ↳ These build on each other: IPv4 and IPv6 are the two address formats in use, and Subnetting/CIDR are both techniques for dividing and allocating those addresses efficiently.",
    note:
      "Exam favourite: IPv4 (32-bit, ~4.3 billion addresses) is running out; IPv6 (128-bit, effectively unlimited) is the fix. Subnetting and CIDR are both about dividing address space efficiently — subnetting is the general technique, CIDR is the modern notation/system for doing it flexibly.",
    diagram:
      "  IP ADDRESSING — formats and allocation techniques\n\n  Address formats:      IPv4 (32-bit)   vs   IPv6 (128-bit)\n  Allocation techniques: Subnetting   +   CIDR (slash notation)",
    tags: ["IP Addressing", "IPv4", "IPv6", "Subnetting", "CIDR"],
  },
  {
    id: 265,
    slug: "ipv4",
    section: "Computer Networks",
    parentSlug: "ip-addressing",
    title: "IPv4",
    tagline: "The original 32-bit addressing scheme, written as four dotted decimal numbers, now running out of addresses",
    description:
      "<b>What IPv4 Is, in Plain English</b>\nIPv4 (Internet Protocol version 4) is the original, still most widely used IP addressing scheme — every IPv4 address is 32 bits long, written as four decimal numbers separated by dots (dotted-decimal notation), like `192.168.1.1`.\n\n<b>How an IPv4 Address Is Structured</b>\n• 32 bits total, split into four 8-bit sections called octets\n• Each octet is written as a decimal number from 0 to 255 (since 8 bits can represent 256 different values, 0 through 255)\n• Example: `192.168.1.1` in binary is `11000000.10101000.00000001.00000001`\n\n<b>Network Portion vs. Host Portion</b>\nEvery IPv4 address is conceptually split into a network portion (identifying which network the address belongs to) and a host portion (identifying which specific device within that network) — where exactly that split happens is determined by the subnet mask, covered in the Subnetting card.\n\n<b>Public vs. Private Addresses</b>\n• <b>Public IP addresses</b> — globally unique, routable directly on the internet\n• <b>Private IP addresses</b> — reserved ranges (like `192.168.0.0`–`192.168.255.255`, or `10.0.0.0`–`10.255.255.255`) used inside local networks, not directly routable on the public internet, and reused independently by millions of separate private networks\n\n<b>The Address Exhaustion Problem</b>\nWith 32 bits, IPv4 provides about 4.3 billion possible addresses (2³² ≈ 4,294,967,296) — a number that seemed enormous decades ago, but has since been essentially exhausted given how many devices (phones, laptops, IoT devices) now need an address, which is exactly the problem IPv6 was designed to solve.",
    note:
      "Exam favourite: IPv4 = 32 bits, four dotted-decimal octets, roughly 4.3 billion total addresses (2³²). Memorize that exact number and the reason IPv6 exists — running out of IPv4 addresses.",
    diagram:
      "  IPv4 ADDRESS STRUCTURE — 32 bits, four octets\n\n  192   .  168   .   1   .   1\n   │        │        │       │\n  8 bits   8 bits   8 bits  8 bits   = 32 bits total\n\n  Binary: 11000000.10101000.00000001.00000001",
    tags: ["IPv4", "IP Addressing", "Dotted Decimal Notation", "Public IP", "Private IP"],
  },
  {
    id: 266,
    slug: "ipv6",
    section: "Computer Networks",
    parentSlug: "ip-addressing",
    title: "IPv6",
    tagline: "The 128-bit successor to IPv4, providing an effectively unlimited number of addresses",
    description:
      "<b>What IPv6 Is, in Plain English</b>\nIPv6 (Internet Protocol version 6) is the newer addressing scheme designed specifically to replace IPv4 and solve its address exhaustion problem — every IPv6 address is 128 bits long, written as eight groups of four hexadecimal digits, separated by colons, like `2001:0db8:85a3:0000:0000:8a2e:0370:7334`.\n\n<b>Why 128 Bits Solves the Shortage</b>\n128 bits provides 2¹²⁸ possible addresses — an almost incomprehensibly large number (about 340 undecillion, or 3.4 × 10³⁸), compared to IPv4's roughly 4.3 billion (2³²). This is enough addresses to assign a unique one to every grain of sand on Earth many times over, permanently solving the exhaustion problem IPv4 ran into.\n\n<b>Shorthand Notation</b>\nBecause IPv6 addresses are long, two shortcuts are allowed to make them easier to write:\n• Leading zeros within a group can be dropped (`0db8` can be written as `db8`)\n• One single run of consecutive all-zero groups can be replaced with `::`, but only once per address (to avoid ambiguity)\n  ↳ Example: `2001:0db8:0000:0000:0000:0000:1428:57ab` shortens to `2001:db8::1428:57ab`\n\n<b>IPv6 vs. IPv4</b>\n• IPv4: 32-bit, dotted-decimal, ~4.3 billion addresses, running low\n• IPv6: 128-bit, hexadecimal-colon notation, ~340 undecillion addresses, effectively unlimited\n• Both continue to run side by side today (called dual-stack), since not every network and device has fully transitioned to IPv6 yet",
    note:
      "Exam favourite: IPv6 = 128 bits, hexadecimal groups separated by colons, addresses the IPv4 exhaustion problem. Also know the `::` shorthand rule — it can only be used once in a single address, since using it twice would make the number of zero groups ambiguous.",
    diagram:
      "  IPv6 ADDRESS — 128 bits, eight hex groups\n\n  2001 : 0db8 : 85a3 : 0000 : 0000 : 8a2e : 0370 : 7334\n\n  Shortened form (one run of zero groups → ::):\n  2001:0db8:85a3::8a2e:0370:7334",
    tags: ["IPv6", "IP Addressing", "Hexadecimal Notation", "Address Exhaustion"],
  },
  {
    id: 267,
    slug: "subnetting",
    section: "Computer Networks",
    parentSlug: "ip-addressing",
    title: "Subnetting",
    tagline: "Dividing one large network into smaller sub-networks, using a subnet mask to mark the split",
    description:
      "<b>What Subnetting Is, in Plain English</b>\nSubnetting is the technique of dividing one large IP network into multiple smaller sub-networks (subnets), each capable of holding a smaller group of devices — instead of one huge network with thousands of devices all in one broadcast domain, an organization can split it into logically separate, more manageable pieces (e.g. one subnet per department or per floor).\n\n<b>The Subnet Mask</b>\nA subnet mask is a 32-bit number (just like an IPv4 address) that marks which bits of an IP address belong to the network portion, and which belong to the host portion — written the same dotted-decimal way as an IP address, like `255.255.255.0`.\n• Bits set to `1` in the mask mark the network portion\n• Bits set to `0` in the mask mark the host portion\n\n<b>Worked Example</b>\nTake the network `192.168.1.0` with subnet mask `255.255.255.0` (commonly written as `/24`, since 24 bits are set to 1):\n• Network portion: `192.168.1` (the first 24 bits)\n• Host portion: the last 8 bits — meaning 2⁸ = 256 possible host addresses\n• Of those 256, the first address (`192.168.1.0`) is reserved as the network address, and the last (`192.168.1.255`) is reserved as the broadcast address — leaving 254 usable addresses for actual devices\n\n<b>Why Organizations Subnet</b>\n• Reduces broadcast traffic — broadcasts stay within a subnet instead of flooding an entire large network\n• Improves security — subnets can be isolated from each other with firewall rules between them\n• Uses address space more efficiently — a department needing only 10 devices doesn't need to be handed a full 254-address subnet",
    note:
      "Exam favourite: for a /24 network, host bits = 8, giving 2⁸ = 256 total addresses, minus 2 reserved (network address + broadcast address) = 254 usable host addresses. This exact formula (2^host_bits − 2) is the single most tested calculation in this whole chapter.",
    diagram:
      "  SUBNETTING — 192.168.1.0/24\n\n  192  .  168  .   1   .   0\n  └──────Network (24 bits)──────┘└─Host (8 bits)─┘\n\n  192.168.1.0    → Network address (reserved)\n  192.168.1.1    → first usable host\n  ...\n  192.168.1.254  → last usable host\n  192.168.1.255  → Broadcast address (reserved)\n\n  Usable hosts = 2^8 − 2 = 254",
    code:
      "Network:      192.168.1.0\nSubnet Mask:  255.255.255.0   (/24)\nTotal addresses:  2^8 = 256\nReserved:         network (.0) + broadcast (.255) = 2\nUsable hosts:     256 - 2 = 254",
    codeLanguage: "Text",
    tags: ["Subnetting", "Subnet Mask", "IP Addressing", "Network Address", "Broadcast Address"],
  },
  {
    id: 268,
    slug: "cidr",
    section: "Computer Networks",
    parentSlug: "ip-addressing",
    title: "CIDR (Classless Inter-Domain Routing)",
    tagline: "The modern slash-notation system that lets address blocks be sized flexibly, not locked into fixed classes",
    description:
      "<b>What CIDR Is, in Plain English</b>\nCIDR (Classless Inter-Domain Routing) is the modern system for allocating and writing IP address ranges, using a flexible slash notation like `192.168.1.0/24` — the number after the slash states exactly how many bits are the network portion, letting a network be sized to exactly however many addresses it actually needs, instead of being locked into old, rigid, fixed-size classes.\n\n<b>The Old, Rigid Class System CIDR Replaced</b>\nBefore CIDR, IPv4 addresses were divided into fixed classes — Class A (huge networks, millions of hosts each), Class B (medium networks), and Class C (small networks, 254 hosts each) — with no size in between. An organization needing 2,000 addresses had no good option: a Class C network was far too small, but the next size up (Class B) wasted hundreds of thousands of unused addresses.\n\n<b>How CIDR Fixes This</b>\n• The `/n` notation directly states the number of network bits, so a network can be exactly the size needed — `/25` gives 128 addresses, `/26` gives 64, `/27` gives 32, and so on — completely independent of the old fixed classes\n• This is the exact same idea as subnetting's subnet mask, just written in a more compact, flexible, universally-adopted format\n\n<b>Worked Example — Comparing Sizes</b>\n• `/24` → 8 host bits → 256 addresses (254 usable)\n• `/25` → 7 host bits → 128 addresses (126 usable)\n• `/26` → 6 host bits → 64 addresses (62 usable)\n  ↳ An organization needing exactly 60 devices can be allocated a `/26` block instead of wasting an entire `/24`, since 62 usable addresses fits their need almost exactly.\n\n<b>CIDR and Routing</b>\nCIDR also lets routers group together multiple smaller, adjacent networks into one larger routing table entry (called route aggregation or supernetting), reducing the size of routing tables across the internet.",
    note:
      "Exam favourite: CIDR's `/n` notation directly states the number of network bits — memorize that fewer host bits means fewer usable addresses (2^host_bits − 2), and that CIDR exists specifically to replace the old, wasteful fixed Class A/B/C system.",
    diagram:
      "  CIDR — flexible sizing vs the old rigid classes\n\n  Old system:  Class A (huge)  Class B (medium)  Class C (254 hosts)  ← big gaps, no in-between\n\n  CIDR:  /24 (254 hosts)  /25 (126 hosts)  /26 (62 hosts)  /27 (30 hosts) ...\n         ← any size in between is possible, no wasted address blocks",
    code:
      "/24  → 2^8  - 2 = 254 usable hosts\n/25  → 2^7  - 2 = 126 usable hosts\n/26  → 2^6  - 2 = 62  usable hosts\n/27  → 2^5  - 2 = 30  usable hosts\n/28  → 2^4  - 2 = 14  usable hosts",
    codeLanguage: "Text",
    tags: ["CIDR", "IP Addressing", "Classless Routing", "Subnetting", "Route Aggregation"],
  },
];

export const IT_OFFICER_CONCEPT_COUNT = IT_OFFICER_CONCEPTS.length;
