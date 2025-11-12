'use client';
import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';


export default function TelaLogin({ setTela, fazerLogin }) {
    const [email, setEmail] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('estudante');

    const handleLogin = () => {
        if (tipo === 'empresa') {
            fazerLogin(cnpj, senha, tipo);
        } else {
            fazerLogin(email, senha, tipo);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <Briefcase
                        className="text-blue-600 mx-auto mb-4"
                        size={48}
                    />
                    <h2 className="text-3xl font-bold text-gray-800">
                        Login
                    </h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Usuário
                        </label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="estudante">Estudante</option>
                            <option value="empresa">Empresa</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    {/* Mostra campos diferentes dependendo do 'tipo' */}
                    {(tipo === 'estudante' || tipo === 'admin') && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </>
                    )}

                    {tipo === 'empresa' && (
                         <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CNPJ
                                </label>
                                <input
                                    type="text"
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="00.000.000/0001-00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Entrar
                    </button>

                    <button
                        onClick={() => setTela('home')}
                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}