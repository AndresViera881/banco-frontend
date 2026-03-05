import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ApiResponse, Cliente, ClienteRequest } from '../../../../core/models/models';
import { ClienteFormComponent } from '../../components/cliente-form/cliente-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/modal/confirm-dialog.component';

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ClienteFormComponent, ConfirmDialogComponent],
  templateUrl: './clientes-page.component.html',
  styleUrls: ['./clientes-page.component.css']
})
export class ClientesPageComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);

  clientes = signal<Cliente[]>([]);
  loading = signal(false);
  searchQuery = signal('');

  showForm = signal(false);
  selectedCliente = signal<Cliente | null>(null);

  showConfirm = signal(false);
  clienteToDelete = signal<Cliente | null>(null);

  filteredClientes = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.clientes();
    return this.clientes().filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.identificacion.toLowerCase().includes(q) ||
      c.telefono.toLowerCase().includes(q) ||
      c.direccion.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadClientes();
  }

  trackByClienteId(index: number, cliente: Cliente) {
  return cliente.clienteId;
}

loadClientes(): void {
  this.loading.set(true);
  this.clienteService.getAll().subscribe({
    next: (response) => {
      console.log(response.data);
      this.clientes.set(response.data);
      this.loading.set(false);
    },
    error: () => this.loading.set(false)
  });
}

  openNew(): void {
    this.selectedCliente.set(null);
    this.showForm.set(true);
  }

  openEdit(cliente: Cliente): void {
    this.selectedCliente.set({ ...cliente });
    this.showForm.set(true);
  }

  openDelete(cliente: Cliente): void {
    this.clienteToDelete.set(cliente);
    this.showConfirm.set(true);
  }

  onSave(request: ClienteRequest): void {
    const selected = this.selectedCliente();
    if (selected?.clienteId) {
      this.clienteService.update(selected.id, request).subscribe({
        next: () => {
          this.toastService.success('Cliente actualizado correctamente');
          this.showForm.set(false);
          this.loadClientes();
        }
      });
    } else {
      this.clienteService.create(request).subscribe({
        next: () => {
          this.toastService.success('Cliente creado correctamente');
          this.showForm.set(false);
          this.loadClientes();
        }
      });
    }
  }

  onConfirmDelete(): void {
    const cliente = this.clienteToDelete();
    if (cliente?.clienteId) {
      this.clienteService.delete(cliente.id).subscribe({
        next: () => {
          this.toastService.success('Cliente eliminado correctamente');
          this.showConfirm.set(false);
          this.loadClientes();
        }
      });
    }
  }

  getGenderLabel(g: string): string {
    return g === 'M' ? 'Masculino' : g === 'F' ? 'Femenino' : 'Otro';
  }
}
