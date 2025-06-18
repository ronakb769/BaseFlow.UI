import { Component, inject } from '@angular/core';
import { Login } from '../../Models/Login';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../Services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginForm: FormGroup;
  captchaEnabled: boolean = false;
  submitted = false;  // <== Add this flag

  toastr = inject(ToastrService);
  router = inject(Router);

  constructor(private fb: FormBuilder, private loginSrv: LoginService) {
     this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      captcha: ['']
    });
  }

  ngOnInit(): void {
     this.loginSrv.getAppSettings().subscribe({
      next: (result: any) => {
        if (result.success && Array.isArray(result.data)) {
          const captchaSetting = result.data.find((x: any) => x.key === 'EnableCaptcha');
          this.captchaEnabled = captchaSetting?.value === 'true';
        }
      },
      error: () => {
        this.toastr.error("Failed to load application settings.");
      }
    });
  }

  get email() {
     return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onLogin() {
   this.submitted = true;  // Set submitted to true on submit

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }


     const loginModel = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

     this.loginSrv.Login(loginModel).subscribe(
      (res: any) => {
        if (res.success === true) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          localStorage.setItem('userData', JSON.stringify(res.data.userData));
          this.toastr.success(res.message);
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(res.message);
        }
      },
      (error: any) => {
        this.toastr.error('Login Failed');
      }
    );
  }

  
  ForgetPassword() {
    this.router.navigate(['/forgetpassword']);
  }
}
