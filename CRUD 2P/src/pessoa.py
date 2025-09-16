class Pessoa:
    def __init__(self, id, nome, idade):
        self.id = id
        self.nome = nome
        self.idade = idade

    def __str__(self):
        return f"[{self.id}] {self.nome} - {self.idade} anos"

    def to_dict(self):
        return {"id": self.id, "nome": self.nome, "idade": self.idade}

    @staticmethod
    def from_dict(dados):
        return Pessoa(dados["id"], dados["nome"], dados["idade"])
