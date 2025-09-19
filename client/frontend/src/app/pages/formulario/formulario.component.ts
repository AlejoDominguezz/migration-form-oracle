import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule, 
    ButtonModule, 
    InputTextModule, 
    CardModule,
    ToastModule,
    TextareaModule
  ],
  providers: [MessageService],
  templateUrl: './formulario.component.html',
  styles: []
})
export class FormularioComponent implements OnInit {
  elemento = {
    id: 0,
    nombre: '',
    descripcion: ''
  };
  
  esEdicion = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.elemento.id = +id;
      // Aquí cargarías los datos del elemento desde un servicio
      this.cargarElemento(+id);
    }
  }

  cargarElemento(id: number) {
    // Simulación de carga de datos
    this.elemento = {
      id: id,
      nombre: `Elemento ${id}`,
      descripcion: `Descripción del elemento ${id}`
    };
  }

  guardar() {
    if (this.esEdicion) {
      console.log('Actualizando elemento:', this.elemento);
      // Aquí llamarías al servicio para actualizar
    } else {
      console.log('Creando elemento:', this.elemento);
      // Aquí llamarías al servicio para crear
    }
    
    // Redirigir al listado
    this.router.navigate(['/listado']);
  }

  cancelar() {
    this.router.navigate(['/listado']);
  }
}
