import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { History } from '@model/history';
import { catchError, tap } from 'rxjs';
import { FlashyService } from './flashy.service';
import { Vehicle } from '@model/vehicle';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  public historyData = signal<History[]>([]);
  public prediction = signal<History | null>(null);
  public vehicleDetails = signal<Vehicle | null>(null);
  private readonly _http = inject(HttpClient);
  private readonly _toast = inject(FlashyService);
  private readonly _baseUrl = environment.apiUrl;

  constructor() {
    this.getHistory();
  }

  public getHistory() {
    return this._http
      .get<History[]>(`${this._baseUrl}/predictions/history`, {
        observe: 'response',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      })
      .pipe(
        tap((response: HttpResponse<History[]>) => {
          if (response.status === 200) {
            const resp = response.body;
            if (resp) {
              this.historyData.set(resp);
            }
          }
        }),
        catchError((error) => {
          if (error?.error?.backendMessage) {
            this._toast.error(error.error.backendMessage);
            throw error;
          }
          this._toast.error('Error al obtener el historial');
          console.error('History fetch error:', error);
          throw error;
        })
      )
      .subscribe();
  }

  public predictPrice(vehicle: Vehicle) {
    return this._http
      .post<History>(`${this._baseUrl}/predictions/predict`, vehicle, {
        observe: 'response',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      })
      .pipe(
        tap((response: HttpResponse<History>) => {
          if (response.status === 200) {
            this.getHistory();
            this._toast.success('Predicción realizada exitosamente');
            const resp = response.body;
            console.log('Prediction response:', resp);
            if (resp) {
              this.prediction.set(resp);
            }
          }
        }),
        catchError((error) => {
          this.prediction.set(null);
          if (error?.error?.backendMessage) {
            this._toast.error(error.error.backendMessage);
            throw error;
          }
          this._toast.error('Error al predecir el precio');
          console.error('Prediction error:', error);
          throw error;
        })
      )
      .subscribe();
  }

  public getDetailsPrediction(id: number) {
    return this._http
      .get<Vehicle>(`${this._baseUrl}/predictions/history/${id}`, {
        observe: 'response',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      })
      .pipe(
        tap((response: HttpResponse<Vehicle>) => {
          if (response.status === 200) {
            const resp = response.body;
            if (resp) {
              this.vehicleDetails.set(resp);
            }
          }
        }),
        catchError((error) => {
          this.prediction.set(null);
          if (error?.error?.backendMessage) {
            this._toast.error(error.error.backendMessage);
            throw error;
          }
          this._toast.error('Error al obtener los detalles de la predicción');
          console.error('Prediction details error:', error);
          throw error;
        })
      )
      .subscribe();
  }
}
