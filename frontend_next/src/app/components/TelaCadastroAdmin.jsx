'use client';

import React, { useState } from 'react';
import { UserCog } from 'lucide-react';

export default function TelaCadastroAdmin({ setTela, cadastrarAdmin }) {
	const [formData, setFormData] = useState({
		nome: '',
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

	const validarFormulario = () => {
		if (!formData.nome.trim()) {
			setErro('Nome é obrigatório');
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
				email: formData.email,
				senha: formData.senha,
			};

			await cadastrarAdmin(dados);
		} catch (error) {
			setErro('Erro ao cadastrar. Tente novamente.');
		} finally {
			setCarregando(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
				<div className="text-center mb-8">
					<UserCog
						className="text-purple-600 mx-auto mb-4"
						size={40}
					/>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Cadastro de Administrador
					</h1>
					<p className="text-gray-600">
						Preencha os dados para criar a conta
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
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
							placeholder="Digite o nome completo"
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
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
							placeholder="admin@email.com"
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
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
						className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-purple-300 disabled:cursor-not-allowed"
					>
						{carregando ? 'Cadastrando...' : 'Criar Conta'}
					</button>
				</form>

				<div className="mt-6 text-center space-y-3">
					<button
						onClick={() => setTela('login')}
						className="text-purple-600 hover:text-purple-800 font-medium text-sm"
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