import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../Services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

editMode = false;
user: any = {}; // actual user data
editableUser: any = {}; // cloned for editing
previewUrl: string | ArrayBuffer | null = null;
selectedImageFile: File | null = null;
showPassword = false;

private userService = inject(UsersService); 
private toastr = inject(ToastrService);


  ngOnInit(): void {
     const storedUser = localStorage.getItem('userData');
  if (storedUser) {
    this.user = JSON.parse(storedUser);
    this.user.profileUrl = "https://localhost:7244" + this.user.profileUrl; // Assuming profileUrl is a relative path
    this.editableUser = { ...this.user };
  }
}

onImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
  this.previewUrl = e.target!.result as string | ArrayBuffer;
};
    reader.readAsDataURL(file);
  }
}

cancelEdit(): void {
  this.editableUser = { ...this.user };
  this.editMode = false;
  this.previewUrl = null;
  this.selectedImageFile = null;
}

  togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
  }
  saveProfile(): void {
  const formData = new FormData();
  formData.append('userId', this.editableUser.userId);
  formData.append('firstName', this.editableUser.firstName);
  formData.append('lastName', this.editableUser.lastName);
  formData.append('email', this.editableUser.email);
  formData.append('phone', this.editableUser.phone);
  formData.append('roleId', this.editableUser.roleId);
  if (this.editableUser.password) {
    formData.append('password', this.editableUser.password);
  }
  if (this.selectedImageFile) {
    formData.append('profileImage', this.selectedImageFile);
  }

  // send formData to API
  this.userService.UpdateUser(formData).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.toastr.success(result.message);
        } else {
          this.toastr.error(result.message);
        }
      },
      error: () => {
        this.toastr.error('An error occurred during submission', 'Error');
      },
  })

  this.user = { ...this.editableUser };
  this.editMode = false;
  this.previewUrl = null;
  this.selectedImageFile = null;
}
}
