import { Component, effect, inject } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/auth.service';
import { UserRegisterRequest } from '@model/user-request';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export default class SignUpComponent {
  fb = inject(FormBuilder);
  _router = inject(Router);
  private readonly _authService = inject(AuthService);

  constructor() {
    effect(() => {
      const resp = this._authService.authResponse();
      if (resp) {
        this.messageType = 'success';
        this.message = 'Usuario registrado exitosamente. Redirigiendo...';
        this.registerForm.reset();
        this.isLoading = false;
        this.goToLogin();
      }
    });
  }

  registerForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.message = '';

      const formData = this.registerForm.value;

      const userRequest: UserRegisterRequest = {
        name: formData.nombre!,
        lastName: formData.apellido!,
        username: formData.email!,
        password: formData.password!,
        email: formData.email!,
      };

      this._authService.signUp(userRequest);

      this.isLoading = false;
    }
  }

  goToLogin() {
    this._router.navigate(['/login']);
  }
}
