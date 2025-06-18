import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, withJsonpSupport } from '@angular/common/http';
import { AuthInterceptor } from '../app/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
     provideHttpClient(
      withInterceptorsFromDi(),withJsonpSupport()
    ),
    provideToastr(),
    provideAnimations(),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, provideAnimationsAsync(),
  ]
};
