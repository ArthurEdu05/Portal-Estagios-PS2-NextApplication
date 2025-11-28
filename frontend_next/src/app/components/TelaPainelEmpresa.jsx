'use client';

import { useState } from 'react';
import {
	Building,
	LogOut,
	PlusCircle,
	Users,
	Mail,
	Trash2,
	Edit,
	ChevronDown,
	MapPin,
	Clock,
	Laptop,
	PowerOff,
	RefreshCw,
} from 'lucide-react';

// Helper component for status badge
const StatusBadge = ({ status }) => {
	const isAberta = status === 'ABERTA';
	return (
		<span className={`px-2 py-1 text-xs font-semibold rounded-full ${isAberta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
			{isAberta ? 'Aberta' : 'Fechada'}
		</span>
	);
};

export default function TelaPainelEmpresa({
	usuario,
	fazerLogout,
	vagas,
	inscricoes,
	setTela,
	onEncerrarVaga,
	onReabrirVaga,
	onEditarVaga,
	onDeletarVaga,
}) {
	const [vagaAbertaId, setVagaAbertaId] = useState(null);

	const minhasVagas = vagas.filter(
		(vaga) => vaga.empresa?.id === usuario.id
	);

	const getCandidatos = (vagaId) => {
		return inscricoes.filter(
			(inscricao) => inscricao.vagaEstagio?.id === vagaId
		);
	};

	const toggleVaga = (vagaId) => {
		setVagaAbertaId(vagaAbertaId === vagaId ? null : vagaId);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white shadow-md">
				<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<Building className="text-blue-600" size={28} />
						<h1 className="text-xl font-bold text-gray-800">
							Painel da Empresa
						</h1>
					</div>
					<div className="flex items-center gap-4">
						<span className="font-medium text-gray-700 hidden sm:block">
							{usuario?.nome}
						</span>
						<button
							onClick={fazerLogout}
							className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
						>
							<LogOut size={20} />
							Sair
						</button>
					</div>
				</div>
			</nav>

			<main className="max-w-7xl mx-auto p-6">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-gray-800">
						Minhas Vagas
					</h2>
					<button
						onClick={() => {
							onEditarVaga(null); // Garante que o form estará em modo de criação
							setTela('formulario-vaga');
						}}
						className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
					>
						<PlusCircle size={20} />
						Criar Nova Vaga
					</button>
				</div>

				<div className="space-y-6">
					{minhasVagas.length > 0 ? (
						minhasVagas.map((vaga) => {
							const candidatos = getCandidatos(vaga.id);
							const isAberta = vagaAbertaId === vaga.id;
							const isVagaFechada = vaga.status === 'FECHADA';
							return (
								<div
									key={vaga.id}
									className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-opacity ${isVagaFechada ? 'opacity-70 bg-gray-50' : ''}`}
								>
									<div className="flex justify-between items-start mb-4">
										<div>
											<div className="flex items-center gap-3 mb-2">
												<h3 className="text-2xl font-bold text-gray-800">
													{vaga.titulo}
												</h3>
												<StatusBadge status={vaga.status} />
											</div>
											<div className="flex items-center flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
												<span className="flex items-center gap-1.5"><MapPin size={14} /> {vaga.localizacao}</span>
												<span className="flex items-center gap-1.5"><Laptop size={14} /> {vaga.modalidade}</span>
												<span className="flex items-center gap-1.5"><Clock size={14} /> {vaga.cargaHoraria}</span>
											</div>
										</div>
										<div className="flex items-center gap-2 flex-shrink-0 ml-4">
											{isVagaFechada ? (
												<>
													<button
														onClick={() => onReabrirVaga(vaga.id)}
														className="flex items-center gap-2 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-lg hover:bg-green-200 transition"
													>
														<RefreshCw size={16} />
														Reabrir
													</button>
													<button
														onClick={() => onDeletarVaga(vaga.id)}
														className="flex items-center gap-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition"
													>
														<Trash2 size={16} />
														Excluir
													</button>
												</>
											) : (
												<>
													<button
														onClick={() => onEditarVaga(vaga)}
														className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition"
													>
														<Edit size={16} />
														Editar
													</button>
													<button
														onClick={() => onEncerrarVaga(vaga.id)}
														className="flex items-center gap-2 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg hover:bg-yellow-200 transition"
													>
														<PowerOff size={16} />
														Encerrar
													</button>
												</>
											)}
										</div>
									</div>
									<div className="border-t my-4"></div>
									<div>
										<button onClick={() => toggleVaga(vaga.id)} className="w-full text-left" disabled={isVagaFechada}>
											<h4 className="text-lg font-semibold flex items-center justify-between gap-2 mb-3 p-2 rounded-md hover:bg-gray-100 transition disabled:cursor-not-allowed disabled:hover:bg-transparent">
												<span className="flex items-center gap-2">
													<Users size={20} />
													Candidatos Inscritos ({candidatos.length})
												</span>
												<ChevronDown size={20} className={`transform transition-transform ${isAberta ? 'rotate-180' : ''}`} />
											</h4>
										</button>
										{isAberta && (
											candidatos.length > 0 ? (
												<ul className="space-y-3 pl-2 pr-2 pb-2">
													{candidatos.map(
														(inscricao) => (
															<li
																key={
																	inscricao.id
																}
																className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
															>
																<span className="font-medium text-gray-700">
																	{
																		inscricao
																			.estudante
																			?.nome
																	}
																</span>
																<div className="flex items-center gap-2 text-gray-500">
																	<Mail
																		size={
																			16
																		}
																	/>
																	<span>
																		{
																			inscricao
																				.estudante
																				?.email
																		}
																	</span>
																</div>
															</li>
														)
													)}
												</ul>
											) : (
												<p className="text-gray-500 italic px-2 pb-2">
													Nenhum candidato inscrito
													ainda.
												</p>
											)
										)}
									</div>
								</div>
							);
						})
					) : (
						<div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-500">
							<p>
								Você ainda não publicou nenhuma vaga. Clique
								em "Criar Nova Vaga" para começar.
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
