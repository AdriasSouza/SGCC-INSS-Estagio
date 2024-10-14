import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent {
  reportType: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  status: string = '';
  reportGenerated: boolean = false;

  generateReport() {
    // Aqui você pode adicionar a lógica para gerar o relatório.
    // Por exemplo, você pode chamar um serviço que gera o relatório com os filtros aplicados.
    
    console.log('Gerando relatório...', {
      reportType: this.reportType,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      status: this.status,
    });

    // Simulação de geração de relatório
    this.reportGenerated = true;

    // Resetar o formulário após geração
    this.resetForm();
  }

  resetForm() {
    this.reportType = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.status = '';
  }
}

