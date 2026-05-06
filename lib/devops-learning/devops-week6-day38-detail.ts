import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Route 53 is AWS's managed DNS service — it translates domain names into IP addresses, routes traffic based on health, latency, geography, and weights, and integrates natively with every AWS resource via Alias records. CloudFront is AWS's global CDN — it caches your content at 450+ edge locations worldwide, dramatically reducing latency for end users and offloading origin traffic. Together they form the front door of every production AWS application.",
    np: "Route 53 AWS को managed DNS service हो — यसले domain name लाई IP address मा translate गर्छ, health, latency, geography, र weight मा आधारित traffic route गर्छ, र Alias record मार्फत हरेक AWS resource सँग natively integrate गर्छ। CloudFront AWS को global CDN हो — यसले विश्वभरका 450+ edge location मा content cache गर्छ, end user को लागि latency नाटकीय रूपमा घटाउँछ र origin traffic offload गर्छ। सँगै तिनीहरूले हरेक production AWS application को front door बनाउँछन्।",
    jp: "Route 53 は AWS のマネージド DNS サービスです — ドメイン名を IP アドレスに変換し、健全性・レイテンシー・地理・重みに基づいてトラフィックをルーティングし、Alias レコードを通じてすべての AWS リソースとネイティブに統合します。CloudFront は AWS のグローバル CDN です — 世界中の 450 以上のエッジロケーションにコンテンツをキャッシュし、エンドユーザーのレイテンシーを大幅に削減してオリジントラフィックをオフロードします。合わせてすべての本番 AWS アプリケーションのフロントドアを形成します。",
  } as const,
  o2: {
    en: "Today you learn Route 53 record types (A, AAAA, CNAME, Alias, MX, TXT), routing policies (simple, weighted, latency, failover, geolocation, geoproximity), health checks, and how to delegate a subdomain. On the CloudFront side you will configure distributions, origins (S3, ALB, custom HTTP), cache behaviors, cache policies, origin request policies, signed URLs, and custom error pages.",
    np: "आज तपाईंले Route 53 record type (A, AAAA, CNAME, Alias, MX, TXT), routing policy (simple, weighted, latency, failover, geolocation, geoproximity), health check, र subdomain delegate कसरी गर्ने सिक्नुहुनेछ। CloudFront side मा तपाईंले distribution, origin (S3, ALB, custom HTTP), cache behavior, cache policy, origin request policy, signed URL, र custom error page configure गर्नुहुनेछ।",
    jp: "今日は Route 53 のレコードタイプ（A・AAAA・CNAME・Alias・MX・TXT）・ルーティングポリシー（シンプル・重み付き・レイテンシー・フェイルオーバー・ジオロケーション・ジオプロキシミティ）・ヘルスチェック・サブドメインの委任方法を学びます。CloudFront 側では、ディストリビューション・オリジン（S3・ALB・カスタム HTTP）・キャッシュビヘイビア・キャッシュポリシー・オリジンリクエストポリシー・署名付き URL・カスタムエラーページを設定します。",
  } as const,
};

export const DEVOPS_DAY_38_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Route 53 — record types & routing policies",
        np: "Route 53 — record type र routing policy",
        jp: "Route 53 — レコードタイプとルーティングポリシー",
      },
      blocks: [
        { type: "diagram", id: "devops-route53-cloudfront" },
        {
          type: "paragraph",
          text: {
            en: "Route 53 is a global service (not region-scoped). A Hosted Zone is a container for DNS records for a domain. Two types: Public (resolves on the internet) and Private (resolves inside a VPC). The key record to know is the Alias record — unlike CNAME, Alias can point to the zone apex (example.com, not just sub.example.com), resolves the AWS resource's current IP automatically, and is free. Always prefer Alias over CNAME for AWS resources (ALB, CloudFront, API Gateway, S3 website endpoint, Elastic IP).",
            np: "Route 53 global service हो (region-scoped होइन)। Hosted Zone domain को DNS record को लागि container हो। दुई type: Public (internet मा resolve) र Private (VPC भित्र resolve)। जान्नु पर्ने key record Alias record हो — CNAME भन्दा फरक, Alias ले zone apex (example.com, sub.example.com मात्र होइन) लाई point गर्न सक्छ, AWS resource को current IP automatically resolve गर्छ, र free हो। AWS resource (ALB, CloudFront, API Gateway, S3 website endpoint, Elastic IP) को लागि CNAME भन्दा Alias लाई हमेशा prefer गर्नुहोस्।",
            jp: "Route 53 はグローバルサービスです（リージョンスコープではありません）。ホストゾーンはドメインの DNS レコードのコンテナです。2 種類：パブリック（インターネット上で解決）とプライベート（VPC 内で解決）。知っておくべき主要なレコードは Alias レコードです — CNAME とは異なり、Alias はゾーンの頂点（sub.example.com だけでなく example.com）を指すことができ、AWS リソースの現在の IP を自動的に解決し、無料です。AWS リソース（ALB・CloudFront・API Gateway・S3 ウェブサイトエンドポイント・Elastic IP）には常に CNAME より Alias を優先してください。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Route 53 routing policies — when to use each and how they work",
            np: "Route 53 routing policy — कहिले प्रयोग गर्ने र कसरी काम गर्छ",
            jp: "Route 53 ルーティングポリシー — それぞれの使用タイミングと仕組み",
          },
          headers: [
            { en: "Policy", np: "Policy", jp: "ポリシー" },
            { en: "How It Works", np: "कसरी काम गर्छ", jp: "仕組み" },
            { en: "Use Case", np: "Use Case", jp: "ユースケース" },
            { en: "Health Check?", np: "Health Check?", jp: "ヘルスチェック？" },
          ],
          rows: [
            [
              { en: "Simple", np: "Simple", jp: "シンプル" },
              { en: "Returns one or more values; client picks randomly if multiple", np: "एक वा बढी value return गर्छ; multiple भएमा client randomly pick गर्छ", jp: "1 つ以上の値を返す；複数の場合クライアントがランダムに選ぶ" },
              { en: "Single resource, no failover needed", np: "Single resource, failover आवश्यक छैन", jp: "単一リソース、フェイルオーバー不要" },
              { en: "No", np: "छैन", jp: "なし" },
            ],
            [
              { en: "Weighted", np: "Weighted", jp: "重み付き" },
              { en: "Routes % of traffic to each endpoint by weight (0–255)", np: "Weight (0–255) द्वारा प्रत्येक endpoint मा % traffic route गर्छ", jp: "重み（0〜255）によって各エンドポイントに % のトラフィックをルーティング" },
              { en: "Canary deploys, A/B testing, gradual traffic shifting", np: "Canary deploy, A/B testing, gradual traffic shifting", jp: "カナリアデプロイ・A/B テスト・段階的なトラフィック移行" },
              { en: "Yes", np: "छ", jp: "あり" },
            ],
            [
              { en: "Latency", np: "Latency", jp: "レイテンシー" },
              { en: "Routes to the region with lowest measured latency for the user", np: "User को लागि सबैभन्दा कम measured latency भएको region मा route गर्छ", jp: "ユーザーに対して最も低いレイテンシーのリージョンにルーティング" },
              { en: "Multi-region deployments — serve users from nearest region", np: "Multi-region deployment — निकटतम region बाट user serve गर्नुहोस्", jp: "マルチリージョンデプロイ — 最寄りのリージョンからユーザーにサービス提供" },
              { en: "Yes", np: "छ", jp: "あり" },
            ],
            [
              { en: "Failover", np: "Failover", jp: "フェイルオーバー" },
              { en: "Active/passive: routes to secondary only when primary health check fails", np: "Active/passive: primary health check fail भएमा मात्र secondary मा route गर्छ", jp: "アクティブ/パッシブ：プライマリのヘルスチェック失敗時のみセカンダリにルーティング" },
              { en: "DR setup — warm standby in another region", np: "DR setup — अर्को region मा warm standby", jp: "DR 設定 — 別リージョンのウォームスタンバイ" },
              { en: "Required", np: "Required", jp: "必須" },
            ],
            [
              { en: "Geolocation", np: "Geolocation", jp: "ジオロケーション" },
              { en: "Routes based on user's country or continent; default record for no match", np: "User को country वा continent मा आधारित route गर्छ; no match को लागि default record", jp: "ユーザーの国または大陸に基づいてルーティング；マッチなしのデフォルトレコード" },
              { en: "Content localization, compliance (GDPR data residency)", np: "Content localization, compliance (GDPR data residency)", jp: "コンテンツのローカライゼーション・コンプライアンス（GDPR データ居住）" },
              { en: "Yes", np: "छ", jp: "あり" },
            ],
            [
              { en: "Geoproximity", np: "Geoproximity", jp: "ジオプロキシミティ" },
              { en: "Routes based on geographic distance; bias value shifts the boundary", np: "Geographic distance मा आधारित route गर्छ; bias value ले boundary shift गर्छ", jp: "地理的距離に基づいてルーティング；バイアス値で境界を移動" },
              { en: "Traffic Manager-style control, requires Route 53 Traffic Flow", np: "Traffic Manager-style control, Route 53 Traffic Flow आवश्यक", jp: "Traffic Manager スタイルの制御、Route 53 Traffic Flow が必要" },
              { en: "Yes", np: "छ", jp: "あり" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Create a hosted zone, Alias record, weighted routing, and health check",
            np: "Hosted zone, Alias record, weighted routing, र health check create गर्नुहोस्",
            jp: "ホストゾーン・Alias レコード・重み付きルーティング・ヘルスチェックの作成",
          },
          code: `# ── Create a public hosted zone ──
ZONE_ID=$(aws route53 create-hosted-zone \
    --name example.com \
    --caller-reference "$(date +%s)" \
    --query 'HostedZone.Id' \
    --output text | cut -d/ -f3)

echo "Zone ID: $ZONE_ID"

# Note the 4 NS records AWS assigns — update these at your registrar

# ── Create an Alias record pointing apex domain → ALB ──
aws route53 change-resource-record-sets \
    --hosted-zone-id "$ZONE_ID" \
    --change-batch '{
      "Changes": [{
        "Action": "UPSERT",
        "ResourceRecordSet": {
          "Name": "example.com",
          "Type": "A",
          "AliasTarget": {
            "HostedZoneId": "Z35SXDOTRQ7X7K",
            "DNSName": "prod-alb-1234567890.us-east-1.elb.amazonaws.com",
            "EvaluateTargetHealth": true
          }
        }
      }]
    }'

# ── Health check on the primary endpoint ──
HC_ID=$(aws route53 create-health-check \
    --caller-reference "$(date +%s)" \
    --health-check-config '{
      "Type": "HTTPS",
      "FullyQualifiedDomainName": "example.com",
      "ResourcePath": "/health",
      "RequestInterval": 30,
      "FailureThreshold": 3
    }' \
    --query 'HealthCheck.Id' --output text)

# ── Weighted routing — send 90% to v1, 10% to v2 (canary deploy) ──
aws route53 change-resource-record-sets \
    --hosted-zone-id "$ZONE_ID" \
    --change-batch '{
      "Changes": [
        {
          "Action": "UPSERT",
          "ResourceRecordSet": {
            "Name": "api.example.com",
            "Type": "A",
            "SetIdentifier": "v1-primary",
            "Weight": 90,
            "AliasTarget": {
              "HostedZoneId": "Z35SXDOTRQ7X7K",
              "DNSName": "v1-alb.us-east-1.elb.amazonaws.com",
              "EvaluateTargetHealth": true
            }
          }
        },
        {
          "Action": "UPSERT",
          "ResourceRecordSet": {
            "Name": "api.example.com",
            "Type": "A",
            "SetIdentifier": "v2-canary",
            "Weight": 10,
            "AliasTarget": {
              "HostedZoneId": "Z35SXDOTRQ7X7K",
              "DNSName": "v2-alb.us-east-1.elb.amazonaws.com",
              "EvaluateTargetHealth": true
            }
          }
        }
      ]
    }'

# ── Verify DNS resolution ──
dig +short example.com @8.8.8.8
aws route53 list-resource-record-sets \
    --hosted-zone-id "$ZONE_ID" \
    --query "ResourceRecordSets[*].{Name:Name,Type:Type}"`,
        },
      ],
    },
    {
      title: {
        en: "CloudFront — distributions, cache behaviors & policies",
        np: "CloudFront — distribution, cache behavior र policy",
        jp: "CloudFront — ディストリビューション・キャッシュビヘイビア・ポリシー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A CloudFront distribution has one or more origins (where content lives — S3, ALB, API Gateway, custom HTTP server) and one or more cache behaviors (path patterns that map to an origin). The default behavior (`*`) matches everything not matched by a more specific pattern. Cache Policy defines what CloudFront caches on and for how long (TTL). Origin Request Policy defines what headers, cookies, and query strings are forwarded to the origin. Managed policies exist for common combinations — use `CachingOptimized` for S3 static assets, `CachingDisabled` for dynamic API responses.",
            np: "CloudFront distribution मा एक वा बढी origin (content कहाँ छ — S3, ALB, API Gateway, custom HTTP server) र एक वा बढी cache behavior (origin मा map हुने path pattern) हुन्छ। Default behavior (`*`) ले थप specific pattern ले match नगरेका सबैथोक match गर्छ। Cache Policy ले CloudFront ले के cache गर्छ र कति समयसम्म (TTL) define गर्छ। Origin Request Policy ले origin मा कुन header, cookie, र query string forward गरिन्छ define गर्छ। Common combination को लागि Managed policy छ — S3 static asset को लागि `CachingOptimized`, dynamic API response को लागि `CachingDisabled` प्रयोग गर्नुहोस्।",
            jp: "CloudFront ディストリビューションには 1 つ以上のオリジン（コンテンツが存在する場所 — S3・ALB・API Gateway・カスタム HTTP サーバー）と 1 つ以上のキャッシュビヘイビア（オリジンにマッピングされるパスパターン）があります。デフォルトビヘイビア（`*`）はより具体的なパターンにマッチしないすべてにマッチします。キャッシュポリシーは CloudFront が何をキャッシュし、どのくらいの時間（TTL）保持するかを定義します。オリジンリクエストポリシーはどのヘッダー・クッキー・クエリ文字列をオリジンに転送するかを定義します。一般的な組み合わせにはマネージドポリシーがあります — S3 静的アセットには `CachingOptimized`、動的 API レスポンスには `CachingDisabled` を使用してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create a CloudFront distribution with S3 origin and ALB API origin",
            np: "S3 origin र ALB API origin सहित CloudFront distribution create गर्नुहोस्",
            jp: "S3 オリジンと ALB API オリジンを持つ CloudFront ディストリビューションの作成",
          },
          code: `# ── CloudFront distribution: S3 for static assets, ALB for /api/* ──
# Use Origin Access Control (OAC) so the S3 bucket stays private
OAC_ID=$(aws cloudfront create-origin-access-control \
    --origin-access-control-config '{
      "Name": "prod-s3-oac",
      "OriginAccessControlOriginType": "s3",
      "SigningBehavior": "always",
      "SigningProtocol": "sigv4",
      "Description": "OAC for prod static assets"
    }' \
    --query 'OriginAccessControl.Id' --output text)

# Create the distribution
DIST=$(aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "prod-dist-1",
  "Comment": "Production distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 2,
    "Items": [
      {
        "Id": "s3-static",
        "DomainName": "my-static-assets.s3.us-east-1.amazonaws.com",
        "S3OriginConfig": {"OriginAccessIdentity": ""},
        "OriginAccessControlId": "'"$OAC_ID"'"
      },
      {
        "Id": "alb-api",
        "DomainName": "prod-alb-1234567890.us-east-1.elb.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "https-only",
          "OriginSSLProtocols": {"Quantity":1,"Items":["TLSv1.2"]}
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-static",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true,
    "AllowedMethods": {"Quantity":2,"Items":["GET","HEAD"],"CachedMethods":{"Quantity":2,"Items":["GET","HEAD"]}}
  },
  "CacheBehaviors": {
    "Quantity": 1,
    "Items": [{
      "PathPattern": "/api/*",
      "TargetOriginId": "alb-api",
      "ViewerProtocolPolicy": "https-only",
      "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
      "OriginRequestPolicyId": "b689b0a8-53d0-40ab-baf2-68738e2966ac",
      "AllowedMethods": {"Quantity":7,"Items":["GET","HEAD","OPTIONS","PUT","POST","PATCH","DELETE"],"CachedMethods":{"Quantity":2,"Items":["GET","HEAD"]}}
    }]
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{
      "ErrorCode": 403,
      "ResponsePagePath": "/index.html",
      "ResponseCode": "200",
      "ErrorCachingMinTTL": 10
    }]
  },
  "Aliases": {"Quantity":1,"Items":["www.example.com"]},
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/abc-123",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "Enabled": true,
  "HttpVersion": "http2and3",
  "PriceClass": "PriceClass_100"
}')

DIST_ID=$(echo "$DIST" | jq -r '.Distribution.Id')
DIST_DOMAIN=$(echo "$DIST" | jq -r '.Distribution.DomainName')
echo "Distribution: $DIST_ID  Domain: $DIST_DOMAIN"

# Point www.example.com Alias record at CloudFront
aws route53 change-resource-record-sets \
    --hosted-zone-id "$ZONE_ID" \
    --change-batch '{
      "Changes": [{
        "Action": "UPSERT",
        "ResourceRecordSet": {
          "Name": "www.example.com",
          "Type": "A",
          "AliasTarget": {
            "HostedZoneId": "Z2FDTNDATAQYW2",
            "DNSName": "'"$DIST_DOMAIN"'",
            "EvaluateTargetHealth": false
          }
        }
      }]
    }'

# Invalidate cached files after a deploy (charges $0.005 per path beyond free tier)
aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/index.html" "/static/app.*.js" "/*"`,
        },
      ],
    },
    {
      title: {
        en: "CloudFront security — HTTPS, OAC, signed URLs & WAF",
        np: "CloudFront security — HTTPS, OAC, signed URL र WAF",
        jp: "CloudFront セキュリティ — HTTPS・OAC・署名付き URL・WAF",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Origin Access Control (OAC) replaces the older Origin Access Identity (OAI). It lets CloudFront sign requests to S3 with SigV4, keeping the bucket completely private. Add a bucket policy that allows `s3:GetObject` only when the principal is the CloudFront service with your specific distribution. Signed URLs grant time-limited access to a single object — useful for paid video streaming or private file downloads. Signed Cookies grant access to multiple objects in a path. Both require creating a CloudFront Key Group. Attach AWS WAF (Web Application Firewall) to the distribution to block common web attacks (SQLi, XSS, rate limiting) before they reach your origin.",
            np: "Origin Access Control (OAC) ले पुरानो Origin Access Identity (OAI) replace गर्छ। यसले CloudFront लाई S3 मा SigV4 सँग request sign गर्न दिन्छ, bucket लाई completely private राख्छ। Principal CloudFront service हो र तपाईंको specific distribution हो भएमा मात्र `s3:GetObject` allow गर्ने bucket policy थप्नुहोस्। Signed URL ले single object मा time-limited access grant गर्छ — paid video streaming वा private file download का लागि useful। Signed Cookie ले path मा multiple object मा access grant गर्छ। दुवैलाई CloudFront Key Group create गर्न आवश्यक छ। Origin मा पुग्नु अघि common web attack (SQLi, XSS, rate limiting) block गर्न distribution मा AWS WAF attach गर्नुहोस्।",
            jp: "Origin Access Control（OAC）は古い Origin Access Identity（OAI）を置き換えます。CloudFront が SigV4 で S3 へのリクエストに署名できるようにし、バケットを完全にプライベートに保ちます。プリンシパルが特定のディストリビューションを持つ CloudFront サービスである場合のみ `s3:GetObject` を許可するバケットポリシーを追加します。署名付き URL は単一オブジェクトへの時間制限付きアクセスを付与します — 有料動画ストリーミングやプライベートファイルダウンロードに便利。署名付き Cookie はパス内の複数オブジェクトへのアクセスを付与します。どちらも CloudFront キーグループの作成が必要です。オリジンに届く前に一般的なウェブ攻撃（SQLi・XSS・レート制限）をブロックするためにディストリビューションに AWS WAF をアタッチします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Lock down S3 with OAC bucket policy and generate a signed URL",
            np: "OAC bucket policy सँग S3 lock down गर्नुहोस् र signed URL generate गर्नुहोस्",
            jp: "OAC バケットポリシーで S3 をロックダウンし署名付き URL を生成する",
          },
          code: `# ── S3 bucket policy — allow CloudFront OAC only ──
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

aws s3api put-bucket-policy \
    --bucket my-static-assets \
    --policy '{
      "Version": "2012-10-17",
      "Statement": [{
        "Sid": "AllowCloudFrontOAC",
        "Effect": "Allow",
        "Principal": {"Service": "cloudfront.amazonaws.com"},
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::my-static-assets/*",
        "Condition": {
          "StringEquals": {
            "AWS:SourceArn": "arn:aws:cloudfront::'"$ACCOUNT_ID"':distribution/'"$DIST_ID"'"
          }
        }
      }]
    }'

# Block ALL public access on the bucket
aws s3api put-public-access-block \
    --bucket my-static-assets \
    --public-access-block-configuration \
      BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# ── Generate a CloudFront Signed URL (Python / boto3) ──
# Prerequisites: create a CloudFront key pair and a Key Group in the console,
# download the private key (.pem) and note the Key Pair ID.
from datetime import datetime, timedelta
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
import base64, json

def sign_url(url: str, key_id: str, private_key_pem: bytes, expires_in_seconds: int = 3600) -> str:
    expire_time = int((datetime.utcnow() + timedelta(seconds=expires_in_seconds)).timestamp())
    policy = json.dumps({
        "Statement": [{
            "Resource": url,
            "Condition": {"DateLessThan": {"AWS:EpochTime": expire_time}}
        }]
    }, separators=(',', ':'))

    private_key = serialization.load_pem_private_key(private_key_pem, password=None)
    signature = private_key.sign(policy.encode(), padding.PKCS1v15(), hashes.SHA1())
    encoded_sig = base64.b64encode(signature).decode().replace('+', '-').replace('=', '_').replace('/', '~')

    return f"{url}?Policy={base64.b64encode(policy.encode()).decode()}&Signature={encoded_sig}&Key-Pair-Id={key_id}"

# ── Attach AWS WAF to CloudFront (WebACL must be in us-east-1) ──
WEB_ACL_ARN=$(aws wafv2 create-web-acl \
    --name prod-cloudfront-acl \
    --scope CLOUDFRONT \
    --region us-east-1 \
    --default-action Allow={} \
    --rules '[
      {
        "Name": "AWSManagedRulesCommonRuleSet",
        "Priority": 1,
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
          "MetricName": "CommonRuleSet"
        }
      }
    ]' \
    --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=prod-cf-acl \
    --query 'Summary.ARN' --output text)

# Associate WebACL with the distribution (update distribution config)
# Set WebAclId in the distribution config to $WEB_ACL_ARN`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: static site behind CloudFront with Route 53",
        np: "Hands-on: Route 53 सहित CloudFront पछाडि static site",
        jp: "ハンズオン：Route 53 と CloudFront の背後の静的サイト",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create an S3 bucket named after your domain (e.g. `www.example.com`). Block all public access. Upload a simple `index.html` and a `404.html`. Do NOT enable static website hosting on the bucket — you will serve via CloudFront OAC instead.",
              np: "तपाईंको domain (जस्तै `www.example.com`) पछि नाम राखिएको S3 bucket create गर्नुहोस्। सबै public access block गर्नुहोस्। एउटा simple `index.html` र `404.html` upload गर्नुहोस्। Bucket मा static website hosting enable नगर्नुहोस् — CloudFront OAC मार्फत serve गर्नुहुनेछ।",
              jp: "ドメイン（例：`www.example.com`）にちなんだ名前の S3 バケットを作成する。パブリックアクセスをすべてブロック。シンプルな `index.html` と `404.html` をアップロード。バケットの静的ウェブサイトホスティングを有効にしない — 代わりに CloudFront OAC 経由で配信します。",
            },
            {
              en: "Create a CloudFront Origin Access Control and a distribution pointing to the S3 bucket. Set the default root object to `index.html`. Add a custom error response: error code 403 → response path `/index.html` (needed for SPA routing). Set price class to `PriceClass_100` (US/Europe only) to minimize cost.",
              np: "CloudFront Origin Access Control र S3 bucket point गर्ने distribution create गर्नुहोस्। Default root object `index.html` set गर्नुहोस्। Custom error response थप्नुहोस्: error code 403 → response path `/index.html` (SPA routing को लागि आवश्यक)। Cost minimize गर्न price class `PriceClass_100` (US/Europe only) set गर्नुहोस्।",
              jp: "CloudFront Origin Access Control と S3 バケットを指すディストリビューションを作成する。デフォルトのルートオブジェクトを `index.html` に設定。カスタムエラーレスポンスを追加：エラーコード 403 → レスポンスパス `/index.html`（SPA ルーティングに必要）。コストを最小化するためにプライスクラスを `PriceClass_100`（US/ヨーロッパのみ）に設定。",
            },
            {
              en: "Apply the S3 bucket policy allowing `s3:GetObject` from the CloudFront service with a condition on `AWS:SourceArn` matching your distribution ARN. Confirm you can access the distribution's `.cloudfront.net` domain and receive your HTML but a direct S3 URL returns 403.",
              np: "Distribution ARN match गर्ने `AWS:SourceArn` condition सहित CloudFront service बाट `s3:GetObject` allow गर्ने S3 bucket policy apply गर्नुहोस्। Distribution को `.cloudfront.net` domain access गर्न र HTML receive गर्न सक्नुहुन्छ तर direct S3 URL ले 403 return गर्छ confirm गर्नुहोस्।",
              jp: "ディストリビューション ARN にマッチする `AWS:SourceArn` の条件で CloudFront サービスからの `s3:GetObject` を許可する S3 バケットポリシーを適用する。ディストリビューションの `.cloudfront.net` ドメインにアクセスして HTML を受信できるが、S3 の直接 URL は 403 を返すことを確認する。",
            },
            {
              en: "Create a Route 53 public hosted zone for your domain. Add an Alias A record for `www.example.com` pointing to the CloudFront distribution (Hosted Zone ID for CloudFront is always `Z2FDTNDATAQYW2`). Update your domain registrar's NS records to use the Route 53 nameservers.",
              np: "तपाईंको domain को लागि Route 53 public hosted zone create गर्नुहोस्। CloudFront distribution point गर्ने `www.example.com` को लागि Alias A record थप्नुहोस् (CloudFront को Hosted Zone ID हमेशा `Z2FDTNDATAQYW2` हो)। Route 53 nameserver प्रयोग गर्न domain registrar को NS record update गर्नुहोस्।",
              jp: "ドメインの Route 53 パブリックホストゾーンを作成する。CloudFront ディストリビューションを指す `www.example.com` の Alias A レコードを追加（CloudFront のホストゾーン ID は常に `Z2FDTNDATAQYW2`）。Route 53 のネームサーバーを使用するようにドメインレジストラの NS レコードを更新する。",
            },
            {
              en: "Upload a new version of `index.html` to S3 and run an invalidation for `/index.html` using `aws cloudfront create-invalidation`. Confirm the updated file is served within seconds.",
              np: "S3 मा `index.html` को नयाँ version upload गर्नुहोस् र `aws cloudfront create-invalidation` प्रयोग गरी `/index.html` को लागि invalidation run गर्नुहोस्। Updated file seconds भित्र serve भएको confirm गर्नुहोस्।",
              jp: "S3 に `index.html` の新しいバージョンをアップロードし、`aws cloudfront create-invalidation` を使って `/index.html` のインバリデーションを実行する。数秒以内に更新されたファイルが配信されることを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between CNAME and Alias in Route 53?",
        np: "Route 53 मा CNAME र Alias बीच के फरक छ?",
        jp: "Route 53 の CNAME と Alias の違いは何か？",
      },
      answer: {
        en: "CNAME cannot be used at the zone apex (example.com) — only on subdomains. Alias is Route 53-specific, works at the apex, resolves the AWS resource's IP automatically (no extra lookup), and is free. Always use Alias for AWS resources. CNAME adds an extra DNS lookup and costs $0.40/million queries.",
        np: "CNAME लाई zone apex (example.com) मा प्रयोग गर्न सकिँदैन — subdomain मा मात्र। Alias Route 53-specific हो, apex मा काम गर्छ, AWS resource को IP automatically resolve गर्छ (extra lookup छैन), र free हो। AWS resource का लागि हमेशा Alias प्रयोग गर्नुहोस्। CNAME ले extra DNS lookup थप्छ र $0.40/million query cost लाग्छ।",
        jp: "CNAME はゾーンの頂点（example.com）では使用できません — サブドメインのみです。Alias は Route 53 固有で、頂点で動作し、AWS リソースの IP を自動的に解決し（追加のルックアップなし）、無料です。AWS リソースには常に Alias を使用してください。CNAME は追加の DNS ルックアップを追加し、$0.40/百万クエリかかります。",
      },
      tag: { en: "route53", np: "Route 53", jp: "Route 53" },
    },
    {
      question: {
        en: "How do I force HTTPS on CloudFront?",
        np: "CloudFront मा HTTPS कसरी force गर्ने?",
        jp: "CloudFront で HTTPS を強制するには？",
      },
      answer: {
        en: "Set `ViewerProtocolPolicy` to `redirect-to-https` on the cache behavior. This makes CloudFront redirect any HTTP request to HTTPS automatically. Also set `MinimumProtocolVersion` to `TLSv1.2_2021` in the viewer certificate config to disable old TLS versions. Your ACM certificate must be in `us-east-1` regardless of where your origin is — CloudFront is a global service that only reads ACM certificates from us-east-1.",
        np: "Cache behavior मा `ViewerProtocolPolicy` लाई `redirect-to-https` set गर्नुहोस्। यसले CloudFront लाई कुनै HTTP request लाई automatically HTTPS मा redirect गराउँछ। पुरानो TLS version disable गर्न viewer certificate config मा `MinimumProtocolVersion` लाई `TLSv1.2_2021` मा set गर्नुहोस्। तपाईंको origin कहाँ छ भनेपनि ACM certificate `us-east-1` मा हुनुपर्छ — CloudFront global service हो जसले us-east-1 बाट मात्र ACM certificate read गर्छ।",
        jp: "キャッシュビヘイビアで `ViewerProtocolPolicy` を `redirect-to-https` に設定します。これにより CloudFront はすべての HTTP リクエストを自動的に HTTPS にリダイレクトします。古い TLS バージョンを無効にするためにビューア証明書の設定で `MinimumProtocolVersion` を `TLSv1.2_2021` に設定してください。オリジンがどこにあっても ACM 証明書は `us-east-1` に必要です — CloudFront は us-east-1 の ACM 証明書のみを読み取るグローバルサービスです。",
      },
      tag: { en: "cloudfront", np: "CloudFront", jp: "CloudFront" },
    },
    {
      question: {
        en: "When should I invalidate CloudFront cache vs using versioned file names?",
        np: "CloudFront cache invalidate गर्ने वा versioned file name प्रयोग गर्ने — कहिले?",
        jp: "CloudFront キャッシュを無効化すべき時とバージョン付きファイル名を使う時の違いは？",
      },
      answer: {
        en: "Prefer versioned file names (content hashing in build tools like Vite/Webpack — `app.3f2a1b.js`) over invalidations. With versioned names, old and new files coexist so no cache purge is needed — the new HTML references the new asset filenames. Invalidations cost $0.005 per path (first 1,000/month free) and can take 1-5 minutes to propagate. Invalidate only for files that cannot be versioned, like `index.html` itself.",
        np: "Invalidation भन्दा versioned file name (Vite/Webpack जस्ता build tool मा content hashing — `app.3f2a1b.js`) prefer गर्नुहोस्। Versioned name सँग, पुरानो र नयाँ file coexist गर्छन् त्यसैले cache purge आवश्यक छैन — नयाँ HTML ले नयाँ asset filename reference गर्छ। Invalidation ले प्रति path $0.005 cost लाग्छ (पहिलो 1,000/month free) र propagate हुन 1-5 मिनेट लाग्न सक्छ। `index.html` जस्तै version गर्न नसकिने file को लागि मात्र invalidate गर्नुहोस्।",
        jp: "インバリデーションよりバージョン付きファイル名（Vite/Webpack などのビルドツールのコンテンツハッシング — `app.3f2a1b.js`）を優先してください。バージョン付き名前では、古いファイルと新しいファイルが共存するのでキャッシュの削除は不要です — 新しい HTML が新しいアセットのファイル名を参照します。インバリデーションはパスごとに $0.005 かかります（最初の 1,000/月は無料）で、伝播に 1〜5 分かかる場合があります。`index.html` 自体のようにバージョン管理できないファイルのみインバリデートしてください。",
      },
      tag: { en: "cloudfront", np: "CloudFront", jp: "CloudFront" },
    },
  ],
};
