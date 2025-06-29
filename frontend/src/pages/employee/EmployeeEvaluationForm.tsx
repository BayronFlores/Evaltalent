import React, { useState } from 'react';

type Question = {
  question: string;
  type: 'yesno' | 'text' | 'rating';
};

type Evaluation = {
  id: number;
  title: string;
  objective?: string;
  due_date?: string;
  templateQuestions: Question[];
  responses: { [key: string]: any };
};

type Props = {
  evaluation: Evaluation;
  onSaveProgress: (responses: any) => void;
  onSubmit: (responses: any) => void;
  onCancel: () => void;
};

const EmployeeEvaluationForm: React.FC<Props> = ({
  evaluation,
  onSaveProgress,
  onSubmit,
  onCancel,
}) => {
  const [responses, setResponses] = useState<{ [key: string]: any }>(
    evaluation.responses || {},
  );
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (question: string, value: any) => {
    setResponses((prev) => ({ ...prev, [question]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('responses', JSON.stringify(responses));
    if (file) {
      formData.append('file', file);
    }
    return formData;
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      const formData = createFormData();
      await onSaveProgress(formData);
      alert('Progreso guardado');
    } catch (error) {
      alert('Error guardando progreso');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = createFormData();
      await onSubmit(formData);
      alert('Evaluación enviada');
    } catch (error) {
      alert('Error enviando evaluación');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">{evaluation.title}</h2>
      {evaluation.objective && (
        <p className="mb-2">
          <strong>Objetivo:</strong> {evaluation.objective}
        </p>
      )}
      {evaluation.due_date && (
        <p className="mb-4">
          <strong>Fecha límite:</strong>{' '}
          {new Date(evaluation.due_date).toLocaleDateString()}
        </p>
      )}

      <form>
        {evaluation.templateQuestions.map((q, idx) => (
          <div key={idx} className="mb-4">
            <label className="block font-semibold mb-1">{q.question}</label>
            {q.type === 'yesno' && (
              <select
                value={responses[q.question] || ''}
                onChange={(e) => handleChange(q.question, e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Seleccione</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            )}
            {q.type === 'text' && (
              <textarea
                value={responses[q.question] || ''}
                onChange={(e) => handleChange(q.question, e.target.value)}
                className="border p-2 rounded w-full"
                rows={3}
              />
            )}
            {q.type === 'rating' && (
              <input
                type="number"
                min={1}
                max={5}
                value={responses[q.question] || ''}
                onChange={(e) => handleChange(q.question, e.target.value)}
                className="border p-2 rounded w-full"
              />
            )}
          </div>
        ))}

        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Subir evidencia (opcional)
          </label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleSaveProgress}
            disabled={saving}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            {saving ? 'Guardando...' : 'Guardar Progreso'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {submitting ? 'Enviando...' : 'Enviar Evaluación'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeEvaluationForm;
