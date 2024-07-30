import { Transport } from '@nestjs/microservices';

const myTransport: Transport = Transport.TCP;

export const SELF_REGISTRY_TCP = {
  transport: myTransport,
  options: {
    host: '0.0.0.0',
    port: parseInt(process.env.MASTER_MICROSERVICE_PORT),
  },
};
