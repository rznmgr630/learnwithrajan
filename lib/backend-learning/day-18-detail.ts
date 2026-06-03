import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_18_DETAIL = {
  overview: [
    "Infrastructure as Code means defining your servers, networks, and databases in configuration files rather than clicking through a cloud console. You check those files into git, review them in PRs, and let a tool like Terraform calculate what needs to change and apply only those changes automatically.",
    "Today covers why IaC matters, Terraform's core building blocks (providers, resources, state, modules), how to manage separate dev/staging/production environments, and the operational practices around state locking and secret management that make the difference between a prototype and production-ready infrastructure.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        {
          type: "youtube",
          videoId: "wMuRGH0a-BU",
          title: "Introduction to Terraform and Infrastructure as Code",
        },
      ],
    },
    {
      title: "Why IaC — the problems it solves",
      blocks: [
        {
          type: "paragraph",
          text: "Without IaC, infrastructure is created by hand — through a console or one-off scripts. Two engineers following the same steps end up with different results. Servers get patched in production but not staging. Nobody can say who changed a security rule or when. IaC fixes all of this: every change goes through version control, code review, and an automated apply step.",
        },
        {
          type: "table",
          caption: "IaC is not just automation — it makes infrastructure auditable and reproducible.",
          headers: ["Concern", "Manual approach", "IaC approach"],
          rows: [
            [
              "Reproducibility",
              "Runbooks drift; each environment diverges over time",
              "Identical config applied to dev, staging, and prod via the same code path",
            ],
            [
              "Configuration drift",
              "Manual console changes leave no trail; state diverges silently",
              "terraform plan detects drift; CI alerts when actual state diverges from code",
            ],
            [
              "Auditability",
              "No audit log of who changed what resource or why",
              "Every change is a git commit with author, timestamp, PR, and code review",
            ],
            [
              "Speed",
              "Hours of console clicks; error-prone under pressure",
              "terraform apply provisions a complete environment in minutes",
            ],
            [
              "Rollback",
              "Manual reversal; often impossible without full recreation",
              "Revert the git commit and re-apply — Terraform computes the diff to previous state",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Terraform is the most widely used IaC tool — declarative HCL syntax, 3000+ providers, and a large community. Pulumi lets you write infrastructure in TypeScript, Python, or Go, which some teams prefer, but has a smaller ecosystem. AWS CDK is similar to Pulumi but AWS-only and generates CloudFormation under the hood. Ansible is procedural rather than declarative — it is better for configuring OS-level things (installing packages, setting up users) than for provisioning cloud resources.",
        },
      ],
    },
    {
      title: "Terraform core concepts",
      blocks: [
        {
          type: "diagram",
          id: "devops-terraform-workflow",
        },
        {
          type: "table",
          caption: "Learn these seven terms and you can read any Terraform codebase.",
          headers: ["Concept", "One-line definition"],
          rows: [
            [
              "Provider",
              "Plugin that knows how to talk to a cloud API (aws, google, azurerm, kubernetes, github, ...)",
            ],
            [
              "Resource",
              "A single managed infrastructure object — an EC2 instance, S3 bucket, RDS cluster, IAM role",
            ],
            [
              "Data source",
              "Read-only lookup of existing infrastructure not managed by this Terraform config — e.g. fetch the latest AMI ID",
            ],
            [
              "Variable",
              "A typed input parameter for the config; values supplied via tfvars files, environment variables, or CLI flags",
            ],
            [
              "Output",
              "A value exported after apply — e.g. the EC2 public IP — readable by other modules or CI scripts",
            ],
            [
              "Module",
              "A reusable, parameterized group of resources published to the Terraform Registry or defined locally",
            ],
            [
              "State",
              "A JSON file (terraform.tfstate) that maps your config to real cloud resource IDs; the source of truth for plan and destroy",
            ],
          ],
        },
        {
          type: "code",
          title: "main.tf — provision an AWS EC2 instance with variables",
          code: `terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ---------- Variables ----------

variable "aws_region" {
  type        = string
  description = "AWS region to deploy into"
  default     = "us-east-1"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "environment" {
  type        = string
  description = "Deployment environment (dev | staging | prod)"
}

# ---------- Data source — fetch the latest Amazon Linux 2023 AMI ----------

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# ---------- Resource ----------

resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type

  tags = {
    Name        = "app-server-\${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ---------- Outputs ----------

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app.id
}

output "public_ip" {
  description = "Public IP address of the app server"
  value       = aws_instance.app.public_ip
}`,
        },
      ],
    },
    {
      title: "Managing multiple environments",
      blocks: [
        {
          type: "paragraph",
          text: "Most projects need at least three environments: dev for fast iteration with cheap resources, staging that mirrors production closely for QA and load testing, and prod — the real thing. Terraform gives you two ways to manage them: workspaces (one codebase, separate state per workspace) or a separate directory per environment (completely separate state and configuration). Both work — but for teams with more than a couple of engineers, the directory approach is safer and more explicit.",
        },
        {
          type: "table",
          caption: "For most teams with more than two engineers, directory-per-environment is safer and more explicit.",
          headers: ["Approach", "Isolation", "State management", "Complexity", "Best for"],
          rows: [
            [
              "Workspaces",
              "Logical — same backend, different state key per workspace",
              "terraform workspace new staging; state stored at key staging/terraform.tfstate",
              "Low — single codebase, single directory",
              "Simple projects; feature flags via workspace name; teams of 1–3",
            ],
            [
              "Directory per environment",
              "Physical — completely separate directories and state backends",
              "Each directory has its own backend block pointing to a separate S3 key",
              "Higher — config duplication (mitigated by shared modules)",
              "Production systems; regulated environments; teams that need blast-radius isolation",
            ],
          ],
        },
        {
          type: "code",
          title: "Directory-per-environment layout with tfvars files",
          code: `# Directory structure
infrastructure/
├── modules/
│   ├── ec2/          # reusable EC2 module
│   └── rds/          # reusable RDS module
├── environments/
│   ├── dev/
│   │   ├── main.tf         # calls modules
│   │   ├── variables.tf
│   │   ├── backend.tf      # S3 backend, separate key
│   │   └── dev.tfvars      # dev-specific values
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── backend.tf
│   │   └── staging.tfvars
│   └── prod/
│       ├── main.tf
│       ├── variables.tf
│       ├── backend.tf
│       └── prod.tfvars

# --- environments/dev/dev.tfvars ---
aws_region    = "us-east-1"
environment   = "dev"
instance_type = "t3.micro"
db_instance   = "db.t3.micro"

# --- environments/prod/prod.tfvars ---
aws_region    = "us-east-1"
environment   = "prod"
instance_type = "m5.large"
db_instance   = "db.r6g.large"

# Apply dev environment
cd infrastructure/environments/dev
terraform init
terraform apply -var-file="dev.tfvars"

# Apply prod environment (separate state, no risk of touching dev)
cd infrastructure/environments/prod
terraform init
terraform apply -var-file="prod.tfvars"`,
        },
      ],
    },
    {
      title: "Terraform workflow & state",
      blocks: [
        {
          type: "paragraph",
          text: "The Terraform workflow is three commands: init downloads providers and sets up the backend; plan shows what would change without actually doing it; apply executes the plan. State is what ties your configuration to real cloud resources — it records which Terraform resource corresponds to which actual EC2 instance, S3 bucket, etc. Without state, Terraform cannot compute a diff. Always store state in a remote backend (S3, Terraform Cloud) with locking enabled — lost or corrupted state is one of the most painful incidents in Terraform.",
        },
        {
          type: "code",
          title: "backend.tf — S3 remote state with DynamoDB locking",
          code: `terraform {
  backend "s3" {
    bucket         = "my-company-terraform-state"
    key            = "prod/app/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true      # encrypt state at rest (AES-256)

    # DynamoDB table for state locking — prevents two engineers from
    # running apply simultaneously and corrupting the state file
    dynamodb_table = "terraform-state-lock"
  }
}

# Create the DynamoDB table once (bootstrap — run manually or via a separate root module):
# aws dynamodb create-table \\
#   --table-name terraform-state-lock \\
#   --attribute-definitions AttributeName=LockID,AttributeType=S \\
#   --key-schema AttributeName=LockID,KeyType=HASH \\
#   --billing-mode PAY_PER_REQUEST

# --- Workflow ---
# terraform init     → download providers, configure S3 backend
# terraform plan     → show what will change; exits 0 if no diff, 2 if changes
# terraform apply    → prompt for confirmation, then execute the plan
# terraform destroy  → tear down all managed resources (destructive — use carefully)

# In CI, use:
# terraform plan -out=tfplan    → save the plan to a file
# terraform apply tfplan        → apply the exact saved plan (no prompt)`,
        },
        {
          type: "table",
          caption: "These pitfalls cause the most production incidents in Terraform-managed infrastructure.",
          headers: ["Pitfall", "What goes wrong", "Prevention"],
          rows: [
            [
              "State drift (manual changes)",
              "An engineer changes a resource in the console; Terraform's next plan wants to revert it, possibly destroying data",
              "Enforce 'no manual changes' policy; run terraform plan in CI on a schedule to detect drift; use AWS Config rules",
            ],
            [
              "No state locking",
              "Two engineers run apply simultaneously; both read the same state and each writes partial changes, corrupting it",
              "Always use a DynamoDB lock table (or Terraform Cloud's built-in locking) before any team usage",
            ],
            [
              "Secrets in state",
              "RDS passwords, API keys written into resource blocks appear in plaintext in terraform.tfstate",
              "Use AWS Secrets Manager or SSM Parameter Store; reference via data source — never hardcode secrets in .tf files",
            ],
            [
              "Forgetting -var-file in CI",
              "terraform apply runs with default variable values, overwriting prod with dev-sized resources",
              "Script CI to always pass -var-file=\${ENVIRONMENT}.tfvars; validate in plan output before apply",
            ],
            [
              "Destroying resources with terraform destroy",
              "A new team member runs destroy in the wrong directory, deleting prod databases",
              "Apply strict IAM permissions in prod; require manual approval in CI for destroy; use lifecycle { prevent_destroy = true } on stateful resources",
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is Terraform state and why does it matter?",
      tag: "State",
      answer: [
        "Terraform state (terraform.tfstate) is a JSON file that maps every resource in your configuration to its real cloud identifier. For example, it records that resource.aws_instance.app is EC2 instance i-0abc123def. Without this mapping, Terraform cannot compute a diff — it would try to create everything from scratch on every apply.",
        "This is why state is critical: lose it, and Terraform thinks nothing exists. Corrupt it, and apply makes unpredictable changes. Always store state in a remote backend (S3, Terraform Cloud, GCS) with encryption enabled, and never commit terraform.tfstate to git — it often contains plaintext secrets.",
      ].join("\n\n"),
      callout: "Lost state does not mean lost infrastructure — you can use terraform import to re-associate resources. But it is painful. Protect state like a production database.",
    },
    {
      question: "What is the difference between terraform plan and terraform apply?",
      tag: "Workflow",
      answer: [
        "terraform plan is read-only. It reads the current state, checks real cloud resource attributes, compares against your configuration, and prints a diff of what would change. It makes no changes to your infrastructure. Run plan as often as you like — in PRs, in CI, before any apply.",
        "terraform apply executes the plan. By default it re-runs the planning phase and asks for confirmation. In CI, use 'terraform plan -out=tfplan' to save the exact plan, then 'terraform apply tfplan' to apply that specific plan — this prevents a race condition where the environment changes between plan and apply.",
      ].join("\n\n"),
    },
    {
      question: "How do you handle secrets in Terraform?",
      tag: "Security",
      answer: [
        "Never hardcode secrets in .tf files or tfvars files — they end up in terraform.tfstate in plaintext regardless. The right approach is to store secrets in AWS Secrets Manager, HashiCorp Vault, or SSM Parameter Store, then reference them via a data source.",
        "For secrets Terraform itself creates (like an RDS password), use the random_password resource and immediately store the result in Secrets Manager. Mark sensitive output values with 'sensitive = true' to keep them out of plan output. Restrict access to the S3 state bucket to only the CI role and senior engineers.",
      ].join("\n\n"),
      callout: "terraform.tfstate contains plaintext resource attributes including passwords. Encrypt it at rest (S3 SSE), restrict access via IAM, and never commit it to version control.",
    },
    {
      question: "What is a Terraform module and when should I write one?",
      tag: "Modules",
      answer: [
        "A module is a directory of .tf files that accepts input variables and exports output values — it is Terraform's unit of reuse. Your top-level configuration is the root module. You call child modules with a module block and a source path (local path, git URL, or Terraform Registry).",
        "Write a module when the same group of resources appears in multiple places — a VPC module used by dev, staging, and prod; an ECS service module called once per microservice. The Terraform Registry has thousands of community modules — prefer a well-maintained registry module over writing from scratch for common infrastructure like VPCs and EKS clusters.",
      ].join("\n\n"),
    },
    {
      question: "What is the difference between Terraform workspaces and directories for environments?",
      tag: "Environments",
      answer: [
        "Workspaces share a single configuration directory but maintain a separate state file per workspace. They are convenient for small, simple projects but dangerous at scale — it is easy to run apply in the wrong workspace and accidentally modify production.",
        "Directory-per-environment gives complete isolation: separate state backends, separate IAM roles in CI, separate tfvars files, and no shared context between environments. The duplication is manageable with shared modules. For any production system with more than one engineer, directory-per-environment is the safer default.",
      ].join("\n\n"),
    },
    {
      question: "How does state locking prevent corruption and how do I set it up?",
      tag: "State locking",
      answer: [
        "When terraform apply starts, it writes a lock entry to the DynamoDB table. Any concurrent apply that reads that lock fails immediately with an error. When apply finishes — success or failure — the lock is released. This prevents two concurrent applies from both reading the same state, making different changes, and then each overwriting the other's state file.",
        "Setup requires one DynamoDB table (PAY_PER_REQUEST billing, LockID as hash key) and a dynamodb_table entry in every backend block. If an apply crashes mid-run, the lock may remain — use 'terraform force-unlock LOCK_ID' after confirming no apply is actually running.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Write a main.tf that provisions an S3 bucket and an EC2 instance using variables for environment and instance type; apply it to a dev workspace and verify the resources appear in the AWS console.",
    "Add an S3 + DynamoDB backend to your config, run terraform init to migrate local state to remote, then simulate concurrent apply by opening two terminals and verify the second is rejected by the lock.",
    "Create a modules/webserver directory, move the EC2 resource into it, and call it from both an environments/dev and environments/staging directory with different instance types via tfvars — confirm both apply independently without touching each other's state.",
  ],
} satisfies RoadmapDayDetail;
