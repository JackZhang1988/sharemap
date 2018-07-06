import { NgModule, ErrorHandler } from '@angular/core';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MyApp } from './app.component';
import { AuthServiceProvider } from '../providers/auth';
import { HttpHeaderInterceptor } from '../providers/http-header';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ShareProvider } from '../providers/share';
import { BottomSheetProvider } from '../providers/bottom-sheet/bottom-sheet';

export function jwtOptionsFactory(storage) {
    return {
        whitelistedDomains: ['localhost:3000', 'fendxiangditu.com', 'renrenmap.cn', 'renrenmap.com'],
        tokenGetter: () => {
            return storage.get('token');
        }
    };
}

@NgModule({
    declarations: [MyApp],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        HttpClientModule,
        JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: jwtOptionsFactory,
                deps: [Storage]
            }
        }),
        IonicModule.forRoot(MyApp, { backButtonText: '' }),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [MyApp],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        { provide: 'IMGURL', useValue: 'http://okyb0e40i.bkt.clouddn.com/' },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpHeaderInterceptor,
            multi: true
        },
        SplashScreen,
        StatusBar,
        AuthServiceProvider,
        FileTransfer,
        ShareProvider,
        BottomSheetProvider
    ]
})
export class AppModule { }
