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

    this.stateService.isValidToken(inviteToken)
      
      .then(res => {
        console.log(res)
        this.stateService._id = res._id || '';
        this.stateService.guid = inviteToken || '';
        res.expired
        ? this.router.navigate([`request/${inviteToken}`])

          : this.router.navigate([`accept/${inviteToken}`])
      })
      .catch(() => this.router.navigate(['']));
    // token is valid, save state and continue
    return true;
  }

  
}
