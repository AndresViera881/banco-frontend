import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type">
          <span class="toast-icon">{{ getIcon(toast.type) }}</span>
          <span>{{ toast.message }}</span>
          <span class="toast-close" (click)="toastService.dismiss(toast.id)">✕</span>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  getIcon(type: Toast['type']): string {
    const icons: Record<Toast['type'], string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type];
  }
}
