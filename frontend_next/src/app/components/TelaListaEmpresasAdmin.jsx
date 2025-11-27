'use client';
import React from 'react';
import { ArrowLeft, Building } from 'lucide-react';

export default function TelaListaEmpresasAdmin({ setTela, empresas }) {
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
                    <Building className="text-orange-500" size={28} />
                    <h1 className="text-xl font-bold text-gray-800">
                        Empresas Cadastradas
                    </h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="space-y-4">
                        {empresas && empresas.length > 0 ? (
                            empresas.map((empresa) => (
                                <div key={empresa.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-lg text-gray-800">{empresa.nome}</h3>
                                    <p className="text-sm text-gray-600"><strong>E-mail:</strong> {empresa.email}</p>
                                    <p className="text-sm text-gray-600"><strong>CNPJ:</strong> {empresa.cnpj}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">Nenhuma empresa cadastrada.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
