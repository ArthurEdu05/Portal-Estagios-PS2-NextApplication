'use client';

import React from 'react';
import { Settings, LogOut } from 'lucide-react';

export default function TelaAdminDashboard({ setTela, usuario, fazerLogout }) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-6">
			<div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg text-center">
				<Settings className="text-purple-600 mx-auto mb-4" size={48} />
				<h2 className="text-3xl font-bold text-gray-800 mb-4">
					Bem-vindo, Administrador {usuario?.nome}!
				</h2>
				<p className="text-gray-600 mb-6">
					Este é o painel de administração. Funcionalidades serão
					adicionadas aqui.
				</p>

				<div className="space-y-4">
					<button
						onClick={() => alert('Gerenciar Usuários (em breve)')}
						className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
					>
						Gerenciar Usuários
					</button>
					<button
						onClick={() => alert('Gerenciar Vagas (em breve)')}
						className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
					>
						Gerenciar Vagas
					</button>
					<button
						onClick={fazerLogout}
						className="w-full mt-4 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-medium"
					>
						<LogOut size={20} />
						Sair
					</button>
				</div>
			</div>
		</div>
	);
}
