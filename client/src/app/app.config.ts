import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './_interceptors/error.interceptor';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './_interceptors/loading.interceptor';
import { TimeagoModule } from 'ngx-timeago';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CustomRouteReuseStrategy } from './services/customRouteReuseStrategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])), 
    provideAnimations(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'line-scale-party' })),
    importProvidersFrom(TimeagoModule.forRoot()),
    importProvidersFrom(ModalModule.forRoot()),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
};
