// No es necesario de una API KEY

function iniciarApp() {
  const selectCategorias = document.querySelector("#categorias");

  if(selectCategorias){
    selectCategorias.addEventListener("change", seleccionarCategoria);
    obtenerCategorias();

  }

  //Pestaña favoritos

  const resultado = document.querySelector("#resultado");
  const modal = new bootstrap.Modal("#modal", {});

  const favoritosDiv = document.querySelector('.favoritos');
  if(favoritosDiv){
    obtenerFavoritos();
  }

  //globalizando
  const modalFooter = document.querySelector(".modal-footer");
  const btnFavorito = document.createElement("BUTTON");
  const btnCerrar = document.createElement("BUTTON");

  ///// test
  // const btnBorrar = document.querySelector('.btnBorrar');
  // btnBorrar.addEventListener("click", borrarFav);

  // function borrarFav() {
  //   const approve = confirm("¿Estas seguro que quieres borrar tus recetas?");

  //   if (approve) {
  //     localStorage.clear();
  //     //location.reload();
  //   }
  // }
  ///// test


  function obtenerCategorias() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    fetch(url) // => Llamado hacia una url
      .then((respuesta) => {
        ///Entonces ¿que?
        return respuesta.json(); //obtenemos respuesta de tipo json
      })
      .then((resultado) => {
        //console.log(resultado.categories); // entonces... imprimimos los resultados en consola
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

    limpiarHTML(resultado);

    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((resultado) => mostrarRecetas(resultado.meals));
  }

  function mostrarToast(mensaje) {
    const toastDiv = document.querySelector("#toast");
    const toastBody = document.querySelector(".toast-body");
    const toast = new bootstrap.Toast(toastDiv);
    toastBody.textContent = mensaje;

    toast.show();
  }

  function limpiarHTML(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }

  function mostrarRecetas(recetas = []) {
    const heading = document.createElement("H2");
    heading.classList.add("text-center", "text-black", "my-5");
    heading.textContent = recetas.length ? "Resultados" : "No hay resultados";
    resultado.appendChild(heading);

    // Iterar en los resultados
    recetas.forEach((receta) => {
      const { idMeal, strMeal, strMealThumb } = receta;

      const recetaContenedor = document.createElement("DIV");
      recetaContenedor.classList.add("col-md-4");

      const recetaCard = document.createElement("DIV");
      recetaCard.classList.add("card", "mb-4");

      const recetaImagen = document.createElement("IMG");
      recetaImagen.classList.add("card-img-top");
      recetaImagen.alt = `Imagen de la receta ${strMeal ?? receta.title}`;
      recetaImagen.src = strMealThumb ?? receta.img;

      const recetaCardBody = document.createElement("DIV");
      recetaCardBody.classList.add("card-body");

      const recetaHeading = document.createElement("H3");
      recetaHeading.classList.add("card-title", "mb-3", "mx-auto");
      recetaHeading.textContent = strMeal ?? receta.title;

      const recetaButton = document.createElement("BUTTON");
      recetaButton.classList.add("btn", "btn-danger", "w-100");
      recetaButton.textContent = "Ver Receta";

      recetaButton.onclick = function () {
        seleccionarReceta(idMeal ?? receta.id);
      };

      //Inyectar en el codigo HTML
      recetaCardBody.appendChild(recetaHeading);
      recetaCardBody.appendChild(recetaButton);

      recetaCard.appendChild(recetaImagen);
      recetaCard.appendChild(recetaCardBody);

      recetaContenedor.appendChild(recetaCard);
      resultado.appendChild(recetaContenedor);
    });
  }

  function seleccionarReceta(id) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    fetch(url).then((respuesta) => {
      setTimeout(() => {
        respuesta
          .json()
          .then((resultado) => mostrarRecetaModal(resultado.meals[0]));
      }, 500);
    });
  }

  function mostrarRecetaModal(receta) {
    // console.log(receta);
    const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

    const modalTitle = document.querySelector(".modal .modal-title");
    const modalBody = document.querySelector(".modal .modal-body");

    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
      <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}">
      <h3 class="my-3" > Instructions </h3>
      <p>${strInstructions}</p>
      <h3 class="my-3" > Ingredients and measures</h3>
    `;
    //Mostrar cantidades e ingredientes
    const listGroup = document.createElement("UL");
    listGroup.classList.add("list-group");
    for (let i = 1; i <= 20; i++) {
      if (receta[`strIngredient${i}`] && receta[`strMeasure${i}`]) {
        // console.log(receta[`strIngredient${i}`]);
        //  modalBody.innerHTML += `
        //   <li> ${receta[`strIngredient${i}`]} - ${receta[`strMeasure${i}`]} </li>
        //  `
        const ingrediente = receta[`strIngredient${i}`];
        const cantidad = receta[`strMeasure${i}`];

        const ingredienteLi = document.createElement("LI");
        ingredienteLi.classList.add("list-group-item");
        ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

        listGroup.appendChild(ingredienteLi);
      }
      modalBody.appendChild(listGroup);
    }

    //botones de cerrar y favorito

    btnFavorito.classList.add("btn", "btn-danger", "col");
    btnFavorito.textContent = existeStorage(idMeal)
      ? "Eliminar Favorito"
      : "Guardar favorito";

    // LocalStorage
    btnFavorito.onclick = function () {

      if (existeStorage(idMeal)) {
        //If item already exist in favorites, button has to change to delete from favorites.
        borrarUnFavorito(idMeal);
        mostrarToast('Eliminado correctamente'); 

        btnFavorito.textContent='Guardar Favorito'
        return;
      }
      // btnFavorito.nextElementSibling.remove();
      agregarFavorito({
        id: idMeal,
        title: strMeal,
        img: strMealThumb,
      });
      btnFavorito.textContent='Eliminar favorito';
      mostrarToast('Agregado correctamente');  // Adding Toast with bootstrap.
    };

    btnCerrar.classList.add("btn", "btn-secondary", "col");
    btnCerrar.addEventListener("click", () => {
      modal.hide();
    });

    btnCerrar.textContent = "Cerrar";

    limpiarHTML(modalFooter);
    modalFooter.appendChild(btnFavorito);
    modalFooter.appendChild(btnCerrar);

    //muestra el modal
    modal.show();
  }

  function agregarFavorito(receta) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? []; //Get favoritos from locat storage converted already in an object with JSON.parse

    localStorage.setItem("favoritos", JSON.stringify([...favoritos, receta]));
  }

  function borrarUnFavorito(id) {
    // const parentNode = btnCerrar.parentNode;
    // const btnBorrarFav = document.createElement("BUTTON");
    // btnBorrarFav.classList.add("btnbtn", "btn-danger", "col", "btn");
    // btnBorrarFav.textContent = "Eliminar Favorito";
    // btnFavorito.textContent = 'Eliminar Favorito';
    // //modalFooter.removeChild(btnFavorito);
    // // modalFooter.nextElementSibling.nextElementSibling.nextElementSibling.remove(); btnBorrarFav?.remove() || modalFooter.appendChild(btnBorrarFav);

    // // Verificar si ya existe un botón de borrar en el modal
    // const existingBtn = modalFooter.querySelector(".btnbtn");
    // if (existingBtn) {
    //   btnFavorito.remove();
    //   existingBtn.remove(); // Si existe, elimínalo
    // } else {
    //   parentNode.insertBefore(btnBorrarFav, btnCerrar);
    //   //modalFooter.appendChild(btnBorrarFav); // Si no existe, agrégalo
    //   btnFavorito.remove();
    // }

    // btnBorrarFav.onclick = function () {
      const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
      const nuevaLista = favoritos.filter((receta) => receta.id !== id); // si el elemento existe se cambia el texto del boton a eliminar de favoritos.
      localStorage.setItem("favoritos", JSON.stringify(nuevaLista));

    

    //   parentNode.insertBefore(btnFavorito, btnCerrar);

    //   //modalFooter.appendChild(btnFavorito);
    //   btnBorrarFav.remove();
    // };
  }

  function existeStorage(id) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    return favoritos.some((favorito) => favorito.id === id); // return true or false depending on if item exist or not

    // if (!existe) {
    //   return true;
    //   localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));
    // }
  }


  function obtenerFavoritos(){
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    if(favoritos.length ){
      mostrarRecetas(favoritos);
return;
    }else{

      const noFavoritos = document.createElement('P');
      noFavoritos.textContent = 'no hay favoritos';
      noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');

      resultado.appendChild(noFavoritos);
    }
  }
}





document.addEventListener("DOMContentLoaded", iniciarApp);
