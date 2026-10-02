import { useEffect, useState } from "react";
import { API_URL } from "./api";

export default function useFetch<T>({ url }: { url: string }) {
    const [dados, setDados] = useState<T | null>(null);
    const [erro, setErro] = useState('');
  

    useEffect(() => {
     fetch(`${API_URL}/${url}`)
        .then(
            resposta => resposta.json()
        ).then(dados => setDados(dados)).catch((erro => setErro(erro)))
    
    }, [url])

    
    

    return { dados, erro }

}