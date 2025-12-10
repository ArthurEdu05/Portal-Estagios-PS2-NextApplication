/**
 * @fileoverview Tela principal do painel de administração.
 * Exibe estatísticas gerais do portal, um gráfico de vagas por área e fornece navegação
 * para outras seções de gerenciamento do sistema, como gerenciamento de vagas,
 * estudantes, empresas e áreas de interesse.
 */

'use client';

import React, { useState } from 'react';
import { LogOut, LayoutDashboard, Briefcase, Users, Building, Settings, BarChart2 } from 'lucide-react';
import GraficoVagasPorArea from './GraficoVagasPorArea';

/**
 * Componente para exibir um card de estatística clicável.
 *
 * @param {string} props.title - O título do card (ex: "Vagas Abertas").
 * @param {number | string} props.value - O valor a ser exibido.
 * @param {JSX.Element} props.icon - O ícone a ser exibido no card.
 * @param {function} props.onClick - A função a ser chamada quando o card é clicado.
 */
const StatCard = ({ title, value, icon, onClick }) => (
	<button onClick={onClick} className="bg-gray-100 p-6 rounded-lg flex items-center gap-4 border border-gray-200 hover:bg-gray-200 hover:shadow-md transition w-full text-left">
		{icon}
		<div>
			<p className="text-gray-500">{title}</p>
			<p className="text-3xl font-bold text-gray-800">{value}</p>
		</div>
	</button>
);

/**
 * Componente principal do painel de administração.
 *
 * @param {function} props.setTela - Função para mudar a tela/componente renderizado no painel principal.
 * @param {object} props.usuario - O objeto do administrador logado.
 * @param {function} props.fazerLogout - Função para realizar o logout do administrador.
 * @param {Array<object>} props.vagas - Lista de todas as vagas cadastradas.
 * @param {Array<object>} props.estudantes - Lista de todos os estudantes cadastrados.
 * @param {Array<object>} props.empresas - Lista de todas as empresas cadastradas.
 * @param {function} props.onVerListaVagas - Função para navegar para a lista de vagas com um filtro específico.
 */
export default function TelaAdminDashboard({ setTela, usuario, fazerLogout, vagas, estudantes, empresas, onVerListaVagas }) {
	const [activeTab, setActiveTab] = useState('dashboard');

	// Calcula as contagens de vagas para os cards de estatística.
	const vagasAbertasCount = vagas.filter(vaga => vaga.status === 'ABERTA').length;
	const vagasEncerradasCount = vagas.filter(vaga => vaga.status === 'FECHADA').length;
	const totalVagasCount = vagas.length;

	/**
	 * Processa os dados das vagas para agregar o número de vagas por área de interesse.
	 * O resultado é usado para alimentar o componente `GraficoVagasPorArea`.
	 * @returns {Array<object>} Um array de objetos no formato { name: string, vagas: number }.
	 */
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

	/**
	 * Componente de botão para as abas de navegação (Dashboard, Gerenciamento).
	 *
	 * @param {string} props.tabName - O identificador da aba.
	 * @param {string} props.label - O texto do botão.
	 * @param {JSX.Element} props.icon - O ícone do botão.
	 * @returns {JSX.Element} Um botão que controla a aba ativa.
	 */
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
			
				{/* Navegação por Abas */}
				<div className="border-b border-gray-200 mb-6">
					<nav className="flex space-x-2" aria-label="Tabs">
						<TabButton tabName="dashboard" label="Dashboard" icon={<BarChart2 size={18} />} />
						<TabButton tabName="gerenciamento" label="Gerenciamento" icon={<Settings size={18} />} />
					</nav>
				</div>

			
				{/* Conteúdo da Aba Dashboard */}
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

				{/* Conteúdo da Aba Gerenciamento */}
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
