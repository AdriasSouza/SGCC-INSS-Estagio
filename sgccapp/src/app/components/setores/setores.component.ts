import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SetorService } from '../../service/setor.service';
import { Setor } from '../../model/setor.model';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RespostaPaginada } from '../../model/resposta-paginada';
import { Servidor } from '../../model/servidor.model';
import { ServidorService } from '../../service/servidor.service';

declare var bootstrap: any;

@Component({
  selector: 'app-setores',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, NgbPaginationModule],
  templateUrl: './setores.component.html',
  styleUrls: ['./setores.component.css']
})
export class SetoresComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private servico: SetorService,
    private servicoServidor: ServidorService
  ) {
    this.addForm = this.fb.group({
      nome: ['', Validators.required],
      codigo: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      nome: ['', Validators.required],
      codigo: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getSetores();
    this.getServidores();
    console.log('SetoresComponent inicializado!');
  }

  setores: Setor[] = [];
  servidores: Servidor[] = [];
  addForm: FormGroup;
  editForm: FormGroup;
  loading: boolean = false;
  setorSelecionado: Setor | null = null;

  getSetores(): void {
    this.loading = true;
    this.servico.get().subscribe({
      next: (resposta: RespostaPaginada<Setor>) => {
        this.setores = resposta.results;
        console.log('setores:', this.setores);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar setores:', err);
        this.loading = false;
      }
    });
  }

  getServidores(): void {
    this.servicoServidor.get().subscribe({
      next: (resposta: RespostaPaginada<Servidor>) => {
        this.servidores = resposta.results;
        console.log('servidores:', this.servidores);
      },
      error: (err) => {
        console.error('Erro ao buscar servidores:', err);
      }
    });
  }

  getChefeDoSetor(setorId: number): string {
    const chefe = this.servidores.find(servidor => servidor.setor?.id === setorId && servidor.chefe);
    return chefe ? chefe.nome_completo : 'N/A';
  }

  openAddModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  openEditModal(setor: Setor) {
    this.setorSelecionado = setor;
    this.editForm.patchValue({
      nome: setor.nome,
      codigo: setor.codigo
    });
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  confirmAdd() {
    if (this.addForm.valid) {
      const novoSetor: Setor = {
        ...this.addForm.value
      };
      this.servico.save(novoSetor).subscribe({
        complete: () => {
          this.getSetores();
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
          addModal.hide();
        }
      });
    }
  }

  confirmEdit() {
    if (this.editForm.valid && this.setorSelecionado) {
      const setorAtualizado: Setor = {
        ...this.setorSelecionado,
        ...this.editForm.value
      };
      this.servico.save(setorAtualizado).subscribe({
        complete: () => {
          this.getSetores();
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          editModal.hide();
        }
      });
    }
  }

  deleteSetor(id: number) {
    if (confirm('Confirma a exclusão do setor?')) {
      this.servico.delete(id).subscribe({
        complete: () => {
          this.getSetores();
        }
      });
    }
  }
}