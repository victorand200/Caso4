import { Injectable } from '@angular/core';
import flashy from '@pablotheblink/flashyjs';

@Injectable({
  providedIn: 'root',
})
export class FlashyService {
  success(message: string) {
    flashy.success(message, {
      position: 'top-right',
      animation: 'slide',
      theme: 'light',
    });
  }

  error(message: string) {
    flashy.error(message, {
      position: 'top-right',
      animation: 'fade',
      theme: 'dark',
    });
  }

  info(message: string) {
    flashy(message, {
      type: 'info',
      position: 'bottom-right',
      duration: 3000,
      icon: 'ℹ️',
      animation: 'zoom',
    });
  }

  custom(message: string, config: any) {
    flashy(message, config);
  }
}
