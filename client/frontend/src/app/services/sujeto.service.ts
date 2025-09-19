import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Sujeto {
  spoId: string;
  spoCuit: string;
  spoDenominacion: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSujetoDto {
  spoCuit: string;
  spoDenominacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class SujetoService {
  private apiUrl = environment.apiUrl + '/sujetos';

  constructor(private http: HttpClient) {}

  getSujetoByCuit(cuit: string): Observable<Sujeto> {
    const params = new HttpParams().set('cuit', cuit);
    return this.http.get<Sujeto>(`${this.apiUrl}/by-cuit`, { params });
  }

  createSujeto(sujeto: CreateSujetoDto): Observable<Sujeto> {
    return this.http.post<Sujeto>(this.apiUrl, sujeto);
  }
}
