import { useEffect, useState } from 'react';
import { courseService } from '../../services/courseService'; // Ajusta ruta según tu estructura
import type { Curso } from '../../services/courseService'; // Ajusta ruta según tu estructura

const Training = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService
      .getCourses()
      .then((data) => {
        setCursos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Capacitación</h2>
      {cursos.map((curso) => (
        <div key={curso.id} className="border rounded p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-2">{curso.title}</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="w-full bg-gray-200 rounded-full h-3 mr-4">
              <div
                className={`h-3 rounded-full ${
                  curso.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{ width: `${curso.progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {curso.progress}%
            </span>
          </div>
          <p className="mb-2">
            Estado: <span className="font-semibold">{curso.status}</span>
          </p>
          <a
            href={curso.link}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Access course
          </a>
        </div>
      ))}
    </div>
  );
};

export default Training;
