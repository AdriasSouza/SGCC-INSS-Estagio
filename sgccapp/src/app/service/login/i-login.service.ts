import { HttpRequest } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { InjectionToken } from "@angular/core";
import { User } from "../../model/user.model";

export interface ILoginService {
  usuarioAutenticado: BehaviorSubject<User>;
  login(email: string, password: string): void; 
  // Observable<any>
  logout(): void;
  isLoggedIn(): boolean;
  getHeaders(request: HttpRequest<any>): HttpRequest<any>;
}

export const LoginService = new InjectionToken<ILoginService>('ILoginService');
