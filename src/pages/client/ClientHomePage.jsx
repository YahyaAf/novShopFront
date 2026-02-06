const ClientHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">SmartShop</h1>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Accueil</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Produits</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</a>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Connexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">Bienvenue sur SmartShop</h1>
            <p className="text-xl mb-8">Découvrez nos produits exceptionnels</p>
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition">
              Découvrir
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Produits populaires</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Produit {item}</h3>
                  <p className="text-gray-600 mb-4">Description du produit {item}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">99.99 €</span>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientHomePage;
