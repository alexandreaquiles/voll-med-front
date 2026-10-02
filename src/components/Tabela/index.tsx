import styled from "@emotion/styled";
import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IConsulta from "../../types/IConsulta";

const CelulaEstilizada = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        color: "var(--azul-escuro)",
        fontSize: 18,
        fontWeight: 700,
        fontFamily: "var(--fonte-principal)"
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 16,
        fontFamily: "var(--fonte-principal)"
    }
}))

const LinhaEstilizada = styled(TableRow)(() => ({
    [`&:nth-of-type(odd)`]: {
        backgroundColor: "var(--cinza-claro)",
        align: "right"
    }
}))

// A voll-med-api trata os horários das consultas em UTC (horário de funcionamento da clínica)
const formatoDaData: Intl.DateTimeFormatOptions = { timeZone: 'UTC' };
const formatoDoHorario: Intl.DateTimeFormatOptions = { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' };

function Tabela({ consultas }: { consultas: IConsulta[] | null }) {
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="tabela-customizada">
                    <TableHead>
                        <TableRow>
                            <CelulaEstilizada>Data</CelulaEstilizada>
                            <CelulaEstilizada>Horário</CelulaEstilizada>
                            <CelulaEstilizada>Profissional</CelulaEstilizada>
                            <CelulaEstilizada>Especialidade</CelulaEstilizada>
                            <CelulaEstilizada>Paciente</CelulaEstilizada>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {consultas?.length === 0 && (
                            <TableRow>
                                <CelulaEstilizada colSpan={5}>Nenhuma consulta para hoje.</CelulaEstilizada>
                            </TableRow>
                        )}
                        {consultas?.map((linha) => {
                            return (
                                <LinhaEstilizada key={linha.id}>
                                    <CelulaEstilizada component="th" scope="row">{new Date(linha.data).toLocaleDateString('pt-BR', formatoDaData)}</CelulaEstilizada>
                                    <CelulaEstilizada>{new Date(linha.data).toLocaleTimeString('pt-BR', formatoDoHorario)}</CelulaEstilizada>
                                    <CelulaEstilizada>{linha.especialista?.nome}</CelulaEstilizada>
                                    <CelulaEstilizada>{linha.especialista?.especialidade}</CelulaEstilizada>
                                    <CelulaEstilizada>{linha.paciente?.nome}</CelulaEstilizada>
                                </LinhaEstilizada>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Tabela;