import { useEffect, useState } from 'react';
import { evaluationService } from '../../services/evaluationService';

interface ResultadoEvaluacion {
  id: number;
  cycle: string;
  score: number;
  comments: string;
  submitted_at: string;
  template: string;
  responses: { question: string; answer: string }[];
}

const Resultados = () => {
  const [evaluaciones, setEvaluaciones] = useState<ResultadoEvaluacion[]>([]);
  const [selected, setSelected] = useState<ResultadoEvaluacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    evaluationService
      .getMyResults()
      .then((data) => {
        setEvaluaciones(data);
        if (data.length > 0) setSelected(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando evaluaciones...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Resultados de Evaluación</h2>

      {evaluaciones.length === 0 && <p>No hay evaluaciones disponibles.</p>}

      {evaluaciones.length > 0 && (
        <>
          <select
            className="mb-4 p-2 border rounded"
            onChange={(e) => {
              const evalId = Number(e.target.value);
              const evalSelected =
                evaluaciones.find((ev) => ev.id === evalId) || null;
              setSelected(evalSelected);
            }}
            value={selected?.id || ''}
          >
            {evaluaciones.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.cycle} - {ev.template} (
                {new Date(ev.submitted_at).toLocaleDateString()})
              </option>
            ))}
          </select>

          {selected && (
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-medium mb-2">{selected.template}</h3>
              <p className="mb-4 text-gray-600">Ciclo: {selected.cycle}</p>
              <p className="mb-4 text-gray-600">
                Fecha: {new Date(selected.submitted_at).toLocaleDateString()}
              </p>
              <p className="text-3xl font-bold text-green-600 mb-6">
                Puntuación Global:{' '}
                {selected.score ? Number(selected.score).toFixed(1) : 'N/A'}
              </p>
              <p className="mb-4 italic">Comentarios: {selected.comments}</p>

              <h4 className="text-lg font-semibold mb-3">
                Detalle por Pregunta
              </h4>
              <ul className="list-disc pl-5">
                {selected.responses.map((resp, idx) => (
                  <li key={idx}>
                    <strong>{resp.question}:</strong> {resp.answer}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Resultados;
