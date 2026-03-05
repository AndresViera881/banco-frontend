export interface Persona {
  id: number;
  nombre: string;
  genero: 'M' | 'F' | 'O';
  edad: number;
  identificacion: string;
  direccion: string;
  telefono: string;
}

// =====================
// Cliente Model
// =====================
export interface Cliente extends Persona {
  clienteId?: string;
  contrasena?: string;
  estado: boolean;
}

export interface ClienteRequest extends Persona {
  clienteId?: string;
  contrasena: string;
  estado: boolean;
}

// =====================
// Cuenta Model
// =====================
export type TipoCuenta = 'Ahorro' | 'Corriente';

export interface Cuenta {
  cuentaId?: number;
  numeroCuenta: string;
  tipoCuenta: TipoCuenta;
  saldoInicial: number;
  saldoDisponible?: number;
  estado: boolean;
  clienteId: string;
  clienteNombre?: string;
}

// =====================
// Movimiento Model
// =====================
export type TipoMovimiento = 'CREDITO' | 'DEBITO';

export interface Movimiento {
  movimientoId?: number;
  fecha: string;
  tipoMovimiento: TipoMovimiento;
  valor: number;
  saldo: number;
  cuentaId: number;
  numeroCuenta?: string;
  clienteNombre?: string;
}

export interface MovimientoRequest {
  movimientoId?: number;
  fecha: string;
  tipoMovimiento: TipoMovimiento;
  valor: number;
  cuentaId: number;
}

// =====================
// Reporte Model
// =====================
export interface ReporteItem {
  fecha: string;
  cliente: string;
  numeroCuenta: string;
  tipo: string;
  saldoInicial: number;
  estado: boolean;
  movimiento: number;
  saldoDisponible: number;
}

export interface ReporteData {
  cliente: string;
  identificacionCliente: string;
  cuentas: any[];
  reporteBase64: string;
}

export interface ReporteResponse {
  success: boolean;
  message: string;
  data: ReporteData;
}

// =====================
// API Response wrapper
// =====================
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
