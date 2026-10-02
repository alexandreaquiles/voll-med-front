import IEndereco from "./IEndereco";

export default interface IProfissional {
    id?: string,
    nome: string,
    crm: string,
    imagem: string,
    especialidade: string,
    possuiPlanoSaude: boolean,
    senha: string,
    planosSaude: string[],
    estaAtivo: boolean,
    email: string,
    telefone: string,
    endereco: IEndereco
}