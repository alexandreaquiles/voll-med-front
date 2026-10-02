import { encerraSessao, navegacao, requisicao, salvaTokens, tokenDeAcesso } from "./sessao";

// Resposta mínima do fetch para os testes
const resposta = (status: number, corpo: unknown = {}) =>
    ({ status, ok: status >= 200 && status < 300, json: async () => corpo }) as Response;

const autorizacaoDa = (chamada: unknown[]) =>
    new Headers((chamada[1] as RequestInit).headers).get('Authorization');

let fetchFalso: jest.Mock;

beforeEach(() => {
    localStorage.clear();
    fetchFalso = jest.fn();
    global.fetch = fetchFalso;
    navegacao.paraLogin = jest.fn();
});

test('envia o token de acesso', async () => {
    salvaTokens({ accessToken: 'acesso', refreshToken: 'refresh' });
    fetchFalso.mockResolvedValueOnce(resposta(200));

    await requisicao('consulta');

    expect(fetchFalso.mock.calls[0][0]).toBe('/consulta');
    expect(autorizacaoDa(fetchFalso.mock.calls[0])).toBe('Bearer acesso');
});

test('renova a sessão quando o token vence e repete a requisição com o novo token', async () => {
    salvaTokens({ accessToken: 'vencido', refreshToken: 'refresh' });
    fetchFalso
        .mockResolvedValueOnce(resposta(401))
        .mockResolvedValueOnce(resposta(200, { accessToken: 'novo', refreshToken: 'novo-refresh' }))
        .mockResolvedValueOnce(resposta(200, ['consulta']));

    const resultado = await requisicao('consulta');

    expect(resultado.status).toBe(200);
    expect(fetchFalso.mock.calls[1][0]).toBe('/auth/refresh');
    expect(JSON.parse(fetchFalso.mock.calls[1][1].body)).toEqual({ refreshToken: 'refresh' });
    expect(autorizacaoDa(fetchFalso.mock.calls[2])).toBe('Bearer novo');
    expect(tokenDeAcesso()).toBe('novo');
    expect(localStorage.getItem('refreshToken')).toBe('novo-refresh');
});

test('renova uma vez só quando várias requisições recebem 401 juntas', async () => {
    salvaTokens({ accessToken: 'vencido', refreshToken: 'refresh' });
    fetchFalso.mockImplementation(async (url: string, opcoes: RequestInit) => {
        if (url === '/auth/refresh') {
            return resposta(200, { accessToken: 'novo', refreshToken: 'novo-refresh' });
        }
        return new Headers(opcoes.headers).get('Authorization') === 'Bearer novo' ? resposta(200) : resposta(401);
    });

    const resultados = await Promise.all([requisicao('consulta'), requisicao('especialista'), requisicao('admin/insights')]);

    expect(resultados.map((r) => r.status)).toEqual([200, 200, 200]);
    expect(fetchFalso.mock.calls.filter(([url]) => url === '/auth/refresh')).toHaveLength(1);
});

test('encerra a sessão e volta para o login quando não dá para renovar', async () => {
    salvaTokens({ accessToken: 'vencido', refreshToken: 'refresh-vencido' });
    fetchFalso.mockResolvedValueOnce(resposta(401)).mockResolvedValueOnce(resposta(401));

    const resultado = await requisicao('consulta');

    expect(resultado.status).toBe(401);
    expect(tokenDeAcesso()).toBeNull();
    expect(navegacao.paraLogin).toHaveBeenCalled();
});

test('não tenta renovar a sessão em um login com senha errada', async () => {
    salvaTokens({ accessToken: 'antigo', refreshToken: 'refresh' });
    fetchFalso.mockResolvedValueOnce(resposta(401));

    const resultado = await requisicao('auth/login', { method: 'POST' });

    expect(resultado.status).toBe(401);
    expect(fetchFalso).toHaveBeenCalledTimes(1);
    expect(navegacao.paraLogin).not.toHaveBeenCalled();
});

test('encerraSessao avisa a API e apaga os tokens', async () => {
    salvaTokens({ accessToken: 'acesso', refreshToken: 'refresh' });
    fetchFalso.mockResolvedValueOnce(resposta(204));

    await encerraSessao();

    expect(fetchFalso.mock.calls[0][0]).toBe('/auth/logout');
    expect(autorizacaoDa(fetchFalso.mock.calls[0])).toBe('Bearer acesso');
    expect(JSON.parse(fetchFalso.mock.calls[0][1].body)).toEqual({ refreshToken: 'refresh' });
    expect(tokenDeAcesso()).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
});
