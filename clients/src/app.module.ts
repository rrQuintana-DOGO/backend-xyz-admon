import { Module } from '@nestjs/common';
import { ClientsModule } from '@clients/clients.module';
import { ModulesModule } from '@modules/modules.module';

@Module({
  imports: [
    ClientsModule,
    ModulesModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
