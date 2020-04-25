import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string, token:string) {
        console.log ("token:" + token)
        return this.http.post<any>(`${environment.apiBaseUrl}v1/users/authenticate`, { username, password, token })
            .pipe(map(user => {
                // login successful if there's a user in the response
                if (user) {
                    // store user details and basic auth credentials in local storage 
                    // to keep user logged in between page refreshes
                    user.authdata = window.btoa(username + ':' + password);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    async encodeToken(uuid:string): Promise <any> {
        const response = await this.http.post (`${environment.apiBaseUrl}v1/tokens/encode`, { uuid}).toPromise();
        return response;
    }
}