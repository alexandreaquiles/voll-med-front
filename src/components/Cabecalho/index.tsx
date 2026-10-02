import styled from 'styled-components';
import logo from './assets/logo.png';
import perfil from './assets/perfil.png';
import pesquisa from './assets/search.png';
import autenticaStore from '../../stores/autentica.store';
import { encerraSessao } from '../../sessao';


const CabecalhoEstilizado = styled.header`
    display:flex;
    align-items: center;
    justify-content: space-between;
    padding: 2em 4em
`

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-grow: .1;
`

const LinkEstilizado = styled.a`
 color: var(--azul-escuro);
 font-weight: 700;
`

const LinkEstilizadoDeslogado = styled(LinkEstilizado)`
font-weight: 400;
text-decoration: none;
color: var(--azul-escuro)
`

const ContainerPesquisa = styled.div`
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  border-radius: 20px;
  padding: 8px 16px;
`;

const InputCustomizado = styled.input`
  flex: 1;
  border: none;
  background: none;
  outline: none;
`;

const SpanCustomizado = styled.span`
  background-image: url(${pesquisa});
  background-repeat: no-repeat;
  width: 25px;
  height: 25px;
background-position: 10px;
`;

const BotaoEstilizado = styled.a`
background-color: var(--azul-escuro);
border-radius: 8px;
padding: 12px 16px;
color: var(--branco);
text-decoration: none;
`


function Cabecalho() {
    // Espera a API invalidar os tokens antes de sair da página, que cancelaria a requisição
    const handleLogout = async (evento: React.MouseEvent<HTMLAnchorElement>) => {
        evento.preventDefault();
        await encerraSessao();
        autenticaStore.logout();
        window.location.assign('/');
    };

    return (
        <CabecalhoEstilizado>
            <img src={logo} alt="logo da empresa Voll" />
            <Container>
                {autenticaStore.estaAutenticado
                    ? <>
                        <img src={perfil} alt="imagem de perfil do usuário" />
                        <LinkEstilizado href="/" onClick={handleLogout}>Sair</LinkEstilizado>
                    </>
                    : <>
                        <LinkEstilizadoDeslogado href="/sobre" >Sobre</LinkEstilizadoDeslogado>
                        <LinkEstilizadoDeslogado href="/cadastro">Cadastre-se</LinkEstilizadoDeslogado>
                        <ContainerPesquisa>
                            <InputCustomizado type="text" placeholder='Digite sua busca' />
                            <SpanCustomizado />
                        </ContainerPesquisa>
                        <BotaoEstilizado href="/login">Entrar</BotaoEstilizado>
                    </>
                }
            </Container>
        </CabecalhoEstilizado>
    )
}

export default Cabecalho;