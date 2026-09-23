import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_2_LESSONS = normalizePastedLessonDay({
  day: 2,
  title: "React Native internals: from state update to native UI",
  totalMinutes: 60,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "render-pipeline",
      title: "The full path from state update to pixels",
      durationMinutes: 15,
      explanation: `<b>A React Native state update passes through several layers before pixels change.</b>
Calling <code>setState</code> schedules React work. The <b>React reconciler</b> (the part of React that determines what changed) compares the new React tree with the previous one. React Native represents the native UI through a <b>Shadow Tree</b>, then the <b>Fabric renderer</b> coordinates rendering and commits the required changes to native <b>host components</b> (platform-backed UI components). The native platform applies the view mutation and the user sees the result.

The durable mental model is:
<code>JS state change → React reconciler → Shadow Tree → Fabric renderer → host components → native view mutation → pixels</code>.

This is a mental model, not a claim that every internal operation is one simple sequential function call. It is useful because it explains why JavaScript code, React rendering, and native UI are related but not identical.`,
      diagram: `<pre>setState
  ↓
React reconciler
  ↓
Shadow Tree
  ↓
Fabric renderer
  ↓
Native host components
  ↓
Native view mutation
  ↓
Pixels on screen</pre>`,
      codeExample: `<pre><code class="language-tsx">const [count, setCount] = useState(0);

&lt;Pressable onPress={() =&gt; setCount(c =&gt; c + 1)}&gt;
  &lt;Text&gt;{count}&lt;/Text&gt;
&lt;/Pressable&gt;

// The press starts natively.
// setCount updates React state.
// React reconciles the tree.
// Fabric/native rendering produces the updated UI.</code></pre>`,
      keyTakeaways: ['setState does not directly mutate a native view.', 'The reconciler determines what changed.', 'The Shadow Tree represents native UI structure/layout information.', 'Fabric is the modern renderer.', 'The final pixels are produced by native UI.'],
      commonMistakes: ['Thinking React Native directly draws pixels from JavaScript.', 'Confusing the React tree with the native view hierarchy.', 'Assuming every internal step runs on the JS thread.'],
      quiz: [{'question': 'What is the high-level state-to-screen pipeline?', 'answer': 'JS state change → React reconciler → Shadow Tree → Fabric renderer → host components → native view mutation → pixels.'}]
    },
    {
      id: "threads",
      title: "The JS thread, UI thread, and native/background threads",
      durationMinutes: 12,
      explanation: `<b>Different work has different execution contexts.</b> The <b>JavaScript thread</b> runs JavaScript/TypeScript application logic and React-related work. The <b>UI thread</b> is critical for responsive platform UI and rendering. Native code can also use <b>background threads</b> for suitable work such as I/O or platform services.

The important performance question is not simply "is this code async?" but <b>where does this work execute?</b> A large synchronous calculation on the JS thread can delay event handling and React work. Likewise, moving work to a background context does not automatically make every operation safe or appropriate.

A useful rule: keep the JS thread available for responsive application work and understand which library or native API owns expensive work.`,
      diagram: `<pre>React Native
├─ JS thread → React, handlers, app logic
├─ UI thread → platform UI responsiveness/rendering
└─ Native/background → suitable platform/I/O work</pre>`,
      codeExample: `<pre><code class="language-tsx">function handlePress() {
  // Keep synchronous work here small.
  // A huge CPU loop can block JavaScript.
  setCount(c =&gt; c + 1);
}</code></pre>`,
      keyTakeaways: ['JS executes application JavaScript.', 'UI responsiveness depends on keeping the relevant native UI work responsive.', 'Native/background threads can handle suitable platform work.', 'async/await does not automatically move CPU-heavy JavaScript to another thread.'],
      commonMistakes: ['Assuming async means another thread.', 'Putting expensive synchronous loops in event handlers.', 'Trying to fix every performance issue with memoization.'],
      quiz: [{'question': 'Why can blocking JS cause jank?', 'answer': 'While JS is blocked it cannot promptly process JavaScript-side events, React work, and application updates.'}]
    },
    {
      id: "bridgeless-jsi",
      title: "Bridgeless architecture and JSI communication",
      durationMinutes: 10,
      explanation: `<b>"Bridgeless" does not mean "no communication."</b> The historical React Native Bridge was an asynchronous message-passing layer between JavaScript and native code. The modern architecture uses <b>JSI (JavaScript Interface)</b>, a lower-level interface that allows JavaScript runtimes to interact more directly with C++ and native implementations.

JSI enables synchronous native interactions when an API needs them, but it does <b>not</b> mean every operation is synchronous. Network requests, storage, and many application operations remain asynchronous.

The key distinction is: <b>no old Bridge as the primary communication model ≠ no JavaScript/native communication.</b>`,
      diagram: `<pre>Legacy: JS → async Bridge queue → Native

Modern: JS runtime → JSI → C++/native → iOS/Android</pre>`,
      codeExample: `<pre><code class="language-ts">// Normal application code usually consumes a library API.
// It does not need to call JSI directly.

const response = await fetch("/api/profile");
const profile = await response.json();</code></pre>`,
      keyTakeaways: ['Bridgeless removes dependence on the old Bridge communication model.', 'JSI provides lower-level JS/native interoperability.', 'JSI can support synchronous calls when appropriate.', 'Modern RN still uses asynchronous APIs.'],
      commonMistakes: ['Saying bridgeless means native communication disappeared.', 'Saying JSI makes everything synchronous.', 'Assuming normal app developers directly write JSI for every feature.'],
      quiz: [{'question': 'What does bridgeless mean?', 'answer': 'The modern architecture does not depend on the old asynchronous Bridge queue as its primary communication mechanism.'}]
    },
    {
      id: "turbomodules-fabric",
      title: "TurboModules and Fabric",
      durationMinutes: 10,
      explanation: `<b>TurboModules and Fabric solve different problems.</b> <b>TurboModules</b> are the modern native-module architecture: they expose native functionality to JavaScript, support lazy loading, and use typed specifications with Codegen.

<b>Fabric</b> is the modern React Native renderer. It coordinates the React UI representation, Shadow Tree, layout, and native host components. Fabric's architecture also enables more direct/synchronous layout interactions when required.

Remember: <b>TurboModules = native functionality</b>; <b>Fabric = rendering React UI</b>. Both belong to the modern architecture but should not be treated as the same system.`,
      diagram: `<pre>New Architecture
├─ TurboModules → native functionality
│                 ↓
│                JSI
└─ Fabric → React UI rendering
              ↓
         Shadow Tree / host views</pre>`,
      codeExample: `<pre><code class="language-ts">type DeviceInfo = {
  model: string;
  osVersion: string;
};

// A real native library could expose a typed API like this.
declare function getDeviceInfo(): Promise&lt;DeviceInfo&gt;;</code></pre>`,
      keyTakeaways: ['TurboModules expose native functionality.', 'TurboModules support lazy loading and Codegen.', 'Fabric is the renderer.', 'Fabric and TurboModules solve different problems.'],
      commonMistakes: ['Calling Fabric the native-module system.', 'Calling TurboModules the renderer.', 'Thinking Codegen is a runtime operation.'],
      quiz: [{'question': 'What is the main difference?', 'answer': 'TurboModules handle native modules; Fabric handles React Native UI rendering.'}]
    },
    {
      id: "events-codegen-jank",
      title: "Native events, Codegen, and JS-thread performance",
      durationMinutes: 13,
      explanation: `<h3>Native events</h3> A tap begins as a platform touch interaction. React Native's event system turns that interaction into an event that can invoke a JavaScript callback such as <code>onPress</code>. It is not a browser DOM event.

<h3>Jank</h3> <b>Jank</b> means visible stuttering or delayed interaction. If JavaScript is blocked by expensive synchronous work, event processing and JS-side updates can be delayed.

<h3>Animations</h3> Animation systems can execute suitable animation work closer to the UI side of the application so animations are less dependent on a continuously available JS thread. <b>Reanimated</b> is the major example you will study on Day 7.

<h3>Codegen</h3> <b>Codegen</b> (code generation) turns typed specifications into generated native glue code during the build process. This creates a more structured JS/native contract for native modules and components.`,
      diagram: `<pre>Tap
 ↓
Native event system
 ↓
RN event handling
 ↓
JS callback (onPress)
 ↓
state/app logic
 ↓
React rendering

Codegen:
Typed spec → build → generated native glue</pre>`,
      codeExample: `<pre><code class="language-tsx">&lt;Pressable onPress={() =&gt; console.log("Pressed")}&gt;
  &lt;Text&gt;Press me&lt;/Text&gt;
&lt;/Pressable&gt;</code></pre>`,
      keyTakeaways: ['Native taps cross the RN event system before JS callbacks run.', 'JS-thread blocking can cause responsiveness problems.', 'UI-friendly animation execution can reduce JS-thread dependence.', 'Codegen generates native glue from typed specifications at build time.'],
      commonMistakes: ['Calling RN events DOM events.', 'Assuming async syntax prevents all jank.', 'Running huge synchronous computations during interactions.', 'Thinking Codegen runs for every API call.'],
      quiz: [{'question': 'What does Codegen do?', 'answer': 'It generates native glue code from typed specifications during the build process.'}]
    },
  ],
  finalQuiz: [{'question': 'What is the complete high-level path from setState to pixels?', 'answer': 'JS state change → React reconciler → Shadow Tree → Fabric renderer → host components → native view mutation → pixels.'}, {'question': 'What are the three execution areas?', 'answer': 'JS thread, UI thread, and native/background execution contexts.'}, {'question': 'Does bridgeless mean native communication disappeared?', 'answer': 'No. It means the old asynchronous Bridge is no longer the primary communication model.'}, {'question': 'TurboModules vs Fabric?', 'answer': 'TurboModules handle native modules; Fabric handles React Native UI rendering.'}, {'question': 'Why does blocking JS cause jank?', 'answer': 'It delays JS-side event handling, React work, and application updates.'}, {'question': 'What is Codegen?', 'answer': 'Build-time generation of native glue code from typed specifications.'}],
  project: {'name': 'Draw the React Native Rendering Pipeline', 'goal': 'Build a durable mental model of how a React Native update becomes native UI.', 'brief': 'Draw the full pipeline from setState to pixels and label the JS thread, UI thread, native/background execution, JSI, TurboModules, Fabric, Codegen, and native event flow.', 'steps': ['Draw the state-to-pixels pipeline from memory.', 'Label which work is associated with JS and native rendering.', 'Add the JS/UI/native execution contexts.', 'Add JSI, TurboModules, Fabric, and Codegen.', 'Draw a native tap becoming an onPress callback.', 'Write three examples of work that should not unnecessarily block JS.'], 'acceptance': ['You can reproduce the state-to-pixels pipeline.', 'You can explain JS versus UI execution.', 'You can explain bridgeless without saying communication disappeared.', 'You can distinguish TurboModules and Fabric.', 'You can explain Codegen.'], 'stretch': ['Annotate a Pressable counter from tap to updated text.', 'Explain why a long synchronous calculation can be visible.', 'Preview Day 7 Reanimated and identify why UI-friendly animation execution matters.']}
});
