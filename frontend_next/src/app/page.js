'use client';

import React, { useState, useEffect } from 'react';
import TelaHome from './components/TelaHome';
import TelaLogin from './components/TelaLogin';
import TelaEscolherCadastro from './components/TelaEscolherCadastro';
// import TelaVagas from '../components/TelaVagas';
// import TelaCadastroEstudante from '../components/TelaCadastroEstudante';

const API_BASE_URL = 'http://localhost:8080';

const api = {
    
    login: async (email, password, tipo) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, tipo }),
        });
        if (!response.ok) throw new Error('Falha no login');
        return response.json();
    },

    cadastrarEstudante: async (dados) => {
        const response = await fetch(`${API_BASE_URL}/estudante`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
        if (!response.ok) throw new Error('Falha ao cadastrar estudante');
        return response.json();
    },

    cadastrarEmpresa: async (dados) => {
        const response = await fetch(`${API_BASE_URL}/empresa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
        if (!response.ok) throw new Error('Falha ao cadastrar empresa');
        return response.json();
    },

    listarVagas: async (filtros = {}) => {
        const params = new URLSearchParams(filtros);
        const response = await fetch(`${API_BASE_URL}/vagaEstagio?${params}`);
        if (!response.ok) throw new Error('Falha ao buscar vagas');
        return response.json();
    },

    inscreverVaga: async (dadosInscricao) => {
        const response = await fetch(`${API_BASE_URL}/inscricao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosInscricao),
        });
        if (!response.ok) throw new Error('Falha ao se inscrever');
        return response.json();
    },

    listarAreas: async () => {
        const response = await fetch(`${API_BASE_URL}/areaInteresse`);
        if (!response.ok) throw new Error('Falha ao buscar áreas');
        return response.json();
    },
};

export default function PortalEstagios() {
    
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [tela, setTela] = useState('home');
    const [vagas, setVagas] = useState([]);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        api.listarVagas()
            .then(data => {
                setVagas(data);
            })
            .catch(error => {
                console.error("ERRO AO BUSCAR VAGAS DO BACKEND:", error);
            });
    }, []); 
    
    const fazerLogin = async (emailOuCnpj, senha, tipo) => {
        try {
            const data = await api.login(emailOuCnpj, senha, tipo);
            setUsuario(data.usuario);
            setToken(data.token);
            setTela(
                tipo === 'estudante'
                    ? 'vagas'
                    : tipo === 'empresa'
                    ? 'minhas-vagas'
                    : 'dashboard'
            );
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Login falhou. (Verifique o console para o erro)");
        }
    };

    const cadastrarEstudante = async (formData) => {
        try {
            await api.cadastrarEstudante(formData);
            alert('Cadastro de estudante realizado com sucesso!');
            setTela('login');
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert("Erro ao cadastrar. (Verifique o console para o erro)");
        }
    };

    const vagasFiltradas = vagas.filter(
        (vaga) =>
            vaga.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
            (vaga.empresa && vaga.empresa.toLowerCase().includes(filtro.toLowerCase()))
    );

    if (tela === 'home') {
        return <TelaHome setTela={setTela} vagasMock={vagasFiltradas} />;
    }

    if (tela === 'login') {
        return <TelaLogin setTela={setTela} fazerLogin={fazerLogin} />;
    }

    if (tela === 'escolher-cadastro') {
        return <TelaEscolherCadastro setTela={setTela} />;
    }
    
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