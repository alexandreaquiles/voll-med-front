// Formato devolvido pela voll-med-api em GET /consulta (sem dados sensíveis do paciente)
export default interface IConsulta {
    id: string,
    data: string,
    paciente: {
        id: string,
        nome: string
    },
    especialista: {
        id: string,
        nome: string,
        especialidade: string
    }
}
