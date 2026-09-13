const API_URL = 'https://6a9845047160beda2292d62e.mockapi.io/categorias';

export const obtenerCategorias = () => {
  return fetch(API_URL)
    .then((response) => response.json());
};
