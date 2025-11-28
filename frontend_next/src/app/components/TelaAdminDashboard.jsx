'use client';

import React, { useState } from 'react';
import { LogOut, LayoutDashboard, Briefcase, Users, Building, Settings, BarChart2 } from 'lucide-react';
import GraficoVagasPorArea from './GraficoVagasPorArea';

const StatCard = ({ title, value, icon, onClick }) => (
	<button onClick={onClick} className="bg-gray-100 p-6 rounded-lg flex items-center gap-4 border border-gray-200 hover:bg-gray-200 hover:shadow-md transition w-full text-left">
		{icon}
		<div>
			<p className="text-gray-500">{title}</p>
			<p className="text-3xl font-bold text-gray-800">{value}</p>
		</div>
	</button>
);


export default function TelaAdminDashboard({ setTela, usuario, fazerLogout, vagas, estudantes, empresas, onVerListaVagas }) {
	const [activeTab, setActiveTab] = useState('dashboard');

	const vagasAbertasCount = vagas.filter(vaga => vaga.status === 'ABERTA').length;
	const vagasEncerradasCount = vagas.filter(vaga => vaga.status === 'FECHADA').length;
	const totalVagasCount = vagas.length;

	const vagasPorArea = vagas.reduce((acc, vaga) => {
		(vaga.listAreaInteresse || []).forEach(area => {
			acc[area.titulo] = (acc[area.titulo] || 0) + 1;
		});
		return acc;
	}, {});

	const chartData = Object.keys(vagasPorArea).map(key => ({
		name: key,
		vagas: vagasPorArea[key],
	}));

	const TabButton = ({ tabName, label, icon }) => {
		const isActive = activeTab === tabName;
		return (
			<button
				onClick={() => setActiveTab(tabName)}
				className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
			>
				{icon}
				{label}
			</button>
		)
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white shadow-md">
				<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<LayoutDashboard className="text-blue-600" size={28} />
						<h1 className="text-xl font-bold text-gray-800">
							Painel do Administrador
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
			
				<div className="border-b border-gray-200 mb-6">
					<nav className="flex space-x-2" aria-label="Tabs">
						<TabButton tabName="dashboard" label="Dashboard" icon={<BarChart2 size={18} />} />
						<TabButton tabName="gerenciamento" label="Gerenciamento" icon={<Settings size={18} />} />
					</nav>
				</div>

			
				{activeTab === 'dashboard' && (
					<div className="space-y-6">
						{/* Stats */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<StatCard onClick={() => onVerListaVagas('ABERTA')} title="Vagas Abertas" value={vagasAbertasCount} icon={<Briefcase size={32} className="text-green-500" />} />
							<StatCard onClick={() => onVerListaVagas('FECHADA')} title="Vagas Encerradas" value={vagasEncerradasCount} icon={<Briefcase size={32} className="text-red-500" />} />
							<StatCard onClick={() => onVerListaVagas('TODAS')} title="Total de Vagas" value={totalVagasCount} icon={<Briefcase size={32} className="text-blue-500" />} />
							<StatCard onClick={() => setTela('admin-lista-estudantes')} title="Estudantes" value={estudantes.length} icon={<Users size={32} className="text-orange-500" />} />
							<StatCard onClick={() => setTela('admin-lista-empresas')} title="Empresas" value={empresas.length} icon={<Building size={32} className="text-blue-500" />} />
						</div>

						{/* Gráfico */}
						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
							<h3 className="text-xl font-bold text-gray-800 mb-4">Vagas por Área</h3>
							<GraficoVagasPorArea data={chartData} />
						</div>
					</div>
				)}

				{activeTab === 'gerenciamento' && (
					<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
						<h3 className="text-xl font-bold text-gray-800 mb-4">
							Opções de Gerenciamento
						</h3>
						<div className="space-y-4 max-w-sm">
							<button
								onClick={() => setTela('admin-areas-interesse')}
								className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
							>
								Gerenciar Áreas de Interesse
							</button>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

