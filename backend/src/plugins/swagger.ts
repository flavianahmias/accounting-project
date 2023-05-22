import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Hubla')
  .setDescription('The Hubla API description')
  .setVersion('1.0')
  .build();
