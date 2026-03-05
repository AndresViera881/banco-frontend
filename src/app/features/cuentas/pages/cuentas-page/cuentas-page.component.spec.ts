import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentasPageComponent } from './cuentas-page.component';
import { CuentaService } from '../../../../core/services/cuenta.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ToastService } from '../../../../core/services/toast.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Cuenta, Cliente } from '../../../../core/models/models';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Mock con ApiResponse y clienteId como STRING
const mockCuentas: ApiResponse<Cuenta[]> = {
  success: true,
  message: 'Operación exitosa',
  data: [
    {
      cuentaId: 1,
      numeroCuenta: '478758',
      tipoCuenta: 'Ahorro',
      saldoInicial: 2000,
      saldoDisponible: 1425,
      estado: true,
      clienteId: 'CLI001', // STRING
      clienteNombre: 'Jose Lema'
    },
    {
      cuentaId: 2,
      numeroCuenta: '225487',
      tipoCuenta: 'Corriente',
      saldoInicial: 100,
      saldoDisponible: 700,
      estado: true,
      clienteId: 'CLI002', // STRING
      clienteNombre: 'Marianela Montalvo'
    }
  ],
  timestamp: new Date().toISOString()
};

const mockClientes: ApiResponse<Cliente[]> = {
  success: true,
  message: 'Operación exitosa',
  data: [
    {
      id: 1,
      clienteId: 'CLI001', // STRING
      nombre: 'Jose Lema',
      genero: 'M',
      edad: 35,
      identificacion: '1001234567',
      direccion: 'Otavalo sn y principal',
      telefono: '098254785',
      estado: true
    },
    {
      id: 2,
      clienteId: 'CLI002', // STRING
      nombre: 'Marianela Montalvo',
      genero: 'F',
      edad: 28,
      identificacion: '1009876543',
      direccion: 'Quito Av. Principal',
      telefono: '0987654321',
      estado: true
    }
  ],
  timestamp: new Date().toISOString()
};

describe('CuentasPageComponent', () => {
  let component: CuentasPageComponent;
  let fixture: ComponentFixture<CuentasPageComponent>;
  let cuentaServiceMock: jest.Mocked<CuentaService>;
  let clienteServiceMock: jest.Mocked<ClienteService>;
  let toastServiceMock: jest.Mocked<ToastService>;

  beforeEach(async () => {
    // Mock de servicios con ApiResponse
    cuentaServiceMock = {
      getAll: jest.fn().mockReturnValue(of(mockCuentas)),
      getById: jest.fn(),
      getByCliente: jest.fn(),
      create: jest.fn().mockReturnValue(of(mockCuentas)),
      update: jest.fn().mockReturnValue(of(mockCuentas)),
      delete: jest.fn().mockReturnValue(of({ success: true, message: '', data: null, timestamp: '' }))
    } as unknown as jest.Mocked<CuentaService>;

    clienteServiceMock = {
      getAll: jest.fn().mockReturnValue(of(mockClientes)),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn()
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
      imports: [CuentasPageComponent],
      providers: [
        provideRouter([]),
        { provide: CuentaService, useValue: cuentaServiceMock },
        { provide: ClienteService, useValue: clienteServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CuentasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load cuentas and clientes on init', () => {
    expect(cuentaServiceMock.getAll).toHaveBeenCalled();
    expect(clienteServiceMock.getAll).toHaveBeenCalled();
    expect(component.cuentas().length).toBe(mockCuentas.data.length);
    expect(component.clientes().length).toBe(mockClientes.data.length);
  });

  it('should filter cuentas by numeroCuenta', () => {
    component.searchQuery.set('478758');
    expect(component.filteredCuentas().length).toBe(1);
    expect(component.filteredCuentas()[0].tipoCuenta).toBe('Ahorro');
  });

  it('should filter cuentas by clienteNombre', () => {
    component.searchQuery.set('marianela');
    expect(component.filteredCuentas().length).toBe(1);
    expect(component.filteredCuentas()[0].numeroCuenta).toBe('225487');
  });

  it('should filter cuentas by tipoCuenta', () => {
    component.searchQuery.set('corriente');
    expect(component.filteredCuentas().length).toBe(1);
  });

  it('should show all cuentas when query is empty', () => {
    component.searchQuery.set('');
    expect(component.filteredCuentas().length).toBe(mockCuentas.data.length);
  });

  it('should open form for a new cuenta', () => {
    component.openNew();
    expect(component.showForm()).toBe(true);
    expect(component.selectedCuenta()).toBeNull();
  });

  it('should open edit with correct cuenta', () => {
    component.openEdit(mockCuentas.data[0]);
    expect(component.showForm()).toBe(true);
    expect(component.selectedCuenta()?.numeroCuenta).toBe('478758');
  });

  it('should create a cuenta and reload', () => {
    const newCuenta = { ...mockCuentas.data[0], cuentaId: undefined };
    component.openNew();
    component.onSave(newCuenta as any);
    expect(cuentaServiceMock.create).toHaveBeenCalledWith(newCuenta);
    expect(toastServiceMock.success).toHaveBeenCalledWith('Cuenta creada');
  });

  it('should update a cuenta', () => {
    component.selectedCuenta.set(mockCuentas.data[0]);
    component.onSave(mockCuentas.data[0]);
    expect(cuentaServiceMock.update).toHaveBeenCalledWith(1, mockCuentas.data[0]);
    expect(toastServiceMock.success).toHaveBeenCalledWith('Cuenta actualizada');
  });

  it('should delete a cuenta', () => {
    component.cuentaToDelete.set(mockCuentas.data[0]);
    component.showConfirm.set(true);
    component.onConfirmDelete();
    expect(cuentaServiceMock.delete).toHaveBeenCalledWith(1);
    expect(toastServiceMock.success).toHaveBeenCalledWith('Cuenta eliminada');
    expect(component.showConfirm()).toBe(false);
  });

  it('should format currency correctly', () => {
    expect(component.formatCurrency(1425)).toContain('1.425');
  });
});