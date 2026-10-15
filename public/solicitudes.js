/* =========================================================
   VISOR DOCUMENTAL INTELLIALL

   SOLICITUDES.JS
   ADMINISTRADOR DE SOLICITUDES

   Bibliotecas:
   - PETS
   - FDS
   - MANUALES
========================================================= */


/* =========================================================
   01. CONFIGURACIÓN
========================================================= */

const TIPOS_DOCUMENTO = Object.freeze({

    pets: {

        nombre: "PETS",

        singular: "procedimiento",

        plural: "procedimientos",

        grupo: "Área",

        icono: "🏢"

    },

    fds: {

        nombre: "FDS",

        singular: "ficha",

        plural: "fichas",

        grupo: "Categoría",

        icono: "🧪"

    },

    manuales: {

        nombre: "MANUALES",

        singular: "manual",

        plural: "manuales",

        grupo: "Categoría",

        icono: "🔧"

    }

});


/* =========================================================
   02. ORDEN DE ÁREAS PETS
========================================================= */

const ORDEN_AREAS_PETS = [

    "C1",

    "C2",

    "HIDRO",

    "RELAVES Y AGUAS",

    "MINA",

    "CONCENTRADORA",

    "PROCESOS"

];


/* =========================================================
   03. ADMINISTRADOR DE SOLICITUDES
========================================================= */

export class SolicitudesManager {

    constructor() {

        // Documentos seleccionados.
        //
        // Map:
        // clave -> documento + cantidad

        this.seleccion = new Map();


        // Cantidad inicial de juegos.

        this.cantidadPredeterminada = 1;


        // Biblioteca inicial.

        this.bibliotecaActual = "pets";


        // Callback opcional para actualizar la interfaz.

        this.onChange = null;

    }


    /* =====================================================
       04. ESTABLECER BIBLIOTECA
    ===================================================== */

    setBiblioteca(tipo) {

        this.validarTipo(tipo);

        this.bibliotecaActual = tipo;

        this.notificarCambio();

    }


    /* =====================================================
       05. VALIDAR TIPO
    ===================================================== */

    validarTipo(tipo) {

        if (!TIPOS_DOCUMENTO[tipo]) {

            throw new Error(
                `Tipo de documento no reconocido: ${tipo}`
            );

        }

    }


    /* =====================================================
       06. VALIDAR CANTIDAD
    ===================================================== */

    validarCantidad(cantidad) {

        const numero = Number(cantidad);

        if (

            !Number.isSafeInteger(numero) ||

            numero < 1

        ) {

            throw new Error(
                "La cantidad debe ser un número entero mayor que cero"
            );

        }

        return numero;

    }


    /* =====================================================
       07. GENERAR CLAVE ÚNICA
    ===================================================== */

    generarClave(documento) {

        const tipo =
            documento.tipo || this.bibliotecaActual;

        this.validarTipo(tipo);


        const categoria =
            documento.categoria ||
            documento.area ||
            documento.requestArea ||
            "";


        const identificador =
            documento.path ||
            documento.archivo ||
            documento.id ||
            documento.nombre;


        if (!identificador) {

            throw new Error(
                "El documento no tiene un identificador válido"
            );

        }


        return JSON.stringify([

            tipo,

            categoria,

            identificador

        ]);

    }


    /* =====================================================
       08. SELECCIONAR DOCUMENTO
    ===================================================== */

    seleccionar(

        documento,

        cantidad = this.cantidadPredeterminada

    ) {

        if (!documento) {

            throw new Error(
                "Debe indicar un documento"
            );

        }


        const tipo =
            documento.tipo || this.bibliotecaActual;

        this.validarTipo(tipo);


        const juegos =
            this.validarCantidad(cantidad);


        const clave =
            this.generarClave(documento);


        // Si ya estaba seleccionado,
        // conservar su cantidad actual.

        if (this.seleccion.has(clave)) {

            return clave;

        }


        this.seleccion.set(

            clave,

            {

                ...documento,

                tipo,

                categoria:
                    documento.categoria ||
                    documento.area ||
                    documento.requestArea ||
                    "",

                cantidad: juegos

            }

        );


        this.notificarCambio();

        return clave;

    }


    /* =====================================================
       09. DESELECCIONAR DOCUMENTO
    ===================================================== */

    deseleccionar(documento) {

        const clave =
            typeof documento === "string"

                ? documento

                : this.generarClave(documento);


        const eliminado =
            this.seleccion.delete(clave);


        if (eliminado) {

            this.notificarCambio();

        }


        return eliminado;

    }


    /* =====================================================
       10. ALTERNAR SELECCIÓN
    ===================================================== */

    alternar(documento) {

        const clave =
            this.generarClave(documento);


        if (this.seleccion.has(clave)) {

            this.deseleccionar(clave);

            return false;

        }


        this.seleccionar(documento);

        return true;

    }


    /* =====================================================
       11. CONSULTAR SELECCIÓN
    ===================================================== */

    estaSeleccionado(documento) {

        const clave =
            typeof documento === "string"

                ? documento

                : this.generarClave(documento);


        return this.seleccion.has(clave);

    }


    /* =====================================================
       12. OBTENER DOCUMENTO SELECCIONADO
    ===================================================== */

    obtenerSeleccionado(documento) {

        const clave =
            typeof documento === "string"

                ? documento

                : this.generarClave(documento);


        return this.seleccion.get(clave) || null;

    }


    /* =====================================================
       13. ESTABLECER CANTIDAD INDIVIDUAL
    ===================================================== */

    establecerCantidad(documento, cantidad) {

        const clave =
            typeof documento === "string"

                ? documento

                : this.generarClave(documento);


        const seleccionado =
            this.seleccion.get(clave);


        if (!seleccionado) {

            return false;

        }


        const juegos =
            this.validarCantidad(cantidad);


        seleccionado.cantidad = juegos;


        this.notificarCambio();

        return true;

    }


    /* =====================================================
       14. INCREMENTAR CANTIDAD
    ===================================================== */

    incrementar(documento) {

        const seleccionado =
            this.obtenerSeleccionado(documento);


        if (!seleccionado) {

            return false;

        }


        return this.establecerCantidad(

            documento,

            seleccionado.cantidad + 1

        );

    }


    /* =====================================================
       15. REDUCIR CANTIDAD
    ===================================================== */

    reducir(documento) {

        const seleccionado =
            this.obtenerSeleccionado(documento);


        if (

            !seleccionado ||

            seleccionado.cantidad <= 1

        ) {

            return false;

        }


        return this.establecerCantidad(

            documento,

            seleccionado.cantidad - 1

        );

    }


    /* =====================================================
       16. APLICAR CANTIDAD GENERAL
    ===================================================== */

    aplicarCantidadGeneral(

        cantidad,

        tipo = null

    ) {

        const juegos =
            this.validarCantidad(cantidad);


        if (tipo !== null) {

            this.validarTipo(tipo);

        }


        let actualizados = 0;


        this.seleccion.forEach(documento => {

            if (

                tipo === null ||

                documento.tipo === tipo

            ) {

                documento.cantidad = juegos;

                actualizados++;

            }

        });


        if (actualizados > 0) {

            this.notificarCambio();

        }


        return actualizados;

    }


    /* =====================================================
       17. OBTENER TODOS LOS SELECCIONADOS
    ===================================================== */

    obtenerSeleccionados(tipo = null) {

        if (tipo !== null) {

            this.validarTipo(tipo);

        }


        const documentos =

            Array.from(
                this.seleccion.values()
            );


        if (tipo === null) {

            return documentos.map(
                documento => ({ ...documento })
            );

        }


        return documentos

            .filter(
                documento => documento.tipo === tipo
            )

            .map(
                documento => ({ ...documento })
            );

    }


    /* =====================================================
       18. OBTENER TOTALES
    ===================================================== */

    obtenerTotales(tipo = null) {

        const documentos =
            this.obtenerSeleccionados(tipo);


        const totalJuegos = documentos.reduce(

            (total, documento) =>

                total + documento.cantidad,

            0

        );


        return {

            documentos: documentos.length,

            juegos: totalJuegos

        };

    }


    /* =====================================================
       19. LIMPIAR SELECCIÓN
    ===================================================== */

    limpiar(tipo = null) {

        if (tipo === null) {

            this.seleccion.clear();

        }

        else {

            this.validarTipo(tipo);


            for (

                const [clave, documento]

                of this.seleccion

            ) {

                if (documento.tipo === tipo) {

                    this.seleccion.delete(clave);

                }

            }

        }


        this.notificarCambio();

    }


    /* =====================================================
       20. ORDENAR DOCUMENTOS
    ===================================================== */

    ordenarDocumentos(documentos, tipo) {

        return [...documentos].sort((a, b) => {


            // PETS: ordenar por número.

            if (tipo === "pets") {

                const numeroA =
                    Number(
                        a.codigo?.match(/\d+/)?.[0] ||
                        a.nombre?.match(/^\d+/)?.[0] ||
                        0
                    );


                const numeroB =
                    Number(
                        b.codigo?.match(/\d+/)?.[0] ||
                        b.nombre?.match(/^\d+/)?.[0] ||
                        0
                    );


                return numeroA - numeroB;

            }


            // FDS y Manuales: ordenar por nombre.

            return String(a.nombre || "")

                .localeCompare(

                    String(b.nombre || ""),

                    "es",

                    { numeric: true }

                );

        });

    }


    /* =====================================================
       21. OBTENER VERSIÓN DEL PET
    ===================================================== */

    obtenerVersion(documento) {

        if (documento.version) {

            return documento.version;

        }


        const path =

            documento.path ||

            documento.archivo ||

            documento.archivos?.[documento.categoria] ||

            "";


        const coincidencia =

            path.match(

                /(?:VER(?:SI[OÓ]N)?|V)[\s._-]*(\d{1,2})/i

            );


        return coincidencia

            ? coincidencia[1].padStart(2, "0")

            : "";

    }


    /* =====================================================
       22. OBTENER CÓDIGO DEL PET
    ===================================================== */

    obtenerCodigoPET(documento) {

        if (documento.codigo) {

            return documento.codigo;

        }


        const numero =
            documento.nombre
                ?.match(/^\d+/)?.[0];


        if (numero) {

            return `PET ${numero.padStart(3, "0")}`;

        }


        return documento.nombre || "PET";

    }


    /* =====================================================
       23. OBTENER TÍTULO DEL PET
    ===================================================== */

    obtenerTituloPET(documento) {

        return (

            documento.titulo ||

            documento.nombre
                ?.replace(/^\d+[-\s]*/, "")
                .trim() ||

            "Sin título"

        );

    }


    /* =====================================================
       24. ORDENAR CATEGORÍAS
    ===================================================== */

    ordenarCategorias(categorias, tipo) {

        return [...categorias].sort((a, b) => {


            if (tipo === "pets") {

                const indiceA =
                    ORDEN_AREAS_PETS.indexOf(a);


                const indiceB =
                    ORDEN_AREAS_PETS.indexOf(b);


                if (indiceA !== -1 && indiceB !== -1) {

                    return indiceA - indiceB;

                }


                if (indiceA !== -1) {

                    return -1;

                }


                if (indiceB !== -1) {

                    return 1;

                }

            }


            return a.localeCompare(

                b,

                "es",

                { numeric: true }

            );

        });

    }


    /* =====================================================
       25. GENERAR MENSAJE POR BIBLIOTECA
    ===================================================== */

    generarTexto(tipo = this.bibliotecaActual) {

        this.validarTipo(tipo);


        const documentos =
            this.obtenerSeleccionados(tipo);


        if (!documentos.length) {

            return "";

        }


        const configuracion =
            TIPOS_DOCUMENTO[tipo];


        const agrupados = new Map();


        // Agrupar por área o categoría.

        documentos.forEach(documento => {

            const categoria =
                documento.categoria || "Sin categoría";


            if (!agrupados.has(categoria)) {

                agrupados.set(categoria, []);

            }


            agrupados.get(categoria)
                .push(documento);

        });


        const lines = [];


        /* -----------------------------------------
           ENCABEZADO
        ----------------------------------------- */

        lines.push(

            `📋 SOLICITUD DE ${configuracion.nombre}`

        );

        lines.push("");


        /* -----------------------------------------
           CATEGORÍAS
        ----------------------------------------- */

        const categorias =

            this.ordenarCategorias(

                [...agrupados.keys()],

                tipo

            );


        categorias.forEach(categoria => {


            lines.push(

                `${configuracion.icono} ${configuracion.grupo}: ${categoria}`

            );

            lines.push("");


            const elementos =

                this.ordenarDocumentos(

                    agrupados.get(categoria),

                    tipo

                );


            elementos.forEach(documento => {


                /* ---------------------------------
                   PETS
                --------------------------------- */

                if (tipo === "pets") {

                    const codigo =
                        this.obtenerCodigoPET(documento);


                    const version =
                        this.obtenerVersion(documento);


                    const titulo =
                        this.obtenerTituloPET(documento);


                    lines.push(

                        `📄 ${codigo}${version ? ` · VER. ${version}` : ""}`

                    );


                    lines.push(

                        `   ${titulo}`

                    );

                }


                /* ---------------------------------
                   FDS
                --------------------------------- */

                else if (tipo === "fds") {

                    // Identificador de la ficha.
                    const codigo = String(
                        documento.codigo ||
                        documento.id ||
                        "FDS"
                    ).replace(/^FDS-/i, "FDS ");

                    // Mostrar la versión solo si está registrada.
                    const version = documento.version
                        ? ` · VER. ${documento.version}`
                        : "";

                    // Código y versión.
                    lines.push(
                        `📄 ${codigo}${version}`
                    );

                    // Nombre completo de la ficha.
                    lines.push(
                        `   ${documento.nombre}`
                    );

                    // Fabricante, cuando esté registrado.
                    if (documento.fabricante) {

                        lines.push(
                            `   Fabricante: ${documento.fabricante}`
                        );

                    }

                }


                /* ---------------------------------
                   MANUALES
                --------------------------------- */

                else if (tipo === "manuales") {

                    // Identificador del manual.
                    const codigo = String(
                        documento.codigo ||
                        documento.id ||
                        "MAN"
                    ).replace(/^MAN-/i, "MAN ");

                    // Versión, cuando esté registrada.
                    const version = documento.version
                        ? ` · VER. ${documento.version}`
                        : "";

                    // Código y versión.
                    lines.push(
                        `📄 ${codigo}${version}`
                    );

                    // Nombre completo del manual.
                    lines.push(
                        `   ${documento.nombre}`
                    );

                    // Marca, cuando esté registrada.
                    if (documento.marca) {

                        lines.push(
                            `   Marca: ${documento.marca}`
                        );

                    }

                    // Modelo, cuando esté registrado.
                    if (documento.modelo) {

                        lines.push(
                            `   Modelo: ${documento.modelo}`
                        );

                    }

                }


                /* ---------------------------------
                   CANTIDAD
                --------------------------------- */

                const juegos =
                    documento.cantidad;


                lines.push(

                    `   📦 Cantidad: ${juegos} ${juegos === 1 ? "juego" : "juegos"}`

                );


                lines.push("");

            });

        });


        /* -----------------------------------------
           TOTALES
        ----------------------------------------- */

        const totales =
            this.obtenerTotales(tipo);


        const descripcion =

            totales.documentos === 1

                ? configuracion.singular

                : configuracion.plural;


        lines.push(

            `📌 Total: ${totales.documentos} ${descripcion}`

        );


        lines.push(

            `📦 Total de juegos: ${totales.juegos}`

        );


        return lines.join("\n");

    }


    /* =====================================================
       26. COPIAR AL PORTAPAPELES
    ===================================================== */

    async copiarTexto(texto) {

        if (!texto) {

            return false;

        }


        // Método principal.

        if (

            navigator.clipboard &&

            window.isSecureContext

        ) {

            try {

                await navigator.clipboard.writeText(texto);

                return true;

            }

            catch (error) {

                console.warn(

                    "Clipboard API no disponible:",

                    error

                );

            }

        }


        // Método alternativo.

        const textarea =
            document.createElement("textarea");


        textarea.value = texto;

        textarea.style.position = "fixed";

        textarea.style.left = "-9999px";

        textarea.style.top = "0";


        document.body.appendChild(textarea);


        textarea.focus();

        textarea.select();


        let copiado = false;


        try {

            copiado =
                document.execCommand("copy");

        }

        catch (error) {

            console.error(

                "Error al copiar la solicitud:",

                error

            );

        }


        textarea.remove();


        return copiado;

    }


    /* =====================================================
       27. COPIAR SOLICITUD
    ===================================================== */

    async copiarSolicitud(

        tipo = this.bibliotecaActual

    ) {

        const texto =
            this.generarTexto(tipo);


        if (!texto) {

            return false;

        }


        const copiado =
            await this.copiarTexto(texto);


        // No limpiar aquí la selección.
        //
        // sidebar.js se encargará de limpiar
        // y cerrar el panel después de confirmar
        // que el texto se copió correctamente.

        return copiado;

    }


    /* =====================================================
       28. REGISTRAR CAMBIOS
    ===================================================== */

    setOnChange(callback) {

        this.onChange =

            typeof callback === "function"

                ? callback

                : null;

    }


    /* =====================================================
       29. NOTIFICAR CAMBIOS
    ===================================================== */

    notificarCambio() {

        if (!this.onChange) {

            return;

        }


        this.onChange({

            tipo: this.bibliotecaActual,

            seleccionados:
                this.obtenerSeleccionados(),

            totales:
                this.obtenerTotales()

        });

    }

}