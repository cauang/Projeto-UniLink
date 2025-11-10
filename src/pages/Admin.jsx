import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function Admin() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 bg-gray-50">
				<div className="container-page py-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold text-gray-800">Painel Admin</h1>
							<p className="text-sm text-gray-500">Visão geral do sistema e estatísticas rápidas</p>
						</div>
						<div>
							<Link to="/cadastro" className="btn-white">Novo voluntário</Link>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<div className="bg-white p-4 rounded shadow">
							<p className="text-sm text-gray-500">Voluntários</p>
							<p className="mt-2 text-2xl font-semibold">1.234</p>
						</div>
						<div className="bg-white p-4 rounded shadow">
							<p className="text-sm text-gray-500">Eventos</p>
							<p className="mt-2 text-2xl font-semibold">24</p>
						</div>
						<div className="bg-white p-4 rounded shadow">
							<p className="text-sm text-gray-500">Inscrições</p>
							<p className="mt-2 text-2xl font-semibold">3.210</p>
						</div>
						<div className="bg-white p-4 rounded shadow">
							<p className="text-sm text-gray-500">Atividades Pendentes</p>
							<p className="mt-2 text-2xl font-semibold text-amber-500">12</p>
						</div>
					</div>

					<div className="bg-white rounded shadow overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								<tr>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ana Silva</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Enfermagem</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<Link to="/perfil" className="text-indigo-600 hover:text-indigo-900">Ver</Link>
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bruno Costa</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Direito</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendente</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<Link to="/perfil" className="text-indigo-600 hover:text-indigo-900">Ver</Link>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

				</div>
			</main>
			<Footer />
		</div>
	);
}