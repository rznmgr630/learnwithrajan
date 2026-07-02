import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_22_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Animation makes your UI feel alive — not flashy, but purposeful. A fade-in tells users \"new content arrived.\" A slide-out confirms \"that item was removed.\" <b>Framer Motion</b> is the most popular React animation library: it uses a declarative API (describe the animation, not the steps) and handles the hard parts (interruptions, layout shifts, accessibility) automatically.\n\nAnalogy: Framer Motion is like a skilled stage director — you describe the scene changes, the director choreographs the actors. You say \"enter from the left\" and exit \"fade out\" — the director figures out the timing, easing, and interruptions.",
      np: "Framer Motion ले React मा declarative animation दिन्छ — motion components, variants, gestures र layout animations।",
      jp: "Framer Motion は宣言的な API で React にアニメーションを追加するライブラリです。",
    },
    {
      en: "In this day we cover the full Framer Motion toolkit:\n\n• <b>`motion` components</b> — the foundation: animate any HTML element with `initial`, `animate`, `exit` props\n• <b>AnimatePresence</b> — play exit animations before React removes a component from the DOM\n• <b>Variants</b> — named animation states that orchestrate parent-child stagger effects\n• <b>Gestures</b> — `whileHover`, `whileTap`, `drag` for interactive micro-animations\n• <b>Layout animations</b> — smooth transitions when a component's size or position changes",
      np: "motion components, AnimatePresence, variants, gestures र layout animations सिक्छौं।",
      jp: "motion コンポーネント・AnimatePresence・バリアント・ジェスチャー・レイアウトアニメーションを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "motion components & basic animation",
        np: "motion components र basic animation",
        jp: "motion コンポーネントと基本アニメーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Framer Motion wraps any HTML element with a `motion.*` prefix. You add `initial` (start state), `animate` (end state), and `transition` (how to get there). React handles when to mount/update; Framer Motion handles how it looks during the change.\n\n• `initial` — the state when the component first appears\n• `animate` — the target state to animate toward\n• `exit` — the state when the component leaves (requires `AnimatePresence`)\n• `transition` — duration, easing, delay, spring config\n\nFramer Motion uses <b>spring physics</b> by default (`type: 'spring'`) — animations feel natural because they overshoot slightly like a real object. Use `type: 'tween'` for precise CSS-style easing.",
            np: "`motion.div` लाई `initial`, `animate`, `transition` props दिएर animate गर्ने।",
            jp: "`motion.*` で要素をラップし、`initial`・`animate`・`transition` を指定します。",
          },
        },
        {
          type: "code",
          title: { en: "Basic motion.div + state-driven animation", np: "Basic motion.div", jp: "基本の motion.div" },
          code: `import { motion } from "framer-motion";

// Fade + slide up on mount
function Card({ title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-xl p-4 shadow"
    >
      {title}
    </motion.div>
  );
}

// Animate on state change — like button scales when liked
function LikeButton({ liked, onToggle }) {
  return (
    <motion.button
      animate={{ scale: liked ? 1.2 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onClick={onToggle}
    >
      {liked ? "❤️" : "🤍"}
    </motion.button>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "AnimatePresence — exit animations",
        np: "AnimatePresence — exit animations",
        jp: "AnimatePresence — 退場アニメーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React removes components from the DOM instantly when they unmount. Without `AnimatePresence`, there's no chance to play an exit animation — the element is already gone.\n\n`AnimatePresence` holds the component in the DOM until its `exit` animation finishes, then unmounts it.\n\nAnalogy: `AnimatePresence` is like a stage manager who holds the curtain until the actor completes their exit walk — no teleporting off-stage.\n\nKey rule: every direct child of `AnimatePresence` needs a unique `key` prop — that's how it tracks which child is entering vs exiting.",
            np: "`AnimatePresence` ले exit animation सकिएपछि मात्र component unmount गर्छ।",
            jp: "`AnimatePresence` はアンマウント前に退場アニメーションを完了させます。",
          },
        },
        {
          type: "code",
          title: { en: "AnimatePresence for list items + route transitions", np: "AnimatePresence उदाहरण", jp: "AnimatePresence の例" },
          code: `import { AnimatePresence, motion } from "framer-motion";

// Animate list item removal
function TodoList({ todos, onDelete }) {
  return (
    <ul>
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.25 }}
          >
            {todo.text}
            <button onClick={() => onDelete(todo.id)}>×</button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

// Route transitions with React Router
import { useLocation } from "react-router-dom";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Variants — orchestrated animations",
        np: "Variants — orchestrated animations",
        jp: "バリアント — 協調アニメーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Variants let you define named animation states as objects, then reference them by name. The real power: parent variants automatically propagate to children — enabling stagger effects where list items animate in one by one.\n\nInstead of writing `initial={{ opacity: 0 }}` on every item, you define the states once on the parent and children inherit them.\n\n• Define variants as a plain object: `{ hidden: {...}, visible: {...} }`\n• Reference by name string: `initial=\"hidden\" animate=\"visible\"`\n• Use `staggerChildren` in the parent transition to delay each child by a set amount",
            np: "Variants ले named states define गर्छ। Parent variants children मा propagate हुन्छ — stagger effect को लागि।",
            jp: "バリアントで名前付きアニメーション状態を定義し、子コンポーネントへ伝播させます。",
          },
        },
        {
          type: "code",
          title: { en: "Staggered list animation with variants", np: "Staggered list animation", jp: "スタガーリストアニメーション" },
          code: `import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,   // each child delays 100ms after the previous
      delayChildren: 0.2,     // wait 200ms before starting the first child
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

function ProductGrid({ products }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 gap-4"
    >
      {products.map((p) => (
        <motion.li key={p.id} variants={itemVariants}>
          <ProductCard product={p} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
// Result: each card fades + slides in, staggered 100ms apart`,
        },
      ],
    },
    {
      title: {
        en: "Gestures — hover, tap & drag",
        np: "Gestures — hover, tap र drag",
        jp: "ジェスチャー — ホバー・タップ・ドラッグ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Framer Motion has built-in gesture props that animate on user interaction. No `onMouseEnter`/`onMouseLeave` boilerplate — just add a prop:\n\n• `whileHover` — animate while the cursor is over the element\n• `whileTap` — animate while the element is being pressed\n• `whileFocus` — animate while the element is focused (great for inputs)\n• `drag` — make an element draggable\n• `dragConstraints` — limit drag area with `{ top, right, bottom, left }` or a ref to a container\n\nThese are <b>gesture animations</b> — they automatically reverse when the gesture ends.",
            np: "`whileHover`, `whileTap`, `drag` props ले gesture animations दिन्छ।",
            jp: "`whileHover`・`whileTap`・`drag` でジェスチャーアニメーションが簡単に実装できます。",
          },
        },
        {
          type: "code",
          title: { en: "Hover, tap, drag & scroll-driven animations", np: "Gesture animations", jp: "ジェスチャーアニメーション" },
          code: `import { motion, useScroll, useTransform } from "framer-motion";

// Button with hover + tap feedback
function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

// Draggable card with constraints
function DraggableCard() {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
      dragElastic={0.2}        // how much it stretches past constraints
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      className="w-48 rounded-xl bg-white p-4 shadow-xl cursor-grab"
    >
      Drag me!
    </motion.div>
  );
}

// Scroll-driven animation (parallax header opacity)
function ParallaxHeader() {
  const { scrollY } = useScroll();
  // As user scrolls from 0px to 200px, opacity goes from 1 to 0
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.8]);

  return (
    <motion.header style={{ opacity, scale }} className="sticky top-0">
      Hero content that fades as you scroll
    </motion.header>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Layout animations",
        np: "Layout animations",
        jp: "レイアウトアニメーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Layout animations handle the hardest animation problem: smoothly transitioning when a component's <b>size or position changes</b> due to DOM changes — not just CSS property changes.\n\nNormally when items reorder, are added, or removed from a list, siblings jump to their new positions instantly. The `layout` prop tells Framer Motion to animate that position change smoothly.\n\nAnalogy: normally when you remove a book from a shelf, all the books slide into place instantly. With `layout`, they smoothly slide into their new positions.\n\n• `layout` prop — animate any position/size change\n• `layoutId` — shared layout animation: one element morphs into another across two different parts of the tree (e.g., a card expanding into a modal)",
            np: "`layout` prop ले position/size changes animate गर्छ। `layoutId` ले shared layout animation गर्छ।",
            jp: "`layout` でレイアウト変化をアニメーション、`layoutId` で共有アニメーションを実装します。",
          },
        },
        {
          type: "code",
          title: { en: "Layout animation + shared layout (card → modal)", np: "Layout animation", jp: "レイアウトアニメーション" },
          code: `import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

// Reorderable list — items animate when sorted
function SortableList({ items }) {
  return (
    <LayoutGroup>
      <ul>
        {items.map((item) => (
          <motion.li key={item.id} layout>
            {item.name}
          </motion.li>
        ))}
      </ul>
    </LayoutGroup>
  );
}

// Shared layout animation — card expands to modal
function Gallery({ items }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={item.id}          // <-- same layoutId as the modal
            onClick={() => setSelectedId(item.id)}
            className="cursor-pointer rounded-xl overflow-hidden"
          >
            <img src={item.thumbnail} alt={item.title} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            layoutId={selectedId}       // <-- morphs FROM the clicked card
            className="fixed inset-0 z-50 m-8 rounded-2xl bg-white"
          >
            <FullImage item={items.find(i => i.id === selectedId)} />
            <button onClick={() => setSelectedId(null)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Does Framer Motion hurt performance?",
        np: "Framer Motion ले performance slow गर्छ?",
        jp: "Framer Motion はパフォーマンスに影響しますか？",
      },
      answer: {
        en: "Framer Motion animates `transform` and `opacity` by default — these run on the GPU compositor thread without triggering layout recalculation, so they're fast. Avoid animating `width`, `height`, `top`, `left` properties — those trigger layout and are slow. Use `x`/`y`/`scale` instead of `left`/`top`/`width`/`height`. The `layout` prop does trigger layout reads but batches them intelligently.",
        np: "transform र opacity animate गर्दा fast हुन्छ। width/height animate नगर्नुहोस्।",
        jp: "`transform` と `opacity` は GPU で動くため速いです。`width`/`height` のアニメーションは避けてください。",
      },
    },
    {
      question: {
        en: "When should I NOT animate?",
        np: "Animation कहिले नगर्ने?",
        jp: "アニメーションを使わない場面は？",
      },
      answer: {
        en: "Don't animate for animation's sake. Red flags:\n• Animation takes longer than 300ms — users feel it as lag\n• Animation blocks interaction (user can't click while animating)\n• Animations everywhere with no consistent pattern\n• Animating the same thing the user sees constantly (e.g. a counter that pulses on every increment)\n\nGood uses: state transitions (loading → data), entering/exiting elements, micro-feedback (button tap), meaningful navigation (page transitions). The rule: animation should communicate information, not decorate.",
        np: "Animation 300ms भन्दा धेरै नराख्नुहोस्। User interaction block नगर्नुहोस्।",
        jp: "300ms 以上のアニメーションは遅く感じます。インタラクションをブロックしないよう注意。",
      },
    },
    {
      question: {
        en: "How do I respect prefers-reduced-motion?",
        np: "prefers-reduced-motion कसरी respect गर्ने?",
        jp: "prefers-reduced-motion への対応方法は？",
      },
      answer: {
        en: "Framer Motion has a built-in hook: `const { reducedMotion } = useReducedMotion()`. If the user has enabled \"Reduce motion\" in their OS, `reducedMotion` is `'always'`. You can use this to skip animations or use instant transitions. Alternatively, wrap all animations in a check: `const shouldAnimate = !prefersReducedMotion; <motion.div animate={shouldAnimate ? { opacity: 1 } : {}}>`. Framer Motion v10+ also has a global `MotionConfig reducedMotion=\"user\"` that automatically respects the OS setting.",
        np: "`useReducedMotion()` hook ले OS setting check गर्छ र animation skip गर्न सकिन्छ।",
        jp: "`useReducedMotion()` で OS 設定を確認し、アニメーションをスキップできます。",
      },
    },
    {
      question: {
        en: "What is the difference between `animate` and `transition`?",
        np: "`animate` र `transition` मा के फरक?",
        jp: "`animate` と `transition` の違いは？",
      },
      answer: {
        en: "`animate` defines the TARGET state — what values to animate TO (e.g. `{ opacity: 1, y: 0 }`). `transition` defines HOW to get there — duration, easing, spring stiffness, delay. Think: `animate` is the destination; `transition` is the mode of transport. You can also put `transition` inside variant definitions to give each state its own timing.",
        np: "`animate` = destination (कहाँ जाने), `transition` = how to get there (कसरी)।",
        jp: "`animate` は目標値、`transition` はその到達方法（速度・イージング等）を定義します。",
      },
    },
    {
      question: {
        en: "How do I trigger an animation from a parent component?",
        np: "Parent बाट animation trigger गर्ने कसरी?",
        jp: "親コンポーネントからアニメーションをトリガーするには？",
      },
      answer: {
        en: "Use Framer Motion's `useAnimationControls()` hook: `const controls = useAnimation(); controls.start('visible')`. Pass `controls` as the `animate` prop: `<motion.div animate={controls} variants={variants}>`. Now calling `controls.start('visible')` from the parent plays the animation. Alternatively, use the `whileInView` prop for scroll-triggered animations: `<motion.div whileInView={{ opacity: 1 }} viewport={{ once: true }}>` — animates once when it enters the viewport.",
        np: "`useAnimation()` controls दिन्छ। `controls.start('visible')` ले parent बाट trigger गर्न मिल्छ।",
        jp: "`useAnimation()` でコントロールを取得し、親から `controls.start()` を呼び出します。",
      },
    },
  ],
};
