/**
 * @fileoverview Componente da tela de listagem e gerenciamento de vagas para o administrador.
 * Permite ao administrador visualizar todas as vagas cadastradas, com opções de filtragem
 * por status (aberta, fechada, todas) para facilitar a gestão.
 */

'use client';
import React from 'react';
import { ArrowLeft, Briefcase, MapPin, Clock, Laptop, Info, FileText } from 'lucide-react';

/**
 * Componente auxiliar para exibir um selo de status da vaga.
 *
 * @param {string} props.status - O status da vaga ('ABERTA' ou 'FECHADA').
 * @returns {JSX.Element} Um elemento span formatado com o status da vaga.
 */
const StatusBadge = ({ status }) => {
    const isAberta = status === 'ABERTA';
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isAberta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isAberta ? 'Aberta' : 'Fechada'}
        </span>
    );
};

/**
 * Renderiza a tela de listagem de vagas para o administrador.
 *
 * @param {function} props.setTela - Função para navegar de volta ao dashboard do administrador.
 * @param {Array<object>} props.vagas - A lista de objetos de vagas a serem exibidas.
 * @param {string} props.filtroInicial - O status de filtro inicial ('TODAS', 'ABERTA', 'FECHADA').
 * @param {function} props.onFiltroChange - Função para alterar o filtro de status da vaga.
 * @returns {JSX.Element} A tela de listagem de vagas para administração.
 */
export default function TelaListaVagasAdmin({ setTela, vagas, filtroInicial, onFiltroChange }) {
    // As vagas exibidas são filtradas com base no 'filtroInicial' fornecido.
    const vagasExibidas = vagas.filter(vaga => {
        if (filtroInicial === 'TODAS') {
            return true;
        }
        return vaga.status === filtroInicial;
    });

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
                        Gerenciar Vagas
                    </h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Lista de Vagas</h2>
                    {/* Botões de filtro por status */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onFiltroChange('TODAS')}
                            className={`px-4 py-2 rounded-lg font-medium ${filtroInicial === 'TODAS' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => onFiltroChange('ABERTA')}
                            className={`px-4 py-2 rounded-lg font-medium ${filtroInicial === 'ABERTA' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Abertas
                        </button>
                        <button
                            onClick={() => onFiltroChange('FECHADA')}
                            className={`px-4 py-2 rounded-lg font-medium ${filtroInicial === 'FECHADA' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Encerradas
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="space-y-4">
                        {vagasExibidas && vagasExibidas.length > 0 ? (
                            vagasExibidas.map((vaga) => (
                                <div key={vaga.id} className={`bg-gray-50 p-4 rounded-lg border border-gray-200 ${vaga.status === 'FECHADA' ? 'opacity-70' : ''}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-gray-800">{vaga.titulo}</h3>
                                            <StatusBadge status={vaga.status} />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">Empresa: {vaga.empresa?.nome || 'N/A'}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500 mb-2">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {vaga.localizacao}</span>
                                        <span className="flex items-center gap-1"><Laptop size={14} /> {vaga.modalidade}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {vaga.cargaHoraria}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{vaga.descricao}</p>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <FileText size={14} /> Requisitos: <span className="line-clamp-1">{vaga.requisitos}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                {filtroInicial === 'TODAS' && 'Nenhuma vaga encontrada no momento.'}
                                {filtroInicial === 'ABERTA' && 'Nenhuma vaga aberta encontrada no momento.'}
                                {filtroInicial === 'FECHADA' && 'Nenhuma vaga encerrada encontrada no momento.'}
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
