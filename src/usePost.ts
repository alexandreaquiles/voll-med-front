import { useState } from 'react';
import { API_URL } from './api';

export default function usePost() {
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [resposta, setResposta] = useState('');

    async function cadastrarDados<T>({url, dados, token} : 
        {url: string, dados: T, token?: string}) {
            
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            }
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            try {
            const resposta = await fetch(`${API_URL}/${url}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(dados)
            })
            
           
         const respostaConvertida = await resposta.json();
         // Só o login devolve token: os demais POSTs não podem sobrescrever o token salvo
         if (respostaConvertida.accessToken) {
             setResposta(respostaConvertida.accessToken);
             localStorage.setItem('token', respostaConvertida.accessToken);
         }

            setSucesso(true);
        } catch (erro) {
        setErro('Não foi possível enviar os dados');
    }
}

return {cadastrarDados, sucesso, erro, resposta}
}
