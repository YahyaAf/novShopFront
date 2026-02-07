const PromoTable = ({ promos, onEdit, onDelete }) => {
  const getStatusBadge = (promo) => {
    const isValid = promo.usageCount < promo.maxUsage;
    const remainingUses = promo.maxUsage - promo.usageCount;
    
    if (!isValid) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center space-x-1 w-fit">
          <span>❌</span>
          <span>Épuisé</span>
        </span>
      );
    }
    
    if (remainingUses <= 5) {
      return (
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold flex items-center space-x-1 w-fit">
          <span>⚠️</span>
          <span>Limité ({remainingUses})</span>
        </span>
      );
    }
    
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center space-x-1 w-fit">
        <span>✅</span>
        <span>Actif ({remainingUses})</span>
      </span>
    );
  };

  const getUsagePercentage = (promo) => {
    return (promo.usageCount / promo.maxUsage) * 100;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (promos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun code promo</h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par créer un nouveau code promo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilisation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progression
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {promos.map((promo) => {
            const percentage = getUsagePercentage(promo);
            const progressColor = getProgressColor(percentage);
            const remainingUses = promo.maxUsage - promo.usageCount;

            return (
              <tr key={promo.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded">
                      {promo.code}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    <span className="font-semibold">{promo.usageCount}</span> / {promo.maxUsage}
                  </div>
                  <div className="text-xs text-slate-500">
                    Reste: <span className="font-semibold">{remainingUses}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className={`${progressColor} h-2.5 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{percentage.toFixed(0)}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(promo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(promo)}
                    className="text-teal-600 hover:text-teal-900 inline-flex items-center px-3 py-1 border border-teal-300 rounded-lg hover:bg-teal-50 transition"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(promo)}
                    className="text-red-600 hover:text-red-900 inline-flex items-center px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PromoTable;
