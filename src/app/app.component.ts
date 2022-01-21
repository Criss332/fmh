import { Component, OnInit } from '@angular/core';
import { TokenStorageService} from './_services/token-storage.service';
import { NotificationService } from './_services/notification.service';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //----Notificacion-push--------
  readonly VAPID_PUBLIC_KEY = 'BEnaf5PTGRLkwKkIcGhtdoI4s3V8p_iltoY6giJS0NfnjnLZ0wOAVOeS8axJ3s1PPIhwsrTNBhsyV67HoImUjC8'
  //--------------end
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  email?: string;

  constructor(
    private tokenStorageService: TokenStorageService, private swPush: SwPush, private notificationService: NotificationService)
    {
      this.subscribeToNotifications()
    }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if(this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.email = user.email;
    }
  }

  //-----Notificaciones-push--
  subscribeToNotifications(): any {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub => {
      const token = JSON.parse(JSON.stringify(sub));
      console.log(token);
      this.notificationService.saveToken(token).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log('error', err)
        }
      });
    }).catch(err => console.error('Could not subscribe to notifications', err));
  }
  //--------------end

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
