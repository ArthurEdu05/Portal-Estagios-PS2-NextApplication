'use client';

import React, { useState, useEffect } from 'react';


import TelaHome from './components/TelaHome';
import TelaLogin from './components/TelaLogin';
import TelaEscolherCadastro from './components/TelaEscolherCadastro';


export default function PortalEstagios() {
    
    const [usuario, setUsuario] = useState(null);
    const [tela, setTela] = useState('home'); 

    
    const vagasMock = [
        {
            id: 1,
            titulo: 'Estágio em Desenvolvimento Web',
            empresa: 'Tech Solutions',
            area: 'Tecnologia',
            localizacao: 'São Paulo - SP',
            cargaHoraria: '6h/dia',
        },
        {
            id: 2,
            titulo: 'Estágio em Marketing Digital',
            empresa: 'Marketing Pro',
            area: 'Marketing',
            localizacao: 'Rio de Janeiro - RJ',
            cargaHoraria: '4h/dia',
        },
        {
            id: 3,
            titulo: 'Estágio em Engenharia Civil',
            empresa: 'Construções SA',
            area: 'Engenharia',
            localizacao: 'Belo Horizonte - MG',
            cargaHoraria: '6h/dia',
        },
    ];
    
    const fazerLogin = (emailOuCnpj, senha, tipo) => {
        
     
        const usuarioMock = {
            id: 1,
            email: emailOuCnpj,
            tipo,
            nome:
                tipo === 'estudante'
                    ? 'João Silva'
                    : tipo === 'empresa'
                    ? 'Tech Solutions'
                    : 'Admin',
        };
        setUsuario(usuarioMock); 
        

        setTela(
            tipo === 'estudante'
                ? 'vagas' 
                : tipo === 'empresa'
                ? 'minhas-vagas' 
                : 'dashboard'
        );
    };

    
    
    if (tela === 'home') {
        return <TelaHome setTela={setTela} vagasMock={vagasMock} />;
    }

    if (tela === 'login') {
        return <TelaLogin setTela={setTela} fazerLogin={fazerLogin} />;
    }

    if (tela === 'escolher-cadastro') {
        return <TelaEscolherCadastro setTela={setTela} />;
    }

    // Quando  for implementar as outras telas, adicionar os 'if' aqui:
   
    
   

    // Se 'tela' for um valor que ainda não implementamos, mostra uma mensagem temporária.
    return (
        <div>
            <p>Tela "{tela}" em construção...</p>
            <button onClick={() => {
                setUsuario(null);
                setTela('home');
            }} className="bg-blue-500 text-white p-2">
                Voltar para Home
            </button>
        </div>
    );
}