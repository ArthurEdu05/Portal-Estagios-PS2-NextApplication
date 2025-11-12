'client-side';

import React, { useState, useEffect } from 'react';
import {
	User,
	Briefcase,
	Building2,
	FileText,
	LogOut,
	LogIn,
	UserPlus,
	Search,
	MapPin,
	Clock,
	TrendingUp,
	Users,
	CheckCircle,
	XCircle,
} from 'lucide-react';

// Configuração da API
const API_BASE_URL = 'http://localhost:8080/api';

// Serviço de API
const api = {
	// Autenticação
	login: async (email, password, tipo) => {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, tipo }),
		});
		return response.json();
	},

	// Estudantes
	cadastrarEstudante: async (dados) => {
		const response = await fetch(`${API_BASE_URL}/estudantes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dados),
		});
		return response.json();
	},

	getEstudante: async (id, token) => {
		const response = await fetch(`${API_BASE_URL}/estudantes/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.json();
	},

	// Empresas
	cadastrarEmpresa: async (dados) => {
		const response = await fetch(`${API_BASE_URL}/empresas`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dados),
		});
		return response.json();
	},

	// Vagas
	listarVagas: async (filtros = {}) => {
		const params = new URLSearchParams(filtros);
		const response = await fetch(`${API_BASE_URL}/vagas?${params}`);
		return response.json();
	},

	criarVaga: async (dados, token) => {
		const response = await fetch(`${API_BASE_URL}/vagas`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(dados),
		});
		return response.json();
	},

	inscreverVaga: async (vagaId, estudanteId, token) => {
		const response = await fetch(
			`${API_BASE_URL}/vagas/${vagaId}/inscrever`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ estudanteId }),
			}
		);
		return response.json();
	},

	// Áreas
	listarAreas: async () => {
		const response = await fetch(`${API_BASE_URL}/areas`);
		return response.json();
	},

	// Dashboard Admin
	getDashboard: async (token) => {
		const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.json();
	},
};

// Componente de geração de PDF do currículo
const GerarCurriculoPDF = ({ estudante }) => {
	const gerarPDF = () => {
		const conteudo = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 30px; border-bottom: 1px solid #ddd; }
          .secao { margin: 20px 0; }
          .info { margin: 10px 0; }
          .label { font-weight: bold; color: #666; }
          .areas { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
          .area-tag { background: #dbeafe; padding: 5px 15px; border-radius: 20px; }
        </style>
      </head>
      <body>
        <h1>${estudante.nome}</h1>
        
        <div class="secao">
          <h2>Informações Pessoais</h2>
          <div class="info"><span class="label">CPF:</span> ${
				estudante.cpf
			}</div>
          <div class="info"><span class="label">E-mail:</span> ${
				estudante.email
			}</div>
          <div class="info"><span class="label">Telefone:</span> ${
				estudante.telefone
			}</div>
        </div>
        
        <div class="secao">
          <h2>Formação Acadêmica</h2>
          <div class="info"><span class="label">Curso:</span> ${
				estudante.curso
			}</div>
        </div>
        
        <div class="secao">
          <h2>Áreas de Interesse</h2>
          <div class="areas">
            ${
				estudante.areasInteresse
					?.map((area) => `<span class="area-tag">${area}</span>`)
					.join('') || 'Não informado'
			}
          </div>
        </div>
        
        <div class="secao">
          <h2>Objetivo</h2>
          <p>Busco oportunidade de estágio para aplicar conhecimentos adquiridos na graduação e desenvolver habilidades práticas nas áreas de ${
				estudante.areasInteresse?.join(', ') || 'interesse'
			}.</p>
        </div>
      </body>
      </html>
    `;

		const blob = new Blob([conteudo], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `curriculo_${estudante.nome.replace(/\s+/g, '_')}.html`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<button
			onClick={gerarPDF}
			className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
		>
			<FileText size={20} />
			Gerar Currículo PDF
		</button>
	);
};

// Componente principal
export default function PortalEstagios() {
	const [usuario, setUsuario] = useState(null);
	const [tela, setTela] = useState('home');
	const [vagas, setVagas] = useState([]);
	const [areas, setAreas] = useState([
		'Tecnologia',
		'Saúde',
		'Educação',
		'Marketing',
		'Engenharia',
	]);
	const [filtro, setFiltro] = useState('');
	const [dashboard, setDashboard] = useState(null);

	// Dados mockados para demonstração
	const vagasMock = [
		{
			id: 1,
			titulo: 'Estágio em Desenvolvimento Web',
			empresa: 'Tech Solutions',
			area: 'Tecnologia',
			localizacao: 'São Paulo - SP',
			modalidade: 'Híbrido',
			cargaHoraria: '6h/dia',
			descricao: 'Desenvolvimento de aplicações web com React e Node.js',
			requisitos:
				'Cursando Ciência da Computação, conhecimento em JavaScript',
			status: 'aberta',
		},
		{
			id: 2,
			titulo: 'Estágio em Marketing Digital',
			empresa: 'Marketing Pro',
			area: 'Marketing',
			localizacao: 'Rio de Janeiro - RJ',
			modalidade: 'Remoto',
			cargaHoraria: '4h/dia',
			descricao: 'Criação de conteúdo e gestão de redes sociais',
			requisitos: 'Cursando Marketing ou Publicidade',
			status: 'aberta',
		},
		{
			id: 3,
			titulo: 'Estágio em Engenharia Civil',
			empresa: 'Construções SA',
			area: 'Engenharia',
			localizacao: 'Belo Horizonte - MG',
			modalidade: 'Presencial',
			cargaHoraria: '6h/dia',
			descricao: 'Acompanhamento de obras e elaboração de projetos',
			requisitos: 'Cursando Engenharia Civil, AutoCAD',
			status: 'aberta',
		},
	];

	useEffect(() => {
		setVagas(vagasMock);
	}, []);

	const fazerLogin = (email, senha, tipo) => {
		// Simulação de login
		const usuarioMock = {
			id: 1,
			email,
			tipo,
			nome:
				tipo === 'estudante'
					? 'João Silva'
					: tipo === 'empresa'
					? 'Tech Solutions'
					: 'Admin',
			cpf: '123.456.789-00',
			curso: 'Ciência da Computação',
			telefone: '(11) 98765-4321',
			areasInteresse: ['Tecnologia', 'Engenharia'],
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

	const cadastrar = (tipo, dados) => {
		alert(`Cadastro de ${tipo} realizado com sucesso!`);
		setTela('login');
	};

	const vagasFiltradas = vagas.filter(
		(vaga) =>
			vaga.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
			vaga.empresa.toLowerCase().includes(filtro.toLowerCase()) ||
			vaga.area.toLowerCase().includes(filtro.toLowerCase())
	);

	// Tela Home
	if (tela === 'home') {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<nav className="bg-white shadow-lg">
					<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Briefcase className="text-blue-600" size={32} />
							<h1 className="text-2xl font-bold text-gray-800">
								Portal de Estágios
							</h1>
						</div>
						<div className="flex gap-4">
							<button
								onClick={() => setTela('login')}
								className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
							>
								<LogIn size={20} />
								Entrar
							</button>
							<button
								onClick={() => setTela('escolher-cadastro')}
								className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
							>
								<UserPlus size={20} />
								Cadastrar
							</button>
						</div>
					</div>
				</nav>

				<div className="max-w-7xl mx-auto px-6 py-16">
					<div className="text-center mb-16">
						<h2 className="text-5xl font-bold text-gray-800 mb-6">
							Conectamos Talentos a Oportunidades
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							A plataforma completa para estudantes encontrarem
							estágios e empresas descobrirem os melhores talentos
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 mb-16">
						<div className="bg-white p-8 rounded-xl shadow-lg text-center">
							<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<User className="text-blue-600" size={32} />
							</div>
							<h3 className="text-xl font-bold mb-3">
								Para Estudantes
							</h3>
							<p className="text-gray-600">
								Encontre estágios alinhados com suas áreas de
								interesse
							</p>
						</div>
						<div className="bg-white p-8 rounded-xl shadow-lg text-center">
							<div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<Building2
									className="text-green-600"
									size={32}
								/>
							</div>
							<h3 className="text-xl font-bold mb-3">
								Para Empresas
							</h3>
							<p className="text-gray-600">
								Divulgue vagas e encontre candidatos
								qualificados
							</p>
						</div>
						<div className="bg-white p-8 rounded-xl shadow-lg text-center">
							<div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<TrendingUp
									className="text-purple-600"
									size={32}
								/>
							</div>
							<h3 className="text-xl font-bold mb-3">
								Gestão Simplificada
							</h3>
							<p className="text-gray-600">
								Dashboard completo para acompanhar todo o
								processo
							</p>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-8">
						<h3 className="text-2xl font-bold mb-6">
							Vagas em Destaque
						</h3>
						<div className="grid gap-4">
							{vagasMock.slice(0, 3).map((vaga) => (
								<div
									key={vaga.id}
									className="border rounded-lg p-6 hover:shadow-md transition"
								>
									<div className="flex justify-between items-start mb-3">
										<div>
											<h4 className="text-xl font-bold text-gray-800">
												{vaga.titulo}
											</h4>
											<p className="text-gray-600">
												{vaga.empresa}
											</p>
										</div>
										<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
											{vaga.area}
										</span>
									</div>
									<div className="flex gap-4 text-sm text-gray-600">
										<span className="flex items-center gap-1">
											<MapPin size={16} />
											{vaga.localizacao}
										</span>
										<span className="flex items-center gap-1">
											<Clock size={16} />
											{vaga.cargaHoraria}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Tela de Login
	if (tela === 'login') {
		const [email, setEmail] = useState('');
		const [senha, setSenha] = useState('');
		const [tipo, setTipo] = useState('estudante');

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

						<button
							onClick={() => fazerLogin(email, senha, tipo)}
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

	// Tela de Escolher Tipo de Cadastro
	if (tela === 'escolher-cadastro') {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
				<div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl">
					<h2 className="text-3xl font-bold text-center mb-8">
						Escolha o Tipo de Cadastro
					</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<button
							onClick={() => setTela('cadastro-estudante')}
							className="p-8 border-2 border-blue-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition"
						>
							<User
								className="text-blue-600 mx-auto mb-4"
								size={48}
							/>
							<h3 className="text-xl font-bold mb-2">
								Estudante
							</h3>
							<p className="text-gray-600">
								Cadastre-se para encontrar estágios
							</p>
						</button>
						<button
							onClick={() => setTela('cadastro-empresa')}
							className="p-8 border-2 border-green-200 rounded-xl hover:border-green-600 hover:shadow-lg transition"
						>
							<Building2
								className="text-green-600 mx-auto mb-4"
								size={48}
							/>
							<h3 className="text-xl font-bold mb-2">Empresa</h3>
							<p className="text-gray-600">
								Cadastre-se para divulgar vagas
							</p>
						</button>
					</div>
					<button
						onClick={() => setTela('home')}
						className="w-full mt-6 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
					>
						Voltar
					</button>
				</div>
			</div>
		);
	}

	// Tela de Cadastro de Estudante
	if (tela === 'cadastro-estudante') {
		const [formData, setFormData] = useState({
			nome: '',
			cpf: '',
			email: '',
			senha: '',
			telefone: '',
			curso: '',
			areasInteresse: [],
		});

		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
				<div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8">
					<h2 className="text-3xl font-bold text-center mb-8">
						Cadastro de Estudante
					</h2>

					<div className="space-y-4">
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nome Completo
								</label>
								<input
									type="text"
									value={formData.nome}
									onChange={(e) =>
										setFormData({
											...formData,
											nome: e.target.value,
										})
									}
									className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									CPF
								</label>
								<input
									type="text"
									value={formData.cpf}
									onChange={(e) =>
										setFormData({
											...formData,
											cpf: e.target.value,
										})
									}
									className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								E-mail
							</label>
							<input
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
								className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Senha
								</label>
								<input
									type="password"
									value={formData.senha}
									onChange={(e) =>
										setFormData({
											...formData,
											senha: e.target.value,
										})
									}
									className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Telefone
								</label>
								<input
									type="tel"
									value={formData.telefone}
									onChange={(e) =>
										setFormData({
											...formData,
											telefone: e.target.value,
										})
									}
									className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Curso
							</label>
							<input
								type="text"
								value={formData.curso}
								onChange={(e) =>
									setFormData({
										...formData,
										curso: e.target.value,
									})
								}
								className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Áreas de Interesse
							</label>
							<div className="flex flex-wrap gap-2">
								{areas.map((area) => (
									<button
										key={area}
										onClick={() => {
											const novasAreas =
												formData.areasInteresse.includes(
													area
												)
													? formData.areasInteresse.filter(
															(a) => a !== area
													  )
													: [
															...formData.areasInteresse,
															area,
													  ];
											setFormData({
												...formData,
												areasInteresse: novasAreas,
											});
										}}
										className={`px-4 py-2 rounded-full transition ${
											formData.areasInteresse.includes(
												area
											)
												? 'bg-blue-600 text-white'
												: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
										}`}
									>
										{area}
									</button>
								))}
							</div>
						</div>

						<div className="flex gap-4 pt-4">
							<button
								onClick={() => cadastrar('estudante', formData)}
								className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
							>
								Cadastrar
							</button>
							<button
								onClick={() => setTela('escolher-cadastro')}
								className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
							>
								Voltar
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Tela logada - Estudante visualizando vagas
	if (tela === 'vagas' && usuario?.tipo === 'estudante') {
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
							<GerarCurriculoPDF estudante={usuario} />
							<button
								onClick={() => {
									setUsuario(null);
									setTela('home');
								}}
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
								<div className="flex justify-between items-start mb-4">
									<div>
										<h3 className="text-2xl font-bold text-gray-800 mb-2">
											{vaga.titulo}
										</h3>
										<p className="text-lg text-gray-600">
											{vaga.empresa}
										</p>
									</div>
									<span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
										{vaga.area}
									</span>
								</div>

								<p className="text-gray-700 mb-4">
									{vaga.descricao}
								</p>

								<div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
									<span className="flex items-center gap-2">
										<MapPin size={16} />
										{vaga.localizacao}
									</span>
									<span className="flex items-center gap-2">
										<Clock size={16} />
										{vaga.cargaHoraria}
									</span>
									<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
										{vaga.modalidade}
									</span>
								</div>

								<div className="bg-gray-50 p-4 rounded-lg mb-4">
									<p className="text-sm font-medium text-gray-700 mb-2">
										Requisitos:
									</p>
									<p className="text-sm text-gray-600">
										{vaga.requisitos}
									</p>
								</div>

								<button
									onClick={() =>
										alert(
											`Inscrito na vaga: ${vaga.titulo}`
										)
									}
									className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
								>
									Inscrever-se
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Tela logada - Empresa
	if (tela === 'minhas-vagas' && usuario?.tipo === 'empresa') {
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
							<button
								onClick={() => setTela('criar-vaga')}
								className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
							>
								+ Nova Vaga
							</button>
							<button
								onClick={() => {
									setUsuario(null);
									setTela('home');
								}}
								className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
							>
								<LogOut size={20} />
								Sair
							</button>
						</div>
					</div>
				</nav>

				<div className="max-w-7xl mx-auto px-6 py-8">
					<h2 className="text-3xl font-bold mb-8">Minhas Vagas</h2>

					<div className="grid gap-6">
						{vagasMock.map((vaga) => (
							<div
								key={vaga.id}
								className="bg-white rounded-xl shadow-lg p-6"
							>
								<div className="flex justify-between items-start mb-4">
									<div>
										<h3 className="text-2xl font-bold text-gray-800 mb-2">
											{vaga.titulo}
										</h3>
										<p className="text-gray-600">
											{vaga.area}
										</p>
									</div>
									<div className="flex gap-2">
										<span
											className={`px-4 py-2 rounded-full font-medium ${
												vaga.status === 'aberta'
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'
											}`}
										>
											{vaga.status === 'aberta'
												? 'Aberta'
												: 'Encerrada'}
										</span>
									</div>
								</div>

								<p className="text-gray-700 mb-4">
									{vaga.descricao}
								</p>

								<div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
									<p className="text-sm font-medium text-gray-700 mb-2">
										Candidatos Inscritos
									</p>
									<div className="flex items-center gap-2">
										<Users
											className="text-blue-600"
											size={20}
										/>
										<span className="text-2xl font-bold text-blue-600">
											12
										</span>
										<span className="text-gray-600">
											estudantes
										</span>
									</div>
								</div>

								<div className="flex gap-3">
									<button
										onClick={() =>
											alert('Visualizar candidatos')
										}
										className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
									>
										Ver Candidatos
									</button>
									{vaga.status === 'aberta' && (
										<button
											onClick={() =>
												alert('Vaga encerrada')
											}
											className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
										>
											Encerrar Vaga
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Tela de criar vaga
	if (tela === 'criar-vaga' && usuario?.tipo === 'empresa') {
		const [formVaga, setFormVaga] = useState({
			titulo: '',
			descricao: '',
			area: '',
			localizacao: '',
			modalidade: 'Híbrido',
			cargaHoraria: '',
			requisitos: '',
		});

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
						<button
							onClick={() => setTela('minhas-vagas')}
							className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
						>
							Voltar
						</button>
					</div>
				</nav>

				<div className="max-w-3xl mx-auto px-6 py-8">
					<div className="bg-white rounded-xl shadow-lg p-8">
						<h2 className="text-3xl font-bold mb-8">
							Criar Nova Vaga
						</h2>

						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Título da Vaga
								</label>
								<input
									type="text"
									value={formVaga.titulo}
									onChange={(e) =>
										setFormVaga({
											...formVaga,
											titulo: e.target.value,
										})
									}
									className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									placeholder="Ex: Estágio em Desenvolvimento Web"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Descrição
								</label>
								<textarea
									value={formVaga.descricao}
									onChange={(e) =>
										setFormVaga({
											...formVaga,
											descricao: e.target.value,
										})
									}
									className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
									placeholder="Descreva as atividades e responsabilidades..."
								/>
							</div>

							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Área
									</label>
									<select
										value={formVaga.area}
										onChange={(e) =>
											setFormVaga({
												...formVaga,
												area: e.target.value,
											})
										}
										className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									>
										<option value="">Selecione...</option>
										{areas.map((area) => (
											<option key={area} value={area}>
												{area}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Modalidade
									</label>
									<select
										value={formVaga.modalidade}
										onChange={(e) =>
											setFormVaga({
												...formVaga,
												modalidade: e.target.value,
											})
										}
										className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									>
										<option value="Remoto">Remoto</option>
										<option value="Presencial">
											Presencial
										</option>
										<option value="Híbrido">Híbrido</option>
									</select>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Localização
									</label>
									<input
										type="text"
										value={formVaga.localizacao}
										onChange={(e) =>
											setFormVaga({
												...formVaga,
												localizacao: e.target.value,
											})
										}
										className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
										placeholder="Ex: São Paulo - SP"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Carga Horária
									</label>
									<input
										type="text"
										value={formVaga.cargaHoraria}
										onChange={(e) =>
											setFormVaga({
												...formVaga,
												cargaHoraria: e.target.value,
											})
										}
										className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
										placeholder="Ex: 6h/dia"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Requisitos
								</label>
								<textarea
									value={formVaga.requisitos}
									onChange={(e) =>
										setFormVaga({
											...formVaga,
											requisitos: e.target.value,
										})
									}
									className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
									placeholder="Liste os requisitos necessários..."
								/>
							</div>

							<button
								onClick={() => {
									alert('Vaga criada com sucesso!');
									setTela('minhas-vagas');
								}}
								className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
							>
								Publicar Vaga
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Tela Dashboard Admin
	if (tela === 'dashboard' && usuario?.tipo === 'admin') {
		return (
			<div className="min-h-screen bg-gray-50">
				<nav className="bg-white shadow-lg">
					<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Briefcase className="text-blue-600" size={32} />
							<h1 className="text-2xl font-bold text-gray-800">
								Portal de Estágios - Admin
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<span className="text-gray-700">
								Olá, {usuario.nome}
							</span>
							<button
								onClick={() => {
									setUsuario(null);
									setTela('home');
								}}
								className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
							>
								<LogOut size={20} />
								Sair
							</button>
						</div>
					</div>
				</nav>

				<div className="max-w-7xl mx-auto px-6 py-8">
					<h2 className="text-3xl font-bold mb-8">
						Dashboard Administrativo
					</h2>

					<div className="grid md:grid-cols-4 gap-6 mb-8">
						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between mb-4">
								<Building2
									className="text-blue-600"
									size={32}
								/>
								<span className="text-3xl font-bold text-blue-600">
									45
								</span>
							</div>
							<p className="text-gray-600 font-medium">
								Empresas Cadastradas
							</p>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between mb-4">
								<User className="text-green-600" size={32} />
								<span className="text-3xl font-bold text-green-600">
									328
								</span>
							</div>
							<p className="text-gray-600 font-medium">
								Estudantes Cadastrados
							</p>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between mb-4">
								<CheckCircle
									className="text-purple-600"
									size={32}
								/>
								<span className="text-3xl font-bold text-purple-600">
									87
								</span>
							</div>
							<p className="text-gray-600 font-medium">
								Vagas Abertas
							</p>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between mb-4">
								<XCircle className="text-gray-600" size={32} />
								<span className="text-3xl font-bold text-gray-600">
									152
								</span>
							</div>
							<p className="text-gray-600 font-medium">
								Vagas Encerradas
							</p>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-xl font-bold mb-6">
								Vagas por Área
							</h3>
							<div className="space-y-4">
								{areas.map((area, idx) => {
									const valores = [35, 28, 18, 15, 12];
									return (
										<div key={area}>
											<div className="flex justify-between mb-2">
												<span className="text-gray-700">
													{area}
												</span>
												<span className="font-bold text-blue-600">
													{valores[idx]}%
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-3">
												<div
													className="bg-blue-600 h-3 rounded-full transition-all"
													style={{
														width: `${valores[idx]}%`,
													}}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-xl font-bold mb-6">
								Gerenciar Áreas de Interesse
							</h3>
							<div className="space-y-4">
								{areas.map((area) => (
									<div
										key={area}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<span className="font-medium text-gray-700">
											{area}
										</span>
										<button className="text-red-600 hover:text-red-800">
											Remover
										</button>
									</div>
								))}
								<button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition mt-4">
									+ Adicionar Nova Área
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return null;
}
