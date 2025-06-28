import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface Answers {
  liderazgo: string;
  comunicacion: string;
  trabajoEquipo: string;
  resolucionProblemas: string;
}

const Autoevaluacion = () => {
  const [answers, setAnswers] = useState<Answers>({
    liderazgo: '',
    comunicacion: '',
    trabajoEquipo: '',
    resolucionProblemas: '',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aquí se enviaría la info a backend
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Autoevaluación</h2>
      {submitted ? (
        <div className="bg-green-100 p-4 rounded text-green-800">
          Gracias por enviar tu autoevaluación. Puedes revisarla en Historial.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: 'Liderazgo', name: 'liderazgo' },
            { label: 'Comunicación', name: 'comunicacion' },
            { label: 'Trabajo en Equipo', name: 'trabajoEquipo' },
            { label: 'Resolución de Problemas', name: 'resolucionProblemas' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block font-medium mb-1" htmlFor={name}>
                {label}
              </label>
              <textarea
                id={name}
                name={name}
                rows={3}
                required
                value={answers[name as keyof Answers]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder={`Describe tu desempeño en ${label.toLowerCase()}`}
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Enviar Autoevaluación
          </button>
        </form>
      )}
    </div>
  );
};

export default Autoevaluacion;
