import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_28_LESSONS: LessonDay = {
  day: 28,
  title: "Styling, Design Systems, and Responsive React UI",
  totalMinutes: 65,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-28-lesson-1",
      title: "Choosing a Styling Strategy",
      durationMinutes: 13,
      explanation: `React does not require one particular styling solution. You can use regular CSS, CSS Modules, CSS-in-JS, utility classes, or a design-system package. The important skill is understanding the trade-offs instead of treating a styling library as a replacement for CSS knowledge.

Regular CSS is simple and close to the browser platform. CSS Modules scope class names to a component file. Utility-first approaches compose small classes directly in markup. A design system adds reusable visual rules and components on top of these foundations.

For example, a small application may only need CSS Modules and a few shared components. A larger product may benefit from design tokens and a consistent component library. Choose the simplest approach that supports the application's needs.`,
      diagram: `CSS knowledge
    ↓
Styling strategy
├── plain CSS
├── CSS Modules
├── utility classes
└── component/design system`,
      codeExample: {
        title: "CSS Modules",
        code: `import styles from "./Card.module.css";

export function Card() {
  return <article className={styles.card}>Profile</article>;
}

// Card.module.css
// .card {
//   padding: 1rem;
//   border-radius: 0.75rem;
// }`,
      },
      keyTakeaways: [
        "React works with many styling strategies.",
        "Strong CSS fundamentals remain useful regardless of the tool.",
        "Choose styling based on project requirements rather than trend.",
      ],
      commonMistakes: [
        "Using a styling framework without understanding CSS.",
        "Mixing several styling systems without a clear reason.",
        "Putting feature-specific styling into global selectors.",
      ],
      quiz: [
        {
          question: "What is the purpose of CSS Modules?",
          options: ["Provide locally scoped class names", "Replace React", "Create API requests", "Validate forms"],
          correctIndex: 0,
          explanation: "CSS Modules scope styles to the module/component boundary.",
        },
      ],
    },
    {
      id: "react-day-28-lesson-2",
      title: "Design Tokens and Consistency",
      durationMinutes: 13,
      explanation: `Design tokens are named values for repeated design decisions such as colors, spacing, typography, radii, and shadows. Instead of choosing a different gray or spacing value in every component, tokens give the interface a shared vocabulary.

Tokens also make redesigns easier. If the product's spacing scale changes, you can update the token definitions instead of searching for hundreds of unrelated values. Tokens do not have to be complicated; CSS custom properties are enough for many projects.

For example, a Button and Card can both use the same spacing and radius tokens. This creates consistency while allowing the components to remain independent.`,
      diagram: `Design tokens
├── color
├── spacing
├── typography
├── radius
└── shadow
      ↓
Button / Card / Input / Dialog`,
      codeExample: {
        title: "Simple CSS design tokens",
        code: `:root {
  --color-primary: #2563eb;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --radius-md: 0.5rem;
}

.card {
  padding: var(--space-2);
  border-radius: var(--radius-md);
}`,
      },
      keyTakeaways: [
        "Tokens create consistent design decisions.",
        "CSS custom properties can implement a simple token system.",
        "Use semantic names when a value represents a design role.",
      ],
      commonMistakes: [
        "Creating hundreds of tokens without a real need.",
        "Naming every token only by its raw value.",
        "Bypassing the design system for one-off values everywhere.",
      ],
      quiz: [
        {
          question: "What does a design token represent?",
          options: ["A reusable design decision such as spacing or color", "A database row", "A React state object", "An HTTP status"],
          correctIndex: 0,
          explanation: "Tokens give repeated design decisions consistent names and values.",
        },
      ],
    },
    {
      id: "react-day-28-lesson-3",
      title: "Responsive Layouts",
      durationMinutes: 13,
      explanation: `Responsive design means the interface adapts to different viewport sizes and input environments. Flexbox and Grid provide the main layout primitives, while media queries can change layout rules at selected breakpoints. Good responsive design starts with content needs rather than a fixed list of device names.

A common mistake is designing only for a large desktop screen and then adding a mobile breakpoint at the end. Instead, decide how navigation, cards, tables, forms, and spacing should behave as available space changes. Components should be able to survive different widths without relying on hardcoded pixel assumptions.

For example, a dashboard grid can show four columns on a wide screen, two columns at a medium width, and one column when cards no longer have enough room.`,
      diagram: `Wide
[1][2][3][4]

Medium
[1][2]
[3][4]

Small
[1]
[2]
[3]
[4]`,
      codeExample: {
        title: "Responsive grid",
        code: `.dashboard {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 900px) {
  .dashboard {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}`,
      },
      keyTakeaways: [
        "Responsive design adapts layout to available space.",
        "Grid and Flexbox are core responsive tools.",
        "Breakpoints should respond to content needs.",
      ],
      commonMistakes: [
        "Using many device-specific breakpoints without need.",
        "Hardcoding widths that overflow on small screens.",
        "Testing only one desktop and one mobile size.",
      ],
      quiz: [
        {
          question: "What should primarily determine a responsive breakpoint?",
          options: ["When the content/layout needs to change", "A specific phone brand", "The developer's monitor", "The database schema"],
          correctIndex: 0,
          explanation: "Breakpoints should support the content and layout rather than device labels.",
        },
      ],
    },
    {
      id: "react-day-28-lesson-4",
      title: "Accessible Components and Visual States",
      durationMinutes: 13,
      explanation: `A reusable component needs more than attractive styling. It should expose meaningful semantics, keyboard behavior, focus states, labels, and appropriate states such as disabled, loading, selected, and invalid. Accessibility is part of component design rather than a final checklist.

For example, a custom modal should manage focus correctly, have an accessible name, respond appropriately to keyboard interaction, and communicate its purpose to assistive technology. A styled div that visually resembles a button is not automatically equivalent to a real button.

The same principle applies to forms. Inputs need labels, errors should be associated with the relevant field, and visual-only color changes should not be the only way to communicate state.`,
      diagram: `Reusable component
├── semantics
├── keyboard
├── focus
├── visual states
└── screen-reader meaning`,
      codeExample: {
        title: "Accessible form field",
        code: `<label htmlFor="email">Email</label>
<input
  id="email"
  name="email"
  type="email"
  aria-describedby="email-error"
/>
<p id="email-error">Enter a valid email address.</p>`,
      },
      keyTakeaways: [
        "Semantics are part of component APIs.",
        "Keyboard and focus behavior matter.",
        "Error and selected states should be communicated beyond color alone.",
      ],
      commonMistakes: [
        "Replacing semantic HTML with divs.",
        "Removing visible focus indicators.",
        "Using color as the only error indicator.",
      ],
      quiz: [
        {
          question: "What should a reusable component consider besides visual styling?",
          options: ["Semantics, keyboard, focus, and accessible states", "Only colors", "Only animations", "Only font size"],
          correctIndex: 0,
          explanation: "Accessible interaction is part of a complete component design.",
        },
      ],
    },
    {
      id: "react-day-28-lesson-5",
      title: "Building a Small Design System",
      durationMinutes: 13,
      explanation: `A design system should grow from repeated needs. Start with a small set of primitives such as Button, Input, Card, Dialog, Badge, Spinner, and EmptyState. Define consistent variants, spacing, typography, and interaction states rather than creating a separate component for every screen.

Good component APIs make common cases easy while still allowing necessary customization. Avoid putting application-specific business logic into shared components. A Button should know about visual variants and interaction states; it should not know how a particular company's billing process works.

For example, a shared EmptyState can accept a title, description, and optional action. Different features can reuse it without importing each other's business logic.`,
      diagram: `Design tokens
      ↓
UI primitives
├── Button
├── Input
├── Card
├── Dialog
└── EmptyState
      ↓
Feature components
      ↓
Pages`,
      codeExample: {
        title: "Reusable EmptyState",
        code: `type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
}`,
      },
      keyTakeaways: [
        "Start a design system from repeated patterns.",
        "Keep shared components feature-agnostic.",
        "Use consistent APIs and states across the application.",
      ],
      commonMistakes: [
        "Building a huge design system before the product needs it.",
        "Putting business logic into visual primitives.",
        "Making every component configurable through dozens of props.",
      ],
      quiz: [
        {
          question: "When should a component usually become shared?",
          options: ["When reuse or consistency justifies it", "Immediately after one use", "Only after 100 uses", "Never"],
          correctIndex: 0,
          explanation: "Shared abstractions should solve a real repeated need.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What do design tokens provide?",
      options: ["Named reusable design decisions", "API authentication", "Database indexes", "React state"],
      correctIndex: 0,
      explanation: "Tokens standardize repeated visual decisions.",
    },
    {
      question: "What should determine responsive breakpoints?",
      options: ["Content and layout needs", "Phone brands", "Database size", "JavaScript version"],
      correctIndex: 0,
      explanation: "Breakpoints should respond to layout constraints.",
    },
    {
      question: "What belongs in an accessible component?",
      options: ["Semantics and keyboard/focus behavior", "Only CSS", "Only colors", "Only animation"],
      correctIndex: 0,
      explanation: "Accessibility includes semantics and interaction behavior.",
    },
    {
      question: "What should shared UI primitives avoid?",
      options: ["Feature-specific business logic", "Reusable styling", "Accessible states", "Consistent variants"],
      correctIndex: 0,
      explanation: "Shared primitives should remain reusable and feature-agnostic.",
    },
  ],
  project: {
    name: "React Design System",
    goal: "Build a small responsive and accessible design system and use it in a dashboard.",
    brief: "Create design tokens and reusable UI primitives, then build a responsive dashboard from those primitives. Focus on consistency, accessibility, and a small API rather than maximum abstraction.",
    steps: [
      "Create tokens for colors, spacing, typography, and radius.",
      "Build Button, Input, Card, Dialog, Badge, Spinner, and EmptyState components.",
      "Give components consistent variants and interaction states.",
      "Build a responsive dashboard using CSS Grid and Flexbox.",
      "Add keyboard and focus behavior to interactive components.",
      "Add accessible labels and error messaging to forms.",
      "Keep feature-specific business logic outside shared UI primitives.",
    ],
    acceptance: [
      "The dashboard works at wide, medium, and narrow widths.",
      "Shared components use consistent tokens.",
      "Interactive controls are keyboard accessible.",
      "Forms have labels and meaningful error messages.",
      "Shared components contain no feature-specific business rules.",
    ],
    stretch: [
      "Add dark mode using design tokens.",
      "Document components with Storybook.",
      "Add automated accessibility checks.",
    ],
  },
};
