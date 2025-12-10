/**
 * @fileoverview Formulário de cadastro para novas empresas.
 * Este componente coleta dados da empresa, incluindo nome, CNPJ, email e senha.
 * Inclui formatação automática para o campo CNPJ, validação de dados e
 * feedback de força da senha. Após o cadastro bem-sucedido, o usuário
 * é redirecionado para a tela de login.
 */

'use client';

import React, { useState } from 'react';
import PasswordStrengthMeter from './PasswordStrengthMeter';

/**
 * Renderiza o formulário de cadastro para uma nova empresa.
 *
 * @param {function} props.setTela - Função para navegar para outras telas (ex: login).
 * @returns {JSX.Element} O formulário de cadastro de empresa.
 */
export default function TelaCadastroEmpresa({ setTela }) {
	// Estado para armazenar os dados do formulário.
	const [formData, setFormData] = useState({
		nome: '',
		cnpj: '',
		email: '',
		senha: '',
		confirmarSenha: '', 
	});
	// Estado para mensagens de erro.
	const [erro, setErro] = useState('');
	// Estado para feedback de carregamento.
	const [carregando, setCarregando] = useState(false);

	/**
	 * Atualiza o estado do formulário conforme o usuário digita.
	 * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input.
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErro('');
	};

	/**
	 * Formata um valor de CNPJ em tempo real, adicionando pontos, barras e traços.
	 * @param {string} value - O valor do CNPJ a ser formatado.
	 * @returns {string} O CNPJ formatado.
	 */
	const formatarCNPJ = (value) => {
		return value
			.replace(/\D/g, '')
			.replace(/^(\d{2})(\d)/, '$1.$2')
			.replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
			.replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, '$1/$2')
			.replace(/(\d{4})(\d)/, '$1-$2')
			.substring(0, 18);
	};

	/**
	 * Manipula a mudança no campo CNPJ, aplicando a formatação.
	 * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input.
	 */
	const handleCNPJChange = (e) => {
		const valorFormatado = formatarCNPJ(e.target.value);
		setFormData((prev) => ({
			...prev,
			cnpj: valorFormatado,
		}));
		setErro('');
	};

	/**
	 * Valida os dados do formulário antes da submissão.
	 * @returns {boolean} `true` se o formulário for válido, `false` caso contrário.
	 */
	const validarFormulario = () => {
		if (!formData.nome.trim()) {
			setErro('Nome é obrigatório');
			return false;
		}
		if (formData.cnpj.replace(/\D/g, '').length !== 14) {
			setErro('CNPJ inválido');
			return false;
		}
		if (!formData.email.includes('@')) {
			setErro('Email inválido');
			return false;
		}
		if (formData.senha.length < 8) {
			setErro('A senha deve ter pelo menos 8 caracteres');
			return false;
		}
		if (formData.senha !== formData.confirmarSenha) { 
			setErro('As senhas não coincidem');
			return false;
		}
		return true;
	};

	/**
	 * Envia os dados da nova empresa para a API.
	 * @param {object} dados - Os dados da empresa a serem cadastrados.
	 * @returns {Promise<object>} A resposta da API.
	 * @throws {Error} Se a resposta da API não for 'ok'.
	 */
	const cadastrarEmpresa = async (dados) => {
		const response = await fetch('http://localhost:8080/empresa', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dados),
		});

		if (!response.ok) {
			throw new Error('Erro ao cadastrar');
		}

		return response.json();
	};

	/**
	 * Manipula a submissão do formulário.
	 * Realiza a validação e se bem-sucedido, chama a função `cadastrarEmpresa`.
	 * @param {React.FormEvent} e - O evento de submissão do formulário.
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErro('');

		if (!validarFormulario()) return;

		setCarregando(true);

		try {
			// Prepara os dados para envio, removendo a formatação do CNPJ.
			const dados = {
				nome: formData.nome,
				cnpj: formData.cnpj.replace(/\D/g, ''),
				email: formData.email,
				senha: formData.senha,
			};

			await cadastrarEmpresa(dados);
			setTela('login'); // redirecionar após cadastrar
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
						Cadastro de empresa
					</h1>
					<p className="text-gray-600">
						Preencha os dados para criar sua conta
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Nome da Empresa *
						</label>
						<input
							type="text"
							name="nome"
							value={formData.nome}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="Digite o nome da empresa"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							CNPJ *
						</label>
						<input
							type="text"
							name="cnpj"
							value={formData.cnpj}
							onChange={handleCNPJChange}
							maxLength="18"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="00.000.000/0000-00"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email *
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="empresa@corporativo.com"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Senha *
						</label>
						<input
							type="password"
							name="senha"
							value={formData.senha}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="Crie uma senha forte"
							required
						/>
						{formData.senha && <PasswordStrengthMeter password={formData.senha} />}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Confirmar Senha *
						</label>
						<input
							type="password"
							name="confirmarSenha"
							value={formData.confirmarSenha}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:bg-blue-300"
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
