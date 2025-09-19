import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Automotor {
  dominio: string;
  numero_chasis: string;
  numero_motor: string;
  color: string;
  fecha_fabricacion: number;
  cuit_dueno: string;
  denominacion_dueno: string;
}

export interface AutomotorResponse {
  data: Automotor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AutomotorService {
  private apiUrl = environment.apiUrl + '/automotores';

  constructor(private http: HttpClient) {}

  getAutomotores(page?: number, limit?: number): Observable<AutomotorResponse> {
    const params = new HttpParams()
      .set('page', page?.toString() || '1')
      .set('limit', limit?.toString() || '10');
    
    return this.http.get<AutomotorResponse>(this.apiUrl, { params });
  }
}
