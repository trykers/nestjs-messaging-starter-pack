import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TooManyRequestsException } from './exceptions/too-many-requests.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.dynamic(), { cors: true });

  app.use('*', (req, res, next) => { // From the Apollo documentation, this middleware protect the server from malicious queries
    let query = ''
    if (req.query) {
      query = req.query.query || ''
    } else if (req.body) {
      query = req.body.query || ''
    }

    if (query.length > 2000) {
      throw new TooManyRequestsException()
    }
    next()
  })

  await app.listen(3000);
}
bootstrap();
