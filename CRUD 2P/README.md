# Sistema CRUD - Gerenciamento de Pessoas

Um sistema completo de CRUD (Create, Read, Update, Delete) para gerenciamento de pessoas, desenvolvido com Flask (backend) e HTML/CSS/JavaScript (frontend).

## Funcionalidades

### Backend (API RESTful)
- **GET /api/pessoas** - Lista todas as pessoas
- **POST /api/pessoas** - Cria uma nova pessoa
- **GET /api/pessoas/{id}** - Obtém uma pessoa específica
- **PUT /api/pessoas/{id}** - Atualiza uma pessoa existente
- **DELETE /api/pessoas/{id}** - Exclui uma pessoa
- **GET /api/pessoas/exportar** - Exporta dados para CSV

### Frontend (Interface Web)
- Interface moderna e responsiva com design gradiente
- Listagem de pessoas em cards visuais
- Modal para adicionar/editar pessoas
- Funcionalidade de busca em tempo real
- Confirmação de exclusão com modal
- Notificações toast para feedback do usuário
- Contador de total de pessoas
- Exportação de dados para CSV
- Suporte a dispositivos móveis

## Tecnologias Utilizadas

### Backend
- **Flask** - Framework web Python
- **Flask-CORS** - Suporte a CORS para integração frontend-backend
- **JSON** - Armazenamento de dados em arquivo
- **CSV** - Exportação de dados

### Frontend
- **HTML5** - Estrutura da página
- **CSS3** - Estilização moderna com gradientes e animações
- **JavaScript (ES6+)** - Funcionalidades interativas
- **Font Awesome** - Ícones

## Estrutura do Projeto

```
crud-api/
├── src/
│   ├── static/           # Arquivos do frontend
│   │   ├── index.html    # Página principal
│   │   ├── style.css     # Estilos CSS
│   │   └── script.js     # JavaScript
│   ├── routes/
│   │   └── pessoa.py     # Rotas da API
│   ├── models/
│   ├── database/
│   ├── main.py           # Arquivo principal do Flask
│   ├── pessoa.py         # Classe Pessoa
│   └── sistema_crud.py   # Lógica de CRUD
├── venv/                 # Ambiente virtual Python
├── requirements.txt      # Dependências Python
└── README.md            # Este arquivo
```

## Como Executar

### Pré-requisitos
- Python 3.7+
- pip

### Instalação e Execução

1. **Clone ou baixe o projeto**

2. **Navegue até o diretório do projeto**
   ```bash
   cd crud-api
   ```

3. **Ative o ambiente virtual**
   ```bash
   source venv/bin/activate
   ```

4. **Instale as dependências (se necessário)**
   ```bash
   pip install -r requirements.txt
   ```

5. **Execute a aplicação**
   ```bash
   python src/main.py
   ```

6. **Acesse a aplicação**
   - Abra seu navegador e vá para: `http://localhost:5000`

## Como Usar

### Adicionar uma Pessoa
1. Clique no botão "Nova Pessoa"
2. Preencha o nome e idade
3. Clique em "Criar"

### Editar uma Pessoa
1. Clique no botão "Editar" no card da pessoa
2. Modifique os dados desejados
3. Clique em "Atualizar"

### Excluir uma Pessoa
1. Clique no botão "Excluir" no card da pessoa
2. Confirme a exclusão no modal

### Buscar Pessoas
- Digite no campo de busca para filtrar por nome ou idade

### Exportar Dados
- Clique no botão "Exportar CSV" para gerar um arquivo pessoas.csv

## Armazenamento de Dados

Os dados são armazenados em um arquivo JSON (`pessoas.json`) no diretório raiz do projeto. Este arquivo é criado automaticamente quando a primeira pessoa é adicionada.

## Recursos Técnicos

### Responsividade
- Design adaptável para desktop, tablet e mobile
- Interface otimizada para touch em dispositivos móveis

### Experiência do Usuário
- Animações suaves e transições
- Feedback visual com notificações toast
- Estados de loading durante operações
- Confirmações para ações destrutivas

### Segurança
- Validação de dados no frontend e backend
- Sanitização de entrada de dados
- Tratamento de erros robusto

## API Endpoints Detalhados

### Listar Pessoas
```
GET /api/pessoas
Response: {
  "success": true,
  "data": [
    {"id": 1, "nome": "João Silva", "idade": 30}
  ],
  "message": "Pessoas listadas com sucesso"
}
```

### Criar Pessoa
```
POST /api/pessoas
Body: {"nome": "Maria Santos", "idade": 25}
Response: {
  "success": true,
  "data": {"id": 2, "nome": "Maria Santos", "idade": 25},
  "message": "Pessoa criada com sucesso"
}
```

### Atualizar Pessoa
```
PUT /api/pessoas/1
Body: {"nome": "João Silva", "idade": 31}
Response: {
  "success": true,
  "data": {"id": 1, "nome": "João Silva", "idade": 31},
  "message": "Pessoa atualizada com sucesso"
}
```

### Excluir Pessoa
```
DELETE /api/pessoas/1
Response: {
  "success": true,
  "message": "Pessoa excluída com sucesso"
}
```

## Desenvolvimento

### Estrutura de Classes

**Pessoa** (`pessoa.py`)
- Representa uma pessoa com ID, nome e idade
- Métodos para conversão para/de dicionário

**SistemaCRUD** (`sistema_crud.py`)
- Gerencia operações CRUD
- Persistência em arquivo JSON
- Exportação para CSV

### Padrões Utilizados
- Arquitetura MVC (Model-View-Controller)
- API RESTful
- Separação de responsabilidades
- Código limpo e documentado

## Melhorias Futuras

- Banco de dados relacional (PostgreSQL/MySQL)
- Autenticação e autorização
- Paginação para grandes volumes de dados
- Filtros avançados
- Validação de campos mais robusta
- Testes automatizados
- Deploy em produção

## Licença

Este projeto foi desenvolvido para fins educacionais e demonstrativos.

