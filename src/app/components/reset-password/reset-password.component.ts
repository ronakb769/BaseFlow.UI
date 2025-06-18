import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../Services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  router = inject(Router);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);

  constructor(private loginSrv: LoginService) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    const payload = {
      email: this.email,
      password: this.password
    };

    this.loginSrv.ResetPassword(payload).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Password reset successfully');
        this.router.navigate(['/login']);
      } else {
        this.toastr.error(res.message);
      }
    });
  }
}
