import { useState, useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { SeccionCategoria } from './components/SeccionCategoria';
import { Footer } from './components/Footer';
import { GestionProductos } from './components/producto/GestionProductos';
import { obtenerProductos } from './services/productService';
import { obtenerCategorias } from './services/categoryService';

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [cartCount, setCartCount] = useState(0);
  const [vista, setVista] = useState("catalogo"); // "catalogo" | "admin"

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarProductos = () => {
    setCargando(true);
    obtenerProductos()
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarProductos();

    obtenerCategorias()
      .then((data) => {
        setCategorias(data);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
      });
  }, []);

  // Nombres de categorías reales (sin "Inicio").
  // Si el API de categorías aún no respondió, las derivamos de los productos.
  const nombresCategorias =
    categorias.length > 0
      ? categorias
          .map((c) => c.nombre || c.label)
          .filter((n) => n && n !== "Inicio")
      : [...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  // Qué secciones mostrar: en "Inicio" todas; con una categoría activa, solo esa.
  const seccionesAMostrar =
    categoriaActiva === "Inicio"
      ? nombresCategorias
      : nombresCategorias.filter(
          (n) => n.toLowerCase() === categoriaActiva.toLowerCase()
        );

  // Productos que pertenecen a una categoría dada.
  const productosDeCategoria = (nombreCat) =>
    productos.filter(
      (p) => p.categoria && p.categoria.toLowerCase() === nombreCat.toLowerCase()
    );

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <div className="app-layout">
      <Header
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={setCategoriaActiva}
        cartCount={cartCount}
        vista={vista}
        onCambiarVista={setVista}
      />

      <main className="app-container">
        {vista === "catalogo" ? (
          <>
            {/* Banner Section */}
            <Banner />

            {/* Secciones por categoría */}
            {cargando ? (
              <p className="loading-text">Cargando productos...</p>
            ) : seccionesAMostrar.length === 0 ? (
              <p className="loading-text">No hay categorías para mostrar.</p>
            ) : (
              seccionesAMostrar.map((nombreCat) => (
                <SeccionCategoria
                  key={nombreCat}
                  titulo={nombreCat}
                  productos={productosDeCategoria(nombreCat)}
                  onAddToCart={handleAddToCart}
                />
              ))
            )}
          </>
        ) : (
          /* Vista de Administración de Productos */
          <GestionProductos
            productos={productos}
            categorias={categorias}
            onActualizarProductos={cargarProductos}
            cargando={cargando}
          />
        )}
      </main>

      {/* Footer integrado directamente en App.jsx */}
      <Footer
        categorias={categorias}
        setCategoriaActiva={(cat) => {
          setCategoriaActiva(cat);
          setVista("catalogo");
        }}
      />
    </div>
  );
}

export default App;
