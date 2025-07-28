import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { evenSchema } from './env/even';
import { AuthModule } from '@/infra/auth/auth.module';
import { HttpModule } from '@/infra/http/http.module';
import { EnvModule } from '@/infra/env/env.module';

@Module({
  imports: [ConfigModule.forRoot({
    validate: env => evenSchema.parse(env),
    isGlobal: true
  }),
  AuthModule,
  HttpModule,
  EnvModule,
  EventsModule]
})
export class AppModule {}
