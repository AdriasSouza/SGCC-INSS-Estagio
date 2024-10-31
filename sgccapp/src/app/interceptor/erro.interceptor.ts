import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertaService } from '../service/alerta.service';
import { LoginService } from '../service/login/i-login.service';
import { ETipoAlerta } from '../model/e-tipo-alerta';

const ERRO_HTTP: Record<number, string> = {
  401: "Não autorizado.",
  403: "Acesso proibido.",
  404: "Recurso não encontrado.",
  500: "Erro interno do servidor."
}

export const erroInterceptor: HttpInterceptorFn = (req, next) => {
  const servicoAlerta = inject(AlertaService);
  const servicoLogin = inject(LoginService);
  return next(req).pipe(
    catchError(erro => {
      let mensagemErro = ERRO_HTTP[erro.status] || erro.error?.message || "Falha na requisição.";
      if (erro.status == 401) {
        servicoLogin.logout();
      }
      servicoAlerta.enviarAlerta({
        tipo: ETipoAlerta.ERRO,
        mensagem: mensagemErro
      });
      return throwError(() => erro);
    })
  );
};