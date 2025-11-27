'use client';
import React, { useState, useEffect } from 'react';
import { BookMarked, Trash2, Edit, ArrowLeft } from 'lucide-react';

export default function TelaAreasInteresseAdmin({ setTela, areas, onCadastrar, onAtualizar, onDeletar }) {
    const [id, setId] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!titulo || !descricao) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (isEditing) {
            onAtualizar(id, { titulo, descricao });
        } else {
            onCadastrar({ titulo, descricao });
        }
        resetForm();
    };

    const handleEdit = (area) => {
        setIsEditing(true);
        setId(area.id);
        setTitulo(area.titulo);
        setDescricao(area.descricao);
    };

    const resetForm = () => {
        setIsEditing(false);
        setId(null);
        setTitulo('');
        setDescricao('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTela('admin-dashboard')}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <BookMarked className="text-blue-600" size={28} />
                        <h1 className="text-xl font-bold text-gray-800">
                            Gerenciar Áreas de Interesse
                        </h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                {/* Formulário e Lista */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Formulário */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">{isEditing ? 'Editar Área' : 'Nova Área'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Título</label>
                                    <input
                                        type="text"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Desenvolvimento Web"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                                    <textarea
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Breve descrição da área"
                                    ></textarea>
                                </div>
                                <div className="flex space-x-2">
                                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                                        {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                                    </button>
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Lista */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Áreas Cadastradas</h2>
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                                {areas && areas.length > 0 ? (
                                    areas.map((area) => (
                                        <div key={area.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{area.titulo}</h3>
                                                <p className="text-sm text-gray-600">{area.descricao}</p>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button onClick={() => handleEdit(area)} className="text-blue-500 hover:text-blue-700 p-2">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => onDeletar(area.id)} className="text-red-500 hover:text-red-700 p-2">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-8">Nenhuma área de interesse cadastrada.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
