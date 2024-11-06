import { Servidor } from "./servidor.model";

// user.model.ts
export type User = {
  id: number;         // ID único do usuário
  email: string;      // Email do usuário, usado como campo de login
  password: string;   // Senha do usuário (por questões de segurança, geralmente não retornada diretamente da API)
  servidor?: Servidor;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  }