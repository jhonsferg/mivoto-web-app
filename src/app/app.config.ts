import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';

import { apiInterceptor } from './core/interceptors/api.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import formatter from 'dayjs/plugin/customParseFormat';
dayjs.extend(tz);
dayjs.extend(utc);
dayjs.extend(formatter);
import 'dayjs/locale/es';
dayjs.locale('es');
registerLocaleData(localeEsPE);

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor, errorInterceptor])),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('auth_token'),
        },
      })
    ),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en',
      lang: 'es'
    })
  ],
};
