import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Cloud infrastructure does not manage itself. The engineers who automate it — provisioning buckets, cycling EC2 instances, running health checks, syncing files — move faster, make fewer mistakes, and sleep better. boto3, the official AWS SDK for Python, is the lingua franca of AWS automation: every AWS service has a boto3 client, and a short Python script can do in seconds what would take ten minutes of clicking in the console.",
    np: "Cloud infrastructure आफैं manage गर्दैन। यसलाई automate गर्ने engineer — bucket provision गर्ने, EC2 instance cycle गर्ने, health check चलाउने, file sync गर्ने — छिटो move गर्छन्, कम गल्ती गर्छन्, र राम्रो सुत्छन्। boto3, AWS को लागि official Python SDK, AWS automation को lingua franca हो: हरेक AWS service को boto3 client छ, र एउटा छोटो Python script ले console मा click गर्दा दस मिनेट लाग्ने काम केही second मा गर्न सक्छ।",
    jp: "クラウドインフラは自分自身を管理しません。それを自動化するエンジニア — バケットのプロビジョニング、EC2 インスタンスの切り替え、ヘルスチェックの実行、ファイルの同期 — は速く動き、ミスを減らし、夜よく眠れます。boto3（AWS 公式 Python SDK）は AWS 自動化の共通語です。すべての AWS サービスに boto3 クライアントがあり、短い Python スクリプトでコンソールでクリックする 10 分の作業を数秒でこなせます。",
  } as const,
  o2: {
    en: "Today you learn the full toolkit for cloud and infrastructure automation: boto3 sessions, the S3 and EC2 APIs, subprocess for reaching CLI tools not covered by an SDK, and paramiko for SSH access to remote machines. The capstone is a production-style deployment health-check script that ties all four together.",
    np: "आज तपाईंले cloud र infrastructure automation को लागि पूर्ण toolkit सिक्नुहुनेछ: boto3 session, S3 र EC2 API, SDK ले cover नगरेका CLI tool का लागि subprocess, र remote machine मा SSH access को लागि paramiko। Capstone भनेको एउटा production-style deployment health-check script हो जसले चारैटालाई जोड्छ।",
    jp: "本日はクラウドとインフラ自動化の完全なツールキットを学びます。boto3 セッション・S3 と EC2 の API・SDK でカバーされていない CLI ツールのための subprocess・リモートマシンへの SSH アクセスのための paramiko です。仕上げとして、これら 4 つをつなぎ合わせたプロダクション品質のデプロイメントヘルスチェックスクリプトを作ります。",
  } as const,
};

export const DEVOPS_DAY_27_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "boto3 — the AWS SDK for Python",
        np: "boto3 — Python का लागि AWS SDK",
        jp: "boto3 — Python 向け AWS SDK",
      },
      blocks: [
        { type: "diagram", id: "devops-boto3-workflow" },
        {
          type: "paragraph",
          text: {
            en: "boto3 has two API styles. The client API is low-level and maps 1:1 to the underlying AWS HTTP API — every response is a plain dict, pagination is manual, and you have full control. The resource API is a higher-level object-oriented wrapper — S3 buckets and EC2 instances become Python objects with methods. Use client for new code (it is more predictable) and resource when the OOP style genuinely simplifies the code. Credentials must never be hardcoded. When running on EC2 or Lambda, attach an IAM role and boto3 picks up the credentials automatically from the instance metadata service. In CI/CD, inject them via environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN). Locally, configure a named profile in ~/.aws/credentials and pass profile_name to Session.",
            np: "boto3 मा दुई API style छन्। Client API low-level छ र underlying AWS HTTP API सँग 1:1 map गर्छ — हरेक response plain dict हो, pagination manual छ, र तपाईंसँग पूर्ण control छ। Resource API उच्च-स्तरीय object-oriented wrapper हो — S3 bucket र EC2 instance method सहितको Python object बन्छन्। नयाँ code का लागि client प्रयोग गर्नुहोस् (यो बढी predictable छ) र OOP style ले code genuinely सरल बनाउँदा resource प्रयोग गर्नुहोस्। Credential कहिल्यै hardcode गर्नु हुँदैन। EC2 वा Lambda मा run गर्दा IAM role attach गर्नुहोस् र boto3 ले instance metadata service बाट automatically credential उठाउँछ। CI/CD मा environment variable मार्फत inject गर्नुहोस् (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)। Locally मा ~/.aws/credentials मा named profile configure गर्नुहोस् र Session मा profile_name pass गर्नुहोस्।",
            jp: "boto3 には 2 つの API スタイルがあります。クライアント API は低レベルで、基盤となる AWS HTTP API と 1:1 でマッピングします — すべてのレスポンスはプレーンな辞書で、ページネーションは手動、完全なコントロールがあります。リソース API は高レベルのオブジェクト指向ラッパーです — S3 バケットと EC2 インスタンスがメソッドを持つ Python オブジェクトになります。新しいコードにはクライアントを使いましょう（より予測可能です）。OOP スタイルがコードを本当に簡潔にするときはリソースを使います。認証情報はハードコードしてはいけません。EC2 や Lambda で実行する場合は IAM ロールをアタッチすれば、boto3 がインスタンスメタデータサービスから自動的に認証情報を取得します。CI/CD では環境変数（AWS_ACCESS_KEY_ID・AWS_SECRET_ACCESS_KEY・AWS_SESSION_TOKEN）で注入します。ローカルでは ~/.aws/credentials に名前付きプロファイルを設定し、Session に profile_name を渡します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Creating a boto3 session, S3 client, and EC2 resource",
            np: "boto3 session, S3 client, र EC2 resource create गर्नुहोस्",
            jp: "boto3 セッション・S3 クライアント・EC2 リソースを作成する",
          },
          code: `#!/usr/bin/env python3
"""Bootstrap boto3 sessions correctly — never hardcode credentials."""
import boto3
import os

# --- Option 1: IAM role (EC2/Lambda) or default credential chain ---
# boto3 checks: env vars → ~/.aws/credentials → instance metadata → ECS task role
s3 = boto3.client("s3", region_name="us-east-1")

# --- Option 2: Named profile (local dev) ---
session = boto3.Session(
    profile_name=os.environ.get("AWS_PROFILE", "default"),
    region_name=os.environ.get("AWS_DEFAULT_REGION", "us-east-1"),
)

# Client API — low-level, returns plain dicts, all pagination is manual
s3_client = session.client("s3")

# Resource API — high-level OOP, objects have methods (e.g. bucket.objects.all())
s3_resource = session.resource("s3")
ec2_resource = session.resource("ec2")

# --- Verify credentials by calling STS get-caller-identity ---
sts = session.client("sts")
identity = sts.get_caller_identity()
print(f"Account : {identity['Account']}")
print(f"User/Role: {identity['Arn']}")
print(f"Region  : {session.region_name}")

# --- Environment variable approach (CI/CD) ---
# export AWS_ACCESS_KEY_ID=...
# export AWS_SECRET_ACCESS_KEY=...
# export AWS_DEFAULT_REGION=us-east-1
# boto3 picks these up automatically — no code changes needed`,
        },
      ],
    },
    {
      title: {
        en: "S3 operations — the most common automation target",
        np: "S3 operations — सबभन्दा common automation target",
        jp: "S3 オペレーション — 最も一般的な自動化対象",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Common S3 client operations and their boto3 methods",
            np: "Common S3 client operation र तिनका boto3 method",
            jp: "一般的な S3 クライアントオペレーションと boto3 メソッド",
          },
          headers: [
            { en: "Operation", np: "Operation", jp: "オペレーション" },
            { en: "boto3 method", np: "boto3 method", jp: "boto3 メソッド" },
            { en: "Key parameters", np: "Key parameter", jp: "主なパラメーター" },
          ],
          rows: [
            [
              { en: "Upload file", np: "File upload गर्नुहोस्", jp: "ファイルのアップロード" },
              { en: "upload_file()", np: "upload_file()", jp: "upload_file()" },
              { en: "Filename, Bucket, Key, ExtraArgs", np: "Filename, Bucket, Key, ExtraArgs", jp: "Filename, Bucket, Key, ExtraArgs" },
            ],
            [
              { en: "Download file", np: "File download गर्नुहोस्", jp: "ファイルのダウンロード" },
              { en: "download_file()", np: "download_file()", jp: "download_file()" },
              { en: "Bucket, Key, Filename", np: "Bucket, Key, Filename", jp: "Bucket, Key, Filename" },
            ],
            [
              { en: "List objects (paginated)", np: "Object list गर्नुहोस् (paginated)", jp: "オブジェクトの一覧（ページ付き）" },
              { en: "get_paginator('list_objects_v2')", np: "get_paginator('list_objects_v2')", jp: "get_paginator('list_objects_v2')" },
              { en: "Bucket, Prefix, Delimiter", np: "Bucket, Prefix, Delimiter", jp: "Bucket, Prefix, Delimiter" },
            ],
            [
              { en: "Delete object", np: "Object delete गर्नुहोस्", jp: "オブジェクトの削除" },
              { en: "delete_object()", np: "delete_object()", jp: "delete_object()" },
              { en: "Bucket, Key", np: "Bucket, Key", jp: "Bucket, Key" },
            ],
            [
              { en: "Copy between buckets", np: "Bucket बिच copy गर्नुहोस्", jp: "バケット間のコピー" },
              { en: "copy_object()", np: "copy_object()", jp: "copy_object()" },
              { en: "CopySource, Bucket, Key", np: "CopySource, Bucket, Key", jp: "CopySource, Bucket, Key" },
            ],
            [
              { en: "Presigned URL", np: "Presigned URL", jp: "署名付き URL" },
              { en: "generate_presigned_url()", np: "generate_presigned_url()", jp: "generate_presigned_url()" },
              { en: "ClientMethod, Params, ExpiresIn", np: "ClientMethod, Params, ExpiresIn", jp: "ClientMethod, Params, ExpiresIn" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Upload, list with pagination, presigned URL, and cross-bucket copy",
            np: "Upload, pagination सँग list, presigned URL, र cross-bucket copy",
            jp: "アップロード・ページネーション付き一覧・署名付き URL・バケット間コピー",
          },
          code: `#!/usr/bin/env python3
"""Common S3 operations every DevOps engineer uses weekly."""
import boto3
import os
from pathlib import Path

session = boto3.Session(region_name=os.environ.get("AWS_DEFAULT_REGION", "us-east-1"))
s3 = session.client("s3")

SOURCE_BUCKET = os.environ["SOURCE_BUCKET"]   # never hardcode bucket names either
BACKUP_BUCKET = os.environ.get("BACKUP_BUCKET", SOURCE_BUCKET + "-backup")

# --- Upload a file with server-side encryption ---
def upload_artifact(local_path: str, s3_key: str) -> None:
    s3.upload_file(
        Filename=local_path,
        Bucket=SOURCE_BUCKET,
        Key=s3_key,
        ExtraArgs={"ServerSideEncryption": "AES256"},
    )
    print(f"Uploaded {local_path} → s3://{SOURCE_BUCKET}/{s3_key}")

upload_artifact("dist/app-1.4.2.tar.gz", "releases/app-1.4.2.tar.gz")

# --- List all objects under a prefix (handles pagination automatically) ---
def list_objects(bucket: str, prefix: str = "") -> list[dict]:
    paginator = s3.get_paginator("list_objects_v2")
    pages = paginator.paginate(Bucket=bucket, Prefix=prefix)
    objects = []
    for page in pages:
        for obj in page.get("Contents", []):
            objects.append({"key": obj["Key"], "size": obj["Size"], "modified": obj["LastModified"]})
    return objects

releases = list_objects(SOURCE_BUCKET, prefix="releases/")
print(f"Found {len(releases)} release artifacts")
for r in releases[:5]:
    print(f"  {r['key']}  ({r['size']:,} bytes)")

# --- Generate a presigned URL (share a private file without making it public) ---
def presign(bucket: str, key: str, expires_in: int = 3600) -> str:
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=expires_in,
    )

url = presign(SOURCE_BUCKET, "releases/app-1.4.2.tar.gz", expires_in=86400)
print(f"Download link (24h): {url}")

# --- Copy the latest release to the backup bucket ---
def copy_to_backup(key: str) -> None:
    s3.copy_object(
        CopySource={"Bucket": SOURCE_BUCKET, "Key": key},
        Bucket=BACKUP_BUCKET,
        Key=key,
    )
    print(f"Backed up s3://{SOURCE_BUCKET}/{key} → s3://{BACKUP_BUCKET}/{key}")

copy_to_backup("releases/app-1.4.2.tar.gz")`,
        },
      ],
    },
    {
      title: {
        en: "EC2 lifecycle automation",
        np: "EC2 lifecycle automation",
        jp: "EC2 ライフサイクル自動化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "EC2 automation follows a describe → filter → act pattern. You describe instances with filters (by tag, state, or VPC), get back a list of instance objects, and then act on each one. Always filter by tags — use a tagging convention like env=production, role=web, app=myservice on every instance from day one. Stopping and starting instances is reversible; termination is not — add a guard when the script receives terminate as an argument. After calling start_instances or stop_instances, use an EC2 waiter (instance.wait_until_running()) instead of sleeping — waiters poll the API with exponential backoff and raise an exception if the timeout is exceeded.",
            np: "EC2 automation describe → filter → act pattern follow गर्छ। तपाईं filter (tag, state, वा VPC द्वारा) सँग instance describe गर्नुहुन्छ, instance object को list पाउनुहुन्छ, र त्यसपछि प्रत्येकमा act गर्नुहुन्छ। सधैं tag द्वारा filter गर्नुहोस् — day one देखि हरेक instance मा env=production, role=web, app=myservice जस्तो tagging convention प्रयोग गर्नुहोस्। Instance stop र start reversible छ; termination छैन — script ले argument को रूपमा terminate प्राप्त गर्दा guard थप्नुहोस्। start_instances वा stop_instances call गरेपछि, sleep को सट्टा EC2 waiter (instance.wait_until_running()) प्रयोग गर्नुहोस् — waiter ले exponential backoff सँग API poll गर्छ र timeout नाघेमा exception raise गर्छ।",
            jp: "EC2 自動化は describe → filter → act パターンに従います。フィルター（タグ・状態・VPC）でインスタンスを describe し、インスタンスオブジェクトのリストを受け取り、それぞれに対してアクションを実行します。常にタグでフィルタリングしましょう — 初日からすべてのインスタンスに env=production・role=web・app=myservice のようなタグ付け規約を使います。インスタンスの停止と起動は元に戻せますが、終了は戻せません — スクリプトが引数として terminate を受け取るときはガードを追加しましょう。start_instances や stop_instances を呼び出した後は、sleep の代わりに EC2 ウェイター（instance.wait_until_running()）を使います — ウェイターは指数バックオフで API をポーリングし、タイムアウトを超えると例外を発生させます。",
          },
        },
        {
          type: "code",
          title: {
            en: "List running instances by tag, start/stop by tag, get public IP",
            np: "Tag द्वारा running instance list गर्नुहोस्, tag द्वारा start/stop, public IP लिनुहोस्",
            jp: "タグで実行中インスタンスを一覧表示・タグで起動停止・パブリック IP を取得",
          },
          code: `#!/usr/bin/env python3
"""EC2 lifecycle automation — list, start, stop, and inspect instances by tag."""
import boto3
import os
import sys

session = boto3.Session(region_name=os.environ.get("AWS_DEFAULT_REGION", "us-east-1"))
ec2 = session.resource("ec2")
ec2_client = session.client("ec2")


def get_instances_by_tag(key: str, value: str, states: list[str] | None = None) -> list:
    """Return EC2 instances matching a tag key/value pair."""
    filters = [{"Name": f"tag:{key}", "Values": [value]}]
    if states:
        filters.append({"Name": "instance-state-name", "Values": states})
    return list(ec2.instances.filter(Filters=filters))


def instance_name(instance) -> str:
    for tag in (instance.tags or []):
        if tag["Key"] == "Name":
            return tag["Value"]
    return instance.id


# --- List all running production instances ---
prod_instances = get_instances_by_tag("env", "production", states=["running"])
print(f"Running production instances: {len(prod_instances)}")
for inst in prod_instances:
    print(
        f"  {instance_name(inst):30s}  {inst.id}  {inst.instance_type}"
        f"  {inst.public_ip_address or 'no-public-ip'}"
    )

# --- Stop all staging instances at night (called from a cron job) ---
def stop_by_tag(env: str, dry_run: bool = True) -> None:
    instances = get_instances_by_tag("env", env, states=["running"])
    if not instances:
        print(f"No running instances with env={env}")
        return

    ids = [i.id for i in instances]
    print(f"{'[DRY RUN] ' if dry_run else ''}Stopping {len(ids)} instances: {ids}")

    if not dry_run:
        ec2_client.stop_instances(InstanceIds=ids)
        # Wait for all to reach stopped state
        waiter = ec2_client.get_waiter("instance_stopped")
        waiter.wait(InstanceIds=ids)
        print("All instances stopped.")

stop_by_tag("staging", dry_run="--apply" not in sys.argv)

# --- Get public IPs of all web-tier instances ---
web_instances = get_instances_by_tag("role", "web", states=["running"])
web_ips = [i.public_ip_address for i in web_instances if i.public_ip_address]
print("\\nWeb tier IPs:", web_ips)`,
        },
      ],
    },
    {
      title: {
        en: "subprocess — calling CLI tools from Python",
        np: "subprocess — Python बाट CLI tool call गर्नुहोस्",
        jp: "subprocess — Python から CLI ツールを呼び出す",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "boto3 covers AWS, but your automation scripts often need to call other CLI tools: kubectl for Kubernetes, terraform for infrastructure, docker for images, aws s3 sync for bulk transfers where the SDK's per-file API is slower. subprocess.run() is the right choice for most cases — it blocks until the command finishes and raises CalledProcessError if the exit code is non-zero when you set check=True. Always pass commands as a list of strings, never as a single concatenated string — this avoids shell injection when any part of the command comes from a variable. Use shlex.split() only when you genuinely start with a shell-style string you cannot refactor.",
            np: "boto3 ले AWS cover गर्छ, तर तपाईंको automation script लाई अक्सर अन्य CLI tool call गर्न पर्छ: Kubernetes का लागि kubectl, infrastructure का लागि terraform, image का लागि docker, SDK को per-file API ढिलो हुने ठूलो transfer का लागि aws s3 sync। subprocess.run() अधिकांश case का लागि सही choice हो — यो command सकिएपछि block हुन्छ र check=True set गर्दा exit code non-zero भए CalledProcessError raise गर्छ। Command लाई सधैं string को list को रूपमा pass गर्नुहोस्, कहिल्यै single concatenated string को रूपमा होइन — यसले command को कुनै पनि भाग variable बाट आउँदा shell injection avoid गर्छ। shlex.split() तब मात्र प्रयोग गर्नुहोस् जब तपाईं genuinely एउटा shell-style string बाट सुरु गर्नुहुन्छ जुन refactor गर्न सक्नुहुन्न।",
            jp: "boto3 は AWS をカバーしますが、自動化スクリプトでは他の CLI ツールを呼び出す必要がよくあります。Kubernetes には kubectl、インフラには terraform、イメージには docker、SDK のファイルごとの API より高速な大量転送には aws s3 sync です。subprocess.run() はほとんどのケースで正しい選択です — コマンドが終了するまでブロックし、check=True を設定すると終了コードが非ゼロの場合 CalledProcessError を発生させます。コマンドは常に文字列のリストとして渡しましょう。単一の連結文字列としては渡さないでください — コマンドのいずれかの部分が変数から来るときにシェルインジェクションを防ぎます。shlex.split() は本当にリファクタリングできないシェルスタイルの文字列から始める場合にのみ使いましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "subprocess.run, capturing JSON output, and safe command building",
            np: "subprocess.run, JSON output capture, र safe command building",
            jp: "subprocess.run・JSON 出力のキャプチャ・安全なコマンド構築",
          },
          code: `#!/usr/bin/env python3
"""Use subprocess to call aws CLI, kubectl, and terraform from a Python script."""
import json
import shlex
import subprocess
import sys


def run(cmd: list[str], **kwargs) -> subprocess.CompletedProcess:
    """Run a command and raise on non-zero exit. Print stderr on failure."""
    try:
        return subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True,
            **kwargs,
        )
    except subprocess.CalledProcessError as exc:
        print(f"Command failed: {' '.join(cmd)}", file=sys.stderr)
        print(exc.stderr, file=sys.stderr)
        raise


def run_json(cmd: list[str]) -> dict | list:
    """Run a command and parse its stdout as JSON."""
    result = run(cmd)
    return json.loads(result.stdout)


# --- aws s3 sync (faster than per-object boto3 for bulk transfers) ---
bucket = "my-deploy-bucket"
local_dir = "dist/"
run([
    "aws", "s3", "sync",
    local_dir,
    f"s3://{bucket}/releases/",
    "--delete",
    "--exact-timestamps",
])

# --- kubectl: get pod list as JSON and find crash-looping pods ---
pods = run_json(["kubectl", "get", "pods", "-A", "-o", "json"])
for item in pods.get("items", []):
    for cs in item.get("status", {}).get("containerStatuses", []):
        if cs.get("restartCount", 0) > 5:
            ns   = item["metadata"]["namespace"]
            name = item["metadata"]["name"]
            restarts = cs["restartCount"]
            print(f"WARNING: {ns}/{name} has {restarts} restarts")

# --- terraform: plan and apply with variable injection ---
env = "staging"
tf_vars = [f"-var=environment={env}", f"-var=region=us-east-1"]

run(["terraform", "-chdir=infra/", "init", "-input=false"])
run(["terraform", "-chdir=infra/", "plan", "-input=false", "-out=tfplan"] + tf_vars)

if "--apply" in sys.argv:
    run(["terraform", "-chdir=infra/", "apply", "-input=false", "tfplan"])

# --- Safe: build from variables, NEVER concatenate strings ---
image = "myapp"
tag   = "1.4.2"
safe_cmd = ["docker", "pull", f"{image}:{tag}"]   # safe
# WRONG: unsafe_cmd = f"docker pull {image}:{tag}" and then shell=True`,
        },
      ],
    },
    {
      title: {
        en: "paramiko — SSH automation",
        np: "paramiko — SSH automation",
        jp: "paramiko — SSH 自動化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "paramiko is a pure-Python SSH client. Use it when you need to run commands on remote servers from within a Python script — collecting uptime, restarting services, or transferring files with SFTPClient. It works well for small fleets (up to ~20 hosts) or when you need tight control over what runs and how results are captured. For larger fleets or more complex orchestration, Ansible (which uses paramiko under the hood) or Fabric 3 provide higher-level abstractions. When connecting through a bastion host, open an SSH tunnel via ProxyJump or use paramiko's Channel.transport to nest connections.",
            np: "paramiko एउटा pure-Python SSH client हो। Python script भित्रबाट remote server मा command run गर्न परेको बेला यो प्रयोग गर्नुहोस् — uptime collect गर्न, service restart गर्न, वा SFTPClient सँग file transfer गर्न। यो साना fleet (लगभग 20 host सम्म) का लागि वा के run गर्ने र result कसरी capture गर्ने भन्नेमा tight control चाहिँदा राम्रोसँग काम गर्छ। ठूला fleet वा बढी complex orchestration का लागि, Ansible (जसले भित्रभित्रै paramiko प्रयोग गर्छ) वा Fabric 3 ले उच्च-स्तरीय abstraction प्रदान गर्छन्। Bastion host मार्फत connect गर्दा, ProxyJump मार्फत SSH tunnel खोल्नुहोस् वा connection nest गर्न paramiko को Channel.transport प्रयोग गर्नुहोस्।",
            jp: "paramiko はピュア Python の SSH クライアントです。Python スクリプト内からリモートサーバーでコマンドを実行する必要があるときに使います — アップタイムの収集・サービスの再起動・SFTPClient でのファイル転送などです。小規模なフリート（〜20 ホストまで）や、何を実行してどのように結果をキャプチャするかを細かく制御したいときによく機能します。大規模なフリートや複雑なオーケストレーションには、Ansible（内部で paramiko を使用）や Fabric 3 がより高レベルな抽象化を提供します。バスティオンホスト経由で接続する場合は、ProxyJump 経由で SSH トンネルを開くか、paramiko の Channel.transport を使って接続をネストします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Connect with a key, run a command, and transfer files with SFTP",
            np: "Key सँग connect गर्नुहोस्, command run गर्नुहोस्, र SFTP सँग file transfer गर्नुहोस्",
            jp: "鍵で接続・コマンドを実行・SFTP でファイル転送",
          },
          code: `#!/usr/bin/env python3
"""Use paramiko to SSH into servers, run commands, and transfer files."""
import json
import os
import paramiko
import sys
from pathlib import Path


def ssh_connect(host: str, user: str = "ubuntu", key_path: str | None = None) -> paramiko.SSHClient:
    """Open an SSH connection using a private key."""
    client = paramiko.SSHClient()
    # Accept the server's host key automatically (OK for known-good IPs from AWS API)
    # For production, use RejectPolicy + a known_hosts file
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    key_file = key_path or os.path.expanduser("~/.ssh/id_rsa")
    client.connect(
        hostname=host,
        username=user,
        key_filename=key_file,
        timeout=10,
    )
    return client


def run_remote(client: paramiko.SSHClient, cmd: str) -> tuple[str, str, int]:
    """Run a command over SSH. Returns (stdout, stderr, exit_code)."""
    _, stdout, stderr = client.exec_command(cmd)
    exit_code = stdout.channel.recv_exit_status()
    return stdout.read().decode().strip(), stderr.read().decode().strip(), exit_code


# --- Connect and run a simple command ---
host = os.environ.get("TARGET_HOST", "10.0.0.5")
client = ssh_connect(host)

stdout, stderr, rc = run_remote(client, "uptime && free -h && df -h /")
print(f"[{host}] exit={rc}")
print(stdout)
if rc != 0:
    print(f"STDERR: {stderr}", file=sys.stderr)

# --- Transfer a file with SFTP ---
sftp = client.open_sftp()
sftp.put("dist/app.tar.gz", "/tmp/app.tar.gz")
print(f"Uploaded app.tar.gz to {host}:/tmp/")

# Run installation after upload
run_remote(client, "sudo tar -xzf /tmp/app.tar.gz -C /opt/app && sudo systemctl restart app")

sftp.close()
client.close()

# --- Collect uptime from multiple hosts ---
def check_host(host: str) -> dict:
    try:
        c = ssh_connect(host)
        out, _, rc = run_remote(c, "uptime -p")
        c.close()
        return {"host": host, "uptime": out, "ok": rc == 0}
    except Exception as exc:
        return {"host": host, "uptime": None, "ok": False, "error": str(exc)}

hosts = os.environ.get("HOSTS", "").split(",")
results = [check_host(h.strip()) for h in hosts if h.strip()]
print(json.dumps(results, indent=2))`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: write a deployment health-check script",
        np: "Hands-on: deployment health-check script लेख्नुहोस्",
        jp: "実践：デプロイメントヘルスチェックスクリプトを書く",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Use boto3 to verify the target S3 deployment bucket exists and your credentials can list its contents — exit with a non-zero code and a clear error message if not.",
              np: "boto3 प्रयोग गरेर target S3 deployment bucket अवस्थित छ र तपाईंको credential ले यसको content list गर्न सक्छ भनेर verify गर्नुहोस् — नभए non-zero code र स्पष्ट error message सँग exit गर्नुहोस्।",
              jp: "boto3 を使って、ターゲット S3 デプロイメントバケットが存在し、あなたの認証情報でその内容を一覧表示できることを確認しましょう — できない場合は非ゼロコードと明確なエラーメッセージで終了します。",
            },
            {
              en: "Use the EC2 resource API to list all running instances tagged `env=production` — print their Name tag, instance ID, instance type, and public IP in a table.",
              np: "EC2 resource API प्रयोग गरेर `env=production` tag भएका सबै running instance list गर्नुहोस् — Name tag, instance ID, instance type, र public IP एउटा table मा print गर्नुहोस्।",
              jp: "EC2 リソース API を使って `env=production` タグの付いた実行中インスタンスをすべて一覧表示しましょう — Name タグ・インスタンス ID・インスタンスタイプ・パブリック IP をテーブル形式で表示します。",
            },
            {
              en: "SSH into each instance using paramiko and run `uptime` — capture the result or the error if the connection fails.",
              np: "paramiko प्रयोग गरेर प्रत्येक instance मा SSH गर्नुहोस् र `uptime` run गर्नुहोस् — connection fail भए result वा error capture गर्नुहोस्।",
              jp: "paramiko を使って各インスタンスに SSH し、`uptime` を実行しましょう — 接続に失敗した場合は結果またはエラーをキャプチャします。",
            },
            {
              en: "Output the aggregated results as a JSON report to stdout — one object per host with keys: `instance_id`, `name`, `ip`, `uptime`, `ok`, `error` (null if no error).",
              np: "Aggregated result JSON report को रूपमा stdout मा output गर्नुहोस् — keys: `instance_id`, `name`, `ip`, `uptime`, `ok`, `error` (कुनै error छैन भने null) सहितको प्रति host एउटा object।",
              jp: "集約した結果を JSON レポートとして stdout に出力しましょう — ホストごとに `instance_id`・`name`・`ip`・`uptime`・`ok`・`error`（エラーなしの場合は null）のキーを持つオブジェクト 1 つ。",
            },
            {
              en: "Exit with code 0 if all hosts responded successfully, exit with code 1 if any host failed — this makes the script usable as a CI/CD gate step.",
              np: "सबै host ले सफलतापूर्वक response दिए code 0 सँग exit गर्नुहोस्, कुनै पनि host fail भए code 1 सँग exit गर्नुहोस् — यसले script लाई CI/CD gate step को रूपमा प्रयोगयोग्य बनाउँछ।",
              jp: "すべてのホストが正常に応答した場合はコード 0 で終了し、いずれかのホストが失敗した場合はコード 1 で終了しましょう — これでスクリプトが CI/CD ゲートステップとして使えるようになります。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use boto3 or the aws CLI in scripts?",
        np: "Script मा boto3 वा aws CLI प्रयोग गर्ने?",
        jp: "スクリプトでは boto3 と aws CLI のどちらを使うべきですか？",
      },
      answer: {
        en: "Use boto3 for production automation: it gives you structured error handling (catch specific exceptions like ClientError and NoCredentialsError rather than parsing stderr), automatic pagination with get_paginator(), type-safe return values, and no shell process overhead. Use the aws CLI for quick one-liners in your terminal, for prototyping before you write the Python version, and for bulk operations like aws s3 sync where the CLI has a purpose-built optimized transfer engine that beats naive boto3 loops.",
        np: "Production automation का लागि boto3 प्रयोग गर्नुहोस्: यसले structured error handling (stderr parse गर्नुको सट्टा ClientError र NoCredentialsError जस्ता specific exception catch गर्ने), get_paginator() सँग automatic pagination, type-safe return value, र shell process overhead नभएको फाइदा दिन्छ। Quick one-liner terminal मा, Python version लेख्नु अघि prototype गर्न, र aws s3 sync जस्ता bulk operation का लागि aws CLI प्रयोग गर्नुहोस् जहाँ CLI मा purpose-built optimized transfer engine छ जसले naive boto3 loop भन्दा राम्रो perform गर्छ।",
        jp: "本番の自動化には boto3 を使いましょう。構造化されたエラー処理（stderr を解析する代わりに ClientError や NoCredentialsError などの特定の例外をキャッチ）・get_paginator() による自動ページネーション・型安全な戻り値・シェルプロセスのオーバーヘッドなしという利点があります。ターミナルでのクイックな一行コマンド・Python バージョンを書く前のプロトタイピング・aws s3 sync のような一括操作（CLI には naive な boto3 ループを上回る専用の最適化転送エンジンがある）には aws CLI を使いましょう。",
      },
      tag: { en: "boto3", np: "boto3", jp: "boto3" },
    },
    {
      question: {
        en: "How do I avoid hardcoding AWS credentials?",
        np: "AWS credential hardcode गर्नबाट कसरी जोगिने?",
        jp: "AWS 認証情報をハードコードしないようにするにはどうすればよいですか？",
      },
      answer: {
        en: "Never put access keys in source code or commit them to git. The safe hierarchy is: (1) IAM instance roles or Lambda execution roles when running on AWS — zero credential management, automatically rotated. (2) Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) in CI/CD — inject via your CI platform's secret store (GitHub Actions secrets, GitLab CI variables, etc.). (3) Named profiles in ~/.aws/credentials for local development — run aws configure --profile myproject. If you accidentally commit credentials, rotate them immediately in the IAM console and treat the old keys as fully compromised.",
        np: "Source code मा access key राख्नु वा git मा commit गर्नु कहिल्यै नगर्नुहोस्। Safe hierarchy हो: (1) AWS मा run गर्दा IAM instance role वा Lambda execution role — credential management शून्य, automatically rotate हुन्छ। (2) CI/CD मा environment variable (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) — CI platform को secret store मार्फत inject गर्नुहोस् (GitHub Actions secret, GitLab CI variable, आदि)। (3) Local development का लागि ~/.aws/credentials मा named profile — aws configure --profile myproject run गर्नुहोस्। Accidentally credential commit भएमा, IAM console मा तुरन्त rotate गर्नुहोस् र पुरानो key पूर्णतः compromised मान्नुहोस्।",
        jp: "ソースコードにアクセスキーを入れたり、git にコミットしたりしないでください。安全な優先順位は次のとおりです。(1) AWS 上で実行する場合は IAM インスタンスロールまたは Lambda 実行ロール — 認証情報の管理ゼロ、自動ローテーション。(2) CI/CD での環境変数（AWS_ACCESS_KEY_ID・AWS_SECRET_ACCESS_KEY）— CI プラットフォームのシークレットストア経由で注入（GitHub Actions シークレット・GitLab CI 変数など）。(3) ローカル開発には ~/.aws/credentials の名前付きプロファイル — aws configure --profile myproject を実行。誤って認証情報をコミットした場合は、IAM コンソールで直ちにローテーションし、古いキーは完全に漏洩したものとして扱ってください。",
      },
      tag: { en: "security", np: "security", jp: "セキュリティ" },
    },
    {
      question: {
        en: "What is boto3 pagination and why does it matter?",
        np: "boto3 pagination के हो र यो किन महत्त्वपूर्ण छ?",
        jp: "boto3 のページネーションとは何ですか？なぜ重要なのですか？",
      },
      answer: {
        en: "AWS APIs cap the number of results returned per call — S3 list_objects_v2 returns at most 1000 objects, EC2 describe_instances returns at most 1000 instances, and so on. If you call these APIs directly and process only the first response, you silently miss any results beyond that limit. boto3 paginators handle this for you: call client.get_paginator('list_objects_v2'), then iterate over paginator.paginate(...) — the paginator automatically makes follow-up API calls with the continuation token and yields each page. Always use a paginator for any list or describe call that might return more than one page of results.",
        np: "AWS API ले प्रति call return हुने result को संख्यामा cap राख्छन् — S3 list_objects_v2 ले बढीमा 1000 object, EC2 describe_instances ले बढीमा 1000 instance return गर्छ, र यस्तै। यदि तपाईंले यी API directly call गर्नुहुन्छ र पहिलो response मात्र process गर्नुहुन्छ भने, त्यो limit भन्दा बाहिरका कुनै पनि result silently miss हुन्छ। boto3 paginator ले यो तपाईंको लागि handle गर्छ: client.get_paginator('list_objects_v2') call गर्नुहोस्, त्यसपछि paginator.paginate(...) मा iterate गर्नुहोस् — paginator ले automatically continuation token सँग follow-up API call गर्छ र प्रत्येक page yield गर्छ। एकभन्दा बढी page result return गर्न सक्ने कुनै पनि list वा describe call का लागि सधैं paginator प्रयोग गर्नुहोस्।",
        jp: "AWS API は 1 回の呼び出しで返される結果数を制限しています — S3 の list_objects_v2 は最大 1000 オブジェクト、EC2 の describe_instances は最大 1000 インスタンスを返します。これらの API を直接呼び出して最初のレスポンスだけを処理すると、その制限を超えた結果が暗黙的に欠落します。boto3 のページネーターはこれを自動で処理してくれます。client.get_paginator('list_objects_v2') を呼び出し、paginator.paginate(...) をイテレートします — ページネーターは継続トークンを使って自動的に後続の API 呼び出しを行い、各ページを yield します。複数ページの結果を返す可能性のある list や describe 呼び出しには必ずページネーターを使いましょう。",
      },
      tag: { en: "boto3", np: "boto3", jp: "boto3" },
    },
  ],
};
