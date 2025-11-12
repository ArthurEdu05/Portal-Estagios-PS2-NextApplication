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
            descricao: 'Estamos buscando um estudante proativo para auxiliar no desenvolvimento e manutenção de nossas aplicações web, utilizando React e Node.js. O candidato ideal é apaixonado por tecnologia e está sempre buscando aprender.',
            dataInicio: '20/11/2025',
            dataFim: '15/12/2025',
        },
        {
            id: 2,
            titulo: 'Estágio em Marketing Digital',
            empresa: 'Marketing Pro',
            descricao: 'Oportunidade para atuar na criação de conteúdo para redes sociais, análise de métricas e gerenciamento de campanhas de e-mail marketing. Buscamos alguém criativo e com boa escrita.',
            dataInicio: '25/11/2025',
            dataFim: '20/12/2025',
        },
        {
            id: 3,
            titulo: 'Estágio em Engenharia Civil',
            empresa: 'Construções SA',
            descricao: 'Auxiliar no acompanhamento de obras, medições, elaboração de relatórios diários e verificação de projetos. O estagiário terá contato direto com a equipe de engenharia em campo.',
            dataInicio: '01/12/2025',
            dataFim: '22/12/2025',
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