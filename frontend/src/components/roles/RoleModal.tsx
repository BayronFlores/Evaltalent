import React, { useEffect, useState } from 'react';
import { Modal, Button, TextField } from '@mui/material';
import PermissionsSelector from './PermissionsSelector';
import {
  createRole,
  updateRole,
  getPermissions,
  getRolePermissions,
} from '../../services/roleService';
import type { Role } from '../../types/UserType';

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  onSaved: () => void;
}

const RoleModal: React.FC<RoleModalProps> = ({
  open,
  onClose,
  role,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<number[]>([]);
  const [allPermissions, setAllPermissions] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    fetchPermissions();
    if (role) {
      setName(role.name);
      setDescription(role.description);
      getRolePermissions(role.id).then(
        (perms: { id: number; name: string }[]) =>
          setPermissions(perms.map((p) => p.id)),
      );
    } else {
      setName('');
      setDescription('');
      setPermissions([]);
    }
  }, [role]);

  const fetchPermissions = async () => {
    const perms = await getPermissions();
    setAllPermissions(perms);
  };

  const handleSave = async () => {
    const data = { name, description, permissions };
    if (role) {
      await updateRole(role.id, data);
    } else {
      await createRole(data);
    }
    onSaved();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4">
          <h3 className="text-xl font-semibold mb-4">
            {role ? 'Editar Rol' : 'Crear Rol'}
          </h3>
          <div className="space-y-4">
            <TextField
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
            <PermissionsSelector
              allPermissions={allPermissions}
              selectedPermissions={permissions}
              onChange={setPermissions}
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RoleModal;
