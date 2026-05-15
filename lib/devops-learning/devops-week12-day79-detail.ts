import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**HCL (HashiCorp Configuration Language)** is Terraform's purpose-built configuration syntax. It is JSON-compatible — every valid HCL file has a semantically equivalent JSON representation — but HCL is dramatically more readable and writable for humans. JSON was never designed for configuration authoring: it has no comments, verbose syntax, and no string interpolation. HCL solves all of these problems. HCL is built around **blocks**: a block has a **type**, zero or more string **labels**, and a **body** enclosed in braces. For example: `resource \"aws_instance\" \"web\" { ... }` — the block type is `resource`, the labels are `\"aws_instance\"` (the resource type) and `\"web\"` (the local name you choose), and everything between the braces is the body. **Arguments** are key-value assignments inside a block body: `instance_type = \"t3.micro\"`. Values can be strings (double-quoted), numbers, booleans (`true`/`false`), lists (`[\"a\", \"b\"]`), maps (`{ key = \"value\" }`), or `null`. **Expressions** go beyond literals: a **reference** like `aws_subnet.main.id` reads an attribute from another resource in the configuration. Terraform builds a **dependency graph** from all references and creates resources in topological order — if `aws_instance.web` references `aws_subnet.main.id`, Terraform automatically knows to create the subnet first. **Function calls** transform values at plan time: `file(\"./script.sh\")` reads a local file, `base64encode(...)` encodes a string, `toset(...)` converts a list to a set. **Conditional expressions** enable dynamic behavior: `var.env == \"prod\" ? \"t3.large\" : \"t3.micro\"` selects instance type based on environment. The `terraform {}` block is special: it configures the Terraform binary itself — required provider versions and backend configuration go here, not in the `provider` block.",
    np: "**HCL (HashiCorp Configuration Language)** Terraform को purpose-built configuration syntax हो। यो JSON-compatible छ — हरेक valid HCL file को semantically equivalent JSON representation हुन्छ — तर HCL मानिसका लागि धेरै readable र writable छ। JSON कहिल्यै configuration authoring को लागि design गरिएको थिएन: यसमा comment छैन, verbose syntax छ, र string interpolation छैन। HCL ले यी सबै समस्या solve गर्छ। HCL **block** को वरिपरि build गरिएको छ: एउटा block मा **type**, शून्य वा धेरै string **label**, र braces भित्र **body** हुन्छ। उदाहरणको लागि: `resource \"aws_instance\" \"web\" { ... }` — block type `resource` हो, label हरू `\"aws_instance\"` (resource type) र `\"web\"` (तपाईंले choose गर्ने local name) हुन्, र braces बीचको सबैकुरा body हो। **Argument** block body भित्र key-value assignment हो: `instance_type = \"t3.micro\"`। Value string (double-quoted), number, boolean (`true`/`false`), list (`[\"a\", \"b\"]`), map (`{ key = \"value\" }`), वा `null` हुन सक्छ। **Expression** literal भन्दा बाहिर जान्छ: `aws_subnet.main.id` जस्तो **reference** ले configuration मा अर्को resource बाट attribute पढ्छ। Terraform ले सबै reference बाट **dependency graph** build गर्छ र topological order मा resource create गर्छ — `aws_instance.web` ले `aws_subnet.main.id` reference गरेको छ भने, Terraform ले automatically थाहा पाउँछ subnet पहिले create गर्नुपर्छ। **Function call** ले plan time मा value transform गर्छ: `file(\"./script.sh\")` ले local file पढ्छ, `base64encode(...)` ले string encode गर्छ, `toset(...)` ले list लाई set मा convert गर्छ। **Conditional expression** ले dynamic behavior enable गर्छ: `var.env == \"prod\" ? \"t3.large\" : \"t3.micro\"` ले environment को आधारमा instance type select गर्छ। `terraform {}` block special छ: यसले Terraform binary नै configure गर्छ — required provider version र backend configuration `provider` block मा होइन यहाँ राखिन्छ।",
    jp: "**HCL（HashiCorp Configuration Language）**は Terraform の専用設定構文です。JSON と互換性があります — すべての有効な HCL ファイルには意味的に等価な JSON 表現があります — しかし HCL は人間にとってはるかに読みやすく書きやすいです。JSON は設定のオーサリングのために設計されたことはありませんでした：コメントがなく・冗長な構文で・文字列の補間もありません。HCL はこれらの問題をすべて解決します。HCL は**ブロック**を中心に構築されています：ブロックには**タイプ**・0 個以上の文字列**ラベル**・波括弧で囲まれた**ボディ**があります。例：`resource \"aws_instance\" \"web\" { ... }` — ブロックタイプは `resource`、ラベルは `\"aws_instance\"`（リソースタイプ）と `\"web\"`（選択するローカル名）、波括弧の間のすべてがボディです。**引数**はブロックボディ内のキーと値の割り当てです：`instance_type = \"t3.micro\"`。値は文字列（ダブルクォート）・数値・ブール値（`true`/`false`）・リスト（`[\"a\", \"b\"]`）・マップ（`{ key = \"value\" }`）または `null` になれます。**式**はリテラルを超えます：`aws_subnet.main.id` のような**参照**は設定内の別のリソースから属性を読み込みます。Terraform はすべての参照から**依存グラフ**を構築し、トポロジカル順序でリソースを作成します — `aws_instance.web` が `aws_subnet.main.id` を参照している場合、Terraform は自動的にサブネットを最初に作成することを知っています。**関数呼び出し**はプラン時に値を変換します：`file(\"./script.sh\")` はローカルファイルを読み込み、`base64encode(...)` は文字列をエンコードし、`toset(...)` はリストをセットに変換します。**条件式**は動的な動作を可能にします：`var.env == \"prod\" ? \"t3.large\" : \"t3.micro\"` は環境に基づいてインスタンスタイプを選択します。`terraform {}` ブロックは特別です：Terraform バイナリ自体を設定します — 必要なプロバイダーバージョンとバックエンド設定は `provider` ブロックではなくここに置きます。",
  } as const,
  o2: {
    en: "The **provider** block configures a specific provider plugin: `provider \"aws\" { region = \"us-east-1\" }`. This tells the AWS provider which region to target. Providers expose two types of schema objects: **resource** types (managed objects that Terraform creates, updates, and destroys — `aws_instance`, `aws_s3_bucket`, `aws_vpc`) and **data** sources (read-only queries against existing infrastructure — `data \"aws_ami\" \"ubuntu\" { ... }`, `data \"aws_vpc\" \"default\" { default = true }`). A data source is like a read-only import: Terraform fetches the current value from the API at plan time and you use it in resources without Terraform managing it. **Variables** make configurations reusable and parameterized: `variable \"instance_type\" { type = string; default = \"t3.micro\"; description = \"EC2 instance type\" }` — referenced as `var.instance_type`. Variable types include `string`, `number`, `bool`, `list(string)`, `map(string)`, `set(string)`, `object({...})`, and `any`. Variables without a default are required — Terraform will prompt interactively or fail if not provided. **Locals** are named computed expressions that reduce repetition: `locals { name_prefix = \"${var.project}-${var.env}\" }` — referenced as `local.name_prefix`. Locals are evaluated once per plan and are not exposed externally. Use locals to avoid repeating the same complex expression in multiple places. **Outputs** expose values after apply: `output \"instance_ip\" { value = aws_instance.web.public_ip; description = \"Public IP\" }` — printed at the end of apply and queryable with `terraform output`. Outputs are also the interface between Terraform configurations: a child module exposes outputs that the parent module reads. **`.tfvars` files** supply variable values in bulk: `terraform.tfvars` is automatically loaded, any other `.tfvars` file needs `-var-file=\"prod.tfvars\"`. `TF_VAR_instance_type` environment variables also work — useful for CI/CD pipelines where you don't want to write secrets to disk.",
    np: "**Provider** block ले specific provider plugin configure गर्छ: `provider \"aws\" { region = \"us-east-1\" }`। यसले AWS provider लाई कुन region target गर्ने भनेर बताउँछ। Provider ले दुई प्रकारको schema object expose गर्छ: **resource** type (Terraform ले create, update, र destroy गर्ने managed object — `aws_instance`, `aws_s3_bucket`, `aws_vpc`) र **data** source (existing infrastructure विरुद्ध read-only query — `data \"aws_ami\" \"ubuntu\" { ... }`, `data \"aws_vpc\" \"default\" { default = true }`)। Data source read-only import जस्तो हो: Terraform ले plan time मा API बाट current value fetch गर्छ र तपाईंले resource मा Terraform ले manage नगरी प्रयोग गर्नुहुन्छ। **Variable** ले configuration reusable र parameterized बनाउँछ: `variable \"instance_type\" { type = string; default = \"t3.micro\"; description = \"EC2 instance type\" }` — `var.instance_type` को रूपमा reference। Variable type मा `string`, `number`, `bool`, `list(string)`, `map(string)`, `set(string)`, `object({...})`, र `any` छन्। Default बिनाको variable required हुन्छ — Terraform ले interactively prompt गर्छ वा provide नगरे fail हुन्छ। **Local** ले repetition घटाउने named computed expression हो: `locals { name_prefix = \"${var.project}-${var.env}\" }` — `local.name_prefix` को रूपमा reference। Local ले per plan एक पटक evaluate हुन्छ र externally expose हुँदैन। एउटै complex expression धेरै ठाउँमा repeat गर्नबाट बच्न local प्रयोग गर्नुहोस्। **Output** ले apply पछि value expose गर्छ: `output \"instance_ip\" { value = aws_instance.web.public_ip; description = \"Public IP\" }` — apply को अन्तमा print हुन्छ र `terraform output` सँग query गर्न सकिन्छ। Output Terraform configuration बीचको interface पनि हो: child module ले output expose गर्छ जो parent module पढ्छ। **`.tfvars` file** ले bulk मा variable value supply गर्छ: `terraform.tfvars` automatically load हुन्छ, अरू `.tfvars` file लाई `-var-file=\"prod.tfvars\"` चाहिन्छ। `TF_VAR_instance_type` environment variable पनि काम गर्छ — CI/CD pipeline को लागि useful जहाँ तपाईंले disk मा secret लेख्न चाहनुहुन्न।",
    jp: "**プロバイダー**ブロックは特定のプロバイダープラグインを設定します：`provider \"aws\" { region = \"us-east-1\" }`。これは AWS プロバイダーにどのリージョンをターゲットにするかを伝えます。プロバイダーは 2 種類のスキーマオブジェクトを公開します：**リソース**タイプ（Terraform が作成・更新・削除する管理対象オブジェクト — `aws_instance`・`aws_s3_bucket`・`aws_vpc`）と**データ**ソース（既存のインフラに対する読み取り専用クエリ — `data \"aws_ami\" \"ubuntu\" { ... }`・`data \"aws_vpc\" \"default\" { default = true }`）。データソースは読み取り専用インポートのようなものです：Terraform はプラン時に API から現在の値を取得し、Terraform が管理せずにリソース内で使用します。**変数**は設定を再利用可能でパラメーター化します：`variable \"instance_type\" { type = string; default = \"t3.micro\"; description = \"EC2 instance type\" }` — `var.instance_type` として参照されます。変数タイプには `string`・`number`・`bool`・`list(string)`・`map(string)`・`set(string)`・`object({...})`・`any` があります。デフォルトのない変数は必須です — Terraform は対話的にプロンプトを表示するか、提供されなければ失敗します。**ローカル**は繰り返しを減らす名前付き計算式です：`locals { name_prefix = \"${var.project}-${var.env}\" }` — `local.name_prefix` として参照されます。ローカルはプランごとに 1 回評価され、外部に公開されません。複数の場所で同じ複雑な式を繰り返さないようにローカルを使用します。**出力**は適用後に値を公開します：`output \"instance_ip\" { value = aws_instance.web.public_ip; description = \"Public IP\" }` — 適用の最後に出力され `terraform output` でクエリできます。出力は Terraform 設定間のインターフェースでもあります：子モジュールは親モジュールが読み込む出力を公開します。**`.tfvars` ファイル**は変数値を一括供給します：`terraform.tfvars` は自動的に読み込まれ、他の `.tfvars` ファイルには `-var-file=\"prod.tfvars\"` が必要です。`TF_VAR_instance_type` 環境変数も機能します — ディスクにシークレットを書きたくない CI/CD パイプラインに便利です。",
  } as const,
};

export const DEVOPS_DAY_79_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "HCL syntax — blocks, arguments, expressions & references",
        np: "HCL syntax — block, argument, expression र reference",
        jp: "HCL 構文 — ブロック・引数・式・参照",
      },
      blocks: [
        { type: "diagram", id: "devops-terraform-hcl" },
        {
          type: "table",
          caption: {
            en: "HCL block types — what each block type does and when to use it",
            np: "HCL block type — प्रत्येक block type ले के गर्छ र कहिले प्रयोग गर्ने",
            jp: "HCL ブロックタイプ — 各ブロックタイプの役割と使用タイミング",
          },
          headers: [
            { en: "Block type", np: "Block type", jp: "ブロックタイプ" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
            { en: "Example", np: "Example", jp: "例" },
            { en: "Creates / reads", np: "Creates / reads", jp: "作成／読み込み" },
          ],
          rows: [
            [
              { en: "`terraform`", np: "`terraform`", jp: "`terraform`" },
              { en: "Configure Terraform binary — required providers, backend, experiments", np: "Terraform binary configure — required provider, backend, experiment", jp: "Terraform バイナリを設定 — 必要なプロバイダー・バックエンド・実験的機能" },
              { en: "`terraform { required_version = \">= 1.5\" }`", np: "`terraform { required_version = \">= 1.5\" }`", jp: "`terraform { required_version = \">= 1.5\" }`" },
              { en: "No resource — controls Terraform itself", np: "Resource होइन — Terraform नै control गर्छ", jp: "リソースなし — Terraform 自体を制御" },
            ],
            [
              { en: "`provider`", np: "`provider`", jp: "`provider`" },
              { en: "Configure a provider plugin — region, credentials, endpoints", np: "Provider plugin configure — region, credential, endpoint", jp: "プロバイダープラグインを設定 — リージョン・認証情報・エンドポイント" },
              { en: "`provider \"aws\" { region = \"us-east-1\" }`", np: "`provider \"aws\" { region = \"us-east-1\" }`", jp: "`provider \"aws\" { region = \"us-east-1\" }`" },
              { en: "No resource — configures the provider client", np: "Resource होइन — provider client configure गर्छ", jp: "リソースなし — プロバイダークライアントを設定" },
            ],
            [
              { en: "`resource`", np: "`resource`", jp: "`resource`" },
              { en: "Declare a managed cloud object — the most common block type", np: "Managed cloud object declare — सबैभन्दा common block type", jp: "管理対象クラウドオブジェクトを宣言 — 最も一般的なブロックタイプ" },
              { en: "`resource \"aws_instance\" \"web\" { ami = ... }`", np: "`resource \"aws_instance\" \"web\" { ami = ... }`", jp: "`resource \"aws_instance\" \"web\" { ami = ... }`" },
              { en: "**Creates** the real cloud resource via provider API", np: "Provider API मार्फत real cloud resource **create** गर्छ", jp: "プロバイダー API を通じて実際のクラウドリソースを**作成**する" },
            ],
            [
              { en: "`data`", np: "`data`", jp: "`data`" },
              { en: "Read-only lookup of existing infrastructure — does not create anything", np: "Existing infrastructure को read-only lookup — केही create गर्दैन", jp: "既存インフラの読み取り専用ルックアップ — 何も作成しない" },
              { en: "`data \"aws_ami\" \"ubuntu\" { most_recent = true }`", np: "`data \"aws_ami\" \"ubuntu\" { most_recent = true }`", jp: "`data \"aws_ami\" \"ubuntu\" { most_recent = true }`" },
              { en: "**Reads** from provider API, exposes as `data.aws_ami.ubuntu.*`", np: "Provider API बाट **read** गर्छ, `data.aws_ami.ubuntu.*` को रूपमा expose", jp: "プロバイダー API から**読み込み**、`data.aws_ami.ubuntu.*` として公開" },
            ],
            [
              { en: "`output`", np: "`output`", jp: "`output`" },
              { en: "Expose values after apply — module interface, human-readable results", np: "Apply पछि value expose — module interface, human-readable result", jp: "適用後に値を公開 — モジュールインターフェース・人間が読める結果" },
              { en: "`output \"ip\" { value = aws_instance.web.public_ip }`", np: "`output \"ip\" { value = aws_instance.web.public_ip }`", jp: "`output \"ip\" { value = aws_instance.web.public_ip }`" },
              { en: "**Reads** from state, prints after apply, queryable via `terraform output`", np: "State बाट **read** गर्छ, apply पछि print, `terraform output` मार्फत query", jp: "状態から**読み込み**、適用後に出力、`terraform output` でクエリ可能" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Variables, locals, outputs & .tfvars",
        np: "Variable, local, output र .tfvars",
        jp: "変数・ローカル・出力・.tfvars",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Full HCL example — variables.tf, locals, data source, resource, outputs.tf, tfvars",
            np: "पूरा HCL example — variables.tf, local, data source, resource, outputs.tf, tfvars",
            jp: "完全な HCL 例 — variables.tf・ローカル・データソース・リソース・outputs.tf・tfvars",
          },
          code: `# ── variables.tf ──────────────────────────────────────────────────────
# Declare input variables — these make the config reusable

variable "project" {
  type        = string
  description = "Project name used as a prefix for all resources"
  # No default — required, Terraform will prompt if not provided
}

variable "env" {
  type        = string
  description = "Deployment environment: dev, staging, or production"
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "production"], var.env)
    error_message = "env must be dev, staging, or production."
  }
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to SSH to instances"
  default     = ["10.0.0.0/8"]
}

# ── locals.tf (or locals block inside main.tf) ─────────────────────────
# Locals are computed expressions — not exposed externally
locals {
  # Compose a name prefix used across all resources
  name_prefix = "\${var.project}-\${var.env}"

  # Select instance type based on env (overrides var if prod)
  resolved_instance_type = var.env == "production" ? "t3.large" : var.instance_type

  # Common tags applied to every resource
  common_tags = {
    Project     = var.project
    Environment = var.env
    ManagedBy   = "terraform"
  }
}

# ── main.tf ────────────────────────────────────────────────────────────
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  region = "us-east-1"
}

# data source: look up the latest Ubuntu 22.04 AMI — read-only
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]   # Canonical's AWS account ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# data source: look up the default VPC
data "aws_vpc" "default" {
  default = true
}

# resource: EC2 instance using variables, locals, and data source references
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id           # from data source
  instance_type = local.resolved_instance_type     # from local

  tags = merge(local.common_tags, {
    Name = "\${local.name_prefix}-web"
  })

  # explicit dependency: if you need to force ordering without a reference
  depends_on = [data.aws_vpc.default]
}

# resource: security group allowing SSH from allowed_cidrs
resource "aws_security_group" "ssh" {
  name        = "\${local.name_prefix}-ssh"
  description = "Allow SSH inbound"
  vpc_id      = data.aws_vpc.default.id

  dynamic "ingress" {
    for_each = var.allowed_cidrs
    content {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
    }
  }

  tags = local.common_tags
}

# ── outputs.tf ────────────────────────────────────────────────────────
output "instance_id" {
  value       = aws_instance.web.id
  description = "EC2 instance ID"
}

output "instance_public_ip" {
  value       = aws_instance.web.public_ip
  description = "Public IP of the web instance"
}

output "ami_id_used" {
  value       = data.aws_ami.ubuntu.id
  description = "AMI ID resolved by the data source at plan time"
}

# ── terraform.tfvars (auto-loaded) ────────────────────────────────────
# project       = "myapp"
# env           = "dev"
# instance_type = "t3.micro"

# ── prod.tfvars (explicit: terraform apply -var-file="prod.tfvars") ──
# project       = "myapp"
# env           = "production"
# instance_type = "t3.large"

# ── Running with different var sources ────────────────────────────────
# Auto-load terraform.tfvars:
terraform plan

# Explicit var file:
terraform apply -var-file="prod.tfvars"

# Inline var override (highest precedence after extra-vars):
terraform apply -var="env=staging"

# Environment variable (useful in CI — no disk secrets):
export TF_VAR_project="myapp"
export TF_VAR_env="production"
terraform apply

# Query outputs after apply:
terraform output
terraform output instance_public_ip   # single output
terraform output -json                # machine-readable JSON`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a three-file Terraform project: `variables.tf` with four variables (`project` string required, `env` string defaulting to `\"dev\"`, `instance_type` string defaulting to `\"t3.micro\"`, `tags` map defaulting to an empty map), `locals.tf` with a `name_prefix` local combining `var.project` and `var.env`, and `outputs.tf` with a single output `name_prefix_out` exposing `local.name_prefix`. Add a `null_resource` (use provider `hashicorp/null`) in `main.tf` that just has tags. Run `terraform init && terraform plan` — observe that `project` is required and you're prompted. Then create a `terraform.tfvars` setting `project = \"myapp\"` and run again — confirm the output shows `\"myapp-dev\"`. Pass `-var=\"env=staging\"` and confirm the output becomes `\"myapp-staging\"`.",
              np: "तीनवटा file भएको Terraform project create गर्नुहोस्: `variables.tf` चारवटा variable सहित (`project` string required, `env` string `\"dev\"` default, `instance_type` string `\"t3.micro\"` default, `tags` map empty map default), `locals.tf` मा `var.project` र `var.env` combine गर्ने `name_prefix` local, र `outputs.tf` मा `local.name_prefix` expose गर्ने single output `name_prefix_out`। `main.tf` मा `null_resource` (provider `hashicorp/null` प्रयोग गर्नुहोस्) add गर्नुहोस् जसमा tags मात्र छ। `terraform init && terraform plan` run गर्नुहोस् — `project` required छ र prompt आउँछ observe गर्नुहोस्। त्यसपछि `project = \"myapp\"` set गर्ने `terraform.tfvars` create गर्नुहोस् र फेरि run गर्नुहोस् — output ले `\"myapp-dev\"` देखाउँछ confirm गर्नुहोस्। `-var=\"env=staging\"` pass गर्नुहोस् र output `\"myapp-staging\"` हुन्छ confirm गर्नुहोस्।",
              jp: "3 ファイルの Terraform プロジェクトを作成する：`variables.tf` に 4 つの変数（`project` 文字列必須・`env` 文字列デフォルト `\"dev\"`・`instance_type` 文字列デフォルト `\"t3.micro\"`・`tags` マップデフォルト空マップ）、`locals.tf` に `var.project` と `var.env` を組み合わせる `name_prefix` ローカル、`outputs.tf` に `local.name_prefix` を公開する単一出力 `name_prefix_out`。`main.tf` に tags だけを持つ `null_resource`（プロバイダー `hashicorp/null` を使用）を追加する。`terraform init && terraform plan` を実行する — `project` が必須でプロンプトが表示されることを確認する。次に `project = \"myapp\"` を設定する `terraform.tfvars` を作成して再実行する — 出力が `\"myapp-dev\"` を示すことを確認する。`-var=\"env=staging\"` を渡して出力が `\"myapp-staging\"` になることを確認する。",
            },
            {
              en: "Add a `data \"aws_ami\" \"ubuntu\"` block to your configuration that filters for the latest Ubuntu 22.04 HVM AMI owned by Canonical (`099720109477`). Add an output `ubuntu_ami_id` that exposes `data.aws_ami.ubuntu.id`. Run `terraform plan` and read the plan — observe that the `data` source is shown as a 'read' operation (no `+` create symbol) and the output will be 'known after apply'. After apply, run `terraform output ubuntu_ami_id` to see the resolved AMI ID. Then add a second data source: `data \"aws_availability_zones\" \"available\" { state = \"available\" }` and output `data.aws_availability_zones.available.names` — observe it returns a list of AZ names in your region.",
              np: "आफ्नो configuration मा `data \"aws_ami\" \"ubuntu\"` block add गर्नुहोस् जसले Canonical (`099720109477`) ले own गरेको latest Ubuntu 22.04 HVM AMI को लागि filter गर्छ। `data.aws_ami.ubuntu.id` expose गर्ने `ubuntu_ami_id` output add गर्नुहोस्। `terraform plan` run गर्नुहोस् र plan पढ्नुहोस् — `data` source 'read' operation को रूपमा देखिन्छ (`+` create symbol छैन) र output 'known after apply' हुनेछ observe गर्नुहोस्। Apply पछि, resolved AMI ID हेर्न `terraform output ubuntu_ami_id` run गर्नुहोस्। त्यसपछि दोस्रो data source add गर्नुहोस्: `data \"aws_availability_zones\" \"available\" { state = \"available\" }` र `data.aws_availability_zones.available.names` output गर्नुहोस् — तपाईंको region मा AZ name को list return हुन्छ observe गर्नुहोस्।",
              jp: "Canonical（`099720109477`）が所有する最新の Ubuntu 22.04 HVM AMI をフィルタリングする `data \"aws_ami\" \"ubuntu\"` ブロックを設定に追加する。`data.aws_ami.ubuntu.id` を公開する `ubuntu_ami_id` 出力を追加する。`terraform plan` を実行してプランを読む — `data` ソースが「読み取り」操作として表示され（`+` 作成シンボルなし）、出力は「apply 後に判明」になることを確認する。適用後、`terraform output ubuntu_ami_id` を実行して解決された AMI ID を確認する。次に 2 番目のデータソースを追加する：`data \"aws_availability_zones\" \"available\" { state = \"available\" }` と `data.aws_availability_zones.available.names` を出力する — リージョン内の AZ 名のリストが返されることを確認する。",
            },
            {
              en: "Write a Terraform configuration that creates an `aws_security_group` with a `dynamic` ingress block — use `dynamic \"ingress\" { for_each = var.allowed_cidrs; content { from_port = 22; to_port = 22; protocol = \"tcp\"; cidr_blocks = [ingress.value] } }`. Set `allowed_cidrs` in `terraform.tfvars` to three CIDR ranges. Run `terraform plan` and verify the plan shows three separate ingress rules being created. Then add a `validation` block to the `allowed_cidrs` variable that rejects any CIDR that doesn't match a `/8`, `/16`, `/24`, or `/32` mask using `can(regex(\"...\", v))`. Test the validation by passing an invalid CIDR with `-var='allowed_cidrs=[\"999.0.0.0/99\"]'` and verify Terraform rejects it with your custom error message before making any API calls.",
              np: "`dynamic` ingress block सहित `aws_security_group` create गर्ने Terraform configuration लेख्नुहोस् — `dynamic \"ingress\" { for_each = var.allowed_cidrs; content { from_port = 22; to_port = 22; protocol = \"tcp\"; cidr_blocks = [ingress.value] } }` प्रयोग गर्नुहोस्। `terraform.tfvars` मा `allowed_cidrs` तीनवटा CIDR range मा set गर्नुहोस्। `terraform plan` run गर्नुहोस् र plan ले तीनवटा छुट्टाछुट्टै ingress rule create हुँदैछ देखाउँछ verify गर्नुहोस्। त्यसपछि `allowed_cidrs` variable मा `validation` block add गर्नुहोस् जसले `/8`, `/16`, `/24`, वा `/32` mask match नगर्ने CIDR `can(regex(\"...\", v))` प्रयोग गरेर reject गर्छ। `-var='allowed_cidrs=[\"999.0.0.0/99\"]'` सँग invalid CIDR pass गरेर validation test गर्नुहोस् र Terraform ले API call नगरी तपाईंको custom error message सहित reject गर्छ verify गर्नुहोस्।",
              jp: "`dynamic` ingress ブロックを持つ `aws_security_group` を作成する Terraform 設定を書く — `dynamic \"ingress\" { for_each = var.allowed_cidrs; content { from_port = 22; to_port = 22; protocol = \"tcp\"; cidr_blocks = [ingress.value] } }` を使用する。`terraform.tfvars` で `allowed_cidrs` を 3 つの CIDR 範囲に設定する。`terraform plan` を実行し、プランが 3 つの別々の ingress ルールが作成されることを示すことを確認する。次に `allowed_cidrs` 変数に `validation` ブロックを追加して、`/8`・`/16`・`/24`・`/32` マスクに一致しない CIDR を `can(regex(\"...\", v))` を使って拒否する。`-var='allowed_cidrs=[\"999.0.0.0/99\"]'` で無効な CIDR を渡してバリデーションをテストし、Terraform が API 呼び出しをする前にカスタムエラーメッセージで拒否することを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a `variable`, a `local`, and an `output` in Terraform?",
        np: "Terraform मा `variable`, `local`, र `output` बीचको फरक के हो?",
        jp: "Terraform における `variable`・`local`・`output` の違いは何か？",
      },
      answer: {
        en: "These three constructs serve completely different purposes and represent the three ends of the data flow in a Terraform configuration. **`variable`** represents **inputs** — values that come into your configuration from the outside world. Variables make your configuration reusable across environments: instead of hardcoding `instance_type = \"t3.micro\"`, you declare a variable and let the caller set it via `.tfvars`, `-var`, or environment variables. Variables are the public API of a Terraform module — they are what operators and other modules use to customize behavior. Variables can have types, defaults, descriptions, and validation rules. A variable without a default is required. Think of variables as function parameters. **`local`** represents **internal computed values** — intermediate calculations derived from variables, data sources, and other locals. Locals exist purely to avoid repetition and to give meaningful names to complex expressions. They are not externally settable (you cannot override a local with `-var`) and not externally readable (they don't appear in `terraform output`). If you find yourself writing `\"${var.project}-${var.env}\"` in five different resource tags, extract it into `local.name_prefix` once and reference `local.name_prefix` everywhere. Locals are evaluated lazily at plan time. Think of locals as local variables inside a function. **`output`** represents **exports** — values that your configuration makes available to the outside world after apply. Outputs serve two purposes: (1) they are printed to the terminal after `terraform apply` so operators can see key values like IP addresses and ARNs; (2) they are the interface between Terraform modules — a parent module reads outputs from a child module using `module.child_name.output_name`. Outputs can be marked `sensitive = true` to prevent them from being printed in plain text. Think of outputs as return values from a function. The data flow is: `variable` (input) → `local` (compute) → `resource`/`data` (create/read infrastructure) → `output` (export).",
        np: "यी तीनवटा construct पूरै different purpose serve गर्छन् र Terraform configuration मा data flow का तीन end represent गर्छन्। **`variable`** ले **input** represent गर्छ — external world बाट configuration मा आउने value। Variable ले configuration लाई environment across reusable बनाउँछ: `instance_type = \"t3.micro\"` hardcode गर्नुको सट्टा variable declare गर्नुहोस् र caller लाई `.tfvars`, `-var`, वा environment variable मार्फत set गर्न दिनुहोस्। Variable Terraform module को public API हो — operator र अरू module ले behavior customize गर्न प्रयोग गर्ने। Variable मा type, default, description, र validation rule हुन सक्छ। Default बिनाको variable required छ। Variable लाई function parameter सम्झनुहोस्। **`local`** ले **internal computed value** represent गर्छ — variable, data source, र अरू local बाट derived intermediate calculation। Local purely repetition avoid गर्न र complex expression लाई meaningful name दिन exist गर्छ। यिनीहरू externally settable छैनन् (`-var` सँग local override गर्न सकिँदैन) र externally readable छैनन् (`terraform output` मा देखिँदैनन्)। पाँचवटा different resource tag मा `\"${var.project}-${var.env}\"` लेख्नु परेको छ भने, एक पटक `local.name_prefix` मा extract गर्नुहोस् र सबैतिर `local.name_prefix` reference गर्नुहोस्। Local ले plan time मा lazily evaluate हुन्छ। Local लाई function भित्रको local variable सम्झनुहोस्। **`output`** ले **export** represent गर्छ — apply पछि configuration ले external world लाई available गराउने value। Output दुईवटा purpose serve गर्छ: (१) ती `terraform apply` पछि terminal मा print हुन्छन् ताकि operator ले IP address र ARN जस्ता key value देख्न सकोस्; (२) ती Terraform module बीचको interface हो — parent module ले `module.child_name.output_name` प्रयोग गरेर child module बाट output पढ्छ। Output लाई plain text मा print हुनबाट रोक्न `sensitive = true` mark गर्न सकिन्छ। Output लाई function बाट return value सम्झनुहोस्। Data flow हो: `variable` (input) → `local` (compute) → `resource`/`data` (infrastructure create/read) → `output` (export)।",
        jp: "これら 3 つの構成は完全に異なる目的を持ち、Terraform 設定のデータフローの 3 つの端点を表します。**`variable`** は**入力**を表します — 外部世界から設定に入ってくる値。変数は設定を環境をまたいで再利用可能にします：`instance_type = \"t3.micro\"` をハードコードする代わりに変数を宣言し、呼び出し元が `.tfvars`・`-var`・環境変数で設定できるようにします。変数は Terraform モジュールのパブリック API です — オペレーターや他のモジュールが動作をカスタマイズするために使うもの。変数にはタイプ・デフォルト・説明・バリデーションルールを持てます。デフォルトのない変数は必須です。変数を関数のパラメーターと考えてください。**`local`** は**内部計算値**を表します — 変数・データソース・他のローカルから派生した中間計算。ローカルは純粋に繰り返しを避け、複雑な式に意味のある名前を付けるために存在します。外部から設定できず（`-var` でローカルをオーバーライドできない）、外部から読み取れません（`terraform output` に表示されない）。5 つの異なるリソースタグに `\"${var.project}-${var.env}\"` を書く必要がある場合、`local.name_prefix` に一度抽出してどこでも `local.name_prefix` を参照します。ローカルはプラン時に遅延評価されます。ローカルを関数内のローカル変数と考えてください。**`output`** は**エクスポート**を表します — 適用後に設定が外部世界に利用可能にする値。出力は 2 つの目的を果たします：(1) `terraform apply` 後にターミナルに出力されるのでオペレーターが IP アドレスや ARN などの主要な値を確認できる；(2) Terraform モジュール間のインターフェースです — 親モジュールは `module.child_name.output_name` を使って子モジュールから出力を読み込みます。出力はプレーンテキストで出力されないように `sensitive = true` とマークできます。出力を関数の戻り値と考えてください。データフローは：`variable`（入力）→ `local`（計算）→ `resource`/`data`（インフラの作成/読み取り）→ `output`（エクスポート）です。",
      },
      tag: {
        en: "variable vs local vs output",
        np: "variable vs local vs output",
        jp: "variable vs local vs output",
      },
    },
    {
      question: {
        en: "How does Terraform know the order to create resources — what is the dependency graph?",
        np: "Terraform लाई resource create गर्ने order कसरी थाहा हुन्छ — dependency graph के हो?",
        jp: "Terraform はリソースを作成する順序をどのように知るのか — 依存グラフとは何か？",
      },
      answer: {
        en: "Terraform automatically determines the correct creation order by building a **directed acyclic graph (DAG)** — a dependency graph — from all the references in your configuration. This is one of Terraform's most powerful features and it completely eliminates the need to manually specify resource creation order. Here is how it works: when you write `vpc_id = aws_vpc.main.id` inside an `aws_subnet` resource, Terraform parses this reference and records that `aws_subnet.public` **depends on** `aws_vpc.main`. At plan time, Terraform walks all resources in the configuration, collects every reference (including data source references and module inputs), and constructs a directed graph where edges point from dependents to dependencies. It then performs a topological sort on this graph to determine the safe creation order. Resources with no dependencies are created first (and in parallel if possible). Resources that reference other resources wait until their dependencies are successfully created. In your plan output you can see this graph reflected: the VPC is shown before the subnet, the subnet before the EC2 instance, the EC2 instance before the security group attachment. **`depends_on`**: sometimes you have a dependency that Terraform cannot detect from references alone — for example, an EC2 instance that depends on an IAM role policy being attached but does not reference the policy in any argument. In this case you use `depends_on = [aws_iam_role_policy_attachment.my_policy]` to declare the dependency explicitly. Use `depends_on` sparingly — overusing it defeats the purpose of automatic dependency detection and can create unnecessarily sequential execution. `terraform graph` outputs the dependency graph in DOT format, which you can visualize with Graphviz (`terraform graph | dot -Tpng > graph.png`) to see the full dependency tree for complex configurations. **Destroy order** is the reverse of create order: Terraform destroys resources in reverse topological order, ensuring no resource is destroyed while other resources still depend on it.",
        np: "Terraform ले configuration मा सबै reference बाट **directed acyclic graph (DAG)** — dependency graph — build गरेर automatically correct creation order determine गर्छ। यो Terraform को सबैभन्दा powerful feature मध्ये एक हो र resource creation order manually specify गर्ने आवश्यकता पूर्ण रूपमा हटाउँछ। यसरी काम गर्छ: `aws_subnet` resource भित्र `vpc_id = aws_vpc.main.id` लेख्दा, Terraform ले यो reference parse गर्छ र `aws_subnet.public` ले `aws_vpc.main` मा **depend** गर्छ record गर्छ। Plan time मा, Terraform ले configuration का सबै resource walk गर्छ, हरेक reference (data source reference र module input सहित) collect गर्छ, र dependent बाट dependency मा point गर्ने edge सहित directed graph construct गर्छ। त्यसपछि यो graph मा topological sort perform गरेर safe creation order determine गर्छ। Dependency नभएका resource पहिले create हुन्छन् (र सम्भव भए parallel मा)। अरू resource reference गर्ने resource ले आफ्नो dependency successfully create नभएसम्म पर्खन्छ। Plan output मा यो graph reflected देख्न सकिन्छ: VPC subnet अघि देखिन्छ, subnet EC2 instance अघि, EC2 instance security group attachment अघि। **`depends_on`**: कहिलेकाहीँ reference मात्रबाट Terraform detect गर्न नसकिने dependency हुन्छ — उदाहरणको लागि, IAM role policy attach भएकोमा depend गर्ने EC2 instance जसले कुनै argument मा policy reference गर्दैन। यस case मा `depends_on = [aws_iam_role_policy_attachment.my_policy]` प्रयोग गरेर dependency explicitly declare गर्नुहोस्। `depends_on` sparingly प्रयोग गर्नुहोस् — अत्यधिक प्रयोगले automatic dependency detection को purpose defeat गर्छ र unnecessarily sequential execution create गर्न सक्छ। `terraform graph` ले DOT format मा dependency graph output गर्छ, जसलाई Graphviz सँग visualize गर्न सकिन्छ (`terraform graph | dot -Tpng > graph.png`) complex configuration को full dependency tree हेर्न। **Destroy order** create order को reverse हो: Terraform ले reverse topological order मा resource destroy गर्छ, अरू resource अझसम्म depend गरिरहेको बेला कुनै resource destroy नहोस् भनेर सुनिश्चित गर्दै।",
        jp: "Terraform は設定内のすべての参照から**有向非巡回グラフ（DAG）** — 依存グラフ — を構築することで、自動的に正しい作成順序を決定します。これは Terraform の最も強力な機能の 1 つであり、リソース作成順序を手動で指定する必要性を完全に排除します。仕組みはこうです：`aws_subnet` リソース内に `vpc_id = aws_vpc.main.id` と書くと、Terraform はこの参照を解析し、`aws_subnet.public` が `aws_vpc.main` に**依存する**ことを記録します。プラン時に Terraform は設定内のすべてのリソースを走査し、すべての参照（データソース参照とモジュール入力を含む）を収集し、依存元から依存先にエッジが向いた有向グラフを構築します。次にこのグラフでトポロジカルソートを実行して安全な作成順序を決定します。依存関係のないリソースが最初に作成されます（可能な場合は並列で）。他のリソースを参照するリソースは依存関係が正常に作成されるまで待機します。プラン出力でこのグラフが反映されるのが見えます：VPC がサブネットの前・サブネットが EC2 インスタンスの前・EC2 インスタンスがセキュリティグループのアタッチメントの前に示されます。**`depends_on`**：参照だけでは Terraform が検出できない依存関係が生じることがあります — 例えば、IAM ロールポリシーがアタッチされることに依存しているが引数でポリシーを参照していない EC2 インスタンス。この場合 `depends_on = [aws_iam_role_policy_attachment.my_policy]` を使って依存関係を明示的に宣言します。`depends_on` は控えめに使用してください — 過度に使うと自動依存関係検出の目的を損ない、不必要に逐次実行を作成する可能性があります。`terraform graph` は DOT 形式で依存グラフを出力し、Graphviz で可視化できます（`terraform graph | dot -Tpng > graph.png`）複雑な設定の完全な依存ツリーを確認するために。**破棄順序**は作成順序の逆です：Terraform は逆トポロジカル順序でリソースを破棄し、他のリソースがまだ依存している間はリソースが破棄されないことを保証します。",
      },
      tag: {
        en: "dependency graph & ordering",
        np: "dependency graph र ordering",
        jp: "依存グラフと順序付け",
      },
    },
  ],
};
