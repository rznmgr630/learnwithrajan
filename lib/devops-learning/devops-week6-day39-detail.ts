import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Security Groups, Network ACLs (NACLs), and AWS WAF are the three layers of network security in AWS. Security Groups are stateful firewalls attached to ENIs (EC2, RDS, Lambda VPC, etc.) — you define what traffic is allowed IN and the return traffic is automatically allowed. NACLs are stateless firewalls at the subnet boundary — you must explicitly allow both inbound and outbound. WAF operates at Layer 7 and inspects the HTTP payload, blocking SQL injection, XSS, bad bots, and specific IP ranges before traffic reaches your application.",
    np: "Security Group, Network ACL (NACL), र AWS WAF AWS मा network security का तीन layer हुन्। Security Group ENI (EC2, RDS, Lambda VPC, आदि) मा attached stateful firewall हो — तपाईंले कुन traffic IN allow गर्ने define गर्नुहुन्छ र return traffic automatically allowed हुन्छ। NACL subnet boundary मा stateless firewall हो — तपाईंले inbound र outbound दुवै explicitly allow गर्नुपर्छ। WAF ले Layer 7 मा operate गर्छ र HTTP payload inspect गर्छ, SQL injection, XSS, bad bot, र specific IP range लाई application मा पुग्नु अघि block गर्छ।",
    jp: "セキュリティグループ・ネットワーク ACL（NACL）・AWS WAF は AWS のネットワークセキュリティの 3 つの層です。セキュリティグループは ENI（EC2・RDS・Lambda VPC など）にアタッチされたステートフルファイアウォールです — どのトラフィックを受信するかを定義し、返信トラフィックは自動的に許可されます。NACL はサブネット境界のステートレスファイアウォールです — インバウンドとアウトバウンドの両方を明示的に許可する必要があります。WAF はレイヤー 7 で動作し、HTTP ペイロードを検査して、SQL インジェクション・XSS・悪意のあるボット・特定の IP 範囲をアプリケーションに到達する前にブロックします。",
  } as const,
  o2: {
    en: "Today you master the mental model for each layer — when to use which, how rules are evaluated, common misconfigurations that cause outages, and how to design a defence-in-depth network security architecture for a production VPC. You will also configure WAF managed rule groups, rate-based rules, and IP set allow/deny lists.",
    np: "आज तपाईंले प्रत्येक layer को mental model master गर्नुहुनेछ — कहिले कुन प्रयोग गर्ने, rule कसरी evaluate गरिन्छ, outage cause गर्ने common misconfiguration, र production VPC को लागि defence-in-depth network security architecture कसरी design गर्ने। तपाईंले WAF managed rule group, rate-based rule, र IP set allow/deny list पनि configure गर्नुहुनेछ।",
    jp: "今日は各層のメンタルモデルをマスターします — いつどちらを使うか・ルールの評価方法・障害を引き起こす一般的な設定ミス・本番 VPC の多層防御ネットワークセキュリティアーキテクチャの設計方法。また、WAF マネージドルールグループ・レートベースのルール・IP セットの許可/拒否リストを設定します。",
  } as const,
};

export const DEVOPS_DAY_39_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Security Groups vs NACLs — key differences",
        np: "Security Group vs NACL — मुख्य फरक",
        jp: "セキュリティグループと NACL の主な違い",
      },
      blocks: [
        { type: "diagram", id: "devops-sg-nacl-waf" },
        {
          type: "table",
          caption: {
            en: "Security Group vs NACL — statefulness, attachment level, rule evaluation, and when to use each",
            np: "Security Group vs NACL — statefulness, attachment level, rule evaluation, र कहिले प्रयोग गर्ने",
            jp: "セキュリティグループ vs NACL — ステートフル性・アタッチメントレベル・ルール評価・各使用タイミング",
          },
          headers: [
            { en: "Feature", np: "Feature", jp: "機能" },
            { en: "Security Group", np: "Security Group", jp: "セキュリティグループ" },
            { en: "Network ACL", np: "Network ACL", jp: "ネットワーク ACL" },
          ],
          rows: [
            [
              { en: "State", np: "State", jp: "状態" },
              { en: "Stateful — return traffic auto-allowed", np: "Stateful — return traffic auto-allowed", jp: "ステートフル — 返信トラフィックは自動許可" },
              { en: "Stateless — must allow both directions explicitly", np: "Stateless — दुवै direction explicitly allow गर्नुपर्छ", jp: "ステートレス — 両方向を明示的に許可する必要あり" },
            ],
            [
              { en: "Attached to", np: "Attached to", jp: "アタッチ先" },
              { en: "ENI (instance, RDS, ELB, Lambda, ECS task)", np: "ENI (instance, RDS, ELB, Lambda, ECS task)", jp: "ENI（インスタンス・RDS・ELB・Lambda・ECS タスク）" },
              { en: "Subnet (affects all resources in subnet)", np: "Subnet (subnet मा सबै resource affect गर्छ)", jp: "サブネット（サブネット内のすべてのリソースに影響）" },
            ],
            [
              { en: "Rules", np: "Rules", jp: "ルール" },
              { en: "Allow rules only — implicit deny for everything else", np: "Allow rule मात्र — बाँकी सबैको implicit deny", jp: "許可ルールのみ — それ以外はすべて暗黙の拒否" },
              { en: "Allow AND Deny rules — numbered, lowest wins", np: "Allow र Deny rule — numbered, lowest wins", jp: "許可と拒否ルール — 番号付き、最小番号が優先" },
            ],
            [
              { en: "Evaluation order", np: "Evaluation order", jp: "評価順序" },
              { en: "All rules evaluated together; any match = allow", np: "सबै rule सँगै evaluate; कुनै match = allow", jp: "すべてのルールを一緒に評価；いずれかにマッチ = 許可" },
              { en: "Rules evaluated in number order; first match wins", np: "Number order मा evaluate; first match wins", jp: "番号順に評価；最初のマッチが適用" },
            ],
            [
              { en: "Default behaviour", np: "Default behaviour", jp: "デフォルト動作" },
              { en: "Deny all inbound; allow all outbound (default SG differs)", np: "Inbound सब deny; outbound सब allow (default SG फरक)", jp: "すべてのインバウンドを拒否；すべてのアウトバウンドを許可（デフォルト SG は異なる）" },
              { en: "Allow all inbound AND outbound (default NACL)", np: "Inbound र outbound सब allow (default NACL)", jp: "すべてのインバウンドとアウトバウンドを許可（デフォルト NACL）" },
            ],
            [
              { en: "When to use", np: "कहिले प्रयोग गर्ने", jp: "使用タイミング" },
              { en: "Primary control — always configure SGs first", np: "Primary control — हमेशा पहिले SG configure गर्नुहोस्", jp: "主要なコントロール — 常に SG を最初に設定" },
              { en: "Extra subnet-level barrier; block specific IPs/CIDRs fast", np: "Extra subnet-level barrier; specific IP/CIDR छिटो block गर्नुहोस्", jp: "追加のサブネットレベルのバリア；特定の IP/CIDR を素早くブロック" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "The most common NACL misconfiguration: adding an inbound allow rule but forgetting the outbound rule for ephemeral ports (1024–65535). TCP connections from clients use ephemeral source ports — the server's response goes back to a random high port. If your NACL outbound rule only allows 443 and 80, the response never leaves the subnet. Always add an outbound rule allowing TCP 1024–65535 to `0.0.0.0/0` in your application subnets.",
            np: "सबैभन्दा common NACL misconfiguration: inbound allow rule थप्नु तर ephemeral port (1024–65535) को लागि outbound rule बिर्सनु। Client बाट TCP connection ले ephemeral source port प्रयोग गर्छ — server को response random high port मा फर्किन्छ। तपाईंको NACL outbound rule ले 443 र 80 मात्र allow गर्छ भने, response कहिल्यै subnet छाड्दैन। तपाईंको application subnet मा `0.0.0.0/0` मा TCP 1024–65535 allow गर्ने outbound rule हमेशा थप्नुहोस्।",
            jp: "最も一般的な NACL の設定ミス：インバウンドの許可ルールを追加するがエフェメラルポート（1024〜65535）のアウトバウンドルールを忘れる。クライアントからの TCP 接続はエフェメラルソースポートを使用します — サーバーの応答はランダムな高ポートに返ります。NACL のアウトバウンドルールが 443 と 80 のみを許可する場合、応答はサブネットを離れることができません。アプリケーションサブネットの `0.0.0.0/0` への TCP 1024〜65535 を許可するアウトバウンドルールを常に追加してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create and configure Security Groups and NACLs for a 3-tier VPC",
            np: "3-tier VPC को लागि Security Group र NACL create र configure गर्नुहोस्",
            jp: "3 層 VPC のセキュリティグループと NACL の作成と設定",
          },
          code: `VPC_ID="vpc-0abc123"

# ── Security Groups — 3-tier architecture ──

# 1. ALB security group (internet-facing)
ALB_SG=$(aws ec2 create-security-group \
    --group-name prod-alb-sg \
    --description "ALB: allow HTTPS from internet" \
    --vpc-id "$VPC_ID" \
    --query GroupId --output text)

aws ec2 authorize-security-group-ingress \
    --group-id "$ALB_SG" \
    --ip-permissions \
      IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}] \
      IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}]

# 2. App server security group (private subnet)
APP_SG=$(aws ec2 create-security-group \
    --group-name prod-app-sg \
    --description "App: allow port 8080 from ALB SG only" \
    --vpc-id "$VPC_ID" \
    --query GroupId --output text)

# Allow traffic ONLY from ALB SG — not from a CIDR, from the SG itself
aws ec2 authorize-security-group-ingress \
    --group-id "$APP_SG" \
    --ip-permissions \
      "[{\"IpProtocol\":\"tcp\",\"FromPort\":8080,\"ToPort\":8080,\"UserIdGroupPairs\":[{\"GroupId\":\"$ALB_SG\"}]}]"

# 3. RDS security group (data subnet)
RDS_SG=$(aws ec2 create-security-group \
    --group-name prod-rds-sg \
    --description "RDS: allow Postgres from app SG only" \
    --vpc-id "$VPC_ID" \
    --query GroupId --output text)

aws ec2 authorize-security-group-ingress \
    --group-id "$RDS_SG" \
    --ip-permissions \
      "[{\"IpProtocol\":\"tcp\",\"FromPort\":5432,\"ToPort\":5432,\"UserIdGroupPairs\":[{\"GroupId\":\"$APP_SG\"}]}]"

# ── Network ACL — application subnet (extra layer) ──
NACL_ID=$(aws ec2 create-network-acl \
    --vpc-id "$VPC_ID" \
    --query NetworkAcl.NetworkAclId --output text)

# Inbound rules
aws ec2 create-network-acl-entry --network-acl-id "$NACL_ID" --ingress \
    --rule-number 100 --protocol tcp --port-range From=443,To=443 \
    --cidr-block 0.0.0.0/0 --rule-action allow

aws ec2 create-network-acl-entry --network-acl-id "$NACL_ID" --ingress \
    --rule-number 110 --protocol tcp --port-range From=1024,To=65535 \
    --cidr-block 0.0.0.0/0 --rule-action allow

# Block a known bad IP range inbound (lower number = higher priority)
aws ec2 create-network-acl-entry --network-acl-id "$NACL_ID" --ingress \
    --rule-number 50 --protocol -1 \
    --cidr-block 192.0.2.0/24 --rule-action deny

# Outbound rules (stateless — must mirror inbound)
aws ec2 create-network-acl-entry --network-acl-id "$NACL_ID" --egress \
    --rule-number 100 --protocol tcp --port-range From=443,To=443 \
    --cidr-block 0.0.0.0/0 --rule-action allow

aws ec2 create-network-acl-entry --network-acl-id "$NACL_ID" --egress \
    --rule-number 110 --protocol tcp --port-range From=1024,To=65535 \
    --cidr-block 0.0.0.0/0 --rule-action allow

# Associate NACL with subnet
aws ec2 associate-network-acl \
    --network-acl-id "$NACL_ID" \
    --subnet-id subnet-app-1a`,
        },
      ],
    },
    {
      title: {
        en: "AWS WAF — managed rules, rate limiting & IP sets",
        np: "AWS WAF — managed rule, rate limiting र IP set",
        jp: "AWS WAF — マネージドルール・レート制限・IP セット",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "WAF Web ACLs attach to ALB (regional), CloudFront (global, must be in us-east-1), API Gateway, or AppSync. Rules are evaluated in priority order (lower number = higher priority). Each rule can Count (log but allow), Allow, or Block. AWS Managed Rule Groups cover OWASP Top 10, known bad IPs (Amazon IP reputation list), SQL injection, XSS, and more — add them to your WebACL with `OverrideAction: None` to enforce blocking. Rate-based rules automatically block IPs that exceed a threshold in a 5-minute window. Use IP Sets for explicit allow/block lists (your office CIDR, partner IPs).",
            np: "WAF Web ACL ले ALB (regional), CloudFront (global, us-east-1 मा हुनुपर्छ), API Gateway, वा AppSync मा attach हुन्छ। Rule लाई priority order मा evaluate गरिन्छ (lower number = higher priority)। प्रत्येक rule ले Count (log तर allow), Allow, वा Block गर्न सक्छ। AWS Managed Rule Group ले OWASP Top 10, known bad IP (Amazon IP reputation list), SQL injection, XSS, र थप cover गर्छ — blocking enforce गर्न `OverrideAction: None` सहित तपाईंको WebACL मा थप्नुहोस्। Rate-based rule ले 5-minute window मा threshold exceed गर्ने IP लाई automatically block गर्छ। Explicit allow/block list (तपाईंको office CIDR, partner IP) को लागि IP Set प्रयोग गर्नुहोस्।",
            jp: "WAF Web ACL は ALB（リージョナル）・CloudFront（グローバル、us-east-1 である必要あり）・API Gateway・AppSync にアタッチします。ルールは優先度順（小さい番号 = 高い優先度）に評価されます。各ルールはカウント（ログに記録するが許可）・許可・ブロックできます。AWS マネージドルールグループは OWASP Top 10・既知の悪意ある IP（Amazon IP レピュテーションリスト）・SQL インジェクション・XSS などをカバーします — ブロックを強制するために `OverrideAction: None` で WebACL に追加します。レートベースのルールは 5 分間のウィンドウでしきい値を超える IP を自動的にブロックします。明示的な許可/拒否リスト（オフィスの CIDR・パートナー IP）には IP セットを使用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create a WAF WebACL with managed rules, rate limiting, and IP blocking",
            np: "Managed rule, rate limiting, र IP blocking सहित WAF WebACL create गर्नुहोस्",
            jp: "マネージドルール・レート制限・IP ブロックを持つ WAF WebACL の作成",
          },
          code: `# ── Create an IP set for blocked IPs ──
BLOCKED_IPS=$(aws wafv2 create-ip-set \
    --name blocked-ips \
    --scope REGIONAL \
    --ip-address-version IPV4 \
    --addresses "192.0.2.0/24" "198.51.100.0/24" \
    --query 'Summary.{Id:Id,LockToken:LockToken}' --output json)

BLOCKED_IP_ARN=$(aws wafv2 list-ip-sets --scope REGIONAL \
    --query "IPSets[?Name=='blocked-ips'].ARN" --output text)

# ── Create WebACL for ALB ──
aws wafv2 create-web-acl \
    --name prod-alb-waf \
    --scope REGIONAL \
    --default-action Allow={} \
    --rules '[
      {
        "Name": "BlockBadIPs",
        "Priority": 1,
        "Statement": {
          "IPSetReferenceStatement": {"ARN": "'"$BLOCKED_IP_ARN"'"}
        },
        "Action": {"Block": {}},
        "VisibilityConfig": {
          "SampledRequestsEnabled": true,
          "CloudWatchMetricsEnabled": true,
          "MetricName": "BlockBadIPs"
        }
      },
      {
        "Name": "RateLimitRule",
        "Priority": 2,
        "Statement": {
          "RateBasedStatement": {
            "Limit": 2000,
            "AggregateKeyType": "IP"
          }
        },
        "Action": {"Block": {}},
        "VisibilityConfig": {
          "SampledRequestsEnabled": true,
          "CloudWatchMetricsEnabled": true,
          "MetricName": "RateLimitRule"
        }
      },
      {
        "Name": "AWSManagedRulesCommonRuleSet",
        "Priority": 10,
        "Statement": {
          "ManagedRuleGroupStatement": {
            "VendorName": "AWS",
            "Name": "AWSManagedRulesCommonRuleSet"
          }
        },
        "OverrideAction": {"None": {}},
        "VisibilityConfig": {
          "SampledRequestsEnabled": true,
          "CloudWatchMetricsEnabled": true,
          "MetricName": "AWSCommonRules"
        }
      },
      {
        "Name": "AWSManagedRulesSQLiRuleSet",
        "Priority": 20,
        "Statement": {
          "ManagedRuleGroupStatement": {
            "VendorName": "AWS",
            "Name": "AWSManagedRulesSQLiRuleSet"
          }
        },
        "OverrideAction": {"None": {}},
        "VisibilityConfig": {
          "SampledRequestsEnabled": true,
          "CloudWatchMetricsEnabled": true,
          "MetricName": "SQLiRules"
        }
      },
      {
        "Name": "AWSManagedRulesAmazonIpReputationList",
        "Priority": 5,
        "Statement": {
          "ManagedRuleGroupStatement": {
            "VendorName": "AWS",
            "Name": "AWSManagedRulesAmazonIpReputationList"
          }
        },
        "OverrideAction": {"None": {}},
        "VisibilityConfig": {
          "SampledRequestsEnabled": true,
          "CloudWatchMetricsEnabled": true,
          "MetricName": "IpReputationList"
        }
      }
    ]' \
    --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=prod-alb-waf

# ── Associate WAF WebACL with ALB ──
WEBACL_ARN=$(aws wafv2 list-web-acls --scope REGIONAL \
    --query "WebACLs[?Name=='prod-alb-waf'].ARN" --output text)

aws wafv2 associate-web-acl \
    --web-acl-arn "$WEBACL_ARN" \
    --resource-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:loadbalancer/app/prod-alb/abc

# Check WAF metrics in CloudWatch (sampled requests dashboard)
aws wafv2 get-sampled-requests \
    --web-acl-arn "$WEBACL_ARN" \
    --rule-metric-name AWSCommonRules \
    --scope REGIONAL \
    --time-window StartTime=$(date -d '1 hour ago' +%s),EndTime=$(date +%s) \
    --max-items 5`,
        },
      ],
    },
    {
      title: {
        en: "Defence-in-depth — layering SG, NACL & WAF in a production VPC",
        np: "Defence-in-depth — production VPC मा SG, NACL र WAF layering",
        jp: "多層防御 — 本番 VPC での SG・NACL・WAF のレイヤリング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A well-designed production VPC uses all three layers with clear responsibilities. WAF sits in front of ALB and blocks application-layer attacks (SQLi, XSS, bad bots, rate abuse) before they consume compute. Security Groups enforce service-to-service trust: only the ALB SG can talk to the app SG, only the app SG can talk to the RDS SG. NACLs add a subnet-level backstop to quickly block entire IP ranges during an incident without touching SG rules. Never open `0.0.0.0/0` on port 22/3389 in a Security Group — use SSM Session Manager for shell access instead (no inbound port needed).",
            np: "राम्रोसँग design गरिएको production VPC ले स्पष्ट responsibility सहित तीनै layer प्रयोग गर्छ। WAF ले ALB को अगाडि बस्छ र application-layer attack (SQLi, XSS, bad bot, rate abuse) लाई compute consume गर्नु अघि block गर्छ। Security Group ले service-to-service trust enforce गर्छ: ALB SG मात्र app SG सँग कुरा गर्न सक्छ, app SG मात्र RDS SG सँग कुरा गर्न सक्छ। NACL ले SG rule नछुइकन incident को क्रममा entire IP range लाई छिटो block गर्न subnet-level backstop थप्छ। Security Group मा port 22/3389 मा कहिल्यै `0.0.0.0/0` नखोल्नुहोस् — shell access को लागि SSM Session Manager प्रयोग गर्नुहोस् (inbound port आवश्यक छैन)।",
            jp: "適切に設計された本番 VPC は明確な責任を持つ 3 つの層すべてを使用します。WAF は ALB の前に配置され、コンピュートを消費する前にアプリケーション層の攻撃（SQLi・XSS・悪意のあるボット・レート乱用）をブロックします。セキュリティグループはサービス間の信頼を強制します：ALB SG のみがアプリ SG と通信でき、アプリ SG のみが RDS SG と通信できます。NACL は SG ルールに触れることなくインシデント時に IP 範囲全体を素早くブロックするサブネットレベルのバックストップを追加します。セキュリティグループの 22/3389 ポートで `0.0.0.0/0` を開かないでください — シェルアクセスには SSM Session Manager を使用（インバウンドポート不要）。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Defence-in-depth: which layer handles what in a 3-tier VPC",
            np: "Defence-in-depth: 3-tier VPC मा कुन layer ले के handle गर्छ",
            jp: "多層防御：3 層 VPC で各層が担当する内容",
          },
          headers: [
            { en: "Layer", np: "Layer", jp: "層" },
            { en: "Where", np: "कहाँ", jp: "場所" },
            { en: "Blocks", np: "Block गर्छ", jp: "ブロック対象" },
            { en: "Does NOT block", np: "Block गर्दैन", jp: "ブロックしない対象" },
          ],
          rows: [
            [
              { en: "WAF", np: "WAF", jp: "WAF" },
              { en: "In front of ALB / CloudFront", np: "ALB / CloudFront को अगाडि", jp: "ALB / CloudFront の前" },
              { en: "SQLi, XSS, bad bots, high request rates, known malicious IPs", np: "SQLi, XSS, bad bot, high request rate, known malicious IP", jp: "SQLi・XSS・悪意のあるボット・高リクエストレート・既知の悪意ある IP" },
              { en: "Non-HTTP traffic, IP spoofing below L7", np: "Non-HTTP traffic, L7 below IP spoofing", jp: "非 HTTP トラフィック・L7 以下の IP スプーフィング" },
            ],
            [
              { en: "Security Group (ALB)", np: "Security Group (ALB)", jp: "セキュリティグループ（ALB）" },
              { en: "ALB ENI", np: "ALB ENI", jp: "ALB ENI" },
              { en: "All traffic except TCP 443/80 from internet", np: "Internet बाट TCP 443/80 बाहेक सबै traffic", jp: "インターネットからの TCP 443/80 以外のすべてのトラフィック" },
              { en: "Application-layer payloads", np: "Application-layer payload", jp: "アプリケーション層のペイロード" },
            ],
            [
              { en: "Security Group (App)", np: "Security Group (App)", jp: "セキュリティグループ（アプリ）" },
              { en: "EC2 / ECS ENI", np: "EC2 / ECS ENI", jp: "EC2 / ECS ENI" },
              { en: "Any traffic not from ALB SG — even from other instances in the same subnet", np: "ALB SG बाट नभएको कुनै traffic — same subnet मा अन्य instance बाट पनि", jp: "ALB SG からでないすべてのトラフィック — 同じサブネットの他のインスタンスからも" },
              { en: "Application-layer payloads", np: "Application-layer payload", jp: "アプリケーション層のペイロード" },
            ],
            [
              { en: "NACL (App subnet)", np: "NACL (App subnet)", jp: "NACL（アプリサブネット）" },
              { en: "Subnet boundary", np: "Subnet boundary", jp: "サブネット境界" },
              { en: "Specific IP blocks added during incidents; deny rules for known-bad CIDRs", np: "Incident को क्रममा specific IP block; known-bad CIDR को deny rule", jp: "インシデント時に追加した特定の IP ブロック；既知の悪意ある CIDR の拒否ルール" },
              { en: "Application-layer payloads; traffic within the same subnet", np: "Application-layer payload; same subnet भित्र traffic", jp: "アプリケーション層のペイロード；同じサブネット内のトラフィック" },
            ],
            [
              { en: "Security Group (RDS)", np: "Security Group (RDS)", jp: "セキュリティグループ（RDS）" },
              { en: "RDS ENI", np: "RDS ENI", jp: "RDS ENI" },
              { en: "All traffic except port 5432 from App SG — DB is unreachable from internet", np: "App SG बाट port 5432 बाहेक सबै traffic — DB internet बाट unreachable", jp: "アプリ SG からのポート 5432 以外のすべてのトラフィック — DB はインターネットから到達不可" },
              { en: "Application-layer payloads (DB still needs parameterised queries)", np: "Application-layer payload (DB लाई अझै parameterised query चाहिन्छ)", jp: "アプリケーション層のペイロード（DB はパラメータ化クエリが引き続き必要）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Hands-on: secure a 3-tier VPC and test the rules",
        np: "Hands-on: 3-tier VPC secure गर्नुहोस् र rule test गर्नुहोस्",
        jp: "ハンズオン：3 層 VPC を保護してルールをテストする",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create three Security Groups in your existing VPC: `prod-alb-sg` (allow TCP 443/80 from `0.0.0.0/0`), `prod-app-sg` (allow TCP 8080 from `prod-alb-sg` SG ID only), and `prod-rds-sg` (allow TCP 5432 from `prod-app-sg` SG ID only). Verify the rules with `aws ec2 describe-security-groups --group-ids $SG_ID`.",
              np: "तपाईंको existing VPC मा तीन Security Group create गर्नुहोस्: `prod-alb-sg` (`0.0.0.0/0` बाट TCP 443/80 allow), `prod-app-sg` (`prod-alb-sg` SG ID बाट मात्र TCP 8080 allow), र `prod-rds-sg` (`prod-app-sg` SG ID बाट मात्र TCP 5432 allow)। `aws ec2 describe-security-groups --group-ids $SG_ID` सँग rule verify गर्नुहोस्।",
              jp: "既存の VPC に 3 つのセキュリティグループを作成：`prod-alb-sg`（`0.0.0.0/0` からの TCP 443/80 を許可）・`prod-app-sg`（`prod-alb-sg` SG ID からのみ TCP 8080 を許可）・`prod-rds-sg`（`prod-app-sg` SG ID からのみ TCP 5432 を許可）。`aws ec2 describe-security-groups --group-ids $SG_ID` でルールを確認する。",
            },
            {
              en: "Create a custom NACL for your application subnet. Add inbound rules: rule 50 DENY `192.0.2.0/24` (simulated bad IP range), rule 100 ALLOW TCP 443 from everywhere, rule 110 ALLOW TCP 1024-65535 from everywhere. Add matching outbound rules. Associate it with the app subnet.",
              np: "तपाईंको application subnet को लागि custom NACL create गर्नुहोस्। Inbound rule थप्नुहोस्: rule 50 DENY `192.0.2.0/24` (simulated bad IP range), rule 100 ALLOW TCP 443 everywhere बाट, rule 110 ALLOW TCP 1024-65535 everywhere बाट। Matching outbound rule थप्नुहोस्। App subnet सँग associate गर्नुहोस्।",
              jp: "アプリケーションサブネット用のカスタム NACL を作成する。インバウンドルールを追加：ルール 50 DENY `192.0.2.0/24`（模擬的な悪意ある IP 範囲）・ルール 100 ALLOW TCP 443 どこからでも・ルール 110 ALLOW TCP 1024〜65535 どこからでも。対応するアウトバウンドルールを追加。アプリサブネットに関連付ける。",
            },
            {
              en: "Create a WAF WebACL (REGIONAL scope) with at minimum: `AWSManagedRulesCommonRuleSet` (priority 10), `AWSManagedRulesSQLiRuleSet` (priority 20), and a rate-based rule limiting to 1000 requests/5 min per IP (priority 5). Set default action to Allow.",
              np: "कम्तिमा निम्न सहित WAF WebACL (REGIONAL scope) create गर्नुहोस्: `AWSManagedRulesCommonRuleSet` (priority 10), `AWSManagedRulesSQLiRuleSet` (priority 20), र प्रति IP 1000 request/5 min limit गर्ने rate-based rule (priority 5)। Default action Allow set गर्नुहोस्।",
              jp: "少なくとも以下を含む WAF WebACL（REGIONAL スコープ）を作成：`AWSManagedRulesCommonRuleSet`（優先度 10）・`AWSManagedRulesSQLiRuleSet`（優先度 20）・IP ごとに 1000 リクエスト/5 分を制限するレートベースルール（優先度 5）。デフォルトアクションを Allow に設定。",
            },
            {
              en: "Associate the WAF WebACL with your ALB using `aws wafv2 associate-web-acl`. Send a test SQL injection request: `curl -s 'http://ALB-DNS/?id=1+OR+1=1'`. Check WAF sampled requests in the console — it should show a BLOCK from the SQLi rule.",
              np: "`aws wafv2 associate-web-acl` प्रयोग गरी WAF WebACL लाई ALB सँग associate गर्नुहोस्। Test SQL injection request पठाउनुहोस्: `curl -s 'http://ALB-DNS/?id=1+OR+1=1'`। Console मा WAF sampled request check गर्नुहोस् — SQLi rule बाट BLOCK देखिनुपर्छ।",
              jp: "`aws wafv2 associate-web-acl` を使って WAF WebACL を ALB に関連付ける。テスト SQL インジェクションリクエストを送信：`curl -s 'http://ALB-DNS/?id=1+OR+1=1'`。コンソールで WAF のサンプリングされたリクエストを確認 — SQLi ルールからの BLOCK が表示されるはずです。",
            },
            {
              en: "Test the NACL deny rule: launch an EC2 instance, associate it with the app subnet's NACL, and try to `curl` a resource from an IP in the `192.0.2.0/24` range (you can simulate by temporarily adding your own IP as a deny rule to confirm NACL blocks before SG). Restore after testing.",
              np: "NACL deny rule test गर्नुहोस्: EC2 instance launch गर्नुहोस्, app subnet को NACL सँग associate गर्नुहोस्, र `192.0.2.0/24` range को IP बाट resource `curl` गर्ने try गर्नुहोस् (SG अघि NACL block confirm गर्न temporarily आफ्नै IP लाई deny rule को रूपमा थपेर simulate गर्न सक्नुहुन्छ)। Test पछि restore गर्नुहोस्।",
              jp: "NACL の拒否ルールをテスト：EC2 インスタンスを起動し、アプリサブネットの NACL に関連付け、`192.0.2.0/24` 範囲の IP からリソースに `curl` を試みる（SG より前に NACL がブロックすることを確認するために、一時的に自分の IP を拒否ルールとして追加してシミュレートできます）。テスト後に復元する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why can't I connect to my EC2 instance even though port 22 is open in the Security Group?",
        np: "Security Group मा port 22 open भएपनि EC2 instance मा किन connect गर्न सकिँदैन?",
        jp: "セキュリティグループでポート 22 が開いているのに EC2 インスタンスに接続できないのはなぜか？",
      },
      answer: {
        en: "Check in this order: (1) Is the instance in a public subnet with a route to the Internet Gateway? Private subnet instances are not reachable from the internet even with SG open. (2) Does the NACL on the subnet allow inbound TCP 22 AND outbound TCP 1024-65535 (ephemeral ports for the return traffic)? (3) Does the instance have a public IP or Elastic IP? (4) Is the OS-level firewall (iptables/firewalld) blocking the connection?",
        np: "यो order मा check गर्नुहोस्: (1) Instance Internet Gateway मा route भएको public subnet मा छ? SG open भएपनि private subnet instance internet बाट reachable हुँदैन। (2) Subnet को NACL ले inbound TCP 22 र outbound TCP 1024-65535 (return traffic को ephemeral port) allow गर्छ? (3) Instance मा public IP वा Elastic IP छ? (4) OS-level firewall (iptables/firewalld) ले connection block गर्दैछ?",
        jp: "この順序で確認してください：(1) インスタンスはインターネットゲートウェイへのルートを持つパブリックサブネットにありますか？SG が開いていてもプライベートサブネットのインスタンスはインターネットから到達できません。(2) サブネットの NACL はインバウンド TCP 22 とアウトバウンド TCP 1024〜65535（返信トラフィックのエフェメラルポート）を許可していますか？(3) インスタンスにパブリック IP または Elastic IP がありますか？(4) OS レベルのファイアウォール（iptables/firewalld）が接続をブロックしていませんか？",
      },
      tag: { en: "security-groups", np: "Security Group", jp: "セキュリティグループ" },
    },
    {
      question: {
        en: "Can a Security Group reference another Security Group from a different VPC?",
        np: "Security Group ले फरक VPC बाट अर्को Security Group reference गर्न सक्छ?",
        jp: "セキュリティグループは別の VPC の別のセキュリティグループを参照できるか？",
      },
      answer: {
        en: "Only if the VPCs are peered. Without VPC peering (or Transit Gateway), SG rules that reference another SG's ID only work within the same VPC. Across VPC peered connections you can reference the peer account/SG ID. This is the recommended pattern for allowing a Lambda function in VPC A to talk to RDS in VPC B — reference the Lambda SG from the RDS SG inbound rule.",
        np: "VPC peer गरिएको छ भने मात्र। VPC peering (वा Transit Gateway) बिना, अर्को SG को ID reference गर्ने SG rule same VPC भित्र मात्र काम गर्छ। VPC peered connection across तपाईंले peer account/SG ID reference गर्न सक्नुहुन्छ। VPC A मा Lambda function लाई VPC B मा RDS सँग कुरा गर्न allow गर्ने recommended pattern हो — RDS SG inbound rule बाट Lambda SG reference गर्नुहोस्।",
        jp: "VPC がピアリングされている場合のみです。VPC ピアリング（または Transit Gateway）なしでは、別の SG の ID を参照する SG ルールは同じ VPC 内でのみ機能します。VPC ピアリング接続を通じてピアアカウント/SG ID を参照できます。これは VPC A の Lambda 関数が VPC B の RDS と通信できるようにする推奨パターンです — RDS SG のインバウンドルールから Lambda SG を参照します。",
      },
      tag: { en: "security-groups", np: "Security Group", jp: "セキュリティグループ" },
    },
    {
      question: {
        en: "What is the difference between WAF REGIONAL and CLOUDFRONT scope?",
        np: "WAF REGIONAL र CLOUDFRONT scope बीच के फरक छ?",
        jp: "WAF の REGIONAL スコープと CLOUDFRONT スコープの違いは何か？",
      },
      answer: {
        en: "REGIONAL WebACLs attach to resources in a specific AWS region: ALB, API Gateway (REST), AppSync. They are created and managed in the same region as the resource. CLOUDFRONT WebACLs must be created in us-east-1 (regardless of where your CloudFront distribution serves traffic) because CloudFront is a global service that reads WAF configuration from us-east-1. You cannot attach a REGIONAL WebACL to CloudFront or vice versa.",
        np: "REGIONAL WebACL ले specific AWS region मा resource मा attach हुन्छ: ALB, API Gateway (REST), AppSync। यिनीहरू resource जस्तै same region मा create र manage गरिन्छ। CLOUDFRONT WebACL us-east-1 मा create गर्नुपर्छ (CloudFront distribution ले कहाँ traffic serve गर्छ भनेपनि) किनभने CloudFront global service हो जसले us-east-1 बाट WAF configuration read गर्छ। REGIONAL WebACL लाई CloudFront मा वा vice versa attach गर्न सकिँदैन।",
        jp: "REGIONAL WebACL は特定の AWS リージョンのリソースにアタッチします：ALB・API Gateway（REST）・AppSync。リソースと同じリージョンで作成・管理されます。CLOUDFRONT WebACL は CloudFront がトラフィックを配信する場所に関係なく us-east-1 で作成する必要があります — CloudFront は us-east-1 から WAF 設定を読み取るグローバルサービスだからです。REGIONAL WebACL を CloudFront にアタッチすることもその逆もできません。",
      },
      tag: { en: "waf", np: "WAF", jp: "WAF" },
    },
  ],
};
