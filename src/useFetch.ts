import { useEffect, useState } from "react";
import { API_URL } from "./api";
import autenticaStore from "./stores/autentica.store";

export default function useFetch<T>({ url }: { url: string }) {
    const [dados, setDados] = useState<T | null>(null);
    const [erro, setErro] = useState('');
  

    useEffect(() => {
     // Rotas como /consulta exigem o token do usuário logado
     const token = autenticaStore.usuario.token || localStorage.getItem('token');
     const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

     fetch(`${API_URL}/${url}`, { headers })
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error(`Erro ${resposta.status} ao buscar ${url}`);
            }
            return resposta.json();
        }).then(dados => setDados(dados)).catch((erro => setErro(erro)))
    
    }, [url])

    
    

    return { dados, erro }

}