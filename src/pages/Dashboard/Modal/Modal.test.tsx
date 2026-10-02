import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { requisicao } from "../../../sessao";
import ModalCadastro from ".";

jest.mock("../../../sessao");
const requisicaoFalsa = requisicao as jest.MockedFunction<typeof requisicao>;

test('envia os planos de saúde marcados no campo que a API lê', async () => {
    requisicaoFalsa.mockResolvedValue({ status: 200, ok: true, json: async () => ({ id: '1' }) } as Response);
    render(<ModalCadastro open={true} handleClose={jest.fn()} />);

    userEvent.click(screen.getByLabelText('Atende por plano?'));
    userEvent.click(screen.getByLabelText('Unimed'));
    userEvent.click(screen.getByLabelText('Biosaúde'));
    userEvent.click(screen.getByText('Cadastrar'));

    await waitFor(() => expect(requisicaoFalsa).toHaveBeenCalled());
    const [url, opcoes] = requisicaoFalsa.mock.calls[0];
    const enviado = JSON.parse(String(opcoes?.body));
    expect(url).toBe('especialista');
    expect(enviado.possuiPlanoSaude).toBe(true);
    expect(enviado.planosSaude).toEqual(['Unimed', 'Biosaude']);
    expect(enviado).not.toHaveProperty('planoSaude');
});
