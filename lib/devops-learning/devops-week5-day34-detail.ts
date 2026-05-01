import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Amazon RDS (Relational Database Service) removes the undifferentiated heavy lifting of running a database — no OS patching, no storage management, no backup configuration. A DevOps engineer's job is to configure it correctly: right instance size, Multi-AZ for HA, read replicas for scaling, parameter groups for tuning, and robust backup/restore.",
    np: "Amazon RDS (Relational Database Service) ले database चलाउने undifferentiated heavy lifting हटाउँछ — OS patching छैन, storage management छैन, backup configuration छैन। DevOps engineer को काम यसलाई सही configure गर्नु हो: सही instance size, HA का लागि Multi-AZ, scaling का लागि read replica, tuning का लागि parameter group, र robust backup/restore।",
    jp: "Amazon RDS（Relational Database Service）はデータベースの運用における付加価値のない重作業を排除します — OS パッチ適用なし・ストレージ管理なし・バックアップ設定なし。DevOps エンジニアの仕事は正しく設定することです：適切なインスタンスサイズ・HA のための Multi-AZ・スケーリングのための読み取りレプリカ・チューニングのためのパラメータグループ・堅牢なバックアップ/リストア。",
  } as const,
  o2: {
    en: "Today you learn how RDS works under the hood (it's EC2 + EBS + automated tooling), how to design for high availability with Multi-AZ, how to scale reads with replicas, and how to connect securely via IAM authentication and Secrets Manager — no more database passwords in environment variables.",
    np: "आज तपाईंले RDS कसरी काम गर्छ भन्ने सिक्नुहुनेछ (यो EC2 + EBS + automated tooling हो), Multi-AZ सँग high availability का लागि कसरी design गर्ने, replica सँग read कसरी scale गर्ने, र IAM authentication र Secrets Manager मार्फत securely कसरी connect गर्ने — environment variable मा database password अब छैन।",
    jp: "今日は RDS がどのように動作するか（EC2 + EBS + 自動化ツール）・Multi-AZ で高可用性を設計する方法・レプリカで読み取りをスケールする方法・IAM 認証と Secrets Manager を通じてセキュアに接続する方法を学びます — 環境変数にデータベースパスワードを入れるのは終わりです。",
  } as const,
};

export const DEVOPS_DAY_34_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "RDS architecture & engine choices",
        np: "RDS architecture र engine choices",
        jp: "RDS アーキテクチャとエンジンの選択",
      },
      blocks: [
        { type: "diagram", id: "devops-rds-architecture" },
        {
          type: "table",
          caption: {
            en: "RDS engines — managed vs Aurora, typical IOPS, when to choose each",
            np: "RDS engine — managed vs Aurora, typical IOPS, र प्रत्येकलाई कहिले रोज्ने",
            jp: "RDS エンジン — マネージド対 Aurora・一般的な IOPS・それぞれの選択タイミング",
          },
          headers: [
            { en: "Engine", np: "Engine", jp: "エンジン" },
            { en: "Type", np: "Type", jp: "タイプ" },
            { en: "Typical IOPS", np: "Typical IOPS", jp: "一般的な IOPS" },
            { en: "When to Choose", np: "कहिले रोज्ने", jp: "選択のタイミング" },
          ],
          rows: [
            [
              { en: "MySQL 8.0", np: "MySQL 8.0", jp: "MySQL 8.0" },
              { en: "Managed RDS", np: "Managed RDS", jp: "マネージド RDS" },
              { en: "Up to 80,000 (io2)", np: "80,000 सम्म (io2)", jp: "最大 80,000（io2）" },
              { en: "Familiar MySQL workloads, WordPress, legacy apps — tight budget", np: "Familiar MySQL workload, WordPress, legacy app — tight budget", jp: "馴染みのある MySQL ワークロード・WordPress・レガシーアプリ — 予算が厳しい場合" },
            ],
            [
              { en: "PostgreSQL 15", np: "PostgreSQL 15", jp: "PostgreSQL 15" },
              { en: "Managed RDS", np: "Managed RDS", jp: "マネージド RDS" },
              { en: "Up to 80,000 (io2)", np: "80,000 सम्म (io2)", jp: "最大 80,000（io2）" },
              { en: "Complex queries, JSONB, GIS extensions, analytics-heavy workloads", np: "Complex query, JSONB, GIS extension, analytics-heavy workload", jp: "複雑なクエリ・JSONB・GIS 拡張機能・分析負荷の高いワークロード" },
            ],
            [
              { en: "MariaDB", np: "MariaDB", jp: "MariaDB" },
              { en: "Managed RDS", np: "Managed RDS", jp: "マネージド RDS" },
              { en: "Up to 80,000 (io2)", np: "80,000 सम्म (io2)", jp: "最大 80,000（io2）" },
              { en: "MySQL-compatible with open-source licensing requirements", np: "Open-source licensing requirement सहित MySQL-compatible", jp: "オープンソースライセンス要件のある MySQL 互換" },
            ],
            [
              { en: "Oracle", np: "Oracle", jp: "Oracle" },
              { en: "Managed RDS", np: "Managed RDS", jp: "マネージド RDS" },
              { en: "Up to 256,000 (io2)", np: "256,000 सम्म (io2)", jp: "最大 256,000（io2）" },
              { en: "Existing Oracle licence (BYOL) or Oracle-specific features; high cost", np: "Existing Oracle licence (BYOL) वा Oracle-specific feature; उच्च cost", jp: "既存の Oracle ライセンス（BYOL）または Oracle 固有の機能；高コスト" },
            ],
            [
              { en: "SQL Server", np: "SQL Server", jp: "SQL Server" },
              { en: "Managed RDS", np: "Managed RDS", jp: "マネージド RDS" },
              { en: "Up to 64,000 (io2)", np: "64,000 सम्म (io2)", jp: "最大 64,000（io2）" },
              { en: ".NET applications, Windows-native stacks with existing SQL Server licensing", np: ".NET application, existing SQL Server licensing सहित Windows-native stack", jp: ".NET アプリ・既存の SQL Server ライセンスがある Windows ネイティブスタック" },
            ],
            [
              { en: "Aurora MySQL", np: "Aurora MySQL", jp: "Aurora MySQL" },
              { en: "Aurora (serverless-capable)", np: "Aurora (serverless-capable)", jp: "Aurora（サーバーレス対応）" },
              { en: "Up to 200,000", np: "200,000 सम्म", jp: "最大 200,000" },
              { en: "MySQL workloads needing 5x throughput, 15 replicas, or Aurora Serverless v2", np: "5x throughput, 15 replica, वा Aurora Serverless v2 चाहिने MySQL workload", jp: "5 倍のスループット・15 レプリカ・Aurora Serverless v2 が必要な MySQL ワークロード" },
            ],
            [
              { en: "Aurora PostgreSQL", np: "Aurora PostgreSQL", jp: "Aurora PostgreSQL" },
              { en: "Aurora (serverless-capable)", np: "Aurora (serverless-capable)", jp: "Aurora（サーバーレス対応）" },
              { en: "Up to 200,000", np: "200,000 सम्म", jp: "最大 200,000" },
              { en: "New production PostgreSQL workloads where performance and HA matter most", np: "Performance र HA सबैभन्दा महत्त्वपूर्ण नयाँ production PostgreSQL workload", jp: "パフォーマンスと HA が最重要な新しい本番 PostgreSQL ワークロード" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "RDS runs on EC2 instances you don't manage — you choose the instance class (db.t3.micro for dev, db.r6g.large for production) and storage type (gp3 for most workloads, io1 for IOPS-sensitive). Storage auto-scaling expands the volume when you hit 10% free space.",
            np: "RDS ले तपाईंले manage नगर्ने EC2 instance मा चल्छ — तपाईंले instance class (dev का लागि db.t3.micro, production का लागि db.r6g.large) र storage type (धेरैजसो workload का लागि gp3, IOPS-sensitiveका लागि io1) रोज्नुहुन्छ। Storage auto-scaling ले 10% free space मा पुगेपछि volume expand गर्छ।",
            jp: "RDS はあなたが管理しない EC2 インスタンス上で動作します — インスタンスクラス（開発には db.t3.micro、本番には db.r6g.large）とストレージタイプ（ほとんどのワークロードには gp3、IOPS に敏感なものには io1）を選択します。ストレージの自動スケーリングは空き容量が 10% を切るとボリュームを拡張します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Multi-AZ — high availability",
        np: "Multi-AZ — high availability",
        jp: "Multi-AZ — 高可用性",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Multi-AZ keeps a synchronous standby replica in a different AZ. Failover is automatic — RDS flips the DNS CNAME to the standby within 60-120 seconds. You don't change your connection string. Enable for any production database — the standby also gets patched first, reducing maintenance window impact. Multi-AZ is NOT a read replica (standby is not readable).",
            np: "Multi-AZ ले फरक AZ मा synchronous standby replica राख्छ। Failover automatic हो — RDS ले 60-120 second भित्र DNS CNAME लाई standby मा flip गर्छ। तपाईंले connection string परिवर्तन गर्नुपर्दैन। कुनै पनि production database का लागि enable गर्नुहोस् — standby पनि पहिले patch हुन्छ, maintenance window impact कम गर्छ। Multi-AZ read replica होइन (standby पढ्न मिल्दैन)।",
            jp: "Multi-AZ は異なる AZ に同期スタンバイレプリカを保持します。フェイルオーバーは自動的です — RDS は 60〜120 秒以内に DNS CNAME をスタンバイに切り替えます。接続文字列を変更する必要はありません。本番データベースには必ず有効化してください — スタンバイも先にパッチ適用されるため、メンテナンスウィンドウへの影響を軽減します。Multi-AZ は読み取りレプリカではありません（スタンバイは読み取り不可）。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create Multi-AZ RDS, trigger failover, and enable deletion protection",
            np: "Multi-AZ RDS create गर्नुहोस्, failover trigger गर्नुहोस्, र deletion protection enable गर्नुहोस्",
            jp: "Multi-AZ RDS の作成・フェイルオーバーのトリガー・削除保護の有効化",
          },
          code: `# Create a PostgreSQL 15 instance with Multi-AZ enabled
aws rds create-db-instance \
    --db-instance-identifier prod-postgres \
    --db-instance-class db.t3.medium \
    --engine postgres \
    --engine-version "15.4" \
    --master-username dbadmin \
    --master-user-password "$(aws secretsmanager get-random-password --output text)" \
    --allocated-storage 100 \
    --storage-type gp3 \
    --multi-az \
    --db-subnet-group-name prod-db-subnet-group \
    --vpc-security-group-ids sg-0abc123def456789 \
    --backup-retention-period 7 \
    --deletion-protection \
    --enable-performance-insights \
    --performance-insights-retention-period 7 \
    --tags Key=Environment,Value=production

# Wait until the instance is available
aws rds wait db-instance-available \
    --db-instance-identifier prod-postgres

# Trigger a manual failover (tests your HA setup — the standby becomes primary)
aws rds reboot-db-instance \
    --db-instance-identifier prod-postgres \
    --force-failover

# Monitor recent RDS events to verify failover completed
aws rds describe-events \
    --source-identifier prod-postgres \
    --source-type db-instance \
    --duration 60 \
    --query "Events[*].{Time:Date,Message:Message}"

# Enable deletion protection on an existing instance (forgot to set it at creation)
aws rds modify-db-instance \
    --db-instance-identifier prod-postgres \
    --deletion-protection \
    --apply-immediately`,
        },
      ],
    },
    {
      title: {
        en: "Read replicas — scaling reads",
        np: "Read replica — read scaling",
        jp: "読み取りレプリカ — 読み取りのスケーリング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Read replicas use async replication. You can create up to 5 replicas per primary (15 for Aurora). Your application must use the replica endpoint for read queries. Promote a replica to standalone if you need to split a database. Cross-region replicas add DR capability. Use Connection Pooling (PgBouncer / RDS Proxy) to avoid connection storms from Lambda.",
            np: "Read replica ले async replication प्रयोग गर्छ। तपाईं primary प्रति 5 replica सम्म create गर्न सक्नुहुन्छ (Aurora का लागि 15)। तपाईंको application ले read query का लागि replica endpoint प्रयोग गर्नुपर्छ। Database split गर्न आवश्यक भएमा replica लाई standalone मा promote गर्नुहोस्। Cross-region replica ले DR capability थप्छ। Lambda बाट connection storm avoid गर्न Connection Pooling (PgBouncer / RDS Proxy) प्रयोग गर्नुहोस्।",
            jp: "読み取りレプリカは非同期レプリケーションを使用します。プライマリごとに最大 5 つのレプリカを作成できます（Aurora は 15）。アプリケーションは読み取りクエリにレプリカエンドポイントを使用する必要があります。データベースを分割する必要がある場合はレプリカをスタンドアロンに昇格させます。クロスリージョンレプリカは DR 機能を追加します。Lambda からの接続ストームを避けるために接続プーリング（PgBouncer / RDS Proxy）を使用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create read replica, check replication lag, and set up RDS Proxy",
            np: "Read replica create गर्नुहोस्, replication lag check गर्नुहोस्, र RDS Proxy setup गर्नुहोस्",
            jp: "読み取りレプリカの作成・レプリケーション遅延の確認・RDS Proxy のセットアップ",
          },
          code: `# Create a read replica (in same region)
aws rds create-db-instance-read-replica \
    --db-instance-identifier prod-postgres-replica-1 \
    --source-db-instance-identifier prod-postgres \
    --db-instance-class db.t3.medium \
    --availability-zone us-east-1b \
    --publicly-accessible false

# Create a cross-region read replica (for DR or geo-proximity reads)
aws rds create-db-instance-read-replica \
    --db-instance-identifier prod-postgres-replica-eu \
    --source-db-instance-identifier arn:aws:rds:us-east-1:123456789012:db:prod-postgres \
    --region eu-west-1 \
    --db-instance-class db.t3.medium

# Check replication lag (ReplicaLag in seconds — should be < 1s for same-region)
aws rds describe-db-instances \
    --db-instance-identifier prod-postgres-replica-1 \
    --query "DBInstances[0].StatusInfos"

# You can also query the replica directly (PostgreSQL-specific)
# SELECT EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) AS replication_lag_seconds;

# Create RDS Proxy (critical for Lambda — prevents connection exhaustion)
aws rds create-db-proxy \
    --db-proxy-name prod-postgres-proxy \
    --engine-family POSTGRESQL \
    --auth '[{
      "AuthScheme": "SECRETS",
      "SecretArn": "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/postgres/credentials",
      "IAMAuth": "REQUIRED"
    }]' \
    --role-arn arn:aws:iam::123456789012:role/RDSProxyRole \
    --vpc-subnet-ids subnet-aaa subnet-bbb \
    --vpc-security-group-ids sg-0proxy123

# Register the primary DB with the proxy
aws rds register-db-proxy-targets \
    --db-proxy-name prod-postgres-proxy \
    --db-instance-identifiers prod-postgres`,
        },
      ],
    },
    {
      title: {
        en: "Security — IAM auth, Secrets Manager & encryption",
        np: "Security — IAM auth, Secrets Manager र encryption",
        jp: "セキュリティ — IAM 認証・Secrets Manager・暗号化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Never put database passwords in environment variables or config files. Two modern approaches: (1) IAM database authentication — EC2/Lambda gets a temporary token (15-min TTL) using `aws rds generate-db-auth-token`; (2) AWS Secrets Manager auto-rotates credentials on a schedule, your app calls `GetSecretValue` at startup. Enable storage encryption with KMS — free for RDS, encrypts data at rest including backups and replicas. Force SSL with `rds.force_ssl=1` parameter.",
            np: "Database password environment variable वा config file मा कहिल्यै नराख्नुहोस्। दुई modern approach: (1) IAM database authentication — EC2/Lambda ले `aws rds generate-db-auth-token` प्रयोग गरी temporary token (15-min TTL) पाउँछ; (2) AWS Secrets Manager ले schedule मा credential auto-rotate गर्छ, तपाईंको app ले startup मा `GetSecretValue` call गर्छ। KMS सँग storage encryption enable गर्नुहोस् — RDS का लागि निःशुल्क, backup र replica सहित data at rest encrypt गर्छ। `rds.force_ssl=1` parameter सँग SSL force गर्नुहोस्।",
            jp: "データベースパスワードを環境変数や設定ファイルに入れないこと。2 つの現代的なアプローチ：(1) IAM データベース認証 — EC2/Lambda は `aws rds generate-db-auth-token` を使って一時トークン（15 分 TTL）を取得；(2) AWS Secrets Manager はスケジュールで認証情報を自動ローテーション、アプリは起動時に `GetSecretValue` を呼び出す。KMS でストレージ暗号化を有効化 — RDS は無料で、バックアップとレプリカを含む保存データを暗号化します。`rds.force_ssl=1` パラメータで SSL を強制する。",
          },
        },
        {
          type: "code",
          title: {
            en: "IAM auth token, psycopg2 connection, and Secrets Manager retrieval",
            np: "IAM auth token, psycopg2 connection, र Secrets Manager retrieval",
            jp: "IAM 認証トークン・psycopg2 接続・Secrets Manager の取得",
          },
          code: `# --- Enable IAM database authentication on the RDS instance ---
aws rds modify-db-instance \
    --db-instance-identifier prod-postgres \
    --enable-iam-database-authentication \
    --apply-immediately

# Create the database user that will use IAM auth (run this in psql)
# CREATE USER iam_app WITH LOGIN;
# GRANT rds_iam TO iam_app;
# GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO iam_app;

# --- Generate an IAM auth token (valid for 15 minutes) ---
aws rds generate-db-auth-token \
    --hostname prod-postgres.abc123.us-east-1.rds.amazonaws.com \
    --port 5432 \
    --username iam_app \
    --region us-east-1

# --- Python: connect using IAM auth token (boto3 + psycopg2) ---
import boto3
import psycopg2
import ssl

def get_connection():
    client = boto3.client('rds', region_name='us-east-1')
    token = client.generate_db_auth_token(
        DBHostname='prod-postgres.abc123.us-east-1.rds.amazonaws.com',
        Port=5432,
        DBUsername='iam_app',
        Region='us-east-1'
    )
    conn = psycopg2.connect(
        host='prod-postgres.abc123.us-east-1.rds.amazonaws.com',
        port=5432,
        database='appdb',
        user='iam_app',
        password=token,  # token IS the password
        sslmode='require',
        sslrootcert='rds-ca-2019-root.pem'  # download from AWS
    )
    return conn

# --- Python: Secrets Manager pattern (preferred for apps) ---
import boto3, json

def get_db_credentials():
    client = boto3.client('secretsmanager', region_name='us-east-1')
    response = client.get_secret_value(
        SecretId='prod/postgres/credentials'
    )
    secret = json.loads(response['SecretString'])
    return secret['username'], secret['password'], secret['host']

username, password, host = get_db_credentials()
conn = psycopg2.connect(host=host, user=username, password=password,
                        database='appdb', sslmode='require')

# --- Create a Secrets Manager secret with auto-rotation for RDS ---
aws secretsmanager create-secret \
    --name prod/postgres/credentials \
    --description "RDS PostgreSQL production credentials" \
    --secret-string '{"username":"dbadmin","password":"CHANGE_ME","engine":"postgres","host":"prod-postgres.abc123.us-east-1.rds.amazonaws.com","port":5432,"dbname":"appdb"}'

# Enable auto-rotation (every 30 days using the AWS-provided Lambda rotator)
aws secretsmanager rotate-secret \
    --secret-id prod/postgres/credentials \
    --rotation-rules AutomaticallyAfterDays=30`,
        },
      ],
    },
    {
      title: {
        en: "Backups, snapshots & restore",
        np: "Backup, snapshot र restore",
        jp: "バックアップ・スナップショット・リストア",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "RDS backup types — retention, restore time, and cross-region support",
            np: "RDS backup type — retention, restore time, र cross-region support",
            jp: "RDS バックアップの種類 — 保持期間・リストア時間・クロスリージョンサポート",
          },
          headers: [
            { en: "Backup Type", np: "Backup Type", jp: "バックアップの種類" },
            { en: "Retention", np: "Retention", jp: "保持期間" },
            { en: "Restore Time", np: "Restore Time", jp: "リストア時間" },
            { en: "Cross-Region", np: "Cross-Region", jp: "クロスリージョン" },
          ],
          rows: [
            [
              { en: "Automated backups", np: "Automated backup", jp: "自動バックアップ" },
              { en: "1–35 days (configurable)", np: "1–35 दिन (configurable)", jp: "1〜35 日（設定可能）" },
              { en: "Point-in-time to any second within window", np: "Window भित्र कुनै पनि second मा point-in-time", jp: "ウィンドウ内の任意の秒へのポイントインタイム" },
              { en: "Requires manual snapshot copy", np: "Manual snapshot copy आवश्यक", jp: "手動スナップショットコピーが必要" },
            ],
            [
              { en: "Manual snapshots", np: "Manual snapshot", jp: "手動スナップショット" },
              { en: "Indefinite (until you delete)", np: "Indefinite (delete नगरेसम्म)", jp: "無期限（削除するまで）" },
              { en: "~10–30 min to launch new instance from snapshot", np: "Snapshot बाट नयाँ instance launch गर्न ~10–30 मिनेट", jp: "スナップショットから新しいインスタンスを起動するのに ~10〜30 分" },
              { en: "Yes — copy to any region with aws rds copy-db-snapshot", np: "हो — aws rds copy-db-snapshot सँग कुनै पनि region मा copy", jp: "はい — aws rds copy-db-snapshot で任意のリージョンにコピー" },
            ],
            [
              { en: "Aurora continuous backup", np: "Aurora continuous backup", jp: "Aurora 継続バックアップ" },
              { en: "1–35 days (stored in S3)", np: "1–35 दिन (S3 मा stored)", jp: "1〜35 日（S3 に保存）" },
              { en: "1-second granularity restore to any point", np: "कुनै पनि point मा 1-second granularity restore", jp: "任意の時点への 1 秒単位のリストア" },
              { en: "Yes — Aurora Global Database replicates within seconds", np: "हो — Aurora Global Database ले second भित्र replicate गर्छ", jp: "はい — Aurora Global Database は秒以内にレプリケートする" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Create snapshots, copy cross-region, and restore point-in-time",
            np: "Snapshot create गर्नुहोस्, cross-region copy, र point-in-time restore",
            jp: "スナップショットの作成・クロスリージョンコピー・ポイントインタイムリストア",
          },
          code: `# Create a manual snapshot before a risky migration
aws rds create-db-snapshot \
    --db-instance-identifier prod-postgres \
    --db-snapshot-identifier prod-postgres-pre-migration-$(date +%Y%m%d)

# Wait for snapshot to complete
aws rds wait db-snapshot-completed \
    --db-snapshot-identifier prod-postgres-pre-migration-$(date +%Y%m%d)

# Copy snapshot to DR region (eu-west-1)
aws rds copy-db-snapshot \
    --source-db-snapshot-identifier \
      arn:aws:rds:us-east-1:123456789012:snapshot:prod-postgres-pre-migration-$(date +%Y%m%d) \
    --target-db-snapshot-identifier prod-postgres-dr-copy \
    --region eu-west-1 \
    --copy-tags

# Point-in-time restore (recover to 2 hours ago)
aws rds restore-db-instance-to-point-in-time \
    --source-db-instance-identifier prod-postgres \
    --target-db-instance-identifier prod-postgres-restored \
    --restore-time $(date -u -d '2 hours ago' +%Y-%m-%dT%H:%M:%SZ) \
    --db-instance-class db.t3.medium \
    --db-subnet-group-name prod-db-subnet-group \
    --vpc-security-group-ids sg-0abc123def456789 \
    --no-publicly-accessible

# Test restore in a DIFFERENT subnet group (isolate from production)
aws rds modify-db-instance \
    --db-instance-identifier prod-postgres-restored \
    --db-subnet-group-name test-db-subnet-group \
    --apply-immediately

# List all snapshots sorted by creation time
aws rds describe-db-snapshots \
    --db-instance-identifier prod-postgres \
    --query "sort_by(DBSnapshots, &SnapshotCreateTime)[*].{Id:DBSnapshotIdentifier,Time:SnapshotCreateTime,Status:Status}" \
    --output table`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: production-ready RDS setup",
        np: "Hands-on: production-ready RDS setup",
        jp: "ハンズオン：本番対応 RDS のセットアップ",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a DB subnet group spanning 2+ private subnets across different AZs: `aws rds create-db-subnet-group --db-subnet-group-name prod-db-subnet-group --db-subnet-group-description 'Production DB subnets' --subnet-ids subnet-aaa subnet-bbb`.",
              np: "फरक AZ मा 2+ private subnet spanning DB subnet group create गर्नुहोस्: `aws rds create-db-subnet-group --db-subnet-group-name prod-db-subnet-group --db-subnet-group-description 'Production DB subnets' --subnet-ids subnet-aaa subnet-bbb`।",
              jp: "異なる AZ にまたがる 2 つ以上のプライベートサブネットをカバーする DB サブネットグループを作成：`aws rds create-db-subnet-group --db-subnet-group-name prod-db-subnet-group --db-subnet-group-description 'Production DB subnets' --subnet-ids subnet-aaa subnet-bbb`。",
            },
            {
              en: "Create a security group `db-sg` that allows port 5432 only from `app-sg` (no broad CIDR ranges): `aws ec2 authorize-security-group-ingress --group-id sg-db --protocol tcp --port 5432 --source-group sg-app`.",
              np: "Port 5432 केवल `app-sg` बाट allow गर्ने `db-sg` security group create गर्नुहोस् (broad CIDR range छैन): `aws ec2 authorize-security-group-ingress --group-id sg-db --protocol tcp --port 5432 --source-group sg-app`।",
              jp: "`app-sg` からのみポート 5432 を許可する `db-sg` セキュリティグループを作成（広い CIDR 範囲は不可）：`aws ec2 authorize-security-group-ingress --group-id sg-db --protocol tcp --port 5432 --source-group sg-app`。",
            },
            {
              en: "Launch PostgreSQL 15 db.t3.micro with Multi-AZ enabled and deletion protection. Use the CLI command from Section 2, adjusting to db.t3.micro for cost in the exercise environment.",
              np: "Multi-AZ enable र deletion protection सहित PostgreSQL 15 db.t3.micro launch गर्नुहोस्। Section 2 को CLI command प्रयोग गर्नुहोस्, exercise environment मा cost का लागि db.t3.micro मा adjust गरेर।",
              jp: "Multi-AZ を有効にして削除保護付きで PostgreSQL 15 db.t3.micro を起動する。演習環境でのコストのために db.t3.micro に調整して、セクション 2 の CLI コマンドを使用する。",
            },
            {
              en: "Enable automated backups with 7-day retention: `aws rds modify-db-instance --db-instance-identifier prod-postgres --backup-retention-period 7 --preferred-backup-window 02:00-03:00 --apply-immediately`.",
              np: "7-day retention सहित automated backup enable गर्नुहोस्: `aws rds modify-db-instance --db-instance-identifier prod-postgres --backup-retention-period 7 --preferred-backup-window 02:00-03:00 --apply-immediately`।",
              jp: "7 日間の保持期間で自動バックアップを有効化：`aws rds modify-db-instance --db-instance-identifier prod-postgres --backup-retention-period 7 --preferred-backup-window 02:00-03:00 --apply-immediately`。",
            },
            {
              en: "Create a read replica using the command from Section 3. Verify it appears in `aws rds describe-db-instances` with status `available` and `ReadReplicaSourceDBInstanceIdentifier` pointing to the primary.",
              np: "Section 3 को command प्रयोग गरी read replica create गर्नुहोस्। `aws rds describe-db-instances` मा `available` status र `ReadReplicaSourceDBInstanceIdentifier` primary तर्फ देखाएको verify गर्नुहोस्।",
              jp: "セクション 3 のコマンドを使って読み取りレプリカを作成する。`aws rds describe-db-instances` で `available` ステータスと `ReadReplicaSourceDBInstanceIdentifier` がプライマリを指していることを確認する。",
            },
            {
              en: "Enable Performance Insights (free for 7-day retention): `aws rds modify-db-instance --db-instance-identifier prod-postgres --enable-performance-insights --performance-insights-retention-period 7 --apply-immediately`.",
              np: "Performance Insights enable गर्नुहोस् (7-day retention निःशुल्क): `aws rds modify-db-instance --db-instance-identifier prod-postgres --enable-performance-insights --performance-insights-retention-period 7 --apply-immediately`।",
              jp: "Performance Insights を有効化（7 日間の保持は無料）：`aws rds modify-db-instance --db-instance-identifier prod-postgres --enable-performance-insights --performance-insights-retention-period 7 --apply-immediately`。",
            },
            {
              en: "Store credentials in Secrets Manager: create a secret with the username, password, host, port, and dbname. Enable IAM authentication on the instance, create the `iam_app` database user, and connect from an EC2 instance using the Python `generate_db_auth_token` pattern from Section 4.",
              np: "Secrets Manager मा credential store गर्नुहोस्: username, password, host, port, र dbname सहित secret create गर्नुहोस्। Instance मा IAM authentication enable गर्नुहोस्, `iam_app` database user create गर्नुहोस्, र Section 4 को Python `generate_db_auth_token` pattern प्रयोग गरी EC2 instance बाट connect गर्नुहोस्।",
              jp: "Secrets Manager に認証情報を保存：ユーザー名・パスワード・ホスト・ポート・DB 名でシークレットを作成する。インスタンスで IAM 認証を有効化し、`iam_app` データベースユーザーを作成し、セクション 4 の Python `generate_db_auth_token` パターンを使って EC2 インスタンスから接続する。",
            },
            {
              en: "Test failover by rebooting with failover: `aws rds reboot-db-instance --db-instance-identifier prod-postgres --force-failover`. Watch `aws rds describe-events` to see the failover event, and confirm your application reconnects automatically using the same endpoint.",
              np: "Failover सहित reboot गरी failover test गर्नुहोस्: `aws rds reboot-db-instance --db-instance-identifier prod-postgres --force-failover`। Failover event हेर्न `aws rds describe-events` हेर्नुहोस्, र तपाईंको application ले automatically same endpoint प्रयोग गरी reconnect भएको confirm गर्नुहोस्।",
              jp: "フェイルオーバーを指定して再起動することでフェイルオーバーをテスト：`aws rds reboot-db-instance --db-instance-identifier prod-postgres --force-failover`。`aws rds describe-events` でフェイルオーバーイベントを監視し、アプリケーションが同じエンドポイントを使って自動的に再接続することを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use RDS or Aurora?",
        np: "RDS वा Aurora प्रयोग गर्ने?",
        jp: "RDS と Aurora のどちらを使うべきか？",
      },
      answer: {
        en: "Aurora costs more but offers up to 5x throughput of MySQL/PostgreSQL, 15 read replicas, cross-region active-active (Aurora Global), and serverless v2 for variable load. Choose Aurora for new production workloads where performance matters; choose RDS for cost-sensitive or licensing-constrained deployments.",
        np: "Aurora को cost बढी छ तर MySQL/PostgreSQL को 5x throughput, 15 read replica, cross-region active-active (Aurora Global), र variable load का लागि serverless v2 offer गर्छ। Performance महत्त्वपूर्ण नयाँ production workload का लागि Aurora रोज्नुहोस्; cost-sensitive वा licensing-constrained deployment का लागि RDS रोज्नुहोस्।",
        jp: "Aurora はコストが高いですが、MySQL/PostgreSQL の最大 5 倍のスループット・15 個の読み取りレプリカ・クロスリージョンアクティブ-アクティブ（Aurora Global）・可変負荷向けサーバーレス v2 を提供します。パフォーマンスが重要な新しい本番ワークロードには Aurora を選択；コスト重視またはライセンスに制約がある場合は RDS を選択します。",
      },
      tag: { en: "rds", np: "RDS", jp: "RDS" },
    },
    {
      question: {
        en: "How do I handle database connection limits in Lambda?",
        np: "Lambda मा database connection limit कसरी handle गर्ने?",
        jp: "Lambda でデータベース接続数の制限をどう扱うか？",
      },
      answer: {
        en: "Lambda can spawn thousands of concurrent functions, each opening a connection. Use RDS Proxy — it pools connections and presents a single endpoint to Lambda. This reduces database connections from thousands to dozens.",
        np: "Lambda ले हजारौं concurrent function spawn गर्न सक्छ, प्रत्येकले connection खोल्छ। RDS Proxy प्रयोग गर्नुहोस् — यसले connection pool गर्छ र Lambda लाई single endpoint present गर्छ। यसले database connection हजारौंबाट दर्जनमा घटाउँछ।",
        jp: "Lambda は何千もの並列関数を生成でき、それぞれが接続を開きます。RDS Proxy を使用してください — 接続をプールして Lambda に単一のエンドポイントを提示します。これによりデータベース接続を数千から数十に削減します。",
      },
      tag: { en: "lambda", np: "Lambda", jp: "Lambda" },
    },
    {
      question: {
        en: "What is the difference between Multi-AZ and a read replica?",
        np: "Multi-AZ र read replica बीच के फरक छ?",
        jp: "Multi-AZ と読み取りレプリカの違いは何か？",
      },
      answer: {
        en: "Multi-AZ is for HA — synchronous replication, automatic failover, standby is NOT readable. Read replica is for read scaling — async replication, you read from it manually, no automatic failover. You can have both.",
        np: "Multi-AZ HA का लागि हो — synchronous replication, automatic failover, standby पढ्न मिल्दैन। Read replica read scaling का लागि हो — async replication, manually पढ्नुहुन्छ, automatic failover छैन। तपाईंसँग दुवै हुन सक्छ।",
        jp: "Multi-AZ は HA のためです — 同期レプリケーション・自動フェイルオーバー・スタンバイは読み取り不可。読み取りレプリカは読み取りスケーリングのためです — 非同期レプリケーション・手動で読み取り・自動フェイルオーバーなし。両方持つことができます。",
      },
      tag: { en: "rds", np: "RDS", jp: "RDS" },
    },
  ],
};
