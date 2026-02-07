import { useState } from 'react';
import { usePromos, usePromoMutations } from '../../hooks/usePromos';
import DashboardLayout from '../../layouts/DashboardLayout';
import PromoTable from '../../components/promos/PromoTable';
import PromoFormModal from '../../components/promos/PromoFormModal';
import DeleteModal from '../../components/common/DeleteModal';

const PromosPage = () => {
  const { promos, loading, error, refetch } = usePromos();
  const { deletePromo } = usePromoMutations();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const handleCreate = () => {
    setSelectedPromo(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setIsFormModalOpen(true);
  };

  const handleDelete = (promo) => {
    setSelectedPromo(promo);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPromo) return;

    const result = await deletePromo(selectedPromo.id);
    if (result.success) {
      setIsDeleteModalOpen(false);
      refetch();
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    refetch();
  };

  const getStats = () => {
    const totalPromos = promos.length;
    const activePromos = promos.filter(p => p.usageCount < p.maxUsage).length;
    const exhaustedPromos = promos.filter(p => p.usageCount >= p.maxUsage).length;
    const totalUsage = promos.reduce((sum, p) => sum + p.usageCount, 0);
    const totalCapacity = promos.reduce((sum, p) => sum + p.maxUsage, 0);

    return { totalPromos, activePromos, exhaustedPromos, totalUsage, totalCapacity };
  };

  const stats = getStats();

  if (loading && promos.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Codes Promo</h1>
          <p className="text-gray-600 mt-1">Créez et gérez vos codes promotionnels</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouveau Code Promo</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Codes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPromos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.activePromos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Épuisés</p>
              <p className="text-2xl font-bold text-red-600">{stats.exhaustedPromos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilisations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p>
              <p className="text-xs text-gray-500">/ {stats.totalCapacity}</p>
            </div>
          </div>
        </div>
      </div>

      <PromoTable
        promos={promos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormModalOpen && (
        <PromoFormModal
          promo={selectedPromo}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          title="Supprimer le code promo"
          message={`Êtes-vous sûr de vouloir supprimer le code "${selectedPromo?.code}" ? Cette action est irréversible.`}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isDangerous={true}
        />
      )}
    </DashboardLayout>
  );
};

export default PromosPage;
