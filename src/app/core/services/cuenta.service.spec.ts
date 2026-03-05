import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CuentaService } from './cuenta.service';
import { Cuenta } from '../models/models';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

describe('CuentaService', () => {
  let service: CuentaService;
  let httpMock: HttpTestingController;

  const mockCuenta: Cuenta = {
    cuentaId: 1,
    numeroCuenta: '478758',
    tipoCuenta: 'Ahorro',
    saldoInicial: 2000,
    saldoDisponible: 1425,
    estado: true,
    clienteId: 'CLI001',
    clienteNombre: 'Jose Lema'
  };

  const mockCuentas: ApiResponse<Cuenta[]> = {
    success: true,
    message: 'Operación exitosa',
    data: [mockCuenta],
    timestamp: new Date().toISOString()
  };

  const mockCuentaResponse: ApiResponse<Cuenta> = {
    success: true,
    message: 'Operación exitosa',
    data: mockCuenta,
    timestamp: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CuentaService]
    });
    service = TestBed.inject(CuentaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all cuentas', () => {
    service.getAll().subscribe(resp => {
      expect(resp.data.length).toBe(1);
      expect(resp.data[0].numeroCuenta).toBe('478758');
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/cuentas`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCuentas);
  });

  it('should GET cuenta by ID', () => {
    service.getById(1).subscribe(resp => {
      expect(resp.data.cuentaId).toBe(1);
      expect(resp.data.tipoCuenta).toBe('Ahorro');
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/cuentas/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCuentaResponse);
  });

  it('should GET cuentas by cliente', () => {
    service.getByCliente(1).subscribe(resp => {
      expect(resp.data.length).toBe(1);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/cuentas/cliente/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCuentas);
  });

  it('should POST to create a cuenta', () => {
    const newCuenta: Cuenta = { ...mockCuenta, cuentaId: undefined };
    service.create(newCuenta).subscribe(resp => {
      expect(resp.data.cuentaId).toBe(1);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/cuentas`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCuentaResponse);
  });

  it('should PUT to update a cuenta', () => {
    service.update(1, mockCuenta).subscribe(resp => {
      expect(resp.data.numeroCuenta).toBe('478758');
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/cuentas/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockCuentaResponse);
  });

  it('should DELETE a cuenta', () => {
    service.delete(1).subscribe(resp => {
      expect(resp).toBeTruthy();
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/cuentas/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, message: 'Cuenta eliminada', data: null, timestamp: new Date().toISOString() });
  });
});