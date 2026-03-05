import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Cliente, ClienteRequest } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/clientes`;

  // Ahora devuelve ApiResponse con un array de clientes
  getAll(): Observable<ApiResponse<Cliente[]>> {
    return this.http.get<ApiResponse<Cliente[]>>(this.baseUrl);
  }

  // Devuelve un solo cliente dentro de ApiResponse
  getById(id: number): Observable<ApiResponse<Cliente>> {
    return this.http.get<ApiResponse<Cliente>>(`${this.baseUrl}/${id}`);
  }

  create(cliente: ClienteRequest): Observable<ApiResponse<Cliente>> {
    return this.http.post<ApiResponse<Cliente>>(this.baseUrl, cliente);
  }

  update(id: number, cliente: ClienteRequest): Observable<ApiResponse<Cliente>> {
    return this.http.put<ApiResponse<Cliente>>(`${this.baseUrl}/${id}`, cliente);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }

  search(query: string): Observable<ApiResponse<Cliente[]>> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ApiResponse<Cliente[]>>(`${this.baseUrl}/search`, { params });
  }
}
