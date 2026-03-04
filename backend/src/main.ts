import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir comunicação com o frontend
  app.enableCors({
    origin: [
      'http://localhost:5173',       // Frontend local (Vite dev server)
      'http://localhost:3001',       // Alternativa local
      'http://136.248.110.133:3000', // OCI production IP
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('CareHub API')
    .setDescription('API completa para gestão de cuidadores, pacientes e plantões do CareHub.')
    .setVersion('1.0')
    .addBearerAuth() // Habilita o cadeado para colar o Token JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
