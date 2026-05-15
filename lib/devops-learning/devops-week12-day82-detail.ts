import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A Terraform **module** is a directory of `.tf` files treated as a single reusable unit. Every Terraform configuration is technically a module — the \"root module\" is the directory where you run `terraform apply`. **Child modules** are called from root via a `module` block: `module \"vpc\" { source = \"./modules/vpc\" ... }`. Modules accept input variables and expose outputs, creating a clean interface that hides implementation details. Why modules matter: without them, infrastructure configurations become copy-paste soup — the same VPC, security group, and EC2 patterns duplicated across every environment. With modules, you write the pattern once, test it, and reuse it everywhere. Module sources: local path (`./modules/vpc`), Terraform Registry (`registry.terraform.io/hashicorp/vpc/aws`), GitHub (`github.com/org/repo//modules/vpc`), or an S3 bucket. Module versioning: Registry and Git sources support `version` or `ref` constraints — always pin versions in production (`version = \"~> 3.0\"`) to avoid surprise upgrades when you run `terraform init -upgrade`. The `//` double slash in source paths separates the repo URL from the subdirectory path inside the repo — without it, Terraform would try to treat the entire repo as the module. Module aliases: `module \"vpc_primary\"` and `module \"vpc_secondary\"` can both call the same source with different input variables, creating two independent VPCs from a single module definition. Module initialization: after adding or changing a `module` block source, you must run `terraform init` — Terraform downloads the module to `.terraform/modules/` and generates a lock file entry. The `.terraform/modules/` directory is generated and should be excluded from version control via `.gitignore`.",
    np: "Terraform **module** एउटा single reusable unit को रूपमा treat गरिने `.tf` file को directory हो। हरेक Terraform configuration technically module हो — \"root module\" त्यो directory हो जहाँ `terraform apply` run गर्नुहुन्छ। **Child module** लाई root बाट `module` block मार्फत call गरिन्छ: `module \"vpc\" { source = \"./modules/vpc\" ... }`। Module ले input variable accept गर्छन् र output expose गर्छन्, implementation detail लुकाउने clean interface create गर्छन्। Module किन matter गर्छ: तिनीहरू बिना, infrastructure configuration copy-paste soup बन्छन् — प्रत्येक environment मा same VPC, security group, र EC2 pattern duplicate हुन्छन्। Module सँग, एकचोटि pattern लेख्नुहुन्छ, test गर्नुहुन्छ, र सबैतिर reuse गर्नुहुन्छ। Module source: local path (`./modules/vpc`), Terraform Registry (`registry.terraform.io/hashicorp/vpc/aws`), GitHub (`github.com/org/repo//modules/vpc`), वा S3 bucket। Module versioning: Registry र Git source ले `version` वा `ref` constraint support गर्छन् — `terraform init -upgrade` run गर्दा surprise upgrade avoid गर्न production मा version सधैं pin गर्नुहोस् (`version = \"~> 3.0\"`)। Source path मा `//` double slash ले repo URL लाई repo भित्रको subdirectory path बाट छुट्टाउँछ — यो बिना, Terraform ले entire repo लाई module को रूपमा treat गर्ने try गर्थ्यो। Module alias: `module \"vpc_primary\"` र `module \"vpc_secondary\"` ले दुवैले different input variable सहित same source call गर्न सक्छन्, single module definition बाट दुईवटा independent VPC create गर्दै। Module initialization: `module` block source add वा change गरेपछि, `terraform init` run गर्नुपर्छ — Terraform ले module `.terraform/modules/` मा download गर्छ र lock file entry generate गर्छ। `.terraform/modules/` directory generated हो र `.gitignore` मार्फत version control बाट exclude गर्नुपर्छ।",
    jp: "Terraform の**モジュール**は、単一の再利用可能なユニットとして扱われる `.tf` ファイルのディレクトリです。すべての Terraform 設定は技術的にはモジュールです — 「ルートモジュール」は `terraform apply` を実行するディレクトリです。**子モジュール**はルートから `module` ブロックを通じて呼び出されます：`module \"vpc\" { source = \"./modules/vpc\" ... }`。モジュールは入力変数を受け取り出力を公開し、実装の詳細を隠すクリーンなインターフェースを作成します。モジュールが重要な理由：それらなしでは、インフラ設定はコピーペーストの混乱になります — 同じ VPC・セキュリティグループ・EC2 パターンがすべての環境に重複します。モジュールを使うと、パターンを一度書いてテストし、どこでも再利用できます。モジュールソース：ローカルパス（`./modules/vpc`）・Terraform レジストリ（`registry.terraform.io/hashicorp/vpc/aws`）・GitHub（`github.com/org/repo//modules/vpc`）・S3 バケット。モジュールのバージョン管理：レジストリと Git ソースは `version` または `ref` 制約をサポートします — `terraform init -upgrade` 実行時の予期しないアップグレードを避けるため、本番環境では常にバージョンを固定する（`version = \"~> 3.0\"`）。ソースパスの `//` ダブルスラッシュはリポジトリ URL とリポジトリ内のサブディレクトリパスを分離します — これなしでは Terraform はリポジトリ全体をモジュールとして扱おうとします。モジュールエイリアス：`module \"vpc_primary\"` と `module \"vpc_secondary\"` は両方とも異なる入力変数で同じソースを呼び出し、単一のモジュール定義から 2 つの独立した VPC を作成できます。モジュールの初期化：`module` ブロックのソースを追加または変更した後、`terraform init` を実行する必要があります — Terraform はモジュールを `.terraform/modules/` にダウンロードしロックファイルのエントリを生成します。`.terraform/modules/` ディレクトリは生成されるもので `.gitignore` でバージョン管理から除外する必要があります。",
  } as const,
  o2: {
    en: "A well-structured module has three key files: `main.tf` (all resources), `variables.tf` (input variables the caller must or may supply), and `outputs.tf` (values the module exposes to the caller). The `versions.tf` file declares `terraform` and `required_providers` blocks — this makes the module self-contained and prevents provider version conflicts when the module is composed with other modules that have different provider requirements. The Terraform Registry hosts thousands of verified modules: `terraform-aws-modules/vpc/aws` is the canonical AWS VPC module used by the majority of AWS teams in production. Installing a Registry module: add `module \"vpc\" { source = \"terraform-aws-modules/vpc/aws\"; version = \"5.0.0\"; ... }` and run `terraform init` — Terraform downloads it to `.terraform/modules/` and the download hash is recorded in `.terraform.lock.hcl` for reproducible installs. **Module composition** means modules call other modules, building a hierarchy. A root module calls a VPC module and an EC2 module; the EC2 module receives the VPC ID from the VPC module output via `module.vpc.vpc_id`. This is how teams build entire environments from small, single-responsibility modules. **Passing data between modules**: root passes `vpc_id = module.vpc.vpc_id` into the EC2 module's input variable. The child module does not know or care where the VPC ID came from — it just uses the value. This loose coupling makes modules independently testable. Module testing: `terraform plan` validates your module's variable interface at call time. For automated testing, `terratest` (a Go library by Gruntwork) lets you write Go tests that call `terraform apply`, make real AWS API assertions, then call `terraform destroy`. Keep modules focused on one concern: a VPC module creates VPCs, subnets, and routing tables — never EC2 instances. Single-responsibility modules are easier to version, test independently, and swap out without ripple effects.",
    np: "Well-structured module मा तीनवटा key file हुन्छन्: `main.tf` (सबै resource), `variables.tf` (caller ले supply गर्नुपर्ने वा गर्न सक्ने input variable), र `outputs.tf` (module ले caller मा expose गर्ने value)। `versions.tf` file ले `terraform` र `required_providers` block declare गर्छ — यसले module लाई self-contained बनाउँछ र module लाई different provider requirement भएका अन्य module सँग compose गर्दा provider version conflict रोक्छ। Terraform Registry ले हजारौं verified module host गर्छ: `terraform-aws-modules/vpc/aws` production मा majority AWS team ले प्रयोग गर्ने canonical AWS VPC module हो। Registry module install गर्नु: `module \"vpc\" { source = \"terraform-aws-modules/vpc/aws\"; version = \"5.0.0\"; ... }` add गर्नुहोस् र `terraform init` run गर्नुहोस् — Terraform ले `.terraform/modules/` मा download गर्छ र reproducible install को लागि download hash `.terraform.lock.hcl` मा record हुन्छ। **Module composition** भनेको module ले अन्य module call गर्दछ, hierarchy build गर्दै। Root module ले VPC module र EC2 module call गर्छ; EC2 module ले `module.vpc.vpc_id` मार्फत VPC module output बाट VPC ID receive गर्छ। यसरी team ले साना, single-responsibility module बाट entire environment build गर्छन्। **Module बीच data pass गर्नु**: root ले EC2 module को input variable मा `vpc_id = module.vpc.vpc_id` pass गर्छ। Child module ले VPC ID कहाँबाट आयो जान्दैन वा care गर्दैन — value मात्र प्रयोग गर्छ। यो loose coupling ले module लाई independently testable बनाउँछ। Module testing: `terraform plan` ले call time मा module को variable interface validate गर्छ। Automated testing को लागि, `terratest` (Gruntwork द्वारा Go library) ले `terraform apply` call गर्ने, real AWS API assertion गर्ने, र `terraform destroy` call गर्ने Go test लेख्न दिन्छ। Module लाई एउटा concern मा focused राख्नुहोस्: VPC module ले VPC, subnet, र routing table create गर्छ — कहिल्यै EC2 instance होइन। Single-responsibility module version, independently test, र ripple effect बिना swap out गर्न सजिलो हुन्छ।",
    jp: "適切に構造化されたモジュールには 3 つの重要なファイルがあります：`main.tf`（すべてのリソース）・`variables.tf`（呼び出し元が提供しなければならないまたは提供できる入力変数）・`outputs.tf`（モジュールが呼び出し元に公開する値）。`versions.tf` ファイルは `terraform` と `required_providers` ブロックを宣言します — これによりモジュールが自己完結型になり、異なるプロバイダー要件を持つ他のモジュールと組み合わせる際のプロバイダーバージョンの競合を防ぎます。Terraform レジストリは何千もの検証済みモジュールをホストしています：`terraform-aws-modules/vpc/aws` は本番環境で大多数の AWS チームが使用する標準的な AWS VPC モジュールです。レジストリモジュールのインストール：`module \"vpc\" { source = \"terraform-aws-modules/vpc/aws\"; version = \"5.0.0\"; ... }` を追加して `terraform init` を実行します — Terraform はそれを `.terraform/modules/` にダウンロードし、再現可能なインストールのためにダウンロードハッシュが `.terraform.lock.hcl` に記録されます。**モジュールの構成**とはモジュールが他のモジュールを呼び出し、階層を構築することです。ルートモジュールは VPC モジュールと EC2 モジュールを呼び出し、EC2 モジュールは `module.vpc.vpc_id` を通じて VPC モジュールの出力から VPC ID を受け取ります。このようにしてチームは小さな単一責任モジュールから完全な環境を構築します。**モジュール間でデータを渡す**：ルートは EC2 モジュールの入力変数に `vpc_id = module.vpc.vpc_id` を渡します。子モジュールは VPC ID がどこから来たかを知らず気にしません — 単に値を使用します。この疎結合はモジュールを独立してテスト可能にします。モジュールのテスト：`terraform plan` は呼び出し時にモジュールの変数インターフェースを検証します。自動テストには `terratest`（Gruntwork の Go ライブラリ）を使って `terraform apply` を呼び出し、実際の AWS API アサーションを行い、`terraform destroy` を呼び出す Go テストを書けます。モジュールを 1 つの関心事に集中させてください：VPC モジュールは VPC・サブネット・ルーティングテーブルを作成します — EC2 インスタンスは決して作りません。単一責任モジュールはバージョン管理・独立したテスト・波及効果なしの交換が容易です。",
  } as const,
};

export const DEVOPS_DAY_82_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Module structure, sources & versioning",
        np: "Module structure, source र versioning",
        jp: "モジュールの構造・ソース・バージョン管理",
      },
      blocks: [
        { type: "diagram", id: "devops-terraform-modules" },
        {
          type: "table",
          caption: {
            en: "Module source types — format, use case, version pinning",
            np: "Module source type — format, use case, version pinning",
            jp: "モジュールソースの種類 — 形式・ユースケース・バージョン固定",
          },
          headers: [
            { en: "Source type", np: "Source type", jp: "ソースの種類" },
            { en: "Syntax example", np: "Syntax example", jp: "構文の例" },
            { en: "Version pinning", np: "Version pinning", jp: "バージョン固定" },
            { en: "Best for", np: "Best for", jp: "最適な用途" },
          ],
          rows: [
            [
              { en: "Local path", np: "Local path", jp: "ローカルパス" },
              { en: "`source = \"./modules/vpc\"`", np: "`source = \"./modules/vpc\"`", jp: "`source = \"./modules/vpc\"`" },
              { en: "Not supported — always uses local files", np: "Support छैन — सधैं local file प्रयोग गर्छ", jp: "非対応 — 常にローカルファイルを使用" },
              { en: "Modules internal to a single repo", np: "Single repo भित्रका module", jp: "単一リポジトリ内のモジュール" },
            ],
            [
              { en: "Terraform Registry", np: "Terraform Registry", jp: "Terraform レジストリ" },
              { en: "`source = \"terraform-aws-modules/vpc/aws\"`", np: "`source = \"terraform-aws-modules/vpc/aws\"`", jp: "`source = \"terraform-aws-modules/vpc/aws\"`" },
              { en: "`version = \"~> 5.0\"` (semver constraint)", np: "`version = \"~> 5.0\"` (semver constraint)", jp: "`version = \"~> 5.0\"`（セマバー制約）" },
              { en: "Public community modules — VPC, EKS, RDS", np: "Public community module — VPC, EKS, RDS", jp: "公開コミュニティモジュール — VPC・EKS・RDS" },
            ],
            [
              { en: "GitHub (public)", np: "GitHub (public)", jp: "GitHub（公開）" },
              { en: "`source = \"github.com/org/repo//modules/vpc\"`", np: "`source = \"github.com/org/repo//modules/vpc\"`", jp: "`source = \"github.com/org/repo//modules/vpc\"`" },
              { en: "`ref = \"v1.2.0\"` or branch name in URL query", np: "URL query मा `ref = \"v1.2.0\"` वा branch name", jp: "URL クエリに `ref = \"v1.2.0\"` またはブランチ名" },
              { en: "Internal shared modules, open-source forks", np: "Internal shared module, open-source fork", jp: "内部共有モジュール・オープンソースのフォーク" },
            ],
            [
              { en: "GitHub (private)", np: "GitHub (private)", jp: "GitHub（プライベート）" },
              { en: "`source = \"git::ssh://git@github.com/org/repo.git//modules/vpc\"`", np: "`source = \"git::ssh://git@github.com/org/repo.git//modules/vpc\"`", jp: "`source = \"git::ssh://git@github.com/org/repo.git//modules/vpc\"`" },
              { en: "`?ref=v2.0.0` appended to source URL", np: "source URL मा `?ref=v2.0.0` append गरिन्छ", jp: "ソース URL に `?ref=v2.0.0` を追加" },
              { en: "Private org modules requiring SSH key auth", np: "SSH key auth चाहिने private org module", jp: "SSH キー認証が必要なプライベート組織モジュール" },
            ],
            [
              { en: "S3 bucket", np: "S3 bucket", jp: "S3 バケット" },
              { en: "`source = \"s3::https://s3.amazonaws.com/bucket/modules/vpc.zip\"`", np: "`source = \"s3::https://s3.amazonaws.com/bucket/modules/vpc.zip\"`", jp: "`source = \"s3::https://s3.amazonaws.com/bucket/modules/vpc.zip\"`" },
              { en: "Pin by uploading a specific version zip to S3 path", np: "Specific version zip S3 path मा upload गरेर pin गर्नुहोस्", jp: "特定バージョンの zip を S3 パスにアップロードして固定" },
              { en: "Air-gapped environments with no internet access", np: "Internet access नभएको air-gapped environment", jp: "インターネットアクセスのないエアギャップ環境" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Creating, calling & composing modules",
        np: "Module create, call र compose गर्नु",
        jp: "モジュールの作成・呼び出し・構成",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Creating a VPC module, calling from root, composing modules, using terraform-aws-modules registry module",
            np: "VPC module create, root बाट call, module compose, terraform-aws-modules registry module प्रयोग",
            jp: "VPC モジュールの作成・ルートからの呼び出し・モジュール構成・terraform-aws-modules レジストリモジュールの使用",
          },
          code: `# ── Project structure ────────────────────────────────────────────────
# my-infra/
# ├── main.tf               <- root module: calls child modules
# ├── variables.tf
# ├── outputs.tf
# ├── terraform.tfvars
# └── modules/
#     ├── vpc/
#     │   ├── main.tf       <- VPC, subnets, IGW, route tables
#     │   ├── variables.tf  <- input: cidr_block, azs, environment
#     │   └── outputs.tf    <- output: vpc_id, public_subnet_ids
#     └── ec2/
#         ├── main.tf       <- aws_instance using received vpc_id
#         ├── variables.tf  <- input: vpc_id, subnet_id, instance_type
#         └── outputs.tf    <- output: instance_id, public_ip

# ── modules/vpc/variables.tf ─────────────────────────────────────────
variable "cidr_block" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "azs" {
  type        = list(string)
  description = "List of availability zones for subnets"
}

variable "environment" {
  type        = string
  description = "Environment label used in resource names and tags"
}

# ── modules/vpc/main.tf ──────────────────────────────────────────────
resource "aws_vpc" "this" {
  cidr_block           = var.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "\${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count             = length(var.azs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet(var.cidr_block, 8, count.index)
  availability_zone = var.azs[count.index]

  tags = {
    Name = "\${var.environment}-public-\${count.index + 1}"
  }
}

# ── modules/vpc/outputs.tf ───────────────────────────────────────────
output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.this.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public[*].id
}

# ── root main.tf: calling modules and composing outputs ──────────────
module "vpc" {
  source = "./modules/vpc"   # local path — always uses current files

  cidr_block  = "10.0.0.0/16"
  azs         = ["us-east-1a", "us-east-1b"]
  environment = var.environment
}

module "ec2" {
  source = "./modules/ec2"

  # Pass VPC module output into EC2 module input — module composition
  vpc_id      = module.vpc.vpc_id
  subnet_id   = module.vpc.public_subnet_ids[0]
  instance_type = var.environment == "prod" ? "t3.large" : "t3.micro"
}

# ── root outputs.tf: expose module outputs to terminal ───────────────
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "instance_public_ip" {
  value = module.ec2.public_ip
}

# ── Using terraform-aws-modules/vpc/aws from the public Registry ─────
module "vpc_registry" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"   # always pin to avoid surprise upgrades

  name = "my-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true   # cost optimization for non-prod

  tags = {
    Environment = "staging"
    ManagedBy   = "terraform"
  }
}

# Access outputs from the Registry module
# module.vpc_registry.vpc_id
# module.vpc_registry.private_subnets   # list of private subnet IDs
# module.vpc_registry.public_subnets    # list of public subnet IDs

# ── terraform init — downloading modules ─────────────────────────────
# terraform init
# Output:
# Initializing modules...
# Downloading registry.terraform.io/terraform-aws-modules/vpc/aws 5.0.0 for vpc_registry...
# - vpc_registry in .terraform/modules/vpc_registry
# Downloading hashicorp/aws ...
#
# .terraform/modules/ directory structure after init:
# .terraform/modules/
# ├── modules.json              <- maps module names to local paths
# ├── vpc_registry/             <- downloaded Registry module files
# │   ├── main.tf
# │   ├── variables.tf
# │   └── outputs.tf
# └── (local modules are referenced directly, not copied)

# ── Referencing nested module outputs in root ─────────────────────────
# module.vpc_registry.vpc_id
# module.vpc_registry.natgw_ids
# module.ec2.instance_id`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a complete local module from scratch. Make a directory `modules/s3-website/` containing three files: (1) `variables.tf` with inputs for `bucket_name` (string, required), `environment` (string with validation), and `enable_versioning` (bool, default true); (2) `main.tf` that creates an `aws_s3_bucket` resource, an `aws_s3_bucket_versioning` resource (enabled when `var.enable_versioning` is true), and an `aws_s3_bucket_website_configuration` resource; (3) `outputs.tf` that exposes `bucket_id`, `bucket_arn`, and `website_endpoint`. In your root `main.tf`, call the module twice — once for a `dev` website and once for a `prod` website — each with different `bucket_name` and `enable_versioning` values. Run `terraform plan` and confirm Terraform plans to create six resources (two sets of three). Examine the plan output and note how resource addresses include the module name prefix (e.g., `module.dev_website.aws_s3_bucket.this`).",
              np: "Scratch बाट complete local module create गर्नुहोस्। तीनवटा file containing `modules/s3-website/` directory बनाउनुहोस्: (१) `bucket_name` (string, required), `environment` (validation सहित string), र `enable_versioning` (bool, default true) को लागि input सहित `variables.tf`; (२) `aws_s3_bucket` resource, `aws_s3_bucket_versioning` resource (`var.enable_versioning` true हुँदा enabled), र `aws_s3_bucket_website_configuration` resource create गर्ने `main.tf`; (३) `bucket_id`, `bucket_arn`, र `website_endpoint` expose गर्ने `outputs.tf`। Root `main.tf` मा, module दुईचोटि call गर्नुहोस् — एकचोटि `dev` website को लागि र एकचोटि `prod` website को लागि — प्रत्येकमा different `bucket_name` र `enable_versioning` value। `terraform plan` run गर्नुहोस् र Terraform ले six resource create गर्ने plan (तीनवटाका दुई set) गरेको confirm गर्नुहोस्। Plan output examine गर्नुहोस् र resource address कसरी module name prefix include गर्छ (जस्तै, `module.dev_website.aws_s3_bucket.this`) note गर्नुहोस्।",
              jp: "スクラッチから完全なローカルモジュールを作成する。3 つのファイルを含む `modules/s3-website/` ディレクトリを作る：(1) `bucket_name`（string・必須）・`environment`（バリデーション付き string）・`enable_versioning`（bool・デフォルト true）の入力を持つ `variables.tf`；(2) `aws_s3_bucket` リソース・`aws_s3_bucket_versioning` リソース（`var.enable_versioning` が true のとき有効）・`aws_s3_bucket_website_configuration` リソースを作成する `main.tf`；(3) `bucket_id`・`bucket_arn`・`website_endpoint` を公開する `outputs.tf`。ルートの `main.tf` でモジュールを 2 回呼び出す — 1 回は `dev` ウェブサイト用、1 回は `prod` ウェブサイト用 — それぞれ異なる `bucket_name` と `enable_versioning` 値で。`terraform plan` を実行し、Terraform が 6 つのリソース（3 つのセットが 2 つ）を作成する計画を確認する。プラン出力を調べ、リソースアドレスにどのようにモジュール名プレフィックスが含まれるかに注目する（例：`module.dev_website.aws_s3_bucket.this`）。",
            },
            {
              en: "Use the public Terraform Registry module `terraform-aws-modules/vpc/aws` (version `5.0.0`) in a root configuration. Configure it with: one VPC CIDR block, two availability zones, two public subnets, two private subnets, `enable_nat_gateway = true`, and `single_nat_gateway = true`. Run `terraform init` and observe the module download output — note where it is stored in `.terraform/modules/`. Open `.terraform/modules/modules.json` and read its contents to understand how Terraform tracks module sources and local paths. Run `terraform plan` and count the total number of resources the module will create (VPC, subnets, internet gateway, NAT gateway, route tables, route table associations). Add two `output` blocks to your root `outputs.tf` that reference `module.vpc.vpc_id` and `module.vpc.private_subnets`. Run `terraform output` after a (mocked or live) apply to confirm the outputs are wired correctly.",
              np: "Root configuration मा public Terraform Registry module `terraform-aws-modules/vpc/aws` (version `5.0.0`) प्रयोग गर्नुहोस्। यसलाई configure गर्नुहोस्: एउटा VPC CIDR block, दुईवटा availability zone, दुईवटा public subnet, दुईवटा private subnet, `enable_nat_gateway = true`, र `single_nat_gateway = true`। `terraform init` run गर्नुहोस् र module download output observe गर्नुहोस् — `.terraform/modules/` मा कहाँ store हुन्छ note गर्नुहोस्। `.terraform/modules/modules.json` खोल्नुहोस् र Terraform ले module source र local path कसरी track गर्छ बुझ्न यसको content पढ्नुहोस्। `terraform plan` run गर्नुहोस् र module ले create गर्ने resource को total number count गर्नुहोस् (VPC, subnet, internet gateway, NAT gateway, route table, route table association)। Root `outputs.tf` मा दुईवटा `output` block add गर्नुहोस् जसले `module.vpc.vpc_id` र `module.vpc.private_subnets` reference गरोस्। Output correctly wired छ confirm गर्न (mocked वा live) apply पछि `terraform output` run गर्नुहोस्।",
              jp: "ルート設定で公開 Terraform レジストリモジュール `terraform-aws-modules/vpc/aws`（バージョン `5.0.0`）を使用する。以下で設定する：VPC CIDR ブロック 1 つ・アベイラビリティゾーン 2 つ・パブリックサブネット 2 つ・プライベートサブネット 2 つ・`enable_nat_gateway = true`・`single_nat_gateway = true`。`terraform init` を実行してモジュールのダウンロード出力を観察する — `.terraform/modules/` のどこに保存されるかに注目する。`.terraform/modules/modules.json` を開き、Terraform がモジュールソースとローカルパスを追跡する方法を理解するためにその内容を読む。`terraform plan` を実行し、モジュールが作成するリソースの総数を数える（VPC・サブネット・インターネットゲートウェイ・NAT ゲートウェイ・ルートテーブル・ルートテーブルアソシエーション）。`module.vpc.vpc_id` と `module.vpc.private_subnets` を参照するルートの `outputs.tf` に 2 つの `output` ブロックを追加する。（モックまたはライブの）apply 後に `terraform output` を実行して出力が正しく配線されていることを確認する。",
            },
            {
              en: "Practice module composition by wiring three modules together: VPC module → security-group module → EC2 module. For the security-group module (`modules/sg/`), create it to accept `vpc_id` as an input and output `sg_id`. For the EC2 module (`modules/ec2/`), accept `subnet_id` and `security_group_id` as inputs. In root `main.tf`, chain them: VPC module output goes into both the SG module and the EC2 module; SG module output goes into the EC2 module. Run `terraform graph | dot -Tpng > graph.png` (requires Graphviz) to visualize the dependency graph — confirm the three modules appear as distinct nodes with edges flowing from VPC → SG → EC2. Then refactor: rename the VPC module call in root from `module \"vpc\"` to `module \"main_vpc\"` — update all references (`module.main_vpc.vpc_id`, etc.) and run `terraform plan`. Confirm the plan shows zero changes — a pure rename of the module call should not trigger resource recreation if the module source and inputs are identical.",
              np: "तीनवटा module एकसाथ wire गरेर module composition practice गर्नुहोस्: VPC module → security-group module → EC2 module। Security-group module (`modules/sg/`) को लागि, यसलाई `vpc_id` input को रूपमा accept गर्ने र `sg_id` output गर्ने create गर्नुहोस्। EC2 module (`modules/ec2/`) को लागि, `subnet_id` र `security_group_id` input को रूपमा accept गर्नुहोस्। Root `main.tf` मा, तिनीहरूलाई chain गर्नुहोस्: VPC module output ले SG module र EC2 module दुवैमा जान्छ; SG module output ले EC2 module मा जान्छ। Dependency graph visualize गर्न `terraform graph | dot -Tpng > graph.png` run गर्नुहोस् (Graphviz चाहिन्छ) — तीनवटा module VPC → SG → EC2 बाट flow हुने edge सहित distinct node को रूपमा appear भएको confirm गर्नुहोस्। त्यसपछि refactor गर्नुहोस्: root मा VPC module call लाई `module \"vpc\"` बाट `module \"main_vpc\"` मा rename गर्नुहोस् — सबै reference (`module.main_vpc.vpc_id`, इत्यादि) update गर्नुहोस् र `terraform plan` run गर्नुहोस्। Plan ले zero change देखाउँछ confirm गर्नुहोस् — module call को pure rename ले module source र input identical छ भने resource recreation trigger गर्नुहुँदैन।",
              jp: "3 つのモジュールをつなぎ合わせてモジュール構成を練習する：VPC モジュール → セキュリティグループモジュール → EC2 モジュール。セキュリティグループモジュール（`modules/sg/`）は `vpc_id` を入力として受け取り `sg_id` を出力するように作成する。EC2 モジュール（`modules/ec2/`）は `subnet_id` と `security_group_id` を入力として受け取る。ルートの `main.tf` でそれらを連鎖させる：VPC モジュールの出力は SG モジュールと EC2 モジュールの両方に入る；SG モジュールの出力は EC2 モジュールに入る。`terraform graph | dot -Tpng > graph.png` を実行して依存グラフを視覚化する（Graphviz が必要）— 3 つのモジュールが VPC → SG → EC2 からのエッジを持つ別々のノードとして表示されることを確認する。次にリファクタリング：ルートの VPC モジュール呼び出しを `module \"vpc\"` から `module \"main_vpc\"` に名前変更する — すべての参照（`module.main_vpc.vpc_id` など）を更新して `terraform plan` を実行する。モジュールソースと入力が同一であればモジュール呼び出しの純粋な名前変更がリソースの再作成を引き起こすべきでないため、プランがゼロ変更を示すことを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should you create a module vs just writing the resource directly in root?",
        np: "Module create गर्ने vs root मा directly resource लेख्ने — कहिले कुन गर्ने?",
        jp: "モジュールを作成するべき時と、ルートに直接リソースを書くべき時の違いは？",
      },
      answer: {
        en: "The honest answer for beginners is: writing resources directly in root is fine and often the right choice early on. Premature modularization is a real anti-pattern that creates complexity without benefit. Here are the concrete signals that tell you it's time to create a module. **Signal 1: You're copying the same resource blocks into multiple places.** If you find yourself writing the same VPC + subnets + IGW + route table combination in three different environment directories, extract it into a module. The rule of thumb is: once is fine, twice is a hint, three times is a module. **Signal 2: You want a stable, tested interface that callers don't need to understand internally.** A module hides implementation details — the caller says `module \"vpc\" { cidr_block = \"10.0.0.0/16\" }` and doesn't need to know how subnets are carved, how routes are set, or what tags are applied internally. This is valuable when multiple teams consume the same infrastructure pattern. **Signal 3: You want independent versioning.** A module in a separate repo can be versioned with git tags — team A pins to v1.0, team B upgrades to v2.0 independently. This is impossible with copy-pasted resources. **When NOT to create a module**: (1) when the configuration is unique and won't be reused — writing a one-off VPC directly in root is perfectly fine; (2) when the module would have fewer than three resources — modules add cognitive overhead; a module wrapping a single `aws_s3_bucket` is overkill unless you're adding significant logic; (3) when you're still learning what the resource configuration should look like — write it flat first, then extract to a module once you understand the stable interface. A practical starting point: begin every project with all resources in root. When you find yourself duplicating patterns or when the root module exceeds 200–300 lines of resource configuration, start extracting logical groupings into modules. Over-modularized Terraform is harder to read and debug than flat configuration.",
        np: "Beginner को लागि honest जवाफ यो हो: root मा directly resource लेख्नु fine छ र प्रारम्भमा अक्सर सही choice हो। Premature modularization एउटा real anti-pattern हो जसले benefit बिना complexity create गर्छ। यहाँ concrete signal छन् जसले module create गर्ने समय भएको बताउँछ। **Signal 1: एउटै resource block धेरै ठाउँमा copy गर्दै हुनुहुन्छ।** तीनवटा different environment directory मा same VPC + subnet + IGW + route table combination लेख्दै गर्नुभयो भने, module मा extract गर्नुहोस्। Rule of thumb: एकचोटि fine छ, दुईचोटि hint हो, तीनचोटि module हो। **Signal 2: Caller ले internally understand नगर्नुपर्ने stable, tested interface चाहिन्छ।** Module ले implementation detail लुकाउँछ — caller ले `module \"vpc\" { cidr_block = \"10.0.0.0/16\" }` भन्छ र subnet कसरी carved छ, route कसरी set छ, वा internally कुन tag apply छ जान्न पर्दैन। Multiple team ले same infrastructure pattern consume गर्दा यो valuable छ। **Signal 3: Independent versioning चाहिन्छ।** Separate repo मा module लाई git tag सँग version गर्न सकिन्छ — team A v1.0 मा pin गर्छ, team B independently v2.0 मा upgrade गर्छ। Copy-pasted resource सँग यो impossible छ। **Module create नगर्ने बेला**: (१) configuration unique छ र reuse हुँदैन — root मा directly one-off VPC लेख्नु perfectly fine छ; (२) module मा तीनभन्दा कम resource हुन्छन् — module ले cognitive overhead add गर्छ; single `aws_s3_bucket` wrap गर्ने module overkill हो unless significant logic add नगरेसम्म; (३) resource configuration कस्तो हुनुपर्छ अझसम्म सिक्दै हुनुहुन्छ — पहिले flat लेख्नुहोस्, stable interface बुझेपछि module मा extract गर्नुहोस्। Practical starting point: सबै resource root मा राखेर हरेक project सुरु गर्नुहोस्। Pattern duplicate गर्दा वा root module 200-300 line resource configuration exceed गर्दा, logical grouping module मा extract गर्न सुरु गर्नुहोस्। Over-modularized Terraform flat configuration भन्दा पढ्न र debug गर्न गाह्रो हुन्छ।",
        jp: "初心者への正直な答えは：ルートに直接リソースを書くことは問題なく、初期段階では多くの場合正しい選択です。早期のモジュール化は利益なしに複雑さを生み出す本物のアンチパターンです。モジュールを作成する時期を告げる具体的なシグナルを以下に示します。**シグナル 1：同じリソースブロックを複数の場所にコピーしている。** 3 つの異なる環境ディレクトリで同じ VPC + サブネット + IGW + ルートテーブルの組み合わせを書いているなら、モジュールに抽出してください。経験則：1 回は問題なし、2 回はヒント、3 回はモジュール。**シグナル 2：呼び出し元が内部的に理解する必要のない安定したテスト済みインターフェースが欲しい。** モジュールは実装の詳細を隠します — 呼び出し元は `module \"vpc\" { cidr_block = \"10.0.0.0/16\" }` と言うだけで、サブネットがどのように分割されているか、ルートがどのように設定されているか、内部的にどのタグが適用されているかを知る必要がありません。これは複数のチームが同じインフラパターンを利用する場合に価値があります。**シグナル 3：独立したバージョン管理が欲しい。** 別のリポジトリのモジュールは git タグでバージョン管理できます — チーム A は v1.0 に固定し、チーム B は独立して v2.0 にアップグレードします。コピーペーストされたリソースではこれは不可能です。**モジュールを作成しない場合**：(1) 設定が一意で再利用されない場合 — ルートに直接 one-off VPC を書くことは全く問題ない；(2) モジュールに 3 つ未満のリソースがある場合 — モジュールは認知的オーバーヘッドを追加する；重要なロジックを追加しない限り単一の `aws_s3_bucket` をラップするモジュールはやりすぎ；(3) リソース設定がどうあるべきかをまだ学んでいる場合 — まずフラットに書き、安定したインターフェースを理解したらモジュールに抽出する。実践的な出発点：すべてのリソースをルートに置いてすべてのプロジェクトを開始する。パターンを重複させていることに気づいたり、ルートモジュールが 200〜300 行のリソース設定を超えたりしたら、論理的なグループをモジュールに抽出し始める。過剰にモジュール化された Terraform はフラットな設定よりも読みにくくデバッグが難しくなります。",
      },
      tag: {
        en: "when to modularize",
        np: "कहिले modularize गर्ने",
        jp: "いつモジュール化するか",
      },
    },
    {
      question: {
        en: "How does `terraform init` handle module downloads and what is `.terraform/modules/`?",
        np: "`terraform init` ले module download कसरी handle गर्छ र `.terraform/modules/` के हो?",
        jp: "`terraform init` はモジュールのダウンロードをどのように処理し、`.terraform/modules/` とは何か？",
      },
      answer: {
        en: "`terraform init` has three distinct jobs: download providers, download modules, and set up the backend. For modules specifically, here is what happens under the hood. When Terraform reads a `module` block with a non-local source (Registry, GitHub, S3), it resolves the source URL, checks the version constraint against the available published versions, downloads the module archive, and extracts it to `.terraform/modules/MODULE_NAME/`. The downloaded files are the actual `.tf` source files of the module — you can read them, which is valuable for understanding what a Registry module actually does. The `.terraform/modules/modules.json` file is the manifest: it maps every module call name to its local path. For local modules (source starts with `./`), no download happens — `modules.json` simply records the path so Terraform can resolve the reference. For Registry and remote modules, the download hash is recorded in `.terraform.lock.hcl` alongside provider hashes — this ensures that subsequent `terraform init` calls from a fresh directory (e.g., on a new CI runner) download exactly the same version and content. If you change the `version` constraint in a module block and run `terraform init`, Terraform updates the module in `.terraform/modules/` to the new version. However, if you want to upgrade to the latest version within your constraint (e.g., you pinned `~> 5.0` and 5.3 is now available), you must run `terraform init -upgrade` — regular `terraform init` does not upgrade existing modules. **Should `.terraform/modules/` be committed to git?** No — add it to `.gitignore`. The directory is generated by `terraform init` and can always be regenerated from the source definitions and lock file. Committing it would make your repo enormous for large Registry modules. The correct workflow: commit your `main.tf` with module blocks + your `.terraform.lock.hcl` file (which pins exact module versions) → teammates run `terraform init` to reconstruct the `.terraform/modules/` directory from the lock file.",
        np: "`terraform init` का तीनवटा distinct job छन्: provider download गर्नु, module download गर्नु, र backend set up गर्नु। Module को लागि specifically, under the hood यही हुन्छ। Terraform ले non-local source (Registry, GitHub, S3) सहित `module` block पढ्दा, source URL resolve गर्छ, available published version विरुद्ध version constraint check गर्छ, module archive download गर्छ, र `.terraform/modules/MODULE_NAME/` मा extract गर्छ। Downloaded file हरू module का actual `.tf` source file हुन् — पढ्न सकिन्छ, जो Registry module ले actually के गर्छ बुझ्न valuable छ। `.terraform/modules/modules.json` file manifest हो: यसले प्रत्येक module call name लाई local path मा map गर्छ। Local module (source `./` बाट start हुन्छ) को लागि, download हुँदैन — `modules.json` ले Terraform ले reference resolve गर्न सकोस् भनेर path record गर्छ। Registry र remote module को लागि, download hash `.terraform.lock.hcl` मा provider hash सँगै record हुन्छ — यसले ensure गर्छ कि fresh directory (जस्तै, नयाँ CI runner मा) बाट subsequent `terraform init` call ले exactly same version र content download गर्छ। Module block मा `version` constraint change गरेर `terraform init` run गरेमा, Terraform ले `.terraform/modules/` मा module नयाँ version मा update गर्छ। तर, constraint भित्र latest version मा upgrade गर्न (जस्तै, `~> 5.0` pin गर्नुभयो र 5.3 अब available छ), `terraform init -upgrade` run गर्नुपर्छ — regular `terraform init` ले existing module upgrade गर्दैन। **`.terraform/modules/` git मा commit गर्नुपर्छ?** छैन — `.gitignore` मा add गर्नुहोस्। Directory `terraform init` ले generate गर्छ र source definition र lock file बाट सधैं regenerate गर्न सकिन्छ। Large Registry module को लागि commit गर्दा repo enormous हुन्थ्यो। Correct workflow: module block + `.terraform.lock.hcl` file (जसले exact module version pin गर्छ) सहित `main.tf` commit गर्नुहोस् → teammate ले lock file बाट `.terraform/modules/` directory reconstruct गर्न `terraform init` run गर्छन्।",
        jp: "`terraform init` には 3 つの異なる仕事があります：プロバイダーのダウンロード・モジュールのダウンロード・バックエンドのセットアップ。モジュールについて具体的に説明すると、内部では以下のことが起きます。Terraform が非ローカルソース（レジストリ・GitHub・S3）を持つ `module` ブロックを読むと、ソース URL を解決し、利用可能な公開バージョンに対してバージョン制約を確認し、モジュールアーカイブをダウンロードし、`.terraform/modules/MODULE_NAME/` に展開します。ダウンロードされたファイルはモジュールの実際の `.tf` ソースファイルです — 読むことができ、これはレジストリモジュールが実際に何をするかを理解するのに価値があります。`.terraform/modules/modules.json` ファイルはマニフェストです：すべてのモジュール呼び出し名をローカルパスにマッピングします。ローカルモジュール（ソースが `./` で始まる）の場合、ダウンロードは発生しません — `modules.json` は Terraform が参照を解決できるようパスを記録するだけです。レジストリとリモートモジュールの場合、ダウンロードハッシュはプロバイダーハッシュと一緒に `.terraform.lock.hcl` に記録されます — これにより後続の `terraform init` 呼び出し（例：新しい CI ランナーで）が全く同じバージョンとコンテンツをダウンロードすることが保証されます。モジュールブロックの `version` 制約を変更して `terraform init` を実行すると、Terraform は `.terraform/modules/` のモジュールを新しいバージョンに更新します。ただし、制約内で最新バージョンにアップグレードしたい場合（例：`~> 5.0` に固定し 5.3 が利用可能になった）、`terraform init -upgrade` を実行する必要があります — 通常の `terraform init` は既存のモジュールをアップグレードしません。**`.terraform/modules/` を git にコミットすべきか？** いいえ — `.gitignore` に追加してください。ディレクトリは `terraform init` によって生成され、ソース定義とロックファイルから常に再生成できます。コミットすると大きなレジストリモジュールでリポジトリが膨大になります。正しいワークフロー：モジュールブロック + `.terraform.lock.hcl` ファイル（正確なモジュールバージョンを固定する）を持つ `main.tf` をコミットする → チームメートがロックファイルから `.terraform/modules/` ディレクトリを再構築するために `terraform init` を実行する。",
      },
      tag: {
        en: "terraform init & module downloads",
        np: "terraform init र module download",
        jp: "terraform init とモジュールのダウンロード",
      },
    },
  ],
};
