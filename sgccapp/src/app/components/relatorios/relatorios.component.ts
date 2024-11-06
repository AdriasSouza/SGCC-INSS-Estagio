import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RelatoriosService } from '../../service/relatorios.service';

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

  constructor(private relatoriosService: RelatoriosService) {}

  generateReport() {
    console.log('Gerando relatório...', {
      reportType: this.reportType,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      status: this.status,
    });

    switch (this.reportType) {
      case 'equipamentos':
        this.relatoriosService.exportEquipamentosCsv(this.dateFrom, this.dateTo).subscribe(blob => this.downloadFile(blob, 'equipamentos.csv'));
        break;
      case 'manutencao':
        this.relatoriosService.exportManutencoesCsv(this.dateFrom, this.dateTo).subscribe(blob => this.downloadFile(blob, 'manutencoes.csv'));
        break;
      case 'pecas':
        this.relatoriosService.exportComponentesCsv(this.dateFrom, this.dateTo).subscribe(blob => this.downloadFile(blob, 'componentes.csv'));
        break;
      case 'usuarios':
        const setorId = 1; // Substitua pelo ID do setor desejado
        this.relatoriosService.exportSetoresCsv(setorId).subscribe(blob => this.downloadFile(blob, 'servidores.csv'));
        break;
      default:
        console.error('Tipo de relatório desconhecido:', this.reportType);
    }

    this.reportGenerated = true;
    this.resetForm();
  }

  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  resetForm() {
    this.reportType = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.status = '';
  }
}