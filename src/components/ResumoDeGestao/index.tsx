import styled from "styled-components";
import IResumoDeGestao from "../../types/IResumoDeGestao";
import useFetch from "../../useFetch";

const CartaoEstilizado = styled.div`
    background-color: var(--branco);
    padding: 1em 1.5em;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.15);
    border-radius: 8px;
    border-left: 4px solid var(--azul-claro);
    color: var(--cinza);
`

const LinhaEstilizada = styled.p`
    margin: 0.5em 0;
    line-height: 1.4;
`

// Resumo gerado pela voll-med-api (GET /admin/insights) a partir das consultas e cancelamentos da clínica
function ResumoDeGestao() {
    const { dados, erro } = useFetch<IResumoDeGestao>({ url: 'admin/insights' });

    if (erro) {
        return <CartaoEstilizado><LinhaEstilizada>Não foi possível carregar o resumo de gestão.</LinhaEstilizada></CartaoEstilizado>
    }

    return (
        <CartaoEstilizado>
            {dados
                ? dados.resumo.map((linha, indice) => <LinhaEstilizada key={indice}>{linha}</LinhaEstilizada>)
                : <LinhaEstilizada>Carregando resumo...</LinhaEstilizada>}
        </CartaoEstilizado>
    )
}

export default ResumoDeGestao;
