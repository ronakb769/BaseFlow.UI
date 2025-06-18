import { Component, inject } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Role } from '../../Models/Role';
import { FormsModule } from '@angular/forms';
import { CommonModule,DatePipe } from '@angular/common';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [DatePipe,FormsModule,CommonModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {

  roles: Role[] = [];
  selectedRoleId: number | null = null;

  roleSrv = inject(RoleService);
  toastr = inject(ToastrService);
  router = inject(Router);


  ngOnInit(): void {

    this.roleSrv.GetAllRole().subscribe((res: any) => {
      if (res.success === true) {
        this.roles = res.data;
      } else {
        this.toastr.error(res.message);
      }
    },
    (error: any) => {
      this.toastr.error('Failed to fetch users');
    }
    )
}
openUserModal(){
  this.router.navigate(['/role-create']);
}

editRole(role: Role) {
  this.router.navigate(['/role-edit', role.roleId]);
}

}
