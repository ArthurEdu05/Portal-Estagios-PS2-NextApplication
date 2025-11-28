'use client';
import {
	Building2,
	CalendarDays,
	XCircle,
	CheckCircle2,
	MapPin,
	Clock,
	Laptop,
	Info,
	FileText,
} from 'lucide-react';

const StatusBadge = ({ status }) => {
	const isAberta = status === 'ABERTA';
	return (
		<span className={`px-2 py-1 text-xs font-semibold rounded-full ${isAberta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
			{isAberta ? 'Aberta' : 'Fechada'}
		</span>
	);
};

export default function ModalDetalhesVaga({
	vaga,
	fecharModal,
	onInscrever,
	inscricoes,
	onCancelarInscricao,
	usuario, // Adicionado para verificar o tipo de usuário
}) {
	const inscricao = inscricoes?.find((i) => i.vagaEstagio.id === vaga.id);
	const estaInscrito = !!inscricao;
	const isVagaFechada = vaga.status === 'FECHADA';

	// Split requisitos by newline for list rendering
	const requisitosList = vaga.requisitos?.split('\n').filter(req => req.trim() !== '');

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl relative animate-slideUp max-h-[90vh] overflow-y-auto">
				<button
					onClick={fecharModal}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
				>
					<XCircle size={28} />
				</button>

				{estaInscrito && (
					<div className="absolute top-4 left-4 flex items-center gap-2 bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg">
						<CheckCircle2 size={20} />
						<span>Você está inscrito</span>
					</div>
				)}

				<div className="flex items-center gap-4 mb-2 mt-8">
					<h2 className="text-3xl font-bold text-gray-800">
						{vaga.titulo}
					</h2>
					<StatusBadge status={vaga.status} />
				</div>


				<div className="flex items-center gap-2 text-lg text-gray-600 mb-6 border-b pb-4">
					<Building2 size={20} />
					<span>{vaga.empresa.nome}</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-gray-700">
					<div className="flex items-center gap-2"><MapPin size={20} className="text-blue-600" /><span>{vaga.localizacao}</span></div>
					<div className="flex items-center gap-2"><Laptop size={20} className="text-blue-600" /><span>{vaga.modalidade}</span></div>
					<div className="flex items-center gap-2"><Clock size={20} className="text-blue-600" /><span>{vaga.cargaHoraria}</span></div>
					<div className="flex items-center gap-2"><CalendarDays size={20} className="text-blue-600" /><span>Encerra em {new Date(vaga.dataFim).toLocaleDateString()}</span></div>
				</div>

				<div className="space-y-6 mb-8">
					<div>
						<h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Info size={22}/> Descrição da Vaga</h4>
						<p className="text-gray-600 pl-8">{vaga.descricao}</p>
					</div>
					<div>
						<h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={22}/> Requisitos</h4>
						<ul className="list-disc space-y-1 pl-12 text-gray-600">
							{requisitosList.map((req, index) => (
								<li key={index}>{req}</li>
							))}
						</ul>
					</div>
				</div>

				<div className="flex gap-4 pt-4 border-t">
					{usuario?.tipo === 'ESTUDANTE' && (
						estaInscrito ? (
							<button
								onClick={() => onCancelarInscricao(inscricao.id)}
								disabled={isVagaFechada}
								className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isVagaFechada ? 'Vaga Encerrada' : 'Cancelar Inscrição'}
							</button>
						) : (
							<button
								onClick={() => onInscrever(vaga)}
								disabled={isVagaFechada}
								className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isVagaFechada ? 'Vaga Encerrada' : 'Inscrever-se'}
							</button>
						)
					)}

					<button
						onClick={fecharModal}
						className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
					>
						Voltar
					</button>
				</div>
			</div>
		</div>
	);
}