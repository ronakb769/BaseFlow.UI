import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../Services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any; // Required to access Bootstrap Modal class

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent  {

  email: string = '';

  router = inject(Router);
  toastr = inject(ToastrService);

  constructor(private loginSrv: LoginService) {}

  onResetPassword() {
    this.loginSrv.CheckEmailExists(this.email).subscribe((res: any) => {
      if (res.success) {
        this.router.navigate(['/resetpassword'], { queryParams: { email: this.email } });
      } else {
        this.toastr.error('Email not found');
      }
    },(error:any) => {
      this.toastr.error('An error occurred while checking the email');      
    });
  }
}
