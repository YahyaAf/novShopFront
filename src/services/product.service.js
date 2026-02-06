import api from '../config/api.config';

const productService = {
  async create(productData) {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  async getAll(params = {}) {
    const response = await api.get('/api/products/all');
    
    let products = response.data?.data || [];
    
    const { 
      nom, 
      minPrice, 
      maxPrice, 
      inStock, 
      page = 0, 
      size = 10, 
      sortBy = 'nom', 
      sortDir = 'asc' 
    } = params;

    if (nom) {
      products = products.filter(p => 
        p.nom.toLowerCase().includes(nom.toLowerCase())
      );
    }
    
    if (minPrice !== undefined && minPrice !== '') {
      products = products.filter(p => p.prixUnitaire >= parseFloat(minPrice));
    }
    
    if (maxPrice !== undefined && maxPrice !== '') {
      products = products.filter(p => p.prixUnitaire <= parseFloat(maxPrice));
    }
    
    if (inStock !== undefined && inStock !== '') {
      const stockFilter = inStock === 'true' || inStock === true;
      products = products.filter(p => stockFilter ? p.stock > 0 : p.stock === 0);
    }

    products.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortDir === 'desc' ? -comparison : comparison;
    });

    const totalElements = products.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      data: {
        content: paginatedProducts,
        number: page,
        size: size,
        totalElements: totalElements,
        totalPages: totalPages
      }
    };
  },

  async getById(id) {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  async update(id, productData) {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  async softDelete(id) {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  }
};

export default productService;
