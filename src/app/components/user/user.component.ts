import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../Services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  private readonly router = inject(Router);
  private readonly userSrv = inject(UsersService);
  private readonly toastr = inject(ToastrService);
  private readonly activeRoute = inject(ActivatedRoute);

  userId: number | null = 0;
  userUpdateModel: any = {
    userId: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    profile: '',
    roleId: 0,
  };

  model = 'Create New User';
  button = 'Create';
  selectedFile!: File;
  previewUrl: string | null = null;
  newImageUrl = '';
  readonly defaultProfileUrl = '/assets/defaultProfile.jpg';
  imgSrc: string = this.defaultProfileUrl;
  selectedRoleId = '';
  roleData: any[] = [];
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  constructor() {
    const storedId = localStorage.getItem('userId');
    this.userId = storedId ? +storedId : 0;
  }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.model = 'Update User';
        this.button = 'Update';
        this.GetUserById(this.userId);
      }
    });

    this.userSrv.GetAllRole().subscribe({
      next: (res: any) => {
        res.success ? (this.roleData = res.data) : this.toastr.error(res.message, 'Role not fetched');
      },
      error: () => this.toastr.error('An error during fetching role', 'Error'),
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  goBack(){
    this.router.navigateByUrl('/user-list');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file)  {
      this.toastr.error('File not uploaded.');
      return
    }

    if (file.size < 2 * 1024 * 1024) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.imgSrc = this.previewUrl;
      };
      reader.readAsDataURL(file);
    } else {
      this.toastr.error('File is too large. Please select an image under 2MB.');
    }
  }

  ViewProfile(profileUrl: string): void {
    this.imgSrc = profileUrl
      ? 'https://localhost:7244' + profileUrl.replace(/\\/g, '/')
      : this.defaultProfileUrl;
  }

  GetUserById(userId: number): void {
    this.userSrv.GetUserById(userId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userUpdateModel = res.data;
          this.userUpdateModel.confirmPassword = res.data.password;
          this.ViewProfile(res.data.profileUrl);
        } else {
          this.toastr.error(res.message, 'User fetch failed');
        }
      },
      error: () => this.toastr.error('An error occurred while fetching user', 'Error'),
    });
  }

  CreateUpdateUser(): void {

     this.submitted = true;

      if (this.isFormInvalid()) {
    return; // stop submission if validation fails
  }

    const formData = new FormData();
    formData.append('userId', this.userUpdateModel.userId.toString());
    formData.append('firstName', this.userUpdateModel.firstName);
    formData.append('lastName', this.userUpdateModel.lastName);
    formData.append('email', this.userUpdateModel.email);
    formData.append('password', this.userUpdateModel.password);
    formData.append('phone', this.userUpdateModel.phone);
    formData.append('roleId', this.userUpdateModel.roleId.toString());

    if (this.selectedFile) {
      formData.append('profile', this.selectedFile);
    }

    const apiCall = this.userUpdateModel.userId > 0
      ? this.userSrv.UpdateUser(formData)
      : this.userSrv.CreateUser(formData);

    apiCall.subscribe({
      next: (result: any) => {
        if (result.success) {
          this.toastr.success(result.message);
          this.router.navigateByUrl('/user-list');
        } else {
          this.toastr.error(result.message);
        }
      },
      error: () => {
        this.toastr.error('An error occurred during submission', 'Error');
      },
    });
  }

  isFormInvalid(): boolean {
 if (
    !this.userUpdateModel.firstName ||
    !this.userUpdateModel.lastName ||
    !this.userUpdateModel.email ||
    !this.userUpdateModel.phone ||
    !this.userUpdateModel.roleId ||
    !this.isValidEmail(this.userUpdateModel.email) ||
    !this.isValidPhone(this.userUpdateModel.phone)
  ) {
    return true;
  }

  // Extra validation only for Create
  if (this.userUpdateModel.userId === 0) {
    if (
      !this.userUpdateModel.password ||
      !this.userUpdateModel.confirmPassword ||
      this.userUpdateModel.password !== this.userUpdateModel.confirmPassword
    ) {
      return true;
    }
  }

  return false;
}

isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}
}
