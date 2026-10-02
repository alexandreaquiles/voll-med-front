import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { requisicao } from "../../sessao";
import Login from ".";

jest.mock("../../sessao");
const requisicaoFalsa = requisicao as jest.MockedFunction<typeof requisicao>;

const resposta = (status: number, corpo: unknown) =>
    ({ status, ok: status >= 200 && status < 300, json: async () => corpo }) as Response;

function tentaEntrar() {
    render(<MemoryRouter><Login /></MemoryRouter>);
    userEvent.type(screen.getByPlaceholderText('Insira seu endereço de email'), 'gestor@voll.com');
    userEvent.type(screen.getByPlaceholderText('Insira sua senha'), 'Errada@123');
    userEvent.click(screen.getByText('Entrar'));
}

beforeEach(() => {
    localStorage.clear();
    requisicaoFalsa.mockReset();
});

test('mostra a mensagem da API quando o email ou a senha estão errados', async () => {
    requisicaoFalsa.mockResolvedValue(resposta(401, { status: 401, message: 'Email ou senha inválidos' }));

    tentaEntrar();

    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou senha inválidos');
});

test('mostra a mensagem da API quando há tentativas demais', async () => {
    requisicaoFalsa.mockResolvedValue(resposta(429, { status: 429, message: 'Muitas tentativas de login. Tente de novo em 15 minutos.' }));

    tentaEntrar();

    expect(await screen.findByRole('alert')).toHaveTextContent('Muitas tentativas de login');
});

test('avisa quando não consegue falar com a API', async () => {
    requisicaoFalsa.mockRejectedValue(new TypeError('Failed to fetch'));

    tentaEntrar();

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível');
});
