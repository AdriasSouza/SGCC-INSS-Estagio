import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap: any;

// servidor.model.ts
export interface Servidor {
  inscricao: string;
  nomeCompleto: string;
  nomeSetor: string;
  nomeAgencia: string;
}

export interface Setor {
  codigo: string;
  nome: string;
}

export interface Agencia {
  codigo: string;
  nome: string;
  id: string;
}


@Component({
  selector: 'app-servidores',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './servidores.component.html',
  styleUrls: ['./servidores.component.css']
})
export class ServidoresComponent implements OnInit {
  servidores: Servidor[] = [];
  setores: Setor[] = [];
  agencias: Agencia[] = [];
  servidorForm: FormGroup;
  editIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.servidorForm = this.fb.group({
      inscricao: ['', Validators.required],
      nomeCompleto: ['', Validators.required],
      nomeSetor: ['', Validators.required],
      nomeAgencia: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Populando a tabela com alguns servidores
    this.servidores = [
      { inscricao: '001', nomeCompleto: 'João Silva', nomeSetor: 'TI', nomeAgencia: 'Agência Central' },
      { inscricao: '002', nomeCompleto: 'Maria Souza', nomeSetor: 'RH', nomeAgencia: 'Agência Norte' },
      { inscricao: '003', nomeCompleto: 'Carlos Ferreira', nomeSetor: 'Financeiro', nomeAgencia: 'Agência Sul' },
      { inscricao: '004', nomeCompleto: 'Ana Paula', nomeSetor: 'Marketing', nomeAgencia: 'Agência Leste' }
    ];

    // Populando a lista de setores e agências
    this.setores = [
      { codigo: 'TI', nome: 'Tecnologia da Informação' },
      { codigo: 'RH', nome: 'Recursos Humanos' },
      { codigo: 'Financeiro', nome: 'Financeiro' },
      { codigo: 'Marketing', nome: 'Marketing' }
    ];

    this.agencias = [
      { codigo: '001', nome: 'Agência Central', id: '1' },
      { codigo: '002', nome: 'Agência Norte', id: '2' },
      { codigo: '003', nome: 'Agência Sul', id: '3' },
      { codigo: '004', nome: 'Agência Leste', id: '4' }
    ];
  }

  openAddModal() {
    this.servidorForm.reset();
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    addModal.show();
  }

  addServidor() {
    if (this.servidorForm.valid) {
      const novoServidor: Servidor = this.servidorForm.value;
      this.servidores.push(novoServidor);
      const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
      addModal.hide();
    } else {
      // Exibir mensagens de validação
      Object.keys(this.servidorForm.controls).forEach(field => {
        const control = this.servidorForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  openEditModal(index: number) {
    this.editIndex = index;
    this.servidorForm.patchValue(this.servidores[index]);
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  }

  editServidor() {
    if (this.servidorForm.valid && this.editIndex !== null) {
      this.servidores[this.editIndex] = this.servidorForm.value;
      const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
      editModal.hide();
    } else {
      // Exibir mensagens de validação
      Object.keys(this.servidorForm.controls).forEach(field => {
        const control = this.servidorForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  openDeleteModal(index: number) {
    this.editIndex = index;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  deleteServidor() {
    if (this.editIndex !== null) {
      this.servidores.splice(this.editIndex, 1);
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
    }
  }
}
