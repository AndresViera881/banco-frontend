import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-box confirm-box">
          <div class="confirm-icon">{{ icon }}</div>
          <h3 class="confirm-title">{{ title }}</h3>
          <p class="confirm-message">{{ message }}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" (click)="cancel.emit()">
              Cancelar
            </button>
            <button class="btn btn-danger" (click)="confirm.emit()">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-box {
      max-width: 420px;
      text-align: center;
      padding: 40px 32px;
    }
    .confirm-icon {
      font-size: 2.5rem;
      margin-bottom: 16px;
    }
    .confirm-title {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 400;
      color: var(--color-primary);
      margin-bottom: 8px;
    }
    .confirm-message {
      color: var(--color-text-secondary);
      font-size: 0.9375rem;
      margin-bottom: 28px;
    }
    .confirm-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = '¿Confirmar acción?';
  @Input() message = '¿Está seguro de que desea continuar?';
  @Input() confirmLabel = 'Eliminar';
  @Input() icon = '🗑';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.cancel.emit();
    }
  }
}
