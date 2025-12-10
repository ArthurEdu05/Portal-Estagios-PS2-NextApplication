/**
 * @fileoverview Ponto de entrada principal da aplicação frontend do Portal de Estágios.
 * Este arquivo atua como o componente raiz (`App.js`) que gerencia o estado global,
 * a navegação entre as diferentes telas (`setTela`), e a interação com a API de backend.
 * Ele define todas as funções de manipulação de dados e autenticação que são passadas
 * como props para os componentes de tela específicos.
 */

'use client';

import React, { useState, useEffect } from 'react';
// Importa todos os componentes de tela utilizados na aplicação.
import TelaHome from './components/TelaHome';
import TelaLogin from './components/TelaLogin';
import TelaEscolherCadastro from './components/TelaEscolherCadastro';
import TelaCadastroEstudante from './components/TelaCadastroEstudante';
import TelaCadastroEmpresa from './components/TelaCadastroEmpresa';
import TelaCadastroAdmin from './components/TelaCadastroAdmin';
import TelaAdminDashboard from './components/TelaAdminDashboard';
import TelaPainelEmpresa from './components/TelaPainelEmpresa';
import TelaFormularioVaga from './components/TelaFormularioVaga';
import TelaAreasInteresseAdmin from './components/TelaAreasInteresseAdmin';
import TelaListaEmpresasAdmin from './components/TelaListaEmpresasAdmin';
import TelaListaEstudantesAdmin from './components/TelaListaEstudantesAdmin';
import TelaListaVagasAdmin from './components/TelaListaVagasAdmin';
import TelaMinhasCandidaturas from './components/TelaMinhasCandidaturas';

// URL base para todas as chamadas de API.
const API_BASE_URL = 'http://localhost:8080';

/**
 * Objeto `api` contendo todas as funções de interação com o backend.
 * Cada função encapsula uma chamada HTTP para um endpoint específico.
 */
const api = {
	/**
	 * Realiza a autenticação de um usuário.
	 * @param {string} login - O email do usuário.
	 * @param {string} senha - A senha do usuário.
	 * @returns {Promise<object>} Os dados do usuário autenticado e o token JWT.
	 * @throws {Error} Se o login falhar.
	 */
	login: async (login, senha) => {
		const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: login, senha }),
		});
		if (!response.ok) {
			const errorData = await response.json();
			console.error(
				'Login failed with status:',
				response.status,
				'and message:',
				errorData
			);
			throw new Error(errorData.mensagem || 'Falha no login');
		}
		return response.json();
	},

	/**
	 * Cadastra um novo estudante.
	 * @param {object} dados - Os dados do estudante para cadastro.
	 * @returns {Promise<object>} Os dados do estudante cadastrado.
	 * @throws {Error} Se o cadastro falhar.
	 */
	cadastrarEstudante: async (dados) => {
		const response = await fetch(`${API_BASE_URL}/estudante`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao cadastrar estudante');
		return response.json();
	},

	/**
	 * Atualiza os dados de um estudante existente.
	 * @param {number} id - O ID do estudante.
	 * @param {object} dadosEstudante - Os novos dados do estudante.
	 * @param {string} token - O token de autenticação.
	 * @returns {Promise<object>} Os dados do estudante atualizado.
	 * @throws {Error} Se a atualização falhar.
	 */
	atualizarEstudante: async (id, dadosEstudante, token) => {
		const response = await fetch(`${API_BASE_URL}/estudante/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify(dadosEstudante),
		});
		if (!response.ok) throw new Error('Falha ao atualizar perfil do estudante');
		return response.json();
	},

	/**
	 * Busca os detalhes completos de um estudante pelo ID.
	 * @param {number} id - O ID do estudante.
	 * @param {string} token - O token de autenticação.
	 * @returns {Promise<object>} Os dados completos do estudante.
	 * @throws {Error} Se a busca falhar.
	 */
	getEstudanteById: async (id, token) => {
		const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
		const response = await fetch(`${API_BASE_URL}/estudante/${id}`, { headers });
		if (!response.ok) throw new Error('Falha ao buscar estudante por ID');
		return response.json();
	},

	/**
	 * Cadastra uma nova empresa.
	 * @param {object} dados - Os dados da empresa para cadastro.
	 * @returns {Promise<object>} Os dados da empresa cadastrada.
	 * @throws {Error} Se o cadastro falhar.
	 */
	cadastrarEmpresa: async (dados) => {
		const response = await fetch(`${API_BASE_URL}/empresa`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao cadastrar empresa');
		return response.json();
	},

	/**
	 * Cadastra um novo administrador.
	 * @param {object} dados - Os dados do administrador para cadastro.
	 * @returns {Promise<object>} Os dados do administrador cadastrado.
	 * @throws {Error} Se o cadastro falhar.
	 */
	cadastrarAdmin: async (dados) => {

		const response = await fetch(`${API_BASE_URL}/admin`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao cadastrar administrador');
		return response.json();
	},

	/**
	 * Cadastra uma nova vaga de estágio.
	 * @param {object} dados - Os dados da vaga para cadastro.
	 * @param {string} token - O token de autenticação da empresa.
	 * @returns {Promise<object>} Os dados da vaga cadastrada.
	 * @throws {Error} Se o cadastro falhar.
	 */
	cadastrarVaga: async (dados, token) => {
		const response = await fetch(`${API_BASE_URL}/vagaEstagio`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao criar vaga');
		return response.json();
	},

	/**
	 * Atualiza os dados de uma vaga de estágio existente.
	 * @param {number} id - O ID da vaga.
	 * @param {object} dados - Os novos dados da vaga.
	 * @param {string} token - O token de autenticação da empresa.
	 * @returns {Promise<object>} Os dados da vaga atualizada.
	 * @throws {Error} Se a atualização falhar.
	 */
	atualizarVaga: async (id, dados, token) => {
		const response = await fetch(`${API_BASE_URL}/vagaEstagio/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao atualizar vaga');
		return response.json();
	},

	/**
	 * Lista todas as vagas de estágio.
	 * @param {string} [token] - Opcional: token de autenticação para acesso a vagas protegidas.
	 * @returns {Promise<Array<object>>} Uma lista de vagas.
	 * @throws {Error} Se a busca falhar.
	 */
	listarVagas: async (token) => {
		const headers = { 'Content-Type': 'application/json' };
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
		const response = await fetch(`${API_BASE_URL}/vagaEstagio`, {
			headers,
		});
		if (!response.ok) throw new Error('Falha ao buscar vagas');
		return response.json();
	},

	/**
	 * Realiza a inscrição de um estudante em uma vaga.
	 * @param {object} dadosInscricao - Contém `vagaEstagio.id`, `estudante.id`, `dataInscricao` e `status`.
	 * @param {string} token - O token de autenticação do estudante.
	 * @returns {Promise<object>} Os dados da inscrição criada.
	 * @throws {Error} Se a inscrição falhar.
	 */
	inscreverVaga: async (dadosInscricao, token) => {
		const response = await fetch(`${API_BASE_URL}/inscricao`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(dadosInscricao),
		});
		if (!response.ok) throw new Error('Falha ao se inscrever');
		return response.json();
	},

	/**
	 * Lista todas as áreas de interesse disponíveis.
	 * @returns {Promise<Array<object>>} Uma lista de áreas de interesse.
	 * @throws {Error} Se a busca falhar.
	 */
	listarAreas: async () => {
		const response = await fetch(`${API_BASE_URL}/areaInteresse`);
		if (!response.ok) throw new Error('Falha ao buscar áreas');
		return response.json();
	},

	/**
	 * Lista todos os estudantes cadastrados.
	 * Requer autenticação de administrador.
	 * @param {string} token - O token de autenticação do administrador.
	 * @returns {Promise<Array<object>>} Uma lista de estudantes.
	 * @throws {Error} Se a busca falhar.
	 */
	listarEstudantes: async (token) => {
		const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
		const response = await fetch(`${API_BASE_URL}/estudante`, { headers });
		if (!response.ok) throw new Error('Falha ao buscar estudantes');
		return response.json();
	},

	/**
	 * Lista todas as empresas cadastradas.
	 * Requer autenticação de administrador.
	 * @param {string} token - O token de autenticação do administrador.
	 * @returns {Promise<Array<object>>} Uma lista de empresas.
	 * @throws {Error} Se a busca falhar.
	 */
	listarEmpresas: async (token) => {
		const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
		const response = await fetch(`${API_BASE_URL}/empresa`, { headers });
		if (!response.ok) throw new Error('Falha ao buscar empresas');
		return response.json();
	},

	/**
	 * Cadastra uma nova área de interesse.
	 * Requer autenticação de administrador.
	 * @param {object} dados - Os dados da área de interesse para cadastro.
	 * @param {string} token - O token de autenticação do administrador.
	 * @returns {Promise<object>} Os dados da área cadastrada.
	 * @throws {Error} Se o cadastro falhar.
	 */
	cadastrarAreaInteresse: async (dados, token) => {
		const response = await fetch(`${API_BASE_URL}/areaInteresse`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao cadastrar área de interesse');
		return response.json();
	},

	/**
	 * Atualiza uma área de interesse existente.
	 * Requer autenticação de administrador.
	 * @param {number} id - O ID da área de interesse.
	 * @param {object} dados - Os novos dados da área de interesse.
	 * @param {string} token - O token de autenticação do administrador.
	 * @returns {Promise<object>} Os dados da área atualizada.
	 * @throws {Error} Se a atualização falhar.
	 */
	atualizarAreaInteresse: async (id, dados, token) => {
		const response = await fetch(`${API_BASE_URL}/areaInteresse/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao atualizar área de interesse');
		return response.json();
	},

	/**
	 * Deleta uma área de interesse.
	 * Requer autenticação de administrador.
	 * @param {number} id - O ID da área de interesse a ser deletada.
	 * @param {string} token - O token de autenticação do administrador.
	 * @returns {Promise<object>} Confirmação da exclusão.
	 * @throws {Error} Se a exclusão falhar.
	 */
	deletarAreaInteresse: async (id, token) => {
		const response = await fetch(`${API_BASE_URL}/areaInteresse/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error('Falha ao deletar área de interesse');
		return response.json();
	},

	/**
	 * Encerra uma vaga de estágio, alterando seu status para 'FECHADA'.
	 * Requer autenticação da empresa que publicou a vaga.
	 * @param {number} id - O ID da vaga a ser encerrada.
	 * @param {string} token - O token de autenticação da empresa.
	 * @returns {Promise<object>} Os dados da vaga atualizada.
	 * @throws {Error} Se o encerramento falhar.
	 */
	encerrarVaga: async (id, token) => {
		const response = await fetch(`${API_BASE_URL}/vagaEstagio/${id}/encerrar`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error('Falha ao encerrar vaga');
		return response.json();
	},

	/**
	 * Reabre uma vaga de estágio, alterando seu status para 'ABERTA'.
	 * Requer autenticação da empresa que publicou a vaga.
	 * @param {number} id - O ID da vaga a ser reaberta.
	 * @param {string} token - O token de autenticação da empresa.
	 * @returns {Promise<object>} Os dados da vaga atualizada.
	 * @throws {Error} Se a reabertura falhar.
	 */
	reabrirVaga: async (id, token) => {
		const response = await fetch(`${API_BASE_URL}/vagaEstagio/${id}/reabrir`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error('Falha ao reabrir vaga');
		return response.json();
	},

	/**
	 * Lista todas as inscrições.
	 * Requer autenticação de usuário (estudante para suas inscrições, empresa para inscrições em suas vagas).
	 * @param {string} token - O token de autenticação.
	 * @returns {Promise<Array<object>>} Uma lista de inscrições.
	 * @throws {Error} Se a busca falhar.
	 */
	listarInscricoes: async (token) => {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};
		const response = await fetch(`${API_BASE_URL}/inscricao`, { headers });
		if (!response.ok) throw new Error('Falha ao buscar inscrições');
		return response.json();
	},

	/**
	 * Cancela uma inscrição de estágio.
	 * Requer autenticação do estudante que fez a inscrição.
	 * @param {number} inscricaoId - O ID da inscrição a ser cancelada.
	 * @param {string} token - O token de autenticação do estudante.
	 * @returns {Promise<object>} Confirmação do cancelamento.
	 * @throws {Error} Se o cancelamento falhar.
	 */
	cancelarInscricao: async (inscricaoId, token) => {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};
		const response = await fetch(
			`${API_BASE_URL}/inscricao/${inscricaoId}`,
			{
				method: 'DELETE',
				headers,
			}
		);
		if (!response.ok) throw new Error('Falha ao cancelar inscrição');
		return response.json();
	},

	/**
	 * Deleta permanentemente uma vaga de estágio.
	 * Requer autenticação da empresa que publicou a vaga.
	 * @param {number} vagaId - O ID da vaga a ser deletada.
	 * @param {string} token - O token de autenticação da empresa.
	 * @returns {Promise<Response>} A resposta da requisição.
	 * @throws {Error} Se a deleção falhar.
	 */
	deletarVaga: async (vagaId, token) => {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};
		const response = await fetch(`${API_BASE_URL}/vagaEstagio/${vagaId}`, {
			method: 'DELETE',
			headers,
		});
		if (!response.ok) {
			throw new Error('Falha ao deletar vaga permanentemente');
		}
		return response;
	},
};

/**
 * Componente principal da aplicação Portal de Estágios.
 * Gerencia o estado global de autenticação, dados de vagas, áreas de interesse, e a navegação entre as diferentes telas da aplicação.
 * Todas as interações com a API são centralizadas aqui e passadas como props.
 * @returns {JSX.Element} O componente raiz da aplicação.
 */
export default function PortalEstagios() {
	// Estados globais da aplicação.
	const [usuario, setUsuario] = useState(null); // Armazena os dados do usuário logado.
	const [token, setToken] = useState(null); // Armazena o token JWT para autenticação.
	const [tela, setTela] = useState('home'); // Controla qual tela está sendo exibida.
	const [vagas, setVagas] = useState([]); // Lista de todas as vagas de estágio.
	const [inscricoes, setInscricoes] = useState([]); // Lista de inscrições de estudantes em vagas.
	const [areasInteresse, setAreasInteresse] = useState([]); // Lista de todas as áreas de interesse.
	const [estudantes, setEstudantes] = useState([]); // Lista de estudantes (para admin).
	const [empresas, setEmpresas] = useState([]); // Lista de empresas (para admin).
	const [vagaEmEdicao, setVagaEmEdicao] = useState(null); // Armazena dados da vaga sendo editada.
	const [filtro, setFiltro] = useState(''); // Termo de busca para filtrar vagas na Home.
	const [filtroVagasAdmin, setFiltroVagasAdmin] = useState('TODAS'); // Filtro de status para vagas no painel administrativo.

	/**
	 * Navega para a tela de lista de vagas do administrador com um filtro específico.
	 * @param {string} filtro - O status pelo qual as vagas devem ser filtradas ('TODAS', 'ABERTA', 'FECHADA').
	 */
	const handleVerListaVagas = (filtro) => {
		setFiltroVagasAdmin(filtro);
		setTela('admin-lista-vagas');
	};

	/**
	 * Efeito que carrega dados iniciais e mantém o estado da aplicação atualizado.
	 * - Busca e verifica o status das vagas, reabrindo ou encerrando automaticamente se necessário.
	 * - Carrega áreas de interesse.
	 * - Carrega estudantes e empresas se o usuário for um administrador.
	 * - Carrega inscrições se o usuário for estudante ou empresa.
	 */
	useEffect(() => {
		const hoje = new Date();
		hoje.setHours(0, 0, 0, 0);

		const verificarEAtualizarVagas = async () => {
			try {
				const vagasRecebidas = await api.listarVagas(token);
				let algumaVagaAtualizada = false;
				const promises = [];

				for (const vaga of vagasRecebidas) {
					const dataFim = new Date(vaga.dataFim);
					dataFim.setHours(0, 0, 0, 0);

					const dataInicio = new Date(vaga.dataInicio);
					dataInicio.setHours(0, 0, 0, 0);


					// Se a vaga está ABERTA mas já expirou, a encerra.
					if (vaga.status === 'ABERTA' && dataFim < hoje) {
						promises.push(api.encerrarVaga(vaga.id, token));
						algumaVagaAtualizada = true;
					}

					// Se a vaga está FECHADA mas deveria estar aberta (dentro do período), a reabre.
					else if (vaga.status === 'FECHADA' && dataInicio <= hoje && dataFim >= hoje) {
						promises.push(api.reabrirVaga(vaga.id, token));
						algumaVagaAtualizada = true;
					}
				}

				if (algumaVagaAtualizada) {
					await Promise.all(promises);
					// Busca as vagas novamente para ter a lista mais atualizada após as mudanças.
					const vagasAtualizadas = await api.listarVagas(token);
					setVagas(vagasAtualizadas);
				} else {
					// Se nenhuma vaga foi atualizada, apenas seta as vagas recebidas.
					setVagas(vagasRecebidas);
				}

			} catch (error) {
				console.error('ERRO AO BUSCAR E VERIFICAR VAGAS DO BACKEND:', error);
			}
		};

		verificarEAtualizarVagas(); // Chama a função para verificar e atualizar vagas.

		// Carrega as áreas de interesse.
		api.listarAreas()
			.then(data => setAreasInteresse(data))
			.catch(error => console.error('ERRO AO BUSCAR ÁREAS DE INTERESSE:', error));

		// Carrega estudantes e empresas se o usuário for um administrador.
		if (usuario?.tipo === 'ADMIN') {
			api.listarEstudantes(token)
				.then(data => setEstudantes(data))
				.catch(error => console.error('ERRO AO BUSCAR ESTUDANTES:', error));
			api.listarEmpresas(token)
				.then(data => setEmpresas(data))
				.catch(error => console.error('ERRO AO BUSCAR EMPRESAS:', error));
		}

		// Carrega inscrições se o usuário for estudante ou empresa.
		if (usuario && usuario.tipo === 'ESTUDANTE') {
			api.listarInscricoes(token)
				.then((data) => {
					// Filtra as inscrições para mostrar apenas as do estudante logado.
					const minhasInscricoes = data.filter(
						(i) => i.estudante.id === usuario.id
					);
					setInscricoes(minhasInscricoes);
				})
				.catch((error) => {
					console.error(
						'ERRO AO BUSCAR INSCRIÇÕES DO BACKEND:',
						error
					);
				});
		} else if (usuario && usuario.tipo === 'EMPRESA') {
			api.listarInscricoes(token)
				.then((data) => {
					setInscricoes(data); // Empresas veem todas as inscrições para suas vagas.
				})
				.catch((error) => {

					console.error(
						'ERRO AO BUSCAR INSCRIÇÕES DO BACKEND:',
						error
					);
				});
		} else {
			setInscricoes([]); // Se não for estudante nem empresa, não há inscrições para mostrar.
		}
	}, [usuario, token]); // Dependências do useEffect: re-executa se usuario ou token mudarem.

	/**
	 * Função para realizar o login do usuário.
	 * Autentica com a API e, se bem-sucedido, define o usuário e o token globalmente,
	 * além de redirecionar para a tela apropriada.
	 * @param {object} credenciais - Objeto contendo `email` e `senha`.
	 * @throws {Error} Se o login falhar.
	 */
	const fazerLogin = async (credenciais) => {
		try {
			const data = await api.login(
				credenciais.email,
				credenciais.senha
			);

			const token = data.token;
			let fullUserData = { ...data };

			// Se for estudante, busca o perfil completo para incluir áreas de interesse.
			if (data.tipo === 'ESTUDANTE') {
				try {
					const estudanteCompleto = await api.getEstudanteById(data.id, token);
					fullUserData = { ...estudanteCompleto, tipo: 'ESTUDANTE' };
				} catch (profileError) {
					console.error('Erro ao buscar perfil completo do estudante:', profileError);
				}
			}

			setUsuario(fullUserData);
			setToken(token);

			// Redireciona para a tela inicial baseada no tipo de usuário.
			if (data.tipo === 'ESTUDANTE') setTela('vagas');
			else if (data.tipo === 'EMPRESA') setTela('minhas-vagas');
			else if (data.tipo === 'ADMIN') setTela('admin-dashboard');
		} catch (error) {
			console.error('Erro no login:', error.message);

			throw error; // Propaga o erro para o componente de login.
		}
	};

	/**
	 * Função para realizar o logout do usuário.
	 * Limpa o estado do usuário e token, e redireciona para a tela inicial.
	 */
	const fazerLogout = () => {
		setUsuario(null);
		setToken(null);
		setVagaEmEdicao(null); // Limpa qualquer vaga em edição.
		setTela('home');
	};

	/**
	 * Manipula a inscrição de um estudante em uma vaga.
	 * @param {object} vaga - O objeto da vaga em que o estudante está se inscrevendo.
	 */
	const handleInscricao = async (vaga) => {
		if (!usuario) {
			alert('Você tem que estar logado para se inscrever em uma vaga.');
			setTela('login');
			return;
		}

		if (usuario.tipo !== 'ESTUDANTE') {
			alert('Apenas estudantes podem se inscrever em vagas.');
			return;
		}

		try {
			const dadosInscricao = {
				vagaEstagio: { id: vaga.id },
				estudante: { id: usuario.id },
				dataInscricao: new Date().toISOString(),
				status: 'PENDENTE',
			};
			const novaInscricao = await api.inscreverVaga(dadosInscricao, token);
			setInscricoes([...inscricoes, novaInscricao]); // Adiciona a nova inscrição ao estado.
			alert(`Inscrição na vaga "${vaga.titulo}" realizada com sucesso!`);
		} catch (error) {
			console.error('Erro ao se inscrever na vaga:', error);
			alert('Erro ao se inscrever na vaga: ' + error.message);
		}
	};

	/**
	 * Manipula o cancelamento de uma inscrição.
	 * @param {number} inscricaoId - O ID da inscrição a ser cancelada.
	 */
	const handleCancelarInscricao = async (inscricaoId) => {
		try {
			await api.cancelarInscricao(inscricaoId, token);

			// Remove a inscrição cancelada do estado.
			setInscricoes(
				inscricoes.filter((inscricao) => inscricao.id !== inscricaoId)
			);
			alert('Sua inscrição foi cancelada com sucesso.');
		} catch (error) {
			console.error('Erro ao cancelar inscrição:', error);
			alert('Erro ao cancelar inscrição: ' + error.message);
		}
	};

	/**
	 * Manipula o cadastro de um novo estudante.
	 * @param {object} formData - Os dados do formulário do estudante.
	 * @throws {Error} Se o cadastro falhar.
	 */
	const cadastrarEstudante = async (formData) => {
		try {
			await api.cadastrarEstudante(formData);
			alert('Cadastro de estudante realizado com sucesso!');
			setTela('login'); // Redireciona para login após o cadastro.
		} catch (error) {
			console.error('Erro no cadastro:', error);
			alert('Erro ao cadastrar estudante: ' + error.message);
			throw error;
		}
	};

	/**
	 * Manipula o cadastro de uma nova empresa.
	 * @param {object} formData - Os dados do formulário da empresa.
	 * @throws {Error} Se o cadastro falhar.
	 */
	const cadastrarEmpresa = async (formData) => {
		try {
			await api.cadastrarEmpresa(formData);
			alert('Cadastro de empresa realizado com sucesso!');
			setTela('login'); // Redireciona para login após o cadastro.
		} catch (error) {
			console.error('Erro no cadastro:', error);
			alert('Erro ao cadastrar empresa: ' + error.message);
			throw error;
		}
	};

	/**
	 * Manipula o cadastro de um novo administrador.
	 * @param {object} formData - Os dados do formulário do administrador.
	 * @throws {Error} Se o cadastro falhar.
	 */
	const cadastrarAdmin = async (formData) => {

		try {
			await api.cadastrarAdmin(formData);
			alert('Cadastro de administrador realizado com sucesso!');
			setTela('login'); // Redireciona para login após o cadastro.
		} catch (error) {
			console.error('Erro no cadastro de admin:', error);
			alert('Erro ao cadastrar administrador: ' + error.message);
			throw error;
		}
	};

	/**
	 * Manipula o salvamento (criação ou atualização) de uma vaga de estágio.
	 * @param {object} formData - Os dados do formulário da vaga.
	 * @throws {Error} Se o salvamento falhar.
	 */
	const handleSalvarVaga = async (formData) => {
		try {
			// Adiciona o ID da empresa logada aos dados da vaga.
			const dadosVaga = { ...formData, empresa: { id: usuario.id } };

			if (vagaEmEdicao || formData.id) {
				// Se estiver editando uma vaga existente.
				const id = vagaEmEdicao?.id || formData.id;
				const vagaAtualizada = await api.atualizarVaga(id, dadosVaga, token);
				setVagas(vagas.map(v => v.id === id ? vagaAtualizada : v)); // Atualiza a vaga no estado.
				alert('Vaga atualizada com sucesso!');
			} else {
				// Se estiver criando uma nova vaga.
				const novaVaga = await api.cadastrarVaga(dadosVaga, token);
				setVagas([...vagas, novaVaga]); // Adiciona a nova vaga ao estado.
				alert('Vaga criada com sucesso!');
			}

			setVagaEmEdicao(null); // Limpa a vaga em edição.
			setTela('minhas-vagas'); // Redireciona para a lista de vagas da empresa.

		} catch (error) {
			console.error('Erro ao salvar vaga:', error);
			alert('Erro ao salvar vaga: ' + error.message);
			throw error;
		}
	};

	/**
	 * Inicia o processo de edição de uma vaga, preenchendo o formulário com os dados existentes.
	 * @param {object} vaga - O objeto da vaga a ser editada.
	 */
	const iniciarEdicaoVaga = (vaga) => {
		setVagaEmEdicao(vaga);
		setTela('formulario-vaga');
	};

	/**
	 * Salva as áreas de interesse selecionadas pelo estudante.
	 * @param {Array<object>} novasAreas - As novas áreas de interesse selecionadas.
	 */
	const handleSalvarPerfilEstudante = async (novasAreas) => {
		if (!usuario || usuario.tipo !== 'ESTUDANTE') {
			alert('Você precisa estar logado como estudante para atualizar seu perfil.');
			return;
		}
		try {
			// Cria um objeto de estudante atualizado com as novas áreas de interesse.
			const dadosAtualizados = {
				...usuario,
				listAreaInteresse: novasAreas,
			};
			const estudanteAtualizado = await api.atualizarEstudante(usuario.id, dadosAtualizados, token);
			// Atualiza o estado do usuário com o perfil completo e tipo.
			setUsuario({ ...estudanteAtualizado, tipo: 'ESTUDANTE' });
			alert('Áreas de interesse atualizadas com sucesso!');
		} catch (error) {
			console.error('Erro ao atualizar perfil do estudante:', error);
			alert('Erro ao atualizar perfil: ' + error.message);
		}
	};

	/**
	 * Manipula o encerramento de uma vaga.
	 * @param {number} vagaId - O ID da vaga a ser encerrada.
	 */
	const handleEncerrarVaga = async (vagaId) => {
		if (window.confirm('Tem certeza que deseja encerrar esta vaga? Novas inscrições não serão permitidas.')) {
			try {
				const vagaAtualizada = await api.encerrarVaga(vagaId, token);
				// Atualiza o estado da vaga para refletir o encerramento.
				setVagas(vagas.map(v => v.id === vagaId ? vagaAtualizada : v));
				alert('Vaga encerrada com sucesso.');
			} catch (error) {
				console.error('Erro ao encerrar vaga:', error);
				alert('Erro ao encerrar vaga: ' + error.message);
			}
		}
	};

	/**
	 * Manipula a reabertura de uma vaga.
	 * @param {number} vagaId - O ID da vaga a ser reaberta.
	 */
	const handleReabrirVaga = async (vagaId) => {
		if (window.confirm('Tem certeza que deseja reabrir esta vaga?')) {
			try {
				const vagaAtualizada = await api.reabrirVaga(vagaId, token);
				// Atualiza o estado da vaga para refletir a reabertura.
				setVagas(vagas.map(v => v.id === vagaId ? vagaAtualizada : v));
				alert('Vaga reaberta com sucesso.');
			} catch (error) {
				console.error('Erro ao reabrir vaga:', error);
				alert('Erro ao reabrir vaga: ' + error.message);
			}
		}
	};

	/**
	 * Manipula a exclusão permanente de uma vaga.
	 * @param {number} vagaId - O ID da vaga a ser deletada.
	 */
	const handleDeletarVaga = async (vagaId) => {
		if (
			window.confirm(
				'Tem certeza que deseja EXCLUIR PERMANENTEMENTE esta vaga? Esta ação não pode ser desfeita.'
			)
		) {
			try {
				await api.deletarVaga(vagaId, token);
				// Remove a vaga deletada do estado.
				setVagas(vagas.filter(v => v.id !== vagaId));
				alert('Vaga excluída permanentemente.');
			} catch (error) {
				console.error('Erro ao deletar vaga:', error);
				alert('Erro ao deletar vaga: ' + error.message);
			}
		}
	};

	/**
	 * Manipula o cadastro de uma nova área de interesse.
	 * @param {object} dados - Os dados da área de interesse.
	 */
	const handleCadastrarArea = async (dados) => {
		try {
			const novaArea = await api.cadastrarAreaInteresse(dados, token);
			setAreasInteresse([...areasInteresse, novaArea]); // Adiciona a nova área ao estado.
			alert('Área de interesse cadastrada com sucesso!');
		} catch (error) {
			console.error('Erro ao cadastrar área:', error);
			alert('Erro ao cadastrar área: ' + error.message);
		}
	};

	/**
	 * Manipula a atualização de uma área de interesse existente.
	 * @param {number} id - O ID da área de interesse a ser atualizada.
	 * @param {object} dados - Os novos dados da área de interesse.
	 */
	const handleAtualizarArea = async (id, dados) => {
		try {
			const areaAtualizada = await api.atualizarAreaInteresse(id, dados, token);
			setAreasInteresse(areasInteresse.map(a => a.id === id ? areaAtualizada : a)); // Atualiza a área no estado.
			alert('Área de interesse atualizada com sucesso!');
		} catch (error) {
			console.error('Erro ao atualizar área:', error);
			alert('Erro ao atualizar área: ' + error.message);
		}
	};

	/**
	 * Manipula a exclusão de uma área de interesse.
	 * @param {number} id - O ID da área de interesse a ser excluída.
	 */
	const handleDeletarArea = async (id) => {
		if (window.confirm('Tem certeza que deseja excluir esta área de interesse?')) {
			try {
				await api.deletarAreaInteresse(id, token);
				setAreasInteresse(areasInteresse.filter(a => a.id !== id)); // Remove a área do estado.
				alert('Área de interesse excluída com sucesso.');
			} catch (error) {
				console.error('Erro ao excluir área:', error);
				alert('Erro ao excluir área: ' + error.message);
			}
		}
	};

	/**
	 * filtra a lista de vagas com base no termo de busca `filtro`
	 * e no tipo de usuário logado (estudante vê apenas vagas abertas e de seu interesse,
	 * usuários não logados veem apenas vagas abertas).
	 */
	const vagasFiltradas = vagas.filter((vaga) => {
		// Verifica se o título da vaga ou o nome da empresa correspondem ao filtro de busca.
		const matchesFiltro = vaga.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
			(vaga.empresa && vaga.empresa.nome.toLowerCase().includes(filtro.toLowerCase()));

		if (!matchesFiltro) {
			return false;
		}

		// Lógica de filtragem específica para estudantes.
		if (usuario?.tipo === 'ESTUDANTE') {
			// Estudantes só veem vagas abertas.
			if (vaga.status !== 'ABERTA') {
				return false;
			}
			// Estudantes só veem vagas se tiverem áreas de interesse definidas.
			if (!usuario.listAreaInteresse || usuario.listAreaInteresse.length === 0) {
				return false;
			}
			// Verifica se a vaga possui alguma das áreas de interesse do estudante.
			const studentInterestIds = new Set(usuario.listAreaInteresse.map(a => a.id));
			const vagaHasMatchingInterest = vaga.listAreaInteresse.some(jobArea => studentInterestIds.has(jobArea.id));
			return vagaHasMatchingInterest;
		}

		// Lógica de filtragem para usuários não logados (visitam a tela home).
		if (!usuario) {
			return vaga.status === 'ABERTA'; // Usuários não logados veem apenas vagas abertas.
		}

		return true; // Para empresas e administradores, todas as vagas relevantes são exibidas.
	});

	// Bloco de renderização condicional que decide qual componente de tela será exibido.
	// A navegação da aplicação é controlada por este bloco e pelo estado `tela`.
	if (tela === 'home') {
		return (
			<TelaHome
				setTela={setTela}
				vagasMock={vagasFiltradas} // Passa as vagas já filtradas para a Home.
				usuario={usuario}
				onInscrever={handleInscricao}
				fazerLogout={fazerLogout}
				inscricoes={inscricoes}
				onCancelarInscricao={handleCancelarInscricao}
				areasInteresse={areasInteresse}
				onSalvarInteresses={handleSalvarPerfilEstudante}
			/>
		);
	}

	if (tela === 'vagas') { // A tela 'vagas' é usada especificamente por estudantes logados.
		return (
			<TelaHome
				setTela={setTela}
				vagasMock={vagasFiltradas} // Passa as vagas já filtradas para a Home.
				usuario={usuario}
				onInscrever={handleInscricao}
				fazerLogout={fazerLogout}
				inscricoes={inscricoes}
				onCancelarInscricao={handleCancelarInscricao}
				areasInteresse={areasInteresse}
				onSalvarInteresses={handleSalvarPerfilEstudante}
			/>
		);
	}

	if (tela === 'login') {
		return <TelaLogin setTela={setTela} fazerLogin={fazerLogin} />;
	}

	if (tela === 'escolher-cadastro') {
		return <TelaEscolherCadastro setTela={setTela} />;
	}

	if (tela === 'cadastro-estudante') {
		return (
			<TelaCadastroEstudante
				setTela={setTela}
				cadastrarEstudante={cadastrarEstudante}
			/>
		);
	}

	if (tela === 'cadastro-empresa') {
		return (
			<TelaCadastroEmpresa
				setTela={setTela}
				cadastrarEmpresa={cadastrarEmpresa}
			/>
		);
	}

	if (tela === 'cadastro-admin') {
		return (
			<TelaCadastroAdmin
				setTela={setTela}
				cadastrarAdmin={cadastrarAdmin}
			/>
		);
	}

	if (tela === 'admin-dashboard') {
		return (
			<TelaAdminDashboard
				setTela={setTela}
				usuario={usuario}
				fazerLogout={fazerLogout}
				vagas={vagas}
				estudantes={estudantes}
				empresas={empresas}
				onVerListaVagas={handleVerListaVagas}
			/>
		);
	}

	if (tela === 'admin-areas-interesse') {
		return (
			<TelaAreasInteresseAdmin
				setTela={setTela}
				areas={areasInteresse}
				onCadastrar={handleCadastrarArea}
				onAtualizar={handleAtualizarArea}
				onDeletar={handleDeletarArea}
			/>
		);
	}

	if (tela === 'minhas-vagas') {
		return (
			<TelaPainelEmpresa
				setTela={setTela}
				usuario={usuario}
				fazerLogout={fazerLogout}
				vagas={vagas}
				inscricoes={inscricoes}
				onEncerrarVaga={handleEncerrarVaga}
				onReabrirVaga={handleReabrirVaga}
				onDeletarVaga={handleDeletarVaga}
				onEditarVaga={iniciarEdicaoVaga}
			/>
		);
	}

	if (tela === 'formulario-vaga') {
		return (
			<TelaFormularioVaga
				setTela={setTela}
				onSalvarVaga={handleSalvarVaga}
				api={api} // Passa o objeto api para permitir que o formulário acesse listarAreas
				vagaInicial={vagaEmEdicao}
			/>
		);
	}

	if (tela === 'admin-lista-empresas') {
		return <TelaListaEmpresasAdmin setTela={setTela} empresas={empresas} />;
	}

	if (tela === 'admin-lista-estudantes') {
		return <TelaListaEstudantesAdmin setTela={setTela} estudantes={estudantes} />;
	}

	if (tela === 'admin-lista-vagas') {
		return (
			<TelaListaVagasAdmin
				setTela={setTela}
				vagas={vagas}
				filtroInicial={filtroVagasAdmin}
				onFiltroChange={setFiltroVagasAdmin}
			/>
		);
	}

	if (tela === 'minhas-candidaturas') {
		return (
			<TelaMinhasCandidaturas
				setTela={setTela}
				inscricoes={inscricoes}
				vagas={vagas}
				onCancelarInscricao={handleCancelarInscricao}
				usuario={usuario}
			/>
		);
	}

	// telas não reconhecidas ou em desenvolvimento. (usado no desenvolvimento do projeto)
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
				<h2 className="text-2xl font-bold mb-4">
					Bem-vindo, {usuario?.nome}!
				</h2>
				<p className="text-gray-600 mb-6">
					Tela "{tela}" em construção...
				</p>
				<p className="text-sm text-gray-500 mb-4">
					Tipo: {usuario?.tipo}
				</p>
				<button
					onClick={() => {
						setUsuario(null);
						setToken(null);
						setTela('home');
					}}
					className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
				>
					Sair
				</button>
			</div>
		</div>
	);
}