import { useState } from 'react';
import { useUsers, useUserMutations } from '../../hooks/useUsers';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserTable from '../../components/users/UserTable';
import UserFormModal from '../../components/users/UserFormModal';
import DeleteModal from '../../components/common/DeleteModal';

const UsersPage = () => {
  const { users, loading, error, refetch } = useUsers();
  const { deleteUser, activateUser, loading: mutationLoading } = useUserMutations();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteType, setDeleteType] = useState('soft');
  const [deleteError, setDeleteError] = useState(null);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleDelete = (user, hard = false) => {
    setSelectedUser(user);
    setDeleteType(hard ? 'hard' : 'soft');
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      setDeleteError(null);
      const result = await deleteUser(selectedUser.id, deleteType === 'hard');
      if (result.success) {
        setIsDeleteModalOpen(false);
        refetch();
      } else {
        setDeleteError(result.error);
      }
    }
  };

  const handleActivate = async (userId) => {
    const result = await activateUser(userId);
    if (result.success) {
      refetch();
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    refetch();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 shadow-md hover:scale-[1.02] transition-all flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <UserTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onActivate={handleActivate}
      />

      {isFormModalOpen && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          title={deleteType === 'hard' ? 'Supprimer définitivement' : 'Désactiver l\'utilisateur'}
          message={
            deleteType === 'hard'
              ? `Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur "${selectedUser?.username}" ? Cette action est irréversible.`
              : `Êtes-vous sûr de vouloir désactiver l'utilisateur "${selectedUser?.username}" ?`
          }
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteError(null);
            setIsDeleteModalOpen(false);
          }}
          isDangerous={deleteType === 'hard'}
          error={deleteError}
          loading={mutationLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default UsersPage;
