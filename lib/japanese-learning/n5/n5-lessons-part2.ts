import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkLesson as mk } from "@/lib/japanese-learning/n5/n5-lesson-factory";

/** Days 8–30 — Minna I Lessons 8–25 then JLPT N5 consolidation days. */
export const JP_N5_PART2: N5LessonSpec[] = [
  mk({
    minnaLesson: 8,
    dialogue: [
      {
        ja: "このパソコンはあたらしいです。そのバッグはきれいです。",
        reading: "Kono pasokon wa atarashii desu. Sono baggu wa kirei desu.",
        en: "This PC is new. That bag is pretty/clean.",
      },
    ],
    particles: [
      { particle: "い-adj / な-adj + です", note: "Predicate adjectives before noun modification uses な／い rules." },
      { particle: "は", note: "Contrasts topics when comparing items." },
    ],
    grammarBullets: [
      { en: "い-adjectives end in い (たかい／やすい／おおきい) and go straight before a noun — no change needed.", np: "い-adjective हरू い मा अन्त्य हुन्छन् (たかい／やすい／おおきい) र नामको अगाडि जस्ताको तस्तै जान्छन् — फेरबदल चाहिँदैन।", jp: "い形容詞は「い」で終わり（たかい／やすい／おおきい）、名詞の前にそのまま置きます。" },
      { en: "な-adjectives don't naturally end in い (しずか／げんき／ハンサム) — add な before a noun: しずかな まち.", np: "な-adjective हरू स्वाभाविक रूपमा い मा अन्त्य हुँदैनन् (しずか／げんき／ハンサム) — नामको अगाडि な थप्नुपर्छ: しずかな まち。", jp: "な形容詞は本来「い」で終わりません（しずか／げんき／ハンサム）。名詞の前には「な」を入れます：しずかな まち。" },
      { en: "Exceptions: きれい, きらい, and ハンサム look like い-adjectives (end in い) but are actually な-adjectives.", np: "अपवाद: きれい, きらい, र ハンサム हेर्दा い-adjective जस्तो देखिन्छ (い मा अन्त्य हुन्छ) तर वास्तवमा な-adjective हुन्।", jp: "例外：きれい・きらい・ハンサムは「い」で終わるのでい形容詞に見えますが、実はな形容詞です。" },
      { en: "Before です both types attach directly — い-adj: たかいです; な-adj: しずかです (no な before です).", np: "です अगाडि दुबै प्रकार सिधै जोडिन्छन् — い-adj: たかいです; な-adj: しずかです (です अगाडि な राख्दैन)।", jp: "「です」の前ではどちらもそのまま接続します——い形容詞：たかいです／な形容詞：しずかです（「です」の前に「な」は不要）。" },
      { en: "い-adjective negative: drop い, add くないです — たかい → たかくないです.", np: "い-adjective को negative: い हटाएर くないです थप्ने — たかい → たかくないです。", jp: "い形容詞の否定形：「い」を取って「くないです」——たかい→たかくないです。" },
      { en: "な-adjective negative: add じゃないです／じゃありません — しずかです → しずかじゃないです.", np: "な-adjective को negative: じゃないです／じゃありません थप्ने — しずかです → しずかじゃないです。", jp: "な形容詞の否定形：「じゃないです／じゃありません」を付ける——しずかです→しずかじゃないです。" },
      { en: "い-adjective past: drop い, add かったです — たかい → たかかったです.", np: "い-adjective को past: い हटाएर かったです थप्ने — たかい → たかかったです。", jp: "い形容詞の過去形：「い」を取って「かったです」——たかい→たかかったです。" },
      { en: "い-adjective past negative: drop い, add くなかったです — たかい → たかくなかったです.", np: "い-adjective को past negative: い हटाएर くなかったです थप्ने — たかい → たかくなかったです。", jp: "い形容詞の過去否定形：「い」を取って「くなかったです」——たかい→たかくなかったです。" },
      { en: "な-adjective past: でした — しずかです → しずかでした.", np: "な-adjective को past: でした — しずかです → しずかでした。", jp: "な形容詞の過去形：「でした」——しずかです→しずかでした。" },
      { en: "な-adjective past negative: じゃなかったです／じゃありませんでした — しずかです → しずかじゃなかったです.", np: "な-adjective को past negative: じゃなかったです／じゃありませんでした — しずかです → しずかじゃなかったです。", jp: "な形容詞の過去否定形：「じゃなかったです／じゃありませんでした」——しずかです→しずかじゃなかったです。" },
      { en: "Joining two positive qualities: い-adj drops い and adds くて; な-adj adds で — これはたかくて、あれはやすいです。", np: "दुई सकारात्मक गुण जोड्दा: い-adj को い हटाएर くて थप्ने; な-adj मा で थप्ने — これはたかくて、あれはやすいです。", jp: "2つの肯定的な性質をつなぐとき：い形容詞は「い」を取って「くて」、な形容詞は「で」を付けます——これはたかくて、あれはやすいです。" },
      { en: "が connects a contrasting pair, like 'but' — たかいですが、おいしいです。", np: "が ले विपरीत भाव जोड्छ, 'तर' जस्तै — たかいですが、おいしいです。", jp: "「が」は「たかいですが、おいしいです」のように対照的な内容をつなぎます（＝しかし）。" },
    ],
    grammarTable: {
      caption: { en: "い-adjective vs な-adjective conjugation", np: "い-adjective र な-adjective को रूपान्तरण", jp: "い形容詞・な形容詞の活用" },
      headers: [
        { en: "Form", np: "रूप", jp: "形" },
        { en: "い-adjective (たかい)", np: "い-adjective (たかい)", jp: "い形容詞（たかい）" },
        { en: "な-adjective (しずか)", np: "な-adjective (しずか)", jp: "な形容詞（しずか）" },
      ],
      rows: [
        [{ en: "Present affirmative", np: "वर्तमान सकारात्मक", jp: "現在肯定" }, "たかいです", "しずかです"],
        [{ en: "Present negative", np: "वर्तमान नकारात्मक", jp: "現在否定" }, "たかくないです", "しずかじゃないです"],
        [{ en: "Past affirmative", np: "भूतकाल सकारात्मक", jp: "過去肯定" }, "たかかったです", "しずかでした"],
        [{ en: "Past negative", np: "भूतकाल नकारात्मक", jp: "過去否定" }, "たかくなかったです", "しずかじゃなかったです"],
        [{ en: "Connective (and/te-form)", np: "जोड्ने रूप (て／で)", jp: "接続形（て／で）" }, "たかくて", "しずかで"],
        [{ en: "+ Noun", np: "+ Noun", jp: "＋名詞" }, "たかい まち", "しずかな まち"],
      ],
    },
    mcqs: [
      {
        question: "Beautiful town:",
        choices: ["しずかです。", "しずかなまちです。", "しずかだまちです。", "しずかいまちです。"],
        correctIndex: 1,
      },
      {
        question: "Negative of あつい (informal stem route preview):",
        choices: ["あつくない", "あついない", "あつだない", "あつじゃない"],
        correctIndex: 0,
      },
    ],
    listening: {
      scenario: "Describe classroom objects with size and condition.",
      instruction: "Pick which item matches each adjective cue.",
      keyPhrases: ["たかい", "やすい", "おおきい", "ちいさい"],
    },
  }),
  mk({
    minnaLesson: 9,
    dialogue: [
      {
        ja: "サッカーがすきです。ピアノがじょうずです。えいごがわかります。",
        reading: "Sakkā ga suki desu. Piano ga jōzu desu. Eigo ga wakarimasu.",
        en: "I like soccer. I’m good at piano. I understand English.",
      },
    ],
    particles: [
      { particle: "が", note: "Marks subject of ability/preference predicates." },
      { particle: "から", note: "Reason clause before result (because)." },
    ],
    grammarBullets: [
      "すき／きらい／じょうず／へた／わかる prefer が over は for neutral statements.",
      "Reason ので / から patterns preview N5 exam frequency.",
    ],
    mcqs: [
      {
        question: "Natural: “I dislike crowded trains.”",
        choices: [
          "こんでるでんしゃがきらいです。",
          "こんでるでんしゃはきらいです。",
          "こんでるでんしゃをきらいです。",
          "こんでるでんしゃにきらいです。",
        ],
        correctIndex: 0,
      },
      {
        question: "わかります takes:",
        choices: ["を topic", "が subject matter", "へ direction", "で means"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Friends discuss hobbies and weak subjects.",
      instruction: "Who likes what — track noun + がすき.",
      keyPhrases: ["すきです", "じょうず", "へた"],
    },
  }),
  mk({
    minnaLesson: 10,
    dialogue: [
      {
        ja: "こどもがにわにいます。テーブルのうえにコップがあります。",
        reading: "Kodomo ga niwa ni imasu. Tēburu no ue ni koppu ga arimasu.",
        en: "Children are in the yard. There’s a cup on the table.",
      },
    ],
    particles: [
      { particle: "が", note: "Introduces existence subjects with います／あります." },
      { particle: "に", note: "Location of animate/inanimate existence." },
    ],
    grammarBullets: [
      "います animate / あります inanimate — exam favourite distinction.",
      "Question forms: だれがいますか · なにがありますか.",
    ],
    mcqs: [
      {
        question: "Dog in park (animate):",
        choices: [
          "こうえんにいぬがあります。",
          "こうえんにいぬがいます。",
          "こうえんでいぬがいます。",
          "こうえんへいぬがいます。",
        ],
        correctIndex: 1,
      },
      {
        question: "Thing on shelf exists:",
        choices: ["います", "あります", "です", "します"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Describe office layout — people vs objects.",
      instruction: "Note counters later week; today focus on に／が pairs.",
      keyPhrases: ["います", "あります", "に"],
    },
  }),
  mk({
    minnaLesson: 11,
    dialogue: [
      {
        ja: "ケーキをひとつください。ビールをさんびんのみました。",
        reading: "Kēki o hitotsu kudasai. Bīru o sanbon nomimashita.",
        en: "One cake, please. I drank three bottles of beer.",
      },
    ],
    particles: [
      { particle: "を", note: "Objects counted take を before quantity phrases." },
      { particle: "だけ／しか", note: "Only / nothing-but nuance appears in drills." },
    ],
    grammarBullets: [
      "Native numbers vs counters (ひとつ／ふたつ vs 〜えん counters money).",
      "Duration / frequency patterns preview for listening.",
    ],
    mcqs: [
      {
        question: "Polite request pattern:",
        choices: ["ケーキがひとつください。", "ケーキをひとつください。", "ケーキでひとつください。", "ケーキにひとつください。"],
        correctIndex: 1,
      },
      {
        question: "Counter for long thin bottles:",
        choices: ["まい", "ほん／ぽん／ぼん", "ひき", "だい"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Fast shopping order with quantities.",
      instruction: "Write digits you hear + classifier sound.",
      keyPhrases: ["ひとつ", "ふたつ", "〜ほん"],
    },
  }),
  mk({
    minnaLesson: 12,
    dialogue: [
      {
        ja: "きのうはひまでした。おんせんのほうがやすかったです。",
        reading: "Kinō wa hima deshita. Onsen no hō ga yasukatta desu.",
        en: "Yesterday I was free. The hot spring side was cheaper.",
      },
    ],
    particles: [
      { particle: "のほうが", note: "Comparison frame X のほうが vs Y." },
      { particle: "より／いちばん", note: "Than / superlative patterns." },
    ],
    grammarBullets: [
      "Past tense of adjectives and noun+copula forms.",
      "より／いちばん for JLPT listening comparisons.",
    ],
    mcqs: [
      {
        question: "Cheapest pattern:",
        choices: ["いちばんたかいです。", "いちばんやすいです。", "いちばんやすかったです。", "いちばんやすくないです。"],
        correctIndex: 2,
      },
      {
        question: "Compare two nouns “than”:",
        choices: ["より", "まで", "だけ", "しか"],
        correctIndex: 0,
      },
    ],
    listening: {
      scenario: "Travel agents compare two hotel prices.",
      instruction: "Listen for より／のほうが.",
      keyPhrases: ["やすい", "こちら", "あちら"],
    },
  }),
  mk({
    minnaLesson: 13,
    dialogue: [
      {
        ja: "ギターがほしいです。しょくじをつくりたいです。あしたえいがをみにいきます。",
        reading: "Gitā ga hoshii desu. Shokuji o tsukuritai desu. Ashita eiga o mi ni ikimasu.",
        en: "I want a guitar. I want to cook a meal. Tomorrow I’ll go to watch a movie.",
      },
    ],
    particles: [
      { particle: "が + ほしい", note: "Thing desired." },
      { particle: "たい attaches to verb stem", note: "Want to do — personal desires." },
      { particle: "にいく purpose", note: "見にいく listen pattern." },
    ],
    grammarBullets: [
      "ほしい for nouns; V-stem+たい for verbs.",
      "へ／に movement + purpose に + motion verb.",
    ],
    mcqs: [
      {
        question: "Want to read:",
        choices: ["よみたいです。", "よみします。", "よみますたいです。", "よみほしいです。"],
        correctIndex: 0,
      },
      {
        question: "ほしい marks:",
        choices: ["verb wanting", "noun desire", "past tense", "reason"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Wishlist conversation about trips and gadgets.",
      instruction: "Separate ほしい nouns vs 〜たい verbs.",
      keyPhrases: ["たいです", "ほしい", "にいきます"],
    },
  }),
  mk({
    minnaLesson: 14,
    dialogue: [
      {
        ja: "もうはみがきをしましたか。ドアをしめてください。コピーをとっています。",
        reading: "Mō hamigaki o shimashita ka. Doa o shimete kudasai. Kopī o totteimasu.",
        en: "Already brushed your teeth? Please close the door. I’m making a copy.",
      },
    ],
    particles: [
      { particle: "てください", note: "Soft command / request." },
      { particle: "ている", note: "Progressive / state continuation." },
    ],
    grammarBullets: [
      "Te-form conjugation rules across verb groups.",
      "ています for action in progress vs habitual (context).",
    ],
    mcqs: [
      {
        question: "Please wait:",
        choices: ["まってください。", "まちますください。", "まつてください。", "まってくださいません。"],
        correctIndex: 0,
      },
      {
        question: "ている shows:",
        choices: ["past regret", "progressive aspect", "future only", "reason"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Boss instructions in office — sequence of てください.",
      instruction: "Order the commands as heard.",
      keyPhrases: ["てください", "ています"],
    },
  }),
  mk({
    minnaLesson: 15,
    dialogue: [
      {
        ja: "しゃしんをとってもいいですか。ここではたばこをすってはいけません。",
        reading: "Shashin o totte mo ii desu ka. Koko de wa tabako o sutte wa ikemasen.",
        en: "May I take photos? You must not smoke here.",
      },
    ],
    particles: [
      { particle: "てもいい", note: "Permission question pattern." },
      { particle: "てはいけない", note: "Prohibition / rule." },
    ],
    grammarBullets: [
      "もいいですか vs plain permission nuance.",
      "では／してはいけません announcements — listening staple.",
    ],
    mcqs: [
      {
        question: "Ask permission to enter:",
        choices: ["はいってもいいですか。", "はいってもだめですか。", "はいってはいけませんか。", "はいってくださいか。"],
        correctIndex: 0,
      },
      {
        question: "Strong rule sign:",
        choices: ["してもいい", "してはいけません", "してください", "しています"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Museum PA rules — permission/prohibition.",
      instruction: "Tick allowed vs forbidden actions.",
      keyPhrases: ["てもいい", "てはいけません"],
    },
  }),
  mk({
    minnaLesson: 16,
    dialogue: [
      {
        ja: "シャワーをあびてからねます。びょうきだからやすみました。",
        reading: "Shawā o abite kara nemasu. Byōki dakara yasumimashita.",
        en: "After showering I sleep. Because I was sick I took a day off.",
      },
    ],
    particles: [
      { particle: "てから", note: "After doing A, then B." },
      { particle: "だから／ので", note: "Because soft explanations." },
    ],
    grammarBullets: [
      "Chaining actions: te-form sequences vs てから.",
      "Reason clauses tie into Lesson 17 preview.",
    ],
    mcqs: [
      {
        question: "After eating then studying:",
        choices: [
          "たべてからべんきょうします。",
          "たべますからべんきょうします。",
          "たべてべんきょうしますから。",
          "たべてからべんきょうしますから。",
        ],
        correctIndex: 0,
      },
      {
        question: "だから introduces:",
        choices: ["time", "reason-result", "location", "object"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Morning routine narration with sequencing.",
      instruction: "Number steps 1–4 as spoken.",
      keyPhrases: ["てから", "それから"],
    },
  }),
  mk({
    minnaLesson: 17,
    dialogue: [
      {
        ja: "バスにのらなくてもいいです。ろうかをはしらないでください。おそくかえらないでください。",
        reading: "Basu ni noranakute mo ii desu. Rōka o hashiranaide kudasai. Osoku kaeranaide kudasai.",
        en: "You don’t have to take the bus. Please don’t run in the hallway. Please don’t come home late.",
      },
    ],
    particles: [
      { particle: "なくてもいい", note: "Not obligated." },
      { particle: "ないでください", note: "Please don’t do." },
    ],
    grammarBullets: [
      "Negative te-forms hook into obligations なければならない (later exams).",
      "なくてもいい relieves requirement.",
    ],
    mcqs: [
      {
        question: "Soft ‘must not’ classroom:",
        choices: ["たべなくてもいいです。", "たべないでください。", "たべてはいけません。", "たべなくちゃいけません。"],
        correctIndex: 1,
      },
      {
        question: "なくてもいい expresses:",
        choices: ["obligation", "permission not to", "past tense", "desire"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Safety briefing — negative requests.",
      instruction: "Identify two prohibited actions.",
      keyPhrases: ["ないでください", "～てはいけません"],
    },
  }),
  mk({
    minnaLesson: 18,
    dialogue: [
      {
        ja: "わたしはにほんごをはなすことができます。かのじょはピアノをひくことができます。ねるまえにほんをよみます。",
        reading: "Watashi wa nihongo o hanasu koto ga dekimasu. Kanojo wa piano o hiku koto ga dekimasu. Neru mae ni hon o yomimasu.",
        en: "I can speak Japanese. She can play the piano. I read a book before sleeping.",
      },
    ],
    particles: [
      { particle: "ことができる", note: "Ability / possibility with dictionary form verb." },
      { particle: "まえに", note: "Before doing — time clause ordering." },
    ],
    grammarBullets: [
      "Dictionary form review — prerequisite for many N4 structures.",
      "できる／わからない contrast ability patterns.",
    ],
    mcqs: [
      {
        question: "Can speak Japanese (using ことができる):",
        choices: [
          "にほんごをはなします。",
          "にほんごをはなすことができます。",
          "にほんごがはなしますことができます。",
          "にほんごをはなしてことができます。",
        ],
        correctIndex: 1,
        explanation: "Dictionary form + ことができます: はなす → はなすことができます. The potential form がはなせます is also correct in daily speech, but this lesson targets ことができる.",
      },
      {
        question: "まえに clause uses:",
        choices: ["past tense only", "dictionary/plain form verb before action", "question marker", "counter"],
        correctIndex: 1,
        explanation: "まえに attaches to the dictionary form: ねる まえに (before sleeping). It marks the action that comes second in time but appears first in the sentence.",
      },
    ],
    listening: {
      scenario: "Club recruitment — abilities questionnaire.",
      instruction: "Match person to skill heard.",
      keyPhrases: ["できます", "できません", "まえに"],
    },
  }),
  mk({
    minnaLesson: 19,
    dialogue: [
      {
        ja: "きょうとへいったことがあります。べんきょうがもっとすきになりました。",
        reading: "Kyōto e itta koto ga arimasu. Benkyō ga motto suki ni narimashita.",
        en: "I’ve been to Kyoto before. I came to like studying more.",
      },
    ],
    particles: [
      { particle: "たことがある", note: "Past experience." },
      { particle: "なる", note: "Become — に／くなる patterns." },
    ],
    grammarBullets: [
      "Experience vs completion aspect — listening distractors.",
      "なる links states changing over time.",
    ],
    mcqs: [
      {
        question: "Never eaten sushi (experience):",
        choices: [
          "すしをたべたことがありません。",
          "すしをたべませんでした。",
          "すしをたべないことがあります。",
          "すしをたべていません。",
        ],
        correctIndex: 0,
      },
      {
        question: "なる pairs with:",
        choices: ["topic は only", "に／く for state change", "object を only", "へ direction"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Interview about travel experiences.",
      instruction: "Which country has “been there” marker?",
      keyPhrases: ["たことがあります", "いったことが"],
    },
  }),
  mk({
    minnaLesson: 20,
    dialogue: [
      {
        ja: "きょうはやすみだ。あしたテストがあるんだ。そうなの？",
        reading: "Kyō wa yasumi da. Ashita tesuto ga arun da. Sō nano?",
        en: "Today’s a day off. There’s a test tomorrow (plain). Really?",
      },
    ],
    particles: [
      { particle: "だ／じゃない", note: "Plain copula basics." },
      { particle: "の／んだ", note: "Explanation / emphasis in casual speech." },
    ],
    grammarBullets: [
      "Copula in plain form links to quoted speech later.",
      "Friends speech vs です／ます politeness switches.",
    ],
    mcqs: [
      {
        question: "Plain negative copula:",
        choices: ["じゃない", "じゃありません", "ではないです", "ありません"],
        correctIndex: 0,
      },
      {
        question: "んだ adds:",
        choices: ["honorific", "explanation/emphasis", "past tense", "counter"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Casual snacks invite via LINE-style tone.",
      instruction: "Spot plain endings vs polite.",
      keyPhrases: ["だよ", "なの", "じゃない"],
    },
  }),
  mk({
    minnaLesson: 21,
    dialogue: [
      {
        ja: "あしたはあめだとおもいます。ヤマダさんはエンジニアだとおもいます。",
        reading: "Ashita wa ame da to omoimasu. Yamada-san wa enjinia da to omoimasu.",
        en: "I think it will rain tomorrow. I think Yamada is an engineer.",
      },
    ],
    particles: [
      { particle: "と思う", note: "Clause + とおもう belief/opinion." },
      { particle: "という", note: "Called / quotation frames preview." },
    ],
    grammarBullets: [
      "Embedded clauses stay plain before とおもう.",
      "Contrast は scopes opinion topics.",
    ],
    mcqs: [
      {
        question: "I think she’s kind:",
        choices: [
          "やさしいだとおもいます。",
          "やさしいとおもいます。",
          "やさしいですとおもいます。",
          "やさしいなとおもいます。",
        ],
        correctIndex: 1,
      },
      {
        question: "とおもう attaches:",
        choices: ["noun only", "clause + と", "particle は only", "numbers"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Weather forecast opinions.",
      instruction: "Who thinks what about tomorrow’s weather?",
      keyPhrases: ["とおもいます", "あした"],
    },
  }),
  mk({
    minnaLesson: 22,
    dialogue: [
      {
        ja: "これはせんせいがかいたえです。おおきいペンをかったひとがいます。",
        reading: "Kore wa sensei ga kaita e desu. Ōkii pen o katta hito ga imasu.",
        en: "This is a picture the teacher drew. There’s someone who bought a big pen.",
      },
    ],
    particles: [
      { particle: "Verbた／ある clause + noun", note: "Relative clause modifies noun." },
      { particle: "が／を inside clause", note: "Different from matrix は topic." },
    ],
    grammarBullets: [
      "Relative clauses stack before noun — reading exam skill.",
      "だ／だった omission rules inside relatives.",
    ],
    mcqs: [
      {
        question: "Book I bought:",
        choices: ["かったほん", "かうほん", "かっているほん", "かいたほん"],
        correctIndex: 0,
      },
      {
        question: "Relative clause modifies:",
        choices: ["verb only", "following noun", "particle は", "copula です"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Lost-and-found desk describing owner clauses.",
      instruction: "Pick matching relative description.",
      keyPhrases: ["〜たひと", "〜ているバッグ"],
    },
  }),
  mk({
    minnaLesson: 23,
    dialogue: [
      {
        ja: "ひまなときにジムへいきます。あめがふるときはうちでべんきょうします。",
        reading: "Hima na toki ni jimu e ikimasu. Ame ga furu toki wa uchi de benkyō shimasu.",
        en: "When I’m free I go to the gym. When it rains I study at home.",
      },
    ],
    particles: [
      { particle: "とき", note: "When-clause — plain form precedes とき." },
      { particle: "と／たら overlap preview", note: "Contrast conditional nuance later." },
    ],
    grammarBullets: [
      "Adjective + とき vs verb plain + とき tense alignment.",
      "Listening ties situations to outcomes.",
    ],
    mcqs: [
      {
        question: "When I was a student:",
        choices: [
          "がくせいのときは〜",
          "がくせいだったとき〜",
          "がくせいですとき〜",
          "がくせいだとき〜",
        ],
        correctIndex: 1,
      },
      {
        question: "とき follows:",
        choices: ["です forms only", "plain predicate describing situation", "copula は", "numbers"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Conditional habits — weather + weekend.",
      instruction: "Match condition clause to result clause.",
      keyPhrases: ["とき", "ときは"],
    },
  }),
  mk({
    minnaLesson: 24,
    dialogue: [
      {
        ja: "ともだちにケーキをつくってあげました。せんせいにメールをおくってもらいました。",
        reading: "Tomodachi ni kēki o tsukutte agemashita. Sensei ni mēru o okutte moraimashita.",
        en: "I made a cake for a friend. I had the teacher send an email (for me).",
      },
    ],
    particles: [
      { particle: "てあげる／くれる／もらう", note: "Benefactive nuance with tense persons." },
      { particle: "に agent/source", note: "Marks who receives benefit." },
    ],
    grammarBullets: [
      "Give/lend diagram — viewpoint shifts meaning.",
      "Honorific ladder preview for keigo studies.",
    ],
    mcqs: [
      {
        question: "Someone did favour for me:",
        choices: ["〜てあげました", "〜てくれました", "〜てもらいました", "〜てしまいました"],
        correctIndex: 2,
      },
      {
        question: "てあげる implies:",
        choices: ["speaker receives", "speaker does for someone else", "mandatory", "past only"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Helpdesk ticket — who helped whom.",
      instruction: "Track に／もらう／くれる alignment.",
      keyPhrases: ["てもらいました", "てくれました"],
    },
  }),
  mk({
    minnaLesson: 25,
    dialogue: [
      {
        ja: "ひまだったらゲームをしましょう。あめでもいきます。",
        reading: "Hima dattara gēmu o shimashō. Ame demo ikimasu.",
        en: "If we’re free let’s play games. Even if it rains I’ll go.",
      },
    ],
    particles: [
      { particle: "たら", note: "Conditional — discovery / hypothetical nuance." },
      { particle: "ても", note: "Even if concession." },
    ],
    grammarBullets: [
      "たら vs と／なら overlap — JLPT loves comparing.",
      "Even-if patterns combine with negatives for exam traps.",
    ],
    mcqs: [
      {
        question: "If it’s cold:",
        choices: ["さむかったら", "さむいたら", "さむくなったらだめ", "さむいならば"],
        correctIndex: 0,
      },
      {
        question: "でも after noun/adjective stem:",
        choices: ["must", "even if / although", "because", "question"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Weekend planning conditionals.",
      instruction: "Identify conditional marker vs concession marker.",
      keyPhrases: ["たら", "ても"],
    },
  }),
  mk({
    minnaLesson: null,
    bookRef: "JLPT N5 · Integrated review",
    dialogue: [
      {
        ja: "これまでにならべたぶんけいをいちどになおしましょう。テストではペースがじゅうようです。",
        reading: "Kore made ni narabeta bunkei o ichido ni naoshimashō. Tesuto de wa pēsu ga jūyō desu.",
        en: "Let’s reorganise every grammar pattern covered so far. Pace matters on the test.",
      },
    ],
    particles: [
      { particle: "は／が／を／に／で", note: "Mixed drills — matrix vs clause subjects." },
      { particle: "も／から／まで", note: "Also / because / until connectors." },
    ],
    grammarBullets: [
      "Two-pass technique: particles first, modifiers second.",
      "Shadow audio while scanning textbook grammar charts.",
    ],
    mcqs: [
      {
        question: "Choose は vs が: “Sakura blooms.” (neutral description)",
        choices: ["さくらはさいます。", "さくらがさいます。", "さくらをさいます。", "さくらにさいます。"],
        correctIndex: 1,
      },
      {
        question: "Best study tactic this week:",
        choices: ["Only new kanji", "Mix listening + grammar charts daily", "Skip particles", "Avoid textbook"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Mixed short clips from earlier textbook scenes stitched.",
      instruction: "Identify only the grammar marker targeted (pause between clips).",
      keyPhrases: ["ます", "てください", "が／は"],
      studyTip: "Use spaced repetition with audio-first passes.",
    },
  }),
  mk({
    minnaLesson: null,
    bookRef: "JLPT N5 · Listening sprint",
    dialogue: [
      {
        ja: "マークシートでは選択肢をよく読んでからこたえましょう。もう一度聞けないときのためにメモをとることも大切です。",
        reading: "Mākushīto de wa sentakushi o yoku yonde kara kotaemashō. Mō ichido kikenai toki no tame ni memo o toru koto mo taisetsu desu.",
        en: "When using the answer sheet, read the choices carefully before answering. Taking notes for when you can't listen again is also important.",
      },
    ],
    particles: [
      { particle: "Listening grammar", note: "Prosody beats isolated particles — hear clause boundaries." },
      { particle: "Qualifiers", note: "でも／しか／だけ traps in fast speech." },
    ],
    grammarBullets: [
      "Predict answer type before choices appear.",
      "Ignore decorative fillers (えーと／なんか).",
    ],
    mcqs: [
      {
        question: "Best immediate tactic after missing an audio item:",
        choices: ["Panic skip three", "Guess same letter pattern", "Circle keyword heard", "Leave blank forever"],
        correctIndex: 2,
      },
      {
        question: "Shadowing helps:",
        choices: ["math skills", "intonation + chunking", "typing speed", "English grammar"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Five ultra-short announcements — identify purpose each.",
      instruction: "Write 1-word purpose label before checking transcript.",
      keyPhrases: ["ごあんない", "ちゅうい", "おねがいします"],
      studyTip: "Loop same clip until you repeat comfortably.",
    },
  }),
  mk({
    minnaLesson: null,
    bookRef: "JLPT N5 · Kanji & vocab sprint",
    dialogue: [
      {
        ja: "すきまじかんに、じしょでかんじのよみかたとかきじゅんをかくにんします。じぶんでてがきれんしゅうをすることも大切です。",
        reading: "Sukima jikan ni, jisho de kanji no yomikata to kakijun o kakunin shimasu. Jibun de tegaki renshū o suru koto mo taisetsu desu.",
        en: "During spare moments, check kanji readings and stroke order in a dictionary. Handwriting practice on your own is also important.",
      },
    ],
    particles: [
      { particle: "Kanji radicals", note: "Split characters into semantic + phonetic halves." },
      { particle: "オノマトペ", note: "Sound-symbol pairs boost retention." },
    ],
    grammarBullets: [
      "Batch similar shapes (土・士・工) carefully.",
      "Pair each kanji with one spoken phrase daily.",
    ],
    mcqs: [
      {
        question: "Which reading fits 電車 in isolation?",
        choices: ["でんしゃ", "てつしゃ", "えんしゃ", "じてつ"],
        correctIndex: 0,
      },
      {
        question: "Stroke-order benefit:",
        choices: ["decoration", "helps handwriting recognition & memory", "speed typing", "English spelling"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Minimal pairs drills (さつ／さん／さち-style distractors).",
      instruction: "Listen for pitch / vowel length differences only.",
      keyPhrases: ["びょういん／びよういん", "はし／はし"],
      studyTip: "Record yourself reading vocabulary rows.",
    },
  }),
  mk({
    minnaLesson: null,
    bookRef: "JLPT N5 · Reading & particles exam style",
    dialogue: [
      {
        ja: "文しょうを読むとき、まず接続詞をさがしましょう。「しかし」や「だから」が見えたら、文の流れがわかります。",
        reading: "Bunshō o yomu toki, mazu setsuzokushi o sagashimashō. 'Shikashi' ya 'dakara' ga mietara, bun no nagare ga wakarimasu.",
        en: "When reading a passage, first look for connectors. Once you spot 'however' or 'therefore,' the flow of the text becomes clear.",
      },
    ],
    particles: [
      { particle: "接続詞", note: "しかし／でも／だから clue transitions." },
      { particle: "指示語", note: "これ／それ／あれ references across blanks." },
    ],
    grammarBullets: [
      "Underline topic は once per passage.",
      "Translate final sentence first if clock pressure.",
    ],
    mcqs: [
      {
        question: "Blank: あさ___パンをたべます。(time slot)",
        choices: ["に", "で", "から", "まで"],
        correctIndex: 0,
      },
      {
        question: "Particle after incidental motion verb destination:",
        choices: ["へ／に overlap cases — choose に for existence arrival sometimes", "を only", "が only", "も"],
        correctIndex: 0,
      },
    ],
    listening: {
      scenario: "Short mail reading aloud — identify purpose.",
      instruction: "Ignore decorative emoji cues if text-only.",
      keyPhrases: ["おしらせ", "おねがい"],
      studyTip: "Skim question prompts before rereading passage.",
    },
  }),
  mk({
    minnaLesson: null,
    bookRef: "JLPT N5 · Mock exam mindset",
    dialogue: [
      {
        ja: "さいごに、タイマーをセットして模擬試験に挑戦しましょう。うまくいったら、N5の受験もうしこみもわすれずに！",
        reading: "Saigo ni, taimā o setto shite mogi shiken ni chōsen shimashō. Umaku ittara, N5 no juken mōshikomi mo wasuреzu ni!",
        en: "Finally, set a timer and take a full mock test. If it goes well, don't forget to register for the actual N5 exam!",
      },
    ],
    particles: [
      { particle: "Exam pacing", note: "Allocate minutes per section — skip sticky items." },
      { particle: "Mindset", note: "Sleep > cram night before." },
    ],
    grammarBullets: [
      "Review wrong answers with textbook page refs.",
      "Keep one-page cheat sheet of weak particles.",
    ],
    mcqs: [
      {
        question: "Night before exam:",
        choices: ["All-nighter only manga", "sleep + light review", "skip listening", "ignore instructions"],
        correctIndex: 1,
      },
      {
        question: "After mock scoring:",
        choices: ["ignore mistakes", "tag mistakes by grammar chapter", "throw notes away", "avoid timers"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Full mock listening section once — simulate distractions off.",
      instruction: "Score honestly; log timestamp confusion.",
      keyPhrases: ["もういちど", "えんぴつ"],
      studyTip: "Celebrate finishing the 30-day arc — schedule N5 registration.",
    },
  }),
];
