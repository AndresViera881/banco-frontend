import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Movimiento, MovimientoRequest, Cuenta } from '../../../../core/models/models';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movimiento-form.component.html'
})
export class MovimientoFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() movimiento: Movimiento | null = null;
  @Input() cuentas: Cuenta[] = [];
  @Output() save = new EventEmitter<MovimientoRequest>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  form!: FormGroup;
  isEditMode = false;
  today = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(): void {
    if (this.form) {
      this.isEditMode = !!this.movimiento;
      if (this.movimiento) {
        this.form.patchValue(this.movimiento);
      } else {
        this.form.reset({ fecha: this.today, tipoMovimiento: 'Deposito' });
      }
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      fecha: [this.today, Validators.required],
      tipoMovimiento: ['Deposito', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      numeroCuenta: ['', Validators.required]
    });
  }

  // onBackdropClick(event: MouseEvent): void {
  //   if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
  //     this.close.emit();
  //   }
  // }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as MovimientoRequest);
    } else {
      this.form.markAllAsTouched();
    }
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.hasError(error) && ctrl.touched);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }
}
