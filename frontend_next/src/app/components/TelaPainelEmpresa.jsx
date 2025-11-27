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
} from 'lucide-react';

export default function TelaPainelEmpresa({
	usuario,
	fazerLogout,
	vagas,
	inscricoes,
	setTela,
	onDeletarVaga,
	onEditarVaga,
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
						onClick={() => setTela('formulario-vaga')}
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
							return (
								<div
									key={vaga.id}
									className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
								>
									<div className="flex justify-between items-start mb-4">
										<div>
											<h3 className="text-2xl font-bold text-gray-800">
												{vaga.titulo}
											</h3>
											<p className="text-gray-500">
												{vaga.descricao}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() => onEditarVaga(vaga)}
												className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition"
											>
												<Edit size={16} />
												Editar
											</button>
											<button
												onClick={() => onDeletarVaga(vaga.id)}
												className="flex items-center gap-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition"
											>
												<Trash2 size={16} />
												Excluir
											</button>
										</div>
									</div>
									<div>
										<button onClick={() => toggleVaga(vaga.id)} className="w-full text-left">
											<h4 className="text-lg font-semibold flex items-center justify-between gap-2 mb-3 p-2 rounded-md hover:bg-gray-100 transition">
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
																className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
