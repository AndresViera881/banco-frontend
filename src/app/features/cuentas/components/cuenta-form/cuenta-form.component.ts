import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cuenta, Cliente } from '../../../../core/models/models';

@Component({
  selector: 'app-cuenta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuenta-form.component.html'
})
export class CuentaFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() cuenta: Cuenta | null = null;
  @Input() clientes: Cliente[] = [];
  @Output() save = new EventEmitter<Cuenta>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  form!: FormGroup;
  isEditMode = false;

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(): void {
    if (this.form) {
      this.isEditMode = !!this.cuenta;
      if (this.cuenta) {
        this.form.patchValue(this.cuenta);
      } else {
        this.form.reset({ estado: true, tipoCuenta: 'Ahorro' });
      }
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      numeroCuenta: ['', [Validators.required, Validators.minLength(5)]],
      tipoCuenta: ['Ahorro', Validators.required],
      saldoInicial: [0, [Validators.required, Validators.min(0)]],
      estado: [true],
      clienteId: ['', Validators.required]
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as Cuenta);
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
