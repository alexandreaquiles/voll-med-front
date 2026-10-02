# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

Dashboard administrativo em React 18 + TypeScript (Create React App, MUI, styled-components, Recharts, MobX) do sistema de clínicas Voll.Med.

## Comandos

```bash
npm install
npm start      # servidor de desenvolvimento do CRA na porta 3001 (PORT em .env.development)
npm run build
npm test       # react-scripts test (jest, modo watch). Ainda não há arquivos de teste
npm run api    # json-server na porta 8080 servindo db.json. O json-server não está no package.json; use npx ou instalação global
```

## Arquitetura

- As chamadas à API passam pelos hooks `useFetch` e `usePost` (`src/`), que montam a URL com `API_URL` de `src/api.ts` (`REACT_APP_API_URL`, vazio por padrão). Com o valor vazio, as requisições são relativas e o dev server as repassa para a `voll-med-api` em `http://localhost:3000` pelo campo `proxy` do `package.json`. O json-server (`npm run api`) não é usado pelos hooks. Os hooks de dados (`useDadosConsulta`, `useDadosProfissional`, `components/Grafico/useDadosGrafico`) encapsulam o `useFetch`.
- A sessão fica em `src/sessao.ts`: os tokens ficam no `localStorage`, e `requisicao` (usada por `useFetch` e `usePost`) envia o token e, se a API responder 401, renova a sessão com o refresh token (uma renovação só para várias requisições simultâneas) e repete a chamada; sem conseguir renovar, volta para o login. `encerraSessao` (no "Sair") pede à API para invalidar os tokens.
- O estado de autenticação fica no singleton MobX `src/stores/autentica.store.ts`. O `utils/RotaPrivada.tsx` protege `/dashboard` com ele. O `usePost` guarda o token retornado no `localStorage`.
- O roteamento está em `src/AppRoutes.tsx`. Há dois layouts base: `PaginaBase` (página inicial e dashboard) e `PaginaBaseFormulario` (login e cadastro).
- Os componentes ficam em `src/components/<Nome>/index.tsx` e são estilizados com styled-components e MUI. Os tipos compartilhados estão em `src/types/I*.ts`.
