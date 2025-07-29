import { Component, input, output } from '@angular/core';
import { Vehicle } from '@model/vehicle';

@Component({
  selector: 'app-vehicle-modal',
  standalone: true,
  imports: [],
  template: ` @if (isOpen()) {
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 transition-opacity duration-300"
    >
      <!-- Modal Container -->
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-lg bg-white"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between pb-4 border-b border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Detalles del Vehículo
          </h3>
          <button
            (click)="closeModal()"
            class="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        @if (vehicle()) {
        <div class="py-4">
          <!-- Vehicle Header Info -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6"
          >
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div
                  class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-8 h-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-900">
                  {{ vehicle()?.brand }} {{ vehicle()?.make_year }}
                </h4>
                <p class="text-sm text-gray-600">
                  {{ vehicle()?.color }} • {{ vehicle()?.transmission }} •
                  {{ vehicle()?.fuel_type }}
                </p>
              </div>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Información Básica -->
            <div class="space-y-4">
              <h5 class="text-lg font-semibold text-gray-900 border-b pb-2">
                Información Básica
              </h5>

              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500">Marca:</span>
                  <span class="text-sm text-gray-900 font-semibold">{{
                    vehicle()?.brand
                  }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500">Año:</span>
                  <span class="text-sm text-gray-900 font-semibold">{{
                    vehicle()?.make_year
                  }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500">Color:</span>
                  <span class="text-sm text-gray-900 font-semibold">{{
                    vehicle()?.color
                  }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500"
                    >Combustible:</span
                  >
                  <span class="text-sm text-gray-900 font-semibold">{{
                    vehicle()?.fuel_type
                  }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500"
                    >Transmisión:</span
                  >
                  <span class="text-sm text-gray-900 font-semibold">{{
                    vehicle()?.transmission
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Especificaciones Técnicas -->
            <div class="space-y-4">
              <h5 class="text-lg font-semibold text-gray-900 border-b pb-2">
                Especificaciones
              </h5>

              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500"
                    >Motor (CC):</span
                  >
                  <span class="text-sm text-gray-900 font-semibold"
                    >{{ vehicle()?.engine_cc }} cc</span
                  >
                </div>

                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500"
                    >Kilometraje:</span
                  >
                  <span class="text-sm text-gray-900 font-semibold"
                    >{{ vehicle()?.mileage_kmpl }} km/l</span
                  >
                </div>

                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500"
                    >Propietarios:</span
                  >
                  <span class="text-sm text-gray-900 font-semibold">{{
                    vehicle()?.owner_count
                  }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500"
                    >Accidentes:</span
                  >
                  <span
                    class="text-sm font-semibold"
                    [class.text-green-600]="vehicle()?.accidents_reported === 0"
                    [class.text-red-600]="
                      vehicle() && vehicle()!.accidents_reported > 0
                    "
                  >
                    {{
                      vehicle()?.accidents_reported === 0
                        ? 'Sin accidentes'
                        : vehicle()?.accidents_reported + ' reportados'
                    }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500"
                    >Historial de Servicio:</span
                  >
                  <span
                    class="text-sm font-semibold"
                    [class.text-green-600]="
                      vehicle()?.service_history === 'Full'
                    "
                    [class.text-yellow-600]="
                      vehicle()?.service_history === 'Partial'
                    "
                    [class.text-red-600]="
                      vehicle()?.service_history === 'None'
                    "
                  >
                    {{ getServiceHistoryLabel(vehicle()?.service_history) }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500"
                    >Seguro Vigente:</span
                  >
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    [class.bg-green-100]="vehicle()?.insurance_valid === 'Yes'"
                    [class.text-green-800]="
                      vehicle()?.insurance_valid === 'Yes'
                    "
                    [class.bg-red-100]="vehicle()?.insurance_valid === 'No'"
                    [class.text-red-800]="vehicle()?.insurance_valid === 'No'"
                  >
                    {{ vehicle()?.insurance_valid === 'Yes' ? 'Sí' : 'No' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
    }`,
})
export class VehicleModalComponent {
  isOpen = input<boolean>(false);
  vehicle = input<Vehicle | null>();
  closeEvent = output<void>();

  closeModal() {
    this.closeEvent.emit();
  }

  getServiceHistoryLabel(history?: string): string {
    switch (history) {
      case 'Full':
        return 'Completo';
      case 'Partial':
        return 'Parcial';
      case 'None':
        return 'N/A';
      default:
        return history || 'N/A';
    }
  }
}
