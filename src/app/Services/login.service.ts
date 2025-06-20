import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login } from '../Models/Login';
import { Observable, switchMap,map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  BASE_URL = 'https://localhost:7244/api/';
  http = inject(HttpClient);
  headers: any = '';
  token: any = localStorage.getItem('token');

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Utility to get client IP
  private getClientIp(): Observable<string> {
  return this.http
    .jsonp<{ ip: string }>('https://api.ipify.org?format=jsonp', 'callback')
    .pipe(map(res => res.ip));
}

  Login(loginModel: Login) {
    return this.getClientIp().pipe(
      switchMap((ip) => {
        const headers = new HttpHeaders({
          'Client-IP': ip,
        });
       
        return this.http.post(`${this.BASE_URL}Login/Token`, loginModel, {
          headers,
        });
      })
    );
  }

  CheckEmailExists(email: string) {
    return this.http.get(
      `${this.BASE_URL}Login/CheckEmail?emailAddress=${email}`
    );
  }

  ResetPassword(payload: { email: string; password: string }) {
    return this.http.post(`${this.BASE_URL}Login/ResetPassword`, payload);
  }

  logout() {
     return this.http.get(`${this.BASE_URL}login/Logout`, { headers: this.getAuthHeaders() });
  }

  getLoginHistory(request:any) {
    return this.http.post(`${this.BASE_URL}LoginHistory/GetLoginHistory`,request, { headers: this.getAuthHeaders() });
  }

  getAllUserNames(){
    return this.http.get(`${this.BASE_URL}LoginHistory/GetAllUserNames`, { headers: this.getAuthHeaders() });
  }

  refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const token = localStorage.getItem('token');
  
   const tokenApiModel = {
    AccessToken: token,
    RefreshToken: refreshToken
  };

  return this.http.post(`${this.BASE_URL}Login/RefreshToken`, tokenApiModel);
}

clearSession() {
  localStorage.clear();
  window.location.href = '/login';
}

getAppSettings(){
  return this.http.get(`${this.BASE_URL}AppSettings/GetCaptchaStatus`);
}
}

