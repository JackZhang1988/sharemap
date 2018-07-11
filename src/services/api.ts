import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '@app/env';
import { LocationCategory } from '../common/models';
import { map } from '../../node_modules/rxjs/operators';

@Injectable()
export class ApiService {
    private serverHost = ENV.API_URL;

    constructor(private http: HttpClient) { }

    search(params): Observable<any> {
        return this.http
            .get(this.serverHost + '/search', {
                params: params
            })
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }
    getMaps(params?): Observable<any> {
        return this.http
            .get(this.serverHost + '/map/list', {
                params: params
            })
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getMapById(mapId): Observable<any> {
        return this.http
            .get(this.serverHost + '/map', {
                params: {
                    mapId
                }
            })
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getLocationById(locationId): Observable<any> {
        return this.http
            .get(this.serverHost + '/map/location?locationId=' + locationId)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getMapLocations(params): Observable<any> {
        return this.http
            .get(this.serverHost + '/map/locations', {
                params: params
            })
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getMapAllLocations(params): Observable<any> {
        return this.http
            .get(this.serverHost + '/map/allLocations', {
                params: params
            })
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    addNewMap(map: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/map', map)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    delMap(data: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/map/del', data)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    addNewLocation(location: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/map/location', location)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    updateLocation(locationData: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/map/updateLocation', locationData)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    delLocation(data: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/map/delLocation', data)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    signup(userInfo: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/user/signup', userInfo)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    updateUser(userInfo: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/user/update', userInfo)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    login(data: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/user/login', data)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    sendMsgCode(phone: string): Observable<any> {
        return this.http
            .post(this.serverHost + '/user/msgCode', { phone: phone })
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getUserInfo(userId: string): Observable<any> {
        return this.http
            .get(this.serverHost + '/user?userId=' + userId)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getUserMaps(userId: string): Observable<any> {
        return this.http
            .get(this.serverHost + '/map/usermaps?userId=' + userId)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getUserLocations(userId: string): Observable<any> {
        return this.http
            .get(this.serverHost + '/map/userlocations?userId=' + userId)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getComments(pageId: string): Observable<any> {
        return this.http
            .get(this.serverHost + '/comment?pageId=' + pageId)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getMapCommentCount(pageId: string): Observable<any> {
        return this.http
            .get(this.serverHost + '/comment/count?pageId=' + pageId)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getLikeInfo(pageId: string, creater: string): Observable<any> {
        return this.http
            .get(this.serverHost + '/like/info?targetId=' + pageId + '&creater=' + creater)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    sendComment(commentData: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/comment', commentData)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    sendLike(likeData: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/like', likeData)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    addFeedback(data: any): Observable<any> {
        return this.http
            .post(this.serverHost + '/feedback', data)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }
    getUserFeedbacks(userId: string): Observable<any> {
        return this.http
            .get(this.serverHost + '/feedback?userId=' + userId)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    getLocaionCategory(userId: string, mapId?: string): Observable<any> {
        return this.http
            .get(this.serverHost + '/map/locationCategory?userId=' + userId + (mapId ? `&mapId=${mapId}` : ''))
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

    saveLocationCategory(params: LocationCategory): Observable<any> {
        return this.http
            .post(this.serverHost + '/map/locationCategory', params)
            .catch((error: any) => Observable.throw(error.error || 'Server error'));
    }

}
