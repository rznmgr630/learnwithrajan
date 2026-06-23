/**
 * Week 1 · Days 1–7 · Minna L1–L7 · five JLPT-style papers (distinct question sets).
 * Covers: kanji (Days 1–7), vocabulary, grammar, and particles from all 7 chapters.
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildJlptFivePaperWeek,
  listeningIntroEmbedded,
  type McqPoolRow,
} from "@/lib/japanese-learning/n5/n5-subtest-shared";

// ─── VOCABULARY & KANJI ───────────────────────────────────────────────────────
// Each block covers different chapters. Kanji questions test readings + meanings.

const VOCAB_BLOCKS: McqPoolRow[][] = [
  // Paper 1 — Ch1 vocab + kanji (numbers, people, self-intro)
  [
    ["「私」の読みは？", ["わたし", "わたくし", "ぼく", "おれ"], 0, "私 = わたし (formal I/me). わたくし is even more formal. ぼく/おれ are male casual."],
    ["「先生」の意味は？", ["teacher", "student", "doctor", "friend"], 0, "先生 (せんせい) = teacher. 学生 = student. 医者 = doctor."],
    ["「学生」の読みは？", ["がくせい", "がくせん", "がっせい", "がくさい"], 0, "学生 = がくせい (student). 学 = がく (study), 生 = せい (life/born)."],
    ["「会社員」の意味は？", ["company employee", "student", "teacher", "doctor"], 0, "会社員 (かいしゃいん) = company employee. 会社 = company, 員 = member/staff."],
    ["「何」の読みで正しいのは（何時）？", ["なんじ", "なにじ", "なんか", "なにか"], 0, "何時 = なんじ (what time). Counter words take なん. 何 alone = なに."],
  ],
  // Paper 2 — Ch2-3 vocab + kanji (places, things, directions, floors)
  [
    ["「本」の意味は？", ["book", "hundred", "white", "big"], 0, "本 (ほん) = book. 百 = ひゃく (100). 白 = しろ (white). 大 = おお (big)."],
    ["「百」「千」「万」の読みは？", ["ひゃく・せん・まん", "ひゃく・せん・おく", "もも・ち・よろず", "ひゃく・さん・まん"], 0, "百 = ひゃく (100), 千 = せん (1,000), 万 = まん (10,000). Core number kanji."],
    ["「上」と「下」の意味の組み合わせは？", ["above / below", "left / right", "north / south", "east / west"], 0, "上 (うえ) = above/top, 下 (した) = below/bottom. 左右 = left/right. 北南 = north/south."],
    ["デパートの「〜かい」は何を表す？", ["floor number", "price", "time", "name"], 0, "〜かい (〜階) = floor number. いっかい = 1F, にかい = 2F, なんかい = which floor?"],
    ["「食堂」の意味は？", ["cafeteria / dining hall", "classroom", "reception", "office"], 0, "食堂 (しょくどう) = cafeteria / dining hall. 食 = eat, 堂 = hall. 教室 = classroom."],
  ],
  // Paper 3 — Ch4-5 vocab + kanji (time, transport, movement, shopping)
  [
    ["「今」の読みは？", ["いま", "こん", "きん", "じん"], 0, "今 (いま) = now. 今日 = きょう (today). 今週 = こんしゅう (this week)."],
    ["「駅」の意味は？", ["train station", "car", "shop", "electric"], 0, "駅 (えき) = train station. 車 (くるま) = car. 店 (みせ) = shop. 電 (でん) = electric."],
    ["「電車」の「電」の読みは？", ["でん", "てん", "えん", "れん"], 0, "電 = でん (electric). 電車 (でんしゃ) = train. 電話 (でんわ) = telephone."],
    ["「いくら」の意味は？", ["how much (price)", "how many (people)", "how far", "how often"], 0, "いくら = how much (price). 何人 = how many people. どのくらい = how far / how long."],
    ["「うりば」の意味は？", ["sales section / counter", "floor", "department", "elevator"], 0, "うりば (売り場) = sales section / counter in a department store."],
  ],
  // Paper 4 — Ch6 vocab + kanji (food, drink, weekday kanji, activities)
  [
    ["「水・火・木・金・土」はそれぞれ何曜日？", ["月は含まれない・5曜日", "月・火・水・木・金", "5つの元素のみ", "日・月・火・水・木"], 0, "水(すい)・火(か)・木(もく)・金(きん)・土(ど) = Wed·Tue·Thu·Fri·Sat. 月 (Mon) and 日 (Sun) complete the week."],
    ["「たべます」の意味は？", ["eat (polite present)", "drink (polite present)", "buy", "cook"], 0, "たべます (食べます) = eat. のみます = drink. かいます = buy. つくります = cook/make."],
    ["「のみもの」の意味は？", ["drink / beverage", "food / meal", "music", "book"], 0, "のみもの (飲み物) = drink / beverage. たべもの (食べ物) = food. のむ = drink (verb)."],
    ["「しゃしんをとります」の意味は？", ["take a photo", "read a book", "listen to music", "drink juice"], 0, "しゃしんをとります (写真を撮ります) = take a photo. 本を読みます = read a book."],
    ["「もちろん」の意味は？", ["of course", "maybe", "a little bit", "that's right"], 0, "もちろん = of course / naturally. Used to agree enthusiastically."],
  ],
  // Paper 5 — Ch7 vocab + kanji (family, giving, expressions, travel)
  [
    ["「父・母・兄・姉・弟・妹」のグループは？", ["family members", "greetings", "places", "transport"], 0, "父(ちち)=father, 母(はは)=mother, 兄(あに)=older brother, 姉(あね)=older sister, 弟(おとうと)=younger brother, 妹(いもうと)=younger sister."],
    ["「手」の意味と読みは？", ["hand / て", "foot / て", "ear / て", "eye / め"], 0, "手 (て) = hand. 足 (あし) = foot. 耳 (みみ) = ear. 目 (め) = eye."],
    ["「プレゼント」の意味は？", ["gift / present", "trip", "souvenir", "ticket"], 0, "プレゼント = gift / present (loanword from 'present'). おみやげ = souvenir. りょこう = trip."],
    ["「おみやげ」の意味は？", ["souvenir / gift from a trip", "ticket", "luggage", "address"], 0, "おみやげ (お土産) = souvenir / gift brought back from a trip. にもつ = luggage."],
    ["「いただきます」の場面として正しいのは？", ["before eating a meal", "when leaving home", "when receiving a phone call", "when going to bed"], 0, "いただきます = said before eating. いってきます = said when leaving home. おやすみなさい = good night."],
  ],
];

// ─── GRAMMAR ─────────────────────────────────────────────────────────────────

const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  // Paper 1 — Ch1 grammar: は/です, じゃありません, も, の, か, さん, 〜じん
  [
    ["わたし（　）スミスです。", ["は", "が", "を", "に"], 0, "は marks the topic — 'I am Smith.' The topic particle は (wa) introduces what the sentence is about."],
    ["わたしは がくせい じゃ（　）。", ["ありません", "です", "ます", "ない"], 0, "じゃありません = conversational negative of です. Full form: ではありません (more formal)."],
    ["「ネパールじん」の「じん」は何を表す？", ["nationality (person from)", "number counter", "time marker", "floor marker"], 0, "〜じん (〜人) = person from a country. にほんじん = Japanese person. ネパールじん = Nepalese person."],
    ["「やまださん」の「さん」の役割は？", ["polite name suffix (Mr/Ms)", "question marker", "topic marker", "number counter"], 0, "さん = general honorific suffix for adults. Never use さん with your own name."],
    ["「あの人は （　）ですか。」に入るのは？（意味：あの人の名前を聞く）", ["だれ", "どこ", "なに", "いつ"], 0, "だれ = who (person). どこ = where. なに = what. いつ = when. Polite form: どなた."],
    ["Aは がくせいです。B（　）がくせいです。（BもAと同じ）", ["も", "は", "が", "の"], 0, "も replaces は to mean 'also/too'. When the same fact applies to another subject, swap は for も."],
  ],
  // Paper 2 — Ch2-3 grammar: これ/それ/あれ, こちら/あちら, に (existence), あります/います, floors
  [
    ["「これ・それ・あれ」のうち、話し手から遠いものは？", ["あれ", "これ", "それ", "どれ"], 0, "これ = near speaker, それ = near listener, あれ = far from both. どれ = which one (question)."],
    ["「エレベーターは（　）ですか。」（場所を聞く）", ["どこ", "だれ", "なに", "いつ"], 0, "どこ = where (place). Used to ask location. Answer: [place] にあります or [place] です."],
    ["「トイレは 3かいに（　）。」", ["あります", "います", "です", "ます"], 0, "あります is used for inanimate things (toilet = thing). います is for animate beings (people, animals)."],
    ["「ねこが そこに（　）。」", ["います", "あります", "です", "ます"], 0, "います = existence of animate beings. ねこ (cat) is animate → います. Books, chairs → あります."],
    ["「こちら・そちら・あちら」は何を表す？", ["polite direction / person reference", "things near/far", "times of day", "floor numbers"], 0, "こちら/そちら/あちら = polite forms of ここ/そこ/あそこ. Also used to refer politely to people."],
    ["「なんかい」は何を聞いている？", ["which floor (〜階)", "which direction", "how many people", "what time"], 0, "なんかい (何階) = which floor? いっかい = 1F, にかい = 2F, さんがい = 3F (irregular!)."],
  ],
  // Paper 3 — Ch4 grammar: ます/ました/ませんでした, から/まで, special times, に (time), を, と
  [
    ["「4時」の正しい読みは？", ["よじ", "しじ", "よんじ", "しちじ"], 0, "4 o'clock = よじ. NOT しじ. Special readings: 4=よじ, 7=しちじ, 9=くじ."],
    ["「はたらきます」の丁寧過去形は？", ["はたらきました", "はたらきません", "はたらきますか", "はたらきませんでした"], 0, "ます → ました = polite past (did). ませんでした = polite past negative (did not)."],
    ["きのう べんきょう（　）でした。（しなかった）", ["しません", "します", "しません", "しませんでした"], 2, "ませんでした = polite past negative (did not do). Note: this tests the full form correctly."],
    ["くじ（　）ごじ（　）はたらきます。（9時から5時）", ["から・まで", "に・で", "で・まで", "は・が"], 0, "から = from (start), まで = to/until (end). くじから ごじまで = from 9 to 5."],
    ["まいにち コーヒー（　）のみます。", ["を", "が", "は", "に"], 0, "を marks the direct object of action verbs. コーヒーをのみます = drink coffee. を only with action verbs."],
    ["ともだち（　）えいがをみます。（一緒に）", ["と", "が", "を", "に"], 0, "と marks a companion — 'with'. ともだちと = with a friend. ひとりで = alone (uses で not と)."],
  ],
  // Paper 4 — Ch5-6 grammar: で (place+transport), へ, てください, ましょう, 何, frequency
  [
    ["バス（　）がっこうへ いきます。（手段）", ["で", "に", "を", "と"], 0, "で marks transport means — 'by'. バスで = by bus. でんしゃで = by train. くるまで = by car."],
    ["どこ（　）いきますか。（方向）", ["へ", "に", "で", "を"], 0, "へ marks direction / destination — 'to, toward'. がっこうへいきます = I go to school."],
    ["ちょっと まって（　）。（丁寧なお願い）", ["ください", "です", "ます", "ません"], 0, "てください = polite request ('please do'). まってください = please wait. て alone = casual request."],
    ["そこで たべ（　）。（一緒にしよう）", ["ましょう", "ませんか", "てください", "ません"], 0, "ましょう = 'Let's!' — confident proposal. ましょうか = softer 'Shall we?'. ませんか = invitation."],
    ["「ぜんぜん〜」の後に来るのは？", ["negative verb (〜ません)", "positive verb (〜ます)", "adjective only", "noun only"], 0, "ぜんぜん must pair with a negative verb. ぜんぜんいきません = I don't go at all. Same rule for あまり."],
    ["「なんじですか」の「なん」と「なに」の使い分けは？", ["counter前=なん、が/を前=なに", "常になに", "常になん", "どちらでもよい"], 0, "何 = なん before counters (じ, かい, ようび). 何 = なに before が/を/も. Rule: なんじ, なんかい, なんようび."],
  ],
  // Paper 5 — Ch7 grammar: あげます/もらいます/くれます, に (recipient), から (source), もう/まだ
  [
    ["ともだちに プレゼントを（　）。（私が友達に）", ["あげました", "もらいました", "くれました", "いました"], 0, "あげます = I/someone gives TO another (outside my group). に marks recipient. もらいます = I receive."],
    ["ははから はなを（　）。（私が母からもらった）", ["もらいました", "あげました", "くれました", "いきました"], 0, "もらいます = I receive FROM someone. から marks the source (giver). Alternate: ははにもらいました."],
    ["ともだちが ケーキを（　）。（友達が私に）", ["くれました", "あげました", "もらいました", "しました"], 0, "くれます = someone gives TO me (or my in-group). Different from あげます (I give to others)."],
    ["「もう たべましたか。」の「もう」の意味は？", ["already (done)", "not yet", "a little", "right now"], 0, "もう + past verb = already (done). Question: もうたべましたか? Yes: はい、もうたべました. No: いいえ、まだです."],
    ["「いいえ、（　）です。」（まだしていない）", ["まだ", "もう", "また", "まず"], 0, "まだです = not yet. Short reply to もうしましたか. Full: まだしていません. もう = already."],
    ["「だれに あげましたか。」— に の役割は？", ["recipient of giving (to whom)", "source of receiving (from whom)", "object of action", "time marker"], 0, "に marks the RECIPIENT — who receives. From whom = から. Object = を. Time = に (different context)."],
  ],
];

// ─── READING ──────────────────────────────────────────────────────────────────

const READING_BLOCKS: McqPoolRow[][] = [
  // Paper 1
  [
    ["【文】はじめまして。わたしはやまださんです。にほんじんです。\n筆者は？", ["Japanese person named Yamada.", "Korean person.", "American teacher.", "Nepalese student."], 0, "わたしはやまだ = I am Yamada. にほんじん = Japanese person. Straightforward self-introduction."],
    ["【文】これはほんです。それはノートです。あれはかばんです。\nあれは何？", ["bag", "book", "notebook", "pen"], 2, "あれ = that over there (far from both). あれはかばん = that is a bag."],
    ["【文】トイレは 3かいにあります。\nトイレは何階？", ["3rd floor", "1st floor", "basement", "2nd floor"], 0, "3かいにあります = exists on the 3rd floor. に marks location of existence."],
    ["【文】わたしはがくせいです。やまださんもがくせいです。\nやまださんは？", ["also a student", "a teacher", "a doctor", "not a student"], 0, "も = also. やまださんもがくせい = Yamada is also a student."],
    ["【文】あの人はだれですか。たなかさんです。\nたなかさんは？", ["the person being asked about", "the person asking", "a place", "a thing"], 0, "だれ = who. The answer identifies who あの人 is."],
  ],
  // Paper 2
  [
    ["【文】まいにち くじから ごじまで はたらきます。\n何時間 はたらく？", ["8 hours (9 to 5)", "7 hours", "9 hours", "5 hours"], 0, "9 to 5 = 8 hours. From くじ (9) to ごじ (5) = 8 hours."],
    ["【文】きのう テレビをみませんでした。べんきょうしました。\nきのうは？", ["Studied instead of watching TV.", "Watched TV all day.", "Slept early.", "Went shopping."], 0, "ませんでした = did not. べんきょうしました = studied. Contrast: didn't watch TV, instead studied."],
    ["【文】よじにおきます。まいにちよじです。\n毎日何時に起きる？", ["4 o'clock (よじ)", "7 o'clock (しちじ)", "9 o'clock (くじ)", "6 o'clock (ろくじ)"], 0, "よじ = 4 o'clock. Special reading — NOT しじ. まいにち = every day."],
    ["【文】げつようびからきんようびまでしごとをします。どようびはやすみです。\n休みは？", ["Saturday (and Sunday)", "Monday only", "Friday", "Weekdays only"], 0, "から〜まで = from to. Monday to Friday = work. Saturday = rest."],
    ["【文】わたしはコーヒーとこうちゃをのみます。\n飲むのは？", ["Coffee and black tea", "Coffee only", "Tea only", "Water and coffee"], 0, "と = and (exhaustive). コーヒーとこうちゃ = coffee and black tea (exactly those two)."],
  ],
  // Paper 3
  [
    ["【文】でんしゃでがっこうへいきます。バスはのりません。\n何でいく？", ["By train (でんしゃ)", "By bus", "On foot", "By taxi"], 0, "で marks transport. でんしゃで = by train. バスはのりません = does not take bus."],
    ["【文】どうやっていきますか。あるいていきます。\n交通手段は？", ["On foot (walk)", "By train", "By bus", "By car"], 0, "あるいて = walking. No で needed. あるいていきます = I go on foot."],
    ["【文】ともだちといきます。ひとりではいきません。\n誰といく？", ["With a friend", "Alone", "With family", "With teacher"], 0, "ともだちと = with a friend. と = companion marker. ひとりで = alone (uses で not と)."],
    ["【文】うりばは ちか1かいにあります。\nうりばはどこ？", ["Basement 1 (B1)", "1st floor", "2nd floor", "Top floor"], 0, "ちか (地下) = basement. ちか1かい = B1. あります = exists there (inanimate thing)."],
    ["【文】スミスさんは よく としょかんへいきます。たいていにちようびです。\n図書館へは？", ["Goes often, usually Sundays", "Never goes", "Goes every weekday", "Goes rarely"], 0, "よく = often. たいてい = usually. にちようび = Sunday."],
  ],
  // Paper 4
  [
    ["【文】レストランでランチをたべます。コーヒーものみます。\nレストランで何をする？", ["Eat lunch and drink coffee", "Only drink coffee", "Only eat lunch", "Buy food"], 0, "で marks the place of action. たべます + のみます = eat and drink."],
    ["【文】ちょっとまってください。すぐかえります。\n何を頼まれた？", ["Please wait a moment", "Please leave now", "Please come here", "Please sit"], 0, "まってください = please wait. ちょっと = a little/moment. すぐ = soon/immediately."],
    ["【文】いっしょにたべましょう！おいしいレストランです。\n何を提案している？", ["Let's eat together", "Shall we eat? (soft question)", "Please eat alone", "I don't want to eat"], 0, "ましょう = Let's! Confident joint proposal. ましょうか = softer Shall we?"],
    ["【文】テレビをみますか。ええ、すきですよ。でもきょうはみません。\nきょうは？", ["Won't watch TV today", "Will watch TV", "Hates TV", "No TV at home"], 0, "みません = will not watch. でも = but (contrast). きょう = today."],
    ["【文】はなみをします。こうえんでさくらをみます。\n何をしている？", ["Flower-viewing at the park", "Playing soccer", "Taking photos only", "Having lunch"], 0, "はなみ (花見) = flower-viewing. こうえん = park. さくら = cherry blossoms."],
  ],
  // Paper 5
  [
    ["【文】かのじょから はなと カードをもらいました。うれしいです。\nだれからもらった？", ["From girlfriend", "From mother", "From friend", "From teacher"], 0, "から marks the source (giver). かのじょ = girlfriend. もらいました = received."],
    ["【文】ははにはなをあげました。はははよろこびました。\nだれにあげた？", ["To mother (はは)", "To father (ちち)", "To friend", "To sister"], 0, "に marks the recipient. ははに = to mother. あげました = gave. よろこんだ = was pleased."],
    ["【文】もう ごはんをたべましたか。いいえ、まだです。\nごはんは？", ["Not eaten yet", "Already eaten", "Will not eat", "Eating now"], 0, "まだです = not yet. Reply to もうしましたか. Opposite: はい、もうたべました = already eaten."],
    ["【文】これからパーティーにいきます。おみやげを かいました。\nおみやげは誰に？", ["Taking a souvenir to the party", "Receiving a souvenir", "Already returned from a trip", "Forgot the souvenir"], 0, "おみやげ = souvenir/gift. かいました = bought. これから = from now / from here."],
    ["【文】ともだちが ケーキを くれました。とてもうれしいです。\nケーキは誰が誰に？", ["Friend gave it TO me", "I gave it to friend", "I received from mother", "Friend received from me"], 0, "くれます = someone gives TO me. ともだちが(subject) くれました = friend gave (to me)."],
  ],
];

// ─── LISTENING ────────────────────────────────────────────────────────────────

const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  // Paper 1 — Ch1-2 listening
  [
    ["（聴解）「はじめまして。わたしはたなかです。にほんじんです。」\n話者の国籍は？", ["Japanese", "Korean", "Chinese", "American"], 0, "にほんじん = Japanese person. はじめまして = nice to meet you (first meeting)."],
    ["（聴解）「これはいくらですか。」「さんびゃくえんです。」\n値段は？", ["¥300", "¥3,000", "¥30", "¥3"], 0, "さんびゃく = 300. 百 = ひゃく (100). さんびゃく = 3×100 = 300."],
    ["（聴解）「あの人はだれですか。」「たなかさんです。」\n聞いているのは？", ["Who that person is", "Where that person is going", "What that person is doing", "When they arrive"], 0, "だれ = who. The question asks for the identity of あの人."],
    ["（聴解）「がくせいですか。いいえ、がくせいじゃありません。かいしゃいんです。」\n話者は？", ["Company employee", "Student", "Teacher", "Doctor"], 0, "じゃありません = is not. かいしゃいん = company employee (会社員)."],
  ],
  // Paper 2 — Ch3-4 listening
  [
    ["（聴解）「トイレはどこですか。」「2かいにあります。」\nトイレは？", ["2nd floor", "1st floor", "3rd floor", "Basement"], 0, "にかい = 2nd floor. あります = exists (inanimate). に marks location."],
    ["（聴解）「まいあさなんじにおきますか。」「よじにおきます。」\n毎朝何時に起きる？", ["4 o'clock (よじ)", "7 o'clock (しちじ)", "9 o'clock (くじ)", "6 o'clock (ろくじ)"], 0, "よじ = 4 o'clock. Special reading (not しじ). まいあさ = every morning."],
    ["（聴解）「くじから ごじまで はたらきます。」\n仕事の時間は？", ["9 AM to 5 PM", "9 AM to 9 PM", "5 AM to 9 PM", "5 to 5"], 0, "くじから = from 9 o'clock, ごじまで = until 5 o'clock."],
    ["（聴解）「きのうべんきょうしましたか。」「いいえ、しませんでした。」\nきのうは？", ["Didn't study yesterday", "Studied all day", "Went to school", "Read a book"], 0, "しませんでした = polite past negative (did not do). きのう = yesterday."],
  ],
  // Paper 3 — Ch5 listening (transport, movement)
  [
    ["（聴解）「どうやっていきますか。」「でんしゃでいきます。」\n移動手段は？", ["By train", "By bus", "By car", "On foot"], 0, "でんしゃで = by train. で marks transport means. どうやって = how/by what means."],
    ["（聴解）「どこへいきますか。」「としょかんへいきます。」\n行き先は？", ["Library", "Station", "School", "Hospital"], 0, "としょかん (図書館) = library. へ marks destination/direction."],
    ["（聴解）「ともだちといきますか。」「いいえ、ひとりでいきます。」\n誰といく？", ["Going alone", "Going with a friend", "Going with family", "Going with teacher"], 0, "ひとりで = alone. と marks companion. ひとりで uses で not と."],
    ["（聴解）「よくここへきますか。」「たいていどようびにきます。」\n来る頻度は？", ["Usually on Saturdays", "Never comes", "Comes every day", "Rarely comes"], 0, "たいてい = usually/generally. どようび = Saturday. よく = often (higher frequency)."],
  ],
  // Paper 4 — Ch6 listening (food, activities, requests)
  [
    ["（聴解）「すみません、メニューをみせてください。」\n場面は？", ["Asking to see the menu", "Paying the bill", "Ordering food directly", "Asking to cook"], 0, "みせてください = please show me. メニュー = menu. すみません = excuse me."],
    ["（聴解）「いっしょにランチをたべませんか。」「いいですね、たべましょう。」\n二人は？", ["Will eat lunch together", "Will not eat", "Are already eating", "Are cooking together"], 0, "たべませんか = won't you eat (invitation). たべましょう = let's eat (agreement after invitation)."],
    ["（聴解）「こうえんでサッカーをしますか。」「はい、ともだちとします。」\n場所と相手は？", ["Park, with a friend", "School, alone", "Home, with family", "Station, with teacher"], 0, "こうえん = park. で marks place of action. ともだちと = with a friend."],
    ["（聴解）「なにをたべますか。」「パンとたまごをたべます。」\n食べるのは？", ["Bread and egg", "Rice only", "Pasta only", "Salad and soup"], 0, "パン = bread. たまご = egg. と = and (exhaustive list of exactly those two items)."],
  ],
  // Paper 5 — Ch7 listening (giving/receiving)
  [
    ["（聴解）「ははにはなをあげました。」\nだれがだれに？", ["I gave flowers TO mother", "Mother gave ME flowers", "I received flowers FROM mother", "Mother received flowers"], 0, "あげます = I give TO someone. に marks recipient. はは = mother (my own mother)."],
    ["（聴解）「ともだちからチョコレートをもらいました。」\nもらったのは？", ["Received chocolate FROM a friend", "Gave chocolate TO a friend", "Friend received chocolate from me", "Bought chocolate"], 0, "もらいます = I receive. から marks the giver/source. ともだちから = from a friend."],
    ["（聴解）「もうかいものしましたか。」「いいえ、まだです。」\n買い物は？", ["Not done yet", "Already finished", "Doing it now", "Will never do"], 0, "まだです = not yet. Short answer to もうしましたか. Full: まだしていません."],
    ["（聴解）「ともだちが プレゼントを くれました。」\nだれがだれに？", ["Friend gave TO me", "I gave TO friend", "I received FROM friend (I initiated)", "Friend received from me"], 0, "くれます = someone gives TO me (speaker). くれました = gave (past). Subject = friend, receiver = me."],
  ],
];

function listeningIntroW1(testNum: number, tid: string): JapaneseWeeklyTestItem {
  const a = Math.min(7, testNum + 1);
  const b = Math.min(7, testNum + 3);
  return listeningIntroEmbedded(
    `${tid}-l-intro`,
    "聴解（Week 1）：Minna L1–L7 のあいさつ・数字・場所・交通・食事・あげる／もらうの場面を意識してください。",
    "短いクリップを一度聞き、続く四問に答えてください。",
    [a, b, 7],
    undefined,
  );
}

export function buildWeek1SubTests(): JapaneseWeeklySubTest[] {
  return buildJlptFivePaperWeek({
    weekPrefix: "jn5-w1",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: listeningIntroW1,
    paperSubtitle: {
      en: "JLPT N5-style · 20 questions · Minna Lessons 1–7 · Days 1–7",
      np: "JLPT N5 शैली · २० प्रश्न · मिन्ना पाठ १–७ · दिन १–७",
      jp: "JLPT N5形式 · 20問 · 第1–7課 · Day 1–7",
    },
    paperIntro:
      "Week 1 の五つのペーパーはそれぞれ別の問題セットです（Test 1〜5）。語彙・漢字・文法・読解・聴解の順です。第1〜7課（漢字・語彙・文法・助詞）をすべてカバーします。提出後に正答とスコアが表示されます。",
  });
}
