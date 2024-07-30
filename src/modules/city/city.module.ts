import { Module } from '@nestjs/common';
import { GlobalHelper } from 'src/common/helpers';
import { CountryModule } from '../country/country.module';
import { StateModule } from '../state/state.module';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CityRepository } from './repository';

@Module({
  imports: [CountryModule, StateModule],
  controllers: [CityController],
  providers: [CityService, CityRepository, GlobalHelper],
  exports: [CityService],
})
export class CityModule {}
