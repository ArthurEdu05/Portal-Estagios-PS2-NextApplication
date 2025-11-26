'use client';

import React, { useState } from 'react';

export default function TelaCadastroEstudante({ setTela, cadastrarEstudante }) {
	const [formData, setFormData] = useState({
		nome: '',
		cpf: '',
		email: '',
		senha: '',
		confirmarSenha: '',
	});
	const [erro, setErro] = useState('');
	const [carregando, setCarregando] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErro('');
	};

	const formatarCPF = (value) => {
		const numeros = value.replace(/\D/g, '');
		return numeros
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1');
	};

	const handleCPFChange = (e) => {
		const valorFormatado = formatarCPF(e.target.value);
		setFormData((prev) => ({
			...prev,
			cpf: valorFormatado,
		}));
		setErro('');
	};

	const validarFormulario = () => {
		if (!formData.nome.trim()) {
			setErro('Nome é obrigatório');
			return false;
		}
		if (formData.cpf.replace(/\D/g, '').length !== 11) {
			setErro('CPF inválido');
			return false;
		}
		if (!formData.email.includes('@')) {
			setErro('Email inválido');
			return false;
		}
		if (formData.senha.length < 6) {
			setErro('Senha deve ter no mínimo 6 caracteres');
			return false;
		}
		if (formData.senha !== formData.confirmarSenha) {
			setErro('As senhas não coincidem');
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErro('');

		if (!validarFormulario()) {
			return;
		}

		setCarregando(true);

		try {
			const dados = {
				nome: formData.nome,
				cpf: formData.cpf.replace(/\D/g, ''),
				email: formData.email,
				senha: formData.senha,
			};

			await cadastrarEstudante(dados);
		} catch (error) {
			setErro('Erro ao cadastrar. Tente novamente.');
		} finally {
			setCarregando(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Cadastro de Estudante
					</h1>
					<p className="text-gray-600">
						Preencha seus dados para criar sua conta
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="nome"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Nome Completo *
						</label>
						<input
							type="text"
							id="nome"
							name="nome"
							value={formData.nome}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="Digite seu nome completo"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="cpf"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							CPF *
						</label>
						<input
							type="text"
							id="cpf"
							name="cpf"
							value={formData.cpf}
							onChange={handleCPFChange}
							maxLength="14"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="000.000.000-00"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Email *
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="seu@email.com"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="senha"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Senha *
						</label>
						<input
							type="password"
							id="senha"
							name="senha"
							value={formData.senha}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="Mínimo 6 caracteres"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="confirmarSenha"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Confirmar Senha *
						</label>
						<input
							type="password"
							id="confirmarSenha"
							name="confirmarSenha"
							value={formData.confirmarSenha}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="Digite a senha novamente"
							required
						/>
					</div>

					{erro && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
							{erro}
						</div>
					)}

					<button
						type="submit"
						disabled={carregando}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
					>
						{carregando ? 'Cadastrando...' : 'Criar Conta'}
					</button>
				</form>

				<div className="mt-6 text-center space-y-3">
					<button
						onClick={() => setTela('login')}
						className="text-blue-600 hover:text-blue-800 font-medium text-sm"
					>
						Já tem uma conta? Faça login
					</button>
					<div className="text-gray-400">|</div>
					<button
						onClick={() => setTela('escolher-cadastro')}
						className="text-gray-600 hover:text-gray-800 font-medium text-sm"
					>
						Voltar para escolher tipo de cadastro
					</button>
				</div>
			</div>
		</div>
	);
}
