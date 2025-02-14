# n8n IaC

Infrastructure as code for Studion's self-hosted n8n powered by infra-code-blocks.

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
- Deploy stack
```
pulumi up

# Optionally provide `AWS_PROFILE` env if you want to use non-default AWS profile
AWS_PROFILE=n8n.dev pulumi up
```
