# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

Dashboard administrativo em React 18 + TypeScript (Create React App, MUI, styled-components, Recharts, MobX) do sistema de clínicas Voll.Med.

## Comandos

```bash
npm install
npm start      # servidor de desenvolvimento do CRA (porta 3000, que conflita com a porta padrão da voll-med-api)
npm run build
npm test       # react-scripts test (jest, modo watch). Ainda não há arquivos de teste
npm run api    # json-server na porta 8080 servindo db.json. O json-server não está no package.json; use npx ou instalação global
```

## Arquitetura

- As chamadas à API passam pelos hooks `useFetch` e `usePost` (`src/`), que usam a URL base fixa `https://volserver.onrender.com/`, e não a `voll-med-api` local nem o json-server. Os hooks de dados (`useDadosConsulta`, `useDadosProfissional`, `components/Grafico/useDadosGrafico`) encapsulam o `useFetch`.
- O estado de autenticação fica no singleton MobX `src/stores/autentica.store.ts`. O `utils/RotaPrivada.tsx` protege `/dashboard` com ele. O `usePost` guarda o token retornado no `localStorage`.
- O roteamento está em `src/AppRoutes.tsx`. Há dois layouts base: `PaginaBase` (página inicial e dashboard) e `PaginaBaseFormulario` (login e cadastro).
- Os componentes ficam em `src/components/<Nome>/index.tsx` e são estilizados com styled-components e MUI. Os tipos compartilhados estão em `src/types/I*.ts`.
