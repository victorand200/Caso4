import { CommonModule } from '@angular/common';
import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '@app/shared/history.service';
import { History } from '@model/history';
import { VehicleCreateModalComponent } from '../vehicle-create-modal/vehicle-create-modal.component';
import { VehicleModalComponent } from '../vehicle-modal/vehicle-modal.component';
import { Vehicle } from '@model/vehicle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    VehicleCreateModalComponent,
    VehicleModalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent {
  private readonly _historySvc = inject(HistoryService);
  protected history = this._historySvc.historyData();
  protected predictResult = this._historySvc.prediction();
  protected vehicleDetails = this._historySvc.vehicleDetails();

  constructor() {
    effect(() => {
      this.history = this._historySvc.historyData();
      this.predictResult = this._historySvc.prediction();
      this.vehicleDetails = this._historySvc.vehicleDetails();
    })
  }

  paginatedHistory: History[] = [];

  loading = false;
  selectedUsers: number[] = [];

  // Ordenamiento
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  showViewModal = false;
  showPredictionModal = false;

  onSaveVehicle(vehicleData: any) {
    // Crear nuevo vehículo
    alert('Vehículo guardado exitosamente: ' + JSON.stringify(vehicleData));
  }

  closeViewModal() {
    this.showViewModal = false;
  }

  closeFormModal() {
    this._historySvc.prediction.set(null);
    this.showPredictionModal = false;
  }

  // Ordenamiento
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.history.sort((a, b) => {
      let valueA = (a as any)[column];
      let valueB = (b as any)[column];

      // Manejar fechas
      if (column === 'fechaRegistro') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      // Manejar strings
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.updatePagination();
  }

  // Paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.history.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedHistory = this.history.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  getVisiblePages(): number[] {
    const delta = 2;
    const range = Math.min(delta * 2 + 1, this.totalPages);
    const start = Math.max(
      1,
      Math.min(this.currentPage - delta, this.totalPages - range + 1)
    );

    return Array.from({ length: range }, (_, i) => start + i);
  }

  getStartRecord(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.history.length);
  }

  // Métodos para acciones
  openModal() {
    this.showPredictionModal = true;
  }

  openViewModal() {
    this.showViewModal = true;
  }

  viewHistory(id: number) {
    this.openViewModal();
    this._historySvc.getDetailsPrediction(id);
  }

  onSavePrediction(vehicle: Vehicle) {  
    this._historySvc.predictPrice(vehicle);
    this.showPredictionModal = true;
  }

  exportData() {
    console.log('Exportar datos');
    const dataStr = JSON.stringify(this.history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historial.json';
    link.click();
  }
}
