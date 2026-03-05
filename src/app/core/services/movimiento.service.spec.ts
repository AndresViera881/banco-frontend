import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovimientoService } from './movimiento.service';
import { Movimiento, MovimientoRequest } from '../models/models';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

describe('MovimientoService', () => {
  let service: MovimientoService;
  let httpMock: HttpTestingController;

  const mockMovimiento: Movimiento = {
    movimientoId: 1,
    fecha: '2022-02-10',
    tipoMovimiento: 'CREDITO',
    valor: 600,
    saldo: 700,
    cuentaId: 2,
    numeroCuenta: '225487',
    clienteNombre: 'Marianela Montalvo'
  };

  const mockMovimientos: ApiResponse<Movimiento[]> = {
    success: true,
    message: 'Operación exitosa',
    data: [mockMovimiento],
    timestamp: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovimientoService]
    });
    service = TestBed.inject(MovimientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all movimientos', () => {
    service.getAll().subscribe(resp => {
      expect(resp.data.length).toBe(1);
      expect(resp.data[0].tipoMovimiento).toBe('Deposito');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/movimientos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovimientos);
  });

  it('should POST a new movimiento (Deposito)', () => {
    const request: MovimientoRequest = {
      fecha: '2022-02-10',
      tipoMovimiento: 'CREDITO',
      valor: 600,
      cuentaId: 2
    };

    service.create(request).subscribe(resp => {
      expect(resp.data.saldo).toBe(700);
      expect(resp.data.valor).toBe(600);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/movimientos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ success: true, message: 'Movimiento creado', data: mockMovimiento, timestamp: new Date().toISOString() });
  });

  it('should POST a retiro movimiento (Retiro)', () => {
    const retiro: Movimiento = {
      movimientoId: 2,
      fecha: '2022-02-08',
      tipoMovimiento: 'DEBITO',
      valor: -540,
      saldo: 0,
      cuentaId: 4,
      numeroCuenta: '496825',
      clienteNombre: 'Marianela Montalvo'
    };
    const request: MovimientoRequest = {
      fecha: '2022-02-08',
      tipoMovimiento: 'CREDITO',
      valor: 540,
      cuentaId: 4
    };

    service.create(request).subscribe(resp => {
      expect(resp.data.saldo).toBe(0);
      expect(resp.data.valor).toBe(-540);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/movimientos`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, message: 'Retiro creado', data: retiro, timestamp: new Date().toISOString() });
  });

  it('should DELETE a movimiento', () => {
    service.delete(1).subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/movimientos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, message: 'Movimiento eliminado', data: null, timestamp: new Date().toISOString() });
  });
});