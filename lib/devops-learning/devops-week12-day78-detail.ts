import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Infrastructure as Code (IaC)** is the practice of managing and provisioning infrastructure through machine-readable configuration files rather than manual processes. Before IaC, infrastructure was provisioned through GUIs, click-ops, or ad-hoc shell scripts — leading to snowflake servers (no two environments are identical), undocumented configuration drift, and environments that are impossible to reproduce when a server dies at 2 AM. IaC solves all of this: every resource is version-controlled in Git, peer-reviewed like application code, rolled back when something breaks, and reproducible on demand. There are two IaC paradigms: **declarative** (you describe the desired end state — Terraform, CloudFormation, Pulumi in config mode) and **imperative** (you describe the exact steps to get there — AWS CLI scripts, custom Boto3 automation, custom Bash). Declarative wins for infrastructure because the tool handles **idempotency** for you: you declare what you want, and the tool figures out which API calls are needed to reconcile the current state with the desired state. Running `terraform apply` twice is safe — the second run detects no drift and makes no changes. Imperative scripts lack this guarantee: running a Bash script twice may create duplicate resources, fail with \"already exists\" errors, or silently overwrite changes made by others. Terraform sits squarely in the declarative camp and is the dominant IaC tool in the industry today, used by startups and enterprises alike to manage infrastructure across every major cloud and dozens of SaaS platforms.",
    np: "**Infrastructure as Code (IaC)** भनेको manual process को सट्टा machine-readable configuration file मार्फत infrastructure manage र provision गर्ने practice हो। IaC अघि, infrastructure GUI, click-ops, वा ad-hoc shell script मार्फत provision हुन्थ्यो — जसले गर्दा snowflake server (दुई environment एकसमान छैनन्), undocumented configuration drift, र राति २ बजे server बिग्रिँदा reproduce गर्न नसकिने environment सिर्जना हुन्थ्यो। IaC ले यी सबै solve गर्छ: हरेक resource Git मा version-controlled छ, application code जस्तै peer-reviewed छ, केही बिग्रिँदा rollback हुन्छ, र माग अनुसार reproducible छ। दुईवटा IaC paradigm छन्: **declarative** (तपाईंले desired end state describe गर्नुहुन्छ — Terraform, CloudFormation, config mode मा Pulumi) र **imperative** (तपाईंले त्यहाँ पुग्ने exact step describe गर्नुहुन्छ — AWS CLI script, custom Boto3 automation, custom Bash)। Infrastructure को लागि declarative जित्छ किनभने tool ले तपाईंको लागि **idempotency** handle गर्छ: तपाईंले के चाहनुभएको declare गर्नुहुन्छ, र tool ले current state लाई desired state सँग reconcile गर्न कुन API call चाहिन्छ पत्ता लगाउँछ। `terraform apply` दुई पटक run गर्नु safe छ — दोस्रो run ले कुनै drift detect गर्दैन र कुनै change गर्दैन। Imperative script मा यो guarantee छैन: Bash script दुई पटक run गर्दा duplicate resource create हुन सक्छ, 'already exists' error आउन सक्छ, वा अरूले गरेको change silently overwrite हुन सक्छ। Terraform declarative camp मा राम्रोसँग बस्छ र आज industry मा dominant IaC tool हो, startup र enterprise दुवैले हरेक major cloud र dozens of SaaS platform मा infrastructure manage गर्न प्रयोग गर्छन्।",
    jp: "**Infrastructure as Code（IaC）**とは、手動プロセスではなく機械可読な設定ファイルを通じてインフラを管理・プロビジョニングする実践です。IaC 以前、インフラは GUI・クリックオペレーション・アドホックなシェルスクリプトでプロビジョニングされていました — これによりスノーフレークサーバー（2 つの環境が同一でない）・文書化されていない設定ドリフト・深夜 2 時にサーバーが壊れたときに再現不可能な環境が生まれていました。IaC はこれらすべてを解決します：すべてのリソースが Git でバージョン管理され・アプリケーションコードのようにピアレビューされ・何かが壊れたときにロールバックされ・オンデマンドで再現可能です。IaC のパラダイムは 2 つあります：**宣言型**（望む最終状態を記述する — Terraform・CloudFormation・設定モードの Pulumi）と**命令型**（そこに至る正確な手順を記述する — AWS CLI スクリプト・カスタム Boto3 自動化・カスタム Bash）。インフラには宣言型が勝ります。なぜならツールが**冪等性**を処理してくれるからです：何が欲しいかを宣言すれば、ツールが現在の状態と望む状態を調和させるために必要な API 呼び出しを把握します。`terraform apply` を 2 回実行しても安全です — 2 回目の実行はドリフトを検出せず変更を行いません。命令型スクリプトにはこの保証がありません：Bash スクリプトを 2 回実行すると重複リソースが作成されたり・「already exists」エラーが発生したり・他者が行った変更がサイレントに上書きされる可能性があります。Terraform は宣言型陣営にしっかりと位置し、今日の業界で支配的な IaC ツールであり、スタートアップと企業の両方がすべての主要クラウドと数十の SaaS プラットフォームにわたるインフラを管理するために使用しています。",
  } as const,
  o2: {
    en: "Why Terraform specifically, when there are other IaC tools? **Multi-cloud by design**: a single tool manages AWS, Azure, GCP, Kubernetes, GitHub, Datadog, PagerDuty, and 3,000+ other providers using the same HCL syntax — no need to learn CloudFormation for AWS and Bicep for Azure separately. **Rich provider ecosystem**: the Terraform Registry hosts providers and modules for virtually everything imaginable, maintained by both HashiCorp and the community. **Plan before apply**: `terraform plan` is arguably Terraform's killer feature — it shows exactly what will be created, modified, or destroyed before any change is made. This is the infrastructure equivalent of `--dry-run` and it is invaluable for catching mistakes before they hit production. **State management**: Terraform tracks everything it has created in a state file, enabling incremental changes — you don't need to describe the whole infrastructure every time, just the delta. **Modules**: reusable, parameterized infrastructure components that can be shared across teams and projects via the Terraform Registry, enabling DRY (Don't Repeat Yourself) infrastructure code. **Compare with alternatives**: CloudFormation is AWS-only, written in verbose YAML or JSON, with no multi-cloud story and a slower plan/apply cycle. Pulumi uses real general-purpose programming languages (Python, TypeScript, Go) which adds power (loops, conditionals, type safety) but also complexity and a steeper learning curve for infrastructure engineers who aren't software developers. CDK (Cloud Development Kit) is excellent for AWS-centric shops using TypeScript/Python but has a steep learning curve and limited multi-cloud support. Terraform's HCL is a sweet spot: purpose-built for infrastructure, human-readable, declarative, and the most widely adopted IaC language in the world.",
    np: "अरू IaC tool भएको बेला Terraform किन specifically? **Multi-cloud by design**: एउटा tool ले AWS, Azure, GCP, Kubernetes, GitHub, Datadog, PagerDuty, र ३,०००+ अरू provider लाई same HCL syntax प्रयोग गरेर manage गर्छ — AWS को लागि CloudFormation र Azure को लागि Bicep छुट्टाछुट्टै सिक्न पर्दैन। **Rich provider ecosystem**: Terraform Registry ले वास्तवमा सबै imaginable thing को लागि provider र module host गर्छ, HashiCorp र community दुवैले maintain गरेको। **Plan before apply**: `terraform plan` Terraform को killer feature भन्न सकिन्छ — कुनै change हुनुअघि नै exactly के create, modify, वा destroy हुनेछ देखाउँछ। यो infrastructure को `--dry-run` equivalent हो र production मा पुग्नुअघि गल्ती समात्न invaluable छ। **State management**: Terraform ले आफूले create गरेको सबैकुरा state file मा track गर्छ, incremental change enable गर्छ — हर पटक पूरा infrastructure describe गर्न पर्दैन, केवल delta मात्र। **Module**: reusable, parameterized infrastructure component जो Terraform Registry मार्फत team र project मा share गर्न सकिन्छ, DRY (Don't Repeat Yourself) infrastructure code enable गर्दछ। **Alternative सँग तुलना**: CloudFormation AWS-only छ, verbose YAML वा JSON मा लेखिएको, कुनै multi-cloud story छैन र slower plan/apply cycle छ। Pulumi ले real general-purpose programming language (Python, TypeScript, Go) प्रयोग गर्छ जसले power थप्छ (loop, conditional, type safety) तर software developer नभएका infrastructure engineer को लागि complexity र steeper learning curve पनि थप्छ। CDK (Cloud Development Kit) TypeScript/Python प्रयोग गर्ने AWS-centric shop को लागि excellent छ तर steep learning curve र limited multi-cloud support छ। Terraform को HCL sweet spot हो: infrastructure को लागि purpose-built, human-readable, declarative, र संसारमा सबैभन्दा widely adopted IaC language।",
    jp: "他の IaC ツールがある中でなぜ特に Terraform なのか？**マルチクラウド設計**：単一のツールが同じ HCL 構文を使って AWS・Azure・GCP・Kubernetes・GitHub・Datadog・PagerDuty および 3,000 以上の他のプロバイダーを管理します — AWS の CloudFormation と Azure の Bicep を別々に学ぶ必要がありません。**豊富なプロバイダーエコシステム**：Terraform Registry は HashiCorp とコミュニティの両方によってメンテナンスされている、事実上すべての想像できるものに対するプロバイダーとモジュールをホストします。**適用前の計画**：`terraform plan` は間違いなく Terraform のキラー機能です — 変更が行われる前に正確に何が作成・変更・削除されるかを示します。これはインフラの `--dry-run` 相当であり、本番環境に到達する前のミスを捕捉するために非常に価値があります。**状態管理**：Terraform は作成したすべてのものを状態ファイルで追跡し、インクリメンタルな変更を可能にします — 毎回インフラ全体を記述する必要はなく、差分だけで十分です。**モジュール**：Terraform Registry を通じてチームやプロジェクト間で共有できる再利用可能なパラメーター化されたインフラコンポーネントで、DRY（Don't Repeat Yourself）なインフラコードを可能にします。**代替手段との比較**：CloudFormation は AWS 専用で、冗長な YAML または JSON で書かれており、マルチクラウド対応がなく plan/apply サイクルが遅いです。Pulumi は実際の汎用プログラミング言語（Python・TypeScript・Go）を使用し、パワー（ループ・条件分岐・型安全性）を加えますが、ソフトウェア開発者でないインフラエンジニアには複雑さと急な学習曲線をもたらします。CDK（Cloud Development Kit）は TypeScript/Python を使う AWS 中心のチームには優れていますが、急な学習曲線と限られたマルチクラウドサポートがあります。Terraform の HCL は最適なバランスです：インフラのために目的設計され・人間が読みやすく・宣言型で・世界で最も広く採用されている IaC 言語です。",
  } as const,
};

export const DEVOPS_DAY_78_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "IaC paradigms & Terraform's place in the ecosystem",
        np: "IaC paradigm र ecosystem मा Terraform को स्थान",
        jp: "IaC パラダイムとエコシステムにおける Terraform の位置づけ",
      },
      blocks: [
        { type: "diagram", id: "devops-terraform-overview" },
        {
          type: "table",
          caption: {
            en: "IaC tools comparison — choosing the right tool for the job",
            np: "IaC tool तुलना — काम को लागि सही tool छान्न",
            jp: "IaC ツール比較 — 仕事に適したツールの選択",
          },
          headers: [
            { en: "Tool", np: "Tool", jp: "ツール" },
            { en: "Cloud support", np: "Cloud support", jp: "クラウドサポート" },
            { en: "Language", np: "Language", jp: "言語" },
            { en: "Plan / preview", np: "Plan / preview", jp: "プラン／プレビュー" },
            { en: "State management", np: "State management", jp: "状態管理" },
            { en: "Best for", np: "Best for", jp: "最適な用途" },
          ],
          rows: [
            [
              { en: "Terraform", np: "Terraform", jp: "Terraform" },
              { en: "AWS, Azure, GCP, 3000+ providers", np: "AWS, Azure, GCP, ३०००+ provider", jp: "AWS・Azure・GCP・3000 以上のプロバイダー" },
              { en: "HCL (declarative)", np: "HCL (declarative)", jp: "HCL（宣言型）" },
              { en: "`terraform plan` — diff before apply", np: "`terraform plan` — apply अघि diff", jp: "`terraform plan` — 適用前の差分" },
              { en: "tfstate file (local or remote)", np: "tfstate file (local वा remote)", jp: "tfstate ファイル（ローカルまたはリモート）" },
              { en: "Multi-cloud, team infrastructure", np: "Multi-cloud, team infrastructure", jp: "マルチクラウド・チームインフラ" },
            ],
            [
              { en: "CloudFormation", np: "CloudFormation", jp: "CloudFormation" },
              { en: "AWS only", np: "AWS मात्र", jp: "AWS のみ" },
              { en: "YAML / JSON (declarative)", np: "YAML / JSON (declarative)", jp: "YAML / JSON（宣言型）" },
              { en: "Change sets (manual review step)", np: "Change set (manual review step)", jp: "変更セット（手動レビューステップ）" },
              { en: "AWS-managed, no config needed", np: "AWS-managed, कुनै config चाहिँदैन", jp: "AWS 管理型・設定不要" },
              { en: "AWS-only shops, native AWS integration", np: "AWS-only shop, native AWS integration", jp: "AWS 専用チーム・ネイティブ AWS 統合" },
            ],
            [
              { en: "Pulumi", np: "Pulumi", jp: "Pulumi" },
              { en: "AWS, Azure, GCP, Kubernetes", np: "AWS, Azure, GCP, Kubernetes", jp: "AWS・Azure・GCP・Kubernetes" },
              { en: "Python, TypeScript, Go, C# (imperative)", np: "Python, TypeScript, Go, C# (imperative)", jp: "Python・TypeScript・Go・C#（命令型）" },
              { en: "`pulumi preview` — full diff", np: "`pulumi preview` — full diff", jp: "`pulumi preview` — フル差分" },
              { en: "Pulumi Cloud or self-hosted backend", np: "Pulumi Cloud वा self-hosted backend", jp: "Pulumi Cloud またはセルフホストバックエンド" },
              { en: "Dev-heavy teams, complex logic in IaC", np: "Dev-heavy team, IaC मा complex logic", jp: "開発者主体のチーム・IaC での複雑なロジック" },
            ],
            [
              { en: "CDK", np: "CDK", jp: "CDK" },
              { en: "AWS (CDK for Terraform adds multi-cloud)", np: "AWS (CDK for Terraform ले multi-cloud add गर्छ)", jp: "AWS（CDK for Terraform がマルチクラウドを追加）" },
              { en: "TypeScript, Python, Java (imperative)", np: "TypeScript, Python, Java (imperative)", jp: "TypeScript・Python・Java（命令型）" },
              { en: "`cdk diff` — synthesizes CloudFormation", np: "`cdk diff` — CloudFormation synthesize", jp: "`cdk diff` — CloudFormation に合成" },
              { en: "CloudFormation stacks under the hood", np: "अन्तर्गत CloudFormation stack", jp: "内部では CloudFormation スタック" },
              { en: "AWS-centric orgs using TypeScript/Python", np: "TypeScript/Python प्रयोग गर्ने AWS-centric org", jp: "TypeScript/Python を使う AWS 中心の組織" },
            ],
            [
              { en: "Ansible", np: "Ansible", jp: "Ansible" },
              { en: "Any SSH-able host + cloud modules", np: "जुनसुकै SSH-able host + cloud module", jp: "SSH 可能なホスト + クラウドモジュール" },
              { en: "YAML (imperative with idempotent modules)", np: "YAML (idempotent module सहित imperative)", jp: "YAML（冪等モジュール付き命令型）" },
              { en: "No built-in plan/preview step", np: "Built-in plan/preview step छैन", jp: "組み込みの plan/preview ステップなし" },
              { en: "No state file — re-checks live state", np: "State file छैन — live state re-check", jp: "状態ファイルなし — ライブ状態を再確認" },
              { en: "Configuration management, OS-level tasks", np: "Configuration management, OS-level task", jp: "構成管理・OS レベルのタスク" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Installing Terraform & your first resource",
        np: "Terraform install गर्ने र पहिलो resource",
        jp: "Terraform のインストールと最初のリソース",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Terraform installation, provider setup, and the full apply/destroy lifecycle",
            np: "Terraform installation, provider setup, र पूरा apply/destroy lifecycle",
            jp: "Terraform インストール・プロバイダーセットアップ・完全な apply/destroy ライフサイクル",
          },
          code: `# ── 1. Install Terraform ─────────────────────────────────────────────
# macOS with Homebrew (recommended)
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Ubuntu / Debian
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | \\
  sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \\
  https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \\
  sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# tfenv — version manager (recommended for teams)
brew install tfenv
tfenv install 1.7.5          # install specific version
tfenv use 1.7.5              # activate it
terraform version            # verify

# ── 2. Project structure ─────────────────────────────────────────────
mkdir my-first-terraform && cd my-first-terraform
# Convention: main.tf (resources), variables.tf, outputs.tf

# ── 3. main.tf — the core configuration ──────────────────────────────
cat > main.tf << 'EOF'
# terraform block: configure the Terraform binary itself
terraform {
  required_version = ">= 1.5.0"   # minimum Terraform version

  required_providers {
    aws = {
      source  = "hashicorp/aws"    # registry.terraform.io/hashicorp/aws
      version = "~> 5.0"           # any 5.x release
    }
  }
}

# provider block: configure the AWS provider
provider "aws" {
  region = "us-east-1"
  # credentials come from ~/.aws/credentials or env vars:
  # AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
}

# resource block: declare a managed infrastructure object
# syntax: resource "<TYPE>" "<LOCAL_NAME>" { ... }
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-terraform-learning-bucket-20240101"  # must be globally unique

  tags = {
    Name        = "My Terraform Bucket"
    Environment = "learning"
    ManagedBy   = "terraform"
  }
}

# resource: enable versioning on the bucket
resource "aws_s3_bucket_versioning" "my_bucket_versioning" {
  bucket = aws_s3_bucket.my_bucket.id   # reference: TYPE.NAME.ATTRIBUTE

  versioning_configuration {
    status = "Enabled"
  }
}
EOF

# ── 4. The Terraform workflow ────────────────────────────────────────
# Step 1: init — download providers, set up .terraform directory
terraform init
# Downloads hashicorp/aws ~5.0 into .terraform/providers/
# Creates .terraform.lock.hcl (pin exact provider versions in git)

# Step 2: fmt — auto-format HCL to canonical style
terraform fmt
terraform fmt -check   # exit non-zero if formatting needed (CI use)

# Step 3: validate — check syntax and config correctness (no API calls)
terraform validate
# Output: Success! The configuration is valid.

# Step 4: plan — show what WILL happen, no changes made
terraform plan
# Output: Plan: 2 to add, 0 to change, 0 to destroy.
terraform plan -out=tfplan   # save plan to file for safe apply

# Step 5: apply — create/update resources
terraform apply              # prompts for confirmation
terraform apply tfplan       # apply saved plan (no prompt, safe for CI)
terraform apply -auto-approve  # skip prompt (use with caution)

# Step 6: inspect state
terraform show               # full current state
terraform state list         # list all managed resources
terraform output             # show output values

# Step 7: destroy — tear down all managed resources
terraform destroy
terraform destroy -auto-approve  # skip confirmation (CI/cleanup)

# ── 5. Files created ─────────────────────────────────────────────────
# .terraform/           — downloaded providers (gitignore this)
# .terraform.lock.hcl   — provider version lock (COMMIT this)
# terraform.tfstate     — current state (gitignore for local, use remote backend)
# terraform.tfstate.backup — previous state backup`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Install Terraform using tfenv and create a `main.tf` that configures the AWS provider for `us-east-1` and declares one `aws_s3_bucket` resource with a unique name and three tags (`Name`, `Environment`, `ManagedBy`). Run `terraform init`, `terraform fmt`, `terraform validate`, and `terraform plan`. Read the plan output carefully — identify the `+` (create) symbols, confirm the resource type and name, and note the estimated cost section. Then run `terraform apply` (type `yes`). After apply, run `terraform state list` and `terraform show` to see the full resource attributes including the ARN and hosted zone ID that AWS assigned. Finally, run `terraform destroy` to clean up.",
              np: "tfenv प्रयोग गरेर Terraform install गर्नुहोस् र `main.tf` create गर्नुहोस् जसले `us-east-1` को लागि AWS provider configure गर्छ र unique name र तीनवटा tag (`Name`, `Environment`, `ManagedBy`) सहित एउटा `aws_s3_bucket` resource declare गर्छ। `terraform init`, `terraform fmt`, `terraform validate`, र `terraform plan` run गर्नुहोस्। Plan output ध्यानपूर्वक पढ्नुहोस् — `+` (create) symbol identify गर्नुहोस्, resource type र name confirm गर्नुहोस्, र estimated cost section note गर्नुहोस्। त्यसपछि `terraform apply` run गर्नुहोस् (`yes` type गर्नुहोस्)। Apply पछि, `terraform state list` र `terraform show` run गरेर AWS ले assign गरेको ARN र hosted zone ID सहित full resource attribute हेर्नुहोस्। अन्तमा, cleanup गर्न `terraform destroy` run गर्नुहोस्।",
              jp: "tfenv を使って Terraform をインストールし、`us-east-1` の AWS プロバイダーを設定して一意の名前と 3 つのタグ（`Name`・`Environment`・`ManagedBy`）を持つ `aws_s3_bucket` リソースを 1 つ宣言する `main.tf` を作成する。`terraform init`・`terraform fmt`・`terraform validate`・`terraform plan` を実行する。プラン出力を注意深く読む — `+`（作成）シンボルを識別し、リソースタイプと名前を確認し、estimated cost セクションに注目する。次に `terraform apply` を実行する（`yes` と入力）。適用後、`terraform state list` と `terraform show` を実行して AWS が割り当てた ARN とホストゾーン ID を含む完全なリソース属性を確認する。最後にクリーンアップのため `terraform destroy` を実行する。",
            },
            {
              en: "Add a second resource to your `main.tf`: an `aws_s3_bucket_versioning` block that references the bucket via `aws_s3_bucket.my_bucket.id` and enables versioning. Run `terraform plan` again — observe that the plan now shows `1 to add` (only the new resource) rather than `2 to add`, proving Terraform's incremental change behavior. Notice how the reference `aws_s3_bucket.my_bucket.id` creates an implicit dependency — Terraform knows to create the bucket first. Apply the change. Then edit the bucket's `Environment` tag from `\"learning\"` to `\"dev\"` and run `terraform plan` again — observe the `~` (update in-place) symbol and confirm only the tag changes, not a destroy/recreate.",
              np: "आफ्नो `main.tf` मा दोस्रो resource add गर्नुहोस्: `aws_s3_bucket_versioning` block जसले `aws_s3_bucket.my_bucket.id` मार्फत bucket reference गर्छ र versioning enable गर्छ। `terraform plan` फेरि run गर्नुहोस् — plan ले `2 to add` भन्दा `1 to add` (नयाँ resource मात्र) देखाउँछ, Terraform को incremental change behavior prove गर्दै। `aws_s3_bucket.my_bucket.id` reference ले implicit dependency कसरी create गर्छ note गर्नुहोस् — Terraform लाई थाहा छ bucket पहिले create गर्नुपर्छ। Change apply गर्नुहोस्। त्यसपछि bucket को `Environment` tag `\"learning\"` बाट `\"dev\"` मा edit गर्नुहोस् र `terraform plan` फेरि run गर्नुहोस् — `~` (update in-place) symbol observe गर्नुहोस् र destroy/recreate होइन, केवल tag change हुन्छ confirm गर्नुहोस्।",
              jp: "`main.tf` に 2 番目のリソースを追加する：`aws_s3_bucket.my_bucket.id` を通じてバケットを参照してバージョニングを有効にする `aws_s3_bucket_versioning` ブロック。`terraform plan` を再度実行する — プランが `2 to add` ではなく `1 to add`（新しいリソースのみ）を示していることを確認し、Terraform のインクリメンタル変更動作を証明する。参照 `aws_s3_bucket.my_bucket.id` が暗黙的な依存関係を作成する方法に注目する — Terraform はバケットを最初に作成することを知っている。変更を適用する。次にバケットの `Environment` タグを `\"learning\"` から `\"dev\"` に編集して `terraform plan` を再実行する — `~`（インプレース更新）シンボルを確認し、destroy/recreate ではなくタグのみが変更されることを確認する。",
            },
            {
              en: "Practice reading `terraform.tfstate` directly to understand what Terraform stores. After applying your configuration, open the `terraform.tfstate` file in a text editor (or run `cat terraform.tfstate | python3 -m json.tool`). Identify the `resources` array, find your `aws_s3_bucket` entry, and read its `instances[0].attributes` — note the `id` (bucket name), `arn`, `region`, `tags_all`, and other AWS-assigned attributes. Then deliberately break things: manually delete the bucket from the AWS console without running `terraform destroy`. Run `terraform plan` — observe the error or the plan showing `1 to add` again (state says it exists but reality does not). This shows why state consistency is critical and why you should never manually modify resources managed by Terraform.",
              np: "Terraform ले के store गर्छ बुझ्न `terraform.tfstate` directly पढ्ने practice गर्नुहोस्। Configuration apply गरेपछि, text editor मा `terraform.tfstate` file खोल्नुहोस् (वा `cat terraform.tfstate | python3 -m json.tool` run गर्नुहोस्)। `resources` array identify गर्नुहोस्, आफ्नो `aws_s3_bucket` entry फेला पार्नुहोस्, र यसको `instances[0].attributes` पढ्नुहोस् — `id` (bucket name), `arn`, `region`, `tags_all`, र अरू AWS-assigned attribute note गर्नुहोस्। त्यसपछि जानाजानी बिगार्नुहोस्: `terraform destroy` run नगरी AWS console बाट bucket manually delete गर्नुहोस्। `terraform plan` run गर्नुहोस् — error वा plan ले `1 to add` फेरि देखाउँछ observe गर्नुहोस् (state ले छ भन्छ तर reality मा छैन)। यसले state consistency किन critical छ र Terraform ले manage गरेको resource किन manually modify गर्नु हुँदैन भनेर देखाउँछ।",
              jp: "Terraform が何を保存しているかを理解するために `terraform.tfstate` を直接読む練習をする。設定を適用した後、テキストエディタで `terraform.tfstate` ファイルを開く（または `cat terraform.tfstate | python3 -m json.tool` を実行する）。`resources` 配列を識別し、`aws_s3_bucket` エントリを見つけ、`instances[0].attributes` を読む — `id`（バケット名）・`arn`・`region`・`tags_all` および AWS が割り当てたその他の属性に注目する。次に意図的に壊す：`terraform destroy` を実行せず AWS コンソールからバケットを手動削除する。`terraform plan` を実行する — エラーまたはプランが再び `1 to add` を示すことを確認する（状態は存在すると言うが現実には存在しない）。これが状態の一貫性がなぜ重要なのか、そして Terraform が管理するリソースを手動で変更すべきでない理由を示している。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between Terraform and Ansible — when do you use each?",
        np: "Terraform र Ansible बीचको फरक के हो — प्रत्येक कहिले प्रयोग गर्ने?",
        jp: "Terraform と Ansible の違いは何か — それぞれいつ使うべきか？",
      },
      answer: {
        en: "Terraform and Ansible are complementary tools that operate at different layers of the infrastructure stack, and understanding when to use each is a critical DevOps skill. **Terraform** is an infrastructure provisioning tool: it creates and manages cloud resources — VPCs, subnets, EC2 instances, RDS databases, S3 buckets, load balancers, DNS records, IAM roles. It works by talking directly to cloud provider APIs and is designed around the concept of desired state with a state file tracking what exists. Terraform excels at answering \"what infrastructure should exist?\" **Ansible** is a configuration management and application deployment tool: it runs over SSH (or WinRM) onto existing servers and configures them — installs packages, manages files, creates users, deploys application code, manages services. Ansible operates at the OS level and is ideal for \"what should be running on this server?\" In practice, a common pattern is to use Terraform to provision the infrastructure (create the EC2 instance) and then use Ansible to configure it (install nginx, deploy the app, set up monitoring). Some teams go further: Terraform creates the instances, and a user_data script (or AWS Systems Manager) runs Ansible on first boot. There is overlap: Terraform has provisioners and Ansible has cloud modules — but using Terraform provisioners is discouraged (they break the declarative model), and using Ansible for cloud resource creation means no state file and no plan step. The rule of thumb: **Terraform owns the cloud API layer, Ansible owns the OS layer**. When in doubt, if it is a cloud API call, use Terraform; if it is something you'd `apt install` or `systemctl enable`, use Ansible.",
        np: "Terraform र Ansible complementary tool हुन् जो infrastructure stack को different layer मा operate गर्छन्, र प्रत्येक कहिले प्रयोग गर्ने बुझ्नु critical DevOps skill हो। **Terraform** एउटा infrastructure provisioning tool हो: यसले cloud resource — VPC, subnet, EC2 instance, RDS database, S3 bucket, load balancer, DNS record, IAM role — create र manage गर्छ। यसले cloud provider API सँग directly कुराकानी गरेर काम गर्छ र state file सँग desired state को concept around design गरिएको छ। Terraform ले \"कुन infrastructure exist हुनुपर्छ?\" भन्ने प्रश्नको जवाफ दिन excel गर्छ। **Ansible** एउटा configuration management र application deployment tool हो: यसले existing server मा SSH (वा WinRM) मार्फत run हुन्छ र configure गर्छ — package install गर्छ, file manage गर्छ, user create गर्छ, application code deploy गर्छ, service manage गर्छ। Ansible OS level मा operate गर्छ र \"यो server मा के run हुनुपर्छ?\" को लागि ideal छ। Practice मा, एउटा common pattern Terraform प्रयोग गरेर infrastructure provision गर्नु (EC2 instance create गर्नु) र Ansible प्रयोग गरेर configure गर्नु (nginx install गर्नु, app deploy गर्नु, monitoring set up गर्नु) हो। केही team अझ अगाडि जान्छन्: Terraform ले instance create गर्छ, र user_data script (वा AWS Systems Manager) ले first boot मा Ansible run गर्छ। केही overlap छ: Terraform मा provisioner छन् र Ansible मा cloud module छन् — तर Terraform provisioner प्रयोग discouraged छ (declarative model break गर्छ), र Ansible लाई cloud resource creation को लागि प्रयोग गर्दा state file र plan step हुँदैन। Rule of thumb: **Terraform ले cloud API layer own गर्छ, Ansible ले OS layer own गर्छ**। शंकामा, cloud API call भए Terraform प्रयोग गर्नुहोस्; `apt install` वा `systemctl enable` गर्ने कुरा भए Ansible प्रयोग गर्नुहोस्।",
        jp: "Terraform と Ansible はインフラスタックの異なるレイヤーで動作する補完的なツールであり、それぞれをいつ使うかを理解することは重要な DevOps スキルです。**Terraform** はインフラプロビジョニングツールです：クラウドリソース（VPC・サブネット・EC2 インスタンス・RDS データベース・S3 バケット・ロードバランサー・DNS レコード・IAM ロール）を作成・管理します。クラウドプロバイダー API と直接通信することで動作し、何が存在するかを追跡する状態ファイルを持つ望ましい状態のコンセプトを中心に設計されています。Terraform は「どのインフラが存在すべきか？」という問いへの回答に優れています。**Ansible** は構成管理とアプリケーションデプロイツールです：既存サーバーに SSH（または WinRM）で接続して設定します — パッケージをインストールし・ファイルを管理し・ユーザーを作成し・アプリケーションコードをデプロイし・サービスを管理します。Ansible は OS レベルで動作し、「このサーバーで何が動くべきか？」に最適です。実際には、Terraform を使ってインフラをプロビジョニングし（EC2 インスタンスを作成）、Ansible を使って設定する（nginx をインストールし・アプリをデプロイし・監視をセットアップする）という一般的なパターンがあります。一部のチームはさらに進めます：Terraform がインスタンスを作成し、user_data スクリプト（または AWS Systems Manager）が初回起動時に Ansible を実行します。重複する部分もあります：Terraform にはプロビジョナーがあり Ansible にはクラウドモジュールがありますが、Terraform プロビジョナーの使用は推奨されず（宣言型モデルを壊す）、クラウドリソース作成に Ansible を使うと状態ファイルとプランステップがありません。経験則：**Terraform はクラウド API レイヤーを所有し、Ansible は OS レイヤーを所有する**。迷ったら、クラウド API 呼び出しなら Terraform、`apt install` や `systemctl enable` するようなことなら Ansible を使う。",
      },
      tag: {
        en: "Terraform vs Ansible",
        np: "Terraform vs Ansible",
        jp: "Terraform vs Ansible",
      },
    },
    {
      question: {
        en: "What does `terraform init` actually do and why must it be run first?",
        np: "`terraform init` ले actually के गर्छ र यसलाई पहिले किन run गर्नुपर्छ?",
        jp: "`terraform init` は実際に何をするのか、なぜ最初に実行しなければならないのか？",
      },
      answer: {
        en: "`terraform init` is the initialization command that prepares your working directory for Terraform operations. It must be run first because no other Terraform command (`plan`, `apply`, `validate`) can execute without the providers and modules that `init` downloads. Here is exactly what `terraform init` does, step by step. **1. Downloads providers**: reads the `required_providers` block in your `terraform {}` block, contacts registry.terraform.io, and downloads the specified provider plugins (e.g., `hashicorp/aws ~> 5.0`) into the `.terraform/providers/` directory. The provider is a binary that Terraform calls to make AWS API requests. **2. Creates or updates `.terraform.lock.hcl`**: records the exact provider version and checksum that was downloaded. This file should be committed to version control so that every team member and CI system uses the identical provider version — preventing 'works on my machine' bugs caused by provider version differences. **3. Initializes the backend**: if your configuration has a `backend` block (e.g., S3 remote backend), `init` configures the connection and migrates existing local state to the remote backend if needed. **4. Downloads modules**: if your configuration uses `module` blocks referencing the Terraform Registry, `init` downloads those module source files into `.terraform/modules/`. **5. Creates `.terraform/` directory**: this directory contains downloaded providers, modules, and backend configuration. It is large (providers can be hundreds of MB) and should be in `.gitignore`. You must re-run `terraform init` whenever you: add a new provider, change a provider version constraint, add a module reference, or change the backend configuration. Run `terraform init -upgrade` to upgrade providers to the latest versions within your version constraints.",
        np: "`terraform init` initialization command हो जसले Terraform operation को लागि working directory तयार गर्छ। यसलाई पहिले run गर्नुपर्छ किनभने `init` ले download गर्ने provider र module बिना अरू कुनै Terraform command (`plan`, `apply`, `validate`) execute हुन सक्दैन। `terraform init` ले step by step ठ्याक्कै के गर्छ यो हो। **१. Provider download गर्छ**: `terraform {}` block मा `required_providers` block पढ्छ, registry.terraform.io contact गर्छ, र specified provider plugin (जस्तै, `hashicorp/aws ~> 5.0`) `.terraform/providers/` directory मा download गर्छ। Provider एउटा binary हो जसलाई Terraform ले AWS API request गर्न call गर्छ। **२. `.terraform.lock.hcl` create वा update गर्छ**: download गरिएको exact provider version र checksum record गर्छ। यो file version control मा commit गर्नुपर्छ ताकि हरेक team member र CI system identical provider version प्रयोग गरोस् — provider version difference ले गर्दा हुने 'works on my machine' bug रोक्न। **३. Backend initialize गर्छ**: configuration मा `backend` block (जस्तै, S3 remote backend) छ भने, `init` ले connection configure गर्छ र आवश्यक भए existing local state remote backend मा migrate गर्छ। **४. Module download गर्छ**: configuration ले Terraform Registry reference गर्ने `module` block प्रयोग गरेको छ भने, `init` ले tyo module source file `.terraform/modules/` मा download गर्छ। **५. `.terraform/` directory create गर्छ**: यो directory मा downloaded provider, module, र backend configuration छ। यो ठूलो छ (provider सयौं MB हुन सक्छन्) र `.gitignore` मा हुनुपर्छ। यी बेला `terraform init` re-run गर्नुपर्छ: नयाँ provider add गर्दा, provider version constraint change गर्दा, module reference add गर्दा, वा backend configuration change गर्दा। Version constraint भित्र provider latest version मा upgrade गर्न `terraform init -upgrade` run गर्नुहोस्।",
        jp: "`terraform init` は Terraform 操作のために作業ディレクトリを準備する初期化コマンドです。最初に実行しなければならない理由は、`init` がダウンロードするプロバイダーとモジュールなしには他の Terraform コマンド（`plan`・`apply`・`validate`）が実行できないからです。`terraform init` がステップバイステップで何をするかを正確に説明します。**1. プロバイダーをダウンロード**：`terraform {}` ブロックの `required_providers` ブロックを読み込み、registry.terraform.io に接続し、指定されたプロバイダープラグイン（例：`hashicorp/aws ~> 5.0`）を `.terraform/providers/` ディレクトリにダウンロードします。プロバイダーは Terraform が AWS API リクエストを行うために呼び出すバイナリです。**2. `.terraform.lock.hcl` を作成または更新**：ダウンロードされた正確なプロバイダーバージョンとチェックサムを記録します。このファイルはバージョン管理にコミットすべきです — すべてのチームメンバーと CI システムが同一のプロバイダーバージョンを使用するように — プロバイダーバージョンの違いによる「自分のマシンでは動く」バグを防ぐために。**3. バックエンドを初期化**：設定に `backend` ブロック（例：S3 リモートバックエンド）がある場合、`init` は接続を設定し、必要に応じて既存のローカル状態をリモートバックエンドに移行します。**4. モジュールをダウンロード**：設定が Terraform Registry を参照する `module` ブロックを使用している場合、`init` はそれらのモジュールソースファイルを `.terraform/modules/` にダウンロードします。**5. `.terraform/` ディレクトリを作成**：このディレクトリにはダウンロードされたプロバイダー・モジュール・バックエンド設定が含まれます。大きいサイズ（プロバイダーは数百 MB になることがある）で `.gitignore` に含めるべきです。次の場合に `terraform init` を再実行する必要があります：新しいプロバイダーを追加する・プロバイダーバージョン制約を変更する・モジュール参照を追加する・バックエンド設定を変更する。バージョン制約内でプロバイダーを最新バージョンにアップグレードするには `terraform init -upgrade` を実行します。",
      },
      tag: {
        en: "terraform init internals",
        np: "terraform init internals",
        jp: "terraform init の内部動作",
      },
    },
  ],
};
