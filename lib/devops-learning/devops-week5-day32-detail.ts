import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A Virtual Private Cloud (VPC) is your own logically isolated section of the AWS cloud. Every EC2 instance, RDS database, and Lambda function lives inside a VPC. Getting VPC design right is the difference between a secure, scalable architecture and one where a misconfigured security group exposes your database to the internet.",
    np: "Virtual Private Cloud (VPC) AWS cloud को तपाईंको आफ्नै logically isolated section हो। हरेक EC2 instance, RDS database, र Lambda function एउटा VPC भित्र रहन्छ। VPC design सही गर्नु secure, scalable architecture र misconfigured security group ले database लाई internet मा expose गर्ने architecture बीचको फरक हो।",
    jp: "Virtual Private Cloud（VPC）は AWS クラウドの自分専用の論理的に分離されたセクションです。すべての EC2 インスタンス・RDS データベース・Lambda 関数は VPC 内に存在します。VPC 設計を正しく行うことが、セキュアでスケーラブルなアーキテクチャと、設定ミスのセキュリティグループがデータベースをインターネットに公開するアーキテクチャの違いです。",
  } as const,
  o2: {
    en: "Today you master the components that make up a VPC: subnets (public vs private), route tables, internet gateways, NAT gateways, and VPC endpoints. By the end you will design a 3-tier VPC architecture (web / app / data) that is used by every serious AWS deployment.",
    np: "आज तपाईं VPC बनाउने component master गर्नुहुन्छ: subnet (public vs private), route table, internet gateway, NAT gateway, र VPC endpoint। अन्त्यमा तपाईंले 3-tier VPC architecture (web / app / data) design गर्नुहुनेछ जुन हरेक serious AWS deployment ले प्रयोग गर्छ।",
    jp: "今日は VPC を構成するコンポーネントをマスターします：サブネット（パブリック vs プライベート）・ルートテーブル・インターネットゲートウェイ・NAT ゲートウェイ・VPC エンドポイント。最終的には、すべての本格的な AWS デプロイメントで使われる 3 層 VPC アーキテクチャ（Web / アプリ / データ）を設計します。",
  } as const,
};

export const DEVOPS_DAY_32_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "VPC building blocks",
        np: "VPC building block",
        jp: "VPC の構成要素",
      },
      blocks: [
        { type: "diagram", id: "devops-vpc-design" },
        {
          type: "table",
          caption: {
            en: "VPC components — component, purpose, and key constraint",
            np: "VPC component — component, purpose, र key constraint",
            jp: "VPC コンポーネント — コンポーネント・目的・主な制約",
          },
          headers: [
            { en: "Component", np: "Component", jp: "コンポーネント" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
            { en: "Key constraint", np: "Key constraint", jp: "主な制約" },
          ],
          rows: [
            [
              { en: "VPC", np: "VPC", jp: "VPC" },
              { en: "The logical network boundary for all your resources in a region. Defines the overall CIDR block.", np: "Region मा तपाईंका सबै resource को logical network boundary। समग्र CIDR block define गर्छ।", jp: "リージョン内のすべてのリソースの論理的なネットワーク境界。全体的な CIDR ブロックを定義する。" },
              { en: "Up to 5 VPCs per region by default (soft limit). CIDR ranges from /16 (65,536 IPs) to /28 (16 IPs). Cannot be changed after creation.", np: "Default मा प्रति region 5 VPC सम्म (soft limit)। CIDR /16 (65,536 IP) देखि /28 (16 IP) सम्म। सिर्जना पछि बदल्न सकिँदैन।", jp: "デフォルトでリージョンあたり最大 5 VPC（ソフト制限）。CIDR は /16（65,536 IP）から /28（16 IP）まで。作成後は変更不可。" },
            ],
            [
              { en: "Subnet", np: "Subnet", jp: "サブネット" },
              { en: "A slice of the VPC CIDR in a single Availability Zone. Resources are placed directly in subnets.", np: "एकल Availability Zone मा VPC CIDR को एक हिस्सा। Resource directly subnet मा राखिन्छन्।", jp: "単一のアベイラビリティーゾーン内の VPC CIDR の一部。リソースはサブネットに直接配置される。" },
              { en: "/16 to /28 CIDR block. Must be within the VPC CIDR and cannot overlap with other subnets. AWS reserves 5 IPs per subnet (first 4 + last 1).", np: "/16 देखि /28 CIDR block। VPC CIDR भित्र हुनुपर्छ र अन्य subnet सँग overlap हुँदैन। AWS ले प्रति subnet 5 IP reserve गर्छ (पहिलो 4 + अन्तिम 1)।", jp: "/16 から /28 の CIDR ブロック。VPC CIDR 内で他のサブネットと重複不可。AWS はサブネットごとに 5 IP を予約（最初の 4 + 最後の 1）。" },
            ],
            [
              { en: "Route Table", np: "Route Table", jp: "ルートテーブル" },
              { en: "Defines where traffic is sent based on destination IP. Each subnet is associated with exactly one route table.", np: "Destination IP को आधारमा traffic कहाँ पठाउने define गर्छ। प्रत्येक subnet exactly एउटा route table सँग associated हुन्छ।", jp: "宛先 IP に基づいてトラフィックをどこに送るかを定義する。各サブネットは正確に 1 つのルートテーブルに関連付けられる。" },
              { en: "The local route (VPC CIDR → local) always exists and cannot be removed. More specific routes take priority over less specific ones.", np: "Local route (VPC CIDR → local) सधैं exist गर्छ र remove गर्न सकिँदैन। More specific route ले less specific भन्दा priority पाउँछ।", jp: "ローカルルート（VPC CIDR → ローカル）は常に存在し削除不可。より具体的なルートが優先される。" },
            ],
            [
              { en: "Internet Gateway (IGW)", np: "Internet Gateway (IGW)", jp: "インターネットゲートウェイ（IGW）" },
              { en: "Connects a VPC to the public internet. Horizontally scaled, redundant, and highly available by design.", np: "VPC लाई public internet सँग connect गर्छ। Design मा horizontally scaled, redundant, र highly available।", jp: "VPC をパブリックインターネットに接続する。設計上、水平スケーラブルで冗長性があり高可用性。" },
              { en: "One IGW per VPC. A subnet is 'public' only if its route table points 0.0.0.0/0 to this IGW. Instances also need a public IP or Elastic IP.", np: "प्रति VPC एउटा IGW। Subnet 'public' हुन्छ यदि यसको route table ले 0.0.0.0/0 यो IGW तर्फ point गर्छ। Instance लाई public IP वा Elastic IP पनि चाहिन्छ।", jp: "VPC あたり 1 つの IGW。サブネットの route table が 0.0.0.0/0 をこの IGW に向けている場合のみ「パブリック」。インスタンスにはパブリック IP または Elastic IP も必要。" },
            ],
            [
              { en: "NAT Gateway", np: "NAT Gateway", jp: "NAT ゲートウェイ" },
              { en: "Lets private subnet instances initiate outbound internet connections (updates, API calls) without being directly reachable from the internet.", np: "Private subnet instance लाई internet बाट directly reachable नभई outbound internet connection (update, API call) initiate गर्न दिन्छ।", jp: "プライベートサブネットのインスタンスがインターネットから直接到達されることなく、アウトバウンドのインターネット接続（更新・API 呼び出し）を開始できるようにする。" },
              { en: "Lives in a public subnet. Costs ~$0.045/hr plus data transfer charges. Deploy one per AZ for high availability — a NAT Gateway in AZ-a cannot serve instances in AZ-b during an outage.", np: "Public subnet मा रहन्छ। ~$0.045/hr plus data transfer charge। High availability का लागि प्रति AZ एउटा deploy गर्नुहोस् — AZ-a मा NAT Gateway ले outage को बेला AZ-b मा instance serve गर्न सक्दैन।", jp: "パブリックサブネットに存在。約 $0.045/時間 + データ転送料金。高可用性のために AZ ごとに 1 つデプロイ — AZ-a の NAT ゲートウェイは障害時に AZ-b のインスタンスを提供できない。" },
            ],
            [
              { en: "VPC Endpoint", np: "VPC Endpoint", jp: "VPC エンドポイント" },
              { en: "Allows private access to AWS services (S3, DynamoDB, SSM, ECR, Secrets Manager) without traffic leaving the AWS network.", np: "Traffic AWS network छोड्न नदिई AWS service (S3, DynamoDB, SSM, ECR, Secrets Manager) मा private access allow गर्छ।", jp: "トラフィックが AWS ネットワークを離れることなく AWS サービス（S3・DynamoDB・SSM・ECR・Secrets Manager）へのプライベートアクセスを許可する。" },
              { en: "Gateway endpoints (S3, DynamoDB) are free. Interface endpoints (all other services) cost ~$0.01/hr per AZ. Use them to save NAT costs and keep traffic off the public internet.", np: "Gateway endpoint (S3, DynamoDB) निःशुल्क छ। Interface endpoint (अन्य सबै service) ~$0.01/hr प्रति AZ cost गर्छ। NAT cost save गर्न र traffic public internet बाट दूर राख्न प्रयोग गर्नुहोस्।", jp: "ゲートウェイエンドポイント（S3・DynamoDB）は無料。インターフェースエンドポイント（他のすべてのサービス）は AZ あたり約 $0.01/時間。NAT コストを節約しトラフィックをパブリックインターネットから遠ざけるために使用する。" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "Every VPC starts with a default (main) route table. Public subnets need an entry `0.0.0.0/0 → IGW` — this is what makes them public. Private subnets route outbound traffic through `0.0.0.0/0 → NAT Gateway` (which itself lives in a public subnet). Subnets in the same VPC can always communicate with each other via the implicit `local` route — you do not configure this and you cannot remove it. A common mistake is assuming all subnets in the same VPC are automatically isolated; they are not. Security groups enforce that isolation.",
            np: "हरेक VPC एउटा default (main) route table बाट सुरु हुन्छ। Public subnet मा `0.0.0.0/0 → IGW` entry चाहिन्छ — यही public बनाउँछ। Private subnet ले outbound traffic `0.0.0.0/0 → NAT Gateway` मार्फत route गर्छ (जुन public subnet मा रहन्छ)। एउटै VPC मा रहेका subnet implicit `local` route मार्फत एकअर्कासँग सधैं communicate गर्न सक्छन् — यो configure गरिँदैन र remove गर्न सकिँदैन। एउटा सामान्य गल्ती एउटै VPC मा सबै subnet automatically isolated हुन्छ भन्ने मान्नु हो; तिनीहरू हुँदैनन्। Security group ले त्यो isolation enforce गर्छ।",
            jp: "すべての VPC はデフォルト（メイン）ルートテーブルから始まります。パブリックサブネットには `0.0.0.0/0 → IGW` エントリが必要です — これがパブリックにする要素です。プライベートサブネットはアウトバウンドトラフィックを `0.0.0.0/0 → NAT ゲートウェイ`（パブリックサブネットに存在）経由でルーティングします。同じ VPC 内のサブネットは暗黙の `local` ルートを介して常に通信できます — これは設定せず削除もできません。よくある間違いは同じ VPC 内のすべてのサブネットが自動的に分離されていると思い込むことです；そうではありません。セキュリティグループがその分離を強制します。",
          },
        },
      ],
    },
    {
      title: {
        en: "3-tier VPC design",
        np: "3-tier VPC design",
        jp: "3 層 VPC 設計",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The production standard for AWS is a minimum of **2 Availability Zones** with **3 subnet tiers per AZ**: public (holds only internet-facing load balancers — no application code), private-app (EC2 instances, ECS tasks, Lambda functions in VPC mode), and private-data (RDS clusters, ElastiCache, Kafka). Each tier has its own route table so traffic flow is explicit and auditable. Security groups enforce the communication rules between tiers — the load balancer can reach the app tier, the app tier can reach the database tier, and nothing else. This design survives a full AZ failure: traffic is automatically rerouted to the instances and databases in the surviving AZ.",
            np: "AWS को production standard **प्रति AZ 3 subnet tier** सहित न्यूनतम **2 Availability Zone** हो: public (internet-facing load balancer मात्र — application code छैन), private-app (EC2 instance, ECS task, VPC mode मा Lambda function), र private-data (RDS cluster, ElastiCache, Kafka)। प्रत्येक tier को आफ्नै route table छ जसले traffic flow explicit र auditable बनाउँछ। Security group ले tier बीचको communication rule enforce गर्छ — load balancer ले app tier reach गर्न सक्छ, app tier ले database tier reach गर्न सक्छ, र अरू केही छैन। यो design ले full AZ failure survive गर्छ: traffic automatically surviving AZ मा instance र database तर्फ reroute हुन्छ।",
            jp: "AWS の本番標準は、**AZ ごとに 3 つのサブネット層**を持つ最低 **2 つのアベイラビリティーゾーン**です：パブリック（インターネット向けロードバランサーのみ — アプリケーションコードなし）・プライベートアプリ（EC2 インスタンス・ECS タスク・VPC モードの Lambda 関数）・プライベートデータ（RDS クラスター・ElastiCache・Kafka）。各層は独自のルートテーブルを持ち、トラフィックフローを明示的かつ監査可能にします。セキュリティグループが層間の通信ルールを強制します。この設計は AZ 完全障害に耐えられます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Terraform — complete 3-tier VPC with 2 AZs, NAT gateways, and route tables",
            np: "Terraform — 2 AZ, NAT gateway, र route table सहित complete 3-tier VPC",
            jp: "Terraform — 2 AZ・NAT ゲートウェイ・ルートテーブルを含む完全な 3 層 VPC",
          },
          code: `# ---- variables.tf ----
variable "vpc_cidr"        { default = "10.0.0.0/16" }
variable "region"          { default = "us-east-1" }
variable "azs"             { default = ["us-east-1a", "us-east-1b"] }

# ---- main.tf ----
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" { region = var.region }

# ── VPC ──────────────────────────────────────────────────────────────────────
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true   # Required for RDS and many AWS services

  tags = { Name = "acme-prod-vpc", env = "production" }
}

# ── Subnets — 2 per tier, one in each AZ (6 total) ───────────────────────────
# Public subnets (load balancers only)
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index)   # 10.0.0.0/20, 10.0.16.0/20
  availability_zone = var.azs[count.index]
  map_public_ip_on_launch = true   # Instances here get a public IP automatically

  tags = { Name = "public-\${var.azs[count.index]}", tier = "public", env = "production" }
}

# Private app subnets (EC2, ECS, Lambda)
resource "aws_subnet" "private_app" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + 2)  # 10.0.32.0/20, 10.0.48.0/20
  availability_zone = var.azs[count.index]

  tags = { Name = "private-app-\${var.azs[count.index]}", tier = "app", env = "production" }
}

# Private data subnets (RDS, ElastiCache)
resource "aws_subnet" "private_data" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + 4)  # 10.0.64.0/20, 10.0.80.0/20
  availability_zone = var.azs[count.index]

  tags = { Name = "private-data-\${var.azs[count.index]}", tier = "data", env = "production" }
}

# ── Internet Gateway ──────────────────────────────────────────────────────────
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "acme-prod-igw" }
}

# ── Elastic IPs for NAT Gateways ──────────────────────────────────────────────
resource "aws_eip" "nat" {
  count  = 2
  domain = "vpc"
  tags   = { Name = "nat-eip-\${var.azs[count.index]}" }
}

# ── NAT Gateways — one per AZ for high availability ──────────────────────────
resource "aws_nat_gateway" "nat" {
  count         = 2
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id   # NAT lives in PUBLIC subnet

  tags = { Name = "nat-gw-\${var.azs[count.index]}" }
  depends_on = [aws_internet_gateway.igw]
}

# ── Route Tables ──────────────────────────────────────────────────────────────
# Public route table — shared by both public subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = { Name = "public-rt" }
}

resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private app route tables — one per AZ (routes through that AZ's NAT GW)
resource "aws_route_table" "private_app" {
  count  = 2
  vpc_id = aws_vpc.main.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat[count.index].id
  }
  tags = { Name = "private-app-rt-\${var.azs[count.index]}" }
}

resource "aws_route_table_association" "private_app" {
  count          = 2
  subnet_id      = aws_subnet.private_app[count.index].id
  route_table_id = aws_route_table.private_app[count.index].id
}

# Private data route tables — no outbound internet route (data layer stays isolated)
resource "aws_route_table" "private_data" {
  count  = 2
  vpc_id = aws_vpc.main.id
  # No 0.0.0.0/0 route — data layer should NOT reach the internet
  tags   = { Name = "private-data-rt-\${var.azs[count.index]}" }
}

resource "aws_route_table_association" "private_data" {
  count          = 2
  subnet_id      = aws_subnet.private_data[count.index].id
  route_table_id = aws_route_table.private_data[count.index].id
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "vpc_id"              { value = aws_vpc.main.id }
output "public_subnet_ids"   { value = aws_subnet.public[*].id }
output "app_subnet_ids"      { value = aws_subnet.private_app[*].id }
output "data_subnet_ids"     { value = aws_subnet.private_data[*].id }`,
        },
      ],
    },
    {
      title: {
        en: "Security groups vs NACLs",
        np: "Security group vs NACL",
        jp: "セキュリティグループ vs NACL",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Security groups vs Network ACLs — a full comparison",
            np: "Security group vs Network ACL — पूर्ण तुलना",
            jp: "セキュリティグループ vs ネットワーク ACL — 完全比較",
          },
          headers: [
            { en: "Property", np: "Property", jp: "プロパティ" },
            { en: "Security Group (SG)", np: "Security Group (SG)", jp: "セキュリティグループ（SG）" },
            { en: "Network ACL (NACL)", np: "Network ACL (NACL)", jp: "ネットワーク ACL（NACL）" },
          ],
          rows: [
            [
              { en: "State", np: "State", jp: "ステート" },
              { en: "Stateful — return traffic is automatically allowed without an explicit rule.", np: "Stateful — return traffic explicit rule बिना automatically allowed हुन्छ।", jp: "ステートフル — リターントラフィックは明示的なルールなしで自動的に許可される。" },
              { en: "Stateless — you must add both inbound AND outbound rules for every connection, including return traffic.", np: "Stateless — हरेक connection (return traffic सहित) का लागि inbound र outbound दुवै rule थप्नुपर्छ।", jp: "ステートレス — リターントラフィックを含むすべての接続にインバウンドとアウトバウンド両方のルールが必要。" },
            ],
            [
              { en: "Applied at", np: "कहाँ apply हुन्छ", jp: "適用レベル" },
              { en: "Instance (network interface) level — each EC2 instance or ENI has its own SG rules.", np: "Instance (network interface) level — प्रत्येक EC2 instance वा ENI को आफ्नै SG rule छ।", jp: "インスタンス（ネットワークインターフェース）レベル — 各 EC2 インスタンスまたは ENI が独自の SG ルールを持つ。" },
              { en: "Subnet level — applies to ALL traffic entering or leaving the subnet, regardless of destination instance.", np: "Subnet level — destination instance निर्विशेष, subnet मा enter वा leave गर्ने सबै traffic मा apply हुन्छ।", jp: "サブネットレベル — 宛先インスタンスに関係なく、サブネットに出入りするすべてのトラフィックに適用される。" },
            ],
            [
              { en: "Rule types", np: "Rule type", jp: "ルールの種類" },
              { en: "Allow rules only. There is no Deny. Anything not explicitly allowed is dropped (implicit deny).", np: "Allow rule मात्र। Deny छैन। Explicitly allow नगरिएको जुनसुकै drop हुन्छ (implicit deny)।", jp: "Allow ルールのみ。Deny はない。明示的に許可されていないものはすべてドロップされる（暗黙の Deny）。" },
              { en: "Both Allow and Deny rules. You can explicitly block specific IPs or ranges, which SGs alone cannot do.", np: "Allow र Deny दुवै rule। Specific IP वा range explicitly block गर्न सकिन्छ, जुन SG मात्रले गर्न सक्दैन।", jp: "Allow と Deny 両方のルール。SG だけではできない特定の IP や範囲を明示的にブロックできる。" },
            ],
            [
              { en: "Evaluation order", np: "Evaluation order", jp: "評価順序" },
              { en: "All rules are evaluated together; the most permissive match wins. Order does not matter.", np: "सबै rule एकसाथ evaluate हुन्छन्; सबैभन्दा permissive match जित्छ। Order को महत्व छैन।", jp: "すべてのルールが一緒に評価される；最も許可的なマッチが勝つ。順序は関係ない。" },
              { en: "Rules are evaluated in ascending rule number order. The first matching rule wins. Lower numbers are processed first.", np: "Rule ascending rule number order मा evaluate हुन्छन्। पहिलो matching rule जित्छ। सानो number पहिले process हुन्छ।", jp: "ルールはルール番号の昇順で評価される。最初にマッチしたルールが勝つ。番号が小さいほど先に処理される。" },
            ],
            [
              { en: "Typical use case", np: "Typical use case", jp: "典型的なユースケース" },
              { en: "All day-to-day access control between tiers — web to app, app to database, load balancer to EC2.", np: "Tier बीचको day-to-day access control — web to app, app to database, load balancer to EC2।", jp: "層間のすべての日常的なアクセス制御 — Web からアプリ・アプリからデータベース・ロードバランサーから EC2。" },
              { en: "Blocking specific known-malicious IP ranges at the subnet boundary, or compliance-mandated subnet-level isolation rules.", np: "Subnet boundary मा specific known-malicious IP range block गर्न, वा compliance-mandated subnet-level isolation rule।", jp: "サブネット境界での特定の既知の悪意ある IP 範囲のブロック、またはコンプライアンスで義務付けられたサブネットレベルの分離ルール。" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "In practice, **use security groups for everything** and reach for NACLs only in two cases: (1) you need to block a specific malicious CIDR range at the subnet level — something SGs cannot do since they only have Allow rules; (2) a compliance requirement mandates a subnet-level network control in addition to instance-level controls. When you add a NACL Deny rule, remember NACLs are stateless — if you block inbound traffic from an IP, you must also add an outbound Deny for the ephemeral port range (1024–65535) that the response would use. Forgetting the outbound rule for the ephemeral ports is the single most common NACL mistake.",
            np: "व्यवहारमा, **सबैका लागि security group प्रयोग गर्नुहोस्** र दुई case मा मात्र NACL प्रयोग गर्नुहोस्: (1) subnet level मा specific malicious CIDR range block गर्नुपर्छ — SG ले गर्न सक्दैन किनभने यसमा Allow rule मात्र छन्; (2) compliance requirement ले instance-level control थपेर subnet-level network control mandate गर्छ। NACL Deny rule थप्दा, NACLs stateless हुन भन्ने याद गर्नुहोस् — कुनै IP बाट inbound traffic block गर्नुभयो भने, response प्रयोग गर्ने ephemeral port range (1024–65535) का लागि outbound Deny पनि थप्नुपर्छ।",
            jp: "実際には、**すべてにセキュリティグループを使用し**、NACL は 2 つのケースのみに使います：（1）SG では Allow ルールしかないためできない、サブネットレベルで特定の悪意ある CIDR 範囲をブロックする必要がある場合；（2）コンプライアンス要件がインスタンスレベルの制御に加えてサブネットレベルのネットワーク制御を義務付けている場合。NACL Deny ルールを追加する際は、NACL がステートレスであることを覚えておいてください — ある IP からのインバウンドトラフィックをブロックする場合、レスポンスが使うエフェメラルポート範囲（1024〜65535）のアウトバウンド Deny も追加する必要があります。",
          },
        },
      ],
    },
    {
      title: {
        en: "VPC peering & PrivateLink",
        np: "VPC peering र PrivateLink",
        jp: "VPC ピアリングと PrivateLink",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**VPC peering** creates a direct network connection between two VPCs — same account, different accounts, same region, or cross-region. Instances on both sides can communicate using private IP addresses as if they were on the same network. The critical limitation is that VPC peering is **non-transitive**: if VPC-A peers VPC-B and VPC-B peers VPC-C, VPC-A cannot reach VPC-C through VPC-B. For hub-and-spoke topologies (many VPCs all connecting to a central services VPC), use **AWS Transit Gateway** instead. **AWS PrivateLink** is a different mechanism: it exposes a specific service endpoint (an NLB in one VPC) to consumers in other VPCs without giving them general network access. This is the right model for SaaS integrations and shared platform services (monitoring agents, secrets management) — the consumer VPC connects to a specific service, not the whole provider VPC.",
            np: "**VPC peering** ले दुई VPC बीच direct network connection बनाउँछ — एउटै account, फरक account, एउटै region, वा cross-region। दुवैतर्फका instance एउटै network मा जस्तै private IP address प्रयोग गरेर communicate गर्न सक्छन्। Critical limitation यो हो कि VPC peering **non-transitive** हुन्छ: VPC-A ले VPC-B peer गर्छ र VPC-B ले VPC-C peer गर्छ भने, VPC-A ले VPC-B मार्फत VPC-C reach गर्न सक्दैन। Hub-and-spoke topology (central services VPC मा connect हुने धेरै VPC) का लागि **AWS Transit Gateway** प्रयोग गर्नुहोस्। **AWS PrivateLink** एउटा फरक mechanism हो: यसले एउटा specific service endpoint (एउटा VPC मा NLB) लाई अन्य VPC मा consumer लाई general network access नदिई expose गर्छ।",
            jp: "**VPC ピアリング**は 2 つの VPC 間に直接のネットワーク接続を作成します — 同じアカウント・別のアカウント・同じリージョン・クロスリージョン。両側のインスタンスは同じネットワーク上にいるかのようにプライベート IP アドレスを使って通信できます。重要な制限は VPC ピアリングが**非推移的**であることです：VPC-A が VPC-B をピアリングし VPC-B が VPC-C をピアリングしても、VPC-A は VPC-B 経由で VPC-C に到達できません。ハブアンドスポークトポロジー（中央サービス VPC に接続する多くの VPC）には **AWS Transit Gateway** を使用してください。**AWS PrivateLink** は異なるメカニズムです。",
          },
        },
        {
          type: "code",
          title: {
            en: "VPC peering — create connection, accept from other account, update route tables on both sides",
            np: "VPC peering — connection बनाउनुहोस्, अर्को account बाट accept गर्नुहोस्, दुवैतर्फ route table update गर्नुहोस्",
            jp: "VPC ピアリング — 接続の作成・別アカウントからの承認・両側のルートテーブル更新",
          },
          code: `# ---- Account A: request the peering connection ----
# Replace with your actual VPC IDs and account ID
REQUESTER_VPC="vpc-0a1b2c3d4e5f6a7b8"     # Account A VPC (CIDR: 10.0.0.0/16)
ACCEPTER_VPC="vpc-0z9y8x7w6v5u4t3s"       # Account B VPC (CIDR: 172.16.0.0/16)
ACCEPTER_ACCOUNT="999888777666"

PEERING_ID=$(aws ec2 create-vpc-peering-connection \\
  --vpc-id "$REQUESTER_VPC" \\
  --peer-vpc-id "$ACCEPTER_VPC" \\
  --peer-owner-id "$ACCEPTER_ACCOUNT" \\
  --peer-region us-east-1 \\
  --tag-specifications 'ResourceType=vpc-peering-connection,Tags=[{Key=Name,Value=prod-shared-services-peer}]' \\
  --query 'VpcPeeringConnection.VpcPeeringConnectionId' \\
  --output text)

echo "Peering connection created: $PEERING_ID"

# ---- Account B: accept the peering request ----
# Run this in Account B's CLI profile
aws ec2 accept-vpc-peering-connection \\
  --vpc-peering-connection-id "$PEERING_ID" \\
  --region us-east-1

# ---- Account A: add route toward Account B's CIDR ----
# Find the route table IDs for your private subnets in Account A
ACCOUNT_A_RT="rtb-0aaaa1111bbbb2222"

aws ec2 create-route \\
  --route-table-id "$ACCOUNT_A_RT" \\
  --destination-cidr-block "172.16.0.0/16" \\
  --vpc-peering-connection-id "$PEERING_ID"

# ---- Account B: add route toward Account A's CIDR ----
# Run this in Account B's CLI profile
ACCOUNT_B_RT="rtb-0cccc3333dddd4444"

aws ec2 create-route \\
  --route-table-id "$ACCOUNT_B_RT" \\
  --destination-cidr-block "10.0.0.0/16" \\
  --vpc-peering-connection-id "$PEERING_ID"

# ---- Update security groups on both sides to allow traffic ----
# Account A: allow port 5432 from Account B's app CIDR
aws ec2 authorize-security-group-ingress \\
  --group-id sg-0db1234567890abcd \\
  --protocol tcp \\
  --port 5432 \\
  --cidr "172.16.32.0/20"   # Account B's app subnet CIDR

# Important: VPC peering does NOT update route tables automatically.
# You must add routes on BOTH sides and update security groups on BOTH sides.
# Forgetting either side is the most common peering mistake.`,
        },
      ],
    },
    {
      title: {
        en: "VPC Flow Logs — visibility into your network",
        np: "VPC Flow Log — तपाईंको network मा visibility",
        jp: "VPC フローログ — ネットワークの可視化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "VPC Flow Logs capture metadata about IP traffic flowing through your VPC — but **not the payload content** (no packet captures). Each flow log record is a 5-tuple: `srcaddr`, `dstaddr`, `srcport`, `dstport`, `protocol`, plus `action` (ACCEPT or REJECT), bytes, packets, start/end timestamps, and the interface ID. You can enable flow logs at three levels: the VPC (all interfaces), a specific subnet, or a specific network interface. Send them to CloudWatch Logs for real-time querying with CloudWatch Insights, or to S3 for cost-effective long-term storage and Athena querying. Flow logs have a small latency (~1–10 minutes before records appear). Use them to investigate why a connection is being rejected, detect unexpected traffic patterns, verify that your security groups are working as designed, and identify high-bandwidth talkers driving your NAT costs.",
            np: "VPC Flow Log ले तपाईंको VPC मा बग्ने IP traffic को metadata capture गर्छ — तर **payload content होइन** (कुनै packet capture छैन)। हरेक flow log record एउटा 5-tuple हो: `srcaddr`, `dstaddr`, `srcport`, `dstport`, `protocol`, plus `action` (ACCEPT वा REJECT), byte, packet, start/end timestamp, र interface ID। Flow log तीन level मा enable गर्न सकिन्छ: VPC (सबै interface), specific subnet, वा specific network interface। Real-time querying का लागि CloudWatch Logs मा, वा cost-effective long-term storage र Athena querying का लागि S3 मा पठाउनुहोस्। Connection किन reject भइरहेछ investigate गर्न, unexpected traffic pattern detect गर्न, security group design अनुसार काम गरिरहेको verify गर्न, र NAT cost drive गर्ने high-bandwidth talker identify गर्न प्रयोग गर्नुहोस्।",
            jp: "VPC フローログは VPC を流れる IP トラフィックのメタデータをキャプチャします — しかし**ペイロードの内容は含みません**（パケットキャプチャなし）。各フローログレコードは 5 タプルです：`srcaddr`・`dstaddr`・`srcport`・`dstport`・`protocol`、さらに `action`（ACCEPT または REJECT）・バイト数・パケット数・開始/終了タイムスタンプ・インターフェース ID。フローログは 3 つのレベルで有効化できます：VPC（すべてのインターフェース）・特定のサブネット・特定のネットワークインターフェース。リアルタイムクエリには CloudWatch Logs へ、コスト効率の良い長期保存と Athena クエリには S3 へ送信します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Enable VPC flow logs to S3 + CloudWatch Insights queries for rejected traffic and top talkers",
            np: "S3 मा VPC flow log enable गर्नुहोस् + rejected traffic र top talker का लागि CloudWatch Insights query",
            jp: "S3 への VPC フローログ有効化 + 拒否トラフィックとトップトーカーのための CloudWatch Insights クエリ",
          },
          code: `# ---- 1. Enable VPC Flow Logs to S3 ----
VPC_ID="vpc-0a1b2c3d4e5f6a7b8"
LOG_BUCKET="arn:aws:s3:::acme-vpc-flow-logs"

aws ec2 create-flow-logs \\
  --resource-type VPC \\
  --resource-ids "$VPC_ID" \\
  --traffic-type ALL \\          # ALL = ACCEPT + REJECT; use REJECT to reduce volume
  --log-destination-type s3 \\
  --log-destination "$LOG_BUCKET" \\
  --log-format '\${version} \${account-id} \${interface-id} \${srcaddr} \${dstaddr} \${srcport} \${dstport} \${protocol} \${packets} \${bytes} \${start} \${end} \${action} \${log-status}' \\
  --max-aggregation-interval 60  # 60 seconds (minimum); use 600 for less frequent/cheaper

# ---- 2. Enable VPC Flow Logs to CloudWatch Logs (for real-time Insights queries) ----
aws ec2 create-flow-logs \\
  --resource-type VPC \\
  --resource-ids "$VPC_ID" \\
  --traffic-type REJECT \\       # Only capture rejected traffic to reduce cost
  --log-destination-type cloud-watch-logs \\
  --log-group-name "/vpc/flow-logs/acme-prod" \\
  --deliver-logs-permission-arn "arn:aws:iam::123456789012:role/FlowLogsRole"

# ---- 3. CloudWatch Logs Insights — find all REJECTED connections in the last hour ----
# Run this in the CloudWatch console or with:
# aws logs start-query --log-group-name /vpc/flow-logs/acme-prod --start-time ... --end-time ... --query-string '...'

# Query 1: Rejected connections sorted by count (find blocked attackers or misconfigured SGs)
# fields @timestamp, srcAddr, dstAddr, dstPort, protocol, action
# | filter action = "REJECT"
# | stats count(*) as rejectCount by srcAddr, dstAddr, dstPort
# | sort rejectCount desc
# | limit 50

# Query 2: Top talkers by bytes (find what's driving your NAT/egress costs)
# fields @timestamp, srcAddr, dstAddr, bytes
# | filter action = "ACCEPT"
# | stats sum(bytes) as totalBytes by srcAddr
# | sort totalBytes desc
# | limit 20

# Query 3: Check if a specific source IP is being blocked
# fields @timestamp, srcAddr, dstAddr, srcPort, dstPort, protocol, action
# | filter srcAddr = "203.0.113.45"
# | sort @timestamp desc
# | limit 100

# ---- 4. Query flow logs in S3 with Athena (cheaper for historical analysis) ----
# Create the Athena table first (one-time setup):
# CREATE EXTERNAL TABLE vpc_flow_logs (
#   version int, account string, interfaceid string,
#   sourceaddress string, destinationaddress string,
#   sourceport int, destinationport int, protocol int,
#   numpackets int, numbytes bigint, starttime int, endtime int,
#   action string, logstatus string
# )
# PARTITIONED BY (dt string)
# ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
# LOCATION 's3://acme-vpc-flow-logs/AWSLogs/123456789012/vpcflowlogs/us-east-1/';

# Then query: SELECT sourceaddress, COUNT(*) as hits
# FROM vpc_flow_logs WHERE action='REJECT' AND dt='2026/05/01'
# GROUP BY sourceaddress ORDER BY hits DESC LIMIT 20;`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: build a 3-tier VPC from scratch",
        np: "Hands-on: scratch बाट 3-tier VPC बनाउनुहोस्",
        jp: "ハンズオン：ゼロから 3 層 VPC を構築する",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create the VPC with CIDR 10.0.0.0/16: `aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-3tier-vpc}]'`. Save the VPC ID from the output.",
              np: "CIDR 10.0.0.0/16 सहित VPC बनाउनुहोस्: `aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-3tier-vpc}]'`। Output बाट VPC ID save गर्नुहोस्।",
              jp: "CIDR 10.0.0.0/16 で VPC を作成する：`aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-3tier-vpc}]'`。出力から VPC ID を保存する。",
            },
            {
              en: "Create 6 subnets across 2 AZs — 2 public (10.0.0.0/24, 10.0.1.0/24), 2 private-app (10.0.10.0/24, 10.0.11.0/24), 2 private-data (10.0.20.0/24, 10.0.21.0/24). Assign each to alternating AZs (us-east-1a and us-east-1b). Tag them with `tier=public`, `tier=app`, `tier=data`.",
              np: "2 AZ पार 6 subnet बनाउनुहोस् — 2 public (10.0.0.0/24, 10.0.1.0/24), 2 private-app (10.0.10.0/24, 10.0.11.0/24), 2 private-data (10.0.20.0/24, 10.0.21.0/24)। प्रत्येकलाई alternating AZ (us-east-1a र us-east-1b) मा assign गर्नुहोस्। `tier=public`, `tier=app`, `tier=data` सँग tag गर्नुहोस्।",
              jp: "2 つの AZ にまたがって 6 つのサブネットを作成する — パブリック 2 つ（10.0.0.0/24・10.0.1.0/24）・プライベートアプリ 2 つ（10.0.10.0/24・10.0.11.0/24）・プライベートデータ 2 つ（10.0.20.0/24・10.0.21.0/24）。各サブネットを交互の AZ（us-east-1a と us-east-1b）に割り当て。`tier=public`・`tier=app`・`tier=data` でタグ付けする。",
            },
            {
              en: "Attach an Internet Gateway to the VPC: `aws ec2 create-internet-gateway` then `aws ec2 attach-internet-gateway --vpc-id <VPC_ID> --internet-gateway-id <IGW_ID>`. Create a NAT Gateway in each public subnet: allocate an Elastic IP first (`aws ec2 allocate-address --domain vpc`), then create the NAT Gateway pointing to the EIP.",
              np: "VPC मा Internet Gateway attach गर्नुहोस्: `aws ec2 create-internet-gateway` त्यसपछि `aws ec2 attach-internet-gateway --vpc-id <VPC_ID> --internet-gateway-id <IGW_ID>`। प्रत्येक public subnet मा NAT Gateway बनाउनुहोस्: पहिले Elastic IP allocate गर्नुहोस् (`aws ec2 allocate-address --domain vpc`), त्यसपछि EIP तर्फ point गर्ने NAT Gateway बनाउनुहोस्।",
              jp: "インターネットゲートウェイを VPC にアタッチする：`aws ec2 create-internet-gateway` 次に `aws ec2 attach-internet-gateway --vpc-id <VPC_ID> --internet-gateway-id <IGW_ID>`。各パブリックサブネットに NAT ゲートウェイを作成する：まず Elastic IP を割り当て（`aws ec2 allocate-address --domain vpc`）、次に EIP を指す NAT ゲートウェイを作成する。",
            },
            {
              en: "Configure route tables for each tier: create a public route table with `0.0.0.0/0 → IGW` and associate it with both public subnets; create two private-app route tables (one per AZ) each with `0.0.0.0/0 → NAT-GW-in-same-AZ`; create two private-data route tables with no internet route at all.",
              np: "प्रत्येक tier का लागि route table configure गर्नुहोस्: `0.0.0.0/0 → IGW` सहित public route table बनाउनुहोस् र दुवै public subnet मा associate गर्नुहोस्; प्रत्येकमा `0.0.0.0/0 → NAT-GW-in-same-AZ` सहित दुईवटा private-app route table (प्रति AZ एउटा) बनाउनुहोस्; कुनै internet route बिना दुईवटा private-data route table बनाउनुहोस्।",
              jp: "各層のルートテーブルを設定する：`0.0.0.0/0 → IGW` を持つパブリックルートテーブルを作成して両方のパブリックサブネットに関連付け；各 AZ ごとに `0.0.0.0/0 → 同じ AZ の NAT-GW` を持つ 2 つのプライベートアプリルートテーブルを作成；インターネットルートなしで 2 つのプライベートデータルートテーブルを作成する。",
            },
            {
              en: "Create three security groups — `alb-sg` (allow 80/443 from anywhere), `app-sg` (allow 8080 from `alb-sg` ID only), `db-sg` (allow 5432 from `app-sg` ID only). Use SG IDs in the source, not CIDR blocks, so the rules follow instance membership dynamically.",
              np: "तीन security group बनाउनुहोस् — `alb-sg` (जहाँबाट पनि 80/443 allow), `app-sg` (`alb-sg` ID बाट मात्र 8080 allow), `db-sg` (`app-sg` ID बाट मात्र 5432 allow)। Rule dynamic रूपमा instance membership follow गरोस् भनेर CIDR block होइन, source मा SG ID प्रयोग गर्नुहोस्।",
              jp: "3 つのセキュリティグループを作成する — `alb-sg`（どこからでも 80/443 を許可）・`app-sg`（`alb-sg` ID からのみ 8080 を許可）・`db-sg`（`app-sg` ID からのみ 5432 を許可）。ルールがインスタンスのメンバーシップを動的に追跡するように、ソースには CIDR ブロックでなく SG ID を使用する。",
            },
            {
              en: "Launch a test EC2 instance in a private-app subnet with the `app-sg` security group and an IAM role with `AmazonSSMManagedInstanceCore`. Connect via SSM and verify it can reach the internet (run `curl https://ifconfig.me`) — this confirms NAT Gateway is working. Also confirm there is no inbound access from the internet by trying to reach the instance's private IP directly.",
              np: "`app-sg` security group र `AmazonSSMManagedInstanceCore` सहित IAM role सहित private-app subnet मा test EC2 instance launch गर्नुहोस्। SSM मार्फत connect गर्नुहोस् र internet reach गर्न सक्छ verify गर्नुहोस् (`curl https://ifconfig.me` run गर्नुहोस्) — यसले NAT Gateway काम गरिरहेको confirm गर्छ। Instance को private IP directly reach गर्ने प्रयास गरेर internet बाट inbound access नभएको पनि confirm गर्नुहोस्।",
              jp: "`app-sg` セキュリティグループと `AmazonSSMManagedInstanceCore` を持つ IAM ロール付きで、プライベートアプリサブネットにテスト EC2 インスタンスをラウンチする。SSM で接続しインターネットに到達できることを確認する（`curl https://ifconfig.me` を実行）— これで NAT ゲートウェイが機能していることが確認できる。インスタンスのプライベート IP に直接到達しようとしてインターネットからのインバウンドアクセスがないことも確認する。",
            },
            {
              en: "Enable VPC Flow Logs to S3: create an S3 bucket with a bucket policy that allows VPC Flow Logs to write to it, then run `aws ec2 create-flow-logs --resource-type VPC --resource-ids <VPC_ID> --traffic-type ALL --log-destination-type s3 --log-destination arn:aws:s3:::your-flow-log-bucket`. Wait 5 minutes, then check the S3 bucket for log files.",
              np: "S3 मा VPC Flow Log enable गर्नुहोस्: VPC Flow Log ले लेख्न allow गर्ने bucket policy सहित S3 bucket बनाउनुहोस्, त्यसपछि `aws ec2 create-flow-logs --resource-type VPC --resource-ids <VPC_ID> --traffic-type ALL --log-destination-type s3 --log-destination arn:aws:s3:::your-flow-log-bucket` run गर्नुहोस्। 5 मिनेट पर्खनुहोस्, त्यसपछि log file का लागि S3 bucket check गर्नुहोस्।",
              jp: "S3 への VPC フローログを有効化する：VPC フローログが書き込みを許可するバケットポリシーを持つ S3 バケットを作成し、`aws ec2 create-flow-logs --resource-type VPC --resource-ids <VPC_ID> --traffic-type ALL --log-destination-type s3 --log-destination arn:aws:s3:::your-flow-log-bucket` を実行する。5 分待ってから S3 バケットにログファイルがあることを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How many AZs should I use?",
        np: "कतिवटा AZ प्रयोग गर्नुपर्छ?",
        jp: "いくつの AZ を使うべきか？",
      },
      answer: {
        en: "Minimum 2 AZs for any production workload — if one AZ fails (which happens, though rarely), your application keeps serving traffic from the other. Use 3 AZs when you need quorum-based consensus and want to tolerate a majority failure: Kafka and Zookeeper need a majority of brokers alive to elect a leader, etcd and Kubernetes control plane components need a quorum of nodes to avoid split-brain. With 3 AZs you can lose one and still have 2 of 3 nodes in agreement. Do not use more than 3 AZs unless you have an unusual compliance requirement — the operational complexity and cost (three NAT Gateways, three times the cross-AZ transfer for distributed systems) rarely justify it.",
        np: "कुनै पनि production workload का लागि न्यूनतम 2 AZ — एउटा AZ fail भयो भने (जुन हुन्छ, यद्यपि विरलै), तपाईंको application अर्कोबाट traffic serve गर्दै रहन्छ। Quorum-based consensus चाहिँदा र majority failure tolerate गर्न 3 AZ प्रयोग गर्नुहोस्: Kafka र Zookeeper लाई leader elect गर्न majority broker alive चाहिन्छ, etcd र Kubernetes control plane component लाई split-brain avoid गर्न node को quorum चाहिन्छ। 3 AZ सँग एउटा गुमाउन सकिन्छ र अझै 3 मध्ये 2 node agreement मा हुन्छ।",
        jp: "本番ワークロードには最低 2 つの AZ — 1 つの AZ が障害を起こしても（まれにある）、アプリケーションはもう 1 つから引き続きトラフィックを提供します。クォーラムベースのコンセンサスが必要で多数決の障害を許容したい場合は 3 AZ を使用してください：Kafka と Zookeeper はリーダーを選出するためにブローカーの過半数が稼働している必要があり、etcd と Kubernetes コントロールプレーンコンポーネントはスプリットブレインを避けるためにノードのクォーラムが必要です。3 AZ では 1 つを失っても 3 つのうち 2 つのノードが合意できます。",
      },
      tag: { en: "vpc", np: "VPC", jp: "VPC" },
    },
    {
      question: {
        en: "What is the difference between a public and private subnet?",
        np: "Public र private subnet बीच के फरक छ?",
        jp: "パブリックサブネットとプライベートサブネットの違いは？",
      },
      answer: {
        en: "A public subnet has a route in its route table pointing `0.0.0.0/0` to an Internet Gateway — that is the only thing that makes it public. A private subnet either routes `0.0.0.0/0` to a NAT Gateway (outbound-only internet access) or has no internet route at all (completely isolated, typical for database subnets). The subnet itself has no 'public' or 'private' flag — it is entirely determined by the route table. An instance in a 'public' subnet also needs a public IP address (or Elastic IP) to actually communicate with the internet — having the IGW route alone is not enough if the instance has no public IP.",
        np: "Public subnet को route table मा `0.0.0.0/0` Internet Gateway तर्फ point गर्ने route छ — यो मात्र public बनाउने कुरा हो। Private subnet ले या त `0.0.0.0/0` NAT Gateway तर्फ route गर्छ (outbound-only internet access) वा कुनै internet route छैन (completely isolated, database subnet का लागि typical)। Subnet सँग आफैं 'public' वा 'private' flag छैन — यो route table ले पूर्ण रूपमा निर्धारण गर्छ। 'Public' subnet मा रहेको instance लाई internet सँग actually communicate गर्न public IP address (वा Elastic IP) पनि चाहिन्छ।",
        jp: "パブリックサブネットはルートテーブルに `0.0.0.0/0` をインターネットゲートウェイに向けるルートがあります — それだけがパブリックにする要素です。プライベートサブネットは `0.0.0.0/0` を NAT ゲートウェイ（アウトバウンドのみのインターネットアクセス）にルーティングするか、インターネットルートがまったくありません（完全に分離されており、データベースサブネットに典型的）。サブネット自体に「パブリック」や「プライベート」のフラグはありません — ルートテーブルによって完全に決まります。「パブリック」サブネットのインスタンスもインターネットと実際に通信するにはパブリック IP アドレス（または Elastic IP）が必要です。",
      },
      tag: { en: "vpc", np: "VPC", jp: "VPC" },
    },
    {
      question: {
        en: "When would I use a VPC endpoint instead of NAT?",
        np: "NAT को सट्टा VPC endpoint कहिले प्रयोग गर्ने?",
        jp: "NAT の代わりに VPC エンドポイントを使うのはいつか？",
      },
      answer: {
        en: "Use VPC endpoints whenever your private instances need to talk to AWS services — S3, DynamoDB, SSM, ECR, Secrets Manager, CloudWatch, SQS. There are two types: Gateway endpoints (S3 and DynamoDB only) are completely free and just require a route table entry; Interface endpoints (all other AWS services) cost ~$0.01/hr per AZ but are still significantly cheaper than routing that traffic through a NAT Gateway at $0.045/GB. Beyond cost, VPC endpoints keep traffic off the public internet entirely — the traffic stays within the AWS network fabric, which is better for security posture and often required by compliance frameworks. A common pattern: use a Gateway endpoint for S3, Interface endpoints for SSM and ECR (needed for SSM Session Manager and pulling container images), and NAT Gateway only for traffic to the actual public internet.",
        np: "तपाईंका private instance लाई AWS service — S3, DynamoDB, SSM, ECR, Secrets Manager, CloudWatch, SQS — सँग communicate गर्नुपर्दा VPC endpoint प्रयोग गर्नुहोस्। दुई प्रकार छन्: Gateway endpoint (S3 र DynamoDB मात्र) पूर्णतः निःशुल्क र route table entry मात्र चाहिन्छ; Interface endpoint (अन्य सबै AWS service) ~$0.01/hr प्रति AZ cost गर्छ तर NAT Gateway मार्फत $0.045/GB भन्दा धेरै सस्तो। Cost भन्दा बाहिर, VPC endpoint ले traffic पूर्णतः public internet बाट दूर राख्छ — traffic AWS network fabric भित्रै रहन्छ।",
        jp: "プライベートインスタンスが AWS サービス（S3・DynamoDB・SSM・ECR・Secrets Manager・CloudWatch・SQS）と通信する必要があるときは常に VPC エンドポイントを使用してください。2 種類あります：ゲートウェイエンドポイント（S3 と DynamoDB のみ）は完全に無料でルートテーブルエントリのみが必要；インターフェースエンドポイント（他のすべての AWS サービス）は AZ あたり約 $0.01/時間かかりますが、NAT ゲートウェイ経由で $0.045/GB よりも大幅に安い。コスト以外にも、VPC エンドポイントはトラフィックをパブリックインターネットから完全に遠ざけます。",
      },
      tag: { en: "vpc", np: "VPC", jp: "VPC" },
    },
  ],
};
