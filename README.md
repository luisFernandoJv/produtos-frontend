# 🖥️ Produtos Frontend

Interface web desenvolvida em **React** para gerenciamento de produtos,  
consumindo a [Produtos API](https://github.com/seu-usuario/produtos-api) via requisições HTTP.

---

## 🚀 Tecnologias

- **React 18**
- **Vite**
- **JavaScript (ES6+)**
- **Fetch API** (sem bibliotecas externas)
- **CSS-in-JS** (estilos inline com variáveis)

---

## ✨ Funcionalidades

- 🔍 **Buscar produtos por nome** — lista todos os resultados em tabela
- 🎯 **Buscar produto por ID** — exibe detalhes de um produto específico
- ➕ **Cadastrar produto** — formulário com nome, descrição e preço
- ✏️ **Editar produto** — preenche o formulário com dados existentes
- 🗑️ **Excluir produto** — com confirmação antes de deletar
- ✅ **Feedback visual** — toasts de sucesso e erro em cada ação

---

## ▶️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- [Produtos API](https://github.com/seu-usuario/produtos-api) rodando em `localhost:8080`

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/produtos-frontend.git

# 2. Acesse a pasta
cd produtos-frontend

# 3. Instale as dependências
npm install

# 4. Rode o projeto
npm run dev
```

Acesse em: **http://localhost:5173**

> ⚠️ A API precisa estar rodando antes de usar o frontend.

---

## 🗂️ Estrutura do Projeto

```
produtos-frontend/
├── src/
│   ├── App.jsx             # Componente raiz
│   ├── ProdutosApp.jsx     # Aplicação principal
│   └── main.jsx            # Ponto de entrada
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚙️ Configuração de CORS

Para que o frontend consiga se comunicar com a API, adicione a anotação  
`@CrossOrigin` no `ProdutoController.java` do backend:

```java
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("produtos")
public class ProdutoController { ... }
```

---

## 🔗 Backend

API REST desenvolvida em Java com Spring Boot:  
👉 [produtos-api](https://github.com/seu-usuario/produtos-api)

---

## 👨‍💻 Autor

Feito por **Luis Fernando** — [Linkedin](https://wwww.linkedin.com/in/luisfernando-eng)
