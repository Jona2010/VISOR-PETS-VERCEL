/* =========================================================
   VISOR DOCUMENTAL INTELLIALL

   DOCUMENTOS.JS
   ADMINISTRADOR DE BIBLIOTECAS

   Bibliotecas:
   - PETS
   - FDS
   - MANUALES
========================================================= */


/* =========================================================
   01. CONFIGURACIÓN DE BIBLIOTECAS
========================================================= */

const BIBLIOTECAS = Object.freeze({

    pets: {

        id: "pets",

        nombre: "PETS",

        titulo: "Procedimientos de Trabajo",

        catalogo: "./config.json",

        bucket: "pets"

    },

    fds: {

        id: "fds",

        nombre: "FDS",

        titulo: "Fichas de Datos de Seguridad",

        catalogo: "./fds.json",

        bucket: "fds"

    },

    manuales: {

        id: "manuales",

        nombre: "Manuales",

        titulo: "Manuales Técnicos",

        catalogo: "./manuales.json",

        bucket: "manuales"

    }

});


/* =========================================================
   02. ADMINISTRADOR DE DOCUMENTOS
========================================================= */

export class DocumentosManager {

    constructor() {

        // PETS será la biblioteca inicial.

        this.bibliotecaActual = "pets";


        // Catálogos almacenados en memoria.

        this.catalogos = new Map();


        // Evita cargar simultáneamente
        // el mismo archivo JSON.

        this.cargasPendientes = new Map();

    }


    /* =====================================================
       03. OBTENER UNA BIBLIOTECA
    ===================================================== */

    getBiblioteca(id = this.bibliotecaActual) {

        const biblioteca = BIBLIOTECAS[id];

        if (!biblioteca) {

            throw new Error(
                `Biblioteca no reconocida: ${id}`
            );

        }

        return biblioteca;

    }


    /* =====================================================
       04. OBTENER TODAS LAS BIBLIOTECAS
    ===================================================== */

    getBibliotecas() {

        return Object.values(BIBLIOTECAS);

    }


    /* =====================================================
       05. OBTENER BIBLIOTECA ACTUAL
    ===================================================== */

    getBibliotecaActual() {

        return this.getBiblioteca();

    }


    /* =====================================================
       06. CARGAR CATÁLOGO
    ===================================================== */

    async cargarCatalogo(
        id = this.bibliotecaActual
    ) {

        const biblioteca =
            this.getBiblioteca(id);


        // Reutilizar el catálogo si ya fue cargado.

        if (this.catalogos.has(id)) {

            return this.catalogos.get(id);

        }


        // Reutilizar una carga que esté en curso.

        if (this.cargasPendientes.has(id)) {

            return this.cargasPendientes.get(id);

        }


        const carga = (async () => {

            const respuesta = await fetch(
                biblioteca.catalogo
            );

            if (!respuesta.ok) {

                throw new Error(
                    `No se pudo cargar ${biblioteca.catalogo}`
                );

            }

            const catalogo =
                await respuesta.json();


            // Comprobar la estructura.

            this.validarCatalogo(
                id,
                catalogo
            );


            // Guardar en memoria.

            this.catalogos.set(
                id,
                catalogo
            );

            return catalogo;

        })();


        this.cargasPendientes.set(
            id,
            carga
        );


        try {

            return await carga;

        }

        finally {

            this.cargasPendientes.delete(id);

        }

    }


    /* =====================================================
       07. VALIDAR CATÁLOGO
    ===================================================== */

    validarCatalogo(id, catalogo) {

        if (

            !catalogo ||

            typeof catalogo !== "object" ||

            Array.isArray(catalogo)

        ) {

            throw new Error(
                `El catálogo ${id} no es válido`
            );

        }


        // Conservar la estructura actual de config.json.

        if (id === "pets") {

            if (!Array.isArray(catalogo.pets)) {

                throw new Error(
                    "config.json no contiene un listado válido de PETS"
                );

            }

            return;

        }


        // Estructura de FDS y Manuales.

        if (!Array.isArray(catalogo.documentos)) {

            throw new Error(
                `El catálogo ${id} no contiene un listado válido de documentos`
            );

        }


        // Verificar que el bucket sea correcto.

        if (

            catalogo.bucket !==

            this.getBiblioteca(id).bucket

        ) {

            throw new Error(
                `El bucket de ${id} no coincide con la configuración`
            );

        }

        /* =====================================================
            VALIDAR DOCUMENTOS INDIVIDUALES
        ===================================================== */

        const identificadores = new Set();

        catalogo.documentos.forEach((documento, indice) => {

            if (
                !documento ||
                typeof documento !== "object" ||
                Array.isArray(documento)
            ) {

                throw new Error(
                    `Documento inválido en la posición ${indice + 1}`
                );

            }

            const camposObligatorios = [
                "id",
                "nombre",
                "archivo"
            ];

            camposObligatorios.forEach(campo => {

                if (
                    typeof documento[campo] !== "string" ||
                    !documento[campo].trim()
                ) {

                    throw new Error(
                        `${id}: el documento ${indice + 1} no tiene ${campo}`
                    );

                }

            });

            if (identificadores.has(documento.id)) {

                throw new Error(
                    `${id}: identificador duplicado ${documento.id}`
                );

            }

            identificadores.add(documento.id);

        });

    }


    /* =====================================================
       08. CAMBIAR BIBLIOTECA
    ===================================================== */

    async cambiarBiblioteca(id) {

        // Verificar que exista.

        this.getBiblioteca(id);


        // Cargar los documentos antes del cambio.

        await this.cargarCatalogo(id);


        // Actualizar biblioteca activa.

        this.bibliotecaActual = id;

        return this.getBibliotecaActual();

    }


    /* =====================================================
       09. OBTENER BUCKET
    ===================================================== */

    getBucket(
        id = this.bibliotecaActual
    ) {

        return this.getBiblioteca(id).bucket;

    }


    /* =====================================================
       10. OBTENER DOCUMENTOS
    ===================================================== */

    async getDocumentos(
        id = this.bibliotecaActual
    ) {

        const catalogo =
            await this.cargarCatalogo(id);


        // PETS conserva su estructura original
        // y se normaliza solo cuando sea necesario.

        if (id === "pets") {

            return this.normalizarPETS(
                catalogo.pets
            );

        }


        // FDS y Manuales utilizan el mismo
        // formato general de documentos.

        return catalogo.documentos.map(

            documento => ({

                ...documento,

                tipo: id,

                bucket: this.getBucket(id),

                path: documento.archivo

            })

        );

    }


    /* =====================================================
       11. NORMALIZAR PETS
    ===================================================== */

    normalizarPETS(pets) {

        const documentos = [];


        for (const pet of pets) {

            const coincidencia =
                pet.nombre.match(/^(\d+)/);


            const numero = coincidencia

                ? coincidencia[1].padStart(3, "0")

                : "000";


            const nombre = pet.nombre;

            const archivos =
                pet.archivos || {};


            // Un PET puede estar disponible
            // en más de un área.

            for (

                const [area, path]

                of Object.entries(archivos)

            ) {

                documentos.push({

                    id: `PET-${numero}-${area}`,

                    codigo: `PET ${numero}`,

                    nombre,

                    tipo: "pets",

                    categoria: area,

                    area,

                    bucket: "pets",

                    path,

                    version: this.extraerVersion(
                        path
                    )

                });

            }

        }

        return documentos;

    }


    /* =====================================================
       12. EXTRAER VERSIÓN
    ===================================================== */

    extraerVersion(path = "") {

        const archivo =
            path.split("/").pop() || "";


        const coincidencia = archivo.match(

            /(?:VER(?:SI[OÓ]N)?|V)[\s._-]*(\d{1,2})/i

        );


        return coincidencia

            ? coincidencia[1].padStart(2, "0")

            : null;

    }


    /* =====================================================
       13. OBTENER CATEGORÍAS
    ===================================================== */

    async getCategorias(
        id = this.bibliotecaActual
    ) {

        const documentos =
            await this.getDocumentos(id);


        const categorias = documentos

            .map(documento => documento.categoria)

            .filter(Boolean);


        return [...new Set(categorias)].sort(

            (a, b) =>

                a.localeCompare(

                    b,

                    "es",

                    { numeric: true }

                )

        );

    }


    /* =====================================================
       14. BUSCAR DOCUMENTOS
    ===================================================== */

    async buscarDocumentos(

        texto = "",

        categoria = null,

        id = this.bibliotecaActual

    ) {

        const documentos =
            await this.getDocumentos(id);


        const consulta =
            this.normalizarTexto(texto);


        return documentos.filter(documento => {


            // Filtro por categoría.

            if (

                categoria &&

                categoria !== "TODOS" &&

                documento.categoria !== categoria

            ) {

                return false;

            }


            // Sin texto: devolver los documentos
            // de la categoría seleccionada.

            if (!consulta) {

                return true;

            }


            const contenido = [

                documento.id,

                documento.codigo,

                documento.nombre,

                documento.categoria,

                documento.fabricante,

                documento.presentacion,

                documento.codigoProducto,

                documento.marca,

                documento.modelo

            ]

                .filter(Boolean)

                .join(" ");


            return this.normalizarTexto(

                contenido

            ).includes(consulta);

        });

    }


    /* =====================================================
       15. NORMALIZAR TEXTO
    ===================================================== */

    normalizarTexto(texto = "") {

        return String(texto)

            .normalize("NFD")

            .replace(/[\u0300-\u036f]/g, "")

            .toLowerCase()

            .trim();

    }


    /* =====================================================
       16. IDENTIFICADOR DE CACHÉ
    ===================================================== */

    getCacheKey(documento) {

        if (

            !documento?.bucket ||

            !documento?.path

        ) {

            throw new Error(
                "El documento no tiene bucket o ruta"
            );

        }


        return JSON.stringify([

            documento.bucket,

            documento.path

        ]);

    }


    /* =====================================================
       17. LIMPIAR CATÁLOGOS EN MEMORIA
    ===================================================== */

    limpiarCatalogos(id = null) {

        if (id) {

            this.catalogos.delete(id);

            return;

        }

        this.catalogos.clear();

    }

}