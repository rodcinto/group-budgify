import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RmqService } from 'common/rmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('transaction'));

  const config = new DocumentBuilder()
    .setTitle('GroupBudgify API Docs')
    .setDescription('This is the API for GroupBudgify!')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
