/**
 * @fileoverview Tela de seleção de tipo de cadastro.
 * Este componente apresenta ao usuário as opções de se cadastrar como
 * Estudante, Empresa ou Administrador, redirecionando para o formulário
 * correspondente a cada escolha.
 */

'use client';
import { User, Building2, UserCog } from 'lucide-react'; 

/**
 * Renderiza a tela de escolha de tipo de cadastro.
 *
 * @param {function} props.setTela - Função para alterar a tela atual, navegando para o formulário de cadastro escolhido ou de volta para a home.
 * @returns {JSX.Element} A tela com as opções de cadastro.
 */
export default function TelaEscolherCadastro({ setTela }) {
	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
			<div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl">
				<h2 className="text-3xl font-bold text-center mb-8">
					Escolha o Tipo de Cadastro
				</h2>
				<div className="grid md:grid-cols-3 gap-6"> 
					{/* Card de opção para cadastro de Estudante */}
					<button
						onClick={() => setTela('cadastro-estudante')}
						className="p-8 border-2 border-blue-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition"
					>
						<User
							className="text-blue-600 mx-auto mb-4"
							size={48}
						/>
						<h3 className="text-xl font-bold mb-2">Estudante</h3>
						<p className="text-gray-600">
							Cadastre-se para encontrar estágios
						</p>
					</button>
					{/* Card de opção para cadastro de Empresa */}
					<button
						onClick={() => setTela('cadastro-empresa')}
						className="p-8 border-2 border-green-200 rounded-xl hover:border-green-600 hover:shadow-lg transition"
					>
						<Building2
							className="text-green-600 mx-auto mb-4"
							size={48}
						/>
						<h3 className="text-xl font-bold mb-2">Empresa</h3>
						<p className="text-gray-600">
							Cadastre-se para divulgar vagas
						</p>
					</button>
					{/* Card de opção para cadastro de Administrador */}
					<button
						onClick={() => setTela('cadastro-admin')} 
						className="p-8 border-2 border-purple-200 rounded-xl hover:border-purple-600 hover:shadow-lg transition"
					>
						<UserCog
							className="text-purple-600 mx-auto mb-4"
							size={48}
						/>
						<h3 className="text-xl font-bold mb-2">
							Administrador
						</h3>
						<p className="text-gray-600">
							Cadastre-se para gerenciar o portal
						</p>
					</button>
				</div>
				<button
					onClick={() => setTela('home')}
					className="w-full mt-6 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
				>
					Voltar
				</button>

				<div className="text-center pt-4 text-sm text-gray-600">
					<span>Já possuo conta! </span>
					<button
						onClick={() => setTela('login')}
						className="font-medium text-blue-600 hover:underline"
					>
						Login
					</button>
				</div>
			</div>
		</div>
	);
}
