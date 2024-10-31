import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './login/i-login.service';

export const authGuard: CanActivateFn = (route) => {
  const loginService = inject(LoginService);

  if (!loginService.isLoggedIn()) {
    loginService.logout();
    return false;
  }

  return true;
};