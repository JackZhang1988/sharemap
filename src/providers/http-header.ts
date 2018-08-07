import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthServiceProvider } from './auth';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
    constructor(private auth:AuthServiceProvider){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return Observable.fromPromise(this.handleAccess(req, next));
    }
    private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        let userId = await this.auth.getUserId();
        if (userId) {
            const modified = req.clone({ setHeaders: { 'X-User-Id': userId } });
            return next.handle(modified).toPromise();
        } else {
            return next.handle(req).toPromise();
        }
    }
}
