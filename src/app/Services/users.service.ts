import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
 BASE_URL = 'https://localhost:7244/api/';
  http = inject(HttpClient);
  headers: any = '';
  token: any = localStorage.getItem('token');

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  GetAllUsers(request: any) {
    return this.http.post(`${this.BASE_URL}user/GetAllUser`,request, { headers: this.getAuthHeaders() });
  }

  GetUserById(id: number){
    return this.http.get(`${this.BASE_URL}user/GetUserById/?userId=${id}`, { headers: this.getAuthHeaders() });
  }

  GetAllRole(request:any){ 
    return this.http.post(`${this.BASE_URL}role/GetAllRoles`,request, { headers: this.getAuthHeaders() });
   }

  CreateUser(user: any) {
    return this.http.post(`${this.BASE_URL}user/CreateUser`, user, { headers: this.getAuthHeaders() });
  }

  UpdateUser(user: any) {
    return this.http.post(`${this.BASE_URL}user/UpdateUser`, user, { headers: this.getAuthHeaders() });
  }

  DeleteUser(id: number) {
    return this.http.delete(`${this.BASE_URL}user/DeleteUser?userId=${id}`, { headers: this.getAuthHeaders() });
  }

  updateUserStatus(userId: number, isActive: boolean) {
    return this.http.put(`${this.BASE_URL}user/UpdateUserStatus?userId=${userId}&isActive=${isActive}`,{ headers: this.getAuthHeaders() });
  }
}
