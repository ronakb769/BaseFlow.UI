import { AfterViewInit, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent  {
  router = inject(Router);
  loginService = inject(LoginService);
  userName:string = '';
  dropdownOpen: boolean = false;
  email: string = '';

   @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;
  dropdownInstance: any;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      // this.userName = parsedUserData.firstName + " " + parsedUserData.lastName || 'User';
      this.email = parsedUserData.email || '';
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.dropdownOpen = !this.dropdownOpen;
  }

  constructor() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      this.userName = parsedUserData.firstName +" "+ parsedUserData.lastName || 'User';
    } else {
      this.userName = 'User';
    }
  }

  logout() {
    console.log('Logout clicked');
    this.loginService.logout().subscribe({next: (res: any) => {
        if (res.success) {
          localStorage.removeItem('token');
          console.log('User logged out successfully');
        } else {
          console.log('User fetch failed');
        }
      },
      error: () => console.log('An error occurred while fetching user', 'Error'),
    });

    this.router.navigateByUrl('/login');
  }

  Update() {
    console.log('Update clicked');
  }

  resetPassword(){
     this.router.navigate(['/resetpassword'], { queryParams: { email: this.email } });
  }
}
