import { useState } from 'react';
import { requisicao, salvaTokens } from './sessao';

export default function usePost() {
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [resposta, setResposta] = useState('');

    async function cadastrarDados<T>({url, dados} : 
        {url: string, dados: T}) {

            try {
            const resposta = await requisicao(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            })
            
           
         const respostaConvertida = await resposta.json();
         // Só o login devolve tokens: os demais POSTs não podem sobrescrever os tokens salvos
         if (respostaConvertida.accessToken) {
             setResposta(respostaConvertida.accessToken);
             salvaTokens(respostaConvertida);
         }

            setSucesso(true);
        } catch (erro) {
        setErro('Não foi possível enviar os dados');
    }
}

return {cadastrarDados, sucesso, erro, resposta}
}
