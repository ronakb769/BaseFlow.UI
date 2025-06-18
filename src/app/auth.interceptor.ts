import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { LoginService } from '../app/Services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  loginSrv = inject(LoginService);

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // 🔐 Attach token to request if available
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && localStorage.getItem('refreshToken')) {

          return this.loginSrv.refreshToken().pipe(
            switchMap((res: any) => {
              if (res.success) {
                
                // Store new tokens
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('refreshToken', res.data.refreshToken);

                // Retry original request with new token
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.data.token}` }
                });

                return next.handle(retryReq);
              } else {
                this.loginSrv.clearSession();
                return throwError(() => new Error('Refresh token invalid. Logging out.'));
              }
            }),
            catchError(refreshErr => {
                
              this.loginSrv.clearSession();
              return throwError(() => new Error('Session expired. Please login again.'));
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}