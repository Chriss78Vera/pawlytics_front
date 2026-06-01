import { useEffect, useState } from 'react';
import userOptions from '@/app/assets/data/userOptions.json';
import { buildVeterinarianUserDataPayload, buildVeterinarianUserPayload, canToggleUser } from '@/app/functions/userUtils.js';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';

export function useUsersManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(userOptions.initialVeterinarianForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await pawlyticsApi.getUsers();
      setUsers(Array.isArray(response) ? response : []);
    } catch {
      setUsers([]);
      setMessage('No se pudieron cargar los usuarios.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carga el listado inicial para administracion de usuarios.
  useEffect(() => {
    loadUsers();
  }, []);

  const updateForm = (field, value) => {
    setMessage('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createVeterinarian = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const userData = await pawlyticsApi.createUserData(buildVeterinarianUserDataPayload(form));
      await pawlyticsApi.createUser(buildVeterinarianUserPayload(form, userData.id));

      setForm(userOptions.initialVeterinarianForm);
      setMessage('Veterinario creado correctamente.');
      loadUsers();
    } catch {
      setMessage('No se pudo crear el veterinario. Revisa los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (user) => {
    if (!canToggleUser(user)) {
      setMessage('Solo se puede activar o desactivar clientes y veterinarios.');
      return;
    }

    try {
      const updated = await pawlyticsApi.updateUser(user.id, { active: !user.active });
      setUsers((current) => current.map((item) => item.id === user.id ? updated : item));
    } catch {
      setMessage('No se pudo actualizar el estado del usuario.');
    }
  };

  return {
    users,
    form,
    updateForm,
    isLoading,
    isSubmitting,
    message,
    loadUsers,
    createVeterinarian,
    toggleActive,
  };
}
