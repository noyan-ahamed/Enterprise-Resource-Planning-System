import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { UserAuthService } from "../services/user-auth-service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private userAuth: UserAuthService,
        private router: Router
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
          console.log('INTERCEPTOR WORKING');
        if (req.headers.get('No-Auth') === 'True') {
            return next.handle(req.clone());
        }

        const token = this.userAuth.getToken();

        if (token) {
            req = this.addToken(req, token);
        }

        return next.handle(req).pipe(
            catchError(
                (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.router.navigate(['/login-component']);
                    } else if (err.status === 403) {
                        this.router.navigate(['/forbidden']);
                    }

                    return throwError(() => err);

                }
            )
        )
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone(
            {
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

}