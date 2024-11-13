import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ILoginService, LoginService } from "../../service/login/i-login.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    @Inject(LoginService) private servico: ILoginService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      this.servico.login(loginData.email, loginData.password).subscribe({
        next: () => {
          this.errorMessage = null;
        },
        error: () => {
          this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
        }
      });
    }
  }
}