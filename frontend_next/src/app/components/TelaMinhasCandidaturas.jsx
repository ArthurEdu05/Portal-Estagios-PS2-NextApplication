/**
 * @fileoverview Componente da tela "Minhas Candidaturas" para estudantes.
 * Exibe uma lista das vagas de estágio às quais o estudante se candidatou.
 * Permite filtrar as candidaturas pelo status da vaga (aberta, fechada, todas)
 * e ordenar pela data da candidatura. O estudante pode ver detalhes da vaga
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import ModalDetalhesVaga from './ModalDetalhesVaga';

/**
 * Renderiza a tela "Minhas Candidaturas" para um estudante.
 *
 * @param {function} props.setTela - Função para navegar de volta à tela Home ou Vagas.
 * @param {Array<object>} props.inscricoes - Lista das inscrições do estudante. Cada inscrição contém um objeto `vagaEstagio` simplificado.
 * @param {Array<object>} props.vagas - Lista completa de todas as vagas disponíveis, usada para obter detalhes completos das vagas inscritas.
 * @param {function} props.onCancelarInscricao - Função para cancelar uma inscrição.
 * @param {object} props.usuario - O objeto do usuário estudante logado.
 * @returns {JSX.Element} A tela com a lista de candidaturas do estudante.
 */
const TelaMinhasCandidaturas = ({ setTela, inscricoes, vagas, onCancelarInscricao, usuario }) => {
    // Estado para controlar a exibição do modal de detalhes da vaga.
    const [vagaSelecionada, setVagaSelecionada] = useState(null);
    // Estado para o filtro de status da vaga (TODAS, ABERTAS, FECHADAS).
    const [filtroStatus, setFiltroStatus] = useState('TODAS');
    // Estado para a ordem de exibição das candidaturas (RECENTES, ANTIGAS).
    const [ordem, setOrdem] = useState('RECENTES');

    /**
     * Usa useMemo para processar e filtrar as candidaturas.
     * Isso evita recálculos desnecessários e melhora a performance.
     * 1. Adiciona os detalhes completos da vaga a cada inscrição.
     * 2. Filtra as candidaturas com base no `filtroStatus`.
     * 3. Ordena as candidaturas com base na `ordem` (data de inscrição).
     */
    const candidaturasProcessadas = useMemo(() => {
        let candidaturasComDetalhes = inscricoes.map(inscricao => {
            // Encontra os detalhes completos da vaga correspondente.
            const vagaCorrespondente = vagas.find(vaga => vaga.id === inscricao.vagaEstagio.id);
            return {
                ...inscricao,
                vaga: vagaCorrespondente
            };
        }).filter(candidatura => candidatura.vaga); // Garante que apenas candidaturas com vagas válidas sejam exibidas.

        // Aplica o filtro por status da vaga
        if (filtroStatus !== 'TODAS') {
            candidaturasComDetalhes = candidaturasComDetalhes.filter(c => c.vaga.status === filtroStatus);
        }

        // Ordena as candidaturas
        candidaturasComDetalhes.sort((a, b) => {
            const dateA = new Date(a.dataInscricao);
            const dateB = new Date(b.dataInscricao);
            if (ordem === 'RECENTES') {
                return dateB.getTime() - dateA.getTime();
            } else {
                return dateA.getTime() - dateB.getTime();
            }
        });

        return candidaturasComDetalhes;

    }, [inscricoes, vagas, filtroStatus, ordem]);

    /**
     * Retorna as classes CSS para o selo de status da candidatura.
     * @param {string} status - O status da candidatura (PENDENTE, EM_ANALISE, APROVADO, REJEITADO).
     * @returns {string} Classes CSS Tailwind para estilização do selo.
     */
    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDENTE': return 'bg-yellow-100 text-yellow-800';
            case 'EM_ANALISE': return 'bg-blue-100 text-blue-800';
            case 'APROVADO': return 'bg-green-100 text-green-800';
            case 'REJEITADO': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    /**
     * Retorna as classes CSS para o selo de status da vaga (dentro da candidatura).
     * @param {string} status - O status da vaga (ABERTA, FECHADA).
     * @returns {string} Classes CSS Tailwind para estilização do selo.
     */
    const getVagaStatusClass = (status) => {
        switch (status) {
            case 'ABERTA': return 'bg-green-100 text-green-800';
            case 'FECHADA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Minhas Candidaturas
                    </h1>
                    <button
                        onClick={() => setTela('home')}
                        className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        <ArrowLeft size={20} />
                        Voltar
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Controles de Filtro e Ordenação */}
                    <div className="flex flex-wrap gap-4 mb-8 border-b pb-6">
                        <div className="flex-1 min-w-[150px]">
                            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Status da Vaga</label>
                            <select
                                id="status-filter"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                            >
                                <option value="TODAS">Todas</option>
                                <option value="ABERTA">Abertas</option>
                                <option value="FECHADA">Fechadas</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">Ordenar por Data de Candidatura</label>
                            <select
                                id="sort-order"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                                value={ordem}
                                onChange={(e) => setOrdem(e.target.value)}
                            >
                                <option value="RECENTES">Mais Recentes</option>
                                <option value="ANTIGAS">Mais Antigas</option>
                            </select>
                        </div>
                    </div>

                    {candidaturasProcessadas.length > 0 ? (
                        <div className="grid gap-6">
                            {candidaturasProcessadas.map(({ id, vaga, dataInscricao, status }) => (
                                <div
                                    key={id}
                                    onClick={() => setVagaSelecionada(vaga)}
                                    className="border rounded-lg p-6 bg-white hover:shadow-xl hover:border-blue-500 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                >
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-xl font-bold text-gray-800">{vaga.titulo}</h4>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getVagaStatusClass(vaga.status)}`}>
                                                Vaga {vaga.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 font-medium">{vaga.empresa.nome}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Candidatou-se em: {new Date(dataInscricao).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                        <div className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(status)}`}>
                                            Status: {status.replace('_', ' ')}
                                        </div>
                                        {vaga.status === 'ABERTA' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onCancelarInscricao(id);
                                                }}
                                                className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition text-sm"
                                            >
                                                Cancelar Inscrição
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-600 text-lg">Nenhuma candidatura encontrada com os filtros selecionados.</p>
                            <button
                                onClick={() => setTela('vagas')}
                                className="mt-4 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                            >
                                Ver Todas as Vagas Disponíveis
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {vagaSelecionada && (
                <ModalDetalhesVaga
                    vaga={vagaSelecionada}
                    fecharModal={() => setVagaSelecionada(null)}
                    onInscrever={() => {}} 
                    inscricoes={inscricoes}
                    onCancelarInscricao={onCancelarInscricao}
                    usuario={usuario}
                />
            )}
        </div>
    );
};

export default TelaMinhasCandidaturas;