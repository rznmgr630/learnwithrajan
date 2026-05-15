import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Terraform **workspaces** provide isolated state within a single backend configuration. By default you are always in the `default` workspace — every `terraform apply` you have run without explicitly creating a workspace used this state. `terraform workspace new staging` creates a new workspace with its own completely empty state file stored at `env:/staging/terraform.tfstate` within the backend (in S3 this becomes `env:/staging/your-key`). `terraform workspace select staging` switches the active workspace — subsequent `plan` and `apply` operations read and write only that workspace's state. `terraform workspace list` shows all available workspaces with a `*` marking the current one. `terraform workspace show` prints just the current workspace name, useful in scripts. `terraform workspace delete staging` deletes a workspace — Terraform requires the workspace state to be empty before allowing deletion (destroy resources first). The `terraform.workspace` built-in string value returns the current workspace name — use it to vary configuration: `instance_type = terraform.workspace == \"prod\" ? \"t3.large\" : \"t3.micro\"`, or as part of a resource name to keep resources distinct: `bucket = \"myapp-\${terraform.workspace}-data\"`. Workspaces are most useful for lightweight environment isolation when the infrastructure topology is identical across environments and only variable values differ (count, size, enabled features). Their core limitation: all workspaces share the same backend configuration, provider configuration, and root module code. A destructive bug in your Terraform code — a misconfigured `terraform destroy` targeting the wrong resource type — can potentially affect resources in all workspaces if the workspace-specific guard fails. Teams operating production workloads therefore often prefer the stronger isolation of separate directories.",
    np: "Terraform **workspace** ले single backend configuration भित्र isolated state provide गर्छ। Default रूपमा तपाईं सधैं `default` workspace मा हुनुहुन्छ — explicitly workspace create नगरी run गरेको हरेक `terraform apply` ले यो state प्रयोग गर्यो। `terraform workspace new staging` ले backend भित्र `env:/staging/terraform.tfstate` मा store हुने completely empty state file सहित नयाँ workspace create गर्छ (S3 मा यो `env:/staging/your-key` बन्छ)। `terraform workspace select staging` ले active workspace switch गर्छ — subsequent `plan` र `apply` operation ले त्यो workspace को state मात्र read र write गर्छन्। `terraform workspace list` ले current workspace लाई `*` ले mark गरेर सबै available workspace देखाउँछ। `terraform workspace show` ले current workspace name मात्र print गर्छ, script मा useful। `terraform workspace delete staging` ले workspace delete गर्छ — Terraform ले deletion allow गर्नु अघि workspace state empty हुन require गर्छ (पहिले resource destroy गर्नुहोस्)। `terraform.workspace` built-in string value ले current workspace name return गर्छ — configuration vary गर्न प्रयोग गर्नुहोस्: `instance_type = terraform.workspace == \"prod\" ? \"t3.large\" : \"t3.micro\"`, वा resource distinct राख्न resource name को भागको रूपमा: `bucket = \"myapp-\${terraform.workspace}-data\"`। Workspace infrastructure topology environment across identical छ र variable value मात्र differ गर्छ (count, size, enabled feature) भन्दा lightweight environment isolation को लागि सबैभन्दा useful छ। तिनीहरूको core limitation: सबै workspace ले same backend configuration, provider configuration, र root module code share गर्छन्। Terraform code मा destructive bug — wrong resource type target गर्ने misconfigured `terraform destroy` — workspace-specific guard fail भएमा potentially सबै workspace मा resource affect गर्न सक्छ। Production workload operate गर्ने team ले त्यसैले separate directory को stronger isolation prefer गर्छन्।",
    jp: "Terraform の**ワークスペース**は単一のバックエンド設定内で分離された状態を提供します。デフォルトでは常に `default` ワークスペースにいます — ワークスペースを明示的に作成せずに実行したすべての `terraform apply` がこの状態を使用しました。`terraform workspace new staging` はバックエンド内の `env:/staging/terraform.tfstate` に保存される完全に空の状態ファイルを持つ新しいワークスペースを作成します（S3 では `env:/staging/your-key` になります）。`terraform workspace select staging` はアクティブなワークスペースを切り替えます — その後の `plan` と `apply` 操作はそのワークスペースの状態のみを読み書きします。`terraform workspace list` は現在のワークスペースを `*` でマークしてすべての利用可能なワークスペースを表示します。`terraform workspace show` は現在のワークスペース名のみを出力し、スクリプトで便利です。`terraform workspace delete staging` はワークスペースを削除します — Terraform は削除を許可する前にワークスペースの状態が空であることを要求します（最初にリソースを破棄してください）。`terraform.workspace` の組み込み文字列値は現在のワークスペース名を返します — 設定を変えるために使用します：`instance_type = terraform.workspace == \"prod\" ? \"t3.large\" : \"t3.micro\"`、またはリソースを区別するためにリソース名の一部として：`bucket = \"myapp-\${terraform.workspace}-data\"`。ワークスペースはインフラのトポロジーが環境間で同一で、変数値のみが異なる場合（数・サイズ・有効機能）の軽量な環境分離に最も役立ちます。核心的な制限：すべてのワークスペースは同じバックエンド設定・プロバイダー設定・ルートモジュールコードを共有します。Terraform コードの破壊的なバグ — 間違ったリソースタイプをターゲットにする設定ミスの `terraform destroy` — はワークスペース固有のガードが失敗した場合、すべてのワークスペースのリソースに影響を与える可能性があります。そのため本番ワークロードを運営するチームは、より強力な分離を提供する別々のディレクトリを好むことが多いです。",
  } as const,
  o2: {
    en: "The **directory-per-environment** pattern uses separate directories (`environments/dev/`, `environments/staging/`, `environments/prod/`) each with their own `terraform.tfvars`, `backend.tf`, and optionally their own provider configuration. The critical benefit is complete blast-radius isolation: to affect production infrastructure you must physically `cd` into `environments/prod/` and run Terraform there — an accidental `terraform destroy` in the wrong terminal kills dev, not prod. Different backend state keys (or entirely different S3 buckets) per environment mean state corruption in dev never touches prod state. Different AWS credentials per environment (assuming separate AWS accounts, the security best practice) mean even a valid Terraform `apply` in a dev directory cannot create resources in the production AWS account. The tradeoff: duplication. Each environment directory typically contains only `main.tf` that calls the shared module, a `backend.tf` with the environment-specific bucket and key, and a `terraform.tfvars` with environment-specific values — but those three files must exist in every environment, and changing the backend or provider configuration requires updating every environment directory. **Terragrunt** (by Gruntwork, `github.com/gruntwork-io/terragrunt`) was built specifically to solve this DRY problem. With Terragrunt, a root `terragrunt.hcl` defines the backend template and common inputs once. Each environment `terragrunt.hcl` uses `include { path = find_in_parent_folders() }` to inherit the root config and only overrides what differs. Running `terragrunt apply` in `environments/dev/` auto-generates the backend configuration with the correct key and bucket, merges inputs from parent and child configs, then calls `terraform apply`. The four most common multi-environment patterns, in order of adoption: (1) workspaces — simple but weak isolation; (2) directories with shared modules — team standard for most organizations; (3) Terragrunt DRY directories — preferred at scale; (4) separate Git repos per environment — used by large orgs with strict change management and compliance requirements.",
    np: "**Directory-per-environment** pattern ले separate directory (`environments/dev/`, `environments/staging/`, `environments/prod/`) प्रयोग गर्छ प्रत्येकमा आफ्नै `terraform.tfvars`, `backend.tf`, र optionally आफ्नै provider configuration हुन्छ। Critical benefit complete blast-radius isolation हो: production infrastructure affect गर्न physically `environments/prod/` मा `cd` गर्नुपर्छ र त्यहाँ Terraform run गर्नुपर्छ — wrong terminal मा accidental `terraform destroy` ले prod होइन dev kill गर्छ। Per environment different backend state key (वा entirely different S3 bucket) ले dev मा state corruption ले prod state कहिल्यै touch नगर्ने ensure गर्छ। Per environment different AWS credential (separate AWS account assume गर्दै, security best practice) ले dev directory मा valid Terraform `apply` ले पनि production AWS account मा resource create गर्न सक्दैन। Tradeoff: duplication। प्रत्येक environment directory मा typically shared module call गर्ने `main.tf`, environment-specific bucket र key सहित `backend.tf`, र environment-specific value सहित `terraform.tfvars` मात्र हुन्छ — तर ती तीनवटा file प्रत्येक environment मा exist गर्नुपर्छ, र backend वा provider configuration change गर्दा हरेक environment directory update गर्नुपर्छ। **Terragrunt** (Gruntwork द्वारा, `github.com/gruntwork-io/terragrunt`) यो DRY problem solve गर्न specifically build गरिएको हो। Terragrunt सँग, root `terragrunt.hcl` ले एकचोटि backend template र common input define गर्छ। प्रत्येक environment `terragrunt.hcl` ले root config inherit गर्न `include { path = find_in_parent_folders() }` प्रयोग गर्छ र differ गर्ने मात्र override गर्छ। `environments/dev/` मा `terragrunt apply` run गर्दा correct key र bucket सहित backend configuration auto-generate गर्छ, parent र child config बाट input merge गर्छ, त्यसपछि `terraform apply` call गर्छ। Adoption order अनुसार चारवटा most common multi-environment pattern: (१) workspace — simple तर weak isolation; (२) shared module सहित directory — majority organization को लागि team standard; (३) Terragrunt DRY directory — scale मा preferred; (४) per environment separate Git repo — strict change management र compliance requirement भएका large org ले प्रयोग गर्छन्।",
    jp: "**ディレクトリ per 環境**パターンは、それぞれ独自の `terraform.tfvars`・`backend.tf`・オプションで独自のプロバイダー設定を持つ別々のディレクトリ（`environments/dev/`・`environments/staging/`・`environments/prod/`）を使用します。重要な利点は完全な影響範囲の分離です：本番インフラに影響を与えるには物理的に `environments/prod/` に `cd` して Terraform を実行する必要があります — 間違ったターミナルでの偶発的な `terraform destroy` は prod ではなく dev を削除します。環境ごとに異なるバックエンド状態キー（または全く別の S3 バケット）により、dev での状態の破損が prod の状態に触れることはありません。環境ごとに異なる AWS 認証情報（別々の AWS アカウントを前提として、セキュリティのベストプラクティス）により、dev ディレクトリでの有効な Terraform `apply` でさえ本番 AWS アカウントにリソースを作成できません。トレードオフ：重複。各環境ディレクトリには通常、共有モジュールを呼び出す `main.tf`・環境固有のバケットとキーを持つ `backend.tf`・環境固有の値を持つ `terraform.tfvars` のみが含まれます — しかしこれら 3 つのファイルはすべての環境に存在する必要があり、バックエンドやプロバイダーの設定変更には各環境ディレクトリを更新する必要があります。**Terragrunt**（Gruntwork 製、`github.com/gruntwork-io/terragrunt`）はこの DRY 問題を解決するために特別に構築されました。Terragrunt を使うと、ルートの `terragrunt.hcl` がバックエンドテンプレートと共通入力を一度定義します。各環境の `terragrunt.hcl` は `include { path = find_in_parent_folders() }` を使ってルート設定を継承し、異なる部分のみをオーバーライドします。`environments/dev/` で `terragrunt apply` を実行すると、正しいキーとバケットでバックエンド設定を自動生成し、親と子の設定から入力をマージし、`terraform apply` を呼び出します。採用順に並べた最も一般的な 4 つのマルチ環境パターン：(1) ワークスペース — シンプルだが弱い分離；(2) 共有モジュールを持つディレクトリ — ほとんどの組織のチーム標準；(3) Terragrunt DRY ディレクトリ — スケールで好まれる；(4) 環境ごとの別 Git リポジトリ — 厳格な変更管理とコンプライアンス要件を持つ大規模組織が使用。",
  } as const,
};

export const DEVOPS_DAY_83_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Workspaces — commands, state isolation & built-in variable",
        np: "Workspace — command, state isolation र built-in variable",
        jp: "ワークスペース — コマンド・状態の分離・組み込み変数",
      },
      blocks: [
        { type: "diagram", id: "devops-terraform-workspaces" },
        {
          type: "table",
          caption: {
            en: "Workspaces vs directory-per-env vs Terragrunt — tradeoff comparison",
            np: "Workspace vs directory-per-env vs Terragrunt — tradeoff तुलना",
            jp: "ワークスペース vs ディレクトリ per 環境 vs Terragrunt — トレードオフ比較",
          },
          headers: [
            { en: "Factor", np: "Factor", jp: "要素" },
            { en: "Workspaces", np: "Workspace", jp: "ワークスペース" },
            { en: "Directory per env", np: "Directory per env", jp: "ディレクトリ per 環境" },
            { en: "Terragrunt", np: "Terragrunt", jp: "Terragrunt" },
          ],
          rows: [
            [
              { en: "State isolation", np: "State isolation", jp: "状態の分離" },
              { en: "Partial — same backend, separate state keys", np: "Partial — same backend, separate state key", jp: "部分的 — 同じバックエンド・別の状態キー" },
              { en: "Full — separate backends and state files possible", np: "Full — separate backend r state file possible", jp: "完全 — 別々のバックエンドと状態ファイルが可能" },
              { en: "Full — inherits directory isolation + DRY config", np: "Full — directory isolation + DRY config inherit गर्छ", jp: "完全 — ディレクトリ分離 + DRY 設定を継承" },
            ],
            [
              { en: "Accidental prod change risk", np: "Accidental prod change risk", jp: "偶発的な本番変更のリスク" },
              { en: "High — easy to forget to switch workspace", np: "High — workspace switch बिर्सन सजिलो", jp: "高 — ワークスペースの切り替え忘れが容易" },
              { en: "Low — must physically cd into prod directory", np: "Low — physically prod directory मा cd गर्नुपर्छ", jp: "低 — 物理的に prod ディレクトリに cd する必要がある" },
              { en: "Low — same directory isolation as plain dirs", np: "Low — plain directory जस्तै directory isolation", jp: "低 — プレーンディレクトリと同じディレクトリ分離" },
            ],
            [
              { en: "Code duplication", np: "Code duplication", jp: "コードの重複" },
              { en: "None — single root module for all envs", np: "None — सबै env को लागि single root module", jp: "なし — すべての環境に単一のルートモジュール" },
              { en: "Medium — backend.tf and provider.tf per env", np: "Medium — per env backend.tf र provider.tf", jp: "中 — 環境ごとの backend.tf と provider.tf" },
              { en: "Minimal — only env-specific overrides duplicated", np: "Minimal — env-specific override मात्र duplicate", jp: "最小限 — 環境固有のオーバーライドのみ重複" },
            ],
            [
              { en: "Team onboarding", np: "Team onboarding", jp: "チームのオンボーディング" },
              { en: "Easy — one directory, familiar terraform commands", np: "Easy — एउटा directory, familiar terraform command", jp: "容易 — 単一ディレクトリ・使い慣れた terraform コマンド" },
              { en: "Easy — directory structure is self-documenting", np: "Easy — directory structure self-documenting छ", jp: "容易 — ディレクトリ構造が自己文書化される" },
              { en: "Medium — terragrunt CLI must be learned separately", np: "Medium — terragrunt CLI छुट्टै सिक्नुपर्छ", jp: "中 — terragrunt CLI を別途学ぶ必要がある" },
            ],
            [
              { en: "CI/CD complexity", np: "CI/CD complexity", jp: "CI/CD の複雑さ" },
              { en: "Low — parameterize workspace name in pipeline", np: "Low — pipeline मा workspace name parameterize गर्नुहोस्", jp: "低 — パイプラインでワークスペース名をパラメーター化" },
              { en: "Medium — separate pipeline step per env directory", np: "Medium — per env directory separate pipeline step", jp: "中 — 環境ディレクトリごとの個別パイプラインステップ" },
              { en: "Low — terragrunt run-all handles multi-env deploys", np: "Low — terragrunt run-all ले multi-env deploy handle गर्छ", jp: "低 — terragrunt run-all がマルチ環境デプロイを処理" },
            ],
            [
              { en: "Recommended for", np: "Recommended for", jp: "推奨される用途" },
              { en: "Same topology, small teams, dev experiments", np: "Same topology, small team, dev experiment", jp: "同じトポロジー・小チーム・開発実験" },
              { en: "Different topologies, separate AWS accounts per env", np: "Different topology, per env separate AWS account", jp: "異なるトポロジー・環境ごとの別 AWS アカウント" },
              { en: "Large teams with many envs, DRY backend config required", np: "धेरै env भएका large team, DRY backend config required", jp: "多くの環境を持つ大チーム・DRY バックエンド設定が必要な場合" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Directory-per-environment pattern & Terragrunt DRY config",
        np: "Directory-per-environment pattern र Terragrunt DRY config",
        jp: "ディレクトリ per 環境パターンと Terragrunt DRY 設定",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Workspace commands, terraform.workspace conditionals, directory-per-env structure, per-env backend + tfvars, Terragrunt root + env inheritance",
            np: "Workspace command, terraform.workspace conditional, directory-per-env structure, per-env backend + tfvars, Terragrunt root + env inheritance",
            jp: "ワークスペースコマンド・terraform.workspace 条件分岐・ディレクトリ per 環境構造・環境ごとの backend + tfvars・Terragrunt ルート + 環境継承",
          },
          code: `# ════════════════════════════════════════════════════════════════════
# PART 1: WORKSPACE COMMANDS
# ════════════════════════════════════════════════════════════════════

# List all workspaces (* marks current)
terraform workspace list
# * default

# Create new workspaces — each gets its own empty state
terraform workspace new dev
# Created and switched to workspace "dev"!

terraform workspace new staging
terraform workspace new prod

# List again to confirm all workspaces exist
terraform workspace list
#   default
#   dev
#   staging
# * prod         <- currently active

# Show the current workspace name (useful in scripts)
terraform workspace show
# prod

# Switch to a different workspace
terraform workspace select staging
# Switched to workspace "staging"

# Delete a workspace (state must be empty — destroy resources first)
terraform workspace select default   # can't delete the active workspace
terraform workspace delete dev
# Deleted workspace "dev"!

# ── In S3 backend, state paths per workspace ──────────────────────────
# default   → s3://my-bucket/path/terraform.tfstate
# staging   → s3://my-bucket/env:/staging/path/terraform.tfstate
# prod      → s3://my-bucket/env:/prod/path/terraform.tfstate

# ── Using terraform.workspace in configuration ────────────────────────
# main.tf excerpt — vary resource configuration by workspace
resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = terraform.workspace == "prod" ? "t3.large" : "t3.micro"
  count         = terraform.workspace == "prod" ? 3 : 1

  tags = {
    Name        = "myapp-\${terraform.workspace}-app"
    Environment = terraform.workspace
  }
}

resource "aws_s3_bucket" "data" {
  # Workspace name embedded in bucket name ensures global uniqueness per env
  bucket = "myapp-\${terraform.workspace}-data-bucket"
}

# ════════════════════════════════════════════════════════════════════
# PART 2: DIRECTORY-PER-ENVIRONMENT STRUCTURE
# ════════════════════════════════════════════════════════════════════

# Recommended project layout:
# my-infra/
# ├── modules/                    <- shared modules (never run terraform here)
# │   └── vpc/
# │       ├── main.tf
# │       ├── variables.tf
# │       └── outputs.tf
# └── environments/
#     ├── dev/
#     │   ├── backend.tf          <- dev-specific S3 bucket + key
#     │   ├── provider.tf         <- dev AWS account credentials
#     │   ├── main.tf             <- calls modules/vpc with dev inputs
#     │   └── terraform.tfvars    <- dev variable values
#     ├── staging/
#     │   ├── backend.tf
#     │   ├── provider.tf
#     │   ├── main.tf
#     │   └── terraform.tfvars
#     └── prod/
#         ├── backend.tf
#         ├── provider.tf
#         ├── main.tf
#         └── terraform.tfvars

# ── environments/dev/backend.tf ───────────────────────────────────────
terraform {
  backend "s3" {
    bucket         = "my-tfstate-dev"             # dev-specific bucket
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks-dev"
    encrypt        = true
  }
}

# ── environments/prod/backend.tf ──────────────────────────────────────
# terraform {
#   backend "s3" {
#     bucket         = "my-tfstate-prod"           # completely separate bucket
#     key            = "prod/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "terraform-locks-prod"
#     encrypt        = true
#   }
# }

# ── environments/dev/terraform.tfvars ────────────────────────────────
# environment    = "dev"
# instance_type  = "t3.micro"
# instance_count = 1
# enable_backups = false

# ── environments/prod/terraform.tfvars ───────────────────────────────
# environment    = "prod"
# instance_type  = "t3.large"
# instance_count = 3
# enable_backups = true

# Running in each environment — explicit, no workspace mistakes possible
# cd environments/dev   && terraform init && terraform apply
# cd environments/prod  && terraform init && terraform apply

# ════════════════════════════════════════════════════════════════════
# PART 3: TERRAGRUNT DRY CONFIGURATION
# ════════════════════════════════════════════════════════════════════

# Terragrunt project layout:
# my-infra-terragrunt/
# ├── terragrunt.hcl              <- root: backend template + common inputs
# ├── modules/vpc/                <- shared modules (unchanged)
# └── environments/
#     ├── dev/
#     │   └── terragrunt.hcl     <- inherits root, overrides env values
#     ├── staging/
#     │   └── terragrunt.hcl
#     └── prod/
#         └── terragrunt.hcl

# ── Root terragrunt.hcl (DRY backend template) ───────────────────────
# locals {
#   env = basename(get_terragrunt_dir())  # "dev", "staging", or "prod"
# }
#
# remote_state {
#   backend = "s3"
#   config = {
#     bucket         = "my-tfstate-\${local.env}"
#     key            = "\${local.env}/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "terraform-locks-\${local.env}"
#     encrypt        = true
#   }
# }
#
# inputs = {
#   # Common inputs available to all environments
#   region = "us-east-1"
# }

# ── environments/dev/terragrunt.hcl ──────────────────────────────────
# include "root" {
#   path = find_in_parent_folders()   # inherit root terragrunt.hcl
# }
#
# terraform {
#   source = "../../modules//vpc"     # path to the shared module
# }
#
# inputs = {
#   # Override only what differs in dev
#   environment    = "dev"
#   instance_type  = "t3.micro"
#   instance_count = 1
# }

# ── environments/prod/terragrunt.hcl ─────────────────────────────────
# include "root" {
#   path = find_in_parent_folders()
# }
#
# terraform {
#   source = "../../modules//vpc"
# }
#
# inputs = {
#   environment    = "prod"
#   instance_type  = "t3.large"
#   instance_count = 3
# }

# ── Running Terragrunt ────────────────────────────────────────────────
# cd environments/dev && terragrunt apply
# terragrunt run-all apply   # apply all environments in dependency order`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create three workspaces (`dev`, `staging`, `prod`) and use `terraform.workspace` to drive real differences in a configuration. Write a `main.tf` that creates an `aws_s3_bucket` whose `bucket` name embeds `terraform.workspace` (ensuring uniqueness per environment). Add an `aws_s3_bucket_versioning` resource that enables versioning only in the `prod` workspace using a conditional: `status = terraform.workspace == \"prod\" ? \"Enabled\" : \"Disabled\"`. Add a `locals` block that sets `log_retention_days` to 90 for `prod`, 30 for `staging`, and 7 for `dev` using nested ternary expressions. Run `terraform plan` in each workspace and compare the plans — confirm each workspace shows a different bucket name and versioning status. Then switch to `staging`, run `terraform apply` (optionally against LocalStack or a real AWS account), switch to `prod`, and run `terraform state list` — confirm the prod workspace state is empty (state isolation is working).",
              np: "तीनवटा workspace (`dev`, `staging`, `prod`) create गर्नुहोस् र configuration मा real difference drive गर्न `terraform.workspace` प्रयोग गर्नुहोस्। `aws_s3_bucket` create गर्ने `main.tf` लेख्नुहोस् जसको `bucket` name मा `terraform.workspace` embedded छ (per environment uniqueness ensure गर्दै)। `prod` workspace मा मात्र versioning enable गर्ने `aws_s3_bucket_versioning` resource add गर्नुहोस् conditional प्रयोग गरेर: `status = terraform.workspace == \"prod\" ? \"Enabled\" : \"Disabled\"`। Nested ternary expression प्रयोग गरेर `prod` को लागि 90, `staging` को लागि 30, र `dev` को लागि 7 दिन `log_retention_days` set गर्ने `locals` block add गर्नुहोस्। प्रत्येक workspace मा `terraform plan` run गर्नुहोस् र plan compare गर्नुहोस् — प्रत्येक workspace ले different bucket name र versioning status देखाउँछ confirm गर्नुहोस्। त्यसपछि `staging` मा switch गर्नुहोस्, `terraform apply` run गर्नुहोस् (optionally LocalStack वा real AWS account विरुद्ध), `prod` मा switch गर्नुहोस्, र `terraform state list` run गर्नुहोस् — prod workspace state empty छ confirm गर्नुहोस् (state isolation काम गरिरहेको छ)।",
              jp: "3 つのワークスペース（`dev`・`staging`・`prod`）を作成し、`terraform.workspace` を使って設定に実際の違いを生み出す。`bucket` 名に `terraform.workspace` を埋め込んだ（環境ごとのユニークさを保証する）`aws_s3_bucket` を作成する `main.tf` を書く。条件式を使って `prod` ワークスペースでのみバージョニングを有効にする `aws_s3_bucket_versioning` リソースを追加する：`status = terraform.workspace == \"prod\" ? \"Enabled\" : \"Disabled\"`。ネストされた三項式を使って `prod` は 90 日、`staging` は 30 日、`dev` は 7 日の `log_retention_days` を設定する `locals` ブロックを追加する。各ワークスペースで `terraform plan` を実行してプランを比較する — 各ワークスペースが異なるバケット名とバージョニングステータスを示すことを確認する。次に `staging` に切り替え、`terraform apply` を実行し（オプションで LocalStack または実際の AWS アカウントに対して）、`prod` に切り替え、`terraform state list` を実行する — prod ワークスペースの状態が空であることを確認する（状態の分離が機能している）。",
            },
            {
              en: "Set up a directory-per-environment project structure manually (no Terragrunt). Create three directories: `environments/dev/`, `environments/staging/`, `environments/prod/`. In each directory, create: (1) a `backend.tf` with an S3 backend configuration where the `key` and `bucket` differ per environment (you can simulate with different key paths even if using the same real bucket); (2) a `main.tf` that calls a shared `../../modules/vpc` module; (3) a `terraform.tfvars` with environment-specific values. In each environment directory, run `terraform init` separately — confirm each environment has its own `.terraform/` directory. Run `terraform plan` in `dev` and `prod` simultaneously (different terminals) — confirm the plans are completely independent and neither interferes with the other. Observe that there is no `terraform workspace select` step — the isolation is provided entirely by the directory structure and `cd`.",
              np: "Manually directory-per-environment project structure set up गर्नुहोस् (Terragrunt बिना)। तीनवटा directory create गर्नुहोस्: `environments/dev/`, `environments/staging/`, `environments/prod/`। प्रत्येक directory मा create गर्नुहोस्: (१) S3 backend configuration सहित `backend.tf` जहाँ `key` र `bucket` per environment differ गर्छन् (same real bucket प्रयोग गर्दा पनि different key path सँग simulate गर्न सकिन्छ); (२) shared `../../modules/vpc` module call गर्ने `main.tf`; (३) environment-specific value सहित `terraform.tfvars`। प्रत्येक environment directory मा, छुट्टाछुट्टै `terraform init` run गर्नुहोस् — प्रत्येक environment को आफ्नै `.terraform/` directory छ confirm गर्नुहोस्। `dev` र `prod` मा simultaneously (different terminal) `terraform plan` run गर्नुहोस् — plan completely independent छन् र कसैले पनि अर्कोमा interfere गर्दैन confirm गर्नुहोस्। `terraform workspace select` step छैन observe गर्नुहोस् — isolation entirely directory structure र `cd` द्वारा provide हुन्छ।",
              jp: "手動でディレクトリ per 環境のプロジェクト構造をセットアップする（Terragrunt なし）。3 つのディレクトリを作成する：`environments/dev/`・`environments/staging/`・`environments/prod/`。各ディレクトリに作成する：(1) 環境ごとに `key` と `bucket` が異なる S3 バックエンド設定を持つ `backend.tf`（同じ実際のバケットを使用しても異なるキーパスでシミュレートできる）；(2) 共有の `../../modules/vpc` モジュールを呼び出す `main.tf`；(3) 環境固有の値を持つ `terraform.tfvars`。各環境ディレクトリで別々に `terraform init` を実行する — 各環境が独自の `.terraform/` ディレクトリを持つことを確認する。`dev` と `prod` で同時に（異なるターミナルで）`terraform plan` を実行する — プランが完全に独立しており互いに干渉しないことを確認する。`terraform workspace select` ステップがないことを観察する — 分離はディレクトリ構造と `cd` によってのみ提供される。",
            },
            {
              en: "Install Terragrunt (`brew install terragrunt` on macOS or download from GitHub releases) and convert your directory-per-environment project to use DRY configuration. Create a root `terragrunt.hcl` in the project root that uses `remote_state` with a templated `bucket` and `key` derived from `local.env = basename(get_terragrunt_dir())`. Create `environments/dev/terragrunt.hcl` and `environments/prod/terragrunt.hcl`, each using `include \"root\" { path = find_in_parent_folders() }` and defining environment-specific `inputs`. Run `terragrunt init` in `environments/dev/` — observe that Terragrunt auto-generates the backend configuration block and runs `terraform init` on your behalf. Run `terragrunt plan` and verify the generated backend config shows the correct dev-specific bucket and key. Compare the amount of configuration in each environment directory before and after Terragrunt — confirm that after Terragrunt each environment file contains only ~10 lines of overrides rather than repeating all backend and provider configuration.",
              np: "Terragrunt install गर्नुहोस् (macOS मा `brew install terragrunt` वा GitHub release बाट download) र directory-per-environment project DRY configuration प्रयोग गर्न convert गर्नुहोस्। `local.env = basename(get_terragrunt_dir())` बाट derive भएको templated `bucket` र `key` सहित `remote_state` प्रयोग गर्ने root `terragrunt.hcl` project root मा create गर्नुहोस्। `environments/dev/terragrunt.hcl` र `environments/prod/terragrunt.hcl` create गर्नुहोस्, प्रत्येकले `include \"root\" { path = find_in_parent_folders() }` प्रयोग गर्दै र environment-specific `inputs` define गर्दै। `environments/dev/` मा `terragrunt init` run गर्नुहोस् — Terragrunt ले automatically backend configuration block generate गर्छ र तपाईंको तर्फबाट `terraform init` run गर्छ observe गर्नुहोस्। `terragrunt plan` run गर्नुहोस् र generated backend config ले correct dev-specific bucket र key देखाउँछ verify गर्नुहोस्। Terragrunt अघि र पछि प्रत्येक environment directory मा configuration को amount compare गर्नुहोस् — Terragrunt पछि प्रत्येक environment file मा सबै backend र provider configuration repeat नगरी ~10 lines of override मात्र छ confirm गर्नुहोस्।",
              jp: "Terragrunt をインストールし（macOS では `brew install terragrunt` または GitHub リリースからダウンロード）、ディレクトリ per 環境プロジェクトを DRY 設定を使うように変換する。`local.env = basename(get_terragrunt_dir())` から導出したテンプレート化された `bucket` と `key` を持つ `remote_state` を使うルート `terragrunt.hcl` をプロジェクトルートに作成する。`environments/dev/terragrunt.hcl` と `environments/prod/terragrunt.hcl` を作成し、それぞれ `include \"root\" { path = find_in_parent_folders() }` を使い環境固有の `inputs` を定義する。`environments/dev/` で `terragrunt init` を実行する — Terragrunt がバックエンド設定ブロックを自動生成し代わりに `terraform init` を実行することを観察する。`terragrunt plan` を実行して生成されたバックエンド設定が正しい dev 固有のバケットとキーを表示することを確認する。Terragrunt 導入前後の各環境ディレクトリの設定量を比較する — Terragrunt 導入後、各環境ファイルにはすべてのバックエンドとプロバイダー設定を繰り返す代わりに約 10 行のオーバーライドのみが含まれることを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What are the risks of using workspaces in production and how do teams mitigate them?",
        np: "Production मा workspace प्रयोग गर्दाका risk के हुन् र team ले तिनीहरूलाई कसरी mitigate गर्छन्?",
        jp: "本番環境でワークスペースを使用するリスクは何か、チームはどのように軽減するか？",
      },
      answer: {
        en: "Workspaces have a fundamental UX problem that causes real production incidents: **the active workspace is invisible**. When an engineer opens a terminal and runs `terraform plan`, there is no prominent, hard-to-miss indicator of which workspace is active. The workspace name appears in `terraform workspace show` and in the prompt if you configure your shell, but most engineers don't. The result: an engineer switches to `prod` workspace for a quick check, gets distracted by a Slack message, and ten minutes later runs `terraform apply` thinking they're in `dev`. Infrastructure in production changes. Nobody noticed. Here are the concrete risks and mitigations. **Risk 1: Wrong workspace apply.** Mitigation: (1) configure your shell prompt to display the active Terraform workspace — add `$(terraform workspace show 2>/dev/null)` to your `PS1`; (2) add a `local` that asserts `terraform.workspace == expected_env` and fails with a clear error message if running in the wrong workspace; (3) use CI/CD exclusively for production applies — never run `terraform apply` manually in prod. **Risk 2: Shared backend — no account-level isolation.** All workspaces use the same provider configuration and AWS credentials. If your Terraform code has a bug that destroys resources without the right workspace guard, all workspaces are vulnerable. Mitigation: use separate AWS accounts per environment (requires directory-per-env approach instead) or use strict IAM policies per workspace that limit which resources can be touched. **Risk 3: State key collision.** If two engineers independently create workspace names that happen to collide (both create `feature-vpc`), they share state and step on each other. Mitigation: enforce naming conventions and use a team workspace registry (even just a shared Confluence page or a DynamoDB table listing active workspaces). **Risk 4: Workspace sprawl.** Over time, abandoned workspaces accumulate: `feature-old-vpc`, `test-redis-migration`, `joe-experiment`. Each has orphaned infrastructure running and costing money. Mitigation: implement automated workspace garbage collection — a CI job that lists all workspaces, identifies those with resources in state, checks if there's an active branch with the same name, and deletes workspace state for branches that were merged more than 30 days ago. The bottom line: workspaces are safe for teams with strong discipline and good tooling. For teams under time pressure or with mixed seniority levels, directory-per-environment provides physical guardrails that workspaces cannot.",
        np: "Workspace मा एउटा fundamental UX problem छ जसले real production incident ल्याउँछ: **active workspace invisible छ**। Engineer ले terminal खोलेर `terraform plan` run गर्दा, कुन workspace active छ भन्ने prominent, hard-to-miss indicator हुँदैन। Workspace name `terraform workspace show` मा र shell configure गरेमा prompt मा देखिन्छ, तर majority engineer गर्दैनन्। Result: engineer quick check को लागि `prod` workspace मा switch गर्छ, Slack message बाट distracted हुन्छ, र दस मिनेट पछि `dev` मा छु सोचेर `terraform apply` run गर्छ। Production मा infrastructure change हुन्छ। कसैले notice गरेन। यहाँ concrete risk र mitigation छन्। **Risk 1: Wrong workspace apply।** Mitigation: (१) active Terraform workspace display गर्न shell prompt configure गर्नुहोस् — `PS1` मा `$(terraform workspace show 2>/dev/null)` add गर्नुहोस्; (२) `terraform.workspace == expected_env` assert गर्ने `local` add गर्नुहोस् र wrong workspace मा run गरेमा clear error message सँग fail गर्नुस्; (३) production apply को लागि exclusively CI/CD प्रयोग गर्नुहोस् — prod मा manually `terraform apply` run नगर्नुहोस्। **Risk 2: Shared backend — no account-level isolation।** सबै workspace ले same provider configuration र AWS credential प्रयोग गर्छन्। Terraform code मा right workspace guard बिना resource destroy गर्ने bug छ भने, सबै workspace vulnerable छन्। Mitigation: per environment separate AWS account प्रयोग गर्नुहोस् (बरु directory-per-env approach चाहिन्छ) वा per workspace strict IAM policy प्रयोग गर्नुहोस् जसले कुन resource touch गर्न सकिन्छ limit गर्छ। **Risk 3: State key collision।** दुई engineer ले independently collide हुने workspace name create गरेमा (दुवैले `feature-vpc` create गर्छन्), state share गर्छन् र एकले अर्कोलाई step on गर्छ। Mitigation: naming convention enforce गर्नुहोस् र team workspace registry प्रयोग गर्नुहोस् (shared Confluence page वा active workspace list गर्ने DynamoDB table पनि)। **Risk 4: Workspace sprawl।** समयसँगै, abandoned workspace जम्मा हुन्छन्: `feature-old-vpc`, `test-redis-migration`, `joe-experiment`। प्रत्येकमा orphaned infrastructure running छ र पैसा खर्च हुन्छ। Mitigation: automated workspace garbage collection implement गर्नुहोस् — सबै workspace list गर्ने, state मा resource भएका identify गर्ने, same name भएको active branch छ कि check गर्ने, र 30 दिन भन्दा बढी merge भएका branch को workspace state delete गर्ने CI job। Bottom line: strong discipline र good tooling भएका team को लागि workspace safe छन्। Time pressure मा वा mixed seniority level भएका team को लागि, directory-per-environment ले workspace ले दिन नसक्ने physical guardrail provide गर्छ।",
        jp: "ワークスペースには実際の本番インシデントを引き起こす根本的な UX の問題があります：**アクティブなワークスペースが見えない**のです。エンジニアがターミナルを開いて `terraform plan` を実行する際、どのワークスペースがアクティブかを示す目立った見逃しにくいインジケーターがありません。ワークスペース名は `terraform workspace show` とシェルを設定すればプロンプトに表示されますが、ほとんどのエンジニアはそうしません。結果：エンジニアが素早い確認のために `prod` ワークスペースに切り替え、Slack メッセージに気を取られ、10 分後に `dev` にいると思って `terraform apply` を実行します。本番のインフラが変わります。誰も気づきませんでした。具体的なリスクと軽減策を示します。**リスク 1：間違ったワークスペースへの apply。** 軽減策：(1) アクティブな Terraform ワークスペースを表示するようシェルプロンプトを設定する — `PS1` に `$(terraform workspace show 2>/dev/null)` を追加する；(2) `terraform.workspace == expected_env` をアサートする `local` を追加し、間違ったワークスペースで実行した場合に明確なエラーメッセージで失敗させる；(3) 本番 apply には CI/CD のみを使用する — prod で手動で `terraform apply` を実行しない。**リスク 2：共有バックエンド — アカウントレベルの分離なし。** すべてのワークスペースが同じプロバイダー設定と AWS 認証情報を使用します。Terraform コードに適切なワークスペースガードなしでリソースを破棄するバグがあると、すべてのワークスペースが脆弱です。軽減策：環境ごとに別の AWS アカウントを使用する（代わりにディレクトリ per 環境アプローチが必要）か、触れることができるリソースを制限するワークスペースごとの厳格な IAM ポリシーを使用する。**リスク 3：状態キーの衝突。** 2 人のエンジニアが独立してたまたま衝突するワークスペース名を作成すると（両方が `feature-vpc` を作成する）、状態を共有し互いに踏み合います。軽減策：命名規則を施行し、チームのワークスペースレジストリを使用する（共有 Confluence ページやアクティブなワークスペースを列挙する DynamoDB テーブルでも）。**リスク 4：ワークスペースの肥大化。** 時間が経つにつれ、放置されたワークスペースが蓄積されます：`feature-old-vpc`・`test-redis-migration`・`joe-experiment`。それぞれに孤立したインフラが実行されてコストがかかります。軽減策：自動ワークスペースガベージコレクションを実装する — すべてのワークスペースをリストアップし、状態にリソースがあるものを特定し、同名のアクティブなブランチがあるか確認し、30 日以上前にマージされたブランチのワークスペース状態を削除する CI ジョブ。結論：ワークスペースは強い規律と優れたツールを持つチームには安全です。時間的プレッシャー下や様々なシニアリティレベルが混在するチームには、ディレクトリ per 環境がワークスペースでは提供できない物理的なガードレールを提供します。",
      },
      tag: {
        en: "workspace risks & production safety",
        np: "workspace risk र production safety",
        jp: "ワークスペースのリスクと本番の安全性",
      },
    },
    {
      question: {
        en: "How does Terragrunt's `include` block reduce duplication across environments?",
        np: "Terragrunt को `include` block ले environment across duplication कसरी reduce गर्छ?",
        jp: "Terragrunt の `include` ブロックはどのように環境間の重複を削減するか？",
      },
      answer: {
        en: "Terragrunt's `include` block is the DRY mechanism that makes directory-per-environment practical at scale. Without it, every environment directory must contain a complete `backend.tf` with the S3 bucket name, key path, DynamoDB table name, region, and encryption settings — and a complete `provider.tf` with AWS account IDs and region. When your backend bucket name changes, you update 10 files. With Terragrunt's `include`, you update one. Here is how it works mechanically. The root `terragrunt.hcl` (placed in the project root, above all environment directories) defines a `remote_state` block with template expressions: `bucket = \"my-tfstate-\${local.env}\"`. The `local.env` value is computed by `basename(get_terragrunt_dir())` — `get_terragrunt_dir()` returns the absolute path of the directory containing the current `terragrunt.hcl` being evaluated, and `basename()` extracts the last path segment (e.g., `dev`, `staging`, `prod`). Each environment's `terragrunt.hcl` contains a single `include` block: `include \"root\" { path = find_in_parent_folders() }`. `find_in_parent_folders()` walks up the directory tree looking for a `terragrunt.hcl` — this is how each child config finds the root. When you run `terragrunt apply` in `environments/dev/`, Terragrunt evaluates the root `terragrunt.hcl` with `get_terragrunt_dir()` returning `.../environments/dev/`, so `local.env` becomes `\"dev\"`, and the generated backend block becomes `bucket = \"my-tfstate-dev\"`. Run the same command in `environments/prod/` and the bucket is `\"my-tfstate-prod\"`. This magic requires zero changes to the child configs — the path-based variable is the entire mechanism. `include` also merges `inputs`: any `inputs` defined in the root `terragrunt.hcl` are available in every child environment as Terraform variable values — so common variables like `region`, `account_id`, or `project_name` are defined once in root. Child configs add or override inputs for what differs per environment. Terragrunt also supports dependency blocks between environments: `dependency \"vpc\" { config_path = \"../vpc\" }` — this makes `terragrunt apply` in an `ec2` module automatically run apply in the `vpc` module first (if needed) and then passes `vpc.outputs.vpc_id` as an input to `ec2`. This dependency-aware orchestration is what makes Terragrunt the preferred choice for large infrastructure codebases where module dependency graphs span multiple directories.",
        np: "Terragrunt को `include` block DRY mechanism हो जसले directory-per-environment लाई scale मा practical बनाउँछ। यो बिना, प्रत्येक environment directory मा S3 bucket name, key path, DynamoDB table name, region, र encryption setting सहित complete `backend.tf` — र AWS account ID र region सहित complete `provider.tf` हुनुपर्छ। Backend bucket name change हुँदा, 10 file update गर्नुहुन्छ। Terragrunt को `include` सँग, एउटा update गर्नुहुन्छ। Mechanically कसरी काम गर्छ भन्ने यहाँ छ। Root `terragrunt.hcl` (project root मा राखिन्छ, सबै environment directory माथि) ले template expression सहित `remote_state` block define गर्छ: `bucket = \"my-tfstate-\${local.env}\"`। `local.env` value `basename(get_terragrunt_dir())` ले compute गर्छ — `get_terragrunt_dir()` ले evaluate भइरहेको current `terragrunt.hcl` containing directory को absolute path return गर्छ, र `basename()` ले last path segment extract गर्छ (जस्तै, `dev`, `staging`, `prod`)। प्रत्येक environment को `terragrunt.hcl` मा single `include` block हुन्छ: `include \"root\" { path = find_in_parent_folders() }`। `find_in_parent_folders()` ले `terragrunt.hcl` खोज्दै directory tree up walk गर्छ — यसरी प्रत्येक child config ले root find गर्छ। `environments/dev/` मा `terragrunt apply` run गर्दा, Terragrunt ले `get_terragrunt_dir()` सँग root `terragrunt.hcl` evaluate गर्छ जसले `.../environments/dev/` return गर्छ, त्यसैले `local.env` `\"dev\"` हुन्छ, र generated backend block `bucket = \"my-tfstate-dev\"` हुन्छ। `environments/prod/` मा same command run गर्नुहोस् र bucket `\"my-tfstate-prod\"` हुन्छ। यो magic को child config मा zero change चाहिन्छ — path-based variable नै entire mechanism हो। `include` ले `inputs` पनि merge गर्छ: root `terragrunt.hcl` मा define भएको कुनै पनि `inputs` हरेक child environment मा Terraform variable value को रूपमा available हुन्छ — त्यसैले `region`, `account_id`, वा `project_name` जस्ता common variable एकचोटि root मा define हुन्छ। Child config ले per environment differ गर्ने को लागि input add वा override गर्छ। Terragrunt ले environment बीचको dependency block पनि support गर्छ: `dependency \"vpc\" { config_path = \"../vpc\" }` — यसले `ec2` module मा `terragrunt apply` ले automatically `vpc` module मा apply run गर्छ (आवश्यक भएमा) र `vpc.outputs.vpc_id` लाई `ec2` मा input को रूपमा pass गर्छ। यो dependency-aware orchestration नै Terragrunt लाई multiple directory span हुने module dependency graph भएका large infrastructure codebase को लागि preferred choice बनाउँछ।",
        jp: "Terragrunt の `include` ブロックは、ディレクトリ per 環境をスケールで実用的にする DRY メカニズムです。これなしでは、すべての環境ディレクトリに S3 バケット名・キーパス・DynamoDB テーブル名・リージョン・暗号化設定を持つ完全な `backend.tf` と、AWS アカウント ID とリージョンを持つ完全な `provider.tf` が必要です。バックエンドバケット名が変わると、10 個のファイルを更新します。Terragrunt の `include` を使うと、1 つだけ更新します。仕組みを機械的に説明します。ルートの `terragrunt.hcl`（プロジェクトルート、すべての環境ディレクトリの上に配置）はテンプレート式を持つ `remote_state` ブロックを定義します：`bucket = \"my-tfstate-\${local.env}\"`。`local.env` 値は `basename(get_terragrunt_dir())` によって計算されます — `get_terragrunt_dir()` は評価中の現在の `terragrunt.hcl` を含むディレクトリの絶対パスを返し、`basename()` は最後のパスセグメントを抽出します（例：`dev`・`staging`・`prod`）。各環境の `terragrunt.hcl` には単一の `include` ブロックが含まれます：`include \"root\" { path = find_in_parent_folders() }`。`find_in_parent_folders()` は `terragrunt.hcl` を探してディレクトリツリーを上方向に歩きます — これが各子設定がルートを見つける方法です。`environments/dev/` で `terragrunt apply` を実行すると、Terragrunt は `get_terragrunt_dir()` が `.../environments/dev/` を返す状態でルートの `terragrunt.hcl` を評価し、`local.env` が `\"dev\"` になり、生成されたバックエンドブロックが `bucket = \"my-tfstate-dev\"` になります。`environments/prod/` で同じコマンドを実行するとバケットは `\"my-tfstate-prod\"` です。このマジックには子設定へのゼロの変更が必要です — パスベースの変数がすべてのメカニズムです。`include` は `inputs` もマージします：ルートの `terragrunt.hcl` で定義された `inputs` はすべての子環境で Terraform 変数値として利用可能です — そのため `region`・`account_id`・`project_name` のような共通変数はルートで一度だけ定義されます。子設定は環境ごとに異なる部分の入力を追加またはオーバーライドします。Terragrunt は環境間の依存関係ブロックもサポートします：`dependency \"vpc\" { config_path = \"../vpc\" }` — これにより `ec2` モジュールでの `terragrunt apply` が自動的に `vpc` モジュールで apply を先に実行し（必要な場合）、`vpc.outputs.vpc_id` を `ec2` への入力として渡します。この依存関係を意識したオーケストレーションが、複数のディレクトリにまたがるモジュール依存グラフを持つ大規模なインフラコードベースで Terragrunt が好まれる理由です。",
      },
      tag: {
        en: "Terragrunt include & DRY config",
        np: "Terragrunt include र DRY config",
        jp: "Terragrunt の include と DRY 設定",
      },
    },
  ],
};
