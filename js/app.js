// No es necesario de una API KEY

function iniciarApp() {
  const selectCategorias = document.querySelector("#categorias");
  selectCategorias.addEventListener("change", seleccionarCategoria);

  obtenerCategorias();

  function obtenerCategorias() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    fetch(url) // => Llamado hacia una url
      .then((respuesta) => {
        ///Entonces ¿que?
        return respuesta.json(); //obtenemos respuesta de tipo json
      })
      .then((resultado) => {
        console.log(resultado.categories); // entonces... imprimimos los resultados en consola
        mostrarCategorias(resultado.categories);
      });
  }

  function mostrarCategorias(categorias = []) {
    categorias.forEach((categoria) => {
      const { strCategory } = categoria;
      const option = document.createElement("OPTION");
      option.value = strCategory;
      option.textContent = strCategory;
      selectCategorias.appendChild(option);
    });
  }

  function seleccionarCategoria(e) {
    const categoria = e.target.value;
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

    fetch(url)
        .then(respuesta => respuesta.json())
            .then(resultado=>{console.log(resultado)});
  }
}

document.addEventListener("DOMContentLoaded", iniciarApp);
