import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { StateService } from '../services/state.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidInviteGuard implements CanActivate {
  constructor(private stateService: StateService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const inviteToken = route.queryParamMap.get('invite_token');

    this.stateService.isValidToken(inviteToken).pipe(map(obs => {
      console.log(obs)
      if (!obs) return false;
      if (!obs.active) return this.router.navigate(['/'])
      if (!obs.active && obs.expired) return this.router.navigate([`request/${inviteToken}`])
      return this.router.navigate([`accept/${inviteToken}`])
    }))
      
    /*
      .then(res => {
        console.log(res)
        this.stateService._id = res._id || '';
        this.stateService.guid = inviteToken || '';
        res.expired
        ? this.router.navigate([`request/${inviteToken}`])

          : this.router.navigate([`accept/${inviteToken}`])
      })
      .catch(() => this.router.navigate(['']));
      */
    // token is valid, save state and continue
    return true;
  }

  
}
