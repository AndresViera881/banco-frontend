import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { Cliente, ClienteRequest } from '../models/models';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  const mockCliente: Cliente = {
    id: 1,
    clienteId: 'CLI001', // ahora es string
    nombre: 'Jose Lema',
    genero: 'M',
    edad: 30,
    identificacion: '1001234567',
    direccion: 'Otavalo sn y principal',
    telefono: '098254785',
    estado: true
  };

  const mockClienteRequest: ClienteRequest = {
    id:1,
    nombre: 'Jose Lema',
    genero: 'M',
    edad: 30,
    identificacion: '1001234567',
    direccion: 'Otavalo sn y principal',
    telefono: '098254785',
    contrasena: '1234',
    estado: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService]
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all clientes', () => {
    const mockResponse: ApiResponse<Cliente[]> = {
      success: true,
      message: 'Operación exitosa',
      data: [mockCliente],
      timestamp: new Date().toISOString()
    };

    service.getAll().subscribe(resp => {
      expect(resp.data.length).toBe(1);
      expect(resp.data[0].clienteId).toBe('CLI001');
      expect(resp.data[0].nombre).toBe('Jose Lema');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should GET a cliente by ID', () => {
    const mockResponse: ApiResponse<Cliente> = {
      success: true,
      message: 'Operación exitosa',
      data: mockCliente,
      timestamp: new Date().toISOString()
    };

    service.getById(1).subscribe(resp => {
      expect(resp.data.clienteId).toBe('CLI001');
      expect(resp.data.nombre).toBe('Jose Lema');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes/CLI001`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should POST to create a new cliente', () => {
    const mockResponse: ApiResponse<Cliente> = {
      success: true,
      message: 'Cliente creado',
      data: { ...mockCliente, clienteId: 'CLI002' },
      timestamp: new Date().toISOString()
    };

    service.create(mockClienteRequest).subscribe(resp => {
      expect(resp.data.clienteId).toBe('CLI002');
      expect(resp.data.nombre).toBe('Jose Lema');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockClienteRequest);
    req.flush(mockResponse);
  });

  it('should PUT to update an existing cliente', () => {
    const mockResponse: ApiResponse<Cliente> = {
      success: true,
      message: 'Cliente actualizado',
      data: mockCliente,
      timestamp: new Date().toISOString()
    };

    service.update(1, mockClienteRequest).subscribe(resp => {
      expect(resp.data.clienteId).toBe('CLI001');
      expect(resp.data.nombre).toBe('Jose Lema');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes/CLI001`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockClienteRequest);
    req.flush(mockResponse);
  });

  it('should DELETE a cliente', () => {
    const mockResponse: ApiResponse<null> = {
      success: true,
      message: 'Cliente eliminado',
      data: null,
      timestamp: new Date().toISOString()
    };

    service.delete(1).subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes/CLI001`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});