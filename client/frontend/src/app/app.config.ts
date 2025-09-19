import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { definePreset } from '@primeuix/themes';

const MyAuraPreset = definePreset(Aura, {
  primitive: {
    // override or add primitive color palettes
    blue: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    }
  },
  semantic: {
    primary: {
      color: '{blue.500}',  // refers to your primitive
      hoverColor: '{blue.600}',
      // other semantic variants
    },
    // maybe surface, background, etc.
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          // more surface shades
        }
      },
      dark: {
        surface: {
          0: '#001122',
          // etc.
        }
      }
    }
  },

});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: MyAuraPreset,
        options: {
          darkModeSelector: 'none'
        }
      }
    })
  ]
};
