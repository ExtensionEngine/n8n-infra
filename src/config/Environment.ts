import { ecs, ssm } from '@pulumi/aws';
import { Output } from '@pulumi/pulumi';
import { Database, Services }from '@studion/infra-code-blocks';

type Args = {
  dbServiceName: string;
  port: string;
};

type Callback = (services: Services) => ecs.KeyValuePair[];

class Environment {
  readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  private getPlainParam(name: string): [string, Output<string>] {
    return [
      name,
      ssm.getParameterOutput({ 
        name: `${this.path}${name}`,
      })
        .apply(({ value }) => value),
    ];
  }

  get(args: Args): Callback {
    return (services: Services) => {
      const db = services[args.dbServiceName] as Database;
      const env = new Map<string, string | Output<string>>();

      env.set('DB_TYPE', 'postgresdb');
      env.set('DB_POSTGRESDB_DATABASE', db.instance.dbName);
      env.set('DB_POSTGRESDB_HOST', db.instance.address);
      env.set('DB_POSTGRESDB_USER', db.instance.username);
      env.set('DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED', 'false',);
      env.set('NODE_ENV', 'production',);
      env.set('N8N_PORT', args.port,);
      env.set(...this.getPlainParam('N8N_LOG_LEVEL'));
      env.set('N8N_EMAIL_MODE', 'smtp');
      env.set('N8N_SMTP_SSL', 'false');
      env.set(...this.getPlainParam('N8N_SMTP_HOST'));
      env.set(...this.getPlainParam('N8N_SMTP_PORT'));
      env.set(...this.getPlainParam('N8N_SMTP_USER'));
      env.set(...this.getPlainParam('N8N_SMTP_SENDER'));
      env.set(...this.getPlainParam('N8N_EDITOR_BASE_URL'));
      env.set(...this.getPlainParam('WEBHOOK_URL'));
      env.set('N8N_DEFAULT_BINARY_DATA_MODE', 'filesystem');
      env.set('N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS', 'false');

      return Array.from(env, ([name, value]) => ({ name, value }));
    };
  }
}

export default Environment;