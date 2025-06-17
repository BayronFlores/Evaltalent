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
  selectedPermissions: number[]; // IDs seleccionados
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

  return (
    <div>
      <h4>Permisos</h4>
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
  );
};

export default PermissionsSelector;
