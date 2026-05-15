import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Ansible Vault** solves one of the hardest problems in infrastructure automation: how do you store secrets (passwords, API keys, TLS private keys, database credentials) in version control without exposing them? Without Vault, teams are forced into bad trade-offs — either committing plaintext secrets to Git (a catastrophic security failure) or managing secrets out-of-band in a way that breaks the reproducibility of automation. Vault uses **AES-256-CBC** encryption, the same standard used by modern cryptographic systems, to encrypt your YAML files or individual string values so they are safe to commit to any repository. The most common operations are: `ansible-vault encrypt secrets.yml` (encrypts an entire file in-place — the original file is replaced with ciphertext), `ansible-vault decrypt secrets.yml` (restores the plaintext — use only for editing, never leave decrypted files committed), `ansible-vault edit secrets.yml` (opens the file in your `$EDITOR` after decrypting in memory — the safest way to modify a vault file, the file is never written as plaintext to disk), `ansible-vault view secrets.yml` (prints the plaintext to stdout without writing it to disk), and `ansible-vault encrypt_string 'mysecretvalue' --name db_password` (encrypts a single value inline so it can be embedded directly in a playbook or vars file — the output is a multi-line `!vault |` YAML block). The **Vault ID** system allows multiple passwords in a single project: dev secrets encrypted with the dev password, prod secrets encrypted with a separate prod password. Each vault ID is a label: `ansible-vault encrypt --vault-id dev@prompt secrets_dev.yml` creates a dev-vault-id-tagged file, and `ansible-vault encrypt --vault-id prod@~/.vault_prod_pass secrets_prod.yml` uses a password file. At playbook run time you supply `--vault-id dev@prompt --vault-id prod@~/.vault_prod_pass` and Ansible decrypts each file with the correct password automatically.",
    np: "**Ansible Vault** ले infrastructure automation मा सबैभन्दा कठिन समस्याहरू मध्ये एक solve गर्छ: secret (password, API key, TLS private key, database credential) लाई version control मा expose नगरी कसरी store गर्ने? Vault बिना, team लाई खराब trade-off मा forced हुनुपर्छ — या त Git मा plaintext secret commit गर्नुपर्छ (catastrophic security failure) वा automation को reproducibility break गर्ने तरिकाले out-of-band secret manage गर्नुपर्छ। Vault ले तपाईंको YAML file वा individual string value encrypt गर्न modern cryptographic system ले प्रयोग गर्ने same standard **AES-256-CBC** encryption प्रयोग गर्छ ताकि यी कुनै पनि repository मा commit गर्न safe हुन्छ। सबैभन्दा common operation हरू: `ansible-vault encrypt secrets.yml` (एउटा file लाई in-place encrypt गर्छ — original file ciphertext ले replace हुन्छ), `ansible-vault decrypt secrets.yml` (plaintext restore गर्छ — editing को लागि मात्र प्रयोग गर्नुहोस्, decrypted file कहिल्यै committed छोड्नुहुन्न), `ansible-vault edit secrets.yml` (memory मा decrypt गरेपछि `$EDITOR` मा file खोल्छ — vault file modify गर्ने सबैभन्दा safe तरिका, file कहिल्यै plaintext मा disk मा लेखिँदैन), `ansible-vault view secrets.yml` (disk मा नलेखी stdout मा plaintext print गर्छ), र `ansible-vault encrypt_string 'mysecretvalue' --name db_password` (एउटा single value inline encrypt गर्छ ताकि यसलाई playbook वा vars file मा directly embed गर्न सकिन्छ — output multi-line `!vault |` YAML block हो)। **Vault ID** system ले एउटा project मा multiple password allow गर्छ: dev password सँग encrypt गरिएको dev secret, छुट्टै prod password सँग encrypt गरिएको prod secret। प्रत्येक vault ID एउटा label हो: `ansible-vault encrypt --vault-id dev@prompt secrets_dev.yml` ले dev-vault-id-tagged file create गर्छ, र `ansible-vault encrypt --vault-id prod@~/.vault_prod_pass secrets_prod.yml` ले password file प्रयोग गर्छ। Playbook run time मा `--vault-id dev@prompt --vault-id prod@~/.vault_prod_pass` supply गर्नुहोस् र Ansible ले automatically correct password सँग हरेक file decrypt गर्छ।",
    jp: "**Ansible Vault** はインフラ自動化の最も難しい問題の一つを解決します：バージョン管理にシークレット（パスワード・API キー・TLS 秘密鍵・データベース認証情報）を公開せずに保存する方法は？Vault がなければ、チームは悪いトレードオフを強いられます — Git にプレーンテキストのシークレットをコミットする（壊滅的なセキュリティ障害）か、自動化の再現性を損なう方法でアウトオブバンドでシークレットを管理するかです。Vault は、YAML ファイルまたは個々の文字列値を暗号化してどのリポジトリにもコミットしても安全にするために、現代の暗号システムが使用するのと同じ標準である **AES-256-CBC** 暗号化を使用します。最も一般的な操作：`ansible-vault encrypt secrets.yml`（ファイルをインプレースで暗号化 — 元のファイルは暗号文で置き換えられる）、`ansible-vault decrypt secrets.yml`（プレーンテキストを復元 — 編集時のみ使用し、復号化されたファイルをコミットしたままにしない）、`ansible-vault edit secrets.yml`（メモリ内で復号化後に `$EDITOR` でファイルを開く — vault ファイルを変更する最も安全な方法、ファイルはディスクにプレーンテキストで書き込まれない）、`ansible-vault view secrets.yml`（ディスクに書き込まずに stdout にプレーンテキストを出力）、`ansible-vault encrypt_string 'mysecretvalue' --name db_password`（単一の値をインラインで暗号化してプレイブックや変数ファイルに直接埋め込めるようにする — 出力は複数行の `!vault |` YAML ブロック）。**Vault ID** システムは 1 つのプロジェクトで複数のパスワードを可能にします：dev パスワードで暗号化された dev シークレット、別の prod パスワードで暗号化された prod シークレット。各 vault ID はラベルです：`ansible-vault encrypt --vault-id dev@prompt secrets_dev.yml` は dev-vault-id タグ付きファイルを作成し、`ansible-vault encrypt --vault-id prod@~/.vault_prod_pass secrets_prod.yml` はパスワードファイルを使用します。プレイブック実行時に `--vault-id dev@prompt --vault-id prod@~/.vault_prod_pass` を指定すると、Ansible は各ファイルを自動的に正しいパスワードで復号化します。",
  } as const,
  o2: {
    en: "Production secret management with Ansible Vault is not just about encryption — it is about establishing patterns that are secure, maintainable, and compatible with CI/CD pipelines. There are five key production patterns every team should adopt. **(1) The `vault_` variable naming convention**: keep two parallel variable files — `vars/main.yml` (unencrypted, committed) holds references like `db_password: \"{{ vault_db_password }}\"`, and `vars/vault.yml` (Vault-encrypted, committed) holds the actual secrets like `vault_db_password: \"s3cr3tP@ss\"`. Your tasks use `db_password` and never directly reference `vault_` variables. This makes your variable files human-readable while keeping actual secrets encrypted. **(2) Password file pattern**: store the vault password in `.vault_pass` (a plaintext file that is git-ignored), set `vault_password_file = .vault_pass` in `ansible.cfg`, and never pass `--ask-vault-pass` manually — Ansible reads the password file automatically. Add `.vault_pass` to `.gitignore` immediately. **(3) CI/CD integration**: in GitHub Actions or GitLab CI, the vault password is stored as a masked secret environment variable (`ANSIBLE_VAULT_PASSWORD`). In your pipeline, write the password to a temp file: `echo \"$ANSIBLE_VAULT_PASSWORD\" > /tmp/.vault_pass && chmod 600 /tmp/.vault_pass`, then set `ANSIBLE_VAULT_PASSWORD_FILE=/tmp/.vault_pass`. **(4) External secret manager integration**: for the highest security, don't even store secrets in Vault files — use lookup plugins: `{{ lookup('aws_ssm', '/myapp/db_password', region='us-east-1') }}` fetches live from AWS Parameter Store, `{{ lookup('hashi_vault', 'secret=secret/myapp/db_password:value') }}` fetches from HashiCorp Vault. **(5) Preventing secret leakage in logs**: add `no_log: true` to any task that handles a secret variable — this suppresses the task's output from all logs, including verbose mode. Without `no_log: true`, Ansible will print the decrypted secret value in the task output when run with `-v`.",
    np: "Ansible Vault सँग production secret management भनेको encryption मात्र होइन — यो secure, maintainable, र CI/CD pipeline compatible pattern establish गर्नु हो। हरेक team ले adopt गर्नुपर्ने पाँचवटा key production pattern छन्। **(1) `vault_` variable naming convention**: दुईवटा parallel variable file राख्नुहोस् — `vars/main.yml` (unencrypted, committed) मा `db_password: \"{{ vault_db_password }}\"` जस्ता reference छ, र `vars/vault.yml` (Vault-encrypted, committed) मा `vault_db_password: \"s3cr3tP@ss\"` जस्ता actual secret छ। तपाईंको task ले `db_password` प्रयोग गर्छ र कहिल्यै `vault_` variable directly reference गर्दैन। यसले actual secret encrypt राख्दै variable file लाई human-readable बनाउँछ। **(2) Password file pattern**: `.vault_pass` मा vault password store गर्नुहोस् (git-ignored plaintext file), `ansible.cfg` मा `vault_password_file = .vault_pass` set गर्नुहोस्, र manually `--ask-vault-pass` कहिल्यै pass नगर्नुहोस् — Ansible ले automatically password file पढ्छ। `.vault_pass` लाई तुरुन्त `.gitignore` मा add गर्नुहोस्। **(3) CI/CD integration**: GitHub Actions वा GitLab CI मा, vault password लाई masked secret environment variable (`ANSIBLE_VAULT_PASSWORD`) को रूपमा store गरिन्छ। Pipeline मा password लाई temp file मा लेख्नुहोस्: `echo \"$ANSIBLE_VAULT_PASSWORD\" > /tmp/.vault_pass && chmod 600 /tmp/.vault_pass`, त्यसपछि `ANSIBLE_VAULT_PASSWORD_FILE=/tmp/.vault_pass` set गर्नुहोस्। **(4) External secret manager integration**: सबैभन्दा high security को लागि, Vault file मा secret नै store नगर्नुहोस् — lookup plugin प्रयोग गर्नुहोस्: `{{ lookup('aws_ssm', '/myapp/db_password', region='us-east-1') }}` ले AWS Parameter Store बाट live fetch गर्छ, `{{ lookup('hashi_vault', 'secret=secret/myapp/db_password:value') }}` ले HashiCorp Vault बाट fetch गर्छ। **(5) Log मा secret leakage रोक्न**: secret variable handle गर्ने जुनसुकै task मा `no_log: true` add गर्नुहोस् — यसले verbose mode सहित सबै log बाट task को output suppress गर्छ। `no_log: true` बिना, Ansible ले `-v` सँग run गर्दा task output मा decrypted secret value print गर्नेछ।",
    jp: "Ansible Vault を使った本番のシークレット管理は暗号化だけでなく、安全で保守可能で CI/CD パイプラインと互換性のあるパターンを確立することです。すべてのチームが採用すべき 5 つの重要な本番パターンがあります。**(1) `vault_` 変数命名規則**：2 つの並行する変数ファイルを保持します — `vars/main.yml`（未暗号化・コミット済み）には `db_password: \"{{ vault_db_password }}\"` のような参照を、`vars/vault.yml`（Vault 暗号化・コミット済み）には `vault_db_password: \"s3cr3tP@ss\"` のような実際のシークレットを保持します。タスクは `db_password` を使用し、`vault_` 変数を直接参照しません。これにより変数ファイルが人間に読みやすい状態を保ちながら、実際のシークレットを暗号化します。**(2) パスワードファイルパターン**：`.vault_pass`（git で無視されるプレーンテキストファイル）に vault パスワードを保存し、`ansible.cfg` に `vault_password_file = .vault_pass` を設定し、手動で `--ask-vault-pass` を渡さない — Ansible は自動的にパスワードファイルを読み込みます。`.vault_pass` をすぐに `.gitignore` に追加する。**(3) CI/CD 統合**：GitHub Actions または GitLab CI では、vault パスワードはマスクされたシークレット環境変数（`ANSIBLE_VAULT_PASSWORD`）として保存されます。パイプラインでパスワードを一時ファイルに書き込みます：`echo \"$ANSIBLE_VAULT_PASSWORD\" > /tmp/.vault_pass && chmod 600 /tmp/.vault_pass`、次に `ANSIBLE_VAULT_PASSWORD_FILE=/tmp/.vault_pass` を設定します。**(4) 外部シークレットマネージャーの統合**：最高のセキュリティのためには、Vault ファイルにシークレットを保存さえしない — ルックアッププラグインを使用します：`{{ lookup('aws_ssm', '/myapp/db_password', region='us-east-1') }}` は AWS Parameter Store からライブで取得し、`{{ lookup('hashi_vault', 'secret=secret/myapp/db_password:value') }}` は HashiCorp Vault から取得します。**(5) ログへのシークレット漏洩防止**：シークレット変数を扱うすべてのタスクに `no_log: true` を追加する — これは verbose モードを含むすべてのログからタスクの出力を抑制します。`no_log: true` がなければ、Ansible は `-v` で実行したときにタスク出力に復号化されたシークレット値を出力します。",
  } as const,
};

export const DEVOPS_DAY_77_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Vault encryption, vault IDs & the encrypt_string workflow",
        np: "Vault encryption, vault ID र encrypt_string workflow",
        jp: "Vault 暗号化・Vault ID・encrypt_string ワークフロー",
      },
      blocks: [
        { type: "diagram", id: "devops-ansible-vault" },
        {
          type: "table",
          caption: {
            en: "Ansible Vault commands — what they do and when to use them",
            np: "Ansible Vault command — यिनीहरू के गर्छन् र कहिले प्रयोग गर्ने",
            jp: "Ansible Vault コマンド — 何をするのか・いつ使うのか",
          },
          headers: [
            { en: "Command", np: "Command", jp: "コマンド" },
            { en: "What it does", np: "के गर्छ", jp: "何をするか" },
            { en: "When to use", np: "कहिले प्रयोग गर्ने", jp: "いつ使うか" },
            { en: "Example", np: "Example", jp: "例" },
          ],
          rows: [
            [
              { en: "`encrypt`", np: "`encrypt`", jp: "`encrypt`" },
              { en: "Encrypts an entire file in-place using AES-256-CBC", np: "AES-256-CBC प्रयोग गरेर एउटा entire file in-place encrypt गर्छ", jp: "AES-256-CBC を使ってファイル全体をインプレースで暗号化する" },
              { en: "When creating a new secrets file to commit to Git", np: "Git मा commit गर्न नयाँ secrets file create गर्दा", jp: "Git にコミットする新しいシークレットファイルを作成するとき" },
              { en: "`ansible-vault encrypt vars/vault.yml`", np: "`ansible-vault encrypt vars/vault.yml`", jp: "`ansible-vault encrypt vars/vault.yml`" },
            ],
            [
              { en: "`decrypt`", np: "`decrypt`", jp: "`decrypt`" },
              { en: "Decrypts a file in-place, restoring plaintext on disk", np: "File लाई in-place decrypt गर्छ, disk मा plaintext restore गर्छ", jp: "ファイルをインプレースで復号化し、ディスク上のプレーンテキストを復元する" },
              { en: "Temporary viewing only — never leave decrypted files committed", np: "Temporary viewing मात्र — decrypted file कहिल्यै committed छोड्नुहुन्न", jp: "一時的な閲覧のみ — 復号化されたファイルをコミットしたままにしない" },
              { en: "`ansible-vault decrypt vars/vault.yml`", np: "`ansible-vault decrypt vars/vault.yml`", jp: "`ansible-vault decrypt vars/vault.yml`" },
            ],
            [
              { en: "`edit`", np: "`edit`", jp: "`edit`" },
              { en: "Decrypts in memory, opens in `$EDITOR`, re-encrypts on save — plaintext never touches disk", np: "Memory मा decrypt गर्छ, `$EDITOR` मा खोल्छ, save गर्दा re-encrypt गर्छ — plaintext कहिल्यै disk छुँदैन", jp: "メモリ内で復号化し、`$EDITOR` で開き、保存時に再暗号化 — プレーンテキストはディスクに触れない" },
              { en: "The safest way to modify a vault-encrypted file", np: "Vault-encrypted file modify गर्ने safest तरिका", jp: "Vault 暗号化ファイルを変更する最も安全な方法" },
              { en: "`ansible-vault edit vars/vault.yml`", np: "`ansible-vault edit vars/vault.yml`", jp: "`ansible-vault edit vars/vault.yml`" },
            ],
            [
              { en: "`view`", np: "`view`", jp: "`view`" },
              { en: "Decrypts and prints the plaintext to stdout without writing to disk", np: "Disk मा नलेखी plaintext decrypt गरेर stdout मा print गर्छ", jp: "ディスクに書き込まずにプレーンテキストを復号化して stdout に出力する" },
              { en: "Inspecting vault contents safely without risking a plaintext file", np: "Plaintext file को risk बिना vault content safely inspect गर्न", jp: "プレーンテキストファイルのリスクなしに vault の内容を安全に確認する" },
              { en: "`ansible-vault view vars/vault.yml`", np: "`ansible-vault view vars/vault.yml`", jp: "`ansible-vault view vars/vault.yml`" },
            ],
            [
              { en: "`encrypt_string`", np: "`encrypt_string`", jp: "`encrypt_string`" },
              { en: "Encrypts a single string value inline as a `!vault |` YAML block", np: "एउटा single string value लाई `!vault |` YAML block को रूपमा inline encrypt गर्छ", jp: "単一の文字列値を `!vault |` YAML ブロックとしてインラインで暗号化する" },
              { en: "Embedding individual secrets directly in playbooks or vars files", np: "Individual secret लाई playbook वा vars file मा directly embed गर्न", jp: "個々のシークレットをプレイブックや変数ファイルに直接埋め込む" },
              { en: "`ansible-vault encrypt_string 'mypass' --name db_pass`", np: "`ansible-vault encrypt_string 'mypass' --name db_pass`", jp: "`ansible-vault encrypt_string 'mypass' --name db_pass`" },
            ],
            [
              { en: "`rekey`", np: "`rekey`", jp: "`rekey`" },
              { en: "Re-encrypts a vault file with a new password without decrypting to disk first", np: "Disk मा पहिले decrypt नगरी नयाँ password सँग vault file re-encrypt गर्छ", jp: "最初にディスクへ復号化せずに新しいパスワードで vault ファイルを再暗号化する" },
              { en: "Rotating the vault password after a security incident or personnel change", np: "Security incident वा personnel change पछि vault password rotate गर्न", jp: "セキュリティインシデントや人員変更後に vault パスワードをローテーションする" },
              { en: "`ansible-vault rekey vars/vault.yml`", np: "`ansible-vault rekey vars/vault.yml`", jp: "`ansible-vault rekey vars/vault.yml`" },
            ],
            [
              { en: "`create`", np: "`create`", jp: "`create`" },
              { en: "Creates a new encrypted file by opening `$EDITOR` on an empty buffer, saves encrypted", np: "Empty buffer मा `$EDITOR` खोलेर नयाँ encrypted file create गर्छ, encrypted save गर्छ", jp: "空のバッファで `$EDITOR` を開いて新しい暗号化ファイルを作成し、暗号化して保存する" },
              { en: "Creating a vault file from scratch without a plaintext intermediate file", np: "Plaintext intermediate file बिना scratch बाट vault file create गर्न", jp: "プレーンテキストの中間ファイルなしにゼロから vault ファイルを作成する" },
              { en: "`ansible-vault create vars/vault.yml`", np: "`ansible-vault create vars/vault.yml`", jp: "`ansible-vault create vars/vault.yml`" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Production secret patterns & CI/CD integration",
        np: "Production secret pattern र CI/CD integration",
        jp: "本番のシークレットパターンと CI/CD 統合",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Full Vault workflow — encrypt, encrypt_string, vault IDs, no_log, CI/CD integration, .gitignore & AWS SSM lookup",
            np: "पूर्ण Vault workflow — encrypt, encrypt_string, vault ID, no_log, CI/CD integration, .gitignore र AWS SSM lookup",
            jp: "完全な Vault ワークフロー — encrypt・encrypt_string・vault ID・no_log・CI/CD 統合・.gitignore・AWS SSM ルックアップ",
          },
          code: `# ── 1. Create and encrypt a vault file ───────────────────────────
# First, write your secrets in plaintext
cat vars/vault.yml
#   vault_db_password: "s3cr3tP@ss"
#   vault_api_key: "sk-abc123xyz"
#   vault_tls_private_key: |
#     -----BEGIN PRIVATE KEY-----
#     MIIEvQIBADANBgkqhki...

# Encrypt the file in-place
ansible-vault encrypt vars/vault.yml
# New Vault password:
# Confirm New Vault password:
# Encryption successful

# ── 2. The vault_ variable naming convention ──────────────────────
# vars/vault.yml  (ENCRYPTED — safe to commit)
#   vault_db_password: !vault |
#     $ANSIBLE_VAULT;1.1;AES256
#     61616161...

# vars/main.yml   (PLAINTEXT — references vault vars)
---
db_password: "{{ vault_db_password }}"
api_key: "{{ vault_api_key }}"

# ── 3. Use vault variables in a playbook ──────────────────────────
# site.yml
---
- name: Deploy application with secrets
  hosts: appservers
  become: yes
  vars_files:
    - vars/main.yml     # loads db_password (references vault var)
    - vars/vault.yml    # loads vault_db_password (encrypted)

  tasks:
    - name: Configure database connection
      template:
        src: templates/database.conf.j2
        dest: /etc/myapp/database.conf
        mode: '0600'
      no_log: true        # suppress output — db_password would appear otherwise

    - name: Create database user
      community.general.mysql_user:
        name: myapp
        password: "{{ db_password }}"
        priv: "myapp.*:ALL"
      no_log: true        # never log task output containing passwords

# ── 4. encrypt_string — embed a secret inline ─────────────────────
ansible-vault encrypt_string 's3cr3tP@ss' --name db_password
# Output to paste directly into a playbook or vars file:
# db_password: !vault |
#   $ANSIBLE_VAULT;1.1;AES256
#   39613937316662...

# ── 5. Password file pattern — avoid --ask-vault-pass ─────────────
# .vault_pass (PLAINTEXT — must be in .gitignore!)
echo "my_vault_master_password" > .vault_pass
chmod 600 .vault_pass

# ansible.cfg — automatically use the password file
cat ansible.cfg
# [defaults]
# vault_password_file = .vault_pass

# Now all vault operations work without --ask-vault-pass:
ansible-playbook site.yml            # no password prompt
ansible-vault view vars/vault.yml    # no password prompt

# .gitignore — CRITICAL: never commit the password file
echo ".vault_pass" >> .gitignore
git add .gitignore

# ── 6. Vault IDs — separate passwords per environment ─────────────
# Encrypt dev secrets with dev password
ansible-vault encrypt --vault-id dev@prompt vars/vault_dev.yml

# Encrypt prod secrets with prod password (from a file)
ansible-vault encrypt --vault-id prod@~/.vault_prod_pass vars/vault_prod.yml

# Run with both vault IDs — Ansible picks the right key automatically
ansible-playbook site.yml \
  --vault-id dev@prompt \
  --vault-id prod@~/.vault_prod_pass

# ── 7. Rekey — rotate the vault password safely ───────────────────
# Change the password on ALL vault files in the project
ansible-vault rekey vars/vault.yml vars/vault_prod.yml
# Vault password:          (enter old password)
# New Vault password:      (enter new password)
# Confirm New Vault password:

# ── 8. CI/CD integration (GitHub Actions) ────────────────────────
# .github/workflows/deploy.yml
# env:
#   ANSIBLE_VAULT_PASSWORD: $\{{ secrets.VAULT_PASSWORD }}
# steps:
#   - name: Write vault password file
#     run: |
#       echo "$ANSIBLE_VAULT_PASSWORD" > /tmp/.vault_pass
#       chmod 600 /tmp/.vault_pass
#   - name: Run playbook
#     run: |
#       ANSIBLE_VAULT_PASSWORD_FILE=/tmp/.vault_pass \
#       ansible-playbook -i inventory/prod site.yml
#   - name: Cleanup vault password
#     if: always()
#     run: rm -f /tmp/.vault_pass

# ── 9. External secret lookup (AWS SSM Parameter Store) ───────────
# In a task or vars file — no vault file needed at all
# vars/main.yml
#   db_password: "{{ lookup('aws_ssm', '/myapp/db_password',
#                           region='us-east-1') }}"
#   api_key:     "{{ lookup('aws_ssm', '/myapp/api_key',
#                           decrypt=True, region='us-east-1') }}"

# ── 10. Run the playbook ──────────────────────────────────────────
ansible-playbook -i inventory/prod site.yml  # password file set in ansible.cfg
ansible-playbook -i inventory/prod site.yml --ask-vault-pass  # interactive`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a `vars/vault.yml` containing `vault_db_password: \"MyS3cretP@ss\"` and `vault_api_key: \"sk-test-abc123\"`. Encrypt the file with `ansible-vault encrypt vars/vault.yml`. Create a parallel `vars/main.yml` that references both vault variables using the `vault_` convention: `db_password: \"{{ vault_db_password }}\"` and `api_key: \"{{ vault_api_key }}\"`. Write a playbook that loads both files with `vars_files:` and uses the `debug` module with `no_log: true` to print `db_password`. Run the playbook and confirm it decrypts automatically from the vault file. Then run with `-v` and observe that the task output is suppressed because of `no_log: true`. Finally, view the vault file with `ansible-vault view vars/vault.yml` to confirm the plaintext is still intact inside.",
              np: "`vault_db_password: \"MyS3cretP@ss\"` र `vault_api_key: \"sk-test-abc123\"` भएको `vars/vault.yml` create गर्नुहोस्। `ansible-vault encrypt vars/vault.yml` सँग file encrypt गर्नुहोस्। `vault_` convention प्रयोग गरेर दुवै vault variable reference गर्ने parallel `vars/main.yml` create गर्नुहोस्: `db_password: \"{{ vault_db_password }}\"` र `api_key: \"{{ vault_api_key }}\"` । दुवै file `vars_files:` सँग load गर्ने र `db_password` print गर्न `no_log: true` सहित `debug` module प्रयोग गर्ने playbook लेख्नुहोस्। Playbook run गर्नुहोस् र vault file बाट automatically decrypt गर्छ confirm गर्नुहोस्। त्यसपछि `-v` सँग run गर्नुहोस् र `no_log: true` को कारण task output suppress भएको observe गर्नुहोस्। अन्तमा, vault file भित्र plaintext अझै intact छ confirm गर्न `ansible-vault view vars/vault.yml` सँग vault file view गर्नुहोस्।",
              jp: "`vault_db_password: \"MyS3cretP@ss\"` と `vault_api_key: \"sk-test-abc123\"` を含む `vars/vault.yml` を作成する。`ansible-vault encrypt vars/vault.yml` でファイルを暗号化する。`vault_` 規則を使って両方の vault 変数を参照する並行の `vars/main.yml` を作成する：`db_password: \"{{ vault_db_password }}\"` と `api_key: \"{{ vault_api_key }}\"`。`vars_files:` で両ファイルを読み込み、`no_log: true` を付けた `debug` モジュールで `db_password` を出力するプレイブックを書く。プレイブックを実行して vault ファイルから自動的に復号化されることを確認する。次に `-v` で実行して `no_log: true` のためにタスク出力が抑制されることを観察する。最後に `ansible-vault view vars/vault.yml` で vault ファイルを表示してプレーンテキストが内部に保持されていることを確認する。",
            },
            {
              en: "Set up the password file pattern for a project. Create `.vault_pass` with your vault password and immediately add it to `.gitignore`. Configure `ansible.cfg` with `vault_password_file = .vault_pass`. Verify that you can run `ansible-vault view vars/vault.yml` without any password prompt (the password file is read automatically). Then practice `ansible-vault rekey vars/vault.yml` to change the password — observe that it asks for both the old and new passwords. Update `.vault_pass` with the new password and confirm all vault operations still work without prompting. This exercise builds the muscle memory for the most important operational habit: never leave the vault password in your shell history or commit it to the repository.",
              np: "Project को लागि password file pattern setup गर्नुहोस्। तपाईंको vault password सँग `.vault_pass` create गर्नुहोस् र तुरुन्त `.gitignore` मा add गर्नुहोस्। `vault_password_file = .vault_pass` सँग `ansible.cfg` configure गर्नुहोस्। `ansible-vault view vars/vault.yml` कुनै password prompt बिना run गर्न सक्नुहुन्छ verify गर्नुहोस् (password file automatically read हुन्छ)। त्यसपछि password change गर्न `ansible-vault rekey vars/vault.yml` practice गर्नुहोस् — यसले old र new password दुवै माग्छ observe गर्नुहोस्। `.vault_pass` लाई नयाँ password सँग update गर्नुहोस् र सबै vault operation prompt बिना अझै काम गर्छ confirm गर्नुहोस्। यो exercise ले सबैभन्दा महत्त्वपूर्ण operational habit को लागि muscle memory build गर्छ: vault password कहिल्यै shell history मा नछोड्नुहोस् वा repository मा commit नगर्नुहोस्।",
              jp: "プロジェクトのパスワードファイルパターンをセットアップする。vault パスワードで `.vault_pass` を作成してすぐに `.gitignore` に追加する。`vault_password_file = .vault_pass` で `ansible.cfg` を設定する。パスワードプロンプトなしに `ansible-vault view vars/vault.yml` を実行できることを確認する（パスワードファイルが自動的に読み込まれる）。次に `ansible-vault rekey vars/vault.yml` でパスワードを変更する練習をする — 古いパスワードと新しいパスワードの両方を求めることを観察する。`.vault_pass` を新しいパスワードで更新し、すべての vault 操作がプロンプトなしに動作することを確認する。この練習は最も重要な運用上の習慣のための筋肉記憶を構築します：vault パスワードをシェル履歴に残したりリポジトリにコミットしたりしない。",
            },
            {
              en: "Use `ansible-vault encrypt_string` to embed an individual secret directly in a playbook without a separate vault file. Run `ansible-vault encrypt_string 'supersecrettoken' --name github_token` and copy the output `!vault |` block into a `vars:` section of a playbook. Then add a task that registers the `github_token` variable in a file write operation using the `copy` module with `content: \"{{ github_token }}\"` and `dest: /tmp/token_test.txt`, also with `no_log: true`. Run the playbook and verify the file is created with the decrypted value. Confirm with `ansible all -m command -a \"cat /tmp/token_test.txt\"`. Then clean up with `ansible all -m file -a \"path=/tmp/token_test.txt state=absent\"`. This demonstrates the inline vault pattern used when you only have one or two secrets and don't want a separate vault file.",
              np: "`ansible-vault encrypt_string` प्रयोग गरेर छुट्टै vault file बिना directly playbook मा individual secret embed गर्नुहोस्। `ansible-vault encrypt_string 'supersecrettoken' --name github_token` run गर्नुहोस् र output `!vault |` block लाई playbook को `vars:` section मा copy गर्नुहोस्। त्यसपछि `content: \"{{ github_token }}\"` र `dest: /tmp/token_test.txt` सहित `copy` module प्रयोग गरेर `github_token` variable लाई file write operation मा register गर्ने task add गर्नुहोस्, `no_log: true` सहित पनि। Playbook run गर्नुहोस् र file decrypted value सँग create भएको verify गर्नुहोस्। `ansible all -m command -a \"cat /tmp/token_test.txt\"` सँग confirm गर्नुहोस्। त्यसपछि `ansible all -m file -a \"path=/tmp/token_test.txt state=absent\"` सँग cleanup गर्नुहोस्। यसले inline vault pattern demonstrate गर्छ जुन एक वा दुईवटा secret मात्र छ र छुट्टै vault file चाहिँदैन भन्दा प्रयोग गरिन्छ।",
              jp: "`ansible-vault encrypt_string` を使って、別の vault ファイルなしにプレイブックに直接個々のシークレットを埋め込む。`ansible-vault encrypt_string 'supersecrettoken' --name github_token` を実行し、出力の `!vault |` ブロックをプレイブックの `vars:` セクションにコピーする。次に `content: \"{{ github_token }}\"` と `dest: /tmp/token_test.txt` を付けた `copy` モジュールで `github_token` 変数をファイル書き込み操作に登録するタスクを追加する（`no_log: true` も付ける）。プレイブックを実行してファイルが復号化された値で作成されることを確認する。`ansible all -m command -a \"cat /tmp/token_test.txt\"` で確認する。その後 `ansible all -m file -a \"path=/tmp/token_test.txt state=absent\"` でクリーンアップする。これはシークレットが 1 つか 2 つで別の vault ファイルを必要としない場合に使用されるインライン vault パターンを示します。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do you rotate an Ansible Vault password without re-encrypting all files manually?",
        np: "सबै file manually re-encrypt नगरी Ansible Vault password कसरी rotate गर्ने?",
        jp: "すべてのファイルを手動で再暗号化せずに Ansible Vault パスワードをローテーションする方法は？",
      },
      answer: {
        en: "The `ansible-vault rekey` command was designed specifically for this situation — it changes the encryption password on one or more vault files atomically, without ever writing the plaintext to disk. The internal process is: Ansible decrypts the file in memory using the old password, then immediately re-encrypts the in-memory plaintext using the new password, and writes the newly encrypted ciphertext back to the file. The plaintext never exists as a file on disk at any point. To rekey a single file: `ansible-vault rekey vars/vault.yml` — Ansible will prompt for the current password and then the new password twice. To rekey multiple files at once: `ansible-vault rekey vars/vault.yml vars/vault_prod.yml group_vars/all/vault.yml` — you can pass as many file paths as you need. For large projects with vault files scattered across many directories, use `find` to collect all vault files: `find . -name 'vault*.yml' -exec ansible-vault rekey {} +`. After rekeying, update your `.vault_pass` file (or CI secret variable) with the new password. The critical operational rule is: rotate vault passwords on a schedule (quarterly is common) and immediately after any security event — a departing team member who had the password, a compromised CI system, a credential accidentally logged. Do NOT try to rotate by decrypting files manually, committing the plaintext temporarily to check your work, then re-encrypting — this leaves the secret in your git history permanently. The `rekey` command leaves no trace of the old encryption and no plaintext in history.",
        np: "`ansible-vault rekey` command specifically यो situation को लागि design गरिएको हो — यसले plaintext कहिल्यै disk मा नलेखी, एक वा बढी vault file मा encryption password atomically change गर्छ। Internal process: Ansible ले old password प्रयोग गरेर file memory मा decrypt गर्छ, त्यसपछि तुरुन्त new password प्रयोग गरेर in-memory plaintext re-encrypt गर्छ, र नयाँ encrypted ciphertext लाई file मा back लेख्छ। Plaintext कुनै पनि point मा disk मा file को रूपमा कहिल्यै exist गर्दैन। Single file rekey गर्न: `ansible-vault rekey vars/vault.yml` — Ansible ले current password र त्यसपछि नयाँ password दुईपटक माग्नेछ। एकैसाथ multiple file rekey गर्न: `ansible-vault rekey vars/vault.yml vars/vault_prod.yml group_vars/all/vault.yml` — जति file path चाहिन्छ pass गर्न सकिन्छ। धेरै directory मा scattered vault file भएका ठूलो project को लागि, सबै vault file collect गर्न `find` प्रयोग गर्नुहोस्: `find . -name 'vault*.yml' -exec ansible-vault rekey {} +`। Rekeying पछि, नयाँ password सँग `.vault_pass` file (वा CI secret variable) update गर्नुहोस्। Critical operational rule: schedule मा (quarterly common छ) र जुनसुकै security event पछि — password थाहा भएको departing team member, compromised CI system, accidentally logged credential — vault password rotate गर्नुहोस्। File manually decrypt गरेर, काम check गर्न temporarily plaintext commit गरेर, त्यसपछि re-encrypt गरेर rotate गर्न कोसिस नगर्नुहोस् — यसले secret लाई permanently git history मा छोड्छ। `rekey` command ले old encryption को कुनै trace र history मा plaintext छोड्दैन।",
        jp: "`ansible-vault rekey` コマンドはまさにこの状況のために設計されています — プレーンテキストをディスクに書き込まずに、1 つ以上の vault ファイルの暗号化パスワードをアトミックに変更します。内部プロセス：Ansible は古いパスワードを使用してファイルをメモリ内で復号化し、すぐに新しいパスワードを使用してメモリ内のプレーンテキストを再暗号化し、新しく暗号化された暗号文をファイルに書き戻します。プレーンテキストはいかなる時点でもディスク上のファイルとして存在しません。単一ファイルのリキー：`ansible-vault rekey vars/vault.yml` — Ansible は現在のパスワードと新しいパスワードを 2 回求めます。複数ファイルを一度にリキー：`ansible-vault rekey vars/vault.yml vars/vault_prod.yml group_vars/all/vault.yml` — 必要なだけファイルパスを渡せます。多くのディレクトリに分散した vault ファイルを持つ大規模プロジェクトには、`find` ですべての vault ファイルを収集します：`find . -name 'vault*.yml' -exec ansible-vault rekey {} +`。リキー後、新しいパスワードで `.vault_pass` ファイル（または CI シークレット変数）を更新します。重要な運用ルール：定期的に（四半期ごとが一般的）、そして任意のセキュリティイベント（パスワードを知っていた退職するチームメンバー・侵害された CI システム・誤ってログに記録された認証情報）の直後に vault パスワードをローテーションする。ファイルを手動で復号化し、作業確認のために一時的にプレーンテキストをコミットし、再暗号化してローテーションしようとしないこと — これはシークレットを永久に git の履歴に残します。`rekey` コマンドは古い暗号化の痕跡も履歴のプレーンテキストも残しません。",
      },
      tag: {
        en: "vault password rotation",
        np: "vault password rotation",
        jp: "vault パスワードのローテーション",
      },
    },
    {
      question: {
        en: "What is the `vault_` variable naming convention and why is it recommended?",
        np: "`vault_` variable naming convention के हो र यो किन recommended छ?",
        jp: "`vault_` 変数命名規則とは何か、なぜ推奨されるのか？",
      },
      answer: {
        en: "The `vault_` variable naming convention is a community-established pattern for structuring Ansible secrets that provides both security and readability. The convention works as follows: you maintain two separate variable files for each group or host. The first file, `vars/main.yml` (unencrypted, committed to Git), contains regular variable names that your playbook tasks actually use — `db_password`, `api_key`, `smtp_password`. These variables are assigned the VALUES from the vault file: `db_password: \"{{ vault_db_password }}\"`. The second file, `vars/vault.yml` (Vault-encrypted, committed to Git), contains the `vault_`-prefixed counterparts with the actual secret values: `vault_db_password: \"realS3cr3t\"`, `vault_api_key: \"sk-real-key-xyz\"`. There are four important reasons this pattern is recommended. **(1) Readability**: your unencrypted `vars/main.yml` serves as a manifest of all the variables in use — another developer reading the playbook can see exactly what variables exist and what they configure, without needing the vault password. This is impossible if all your variables are inside the encrypted file. **(2) Diffing**: because `vars/main.yml` is plaintext, you can `git diff` it to see if any variable names were added, removed, or renamed — even though the values are in the encrypted file. **(3) Template safety**: your task templates and Jinja2 files always reference `{{ db_password }}`, not `{{ vault_db_password }}`. If you ever switch from Vault to an external secret manager (e.g., AWS SSM), you change the assignment in `vars/main.yml` (`db_password: \"{{ lookup('aws_ssm', '/myapp/db') }}\"`) without touching any templates. **(4) Error isolation**: if a vault file fails to decrypt (wrong password, missing file), you get a clear error at variable loading time, not a cryptic `undefined variable` error deep in a template. The naming convention makes it immediately obvious which variables are sensitive, making code reviews easier and reducing the chance of accidentally logging or printing a secret.",
        np: "`vault_` variable naming convention Ansible secret structure गर्ने एउटा community-established pattern हो जसले security र readability दुवै provide गर्छ। Convention यसरी काम गर्छ: तपाईंले हरेक group वा host को लागि दुईवटा छुट्टा variable file maintain गर्नुहुन्छ। पहिलो file, `vars/main.yml` (unencrypted, Git मा committed), मा तपाईंको playbook task ले actually प्रयोग गर्ने regular variable name छ — `db_password`, `api_key`, `smtp_password`। यी variable लाई vault file बाट VALUE assign गरिन्छ: `db_password: \"{{ vault_db_password }}\"`। दोस्रो file, `vars/vault.yml` (Vault-encrypted, Git मा committed), मा actual secret value सहित `vault_` prefixed counterpart छ: `vault_db_password: \"realS3cr3t\"`, `vault_api_key: \"sk-real-key-xyz\"`। यो pattern recommended हुनका चारवटा महत्त्वपूर्ण कारण छन्। **(1) Readability**: तपाईंको unencrypted `vars/main.yml` ले use मा रहेका सबै variable को manifest को काम गर्छ — playbook पढ्ने अर्को developer ले vault password बिना पनि ठ्याक्कै कुन variable exist गर्छ र के configure गर्छ हेर्न सक्छ। यो सबै variable encrypted file भित्र छन् भने असम्भव छ। **(2) Diffing**: `vars/main.yml` plaintext भएको हुनाले, encrypted file मा value भए पनि कुनै variable name add, remove, वा rename गरियो हेर्न `git diff` गर्न सकिन्छ। **(3) Template safety**: तपाईंको task template र Jinja2 file ले हमेशा `{{ db_password }}` reference गर्छ, `{{ vault_db_password }}` होइन। Vault बाट external secret manager (जस्तै AWS SSM) मा switch गर्नुभयो भने, `vars/main.yml` मा assignment change गर्नुहुन्छ (`db_password: \"{{ lookup('aws_ssm', '/myapp/db') }}\"`) कुनै template नछोइकन। **(4) Error isolation**: vault file decrypt गर्न fail भयो भने (गलत password, missing file), template मा deep cryptic `undefined variable` error होइन, variable loading time मा clear error आउँछ। Naming convention ले कुन variable sensitive छ भनी immediately obvious बनाउँछ, code review सजिलो र secret accidentally log वा print हुने chance कम गर्छ।",
        jp: "`vault_` 変数命名規則は、セキュリティと可読性の両方を提供する Ansible シークレット構造化のコミュニティ確立パターンです。規則は次のように機能します：各グループまたはホストに対して 2 つの別々の変数ファイルを維持します。最初のファイル `vars/main.yml`（未暗号化・Git にコミット済み）には、プレイブックのタスクが実際に使用する通常の変数名が含まれます — `db_password`・`api_key`・`smtp_password`。これらの変数には vault ファイルからの値が代入されます：`db_password: \"{{ vault_db_password }}\"`。2 番目のファイル `vars/vault.yml`（Vault 暗号化・Git にコミット済み）には、実際のシークレット値を持つ `vault_` プレフィックス付きの対応物が含まれます：`vault_db_password: \"realS3cr3t\"`・`vault_api_key: \"sk-real-key-xyz\"`。このパターンが推奨される 4 つの重要な理由があります。**(1) 可読性**：未暗号化の `vars/main.yml` は使用中のすべての変数のマニフェストとして機能します — プレイブックを読む別の開発者は vault パスワードなしにどの変数が存在し何を設定するかを正確に確認できます。すべての変数が暗号化ファイルの中にある場合これは不可能です。**(2) 差分比較**：`vars/main.yml` がプレーンテキストなので、値が暗号化ファイルにあっても `git diff` で変数名が追加・削除・名前変更されたかを確認できます。**(3) テンプレートの安全性**：タスクテンプレートと Jinja2 ファイルは常に `{{ db_password }}` を参照し、`{{ vault_db_password }}` ではありません。Vault から外部シークレットマネージャー（例：AWS SSM）に切り替える場合、テンプレートを触らずに `vars/main.yml` の代入を変更します（`db_password: \"{{ lookup('aws_ssm', '/myapp/db') }}\"`）。**(4) エラーの分離**：vault ファイルの復号化が失敗した場合（間違ったパスワード・ファイルなし）、テンプレートの奥深くで不可解な `undefined variable` エラーではなく、変数読み込み時に明確なエラーが発生します。命名規則によりどの変数が機密であるかが即座に明らかになり、コードレビューが容易になり、シークレットが誤ってログに記録・出力される可能性が減ります。",
      },
      tag: {
        en: "vault naming convention",
        np: "vault naming convention",
        jp: "vault 命名規則",
      },
    },
  ],
};
