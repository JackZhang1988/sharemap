import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthServiceProvider {

  public token: any;

  constructor(
    private readonly storage: Storage,
    private readonly jwtHelper: JwtHelperService) {
  }

  checkLogin() {
    return new Promise((resolve, reject) => {

      this.storage.get('token').then(jwt => {
        // console.log('token', jwt);
        // console.log('token expired date', this.jwtHelper.getTokenExpirationDate(jwt));
        // console.log('token decode',this.jwtHelper.decodeToken(jwt));
        if (jwt && !this.jwtHelper.isTokenExpired(jwt)) {
          resolve(jwt);
        } else {
          reject(null);
        }
      });

    });
  }

  async getUserId() {
    return await this.storage.get('userId')
  }

  logout() {
    return this.storage.clear();
  }

}
