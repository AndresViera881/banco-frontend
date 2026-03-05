import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientoService } from '../../../../core/services/movimiento.service';
import { CuentaService } from '../../../../core/services/cuenta.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Movimiento, MovimientoRequest, Cuenta } from '../../../../core/models/models';
import { MovimientoFormComponent } from '../../components/movimiento-form/movimiento-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/modal/confirm-dialog.component';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MovimientoFormComponent, ConfirmDialogComponent],
  templateUrl: './movimientos-page.component.html',
  styleUrls: ['./movimientos-page.component.css']
})
export class MovimientosPageComponent implements OnInit {
  private movimientoService = inject(MovimientoService);
  private cuentaService = inject(CuentaService);
  private toastService = inject(ToastService);

  movimientos = signal<Movimiento[]>([]);
  cuentas = signal<Cuenta[]>([]);
  loading = signal(false);
  searchQuery = signal('');

  showForm = signal(false);
  selectedMovimiento = signal<Movimiento | null>(null);
  showConfirm = signal(false);
  movimientoToDelete = signal<Movimiento | null>(null);

  filteredMovimientos = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.movimientos();
    return this.movimientos().filter(m =>
      (m.numeroCuenta ?? '').toLowerCase().includes(q) ||
      (m.clienteNombre ?? '').toLowerCase().includes(q) ||
      m.tipoMovimiento.toLowerCase().includes(q) ||
      m.fecha.includes(q)
    );
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
  this.loading.set(true);
  this.cuentaService.getAll().subscribe({
    next: resp => {
      this.cuentas.set(resp.data);
      console.log('Cuentas cargadas:', resp.data);
    },
    error: err => {
      console.error('Error cargando cuentas', err);
      this.loading.set(false);
    }
  });

  this.movimientoService.getAll().subscribe({
    next: resp => {
      this.movimientos.set(resp.data);
      this.loading.set(false); // <-- Detenemos el loading
      console.log('Movimientos cargados:', resp.data);
    },
    error: err => {
      console.error('Error cargando movimientos', err);
      this.loading.set(false);
    }
  });
}

  movTrackBy(index: number, mov: Movimiento) {
  return mov.movimientoId;
}

  openNew(): void {
    this.selectedMovimiento.set(null);
    this.showForm.set(true);
  }

  openEdit(mov: Movimiento): void {
    this.selectedMovimiento.set({ ...mov });
    this.showForm.set(true);
  }

  openDelete(mov: Movimiento): void {
    this.movimientoToDelete.set(mov);
    this.showConfirm.set(true);
  }

onSave(request: MovimientoRequest): void {
  const fechaConHora = request.fecha.includes('T') 
    ? request.fecha 
    : `${request.fecha}T00:00:00`;

  const requestToSend = { ...request, fecha: fechaConHora };

  console.log(requestToSend);

  const sel = this.selectedMovimiento();
  console.log("sel", sel)
  
   if (sel && sel.movimientoId != null) {
    // Actualizar movimiento existente
    this.movimientoService.update(sel.movimientoId, requestToSend).subscribe({
      next: () => {
        this.toastService.success('Movimiento actualizado');
        this.showForm.set(false);
        this.loadData();
      },
      error: (err) => {
        this.toastService.error('Error al actualizar el movimiento');
        console.error(err);
      }
    });
  } else {
    // Crear nuevo movimiento
    this.movimientoService.create(requestToSend).subscribe({
      next: () => {
        this.toastService.success('Movimiento registrado');
        this.showForm.set(false);
        this.loadData();
      },
      error: (err) => {
        this.toastService.error('Error al registrar el movimiento');
        console.error(err);
      }
    });
  }
}

  onConfirmDelete(): void {
    const mov = this.movimientoToDelete();
    if (mov?.movimientoId) {
      this.movimientoService.delete(mov.movimientoId).subscribe({
        next: () => {
          this.toastService.success('Movimiento eliminado');
          this.showConfirm.set(false);
          this.loadData();
        }
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-EC');
  }
}
