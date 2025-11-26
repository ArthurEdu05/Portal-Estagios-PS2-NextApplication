'use client';
import React, { useState } from 'react';
import {
	User,
	Briefcase,
	Building2,
	LogIn,
	LogOut,
	UserPlus,
	TrendingUp,
} from 'lucide-react';
import ModalDetalhesVaga from './ModalDetalhesVaga';

export default function TelaHome({
	setTela,
	vagasMock,
	usuario,
	onInscrever,
	fazerLogout,
}) {
	const [vagaSelecionada, setVagaSelecionada] = useState(null);

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
			<nav className="bg-white shadow-lg">
				<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
					<div className="flex items-center gap-2">
						<Briefcase className="text-blue-600" size={32} />
						<h1 className="text-2xl font-bold text-gray-800">
							Portal de Estágios
						</h1>
					</div>
					<div className="flex gap-4 items-center">
						{usuario ? (
							<>
								<span className="font-medium text-gray-700">
									Bem-vindo, {usuario.nome}!
								</span>
								<button
									onClick={fazerLogout}
									className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
								>
									<LogOut size={20} />
									Sair
								</button>
							</>
						) : (
							<>
								<button
									onClick={() => setTela('login')}
									className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
								>
									<LogIn size={20} />
									Entrar
								</button>
								<button
									onClick={() =>
										setTela('escolher-cadastro')
									}
									className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
								>
									<UserPlus size={20} />
									Cadastrar
								</button>
							</>
						)}
					</div>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto px-6 py-16">
				{!usuario && (
					<>
						<div className="text-center mb-16">
							<h2 className="text-5xl font-bold text-gray-800 mb-6">
								Conectamos Talentos a Oportunidades
							</h2>
							<p className="text-xl text-gray-600 max-w-2xl mx-auto">
								A plataforma completa para estudantes
								encontrarem estágios e empresas descobrirem os
								melhores talentos
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8 mb-16">
							<div className="bg-white p-8 rounded-xl shadow-lg text-center">
								<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
									<User className="text-blue-600" size={32} />
								</div>
								<h3 className="text-xl font-bold mb-3">
									Para Estudantes
								</h3>
								<p className="text-gray-600">
									Encontre estágios alinhados com suas áreas
									de interesse
								</p>
							</div>
							<div className="bg-white p-8 rounded-xl shadow-lg text-center">
								<div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
									<Building2
										className="text-green-600"
										size={32}
									/>
								</div>
								<h3 className="text-xl font-bold mb-3">
									Para Empresas
								</h3>
								<p className="text-gray-600">
									Divulgue vagas e encontre candidatos
									qualificados
								</p>
							</div>
							<div className="bg-white p-8 rounded-xl shadow-lg text-center">
								<div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
									<TrendingUp
										className="text-purple-600"
										size={32}
									/>
								</div>
								<h3 className="text-xl font-bold mb-3">
									Gestão Simplificada
								</h3>
								<p className="text-gray-600">
									Dashboard completo para acompanhar todo o
									processo
								</p>
							</div>
						</div>
					</>
				)}

				<div className="bg-white rounded-xl shadow-lg p-8">
					<h3 className="text-2xl font-bold mb-6">
						{usuario ? 'Vagas Disponíveis' : 'Vagas em Destaque'}
					</h3>
					<div className="grid gap-4">
						{vagasMock && vagasMock.length > 0 ? (
							vagasMock.map((vaga) => (
								<div
									key={vaga.id}
									className="border rounded-lg p-6 hover:shadow-md transition"
								>
									<div className="mb-3">
										<h4 className="text-xl font-bold text-gray-800">
											{vaga.titulo}
										</h4>
										<p className="text-gray-600">
											{vaga.empresa.nome}
										</p>
									</div>

									<p className="text-gray-700 mb-4 line-clamp-2">
										{vaga.descricao}
									</p>

									<div className="flex justify-end">
										<button
											onClick={() =>
												setVagaSelecionada(vaga)
											}
											className="bg-blue-100 text-blue-800 font-medium py-2 px-5 rounded-lg hover:bg-blue-200 transition"
										>
											Saiba Mais
										</button>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500 text-center">
								Nenhuma vaga encontrada no momento.
							</p>
						)}
					</div>
				</div>
			</div>

			{vagaSelecionada && (
				<ModalDetalhesVaga
					vaga={vagaSelecionada}
					fecharModal={() => setVagaSelecionada(null)}
					onInscrever={onInscrever}
				/>
			)}
		</div>
	);
}
