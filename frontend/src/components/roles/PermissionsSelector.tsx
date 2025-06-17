import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

// Interfaz para un permiso
interface Permission {
  id: number;
  name: string;
  description?: string;
}

// Props del componente
interface PermissionsSelectorProps {
  allPermissions: Permission[];
  selectedPermissions: number[];
  onChange: (selected: number[]) => void;
}

const PermissionsSelector: React.FC<PermissionsSelectorProps> = ({
  allPermissions,
  selectedPermissions,
  onChange,
}) => {
  const handleToggle = (permId: number) => {
    if (selectedPermissions.includes(permId)) {
      onChange(selectedPermissions.filter((p) => p !== permId));
    } else {
      onChange([...selectedPermissions, permId]);
    }
  };

  // Verificar que allPermissions sea un array
  if (!Array.isArray(allPermissions)) {
    return (
      <div>
        <h4>Permisos</h4>
        <p className="text-gray-500">No se pudieron cargar los permisos</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-2 font-medium">Permisos</h4>
      {allPermissions.length === 0 ? (
        <p className="text-gray-500">No hay permisos disponibles</p>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          {allPermissions.map((perm) => (
            <FormControlLabel
              key={perm.id}
              control={
                <Checkbox
                  checked={selectedPermissions.includes(perm.id)}
                  onChange={() => handleToggle(perm.id)}
                />
              }
              label={perm.description || perm.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionsSelector;
