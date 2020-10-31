
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ErrorComponent } from './error/error.component';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor{


    constructor(public dialogue: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler){
        return next.handle(req).pipe(catchError((error: HttpErrorResponse  ) =>{
                console.log(error);
                let errorMessage = "An Unknown Error Occured";
                if(error.error.message){
                    errorMessage = error.error.message;
                }
                this.dialogue.open(ErrorComponent, {data: { message: errorMessage }});
                return throwError(error);
                
            })  
        )
    }
}