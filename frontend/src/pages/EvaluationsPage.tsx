import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvaluations } from '../redux/slices/evaluationSlice';
import type { Evaluation } from '../redux/slices/evaluationSlice';
import type { RootState, AppDispatch } from '../redux/store';
import type { UserWithPermissions } from '../types/UserType';
import EmployeeEvaluationForm from './employee/EmployeeEvaluationForm';
import { evaluationService } from '../services/evaluationService';

const EvaluationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { evaluations, loading, error } = useSelector(
    (state: RootState) => state.evaluation,
  );
  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as UserWithPermissions | null;

  const role =
    typeof user?.role === 'string' ? user.role : user?.role?.name ?? '';

  const [selectedEvaluation, setSelectedEvaluation] =
    useState<Evaluation | null>(null);

  useEffect(() => {
    dispatch(fetchEvaluations());
  }, [dispatch]);

  const saveProgress = async (responses: any) => {
    if (!selectedEvaluation) return;
    try {
      await evaluationService.saveProgress(
        String(selectedEvaluation.id),
        responses,
      );
    } catch (error) {
      console.error(error);
      alert('Error guardando progreso');
    }
  };

  const submitEvaluation = async (responses: any) => {
    if (!selectedEvaluation) return;
    try {
      await evaluationService.submitEvaluation(
        String(selectedEvaluation.id),
        responses,
      );
      setSelectedEvaluation(null);
      dispatch(fetchEvaluations());
    } catch (error) {
      console.error(error);
      alert('Error enviando evaluación');
    }
  };

  const getTitleByRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Todas las Evaluaciones';
      case 'manager':
        return 'Evaluaciones de Mi Equipo';
      case 'employee':
        return 'Mis Evaluaciones';
      default:
        return 'Evaluaciones';
    }
  };

  // Filtrar evaluaciones según rol
  // Filtrar evaluaciones según rol
  const filteredEvaluations = evaluations.filter((evalItem) => {
    if (role === 'admin') return true;
    if (role === 'manager') return true;
    if (role === 'employee') {
      console.log('Checking evaluation:', evalItem);
      console.log('User ID:', user?.id);
      return String(evalItem.evaluateeId) === String(user?.id);
    }
    return false;
  });

  if (role === 'employee' && selectedEvaluation) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedEvaluation(null)}
          className="mb-4 px-4 py-2 bg-gray-300 rounded"
        >
          Volver a Evaluaciones
        </button>
        <EmployeeEvaluationForm
          evaluation={{
            id: selectedEvaluation.id,
            title: selectedEvaluation.title,
            objective: selectedEvaluation.objective,
            due_date: selectedEvaluation.dueDate,
            templateQuestions: selectedEvaluation.templateQuestions,
            responses: selectedEvaluation.responses,
          }}
          onSaveProgress={saveProgress}
          onSubmit={submitEvaluation}
          onCancel={() => setSelectedEvaluation(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{getTitleByRole(role)}</h1>
      {loading && <p>Cargando evaluaciones...</p>}
      {!loading && error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && filteredEvaluations.length === 0 && (
        <p>No hay evaluaciones para mostrar.</p>
      )}
      {!loading && !error && filteredEvaluations.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Título</th>
              {(role === 'admin' || role === 'manager') && (
                <th className="border border-gray-300 p-2">Evaluador</th>
              )}
              <th className="border border-gray-300 p-2">Evaluado</th>
              <th className="border border-gray-300 p-2">Ciclo</th>
              <th className="border border-gray-300 p-2">Plantilla</th>
              <th className="border border-gray-300 p-2">Estado</th>
              <th className="border border-gray-300 p-2">Fecha Límite</th>
              {role === 'employee' && (
                <th className="border border-gray-300 p-2">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.map((evalItem) => (
              <tr key={evalItem.id}>
                <td className="border border-gray-300 p-2">{evalItem.title}</td>
                {(role === 'admin' || role === 'manager') && (
                  <td className="border border-gray-300 p-2">
                    {evalItem.evaluatorName}
                  </td>
                )}
                <td className="border border-gray-300 p-2">
                  {evalItem.evaluateeName}
                </td>
                <td className="border border-gray-300 p-2">
                  {evalItem.cycleName}
                </td>
                <td className="border border-gray-300 p-2">
                  {evalItem.templateName}
                </td>
                <td className="border border-gray-300 p-2">
                  {evalItem.status}
                </td>
                <td className="border border-gray-300 p-2">
                  {evalItem.dueDate
                    ? new Date(evalItem.dueDate).toLocaleDateString()
                    : '-'}
                </td>
                {role === 'employee' && (
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => setSelectedEvaluation(evalItem)}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Completar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EvaluationsPage;
