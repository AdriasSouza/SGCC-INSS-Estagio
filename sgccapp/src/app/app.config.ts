import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientXsrfModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptor/auth.interceptor';
import { erroInterceptor } from './interceptor/erro.interceptor';
import { environment } from './environments/environment';
import { BasicLoginService } from './service/login/basic-login.service';
import { JwtLoginService } from './service/login/jwt-login.service';
import { LoginService } from './service/login/i-login.service';

export function loginServiceFactory() {

  const authType = environment.AUTH_TYPE;

  if (authType == 'basic') {
    return new BasicLoginService();
  } else if (authType == 'jwt') {
    return new JwtLoginService();
  } else {
    throw new Error('Tipo de autenticação deve ser "basic" ou "jwt".');
  }

}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({anchorScrolling: 'enabled'})),
    provideHttpClient(withInterceptors([erroInterceptor, authInterceptor])),
    { provide: LoginService, useFactory: loginServiceFactory },
    importProvidersFrom(HttpClientXsrfModule)
  ]
};