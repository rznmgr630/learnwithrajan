import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Terraform variables make configurations reusable without editing code. Three types power the system: **input variables** (`variable` block — accepted from .tfvars files, environment variables prefixed `TF_VAR_`, CLI `-var` flags, or interactive prompts), **local values** (`locals` block — computed expressions derived from variables or resource attributes, not exposed externally), and **output values** (`output` block — expose resource attributes to the terminal after apply, or to parent modules via `module.NAME.OUTPUT` references). Input variable attributes you must know: `type` enforces the shape at plan time (string, number, bool, list, map, set, object, tuple — Terraform will error before touching infrastructure if a value doesn't match), `default` makes the variable optional (omit it to require the caller to supply a value), `description` appears in `terraform plan` output and auto-generated docs, `validation` block defines custom rules with `condition` (a boolean expression) and `error_message` (shown when the condition is false), and `sensitive = true` suppresses the value from appearing in plan output and logs. Variable precedence from lowest to highest: `default` value in the variable block → `terraform.tfvars` → `*.auto.tfvars` (loaded alphabetically) → `-var-file` flag on the command line → `-var` flag on the command line → `TF_VAR_NAME` environment variables. The last source wins. Sensitive variables are redacted in `terraform plan` output — shown as `(sensitive value)` — and in the terminal after apply. However, they are still written to the state file, so your remote backend must be encrypted and access-controlled. Never assume `sensitive = true` makes a secret truly inaccessible — it only suppresses display, not storage.",
    np: "Terraform variable ले code edit नगरी configuration reusable बनाउँछन्। तीन type ले system चलाउँछन्: **input variable** (`variable` block — .tfvars file, `TF_VAR_` prefix भएको environment variable, CLI `-var` flag, वा interactive prompt बाट accept हुन्छ), **local value** (`locals` block — variable वा resource attribute बाट derive भएको computed expression, externally expose हुँदैन), र **output value** (`output` block — apply पछि terminal मा resource attribute expose गर्छ, वा `module.NAME.OUTPUT` reference मार्फत parent module मा)। जान्नुपर्ने input variable attribute: `type` ले plan time मा shape enforce गर्छ (string, number, bool, list, map, set, object, tuple — value match नभए Terraform ले infrastructure छुनु अघि error दिन्छ), `default` ले variable optional बनाउँछ (caller लाई value supply गर्न बाध्य पार्न omit गर्नुहोस्), `description` ले `terraform plan` output र auto-generated doc मा देखिन्छ, `validation` block ले `condition` (boolean expression) र `error_message` (condition false भएमा देखिन्छ) सहित custom rule define गर्छ, र `sensitive = true` ले plan output र log मा value देखिनबाट suppress गर्छ। Variable precedence सबैभन्दा कम देखि सबैभन्दा बढी: variable block मा `default` value → `terraform.tfvars` → `*.auto.tfvars` (alphabetically load) → command line मा `-var-file` flag → command line मा `-var` flag → `TF_VAR_NAME` environment variable। अन्तिम source जित्छ। Sensitive variable ले `terraform plan` output मा — `(sensitive value)` को रूपमा — र apply पछि terminal मा redact हुन्छ। तर, ती अझसम्म state file मा लेखिन्छन्, त्यसैले remote backend encrypted र access-controlled हुनुपर्छ। `sensitive = true` ले secret साँच्चै inaccessible बनाउँछ भन्ने कहिल्यै assume नगर्नुहोस् — यसले display मात्र suppress गर्छ, storage गर्दैन।",
    jp: "Terraform の変数はコードを編集せずに設定を再利用可能にします。3 つのタイプがシステムを動かします：**入力変数**（`variable` ブロック — .tfvars ファイル・`TF_VAR_` プレフィックス付き環境変数・CLI の `-var` フラグ・対話的プロンプトから受け付ける）・**ローカル値**（`locals` ブロック — 変数やリソース属性から導出した計算済み式で、外部に公開されない）・**出力値**（`output` ブロック — apply 後にリソース属性をターミナルに公開したり、`module.NAME.OUTPUT` 参照で親モジュールに公開したりする）。知っておくべき入力変数の属性：`type` はプラン時に形状を強制する（string・number・bool・list・map・set・object・tuple — 値が一致しない場合 Terraform はインフラに触れる前にエラーを出す）、`default` は変数をオプションにする（呼び出し元に値の提供を強制するには省略する）、`description` は `terraform plan` 出力と自動生成ドキュメントに表示される、`validation` ブロックは `condition`（ブール式）と `error_message`（条件が偽のときに表示）でカスタムルールを定義する、`sensitive = true` はプラン出力とログに値が表示されるのを抑制する。変数の優先順位（低い順から高い順）：変数ブロックの `default` 値 → `terraform.tfvars` → `*.auto.tfvars`（アルファベット順に読み込み）→ コマンドラインの `-var-file` フラグ → コマンドラインの `-var` フラグ → `TF_VAR_NAME` 環境変数。最後のソースが優先されます。機密変数は `terraform plan` 出力（`(sensitive value)` として表示）と apply 後のターミナルで編集されます。ただし、状態ファイルには引き続き書き込まれるため、リモートバックエンドは暗号化されアクセス制御されている必要があります。`sensitive = true` がシークレットを真に不可アクセスにするとは決して思い込まないでください — 表示を抑制するだけで、保存は抑制しません。",
  } as const,
  o2: {
    en: "**Data sources** (`data` block) query existing infrastructure without managing it — they are read-only lookups resolved during `terraform plan`. Common use cases: find the latest Ubuntu AMI (`data \"aws_ami\" \"ubuntu\"` with `most_recent = true` and `filter` blocks), look up an existing VPC by tags (`data \"aws_vpc\" \"main\"` with a `filter` block matching tag key/value), read an SSM Parameter Store secret (`data \"aws_ssm_parameter\" \"db_password\"`), or get the list of available Availability Zones in the current region (`data \"aws_availability_zones\" \"available\"` with `state = \"available\"`). Reference data source results with `data.TYPE.NAME.ATTRIBUTE` — for example, `data.aws_ami.ubuntu.id` gives you the AMI ID to pass to an `aws_instance`. Data sources depend on providers being initialized but unlike managed resources they make zero API write calls — they only read. If the lookup fails (e.g., no AMI matches your filters), Terraform errors at plan time before any changes are applied, which is exactly what you want. **Output values** serve two distinct purposes: (1) print useful information after apply to the terminal — instance IP address, RDS endpoint, S3 bucket name, ALB DNS name; (2) expose values to parent modules via `module.NAME.OUTPUT` — a child VPC module exposes `vpc_id` and `subnet_ids` as outputs, and the root module passes them into an EC2 module. Mark outputs `sensitive = true` to suppress display but still allow referencing. `terraform output` reads output values from the current state without re-running apply — extremely useful after a deployment completes. `terraform output -json` produces machine-readable JSON, which CI/CD scripts use to extract endpoint URLs and inject them into downstream configuration (Kubernetes secrets, Ansible inventory, deployment scripts). `terraform output OUTPUTNAME` prints only a single value — useful in shell scripts: `DB_ENDPOINT=$(terraform output -raw db_endpoint)`.",
    np: "**Data source** (`data` block) ले existing infrastructure manage नगरी query गर्छ — `terraform plan` को क्रममा resolve हुने read-only lookup हुन्। Common use case: latest Ubuntu AMI find गर्नु (`most_recent = true` र `filter` block सहित `data \"aws_ami\" \"ubuntu\"`), tag द्वारा existing VPC look up गर्नु (tag key/value match गर्ने `filter` block सहित `data \"aws_vpc\" \"main\"`), SSM Parameter Store secret पढ्नु (`data \"aws_ssm_parameter\" \"db_password\"`), वा current region मा available Availability Zone को list पाउनु (`state = \"available\"` सहित `data \"aws_availability_zones\" \"available\"`)। Data source result लाई `data.TYPE.NAME.ATTRIBUTE` सँग reference गर्नुहोस् — उदाहरणको लागि, `data.aws_ami.ubuntu.id` ले `aws_instance` मा pass गर्न AMI ID दिन्छ। Data source ले provider initialized भएको depend गर्छ तर managed resource जस्तो भिन्न, यिनीहरूले zero API write call गर्छन् — पढ्छन् मात्र। Lookup fail भएमा (जस्तै, कुनै AMI ले filter match नगरेमा), Terraform ले plan time मा error दिन्छ कुनै change apply हुनु अघि, जो exactly तपाईंले चाहेको हो। **Output value** ले दुईवटा distinct purpose पूरा गर्छ: (१) apply पछि terminal मा useful information print गर्नु — instance IP address, RDS endpoint, S3 bucket name, ALB DNS name; (२) `module.NAME.OUTPUT` मार्फत parent module मा value expose गर्नु — child VPC module ले `vpc_id` र `subnet_ids` लाई output को रूपमा expose गर्छ, र root module ले तिनीहरूलाई EC2 module मा pass गर्छ। Display suppress गर्न तर referencing allow गर्न output लाई `sensitive = true` mark गर्नुहोस्। `terraform output` ले apply re-run नगरी current state बाट output value पढ्छ — deployment complete भएपछि extremely useful। `terraform output -json` ले machine-readable JSON produce गर्छ, जसलाई CI/CD script ले endpoint URL extract गर्न र downstream configuration (Kubernetes secret, Ansible inventory, deployment script) मा inject गर्न प्रयोग गर्छन्। `terraform output OUTPUTNAME` ले single value मात्र print गर्छ — shell script मा useful: `DB_ENDPOINT=$(terraform output -raw db_endpoint)`।",
    jp: "**データソース**（`data` ブロック）は既存のインフラを管理せずにクエリします — `terraform plan` の実行中に解決される読み取り専用のルックアップです。一般的なユースケース：最新の Ubuntu AMI を見つける（`most_recent = true` と `filter` ブロックを使った `data \"aws_ami\" \"ubuntu\"`）、タグで既存の VPC を検索する（タグキー/値をマッチする `filter` ブロックを使った `data \"aws_vpc\" \"main\"`）、SSM パラメータストアのシークレットを読む（`data \"aws_ssm_parameter\" \"db_password\"`）、または現在のリージョンで利用可能なアベイラビリティゾーンのリストを取得する（`state = \"available\"` を使った `data \"aws_availability_zones\" \"available\"`）。データソースの結果は `data.TYPE.NAME.ATTRIBUTE` で参照します — 例えば `data.aws_ami.ubuntu.id` は `aws_instance` に渡す AMI ID を提供します。データソースはプロバイダーの初期化に依存しますが、管理対象リソースとは異なり、API 書き込み呼び出しはゼロです — 読み取りのみです。ルックアップが失敗した場合（例：フィルターに一致する AMI がない）、Terraform は変更が適用される前のプラン時にエラーを出します — これがまさに望む動作です。**出力値**は 2 つの異なる目的を果たします：(1) apply 後に有用な情報をターミナルに出力する — インスタンス IP アドレス・RDS エンドポイント・S3 バケット名・ALB DNS 名；(2) `module.NAME.OUTPUT` 経由で親モジュールに値を公開する — 子 VPC モジュールが `vpc_id` と `subnet_ids` を出力として公開し、ルートモジュールが EC2 モジュールに渡す。表示を抑制しつつ参照を許可するには出力に `sensitive = true` をマークする。`terraform output` は apply を再実行せずに現在の状態から出力値を読み込みます — デプロイ完了後に非常に便利です。`terraform output -json` はマシンが読めるJSONを生成し、CI/CD スクリプトがエンドポイント URL を抽出してダウンストリーム設定（Kubernetes シークレット・Ansible インベントリ・デプロイスクリプト）に注入するために使用します。`terraform output OUTPUTNAME` は単一の値のみを出力します — シェルスクリプトで便利：`DB_ENDPOINT=$(terraform output -raw db_endpoint)`。",
  } as const,
};

export const DEVOPS_DAY_81_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Variable types, validation & sensitivity",
        np: "Variable type, validation र sensitivity",
        jp: "変数の型・バリデーション・機密性",
      },
      blocks: [
        { type: "diagram", id: "devops-terraform-variables" },
        {
          type: "table",
          caption: {
            en: "Terraform variable types — syntax, example value, use case",
            np: "Terraform variable type — syntax, example value, use case",
            jp: "Terraform 変数の型 — 構文・値の例・ユースケース",
          },
          headers: [
            { en: "Type", np: "Type", jp: "型" },
            { en: "Syntax", np: "Syntax", jp: "構文" },
            { en: "Example value", np: "Example value", jp: "値の例" },
            { en: "Use case", np: "Use case", jp: "ユースケース" },
          ],
          rows: [
            [
              { en: "string", np: "string", jp: "string" },
              { en: "`type = string`", np: "`type = string`", jp: "`type = string`" },
              { en: "`\"us-east-1\"`", np: "`\"us-east-1\"`", jp: "`\"us-east-1\"`" },
              { en: "Region names, AMI IDs, environment labels", np: "Region name, AMI ID, environment label", jp: "リージョン名・AMI ID・環境ラベル" },
            ],
            [
              { en: "number", np: "number", jp: "number" },
              { en: "`type = number`", np: "`type = number`", jp: "`type = number`" },
              { en: "`3`", np: "`3`", jp: "`3`" },
              { en: "Instance count, port numbers, retention days", np: "Instance count, port number, retention day", jp: "インスタンス数・ポート番号・保持日数" },
            ],
            [
              { en: "bool", np: "bool", jp: "bool" },
              { en: "`type = bool`", np: "`type = bool`", jp: "`type = bool`" },
              { en: "`true`", np: "`true`", jp: "`true`" },
              { en: "Feature flags, enable/disable optional resources", np: "Feature flag, optional resource enable/disable", jp: "機能フラグ・オプションリソースの有効化/無効化" },
            ],
            [
              { en: "list(string)", np: "list(string)", jp: "list(string)" },
              { en: "`type = list(string)`", np: "`type = list(string)`", jp: "`type = list(string)`" },
              { en: "`[\"10.0.1.0/24\", \"10.0.2.0/24\"]`", np: "`[\"10.0.1.0/24\", \"10.0.2.0/24\"]`", jp: "`[\"10.0.1.0/24\", \"10.0.2.0/24\"]`" },
              { en: "CIDR blocks, availability zone lists, allowed IPs", np: "CIDR block, availability zone list, allowed IP", jp: "CIDR ブロック・アベイラビリティゾーンリスト・許可 IP" },
            ],
            [
              { en: "map(string)", np: "map(string)", jp: "map(string)" },
              { en: "`type = map(string)`", np: "`type = map(string)`", jp: "`type = map(string)`" },
              { en: "`{ Name = \"web\", Env = \"prod\" }`", np: "`{ Name = \"web\", Env = \"prod\" }`", jp: "`{ Name = \"web\", Env = \"prod\" }`" },
              { en: "Tag maps, key-value config dictionaries", np: "Tag map, key-value config dictionary", jp: "タグマップ・キーと値の設定辞書" },
            ],
            [
              { en: "object({...})", np: "object({...})", jp: "object({...})" },
              { en: "`type = object({ name = string, port = number })`", np: "`type = object({ name = string, port = number })`", jp: "`type = object({ name = string, port = number })`" },
              { en: "`{ name = \"api\", port = 8080 }`", np: "`{ name = \"api\", port = 8080 }`", jp: "`{ name = \"api\", port = 8080 }`" },
              { en: "Structured service configs, mixed-type records", np: "Structured service config, mixed-type record", jp: "構造化されたサービス設定・混合型レコード" },
            ],
            [
              { en: "set(string)", np: "set(string)", jp: "set(string)" },
              { en: "`type = set(string)`", np: "`type = set(string)`", jp: "`type = set(string)`" },
              { en: "`[\"admin\", \"developer\"]`", np: "`[\"admin\", \"developer\"]`", jp: "`[\"admin\", \"developer\"]`" },
              { en: "Unique collections used with `for_each` (no duplicates)", np: "Unique collection `for_each` सँग प्रयोग (कुनै duplicate छैन)", jp: "重複なしの `for_each` で使うユニークコレクション" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Data sources, locals & outputs in practice",
        np: "Data source, local र output को व्यवहारमा प्रयोग",
        jp: "データソース・ローカル・出力の実践",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "variables.tf with type constraints + validation + sensitive, locals, data sources, outputs, tfvars, env vars",
            np: "type constraint + validation + sensitive सहित variables.tf, local, data source, output, tfvars, env var",
            jp: "型制約 + バリデーション + 機密を持つ variables.tf、ローカル、データソース、出力、tfvars、環境変数",
          },
          code: `# ── variables.tf ─────────────────────────────────────────────────────
variable "region" {
  type        = string
  description = "AWS region to deploy resources into"
  default     = "us-east-1"

  validation {
    condition     = contains(["us-east-1", "us-west-2", "eu-west-1"], var.region)
    error_message = "Region must be us-east-1, us-west-2, or eu-west-1."
  }
}

variable "environment" {
  type        = string
  description = "Deployment environment label (dev, staging, prod)"

  validation {
    condition     = can(regex("^(dev|staging|prod)$", var.environment))
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_count" {
  type        = number
  description = "Number of EC2 instances to create"
  default     = 1
}

variable "db_password" {
  type        = string
  description = "Master password for the RDS instance"
  sensitive   = true   # suppressed in plan output and logs
}

variable "allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks permitted to reach the app on port 443"
  default     = ["0.0.0.0/0"]
}

variable "tags" {
  type        = map(string)
  description = "Tags applied to all resources"
  default     = {}
}

# ── locals.tf ─────────────────────────────────────────────────────────
locals {
  # Computed from variables — not exposed as input or output
  common_tags = merge(var.tags, {
    Environment = var.environment
    ManagedBy   = "terraform"
  })

  # Ternary to vary instance type per environment
  instance_type = var.environment == "prod" ? "t3.large" : "t3.micro"

  # Name prefix used in multiple resources
  name_prefix = "myapp-\${var.environment}"
}

# ── main.tf (data sources + resources) ───────────────────────────────
# Data source: look up latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Data source: find existing VPC by tag
data "aws_vpc" "main" {
  filter {
    name   = "tag:Name"
    values = ["\${local.name_prefix}-vpc"]
  }
}

# Data source: list available AZs in the selected region
data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_instance" "app" {
  count         = var.instance_count
  ami           = data.aws_ami.amazon_linux.id        # resolved from data source
  instance_type = local.instance_type                 # resolved from locals
  subnet_id     = data.aws_vpc.main.id                # resolved from data source
  availability_zone = data.aws_availability_zones.available.names[count.index % length(data.aws_availability_zones.available.names)]

  tags = merge(local.common_tags, {
    Name = "\${local.name_prefix}-app-\${count.index}"
  })
}

# ── outputs.tf ────────────────────────────────────────────────────────
output "instance_ids" {
  description = "EC2 instance IDs created by this configuration"
  value       = aws_instance.app[*].id
}

output "instance_public_ips" {
  description = "Public IP addresses of the app instances"
  value       = aws_instance.app[*].public_ip
}

output "ami_id_used" {
  description = "The AMI ID resolved by the data source at plan time"
  value       = data.aws_ami.amazon_linux.id
}

output "db_connection_string" {
  description = "Database connection string — suppressed in terminal output"
  value       = "postgres://admin:\${var.db_password}@db.example.com/app"
  sensitive   = true   # still stored in state, but hidden in terminal
}

# ── terraform.tfvars ─────────────────────────────────────────────────
# region         = "us-west-2"
# environment    = "staging"
# instance_count = 2
# allowed_cidrs  = ["10.0.0.0/8"]
# tags           = { Project = "myapp", Team = "platform" }
# db_password is NOT set here — use env var instead (safer)

# ── Supplying sensitive variables via environment variable ────────────
# export TF_VAR_db_password="SuperSecret123!"
# terraform plan   # db_password is now set — never appears in shell history

# ── Reading outputs after apply ───────────────────────────────────────
# terraform output                   # print all non-sensitive outputs
# terraform output instance_ids      # print single output
# terraform output -raw ami_id_used  # raw value (no quotes) for shell scripts
# terraform output -json             # machine-readable JSON for CI/CD pipelines
# DB_PASS=$(terraform output -raw db_password)  # works even for sensitive outputs`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a `variables.tf` file with at least five variables covering all major types: one `string` with an `allowed_values` validation, one `number` with a validation that rejects values outside a valid range (e.g., port must be between 1 and 65535), one `bool` that gates an optional resource, one `list(string)` for CIDR blocks, and one `sensitive = true` variable for a database password. Write a `terraform.tfvars` file that sets all non-sensitive variables. Supply the sensitive variable using `export TF_VAR_db_password=\"test\"` in your terminal. Run `terraform plan` and observe how the sensitive variable is shown as `(sensitive value)` in the plan diff. Then intentionally set the variable to a value that fails your validation rule (e.g., an invalid region string) — run `terraform plan` again and observe the validation error message you wrote.",
              np: "कम्तीमा पाँचवटा variable सहित `variables.tf` file create गर्नुहोस् जसले सबै major type cover गरोस्: एउटा `allowed_values` validation सहित `string`, एउटा valid range बाहिरको value reject गर्ने validation (जस्तै, port 1 र 65535 बीचमा हुनुपर्छ) सहित `number`, एउटा optional resource gate गर्ने `bool`, CIDR block को लागि एउटा `list(string)`, र database password को लागि एउटा `sensitive = true` variable। सबै non-sensitive variable set गर्ने `terraform.tfvars` file लेख्नुहोस्। Terminal मा `export TF_VAR_db_password=\"test\"` प्रयोग गरेर sensitive variable supply गर्नुहोस्। `terraform plan` run गर्नुहोस् र plan diff मा sensitive variable कसरी `(sensitive value)` को रूपमा देखिन्छ observe गर्नुहोस्। त्यसपछि intentionally variable लाई validation rule fail गर्ने value (जस्तै, invalid region string) मा set गर्नुहोस् — `terraform plan` फेरि run गर्नुहोस् र आफूले लेखेको validation error message observe गर्नुहोस्।",
              jp: "`variables.tf` ファイルをすべての主要な型をカバーする少なくとも 5 つの変数で作成する：`allowed_values` バリデーション付きの `string` 1 つ、有効範囲外の値を拒否するバリデーション（例：ポートは 1 から 65535 の間）付きの `number` 1 つ、オプションのリソースをゲートする `bool` 1 つ、CIDR ブロック用の `list(string)` 1 つ、データベースパスワード用の `sensitive = true` 変数 1 つ。機密でない変数をすべて設定する `terraform.tfvars` ファイルを書く。ターミナルで `export TF_VAR_db_password=\"test\"` を使って機密変数を供給する。`terraform plan` を実行し、プランの差分で機密変数が `(sensitive value)` として表示されることを観察する。次にバリデーションルールが失敗する値（例：無効なリージョン文字列）に意図的に変数を設定する — `terraform plan` を再度実行し、自分が書いたバリデーションエラーメッセージを観察する。",
            },
            {
              en: "Write a `locals.tf` that computes at least three local values: (1) a `common_tags` map that merges a `var.tags` input with hardcoded `ManagedBy` and `Environment` keys derived from `var.environment`, (2) a `name_prefix` string that concatenates a project name with the environment variable, and (3) a ternary expression that sets `instance_type` to `t3.large` when `var.environment == \"prod\"` and `t3.micro` otherwise. Use all three locals in a resource block. Then add a `data \"aws_availability_zones\" \"available\"` block and a `data \"aws_ami\"` block with two `filter` blocks. Reference the data source results in a resource. Run `terraform plan` and in the output find the line where Terraform resolves the data source — confirm the AMI ID is populated from the data source, not hardcoded.",
              np: "कम्तीमा तीनवटा local value compute गर्ने `locals.tf` लेख्नुहोस्: (१) `var.environment` बाट derive भएको hardcoded `ManagedBy` र `Environment` key सहित `var.tags` input merge गर्ने `common_tags` map, (२) project name लाई environment variable सँग concatenate गर्ने `name_prefix` string, र (३) `var.environment == \"prod\"` हुँदा `instance_type` लाई `t3.large` र otherwise `t3.micro` set गर्ने ternary expression। Resource block मा तीनैवटा local प्रयोग गर्नुहोस्। त्यसपछि दुईवटा `filter` block सहित `data \"aws_availability_zones\" \"available\"` block र `data \"aws_ami\"` block add गर्नुहोस्। Resource मा data source result reference गर्नुहोस्। `terraform plan` run गर्नुहोस् र output मा Terraform ले data source resolve गर्ने line find गर्नुहोस् — AMI ID hardcoded नभई data source बाट populate भएको confirm गर्नुहोस्।",
              jp: "少なくとも 3 つのローカル値を計算する `locals.tf` を書く：(1) `var.environment` から導出したハードコードされた `ManagedBy` と `Environment` キーで `var.tags` 入力をマージする `common_tags` マップ、(2) プロジェクト名と環境変数を連結する `name_prefix` 文字列、(3) `var.environment == \"prod\"` のとき `instance_type` を `t3.large` に、それ以外は `t3.micro` に設定する三項式。リソースブロックで 3 つのローカルをすべて使用する。次に 2 つの `filter` ブロックを持つ `data \"aws_availability_zones\" \"available\"` ブロックと `data \"aws_ami\"` ブロックを追加する。リソースでデータソースの結果を参照する。`terraform plan` を実行し、出力で Terraform がデータソースを解決する行を見つける — AMI ID がハードコードされておらずデータソースから取得されていることを確認する。",
            },
            {
              en: "Create an `outputs.tf` file with four outputs: one plain string output (e.g., the instance ID), one list output (public IPs of all instances using a splat expression `[*].public_ip`), one sensitive output (a connection string containing the database password variable), and one output that reads from a data source (the AMI name resolved by `data.aws_ami`). After running `terraform apply`, run `terraform output` — confirm the sensitive output shows `(sensitive value)`. Run `terraform output -json` and examine the JSON structure, noting the `\"sensitive\": true` field. Then run `terraform output -raw OUTPUTNAME` for each non-sensitive output and confirm the value prints with no surrounding quotes. Finally, write a small shell script that calls `terraform output -raw` to capture the instance ID into a variable and prints a formatted message using it.",
              np: "चारवटा output सहित `outputs.tf` file create गर्नुहोस्: एउटा plain string output (जस्तै, instance ID), splat expression `[*].public_ip` प्रयोग गर्ने सबै instance को public IP को एउटा list output, database password variable containing connection string को एउटा sensitive output, र data source बाट read गर्ने एउटा output (`data.aws_ami` ले resolve गरेको AMI name)। `terraform apply` run गरेपछि, `terraform output` run गर्नुहोस् — sensitive output ले `(sensitive value)` देखाउँछ confirm गर्नुहोस्। `terraform output -json` run गर्नुहोस् र JSON structure examine गर्नुहोस्, `\"sensitive\": true` field note गर्नुहोस्। त्यसपछि प्रत्येक non-sensitive output को लागि `terraform output -raw OUTPUTNAME` run गर्नुहोस् र value surrounding quote बिना print हुन्छ confirm गर्नुहोस्। अन्तमा, `terraform output -raw` call गरेर instance ID variable मा capture गर्ने र formatted message print गर्ने small shell script लेख्नुहोस्।",
              jp: "4 つの出力を持つ `outputs.tf` ファイルを作成する：1 つのプレーン文字列出力（例：インスタンス ID）、スプラット式 `[*].public_ip` を使ったすべてのインスタンスのパブリック IP のリスト出力、データベースパスワード変数を含む接続文字列の機密出力、データソースから読み取る出力（`data.aws_ami` が解決した AMI 名）。`terraform apply` を実行した後、`terraform output` を実行する — 機密出力が `(sensitive value)` を表示することを確認する。`terraform output -json` を実行して JSON 構造を調べ、`\"sensitive\": true` フィールドに注目する。次に各非機密出力に対して `terraform output -raw OUTPUTNAME` を実行し、値が周囲の引用符なしで出力されることを確認する。最後に `terraform output -raw` を呼び出してインスタンス ID を変数に取り込み、それを使ったフォーマットされたメッセージを出力する小さなシェルスクリプトを書く。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How does Terraform handle sensitive variables — are they truly secret?",
        np: "Terraform ले sensitive variable कसरी handle गर्छ — ती साँच्चै secret हुन्?",
        jp: "Terraform は機密変数をどのように扱うか — 本当に秘密なのか？",
      },
      answer: {
        en: "The honest answer is: `sensitive = true` is a **display guard**, not a secrets manager. Here is exactly what it does and what it does not do. What it does: (1) Suppresses the value in `terraform plan` output — instead of showing the actual value in the diff, Terraform prints `(sensitive value)`. (2) Suppresses the value when you run `terraform apply` — the terminal shows `(known after apply)` or `(sensitive value)`, not the actual secret. (3) Propagates sensitivity — if you reference a sensitive variable in a `local` or `output`, Terraform automatically marks those derived values as sensitive too. (4) Requires `sensitive = true` on any `output` that references the sensitive variable — Terraform will refuse to plan and print an error if you try to output a sensitive value without marking the output sensitive. What it does NOT do: (1) It does NOT encrypt the value in the state file. The state file is plain JSON. `terraform.tfstate` contains `\"db_password\": \"MyActualPassword\"` in plaintext. Anyone with read access to your state file can read every sensitive variable value. (2) It does NOT prevent the value from being stored in state. Sensitive variables are persisted in state just like any other attribute. (3) It does NOT prevent the value from appearing in provider debug logs if you set `TF_LOG=DEBUG` — debug logs can leak sensitive values. The correct approach to managing secrets in Terraform: use **Vault Provider** (`hashicorp/vault`) to dynamically generate short-lived credentials, use **AWS SSM Parameter Store** or **Secrets Manager** data sources to pull secrets at plan time (the secret value lives in AWS, not in your `.tfvars`), use **Terraform Cloud/Enterprise** which has a native secrets engine with encrypted variable storage, or at minimum ensure your S3 backend has server-side encryption enabled (`encrypt = true`) and the S3 bucket policy blocks all public access. `sensitive = true` is valuable for preventing accidental log leaks in CI/CD pipelines and keeping terminal output clean — but it must be combined with encrypted backends and proper secrets management to be a real security control.",
        np: "Honest जवाफ यो हो: `sensitive = true` एउटा **display guard** हो, secrets manager होइन। यसले exactly के गर्छ र के गर्दैन भन्ने यहाँ छ। यसले के गर्छ: (१) `terraform plan` output मा value suppress गर्छ — diff मा actual value देखाउनुको सट्टा, Terraform ले `(sensitive value)` print गर्छ। (२) `terraform apply` run गर्दा value suppress गर्छ — terminal ले actual secret होइन `(known after apply)` वा `(sensitive value)` देखाउँछ। (३) Sensitivity propagate गर्छ — `local` वा `output` मा sensitive variable reference गरेमा, Terraform ले automatically ती derived value लाई पनि sensitive mark गर्छ। (४) Sensitive variable reference गर्ने कुनै पनि `output` मा `sensitive = true` चाहिन्छ — output sensitive mark नगरी sensitive value output गर्ने try गरेमा Terraform ले plan refuse गर्छ र error print गर्छ। यसले के गर्दैन: (१) State file मा value encrypt गर्दैन। State file plain JSON हो। `terraform.tfstate` मा `\"db_password\": \"MyActualPassword\"` plaintext मा छ। State file मा read access भएको कोहीले पनि हरेक sensitive variable value पढ्न सक्छ। (२) State मा value store हुनबाट रोक्दैन। Sensitive variable अन्य attribute जस्तै state मा persist हुन्छ। (३) `TF_LOG=DEBUG` set गरेमा provider debug log मा value देखिनबाट रोक्दैन — debug log ले sensitive value leak गर्न सक्छ। Terraform मा secret manage गर्ने correct approach: dynamically short-lived credential generate गर्न **Vault Provider** (`hashicorp/vault`) प्रयोग गर्नुहोस्, plan time मा secret pull गर्न **AWS SSM Parameter Store** वा **Secrets Manager** data source प्रयोग गर्नुहोस् (secret value `.tfvars` मा होइन AWS मा बस्छ), encrypted variable storage सहित native secrets engine भएको **Terraform Cloud/Enterprise** प्रयोग गर्नुहोस्, वा कम्तीमा S3 backend मा server-side encryption (`encrypt = true`) enabled छ र S3 bucket policy ले सबै public access block गर्छ ensure गर्नुहोस्। `sensitive = true` CI/CD pipeline मा accidental log leak रोक्न र terminal output clean राख्न valuable छ — तर real security control हुन encrypted backend र proper secrets management सँग combine हुनुपर्छ।",
        jp: "正直な答えは：`sensitive = true` は**表示ガード**であり、シークレットマネージャーではありません。実際に何をするか、何をしないかを正確に説明します。するもの：(1) `terraform plan` 出力で値を抑制する — diff に実際の値を表示する代わりに、Terraform は `(sensitive value)` を出力する。(2) `terraform apply` 実行時に値を抑制する — ターミナルには実際のシークレットでなく `(known after apply)` や `(sensitive value)` が表示される。(3) 機密性を伝播させる — `local` や `output` で機密変数を参照すると、Terraform は自動的にそれらの派生値も機密とマークする。(4) 機密変数を参照する `output` には `sensitive = true` が必要 — 出力に機密マークなしで機密値を出力しようとすると Terraform はプランを拒否してエラーを出力する。しないもの：(1) 状態ファイルの値を暗号化しない。状態ファイルはプレーン JSON です。`terraform.tfstate` には `\"db_password\": \"MyActualPassword\"` がプレーンテキストで含まれます。状態ファイルへの読み取りアクセス権を持つ人は誰でも機密変数の値をすべて読み取れます。(2) 状態に値が保存されるのを防がない。機密変数は他の属性と同様に状態に保存されます。(3) `TF_LOG=DEBUG` を設定するとプロバイダーのデバッグログに値が表示されるのを防がない — デバッグログは機密値を漏洩する可能性があります。Terraform でシークレットを管理する正しいアプローチ：短命な認証情報を動的に生成するために **Vault プロバイダー**（`hashicorp/vault`）を使用する、プラン時にシークレットをプルするために **AWS SSM パラメータストア**や**Secrets Manager** データソースを使用する（シークレット値は `.tfvars` でなく AWS に存在する）、暗号化された変数ストレージを持つネイティブシークレットエンジンを持つ **Terraform Cloud/Enterprise** を使用する、または最低限 S3 バックエンドでサーバーサイド暗号化（`encrypt = true`）が有効であり S3 バケットポリシーがすべてのパブリックアクセスをブロックすることを確認する。`sensitive = true` は CI/CD パイプラインでの偶発的なログ漏洩を防ぎターミナル出力をクリーンに保つのに価値がありますが、実際のセキュリティ制御になるには暗号化されたバックエンドと適切なシークレット管理と組み合わせる必要があります。",
      },
      tag: {
        en: "sensitive variables & secrets",
        np: "sensitive variable र secret",
        jp: "機密変数とシークレット",
      },
    },
    {
      question: {
        en: "What is the difference between `count`, `for_each`, and `dynamic` blocks for creating multiple resources?",
        np: "Multiple resource create गर्न `count`, `for_each`, र `dynamic` block बीचको फरक के हो?",
        jp: "複数のリソースを作成するための `count`・`for_each`・`dynamic` ブロックの違いは何か？",
      },
      answer: {
        en: "`count`, `for_each`, and `dynamic` are three different mechanisms for avoiding repetition in Terraform, and choosing the wrong one causes significant refactoring pain. **`count`** is the simplest: add `count = N` to a resource and Terraform creates N copies. Resources are addressed as `aws_instance.app[0]`, `aws_instance.app[1]`, etc. The critical limitation is that `count` uses a numeric index. If you have three instances `[0, 1, 2]` and delete the middle one, Terraform destroys `[1]` and recreates `[2]` as the new `[1]` — this is called index shift and it causes needless infrastructure churn. Use `count` only when: the resources are truly interchangeable (order doesn't matter), or you're simply toggling a resource on/off with `count = var.enable_feature ? 1 : 0`. **`for_each`** is the preferred way to create multiple resources. It takes either a `set(string)` or a `map`. Resources are addressed by their key: `aws_instance.app[\"web\"]`, `aws_instance.app[\"api\"]`. The key is stable — if you remove `\"api\"` from the set, only that specific resource is destroyed. Nothing is recreated. This is the critical advantage over `count`. Example: `for_each = toset([\"web\", \"api\", \"worker\"])` creates three instances addressable by name. With a map: `for_each = { web = \"t3.small\", api = \"t3.medium\" }` and inside the resource body `instance_type = each.value`. `for_each` cannot accept a list directly (lists have non-unique indices) — always use `toset()` to convert, or pass a map with meaningful keys. **`dynamic`** blocks are entirely different — they don't create multiple top-level resources, they generate multiple **nested blocks inside a single resource**. Example: a security group resource needs multiple `ingress` blocks (one per allowed port). Without `dynamic`, you'd copy-paste the ingress block for each port. With `dynamic`: `dynamic \"ingress\" { for_each = var.allowed_ports; content { from_port = ingress.value; to_port = ingress.value; protocol = \"tcp\" } }`. The `dynamic` block iterates `var.allowed_ports` and emits one `ingress` nested block per value. Dynamic blocks work inside any resource or module block that supports repeated nested blocks. The rule of thumb: use `count` for simple on/off toggles, use `for_each` whenever you're creating multiple named or distinct resources, use `dynamic` when a single resource needs multiple repeated nested blocks.",
        np: "`count`, `for_each`, र `dynamic` Terraform मा repetition avoid गर्ने तीनवटा different mechanism हुन्, र गलत choose गर्दा significant refactoring pain हुन्छ। **`count`** सबैभन्दा simple हो: resource मा `count = N` add गर्नुहोस् र Terraform ले N copy create गर्छ। Resource लाई `aws_instance.app[0]`, `aws_instance.app[1]` इत्यादिको रूपमा address गरिन्छ। Critical limitation यो हो कि `count` ले numeric index प्रयोग गर्छ। तीनवटा instance `[0, 1, 2]` छन् र middle एउटा delete गरेमा, Terraform ले `[1]` destroy गर्छ र `[2]` लाई नयाँ `[1]` को रूपमा recreate गर्छ — यसलाई index shift भनिन्छ र यसले needless infrastructure churn गराउँछ। `count` प्रयोग गर्नुहोस् केवल: resource साँच्चै interchangeable छन् (order matter गर्दैन), वा `count = var.enable_feature ? 1 : 0` सँग resource on/off toggle गर्दै हुनुहुन्छ। **`for_each`** multiple resource create गर्ने preferred way हो। यसले `set(string)` वा `map` लिन्छ। Resource लाई तिनीहरूको key द्वारा address गरिन्छ: `aws_instance.app[\"web\"]`, `aws_instance.app[\"api\"]`। Key stable हुन्छ — set बाट `\"api\"` remove गरेमा, त्यो specific resource मात्र destroy हुन्छ। केही पनि recreate हुँदैन। `count` भन्दा यो critical advantage हो। उदाहरण: `for_each = toset([\"web\", \"api\", \"worker\"])` ले name द्वारा addressable तीनवटा instance create गर्छ। Map सँग: `for_each = { web = \"t3.small\", api = \"t3.medium\" }` र resource body भित्र `instance_type = each.value`। `for_each` ले directly list accept गर्न सक्दैन (list मा non-unique index हुन्छ) — convert गर्न सधैं `toset()` प्रयोग गर्नुहोस्, वा meaningful key सहित map pass गर्नुहोस्। **`dynamic`** block पूर्णतया different छ — यसले multiple top-level resource create गर्दैन, यसले **single resource भित्र multiple nested block** generate गर्छ। उदाहरण: security group resource लाई multiple `ingress` block (प्रत्येक allowed port को लागि एउटा) चाहिन्छ। `dynamic` बिना, प्रत्येक port को लागि ingress block copy-paste गर्नुहुन्थ्यो। `dynamic` सँग: `dynamic \"ingress\" { for_each = var.allowed_ports; content { from_port = ingress.value; to_port = ingress.value; protocol = \"tcp\" } }`। `dynamic` block ले `var.allowed_ports` iterate गर्छ र प्रत्येक value को लागि एउटा `ingress` nested block emit गर्छ। Dynamic block ले repeated nested block support गर्ने कुनै पनि resource वा module block भित्र काम गर्छ। Rule of thumb: simple on/off toggle को लागि `count` प्रयोग गर्नुहोस्, multiple named वा distinct resource create गर्दा सधैं `for_each` प्रयोग गर्नुहोस्, single resource लाई multiple repeated nested block चाहिँदा `dynamic` प्रयोग गर्नुहोस्।",
        jp: "`count`・`for_each`・`dynamic` は Terraform で繰り返しを避ける 3 つの異なるメカニズムであり、間違ったものを選ぶと大幅なリファクタリングの苦痛が生じます。**`count`** は最もシンプルです：リソースに `count = N` を追加すると Terraform は N コピーを作成します。リソースは `aws_instance.app[0]`・`aws_instance.app[1]` などとしてアドレス指定されます。重要な制限は `count` が数値インデックスを使用することです。3 つのインスタンス `[0, 1, 2]` があり中間の 1 つを削除すると、Terraform は `[1]` を破棄し `[2]` を新しい `[1]` として再作成します — これはインデックスシフトと呼ばれ、不必要なインフラの混乱を引き起こします。`count` は次の場合のみ使用する：リソースが真に交換可能である（順序が重要でない）、または `count = var.enable_feature ? 1 : 0` でリソースを単にオン/オフ切り替えしている。**`for_each`** は複数のリソースを作成する推奨方法です。`set(string)` またはマップを受け取ります。リソースはそのキーでアドレス指定されます：`aws_instance.app[\"web\"]`・`aws_instance.app[\"api\"]`。キーは安定しています — セットから `\"api\"` を削除すると、その特定のリソースのみが破棄されます。何も再作成されません。これが `count` に対する重要な利点です。例：`for_each = toset([\"web\", \"api\", \"worker\"])` は名前でアドレス指定できる 3 つのインスタンスを作成します。マップの場合：`for_each = { web = \"t3.small\", api = \"t3.medium\" }` でリソース本体内に `instance_type = each.value`。`for_each` は直接リストを受け取れません（リストは非ユニークなインデックスを持つ）— 変換するには常に `toset()` を使用するか、意味のあるキーを持つマップを渡す。**`dynamic`** ブロックは全く異なります — 複数のトップレベルリソースを作成せず、**単一リソース内に複数のネストされたブロック**を生成します。例：セキュリティグループリソースは複数の `ingress` ブロック（許可ポートごとに 1 つ）が必要です。`dynamic` なしでは各ポートに対して ingress ブロックをコピーペーストします。`dynamic` を使うと：`dynamic \"ingress\" { for_each = var.allowed_ports; content { from_port = ingress.value; to_port = ingress.value; protocol = \"tcp\" } }`。`dynamic` ブロックは `var.allowed_ports` を繰り返し、各値に対して 1 つの `ingress` ネストブロックを出力します。動的ブロックは繰り返しのネストされたブロックをサポートする任意のリソースまたはモジュールブロック内で機能します。経験則：単純なオン/オフ切り替えには `count`、複数の名前付きまたは異なるリソースを作成するときは常に `for_each`、単一リソースに複数の繰り返しネストブロックが必要なときは `dynamic` を使用する。",
      },
      tag: {
        en: "count vs for_each vs dynamic",
        np: "count vs for_each vs dynamic",
        jp: "count vs for_each vs dynamic",
      },
    },
  ],
};
