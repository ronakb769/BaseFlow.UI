import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  BASE_URL = 'https://localhost:7244/api/';
    http = inject(HttpClient);
    headers: any = '';
    token: any = localStorage.getItem('token');
  
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }


    GetAllDashboard(){
      return this.http.get(`${this.BASE_URL}Dashboard/GetUserCount`, { headers: this.getAuthHeaders() });
    }
}
