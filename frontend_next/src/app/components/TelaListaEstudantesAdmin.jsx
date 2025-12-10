/**
 * @fileoverview Componente da tela de listagem de estudantes para o administrador.
 * Exibe uma lista de todos os estudantes cadastrados no sistema, mostrando
 * informações básicas como nome, email e CPF.
 * Permite ao administrador visualizar rapidamente os estudantes registrados.
 */

'use client';
import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';

/**
 * Renderiza a tela de listagem de estudantes para o administrador.
 *
 * @param {function} props.setTela - Função para navegar de volta ao dashboard do administrador.
 * @param {Array<object>} props.estudantes - A lista de objetos de estudantes a serem exibidas.
 */
export default function TelaListaEstudantesAdmin({ setTela, estudantes }) {
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
                    <Users className="text-green-500" size={28} />
                    <h1 className="text-xl font-bold text-gray-800">
                        Estudantes Cadastrados
                    </h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="space-y-4">
                        {estudantes && estudantes.length > 0 ? (
                            estudantes.map((estudante) => (
                                <div key={estudante.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-lg text-gray-800">{estudante.nome}</h3>
                                    <p className="text-sm text-gray-600"><strong>E-mail:</strong> {estudante.email}</p>
                                    <p className="text-sm text-gray-600"><strong>CPF:</strong> {estudante.cpf}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">Nenhum estudante cadastrado.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
