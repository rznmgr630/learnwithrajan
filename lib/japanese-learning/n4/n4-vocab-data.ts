/**
 * Compact row: [rōmaji, kana, kanji-or-empty, meaning EN, meaning NP, meaning JP, example sentence].
 * Empty kanji string renders as "—". Keyed by Minna no Nihongo II lesson number.
 */
export type N4VocabTuple = readonly [string, string, string, string, string, string, string];

export const N4_VOCAB_BY_LESSON: Record<number, N4VocabTuple[]> = {
  47: [
    ["atsumarimasu", "あつまります", "集まります", "gather", "जम्मा हुनु", "集合する・寄り集まる", "みんなが広場に集まります。"],
    ["hito ga atsumarimasu", "ひとがあつまります", "人が集まります", "people gather", "मान्छे जम्मा हुन्छ", "人々が一か所に集まる", "公園に人が集まります。"],
    ["wakaremasu", "わかれます", "別れます", "part, separate", "छुटिनु", "離れる・別離する", "友達と駅で別れました。"],
    ["hito ga wakaremasu", "ひとがわかれます", "人が別れます", "people part, separate", "मान्छे छुटिनु", "人々が離れる", "仲良し二人が別れます。"],
    ["nagaiki shimasu", "ながいきします", "長生きします", "live long", "लामो समय सम्म बाँच्नु", "長く生きる", "健康的に食べれば長生きできます。"],
    ["oto ga shimasu", "おとがします", "音がします", "I hear a sound; there is a sound", "स्वर आउँछ", "音が聞こえる", "台所から音がします。"],
    ["koe ga shimasu", "こえがします", "声がします", "I hear a voice", "स्वर आउँछ", "声が聞こえる", "隣の部屋から声がします。"],
    ["aji ga shimasu", "あじがします", "味がします", "(something) tastes; there is a taste", "स्वाद आउँछ", "味がある・感じる", "このスープは変な味がします。"],
    ["iran", "イラン", "", "Iran", "इरान", "中東の国", "彼はイランから来ました。"],
    ["kariforunia", "カリフォルニア", "", "California", "क्यालिफोर्निया", "アメリカ西海岸の州", "カリフォルニアは暖かいです。"],
    ["guamu", "グアム", "", "Guam", "ग्वाम", "太平洋の島・アメリカ領", "グアムへ旅行に行きます。"],
    ["koibito", "こいびと", "恋人", "sweetheart, boyfriend/girlfriend", "प्रेमी/प्रेमिका", "恋愛相手", "彼には恋人がいます。"],
    ["keshohin", "けしょうひん", "化粧品", "cosmetics", "कस्मेटिक्स सामान", "化粧に使う商品", "化粧品を買いに行きます。"],
    ["shirabe", "しらべ", "調べ", "survey, research; investigation", "सर्वेक्षण, अनुसन्धान", "調査・研究", "アンケートの調べによると人気があります。"],
    ["kesho", "けしょう", "化粧", "makeup", "मेकअप", "顔に化粧品をつけること", "毎朝化粧をします。"],
    ["kesho o shimasu", "けしょうをします", "化粧をします", "put on makeup", "मेकअप गर्छु", "化粧する行為", "出かける前に化粧をします。"],
    ["nioi ga shimasu", "においがします", "", "(something) smells; there is a smell", "(केही) वासना आउँछ", "においが感じられる", "花のにおいがします。"],
    ["sashimasu", "さします", "", "put up (an umbrella etc.)", "ओढ्नु", "傘をさす動作", "雨が降ったから傘をさします。"],
    ["kasa o sashimasu", "かさをさします", "傘をさします", "put up an umbrella", "छाता ओढ्नु", "傘を開いて使う", "雨なので傘をさします。"],
    ["hidoi", "ひどい", "", "terrible, severe; cruel", "भयानक, गम्भीर", "程度が激しい・残酷な", "今日はひどい天気です。"],
    ["kowai", "こわい", "怖い", "frightening, horrible; scared", "डरलाग्दो", "恐怖を感じる様子", "暗い道は怖いです。"],
    ["tenki yoho", "てんきよほう", "天気予報", "weather forecast", "मौसम पूर्वानुमान", "気象情報の予測", "天気予報によると明日は雨です。"],
    ["happyo", "はっぴょう", "発表", "announcement, presentation", "प्रस्तुति, भाषण", "公式に知らせること", "明日クラスで発表があります。"],
    ["jikken", "じっけん", "実験", "experiment", "प्रयोग", "科学的な実験", "化学の実験をします。"],
    ["jinko", "じんこう", "人口", "population", "जनसंख्या", "ある地域の人の数", "日本の人口は減っています。"],
    ["domo", "どうも", "", "it seems that; apparently (tentative judgement)", "(अस्थायी गर्दा प्रयोग) धन्यवाद", "どうやら・なんとなく", "どうも彼は来ないようです。"],
    ["~ni yoru to", "〜によると", "", "according to ~; based on ~", "~ अनुसार सङ्केत", "情報の出所を示す", "天気予報によると明日は晴れです。"],
    ["bari", "バリ", "", "Bali (in Indonesia)", "इन्डोनेसियाको बाली", "インドネシアの島", "バリへ旅行したいです。"],
  ],
};
