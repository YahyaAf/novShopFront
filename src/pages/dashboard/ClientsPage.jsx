import { useState } from 'react';
import { useClients, useClientMutations } from '../../hooks/useClients';
import DashboardLayout from '../../layouts/DashboardLayout';
import ClientTable from '../../components/clients/ClientTable';
import ClientFormModal from '../../components/clients/ClientFormModal';
import DeleteModal from '../../components/common/DeleteModal';

const ClientsPage = () => {
  const { clients, loading, error, refetch } = useClients();
  const { deleteClient } = useClientMutations();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteType, setDeleteType] = useState('soft');

  const handleCreate = () => {
    setSelectedClient(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsFormModalOpen(true);
  };

  const handleDelete = (client, hard = false) => {
    setSelectedClient(client);
    setDeleteType(hard ? 'hard' : 'soft');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;

    const result = await deleteClient(selectedClient.id, deleteType === 'hard');
    if (result.success) {
      setIsDeleteModalOpen(false);
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600 mt-1">Gérez les clients et leurs informations</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouveau Client</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-700">
            <strong>Total clients:</strong> {clients.length}
          </p>
        </div>
      </div>

      <ClientTable
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormModalOpen && (
        <ClientFormModal
          client={selectedClient}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          title={deleteType === 'hard' ? 'Supprimer définitivement' : 'Désactiver le client'}
          message={
            deleteType === 'hard'
              ? `Êtes-vous sûr de vouloir supprimer définitivement le client "${selectedClient?.username}" ? Cette action est irréversible.`
              : `Êtes-vous sûr de vouloir désactiver le client "${selectedClient?.username}" ? L'utilisateur associé sera également désactivé.`
          }
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isDangerous={deleteType === 'hard'}
        />
      )}
    </DashboardLayout>
  );
};

export default ClientsPage;
