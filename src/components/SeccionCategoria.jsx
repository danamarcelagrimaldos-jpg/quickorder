import { Product } from './Product';

/**
 * Renderiza una categoría como una sección independiente:
 * un encabezado con el nombre de la categoría y su conteo,
 * seguido de la cuadrícula con los productos de esa categoría.
 */
export function SeccionCategoria({ titulo, productos = [], onAddToCart }) {
  return (
    <section className="categoria-seccion">
      <div className="catalog-header">
        <div>
          <h2 className="catalog-title">{titulo}</h2>
          <p className="catalog-count">{productos.length} producto(s) disponibles</p>
        </div>
      </div>

      {productos.length === 0 ? (
        <p className="loading-text">No hay productos en esta categoría.</p>
      ) : (
        <div className="product-grid">
          {productos.map((producto) => (
            <Product
              key={producto.id}
              indice={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              precio={producto.precio}
              imagen={producto.imagen}
              tag={producto.tag}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
