import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

BASE_URL = 'https://localhost:7244/api/';
  http = inject(HttpClient);
  headers: any = '';
  token: any = localStorage.getItem('token');

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  GetAllRole(request: any){ 
    return this.http.post(`${this.BASE_URL}role/GetAllRoles`,request, { headers: this.getAuthHeaders() });
  } 
  GetUserById(id: number){
    return this.http.get(`${this.BASE_URL}role/GetRoleById/?roleId=${id}`, { headers: this.getAuthHeaders() });
  }
  
  CreateRole(role: any) {
    return this.http.post(`${this.BASE_URL}role/CreateRole`, role, { headers: this.getAuthHeaders() });
  }

  getAllPermissions(){
    return this.http.get(`${this.BASE_URL}Permission/GetAllPermission`, { headers: this.getAuthHeaders() });
  }

   DeleteRole(id: number) {
    return this.http.delete(`${this.BASE_URL}role/DeleteRole?roleId=${id}`, { headers: this.getAuthHeaders() });
  }
}
