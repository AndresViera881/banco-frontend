import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteResponse } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/reportes`;

  getReporte(
    clienteId: string,
    fechaInicio: string,
    fechaFin: string
  ): Observable<ReporteResponse> {
    const params = new HttpParams()
      .set('clienteId', clienteId.toString())
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<ReporteResponse>(this.baseUrl, { params });
  }
}
