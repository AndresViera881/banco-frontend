import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesPageComponent } from './clientes-page.component';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ToastService } from '../../../../core/services/toast.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Cliente, ClienteRequest } from '../../../../core/models/models';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Mock de clientes con clienteId como STRING
const mockClientes: Cliente[] = [
  {
    id:1,
    clienteId: 'CLI001',
    nombre: 'Jose Lema',
    genero: 'M',
    edad: 35,
    identificacion: '1001234567',
    direccion: 'Otavalo sn y principal',
    telefono: '098254785',
    estado: true
  },
  {
    id:2,
    clienteId: 'CLI002',
    nombre: 'Marianela Montalvo',
    genero: 'F',
    edad: 28,
    identificacion: '1009876543',
    direccion: 'Amazonas y NNUU',
    telefono: '097548965',
    estado: true
  }
];

// Mock ApiResponse
const mockClientesResponse: ApiResponse<Cliente[]> = {
  success: true,
  message: 'Operación exitosa',
  data: mockClientes,
  timestamp: new Date().toISOString()
};

describe('ClientesPageComponent', () => {
  let component: ClientesPageComponent;
  let fixture: ComponentFixture<ClientesPageComponent>;
  let clienteServiceMock: jest.Mocked<ClienteService>;
  let toastServiceMock: jest.Mocked<ToastService>;

  beforeEach(async () => {
    clienteServiceMock = {
      getAll: jest.fn().mockReturnValue(of(mockClientesResponse)),
      getById: jest.fn().mockImplementation((id: string) => {
        const cliente = mockClientes.find(c => c.clienteId === id);
        return of({
          success: true,
          message: 'Operación exitosa',
          data: cliente ? [cliente] : [],
          timestamp: new Date().toISOString()
        });
      }),
      create: jest.fn().mockImplementation((request: ClienteRequest) => {
        const newCliente: Cliente = { ...request, clienteId: 'CLI003' };
        return of({
          success: true,
          message: 'Cliente creado',
          data: [newCliente],
          timestamp: new Date().toISOString()
        });
      }),
      update: jest.fn().mockImplementation((id: string, request: ClienteRequest) => {
        const updatedCliente: Cliente = { ...request, clienteId: id };
        return of({
          success: true,
          message: 'Cliente actualizado',
          data: [updatedCliente],
          timestamp: new Date().toISOString()
        });
      }),
      delete: jest.fn().mockImplementation((id: string) => {
        return of({
          success: true,
          message: 'Cliente eliminado',
          data: [],
          timestamp: new Date().toISOString()
        });
      }),
      search: jest.fn().mockImplementation((query: string) => {
        const filtered = mockClientes.filter(c =>
          c.nombre.toLowerCase().includes(query.toLowerCase()) ||
          c.identificacion.includes(query)
        );
        return of({
          success: true,
          message: 'Búsqueda exitosa',
          data: filtered,
          timestamp: new Date().toISOString()
        });
      })
    } as unknown as jest.Mocked<ClienteService>;

    toastServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
      show: jest.fn(),
      dismiss: jest.fn()
    } as unknown as jest.Mocked<ToastService>;

    await TestBed.configureTestingModule({
      imports: [ClientesPageComponent],
      providers: [
        provideRouter([]),
        { provide: ClienteService, useValue: clienteServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load clientes on init', () => {
    expect(clienteServiceMock.getAll).toHaveBeenCalled();
    expect(component.clientes().length).toBe(2);
  });

  it('should filter clientes by search query', () => {
    component.searchQuery.set('jose');
    expect(component.filteredClientes().length).toBe(1);
    expect(component.filteredClientes()[0].nombre).toBe('Jose Lema');
  });

  it('should filter clientes by identificacion', () => {
    component.searchQuery.set('1009876543');
    expect(component.filteredClientes().length).toBe(1);
    expect(component.filteredClientes()[0].nombre).toBe('Marianela Montalvo');
  });

  it('should return all clientes when search query is empty', () => {
    component.searchQuery.set('');
    expect(component.filteredClientes().length).toBe(2);
  });

  it('should open form for new cliente', () => {
    component.openNew();
    expect(component.showForm()).toBe(true);
    expect(component.selectedCliente()).toBeNull();
  });

  it('should open form for edit with selected cliente', () => {
    component.openEdit(mockClientes[0]);
    expect(component.showForm()).toBe(true);
    expect(component.selectedCliente()?.clienteId).toBe('CLI001');
  });

  it('should open confirm dialog for delete', () => {
    component.openDelete(mockClientes[0]);
    expect(component.showConfirm()).toBe(true);
    expect(component.clienteToDelete()?.nombre).toBe('Jose Lema');
  });

  it('should create a new cliente and show success toast', () => {
    const request: ClienteRequest = {
      id: 1,
      nombre: 'Juan Nuevo',
      genero: 'M',
      edad: 25,
      identificacion: '1011111111',
      direccion: 'Calle Nueva 123',
      telefono: '099999999',
      contrasena: 'pass123',
      estado: true
    };
    component.showForm.set(true);
    component.onSave(request);

    expect(clienteServiceMock.create).toHaveBeenCalledWith(request);
    expect(toastServiceMock.success).toHaveBeenCalledWith('Cliente creado correctamente');
    expect(component.showForm()).toBe(false);
  });

  it('should update a cliente and show success toast', () => {
    const request: ClienteRequest = {
      id:2,
      nombre: 'Jose Lema Updated',
      genero: 'M',
      edad: 36,
      identificacion: '1001234567',
      direccion: 'Otavalo sn y principal',
      telefono: '098254785',
      contrasena: '1234',
      estado: true
    };
    component.selectedCliente.set(mockClientes[0]);
    component.onSave(request);

    expect(clienteServiceMock.update).toHaveBeenCalledWith(1, request);
    expect(toastServiceMock.success).toHaveBeenCalledWith('Cliente actualizado correctamente');
  });

  it('should delete a cliente and show success toast', () => {
    component.clienteToDelete.set(mockClientes[0]);
    component.showConfirm.set(true);
    component.onConfirmDelete();

    expect(clienteServiceMock.delete).toHaveBeenCalledWith(2);
    expect(toastServiceMock.success).toHaveBeenCalledWith('Cliente eliminado correctamente');
    expect(component.showConfirm()).toBe(false);
  });

  it('should return correct gender label', () => {
    expect(component.getGenderLabel('M')).toBe('Masculino');
    expect(component.getGenderLabel('F')).toBe('Femenino');
    expect(component.getGenderLabel('O')).toBe('Otro');
  });
});