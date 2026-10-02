import IConsulta from "../types/IConsulta";

// A voll-med-api trata o horário das consultas em UTC (horário de funcionamento da clínica), e a
// tabela as mostra em UTC. Por isso o dia e o mês da consulta saem da data em UTC, enquanto "hoje"
// é o dia no calendário de quem usa o dashboard.
const diaDaConsulta = (consulta: IConsulta): string => new Date(consulta.data).toISOString().slice(0, 10);

const doisDigitos = (numero: number): string => String(numero).padStart(2, '0');

// Formato AAAA-MM-DD
function hoje(): string {
    const agora = new Date();
    return `${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}-${doisDigitos(agora.getDate())}`;
}

// Formato AAAA-MM
export const mesAtual = (): string => hoje().slice(0, 7);

export function consultasDoDia(consultas: IConsulta[], dia: string = hoje()): IConsulta[] {
    return consultas
        .filter((consulta) => diaDaConsulta(consulta) === dia)
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
}

export function consultasDoMes(consultas: IConsulta[], mes: string = mesAtual()): IConsulta[] {
    return consultas.filter((consulta) => diaDaConsulta(consulta).startsWith(mes));
}

// "2026-10" -> "Outubro/26"
export function nomeDoMes(mes: string = mesAtual()): string {
    const [ano, numeroDoMes] = mes.split('-').map(Number);
    const nome = new Date(ano, numeroDoMes - 1, 1).toLocaleDateString('pt-BR', { month: 'long' });
    return `${nome.charAt(0).toUpperCase()}${nome.slice(1)}/${String(ano).slice(2)}`;
}
