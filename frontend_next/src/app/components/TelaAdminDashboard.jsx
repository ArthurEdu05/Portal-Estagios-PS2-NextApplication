'use client';

import React from 'react';
import { Settings, LogOut, LayoutDashboard } from 'lucide-react';

export default function TelaAdminDashboard({ setTela, usuario, fazerLogout }) {
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
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-gray-800">
						Bem-vindo, Administrador!
					</h2>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
					<p className="text-gray-600 mb-6 text-center">
						Selecione uma opção para gerenciar o portal.
					</p>

					<div className="space-y-4">
						<button
							onClick={() => setTela('admin-areas-interesse')}
							className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
						>
							Gerenciar Áreas de Interesse
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
