import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutomotorService, Automotor } from '../../services/automotor.service';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, CardModule, TooltipModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
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
    private automotorService: AutomotorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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

  eliminarAutomotor(dominio: string) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el automotor ${dominio}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this.loading = true;
        this.automotorService.deleteAutomotor(dominio).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Automotor ${dominio} eliminado correctamente`
            });
            this.cargarAutomotores();
          },
          error: (error) => {
            console.error('Error al eliminar automotor:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el automotor'
            });
            this.loading = false;
          }
        });
      }
    });
  }
}
