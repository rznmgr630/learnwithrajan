import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "IAM is the access control system for every AWS resource. Get it wrong and you either lock yourself out or expose your entire infrastructure to the internet. Almost every AWS security breach that makes the news traces back to an IAM misconfiguration — overly permissive policies, long-lived credentials left in code, or missing MFA on a privileged account.",
    np: "IAM हरेक AWS resource को access control system हो। गलत गर्नुभयो भने तपाईं आफैंलाई lock out गर्नुहुन्छ वा सम्पूर्ण infrastructure internet मा expose गर्नुहुन्छ। News मा आउने लगभग हरेक AWS security breach IAM misconfiguration मा trace back हुन्छ — अत्यधिक permissive policy, code मा छोडिएको long-lived credential, वा privileged account मा missing MFA।",
    jp: "IAM はすべての AWS リソースのアクセス制御システムです。間違えると、自分自身をロックアウトするか、インフラ全体をインターネットに公開してしまいます。ニュースになるほぼすべての AWS セキュリティ侵害は IAM の設定ミスに起因します — 過度に寛大なポリシー・コードに残された長期間有効な認証情報・特権アカウントへの MFA の欠如。",
  } as const,
  o2: {
    en: "Today you learn the IAM mental model — principals, policies, and the evaluation logic — well enough to design a secure baseline for any AWS account. You will also set up that baseline yourself, verifying each permission with the AWS policy simulator.",
    np: "आज तपाईंले IAM mental model — principal, policy, र evaluation logic — कुनै पनि AWS account को लागि secure baseline design गर्न पर्याप्त सिक्नुहुनेछ। तपाईंले AWS policy simulator सँग प्रत्येक permission verify गर्दै आफैं त्यो baseline set up गर्नुहुनेछ।",
    jp: "今日は IAM のメンタルモデル — プリンシパル・ポリシー・評価ロジック — を任意の AWS アカウントのセキュアなベースラインを設計するのに十分なほど学びます。また、AWS ポリシーシミュレーターで各権限を検証しながら、そのベースラインを自分でセットアップします。",
  } as const,
};

export const DEVOPS_DAY_30_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "IAM principals — who can do what",
        np: "IAM principal — कसले के गर्न सक्छ",
        jp: "IAM プリンシパル — 誰が何をできるか",
      },
      blocks: [
        { type: "diagram", id: "devops-iam-model" },
        {
          type: "table",
          caption: {
            en: "IAM entity types, their purpose, and security notes",
            np: "IAM entity type, तिनीहरूको purpose, र security note",
            jp: "IAM エンティティの種類・目的・セキュリティノート",
          },
          headers: [
            { en: "Entity", np: "Entity", jp: "エンティティ" },
            { en: "What it is", np: "के हो", jp: "何であるか" },
            { en: "Use case", np: "Use case", jp: "ユースケース" },
            { en: "Security note", np: "Security note", jp: "セキュリティノート" },
          ],
          rows: [
            [
              { en: "Root account", np: "Root account", jp: "ルートアカウント" },
              { en: "The account email owner. Has unrestricted access to everything including billing.", np: "Account email owner। Billing सहित सबैमा unrestricted access छ।", jp: "アカウントのメール所有者。請求を含むすべてへの無制限アクセスを持つ。" },
              { en: "Enable MFA, create your first IAM admin user, then never use root again day-to-day.", np: "MFA enable गर्नुहोस्, पहिलो IAM admin user बनाउनुहोस्, त्यसपछि day-to-day root कहिल्यै प्रयोग नगर्नुहोस्।", jp: "MFA を有効化し、最初の IAM 管理者ユーザーを作成し、その後は日常的に root を使わない。" },
              { en: "NEVER generate root access keys. Lock it away after initial setup.", np: "root access key कहिल्यै generate नगर्नुहोस्। Initial setup पछि lock away गर्नुहोस्।", jp: "root アクセスキーは絶対に生成しない。初期セットアップ後は封印する。" },
            ],
            [
              { en: "IAM User", np: "IAM User", jp: "IAM ユーザー" },
              { en: "A named identity with long-lived credentials (password + access keys).", np: "Long-lived credential (password + access key) सहितको named identity।", jp: "長期間有効な認証情報（パスワード + アクセスキー）を持つ名前付きアイデンティティ。" },
              { en: "Human developers who need console access; service accounts for legacy systems that cannot use roles.", np: "Console access चाहिने human developer; role प्रयोग गर्न नसक्ने legacy system को service account।", jp: "コンソールアクセスが必要な人間の開発者；ロールを使えないレガシーシステムのサービスアカウント。" },
              { en: "Rotate access keys every 90 days. Enable MFA for all human users. Never share credentials between people.", np: "90 दिनमा access key rotate गर्नुहोस्। सबै human user का लागि MFA enable गर्नुहोस्। मानिसहरू बीच credential कहिल्यै share नगर्नुहोस्।", jp: "90 日ごとにアクセスキーをローテーションする。すべての人間ユーザーに MFA を有効化。人の間で認証情報を共有しない。" },
            ],
            [
              { en: "IAM Group", np: "IAM Group", jp: "IAM グループ" },
              { en: "A collection of IAM users. Policies attached to a group apply to all members.", np: "IAM user को collection। Group मा attach गरिएको policy सबै member मा apply हुन्छ।", jp: "IAM ユーザーのコレクション。グループにアタッチされたポリシーはすべてのメンバーに適用される。" },
              { en: "Organise users by team or role: developers, ops, read-only-auditors. Attach policies to the group, not individual users.", np: "Team वा role द्वारा user organize गर्नुहोस्: developer, ops, read-only-auditor। Individual user होइन, group मा policy attach गर्नुहोस्।", jp: "チームまたはロール別にユーザーを整理：developers・ops・read-only-auditors。個々のユーザーではなくグループにポリシーをアタッチする。" },
              { en: "Users can belong to multiple groups. Permissions are the union of all group policies.", np: "User धेरै group मा belong गर्न सक्छ। Permission सबै group policy को union हो।", jp: "ユーザーは複数のグループに属せる。権限はすべてのグループポリシーの和集合。" },
            ],
            [
              { en: "IAM Role", np: "IAM Role", jp: "IAM ロール" },
              { en: "An identity with temporary credentials. Assumed by users, AWS services, or external identities (OIDC).", np: "Temporary credential सहितको identity। User, AWS service, वा external identity (OIDC) ले assume गर्छ।", jp: "一時的な認証情報を持つアイデンティティ。ユーザー・AWS サービス・外部アイデンティティ（OIDC）によって引き受けられる。" },
              { en: "EC2 instance profiles, Lambda execution roles, ECS task roles, CI/CD pipelines, cross-account access.", np: "EC2 instance profile, Lambda execution role, ECS task role, CI/CD pipeline, cross-account access।", jp: "EC2 インスタンスプロファイル・Lambda 実行ロール・ECS タスクロール・CI/CD パイプライン・クロスアカウントアクセス。" },
              { en: "Prefer roles over long-lived access keys for anything running on AWS. Credentials rotate automatically every hour.", np: "AWS मा चल्ने जुनसुकैका लागि long-lived access key भन्दा role prefer गर्नुहोस्। Credential हरेक घण्टा automatically rotate हुन्छ।", jp: "AWS で実行するものにはすべて長期間有効なアクセスキーよりロールを優先。認証情報は毎時間自動的にローテーションされる。" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "IAM policies — the permission language",
        np: "IAM policy — permission language",
        jp: "IAM ポリシー — 権限の言語",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "There are two kinds of policies: **identity-based policies** (attached to a user, group, or role — they define what that identity can do) and **resource-based policies** (attached directly to an S3 bucket, SQS queue, KMS key, etc. — they define who can access the resource). For access to succeed, both sides must allow it and neither can have an explicit Deny. The evaluation order is: **explicit Deny wins always → explicit Allow → implicit Deny (default)**. AWS Organizations Service Control Policies (SCPs) add another layer above all of this, acting as maximum permission boundaries for entire accounts.",
            np: "दुई प्रकारका policy छन्: **Identity-based policy** (user, group, वा role मा attach गरिन्छ — ती identity ले के गर्न सक्छ define गर्छ) र **resource-based policy** (S3 bucket, SQS queue, KMS key, आदि मा directly attach गरिन्छ — resource मा को access गर्न सक्छ define गर्छ)। Access सफल हुन, दुवै पक्षले allow गर्नुपर्छ र कुनैले explicit Deny हुनुहुँदैन। Evaluation order: **explicit Deny सधैं जित्छ → explicit Allow → implicit Deny (default)**।",
            jp: "ポリシーには 2 種類あります：**アイデンティティベースのポリシー**（ユーザー・グループ・ロールにアタッチ — そのアイデンティティが何をできるかを定義）と**リソースベースのポリシー**（S3 バケット・SQS キュー・KMS キーなどに直接アタッチ — リソースに誰がアクセスできるかを定義）。アクセスを成功させるには、両方がそれを許可し、どちらも明示的な Deny がないことが必要です。評価順序：**明示的な Deny は常に勝つ → 明示的な Allow → 暗黙の Deny（デフォルト）**。",
          },
        },
        {
          type: "code",
          title: {
            en: "A complete IAM policy — annotated",
            np: "एउटा complete IAM policy — annotated",
            jp: "完全な IAM ポリシー — 注釈付き",
          },
          code: `{
  "Version": "2012-10-17",  // Always this value. It is the policy language version, not a date you set.
  "Statement": [
    {
      // --- Statement 1: allow deploy bot to sync to a specific S3 bucket ---
      "Sid": "AllowS3DeployBucketSync",  // Optional identifier — appear in CloudTrail logs
      "Effect": "Allow",                  // Allow or Deny
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::acme-deploy-artifacts",          // the bucket itself (for ListBucket)
        "arn:aws:s3:::acme-deploy-artifacts/*"         // objects inside the bucket
      ]
    },
    {
      // --- Statement 2: allow deploy bot to invalidate only its own CloudFront distribution ---
      "Sid": "AllowCloudFrontInvalidation",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::123456789012:distribution/EXXXXXXXXXXXXXXX"
    },
    {
      // --- Statement 3: deny everything if MFA is not present (good for human users) ---
      "Sid": "DenyWithoutMFA",
      "Effect": "Deny",
      "NotAction": [
        "iam:GetSessionToken"   // allow getting a session token without MFA (needed to bootstrap)
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"  // Deny if MFA is NOT present
        }
      }
    }
  ]
}

// Key facts:
// - Actions follow the pattern  service:ActionName  (case-insensitive)
// - Resources are ARNs  (Amazon Resource Names) — every AWS resource has one
// - Conditions let you restrict by IP, MFA, time of day, tag values, etc.
// - Use aws:RequestedRegion condition to restrict to specific regions`,
        },
      ],
    },
    {
      title: {
        en: "IAM roles — temporary credentials for everything",
        np: "IAM role — सबैका लागि temporary credential",
        jp: "IAM ロール — あらゆるものへの一時的な認証情報",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A role is not logged into — it is **assumed**. When an EC2 instance has an instance profile attached, the AWS SDK on that instance automatically calls `sts:AssumeRole` every hour and refreshes the temporary credentials in the instance metadata service (IMDS). Your Python boto3 or Go SDK code picks them up without any configuration. This is why roles beat long-lived access keys for anything running on AWS: there are no keys to rotate, leak in git, or accidentally log. The same mechanism powers Lambda execution roles, ECS task roles, and CI/CD pipelines via OIDC (GitHub Actions → `aws-actions/configure-aws-credentials`).",
            np: "Role मा login गरिँदैन — यो **assume** गरिन्छ। EC2 instance मा instance profile attach भएमा, त्यो instance मा AWS SDK ले automatically हरेक घण्टा `sts:AssumeRole` call गर्छ र instance metadata service (IMDS) मा temporary credential refresh गर्छ। तपाईंको Python boto3 वा Go SDK code ले कुनै configuration बिना तिनीहरू pick up गर्छ। यही कारण AWS मा चल्ने जुनसुकैका लागि role ले long-lived access key भन्दा राम्रो गर्छ: rotate गर्ने, git मा leak हुने, वा accidentally log हुने कुनै key छैन।",
            jp: "ロールにはログインしません — **引き受ける**ものです。EC2 インスタンスにインスタンスプロファイルがアタッチされると、そのインスタンス上の AWS SDK が毎時間自動的に `sts:AssumeRole` を呼び出し、インスタンスメタデータサービス（IMDS）の一時的な認証情報を更新します。Python boto3 や Go SDK コードは設定なしでそれらを取得します。これが AWS で実行するものにロールが長期間有効なアクセスキーより優れている理由です：ローテーション・git へのリーク・誤ってのログに残すべきキーがありません。",
          },
        },
        {
          type: "code",
          title: {
            en: "Assuming roles — CLI and setting up EC2 instance profiles",
            np: "Role assume गर्नुहोस् — CLI र EC2 instance profile setup",
            jp: "ロールを引き受ける — CLI と EC2 インスタンスプロファイルの設定",
          },
          code: `# --- Manually assume a role (useful for cross-account access or testing) ---
aws sts assume-role \
    --role-arn "arn:aws:iam::999888777666:role/DeployRole" \
    --role-session-name "rajan-deploy-$(date +%s)" \
    --duration-seconds 3600

# Output gives you temporary credentials:
# {
#   "Credentials": {
#     "AccessKeyId": "ASIA...",
#     "SecretAccessKey": "...",
#     "SessionToken": "IQoJ...",
#     "Expiration": "2026-05-01T14:00:00Z"
#   }
# }

# Export them to use in the current shell session:
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQoJ..."

# Or use a named profile with auto assume-role (much cleaner for daily use):
# In ~/.aws/config:
# [profile deploy-prod]
# role_arn = arn:aws:iam::999888777666:role/DeployRole
# source_profile = default
# Now: aws s3 ls --profile deploy-prod  (automatically assumes the role)

# --- Create an EC2 instance profile (Terraform-style CLI equivalent) ---
# 1. Create the role with a trust policy allowing EC2 to assume it
aws iam create-role \
    --role-name MyAppRole \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": { "Service": "ec2.amazonaws.com" },
        "Action": "sts:AssumeRole"
      }]
    }'

# 2. Attach a permission policy to the role
aws iam attach-role-policy \
    --role-name MyAppRole \
    --policy-arn "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"

# 3. Create the instance profile and add the role to it
aws iam create-instance-profile --instance-profile-name MyAppProfile
aws iam add-role-to-instance-profile \
    --instance-profile-name MyAppProfile \
    --role-name MyAppRole

# 4. Attach to an EC2 instance
aws ec2 associate-iam-instance-profile \
    --instance-id i-0abcdef1234567890 \
    --iam-instance-profile Name=MyAppProfile

# Now boto3 on that instance picks up credentials automatically:
# import boto3
# s3 = boto3.client('s3')  # no credentials needed — role handles it`,
        },
      ],
    },
    {
      title: {
        en: "Least privilege in practice",
        np: "Least privilege व्यवहारमा",
        jp: "最小権限の実践",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Common IAM mistakes, why they are dangerous, and how to fix them",
            np: "सामान्य IAM mistake, किन खतरनाक छन्, र कसरी ठीक गर्ने",
            jp: "よくある IAM の間違い・なぜ危険か・修正方法",
          },
          headers: [
            { en: "Mistake", np: "Mistake", jp: "間違い" },
            { en: "Why dangerous", np: "किन खतरनाक", jp: "なぜ危険か" },
            { en: "Fix", np: "Fix", jp: "修正方法" },
          ],
          rows: [
            [
              { en: "Using root credentials for daily work", np: "Daily काममा root credential प्रयोग गर्नुहोस्", jp: "日常業務にルート認証情報を使用" },
              { en: "Root cannot be restricted by IAM policies. One leaked key = full account takeover.", np: "Root लाई IAM policy ले restrict गर्न सकिँदैन। एउटा leaked key = full account takeover।", jp: "ルートは IAM ポリシーで制限できない。1 つの漏洩キー = アカウント完全乗っ取り。" },
              { en: "Create an IAM admin user on day 1. Revoke all root access keys. Use root only for billing and account recovery.", np: "Day 1 मा IAM admin user बनाउनुहोस्। सबै root access key revoke गर्नुहोस्। Billing र account recovery का लागि मात्र root प्रयोग गर्नुहोस्।", jp: "初日に IAM 管理者ユーザーを作成。すべてのルートアクセスキーを失効。請求とアカウント回復にのみルートを使用。" },
            ],
            [
              { en: "\"Action\": \"*\" with \"Resource\": \"*\"", np: "\"Action\": \"*\" सहित \"Resource\": \"*\"", jp: "\"Action\": \"*\" と \"Resource\": \"*\"" },
              { en: "This is full administrator access. Any compromise of that identity = full account compromise.", np: "यो full administrator access हो। त्यो identity को कुनै पनि compromise = full account compromise।", jp: "これは完全な管理者アクセス。そのアイデンティティの侵害 = アカウントの完全な侵害。" },
              { en: "Enumerate specific actions and resources. Start with read-only access and add permissions only when blocked.", np: "Specific action र resource enumerate गर्नुहोस्। Read-only access बाट सुरु गर्नुहोस् र block भएमा मात्र permission थप्नुहोस्।", jp: "特定のアクションとリソースを列挙する。読み取り専用アクセスから始め、ブロックされたときのみ権限を追加する。" },
            ],
            [
              { en: "Sharing access keys between services", np: "Service बीच access key share गर्नुहोस्", jp: "サービス間でアクセスキーを共有" },
              { en: "You cannot audit which service did what. Rotating the key breaks all services simultaneously.", np: "कुन service ले के गर्यो audit गर्न सकिँदैन। Key rotate गर्दा सबै service एकैसाथ break हुन्छ।", jp: "どのサービスが何をしたか監査できない。キーのローテーションで全サービスが同時に壊れる。" },
              { en: "Give each service its own IAM role with exactly the permissions it needs. Credentials are free; roles are free.", np: "प्रत्येक service लाई आफ्नो चाहिने permission मात्र भएको IAM role दिनुहोस्। Credential निःशुल्क; role निःशुल्क।", jp: "各サービスに必要な権限のみを持つ独自の IAM ロールを付与する。認証情報は無料；ロールは無料。" },
            ],
            [
              { en: "No MFA on privileged users", np: "Privileged user मा MFA छैन", jp: "特権ユーザーへの MFA なし" },
              { en: "A phished password = full admin access. Attackers routinely target AWS console credentials.", np: "Phished password = full admin access। Attacker नियमित रूपमा AWS console credential target गर्छन्।", jp: "フィッシングされたパスワード = 完全な管理者アクセス。攻撃者は日常的に AWS コンソールの認証情報を狙う。" },
              { en: "Enforce MFA with an IAM policy condition. Use a hardware key (YubiKey) for root and admins. Block all actions if MFA is not present.", np: "IAM policy condition सँग MFA enforce गर्नुहोस्। Root र admin का लागि hardware key (YubiKey) प्रयोग गर्नुहोस्। MFA नभएमा सबै action block गर्नुहोस्।", jp: "IAM ポリシー条件で MFA を強制する。ルートと管理者にはハードウェアキー（YubiKey）を使用。MFA がない場合はすべてのアクションをブロック。" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "IAM Access Analyzer continuously monitors your account for policies that grant access to external entities (another account, an anonymous user, an AWS service outside your org). It flags these as findings you must review. `aws iam generate-service-last-accessed-details --arn arn:aws:iam::ACCOUNT:role/MyRole` produces a report showing which services the role has accessed in the last 400 days — anything not accessed can be safely removed from the policy. Start with the AWS managed read-only policy; add write actions only when your application actually needs them.",
            np: "IAM Access Analyzer ले continuously तपाईंको account monitor गर्छ external entity (अर्को account, anonymous user, तपाईंको org बाहिरको AWS service) लाई access grant गर्ने policy का लागि। यसले यिनलाई findings को रूपमा flag गर्छ जुन review गर्नुपर्छ। `aws iam generate-service-last-accessed-details --arn arn:aws:iam::ACCOUNT:role/MyRole` ले report produce गर्छ जसले role ले अन्तिम 400 दिनमा access गरेका service देखाउँछ — access नगरिएका कुनैलाई पनि policy बाट safely remove गर्न सकिन्छ।",
            jp: "IAM Access Analyzer は、外部エンティティ（別のアカウント・匿名ユーザー・org 外の AWS サービス）にアクセスを付与するポリシーがないかアカウントを継続的に監視します。これらをレビューが必要な検出結果としてフラグを立てます。`aws iam generate-service-last-accessed-details --arn arn:aws:iam::ACCOUNT:role/MyRole` は、ロールが過去 400 日間にアクセスしたサービスを示すレポートを生成します — アクセスされていないものはポリシーから安全に削除できます。",
          },
        },
      ],
    },
    {
      title: {
        en: "MFA and credential security",
        np: "MFA र credential security",
        jp: "MFA と認証情報のセキュリティ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Enable MFA on your root account before doing anything else — use a hardware security key (YubiKey, Google Titan) rather than a phone app for the root account, because phone apps can be sim-swapped. For IAM users, TOTP apps (Google Authenticator, Authy) are acceptable. Never store access keys in `.env` files committed to git, EC2 user-data scripts, AMI images, or Docker images. Use AWS Secrets Manager for application secrets (automatic rotation built in) and SSM Parameter Store (SecureString type) for configuration values. If you accidentally commit a key, treat it as compromised: deactivate it immediately, do not just delete — check CloudTrail for what it was used for in the last 24 hours.",
            np: "Root account मा अरू केही गर्नु अघि MFA enable गर्नुहोस् — root account का लागि phone app भन्दा hardware security key (YubiKey, Google Titan) प्रयोग गर्नुहोस्, किनभने phone app sim-swap हुन सक्छ। IAM user का लागि TOTP app (Google Authenticator, Authy) acceptable छ। Git मा commit गरिएको `.env` file, EC2 user-data script, AMI image, वा Docker image मा access key कहिल्यै store नगर्नुहोस्। Application secret का लागि AWS Secrets Manager र configuration value का लागि SSM Parameter Store (SecureString type) प्रयोग गर्नुहोस्।",
            jp: "他に何もする前にルートアカウントに MFA を有効化しましょう — ルートアカウントには電話アプリではなくハードウェアセキュリティキー（YubiKey・Google Titan）を使用してください。電話アプリは SIM スワップされる可能性があるためです。IAM ユーザーには TOTP アプリ（Google Authenticator・Authy）で十分です。git にコミットされた `.env` ファイル・EC2 ユーザーデータスクリプト・AMI イメージ・Docker イメージにアクセスキーを保存しないこと。アプリケーションシークレットには AWS Secrets Manager を、設定値には SSM Parameter Store（SecureString タイプ）を使用する。",
          },
        },
        {
          type: "code",
          title: {
            en: "Enforce MFA + rotate access keys with zero downtime",
            np: "MFA enforce गर्नुहोस् + zero downtime सँग access key rotate गर्नुहोस्",
            jp: "MFA の強制 + ゼロダウンタイムでのアクセスキーのローテーション",
          },
          code: `# --- Policy to enforce MFA (attach to your developers group) ---
# Save as enforce-mfa-policy.json and run:
# aws iam put-group-policy --group-name Developers \
#     --policy-name RequireMFA \
#     --policy-document file://enforce-mfa-policy.json

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowViewAccountInfo",
      "Effect": "Allow",
      "Action": ["iam:GetAccountPasswordPolicy", "iam:ListVirtualMFADevices"],
      "Resource": "*"
    },
    {
      "Sid": "AllowManageOwnMFA",
      "Effect": "Allow",
      "Action": [
        "iam:CreateVirtualMFADevice", "iam:EnableMFADevice",
        "iam:GetUser",               "iam:ListMFADevices",
        "iam:ListUserTags",          "iam:ResyncMFADevice",
        "iam:GetSessionToken"
      ],
      "Resource": "arn:aws:iam::*:user/\${aws:username}"
    },
    {
      "Sid": "DenyAllExceptListedIfNoMFA",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice", "iam:EnableMFADevice",
        "iam:GetUser",               "iam:ListMFADevices",
        "iam:ListVirtualMFADevices", "iam:ResyncMFADevice",
        "iam:GetSessionToken",       "sts:GetSessionToken"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": { "aws:MultiFactorAuthPresent": "false" }
      }
    }
  ]
}

# --- Zero-downtime access key rotation (4-step process) ---
# Step 1: Create a new key alongside the existing one (max 2 keys per user)
aws iam create-access-key --user-name deploy-bot
# Note the new AccessKeyId and SecretAccessKey

# Step 2: Update your application / CI secret to use the new key
# (e.g., update GitHub Actions secret, update .env.production, update Kubernetes secret)

# Step 3: Wait for the new key to confirm working (check CloudTrail for successful API calls)
aws cloudtrail lookup-events \
    --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=ASIA_NEW_KEY_ID \
    --max-results 5

# Step 4: Deactivate (not delete yet) the old key, confirm nothing breaks, then delete
aws iam update-access-key \
    --user-name deploy-bot \
    --access-key-id AKIA_OLD_KEY_ID \
    --status Inactive

# Wait 24 hours, check CloudTrail shows no usage of the old key, then:
aws iam delete-access-key \
    --user-name deploy-bot \
    --access-key-id AKIA_OLD_KEY_ID`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: set up a secure IAM baseline",
        np: "Hands-on: secure IAM baseline set up गर्नुहोस्",
        jp: "ハンズオン：セキュアな IAM ベースラインをセットアップする",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Log into the AWS console as root, go to IAM → Security recommendations, and enable MFA on the root account using a hardware key or authenticator app. Verify the Security Hub score improves.",
              np: "Root को रूपमा AWS console मा login गर्नुहोस्, IAM → Security recommendations मा जानुहोस्, र hardware key वा authenticator app प्रयोग गरी root account मा MFA enable गर्नुहोस्। Security Hub score सुधार भएको verify गर्नुहोस्।",
              jp: "ルートとして AWS コンソールにログインし、IAM → Security recommendations に移動し、ハードウェアキーまたは認証アプリを使ってルートアカウントに MFA を有効化する。Security Hub スコアが改善されることを確認する。",
            },
            {
              en: "Create an `Admins` IAM group and attach the `AdministratorAccess` managed policy to it: `aws iam create-group --group-name Admins && aws iam attach-group-policy --group-name Admins --policy-arn arn:aws:iam::aws:policy/AdministratorAccess`",
              np: "`Admins` IAM group बनाउनुहोस् र `AdministratorAccess` managed policy attach गर्नुहोस्: `aws iam create-group --group-name Admins && aws iam attach-group-policy --group-name Admins --policy-arn arn:aws:iam::aws:policy/AdministratorAccess`",
              jp: "`Admins` IAM グループを作成し `AdministratorAccess` マネージドポリシーをアタッチ：`aws iam create-group --group-name Admins && aws iam attach-group-policy --group-name Admins --policy-arn arn:aws:iam::aws:policy/AdministratorAccess`",
            },
            {
              en: "Create your personal IAM user, add it to the Admins group, set a password with a temporary flag so you must reset on first login, and enable MFA: `aws iam create-user --user-name rajan && aws iam add-user-to-group --user-name rajan --group-name Admins`",
              np: "Personal IAM user बनाउनुहोस्, Admins group मा थप्नुहोस्, first login मा reset गर्नुपर्ने temporary flag सहित password set गर्नुहोस्, र MFA enable गर्नुहोस्: `aws iam create-user --user-name rajan && aws iam add-user-to-group --user-name rajan --group-name Admins`",
              jp: "個人の IAM ユーザーを作成し、Admins グループに追加し、最初のログイン時にリセット必須の一時フラグ付きパスワードを設定し、MFA を有効化：`aws iam create-user --user-name rajan && aws iam add-user-to-group --user-name rajan --group-name Admins`",
            },
            {
              en: "Create a deploy role with least-privilege S3 + CloudFront access: write a custom policy JSON that allows `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, `s3:ListBucket` on your specific bucket ARN, and `cloudfront:CreateInvalidation` on your specific distribution ARN. Attach it to a new `DeployRole`.",
              np: "Least-privilege S3 + CloudFront access सहित deploy role बनाउनुहोस्: specific bucket ARN मा `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, `s3:ListBucket`, र specific distribution ARN मा `cloudfront:CreateInvalidation` allow गर्ने custom policy JSON लेख्नुहोस्। नयाँ `DeployRole` मा attach गर्नुहोस्।",
              jp: "最小権限の S3 + CloudFront アクセスを持つデプロイロールを作成：特定のバケット ARN への `s3:PutObject`・`s3:GetObject`・`s3:DeleteObject`・`s3:ListBucket`、および特定のディストリビューション ARN への `cloudfront:CreateInvalidation` を許可するカスタムポリシー JSON を書く。新しい `DeployRole` にアタッチする。",
            },
            {
              en: "Use the IAM Policy Simulator to verify the role can do what it should and cannot do what it should not: `aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::ACCOUNT:role/DeployRole --action-names s3:PutObject s3:DeleteBucket --resource-arns arn:aws:s3:::your-bucket/*`",
              np: "IAM Policy Simulator प्रयोग गरी verify गर्नुहोस् कि role ले गर्नुपर्ने गर्न सक्छ र नगर्नुपर्ने गर्न सक्दैन: `aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::ACCOUNT:role/DeployRole --action-names s3:PutObject s3:DeleteBucket --resource-arns arn:aws:s3:::your-bucket/*`",
              jp: "IAM ポリシーシミュレーターを使ってロールができるべきことができ、できないべきことができないことを確認：`aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::ACCOUNT:role/DeployRole --action-names s3:PutObject s3:DeleteBucket --resource-arns arn:aws:s3:::your-bucket/*`",
            },
            {
              en: "Enable IAM Access Analyzer: `aws accessanalyzer create-analyzer --analyzer-name my-account-analyzer --type ACCOUNT`. Review any findings it surfaces immediately — they indicate resources accessible from outside your account.",
              np: "IAM Access Analyzer enable गर्नुहोस्: `aws accessanalyzer create-analyzer --analyzer-name my-account-analyzer --type ACCOUNT`। यसले देखाउने findings तुरुन्तै review गर्नुहोस् — तिनीहरूले account बाहिरबाट accessible resource indicate गर्छन्।",
              jp: "IAM Access Analyzer を有効化：`aws accessanalyzer create-analyzer --analyzer-name my-account-analyzer --type ACCOUNT`。表示される検出結果をすぐにレビューする — アカウント外部からアクセス可能なリソースを示している。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When do I use an IAM user vs an IAM role?",
        np: "IAM user vs IAM role — कहिले कुन प्रयोग गर्ने?",
        jp: "IAM ユーザーと IAM ロール、いつどちらを使うか？",
      },
      answer: {
        en: "IAM users are for humans who need to log into the console or use long-lived access keys (legacy integrations, developer laptops). IAM roles are for everything that runs on AWS — EC2 instances, Lambda functions, ECS tasks, CodeBuild projects — they get automatically-rotated temporary credentials with no keys to manage. Roles are also the right choice for CI/CD pipelines: GitHub Actions can assume an AWS role via OIDC (`aws-actions/configure-aws-credentials`) without storing any AWS credentials in GitHub Secrets.",
        np: "IAM user console login वा long-lived access key (legacy integration, developer laptop) चाहिने human का लागि हो। IAM role AWS मा चल्ने सबैका लागि हो — EC2 instance, Lambda function, ECS task, CodeBuild project — तिनीहरूले automatically-rotated temporary credential पाउँछन् manage गर्न कुनै key छैन। Role CI/CD pipeline का लागि पनि सही choice हो: GitHub Actions ले OIDC मार्फत AWS role assume गर्न सक्छ GitHub Secrets मा कुनै AWS credential store नगरी।",
        jp: "IAM ユーザーはコンソールにログインするか長期間有効なアクセスキーを使う必要がある人間向けです（レガシー統合・開発者のラップトップ）。IAM ロールは AWS で実行するすべてのもの向けです — EC2 インスタンス・Lambda 関数・ECS タスク・CodeBuild プロジェクト — 管理するキーなしで自動ローテーションされる一時的な認証情報を取得します。ロールは CI/CD パイプラインにも適した選択肢です：GitHub Actions は GitHub Secrets に AWS 認証情報を保存せずに OIDC 経由で AWS ロールを引き受けられます。",
      },
      tag: { en: "iam", np: "IAM", jp: "IAM" },
    },
    {
      question: {
        en: "What's the difference between an identity-based and a resource-based policy?",
        np: "Identity-based र resource-based policy बीच के फरक छ?",
        jp: "アイデンティティベースポリシーとリソースベースポリシーの違いは？",
      },
      answer: {
        en: "Identity-based policies are attached to an IAM user, group, or role — they answer 'what can this identity do?' Resource-based policies are attached directly to a resource like an S3 bucket, SQS queue, or KMS key — they answer 'who is allowed to access me?' For a same-account access request, either an identity policy OR a resource policy granting access is sufficient. For cross-account access, BOTH the identity policy in account A AND the resource policy in account B must grant access — one alone is not enough.",
        np: "Identity-based policy IAM user, group, वा role मा attach गरिन्छ — यसले 'यो identity ले के गर्न सक्छ?' को जवाफ दिन्छ। Resource-based policy S3 bucket, SQS queue, वा KMS key जस्तो resource मा directly attach गरिन्छ — यसले 'मलाई को access गर्न अनुमति छ?' को जवाफ दिन्छ। Same-account access request का लागि, identity policy वा resource policy मध्ये कुनै एकले access grant गर्दा पर्याप्त छ। Cross-account access का लागि, account A मा identity policy र account B मा resource policy दुवैले access grant गर्नुपर्छ।",
        jp: "アイデンティティベースポリシーは IAM ユーザー・グループ・ロールにアタッチされます — 「このアイデンティティは何ができるか？」に答えます。リソースベースポリシーは S3 バケット・SQS キュー・KMS キーなどのリソースに直接アタッチされます — 「誰が私にアクセスできるか？」に答えます。同一アカウントのアクセスリクエストでは、アイデンティティポリシーまたはリソースポリシーのどちらかがアクセスを許可すれば十分です。クロスアカウントアクセスでは、アカウント A のアイデンティティポリシーとアカウント B のリソースポリシーの両方がアクセスを許可する必要があります。",
      },
      tag: { en: "iam", np: "IAM", jp: "IAM" },
    },
    {
      question: {
        en: "Why is `*` in IAM actions dangerous even when the resource is restricted?",
        np: "Resource restricted भएमा पनि IAM action मा `*` किन खतरनाक छ?",
        jp: "リソースが制限されていても IAM アクションの `*` がなぜ危険か？",
      },
      answer: {
        en: "AWS releases new API actions regularly. `s3:*` grants access to all current S3 actions — but also every new action AWS adds in the future. An action added next year might be `s3:PutBucketPublicAccessBlock` being overridden, or a new destructive operation you never anticipated. Always enumerate specific actions: `s3:PutObject`, `s3:GetObject`, etc. The same applies to `ec2:*` — RunInstances, TerminateInstances, CreateVpc are all under `ec2:*`. Enumerate, use IAM Access Analyzer to find what is actually used, and remove everything else.",
        np: "AWS नियमित रूपमा नयाँ API action release गर्छ। `s3:*` ले हाल सबै S3 action को access grant गर्छ — तर AWS ले भविष्यमा थप्ने हरेक नयाँ action पनि। अर्को वर्ष थपिएको action `s3:PutBucketPublicAccessBlock` override वा तपाईंले कहिल्यै anticipate नगरेको नयाँ destructive operation हुन सक्छ। सधैं specific action enumerate गर्नुहोस्: `s3:PutObject`, `s3:GetObject`, आदि। `ec2:*` मा पनि यही लागू हुन्छ।",
        jp: "AWS は定期的に新しい API アクションをリリースします。`s3:*` は現在のすべての S3 アクションへのアクセスを付与します — しかし AWS が将来追加するすべての新しいアクションも対象になります。来年追加されるアクションは `s3:PutBucketPublicAccessBlock` のオーバーライドや、あなたが予期しなかった新しい破壊的な操作かもしれません。常に特定のアクションを列挙してください：`s3:PutObject`・`s3:GetObject` など。`ec2:*` にも同じことが言えます。",
      },
      tag: { en: "security", np: "Security", jp: "セキュリティ" },
    },
  ],
};
