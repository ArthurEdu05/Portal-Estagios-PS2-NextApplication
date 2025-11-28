'use client';
import React, { useState, useEffect } from 'react';
import {
	User,
	Briefcase,
	Building2,
	LogIn,
	LogOut,
	UserPlus,
	TrendingUp,
	Bookmark,
	ChevronDown,
	Info,
} from 'lucide-react';
import ModalDetalhesVaga from './ModalDetalhesVaga';

const GerenciarInteresses = ({ usuario, areasInteresse, onSalvarInteresses }) => {
	const [aberto, setAberto] = useState(false);
	const [selecionadas, setSelecionadas] = useState(usuario.listAreaInteresse || []);
	const [carregando, setCarregando] = useState(false);

	useEffect(() => {
		setSelecionadas(usuario.listAreaInteresse || []);
	}, [usuario.listAreaInteresse]);


	const handleCheckboxChange = (area) => {
		setSelecionadas(prev => {
			if (prev.some(a => a.id === area.id)) {
				return prev.filter(a => a.id !== area.id);
			} else {
				return [...prev, area];
			}
		});
	};

	const handleSalvar = async () => {
		setCarregando(true);
		await onSalvarInteresses(selecionadas);
		setCarregando(false);
		setAberto(false); 
	};

	return (
		<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
			<div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start gap-3 mb-4">
				<Info size={24} className="flex-shrink-0 mt-1" />
				<div>
					<h4 className="font-bold">Ajuste suas áreas de interesse!</h4>
					<p className="text-sm">As vagas exibidas serão baseadas nas suas áreas de interesse selecionadas. Mantenha seu perfil atualizado para receber as melhores recomendações.</p>
				</div>
			</div>

			<button
				onClick={() => setAberto(!aberto)}
				className="w-full flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
			>
				<span className="font-semibold text-lg text-gray-800 flex items-center gap-2">
					<Bookmark size={20} />
					Minhas Áreas de Interesse
				</span>
				<ChevronDown size={24} className={`transform transition-transform ${aberto ? 'rotate-180' : ''}`} />
			</button>

			{aberto && (
				<div className="mt-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
						{areasInteresse.map((area) => (
							<label key={area.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 cursor-pointer">
								<input
									type="checkbox"
									className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									checked={selecionadas.some(a => a.id === area.id)}
									onChange={() => handleCheckboxChange(area)}
								/>
								<span className="font-medium text-gray-700">{area.titulo}</span>
							</label>
						))}
					</div>
					<div className="text-right">
						<button
							onClick={handleSalvar}
							disabled={carregando}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300"
						>
							{carregando ? 'Salvando...' : 'Salvar Interesses'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};


export default function TelaHome({
	setTela,
	vagasMock,
	usuario,
	onInscrever,
	fazerLogout,
	inscricoes,
	onCancelarInscricao,
	areasInteresse,
		onSalvarInteresses,
	}) {
	
		const [vagaSelecionada, setVagaSelecionada] = useState(null);
	
		// Filtra para mostrar apenas vagas abertas
		const vagasAbertas = vagasMock.filter(vaga => vaga.status === 'ABERTA');
	
		return (
			<div className="min-h-screen bg-gray-100">
				<nav className="bg-white shadow-lg sticky top-0 z-50">
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
									<span className="font-medium text-gray-700 hidden sm:block">
										Bem-vindo, {usuario.nome}!
									</span>
									<button
										onClick={fazerLogout}
										className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
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
	
				<main className="max-w-7xl mx-auto px-6 py-10">
					{usuario?.tipo === 'ESTUDANTE' && (
						<GerenciarInteresses
							usuario={usuario}
							areasInteresse={areasInteresse}
							onSalvarInteresses={onSalvarInteresses}
						/>
					)}
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
							{vagasAbertas && vagasAbertas.length > 0 ? (
								vagasAbertas.map((vaga) => (
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
									Nenhuma vaga aberta encontrada no momento.
								</p>
							)}
						</div>
					</div>
				</main>
	
				{vagaSelecionada && (
					<ModalDetalhesVaga
						vaga={vagaSelecionada}
						fecharModal={() => setVagaSelecionada(null)}
						onInscrever={onInscrever}
						inscricoes={inscricoes}
						onCancelarInscricao={onCancelarInscricao}
						usuario={usuario}
					/>
				)}
			</div>
		);
	}
	
