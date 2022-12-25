import { Injectable, TemplateRef } from '@angular/core';

export interface ToastInfo {
  body: TemplateRef<any> | string | null;
  background?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: ToastInfo[] = [];

  show(info: ToastInfo) {
    info.body = info.body ?? null;
    this.toasts.push(info);
  }

  showSuccess(info: ToastInfo) {
    info.background = 'bg-success text-light'
    this.show(info);
  }

  showError(info: ToastInfo) {
    info.background = 'bg-danger text-light'
    this.show(info);
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }

  constructor() { }
}
