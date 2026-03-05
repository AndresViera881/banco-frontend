import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Cuenta } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cuentas`;

 getAll(): Observable<ApiResponse<Cuenta[]>> {
    return this.http.get<ApiResponse<Cuenta[]>>(this.baseUrl);
  }

  getById(id: number): Observable<ApiResponse<Cuenta>> {
    return this.http.get<ApiResponse<Cuenta>>(`${this.baseUrl}/${id}`);
  }

  getByCliente(clienteId: number): Observable<ApiResponse<Cuenta[]>> {
    return this.http.get<ApiResponse<Cuenta[]>>(`${this.baseUrl}/cliente/${clienteId}`);
  }

  create(cuenta: Cuenta): Observable<ApiResponse<Cuenta>> {
    return this.http.post<ApiResponse<Cuenta>>(this.baseUrl, cuenta);
  }

  update(id: number, cuenta: Cuenta): Observable<ApiResponse<Cuenta>> {
    return this.http.put<ApiResponse<Cuenta>>(`${this.baseUrl}/${id}`, cuenta);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
