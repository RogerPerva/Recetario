// No es necesario de una API KEY 
function iniciarApp(){

    obtenerCategorias();

    function obtenerCategorias(){
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        fetch(url)   // => Llamado hacia una url
            .then(respuesta => {  ///Entonces ¿que? 
                return respuesta.json() //obtenemos respuesta de tipo json
            })
            .then(resultado =>{
                console.log(resultado) // entonces... imprimimos los resultados en consola
            })
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp);
