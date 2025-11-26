'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function TelaCriarVaga({ setTela, cadastrarVaga, api }) {
	const [formData, setFormData] = useState({
		titulo: '',
		descricao: '',
		dataInicio: '',
		dataFim: '',
		listAreaInteresse: [],
	});
	const [areas, setAreas] = useState([]);
	const [erro, setErro] = useState('');
	const [carregando, setCarregando] = useState(false);

	useEffect(() => {
		api.listarAreas()
			.then(setAreas)
			.catch(() =>
				setErro('Não foi possível carregar as áreas de interesse.')
			);
	}, [api]);

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
			formData.listAreaInteresse.length === 0
		) {
			setErro('Todos os campos são obrigatórios.');
			return;
		}

		setCarregando(true);
		try {
			await cadastrarVaga(formData);
		} catch (error) {
			setErro('Falha ao criar a vaga. ' + error.message);
		} finally {
			setCarregando(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
					Criar Nova Vaga
				</h1>
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Título */}
					<div>
						<label
							htmlFor="titulo"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Título da Vaga *
						</label>
						<input
							type="text"
							name="titulo"
							id="titulo"
							value={formData.titulo}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{/* Descrição */}
					<div>
						<label
							htmlFor="descricao"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Descrição *
						</label>
						<textarea
							name="descricao"
							id="descricao"
							value={formData.descricao}
							onChange={handleChange}
							rows={4}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{/* Data de Início e Fim */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="dataInicio"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Data de Início *
							</label>
							<input
								type="date"
								name="dataInicio"
								id="dataInicio"
								value={formData.dataInicio}
								onChange={handleChange}
								className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="dataFim"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Data de Fim *
							</label>
							<input
								type="date"
								name="dataFim"
								id="dataFim"
								value={formData.dataFim}
								onChange={handleChange}
								className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>
					</div>

					{/* Áreas de Interesse */}
					<div>
						<label
							htmlFor="listAreaInteresse"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Áreas de Interesse *
						</label>
						<select
							multiple
							name="listAreaInteresse"
							id="listAreaInteresse"
							onChange={handleAreaChange}
							className="w-full h-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							required
						>
							{areas.map((area) => (
								<option key={area.id} value={area.id}>
									{area.titulo}
								</option>
							))}
						</select>
						<p className="text-xs text-gray-500 mt-1">
							Segure Ctrl (ou Cmd) para selecionar várias.
						</p>
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
						{carregando ? 'Publicando Vaga...' : 'Publicar Vaga'}
					</button>
				</form>
				<button
					onClick={() => setTela('minhas-vagas')}
					className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
				>
					<ArrowLeft size={18} />
					Voltar ao Painel
				</button>
			</div>
		</div>
	);
}
