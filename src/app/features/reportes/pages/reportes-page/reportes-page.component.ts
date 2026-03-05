import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReporteService } from '../../../../core/services/reporte.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Cliente, ReporteResponse, ReporteItem } from '../../../../core/models/models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reportes-page.component.html',
  styleUrls: ['./reportes-page.component.css']
})
export class ReportesPageComponent {
   private reporteService = inject(ReporteService);
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);

  // Secciones de datos
  clientes = signal<Cliente[]>([]);
  reporte = signal<ReporteResponse | null>(null);
  loading = signal(false);

  // Formulario
  form!: FormGroup;

  // PDF
  reporteBase64?: string;
  reporteUrl!: SafeResourceUrl;

  ngOnInit(): void {
    this.buildForm();
    this.cargarClientes();
  }

  private buildForm(): void {
    const today = new Date().toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    this.form = this.fb.group({
      clienteId: ['', Validators.required],
      fechaInicio: [monthAgo, Validators.required],
      fechaFin: [today, Validators.required]
    });
  }

  private cargarClientes(): void {
    this.clienteService.getAll().subscribe({
      next: response => this.clientes.set(response.data),
      error: err => {
        console.error(err);
        this.toastService.error('No se pudieron cargar los clientes');
      }
    });
  }


    generarReporte() {
    const { clienteId, fechaInicio, fechaFin } = this.form.value;
    this.reporteService
      .getReporte(clienteId, fechaInicio, fechaFin)
      .subscribe(resp => {
        const base64 = resp.data.reporteBase64;
        const pdfUrl = `data:application/pdf;base64,${base64}`;
        this.reporteUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      });
  }

base64ToBlob(base64: string, type: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
}

  // Descargar PDF
  descargarPDF(): void {
    if (!this.reporteBase64) return;

    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${this.reporteBase64}`;
    link.download = `reporte-${this.form.value.clienteId}.pdf`;
    link.click();
  }

  // Utilidades
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-EC');
  }

  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }
}
