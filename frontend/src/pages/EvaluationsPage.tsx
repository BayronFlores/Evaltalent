import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvaluations } from '../redux/slices/evaluationSlice';
import type { RootState, AppDispatch } from '../redux/store';
import type { UserWithPermissions } from '../types/UserType';

const EvaluationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { evaluations, loading, error } = useSelector(
    (state: RootState) => state.evaluation,
  );
  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as UserWithPermissions | null;

  useEffect(() => {
    dispatch(fetchEvaluations());
  }, [dispatch]);

  const permissions = user?.rol?.permissions ?? [];
  const canCreate = permissions.includes('create_evaluations');
  const canEdit = permissions.includes('edit_evaluations');
  const canDelete = permissions.includes('delete_evaluations');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Evaluaciones</h1>
      {loading && <p>Cargando evaluaciones...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {canCreate && (
        <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded">
          Crear Evaluación
        </button>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Título</th>
            <th className="border border-gray-300 p-2">Evaluador</th>
            <th className="border border-gray-300 p-2">Evaluado</th>
            <th className="border border-gray-300 p-2">Ciclo</th>
            <th className="border border-gray-300 p-2">Plantilla</th>
            <th className="border border-gray-300 p-2">Estado</th>
            <th className="border border-gray-300 p-2">Puntaje</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evalItem) => (
            <tr key={evalItem.id}>
              <td className="border border-gray-300 p-2">{evalItem.title}</td>
              <td className="border border-gray-300 p-2">
                {evalItem.evaluatorName}
              </td>
              <td className="border border-gray-300 p-2">
                {evalItem.evaluateeName}
              </td>
              <td className="border border-gray-300 p-2">
                {evalItem.cycleName}
              </td>
              <td className="border border-gray-300 p-2">
                {evalItem.templateName}
              </td>
              <td className="border border-gray-300 p-2">{evalItem.status}</td>
              <td className="border border-gray-300 p-2">
                {evalItem.score ?? '-'}
              </td>
              <td className="border border-gray-300 p-2">
                {canEdit && (
                  <button className="mr-2 px-2 py-1 bg-blue-600 text-white rounded">
                    Editar
                  </button>
                )}
                {canDelete && (
                  <button className="px-2 py-1 bg-red-600 text-white rounded">
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
          {evaluations.length === 0 && !loading && (
            <tr>
              <td colSpan={8} className="text-center p-4">
                No hay evaluaciones para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EvaluationsPage;
