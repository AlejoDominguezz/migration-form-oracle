import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AutomotorService, Automotor, CreateAutomotorDto } from '../../services/automotor.service';
import { SujetoService, Sujeto, CreateSujetoDto } from '../../services/sujeto.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonModule, 
    InputTextModule, 
    CardModule,
    DialogModule,
    TooltipModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './formulario.component.html',
  styles: []
})
export class FormularioComponent implements OnInit {
  
  automotor: Partial<Automotor> = {
    dominio: '',
    numero_chasis: '',
    numero_motor: '',
    color: '',
    fecha_fabricacion: undefined,
    cuit_dueno: '',
    denominacion_dueno: ''
  };
  
  esEdicion = false;
  loading = false;
  dominioParam: string | null = null;
  
  showSujetoModal = false;
  nuevoSujeto: CreateSujetoDto = {
    spoCuit: '',
    spoDenominacion: ''
  };
  sujetoEncontrado: Sujeto | null = null;
  spoId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private automotorService: AutomotorService,
    private sujetoService: SujetoService
  ) {}

  ngOnInit() {
    this.dominioParam = this.route.snapshot.paramMap.get('id');
    if (this.dominioParam) {
      this.esEdicion = true;
      this.cargarAutomotor(this.dominioParam);
    }
  }

  cargarAutomotor(dominio: string) {
    this.loading = true;
    this.automotorService.getAutomotorByDominio(dominio).subscribe({
      next: (automotor) => {
        this.automotor = automotor;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar automotor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el automotor'
        });
        this.loading = false;
      }
    });
  }

  validarDominio() {
    const dominio = this.automotor.dominio;
    if (dominio) {
      const regex = /^[A-Z]{3}[0-9]{3}$|^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
      if (!regex.test(dominio)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Dominio inválido. Formato: ABC123 o AB123CD'
        });
        return false;
      }
    }
    return true;
  }

  private isCuitValid(cuit: string): boolean {
    if (!cuit || cuit.length !== 11 || !/^[0-9]{11}$/.test(cuit)) {
      return false;
    }

    const coeficients = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;

    for (let i = 0; i < 10; i++) {
      suma += parseInt(cuit[i]) * coeficients[i];
    }

    let digitVerifier = (11 - (suma % 11)) % 11;
    if (digitVerifier === 11) {
      digitVerifier = 0;
    }

    return digitVerifier === parseInt(cuit[10]);
  }

  validarCUIT() {
    const cuit = this.automotor.cuit_dueno;
    if (cuit) {
      if (!this.isCuitValid(cuit)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'CUIT inválido. Verifique el número ingresado'
        });
        return false;
      }
    }
    return true;
  }

  buscarSujetoPorCuit() {
    const cuit = this.automotor.cuit_dueno;
    if (!cuit || !this.validarCUIT()) {
      return;
    }

    this.loading = true;
    this.sujetoService.getSujetoByCuit(cuit).subscribe({
      next: (sujeto) => {
        this.sujetoEncontrado = sujeto;
        this.automotor.denominacion_dueno = sujeto.spoDenominacion;
        this.spoId = parseInt(sujeto.spoId);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sujeto encontrado correctamente'
        });
      },
      error: (error) => {
        console.error('Error al buscar sujeto:', error);
        this.sujetoEncontrado = null;
        this.automotor.denominacion_dueno = '';
        this.spoId = null;
        this.loading = false;
        
        if (error.status === 404) {
          this.nuevoSujeto.spoCuit = cuit;
          this.showSujetoModal = true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al buscar el sujeto'
          });
        }
      }
    });
  }

  crearNuevoSujeto() {
    if (!this.nuevoSujeto.spoCuit || !this.nuevoSujeto.spoDenominacion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'CUIT y denominación son requeridos'
      });
      return;
    }

    if (!this.isCuitValid(this.nuevoSujeto.spoCuit)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'CUIT inválido. Verifique el número ingresado'
      });
      return;
    }

    this.loading = true;
    this.sujetoService.createSujeto(this.nuevoSujeto).subscribe({
      next: (sujeto) => {
        this.sujetoEncontrado = sujeto;
        this.automotor.denominacion_dueno = sujeto.spoDenominacion;
        this.spoId = parseInt(sujeto.spoId);
        this.showSujetoModal = false;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sujeto creado correctamente'
        });
      },
      error: (error) => {
        console.error('Error al crear sujeto:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el sujeto'
        });
      }
    });
  }

  cancelarCrearSujeto() {
    this.showSujetoModal = false;
    this.nuevoSujeto = {
      spoCuit: '',
      spoDenominacion: ''
    };
  }

  validarFechaFabricacion() {
    const fecha = this.automotor.fecha_fabricacion;
    if (fecha) {
      const fechaStr = fecha.toString();
      if (fechaStr.length !== 6) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Fecha de fabricación debe ser YYYYMM'
        });
        return false;
      }
      
      const year = parseInt(fechaStr.substring(0, 4));
      const month = parseInt(fechaStr.substring(4, 6));
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      if (year < 1900 || month < 1 || month > 12 || 
          (year === currentYear && month > currentMonth) || 
          year > currentYear) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Fecha de fabricación inválida'
        });
        return false;
      }
    }
    return true;
  }

  guardar() {
    if (!this.validarDominio() || !this.validarCUIT() || !this.validarFechaFabricacion()) {
      return;
    }

    if (!this.spoId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe buscar o crear un sujeto válido'
      });
      return;
    }

    this.loading = true;
    
    const createDto: CreateAutomotorDto = {
      dominio: this.automotor.dominio!,
      numero_chasis: this.automotor.numero_chasis,
      numero_motor: this.automotor.numero_motor,
      color: this.automotor.color,
      fecha_fabricacion: this.automotor.fecha_fabricacion!,
      spoId: this.spoId
    };
    
    if (this.esEdicion) {
      this.automotorService.updateAutomotor(this.dominioParam!, createDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Automotor actualizado correctamente'
          });
          this.router.navigate(['/listado']);
        },
        error: (error) => {
          console.error('Error al actualizar automotor:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el automotor'
          });
          this.loading = false;
        }
      });
    } else {
      this.automotorService.createAutomotor(createDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Automotor creado correctamente'
          });
          this.router.navigate(['/listado']);
        },
        error: (error) => {
          console.error('Error al crear automotor:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el automotor'
          });
          this.loading = false;
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/listado']);
  }
}
