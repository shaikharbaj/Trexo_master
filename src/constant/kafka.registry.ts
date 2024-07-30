import { Transport } from '@nestjs/microservices';

//Setting up transport
const myTransport: Transport = Transport.KAFKA;

export const SELF_REGISTRY_KAFKA = {
  transport: myTransport,
  options: {
    client: {
      clientId: 'master', // master-server
      brokers: [process.env.MASTER_MICROSERVICE_BROKER],
    },
    consumer: {
      groupId: 'master-consumer-main',
      maxBytes: 1024 * 1024 * 10, //10 MB
    },
  },
};
