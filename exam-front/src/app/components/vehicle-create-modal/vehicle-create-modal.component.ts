import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HistoryService } from '@app/shared/history.service';
import { History } from '@model/history';
import { Vehicle } from '@model/vehicle';

@Component({
  selector: 'app-vehicle-create-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: ` <!-- Backdrop -->
    @if (isOpen()) {
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 transition-opacity duration-300"
    >
      <!-- Modal Container -->
      <div
        class="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between pb-4 border-b border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-900">
            {{ 'Predecir precio de Vehículo' }}
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

        <!-- Form Content -->
        <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()" class="py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Información Básica -->
            <div class="space-y-4">
              <h4 class="text-md font-semibold text-gray-900 border-b pb-2">
                Información Básica
              </h4>

              <!-- Marca -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Marca *</label
                >
                <select
                  formControlName="brand"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('brand')?.invalid &&
                    vehicleForm.get('brand')?.touched
                  "
                >
                  <option value="" selected>Selecciona una marca</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                </select>
                @if (vehicleForm.get('brand')?.invalid &&
                vehicleForm.get('brand')?.touched) {

                <div class="mt-1 text-sm text-red-600">
                  La marca es requerida
                </div>
                }
              </div>

              <!-- Año -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Año de Fabricación *</label
                >
                <input
                  type="number"
                  formControlName="make_year"
                  placeholder="2020"
                  min="1980"
                  [max]="getMaxYear()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('make_year')?.invalid &&
                    vehicleForm.get('make_year')?.touched
                  "
                />
                @if (vehicleForm.get('make_year')?.invalid &&
                vehicleForm.get('make_year')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if (vehicleForm.get('make_year')?.errors?.['required']){
                  <span>El año es requerido</span>
                  } @if (vehicleForm.get('make_year')?.errors?.['min']){
                  <span>El año debe ser mayor a 1980</span>
                  } @if (vehicleForm.get('make_year')?.errors?.['max']){
                  <span>El año no puede ser mayor al que nos encontramos</span>
                  }
                </div>
                }
              </div>

              <!-- Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Color *</label
                >
                <select
                  formControlName="color"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('color')?.invalid &&
                    vehicleForm.get('color')?.touched
                  "
                >
                  <option value="" selected>Selecciona un color</option>
                  <option value="White">Blanco</option>
                  <option value="Black">Negro</option>
                  <option value="Silver">Plateado</option>
                  <option value="Gray">Gris</option>
                  <option value="Red">Rojo</option>
                  <option value="Blue">Azul</option>
                  <option value="Green">Verde</option>
                  <option value="Yellow">Amarillo</option>
                  <option value="Brown">Café</option>
                </select>
                @if (vehicleForm.get('color')?.invalid &&
                vehicleForm.get('color')?.touched){
                <div class="mt-1 text-sm text-red-600">
                  El color es requerido
                </div>
                }
              </div>

              <!-- Tipo de Combustible -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Combustible *</label
                >
                <select
                  formControlName="fuel_type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('fuel_type')?.invalid &&
                    vehicleForm.get('fuel_type')?.touched
                  "
                >
                  <option value="" selected>Selecciona combustible</option>
                  <option value="Petrol">Gasolina</option>
                  <option value="Diesel">Diésel</option>
                  <option value="Hybrid">Híbrido</option>
                  <option value="Electric">Eléctrico</option>
                </select>
                @if (vehicleForm.get('fuel_type')?.invalid &&
                vehicleForm.get('fuel_type')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  El tipo de combustible es requerido
                </div>
                }
              </div>

              <!-- Transmisión -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Transmisión *</label
                >
                <select
                  formControlName="transmission"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('transmission')?.invalid &&
                    vehicleForm.get('transmission')?.touched
                  "
                >
                  <option value="" selected>Selecciona transmisión</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automática</option>
                </select>
                @if (vehicleForm.get('transmission')?.invalid &&
                vehicleForm.get('transmission')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  La transmisión es requerida
                </div>
                }
              </div>

              @if (predictResult() !== null) {
              <!-- Prediccion -->
              <div class="w-full">
                <p>Predicción de Keras:</p>
                <br />
                <div
                  class="w-full text-center rounded-md bg-gray-600 px-10 py-2 font-bold text-white transition-colors hover:bg-gray-700"
                >
                  {{ predictResult()?.kerasPrediction }}
                </div>
              </div>

              <!-- Prediccion -->
              <div class="w-full">
                <p>Predicción del modelo Lineal:</p>
                <br />
                <div
                  class="w-full text-center rounded-md bg-gray-600 px-10 py-2 font-bold text-white transition-colors hover:bg-gray-700"
                >
                  {{ predictResult()?.linearPrediction }}
                </div>
              </div>
              }
            </div>

            <!-- Especificaciones Técnicas -->
            <div class="space-y-4">
              <h4 class="text-md font-semibold text-gray-900 border-b pb-2">
                Especificaciones
              </h4>

              <!-- Motor CC -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Motor (CC) *</label
                >
                <input
                  type="number"
                  formControlName="engine_cc"
                  placeholder="2000"
                  min="500"
                  max="8000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('engine_cc')?.invalid &&
                    vehicleForm.get('engine_cc')?.touched
                  "
                />
                @if (vehicleForm.get('engine_cc')?.invalid &&
                vehicleForm.get('engine_cc')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if (vehicleForm.get('engine_cc')?.errors?.['required']) {
                  <span>La cilindrada es requerida</span>
                  } @if (vehicleForm.get('engine_cc')?.errors?.['min']) {
                  <span>Mínimo 500 cc</span>
                  } @if (vehicleForm.get('engine_cc')?.errors?.['max']) {
                  <span>Máximo 8000 cc</span>
                  }
                </div>
                }
              </div>

              <!-- Kilometraje -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Kilometraje (km/l) *</label
                >
                <input
                  type="number"
                  formControlName="mileage_kmpl"
                  placeholder="15.5"
                  min="1"
                  max="50"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('mileage_kmpl')?.invalid &&
                    vehicleForm.get('mileage_kmpl')?.touched
                  "
                />
                @if (vehicleForm.get('mileage_kmpl')?.invalid &&
                vehicleForm.get('mileage_kmpl')?.touched) {

                <div class="mt-1 text-sm text-red-600">
                  @if (vehicleForm.get('mileage_kmpl')?.errors?.['required']) {
                  <span>El kilometraje es requerido</span>
                  } @if (vehicleForm.get('mileage_kmpl')?.errors?.['min']) {
                  <span>Mínimo 1 km/l</span>
                  } @if (vehicleForm.get('mileage_kmpl')?.errors?.['max']) {
                  <span>Máximo 50 km/l</span>
                  }
                </div>
                }
              </div>

              <!-- Número de Propietarios -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Número de Propietarios *</label
                >
                <input
                  type="number"
                  formControlName="owner_count"
                  placeholder="2"
                  min="1"
                  max="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('owner_count')?.invalid &&
                    vehicleForm.get('owner_count')?.touched
                  "
                />
                @if (vehicleForm.get('owner_count')?.invalid &&
                vehicleForm.get('owner_count')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if (vehicleForm.get('owner_count')?.errors?.['required']) {
                  <span>El número de propietarios es requerido</span>
                  } @if (vehicleForm.get('owner_count')?.errors?.['min']) {
                  <span>Mínimo 1 propietario</span>
                  } @if (vehicleForm.get('owner_count')?.errors?.['max']) {
                  <span>Máximo 10 propietarios</span>
                  }
                </div>
                }
              </div>

              <!-- Accidentes Reportados -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Accidentes Reportados *</label
                >
                <input
                  type="number"
                  formControlName="accidents_reported"
                  placeholder="0"
                  min="0"
                  max="20"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('accidents_reported')?.invalid &&
                    vehicleForm.get('accidents_reported')?.touched
                  "
                />
                @if (vehicleForm.get('accidents_reported')?.invalid &&
                vehicleForm.get('accidents_reported')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if
                  (vehicleForm.get('accidents_reported')?.errors?.['required'])
                  {
                  <span>Este campo es requerido</span>
                  } @if (vehicleForm.get('accidents_reported')?.errors?.['min'])
                  {
                  <span>No puede ser negativo</span>
                  }
                </div>
                }
              </div>

              <!-- Historial de Servicio -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Historial de Servicio *</label
                >
                <select
                  formControlName="service_history"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('service_history')?.invalid &&
                    vehicleForm.get('service_history')?.touched
                  "
                >
                  <option value="" selected>Selecciona historial</option>
                  <option value="Full">Completo</option>
                  <option value="Partial">Parcial</option>
                  <option value="None">Ninguno</option>
                </select>
                @if (vehicleForm.get('service_history')?.invalid &&
                vehicleForm.get('service_history')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  El historial de servicio es requerido
                </div>
                }
              </div>

              <!-- Seguro Vigente -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Seguro Vigente *</label
                >
                <select
                  formControlName="insurance_valid"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  [class.border-red-500]="
                    vehicleForm.get('insurance_valid')?.invalid &&
                    vehicleForm.get('insurance_valid')?.touched
                  "
                >
                  <option value="" selected>Selecciona opción</option>
                  <option value="Yes">Sí</option>
                  <option value="No">No</option>
                </select>
                @if (vehicleForm.get('insurance_valid')?.invalid &&
                vehicleForm.get('insurance_valid')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  Indica si el seguro está vigente
                </div>
                }
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex justify-end pt-6 border-t border-gray-200 space-x-3 mt-6"
          >
            <button [disabled]="predictResult() !== null"
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="vehicleForm.invalid || isLoading || predictResult() !== null"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              @if (!isLoading) {
              <span>Predecir</span>
              } @else{
              <span class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Prediciendo...
              </span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
    }`,
})
export class VehicleCreateModalComponent {
  isOpen = input<boolean>(false);
  closeEvent = output<void>();
  predictEvent = output<Vehicle>();
  predictResult = input<History | null>(null);

  fb = inject(FormBuilder);
  isLoading = false;

  constructor() {
    effect(() => {
      const result = this.predictResult();

      if (result !== null) {
        this.vehicleForm.disable();
      } else {
        this.vehicleForm.enable();
      }
    })
  }

  vehicleForm = this.fb.group({
    make_year: [
      '',
      [
        Validators.required,
        Validators.min(1980),
        Validators.max(new Date().getFullYear()),
      ],
    ],
    mileage_kmpl: [
      '',
      [Validators.required, Validators.min(1), Validators.max(50)],
    ],
    engine_cc: [
      '',
      [Validators.required, Validators.min(500), Validators.max(8000)],
    ],
    fuel_type: ['', [Validators.required]],
    owner_count: [
      '',
      [Validators.required, Validators.min(1), Validators.max(10)],
    ],
    brand: ['', [Validators.required]],
    transmission: ['', [Validators.required]],
    color: ['', [Validators.required]],
    accidents_reported: ['', [Validators.required, Validators.min(0)]],
    service_history: ['', [Validators.required]],
    insurance_valid: ['', [Validators.required]],
  });

  closeModal() {
    this.closeEvent.emit();
    this.vehicleForm.reset();
    this.isLoading = false;
    this.vehicleForm.enable();
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      this.isLoading = true;

      const formData = this.vehicleForm.value;

      if (!formData) {
        this.isLoading = false;
        return;
      }
      const vehicle: Vehicle = {
        make_year: Number(formData.make_year),
        mileage_kmpl: Number(formData.mileage_kmpl),
        engine_cc: Number(formData.engine_cc),
        fuel_type: formData.fuel_type!,
        owner_count: Number(formData.owner_count),
        brand: formData.brand!,
        transmission: formData.transmission!,
        color: formData.color!,
        accidents_reported: Number(formData.accidents_reported),
        service_history: formData.service_history!,
        insurance_valid: formData.insurance_valid!,
      };

      this.predictEvent.emit(vehicle);

      this.isLoading = false;
    } else {
      Object.keys(this.vehicleForm.controls).forEach((key) => {
        this.vehicleForm.get(key)?.markAsTouched();
      });
    }
  }

  getMaxYear(): number {
    return new Date().getFullYear();
  }
}
