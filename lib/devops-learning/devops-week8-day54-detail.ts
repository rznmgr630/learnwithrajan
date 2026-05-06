import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A pipeline that deploys without running tests is not CI/CD — it is automated risk. The test stage is what turns a pipeline from a deployment conveyor belt into a quality gate. Today you learn how to structure tests into three layers — unit (fast, isolated, run on every commit), integration (verify service contracts, run on PR merge), and end-to-end (simulate real users, run before production). The test pyramid principle says: write many unit tests, fewer integration tests, and very few e2e tests. Inverting this pyramid (heavy on e2e, light on unit) produces slow, flaky CI pipelines that developers start ignoring.",
    np: "Test run नगरी deploy गर्ने pipeline CI/CD होइन — यो automated risk हो। Test stage नै pipeline लाई deployment conveyor belt बाट quality gate मा convert गर्ने हो। आज तपाईंले test लाई तीन layer मा structure गर्न सिक्नुहुनेछ — unit (fast, isolated, हरेक commit मा run), integration (service contract verify, PR merge मा run), र end-to-end (real user simulate, production अघि run)। Test pyramid principle भन्छ: धेरै unit test लेख्नुहोस्, कम integration test, र धेरै कम e2e test। यो pyramid invert गर्दा (heavy on e2e, light on unit) slow, flaky CI pipeline बन्छ जसलाई developer ले ignore गर्न थाल्छन्।",
    jp: "テストを実行せずにデプロイするパイプラインは CI/CD ではありません — 自動化されたリスクです。テストステージこそがパイプラインをデプロイメントのコンベアベルトから品質ゲートに変えるものです。今日はテストを 3 つの層に構造化する方法を学びます — ユニット（高速・分離・すべてのコミットで実行）・統合（サービスコントラクトの検証・PR マージで実行）・エンドツーエンド（実ユーザーをシミュレート・本番前に実行）。テストピラミッドの原則は言います：多くのユニットテストを書き、より少ない統合テスト、そして非常に少ない e2e テストを書く。このピラミッドを逆転させると（e2e が多く unit が少ない）開発者が無視し始める遅くて不安定な CI パイプラインが生成されます。",
  } as const,
  o2: {
    en: "Today you wire Jest unit tests with code coverage thresholds, add a pytest integration test that spins up a real PostgreSQL container with Testcontainers, enforce minimum coverage in Jenkins (fail the build if coverage drops below 80 %), publish JUnit XML reports to the Jenkins test trend graph, and understand how to parallelize test stages to keep total CI time under 5 minutes.",
    np: "आज तपाईंले code coverage threshold सहित Jest unit test wire गर्नुहुनेछ, Testcontainers सँग real PostgreSQL container spin up गर्ने pytest integration test add गर्नुहुनेछ, Jenkins मा minimum coverage enforce गर्नुहुनेछ (coverage 80% भन्दा कम भयो भने build fail), JUnit XML report Jenkins test trend graph मा publish गर्नुहुनेछ, र total CI time 5 minute भित्र राख्न test stage parallelize गर्ने तरिका बुझ्नुहुनेछ।",
    jp: "今日はコードカバレッジしきい値で Jest ユニットテストを接続し・Testcontainers で実際の PostgreSQL コンテナを起動する pytest 統合テストを追加し・Jenkins で最小カバレッジを強制し（カバレッジが 80% を下回るとビルド失敗）・JUnit XML レポートを Jenkins テストトレンドグラフに公開し・合計 CI 時間を 5 分以内に保つためにテストステージを並列化する方法を理解します。",
  } as const,
};

export const DEVOPS_DAY_54_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "The test pyramid — layer types, scope & CI placement",
        np: "Test pyramid — layer type, scope र CI placement",
        jp: "テストピラミッド — 層の種類・スコープ・CI での配置",
      },
      blocks: [
        { type: "diagram", id: "devops-cicd-testing" },
        {
          type: "table",
          caption: {
            en: "CI test layers — scope, tool examples, CI stage, and speed",
            np: "CI test layer — scope, tool example, CI stage, र speed",
            jp: "CI テスト層 — スコープ・ツール例・CI ステージ・速度",
          },
          headers: [
            { en: "Layer", np: "Layer", jp: "層" },
            { en: "Scope", np: "Scope", jp: "スコープ" },
            { en: "Tools (JS / Python)", np: "Tools (JS / Python)", jp: "ツール（JS / Python）" },
            { en: "CI trigger", np: "CI trigger", jp: "CI トリガー" },
            { en: "Target time", np: "Target time", jp: "目標時間" },
          ],
          rows: [
            [
              { en: "Unit", np: "Unit", jp: "ユニット" },
              { en: "Single function / class in isolation — dependencies mocked", np: "Single function / class in isolation — dependency mock", jp: "単一の関数 / クラスを分離して — 依存関係をモック" },
              { en: "Jest, Vitest / pytest, unittest", np: "Jest, Vitest / pytest, unittest", jp: "Jest・Vitest / pytest・unittest" },
              { en: "Every commit (push / PR)", np: "हरेक commit (push / PR)", jp: "すべてのコミット（push / PR）" },
              { en: "< 2 min", np: "< 2 मिनेट", jp: "2 分未満" },
            ],
            [
              { en: "Integration", np: "Integration", jp: "統合" },
              { en: "Multiple services / DB together — real containers via Testcontainers", np: "Multiple service / DB सँगै — Testcontainers मार्फत real container", jp: "複数のサービス / DB を一緒に — Testcontainers を使った実コンテナ" },
              { en: "Supertest, Playwright API / pytest + Testcontainers", np: "Supertest, Playwright API / pytest + Testcontainers", jp: "Supertest・Playwright API / pytest + Testcontainers" },
              { en: "PR merge to main / develop", np: "PR merge to main / develop", jp: "main / develop への PR マージ" },
              { en: "2–8 min", np: "2–8 मिनेट", jp: "2〜8 分" },
            ],
            [
              { en: "E2E / Smoke", np: "E2E / Smoke", jp: "E2E / スモーク" },
              { en: "Full user flow through UI — real browser, real backend", np: "UI मार्फत full user flow — real browser, real backend", jp: "UI を通じた完全なユーザーフロー — 実ブラウザ・実バックエンド" },
              { en: "Playwright, Cypress / Selenium", np: "Playwright, Cypress / Selenium", jp: "Playwright・Cypress / Selenium" },
              { en: "Before production deploy (staging)", np: "Production deploy अघि (staging)", jp: "本番デプロイ前（ステージング）" },
              { en: "10–30 min", np: "10–30 मिनेट", jp: "10〜30 分" },
            ],
            [
              { en: "Coverage gate", np: "Coverage gate", jp: "カバレッジゲート" },
              { en: "Percentage of lines/branches exercised by unit + integration tests", np: "Unit + integration test ले exercise गरिएको lines/branches percentage", jp: "ユニット + 統合テストでカバーされる行 / ブランチの割合" },
              { en: "Istanbul/nyc (JS) / coverage.py, pytest-cov", np: "Istanbul/nyc (JS) / coverage.py, pytest-cov", jp: "Istanbul/nyc（JS）/ coverage.py・pytest-cov" },
              { en: "Block merge / deploy when coverage < threshold", np: "Coverage < threshold भयो भने merge / deploy block", jp: "カバレッジがしきい値を下回る場合はマージ / デプロイをブロック" },
              { en: "Inline with unit tests", np: "Unit test सँगै", jp: "ユニットテストと同時" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Test configuration, coverage enforcement & Jenkins integration",
        np: "Test configuration, coverage enforcement र Jenkins integration",
        jp: "テスト設定・カバレッジ強制・Jenkins 統合",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Jest unit tests + coverage threshold + pytest integration + Jenkins pipeline",
            np: "Jest unit test + coverage threshold + pytest integration + Jenkins pipeline",
            jp: "Jest ユニットテスト + カバレッジしきい値 + pytest 統合 + Jenkins パイプライン",
          },
          code: `// ── jest.config.js — unit tests with coverage threshold ────────
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'cobertura'],   // cobertura → Jenkins
  coverageThreshold: {
    global: {
      lines:      80,
      branches:   75,
      functions:  80,
      statements: 80,
    },
  },
};

// ── src/__tests__/order.test.js — example unit test ─────────────
const { calculateTotal } = require('../order');

test('applies discount correctly', () => {
  expect(calculateTotal(100, 0.1)).toBe(90);
});

test('throws on negative price', () => {
  expect(() => calculateTotal(-1, 0)).toThrow('Price must be positive');
});


# ── pytest integration test with Testcontainers ─────────────────
# pip install pytest testcontainers psycopg2-binary
import pytest
from testcontainers.postgres import PostgresContainer
from myapp.db import UserRepository

@pytest.fixture(scope="session")
def pg():
    with PostgresContainer("postgres:16-alpine") as container:
        yield container.get_connection_url()

def test_create_and_fetch_user(pg):
    repo = UserRepository(pg)
    repo.migrate()
    user_id = repo.create(name="Alice", email="alice@example.com")
    user = repo.find_by_id(user_id)
    assert user.name == "Alice"

# pytest.ini — coverage config
# [pytest]
# addopts = --cov=myapp --cov-report=xml:coverage.xml --cov-fail-under=80


# ── Jenkinsfile — parallel test stages ──────────────────────────
pipeline {
  agent any

  stages {
    stage('Test') {
      parallel {
        stage('Unit — JS') {
          agent { docker { image 'node:20-alpine' } }
          steps {
            sh 'npm ci'
            sh 'npm test -- --ci'
          }
          post {
            always {
              // Publish JUnit results to Jenkins test trend graph
              junit 'junit.xml'
              // Publish coverage to Jenkins Coverage Plugin
              publishCoverage adapters: [
                coberturaAdapter('coverage/cobertura-coverage.xml')
              ], sourceFileResolver: sourceFiles('NEVER_STORE')
            }
          }
        }

        stage('Integration — Python') {
          agent { docker { image 'python:3.12-slim' } }
          steps {
            sh 'pip install -r requirements.txt'
            sh 'pytest tests/integration/ -v --junit-xml=pytest-results.xml'
          }
          post {
            always { junit 'pytest-results.xml' }
          }
        }
      }
    }

    stage('Coverage Gate') {
      steps {
        // Fail the build if overall line coverage < 80 %
        script {
          def cov = readFile('coverage/cobertura-coverage.xml')
          def lineRate = (cov =~ /line-rate="([\\.0-9]+)"/)[0][1].toFloat()
          if (lineRate < 0.80) {
            error "Coverage \${(lineRate * 100).toInt()}% is below required 80%"
          }
          echo "Coverage OK: \${(lineRate * 100).toInt()}%"
        }
      }
    }
  }
}`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Add coverage thresholds to your existing Jest config (`coverageThreshold` for lines and branches at 80%). Run `npm test` and intentionally delete a test to see the pipeline fail with a coverage error. Restore the test and confirm it passes again.",
              np: "Existing Jest config मा coverage threshold add गर्नुहोस् (`coverageThreshold` lines र branches 80% मा)। `npm test` run गर्नुहोस् र जानाजानी एउटा test delete गरी pipeline coverage error सँग fail भएको हेर्नुहोस्। Test restore गर्नुहोस् र फेरि pass भएको confirm गर्नुहोस्।",
              jp: "既存の Jest 設定にカバレッジしきい値を追加する（lines と branches を 80% に `coverageThreshold` を設定）。`npm test` を実行し、意図的にテストを削除してパイプラインがカバレッジエラーで失敗するのを確認する。テストを復元して再び成功することを確認する。",
            },
            {
              en: "Write a Testcontainers integration test that spins up a real database container, runs a query, and asserts the result. Run `pytest -v` locally to see the container start and stop automatically. Notice how the test verifies the real schema, not a mock.",
              np: "Real database container spin up गर्ने, query run गर्ने, र result assert गर्ने Testcontainers integration test लेख्नुहोस्। Container automatically start र stop भएको हेर्न locally `pytest -v` run गर्नुहोस्। Test ले real schema verify गर्ने तरिका notice गर्नुहोस्, mock होइन।",
              jp: "実際のデータベースコンテナを起動し・クエリを実行し・結果をアサートする Testcontainers 統合テストを書く。コンテナが自動的に起動・停止するのを確認するために `pytest -v` をローカルで実行する。テストがモックではなく実際のスキーマを検証していることに注目する。",
            },
            {
              en: "Update your Jenkinsfile to run unit and integration tests in `parallel` stages. Add a `junit` post step to each stage so that Jenkins renders a test trend graph on the pipeline page. Run two builds — let one fail a test — and observe how the trend graph shows the regression.",
              np: "Unit र integration test parallel stage मा run गर्न Jenkinsfile update गर्नुहोस्। Jenkins ले pipeline page मा test trend graph render गर्न प्रत्येक stage मा `junit` post step add गर्नुहोस्। दुई build run गर्नुहोस् — एउटामा test fail गर्नुहोस् — र trend graph ले regression कसरी देखाउँछ observe गर्नुहोस्।",
              jp: "ユニットと統合テストを `parallel` ステージで実行するように Jenkinsfile を更新する。Jenkins がパイプラインページにテストトレンドグラフをレンダリングするように各ステージに `junit` ポストステップを追加する。2 回のビルドを実行し — 1 回はテストを失敗させ — トレンドグラフがリグレッションをどのように表示するかを観察する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `junit` post step and the Coverage Plugin in Jenkins?",
        np: "Jenkins मा `junit` post step र Coverage Plugin बीचको फरक के हो?",
        jp: "Jenkins の `junit` ポストステップとカバレッジプラグインの違いは何か？",
      },
      answer: {
        en: "`junit 'path/to/results.xml'` reads JUnit-format XML (produced by Jest, pytest, JUnit) and plots a test trend graph on the pipeline page — how many tests passed, failed, and skipped over time. It does not measure code coverage. The Coverage Plugin (or `publishCoverage`) reads Cobertura/JaCoCo XML files and renders a separate coverage trend graph showing line, branch, and instruction percentages. You need both: `junit` to catch regressions (a test that used to pass now fails), and `publishCoverage` to catch coverage drops (new code was added but no tests were written). Without `junit`, Jenkins marks stages green even when 10 tests fail.",
        np: "`junit 'path/to/results.xml'` ले JUnit-format XML (Jest, pytest, JUnit ले produce) read गरी pipeline page मा test trend graph plot गर्छ — time over कति test pass, fail, र skip भयो। यसले code coverage measure गर्दैन। Coverage Plugin (वा `publishCoverage`) ले Cobertura/JaCoCo XML file read गरी line, branch, र instruction percentage देखाउने separate coverage trend graph render गर्छ। दुवै चाहिन्छ: regression catch गर्न `junit` (pass हुने test अब fail भयो), र coverage drop catch गर्न `publishCoverage` (new code add भयो तर test लेखिएन)। `junit` बिना, Jenkins ले 10 test fail भए पनि stage green mark गर्छ।",
        jp: "`junit 'path/to/results.xml'` は JUnit 形式の XML（Jest・pytest・JUnit が生成）を読み込みパイプラインページにテストトレンドグラフをプロットします — 時間の経過とともにいくつのテストが合格・失敗・スキップされたか。コードカバレッジは測定しません。カバレッジプラグイン（または `publishCoverage`）は Cobertura/JaCoCo XML ファイルを読み込み行・ブランチ・命令のパーセンテージを表示する別のカバレッジトレンドグラフをレンダリングします。両方が必要です：リグレッションをキャッチするために `junit`（以前合格していたテストが今は失敗する）、カバレッジの低下をキャッチするために `publishCoverage`（新しいコードが追加されたがテストが書かれていない）。`junit` がなければ Jenkins は 10 個のテストが失敗してもステージをグリーンにマークします。",
      },
      tag: { en: "jenkins reports", np: "Jenkins Reports", jp: "Jenkins レポート" },
    },
    {
      question: {
        en: "Should I use Testcontainers or a dedicated test database service in CI?",
        np: "CI मा Testcontainers वा dedicated test database service प्रयोग गर्नुपर्छ?",
        jp: "CI で Testcontainers と専用のテストデータベースサービスのどちらを使うべきか？",
      },
      answer: {
        en: "Testcontainers is almost always the better choice for integration tests because it starts a real container for each test session, uses the exact same DB version as production, and cleans up automatically — no shared state between test runs. The downside is a 5–15 second container startup cost per test run. A dedicated CI service (a long-lived Postgres container in `docker-compose` used in CI) avoids that startup cost but introduces shared state: if one test leaves dirty data, the next test sees it. If you run test stages in parallel, multiple pipeline builds could write to the same database simultaneously. Testcontainers eliminates both problems. The 15-second overhead is acceptable when your test suite itself takes 2+ minutes.",
        np: "Integration test को लागि Testcontainers लगभग हमेशा राम्रो choice हो किनभने यसले हरेक test session को लागि real container start गर्छ, production जस्तै exact DB version प्रयोग गर्छ, र automatically clean up हुन्छ — test run बीच shared state छैन। Downside हो test run प्रति 5–15 second container startup cost। Dedicated CI service (CI मा प्रयोग गरिने `docker-compose` मा long-lived Postgres container) त्यो startup cost avoid गर्छ तर shared state introduce गर्छ: एउटा test ले dirty data छोड्यो भने अर्को test ले देख्छ। Test stage parallel मा run गर्दा, multiple pipeline build एकैसाथ same database मा write गर्न सक्छ। Testcontainers ले दुवै problem eliminate गर्छ। तपाईंको test suite नै 2+ minute लिन्छ भने 15-second overhead acceptable छ।",
        jp: "Testcontainers は統合テストにほぼ常により良い選択です。各テストセッションに実際のコンテナを起動し・本番と全く同じ DB バージョンを使用し・自動的にクリーンアップするからです — テスト実行間で共有状態なし。欠点はテスト実行ごとに 5〜15 秒のコンテナ起動コストがあることです。専用の CI サービス（CI で使用される `docker-compose` の長期間生存する Postgres コンテナ）はその起動コストを回避しますが共有状態をもたらします：1 つのテストが汚れたデータを残すと次のテストがそれを見ます。テストステージを並列で実行する場合、複数のパイプラインビルドが同時に同じデータベースに書き込む可能性があります。Testcontainers は両方の問題を解消します。テストスイート自体が 2 分以上かかる場合、15 秒のオーバーヘッドは許容できます。",
      },
      tag: { en: "testcontainers", np: "Testcontainers", jp: "Testcontainers" },
    },
  ],
};
