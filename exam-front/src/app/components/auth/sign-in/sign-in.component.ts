import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/auth.service';
import { FlashyService } from '@app/shared/flashy.service';
import { UserRequest } from '@model/user-request';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export default class SignInComponent {
  fb = inject(FormBuilder);
  _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _toast = inject(FlashyService);

  constructor() {
    effect(() => {
      const resp = this._authService.authResponse();
      if (resp) {
        this.messageType = 'success';
        this.message = 'Inicio de sesión exitoso. Redirigiendo...';
        this.loginForm.reset();
        this.goToDashboard();
      }
    });
  }

  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      const userRequest: UserRequest = {
        email: formData.email!,
        password: formData.password!,
      };

      this._authService.signIn(userRequest);
      
      this.isLoading = false;
    }
  }

  goToRegister() {
    this._router.navigate(['/register']);
  }

  goToDashboard() {
    this._router.navigate(['/home']);
  }
}
