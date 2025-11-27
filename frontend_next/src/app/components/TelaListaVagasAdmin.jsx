'use client';
import React from 'react';
import { ArrowLeft, Briefcase } from 'lucide-react';

export default function TelaListaVagasAdmin({ setTela, vagas }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={() => setTela('admin-dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <Briefcase className="text-blue-500" size={28} />
                    <h1 className="text-xl font-bold text-gray-800">
                        Vagas Disponíveis
                    </h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="space-y-4">
                        {vagas && vagas.length > 0 ? (
                            vagas.map((vaga) => (
                                <div key={vaga.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-lg text-gray-800">{vaga.titulo}</h3>
                                    <p className="text-sm font-semibold text-gray-700">Empresa: {vaga.empresa?.nome || 'N/A'}</p>
                                    <p className="text-sm text-gray-600 mt-2">{vaga.descricao}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">Nenhuma vaga disponível.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
