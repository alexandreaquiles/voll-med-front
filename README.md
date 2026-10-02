
![React com Typescript: desenvolvendo uma área administrativa com MUI, Recharts e Styled Components](https://imgur.com/Qgf3van.png)

# React com Typescript: desenvolvendo uma área administrativa

Este projeto faz parte da escola Front-end e tem como objetivo ensinar a construção de uma página de área administrativa utilizando React com Typescript e as bibliotecas Styled-Components, MUI e Recharts.

## Funcionalidades do projeto

A página de área administrativa terá as seguintes funcionalidades:

- Dashboard: Página principal com tabela, gráficos e informações.

## Técnicas e tecnologias utilizadas

As técnicas e tecnologias que serão utilizadas neste projeto são:

- React: Biblioteca para construção de interfaces de usuário.
- Typescript: Linguagem de programação que adiciona tipagem estática ao Javascript.
- Styled-Components: Biblioteca para estilização de componentes React utilizando CSS-in-JS.
- MUI: Biblioteca de componentes React para criação de interfaces de usuário modernas e responsivas.
- Recharts: Biblioteca para criação de gráficos utilizando React.

## Rodando localmente

O front consome a [voll-med-api](https://github.com/alexandreaquiles/voll-med-api). Siga primeiro o passo a passo do README da API, que mostra como configurar o `.env`, subir o MySQL e o Redis com Docker Compose, popular o banco com dados de exemplo e subir a API em http://localhost:3000.

Depois, neste repositório:

```bash
npm install
npm start
```

O front fica em http://localhost:3001. Em desenvolvimento, as chamadas à API são repassadas para `http://localhost:3000` pelo campo `proxy` do `package.json`. Para apontar para outra API, defina `REACT_APP_API_URL`.

Com os dados de exemplo da API (`npm run seed`), entre em http://localhost:3001/login com `gestor@voll.com` / `Senha@123`.

Para rodar os testes:

```bash
CI=true npm test -- --watchAll=false
```
