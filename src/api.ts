// Vazio por padrão: em desenvolvimento as requisições vão para o próprio dev server,
// que as repassa para a voll-med-api via "proxy" do package.json.
export const API_URL = process.env.REACT_APP_API_URL ?? '';
