import { NestFactory } from '@nestjs/core';
import { TransactionsAppModule } from './transactions-app.module';
import { RmqService } from 'common/rmq';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsAppModule);

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('transaction'));

  await app.startAllMicroservices();

  await app.listen(3001);
}
bootstrap();
