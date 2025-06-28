import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ResultadoDetalle {
  skill: string;
  score: number;
}

interface ResultadosData {
  evaluacion: string;
  fecha: string;
  puntuacionGlobal: number;
  detalles: ResultadoDetalle[];
}

const resultadosMock: ResultadosData = {
  evaluacion: 'Autoevaluación Q2',
  fecha: '2025-06-10',
  puntuacionGlobal: 4.5,
  detalles: [
    { skill: 'Liderazgo', score: 4.7 },
    { skill: 'Comunicación', score: 4.8 },
    { skill: 'Trabajo en Equipo', score: 4.3 },
    { skill: 'Resolución de Problemas', score: 4.4 },
  ],
};

const Resultados = () => {
  const [data, setData] = useState<ResultadoDetalle[]>([]);

  useEffect(() => {
    // Simular carga de datos
    setData(resultadosMock.detalles);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Resultados de Evaluación</h2>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-medium mb-2">
          {resultadosMock.evaluacion}
        </h3>
        <p className="mb-4 text-gray-600">Fecha: {resultadosMock.fecha}</p>
        <p className="text-3xl font-bold text-green-600 mb-6">
          Puntuación Global: {resultadosMock.puntuacionGlobal.toFixed(1)}
        </p>

        <h4 className="text-lg font-semibold mb-3">Detalle por Competencia</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="skill" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="score" fill="#0284c7" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Resultados;
