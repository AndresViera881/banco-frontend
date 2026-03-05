import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente, ClienteRequest } from '../../../../core/models/models';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() cliente: Cliente | null = null;
  @Output() save = new EventEmitter<ClienteRequest>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  form!: FormGroup;
  isEditMode = false;

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(): void {
    if (this.form) {
      this.isEditMode = !!this.cliente;
      if (this.cliente) {
        this.form.patchValue(this.cliente);
        this.form.get('contrasena')?.clearValidators();
        this.form.get('contrasena')?.updateValueAndValidity();
      } else {
        this.form.reset({ estado: true, genero: 'M' });
        this.form.get('contrasena')?.setValidators([Validators.required, Validators.minLength(4)]);
        this.form.get('contrasena')?.updateValueAndValidity();
      }
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      clienteId: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      genero: ['M', Validators.required],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      identificacion: ['', [Validators.required, Validators.minLength(5)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],
      contrasena: ['', [Validators.required, Validators.minLength(4)]],
      estado: [true, Validators.required]
    });
  }

  // onBackdropClick(event: MouseEvent): void {
  //   if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
  //     this.close.emit();
  //   }
  // }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as ClienteRequest);
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
