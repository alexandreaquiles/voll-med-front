import { useEffect, useState } from "react";
import { requisicao } from "./sessao";

export default function useFetch<T>({ url }: { url: string }) {
    const [dados, setDados] = useState<T | null>(null);
    const [erro, setErro] = useState('');
  

    useEffect(() => {
     // Rotas como /consulta exigem o token do usuário logado, que requisicao envia e renova
     requisicao(url)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error(`Erro ${resposta.status} ao buscar ${url}`);
            }
            return resposta.json();
        }).then(dados => setDados(dados)).catch((erro => setErro(erro)))
    
    }, [url])

    
    

    return { dados, erro }

}