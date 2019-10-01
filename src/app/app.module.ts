import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from '../common/core/core.module';
import {AuthModule} from '../common/auth/auth.module';
import {AccountSettingsModule} from '../common/account-settings/account-settings.module';
import {AppRoutingModule} from './app-routing.module';
import {PagesModule} from '../common/core/pages/pages.module';
import {HelpCenterModule} from './help-center/front/help-center.module';
import {Bootstrapper} from '../common/core/bootstrapper.service';
import {BedeskBootstrapper} from './bedesk-bootstrapper.service';
import {APP_CONFIG} from '../common/core/config/vebto-config';
import {BEDESK_CONFIG} from './bedesk-config';
import {ACCOUNT_SETTINGS_PANELS} from '../common/account-settings/account-settings-panels';
import {EnvatoPurchasesPanelComponent} from './account-settings/envato-purchases-panel/envato-purchases-panel.component';

@NgModule({
    declarations: [
        AppComponent,
        EnvatoPurchasesPanelComponent,
    ],
    entryComponents: [
        EnvatoPurchasesPanelComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([], {
            scrollPositionRestoration: 'top'
        }),
        CoreModule.forRoot(),
        AuthModule,
        AccountSettingsModule,
        HelpCenterModule,
        AppRoutingModule,
        PagesModule,
    ],
    providers: [
        {
            provide: Bootstrapper,
            useClass: BedeskBootstrapper
        },
        {
            provide: APP_CONFIG,
            useValue: BEDESK_CONFIG,
            multi: true,
        },
        {
            provide: ACCOUNT_SETTINGS_PANELS,
            useValue: {component: EnvatoPurchasesPanelComponent},
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
