import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A DevOps engineer's job is inherently remote — you manage servers you may never physically touch, debug issues at 2 AM via a terminal, and automate tasks that run across dozens of machines. SSH is the secure channel that makes all of this possible, and networking tools are the diagnostic kit you reach for when something breaks.",
    np: "DevOps engineer को काम स्वाभाविक रूपमा remote हो — तपाईं कहिल्यै physically नछोएको server manage गर्नुहुन्छ, terminal मार्फत राति 2 बजे issue debug गर्नुहुन्छ, र दर्जनौं machine मा चल्ने task automate गर्नुहुन्छ। SSH त्यो secure channel हो जसले यो सबै सम्भव बनाउँछ, र networking tool भनेको केही broke भएमा तपाईंले उठाउने diagnostic kit हो।",
    jp: "DevOps エンジニアの仕事は本質的にリモートです。一度も物理的に触れないサーバーを管理し、午前 2 時にターミナル越しに問題をデバッグし、数十台のマシンにまたがるタスクを自動化します。SSH はこれらすべてを可能にするセキュアなチャネルであり、ネットワークツールは何かが壊れたときに手を伸ばす診断キットです。",
  } as const,
  o2: {
    en: "Today you master SSH key authentication (the standard; passwords are legacy), learn how to configure `~/.ssh/config` to stop memorizing server addresses, and build a toolkit of network diagnostic commands you will use every week on the job.",
    np: "आज तपाईंले SSH key authentication (standard; password legacy हो) master गर्नुहुनेछ, server address याद गर्न छाड्न `~/.ssh/config` configure गर्न सिक्नुहुनेछ, र job मा हरेक हप्ता प्रयोग हुने network diagnostic command को toolkit बनाउनुहुनेछ।",
    jp: "本日は SSH 鍵認証（標準。パスワードはレガシー）をマスターし、サーバーアドレスを覚えなくて済むよう `~/.ssh/config` を設定する方法を学び、仕事で毎週使うネットワーク診断コマンドのツールキットを構築します。",
  } as const,
};

export const DEVOPS_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "SSH key authentication — how it works and why it's safer than passwords",
        np: "SSH key authentication — यो कसरी काम गर्छ र password भन्दा किन सुरक्षित छ",
        jp: "SSH 鍵認証 — 仕組みとパスワードより安全な理由",
      },
      blocks: [
        { type: "diagram", id: "devops-ssh-key-auth" },
        {
          type: "paragraph",
          text: {
            en: "SSH uses asymmetric cryptography. You generate a key pair: the private key stays on your machine (never leaves), and the public key is placed on servers you want to access. When you connect, the server issues a challenge that only your private key can sign — no password is ever sent across the network. This is why key-based SSH is both more secure and more convenient than passwords.",
            np: "SSH ले asymmetric cryptography प्रयोग गर्छ। तपाईंले key pair generate गर्नुहुन्छ: private key तपाईंको machine मा रहन्छ (कहिल्यै बाहिर जाँदैन), र public key तपाईंले access गर्न चाहने server मा राखिन्छ। Connect गर्दा, server एउटा challenge दिन्छ जुन केवल तपाईंको private key ले sign गर्न सक्छ — network मा कहिल्यै password पठाइँदैन। यसैले key-based SSH password भन्दा बढी सुरक्षित र सुविधाजनक छ।",
            jp: "SSH は非対称暗号を使用します。秘密鍵はあなたのマシンに留まり（外に出ない）、公開鍵はアクセスしたいサーバーに配置されます。接続時、サーバーはあなたの秘密鍵だけが署名できるチャレンジを発行します。パスワードはネットワーク上で送信されません。これが鍵ベース SSH がパスワードよりも安全で便利な理由です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Generating keys and setting up SSH access",
            np: "Key generate गर्नुहोस् र SSH access setup गर्नुहोस्",
            jp: "鍵の生成と SSH アクセスのセットアップ",
          },
          code: `# Generate a new ED25519 key pair (preferred over RSA today)
ssh-keygen -t ed25519 -C "rajan@work" -f ~/.ssh/id_ed25519
# -t type   -C comment (label for the key)  -f output file
# You will be prompted for a passphrase — USE ONE (protects the key at rest)

# Generated files:
# ~/.ssh/id_ed25519      ← private key (NEVER share this)
# ~/.ssh/id_ed25519.pub  ← public key (safe to copy to servers)

# Correct permissions (SSH refuses to use keys with open permissions)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub

# Copy your public key to a remote server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@192.168.1.10
# This appends your public key to ~/.ssh/authorized_keys on the server

# Manual method (when ssh-copy-id isn't available)
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# Test the connection
ssh user@192.168.1.10

# Use a specific key (when you have multiple keys)
ssh -i ~/.ssh/id_ed25519 user@192.168.1.10`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "ED25519 > RSA — ED25519 keys are shorter, faster, and provide equivalent security to a 3072-bit RSA key. Use RSA only when connecting to very old servers that don't support ED25519.",
              np: "ED25519 > RSA — ED25519 key छोटो, छिटो छ, र 3072-bit RSA key समतुल्य सुरक्षा प्रदान गर्छ। ED25519 support नगर्ने पुरानो server मा connect गर्दा मात्र RSA प्रयोग गर्नुहोस्।",
              jp: "ED25519 > RSA — ED25519 鍵は短く・高速で、3072 ビット RSA 鍵と同等のセキュリティを提供します。ED25519 をサポートしない古いサーバーに接続する場合のみ RSA を使いましょう。",
            },
            {
              en: "Always use a passphrase on your private key. Use `ssh-agent` to avoid typing it repeatedly: `eval $(ssh-agent) && ssh-add ~/.ssh/id_ed25519`.",
              np: "Private key मा सधैं passphrase प्रयोग गर्नुहोस्। बारम्बार type गर्न नपरोस् भनेर `ssh-agent` प्रयोग गर्नुहोस्: `eval $(ssh-agent) && ssh-add ~/.ssh/id_ed25519`।",
              jp: "秘密鍵には常にパスフレーズを使用しましょう。繰り返し入力しなくて済むよう `ssh-agent` を使います：`eval $(ssh-agent) && ssh-add ~/.ssh/id_ed25519`。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "~/.ssh/config — stop memorizing server addresses",
        np: "~/.ssh/config — server address याद गर्न छाड्नुहोस्",
        jp: "~/.ssh/config — サーバーアドレスを覚えるのをやめる",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The SSH config file lets you define aliases for hosts so that `ssh prod-web` connects to the right server with the right user, key, and port — no flags required. It also enables jump host (bastion) configurations, which are essential for reaching private servers in cloud VPCs.",
            np: "SSH config file ले तपाईंलाई host का लागि alias define गर्न दिन्छ ताकि `ssh prod-web` ले सही server, user, key, र port सँग connect होस् — कुनै flag आवश्यक छैन। यसले jump host (bastion) configuration पनि enable गर्छ, जुन cloud VPC मा private server reach गर्न आवश्यक छ।",
            jp: "SSH 設定ファイルでホストのエイリアスを定義すると、`ssh prod-web` が正しいサーバー・ユーザー・鍵・ポートで接続します。フラグは不要です。また、クラウド VPC のプライベートサーバーに到達するために不可欠なジャンプホスト（踏み台）設定も可能にします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Example ~/.ssh/config",
            np: "Example ~/.ssh/config",
            jp: "~/.ssh/config の例",
          },
          code: `# ~/.ssh/config
# chmod 600 ~/.ssh/config

# Default settings applied to ALL hosts
Host *
  ServerAliveInterval 60        # send keepalive every 60s (prevent idle disconnect)
  ServerAliveCountMax 3
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_ed25519

# Production web server
Host prod-web
  HostName 203.0.113.10
  User deploy
  Port 22
  IdentityFile ~/.ssh/id_ed25519_prod

# Staging (reached via a bastion/jump host)
Host staging
  HostName 10.0.1.50            # private IP — not reachable directly
  User deploy
  ProxyJump bastion             # SSH through 'bastion' first

# Bastion host (public-facing jump server)
Host bastion
  HostName 203.0.113.5
  User ec2-user
  IdentityFile ~/.ssh/id_ed25519_prod

# Local VM
Host dev
  HostName 192.168.56.10
  User vagrant
  StrictHostKeyChecking no      # skip host key check for throwaway VMs

# Usage — these all work with the config above:
# ssh prod-web
# ssh staging
# scp localfile.tar.gz prod-web:/tmp/
# rsync -av ./dist/ staging:/var/www/app/`,
        },
      ],
    },
    {
      title: {
        en: "File transfer — scp and rsync",
        np: "File transfer — scp र rsync",
        jp: "ファイル転送 — scp と rsync",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "scp and rsync for remote file operations",
            np: "Remote file operation का लागि scp र rsync",
            jp: "リモートファイル操作のための scp と rsync",
          },
          code: `# scp (secure copy) — simple one-off transfers
scp localfile.txt user@server:/remote/path/
scp user@server:/remote/file.txt ./local/
scp -r ./dist/ user@server:/var/www/app/     # recursive directory copy
scp -P 2222 file.txt user@server:/tmp/       # non-standard port

# rsync — incremental sync (only sends changed bytes)
# This is what you use for deploys, backups, and large transfers
rsync -avz ./dist/ user@server:/var/www/app/
# -a  archive mode (preserves permissions, timestamps, symlinks)
# -v  verbose
# -z  compress during transfer

# Dry run — see what WOULD be transferred without actually doing it
rsync -avzn ./dist/ user@server:/var/www/app/

# Delete files on destination that no longer exist locally
rsync -avz --delete ./dist/ user@server:/var/www/app/

# Use SSH config aliases
rsync -avz ./dist/ prod-web:/var/www/app/

# Exclude files
rsync -avz --exclude='.git' --exclude='node_modules' ./ server:/app/

# Bandwidth-limited sync (useful on metered connections)
rsync -avz --bwlimit=1000 large-backup.tar.gz server:/backups/
# 1000 = 1000 KB/s

# rsync progress for large files
rsync -avz --progress backup.tar.gz server:/backups/`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "rsync over scp for deploys — `rsync` with `--delete` gives you atomic-like deploys: only changed files are sent, and stale files are removed. A full `scp -r` re-sends every file every time.",
              np: "Deploy का लागि scp भन्दा rsync — `--delete` सहित `rsync` ले atomic-like deploy दिन्छ: केवल changed file पठाइन्छ, र stale file हटाइन्छ। पूर्ण `scp -r` ले हरेक पटक हरेक file पुनः पठाउँछ।",
              jp: "デプロイには scp より rsync — `--delete` 付きの `rsync` でアトミックに近いデプロイができます。変更されたファイルだけが送られ、不要なファイルが削除されます。`scp -r` は毎回すべてのファイルを再送します。",
            },
            {
              en: "Trailing slash matters in rsync: `rsync src/ dest/` copies the *contents* of `src`; `rsync src dest/` copies the *directory* `src` into `dest`. This is a common source of bugs.",
              np: "Rsync मा trailing slash महत्वपूर्ण छ: `rsync src/ dest/` ले `src` को *content* copy गर्छ; `rsync src dest/` ले *directory* `src` लाई `dest` भित्र copy गर्छ। यो bug को सामान्य स्रोत हो।",
              jp: "rsync ではスラッシュの有無が重要です。`rsync src/ dest/` は `src` の中身をコピーし、`rsync src dest/` はディレクトリ `src` を `dest` の中にコピーします。これはよくあるバグの原因です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Network diagnostic toolkit",
        np: "Network diagnostic toolkit",
        jp: "ネットワーク診断ツールキット",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When a service is unreachable, you work from Layer 3 upward: is the host alive (ping)? Is the port open (nc/telnet)? What is listening on that port (ss/netstat)? What path does traffic take (traceroute)? What is DNS resolving to (dig)? These commands answer those questions.",
            np: "Service unreachable हुँदा, तपाईं Layer 3 देखि माथि काम गर्नुहुन्छ: host alive छ (ping)? Port खुला छ (nc/telnet)? त्यो port मा के listen गर्दैछ (ss/netstat)? Traffic कुन path लिन्छ (traceroute)? DNS कसमा resolve गर्दैछ (dig)? यी command ले ती प्रश्नको जवाफ दिन्छ।",
            jp: "サービスが到達不能なとき、レイヤー 3 から上に向かって作業します。ホストは生きているか（ping）？ポートは開いているか（nc/telnet）？そのポートで何がリッスンしているか（ss/netstat）？トラフィックはどのルートを通るか（traceroute）？DNS は何を解決しているか（dig）？これらのコマンドがその答えを提供します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Essential networking commands for DevOps",
            np: "DevOps का लागि आवश्यक networking command",
            jp: "DevOps のための必須ネットワークコマンド",
          },
          code: `# ping — is the host reachable? (Layer 3 / ICMP)
ping -c 4 google.com            # 4 packets then stop
ping -c 4 192.168.1.1           # works with IPs too

# traceroute — what path does traffic take?
traceroute google.com
traceroute -n google.com        # skip DNS lookups (faster)
# MTR is a modern traceroute + ping combined
mtr --report google.com

# dig — DNS lookups (prefer over nslookup)
dig google.com                  # A record (IPv4)
dig google.com AAAA             # AAAA record (IPv6)
dig google.com MX               # mail server records
dig @8.8.8.8 google.com         # query specific DNS server
dig +short google.com           # just the IP, no extra output

# ss / netstat — what is listening on which port?
ss -tlnp                        # TCP Listening, Numeric, show Process
ss -ulnp                        # UDP Listening
ss -tlnp | grep ':80'           # who is on port 80?
# On older systems: netstat -tlnp (same flags)

# curl — HTTP requests and API testing
curl -I https://example.com                  # headers only (HEAD request)
curl -sv https://example.com 2>&1 | head -30 # verbose: shows TLS handshake
curl -o /dev/null -w "%{http_code}" https://example.com  # just the status code
curl -sf http://localhost/health             # silent, fail on error (for scripts)
curl -X POST -H "Content-Type: application/json" \\
     -d '{"key":"value"}' http://api/endpoint

# nc (netcat) — raw TCP/UDP connections
nc -zv 192.168.1.10 22          # is port 22 open? (-z scan, -v verbose)
nc -zv 192.168.1.10 80 443      # check multiple ports
echo "GET / HTTP/1.0" | nc example.com 80  # raw HTTP request

# ip — modern replacement for ifconfig/route
ip addr                         # show all interfaces and IPs
ip addr show eth0               # specific interface
ip route                        # routing table
ip route get 8.8.8.8            # which interface reaches this IP?

# nmap — port scanning (install if needed: apt install nmap)
nmap -p 22,80,443 192.168.1.10  # scan specific ports
nmap -p 1-1000 192.168.1.10     # scan first 1000 ports`,
        },
      ],
    },
    {
      title: {
        en: "SSH advanced techniques for DevOps",
        np: "DevOps का लागि SSH advanced technique",
        jp: "DevOps のための SSH 高度なテクニック",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Port forwarding, tunnels, and remote execution",
            np: "Port forwarding, tunnel, र remote execution",
            jp: "ポートフォワーディング・トンネル・リモート実行",
          },
          code: `# Run a single command on a remote server (no interactive shell)
ssh prod-web "df -h"
ssh prod-web "sudo systemctl status nginx"

# Run a local script on a remote server
ssh prod-web < deploy.sh
ssh prod-web "bash -s" < deploy.sh   # explicit bash

# Run the same command on multiple servers
for SERVER in web1 web2 web3; do
  ssh "\$SERVER" "sudo systemctl restart app" &
done
wait   # wait for all background SSH jobs to finish

# Local port forwarding — access a remote service locally
# Access a database on the remote server's internal network
ssh -L 5432:localhost:5432 prod-db
# Now psql -h localhost -p 5432 connects to the remote DB

# Access a private web service through a bastion
ssh -L 8080:internal-app:80 bastion
# Now http://localhost:8080 → internal-app:80 via bastion

# Remote port forwarding — expose a local service to a remote server
ssh -R 8080:localhost:3000 staging
# Now staging:8080 → your local machine:3000

# Dynamic port forwarding — SOCKS proxy
ssh -D 1080 bastion
# Configure your browser to use SOCKS5 proxy at localhost:1080

# Keep an SSH session alive as a background tunnel
ssh -fNL 5432:db.internal:5432 bastion
# -f background  -N no command  -L local forward

# Secure copy through a jump host (without ProxyJump in config)
scp -J bastion localfile.txt deploy@internal-host:/tmp/

# Hardening: disable password auth on servers you manage
# /etc/ssh/sshd_config:
# PasswordAuthentication no
# PermitRootLogin no
# PubkeyAuthentication yes
sudo sshd -t   # test config before restarting
sudo systemctl restart sshd`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "I get 'Host key verification failed' — what does this mean?",
        np: "'Host key verification failed' आउँछ — यसको अर्थ के हो?",
        jp: "「Host key verification failed」が出る — どういう意味か？",
      },
      answer: {
        en: "SSH stores a fingerprint of each server you connect to in `~/.ssh/known_hosts`. If that fingerprint changes (server was rebuilt, IP was reassigned, or someone is doing a man-in-the-middle attack), SSH refuses to connect. If you know the server was legitimately rebuilt: `ssh-keygen -R hostname` to remove the old entry, then reconnect and accept the new fingerprint. On throwaway VMs/containers you can suppress this with `StrictHostKeyChecking no` in `~/.ssh/config`, but never disable it for real production servers.",
        np: "SSH ले तपाईंले connect गरेको हरेक server को fingerprint `~/.ssh/known_hosts` मा store गर्छ। यदि त्यो fingerprint बदलियो (server rebuild भयो, IP reassign भयो, वा कसैले man-in-the-middle attack गर्दैछ) भने SSH connect गर्न अस्वीकार गर्छ। Server legitimately rebuild भएको थाहा छ भने: पुरानो entry हटाउन `ssh-keygen -R hostname`, त्यसपछि reconnect गर्नुहोस् र नयाँ fingerprint accept गर्नुहोस्। Throwaway VM/container मा `~/.ssh/config` मा `StrictHostKeyChecking no` प्रयोग गर्न सकिन्छ, तर production server मा कहिल्यै disable नगर्नुहोस्।",
        jp: "SSH は接続したサーバーのフィンガープリントを `~/.ssh/known_hosts` に保存します。フィンガープリントが変わると（サーバーの再構築・IP の再割り当て・中間者攻撃）、SSH は接続を拒否します。サーバーが正当に再構築されたとわかっている場合：`ssh-keygen -R hostname` で古いエントリを削除し、再接続して新しいフィンガープリントを受け入れます。使い捨て VM/コンテナでは `~/.ssh/config` に `StrictHostKeyChecking no` を使えますが、本番サーバーでは絶対に無効にしないでください。",
      },
      tag: { en: "security", np: "सुरक्षा", jp: "セキュリティ" },
    },
    {
      question: {
        en: "My SSH connection drops after a few minutes of inactivity — how do I fix it?",
        np: "SSH connection केही मिनेट idle भएपछि drop हुन्छ — कसरी fix गर्ने?",
        jp: "数分間アイドル状態になると SSH 接続が切れる — どう直すか？",
      },
      answer: {
        en: "This is caused by firewalls or NAT devices dropping idle TCP connections. The fix is SSH keepalives: add `ServerAliveInterval 60` and `ServerAliveCountMax 3` to your `~/.ssh/config` under `Host *`. This makes the SSH client send a keepalive packet every 60 seconds; if 3 consecutive packets go unanswered it closes the connection cleanly. Alternatively, set `ClientAliveInterval 60` on the server side in `/etc/ssh/sshd_config`.",
        np: "यो firewall वा NAT device ले idle TCP connection drop गर्दा हुन्छ। Fix SSH keepalive हो: `~/.ssh/config` मा `Host *` अन्तर्गत `ServerAliveInterval 60` र `ServerAliveCountMax 3` थप्नुहोस्। यसले SSH client लाई हरेक 60 सेकेन्डमा keepalive packet पठाउन लगाउँछ; 3 consecutive packet को जवाफ नआएमा connection cleanly बन्द गर्छ। वैकल्पिक रूपमा, server side मा `/etc/ssh/sshd_config` मा `ClientAliveInterval 60` set गर्नुहोस्।",
        jp: "これはファイアウォールや NAT デバイスがアイドル状態の TCP 接続を切断することで起こります。修正は SSH keepalive です。`~/.ssh/config` の `Host *` の下に `ServerAliveInterval 60` と `ServerAliveCountMax 3` を追加します。SSH クライアントが 60 秒ごとに keepalive パケットを送り、3 回連続で無応答なら接続をきれいに閉じます。代わりにサーバー側の `/etc/ssh/sshd_config` に `ClientAliveInterval 60` を設定することもできます。",
      },
      tag: { en: "tools", np: "उपकरण", jp: "ツール" },
    },
    {
      question: {
        en: "What is the difference between `curl -f` and checking the HTTP status code manually?",
        np: "`curl -f` र HTTP status code manually check गर्दाको फरक के हो?",
        jp: "`curl -f` と HTTP ステータスコードを手動でチェックする違いは？",
      },
      answer: {
        en: "`curl -f` (or `--fail`) makes curl exit with code 22 when the server returns an HTTP 4xx or 5xx response. Without `-f`, curl exits 0 (success) even if the server returns a 500 error — because curl succeeded in making the request, even if the response was an error. In scripts with `set -e`, `curl -f` means a 404 or 503 will cause the script to abort. Combine with `-s` (silent) and `-S` (show errors) for clean script usage: `curl -fsSL url`.",
        np: "`curl -f` (वा `--fail`) ले server ले HTTP 4xx वा 5xx response फर्काउँदा curl लाई code 22 सँग exit गराउँछ। `-f` बिना, server ले 500 error फर्काए पनि curl 0 (success) सँग exit हुन्छ — किनभने response error भए पनि curl ले request गर्न सफल भयो। `set -e` सहित script मा, `curl -f` को अर्थ 404 वा 503 ले script abort गर्छ। Script प्रयोगका लागि `-s` (silent) र `-S` (show errors) सँग combine गर्नुहोस्: `curl -fsSL url`।",
        jp: "`curl -f`（または `--fail`）は、サーバーが HTTP 4xx または 5xx レスポンスを返したときに curl を終了コード 22 で終了させます。`-f` がないと、サーバーが 500 エラーを返しても curl は 0（成功）で終了します。リクエスト自体は成功したためです。`set -e` のスクリプトでは、`curl -f` によって 404 や 503 がスクリプトを中断させます。クリーンなスクリプト使用には `-s`（サイレント）と `-S`（エラー表示）と組み合わせます：`curl -fsSL url`。",
      },
      tag: { en: "tools", np: "उपकरण", jp: "ツール" },
    },
    {
      question: {
        en: "How do I connect to a server in a private VPC that has no public IP?",
        np: "Public IP नभएको private VPC को server मा कसरी connect गर्ने?",
        jp: "パブリック IP を持たないプライベート VPC のサーバーに接続するには？",
      },
      answer: {
        en: "Use a bastion host (jump server) — a single publicly accessible server in the same VPC. You SSH into the bastion, then SSH to the private server from there. The modern way is SSH `ProxyJump`: `ssh -J bastion private-server`, or with `ProxyJump bastion` in `~/.ssh/config`. Your SSH client handles both hops transparently — you never get a shell on the bastion. AWS Systems Manager Session Manager is a passwordless alternative that requires no open SSH port at all.",
        np: "Bastion host (jump server) प्रयोग गर्नुहोस् — एउटै VPC मा एउटा publicly accessible server। तपाईं bastion मा SSH गर्नुहुन्छ, त्यसपछि त्यहाँबाट private server मा SSH गर्नुहुन्छ। Modern तरिका SSH `ProxyJump` हो: `ssh -J bastion private-server`, वा `~/.ssh/config` मा `ProxyJump bastion`। तपाईंको SSH client ले दुवै hop transparently handle गर्छ — तपाईंले कहिल्यै bastion मा shell पाउनुहुन्न। AWS Systems Manager Session Manager कुनै SSH port खुला नभएको passwordless alternative हो।",
        jp: "踏み台ホスト（ジャンプサーバー）を使います。同じ VPC 内の公開アクセス可能な 1 台のサーバーです。踏み台に SSH し、そこからプライベートサーバーに SSH します。現代的な方法は SSH の `ProxyJump` です：`ssh -J bastion private-server`、または `~/.ssh/config` に `ProxyJump bastion`。SSH クライアントが両方のホップを透過的に処理するため、踏み台でシェルを得ることはありません。AWS Systems Manager Session Manager は SSH ポートを開く必要のないパスワードレスの代替手段です。",
      },
      tag: { en: "tools", np: "उपकरण", jp: "ツール" },
    },
  ],
};
