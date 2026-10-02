import { act, renderHook, waitFor } from "@testing-library/react";
import { requisicao } from "./sessao";
import useFetch from "./useFetch";
import usePost from "./usePost";

jest.mock("./sessao");
const requisicaoFalsa = requisicao as jest.MockedFunction<typeof requisicao>;

const resposta = (status: number, corpo: unknown) =>
    ({ status, ok: status >= 200 && status < 300, json: async () => corpo }) as Response;

beforeEach(() => requisicaoFalsa.mockReset());

test('useFetch busca de novo os dados quando recarrega é chamado', async () => {
    requisicaoFalsa
        .mockResolvedValueOnce(resposta(200, ['Dra Ana']))
        .mockResolvedValueOnce(resposta(200, ['Dra Ana', 'Dr Novo']));
    const { result } = renderHook(() => useFetch<string[]>({ url: 'especialista' }));
    await waitFor(() => expect(result.current.dados).toEqual(['Dra Ana']));

    act(() => result.current.recarrega());

    await waitFor(() => expect(result.current.dados).toEqual(['Dra Ana', 'Dr Novo']));
    expect(requisicaoFalsa).toHaveBeenCalledTimes(2);
});

test('cadastrarDados informa se a API aceitou o cadastro', async () => {
    requisicaoFalsa
        .mockResolvedValueOnce(resposta(200, { id: '1' }))
        .mockResolvedValueOnce(resposta(422, { message: 'Crm já cadastrado' }));
    const { result } = renderHook(() => usePost());

    let aceito: boolean | undefined;
    await act(async () => { aceito = await result.current.cadastrarDados({ url: 'especialista', dados: {} }); });
    expect(aceito).toBe(true);

    await act(async () => { aceito = await result.current.cadastrarDados({ url: 'especialista', dados: {} }); });
    expect(aceito).toBe(false);
});
