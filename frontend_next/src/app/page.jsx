'use client';

import React, { useState, useEffect } from 'react';
import TelaHome from './components/TelaHome';
import TelaLogin from './components/TelaLogin';
import TelaEscolherCadastro from './components/TelaEscolherCadastro';
import TelaCadastroEstudante from './components/TelaCadastroEstudante';
import TelaCadastroEmpresa from './components/TelaCadastroEmpresa';

const API_BASE_URL = 'http://localhost:8080';

const api = {
	login: async (login, senha, tipo) => {
		const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: login, senha }),
		});
		if (!response.ok) {
			const errorData = await response.json();
			console.error('Login failed with status:', response.status, 'and message:', errorData);
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
};

export default function PortalEstagios() {
	const [usuario, setUsuario] = useState(null);
	const [token, setToken] = useState(null);
	const [tela, setTela] = useState('home');
	const [vagas, setVagas] = useState([]);
	const [filtro, setFiltro] = useState('');

	useEffect(() => {
		api.listarVagas(token)
			.then((data) => {
				setVagas(data);
			})
			.catch((error) => {
				console.error('ERRO AO BUSCAR VAGAS DO BACKEND:', error);
			});
	}, [token]);

	// const fazerLogin = async (tipo, credenciais) => {
	// 	try {
	// 		// Backend espera "login" e "senha", não "email"
	// 		const data = await api.login(
	// 			credenciais.email,
	// 			credenciais.senha,
	// 			tipo
	// 		);

	// 		console.log('Login bem-sucedido:', data);

	// 		// Salvar usuário e token
	// 		setUsuario({
	// 			id: data.id,
	// 			login: data.login,
	// 			tipo: data.tipo,
	// 		});
	// 		setToken(data.token);

	// 		// Redirecionar baseado no tipo
	// 		if (data.tipo === 'ESTUDANTE') {
	// 			setTela('vagas');
	// 		} else if (data.tipo === 'EMPRESA') {
	// 			setTela('minhas-vagas');
	// 		} else if (data.tipo === 'ADMIN') {
	// 			setTela('dashboard');
	// 		}
	// 	} catch (error) {
	// 		console.error('Erro no login:', error);
	// 		alert('Login falhou: ' + error.message);
	// 		throw error;
	// 	}
	// };

	const fazerLogin = async (tipo, credenciais) => {
		try {
			const data = await api.login(
				credenciais.email,
				credenciais.senha,
				tipo
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
			else if (data.tipo === 'ADMIN') setTela('dashboard');
		} catch (error) {
			console.error('Erro no login:', error.message);
			
			throw error;
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

	const vagasFiltradas = vagas.filter(
		(vaga) =>
			vaga.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
			(vaga.empresa &&
				vaga.empresa.toLowerCase().includes(filtro.toLowerCase()))
	);

	if (tela === 'home') {
		return <TelaHome setTela={setTela} vagasMock={vagasFiltradas} />;
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

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
				<h2 className="text-2xl font-bold mb-4">
					Bem-vindo, {usuario?.login}!
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
