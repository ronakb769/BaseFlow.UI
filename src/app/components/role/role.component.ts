import { Component, inject } from '@angular/core';
import { CreateRoleModel,Permission } from '../../Models/Role';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../Services/role.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleId: number | null = 0;
  roleForm!: FormGroup;
  permissions: Permission[] = [];
  permissionControls: { [key: number]: FormControl } = {}; 
  modulePermissions: { [moduleName: string]: Permission[] } = {};
  model:string = 'Create New Role';
  button:string = 'Create Role';
  role:any = {};

  roleSrv = inject(RoleService);
  toastr = inject(ToastrService);
  router = inject(Router);
  fb = inject(FormBuilder);
  private readonly activeRoute = inject(ActivatedRoute);
  

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.roleId = +id;
        this.model = 'Update Role';
        this.button = 'Update';
        this.GetRoleById(this.roleId);
      }
    });

    // this.roleForm = this.fb.group({
    //   roleName: [''],
    //   description: ['']
    // });

    // this.getPermissions();
  }

  // getPermissions(): void {
  //   this.roleSrv.getAllPermissions().subscribe((res: any) => {
  //     console.log(res,"Reponse");
      
  //     if (res.success) {
  //       this.permissions = res.data;

  //   // Reset the permission controls
  //     this.modulePermissions = {};

  //     this.permissions.forEach(p => {
  //       const [moduleName] = p.permissionName.split('.');
        
  //       // Group by module
  //       if (!this.modulePermissions[moduleName]) {
  //         this.modulePermissions[moduleName] = [];
  //       }
  //       this.modulePermissions[moduleName].push(p);

  //       // Add control for each permission
  //       this.permissionControls[p.permissionsId] = new FormControl(false);
  //       this.roleForm.addControl(`perm_${p.permissionsId}`, this.permissionControls[p.permissionsId]);
  //     });
  //   }
  // });
  // }

    GetRoleById(roleId: number): void {
    this.roleSrv.GetUserById(roleId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.role = res.data;
        } else {
          this.toastr.error(res.message, 'User fetch failed');
        }
      },
      error: () => this.toastr.error('An error occurred while fetching user', 'Error'),
    });
  }

  CreateUpdateRole(): void {
    const selectedPermissionIds = this.permissions
      .filter(p => this.permissionControls[p.permissionsId].value)
      .map(p => p.permissionsId);

    const requestBody: CreateRoleModel = {
      roleId: 0,
      roleName: this.roleForm.value.roleName,
      description: this.roleForm.value.description,
      permissionIds: selectedPermissionIds
    };
     console.log(requestBody,"requestBody");
     this.roleSrv.CreateRole(requestBody).subscribe((res: any) => {
        if (res.success === true) {
          this.toastr.success(res.message);
          this.router.navigate(['/role-list']);
        } else {
          this.toastr.error(res.message);
        }
      },(error:any)=>{
       console.error("Error occurred:", error);
       this.toastr.error("An error during update ", "Error");
     });
  }

  GoBack(): void {
    this.router.navigateByUrl('/role-list');
  }
}
