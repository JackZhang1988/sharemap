import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { JwtHelper } from "angular2-jwt";


const SERVER_URL = 'localhost:3000';

@Injectable()
export class AuthServiceProvider {

  public token: any;

  constructor(
    private readonly storage: Storage,
    private readonly jwtHelper: JwtHelper) {
  }

  checkLogin() {
    return new Promise((resolve, reject) => {

      this.storage.get('token').then(jwt => {

        if (jwt && !this.jwtHelper.isTokenExpired(jwt)) {
          // this.authHttp.get(`${SERVER_URL}/authenticate`)
          //   .subscribe(() => this.authUser.next(jwt),
          //     (err) => this.storage.remove('token').then(() => this.authUser.next(null)));
          // OR
          resolve(jwt);
        } else {
          reject(null);
        }
      });

    });
  }

  logout() {
    return this.storage.remove('token');
  }

}
