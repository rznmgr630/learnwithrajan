import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_PHASE_0_LESSONS: LessonDay = {
  day: 0,
  title: { en: "Phase 0 — Before You Start", np: "Phase 0 — सुरु गर्नुअघि", jp: "Phase 0 — はじめる前に" },
  totalMinutes: 38,
  difficulty: { en: "Preparation", np: "तयारी", jp: "準備" },
  lessons: [
    {
      id: "php-oop",
      title: { en: "PHP you must know — classes, interfaces, traits", np: "जान्नैपर्ने PHP — class, interface, trait", jp: "必要なPHP — クラス・インターフェース・トレイト" },
      durationMinutes: 10,
      explanation: {
        en: "Before the 30-day Laravel journey, you need a few PHP, Git, SQL and web fundamentals. <b>This phase is not part of the 30 days</b> — it is a preparation checklist.\n\nYou do not need to be an expert in everything here. You need enough to follow the Laravel lessons without getting stuck on PHP syntax.\n\n```text\n                  Laravel 13\n                      │\n          ┌───────────┼───────────┐\n          ↓           ↓           ↓\n         PHP         SQL         HTTP\n          │           │           │\n          ↓           ↓           ↓\n      Composer       Database     Web\n          │\n          ↓\n         Git\n```\n\nLaravel is built on top of these. If the foundations are weak, Laravel feels complicated. If they are clear, Laravel becomes much easier.\n\n---\n\n### 1. Basic — classes\n\nA <b>class</b> (a blueprint for creating objects) describes what an object should contain and do.\n\n```php\nclass User\n{\n    public string $name;\n\n    public function sayHello(): string\n    {\n        return \"Hello, \" . $this->name;\n    }\n}\n```\n\nCreate an object from it:\n\n```php\n$user = new User();\n$user->name = \"Rajan\";\necho $user->sayHello();   // Hello, Rajan\n```\n\n```text\n             Class\n          ┌───────────┐\n          │   User    │\n          ├───────────┤\n          │ name      │\n          │ sayHello  │\n          └─────┬─────┘\n                │\n             new User()\n                │\n                ↓\n          ┌───────────┐\n          │  Object   │\n          │  Rajan    │\n          └───────────┘\n```\n\nLaravel uses classes everywhere: `Controller → Service → Repository → Model → Database`.\n\n---\n\n### 2. Intermediate — interfaces and traits\n\nAn <b>interface</b> (a contract saying which methods a class must provide) defines <b>what</b> a class does without saying <b>how</b>.\n\n```php\ninterface PaymentGateway\n{\n    public function charge(float $amount): bool;\n}\n\nclass StripePayment implements PaymentGateway\n{\n    public function charge(float $amount): bool\n    {\n        return true;\n    }\n}\n```\n\n```text\nInterface\n   │ defines the rules\n   ↓\nPaymentGateway\n   │\n   ├───────────────┐\n   ↓               ↓\nStripe          PayPal\n```\n\nBoth must provide `charge()`. Laravel uses interfaces when you want to separate what something does from how it does it.\n\nA <b>trait</b> (a reusable group of methods and properties) shares code between classes that are otherwise unrelated:\n\n```php\ntrait HasActivityLog\n{\n    public function logActivity(): void\n    {\n        echo \"Activity logged\";\n    }\n}\n\nclass User  { use HasActivityLog; }\nclass Order { use HasActivityLog; }\n```\n\n```text\n             HasActivityLog\n                    │\n          ┌─────────┴─────────┐\n          ↓                   ↓\n        User                Order\n          │                   │\n          └──── logActivity ──┘\n```\n\n---\n\n### 3. Advanced — abstract classes\n\nAn <b>abstract class</b> (a class designed to be inherited, never created directly) gives child classes shared behaviour and forces them to fill in the rest:\n\n```php\nabstract class Animal\n{\n    public function sleep(): void\n    {\n        echo \"Sleeping\";\n    }\n\n    abstract public function makeSound(): string;\n}\n\nclass Dog extends Animal\n{\n    public function makeSound(): string\n    {\n        return \"Woof\";\n    }\n}\n```\n\n`new Animal()` is not allowed, because `Animal` is abstract.\n\n```text\n             Animal\n          (abstract)\n               │\n       ┌───────┴───────┐\n       ↓               ↓\n      Dog             Cat\n       │               │\n     Woof             Meow\n```\n\n<b>Interface or abstract class?</b> An interface is a pure contract with no code. An abstract class is a partly-built parent that also carries shared code.",
        np: "30-दिने Laravel यात्रा अघि, तपाईंलाई केही PHP, Git, SQL र web आधारभूत कुरा चाहिन्छ। <b>यो चरण 30 दिनको भाग होइन</b> — यो तयारीको checklist हो।\n\nयहाँका सबै कुरामा विज्ञ हुनु पर्दैन। PHP syntax मा नअड्किई Laravel पाठ पछ्याउन पुग्ने जति भए हुन्छ।\n\n```text\n                  Laravel 13\n                      │\n          ┌───────────┼───────────┐\n          ↓           ↓           ↓\n         PHP         SQL         HTTP\n          │           │           │\n          ↓           ↓           ↓\n      Composer       Database     Web\n          │\n          ↓\n         Git\n```\n\nLaravel यिनै माथि बनेको छ। जग कमजोर भए Laravel जटिल लाग्छ। जग स्पष्ट भए Laravel धेरै सजिलो हुन्छ।\n\n---\n\n### 1. आधारभूत — class\n\n<b>Class</b> (object बनाउने खाका) ले object मा के हुनुपर्छ र के गर्नुपर्छ वर्णन गर्छ।\n\n```php\nclass User\n{\n    public string $name;\n\n    public function sayHello(): string\n    {\n        return \"Hello, \" . $this->name;\n    }\n}\n```\n\nयसबाट object बनाउनुहोस्:\n\n```php\n$user = new User();\n$user->name = \"Rajan\";\necho $user->sayHello();   // Hello, Rajan\n```\n\n```text\n             Class\n          ┌───────────┐\n          │   User    │\n          ├───────────┤\n          │ name      │\n          │ sayHello  │\n          └─────┬─────┘\n                │\n             new User()\n                │\n                ↓\n          ┌───────────┐\n          │  Object   │\n          │  Rajan    │\n          └───────────┘\n```\n\nLaravel ले जताततै class प्रयोग गर्छ: `Controller → Service → Repository → Model → Database`।\n\n---\n\n### 2. मध्यम — interface र trait\n\n<b>Interface</b> (class ले कुन method दिनैपर्छ भन्ने सम्झौता) ले class ले <b>के</b> गर्छ भन्छ, <b>कसरी</b> होइन।\n\n```php\ninterface PaymentGateway\n{\n    public function charge(float $amount): bool;\n}\n\nclass StripePayment implements PaymentGateway\n{\n    public function charge(float $amount): bool\n    {\n        return true;\n    }\n}\n```\n\n```text\nInterface\n   │ नियम तोक्छ\n   ↓\nPaymentGateway\n   │\n   ├───────────────┐\n   ↓               ↓\nStripe          PayPal\n```\n\nदुबैले `charge()` दिनैपर्छ। कुनै कुराले के गर्छ र कसरी गर्छ छुट्याउनुपर्दा Laravel ले interface प्रयोग गर्छ।\n\n<b>Trait</b> (पुनःप्रयोग्य method र property को समूह) ले असम्बन्धित class बीच code बाँड्छ:\n\n```php\ntrait HasActivityLog\n{\n    public function logActivity(): void\n    {\n        echo \"Activity logged\";\n    }\n}\n\nclass User  { use HasActivityLog; }\nclass Order { use HasActivityLog; }\n```\n\n```text\n             HasActivityLog\n                    │\n          ┌─────────┴─────────┐\n          ↓                   ↓\n        User                Order\n          │                   │\n          └──── logActivity ──┘\n```\n\n---\n\n### 3. उन्नत — abstract class\n\n<b>Abstract class</b> (सिधै नबनाइने, inherit गर्नका लागि बनेको class) ले child लाई साझा व्यवहार दिन्छ र बाँकी भर्न बाध्य पार्छ:\n\n```php\nabstract class Animal\n{\n    public function sleep(): void\n    {\n        echo \"Sleeping\";\n    }\n\n    abstract public function makeSound(): string;\n}\n\nclass Dog extends Animal\n{\n    public function makeSound(): string\n    {\n        return \"Woof\";\n    }\n}\n```\n\n`Animal` abstract भएकाले `new Animal()` मिल्दैन।\n\n```text\n             Animal\n          (abstract)\n               │\n       ┌───────┴───────┐\n       ↓               ↓\n      Dog             Cat\n       │               │\n     Woof             Meow\n```\n\n<b>Interface कि abstract class?</b> Interface शुद्ध सम्झौता हो, code बिनाको। Abstract class आंशिक रूपमा बनेको parent हो जसले साझा code पनि बोक्छ।",
        jp: "30日間のLaravelの旅に入る前に、PHP・Git・SQL・Webの基礎がいくつか要る。<b>この段階は30日には含まれない</b>。準備のためのチェックリストだ。\n\nここにあるすべてに熟達している必要はない。PHPの構文で詰まらずにLaravelの各回を追える程度で足りる。\n\n```text\n                  Laravel 13\n                      │\n          ┌───────────┼───────────┐\n          ↓           ↓           ↓\n         PHP         SQL         HTTP\n          │           │           │\n          ↓           ↓           ↓\n      Composer       Database     Web\n          │\n          ↓\n         Git\n```\n\nLaravelはこれらの上に建っている。土台が弱ければLaravelは複雑に感じ、土台が明確ならずっと易しくなる。\n\n---\n\n### 1. 基本 — クラス\n\n<b>クラス</b>（オブジェクトを作るための設計図）は、そのオブジェクトが何を持ち何をするかを記述する。\n\n```php\nclass User\n{\n    public string $name;\n\n    public function sayHello(): string\n    {\n        return \"Hello, \" . $this->name;\n    }\n}\n```\n\nそこからオブジェクトを作る:\n\n```php\n$user = new User();\n$user->name = \"Rajan\";\necho $user->sayHello();   // Hello, Rajan\n```\n\n```text\n             Class\n          ┌───────────┐\n          │   User    │\n          ├───────────┤\n          │ name      │\n          │ sayHello  │\n          └─────┬─────┘\n                │\n             new User()\n                │\n                ↓\n          ┌───────────┐\n          │  Object   │\n          │  Rajan    │\n          └───────────┘\n```\n\nLaravelはいたるところでクラスを使う。`Controller → Service → Repository → Model → Database`。\n\n---\n\n### 2. 中級 — インターフェースとトレイト\n\n<b>インターフェース</b>（クラスが備えるべきメソッドを定める契約）は、<b>何を</b>するかを定め、<b>どうやって</b>は定めない。\n\n```php\ninterface PaymentGateway\n{\n    public function charge(float $amount): bool;\n}\n\nclass StripePayment implements PaymentGateway\n{\n    public function charge(float $amount): bool\n    {\n        return true;\n    }\n}\n```\n\n```text\nInterface\n   │ ルールを定める\n   ↓\nPaymentGateway\n   │\n   ├───────────────┐\n   ↓               ↓\nStripe          PayPal\n```\n\nどちらも `charge()` を備えねばならない。「何をするか」と「どうやるか」を分けたいとき、Laravelはインターフェースを使う。\n\n<b>トレイト</b>（再利用できるメソッドとプロパティの束）は、無関係なクラス同士でコードを共有する:\n\n```php\ntrait HasActivityLog\n{\n    public function logActivity(): void\n    {\n        echo \"Activity logged\";\n    }\n}\n\nclass User  { use HasActivityLog; }\nclass Order { use HasActivityLog; }\n```\n\n```text\n             HasActivityLog\n                    │\n          ┌─────────┴─────────┐\n          ↓                   ↓\n        User                Order\n          │                   │\n          └──── logActivity ──┘\n```\n\n---\n\n### 3. 上級 — 抽象クラス\n\n<b>抽象クラス</b>（直接は生成せず、継承されるためのクラス）は、子に共有の振る舞いを与え、残りを埋めることを強いる:\n\n```php\nabstract class Animal\n{\n    public function sleep(): void\n    {\n        echo \"Sleeping\";\n    }\n\n    abstract public function makeSound(): string;\n}\n\nclass Dog extends Animal\n{\n    public function makeSound(): string\n    {\n        return \"Woof\";\n    }\n}\n```\n\n`Animal` は抽象なので `new Animal()` はできない。\n\n```text\n             Animal\n          (abstract)\n               │\n       ┌───────┴───────┐\n       ↓               ↓\n      Dog             Cat\n       │               │\n     Woof             Meow\n```\n\n<b>インターフェースか抽象クラスか。</b>インターフェースはコードを持たない純粋な契約。抽象クラスは共有コードも持つ、半分できた親だ。",
      },
      diagram: `What Laravel stands on

                  Laravel 13
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
         PHP         SQL         HTTP
          │           │           │
          ↓           ↓           ↓
      Composer       Database     Web
          │
          ↓
         Git


Class to object

             Class                        Object
          ┌───────────┐                ┌───────────┐
          │   User    │  new User()    │  Rajan    │
          │ name      │ ─────────────► │           │
          │ sayHello  │                └───────────┘
          └───────────┘


Three ways to share behaviour

interface          a contract, no code
                   Stripe and PayPal both promise charge()

trait              reusable methods, dropped into any class
                   User and Order both gain logActivity()

abstract class     a half-built parent
                   Dog and Cat inherit sleep(), must write makeSound()`,
      codeExample: {
        title: { en: "Classes, interfaces, traits and abstract classes", np: "Class, interface, trait र abstract class", jp: "クラス・インターフェース・トレイト・抽象クラス" },
        code: `<?php

// ── 1. Basic — a class is a blueprint ─────────────────────────────
class User
{
    public string $name;

    public function sayHello(): string
    {
        return "Hello, " . $this->name;
    }
}

$user = new User();
$user->name = "Rajan";
echo $user->sayHello();          // Hello, Rajan

// ── 2. Interface — what, not how ──────────────────────────────────
interface PaymentGateway
{
    public function charge(float $amount): bool;
}

class StripePayment implements PaymentGateway
{
    public function charge(float $amount): bool
    {
        return true;                 // Stripe's own way of charging
    }
}

class PayPalPayment implements PaymentGateway
{
    public function charge(float $amount): bool
    {
        return true;                 // a different way, same contract
    }
}

// ── 3. Trait — shared code between unrelated classes ──────────────
trait HasActivityLog
{
    public function logActivity(): void
    {
        echo "Activity logged";
    }
}

class Order
{
    use HasActivityLog;              // Order and User are unrelated,
}                                    // but both can log activity

// ── 4. Abstract class — a parent you cannot instantiate ───────────
abstract class Animal
{
    public function sleep(): void    // shared with every child
    {
        echo "Sleeping";
    }

    abstract public function makeSound(): string;   // each child fills this in
}

class Dog extends Animal
{
    public function makeSound(): string
    {
        return "Woof";
    }
}

// $animal = new Animal();           // Error: Animal is abstract
$dog = new Dog();
$dog->sleep();                       // inherited
echo $dog->makeSound();              // Woof`,
      },
      keyTakeaways: [
        { en: "Phase 0 is a <b>preparation checklist</b>, not one of the 30 days.", np: "Phase 0 <b>तयारीको checklist</b> हो, 30 दिनमध्ये एक होइन।", jp: "Phase 0は30日の一部ではなく<b>準備のチェックリスト</b>。" },
        { en: "A <b>class</b> is a blueprint; `new` turns it into an object you can use.", np: "<b>Class</b> खाका हो; `new` ले यसलाई प्रयोग गर्न मिल्ने object बनाउँछ।", jp: "<b>クラス</b>は設計図で、`new` が使えるオブジェクトに変える。" },
        { en: "An <b>interface</b> is a contract: it says which methods must exist, never how they work.", np: "<b>Interface</b> सम्झौता हो: कुन method हुनैपर्छ भन्छ, कसरी काम गर्छ भन्दैन।", jp: "<b>インターフェース</b>は契約。どのメソッドが要るかを言い、動き方は言わない。" },
        { en: "A <b>trait</b> shares methods between classes that are otherwise unrelated.", np: "<b>Trait</b> ले असम्बन्धित class बीच method बाँड्छ।", jp: "<b>トレイト</b>は無関係なクラス同士でメソッドを共有する。" },
        { en: "An <b>abstract class</b> cannot be instantiated; it gives children shared code plus methods they must implement.", np: "<b>Abstract class</b> बनाउन मिल्दैन; यसले child लाई साझा code र लागू गर्नैपर्ने method दिन्छ।", jp: "<b>抽象クラス</b>は生成できない。子に共有コードと実装必須のメソッドを与える。" },
        { en: "Interface = pure contract. Abstract class = half-built parent with code in it.", np: "Interface = शुद्ध सम्झौता। Abstract class = code भएको आधा बनेको parent।", jp: "インターフェース＝純粋な契約。抽象クラス＝コードを持つ半完成の親。" },
      ],
      commonMistakes: [
        { en: "<b>Trying to instantiate an abstract class</b> — `new Animal()` is a fatal error; you instantiate `Dog`, which extends it.", np: "<b>Abstract class instantiate गर्न खोज्नु</b> — `new Animal()` fatal error हो; तपाईं `Dog` बनाउनुहुन्छ, जसले extend गर्छ।", jp: "<b>抽象クラスを生成しようとする</b> — `new Animal()` は致命的エラー。生成するのは継承した `Dog`。" },
        { en: "<b>Putting code inside an interface</b> — an interface declares method signatures only. If you need shared code, use an abstract class or a trait.", np: "<b>Interface भित्र code राख्नु</b> — interface ले method signature मात्र घोषणा गर्छ। साझा code चाहिए abstract class वा trait प्रयोग गर्नुहोस्।", jp: "<b>インターフェースにコードを書く</b> — 宣言できるのはシグネチャだけ。共有コードが要るなら抽象クラスかトレイト。" },
        { en: "<b>Forgetting to implement an abstract method</b> — a child class that skips `makeSound()` will not compile; PHP requires every abstract method to be filled in.", np: "<b>Abstract method लागू गर्न बिर्सनु</b> — `makeSound()` छाड्ने child class चल्दैन; PHP ले हरेक abstract method भर्न माग्छ।", jp: "<b>抽象メソッドの実装を忘れる</b> — `makeSound()` を省いた子クラスは動かない。PHPはすべての抽象メソッドの実装を求める。" },
        { en: "<b>Reaching for a trait when inheritance fits</b> — traits suit unrelated classes needing the same helper, not a genuine parent-child relationship.", np: "<b>Inheritance मिल्ने ठाउँमा trait प्रयोग गर्नु</b> — trait उही helper चाहिने असम्बन्धित class लाई सुहाउँछ, साँचो parent-child सम्बन्धलाई होइन।", jp: "<b>継承が合う場面でトレイトを使う</b> — トレイトは同じ補助が要る無関係なクラス向けで、本来の親子関係向けではない。" },
      ],
      quiz: [
        {
          question: { en: "What is a class?", np: "Class के हो?", jp: "クラスとは何か?" },
          options: [
            { en: "A database table", np: "Database को table", jp: "データベースのテーブル" },
            { en: "A blueprint for creating objects", np: "Object बनाउने खाका", jp: "オブジェクトを作る設計図" },
            { en: "An HTTP request", np: "एउटा HTTP request", jp: "HTTPリクエスト" },
            { en: "A Git branch", np: "एउटा Git branch", jp: "Gitのブランチ" },
          ],
          correctIndex: 1,
          explanation: { en: "`new User()` turns the blueprint into an object you can use.", np: "`new User()` ले खाकालाई प्रयोग गर्न मिल्ने object बनाउँछ।", jp: "`new User()` が設計図を使えるオブジェクトに変える。" },
        },
        {
          question: { en: "What does an interface provide?", np: "Interface ले के दिन्छ?", jp: "インターフェースが与えるものは?" },
          options: [
            { en: "A database connection", np: "Database connection", jp: "データベース接続" },
            { en: "A Git repository", np: "एउटा Git repository", jp: "Gitリポジトリ" },
            { en: "A contract that a class must follow", np: "Class ले पालना गर्नैपर्ने सम्झौता", jp: "クラスが従うべき契約" },
            { en: "A browser cookie", np: "एउटा browser cookie", jp: "ブラウザのクッキー" },
          ],
          correctIndex: 2,
          explanation: { en: "It says which methods must exist, never how they work.", np: "यसले कुन method हुनैपर्छ भन्छ, कसरी काम गर्छ भन्दैन।", jp: "どのメソッドが要るかを言い、動き方は言わない。" },
        },
        {
          question: { en: "When is a trait the right tool?", np: "Trait कहिले सही उपकरण हो?", jp: "トレイトが適するのはどんなときか?" },
          options: [
            { en: "When one class is a kind of another", np: "एउटा class अर्कोको प्रकार हुँदा", jp: "一方が他方の一種であるとき" },
            { en: "When two unrelated classes need the same helper method", np: "दुई असम्बन्धित class लाई उही helper method चाहिँदा", jp: "無関係な2つのクラスが同じ補助メソッドを必要とするとき" },
            { en: "When you need a database table", np: "Database table चाहिँदा", jp: "データベーステーブルが要るとき" },
          ],
          correctIndex: 1,
          explanation: { en: "A genuine parent-child relationship is what inheritance is for.", np: "साँचो parent-child सम्बन्धका लागि inheritance हो।", jp: "本当の親子関係には継承を使う。" },
        },
        {
          question: { en: "What happens with `new Animal()` when `Animal` is abstract?", np: "`Animal` abstract हुँदा `new Animal()` मा के हुन्छ?", jp: "`Animal` が抽象のとき `new Animal()` はどうなるか?" },
          options: [
            { en: "It creates an empty object", np: "यसले खाली object बनाउँछ", jp: "空のオブジェクトができる" },
            { en: "It silently returns null", np: "यसले चुपचाप null फर्काउँछ", jp: "静かにnullを返す" },
            { en: "It is a fatal error — abstract classes cannot be instantiated", np: "यो fatal error हो — abstract class instantiate गर्न मिल्दैन", jp: "致命的エラー。抽象クラスは生成できない" },
          ],
          correctIndex: 2,
          explanation: { en: "You instantiate a child such as `Dog`, which implements the abstract methods.", np: "तपाईं `Dog` जस्तो child बनाउनुहुन्छ, जसले abstract method लागू गर्छ।", jp: "生成するのは、抽象メソッドを実装した `Dog` のような子。" },
        },
        {
          question: { en: "What is the difference between an interface and an abstract class?", np: "Interface र abstract class बीच के फरक छ?", jp: "インターフェースと抽象クラスの違いは?" },
          options: [
            { en: "They are the same thing with different keywords", np: "ती फरक keyword भएका उही कुरा हुन्", jp: "キーワードが違うだけの同じもの" },
            { en: "An interface is a pure contract; an abstract class can also carry shared code", np: "Interface शुद्ध सम्झौता हो; abstract class ले साझा code पनि बोक्न सक्छ", jp: "インターフェースは純粋な契約。抽象クラスは共有コードも持てる" },
            { en: "An interface can be instantiated", np: "Interface instantiate गर्न मिल्छ", jp: "インターフェースは生成できる" },
          ],
          correctIndex: 1,
          explanation: { en: "Use an interface for a promise; an abstract class when children also share behaviour.", np: "वाचाका लागि interface; child ले व्यवहार पनि बाँड्दा abstract class।", jp: "約束にはインターフェース、子が振る舞いも共有するなら抽象クラス。" },
        },
      ],
    },
    {
      id: "modern-php",
      title: { en: "Modern PHP — namespaces, types, enums, closures", np: "आधुनिक PHP — namespace, type, enum, closure", jp: "現代のPHP — 名前空間・型・Enum・クロージャ" },
      durationMinutes: 10,
      explanation: {
        en: "These are the pieces of modern PHP you will meet on the first day of Laravel code.\n\n---\n\n### 1. Basic — namespaces and `use`\n\nA <b>namespace</b> (a way to organise PHP classes and avoid naming conflicts) tells PHP where a class belongs:\n\n```php\nnamespace App\\Services;\n\nclass UserService {}\n```\n\nAnother class can share the name in a different namespace, and they stay separate: `App\\Services\\UserService` and `App\\Admin\\UserService`.\n\nA Laravel project has many classes, and namespaces keep them apart:\n\n```text\napp/\n├── Models/\n├── Controllers/\n├── Services/\n├── Jobs/\n├── Events/\n└── Requests/\n```\n\nThe `use` statement (a way to import a class so you do not write its full namespace every time) keeps code readable:\n\n```php\n// without use\n$user = new \\App\\Models\\User();\n\n// with use\nuse App\\Models\\User;\n\n$user = new User();\n```\n\nYou will see `use` at the top of nearly every Laravel file.\n\n---\n\n### 2. Intermediate — type hints, unions, nullables\n\nA <b>type hint</b> (telling PHP what type a parameter or return value should be) makes code safer:\n\n```php\nfunction add(int $a, int $b): int\n{\n    return $a + $b;\n}\n```\n\n`int $a` says the parameter must be an integer; `: int` says the function returns one.\n\nA <b>union type</b> (a value allowed to be one of several types) uses `|`:\n\n```php\nfunction findUser(int|string $id) {}\n\nfindUser(10);\nfindUser(\"10\");     // both valid\n```\n\nA <b>nullable type</b> (a type that may also be `null`) uses `?`:\n\n```php\nfunction getUserName(?string $name): string\n{\n    return $name ?? \"Unknown\";\n}\n```\n\n`?string` means a string <b>or</b> `null`. The `??` is the null coalescing operator — use the left value unless it is null, otherwise the right one.\n\n---\n\n### 3. Advanced — enums, readonly, promotion, attributes\n\nAn <b>enum</b> (a fixed list of allowed values) stops stray strings getting into your data:\n\n```php\nenum OrderStatus: string\n{\n    case Pending = 'pending';\n    case Paid = 'paid';\n    case Cancelled = 'cancelled';\n}\n\n$status = OrderStatus::Paid;\n```\n\n```text\nOrderStatus\n     │\n     ├── pending\n     ├── paid\n     └── cancelled\n```\n\nThe value has to come from the defined choices, so `\"something-random\"` is impossible.\n\nA <b>readonly property</b> (a property that cannot change after it is first set) prevents accidental writes:\n\n```php\nclass User\n{\n    public function __construct(\n        public readonly int $id\n    ) {}\n}\n\n$user = new User(10);\n$user->id = 20;      // Error: id is readonly\n```\n\n<b>Constructor property promotion</b> (declaring and assigning a property in the constructor signature) removes boilerplate:\n\n```php\n// without promotion\nclass User\n{\n    public string $name;\n\n    public function __construct(string $name)\n    {\n        $this->name = $name;\n    }\n}\n\n// with promotion\nclass User\n{\n    public function __construct(\n        public string $name\n    ) {}\n}\n```\n\nLaravel code uses this style constantly.\n\nAn <b>attribute</b> (metadata attached to a class, method or property) uses `#[...]`:\n\n```php\n#[SomeAttribute]\npublic function index() {}\n```\n\nYou do not need to master attributes before Laravel — just recognise the syntax.\n\n---\n\n### Closures and arrow functions\n\nA <b>closure</b> (a function stored in a variable or passed to another function) is everywhere in Laravel:\n\n```php\n$greet = function (string $name) {\n    return \"Hello \" . $name;\n};\n\necho $greet(\"Rajan\");        // Hello Rajan\n```\n\nThat route definition you will write on day 2 is a closure:\n\n```php\nRoute::get('/hello', function () {\n    return 'Hello World';\n});\n```\n\nAn <b>arrow function</b> (shorter syntax for a small closure) uses `fn`:\n\n```php\n$result = array_map(fn ($number) => $number * 2, [1, 2, 3]);\n// [2, 4, 6]\n```\n\n---\n\n### Exceptions\n\nAn <b>exception</b> (an object representing an error or unexpected situation) lets you handle problems deliberately:\n\n```php\ntry {\n    throw new Exception(\"Something went wrong\");\n} catch (Exception $e) {\n    echo $e->getMessage();       // Something went wrong\n}\n```\n\n```text\nCode runs\n   │\n   ↓\nProblem?\n   │\n  YES\n   │\n   ↓\nthrow Exception\n   │\n   ↓\ncatch\n   │\n   ↓\nHandle error\n```\n\nLaravel builds its own exception handling on top of this.",
        np: "Laravel को पहिलो दिनकै code मा भेटिने आधुनिक PHP का टुक्रा यी हुन्।\n\n---\n\n### 1. आधारभूत — namespace र `use`\n\n<b>Namespace</b> (PHP class व्यवस्थित गर्ने र नाम ठोक्किन नदिने तरिका) ले class कहाँको हो भन्छ:\n\n```php\nnamespace App\\Services;\n\nclass UserService {}\n```\n\nअर्को namespace मा उही नाम हुन सक्छ र ती छुट्टै रहन्छन्: `App\\Services\\UserService` र `App\\Admin\\UserService`।\n\nLaravel project मा धेरै class हुन्छन्, र namespace ले तिनलाई अलग राख्छ:\n\n```text\napp/\n├── Models/\n├── Controllers/\n├── Services/\n├── Jobs/\n├── Events/\n└── Requests/\n```\n\n`use` statement (पूरा namespace हरेक पटक नलेख्न class import गर्ने तरिका) ले code पठनीय बनाउँछ:\n\n```php\n// use बिना\n$user = new \\App\\Models\\User();\n\n// use सँग\nuse App\\Models\\User;\n\n$user = new User();\n```\n\nझन्डै हरेक Laravel file को माथि `use` देख्नुहुनेछ।\n\n---\n\n### 2. मध्यम — type hint, union, nullable\n\n<b>Type hint</b> (parameter वा फर्कने मान कुन type हुनुपर्छ भन्नु) ले code सुरक्षित बनाउँछ:\n\n```php\nfunction add(int $a, int $b): int\n{\n    return $a + $b;\n}\n```\n\n`int $a` ले parameter integer हुनुपर्छ भन्छ; `: int` ले function ले integer फर्काउँछ भन्छ।\n\n<b>Union type</b> (धेरैमध्ये एक type हुन पाउने मान) ले `|` प्रयोग गर्छ:\n\n```php\nfunction findUser(int|string $id) {}\n\nfindUser(10);\nfindUser(\"10\");     // दुबै मान्य\n```\n\n<b>Nullable type</b> (`null` पनि हुन सक्ने type) ले `?` प्रयोग गर्छ:\n\n```php\nfunction getUserName(?string $name): string\n{\n    return $name ?? \"Unknown\";\n}\n```\n\n`?string` को अर्थ string <b>वा</b> `null`। `??` null coalescing operator हो — बायाँ मान null नभए त्यही, नत्र दायाँ।\n\n---\n\n### 3. उन्नत — enum, readonly, promotion, attribute\n\n<b>Enum</b> (अनुमति भएका मानको तय सूची) ले data मा अनौठो string पस्न दिँदैन:\n\n```php\nenum OrderStatus: string\n{\n    case Pending = 'pending';\n    case Paid = 'paid';\n    case Cancelled = 'cancelled';\n}\n\n$status = OrderStatus::Paid;\n```\n\n```text\nOrderStatus\n     │\n     ├── pending\n     ├── paid\n     └── cancelled\n```\n\nमान परिभाषित छनोटबाटै आउनुपर्छ, त्यसैले `\"something-random\"` असम्भव छ।\n\n<b>Readonly property</b> (पहिलो पटक सेट भएपछि नबदलिने property) ले संयोगवश लेखाइ रोक्छ:\n\n```php\nclass User\n{\n    public function __construct(\n        public readonly int $id\n    ) {}\n}\n\n$user = new User(10);\n$user->id = 20;      // Error: id readonly छ\n```\n\n<b>Constructor property promotion</b> (constructor signature मै property घोषणा र assign गर्नु) ले दोहोरो लेखाइ हटाउँछ:\n\n```php\n// promotion बिना\nclass User\n{\n    public string $name;\n\n    public function __construct(string $name)\n    {\n        $this->name = $name;\n    }\n}\n\n// promotion सँग\nclass User\n{\n    public function __construct(\n        public string $name\n    ) {}\n}\n```\n\nLaravel code ले यो शैली निरन्तर प्रयोग गर्छ।\n\n<b>Attribute</b> (class, method वा property मा जोडिएको metadata) ले `#[...]` प्रयोग गर्छ:\n\n```php\n#[SomeAttribute]\npublic function index() {}\n```\n\nLaravel अघि attribute मा दख्खल चाहिँदैन — syntax चिन्न सके पुग्छ।\n\n---\n\n### Closure र arrow function\n\n<b>Closure</b> (variable मा राखिने वा अर्को function लाई दिइने function) Laravel मा जताततै छ:\n\n```php\n$greet = function (string $name) {\n    return \"Hello \" . $name;\n};\n\necho $greet(\"Rajan\");        // Hello Rajan\n```\n\nदोस्रो दिन लेख्ने त्यो route परिभाषा closure हो:\n\n```php\nRoute::get('/hello', function () {\n    return 'Hello World';\n});\n```\n\n<b>Arrow function</b> (सानो closure को छोटो रूप) ले `fn` प्रयोग गर्छ:\n\n```php\n$result = array_map(fn ($number) => $number * 2, [1, 2, 3]);\n// [2, 4, 6]\n```\n\n---\n\n### Exception\n\n<b>Exception</b> (error वा अनपेक्षित अवस्था जनाउने object) ले समस्या सोचीविचारी सम्हाल्न दिन्छ:\n\n```php\ntry {\n    throw new Exception(\"Something went wrong\");\n} catch (Exception $e) {\n    echo $e->getMessage();       // Something went wrong\n}\n```\n\n```text\nCode runs\n   │\n   ↓\nProblem?\n   │\n  YES\n   │\n   ↓\nthrow Exception\n   │\n   ↓\ncatch\n   │\n   ↓\nHandle error\n```\n\nLaravel ले यसैमाथि आफ्नै exception handling बनाउँछ।",
        jp: "Laravelのコードを開いた初日に出会う、現代のPHPの部品がこれだ。\n\n---\n\n### 1. 基本 — 名前空間と `use`\n\n<b>名前空間</b>（PHPのクラスを整理し名前の衝突を避ける仕組み）は、そのクラスがどこに属すかを示す:\n\n```php\nnamespace App\\Services;\n\nclass UserService {}\n```\n\n別の名前空間に同名があっても、両者は別物として共存する。`App\\Services\\UserService` と `App\\Admin\\UserService`。\n\nLaravelのプロジェクトはクラスが多く、名前空間がそれらを分けている:\n\n```text\napp/\n├── Models/\n├── Controllers/\n├── Services/\n├── Jobs/\n├── Events/\n└── Requests/\n```\n\n`use` 文（毎回フル修飾名を書かずに済ませるための取り込み）はコードを読みやすくする:\n\n```php\n// use なし\n$user = new \\App\\Models\\User();\n\n// use あり\nuse App\\Models\\User;\n\n$user = new User();\n```\n\nほぼすべてのLaravelファイルの冒頭で `use` を見ることになる。\n\n---\n\n### 2. 中級 — 型宣言・ユニオン・null許容\n\n<b>型宣言</b>（引数や戻り値の型を指定すること）はコードを安全にする:\n\n```php\nfunction add(int $a, int $b): int\n{\n    return $a + $b;\n}\n```\n\n`int $a` は引数が整数であるべきことを、`: int` は戻り値が整数であることを示す。\n\n<b>ユニオン型</b>（複数の型のいずれかを許す）は `|` を使う:\n\n```php\nfunction findUser(int|string $id) {}\n\nfindUser(10);\nfindUser(\"10\");     // どちらも有効\n```\n\n<b>null許容型</b>（`null` も取りうる型）は `?` を使う:\n\n```php\nfunction getUserName(?string $name): string\n{\n    return $name ?? \"Unknown\";\n}\n```\n\n`?string` は文字列<b>または</b> `null`。`??` はnull合体演算子で、左がnullでなければ左を、そうでなければ右を使う。\n\n---\n\n### 3. 上級 — Enum・readonly・プロモーション・属性\n\n<b>Enum</b>（許される値の固定リスト）は、想定外の文字列がデータに混じるのを防ぐ:\n\n```php\nenum OrderStatus: string\n{\n    case Pending = 'pending';\n    case Paid = 'paid';\n    case Cancelled = 'cancelled';\n}\n\n$status = OrderStatus::Paid;\n```\n\n```text\nOrderStatus\n     │\n     ├── pending\n     ├── paid\n     └── cancelled\n```\n\n値は定義した選択肢から来るしかないので、`\"something-random\"` は不可能だ。\n\n<b>readonlyプロパティ</b>（一度設定したら変えられないプロパティ）は不用意な書き込みを防ぐ:\n\n```php\nclass User\n{\n    public function __construct(\n        public readonly int $id\n    ) {}\n}\n\n$user = new User(10);\n$user->id = 20;      // Error: idはreadonly\n```\n\n<b>コンストラクタのプロパティプロモーション</b>（コンストラクタの引数でプロパティを宣言し代入する）は定型文を減らす:\n\n```php\n// プロモーションなし\nclass User\n{\n    public string $name;\n\n    public function __construct(string $name)\n    {\n        $this->name = $name;\n    }\n}\n\n// プロモーションあり\nclass User\n{\n    public function __construct(\n        public string $name\n    ) {}\n}\n```\n\nLaravelのコードはこの書き方を多用する。\n\n<b>属性</b>（クラス・メソッド・プロパティに付けるメタデータ）は `#[...]` を使う:\n\n```php\n#[SomeAttribute]\npublic function index() {}\n```\n\nLaravelの前に属性を極める必要はない。構文が読めれば十分だ。\n\n---\n\n### クロージャとアロー関数\n\n<b>クロージャ</b>（変数に入れたり関数に渡したりできる関数）はLaravelのいたるところにある:\n\n```php\n$greet = function (string $name) {\n    return \"Hello \" . $name;\n};\n\necho $greet(\"Rajan\");        // Hello Rajan\n```\n\n2日目に書くことになるルート定義も、クロージャだ:\n\n```php\nRoute::get('/hello', function () {\n    return 'Hello World';\n});\n```\n\n<b>アロー関数</b>（小さなクロージャの短い書き方）は `fn` を使う:\n\n```php\n$result = array_map(fn ($number) => $number * 2, [1, 2, 3]);\n// [2, 4, 6]\n```\n\n---\n\n### 例外\n\n<b>例外</b>（エラーや想定外の状況を表すオブジェクト）は、問題を意図的に扱えるようにする:\n\n```php\ntry {\n    throw new Exception(\"Something went wrong\");\n} catch (Exception $e) {\n    echo $e->getMessage();       // Something went wrong\n}\n```\n\n```text\nCode runs\n   │\n   ↓\nProblem?\n   │\n  YES\n   │\n   ↓\nthrow Exception\n   │\n   ↓\ncatch\n   │\n   ↓\nHandle error\n```\n\nLaravelはこの上に独自の例外処理を組んでいる。",
      },
      diagram: `A full name, shortened once at the top of the file

App\\Models\\User
       │
       ↓
      use
       │
       ↓
     User


Types, narrowing what a value may be

int $a           an integer, nothing else
int|string $id   either one of the two
?string $name    a string, or null
: int            what the function hands back


An enum closes the list of valid values

OrderStatus
     │
     ├── pending
     ├── paid
     └── cancelled

"something-random" cannot get in


An exception, from problem to handled

Code runs
   │
   ↓
Problem? ── NO ──► carry on
   │
  YES
   ↓
throw Exception
   ↓
catch
   ↓
Handle error`,
      codeExample: {
        title: { en: "Namespaces, types, enums, closures and exceptions", np: "Namespace, type, enum, closure र exception", jp: "名前空間・型・Enum・クロージャ・例外" },
        code: `<?php

// ── 1. Basic — namespace and use ──────────────────────────────────
namespace App\\Services;

use App\\Models\\User;          // now "User" means App\\Models\\User

$user = new User();             // instead of new \\App\\Models\\User()

// ── 2. Type hints, unions and nullables ───────────────────────────
function add(int $a, int $b): int
{
    return $a + $b;             // parameters and return are both int
}

function findUser(int|string $id) {}   // either type is accepted

findUser(10);
findUser("10");

function getUserName(?string $name): string
{
    return $name ?? "Unknown";  // ?string means "string or null"
}

// ── 3. Enums close the list of valid values ───────────────────────
enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
}

$status = OrderStatus::Paid;    // "something-random" is impossible

// ── 4. readonly and constructor property promotion ────────────────
class Order
{
    public function __construct(
        public readonly int $id,     // declared and assigned in one line
        public string $reference,
    ) {}
}

$order = new Order(10, "ORD-1");
// $order->id = 20;             // Error: id is readonly
$order->reference = "ORD-2";    // fine, not readonly

// ── 5. Closures and arrow functions ───────────────────────────────
$greet = function (string $name) {
    return "Hello " . $name;
};

echo $greet("Rajan");           // Hello Rajan

$doubled = array_map(fn ($n) => $n * 2, [1, 2, 3]);   // [2, 4, 6]

// Laravel routes are closures you will write on day 2
// Route::get('/hello', function () { return 'Hello World'; });

// ── 6. Exceptions ─────────────────────────────────────────────────
try {
    throw new \\Exception("Something went wrong");
} catch (\\Exception $e) {
    echo $e->getMessage();      // Something went wrong
}`,
      },
      keyTakeaways: [
        { en: "A <b>namespace</b> says where a class belongs, so two classes can share a name.", np: "<b>Namespace</b> ले class कहाँको हो भन्छ, त्यसैले दुई class ले नाम बाँड्न सक्छन्।", jp: "<b>名前空間</b>はクラスの所属を示し、同名のクラスが共存できるようにする。" },
        { en: "<b>`use`</b> imports a class once, so you write `User` instead of the full path.", np: "<b>`use`</b> ले class एक पटक import गर्छ, त्यसैले पूरा path होइन `User` लेख्नुहुन्छ।", jp: "<b>`use`</b> は一度取り込むことで、フルパスではなく `User` と書けるようにする。" },
        { en: "A <b>type hint</b> states what a parameter takes and what the function returns.", np: "<b>Type hint</b> ले parameter के लिन्छ र function ले के फर्काउँछ भन्छ।", jp: "<b>型宣言</b>は引数が何を取り、関数が何を返すかを述べる。" },
        { en: "`int|string` is a <b>union</b> (either type); `?string` is <b>nullable</b> (string or null).", np: "`int|string` <b>union</b> हो (कुनै एक); `?string` <b>nullable</b> (string वा null)।", jp: "`int|string` は<b>ユニオン</b>（どちらか）、`?string` は<b>null許容</b>（文字列かnull）。" },
        { en: "An <b>enum</b> fixes the list of valid values, so a stray string cannot get in.", np: "<b>Enum</b> ले मान्य मानको सूची तय गर्छ, त्यसैले अनौठो string पस्न सक्दैन।", jp: "<b>Enum</b> は有効な値のリストを固定し、想定外の文字列を入れない。" },
        { en: "<b>`readonly`</b> blocks writes after construction; <b>promotion</b> declares and assigns in one line.", np: "<b>`readonly`</b> ले निर्माणपछि लेखाइ रोक्छ; <b>promotion</b> ले एकै लाइनमा घोषणा र assign गर्छ।", jp: "<b>`readonly`</b> は生成後の書き込みを止め、<b>プロモーション</b>は宣言と代入を1行で行う。" },
        { en: "A <b>closure</b> is a function in a variable — Laravel routes are closures.", np: "<b>Closure</b> variable भित्रको function हो — Laravel का route closure हुन्।", jp: "<b>クロージャ</b>は変数に入った関数。Laravelのルートはクロージャだ。" },
      ],
      commonMistakes: [
        { en: "<b>Forgetting the `use` line</b> — PHP then looks for `User` in the current namespace and reports a class-not-found error, even though the file exists.", np: "<b>`use` line बिर्सनु</b> — अनि PHP ले हालको namespace मा `User` खोज्छ र file भए पनि class-not-found error दिन्छ।", jp: "<b>`use` 行を忘れる</b> — PHPは現在の名前空間で `User` を探し、ファイルがあってもクラス未検出エラーになる。" },
        { en: "<b>Writing `string $name` when null is possible</b> — passing `null` throws a TypeError. Use `?string` and handle the null case.", np: "<b>Null सम्भव हुँदा `string $name` लेख्नु</b> — `null` पठाउँदा TypeError आउँछ। `?string` प्रयोग गरी null अवस्था सम्हाल्नुहोस्।", jp: "<b>nullがありうるのに `string $name` と書く</b> — `null` を渡すとTypeErrorになる。`?string` にしてnullを扱う。" },
        { en: "<b>Assigning to a readonly property</b> — `$user->id = 20` is an error after construction; set it in the constructor or drop `readonly`.", np: "<b>Readonly property मा assign गर्नु</b> — निर्माणपछि `$user->id = 20` error हो; constructor मै सेट गर्नुहोस् वा `readonly` हटाउनुहोस्।", jp: "<b>readonlyプロパティへ代入する</b> — 生成後の `$user->id = 20` はエラー。コンストラクタで設定するか `readonly` を外す。" },
        { en: "<b>Catching an exception and doing nothing</b> — an empty `catch` block hides the failure and makes the bug much harder to find later.", np: "<b>Exception समातेर केही नगर्नु</b> — खाली `catch` ले असफलता लुकाउँछ र पछि bug भेट्टाउन धेरै गाह्रो बनाउँछ।", jp: "<b>例外を捕まえて何もしない</b> — 空の `catch` は失敗を隠し、後からバグを見つけにくくする。" },
      ],
      quiz: [
        {
          question: { en: "What does `?string` mean?", np: "`?string` को अर्थ के हो?", jp: "`?string` の意味は?" },
          options: [
            { en: "String or `null` is allowed", np: "String वा `null` अनुमति छ", jp: "文字列または `null` が許される" },
            { en: "Only strings are allowed", np: "String मात्र अनुमति छ", jp: "文字列のみ許される" },
            { en: "Only integers are allowed", np: "Integer मात्र अनुमति छ", jp: "整数のみ許される" },
            { en: "Anything is allowed", np: "जे पनि अनुमति छ", jp: "何でも許される" },
          ],
          correctIndex: 0,
          explanation: { en: "The `?` adds `null` to whatever type follows it.", np: "`?` ले पछिको जुनसुकै type मा `null` थप्छ।", jp: "`?` は続く型に `null` を加える。" },
        },
        {
          question: { en: "What does `use App\\Models\\User;` do?", np: "`use App\\Models\\User;` ले के गर्छ?", jp: "`use App\\Models\\User;` は何をするか?" },
          options: [
            { en: "Imports the class so you can write `User` instead of the full path", np: "Class import गर्छ ताकि पूरा path होइन `User` लेख्न सकियोस्", jp: "クラスを取り込み、フルパスではなく `User` と書けるようにする" },
            { en: "Creates a new User object", np: "नयाँ User object बनाउँछ", jp: "新しいUserオブジェクトを作る" },
            { en: "Runs the User class", np: "User class चलाउँछ", jp: "Userクラスを実行する" },
          ],
          correctIndex: 0,
          explanation: { en: "Without it, PHP looks for `User` in the current namespace and fails.", np: "यसबिना, PHP ले हालको namespace मा `User` खोज्छ र असफल हुन्छ।", jp: "無ければPHPは現在の名前空間で `User` を探し、失敗する。" },
        },
        {
          question: { en: "Why use an enum instead of plain strings for order status?", np: "Order status मा सादा string को सट्टा enum किन?", jp: "注文ステータスに素の文字列でなくEnumを使う理由は?" },
          options: [
            { en: "The value must come from the defined list, so a typo cannot get in", np: "मान परिभाषित सूचीबाटै आउनुपर्छ, त्यसैले typo पस्न सक्दैन", jp: "値は定義したリストから来るしかなく、打ち間違いが入らないから" },
            { en: "Enums are faster", np: "Enum छिटो हुन्छन्", jp: "Enumの方が速いから" },
            { en: "Enums are stored in the database automatically", np: "Enum स्वतः database मा राखिन्छन्", jp: "Enumは自動でDBに保存されるから" },
          ],
          correctIndex: 0,
          explanation: { en: "`\"something-random\"` becomes impossible rather than merely unlikely.", np: "`\"something-random\"` असम्भाव्य होइन, असम्भव बन्छ।", jp: "`\"something-random\"` は「起きにくい」ではなく「起こりえない」になる。" },
        },
        {
          question: { en: "What does constructor property promotion save you from writing?", np: "Constructor property promotion ले के लेख्नबाट जोगाउँछ?", jp: "コンストラクタのプロパティプロモーションは何を書かずに済ませるか?" },
          options: [
            { en: "The class keyword", np: "`class` keyword", jp: "`class` キーワード" },
            { en: "The return type", np: "फर्कने type", jp: "戻り値の型" },
            { en: "The separate property declaration and the `$this->name = $name` assignment", np: "छुट्टै property घोषणा र `$this->name = $name` assignment", jp: "別々のプロパティ宣言と `$this->name = $name` の代入" },
          ],
          correctIndex: 2,
          explanation: { en: "The parameter declares the property and assigns it in one line.", np: "Parameter ले एकै लाइनमा property घोषणा र assign गर्छ।", jp: "引数が1行でプロパティの宣言と代入を兼ねる。" },
        },
        {
          question: { en: "What is a closure?", np: "Closure के हो?", jp: "クロージャとは何か?" },
          options: [
            { en: "A class that cannot be extended", np: "Extend गर्न नमिल्ने class", jp: "継承できないクラス" },
            { en: "A function stored in a variable or passed to another function", np: "Variable मा राखिने वा अर्को function लाई दिइने function", jp: "変数に入れたり関数に渡したりできる関数" },
            { en: "A closed database connection", np: "बन्द भएको database connection", jp: "閉じたDB接続" },
          ],
          correctIndex: 1,
          explanation: { en: "The function you pass to `Route::get()` is a closure.", np: "`Route::get()` लाई दिइने function closure हो।", jp: "`Route::get()` に渡す関数がクロージャ。" },
        },
      ],
    },
    {
      id: "composer-git-sql",
      title: { en: "Composer, Git and SQL", np: "Composer, Git र SQL", jp: "Composer・Git・SQL" },
      durationMinutes: 9,
      explanation: {
        en: "Three tools you will use every day, none of which Laravel replaces.\n\n---\n\n### 1. Basic — Composer\n\n<b>Composer</b> (PHP's dependency manager) installs and manages the packages your project needs. A <b>package</b> (code written by someone else that your application uses) arrives with one command:\n\n```bash\ncomposer require laravel/framework\n```\n\nIf you know JavaScript, the mapping is direct:\n\n```text\nJavaScript          PHP\n\nnpm                 Composer\npackage.json        composer.json\nnode_modules        vendor/\nnpm install         composer install\nnpm update          composer update\n```\n\n`composer.json` answers \"what packages does my project need?\":\n\n```json\n{\n    \"require\": {\n        \"laravel/framework\": \"^13.0\"\n    }\n}\n```\n\n<b>`composer install`</b> installs the versions already recorded for the project — this is what you run after cloning:\n\n```text\ngit clone project\n       ↓\ncomposer install\n       ↓\n   vendor/\n       ↓\nLaravel can run\n```\n\n<b>`composer update`</b> looks for newer versions allowed by the rules in `composer.json` and updates them. The difference matters:\n\n```text\ncomposer install → install the versions recorded for the project\ncomposer update  → find newer allowed versions and change them\n```\n\n---\n\n### 2. Intermediate — Git\n\n<b>Git</b> (a version control system that tracks changes to your code) lets you work without fear of losing anything. You need `branch`, `checkout` or `switch`, `add`, `commit`, `merge`, `pull` and `push`, and this workflow:\n\n```text\n              main\n               │\n            branch\n               │\n               ↓\n        Make changes\n               │\n               ↓\n             git add\n               │\n               ↓\n           git commit\n               │\n               ↓\n            git push\n               │\n               ↓\n          Pull Request\n```\n\nAdvanced Git can wait. Being comfortable with branches and commits cannot.\n\n---\n\n### 3. Advanced — SQL\n\nLaravel makes database work easier, but it does not remove the need to understand SQL. You should recognise `SELECT`, `WHERE`, `JOIN`, `INSERT`, `UPDATE`, `DELETE`, `ORDER BY`, `GROUP BY` and indexes.\n\n<b>`SELECT`</b> reads data, <b>`WHERE`</b> filters rows:\n\n```sql\nSELECT * FROM users;\n\nSELECT * FROM users WHERE id = 10;\n```\n\n```text\nusers\n  │\n  ├── id 1\n  ├── id 10  ← returned\n  ├── id 20\n  └── id 30\n```\n\nA <b>`JOIN`</b> (combining related data from more than one table) is the one to really understand, because Eloquent relationships are built on it:\n\n```text\nusers                      orders\n┌────┬────────┐            ┌────┬─────────┬─────────┐\n│ id │ name   │            │ id │ user_id │ amount  │\n├────┼────────┤            ├────┼─────────┼─────────┤\n│ 1  │ Rajan  │            │ 10 │ 1       │ 500     │\n│ 2  │ Kenji  │            │ 11 │ 1       │ 200     │\n└────┴────────┘            │ 12 │ 2       │ 100     │\n                           └────┴─────────┴─────────┘\n```\n\n```sql\nSELECT users.name, orders.amount\nFROM users\nJOIN orders ON orders.user_id = users.id;\n```\n\n```text\nRajan   500\nRajan   200\nKenji   100\n```\n\nThe link is `users.id → orders.user_id`. That single idea becomes `hasMany` and `belongsTo` in Eloquent.\n\nAn <b>index</b> (a database structure that helps it find rows faster) is the difference between reading every page of a book and using its index:\n\n```text\nWithout an index          With an index\n\nSearch \"Laravel\"          Search \"Laravel\"\n       ↓                         ↓\nRead every page           Check the index\n       ↓                         ↓\n     Slow                 Go straight to the page\n                                 ↓\n                               Fast\n```\n\n```sql\nCREATE INDEX users_email_index ON users(email);\n```\n\nAfter that, `WHERE email = 'rajan@example.com'` can be dramatically faster on a large table.",
        np: "हरेक दिन प्रयोग हुने तीन उपकरण, जसमध्ये कुनैलाई पनि Laravel ले प्रतिस्थापन गर्दैन।\n\n---\n\n### 1. आधारभूत — Composer\n\n<b>Composer</b> (PHP को dependency manager) ले project लाई चाहिने package install र व्यवस्थापन गर्छ। <b>Package</b> (अरूले लेखेको, तपाईंको application ले प्रयोग गर्ने code) एउटै command ले आउँछ:\n\n```bash\ncomposer require laravel/framework\n```\n\nJavaScript थाहा छ भने, तुलना सिधा छ:\n\n```text\nJavaScript          PHP\n\nnpm                 Composer\npackage.json        composer.json\nnode_modules        vendor/\nnpm install         composer install\nnpm update          composer update\n```\n\n`composer.json` ले \"मेरो project लाई कुन package चाहिन्छ?\" को जवाफ दिन्छ:\n\n```json\n{\n    \"require\": {\n        \"laravel/framework\": \"^13.0\"\n    }\n}\n```\n\n<b>`composer install`</b> ले project का लागि पहिले नै अभिलेख भएका version install गर्छ — clone गरेपछि यही चलाउनुहुन्छ:\n\n```text\ngit clone project\n       ↓\ncomposer install\n       ↓\n   vendor/\n       ↓\nLaravel चल्न सक्छ\n```\n\n<b>`composer update`</b> ले `composer.json` का नियमले दिने नयाँ version खोजी अद्यावधिक गर्छ। फरक महत्वपूर्ण छ:\n\n```text\ncomposer install → project का लागि अभिलेख भएका version install\ncomposer update  → अनुमति भएका नयाँ version खोजी बदल्ने\n```\n\n---\n\n### 2. मध्यम — Git\n\n<b>Git</b> (code का परिवर्तन पछ्याउने version control system) ले केही गुम्ने डरबिना काम गर्न दिन्छ। तपाईंलाई `branch`, `checkout` वा `switch`, `add`, `commit`, `merge`, `pull` र `push`, अनि यो कार्यप्रवाह चाहिन्छ:\n\n```text\n              main\n               │\n            branch\n               │\n               ↓\n        परिवर्तन गर्नुहोस्\n               │\n               ↓\n             git add\n               │\n               ↓\n           git commit\n               │\n               ↓\n            git push\n               │\n               ↓\n          Pull Request\n```\n\nउन्नत Git पर्खन सक्छ। Branch र commit सँग सहज हुनु पर्खन सक्दैन।\n\n---\n\n### 3. उन्नत — SQL\n\nLaravel ले database को काम सजिलो बनाउँछ, तर SQL बुझ्नुपर्ने आवश्यकता हटाउँदैन। तपाईंले `SELECT`, `WHERE`, `JOIN`, `INSERT`, `UPDATE`, `DELETE`, `ORDER BY`, `GROUP BY` र index चिन्नुपर्छ।\n\n<b>`SELECT`</b> ले data पढ्छ, <b>`WHERE`</b> ले row छान्छ:\n\n```sql\nSELECT * FROM users;\n\nSELECT * FROM users WHERE id = 10;\n```\n\n```text\nusers\n  │\n  ├── id 1\n  ├── id 10  ← फर्काइयो\n  ├── id 20\n  └── id 30\n```\n\n<b>`JOIN`</b> (एकभन्दा बढी table को सम्बन्धित data जोड्नु) साँच्चै बुझ्नुपर्ने कुरा हो, किनकि Eloquent का relationship यसैमा बनेका छन्:\n\n```text\nusers                      orders\n┌────┬────────┐            ┌────┬─────────┬─────────┐\n│ id │ name   │            │ id │ user_id │ amount  │\n├────┼────────┤            ├────┼─────────┼─────────┤\n│ 1  │ Rajan  │            │ 10 │ 1       │ 500     │\n│ 2  │ Kenji  │            │ 11 │ 1       │ 200     │\n└────┴────────┘            │ 12 │ 2       │ 100     │\n                           └────┴─────────┴─────────┘\n```\n\n```sql\nSELECT users.name, orders.amount\nFROM users\nJOIN orders ON orders.user_id = users.id;\n```\n\n```text\nRajan   500\nRajan   200\nKenji   100\n```\n\nजोड्ने कडी `users.id → orders.user_id` हो। यही एउटा विचार Eloquent मा `hasMany` र `belongsTo` बन्छ।\n\n<b>Index</b> (row छिटो भेट्न मद्दत गर्ने database संरचना) किताबका हरेक पृष्ठ पढ्नु र यसको सूची प्रयोग गर्नुबीचको फरक हो:\n\n```text\nIndex बिना               Index सँग\n\n\"Laravel\" खोज्नुहोस्      \"Laravel\" खोज्नुहोस्\n       ↓                         ↓\nहरेक पृष्ठ पढ्नुहोस्        सूची हेर्नुहोस्\n       ↓                         ↓\n     ढिलो                  सिधै पृष्ठमा जानुहोस्\n                                 ↓\n                               छिटो\n```\n\n```sql\nCREATE INDEX users_email_index ON users(email);\n```\n\nत्यसपछि ठूलो table मा `WHERE email = 'rajan@example.com'` नाटकीय रूपमा छिटो हुन सक्छ।",
        jp: "毎日使う3つの道具。どれもLaravelが置き換えてはくれない。\n\n---\n\n### 1. 基本 — Composer\n\n<b>Composer</b>（PHPの依存管理ツール）は、プロジェクトに必要なパッケージを導入し管理する。<b>パッケージ</b>（他人が書き、自分のアプリが使うコード）はコマンド1つで入る:\n\n```bash\ncomposer require laravel/framework\n```\n\nJavaScriptを知っているなら、対応はそのままだ:\n\n```text\nJavaScript          PHP\n\nnpm                 Composer\npackage.json        composer.json\nnode_modules        vendor/\nnpm install         composer install\nnpm update          composer update\n```\n\n`composer.json` は「このプロジェクトにどのパッケージが必要か」に答える:\n\n```json\n{\n    \"require\": {\n        \"laravel/framework\": \"^13.0\"\n    }\n}\n```\n\n<b>`composer install`</b> はプロジェクトに記録済みのバージョンを入れる。クローン直後に走らせるのはこちら:\n\n```text\ngit clone project\n       ↓\ncomposer install\n       ↓\n   vendor/\n       ↓\nLaravelが動く\n```\n\n<b>`composer update`</b> は `composer.json` の規則が許す新しいバージョンを探して更新する。この違いは大きい:\n\n```text\ncomposer install → 記録済みのバージョンを入れる\ncomposer update  → 許される新しい版を探して変える\n```\n\n---\n\n### 2. 中級 — Git\n\n<b>Git</b>（コードの変更を追跡するバージョン管理system）は、何かを失う不安なしに作業させてくれる。必要なのは `branch`・`checkout` か `switch`・`add`・`commit`・`merge`・`pull`・`push`、そしてこの流れだ:\n\n```text\n              main\n               │\n            branch\n               │\n               ↓\n        変更を加える\n               │\n               ↓\n             git add\n               │\n               ↓\n           git commit\n               │\n               ↓\n            git push\n               │\n               ↓\n          Pull Request\n```\n\n高度なGitは後回しでよい。ブランチとコミットに慣れることは後回しにできない。\n\n---\n\n### 3. 上級 — SQL\n\nLaravelはデータベース作業を楽にするが、SQLを理解する必要をなくしはしない。`SELECT`・`WHERE`・`JOIN`・`INSERT`・`UPDATE`・`DELETE`・`ORDER BY`・`GROUP BY`・インデックスは見て分かるようにしておく。\n\n<b>`SELECT`</b> がデータを読み、<b>`WHERE`</b> が行を絞る:\n\n```sql\nSELECT * FROM users;\n\nSELECT * FROM users WHERE id = 10;\n```\n\n```text\nusers\n  │\n  ├── id 1\n  ├── id 10  ← これが返る\n  ├── id 20\n  └── id 30\n```\n\n本当に理解しておきたいのが<b>`JOIN`</b>（複数のテーブルの関連データを結合すること）だ。Eloquentのリレーションはこの上に建っている:\n\n```text\nusers                      orders\n┌────┬────────┐            ┌────┬─────────┬─────────┐\n│ id │ name   │            │ id │ user_id │ amount  │\n├────┼────────┤            ├────┼─────────┼─────────┤\n│ 1  │ Rajan  │            │ 10 │ 1       │ 500     │\n│ 2  │ Kenji  │            │ 11 │ 1       │ 200     │\n└────┴────────┘            │ 12 │ 2       │ 100     │\n                           └────┴─────────┴─────────┘\n```\n\n```sql\nSELECT users.name, orders.amount\nFROM users\nJOIN orders ON orders.user_id = users.id;\n```\n\n```text\nRajan   500\nRajan   200\nKenji   100\n```\n\nつなぎ目は `users.id → orders.user_id`。この一点がEloquentで `hasMany` と `belongsTo` になる。\n\n<b>インデックス</b>（行を速く見つけるためのデータベースの構造）は、本を全ページ読むか索引を引くかの差だ:\n\n```text\nインデックスなし          インデックスあり\n\n\"Laravel\" を探す          \"Laravel\" を探す\n       ↓                         ↓\n全ページを読む            索引を見る\n       ↓                         ↓\n     遅い                 そのページへ直行\n                                 ↓\n                               速い\n```\n\n```sql\nCREATE INDEX users_email_index ON users(email);\n```\n\n以後、大きなテーブルでの `WHERE email = 'rajan@example.com'` は劇的に速くなりうる。",
      },
      diagram: `Composer, if you already know npm

JavaScript          PHP
──────────          ───
npm                 Composer
package.json        composer.json
node_modules        vendor/
npm install         composer install
npm update          composer update


install and update are not the same command twice

composer install → the versions recorded for this project
composer update  → newer versions the rules allow, written back


The Git loop you need before day 1

main → branch → change → git add → git commit → git push → Pull Request


A JOIN is the idea behind every Eloquent relationship

users                      orders
┌────┬────────┐            ┌────┬─────────┬─────────┐
│ id │ name   │            │ id │ user_id │ amount  │
├────┼────────┤            ├────┼─────────┼─────────┤
│ 1  │ Rajan  │◄───────────│ 10 │ 1       │ 500     │
│ 2  │ Kenji  │            │ 11 │ 1       │ 200     │
└────┴────────┘            │ 12 │ 2       │ 100     │
                           └────┴─────────┴─────────┘
        users.id  →  orders.user_id


An index, in one picture

no index    search → read every page  → slow
index       search → check the index  → straight to the page → fast`,
      codeExample: {
        title: { en: "The commands and queries you need on day 1", np: "पहिलो दिन चाहिने command र query", jp: "初日に必要なコマンドとクエリ" },
        code: `# ── Composer ──────────────────────────────────────────────────────
composer require laravel/framework   # add a package
composer install                     # install the recorded versions
composer update                      # find newer allowed versions

# after cloning any Laravel project:
#   git clone project → composer install → vendor/ → it runs

# ── Git, the loop you need before day 1 ───────────────────────────
git switch -c feature/routing        # branch off main
git add .
git commit -m "Add the routes file"
git push -u origin feature/routing   # then open a pull request

git switch main
git pull                             # bring main up to date
git merge feature/routing

-- ── SQL: read and filter ─────────────────────────────────────────
SELECT * FROM users;

SELECT * FROM users WHERE id = 10;

-- ── JOIN: the idea behind Eloquent relationships ─────────────────
SELECT users.name, orders.amount
FROM users
JOIN orders ON orders.user_id = users.id;
-- Rajan  500
-- Rajan  200
-- Kenji  100

-- ── An index turns a full scan into a lookup ─────────────────────
CREATE INDEX users_email_index ON users(email);

SELECT * FROM users WHERE email = 'rajan@example.com';`,
      },
      keyTakeaways: [
        { en: "<b>Composer</b> is PHP's dependency manager — the direct counterpart to npm.", np: "<b>Composer</b> PHP को dependency manager हो — npm कै समकक्ष।", jp: "<b>Composer</b> はPHPの依存管理ツールで、npmの対応物。" },
        { en: "`composer install` installs the <b>recorded</b> versions; `composer update` looks for <b>newer</b> ones.", np: "`composer install` ले <b>अभिलेख भएका</b> version install गर्छ; `composer update` ले <b>नयाँ</b> खोज्छ।", jp: "`composer install` は<b>記録済み</b>の版を入れ、`composer update` は<b>新しい</b>版を探す。" },
        { en: "After cloning a Laravel project, `composer install` is what creates `vendor/` and makes it run.", np: "Laravel project clone गरेपछि, `composer install` ले नै `vendor/` बनाउँछ र चल्ने बनाउँछ।", jp: "Laravelプロジェクトをクローンした後、`vendor/` を作り動かすのが `composer install`。" },
        { en: "For <b>Git</b>, branches and commits are enough to start; advanced usage can wait.", np: "<b>Git</b> मा, सुरु गर्न branch र commit पुग्छ; उन्नत प्रयोग पर्खन सक्छ।", jp: "<b>Git</b> は、始めるにはブランチとコミットで足りる。高度な使い方は後でよい。" },
        { en: "A <b>`JOIN`</b> combines related rows across tables — the idea Eloquent relationships are built on.", np: "<b>`JOIN`</b> ले table बीचका सम्बन्धित row जोड्छ — Eloquent relationship यसैमा बनेका छन्।", jp: "<b>`JOIN`</b> はテーブルをまたいで関連する行を結合する。Eloquentのリレーションの土台。" },
        { en: "An <b>index</b> turns a full table scan into a direct lookup, like a book's index.", np: "<b>Index</b> ले पूरै table scan लाई सिधा lookup बनाउँछ, किताबको सूची जस्तै।", jp: "<b>インデックス</b>は全表走査を直接の参照に変える。本の索引と同じ。" },
      ],
      commonMistakes: [
        { en: "<b>Running `composer update` on a shared project</b> — it can pull in newer versions and change behaviour for everyone. After cloning you want `composer install`.", np: "<b>साझा project मा `composer update` चलाउनु</b> — यसले नयाँ version ल्याई सबैका लागि व्यवहार बदल्न सक्छ। Clone पछि `composer install` चाहिन्छ।", jp: "<b>共有プロジェクトで `composer update` を走らせる</b> — 新しい版を引き込み全員の挙動を変えうる。クローン後は `composer install`。" },
        { en: "<b>Committing the `vendor/` directory</b> — it is generated from `composer.json`, the way `node_modules` is generated from `package.json`.", np: "<b>`vendor/` directory commit गर्नु</b> — यो `composer.json` बाट बन्छ, जसरी `node_modules` `package.json` बाट बन्छ।", jp: "<b>`vendor/` をコミットする</b> — `node_modules` が `package.json` から作られるのと同じで、`composer.json` から生成される。" },
        { en: "<b>Committing straight to `main`</b> — branch first, so work in progress never blocks anyone else and can be reviewed.", np: "<b>सिधै `main` मा commit गर्नु</b> — पहिले branch बनाउनुहोस्, ताकि अधुरो काले कसैलाई नरोकोस् र समीक्षा हुन सकोस्।", jp: "<b>いきなり `main` にコミットする</b> — 先にブランチを切る。作業中のものが誰も止めず、レビューもできる。" },
        { en: "<b>Assuming Laravel means you can skip SQL</b> — Eloquent writes the queries, but you still have to read them when one is slow.", np: "<b>Laravel भएपछि SQL छाड्न सकिन्छ भन्ने ठान्नु</b> — Eloquent ले query लेख्छ, तर ढिलो हुँदा तपाईंले नै पढ्नुपर्छ।", jp: "<b>LaravelがあればSQLは不要と思う</b> — クエリを書くのはEloquentだが、遅いときに読むのは自分だ。" },
      ],
      quiz: [
        {
          question: { en: "What is Composer?", np: "Composer के हो?", jp: "Composerとは何か?" },
          options: [
            { en: "PHP's dependency manager", np: "PHP को dependency manager", jp: "PHPの依存管理ツール" },
            { en: "A JavaScript framework", np: "एउटा JavaScript framework", jp: "JavaScriptのフレームワーク" },
            { en: "A database", np: "एउटा database", jp: "データベース" },
            { en: "An HTTP server", np: "एउटा HTTP server", jp: "HTTPサーバー" },
          ],
          correctIndex: 0,
          explanation: { en: "It is to PHP what npm is to JavaScript.", np: "JavaScript लाई npm जे हो, PHP लाई Composer त्यही हो।", jp: "JavaScriptにとってのnpmが、PHPにとってのComposer。" },
        },
        {
          question: { en: "What is the difference between `composer install` and `composer update`?", np: "`composer install` र `composer update` बीच के फरक छ?", jp: "`composer install` と `composer update` の違いは?" },
          options: [
            { en: "They are the same command", np: "ती एउटै command हुन्", jp: "同じコマンド" },
            { en: "`install` uses the recorded versions; `update` looks for newer allowed ones", np: "`install` ले अभिलेख भएका version प्रयोग गर्छ; `update` ले नयाँ खोज्छ", jp: "`install` は記録済みの版を使い、`update` は許される新しい版を探す" },
            { en: "`install` is for production only", np: "`install` production का लागि मात्र हो", jp: "`install` は本番専用" },
          ],
          correctIndex: 1,
          explanation: { en: "After cloning a project you want `install`, not `update`.", np: "Project clone गरेपछि `update` होइन, `install` चाहिन्छ।", jp: "クローン後に必要なのは `update` ではなく `install`。" },
        },
        {
          question: { en: "What does an SQL JOIN do?", np: "SQL JOIN ले के गर्छ?", jp: "SQLのJOINは何をするか?" },
          options: [
            { en: "Deletes tables", np: "Table मेटाउँछ", jp: "テーブルを削除する" },
            { en: "Starts Laravel", np: "Laravel सुरु गर्छ", jp: "Laravelを起動する" },
            { en: "Creates a Git branch", np: "Git branch बनाउँछ", jp: "Gitブランチを作る" },
            { en: "Combines related data from more than one table", np: "एकभन्दा बढी table को सम्बन्धित data जोड्छ", jp: "複数テーブルの関連データを結合する" },
          ],
          correctIndex: 3,
          explanation: { en: "`users.id → orders.user_id` is the same idea as `hasMany` in Eloquent.", np: "`users.id → orders.user_id` Eloquent को `hasMany` कै विचार हो।", jp: "`users.id → orders.user_id` は、Eloquentの `hasMany` と同じ考え。" },
        },
        {
          question: { en: "What does a database index do?", np: "Database index ले के गर्छ?", jp: "データベースのインデックスは何をするか?" },
          options: [
            { en: "Helps the database find matching rows without scanning every one", np: "हरेक row नछानी मिल्ने row भेट्न मद्दत गर्छ", jp: "全行を走査せずに該当行を見つける助けになる" },
            { en: "Stores a backup of the table", np: "Table को backup राख्छ", jp: "テーブルのバックアップを保存する" },
            { en: "Encrypts the column", np: "Column encrypt गर्छ", jp: "列を暗号化する" },
          ],
          correctIndex: 0,
          explanation: { en: "Like a book's index: check it, then go straight to the page.", np: "किताबको सूची जस्तै: हेर्नुहोस्, अनि सिधै पृष्ठमा जानुहोस्।", jp: "本の索引と同じ。引いてから、そのページへ直行する。" },
        },
        {
          question: { en: "Which file lists a PHP project's dependencies?", np: "PHP project का dependency कुन file ले सूचीबद्ध गर्छ?", jp: "PHPプロジェクトの依存を列挙するファイルは?" },
          options: [
            { en: "`package.json`", np: "`package.json`", jp: "`package.json`" },
            { en: "`vendor.json`", np: "`vendor.json`", jp: "`vendor.json`" },
            { en: "`composer.json`", np: "`composer.json`", jp: "`composer.json`" },
          ],
          correctIndex: 2,
          explanation: { en: "`vendor/` is the installed result, the way `node_modules` is.", np: "`vendor/` install भएको नतिजा हो, `node_modules` जस्तै।", jp: "`vendor/` は導入された結果で、`node_modules` と同じ位置づけ。" },
        },
      ],
    },
    {
      id: "web-fundamentals",
      title: { en: "Web fundamentals — request to response", np: "Web आधारभूत — request देखि response", jp: "Webの基礎 — リクエストからレスポンスまで" },
      durationMinutes: 9,
      explanation: {
        en: "Laravel is a web framework, so the last thing to be comfortable with is how the web itself works.\n\n---\n\n### 1. Basic — request and response\n\nAn <b>HTTP request</b> (a message a client sends to a server) asks the server to do something. An <b>HTTP response</b> (the server's reply) carries the result.\n\n```text\nBrowser\n   │\n   │ HTTP Request\n   ↓\nLaravel Application\n   │\n   │ Process request\n   ↓\nDatabase\n   │\n   │ Data\n   ↓\nLaravel Application\n   │\n   │ HTTP Response\n   ↓\nBrowser\n```\n\nThe browser sends `GET /users/10`, and Laravel may reply with:\n\n```json\n{\n    \"id\": 10,\n    \"name\": \"Rajan\"\n}\n```\n\nAn <b>HTTP verb</b> (the action the client wants performed) says what kind of request it is:\n\n```text\nGET     read data\nPOST    create data\nPUT     replace data\nPATCH   update part of data\nDELETE  delete data\n```\n\nApplied to a user API:\n\n```text\nGET     /users       → list users\nGET     /users/10    → get user 10\nPOST    /users       → create a user\nPATCH   /users/10    → update user 10\nDELETE  /users/10    → delete user 10\n```\n\nLaravel routes use these constantly.\n\n---\n\n### 2. Intermediate — status codes and headers\n\nA <b>status code</b> (a number saying what happened) comes back with every response. The families matter more than the individual numbers:\n\n```text\n2xx → Success\n3xx → Redirect\n4xx → Client error\n5xx → Server error\n```\n\nThe ones you will meet most:\n\n```text\n200 → OK\n201 → Created\n204 → No Content\n\n400 → Bad Request\n401 → Unauthenticated\n403 → Forbidden\n404 → Not Found\n422 → Validation Error\n\n500 → Server Error\n```\n\n`401` and `403` are the pair people confuse: 401 means we do not know who you are; 403 means we know, and you still may not.\n\nA <b>header</b> (extra information attached to a request or response) carries metadata:\n\n```http\nContent-Type: application/json\nAuthorization: Bearer token123\nAccept: application/json\n```\n\n```text\nHTTP Request\n│\n├── Method\n│   └── POST\n│\n├── URL\n│   └── /users\n│\n├── Headers\n│   ├── Content-Type\n│   └── Authorization\n│\n└── Body\n    └── User data\n```\n\nA <b>cookie</b> (a small piece of data the browser stores for a site) is how information survives between requests:\n\n```text\nBrowser → Login → Server\n                    │ Set Cookie\n                    ↓\nBrowser stores it\n   │\n   │ next request sends it back\n   ↓\nServer knows the browser\n```\n\nThat is what makes login sessions possible.\n\n---\n\n### 3. Advanced — the whole journey\n\n<b>JSON</b> (a text format for exchanging structured data) is what APIs speak, and an <b>HTML form</b> is how a browser submits data without one:\n\n```html\n<form method=\"POST\" action=\"/users\">\n    <input type=\"text\" name=\"name\">\n    <input type=\"email\" name=\"email\">\n    <button type=\"submit\">Create User</button>\n</form>\n```\n\n```text\nUser → fills form → POST /users → Laravel → Validate → Save\n```\n\nPut it all together and a single request to `/users/10` looks like this:\n\n```text\n┌──────────────┐\n│   Browser    │\n└──────┬───────┘\n       │ GET /users/10\n       ↓\n┌──────────────┐\n│    Router    │  find the matching route\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│  Controller  │  ask for the user\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│    Model     │  SQL query\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│   Database   │\n└──────┬───────┘\n       │ user data\n       ↓\n┌──────────────┐\n│  Controller  │  build the response\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│   Browser    │\n└──────────────┘\n```\n\nDo not memorise this. You will build each box during the 30 days — router on day 2, controllers on day 3, models and Eloquent later. Recognising the shape now is enough.\n\n---\n\n### You are ready\n\nThe goal of Phase 0 is not mastery:\n\n```text\nPHP fundamentals + Composer + Git + SQL + Web fundamentals\n                          │\n                          ↓\n                      Laravel 13\n                          │\n                          ↓\n                    30-Day Journey\n```\n\nIf the ideas above make sense, start Day 1. Laravel will teach you how the pieces fit together.",
        np: "Laravel web framework हो, त्यसैले अन्तिममा सहज हुनुपर्ने कुरा web आफैं कसरी काम गर्छ भन्ने हो।\n\n---\n\n### 1. आधारभूत — request र response\n\n<b>HTTP request</b> (client ले server लाई पठाउने सन्देश) ले server लाई केही गर्न भन्छ। <b>HTTP response</b> (server को जवाफ) ले नतिजा बोक्छ।\n\n```text\nBrowser\n   │\n   │ HTTP Request\n   ↓\nLaravel Application\n   │\n   │ request process\n   ↓\nDatabase\n   │\n   │ Data\n   ↓\nLaravel Application\n   │\n   │ HTTP Response\n   ↓\nBrowser\n```\n\nBrowser ले `GET /users/10` पठाउँछ, र Laravel ले यसो जवाफ दिन सक्छ:\n\n```json\n{\n    \"id\": 10,\n    \"name\": \"Rajan\"\n}\n```\n\n<b>HTTP verb</b> (client ले गराउन खोजेको काम) ले यो कस्तो request हो भन्छ:\n\n```text\nGET     data पढ्ने\nPOST    data बनाउने\nPUT     data प्रतिस्थापन गर्ने\nPATCH   data को भाग अद्यावधिक गर्ने\nDELETE  data मेटाउने\n```\n\nUser API मा लागू गर्दा:\n\n```text\nGET     /users       → user सूची\nGET     /users/10    → user 10 लिने\nPOST    /users       → user बनाउने\nPATCH   /users/10    → user 10 अद्यावधिक\nDELETE  /users/10    → user 10 मेटाउने\n```\n\nLaravel का route ले यी निरन्तर प्रयोग गर्छन्।\n\n---\n\n### 2. मध्यम — status code र header\n\n<b>Status code</b> (के भयो बताउने संख्या) हरेक response सँग आउँछ। छुट्टै संख्याभन्दा परिवार महत्वपूर्ण छ:\n\n```text\n2xx → सफल\n3xx → Redirect\n4xx → Client को त्रुटि\n5xx → Server को त्रुटि\n```\n\nसबैभन्दा धेरै भेटिनेहरू:\n\n```text\n200 → OK\n201 → Created\n204 → No Content\n\n400 → Bad Request\n401 → Unauthenticated\n403 → Forbidden\n404 → Not Found\n422 → Validation Error\n\n500 → Server Error\n```\n\n`401` र `403` अल्मल्याउने जोडी हुन्: 401 को अर्थ तपाईं को हो हामीलाई थाहा छैन; 403 को अर्थ थाहा छ, तैपनि अनुमति छैन।\n\n<b>Header</b> (request वा response मा जोडिएको थप जानकारी) ले metadata बोक्छ:\n\n```http\nContent-Type: application/json\nAuthorization: Bearer token123\nAccept: application/json\n```\n\n```text\nHTTP Request\n│\n├── Method\n│   └── POST\n│\n├── URL\n│   └── /users\n│\n├── Headers\n│   ├── Content-Type\n│   └── Authorization\n│\n└── Body\n    └── User data\n```\n\n<b>Cookie</b> (site का लागि browser ले राख्ने सानो data) ले request बीच जानकारी बचाउँछ:\n\n```text\nBrowser → Login → Server\n                    │ Cookie सेट\n                    ↓\nBrowser ले राख्छ\n   │\n   │ अर्को request मा फिर्ता पठाउँछ\n   ↓\nServer ले browser चिन्छ\n```\n\nयसैले login session सम्भव हुन्छ।\n\n---\n\n### 3. उन्नत — पूरै यात्रा\n\n<b>JSON</b> (संरचित data आदानप्रदान गर्ने text ढाँचा) API को भाषा हो, र <b>HTML form</b> ले browser लाई त्यसबिना data पठाउन दिन्छ:\n\n```html\n<form method=\"POST\" action=\"/users\">\n    <input type=\"text\" name=\"name\">\n    <input type=\"email\" name=\"email\">\n    <button type=\"submit\">Create User</button>\n</form>\n```\n\n```text\nUser → form भर्छ → POST /users → Laravel → Validate → Save\n```\n\nसबै जोड्दा, `/users/10` को एउटै request यस्तो देखिन्छ:\n\n```text\n┌──────────────┐\n│   Browser    │\n└──────┬───────┘\n       │ GET /users/10\n       ↓\n┌──────────────┐\n│    Router    │  मिल्ने route खोज्छ\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│  Controller  │  user माग्छ\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│    Model     │  SQL query\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│   Database   │\n└──────┬───────┘\n       │ user data\n       ↓\n┌──────────────┐\n│  Controller  │  response बनाउँछ\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│   Browser    │\n└──────────────┘\n```\n\nयो नरट्नुहोस्। 30 दिनमा तपाईंले हरेक बाकस बनाउनुहुनेछ — दोस्रो दिन router, तेस्रो दिन controller, पछि model र Eloquent। अहिले आकार चिन्न सके पुग्छ।\n\n---\n\n### तपाईं तयार हुनुहुन्छ\n\nPhase 0 को लक्ष्य दख्खल होइन:\n\n```text\nPHP आधारभूत + Composer + Git + SQL + Web आधारभूत\n                          │\n                          ↓\n                      Laravel 13\n                          │\n                          ↓\n                    30-दिने यात्रा\n```\n\nमाथिका विचार बुझिए, Day 1 सुरु गर्नुहोस्। टुक्रा कसरी मिल्छन् Laravel ले सिकाउनेछ।",
        jp: "LaravelはWebフレームワークなので、最後に慣れておくべきはWeb自体の仕組みだ。\n\n---\n\n### 1. 基本 — リクエストとレスポンス\n\n<b>HTTPリクエスト</b>（クライアントがサーバーへ送るメッセージ）は、何かをするよう求める。<b>HTTPレスポンス</b>（サーバーの返答）が結果を運ぶ。\n\n```text\nBrowser\n   │\n   │ HTTP Request\n   ↓\nLaravel Application\n   │\n   │ リクエストを処理\n   ↓\nDatabase\n   │\n   │ Data\n   ↓\nLaravel Application\n   │\n   │ HTTP Response\n   ↓\nBrowser\n```\n\nブラウザが `GET /users/10` を送り、Laravelはこう返しうる:\n\n```json\n{\n    \"id\": 10,\n    \"name\": \"Rajan\"\n}\n```\n\n<b>HTTPメソッド</b>（クライアントが求める操作）が、リクエストの種類を示す:\n\n```text\nGET     データを読む\nPOST    データを作る\nPUT     データを置き換える\nPATCH   データの一部を更新する\nDELETE  データを削除する\n```\n\nユーザーAPIに当てると:\n\n```text\nGET     /users       → 一覧\nGET     /users/10    → ユーザー10を取得\nPOST    /users       → ユーザーを作成\nPATCH   /users/10    → ユーザー10を更新\nDELETE  /users/10    → ユーザー10を削除\n```\n\nLaravelのルートはこれらを常に使う。\n\n---\n\n### 2. 中級 — ステータスコードとヘッダー\n\n<b>ステータスコード</b>（何が起きたかを示す数値）はすべてのレスポンスに付く。個々の数字より、族のほうが大事だ:\n\n```text\n2xx → 成功\n3xx → リダイレクト\n4xx → クライアント側の誤り\n5xx → サーバー側の誤り\n```\n\nよく出会うもの:\n\n```text\n200 → OK\n201 → Created\n204 → No Content\n\n400 → Bad Request\n401 → Unauthenticated\n403 → Forbidden\n404 → Not Found\n422 → Validation Error\n\n500 → Server Error\n```\n\n混同されがちなのが `401` と `403` だ。401は「あなたが誰か分からない」、403は「分かっているが、それでも許可しない」。\n\n<b>ヘッダー</b>（リクエストやレスポンスに付く追加情報）はメタ情報を運ぶ:\n\n```http\nContent-Type: application/json\nAuthorization: Bearer token123\nAccept: application/json\n```\n\n```text\nHTTP Request\n│\n├── Method\n│   └── POST\n│\n├── URL\n│   └── /users\n│\n├── Headers\n│   ├── Content-Type\n│   └── Authorization\n│\n└── Body\n    └── User data\n```\n\n<b>クッキー</b>（サイトのためにブラウザが保存する小さなデータ）は、リクエストをまたいで情報を残す:\n\n```text\nBrowser → Login → Server\n                    │ Cookieを設定\n                    ↓\nBrowserが保存\n   │\n   │ 次のリクエストで送り返す\n   ↓\nServerがそのブラウザを識別\n```\n\nログインセッションが成り立つのはこれのおかげだ。\n\n---\n\n### 3. 上級 — 旅の全体\n\n<b>JSON</b>（構造化データをやり取りするテキスト形式）はAPIの言葉で、<b>HTMLフォーム</b>はそれなしにブラウザがデータを送る手段だ:\n\n```html\n<form method=\"POST\" action=\"/users\">\n    <input type=\"text\" name=\"name\">\n    <input type=\"email\" name=\"email\">\n    <button type=\"submit\">Create User</button>\n</form>\n```\n\n```text\nUser → フォーム入力 → POST /users → Laravel → 検証 → 保存\n```\n\nすべてを合わせると、`/users/10` への1回のリクエストはこうなる:\n\n```text\n┌──────────────┐\n│   Browser    │\n└──────┬───────┘\n       │ GET /users/10\n       ↓\n┌──────────────┐\n│    Router    │  一致するルートを探す\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│  Controller  │  ユーザーを求める\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│    Model     │  SQLクエリ\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│   Database   │\n└──────┬───────┘\n       │ user data\n       ↓\n┌──────────────┐\n│  Controller  │  レスポンスを組む\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│   Browser    │\n└──────────────┘\n```\n\n暗記しなくてよい。30日のあいだに各箱を自分で作る。2日目にルーター、3日目にコントローラ、その後にモデルとEloquent。今は形が見分けられれば十分だ。\n\n---\n\n### 準備は整った\n\nPhase 0の目的は熟達ではない:\n\n```text\nPHPの基礎 + Composer + Git + SQL + Webの基礎\n                          │\n                          ↓\n                      Laravel 13\n                          │\n                          ↓\n                    30日間の旅\n```\n\nここまでの考えが腑に落ちるなら、Day 1へ。部品がどう噛み合うかはLaravelが教えてくれる。",
      },
      diagram: `One request, end to end

┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ GET /users/10
       ↓
┌──────────────┐
│    Router    │   day 2
└──────┬───────┘
       ↓
┌──────────────┐
│  Controller  │   day 3
└──────┬───────┘
       ↓
┌──────────────┐
│    Model     │   Eloquent, later
└──────┬───────┘
       ↓
┌──────────────┐
│   Database   │
└──────┬───────┘
       │ user data
       ↓
┌──────────────┐
│  Controller  │
└──────┬───────┘
       ↓
┌──────────────┐
│   Browser    │
└──────────────┘


Verbs, mapped to one resource

GET     /users       list
GET     /users/10    read one
POST    /users       create
PATCH   /users/10    update part
DELETE  /users/10    delete


Status codes, by family

2xx  Success          200 OK, 201 Created, 204 No Content
3xx  Redirect
4xx  Client error     400, 401, 403, 404, 422
5xx  Server error     500

401 = we do not know who you are
403 = we do, and you still may not


What Phase 0 adds up to

PHP + Composer + Git + SQL + Web
              │
              ↓
          Laravel 13
              │
              ↓
        30-Day Journey`,
      codeExample: {
        title: { en: "Verbs, status codes, headers and a form", np: "Verb, status code, header र form", jp: "メソッド・ステータス・ヘッダー・フォーム" },
        code: `# ── A request is a verb, a URL, headers and sometimes a body ──────
POST /users HTTP/1.1
Content-Type: application/json
Authorization: Bearer token123
Accept: application/json

{
    "name": "Rajan",
    "email": "rajan@example.com"
}

# ── The response carries a status code and a body ─────────────────
HTTP/1.1 201 Created
Content-Type: application/json

{
    "id": 10,
    "name": "Rajan"
}

# ── The five verbs against one resource ───────────────────────────
GET     /users        # list them
GET     /users/10     # read one
POST    /users        # create
PATCH   /users/10     # update part of it
DELETE  /users/10     # delete

# ── Status codes worth knowing on sight ───────────────────────────
# 200 OK            204 No Content       401 Unauthenticated
# 201 Created       400 Bad Request      403 Forbidden
#                   404 Not Found        422 Validation Error
#                                        500 Server Error

# 401 = we do not know who you are
# 403 = we do know, and you still may not

<!-- A browser submits a form without any JSON involved -->
<form method="POST" action="/users">
    <input type="text" name="name">
    <input type="email" name="email">
    <button type="submit">Create User</button>
</form>

<!-- User fills it in → POST /users → Laravel validates → saves -->`,
      },
      keyTakeaways: [
        { en: "A <b>request</b> asks the server to do something; a <b>response</b> carries the result back.", np: "<b>Request</b> ले server लाई केही गर्न भन्छ; <b>response</b> ले नतिजा फर्काउँछ।", jp: "<b>リクエスト</b>はサーバーに何かを求め、<b>レスポンス</b>が結果を返す。" },
        { en: "The <b>verb</b> says what kind of action it is: GET, POST, PUT, PATCH, DELETE.", np: "<b>Verb</b> ले कस्तो काम हो भन्छ: GET, POST, PUT, PATCH, DELETE।", jp: "<b>メソッド</b>が操作の種類を示す。GET・POST・PUT・PATCH・DELETE。" },
        { en: "Status codes come in families: <b>2xx</b> success, <b>3xx</b> redirect, <b>4xx</b> client, <b>5xx</b> server.", np: "Status code परिवारमा आउँछन्: <b>2xx</b> सफल, <b>3xx</b> redirect, <b>4xx</b> client, <b>5xx</b> server।", jp: "ステータスコードは族で覚える。<b>2xx</b>成功、<b>3xx</b>転送、<b>4xx</b>クライアント、<b>5xx</b>サーバー。" },
        { en: "<b>401</b> means we do not know who you are; <b>403</b> means we do, and you still may not.", np: "<b>401</b> को अर्थ तपाईं को हो थाहा छैन; <b>403</b> को अर्थ थाहा छ, तैपनि अनुमति छैन।", jp: "<b>401</b>は「誰か分からない」、<b>403</b>は「分かっているが許可しない」。" },
        { en: "<b>Headers</b> carry metadata such as `Content-Type` and `Authorization`.", np: "<b>Header</b> ले `Content-Type` र `Authorization` जस्ता metadata बोक्छ।", jp: "<b>ヘッダー</b>は `Content-Type` や `Authorization` などのメタ情報を運ぶ。" },
        { en: "A <b>cookie</b> is what lets a server recognise the same browser on the next request.", np: "<b>Cookie</b> ले नै server लाई अर्को request मा उही browser चिन्न दिन्छ।", jp: "<b>クッキー</b>があるから、サーバーは次のリクエストで同じブラウザだと分かる。" },
        { en: "The full journey is Browser → Router → Controller → Model → Database and back — you build each box during the 30 days.", np: "पूरै यात्रा Browser → Router → Controller → Model → Database र फिर्ता हो — हरेक बाकस 30 दिनमा बनाउनुहुन्छ।", jp: "全体は Browser → Router → Controller → Model → Database と戻り。各箱は30日のあいだに自分で作る。" },
      ],
      commonMistakes: [
        { en: "<b>Using GET to change data</b> — browsers and proxies may repeat a GET freely, so a GET that deletes something will eventually delete it twice.", np: "<b>Data बदल्न GET प्रयोग गर्नु</b> — browser र proxy ले GET स्वतन्त्र रूपमा दोहोर्‍याउन सक्छन्, त्यसैले मेटाउने GET अन्ततः दुई पटक मेटाउँछ।", jp: "<b>データ変更にGETを使う</b> — ブラウザやプロキシはGETを自由に繰り返しうるので、削除するGETはいずれ2回削除する。" },
        { en: "<b>Returning 200 for an error</b> — a body saying `error` with a 200 status makes every client treat the failure as success.", np: "<b>Error मा 200 फर्काउनु</b> — 200 सँग `error` भन्ने body ले हरेक client लाई असफलता सफलता ठान्न लगाउँछ।", jp: "<b>エラーに200を返す</b> — 200で本文に `error` と書けば、あらゆるクライアントが失敗を成功として扱う。" },
        { en: "<b>Confusing 401 with 403</b> — sending 403 to a logged-out user hides the fact that logging in would fix it.", np: "<b>401 र 403 अल्मल्याउनु</b> — logout भएको user लाई 403 पठाउँदा login गरे समाधान हुन्थ्यो भन्ने लुक्छ।", jp: "<b>401と403を混同する</b> — 未ログインの利用者に403を返すと、ログインすれば解決することが伝わらない。" },
        { en: "<b>Trying to memorise the request lifecycle now</b> — you will build the router, controller and model yourself over the 30 days. Recognising the shape is enough today.", np: "<b>अहिले request lifecycle रट्न खोज्नु</b> — router, controller र model तपाईं आफैं 30 दिनमा बनाउनुहुनेछ। आज आकार चिने पुग्छ।", jp: "<b>今この流れを暗記しようとする</b> — ルーター・コントローラ・モデルは30日のあいだに自分で作る。今日は形が分かれば十分。" },
      ],
      quiz: [
        {
          question: { en: "Which HTTP method is normally used to create a resource?", np: "Resource बनाउन सामान्यतया कुन HTTP method प्रयोग हुन्छ?", jp: "リソースの作成に通常使うHTTPメソッドは?" },
          options: [
            { en: "GET", np: "GET", jp: "GET" },
            { en: "POST", np: "POST", jp: "POST" },
            { en: "DELETE", np: "DELETE", jp: "DELETE" },
            { en: "PATCH", np: "PATCH", jp: "PATCH" },
          ],
          correctIndex: 1,
          explanation: { en: "`PATCH` updates part of an existing resource; `POST` creates a new one.", np: "`PATCH` ले भएको resource को भाग अद्यावधिक गर्छ; `POST` ले नयाँ बनाउँछ।", jp: "`PATCH` は既存の一部を更新し、`POST` は新規に作る。" },
        },
        {
          question: { en: "What does HTTP 404 usually mean?", np: "HTTP 404 को अर्थ सामान्यतया के हो?", jp: "HTTP 404 は通常何を意味するか?" },
          options: [
            { en: "Success", np: "सफल", jp: "成功" },
            { en: "Created", np: "बनाइयो", jp: "作成された" },
            { en: "Not Found", np: "भेटिएन", jp: "見つからない" },
            { en: "Server Error", np: "Server को त्रुटि", jp: "サーバーエラー" },
          ],
          correctIndex: 2,
          explanation: { en: "It is a 4xx, so the problem is with the request, not the server.", np: "यो 4xx हो, त्यसैले समस्या request मा छ, server मा होइन।", jp: "4xxなので、問題はサーバーではなくリクエスト側にある。" },
        },
        {
          question: { en: "What is the difference between 401 and 403?", np: "401 र 403 बीच के फरक छ?", jp: "401と403の違いは?" },
          options: [
            { en: "401 means we do not know who you are; 403 means we do, and you still may not", np: "401 को अर्थ तपाईं को हो थाहा छैन; 403 को अर्थ थाहा छ, तैपनि अनुमति छैन", jp: "401は誰か分からない、403は分かっているが許可しない" },
            { en: "They are interchangeable", np: "ती साटासाट गर्न मिल्छ", jp: "互いに置き換え可能" },
            { en: "401 is a server error", np: "401 server को त्रुटि हो", jp: "401はサーバーエラー" },
          ],
          correctIndex: 0,
          explanation: { en: "Sending 403 to a logged-out user hides the fact that logging in would fix it.", np: "Logout भएको user लाई 403 पठाउँदा login गरे समाधान हुन्थ्यो भन्ने लुक्छ।", jp: "未ログインの利用者に403を返すと、ログインで解決することが伝わらない。" },
        },
        {
          question: { en: "What is a cookie for?", np: "Cookie केका लागि हो?", jp: "クッキーは何のためのものか?" },
          options: [
            { en: "Letting the server recognise the same browser on the next request", np: "अर्को request मा server ले उही browser चिन्न", jp: "次のリクエストでサーバーが同じブラウザを識別するため" },
            { en: "Storing files on the server", np: "Server मा file राख्न", jp: "サーバーにファイルを保存するため" },
            { en: "Encrypting the response body", np: "Response body encrypt गर्न", jp: "レスポンス本文を暗号化するため" },
          ],
          correctIndex: 0,
          explanation: { en: "That is what makes a login session possible across requests.", np: "यसैले request बीच login session सम्भव हुन्छ।", jp: "だからリクエストをまたいだログインセッションが成り立つ。" },
        },
        {
          question: { en: "In the request lifecycle, what comes between the Router and the Database?", np: "Request lifecycle मा, Router र Database बीच के आउँछ?", jp: "リクエストの流れで、ルーターとデータベースの間に来るものは?" },
          options: [
            { en: "The browser", np: "Browser", jp: "ブラウザ" },
            { en: "Nothing, the router queries the database", np: "केही होइन, router ले database सोध्छ", jp: "何もない。ルーターがDBに問い合わせる" },
            { en: "The Controller and the Model", np: "Controller र Model", jp: "コントローラとモデル" },
          ],
          correctIndex: 2,
          explanation: { en: "Router → Controller → Model → Database, then back out as a response.", np: "Router → Controller → Model → Database, अनि response भएर फिर्ता।", jp: "Router → Controller → Model → Database、そしてレスポンスとして戻る。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What is a class?", np: "Class के हो?", jp: "クラスとは何か?" },
      options: [
        { en: "A blueprint for creating objects", np: "Object बनाउने खाका", jp: "オブジェクトを作る設計図" },
        { en: "A database table", np: "Database को table", jp: "データベースのテーブル" },
        { en: "An HTTP request", np: "एउटा HTTP request", jp: "HTTPリクエスト" },
        { en: "A Git branch", np: "एउटा Git branch", jp: "Gitのブランチ" },
      ],
      correctIndex: 0,
      explanation: { en: "`new User()` turns the blueprint into an object you can use.", np: "`new User()` ले खाकालाई प्रयोग गर्न मिल्ने object बनाउँछ।", jp: "`new User()` が設計図を使えるオブジェクトに変える。" },
    },
    {
      question: { en: "What does an interface provide?", np: "Interface ले के दिन्छ?", jp: "インターフェースが与えるものは?" },
      options: [
        { en: "A database connection", np: "Database connection", jp: "データベース接続" },
        { en: "A contract that a class must follow", np: "Class ले पालना गर्नैपर्ने सम्झौता", jp: "クラスが従うべき契約" },
        { en: "A Git repository", np: "एउटा Git repository", jp: "Gitリポジトリ" },
        { en: "A browser cookie", np: "एउटा browser cookie", jp: "ブラウザのクッキー" },
      ],
      correctIndex: 1,
      explanation: { en: "It says which methods must exist, never how they work.", np: "यसले कुन method हुनैपर्छ भन्छ, कसरी काम गर्छ भन्दैन।", jp: "どのメソッドが要るかを言い、動き方は言わない。" },
    },
    {
      question: { en: "What does `?string` mean?", np: "`?string` को अर्थ के हो?", jp: "`?string` の意味は?" },
      options: [
        { en: "String or `null` is allowed", np: "String वा `null` अनुमति छ", jp: "文字列または `null`" },
        { en: "Only strings are allowed", np: "String मात्र अनुमति छ", jp: "文字列のみ" },
        { en: "Only integers are allowed", np: "Integer मात्र अनुमति छ", jp: "整数のみ" },
        { en: "Anything is allowed", np: "जे पनि अनुमति छ", jp: "何でも" },
      ],
      correctIndex: 0,
      explanation: { en: "The `?` adds `null` to whatever type follows it.", np: "`?` ले पछिको type मा `null` थप्छ।", jp: "`?` は続く型に `null` を加える。" },
    },
    {
      question: { en: "What is a trait for?", np: "Trait केका लागि हो?", jp: "トレイトは何のためか?" },
      options: [
        { en: "Connecting to a database", np: "Database सँग जोड्न", jp: "データベースに接続するため" },
        { en: "Sharing methods between unrelated classes", np: "असम्बन्धित class बीच method बाँड्न", jp: "無関係なクラス間でメソッドを共有するため" },
        { en: "Defining a route", np: "Route परिभाषित गर्न", jp: "ルートを定義するため" },
      ],
      correctIndex: 1,
      explanation: { en: "A real parent-child relationship is what inheritance is for.", np: "साँचो parent-child सम्बन्धका लागि inheritance हो।", jp: "本当の親子関係には継承を使う。" },
    },
    {
      question: { en: "What is Composer?", np: "Composer के हो?", jp: "Composerとは何か?" },
      options: [
        { en: "A JavaScript framework", np: "एउटा JavaScript framework", jp: "JavaScriptのフレームワーク" },
        { en: "A database", np: "एउटा database", jp: "データベース" },
        { en: "PHP's dependency manager", np: "PHP को dependency manager", jp: "PHPの依存管理ツール" },
        { en: "An HTTP server", np: "एउटा HTTP server", jp: "HTTPサーバー" },
      ],
      correctIndex: 2,
      explanation: { en: "It is to PHP what npm is to JavaScript.", np: "JavaScript लाई npm जे हो, PHP लाई Composer त्यही हो।", jp: "JavaScriptにとってのnpmが、PHPにとってのComposer。" },
    },
    {
      question: { en: "Which command do you run after cloning a Laravel project?", np: "Laravel project clone गरेपछि कुन command चलाउने?", jp: "Laravelプロジェクトをクローンした後に走らせるコマンドは?" },
      options: [
        { en: "`composer update`", np: "`composer update`", jp: "`composer update`" },
        { en: "`npm install`", np: "`npm install`", jp: "`npm install`" },
        { en: "`composer install`", np: "`composer install`", jp: "`composer install`" },
      ],
      correctIndex: 2,
      explanation: { en: "`install` uses the recorded versions; `update` would look for newer ones.", np: "`install` ले अभिलेख भएका version प्रयोग गर्छ; `update` ले नयाँ खोज्थ्यो।", jp: "`install` は記録済みの版を使う。`update` は新しい版を探してしまう。" },
    },
    {
      question: { en: "What does an SQL JOIN do?", np: "SQL JOIN ले के गर्छ?", jp: "SQLのJOINは何をするか?" },
      options: [
        { en: "Deletes tables", np: "Table मेटाउँछ", jp: "テーブルを削除する" },
        { en: "Starts Laravel", np: "Laravel सुरु गर्छ", jp: "Laravelを起動する" },
        { en: "Creates a Git branch", np: "Git branch बनाउँछ", jp: "Gitブランチを作る" },
        { en: "Combines related data from more than one table", np: "एकभन्दा बढी table को सम्बन्धित data जोड्छ", jp: "複数テーブルの関連データを結合する" },
      ],
      correctIndex: 3,
      explanation: { en: "`users.id → orders.user_id` is the idea behind `hasMany` in Eloquent.", np: "`users.id → orders.user_id` Eloquent को `hasMany` को विचार हो।", jp: "`users.id → orders.user_id` がEloquentの `hasMany` の考え。" },
    },
    {
      question: { en: "Which HTTP method is normally used to create a resource?", np: "Resource बनाउन सामान्यतया कुन HTTP method प्रयोग हुन्छ?", jp: "リソースの作成に通常使うHTTPメソッドは?" },
      options: [
        { en: "GET", np: "GET", jp: "GET" },
        { en: "DELETE", np: "DELETE", jp: "DELETE" },
        { en: "POST", np: "POST", jp: "POST" },
        { en: "PATCH", np: "PATCH", jp: "PATCH" },
      ],
      correctIndex: 2,
      explanation: { en: "`PATCH` updates part of an existing resource; `POST` creates a new one.", np: "`PATCH` ले भागमात्र अद्यावधिक गर्छ; `POST` ले नयाँ बनाउँछ।", jp: "`PATCH` は一部更新、`POST` は新規作成。" },
    },
    {
      question: { en: "What does HTTP 404 usually mean?", np: "HTTP 404 को अर्थ सामान्यतया के हो?", jp: "HTTP 404 は通常何を意味するか?" },
      options: [
        { en: "Success", np: "सफल", jp: "成功" },
        { en: "Not Found", np: "भेटिएन", jp: "見つからない" },
        { en: "Created", np: "बनाइयो", jp: "作成された" },
        { en: "Server Error", np: "Server को त्रुटि", jp: "サーバーエラー" },
      ],
      correctIndex: 1,
      explanation: { en: "It is a 4xx, so the problem is with the request, not the server.", np: "यो 4xx हो, त्यसैले समस्या request मा छ।", jp: "4xxなので、問題はリクエスト側にある。" },
    },
    {
      question: { en: "What is the goal of Phase 0?", np: "Phase 0 को लक्ष्य के हो?", jp: "Phase 0 の目的は?" },
      options: [
        { en: "To understand the ideas well enough to follow the Laravel lessons", np: "Laravel पाठ पछ्याउन पुग्ने गरी विचार बुझ्नु", jp: "Laravelの各回を追えるだけ、考え方を理解すること" },
        { en: "To master PHP, Git, SQL and HTTP before starting", np: "सुरु गर्नुअघि PHP, Git, SQL र HTTP मा दख्खल हासिल गर्नु", jp: "始める前にPHP・Git・SQL・HTTPを極めること" },
        { en: "To build a Laravel application", np: "Laravel application बनाउनु", jp: "Laravelアプリを作ること" },
      ],
      correctIndex: 0,
      explanation: { en: "Do not memorise Phase 0. Understand the ideas; Laravel teaches how they fit.", np: "Phase 0 नरट्नुहोस्। विचार बुझ्नुहोस्; कसरी मिल्छन् Laravel ले सिकाउँछ।", jp: "Phase 0 は暗記しない。考え方を理解すれば、噛み合わせ方はLaravelが教える。" },
    },
  ],
};
