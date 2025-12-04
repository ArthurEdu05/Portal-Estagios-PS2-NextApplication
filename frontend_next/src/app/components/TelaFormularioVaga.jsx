'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function TelaFormularioVaga({ setTela, onSalvarVaga, api, vagaInicial }) {
	const [formData, setFormData] = useState({
		titulo: '',
		descricao: '',
		dataInicio: '',
		dataFim: '',
		listAreaInteresse: [],
		localizacao: '',
		modalidade: 'PRESENCIAL',
		cargaHoraria: '',
		requisitos: '',
	});
	const [areas, setAreas] = useState([]);
	const [erro, setErro] = useState('');
	const [carregando, setCarregando] = useState(false);

	const isEditing = !!vagaInicial;

	useEffect(() => {
		api.listarAreas()
			.then(setAreas)
			.catch(() =>
				setErro('Não foi possível carregar as áreas de interesse.')
			);

		if (isEditing) {
			setFormData({
				titulo: vagaInicial.titulo || '',
				descricao: vagaInicial.descricao || '',
				dataInicio: vagaInicial.dataInicio ? new Date(vagaInicial.dataInicio).toISOString().split('T')[0] : '',
				dataFim: vagaInicial.dataFim ? new Date(vagaInicial.dataFim).toISOString().split('T')[0] : '',
				listAreaInteresse: vagaInicial.listAreaInteresse || [],
				localizacao: vagaInicial.localizacao || '',
				modalidade: vagaInicial.modalidade || 'PRESENCIAL',
				cargaHoraria: vagaInicial.cargaHoraria ? String(vagaInicial.cargaHoraria).replace(/[^0-9]/g, '') : '',
				requisitos: vagaInicial.requisitos || '',
			});
		}
	}, [api, vagaInicial, isEditing]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErro('');
	};

	const handleAreaChange = (e) => {
		const options = [...e.target.selectedOptions];
		const values = options.map((option) =>
			areas.find((area) => area.id === parseInt(option.value))
		);
		setFormData((prev) => ({
			...prev,
			listAreaInteresse: values,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErro('');

		if (
			!formData.titulo ||
			!formData.descricao ||
			!formData.dataInicio ||
			!formData.dataFim ||
			!formData.localizacao ||
			!formData.cargaHoraria ||
			!formData.requisitos ||
			formData.listAreaInteresse.length === 0
		) {
			setErro('Todos os campos marcados com * são obrigatórios.');
			return;
		}

		setCarregando(true);
		try {
			// Append " horas" to cargaHoraria before saving
			const dataToSend = {
				...formData,
				cargaHoraria: `${formData.cargaHoraria} horas`,
			};

			// Pass the correct ID when editing
			const dataToSave = isEditing ? { ...dataToSend, id: vagaInicial.id } : dataToSend;
			await onSalvarVaga(dataToSave);
		} catch (error) {
			setErro(`Falha ao salvar a vaga. ${error.message}`);
		} finally {
			setCarregando(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 my-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
					{isEditing ? 'Editar Vaga' : 'Criar Nova Vaga'}
				</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título da Vaga *</label>
						<input type="text" name="titulo" id="titulo" value={formData.titulo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 mb-1">Localização *</label>
							<input type="text" name="localizacao" id="localizacao" value={formData.localizacao} onChange={handleChange} placeholder="Ex: SP" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
						</div>
						<div>
							<label htmlFor="cargaHoraria" className="block text-sm font-medium text-gray-700 mb-1">Carga Horária *</label>
							<div className="relative">
								<input
									type="number"
									name="cargaHoraria"
									id="cargaHoraria"
									value={formData.cargaHoraria}
									onChange={handleChange}
									placeholder="30"
									className="w-full px-4 py-2 pr-16 border rounded-lg focus:ring-2 focus:ring-blue-500"
									required
								/>
								<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 pointer-events-none">
									horas
								</span>
							</div>
						</div>
					</div>
					
					<div>
						<label htmlFor="modalidade" className="block text-sm font-medium text-gray-700 mb-1">Modalidade *</label>
						<select name="modalidade" id="modalidade" value={formData.modalidade} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" required>
							<option value="PRESENCIAL">Presencial</option>
							<option value="REMOTO">Remoto</option>
							<option value="HIBRIDO">Híbrido</option>
						</select>
					</div>

					<div>
						<label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada da Vaga *</label>
						<textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
					</div>
					
					<div>
						<label htmlFor="requisitos" className="block text-sm font-medium text-gray-700 mb-1">Requisitos da Vaga *</label>
						<textarea name="requisitos" id="requisitos" value={formData.requisitos} onChange={handleChange} rows={5} placeholder="Liste os requisitos da vaga" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">Data de Início *</label>
							<input type="date" name="dataInicio" id="dataInicio" value={formData.dataInicio} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
						</div>
						<div>
							<label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">Data de Fim *</label>
							<input type="date" name="dataFim" id="dataFim" value={formData.dataFim} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
						</div>
					</div>

					<div>
						<label htmlFor="listAreaInteresse" className="block text-sm font-medium text-gray-700 mb-1">Áreas de Interesse *</label>
						<select multiple name="listAreaInteresse" id="listAreaInteresse" value={formData.listAreaInteresse.map(area => area.id)} onChange={handleAreaChange} className="w-full h-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
							{areas.map((area) => (
								<option key={area.id} value={area.id}>
									{area.titulo}
								</option>
							))}
						</select>
						<p className="text-xs text-gray-500 mt-1">Segure Ctrl (ou Cmd) para selecionar várias.</p>
					</div>

					{erro && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{erro}</div>
					)}

					<button type="submit" disabled={carregando} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:bg-blue-300">
						{carregando ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Publicar Vaga')}
					</button>
				</form>
				<button onClick={() => setTela('minhas-vagas')} className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
					<ArrowLeft size={18} />
					Voltar ao Painel
				</button>
			</div>
		</div>
	);
}
