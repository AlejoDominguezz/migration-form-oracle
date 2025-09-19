import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SujetosModule } from './modules/sujetos/sujetos.module';
import { AutomotoresModule } from './modules/automotores/automotores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    SujetosModule,
    AutomotoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
