# Task Manager

Aplicação web simples para gerenciamento de tarefas, desenvolvida como solução para o desafio técnico.

A aplicação permite criar, listar, editar e excluir tarefas. O backend é implementado com tRPC e mantém os dados em memória, conforme especificado no case.

## Tecnologias

- Next.js 15
- TypeScript
- tRPC
- TanStack Query
- Zod
- Tailwind CSS

## Funcionalidades

- Criar tarefas
- Listar tarefas
- Editar tarefas existentes
- Excluir tarefas diretamente da listagem
- Tratamento de erros
- Validação de dados no frontend e backend
- Feedback visual para operações de sucesso e erro
- Estados de carregamento
- SSR da página de listar tarefas
- Infinite scroll para carregamento incremental

Cada tarefa possui:

- `id`: identificador único
- `titulo`: título obrigatório
- `descricao`: descrição opcional
- `dataCriacao`: data de criação

## Como executar

### Pré-requisitos

- Node.js
- npm

### Instalação

Clone o repositório e instale as dependências:

```
npm install
```

### Desenvolvimento

Execute:

```
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

### Build

Para verificar a build de produção:

```
npm run build
```

Para executar a aplicação em produção:

```
npm start
```

## Estrutura

```text
src/
├── app/
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
|   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── tasks/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── loading.tsx
│       ├── error.tsx
│       ├── tasks-list.tsx
│       ├── task-form.tsx
│       ├── create/
│       │   ├── page.tsx
│       │   └── loading.tsx
│       └── [id]/
│           └── edit/
│               ├── page.tsx
│               └── loading.tsx
├── components/
|   ├── delete-task-button.tsx
|   ├── loading-task-form.tsx
|   ├── loading-task-list.tsx
|   ├── task-card.tsx
│   └── toast.tsx
└── trpc/
    ├── init.ts
    ├── client.tsx
    ├── query-client.ts
    ├── server.tsx
    ├── types.ts
    ├── store/
    │   └── tasks.ts
    └── routers/
        ├── _app.ts
        └── tasks.ts
```

## Organização

### `app/`

Contém as páginas, layouts e endpoints da aplicação.

A rota:

```text
/api/trpc/[trpc]
```

é responsável por expor o router tRPC através de HTTP.

A página `/tasks` realiza o carregamento inicial das tarefas no servidor e utiliza o componente `TasksList` para a interação no cliente.

### `components/`

Contém componentes reutilizáveis que não pertencem necessariamente a uma página específica.

Atualmente, o `ToastProvider` é responsável pelo sistema de notificações utilizado para informar o resultado das operações.

### `trpc/`

Contém toda a configuração e lógica relacionada ao tRPC.

- `init.ts`: inicialização do tRPC e definição do contexto.
- `client.tsx`: configuração do tRPC para Client Components.
- `server.tsx`: configuração do tRPC para Server Components e chamadas no servidor.
- `query-client.ts`: configuração do TanStack Query.
- `types.ts`: tipos compartilhados entre frontend e backend.
- `routers/`: definição dos routers e procedimentos da API.
- `store/`: armazenamento em memória das tarefas.

## Formulário

O mesmo componente de formulário é utilizado para criação e edição de tarefas.

O estado do formulário é controlado através de hooks.

Antes do envio são realizadas validações no cliente para:

- título vazio;
- título com mais de 100 caracteres;
- descrição com mais de 500 caracteres.

As mesmas regras relevantes também são aplicadas no backend utilizando Zod.

Durante o envio, o formulário é bloqueado para evitar múltiplos envios enquanto a operação está em andamento.

## Feedback ao usuário

A aplicação possui feedback visual para operações de sucesso e erro.

Exemplos:

- tarefa criada com sucesso;
- tarefa atualizada com sucesso;
- tarefa excluída com sucesso;
- falha ao criar, atualizar ou excluir;
- tarefa não encontrada;
- estados de carregamento.

Os feedbacks de criação, atualização e remoção são exibidos usando Toasts.

## Decisões técnicas

### tRPC (requisitado pelo case)

tRPC permite definir os procedimentos do backend e consumi-los no frontend com tipagem compartilhada entre as duas partes da aplicação.

Isso reduz a necessidade de definir manualmente contratos HTTP e tipos duplicados.

### Validação com Zod

As entradas dos procedimentos tRPC são validadas utilizando Zod.

Por exemplo, uma tarefa precisa possuir um título não vazio e respeitar os limites definidos para os campos:

```text
Título: até 100 caracteres
Descrição: até 500 caracteres
```

A validação existe no backend independentemente da validação realizada no frontend.

O frontend também utiliza `maxLength` e validações próprias para fornecer feedback imediato ao usuário.

### Armazenamento em memória (requisitado pelo case)

As tarefas são mantidas em um array em memória durante a execução da aplicação.

Isso significa que os dados:

- não são persistidos;
- são perdidos quando o processo é reiniciado;
- não são adequados para produção ou múltiplas instâncias do servidor.

### SSR e hidratação (requisitado pelo case)

A implementação utiliza um caller direto do router no servidor e hidrata o resultado no cliente.

### Infinite scroll

O infinite scroll foi implementado como funcionalidade extra. A paginação baseada em cursor permite carregar as tarefas gradualmente em vez de buscar toda a lista de uma vez.

### Atualização do cache

Após operações que alteram as tarefas, o cache da listagem é invalidado para que a primeira página seja buscada novamente.

Isso é especialmente importante na criação de tarefas, pois novas tarefas são adicionadas no início da lista.

O mesmo ocorre com a operação de edição de tarefas. O cache da tarefa específica é invalidado para que os dados estejam atualizados em cache para uma possível nova edição.

## Componentização

A responsabilidade da listagem foi separada da responsabilidade de cada tarefa.

`TasksList` é responsável por:

- buscar as tarefas;
- controlar o infinite scroll;
- lidar com carregamento;
- lidar com lista vazia;
- renderizar os cards.

`TaskCard` é responsável por:

- exibir uma tarefa;
- permitir sua edição;
- realizar sua exclusão;
- controlar o estado de exclusão da própria tarefa.

Essa divisão mantém a lógica relacionada a uma tarefa próxima dos elementos que a representam, sem criar abstrações desnecessárias.

## Tratamento de erros

Os diferentes tipos de erro possuem tratamentos diferentes:

- **Validação do formulário:** mensagem exibida diretamente no formulário.
- **Erro em mutations:** feedback através de Toast.
- **Erro ao carregar uma página/Erro ao buscar uma tarefa inexistente:** tratado pelo `error.tsx`.

Essa divisão evita que todos os erros sejam tratados da mesma maneira e permite fornecer feedback adequado para cada situação.

## API

O router de tarefas disponibiliza os seguintes procedimentos:

| Procedimento    | Tipo     | Descrição                       |
| --------------- | -------- | ------------------------------- |
| `tasks.list`    | Query    | Lista tarefas de forma paginada |
| `tasks.getById` | Query    | Busca uma tarefa pelo ID        |
| `tasks.create`  | Mutation | Cria uma nova tarefa            |
| `tasks.update`  | Mutation | Atualiza uma tarefa existente   |
| `tasks.delete`  | Mutation | Remove uma tarefa               |

Operações de atualização e exclusão de uma tarefa inexistente retornam um erro significativo para o cliente.

## Considerações

Este projeto foi desenvolvido com foco em simplicidade, organização e atendimento aos requisitos do case.

Também foi levado em conta responsividade para não haver comprometimento de uso para usuários que estejam usando um ambiente mobile.

Os commits ao GitHub foram feitos usando o padrão [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) para melhor leitura e compreensão do histórico de versões.

Não foram adicionadas tecnologias ou abstrações que não fossem necessárias para o problema, como banco de dados, ORM, autenticação ou bibliotecas adicionais de UI.

## Referência

A configuração inicial do tRPC foi baseada na [documentação oficial](https://trpc.io/docs/client/nextjs/app-router-setup) para Next.js App Router:
