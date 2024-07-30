import { Module } from '@nestjs/common';
import { GlobalHelper } from 'src/common/helpers';
import { CountryModule } from '../country/country.module';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { StateRepository } from './repository/state.repository';

@Module({
  imports:[CountryModule],
  providers: [StateService, StateRepository, GlobalHelper],
  controllers: [StateController],
  exports: [StateService],
})
export class StateModule {}
