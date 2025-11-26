'use client';

import React, { useState, useEffect } from 'react';
import TelaHome from './components/TelaHome';
import TelaLogin from './components/TelaLogin';
import TelaEscolherCadastro from './components/TelaEscolherCadastro';
import TelaCadastroEstudante from './components/TelaCadastroEstudante';
import TelaCadastroEmpresa from './components/TelaCadastroEmpresa';
import TelaCadastroAdmin from './components/TelaCadastroAdmin'; 
import TelaAdminDashboard from './components/TelaAdminDashboard'; 

const API_BASE_URL = 'http://localhost:8080';

const api = {
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

	cadastrarEstudante: async (dados) => {
		const response = await fetch(`${API_BASE_URL}/estudante`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao cadastrar estudante');
		return response.json();
	},

	cadastrarEmpresa: async (dados) => {
		const response = await fetch(`${API_BASE_URL}/empresa`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao cadastrar empresa');
		return response.json();
	},

	cadastrarAdmin: async (dados) => {
	
		const response = await fetch(`${API_BASE_URL}/admin`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dados),
		});
		if (!response.ok) throw new Error('Falha ao cadastrar administrador');
		return response.json();
	},

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

	listarAreas: async () => {
		const response = await fetch(`${API_BASE_URL}/areaInteresse`);
		if (!response.ok) throw new Error('Falha ao buscar áreas');
		return response.json();
	},

	listarInscricoes: async (token) => {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};
		const response = await fetch(`${API_BASE_URL}/inscricao`, { headers });
		if (!response.ok) throw new Error('Falha ao buscar inscrições');
		return response.json();
	},

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
};

export default function PortalEstagios() {
	const [usuario, setUsuario] = useState(null);
	const [token, setToken] = useState(null);
	const [tela, setTela] = useState('home');
	const [vagas, setVagas] = useState([]);
	const [inscricoes, setInscricoes] = useState([]);
	const [filtro, setFiltro] = useState('');

	useEffect(() => {
		api.listarVagas(token)
			.then((data) => {
				setVagas(data);
			})
			.catch((error) => {
				console.error('ERRO AO BUSCAR VAGAS DO BACKEND:', error);
			});

		if (usuario && usuario.tipo === 'ESTUDANTE') {
			api.listarInscricoes(token)
				.then((data) => {
					
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
		} else {
			setInscricoes([]);
		}
	}, [usuario, token]);

	const fazerLogin = async (credenciais) => {
		try {
			const data = await api.login(
				credenciais.email,
				credenciais.senha
			);

			console.log('Login bem-sucedido:', data);

			setUsuario({
				id: data.id,
				login: data.login,
				nome: data.nome,
				tipo: data.tipo,
			});
			setToken(data.token);

			if (data.tipo === 'ESTUDANTE') setTela('vagas');
			else if (data.tipo === 'EMPRESA') setTela('minhas-vagas');
			else if (data.tipo === 'ADMIN') setTela('admin-dashboard'); 
		} catch (error) {
			console.error('Erro no login:', error.message);

			throw error;
		}
	};

	const fazerLogout = () => {
		setUsuario(null);
		setToken(null);
		setTela('home');
	};

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
			setInscricoes([...inscricoes, novaInscricao]); 
			alert(`Inscrição na vaga "${vaga.titulo}" realizada com sucesso!`);
		} catch (error) {
			console.error('Erro ao se inscrever na vaga:', error);
			alert('Erro ao se inscrever na vaga: ' + error.message);
		}
	};

	const handleCancelarInscricao = async (inscricaoId) => {
		try {
			await api.cancelarInscricao(inscricaoId, token);
			
			setInscricoes(
				inscricoes.filter((inscricao) => inscricao.id !== inscricaoId)
			);
			alert('Sua inscrição foi cancelada com sucesso.');
		} catch (error) {
			console.error('Erro ao cancelar inscrição:', error);
			alert('Erro ao cancelar inscrição: ' + error.message);
		}
	};

	const cadastrarEstudante = async (formData) => {
		try {
			await api.cadastrarEstudante(formData);
			alert('Cadastro de estudante realizado com sucesso!');
			setTela('login');
		} catch (error) {
			console.error('Erro no cadastro:', error);
			alert('Erro ao cadastrar estudante: ' + error.message);
			throw error;
		}
	};

	const cadastrarEmpresa = async (formData) => {
		try {
			await api.cadastrarEmpresa(formData);
			alert('Cadastro de empresa realizado com sucesso!');
			setTela('login');
		} catch (error) {
			console.error('Erro no cadastro:', error);
			alert('Erro ao cadastrar empresa: ' + error.message);
			throw error;
		}
	};

	const cadastrarAdmin = async (formData) => {
		
		try {
			await api.cadastrarAdmin(formData);
			alert('Cadastro de administrador realizado com sucesso!');
			setTela('login');
		} catch (error) {
			console.error('Erro no cadastro de admin:', error);
			alert('Erro ao cadastrar administrador: ' + error.message);
			throw error;
		}
	};

	const vagasFiltradas = vagas.filter(
		(vaga) =>
			vaga.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
			(vaga.empresa &&
				vaga.empresa.nome.toLowerCase().includes(filtro.toLowerCase()))
	);

	if (tela === 'home' || tela === 'vagas') {
		return (
			<TelaHome
				setTela={setTela}
				vagasMock={vagasFiltradas}
				usuario={usuario}
				onInscrever={handleInscricao}
				fazerLogout={fazerLogout}
				inscricoes={inscricoes}
				onCancelarInscricao={handleCancelarInscricao}
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
			/>
		);
	}

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

