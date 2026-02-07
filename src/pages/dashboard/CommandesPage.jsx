import { useState } from 'react';
import { useCommandes, useCommandeMutations } from '../../hooks/useCommandes';
import DashboardLayout from '../../layouts/DashboardLayout';
import CommandeTable from '../../components/commandes/CommandeTable';
import CommandeFormModal from '../../components/commandes/CommandeFormModal';
import CommandeDetailsModal from '../../components/commandes/CommandeDetailsModal';
import DeleteModal from '../../components/common/DeleteModal';

const CommandesPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { commandes, loading, error, refetch } = useCommandes({ status: statusFilter || undefined });
  const { confirmCommande, cancelCommande } = useCommandeMutations();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);

  const handleCreate = () => {
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (commande) => {
    setSelectedCommande(commande);
    setIsDetailsModalOpen(true);
  };

  const handleConfirm = async (commande) => {
    if (window.confirm(`Confirmer la commande ${commande.numeroCommande} ?`)) {
      const result = await confirmCommande(commande.id);
      if (result.success) {
        refetch();
      }
    }
  };

  const handleCancelClick = (commande) => {
    setSelectedCommande(commande);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedCommande) return;

    const result = await cancelCommande(selectedCommande.id);
    if (result.success) {
      setIsCancelModalOpen(false);
      refetch();
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    refetch();
  };

  const getStats = () => {
    const totalCommandes = commandes.length;
    const pending = commandes.filter(c => c.statut === 'PENDING').length;
    const confirmed = commandes.filter(c => c.statut === 'CONFIRMED').length;
    const canceled = commandes.filter(c => c.statut === 'CANCELED').length;
    const rejected = commandes.filter(c => c.statut === 'REJECTED').length;
    const totalRevenue = commandes
      .filter(c => c.statut === 'CONFIRMED')
      .reduce((sum, c) => sum + c.totalTTC, 0);

    return { totalCommandes, pending, confirmed, canceled, rejected, totalRevenue };
  };

  const stats = getStats();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  if (loading && commandes.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-1">Suivez et gérez toutes vos commandes</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouvelle Commande</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCommandes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmées</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gray-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Annulées</p>
              <p className="text-2xl font-bold text-gray-600">{stats.canceled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenu</p>
              <p className="text-lg font-bold text-purple-600">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrer par statut:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tous</option>
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmées</option>
            <option value="CANCELED">Annulées</option>
            <option value="REJECTED">Rejetées</option>
          </select>
          {statusFilter && (
            <button
              onClick={() => setStatusFilter('')}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      <CommandeTable
        commandes={commandes}
        onViewDetails={handleViewDetails}
        onConfirm={handleConfirm}
        onCancel={handleCancelClick}
      />

      {isFormModalOpen && (
        <CommandeFormModal
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {isDetailsModalOpen && (
        <CommandeDetailsModal
          commande={selectedCommande}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {isCancelModalOpen && (
        <DeleteModal
          title="Annuler la commande"
          message={`Êtes-vous sûr de vouloir annuler la commande "${selectedCommande?.numeroCommande}" ? Le stock des produits sera restitué.`}
          onConfirm={confirmCancel}
          onCancel={() => setIsCancelModalOpen(false)}
          isDangerous={true}
        />
      )}
    </DashboardLayout>
  );
};

export default CommandesPage;
