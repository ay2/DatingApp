import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
  
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(), 
    //importProvidersFrom(BsDropdownModule.forRoot(), BrowserAnimationsModule)
  ]
};
