import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Movimiento, MovimientoRequest } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/movimientos`;
// Devuelve ApiResponse<Movimiento[]>
  getAll(): Observable<ApiResponse<Movimiento[]>> {
    console.log(this.http.get<ApiResponse<Movimiento[]>>(this.baseUrl));
    return this.http.get<ApiResponse<Movimiento[]>>(this.baseUrl);
  }

  // Devuelve ApiResponse<Movimiento>
  getById(id: number): Observable<ApiResponse<Movimiento>> {
    return this.http.get<ApiResponse<Movimiento>>(`${this.baseUrl}/${id}`);
  }

  // Devuelve ApiResponse<Movimiento>
  create(movimiento: MovimientoRequest): Observable<ApiResponse<Movimiento>> {
    return this.http.post<ApiResponse<Movimiento>>(this.baseUrl, movimiento);
  }

  // Devuelve ApiResponse<Movimiento>
  update(id: number, movimiento: MovimientoRequest): Observable<ApiResponse<Movimiento>> {
    return this.http.put<ApiResponse<Movimiento>>(`${this.baseUrl}/${id}`, movimiento);
  }

  // Devuelve ApiResponse<null>
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
