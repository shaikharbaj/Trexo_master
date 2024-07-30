import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { I18nModule } from "nestjs-i18n";
import { join } from "path";
import { CustomLangResolver } from "./custom-lang-resolver";
import { I18nValidationPipe } from "./common/pipes";
import {
  PrismaModule,
  CountryModule,
  StateModule,
  CityModule,
  TaxModule,
  BrandModule,
  ContactUsModule,
  DivisionModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: "en",
        loaderOptions: {
          path: join(__dirname, "/../i18n/"),
          watch: true,
        },
        typesOutputPath: join(__dirname, "../src/generated/i18n.generated.ts"),
      }),
      resolvers: [{ use: CustomLangResolver, options: ["lang"] }],
    }),
    PrismaModule,
    CountryModule,
    StateModule,
    CityModule,
    TaxModule,
    BrandModule,
    ContactUsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: I18nValidationPipe,
    },
  ],
})
export class AppModule {}
