import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "The AWS CLI lets you control every AWS service from the terminal — it is the foundation of automation and scripting. The AWS SDKs (Python boto3, Node.js, Go, Java, etc.) let your application code call AWS APIs directly. CloudFormation is AWS's Infrastructure as Code (IaC) service — you declare resources in YAML or JSON templates and CloudFormation creates, updates, and deletes them as a stack. Knowing these three tools unlocks full automation of your AWS environment.",
    np: "AWS CLI ले तपाईंलाई terminal बाट हरेक AWS service control गर्न दिन्छ — यो automation र scripting को foundation हो। AWS SDK (Python boto3, Node.js, Go, Java, आदि) ले तपाईंको application code लाई directly AWS API call गर्न दिन्छ। CloudFormation AWS को Infrastructure as Code (IaC) service हो — तपाईंले YAML वा JSON template मा resource declare गर्नुहुन्छ र CloudFormation ले तिनीहरूलाई stack को रूपमा create, update, र delete गर्छ। यी तीन tool जान्दा तपाईंको AWS environment को पूर्ण automation unlock हुन्छ।",
    jp: "AWS CLI はターミナルからすべての AWS サービスを制御できます — 自動化とスクリプトの基盤です。AWS SDK（Python boto3・Node.js・Go・Java など）はアプリケーションコードが AWS API を直接呼び出せるようにします。CloudFormation は AWS の Infrastructure as Code（IaC）サービスです — YAML または JSON テンプレートでリソースを宣言し、CloudFormation がスタックとしてそれらを作成・更新・削除します。これら 3 つのツールを知ることで、AWS 環境の完全な自動化が実現します。",
  } as const,
  o2: {
    en: "Today you master the AWS CLI (profiles, output formats, jq patterns, pagination, --query), the boto3 SDK (sessions, error handling, paginators, waiters), and CloudFormation fundamentals (template anatomy, parameters, mappings, outputs, change sets, stack drift detection). You will write your first CloudFormation stack and update it safely using a change set.",
    np: "आज तपाईंले AWS CLI (profile, output format, jq pattern, pagination, --query), boto3 SDK (session, error handling, paginator, waiter), र CloudFormation fundamental (template anatomy, parameter, mapping, output, change set, stack drift detection) master गर्नुहुनेछ। तपाईंले आफ्नो पहिलो CloudFormation stack लेख्नुहुनेछ र change set प्रयोग गरी safely update गर्नुहुनेछ।",
    jp: "今日は AWS CLI（プロファイル・出力フォーマット・jq パターン・ページネーション・--query）・boto3 SDK（セッション・エラーハンドリング・ページネーター・ウェイター）・CloudFormation の基礎（テンプレートの解剖・パラメーター・マッピング・出力・変更セット・スタックドリフト検出）をマスターします。最初の CloudFormation スタックを書き、変更セットを使って安全に更新します。",
  } as const,
};

export const DEVOPS_DAY_41_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "AWS CLI — profiles, queries & scripting patterns",
        np: "AWS CLI — profile, query र scripting pattern",
        jp: "AWS CLI — プロファイル・クエリ・スクリプトパターン",
      },
      blocks: [
        { type: "diagram", id: "devops-cfn-sdk" },
        {
          type: "paragraph",
          text: {
            en: "The CLI uses named profiles (stored in `~/.aws/credentials` and `~/.aws/config`) to switch between accounts and roles. Use `--profile`, `AWS_PROFILE`, or `aws configure` to manage them. The `--query` flag uses JMESPath to filter and shape JSON output on the server side — much faster than `jq` for large responses. `--output text` removes JSON quoting for use in shell variables. `--output table` is handy for quick human-readable comparison. Always handle pagination: many list operations return truncated results — use `aws ... --no-paginate` or the `--page-size` / `--max-items` flags, or pipe through `aws ... | jq` with a paginator script.",
            np: "CLI ले named profile (`~/.aws/credentials` र `~/.aws/config` मा stored) प्रयोग गरेर account र role बीच switch गर्छ। तिनीहरू manage गर्न `--profile`, `AWS_PROFILE`, वा `aws configure` प्रयोग गर्नुहोस्। `--query` flag ले server side मा JSON output filter र shape गर्न JMESPath प्रयोग गर्छ — large response को लागि `jq` भन्दा धेरै छिटो। `--output text` ले shell variable मा use को लागि JSON quoting remove गर्छ। `--output table` quick human-readable comparison को लागि handy हो। Pagination हमेशा handle गर्नुहोस्: धेरै list operation ले truncated result return गर्छ — `aws ... --no-paginate` वा `--page-size` / `--max-items` flag प्रयोग गर्नुहोस्, वा paginator script सँग `aws ... | jq` मार्फत pipe गर्नुहोस्।",
            jp: "CLI は名前付きプロファイル（`~/.aws/credentials` と `~/.aws/config` に保存）を使ってアカウントとロール間を切り替えます。管理には `--profile`・`AWS_PROFILE`・`aws configure` を使用。`--query` フラグはサーバー側で JSON 出力をフィルタリングして整形するために JMESPath を使用します — 大きなレスポンスには `jq` より大幅に速い。`--output text` はシェル変数での使用のために JSON クォートを除去します。`--output table` はクイックな人間が読みやすい比較に便利です。常にページネーションを処理してください：多くのリスト操作は切り捨てられた結果を返します — `aws ... --no-paginate` または `--page-size` / `--max-items` フラグを使用するか、ページネータースクリプトで `aws ... | jq` にパイプしてください。",
          },
        },
        {
          type: "code",
          title: {
            en: "CLI profiles, --query, pagination and common scripting patterns",
            np: "CLI profile, --query, pagination र common scripting pattern",
            jp: "CLI プロファイル・--query・ページネーション・一般的なスクリプトパターン",
          },
          code: `# ── Configure multiple profiles ──
aws configure --profile dev
aws configure --profile prod
# Keys stored in ~/.aws/credentials; region/output in ~/.aws/config

# Assume a role and create a temporary profile
aws sts assume-role \
    --role-arn arn:aws:iam::PROD_ACCOUNT:role/DeployRole \
    --role-session-name deploy-session \
    --profile dev \
    --query 'Credentials.{AccessKeyId:AccessKeyId,SecretAccessKey:SecretAccessKey,SessionToken:SessionToken}'

# ── --query (JMESPath) examples ──
# Get just the instance ID and state for all running instances
aws ec2 describe-instances \
    --filters "Name=instance-state-name,Values=running" \
    --query "Reservations[*].Instances[*].{ID:InstanceId,Type:InstanceType,AZ:Placement.AvailabilityZone,IP:PrivateIpAddress}" \
    --output table

# Extract a single value for use in a script
INSTANCE_IP=$(aws ec2 describe-instances \
    --instance-ids i-0abc123 \
    --query "Reservations[0].Instances[0].PrivateIpAddress" \
    --output text)

# ── Pagination — list all S3 objects across pages ──
# Without pagination flag (returns only first page):
aws s3api list-objects-v2 --bucket my-bucket

# With auto-pagination (fetches ALL pages):
aws s3api list-objects-v2 --bucket my-bucket --no-paginate \
    --query "Contents[*].{Key:Key,Size:Size}" --output table

# Manual page control (useful for very large buckets):
aws s3api list-objects-v2 --bucket my-bucket --max-items 100

# ── Common scripting patterns ──
# Loop over all EC2 instances and tag them
aws ec2 describe-instances \
    --query "Reservations[*].Instances[*].InstanceId" \
    --output text | tr '\t' '\n' | while read id; do
  aws ec2 create-tags --resources "$id" \
      --tags Key=ManagedBy,Value=automation
done

# Wait for a resource to reach a desired state
aws ec2 wait instance-running --instance-ids i-0abc123
echo "Instance is now running"

# Get Account ID without hardcoding
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
echo "Deploying to $ACCOUNT_ID in $REGION"`,
        },
      ],
    },
    {
      title: {
        en: "boto3 SDK — sessions, paginators & waiters",
        np: "boto3 SDK — session, paginator र waiter",
        jp: "boto3 SDK — セッション・ページネーター・ウェイター",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "boto3 is the Python AWS SDK. Always use a Session to set region and credentials explicitly — avoid relying on global defaults in production code. Paginators automatically handle multi-page API responses (identical to `--no-paginate` in the CLI). Waiters poll until a resource reaches a desired state — use them instead of rolling your own sleep loops. Handle `ClientError` exceptions with the error code from `e.response['Error']['Code']` for specific error handling (e.g., retrying on `ThrottlingException`, ignoring `NoSuchBucket`).",
            np: "boto3 Python AWS SDK हो। Session प्रयोग गरेर region र credential explicitly set गर्नुहोस् — production code मा global default मा rely नगर्नुहोस्। Paginator ले automatically multi-page API response handle गर्छ (CLI मा `--no-paginate` जस्तै)। Waiter ले resource desired state मा नपुगुन्जेल poll गर्छ — आफ्नै sleep loop roll गर्नुको सट्टा यिनीहरू प्रयोग गर्नुहोस्। Specific error handling को लागि `e.response['Error']['Code']` बाट error code सहित `ClientError` exception handle गर्नुहोस् (जस्तै `ThrottlingException` मा retry, `NoSuchBucket` ignore)।",
            jp: "boto3 は Python AWS SDK です。セッションを使って region と認証情報を明示的に設定してください — 本番コードでグローバルデフォルトに依存しないでください。ページネーターは複数ページの API レスポンスを自動的に処理します（CLI の `--no-paginate` と同様）。ウェイターはリソースが目的の状態になるまでポーリングします — 自分でスリープループを作る代わりに使用してください。特定のエラー処理のために `e.response['Error']['Code']` のエラーコードで `ClientError` 例外を処理してください（例：`ThrottlingException` でリトライ、`NoSuchBucket` を無視）。",
          },
        },
        {
          type: "code",
          title: {
            en: "boto3 session, paginator, waiter and error handling patterns",
            np: "boto3 session, paginator, waiter र error handling pattern",
            jp: "boto3 セッション・ページネーター・ウェイター・エラーハンドリングパターン",
          },
          code: `import boto3
from botocore.exceptions import ClientError
import logging

logger = logging.getLogger(__name__)

# ── Session — always explicit in production ──
session = boto3.Session(
    region_name='us-east-1',
    profile_name='prod'           # or use IAM role / env vars in AWS
)
ec2 = session.client('ec2')
s3  = session.resource('s3')      # resource API (higher-level) for S3

# ── Paginator — list ALL EC2 instances without page-limit issues ──
paginator = ec2.get_paginator('describe_instances')
page_iterator = paginator.paginate(
    Filters=[{'Name': 'instance-state-name', 'Values': ['running']}]
)

instances = []
for page in page_iterator:
    for reservation in page['Reservations']:
        instances.extend(reservation['Instances'])

print(f"Total running instances: {len(instances)}")

# ── Waiter — wait for an AMI to become available ──
ec2_client = session.client('ec2')
image_id = ec2_client.create_image(
    InstanceId='i-0abc123',
    Name='prod-ami-backup',
    NoReboot=True
)['ImageId']

waiter = ec2_client.get_waiter('image_available')
waiter.wait(
    ImageIds=[image_id],
    WaiterConfig={'Delay': 15, 'MaxAttempts': 40}
)
print(f"AMI {image_id} is now available")

# ── Error handling ──
def safe_get_secret(secret_name: str) -> dict | None:
    sm = session.client('secretsmanager')
    try:
        response = sm.get_secret_value(SecretId=secret_name)
        return response
    except ClientError as e:
        code = e.response['Error']['Code']
        if code == 'ResourceNotFoundException':
            logger.warning("Secret %s not found", secret_name)
            return None
        elif code == 'AccessDeniedException':
            logger.error("No permission to read secret %s", secret_name)
            raise
        elif code in ('ThrottlingException', 'RequestExpired'):
            logger.warning("Throttled — retrying secret %s", secret_name)
            raise   # let tenacity / retry decorator handle it
        else:
            raise

# ── S3 resource API (higher level than client) ──
bucket = s3.Bucket('my-bucket')

# Upload with server-side encryption
bucket.upload_file(
    'local-file.txt',
    'remote/path/file.txt',
    ExtraArgs={
        'ServerSideEncryption': 'aws:kms',
        'ContentType': 'text/plain'
    }
)

# Stream large file download without loading into memory
with open('large-download.bin', 'wb') as f:
    bucket.download_fileobj('large-file.bin', f)`,
        },
      ],
    },
    {
      title: {
        en: "CloudFormation — templates, stacks & change sets",
        np: "CloudFormation — template, stack र change set",
        jp: "CloudFormation — テンプレート・スタック・変更セット",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A CloudFormation template has six main sections: AWSTemplateFormatVersion (always `2010-09-09`), Description, Parameters (user inputs), Mappings (lookup tables), Resources (required — the actual AWS resources), and Outputs (values to export or display). A Stack is a deployed instance of a template. Never edit resources in a stack outside of CloudFormation — this causes drift. Use `aws cloudformation detect-stack-drift` to find out-of-band changes. Always review a Change Set before executing — it shows exactly which resources will be added, modified (and how), or replaced.",
            np: "CloudFormation template मा छ main section छन्: AWSTemplateFormatVersion (हमेशा `2010-09-09`), Description, Parameter (user input), Mapping (lookup table), Resource (required — actual AWS resource), र Output (export वा display गर्ने value)। Stack template को deployed instance हो। CloudFormation बाहिर stack मा resource कहिल्यै edit नगर्नुहोस् — यसले drift cause गर्छ। Out-of-band change थाहा पाउन `aws cloudformation detect-stack-drift` प्रयोग गर्नुहोस्। Execute गर्नु अघि हमेशा Change Set review गर्नुहोस् — यसले exactly कुन resource add, modify (र कसरी), वा replace हुनेछ देखाउँछ।",
            jp: "CloudFormation テンプレートには 6 つのメインセクションがあります：AWSTemplateFormatVersion（常に `2010-09-09`）・Description・Parameters（ユーザー入力）・Mappings（ルックアップテーブル）・Resources（必須 — 実際の AWS リソース）・Outputs（エクスポートまたは表示する値）。スタックはテンプレートのデプロイされたインスタンスです。CloudFormation の外でスタック内のリソースを編集しないでください — ドリフトが発生します。アウトオブバンドの変更を検出するには `aws cloudformation detect-stack-drift` を使用してください。実行前に必ず変更セットをレビューしてください — どのリソースが追加・変更（どのように）・置換されるかを正確に示します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Write a CloudFormation template and deploy with a change set",
            np: "CloudFormation template लेख्नुहोस् र change set सँग deploy गर्नुहोस्",
            jp: "CloudFormation テンプレートを書いて変更セットでデプロイする",
          },
          code: `# ── vpc-stack.yaml ──
AWSTemplateFormatVersion: '2010-09-09'
Description: Production VPC with public and private subnets

Parameters:
  Environment:
    Type: String
    AllowedValues: [dev, staging, prod]
    Default: dev
  VpcCidr:
    Type: String
    Default: "10.0.0.0/16"

Mappings:
  SubnetConfig:
    PublicA:  { CIDR: "10.0.1.0/24" }
    PublicB:  { CIDR: "10.0.2.0/24" }
    PrivateA: { CIDR: "10.0.11.0/24" }
    PrivateB: { CIDR: "10.0.12.0/24" }

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcCidr
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: !Sub "\${Environment}-vpc"
        - Key: Environment
          Value: !Ref Environment

  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags: [{Key: Name, Value: !Sub "\${Environment}-igw"}]

  IGWAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  PublicSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: !FindInMap [SubnetConfig, PublicA, CIDR]
      AvailabilityZone: !Select [0, !GetAZs ""]
      MapPublicIpOnLaunch: true
      Tags: [{Key: Name, Value: !Sub "\${Environment}-public-a"}]

  PrivateSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: !FindInMap [SubnetConfig, PrivateA, CIDR]
      AvailabilityZone: !Select [0, !GetAZs ""]
      Tags: [{Key: Name, Value: !Sub "\${Environment}-private-a"}]

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC

  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn: IGWAttachment
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: "0.0.0.0/0"
      GatewayId: !Ref InternetGateway

  PublicSubnetARouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnetA
      RouteTableId: !Ref PublicRouteTable

Outputs:
  VpcId:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub "\${Environment}-VpcId"

  PublicSubnetA:
    Description: Public Subnet A ID
    Value: !Ref PublicSubnetA
    Export:
      Name: !Sub "\${Environment}-PublicSubnetA"

---
# ── Deploy the stack ──
aws cloudformation create-stack \
    --stack-name prod-vpc \
    --template-body file://vpc-stack.yaml \
    --parameters ParameterKey=Environment,ParameterValue=prod \
    --capabilities CAPABILITY_NAMED_IAM

# Wait for completion
aws cloudformation wait stack-create-complete --stack-name prod-vpc

# ── Update safely with a change set ──
aws cloudformation create-change-set \
    --stack-name prod-vpc \
    --change-set-name add-private-subnet-b \
    --template-body file://vpc-stack-v2.yaml \
    --parameters ParameterKey=Environment,ParameterValue=prod

# Review what will change BEFORE applying
aws cloudformation describe-change-set \
    --stack-name prod-vpc \
    --change-set-name add-private-subnet-b \
    --query "Changes[*].ResourceChange.{Action:Action,Resource:LogicalResourceId,Replace:Replacement}"

# Execute only after review
aws cloudformation execute-change-set \
    --stack-name prod-vpc \
    --change-set-name add-private-subnet-b

# ── Detect drift (find out-of-band changes) ──
aws cloudformation detect-stack-drift --stack-name prod-vpc
aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id DETECTION_ID`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: deploy a VPC stack and update with a change set",
        np: "Hands-on: VPC stack deploy गर्नुहोस् र change set सँग update गर्नुहोस्",
        jp: "ハンズオン：VPC スタックをデプロイして変更セットで更新する",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Configure two CLI profiles (`dev` and `prod`) using `aws configure --profile`. Practice switching between them with `--profile` on commands. Run `aws sts get-caller-identity --profile dev` and `--profile prod` to confirm they resolve to different accounts or roles.",
              np: "`aws configure --profile` प्रयोग गरी दुई CLI profile (`dev` र `prod`) configure गर्नुहोस्। Command मा `--profile` सँग बीच switch गर्ने practice गर्नुहोस्। `aws sts get-caller-identity --profile dev` र `--profile prod` run गर्नुहोस् — तिनीहरूले different account वा role मा resolve गर्छन् confirm गर्नुहोस्।",
              jp: "`aws configure --profile` を使って 2 つの CLI プロファイル（`dev` と `prod`）を設定する。コマンドで `--profile` を使ってプロファイル間の切り替えを練習する。`aws sts get-caller-identity --profile dev` と `--profile prod` を実行して、異なるアカウントまたはロールに解決されることを確認する。",
            },
            {
              en: "Practice five `--query` expressions: list all running instance IDs, get a specific instance's private IP, list all S3 bucket names, get the status of all CloudFormation stacks, list all Lambda functions with their runtime and memory.",
              np: "पाँच `--query` expression practice गर्नुहोस्: सबै running instance ID list, specific instance को private IP get, सबै S3 bucket name list, सबै CloudFormation stack को status get, सबै Lambda function को runtime र memory सहित list।",
              jp: "5 つの `--query` 式を練習する：すべての実行中インスタンス ID のリスト・特定のインスタンスのプライベート IP の取得・すべての S3 バケット名のリスト・すべての CloudFormation スタックのステータスの取得・すべての Lambda 関数のランタイムとメモリ付きリスト。",
            },
            {
              en: "Write a boto3 script that: lists all EC2 instances in the account using a paginator, prints instance ID and state for each, then waits for any `pending` instances to reach `running` state using a waiter.",
              np: "निम्न boto3 script लेख्नुहोस्: paginator प्रयोग गरी account मा सबै EC2 instance list, प्रत्येकको instance ID र state print, त्यसपछि waiter प्रयोग गरी `pending` instance को `running` state मा पुग्न पर्खनुहोस्।",
              jp: "次の boto3 スクリプトを書く：ページネーターを使ってアカウント内のすべての EC2 インスタンスをリスト化・各インスタンスの ID と状態を出力・その後ウェイターを使って `pending` 状態のインスタンスが `running` 状態になるまで待機。",
            },
            {
              en: "Deploy the VPC CloudFormation template from the code example above with `aws cloudformation create-stack`. Wait for it to complete with `aws cloudformation wait stack-create-complete`. Inspect the Outputs section with `aws cloudformation describe-stacks --query 'Stacks[0].Outputs'`.",
              np: "माथिको code example बाट VPC CloudFormation template `aws cloudformation create-stack` सँग deploy गर्नुहोस्। `aws cloudformation wait stack-create-complete` सँग complete हुन पर्खनुहोस्। `aws cloudformation describe-stacks --query 'Stacks[0].Outputs'` सँग Outputs section inspect गर्नुहोस्।",
              jp: "上のコード例の VPC CloudFormation テンプレートを `aws cloudformation create-stack` でデプロイする。`aws cloudformation wait stack-create-complete` で完了を待つ。`aws cloudformation describe-stacks --query 'Stacks[0].Outputs'` で Outputs セクションを検査する。",
            },
            {
              en: "Add a second private subnet (`PrivateSubnetB` in AZ b) to the template. Create a change set named `add-subnet-b` and review it with `aws cloudformation describe-change-set`. Confirm only one resource is being added (no replacements), then execute the change set.",
              np: "Template मा दोस्रो private subnet (`PrivateSubnetB` AZ b मा) थप्नुहोस्। `add-subnet-b` नाम गरी change set create गर्नुहोस् र `aws cloudformation describe-change-set` सँग review गर्नुहोस्। एउटा resource मात्र add भइरहेको (replacement छैन) confirm गर्नुहोस्, त्यसपछि change set execute गर्नुहोस्।",
              jp: "テンプレートに 2 番目のプライベートサブネット（AZ b の `PrivateSubnetB`）を追加する。`add-subnet-b` という名前の変更セットを作成し、`aws cloudformation describe-change-set` でレビューする。1 つのリソースのみが追加されている（置換なし）ことを確認し、変更セットを実行する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What happens if I manually change a resource that is part of a CloudFormation stack?",
        np: "CloudFormation stack को भाग भएको resource manually change गरे के हुन्छ?",
        jp: "CloudFormation スタックの一部であるリソースを手動で変更するとどうなるか？",
      },
      answer: {
        en: "The stack enters a DRIFTED state. CloudFormation is no longer the source of truth for that resource. Future stack updates may overwrite your manual change or fail with a conflict. Always use Change Sets to modify stack resources. If you must reconcile drift, either import the current state into the template or delete and recreate the resource through CloudFormation.",
        np: "Stack DRIFTED state मा enter गर्छ। CloudFormation त्यो resource को लागि अब source of truth होइन। Future stack update ले तपाईंको manual change overwrite गर्न सक्छ वा conflict सँग fail हुन सक्छ। Stack resource modify गर्न हमेशा Change Set प्रयोग गर्नुहोस्। Drift reconcile गर्नु परेमा, template मा current state import गर्नुहोस् वा CloudFormation मार्फत resource delete र recreate गर्नुहोस्।",
        jp: "スタックは DRIFTED 状態になります。CloudFormation はそのリソースの信頼できる情報源ではなくなります。将来のスタック更新は手動変更を上書きするか、競合で失敗する可能性があります。スタックリソースを変更するには常に変更セットを使用してください。ドリフトを調整する必要がある場合は、現在の状態をテンプレートにインポートするか、CloudFormation を通じてリソースを削除して再作成してください。",
      },
      tag: { en: "cloudformation", np: "CloudFormation", jp: "CloudFormation" },
    },
    {
      question: {
        en: "What is CAPABILITY_NAMED_IAM and when do I need it?",
        np: "CAPABILITY_NAMED_IAM के हो र कहिले चाहिन्छ?",
        jp: "CAPABILITY_NAMED_IAM とは何か、いつ必要か？",
      },
      answer: {
        en: "CloudFormation requires explicit acknowledgement before it creates or modifies IAM resources. `CAPABILITY_IAM` is required for any IAM resource. `CAPABILITY_NAMED_IAM` is additionally required when the template creates IAM resources with a custom name (e.g., `RoleName: my-specific-role`). Without the capability flag, the stack creation fails with `InsufficientCapabilitiesException`. It is a safety mechanism to prevent accidental privilege escalation through IaC.",
        np: "CloudFormation ले IAM resource create वा modify गर्नु अघि explicit acknowledgement require गर्छ। `CAPABILITY_IAM` कुनै पनि IAM resource को लागि required हो। `CAPABILITY_NAMED_IAM` additionally required हुन्छ जब template ले custom name सहित IAM resource create गर्छ (जस्तै `RoleName: my-specific-role`)। Capability flag बिना, stack creation `InsufficientCapabilitiesException` सँग fail हुन्छ। यो IaC मार्फत accidental privilege escalation रोक्ने safety mechanism हो।",
        jp: "CloudFormation は IAM リソースを作成または変更する前に明示的な確認を要求します。`CAPABILITY_IAM` はすべての IAM リソースに必要です。`CAPABILITY_NAMED_IAM` はテンプレートがカスタム名付きの IAM リソースを作成するとき（例：`RoleName: my-specific-role`）にも必要です。ケイパビリティフラグなしでは、スタック作成は `InsufficientCapabilitiesException` で失敗します。これは IaC を通じた偶発的な権限昇格を防ぐための安全メカニズムです。",
      },
      tag: { en: "cloudformation", np: "CloudFormation", jp: "CloudFormation" },
    },
  ],
};
