import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentaService } from '../../../../core/services/cuenta.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Cuenta, Cliente } from '../../../../core/models/models';
import { CuentaFormComponent } from '../../components/cuenta-form/cuenta-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/modal/confirm-dialog.component';

@Component({
  selector: 'app-cuentas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CuentaFormComponent, ConfirmDialogComponent],
  templateUrl: './cuentas-page.component.html',
  styleUrls: ['./cuentas-page.component.css']
})
export class CuentasPageComponent implements OnInit {
  private cuentaService = inject(CuentaService);
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);

  cuentas = signal<Cuenta[]>([]);
  clientes = signal<Cliente[]>([]);
  loading = signal(false);
  searchQuery = signal('');

  showForm = signal(false);
  selectedCuenta = signal<Cuenta | null>(null);
  showConfirm = signal(false);
  cuentaToDelete = signal<Cuenta | null>(null);

  filteredCuentas = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.cuentas();
    return this.cuentas().filter(c =>
      c.numeroCuenta.toLowerCase().includes(q) ||
      c.tipoCuenta.toLowerCase().includes(q) ||
      (c.clienteNombre ?? '').toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadData();
  }

loadData(): void {
  this.loading.set(true);

  // Clientes
  this.clienteService.getAll().subscribe({
    next: (response) => {
      this.clientes.set(response.data); // <-- .data es el array real
    },
    error: () => this.loading.set(false)
  });

  // Cuentas
  this.cuentaService.getAll().subscribe({
    next: (response) => {
      this.cuentas.set(response.data); // <-- .data es el array real
      this.loading.set(false);
    },
    error: () => this.loading.set(false)
  });
}

  openNew(): void {
    this.selectedCuenta.set(null);
    this.showForm.set(true);
  }

  openEdit(cuenta: Cuenta): void {
    this.selectedCuenta.set({ ...cuenta });
    this.showForm.set(true);
  }

  openDelete(cuenta: Cuenta): void {
    this.cuentaToDelete.set(cuenta);
    this.showConfirm.set(true);
  }

  onSave(cuenta: Cuenta): void {
    const sel = this.selectedCuenta();
    if (sel?.cuentaId) {
      this.cuentaService.update(sel.cuentaId, cuenta).subscribe({
        next: () => {
          this.toastService.success('Cuenta actualizada');
          this.showForm.set(false);
          this.loadData();
        }
      });
    } else {
      this.cuentaService.create(cuenta).subscribe({
        next: () => {
          this.toastService.success('Cuenta creada');
          this.showForm.set(false);
          this.loadData();
        }
      });
    }
  }

  onConfirmDelete(): void {
    const cuenta = this.cuentaToDelete();
    if (cuenta?.cuentaId) {
      this.cuentaService.delete(cuenta.cuentaId).subscribe({
        next: () => {
          this.toastService.success('Cuenta eliminada');
          this.showConfirm.set(false);
          this.loadData();
        }
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);
  }
}
