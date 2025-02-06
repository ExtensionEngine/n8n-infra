import { ecs, ssm } from '@pulumi/aws';
import { Output } from '@pulumi/pulumi';
import { Database, Services } from '@studion/infra-code-blocks';

type Args = {
  dbServiceName: string;
};

type Callback = (db: Services) => ecs.Secret[];

class Secrets {
  readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  private getSecureParam(name: string): [string, Output<string>] {
    return [
      name,
      ssm.getParameterOutput({
        name: `${this.path}${name}`,
        withDecryption: false,
      })
        .apply(({ arn }) => arn),
    ];
  }

  get(args: Args): Callback {
    return (services: Services) => {
      const db = services[args.dbServiceName] as Database;
      const secrets = new Map<string, string | Output<string>>();

      secrets.set('DB_POSTGRESDB_PASSWORD', db.password.secret.arn);
      secrets.set(...this.getSecureParam('N8N_SMTP_PASS'));

      return Array.from(secrets, ([name, valueFrom]) => ({ name, valueFrom }));
    };
  }
}

export default Secrets;