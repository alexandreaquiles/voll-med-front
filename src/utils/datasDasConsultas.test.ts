import IConsulta from "../types/IConsulta";
import { consultasDoDia, consultasDoMes, nomeDoMes } from "./datasDasConsultas";

const consulta = (id: string, data: string): IConsulta => ({
    id,
    data,
    paciente: { id: 'p', nome: 'Paciente' },
    especialista: { id: 'e', nome: 'Especialista', especialidade: 'Cardiologia' }
});

const consultas = [
    consulta('tarde', '2026-10-02T15:00:00.000Z'),
    consulta('ontem', '2026-10-01T10:00:00.000Z'),
    consulta('manha', '2026-10-02T09:00:00.000Z'),
    consulta('setembro', '2026-09-30T18:00:00.000Z')
];

test('consultasDoDia mantém só as consultas do dia, por horário', () => {
    expect(consultasDoDia(consultas, '2026-10-02').map((c) => c.id)).toEqual(['manha', 'tarde']);
});

test('consultasDoMes mantém só as consultas do mês', () => {
    expect(consultasDoMes(consultas, '2026-10').map((c) => c.id)).toEqual(['tarde', 'ontem', 'manha']);
});

test('nomeDoMes formata como Mês/AA', () => {
    expect(nomeDoMes('2026-10')).toBe('Outubro/26');
    expect(nomeDoMes('2027-03')).toBe('Março/27');
});
