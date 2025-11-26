'use client';
import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';

export default function TelaLogin({ setTela, fazerLogin }) {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [tipo, setTipo] = useState('estudante');
	const [carregando, setCarregando] = useState(false);
	const [erro, setErro] = useState('');

	const handleLogin = async () => {
		if (!email || !senha) {
			setErro('Preencha email e senha.');
			return;
		}

		setCarregando(true);
		setErro('');

		try {
			await fazerLogin(tipo, {
				email,
				senha,
			});
		} catch (error) {
			setErro('Erro ao fazer login. Verifique suas credenciais.');
		} finally {
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
					{/* Selecionar tipo */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Tipo de Usuário
						</label>
						<select
							value={tipo}
							onChange={(e) => setTipo(e.target.value)}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
						>
							<option value="estudante">Estudante</option>
							<option value="empresa">Empresa</option>
							<option value="admin">Administrador</option>
						</select>
					</div>

					{/* Email */}
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

					{/* Senha */}
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
								if (e.key === 'Enter') handleLogin();
							}}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
						/>
					</div>

					{/* Mensagem de erro */}
					{erro && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
							{erro}
						</div>
					)}

					{/* Entrar */}
					<button
						onClick={handleLogin}
						disabled={carregando}
						className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
					>
						{carregando ? 'Entrando...' : 'Entrar'}
					</button>

					{/* Voltar */}
					<button
						onClick={() => setTela('home')}
						className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
					>
						Voltar
					</button>

					{/* Criar conta */}
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
