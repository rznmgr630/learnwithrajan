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
  tags: string[];
}

export const IT_OFFICER_SECTIONS = ["Computer Fundamentals"] as const;

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
];

export const IT_OFFICER_CONCEPT_COUNT = IT_OFFICER_CONCEPTS.length;
