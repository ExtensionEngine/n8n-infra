import * as pulumi from '@pulumi/pulumi';
import * as icb from '@studion/infra-code-blocks';

import Environment from './config/Environment';
import Secrets from './config/Secrets';

type Size = 'small' | 'medium' | 'large';

const config = new pulumi.Config('n8n');
const hostedZoneId = config.require('hostedZoneId');
const port = config.require('port');
const domain = config.require('domain');
const pgVersion = config.require('pgVersion');
const dockerImage = config.require('dockerImage');
const serverSize = config.require('serverSize') as Size;
const serverCount = config.require('serverCount');
const envPath = config.require('envPath');
const secretsPath = config.require('secretsPath');

const env = new Environment(envPath);
const secrets = new Secrets(secretsPath);

const stack = pulumi.getStack();
const dbServiceName = `n8n-${stack}-db`;

const infra = new icb.Project(`n8n-${stack}`, {
	services: [
		{
			type: 'DATABASE',
			serviceName:  dbServiceName,
			engineVersion: pgVersion,
			allowMajorVersionUpgrade: true,
			dbName: `${stack}db`,
			username: `${stack}master`,
		},
		{
			type: 'WEB_SERVER',
			serviceName: `n8n-${stack}-server`,
			port: +port,
			image: dockerImage,
      size: serverSize,
      desiredCount: +serverCount,
      domain,
      hostedZoneId,
      healthCheckPath: '/healthz',
      persistentStorageConfig: {
      	volumes: [
      		{
      			name: `${stack}-user-dir-volume`, 
      		},
      	],
	      mountPoints: [
	      	{
	        	sourceVolume: `${stack}-user-dir-volume`,
	        	containerPath:  '/home/node/.n8n',
	      	},
	      ],
      },
      environment: env.get({ dbServiceName, port }),
      secrets: secrets.get({ dbServiceName }),
		},
	],
});

export default infra.name;