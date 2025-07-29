import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PostAuthResponse } from '@app/models/auth';
import { UserRegisterRequest, UserRequest } from '@app/models/user-request';
import { environment } from '@env/environment';
import { catchError, tap } from 'rxjs';
import { FlashyService } from './flashy.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authResponse = signal<PostAuthResponse | null>(null);
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = environment.apiUrl;
  private readonly _toast = inject(FlashyService);

  public signIn(userrequest: UserRequest) {
    return this._http
      .post<PostAuthResponse>(`${this._baseUrl}/auth/sign-in`, userrequest, {
        observe: 'response',
      })
      .pipe(
        tap((response: HttpResponse<PostAuthResponse>) => {
          if (response.status === 200) {
            const resp = response.body;
            if (resp) {
              this._toast.success('Login successful');
              this._storeToken(resp.accessToken);
              this.authResponse.set(resp);
            }
          }
        }),
        catchError((error) => {
          this.authResponse.set(null);
          if (error?.error?.backendMessage) {
            this._toast.error(error.error.backendMessage);
            throw error;
          }

          this._toast.error('Ocurrió un error en el registro');
          console.error('Signup error:', error);
          throw error;
        })
      )
      .subscribe();
  }

  public signUp(userRequest: UserRegisterRequest) {
    return this._http
      .post<PostAuthResponse>(`${this._baseUrl}/auth/register`, userRequest, {
        observe: 'response',
      })
      .pipe(
        tap((response: HttpResponse<PostAuthResponse>) => {
          if (response.status === 200 || response.status === 201) {
            this._toast.success('Te has registrado correctamente');
            console.log('Response:', response);
            const resp = response.body;
            if (resp) {
              this._storeToken(resp.accessToken);
              this.authResponse.set(resp);
            }
          }
        }),
        catchError((error) => {
          this.authResponse.set(null);
          if (error?.error?.backendMessage) {
            this._toast.error(error.error.backendMessage);
            throw error;
          }

          this._toast.error('Ocurrió un error en el registro');
          console.error('Signup error:', error);
          throw error;
        })
      )
      .subscribe();
  }

  private _storeToken(token: string) {
    sessionStorage.setItem('token', token);
  }
}
