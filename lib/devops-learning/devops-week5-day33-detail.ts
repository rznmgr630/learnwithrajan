import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "S3 (Simple Storage Service) is the backbone of AWS data storage. It stores virtually unlimited objects, serves static websites, acts as the source for CloudFront CDN, holds Terraform state, stores Lambda deployment packages, and backs up every database in your architecture. Understanding S3's data model, security model, and cost drivers is essential for every DevOps engineer.",
    np: "S3 (Simple Storage Service) AWS data storage को backbone हो। यसले virtually unlimited object store गर्छ, static website serve गर्छ, CloudFront CDN को source को रूपमा काम गर्छ, Terraform state राख्छ, Lambda deployment package store गर्छ, र तपाईंको architecture मा हरेक database backup गर्छ। S3 को data model, security model, र cost driver बुझ्नु हरेक DevOps engineer का लागि आवश्यक छ।",
    jp: "S3（Simple Storage Service）は AWS データストレージの根幹です。事実上無制限のオブジェクトを保存し、静的ウェブサイトを配信し、CloudFront CDN のオリジンとして機能し、Terraform の状態を保持し、Lambda デプロイパッケージを保存し、アーキテクチャ内のすべてのデータベースをバックアップします。S3 のデータモデル・セキュリティモデル・コストドライバーを理解することは、すべての DevOps エンジニアにとって不可欠です。",
  } as const,
  o2: {
    en: "Today you go beyond 'upload a file' to master: bucket policies vs IAM policies, versioning, lifecycle rules that automatically move data to cheaper storage, cross-region replication, event notifications that trigger Lambdas, and the performance patterns that matter at scale.",
    np: "आज तपाईं 'file upload' भन्दा अगाडि जानुहुनेछ master गर्न: bucket policy vs IAM policy, versioning, automatically data लाई सस्तो storage मा move गर्ने lifecycle rule, cross-region replication, Lambda trigger गर्ने event notification, र scale मा महत्त्वपूर्ण performance pattern।",
    jp: "今日は「ファイルのアップロード」を超えてマスターします：バケットポリシー対 IAM ポリシー・バージョニング・データを自動的に安価なストレージに移動するライフサイクルルール・クロスリージョンレプリケーション・Lambda をトリガーするイベント通知・スケール時に重要なパフォーマンスパターン。",
  } as const,
};

export const DEVOPS_DAY_33_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "S3 data model & core concepts",
        np: "S3 data model र core concept",
        jp: "S3 データモデルとコアコンセプト",
      },
      blocks: [
        { type: "diagram", id: "devops-s3-architecture" },
        {
          type: "paragraph",
          text: {
            en: "S3 stores objects in buckets. An object = key (path-like string) + data + metadata. Keys are not a real filesystem — `photos/2024/jan/img.jpg` has no folder structure; the slash is part of the key name. S3 is a global namespace so bucket names must be globally unique. Objects can be 0B to 5TB; multipart upload required above 5GB.",
            np: "S3 ले bucket मा object store गर्छ। Object = key (path-like string) + data + metadata। Key वास्तविक filesystem होइन — `photos/2024/jan/img.jpg` मा कुनै folder structure छैन; slash key name को हिस्सा हो। S3 global namespace हो त्यसैले bucket name globally unique हुनुपर्छ। Object 0B देखि 5TB सम्म हुन सक्छ; 5GB माथि multipart upload आवश्यक छ।",
            jp: "S3 はバケットにオブジェクトを保存します。オブジェクト = キー（パスのような文字列）+ データ + メタデータ。キーは実際のファイルシステムではありません — `photos/2024/jan/img.jpg` にはフォルダ構造がなく、スラッシュはキー名の一部です。S3 はグローバルな名前空間なのでバケット名はグローバルに一意でなければなりません。オブジェクトは 0B から 5TB まで可能；5GB を超える場合はマルチパートアップロードが必要です。",
          },
        },
        {
          type: "table",
          caption: {
            en: "S3 storage classes — availability, retrieval time, cost use case, when to choose",
            np: "S3 storage class — availability, retrieval time, cost use case, र कहिले रोज्ने",
            jp: "S3 ストレージクラス — 可用性・取得時間・コストのユースケース・選択のタイミング",
          },
          headers: [
            { en: "Storage Class", np: "Storage Class", jp: "ストレージクラス" },
            { en: "Availability", np: "Availability", jp: "可用性" },
            { en: "Retrieval Time", np: "Retrieval Time", jp: "取得時間" },
            { en: "Cost Use Case", np: "Cost Use Case", jp: "コストのユースケース" },
            { en: "When to Choose", np: "कहिले रोज्ने", jp: "選択のタイミング" },
          ],
          rows: [
            [
              { en: "Standard", np: "Standard", jp: "スタンダード" },
              { en: "99.99%", np: "99.99%", jp: "99.99%" },
              { en: "Milliseconds", np: "Millisecond", jp: "ミリ秒" },
              { en: "Highest — pay per GB + requests", np: "सबैभन्दा बढी — GB + request अनुसार भुक्तानी", jp: "最高 — GB とリクエストごとに課金" },
              { en: "Frequently accessed data, active workloads", np: "बारम्बार access हुने data, active workload", jp: "頻繁にアクセスされるデータ・アクティブなワークロード" },
            ],
            [
              { en: "Intelligent-Tiering", np: "Intelligent-Tiering", jp: "インテリジェントティアリング" },
              { en: "99.9%", np: "99.9%", jp: "99.9%" },
              { en: "Milliseconds", np: "Millisecond", jp: "ミリ秒" },
              { en: "Auto-moves objects between tiers based on access patterns", np: "Access pattern अनुसार object automatically tier बीच move गर्छ", jp: "アクセスパターンに基づいてオブジェクトを自動的にティア間で移動" },
              { en: "Unknown or unpredictable access patterns", np: "अज्ञात वा अप्रत्याशित access pattern", jp: "不明または予測不可能なアクセスパターン" },
            ],
            [
              { en: "Standard-IA", np: "Standard-IA", jp: "スタンダード-IA" },
              { en: "99.9%", np: "99.9%", jp: "99.9%" },
              { en: "Milliseconds", np: "Millisecond", jp: "ミリ秒" },
              { en: "Lower storage cost + retrieval fee", np: "कम storage cost + retrieval fee", jp: "低いストレージコスト + 取得料金" },
              { en: "Infrequent access (< 1x/month), disaster recovery files", np: "अनियमित access (< 1x/month), disaster recovery file", jp: "アクセス頻度が低い（月 1 回未満）・災害復旧ファイル" },
            ],
            [
              { en: "One Zone-IA", np: "One Zone-IA", jp: "ワンゾーン-IA" },
              { en: "99.5%", np: "99.5%", jp: "99.5%" },
              { en: "Milliseconds", np: "Millisecond", jp: "ミリ秒" },
              { en: "20% cheaper than Standard-IA — single AZ only", np: "Standard-IA भन्दा 20% सस्तो — single AZ मात्र", jp: "スタンダード-IA より 20% 安い — 単一 AZ のみ" },
              { en: "Re-creatable data (thumbnail images, transcoded media)", np: "पुनः बनाउन सकिने data (thumbnail image, transcoded media)", jp: "再作成可能なデータ（サムネイル画像・トランスコードされたメディア）" },
            ],
            [
              { en: "Glacier Instant", np: "Glacier Instant", jp: "Glacier インスタント" },
              { en: "99.9%", np: "99.9%", jp: "99.9%" },
              { en: "Milliseconds", np: "Millisecond", jp: "ミリ秒" },
              { en: "Archive price, instant retrieval — higher per-retrieval cost", np: "Archive price, instant retrieval — प्रति retrieval बढी cost", jp: "アーカイブ価格でインスタント取得 — 取得ごとのコストは高い" },
              { en: "Medical images, news media accessed quarterly", np: "Quarterly access हुने medical image, news media", jp: "四半期ごとにアクセスされる医療画像・ニュースメディア" },
            ],
            [
              { en: "Glacier Flexible", np: "Glacier Flexible", jp: "Glacier フレキシブル" },
              { en: "99.99%", np: "99.99%", jp: "99.99%" },
              { en: "Minutes to hours", np: "Minute देखि घण्टा", jp: "数分から数時間" },
              { en: "Very low storage cost — retrieval takes time", np: "धेरै कम storage cost — retrieval समय लाग्छ", jp: "非常に低いストレージコスト — 取得に時間がかかる" },
              { en: "Compliance archives, backup data rarely accessed", np: "Compliance archive, बिरलै access हुने backup data", jp: "コンプライアンスアーカイブ・めったにアクセスしないバックアップデータ" },
            ],
            [
              { en: "Glacier Deep Archive", np: "Glacier Deep Archive", jp: "Glacier ディープアーカイブ" },
              { en: "99.99%", np: "99.99%", jp: "99.99%" },
              { en: "12 hours", np: "12 घण्टा", jp: "12 時間" },
              { en: "Lowest cost in S3 — 1-2x/year retrieval only", np: "S3 मा सबैभन्दा कम cost — वर्षमा 1-2 पटक मात्र retrieval", jp: "S3 で最低コスト — 年 1〜2 回のみ取得" },
              { en: "Long-term regulatory retention (7-10+ years)", np: "दीर्घकालीन regulatory retention (7-10+ वर्ष)", jp: "長期的な規制上の保存（7〜10 年以上）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "S3 security — bucket policies, ACLs & public access",
        np: "S3 security — bucket policy, ACL र public access",
        jp: "S3 セキュリティ — バケットポリシー・ACL・パブリックアクセス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Three layers: IAM policies (who in your account can do what), bucket policies (resource-based, can grant cross-account access), and ACLs (legacy, avoid for new buckets). Block Public Access settings are a safety net at account and bucket level — always enable for buckets that shouldn't be public. S3 Access Analyzer detects publicly accessible buckets.",
            np: "तीन layer: IAM policy (तपाईंको account मा कसले के गर्न सक्छ), bucket policy (resource-based, cross-account access grant गर्न सक्छ), र ACL (legacy, नयाँ bucket का लागि avoid गर्नुहोस्)। Block Public Access setting account र bucket level मा safety net हो — public हुनु नहुने bucket का लागि सधैं enable गर्नुहोस्। S3 Access Analyzer ले publicly accessible bucket detect गर्छ।",
            jp: "3 つの層：IAM ポリシー（アカウント内の誰が何をできるか）・バケットポリシー（リソースベース、クロスアカウントアクセスを付与可能）・ACL（レガシー、新しいバケットでは避ける）。Block Public Access 設定はアカウントとバケットレベルのセーフティネットです — パブリックにしてはならないバケットには常に有効化する。S3 Access Analyzer はパブリックアクセス可能なバケットを検出します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Bucket policy — deny non-HTTPS, allow cross-account read, require MFA for delete",
            np: "Bucket policy — non-HTTPS deny, cross-account read allow, delete का लागि MFA require",
            jp: "バケットポリシー — 非 HTTPS 拒否・クロスアカウント読み取り許可・削除に MFA 要求",
          },
          code: `# bucket-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyNonHTTPS",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-artifact-store",
        "arn:aws:s3:::my-artifact-store/*"
      ],
      "Condition": {
        "Bool": { "aws:SecureTransport": "false" }
      }
    },
    {
      "Sid": "AllowCrossAccountRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::999888777666:role/ReadOnlyRole"
      },
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::my-artifact-store",
        "arn:aws:s3:::my-artifact-store/*"
      ]
    },
    {
      "Sid": "RequireMFAForDelete",
      "Effect": "Deny",
      "Principal": "*",
      "Action": ["s3:DeleteObject", "s3:DeleteObjectVersion"],
      "Resource": "arn:aws:s3:::my-artifact-store/*",
      "Condition": {
        "BoolIfExists": { "aws:MultiFactorAuthPresent": "false" }
      }
    }
  ]
}

# Apply the policy to a bucket
aws s3api put-bucket-policy \
    --bucket my-artifact-store \
    --policy file://bucket-policy.json

# Check the current bucket policy
aws s3api get-bucket-policy \
    --bucket my-artifact-store \
    --query Policy \
    --output text | python3 -m json.tool

# Enable Block Public Access (safety net — do this for ALL non-public buckets)
aws s3api put-public-access-block \
    --bucket my-artifact-store \
    --public-access-block-configuration \
      "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"`,
        },
      ],
    },
    {
      title: {
        en: "Versioning, lifecycle & replication",
        np: "Versioning, lifecycle र replication",
        jp: "バージョニング・ライフサイクル・レプリケーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Versioning keeps every version of every object. Combined with MFA Delete, it protects against accidental deletion and ransomware. Lifecycle rules automatically transition objects to cheaper storage classes after N days or expire them. Cross-Region Replication (CRR) copies new objects to another region for compliance or DR. Same-Region Replication (SRR) for log aggregation across accounts.",
            np: "Versioning ले हरेक object को हरेक version राख्छ। MFA Delete सँग मिलाएर, यसले accidental deletion र ransomware विरुद्ध सुरक्षा गर्छ। Lifecycle rule ले N दिन पछि object लाई automatically सस्तो storage class मा transition गर्छ वा expire गर्छ। Cross-Region Replication (CRR) ले compliance वा DR का लागि नयाँ object अर्को region मा copy गर्छ। Log aggregation का लागि Same-Region Replication (SRR)।",
            jp: "バージョニングはすべてのオブジェクトのすべてのバージョンを保持します。MFA Delete と組み合わせることで、誤った削除とランサムウェアから保護します。ライフサイクルルールは N 日後にオブジェクトを自動的に安価なストレージクラスに移行するか期限切れにします。Cross-Region Replication（CRR）はコンプライアンスまたは DR のために新しいオブジェクトを別のリージョンにコピーします。アカウント間のログ集約には Same-Region Replication（SRR）を使用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Enable versioning, lifecycle rules, and CRR",
            np: "Versioning, lifecycle rule, र CRR enable गर्नुहोस्",
            jp: "バージョニング・ライフサイクルルール・CRR を有効化する",
          },
          code: `# 1. Enable versioning on a bucket
aws s3api put-bucket-versioning \
    --bucket my-artifact-store \
    --versioning-configuration Status=Enabled

# 2. Apply a lifecycle rule (IA after 30d, Glacier after 90d, expire after 365d)
# lifecycle.json
{
  "Rules": [
    {
      "ID": "AutoTierAndExpire",
      "Status": "Enabled",
      "Filter": { "Prefix": "" },
      "Transitions": [
        { "Days": 30,  "StorageClass": "STANDARD_IA" },
        { "Days": 90,  "StorageClass": "GLACIER" }
      ],
      "Expiration": { "Days": 365 },
      "NoncurrentVersionTransitions": [
        { "NoncurrentDays": 30, "StorageClass": "GLACIER" }
      ],
      "NoncurrentVersionExpiration": { "NoncurrentDays": 90 }
    }
  ]
}

aws s3api put-bucket-lifecycle-configuration \
    --bucket my-artifact-store \
    --lifecycle-configuration file://lifecycle.json

# 3. Enable Cross-Region Replication (CRR)
# Prerequisites: versioning must be enabled on BOTH source and dest buckets.
# replication.json
{
  "Role": "arn:aws:iam::123456789012:role/S3ReplicationRole",
  "Rules": [
    {
      "ID": "ReplicateAll",
      "Status": "Enabled",
      "Filter": { "Prefix": "" },
      "Destination": {
        "Bucket": "arn:aws:s3:::my-artifact-store-replica-eu",
        "StorageClass": "STANDARD_IA"
      },
      "DeleteMarkerReplication": { "Status": "Enabled" }
    }
  ]
}

aws s3api put-bucket-replication \
    --bucket my-artifact-store \
    --replication-configuration file://replication.json

# Verify replication status of an object
aws s3api head-object \
    --bucket my-artifact-store \
    --key builds/v1.2.3.zip \
    --query ReplicationStatus`,
        },
      ],
    },
    {
      title: {
        en: "S3 event notifications & presigned URLs",
        np: "S3 event notification र presigned URL",
        jp: "S3 イベント通知とプレサインド URL",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "S3 events (ObjectCreated, ObjectRemoved, ObjectRestore) can trigger Lambda, SQS, or SNS. Use for: image resizing on upload, virus scanning, triggering CI/CD from artifact upload. Presigned URLs grant temporary access to a private object — the URL encodes the credentials and expiry. Use for secure file download links, direct browser uploads bypassing your server.",
            np: "S3 event (ObjectCreated, ObjectRemoved, ObjectRestore) ले Lambda, SQS, वा SNS trigger गर्न सक्छ। प्रयोग गर्नुहोस्: upload मा image resizing, virus scanning, artifact upload बाट CI/CD trigger। Presigned URL ले private object मा temporary access grant गर्छ — URL ले credential र expiry encode गर्छ। Secure file download link, server bypass गरेर direct browser upload का लागि प्रयोग गर्नुहोस्।",
            jp: "S3 イベント（ObjectCreated・ObjectRemoved・ObjectRestore）は Lambda・SQS・SNS をトリガーできます。用途：アップロード時の画像リサイズ・ウイルススキャン・アーティファクトアップロードからの CI/CD トリガー。プレサインド URL はプライベートオブジェクトへの一時的なアクセスを付与します — URL は認証情報と有効期限をエンコードします。セキュアなファイルダウンロードリンク・サーバーを経由しない直接ブラウザアップロードに使用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Event notification to Lambda + generate presigned URLs",
            np: "Lambda मा event notification + presigned URL generate गर्नुहोस्",
            jp: "Lambda へのイベント通知 + プレサインド URL の生成",
          },
          code: `# 1. Create an S3 event notification targeting a Lambda function
# notification-config.json
{
  "LambdaFunctionConfigurations": [
    {
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:ResizeImage",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            { "Name": "prefix", "Value": "uploads/" },
            { "Name": "suffix", "Value": ".jpg" }
          ]
        }
      }
    }
  ]
}

# Grant S3 permission to invoke Lambda (run once)
aws lambda add-permission \
    --function-name ResizeImage \
    --statement-id s3-invoke \
    --action lambda:InvokeFunction \
    --principal s3.amazonaws.com \
    --source-arn arn:aws:s3:::my-artifact-store

# Apply the notification config
aws s3api put-bucket-notification-configuration \
    --bucket my-artifact-store \
    --notification-configuration file://notification-config.json

# 2. Generate a presigned URL (boto3 — Python)
import boto3
from datetime import timedelta

s3 = boto3.client('s3', region_name='us-east-1')

# Presigned GET — allow anyone to download for 1 hour
download_url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': 'my-artifact-store', 'Key': 'builds/v1.2.3.zip'},
    ExpiresIn=3600  # seconds
)
print(download_url)

# Presigned POST — allow direct browser upload (no server in the middle)
presigned_post = s3.generate_presigned_post(
    Bucket='my-artifact-store',
    Key='uploads/\${filename}',
    Fields={"Content-Type": "image/jpeg"},
    Conditions=[["content-length-range", 1, 10485760]],  # 1B to 10MB
    ExpiresIn=900
)

# CLI equivalent (simple presigned GET)
aws s3 presign s3://my-artifact-store/builds/v1.2.3.zip --expires-in 3600`,
        },
      ],
    },
    {
      title: {
        en: "Performance & cost optimization",
        np: "Performance र cost optimization",
        jp: "パフォーマンスとコスト最適化",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "S3 cost components — what costs, how to optimize each",
            np: "S3 cost component — के cost लाग्छ, प्रत्येकलाई कसरी optimize गर्ने",
            jp: "S3 コストコンポーネント — 何にかかるか・それぞれの最適化方法",
          },
          headers: [
            { en: "Cost Component", np: "Cost Component", jp: "コストコンポーネント" },
            { en: "Pricing", np: "Pricing", jp: "価格" },
            { en: "How to Optimize", np: "कसरी Optimize गर्ने", jp: "最適化方法" },
          ],
          rows: [
            [
              { en: "Storage ($/GB/month)", np: "Storage ($/GB/month)", jp: "ストレージ（$/GB/月）" },
              { en: "Standard ~$0.023/GB; Glacier Deep Archive ~$0.00099/GB", np: "Standard ~$0.023/GB; Glacier Deep Archive ~$0.00099/GB", jp: "スタンダード ~$0.023/GB；Glacier ディープアーカイブ ~$0.00099/GB" },
              { en: "Lifecycle rules to move infrequent data to IA/Glacier automatically", np: "Infrequent data लाई automatically IA/Glacier मा move गर्न lifecycle rule", jp: "ライフサイクルルールで低頻度データを自動的に IA/Glacier に移動" },
            ],
            [
              { en: "PUT/COPY/POST requests", np: "PUT/COPY/POST request", jp: "PUT/COPY/POST リクエスト" },
              { en: "$0.005 per 1,000 requests (Standard)", np: "$0.005 प्रति 1,000 request (Standard)", jp: "$0.005/1,000 リクエスト（スタンダード）" },
              { en: "Batch uploads with multipart; use aws s3 sync for bulk operations", np: "Multipart सँग batch upload; bulk operation का लागि aws s3 sync", jp: "マルチパートでバッチアップロード；一括操作に aws s3 sync を使用" },
            ],
            [
              { en: "GET requests", np: "GET request", jp: "GET リクエスト" },
              { en: "$0.0004 per 1,000 requests (Standard)", np: "$0.0004 प्रति 1,000 request (Standard)", jp: "$0.0004/1,000 リクエスト（スタンダード）" },
              { en: "Put CloudFront in front — CDN cache eliminates most GET charges", np: "CloudFront अगाडि राख्नुहोस् — CDN cache ले धेरै GET charge हटाउँछ", jp: "CloudFront を前面に配置 — CDN キャッシュでほとんどの GET 料金を排除" },
            ],
            [
              { en: "Data transfer out (egress)", np: "Data transfer out (egress)", jp: "データ転送アウト（エグレス）" },
              { en: "Free to EC2 same region; $0.09/GB to internet", np: "Same region EC2 मा निःशुल्क; Internet मा $0.09/GB", jp: "同一リージョンの EC2 へは無料；インターネットへは $0.09/GB" },
              { en: "Use CloudFront (cheaper egress rates + caching); EC2 in same region for processing", np: "CloudFront (सस्तो egress rate + caching) प्रयोग गर्नुहोस्; processing का लागि same region मा EC2", jp: "CloudFront（安価なエグレスレート + キャッシング）を使用；処理には同一リージョンの EC2" },
            ],
            [
              { en: "Glacier retrieval", np: "Glacier retrieval", jp: "Glacier 取得" },
              { en: "Instant: $0.03/GB; Flexible: $0.01/GB; Deep Archive: $0.02/GB", np: "Instant: $0.03/GB; Flexible: $0.01/GB; Deep Archive: $0.02/GB", jp: "インスタント: $0.03/GB；フレキシブル: $0.01/GB；ディープアーカイブ: $0.02/GB" },
              { en: "Use Flexible/Deep Archive only for true cold data; plan retrievals in bulk", np: "True cold data का लागि मात्र Flexible/Deep Archive प्रयोग गर्नुहोस्; bulk मा retrieval plan गर्नुहोस्", jp: "本当に低頻度のデータにのみ Flexible/Deep Archive を使用；一括で取得を計画する" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "For high throughput, use random prefixes in keys (S3 partitions by prefix). For static website hosting, enable static website hosting on the bucket + CloudFront in front (better caching, custom domain, HTTPS). Use S3 Transfer Acceleration for cross-region uploads from end users.",
            np: "High throughput का लागि, key मा random prefix प्रयोग गर्नुहोस् (S3 prefix द्वारा partition गर्छ)। Static website hosting का लागि, bucket मा static website hosting enable गर्नुहोस् + CloudFront अगाडि (राम्रो caching, custom domain, HTTPS)। End user बाट cross-region upload का लागि S3 Transfer Acceleration प्रयोग गर्नुहोस्।",
            jp: "高スループットのためには、キーにランダムなプレフィックスを使用します（S3 はプレフィックスでパーティション分割）。静的ウェブサイトホスティングには、バケットで静的ウェブサイトホスティングを有効化し + CloudFront を前面に配置（より良いキャッシング・カスタムドメイン・HTTPS）。エンドユーザーからのクロスリージョンアップロードには S3 Transfer Acceleration を使用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Bulk operations, versioning setup, and bucket inspection",
            np: "Bulk operation, versioning setup, र bucket inspection",
            jp: "一括操作・バージョニング設定・バケット検査",
          },
          code: `# Sync a local build output to S3 (skip unchanged files, delete orphaned remote files)
aws s3 sync ./dist s3://my-artifact-store/builds/v1.2.3/ \
    --delete \
    --exclude "*.DS_Store" \
    --exclude ".git/*" \
    --cache-control "max-age=31536000" \
    --content-type "application/javascript"

# Create a new bucket and enable versioning in one shot
aws s3 mb s3://my-artifact-store --region us-east-1

aws s3api put-bucket-versioning \
    --bucket my-artifact-store \
    --versioning-configuration Status=Enabled

# Enable server-side encryption (AES-256 by default, or KMS)
aws s3api put-bucket-encryption \
    --bucket my-artifact-store \
    --server-side-encryption-configuration '{
      "Rules": [{
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "aws:kms",
          "KMSMasterKeyID": "alias/my-s3-key"
        },
        "BucketKeyEnabled": true
      }]
    }'

# List all objects recursively with sizes (useful for auditing costs)
aws s3 ls s3://my-artifact-store \
    --recursive \
    --human-readable \
    --summarize

# List all versions of a specific object (important after enabling versioning)
aws s3api list-object-versions \
    --bucket my-artifact-store \
    --prefix builds/v1.2.3.zip \
    --query "Versions[*].{VersionId:VersionId,LastModified:LastModified,Size:Size}"`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: build a versioned artifact store",
        np: "Hands-on: versioned artifact store बनाउनुहोस्",
        jp: "ハンズオン：バージョン管理されたアーティファクトストアを構築する",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a private bucket with block-all-public-access enabled: `aws s3 mb s3://my-versioned-artifacts --region us-east-1` followed by `aws s3api put-public-access-block` with all four flags set to true.",
              np: "Block-all-public-access enable सहित private bucket बनाउनुहोस्: `aws s3 mb s3://my-versioned-artifacts --region us-east-1` र त्यसपछि सबै चार flag true set गरी `aws s3api put-public-access-block`।",
              jp: "ブロックパブリックアクセスを有効にしてプライベートバケットを作成：`aws s3 mb s3://my-versioned-artifacts --region us-east-1` の後、4 つのフラグをすべて true に設定して `aws s3api put-public-access-block`。",
            },
            {
              en: "Enable versioning on the bucket: `aws s3api put-bucket-versioning --bucket my-versioned-artifacts --versioning-configuration Status=Enabled`. Verify with `aws s3api get-bucket-versioning --bucket my-versioned-artifacts`.",
              np: "Bucket मा versioning enable गर्नुहोस्: `aws s3api put-bucket-versioning --bucket my-versioned-artifacts --versioning-configuration Status=Enabled`। `aws s3api get-bucket-versioning --bucket my-versioned-artifacts` सँग verify गर्नुहोस्।",
              jp: "バケットでバージョニングを有効化：`aws s3api put-bucket-versioning --bucket my-versioned-artifacts --versioning-configuration Status=Enabled`。`aws s3api get-bucket-versioning --bucket my-versioned-artifacts` で確認する。",
            },
            {
              en: "Create a lifecycle rule that transitions objects to Standard-IA after 30 days and Glacier after 90 days. Apply with `aws s3api put-bucket-lifecycle-configuration` using the JSON from Section 3.",
              np: "30 दिन पछि Standard-IA र 90 दिन पछि Glacier मा object transition गर्ने lifecycle rule बनाउनुहोस्। Section 3 को JSON प्रयोग गरी `aws s3api put-bucket-lifecycle-configuration` सँग apply गर्नुहोस्।",
              jp: "30 日後に Standard-IA に、90 日後に Glacier にオブジェクトを移行するライフサイクルルールを作成する。セクション 3 の JSON を使って `aws s3api put-bucket-lifecycle-configuration` で適用する。",
            },
            {
              en: "Upload a build artifact and capture its version ID: `aws s3 cp ./build.zip s3://my-versioned-artifacts/releases/build.zip`. Then run `aws s3api list-object-versions --bucket my-versioned-artifacts --prefix releases/build.zip` to see the version.",
              np: "Build artifact upload गर्नुहोस् र version ID capture गर्नुहोस्: `aws s3 cp ./build.zip s3://my-versioned-artifacts/releases/build.zip`। त्यसपछि version हेर्न `aws s3api list-object-versions --bucket my-versioned-artifacts --prefix releases/build.zip`।",
              jp: "ビルドアーティファクトをアップロードしてバージョン ID を取得：`aws s3 cp ./build.zip s3://my-versioned-artifacts/releases/build.zip`。次に `aws s3api list-object-versions --bucket my-versioned-artifacts --prefix releases/build.zip` でバージョンを確認する。",
            },
            {
              en: "Delete the object (`aws s3 rm s3://my-versioned-artifacts/releases/build.zip`), observe it creates a delete marker, then restore by deleting the delete marker using `aws s3api delete-object --version-id <delete-marker-id>`.",
              np: "Object delete गर्नुहोस् (`aws s3 rm s3://my-versioned-artifacts/releases/build.zip`), delete marker create भएको observe गर्नुहोस्, त्यसपछि `aws s3api delete-object --version-id <delete-marker-id>` प्रयोग गरी delete marker delete गरेर restore गर्नुहोस्।",
              jp: "オブジェクトを削除し（`aws s3 rm s3://my-versioned-artifacts/releases/build.zip`）、削除マーカーが作成されることを観察し、次に `aws s3api delete-object --version-id <delete-marker-id>` で削除マーカーを削除して復元する。",
            },
            {
              en: "Generate a presigned URL expiring in 1 hour: `aws s3 presign s3://my-versioned-artifacts/releases/build.zip --expires-in 3600`. Test the URL in a browser or with `curl` to confirm private access works.",
              np: "1 घण्टामा expire हुने presigned URL generate गर्नुहोस्: `aws s3 presign s3://my-versioned-artifacts/releases/build.zip --expires-in 3600`। Private access काम गरेको confirm गर्न browser वा `curl` सँग URL test गर्नुहोस्।",
              jp: "1 時間で有効期限が切れるプレサインド URL を生成：`aws s3 presign s3://my-versioned-artifacts/releases/build.zip --expires-in 3600`。ブラウザまたは `curl` で URL をテストしてプライベートアクセスが機能することを確認する。",
            },
            {
              en: "Configure a bucket policy to allow read from a specific IAM role only. Write a policy with `s3:GetObject` and `s3:ListBucket` allowed for the role ARN and apply with `aws s3api put-bucket-policy`.",
              np: "Specific IAM role बाट मात्र read allow गर्न bucket policy configure गर्नुहोस्। Role ARN का लागि `s3:GetObject` र `s3:ListBucket` allow भएको policy लेख्नुहोस् र `aws s3api put-bucket-policy` सँग apply गर्नुहोस्।",
              jp: "特定の IAM ロールからのみ読み取りを許可するバケットポリシーを設定する。ロール ARN に対して `s3:GetObject` と `s3:ListBucket` を許可するポリシーを書き、`aws s3api put-bucket-policy` で適用する。",
            },
            {
              en: "Enable S3 server access logging to a separate logs bucket: create `my-versioned-artifacts-logs` bucket, then run `aws s3api put-bucket-logging` to stream access logs from your main bucket into the logs bucket for audit and cost analysis.",
              np: "अलग logs bucket मा S3 server access logging enable गर्नुहोस्: `my-versioned-artifacts-logs` bucket बनाउनुहोस्, त्यसपछि audit र cost analysis का लागि main bucket बाट access log logs bucket मा stream गर्न `aws s3api put-bucket-logging` run गर्नुहोस्।",
              jp: "別のログバケットに S3 サーバーアクセスログを有効化：`my-versioned-artifacts-logs` バケットを作成し、監査とコスト分析のためにメインバケットからアクセスログをログバケットにストリームするために `aws s3api put-bucket-logging` を実行する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I make a bucket website without making objects public?",
        np: "Object public नगरीकन bucket website कसरी बनाउने?",
        jp: "オブジェクトをパブリックにせずにバケットウェブサイトを作るには？",
      },
      answer: {
        en: "Use CloudFront with an Origin Access Control (OAC). CloudFront gets read access via a bucket policy that only allows the CloudFront OAC, all objects stay private. Never use 'public bucket' for production websites.",
        np: "Origin Access Control (OAC) सहित CloudFront प्रयोग गर्नुहोस्। CloudFront ले CloudFront OAC मात्र allow गर्ने bucket policy मार्फत read access पाउँछ, सबै object private रहन्छ। Production website का लागि 'public bucket' कहिल्यै प्रयोग नगर्नुहोस्।",
        jp: "Origin Access Control（OAC）を使った CloudFront を使用します。CloudFront は CloudFront OAC のみを許可するバケットポリシーを通じて読み取りアクセスを取得し、すべてのオブジェクトはプライベートのままです。本番ウェブサイトに「パブリックバケット」を使わないこと。",
      },
      tag: { en: "s3", np: "S3", jp: "S3" },
    },
    {
      question: {
        en: "What's the difference between `aws s3` and `aws s3api` commands?",
        np: "`aws s3` र `aws s3api` command बीच के फरक छ?",
        jp: "`aws s3` コマンドと `aws s3api` コマンドの違いは？",
      },
      answer: {
        en: "`aws s3` provides high-level commands (sync, cp, mv) that handle multipart, retries, and progress. `aws s3api` maps 1:1 to S3 API operations for precise control. Use `aws s3` for most tasks, `aws s3api` for bucket configuration (versioning, policy, lifecycle).",
        np: "`aws s3` ले high-level command (sync, cp, mv) provide गर्छ जसले multipart, retry, र progress handle गर्छ। `aws s3api` ले precise control का लागि S3 API operation सँग 1:1 map गर्छ। धेरैजसो task का लागि `aws s3` र bucket configuration (versioning, policy, lifecycle) का लागि `aws s3api` प्रयोग गर्नुहोस्।",
        jp: "`aws s3` はマルチパート・リトライ・進捗を処理する高レベルのコマンド（sync・cp・mv）を提供します。`aws s3api` は正確な制御のために S3 API 操作に 1:1 でマッピングします。ほとんどのタスクには `aws s3` を、バケット設定（バージョニング・ポリシー・ライフサイクル）には `aws s3api` を使用します。",
      },
      tag: { en: "s3", np: "S3", jp: "S3" },
    },
    {
      question: {
        en: "How does S3 pricing work and how do I reduce costs?",
        np: "S3 pricing कसरी काम गर्छ र cost कसरी कम गर्ने?",
        jp: "S3 の料金体系と、コストを削減する方法は？",
      },
      answer: {
        en: "Main cost drivers: storage (S3-IA is 40% cheaper for infrequent data), requests (GET costs more than PUT), and egress (free to transfer to EC2 in same region; pay for internet egress). Lifecycle rules that move data to cheaper tiers automatically pay for themselves.",
        np: "मुख्य cost driver: storage (S3-IA ले infrequent data का लागि 40% सस्तो), request (GET ले PUT भन्दा बढी cost), र egress (same region मा EC2 मा transfer निःशुल्क; internet egress को लागि भुक्तानी)। Data लाई automatically सस्तो tier मा move गर्ने lifecycle rule ले आफैं pay गर्छ।",
        jp: "主なコストドライバー：ストレージ（S3-IA は低頻度データで 40% 安い）・リクエスト（GET は PUT よりコストがかかる）・エグレス（同一リージョンの EC2 への転送は無料；インターネットエグレスは有料）。データを自動的に安価なティアに移動するライフサイクルルールはコスト削減効果があります。",
      },
      tag: { en: "cost", np: "Cost", jp: "コスト" },
    },
  ],
};
