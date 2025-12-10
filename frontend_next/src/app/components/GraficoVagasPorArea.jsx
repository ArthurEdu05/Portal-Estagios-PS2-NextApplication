/**
 * @fileoverview Componente que renderiza um gráfico de barras com o número de vagas por área.
 * Utiliza a biblioteca recharts para a criação do gráfico.
 *
 * @param {Array<Object>} data - Os dados para o gráfico. Cada objeto deve ter a forma { name: string, vagas: number }.
 *   - `name`: O nome da área (ex: "Tecnologia", "Saúde").
 *   - `vagas`: O número de vagas para aquela área.
 *
 * @returns {JSX.Element} Um gráfico de barras responsivo.
 */
'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GraficoVagasPorArea({ data }) {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="vagas" fill="#3b82f6" name="Nº de Vagas" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
