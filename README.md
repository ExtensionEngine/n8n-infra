# n8n IaC

Infrastructure as code for Studion's self-hosted n8n, built with [infra-code-blocks](https://github.com/ExtensionEngine/infra-code-blocks).

## Requierments

- Pulumi account
- Set of AWS credentials with privilege to manage target resources

## Usage

- Checkout the code

```
git clone git@github.com:ExtensionEngine/n8n-infra.git
```

- Install dependencies

```
pnpm i
```

- Install Pulumi

```
# macOS
brew install pulumi/tap/pulumi

# Linux
curl -fsSL https://get.pulumi.com | sh

```

- Log in to Pulumi account, see https://www.pulumi.com/docs/iac/concepts/state-and-backends/
- Install AWS CLI

```
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

- Set up AWS CLI, see https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
- Set up n8n environment using AWS Parameter Store on the target AWS Account by:
    - Defining plain parameters:
        * `N8N_LOG_LEVEL` - one of `debug`, `info`, `warn`, `error`
        * `N8N_SMTP_HOST` - SMTP server name
        * `N8N_SMTP_PORT` - use STARTTLS port, e.g. 587, since SSL for SMTP is disabled
        * `N8N_SMTP_USER` - SMTP username
        * `N8N_SMTP_SENDER` - sender email address, e.g. info@dev.n8n.gostudion.com
        * `N8N_EDITOR_BASE_URL` - URL to access the instance, e.g. https://dev.n8n.gostudion.com/
        * `WEBHOOK_URL` - URL for webhooks with external services, e.g. https://dev.n8n.gostudion.com/
    - Defining secret parameter:
        * `N8N_SMTP_PASS` - SMTP password
- Deploy stack

```
pulumi up

# Optionally provide `AWS_PROFILE` env if you want to use non-default AWS profile
AWS_PROFILE=n8n.dev pulumi up
```
