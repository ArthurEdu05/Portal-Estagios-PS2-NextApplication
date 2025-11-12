'use client';
import React, { useState } from 'react'; 
import {
    Briefcase,
    LogOut,
    Search,
} from 'lucide-react';
import GerarCurriculoPDF from './GerarCurriculoPDF';
import ModalDetalhesVaga from './ModalDetalhesVaga'; 

export default function TelaVagas({ usuario, setUsuario, setTela, vagasFiltradas, filtro, setFiltro }) {
    
    const [vagaSelecionada, setVagaSelecionada] = useState(null);

    const handleLogout = () => {
        setUsuario(null);
        setTela('home');
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Briefcase className="text-blue-600" size={32} />
                        <h1 className="text-2xl font-bold text-gray-800">
                            Portal de Estágios
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            Olá, {usuario.nome}
                        </span>
                        
                        {/* <GerarCurriculoPDF estudante={usuario} /> */}

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            <LogOut size={20} />
                            Sair
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-4">
                        Vagas Disponíveis
                    </h2>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Buscar vagas..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {vagasFiltradas.map((vaga) => (
                        <div
                            key={vaga.id}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                        >
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                    {vaga.titulo}
                                </h3>
                                <p className="text-lg text-gray-600">
                                    {vaga.empresa}
                                </p>
                            </div>
                            
                            <p className="text-gray-700 mb-4 line-clamp-3">
                                {vaga.descricao}
                            </p>
                            
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setVagaSelecionada(vaga)}
                                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    Saiba Mais
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {vagaSelecionada && (
                <ModalDetalhesVaga 
                    vaga={vagaSelecionada} 
                    fecharModal={() => setVagaSelecionada(null)} 
                />
            )}
        </div>
    );
}