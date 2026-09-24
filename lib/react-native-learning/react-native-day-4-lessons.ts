import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_4_LESSONS = normalizePastedLessonDay({
  "day": 4,
  "title": "Styling",
  "overview": "Today we're going to learn how styling works in React Native. If you've used CSS on the web before, some of this will feel familiar—but React Native has some important differences.\n\nBy the end of Day 4, you'll understand how to style components, organize styles, build themes, support dark mode, make layouts responsive, add shadows and fonts, and understand modern Android edge-to-edge layouts.",
  "totalMinutes": 45,
  "difficulty": "Beginner",
  "lessons": [
    {
      "id": "rn4-style-sheet",
      "title": "StyleSheet.create and React Native Styles",
      "durationMinutes": 6,
      "explanation": "Let's start with something you've probably already seen:\n\n<View style={{ backgroundColor: \"blue\" }}>\n<Text style={{ color: \"white\" }}>\nHello React Native\n</Text>\n</View>\n\nThe style prop controls how a React Native component looks.\n\nYou can use it to control things such as:\n\ncolors\n\nspacing\n\nsize\n\nposition\n\nborders\n\ntext appearance\n\nalignment\n\nshadows\n\nIf you're coming from web development, you might be thinking:\n\n\"Where is my CSS file?\"\n\nReact Native doesn't normally use a separate CSS file for its native components.\n\nInstead, styles are JavaScript objects.\n\nFor example:\n\nconst styles = {\ncontainer: {\nbackgroundColor: \"blue\",\npadding: 20,\n},\n};\n\nYou can then use that style:\n\n<View style={styles.container}> React Native also provides StyleSheet.create() to organize these styles.\n\nimport { StyleSheet } from \"react-native\";\n\nconst styles = StyleSheet.create({\ncontainer: {\nflex: 1,\nbackgroundColor: \"white\",\npadding: 20,\n},\n\ntitle: {\nfontSize: 24,\nfontWeight: \"bold\",\ncolor: \"black\",\n},\n});\n\nWhat does StyleSheet.create() actually do?\n\nThink of it as a way of saying:\n\n\"React Native, these are the styles my component uses. Please keep them organized for me.\"\n\nIt gives your styles names.\n\nInstead of doing this:\n\n<View\nstyle={{\nflex: 1,\nbackgroundColor: \"white\",\npadding: 20,\n}}\n\n>\n\nyou can write:\n\n<View style={styles.container}> That makes your JSX easier to read.\n\nIs StyleSheet.create() required?\n\nNo.\n\nThis is completely valid:\n\n<View style={{ padding: 20 }}>\n\nYou can use:\n\nconst styles = {\ncontainer: {\npadding: 20,\n},\n};\n\nYou can also use:\n\nconst styles = StyleSheet.create({\ncontainer: {\npadding: 20,\n},\n});\n\nAll are valid approaches.\n\nStyleSheet.create() is mainly useful for organization, readability, and reusable styles.\n\nOne important difference from CSS\n\nReact Native uses JavaScript-style property names.\n\nCSS:\n\nbackground-color: blue;\n\nReact Native:\n\nbackgroundColor: \"blue\"\n\nThis naming style is called camelCase (multiple words joined together, with each word after the first starting with a capital letter).\n\nSo you'll see:\n\nbackgroundColor\nfontSize\nborderRadius\nmarginTop\npaddingHorizontal\n\nrather than:\n\nbackground-color\nfont-size\nborder-radius\nmargin-top\npadding-horizontal",
      "diagram": "React Native Component\n│\n│ style={}\n▼\n┌──────────────┐\n│ Style │\n└──────┬───────┘\n│\n┌─────────┴─────────┐\n│ │\n▼ ▼\nInline style StyleSheet\n│ │\n│ styles.container\n│ │\n└─────────┬─────────┘\n▼\nFinal UI",
      "codeExample": {
        "title": "Code Example",
        "code": "import { View, Text, StyleSheet } from \"react-native\";\n\nexport default function App() {\nreturn (\n<View style={styles.container}>\n<Text style={styles.title}>\nWelcome to Day 4\n</Text>\n\n <Text style={styles.description}>\n   Today we're learning styling.\n </Text>\n</View>\n\n);\n}\n\nconst styles = StyleSheet.create({\ncontainer: {\nflex: 1,\nbackgroundColor: \"#F8FAFC\",\njustifyContent: \"center\",\nalignItems: \"center\",\npadding: 20,\n},\n\ntitle: {\nfontSize: 24,\nfontWeight: \"bold\",\ncolor: \"#111827\",\nmarginBottom: 10,\n},\n\ndescription: {\nfontSize: 16,\ncolor: \"#6B7280\",\ntextAlign: \"center\",\n},\n});",
        "details": "Here:\n\nstyle={styles.container}\n\nmeans:\n\n\"Take the container style from my styles object and apply it to this View.\"\n\nAnd:\n\nstyle={styles.title}\n\nmeans:\n\n\"Use the style called title for this Text.\"\n\nCombining styles\n\nYou can also combine styles using an array:\n\n<Text\nstyle={[\nstyles.title,\nisActive && styles.activeTitle,\n]}\n\n>\n\nCourse\n</Text>\n\nThis is particularly useful when a component has a base style and then needs an additional style depending on some condition."
      },
      "keyTakeaways": [
        "React Native uses the style prop for styling.\n\nStyles are JavaScript objects.\n\nStyleSheet.create() helps organize styles.\n\nStyleSheet.create() is not mandatory.\n\nReact Native uses camelCase style properties.\n\nStyles can be reused.\n\nMultiple styles can be combined with an array."
      ],
      "commonMistakes": [
        "❌ Using CSS property names\n{\nbackground-color: \"blue\"\n}\n\n✅ React Native\n{\nbackgroundColor: \"blue\"\n}\n\n❌ Treating style as a string\n<View style=\"styles.container\">\n\n✅\n<View style={styles.container}>\n\nThe {} means we're passing a JavaScript value."
      ],
      "quiz": [
        {
          "question": "Is StyleSheet.create() required?",
          "options": [
            "A. Yes",
            "B. No"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        },
        {
          "question": "Which property is correct?",
          "options": [
            "A. font-size",
            "B. font_size",
            "C. fontSize"
          ],
          "correctIndex": 2,
          "explanation": "Answer: C"
        },
        {
          "question": "What does styles.container represent?",
          "options": [
            "A. A CSS selector",
            "B. A named style object",
            "C. A React component"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn4-no-cascade",
      "title": "No CSS Cascade, Inheritance, or Pseudo-Classes",
      "durationMinutes": 6,
      "explanation": "This is one of the biggest differences between React Native and traditional web development.\n\nIf you've worked with HTML and CSS, you've probably seen something like:\n\n.container {\ncolor: blue;\n}\n\n.container .title {\nfont-size: 24px;\n}\n\nCSS has a system called the cascade (the process by which CSS rules are combined and determine the final style).\n\nReact Native doesn't work this way.\n\nThere isn't a browser sitting between your code and the UI deciding which CSS selector wins.\n\nInstead, React Native generally expects you to explicitly tell each component which styles it should use.\n\nFor example:\n\n<View style={styles.card}> <Text style={styles.title}> Hello </Text> </View> The Text doesn't automatically receive styles.title because it happens to be inside a View.\n\nYou explicitly give it:\n\nstyle={styles.title}\n\nWhat about inheritance?\n\nInheritance means that some properties from a parent automatically affect its children.\n\nOn the web, certain CSS properties can be inherited.\n\nFor example, text color can often flow from a parent element to its children.\n\nReact Native has much more limited inheritance.\n\nDon't approach React Native with the assumption:\n\n\"If I style the parent, everything inside it will automatically get that style.\"\n\nInstead, think:\n\n\"Each component gets the styles I explicitly give it.\"\n\nWhat are pseudo-classes?\n\nA pseudo-class is a CSS feature that lets you style an element based on a state.\n\nFor example, on the web:\n\nbutton:hover {\nbackground: blue;\n}\n\n:hover means:\n\n\"Apply this style while the mouse is hovering over the button.\"\n\nReact Native isn't running inside a traditional browser, so CSS pseudo-classes aren't used in the same way.\n\nInstead, React Native components provide their own interaction APIs.\n\nFor example, Pressable gives you a pressed value:\n\n<Pressable\nstyle={({ pressed }) => [\nstyles.button,\npressed && styles.buttonPressed,\n]}\n\n>\n\n<Text>Press me</Text>\n</Pressable>\n\nWhen the user presses the button:\n\npressed = true\n\nWhen they stop:\n\npressed = false\n\nYou can use that information to change the appearance.",
      "diagram": "Traditional CSS\n\nParent\n│\n├── Cascade\n├── Inheritance\n└── Pseudo-classes\n│\n▼\nChildren\n\n        React Native\n\nParent\n│\n└── Explicit styles\n│\n▼\nComponents",
      "codeExample": {
        "title": "Code Example",
        "code": "import { Pressable, Text, StyleSheet } from \"react-native\";\n\nexport default function Button() {\nreturn (\n<Pressable\nstyle={({ pressed }) => [\nstyles.button,\npressed && styles.buttonPressed,\n]}\n>\n<Text style={styles.text}>\nPress Me\n</Text>\n</Pressable>\n);\n}\n\nconst styles = StyleSheet.create({\nbutton: {\nbackgroundColor: \"#2563EB\",\npadding: 16,\nborderRadius: 10,\n},\n\nbuttonPressed: {\nbackgroundColor: \"#1D4ED8\",\n},\n\ntext: {\ncolor: \"white\",\nfontWeight: \"bold\",\n},\n});",
        "details": "The important part is:\n\npressed && styles.buttonPressed\n\nThis means:\n\n\"If the button is currently pressed, apply buttonPressed.\""
      },
      "keyTakeaways": [
        "React Native doesn't have the traditional CSS cascade.\n\nDon't expect CSS selectors to control your components.\n\nInheritance is much more limited.\n\nStyles are generally applied explicitly.\n\nCSS pseudo-classes aren't used like they are on the web.\n\nComponents such as Pressable provide interaction state."
      ],
      "commonMistakes": [
        "❌ Thinking this works like web CSS\n.card .title\n\nReact Native doesn't use CSS selectors like that.\n\n❌ Expecting parent styling to automatically style everything\n<View style={styles.card}>\n<Text>\nHello\n</Text>\n</View>\n\nDon't assume the Text automatically receives every style from the View.\n\n❌ Trying to use :hover\nbutton:hover\n\nFor React Native interaction, use components such as Pressable."
      ],
      "quiz": [
        {
          "question": "Which approach is commonly used for a pressed button state?",
          "options": [
            "A. :hover",
            "B. :active",
            "C. Pressable's pressed value",
            "D. CSS selectors"
          ],
          "correctIndex": 2,
          "explanation": "Answer: C"
        }
      ]
    },
    {
      "id": "rn4-styling-options",
      "title": "Styling Approaches",
      "durationMinutes": 7,
      "explanation": "React Native gives you several ways to style your application.\n\nThe four approaches you should understand are:\n\nInline styles\n\nStyleSheet\n\nstyled-components\n\nNativeWind\n\nLet's look at each one.\n\n1. Inline styles\n   <View\n   style={{\n   padding: 20,\n   backgroundColor: \"white\",\n   }}\n   />\n\nVery simple.\n\nIt's useful for small or dynamic styles.\n\n2. StyleSheet\n   const styles = StyleSheet.create({\n   container: {\n   padding: 20,\n   backgroundColor: \"white\",\n   },\n   });\n\nThen:\n\n<View style={styles.container} /> This is the traditional React Native approach.\n\n3. styled-components\n\nstyled-components is a third-party styling library.\n\nIt lets you create styled components instead of putting style objects directly into your JSX.\n\nConceptually:\n\nconst Button = styled.Pressable`  padding: 16px;   border-radius: 10px;`;\n\nThe library creates a component with those styles.\n\n4. NativeWind\n\nNativeWind brings a Tailwind-like utility approach to React Native.\n\nFor example:\n\n<View className=\"flex-1 bg-white p-5\"> Instead of writing:\n\nstyle={{\nflex: 1,\nbackgroundColor: \"white\",\npadding: 20,\n}}\n\nyou use utility classes.\n\nA utility class is a small class representing one specific styling idea, such as padding, color, font size, or layout.\n\nFor this learning track, NativeWind is our default styling approach, but you still need to understand the underlying React Native styling system.\n\nWhy?\n\nBecause when something doesn't work, you need to understand what the utility class is actually trying to do.",
      "diagram": "Styling\n│\n┌────────────┼────────────┐\n│ │ │\n▼ ▼ ▼\nInline StyleSheet Libraries\n│\n┌─────┴─────┐\n▼ ▼\nstyled-components NativeWind",
      "codeExample": {
        "title": "Code Example",
        "code": "Inline\n<View\nstyle={{\npadding: 20,\nbackgroundColor: \"blue\",\n}}\n/>\n\nStyleSheet\nconst styles = StyleSheet.create({\ncontainer: {\npadding: 20,\nbackgroundColor: \"blue\",\n},\n});\n\n<View style={styles.container} /> NativeWind\n<View className=\"p-5 bg-blue-500\" />",
        "details": "The goal isn't to memorize all three immediately.\n\nThe important thing is understanding that they're different ways of expressing the same fundamental idea:\n\n\"This component should have these visual properties.\""
      },
      "keyTakeaways": [
        "Inline styles are simple and useful.\n\nStyleSheet organizes styles.\n\nstyled-components is a third-party styling approach.\n\nNativeWind provides Tailwind-style utilities for React Native.\n\nThis track uses NativeWind as the default.\n\nUnderstanding React Native styles is still important even when using NativeWind."
      ],
      "commonMistakes": [
        "Don't assume:\n\n\"NativeWind means I don't need to understand styling.\"\n\nQuite the opposite.\n\nIf you understand:\n\npadding\nmargin\nflex\nwidth\nheight\ncolor\nfontSize\n\nthen NativeWind becomes much easier to learn."
      ],
      "quiz": [
        {
          "question": "Which styling approach is the default for this learning track?",
          "options": [
            "A. CSS Modules",
            "B. NativeWind",
            "C. Sass",
            "D. Styled JSX"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn4-design-tokens",
      "title": "Design Tokens, Themes, and Dark Mode",
      "durationMinutes": 7,
      "explanation": "Imagine your application has 30 screens.\n\nYou use this color everywhere:\n\n#2563EB\n\nYou write it 100 times.\n\nThen your designer says:\n\n\"Let's change our primary blue.\"\n\nNow you have a problem.\n\nYou have to find every place where you used that color.\n\nThis is where design tokens become useful.\n\nA design token is a named value representing a design decision.\n\nInstead of:\n\ncolor: \"#2563EB\"\n\nyou can have:\n\ncolor: theme.colors.primary\n\nNow the name tells you what the color means.\n\nExample tokens\nconst theme = {\ncolors: {\nprimary: \"#2563EB\",\nbackground: \"#FFFFFF\",\ntext: \"#111827\",\nmutedText: \"#6B7280\",\n},\n\nspacing: {\nsmall: 8,\nmedium: 16,\nlarge: 24,\n},\n\nradius: {\nsmall: 8,\nlarge: 16,\n},\n};\n\nNow your application has a consistent design language.\n\nWhat is a theme?\n\nA theme is a collection of design values used by your application.\n\nIt can contain:\n\nColors\nSpacing\nTypography\nBorder radius\nShadows\n\nAnd you can have multiple themes.\n\nFor example:\n\nLight Theme\nDark Theme\n\nDark mode\n\nA dark theme might look like:\n\nconst darkTheme = {\ncolors: {\nprimary: \"#60A5FA\",\nbackground: \"#111827\",\ntext: \"#F9FAFB\",\nmutedText: \"#9CA3AF\",\n},\n};\n\nNow the components don't need to know whether the application is light or dark.\n\nThey simply ask:\n\ntheme.colors.background\n\nThe theme decides what that value means.\n\nuseColorScheme\n\nReact Native provides:\n\nuseColorScheme()\n\nThis hook tells you the device's current color scheme.\n\nFor example:\n\nconst colorScheme = useColorScheme();\n\nIt can give you:\n\n\"light\"\n\nor:\n\n\"dark\"\n\nThen you can select the correct theme.\n\nconst theme =\ncolorScheme === \"dark\"\n? darkTheme\n: lightTheme;",
      "diagram": "Device\n│\n▼\nuseColorScheme()\n│\n┌────────┴────────┐\n▼ ▼\n\"light\" \"dark\"\n│ │\n▼ ▼\nLight Theme Dark Theme\n│ │\n└────────┬────────┘\n▼\nComponents\n│\n▼\nUI",
      "codeExample": {
        "title": "Code Example",
        "code": "import { useColorScheme } from \"react-native\";\n\nconst lightTheme = {\ncolors: {\nbackground: \"#FFFFFF\",\ntext: \"#111827\",\nprimary: \"#2563EB\",\n},\n};\n\nconst darkTheme = {\ncolors: {\nbackground: \"#111827\",\ntext: \"#F9FAFB\",\nprimary: \"#60A5FA\",\n},\n};\n\nexport default function App() {\nconst colorScheme = useColorScheme();\n\nconst theme =\ncolorScheme === \"dark\"\n? darkTheme\n: lightTheme;\n\nreturn (\n<View\nstyle={{\nbackgroundColor: theme.colors.background,\n}}\n>\n<Text\nstyle={{\ncolor: theme.colors.text,\n}}\n>\nHello!\n</Text>\n</View>\n);\n}",
        "details": "The important idea is:\n\nComponent\n↓\nTheme\n↓\nCorrect color\n\nThe component doesn't need to say:\n\n\"If dark mode, use black.\"\n\nIt simply says:\n\n\"Give me the theme's background color.\"\n\nThat's much easier to scale."
      },
      "keyTakeaways": [
        "Design tokens give names to design values.\n\nA theme groups those values together.\n\nYou can have multiple themes.\n\nuseColorScheme() can detect the system's light/dark preference.\n\nComponents should consume theme values instead of hardcoding colors everywhere."
      ],
      "commonMistakes": [
        "❌ Hardcoding colors everywhere\nbackgroundColor: \"#FFFFFF\"\n\nin dozens of files.\n\nBetter\nbackgroundColor: theme.colors.background\n\n❌ Creating different meanings for the same token\n\nDon't use:\n\nprimary\nmainBlue\nblueButton\nimportantBlue\n\nfor the exact same design value.\n\nKeep your naming consistent."
      ],
      "quiz": [
        {
          "question": "What is a design token?",
          "options": [
            "A. A React component",
            "B. A named design value",
            "C. A navigation screen",
            "D. A database record"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn4-responsive",
      "title": "Responsive Design Without Media Queries",
      "durationMinutes": 6,
      "explanation": "On the web, you've probably seen media queries:\n\n@media (max-width: 600px) {\n...\n}\n\nReact Native doesn't use traditional CSS media queries.\n\nSo how do we make our app work on:\n\nsmall phones\n\nlarge phones\n\ntablets\n\nlandscape orientation\n\ndifferent screen sizes?\n\nWe can use JavaScript and React Native's layout APIs.\n\nOne simple approach is percentage-based sizing.\n\nInstead of:\n\nwidth: 350\n\nyou can use:\n\nwidth: \"90%\"\n\nThis means:\n\n\"Make this component 90% of the available width.\"\n\nuseWindowDimensions\n\nReact Native also provides:\n\nuseWindowDimensions()\n\nIt gives you information about the available window.\n\nFor example:\n\nconst { width, height } = useWindowDimensions();\n\nNow you can use the width to make layout decisions.\n\nconst isTablet = width >= 768;\n\nThen:\n\n<View\nstyle={{\nflexDirection: isTablet ? \"row\" : \"column\",\n}}\n\n>\n\nOn a smaller screen:\n\nColumn\n↓\nCard\n↓\nCard\n↓\nCard\n\nOn a larger screen:\n\nCard Card Card\n\nWhat is a breakpoint?\n\nA breakpoint is a width where you decide your layout should change.\n\nFor example:\n\n0 ───────── 767 ───────── 768 ─────────→\nMobile Large\n\nAt 768, you might switch from a column layout to a row layout.\n\nYou can put this logic into a reusable hook.",
      "diagram": "Screen Width\n│\n┌───────────┴───────────┐\n▼ ▼\nSmaller Larger\n│ │\n▼ ▼\nColumn Row\n│ │\nCard Card Card\nCard\nCard",
      "codeExample": {
        "title": "Code Example",
        "code": "import { useWindowDimensions, View } from \"react-native\";\n\nexport default function CourseLayout() {\nconst { width } = useWindowDimensions();\n\nconst isLargeScreen = width >= 768;\n\nreturn (\n<View\nstyle={{\nwidth: \"90%\",\nalignSelf: \"center\",\nflexDirection: isLargeScreen\n? \"row\"\n: \"column\",\ngap: 16,\n}}\n>\n{/* Course cards */}\n</View>\n);\n}",
        "details": "Notice we're not using:\n\n@media\n\nInstead, we're using JavaScript:\n\nconst isLargeScreen = width >= 768;"
      },
      "keyTakeaways": [
        "React Native doesn't use traditional CSS media queries.\n\nPercentage widths are useful for responsive layouts.\n\nuseWindowDimensions() gives you current dimensions.\n\nBreakpoints can be implemented with JavaScript.\n\nResponsive design is about adapting the layout, not simply shrinking everything."
      ],
      "commonMistakes": [
        "Don't create 15 breakpoints just because you can.\n\nStart with the actual layout requirements.\n\nFor example:\n\nSmall → column\nLarge → row\n\nmay be enough."
      ],
      "quiz": [
        {
          "question": "Which hook can provide the current window width?",
          "options": [
            "A. useScreenSize()",
            "B. useWindowDimensions()",
            "C. useViewport()",
            "D. useDeviceWidth()"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn4-shadows",
      "title": "Shadows and Elevation",
      "durationMinutes": 5,
      "explanation": "Shadows are one of those things that look simple but behave differently between platforms.\n\nIf you come from web development, you may know:\n\nbox-shadow\n\nReact Native doesn't simply use that property.\n\nInstead, iOS and Android have different shadow systems.\n\nOn iOS, you'll commonly see:\n\nshadowColor\nshadowOffset\nshadowOpacity\nshadowRadius\n\nAndroid commonly uses:\n\nelevation\n\nWhy is this different?\n\nReact Native is creating native UI.\n\nThat means it has to work with the actual platform underneath:\n\nReact Native\n│\n├── iOS → native iOS rendering\n│\n└── Android → native Android rendering\n\nThe platforms don't expose exactly the same shadow system.",
      "diagram": "Card\n┌──────────────┐\n│ │\n│ Content │\n│ │\n└──────────────┘\n░░░░░░░░░\nShadow\n\n  iOS                 Android\n   │                      │\n   ▼                      ▼\n\nshadowColor elevation\nshadowOffset\nshadowOpacity\nshadowRadius",
      "codeExample": {
        "title": "Code Example",
        "code": "const styles = StyleSheet.create({\ncard: {\nbackgroundColor: \"white\",\nborderRadius: 12,\n\n// iOS\nshadowColor: \"#000\",\nshadowOffset: {\n width: 0,\n height: 4,\n},\nshadowOpacity: 0.15,\nshadowRadius: 8,\n\n// Android\nelevation: 5,\n\n},\n});",
        "details": "You can see that we're defining both.\n\nThis gives us a reasonable cross-platform starting point."
      },
      "keyTakeaways": [
        "Shadows differ between iOS and Android.\n\niOS uses shadow properties.\n\nAndroid commonly uses elevation.\n\nThe same values won't necessarily look identical on both platforms.\n\nTest shadows on actual target platforms."
      ],
      "commonMistakes": [
        "❌ Using only iOS shadow properties\n\nYour Android card might appear to have no visible shadow.\n\n❌ Assuming elevation: 5 equals an iOS shadow of exactly the same visual strength.\n\nIt doesn't.\n\nThe rendering systems are different."
      ],
      "quiz": [
        {
          "question": "Which property is especially important for Android shadows?",
          "options": [
            "A. shadowRadius",
            "B. shadowColor",
            "C. elevation",
            "D. boxShadow"
          ],
          "correctIndex": 2,
          "explanation": "Answer: C"
        }
      ]
    },
    {
      "id": "rn4-fonts",
      "title": "Custom Fonts with expo-font",
      "durationMinutes": 5,
      "explanation": "Your app doesn't have to use only the default system fonts.\n\nYou can include a custom font.\n\nFor example:\n\nInter\nRoboto\nPoppins\nOpen Sans\n\nA custom font is a font file that you include with your application rather than relying only on the device's default font.\n\nIn Expo applications, expo-font makes loading custom fonts much easier.\n\nThe important thing to understand is that fonts have to be loaded.\n\nThat loading process can take some time.\n\nThis means the application can have a situation like this:\n\nApp starts\n↓\nFont isn't ready yet\n↓\nFont loads\n↓\nUI uses custom font\n\nThat temporary period is important.\n\nFlash of unstyled text\n\nYou may hear the term FOUT (Flash of Unstyled Text).\n\nIt describes a situation where text appears using one font and then suddenly changes when the intended font becomes available.\n\nFor example:\n\nApplication starts\n\nHello World\n(system font)\n\n```\n   ↓\n```\n\nHello World\n(custom font)\n\nThe user sees the text change.\n\nThat's why font loading should be handled intentionally.",
      "diagram": "App Starts\n│\n▼\nLoad Custom Font\n│\n┌──────┴──────┐\n▼ ▼\nLoading Loaded\n│ │\n▼ ▼\nLoading UI Main UI\n│\n▼\nCustom Font",
      "codeExample": {
        "title": "With Expo and expo-font, you might use:",
        "code": "import { useFonts } from \"expo-font\";\n\nexport default function App() {\nconst [fontsLoaded] = useFonts({\nInter: require(\"./assets/fonts/Inter-Regular.ttf\"),\n});\n\nif (!fontsLoaded) {\nreturn null;\n}\n\nreturn (\n<Text\nstyle={{\nfontFamily: \"Inter\",\nfontSize: 20,\n}}\n>\nHello!\n</Text>\n);\n}",
        "details": "The important part is:\n\nconst [fontsLoaded] = useFonts(...)\n\nThis gives you information about whether the fonts have finished loading.\n\nThen:\n\nif (!fontsLoaded) {\nreturn null;\n}\n\nmeans:\n\n\"Don't render the main UI yet.\"\n\nA production application may use a proper loading or splash-screen strategy rather than simply returning null."
      },
      "keyTakeaways": [
        "Custom fonts need to be loaded.\n\nexpo-font helps load fonts in Expo applications.\n\nFont loading is asynchronous (it finishes later rather than immediately).\n\nShowing text before the intended font is ready can cause a visual flash.\n\nYour application should intentionally handle the loading period."
      ],
      "commonMistakes": [
        "Using the wrong font family name.\n\nForgetting to include the font file.\n\nAssuming the custom font is immediately available.\n\nIgnoring the initial font-loading experience."
      ],
      "quiz": [
        {
          "question": "What does FOUT mean?",
          "options": [
            "A. Fast Output UI Thread",
            "B. Flash of Unstyled Text",
            "C. Font Upload Operation Tool",
            "D. Flexible Output Utility Type"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn4-edge",
      "title": "Edge-to-Edge Layouts on Android",
      "durationMinutes": 3,
      "explanation": "This is a modern Android layout topic that's particularly important when following newer React Native versions.\n\nTraditionally, developers often thought of the screen like this:\n\n┌────────────────────────┐\n│ Status Bar │\n├────────────────────────┤\n│ │\n│ Your Application │\n│ │\n│ │\n├────────────────────────┤\n│ Navigation Bar │\n└────────────────────────┘\n\nThe application content appeared between system areas.\n\nWith edge-to-edge layouts, application content can extend into areas around the system UI.\n\nThink of it like this:\n\n┌────────────────────────┐\n│ Your content can reach │\n│ toward the system edge │\n│ │\n│ Your App │\n│ │\n│ │\n│ Your content can reach │\n│ toward the bottom edge │\n└────────────────────────┘\n\nThis gives applications more control over modern full-screen designs, but it also means you have to think carefully about insets.\n\nAn inset is the amount of space you need to keep between your content and system-controlled areas such as the status bar or navigation area.\n\nFor example, imagine a button at the bottom of the screen.\n\nWithout considering the bottom inset:\n\n┌──────────────────┐\n│ │\n│ │\n│ Button │\n│──────────────────│\n│ Navigation area │\n└──────────────────┘\n\nThe button could end up too close to or underneath system UI.\n\nWith proper inset handling:\n\n┌──────────────────┐\n│ │\n│ │\n│ Button │\n│ │\n│ safe spacing │\n│──────────────────│\n│ Navigation area │\n└──────────────────┘\n\nThis is one reason safe-area and inset handling matters.\n\nThe exact behavior depends on your React Native version, Android version, and app configuration. Edge-to-edge behavior has been an active area of change around recent React Native releases, including the React Native 0.86 era, so avoid blindly copying older Android layout tutorials.",
      "diagram": "Traditional Layout\n\n┌──────────────────────────┐\n│ System UI │\n├──────────────────────────┤\n│ │\n│ App Content │\n│ │\n├──────────────────────────┤\n│ System UI │\n└──────────────────────────┘\n\n        Edge-to-Edge\n\n┌──────────────────────────┐\n│ App content can extend │\n│ toward system areas │\n│ │\n│ App Content │\n│ │\n│ App content can extend │\n│ toward bottom edge │\n└──────────────────────────┘",
      "codeExample": {
        "title": "Code Example",
        "code": "",
        "details": "The exact implementation depends on your React Native/Expo setup, but conceptually you need to think about the system UI and safe areas when building a screen.\n\nFor example, a screen with content near the bottom should account for the bottom inset rather than assuming:\n\n\"the bottom of my View = safe place for my button\"\n\nModern applications commonly use safe-area/inset-aware components or APIs to keep important content out of system UI regions.\n\nThe key lesson for Day 4 is not to memorize one piece of code.\n\nIt's to understand why edge-to-edge changes the way you think about screen boundaries."
      },
      "keyTakeaways": [
        "Edge-to-edge allows content to extend toward the physical edges of the screen.\n\nSystem UI can occupy areas around your application.\n\nInsets tell you how much space you need to account for.\n\nBottom buttons, headers, and status-bar areas need particular attention.\n\nAndroid behavior is evolving, so always consider your React Native version."
      ],
      "commonMistakes": [
        "❌ Assuming the top of your View is always below the status bar\n\nModern edge-to-edge layouts can change this assumption.\n\n❌ Putting a button directly against the bottom edge\n\nThe system navigation area may overlap or visually interfere with it.\n\n❌ Following an old tutorial without checking versions\n\nAndroid and React Native behavior changes over time."
      ],
      "quiz": [
        {
          "question": "What is an inset?",
          "options": [
            "A. A React component",
            "B. The space needed around content to account for system UI",
            "C. A font type",
            "D. A shadow property"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    }
  ],
  "finalQuiz": [],
  "project": {
    "name": "Build a Persistent Theme Toggle",
    "goal": "You've now covered all eight styling concepts.\n\nBefore moving to Day 5, try this challenge:",
    "brief": "Create a small app with:\n\n┌──────────────────────────┐\n│ My Learning App │\n├──────────────────────────┤\n│ │\n│ Welcome back! │\n│ │\n│ Theme │\n│ │\n│ ○ Light │\n│ ● Dark │\n│ │\n│ [ Continue Learning ] │\n│ │\n└──────────────────────────┘",
    "steps": [
      "Support Light and Dark themes.",
      "Change the colors of every screen.",
      "Store the user's selection so it survives an app restart.",
      "Load the saved theme when the app starts.",
      "Avoid completely remounting the application just to change themes.",
      "Use theme values instead of hardcoding colors throughout your screens."
    ],
    "acceptance": [
      "The architecture you're aiming for is:\n\n```\n              App\n               │\n               ▼\n         Theme Provider\n               │\n        ┌──────┴──────┐\n        ▼             ▼\n   Light Theme    Dark Theme\n        │             │\n        └──────┬──────┘\n               ▼\n         All Screens\n               │\n     ┌─────────┼─────────┐\n     ▼         ▼         ▼\n   Home      Courses   Settings\n```\n\nThe big idea from Day 4 is:\n\nDon't think of styling as \"making a button look pretty.\" Think of styling as building a consistent visual system that every screen in your application can understand and reuse."
    ]
  }
});
