import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, CardModule],
  templateUrl: './listado.component.html',
  styles: []
})
export class ListadoComponent {
  elementos = [
    { id: 1, nombre: 'Elemento 1', descripcion: 'Descripción del elemento 1' },
    { id: 2, nombre: 'Elemento 2', descripcion: 'Descripción del elemento 2' },
    { id: 3, nombre: 'Elemento 3', descripcion: 'Descripción del elemento 3' }
  ];

  constructor(private router: Router) {}

  nuevoElemento() {
    this.router.navigate(['/formulario']);
  }

  editarElemento(id: number) {
    this.router.navigate(['/formulario', id]);
  }
}
