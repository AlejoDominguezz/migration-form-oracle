import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { AutomotorService, Automotor } from '../../services/automotor.service';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, CardModule],
  templateUrl: './listado.component.html',
  styles: []
})
export class ListadoComponent implements OnInit {
  automotores: Automotor[] = [];
  loading = false;
  totalRecords = 0;
  first = 0;
  rows = 10;
  constructor(
    private router: Router,
    private automotorService: AutomotorService
  ) {}

  ngOnInit() {
    this.cargarAutomotores();
  }

  cargarAutomotores() {
    this.loading = true;
    const page = Math.floor(this.first / this.rows) + 1;
    this.automotorService.getAutomotores(page, this.rows).subscribe({
      next: (response) => {
        this.automotores = response.data;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar automotores:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.cargarAutomotores();
  }

  nuevoAutomotor() {
    this.router.navigate(['/formulario']);
  }

  editarAutomotor(dominio: string) {
    this.router.navigate(['/formulario', dominio]);
  }
}
