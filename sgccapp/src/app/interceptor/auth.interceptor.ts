import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../service/login/i-login.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  req = loginService.getHeaders(req);
  return next(req);
};