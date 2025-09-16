import csv
import json
import os
from src.pessoa import Pessoa


class SistemaCRUD:
    def __init__(self, arquivo="pessoas.json"):
        self.arquivo = arquivo
        self.pessoas = []
        self.proximo_id = 1
        self.carregar_dados()

    def salvar_dados(self):
        with open(self.arquivo, "w", encoding="utf-8") as f:
            json.dump([p.to_dict() for p in self.pessoas], f, indent=4)

    def carregar_dados(self):
        if os.path.exists(self.arquivo):
            with open(self.arquivo, "r", encoding="utf-8") as f:
                dados = json.load(f)
                self.pessoas = [Pessoa.from_dict(d) for d in dados]
                if self.pessoas:
                    self.proximo_id = max(p.id for p in self.pessoas) + 1

    def criar_pessoa(self, nome, idade):
        pessoa = Pessoa(self.proximo_id, nome, idade)
        self.pessoas.append(pessoa)
        self.proximo_id += 1
        self.salvar_dados()
        print("Pessoa cadastrada!")

    def listar_pessoas(self):
        if not self.pessoas:
            print("Nenhuma pessoa cadastrada.")
        else:
            for pessoa in self.pessoas:
                print(pessoa)

    def atualizar_pessoa(self, id, novo_nome, nova_idade):
        for pessoa in self.pessoas:
            if pessoa.id == id:
                pessoa.nome = novo_nome
                pessoa.idade = nova_idade
                self.salvar_dados()
                print("Pessoa atualizada!")
                return
        print("Pessoa não encontrada.")

    def excluir_pessoa(self, id):
        for pessoa in self.pessoas:
            if pessoa.id == id:
                self.pessoas.remove(pessoa)
                self.salvar_dados()
                print("Pessoa excluída!")
                return
        print("Pessoa não encontrada.")

    def exportar_csv(self, nome_arquivo="pessoas.csv"):
        with open(nome_arquivo, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["ID", "Nome", "Idade"])

            for pessoa in self.pessoas:
                writer.writerow([pessoa.id, pessoa.nome, pessoa.idade])
        print(f"Dados exportados para {nome_arquivo} com sucesso.")
