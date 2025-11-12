'use client';
import React from 'react';
import {
    Building2,
    CalendarDays,
    XCircle,
} from 'lucide-react'; 

export default function ModalDetalhesVaga({ vaga, fecharModal }) {
    return (

        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
         
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative animate-slideUp">
                
             
                <button 
                    onClick={fecharModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <XCircle size={28} />
                </button>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{vaga.titulo}</h2>
                
                <div className="flex items-center gap-2 text-lg text-gray-600 mb-6">
                    <Building2 size={20} />
                    <span>{vaga.empresa}</span>
                </div>

           
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 text-gray-700">
                    <div className="flex items-center gap-2">
                        <CalendarDays size={20} className="text-green-600" />
                        <div>
                            <p className="font-bold">Início do Processo</p>
                            <p>{vaga.dataInicio}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays size={20} className="text-red-600" />
                        <div>
                            <p className="font-bold">Fim do Processo</p>
                            <p>{vaga.dataFim}</p>
                        </div>
                    </div>
                </div>

               
                <div className="space-y-4 mb-8">
                    <div>
                        <h4 className="text-xl font-bold mb-2">Descrição da Vaga</h4>
                        <p className="text-gray-600">{vaga.descricao}</p>
                    </div>
                </div>

          
                <div className="flex gap-4">
                    <button
                        onClick={() => alert(`Inscrito na vaga: ${vaga.titulo}`)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Inscrever-se
                    </button>
                    <button
                        onClick={fecharModal}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                        Voltar
                    </button>
                </div>

            </div>
        </div>
    );
}