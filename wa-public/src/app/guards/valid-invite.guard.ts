import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StateService } from '../services/state.service';
import { map, tap } from 'rxjs/operators';
import { ActionService } from '../services/action.service';

@Injectable({
  providedIn: 'root',
})
export class ValidInviteGuard implements CanActivate {
  constructor(private stateService: StateService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const inviteToken = route.queryParamMap.get('invite_token');

    return this.stateService.isValidToken(inviteToken).pipe(
      tap(obs => (this.stateService.invitedUser = obs.user)),
      map(obs => {
        console.log(obs);
        if (!obs) return false;
        if (!obs.active) return this.router.createUrlTree(['/']);
        if (obs.active && obs.expired) {
          return this.router.createUrlTree([`request/${inviteToken}`]);
        }
        return this.router.createUrlTree([`accept/${inviteToken}`]);
      }),
    );
  }
}
