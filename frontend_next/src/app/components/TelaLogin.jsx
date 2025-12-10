/**
 * @fileoverview Componente do formulário de login.
 * Permite que usuários (administradores, empresas, estudantes) se autentiquem
 * no sistema fornecendo seu email e senha. Inclui validação básica de campos,
 * feedback de erro e navegação para outras telas como home e cadastro.
 */

'use client';
import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';

/**
 * Renderiza a tela de login.
 *
 * @param {function} props.setTela - Função para navegar para outras telas (ex: home, escolher-cadastro).
 * @param {function} props.fazerLogin - Função assíncrona para processar as credenciais de login.
 */
export default function TelaLogin({ setTela, fazerLogin }) {
	// Estados para armazenar os valores dos campos de email e senha.
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	// Estado para controlar o feedback de carregamento durante o processo de login.
	const [carregando, setCarregando] = useState(false);
	// Estado para armazenar e exibir mensagens de erro.
	const [erro, setErro] = useState('');

	/**
	 * Manipula a tentativa de login.
	 * Realiza a validação dos campos e chama a função `fazerLogin` para autenticação.
	 */
	const handleLogin = async () => {
		// Validação básica: verifica se email e senha estão preenchidos.
		if (!email || !senha) {
			setErro('Preencha email e senha.');
			return;
		}

		setCarregando(true);
		setErro(''); // Limpa erros anteriores.

		try {
			
			// Chama a função de login passada via prop.
			await fazerLogin({
				email,
				senha,
			});
		} catch (error) {
			// Exibe mensagem de erro se a autenticação falhar.
			setErro('Erro ao fazer login. Verifique suas credenciais.');
		} finally {
			// Finaliza o estado de carregamento, independentemente do sucesso ou falha.
			setCarregando(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
			<div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
				<div className="text-center mb-8">
					<Briefcase
						className="text-blue-600 mx-auto mb-4"
						size={48}
					/>
					<h2 className="text-3xl font-bold text-gray-800">Login</h2>
				</div>

				<div className="space-y-4">
					{/* Campo de Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							E-mail
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setErro('');
							}}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="seu@email.com"
						/>
					</div>

					{/* Campo de Senha */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Senha
						</label>
						<input
							type="password"
							value={senha}
							onChange={(e) => {
								setSenha(e.target.value);
								setErro('');
							}}
							onKeyPress={(e) => {
								// Permite o login ao pressionar 'Enter' no campo de senha.
								if (e.key === 'Enter') handleLogin();
							}}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
						/>
					</div>

					{/* Mensagem de erro (renderizada condicionalmente) */}
					{erro && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
							{erro}
						</div>
					)}

					{/* Botão de Entrar */}
					<button
						onClick={handleLogin}
						disabled={carregando}
						className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
					>
						{carregando ? 'Entrando...' : 'Entrar'}
					</button>

					{/* Botão Voltar para a Home */}
					<button
						onClick={() => setTela('home')}
						className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
					>
						Voltar
					</button>

					{/* Link para a tela de cadastro */}
					<div className="text-center pt-2 text-sm text-gray-600">
						<span>Não possuo conta! </span>
						<button
							onClick={() => setTela('escolher-cadastro')}
							className="font-medium text-blue-600 hover:underline"
						>
							Cadastrar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
