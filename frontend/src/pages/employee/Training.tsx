interface Curso {
  id: number;
  titulo: string;
  progreso: number;
  estado: 'En progreso' | 'Completado' | string;
  enlace: string;
}

const cursosMock: Curso[] = [
  {
    id: 1,
    titulo: 'Comunicación Efectiva',
    progreso: 75,
    estado: 'En progreso',
    enlace: '#',
  },
  {
    id: 2,
    titulo: 'Liderazgo para Equipos',
    progreso: 100,
    estado: 'Completado',
    enlace: '#',
  },
  {
    id: 3,
    titulo: 'Resolución de Conflictos',
    progreso: 40,
    estado: 'En progreso',
    enlace: '#',
  },
];

const Capacitacion = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Capacitación</h2>
      {cursosMock.map((curso) => (
        <div key={curso.id} className="border rounded p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-2">{curso.titulo}</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="w-full bg-gray-200 rounded-full h-3 mr-4">
              <div
                className={`h-3 rounded-full ${
                  curso.progreso === 100 ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{ width: `${curso.progreso}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {curso.progreso}%
            </span>
          </div>
          <p className="mb-2">
            Estado: <span className="font-semibold">{curso.estado}</span>
          </p>
          <a
            href={curso.enlace}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Acceder al curso
          </a>
        </div>
      ))}
    </div>
  );
};

export default Capacitacion;
