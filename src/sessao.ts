import { API_URL } from "./api";

// Tokens da sessão, devolvidos pela voll-med-api no login e na renovação (POST /auth/refresh).
// O token de acesso vale 20 minutos; o refresh token, 5 dias, e só pode ser usado uma vez.
export interface Tokens {
    accessToken: string,
    refreshToken: string
}

const CHAVE_DO_TOKEN = 'token';
const CHAVE_DO_REFRESH_TOKEN = 'refreshToken';

export function salvaTokens({ accessToken, refreshToken }: Tokens) {
    localStorage.setItem(CHAVE_DO_TOKEN, accessToken);
    localStorage.setItem(CHAVE_DO_REFRESH_TOKEN, refreshToken);
}

export const tokenDeAcesso = (): string | null => localStorage.getItem(CHAVE_DO_TOKEN);

function apagaTokens() {
    localStorage.removeItem(CHAVE_DO_TOKEN);
    localStorage.removeItem(CHAVE_DO_REFRESH_TOKEN);
}

// Separado para os testes poderem trocar o redirecionamento
export const navegacao = {
    paraLogin: () => window.location.assign('/login')
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function renovaSessao(): Promise<boolean> {
    const refreshToken = localStorage.getItem(CHAVE_DO_REFRESH_TOKEN);
    if (!refreshToken) {
        return false;
    }
    const resposta = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ refreshToken })
    });
    if (!resposta.ok) {
        return false;
    }
    salvaTokens(await resposta.json());
    return true;
}

// Várias requisições podem receber 401 ao mesmo tempo, mas cada refresh token só vale uma vez:
// todas esperam a mesma renovação
let renovacaoEmAndamento: Promise<boolean> | null = null;

function renovaSessaoUmaVez(): Promise<boolean> {
    if (!renovacaoEmAndamento) {
        renovacaoEmAndamento = renovaSessao()
            .catch(() => false)
            .finally(() => { renovacaoEmAndamento = null; });
    }
    return renovacaoEmAndamento;
}

function comToken(opcoes: RequestInit = {}): RequestInit {
    const headers = new Headers(opcoes.headers);
    const token = tokenDeAcesso();
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    return { ...opcoes, headers };
}

// fetch para a API com o token do usuário. Se o token venceu (401), renova a sessão e repete a
// requisição; se não der para renovar, encerra a sessão e volta para o login. As rotas de
// autenticação ficam de fora: um 401 nelas é senha errada, não sessão vencida.
export async function requisicao(url: string, opcoes?: RequestInit): Promise<Response> {
    const resposta = await fetch(`${API_URL}/${url}`, comToken(opcoes));
    if (resposta.status !== 401 || url.startsWith('auth/') || !tokenDeAcesso()) {
        return resposta;
    }

    if (await renovaSessaoUmaVez()) {
        return fetch(`${API_URL}/${url}`, comToken(opcoes));
    }
    apagaTokens();
    navegacao.paraLogin();
    return resposta;
}

// Apaga os tokens e pede à API para invalidá-los
export async function encerraSessao(): Promise<void> {
    const token = tokenDeAcesso();
    const refreshToken = localStorage.getItem(CHAVE_DO_REFRESH_TOKEN);
    apagaTokens();
    if (!token || !refreshToken) {
        return;
    }
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: { ...JSON_HEADERS, Authorization: `Bearer ${token}` },
            body: JSON.stringify({ refreshToken })
        });
    } catch {
        // Os tokens já saíram do navegador; se a API não respondeu, eles vencem sozinhos
    }
}
