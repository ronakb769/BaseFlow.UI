import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  BASE_URL = 'https://localhost:7244/api/';
    http = inject(HttpClient);
    headers: any = '';
    token: any = localStorage.getItem('token');
  
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    GetAppSettings(request: any) {
      return this.http.post(`${this.BASE_URL}AppSettings/GetAllAppSettings`,request);
    }

    updateSetting(setting: any) {
      return this.http.post(`${this.BASE_URL}AppSettings/UpdateAppSettings`, setting);
    }

    getSettingById(id: string) {
      return this.http.get(`${this.BASE_URL}AppSettings/GetAppSettingById?id=${id}`);
    }
}
