import { SolicitudesManager } from "./solicitudes.js";

// ==========================================
// SIDEBAR V2
// CONFIGURACIÓN DE ÁREAS
// ==========================================

const AREA_CONFIG = [

    {
        id: "TODOS",
        nombre: "Todos",
        color: "#00A88F",
        icon: "todos.png"
    },

    {
        id: "C1",
        nombre: "C1",
        color: "#0F766E",
        icon: "c1.png"
    },

    {
        id: "C2",
        nombre: "C2",
        color: "#0EA5A4",
        icon: "c2.png"
    },

    {
        id: "HIDRO",
        nombre: "Hidro",
        color: "#0284C7",
        icon: "hidro.png"
    },

    {
        id: "RELAVES Y AGUAS",
        nombre: "Relaves y Aguas",
        color: "#0891B2",
        icon: "relaves.png"
    },

    {
        id: "MINA",
        nombre: "Mina",
        color: "#B45309",
        icon: "mina.png"
    },

    {
        id: "CONCENTRADORA",
        nombre: "Concentradora",
        color: "#CA8A04",
        icon: "concentradora.png"
    },

    /*{
        id: "MANTENIMIENTO MINA",
        nombre: "Mantenimiento Mina",
        color: "#64748B",
        icon: "mantenimiento-mina.png"
    },*/

    {
        id: "PROCESOS",
        nombre: "Procesos",
        color: "#7C3AED",
        icon: "procesos.png"
    },

    /*{
        id: "PLANTAS-PLAN OPIMIZADO",
        nombre: "Plantas Plan Optimizado",
        color: "#16A34A",
        icon: "plan.png"
    },

    {
        id: "MANTENIMIENTO ELECTRICO MINA",
        nombre: "Mantenimiento Eléctrico Mina",
        color: "#EAB308",
        icon: "electrico.png"
    }*/

    /*{
        id: "MANTENIMIENTO ELECTRICO MINA",
        nombre: "Mantenimiento Eléctrico Mina",
        color: "#EAB308",
        icon: "electrico.png"
    }*/

];


/* =====================================================
   CONFIGURACIÓN DE ICONOS FDS
===================================================== */

const FDS_CATEGORY_ICONS = {

    "adhesivos y selladores":
        "adhesivos-selladores.png",

    "cementos y materiales minerales":
        "cementos-minerales.png",

    "combustibles y gases":
        "combustibles-gases.png",

    "lubricantes y grasas":
        "lubricantes-grasas.png",

    "otros productos":
        "otros-productos.png",

    "pendiente de clasificacion":
        "pendiente-clasificacion.png",

    "pinturas y recubrimientos":
        "pinturas-recubrimientos.png",

    "productos para procesos industriales":
        "procesos-industriales.png",

    "reactivos y soluciones de calibracion":
        "reactivos-calibracion.png",

    "soldadura y materiales de union":
        "soldadura-union.png",

    "solventes y limpiadores":
        "solventes-limpiadores.png"

};

/* =====================================================
   COLORES DE LAS CATEGORÍAS FDS
===================================================== */

const FDS_CATEGORY_COLORS = {

    "adhesivos y selladores": {
        color: "#0D9488",
        fondo: "#E0F2EF"
    },

    "cementos y materiales minerales": {
        color: "#92704B",
        fondo: "#F4EDE3"
    },

    "combustibles y gases": {
        color: "#DC554C",
        fondo: "#FCEAE7"
    },

    "lubricantes y grasas": {
        color: "#C58B23",
        fondo: "#FFF4DE"
    },

    "otros productos": {
        color: "#64748B",
        fondo: "#EDF1F5"
    },

    "pendiente de clasificacion": {
        color: "#D49A21",
        fondo: "#FFF4D9"
    },

    "pinturas y recubrimientos": {
        color: "#8B5CF6",
        fondo: "#F1EAFE"
    },

    "productos para procesos industriales": {
        color: "#4876A8",
        fondo: "#E8F0F9"
    },

    "reactivos y soluciones de calibracion": {
        color: "#0891B2",
        fondo: "#E2F5F9"
    },

    "soldadura y materiales de union": {
        color: "#C66B35",
        fondo: "#FFF0E4"
    },

    "solventes y limpiadores": {
        color: "#549B65",
        fondo: "#EAF6E9"
    }

};

/* =====================================================
   CONFIGURACIÓN DE ICONOS MANUALES
===================================================== */

const MANUALES_CATEGORY_ICONS = {

    "accesorios y componentes automotrices":
        "accesorios-automotrices.png",

    "amoladoras":
        "amoladoras.png",

    "aspiradoras y equipos de limpieza":
        "aspiradoras-limpieza.png",

    "atornilladores y herramientas de perforacion":
        "atornilladores-perforacion.png",

    "baterias y cargadores":
        "baterias-cargadores.png",

    "generadores y grupos electrogenos":
        "generadores-electrogenos.png",

    "herramientas hidraulicas y neumaticas":
        "hidraulicas-neumaticas.png",

    "instrumentos de medicion y nivelacion":
        "medicion-nivelacion.png",

    "luminarias y equipos de iluminacion":
        "luminarias-iluminacion.png",

    "pistolas de calor":
        "pistolas-calor.png",

    "plataformas y maquinaria de elevacion":
        "plataformas-elevacion.png",

    "soldadura y equipos de union":
        "soldadura-equipos-union.png",

    "sopladores":
        "sopladores.png",

    "taladros y rotomartillos":
        "taladros-rotomartillos.png"

};


/* =====================================================
   COLORES DE LAS CATEGORÍAS MANUALES
===================================================== */

const MANUALES_CATEGORY_COLORS = {

    "accesorios y componentes automotrices": {
        color: "#2563EB",
        fondo: "#E8F0FE"
    },

    "amoladoras": {
        color: "#D97706",
        fondo: "#FFF1DD"
    },

    "aspiradoras y equipos de limpieza": {
        color: "#0F766E",
        fondo: "#E4F5F2"
    },

    "atornilladores y herramientas de perforacion": {
        color: "#7C3AED",
        fondo: "#F1EAFE"
    },

    "baterias y cargadores": {
        color: "#CA8A04",
        fondo: "#FFF6D8"
    },

    "generadores y grupos electrogenos": {
        color: "#DC2626",
        fondo: "#FDE8E8"
    },

    "herramientas hidraulicas y neumaticas": {
        color: "#0369A1",
        fondo: "#E5F3FA"
    },

    "instrumentos de medicion y nivelacion": {
        color: "#0891B2",
        fondo: "#E2F5F9"
    },

    "luminarias y equipos de iluminacion": {
        color: "#EAB308",
        fondo: "#FFF9D9"
    },

    "pistolas de calor": {
        color: "#EA580C",
        fondo: "#FFF0E7"
    },

    "plataformas y maquinaria de elevacion": {
        color: "#16A34A",
        fondo: "#E8F7EC"
    },

    "soldadura y equipos de union": {
        color: "#BE123C",
        fondo: "#FCE7ED"
    },

    "sopladores": {
        color: "#0284C7",
        fondo: "#E5F4FB"
    },

    "taladros y rotomartillos": {
        color: "#6D28D9",
        fondo: "#EEE8FC"
    }

};

export class Sidebar {

    constructor({

        config,

        onOpenPDF,

        onTaskSelected = null,

        onSearchRequested = null,

        documentosManager = null,

        onBibliotecaChange = null

    }) {

        this.config = config;

        this.onOpenPDF = onOpenPDF;

        // Administrador de las tres bibliotecas.
        this.documentosManager = documentosManager;

        // PETS permanece como biblioteca inicial.
        this.bibliotecaActual = "pets";

        // Categoría seleccionada en FDS o Manuales.
        this.categoriaActual = null;

        // Documentos de la biblioteca activa.
        this.documentosActuales = [];

        // Callback hacia App
        this.onTaskSelected = onTaskSelected;

        // Callback hacia App para iniciar la búsqueda
        this.onSearchRequested = onSearchRequested;

        // Callback para actualizar el visor
        // cuando se cambia de biblioteca.
        this.onBibliotecaChange = onBibliotecaChange;

        this.petsList    = document.getElementById("petsList");
        this.searchInput = document.getElementById("searchInput");
        this.searchClear = document.getElementById("searchClear");
        this.areaFilters = document.getElementById("areaFilters");
        this.petsCounter = document.getElementById("petsCounter");

        // ==========================================
        // ELEMENTOS DEL SIDEBAR
        // ==========================================

        this.currentAreaName =
            document.getElementById("currentAreaName");

        this.changeAreaBtn =
            document.getElementById("changeAreaBtn");

        // ==========================================
        // BUSCADOR DE TAREAS
        // ==========================================

        this.searchTaskBtn =
            document.getElementById("searchTaskBtn");

        this.taskSearchInput =
            document.getElementById("taskSearchInput");
        
        // ==========================================
        // PANEL DE SOLICITUD DE PROCEDIMIENTOS
        // ==========================================

        this.requestBtn =
            document.getElementById("requestBtn");

        this.requestPanel =
            document.getElementById("requestPanel");

        this.requestAreaSelect =
            document.getElementById("requestAreaSelect");

        this.requestPetsList =
            document.getElementById("requestPetsList");

        this.requestCounter =
            document.getElementById("requestCounter");

        this.requestTitle =
            document.getElementById("requestTitle");

        this.requestAreaLabel =
            document.getElementById("requestAreaLabel");

        this.requestGamesCounter =
            document.getElementById("requestGamesCounter");

        this.requestGeneralQuantity =
            document.getElementById("requestGeneralQuantity");

        this.requestApplyQuantity =
            document.getElementById("requestApplyQuantity");

        this.copyRequestBtn =
            document.getElementById("copyRequestBtn");

        this.clearRequestBtn =
            document.getElementById("clearRequestBtn");

        this.closeRequestPanelBtn =
            document.getElementById("closeRequestPanel");

        this.requestSearch =
            document.getElementById("requestSearch");

        this.requestSelectAll =
            document.getElementById("requestSelectAll");

        // ==========================================
        // VISTAS DE SOLICITUD
        // ==========================================

        this.requestAreaContainer =
            document.getElementById("requestAreaContainer");

        this.requestTools =
            document.getElementById("requestTools");

        this.requestViewAll =
            document.getElementById("requestViewAll");

        this.requestViewSelected =
            document.getElementById("requestViewSelected");

        this.requestSelectedBadge =
            document.getElementById("requestSelectedBadge");

        // Vista inicial del panel.
        this.requestView = "todos";

        this.cards            = [];
        this.activeCard       = null;
        this.activeButton     = null;
        this.activeAreaLabel  = null;
        this.searchTimeout    = null;

        // ==========================================
        // SIDEBAR V2
        // ==========================================

        this.viewMode = "areas";

        this.currentArea = "TODOS";

        this.areaCards = [];

        this.filteredPets = [];

        // ==========================================
        // SIDEBAR V4
        // ÁRBOL DEL PROCEDIMIENTO
        // ==========================================

        // Árbol generado por PDFViewer
        this.taskTree = [];

        // Paso actualmente visible
        this.currentTask = null;

        // Nodo actualmente resaltado
        this.activeTaskNode = null;

        // Paso seleccionado por el usuario
        this.selectedTask = null;

        // Referencias a los nodos renderizados
        this.taskNodes = new Map();

        // Nodos expandidos
        this.expandedTasks = new Set();

        // Texto del buscador interno
        this.taskSearch = "";

        // Contenedor donde posteriormente
        // se dibujará el árbol
        this.taskContainer = null;

        // Panel del índice jerárquico
        this.taskPanel = null;

        // ==========================================
        // SEARCH SIDEBAR ENGINE
        // ==========================================

        // Árbol recibido desde PDFViewer
        this.searchTree = [];

        // ViewModel recibido
        this.searchTreeView = [];

        // Vista plana
        this.searchTreeFlat = [];

        // Nodos visibles
        this.visibleSearchNodes = [];

        // Nodo activo
        this.activeSearchNode = null;

        // Nodo seleccionado
        this.selectedSearchNode = null;

        // Índice rápido
        this.searchNodeIndex = new Map();

        // Elementos HTML renderizados
        this.searchNodeElements = new Map();

        this.searchTreeVersion = 0;

        this.lastRenderedVersion = -1;

        this.lastSearchTreeData = null;

        // Cache del árbol renderizado

        this.renderedSearchNodes = new Map();

        // Cache de elementos reutilizables

        this.searchNodeCache = new Map();

        // Nodo raíz renderizado

        this.searchTreeFragment = null;

        // Solicitud de render pendiente

        this.renderPending = false;

        // Navegación por teclado

        this.keyboardNavigationEnabled = true;

        this.focusedSearchNode = null;

        this.keyboardNavigationLocked = false;

        // ==========================================
        // SEARCHTREE UX
        // ==========================================

        this.enableAnimations = true;

        this.animationDuration = 180;

        this.focusVisible = true;

        this.hoverNode = null;

        // Estado del buscador
        this.searchSidebarVisible = false;

        // Texto del filtro
        this.searchTreeFilter = "";

        // Panel SearchTree
        this.searchTreePanel = null;

        // Contenedor
        this.searchTreeContainer = null;

        // Listener PDFViewer
        this.pdfViewer = null;

        // ==========================================
        // SOLICITUDES DE LAS TRES BIBLIOTECAS
        // ==========================================

        this.requestArea = "C1";

        this.requestVisible = false;

        // Administrador único de solicitudes.
        this.solicitudes = new SolicitudesManager();

        // Actualizar los contadores cuando cambie
        // una selección o su cantidad.
        this.solicitudes.setOnChange(() => {

            this.updateRequestCounter();

        });

        // ==========================================
        // TOAST
        // ==========================================

        this.toast =

            document.getElementById(

                "toast"

            );

        this.toastMessage =

            document.getElementById(

                "toastMessage"

            );

        this.toastTimer = null;

        this.initialize();
    }

    initialize() {

        // Renderizado inicial de PETS.
        this.render();

        // Buscador actual.
        this.initializeSearch();

        // Paneles del explorador.
        this.initializeTaskPanel();

        this.initializeSearchTreePanel();


        /* =====================================================
        SELECTOR DE BIBLIOTECAS
        ===================================================== */

        this.bibliotecaBtns = [

            ...document.querySelectorAll(
                ".biblioteca-btn"
            )

        ];

        this.bibliotecaBtns.forEach(btn => {

            btn.addEventListener("click", async () => {

                const tipo =
                    btn.dataset.biblioteca;

                if (
                    !tipo ||
                    tipo === this.bibliotecaActual
                ) {
                    return;
                }

                // Evitar cambios simultáneos.
                this.bibliotecaBtns.forEach(boton => {

                    boton.disabled = true;

                });

                try {

                    await this.setBiblioteca(tipo);

                    // Actualizar el botón seleccionado.
                    this.bibliotecaBtns.forEach(boton => {

                        const activo =
                            boton.dataset.biblioteca === tipo;

                        boton.classList.toggle(
                            "active",
                            activo
                        );

                        boton.setAttribute(
                            "aria-pressed",
                            String(activo)
                        );

                    });

                } catch (error) {

                    console.error(
                        "Error al cambiar de biblioteca:",
                        error
                    );

                    this.showToast(
                        "No se pudo cargar la biblioteca.",
                        "error"
                    );

                } finally {

                    this.bibliotecaBtns.forEach(boton => {

                        boton.disabled = false;

                    });

                }

            });

        });

        this.requestBtn?.addEventListener(

            "click",

            ()=>{

                this.openRequestPanel();

            }

        );

        this.closeRequestPanelBtn?.addEventListener(
            "click",
            () => {
                this.closeRequestPanel();
            }
        );

        this.clearRequestBtn?.addEventListener(

            "click",

            ()=>{

                this.clearRequest();

            }

        );

        this.copyRequestBtn?.addEventListener(

            "click",

            ()=>{

                this.copyRequest();

            }

        );

        this.requestSearch?.addEventListener(

            "input",

            ()=>{

                this.renderRequestPets();

            }

        );

        // ==========================================
        // CAMBIO DE VISTA DE SOLICITUD
        // ==========================================

        this.requestViewAll?.addEventListener(
            "click",
            () => {
                this.setRequestView("todos");
            }
        );

        this.requestViewSelected?.addEventListener(
            "click",
            () => {
                this.setRequestView("seleccionados");
            }
        );

        this.requestSelectAll?.addEventListener(

            "change",

            ()=>{

                this.toggleAllRequestPets();

            }

        );

        // ==========================================
        // CAMBIO DE ÁREA EN SOLICITUD
        // ==========================================

        this.requestAreaSelect?.addEventListener(

            "change",

            () => {

                this.requestArea =
                    this.requestAreaSelect.value;

                if(this.requestSearch){

                    this.requestSearch.value = "";

                }

                this.renderRequestPets();

            }

        );

        // ==========================================
        // APLICAR CANTIDAD GENERAL
        // ==========================================

        this.requestApplyQuantity?.addEventListener(
            "click",
            () => {

                const cantidad = Number(
                    this.requestGeneralQuantity?.value
                );

                try {

                    const actualizados =
                        this.solicitudes.aplicarCantidadGeneral(
                            cantidad,
                            this.bibliotecaActual
                        );

                    if (actualizados === 0) {

                        this.showToast(
                            "Selecciona al menos un documento.",
                            "warning"
                        );

                        return;

                    }

                    this.renderRequestPets();

                    this.showToast(
                        "Cantidad aplicada correctamente."
                    );

                } catch (error) {

                    this.showToast(
                        "Ingresa una cantidad válida.",
                        "warning"
                    );

                }

            }
        );

        // ==========================================
        // RESTAURAR ÚLTIMA ÁREA
        // ==========================================

        const lastArea = localStorage.getItem("lastArea");

        if (
            lastArea &&
            AREA_CONFIG.some(area => area.id === lastArea)
        ) {

            this.currentArea = lastArea;

            const areaConfig = AREA_CONFIG.find(
                area => area.id === lastArea
            );

            if (this.currentAreaName) {

                this.currentAreaName.textContent =
                    areaConfig?.nombre ?? "Todos";

            }

        }

        this.updateCounter();


        //this.restoreLastSelection();

        // ==========================================
        // BOTÓN CAMBIAR ÁREA
        // ==========================================

        this.changeAreaBtn?.addEventListener(

            "click",

            () => {

                if (this.bibliotecaActual === "pets") {

                    this.showAreas();

                } else {

                    this.volverCategoriasDocumentales();

                }

            }

        );

        // ==========================================
        // BOTÓN BUSCAR
        // ==========================================

        this.searchTaskBtn?.addEventListener(

            "click",

            ()=>{

                this.requestTaskSearch();

            }

        );

        this.taskSearchInput?.addEventListener(

            "keydown",

            event=>{

                if(event.key==="Enter"){

                    this.requestTaskSearch();

                }

            }

        );
       
        // Ocultar los filtros de área
        if (this.areaFilters) {
            this.areaFilters.style.display = "none";
        }
    }

    // ==========================================
    // SIDEBAR V2
    // RENDER PRINCIPAL
    // ==========================================

    // ==========================================
    // SIDEBAR V2
    // RENDER PRINCIPAL
    // ==========================================

    render() {

        this.petsList.style.opacity = "0";

        requestAnimationFrame(() => {

            this.petsList.innerHTML = "";

            // Mantener la navegación original de PETS.
            if (this.bibliotecaActual === "pets") {

                if (this.viewMode === "areas") {

                    this.renderAreas();

                } else {

                    this.renderPets();

                }

            }

            // Navegación de FDS y Manuales.
            else {

                if (this.viewMode === "areas") {

                    this.renderCategoriasDocumentales();

                } else {

                    this.renderDocumentos();

                }

            }

            requestAnimationFrame(() => {

                this.petsList.style.opacity = "1";

            });

        });

    }

    // ==========================================
    // SIDEBAR V4
    // RECIBIR EL ÁRBOL DEL PDF
    // ==========================================

    setTaskTree(tree = []) {

        this.taskTree =

            Array.isArray(tree)

                ? tree

                : [];

        this.currentTask = null;

        this.selectedTask = null;

        this.taskNodes.clear();

        this.expandedTasks.clear();

        if (this.taskTree.length) {

            this.expandRootTasks();

            this.renderTaskTree();

            this.showTaskPanel();

        } else {

            this.clearTaskTreeView();

            this.hideTaskPanel();

        }

    }

    // ==========================================
    // INICIAR BÚSQUEDA
    // ==========================================

    requestTaskSearch(){

        if(!this.onSearchRequested){

            return;

        }

        const text =

            this.taskSearchInput?.value?.trim()

            ?? "";

        if(!text){

            return;

        }

        this.onSearchRequested(text);

    }

    showSearchTreePanel(){

        if(!this.searchTreePanel){

            return;

        }

        this.searchSidebarVisible=true;

        this.searchTreePanel.hidden=false;

        this.taskPanel.hidden=true;

    }

    hideSearchTreePanel(){

        if(!this.searchTreePanel){

            return;

        }

        if(this.taskPanel){

            this.taskPanel.hidden=false;

        }

        this.searchSidebarVisible=false;

        this.searchTreePanel.hidden=true;

    }

    clearSearchTree(){

        this.searchTree=[];

        this.searchTreeView=[];

        this.searchTreeFlat=[];

        this.visibleSearchNodes=[];

        this.activeSearchNode=null;

        this.selectedSearchNode=null;

        this.searchNodeIndex.clear();

        this.searchNodeElements.clear();

        this.searchTreeFilter="";

        this.clearSearchTreeView();

        this.activeSearchNode=null;

        this.searchTreeVersion=0;

        this.lastRenderedVersion=-1;

        this.lastSearchTreeData=null;

        this.renderPending=false;

        this.renderedSearchNodes.clear();

        this.searchTreeFragment=null;

        this.searchNodeCache.clear();

    }

    getSearchTreeElement(id){

        return(

            this.searchNodeElements.get(id)

            ||

            null

        );

    }

    scrollSearchTreeNodeIntoView(id){

        const element=

            this.getSearchTreeElement(id);

        if(!element){

            return;

        }

        element.scrollIntoView({

            behavior:"smooth",

            block:"nearest"

        });

    }

    highlightSearchTreeNode(id){

        this.searchNodeElements.forEach(element=>{

            element.classList.remove(

                "active",

                "selected"

            );

            element.setAttribute(

                "aria-selected",

                "false"

            );

        });

        const element =

            this.getSearchTreeElement(id);

        if(!element){

            return;

        }

        if(id===this.selectedSearchNode){

            element.classList.add(

                "selected"

            );

        }

        if(id===this.activeSearchNode){

            element.classList.add(

                "active"

            );

        }

        element.setAttribute(

            "aria-selected",

            "true"

        );

        if(

            this.focusVisible

        ){

            element.focus({

                preventScroll:true

            });

        }

    }

    expandAllSearchNodes(){

        if(!this.pdfViewer){

            return;

        }

        this.pdfViewer.expandAllSearchResults();

    }

    collapseAllSearchNodes(){

        if(!this.pdfViewer){

            return;

        }

        this.pdfViewer.collapseAllSearchResults();

    }

    focusCurrentSearchNode(){

        if(

            !this.activeSearchNode

        ){

            return;

        }

        this.scrollSearchTreeNodeIntoView(

            this.activeSearchNode

        );

    }

    activateSearchResult(resultId){

        this.setSearchTreeActive(
            resultId
        );

        this.focusCurrentSearchNode();

    }

    clearSearchTreeSelection(){

        this.selectedSearchNode=null;

        this.searchNodeElements.forEach(

            element=>{

                element.classList.remove(

                    "selected",

                    "active"

                );

            }

        );

        this.searchNodeElements.forEach(

            element=>{

                element.setAttribute(

                    "aria-selected",

                    "false"

                );

            }

        );

    }

    selectRenderedSearchNode(id){

        this.selectedSearchNode=id;

        this.highlightSearchTreeNode(id);

        this.scrollSearchTreeNodeIntoView(id);

    }

    setSearchTree(data={}){

        if(!data){

            this.clearSearchTree();

            return;

        }

        // =====================================
        // NUEVA VERSIÓN DEL ÁRBOL
        // =====================================

        this.lastSearchTreeData = data;

        this.searchTreeVersion++;

        this.searchTree =
            data.tree || [];

        this.searchTreeView =
            data.view || [];

        this.searchTreeFlat =
            data.flat || [];

        this.visibleSearchNodes =
            data.visible || [];

        this.activeSearchNode =
            data.active ?? null;

        this.selectedSearchNode =
            data.selected ?? null;

        this.searchNodeIndex.clear();

        this.searchTreeFlat.forEach(node=>{

            this.searchNodeIndex.set(

                node.id,

                node

            );

        });

        this.scheduleSearchTreeRender();

    }

    renderSearchTree(){

        if(

            this.lastRenderedVersion===

            this.searchTreeVersion

        ){

            return;

        }

        this.lastRenderedVersion=

        this.searchTreeVersion;

        if(!this.searchTreeContainer){

            return;

        }

        this.clearSearchTreeView();

        if(!this.hasSearchTree()){

            this.hideSearchTreePanel();

            return;

        }

        this.showSearchTreePanel();

        const fragment=document.createDocumentFragment();

        for(const node of this.visibleSearchNodes){

            fragment.appendChild(

                this.createSearchTreeNode(node)

            );

        }

        this.searchTreeContainer.replaceChildren(

            fragment

        );

        if(

            this.selectedSearchNode

        ){

            this.highlightSearchTreeNode(

                this.selectedSearchNode

            );

        }

    }

    createSearchTreeNode(viewNode){

        let element =

            this.searchNodeCache.get(

                viewNode.id

            );

        if(element){

            this.updateSearchTreeNode(

                element,

                viewNode

            );

            this.searchNodeElements.set(

                viewNode.id,

                element

            );

            return element;

        }

        element=document.createElement("div");

        element.className = "search-tree-node";

        element.dataset.id = viewNode.id;

        element.dataset.type = viewNode.type;

        element.style.paddingLeft =

            `${viewNode.depth * 18}px`;

        element.setAttribute(
            "role",
            "treeitem"
        );

        element.setAttribute(
            "tabindex",
            "-1"
        );

        element.setAttribute(
            "aria-level",
            viewNode.depth + 1
        );

        element.setAttribute(
            "aria-selected",
            "false"
        );

        element.setAttribute(
            "aria-expanded",
            String(viewNode.expanded)
        );

        this.searchNodeElements.set(
            viewNode.id,
            element
        );

        this.searchNodeCache.set(
            viewNode.id,
            element
        );

        this.searchNodeElements.set(
            viewNode.id,
            element
        );

        this.searchNodeCache.set(
            viewNode.id,
            element
        );

        // ==========================================
        // CONTENEDOR HORIZONTAL DEL NODO
        // ==========================================

        const row = document.createElement("div");

        row.className = "search-tree-row";

        // ==========================================
        // CONTROLES
        // ==========================================

        row.appendChild(

            this.createSearchTreeToggle(
                viewNode
            )

        );

        row.appendChild(

            this.createSearchTreeIcon(
                viewNode
            )

        );

        row.appendChild(

            this.createSearchTreeLabel(
                viewNode
            )

        );

        element.appendChild(
            row
        );

        this.attachSearchTreeEvents(

            element,

            row,

            viewNode

        );

        return element;
    }

    updateSearchTreeNode(
        element,
        viewNode
    ){

        element.dataset.id=viewNode.id;

        element.dataset.type=viewNode.type;

        element.style.paddingLeft=

            `${viewNode.depth*18}px`;

        const toggle=

            element.querySelector(

                ".search-tree-toggle"

            );

        if(toggle){

            toggle.disabled=

                !viewNode.expandable;

            toggle.textContent=

                viewNode.expandable

                    ? (

                        viewNode.expanded

                            ? "▼"

                            : "▶"

                    )

                    : "";

        }

        const label=

            element.querySelector(

                ".search-tree-label"

            );

        if(label){

            label.childNodes[0].textContent=

                viewNode.title;

        }

        element.setAttribute(

            "aria-expanded",

            String(

                viewNode.expanded

            )

        );

        element.dataset.type =

            viewNode.type;

    }

    attachSearchTreeEvents(
        element,
        row,
        viewNode
    ){

        const toggle=row.querySelector(
            ".search-tree-toggle"
        );

        toggle?.addEventListener(

            "click",

            event=>{

                event.stopPropagation();

                this.toggleSearchTreeNode(
                    viewNode.id
                );

            }

        );

        row.addEventListener(

            "mouseenter",

            ()=>{

                element.classList.add(

                    "hover"

                );

                this.hoverNode =

                    viewNode.id;

            }

        );

        row.addEventListener(

            "mouseleave",

            ()=>{

                element.classList.remove(

                    "hover"

                );

                this.hoverNode = null;

            }

        );

        row.addEventListener(

            "dblclick",

            ()=>{

                this.selectSearchTreeNode(

                    viewNode.id

                );

            }

        );

    }

    animateSearchNode(element){

        if(

            !this.enableAnimations ||

            !element

        ){

            return;

        }

        element.classList.remove(

            "animate"

        );

        void element.offsetWidth;

        element.classList.add(

            "animate"

        );

    }

    toggleSearchTreeNode(nodeId){

        if(!this.pdfViewer){

            return;

        }

        this.pdfViewer.toggleSearchTreeNode(nodeId);

    }

    selectSearchTreeNode(nodeId){

        const node=

            this.getSearchNode(nodeId);

        if(!node){

            return;

        }

        this.selectedSearchNode=nodeId;

        this.highlightSearchTreeNode(nodeId);

        this.scrollSearchTreeNodeIntoView(nodeId);

        if(this.pdfViewer){

            this.pdfViewer.selectSearchTreeResult(
                nodeId
            );

        }

        this.activeSearchNode=nodeId;

    }

    setSearchTreeSelection(nodeId){

        if(

            this.selectedSearchNode===nodeId

        ){

            return;

        }

        this.selectedSearchNode=nodeId;

        this.highlightSearchTreeNode(nodeId);

    }

    setSearchTreeActive(nodeId){

        if(

            this.activeSearchNode===nodeId

        ){

            return;

        }

        this.activeSearchNode=nodeId;

        this.highlightSearchTreeNode(nodeId);

        this.scrollSearchTreeNodeIntoView(nodeId);

        this.focusedSearchNode=nodeId;

        this.animateSearchNode(

            this.getSearchTreeElement(

                nodeId

            )

        );

    }

    // ==========================================
    // SEARCH TREE
    // NODO ACTIVO DESDE PDFVIEWER
    // ==========================================

    setActiveSearchNode(node){

        if(!node){

            return;

        }

        const nodeId =

            typeof node === "object"

                ? node.id

                : node;

        this.setSearchTreeActive(

            nodeId

        );

    }

    createSearchTreeToggle(viewNode){

        const button=document.createElement("button");

        button.type="button";

        button.className="search-tree-toggle";

        if(!viewNode.expandable){

            button.disabled=true;

            button.textContent="";

            return button;

        }

        button.textContent=

            viewNode.expanded

                ? "▼"

                : "▶";

        return button;

    }

    createSearchTreeIcon(viewNode){

        const icon=document.createElement("span");

        icon.className="search-tree-icon";

        switch(viewNode.type){

            case "section":

                icon.textContent="📁";

                break;

            case "task":

                icon.textContent="📄";

                break;

            case "result":

                icon.textContent="🔍";

                break;

            default:

                icon.textContent="•";

        }

        return icon;

    }

    createSearchTreeLabel(viewNode){

        const label=document.createElement("span");

        label.className="search-tree-label";

        label.textContent=viewNode.title;

        if(viewNode.resultCount){

            const badge=document.createElement("span");

            badge.className="search-tree-count";

            badge.textContent=viewNode.resultCount;

            label.appendChild(badge);

        }

        return label;

    }

    refreshSearchTree(){

        if(

            !this.lastSearchTreeData

        ){

            return;

        }

        this.scheduleSearchTreeRender();

    }

    clearSearchTreeView(){

        if(!this.searchTreeContainer){

            return;

        }

        this.searchTreeContainer.replaceChildren();

        this.searchNodeElements.clear();

    }

    setPDFViewer(pdfViewer){

        this.pdfViewer=pdfViewer;

        this.bindSearchTree();

        this.bindSearchTreeLifecycle();

    }

    bindSearchTree(){

        if(!this.pdfViewer){

            return;

        }

        this.pdfViewer.setSearchTreeListener(

            data=>{

                this.setSearchTree(data);

            }

        );

        this.pdfViewer.setSearchTreeSelectionListener(

            node=>{

                if(!node){

                    return;

                }

                this.setSearchTreeSelection(
                    node.id
                );

            }

        );

    }

    bindSearchTreeLifecycle(){

        if(!this.pdfViewer){

            return;

        }

        this.pdfViewer.setSearchTreeChangeListener(

            data=>{

                this.lastSearchTreeData=data;

                this.setSearchTree(data);

            }

        );

        this.pdfViewer.setSearchTreeActiveListener(

            node=>{

                if(!node){

                    return;

                }

                this.activateSearchResult(

                    node.id

                );

            }

        );

        this.pdfViewer.setSearchTreeResetListener(

            ()=>{

                this.resetSearchSidebar();

            }

        );

    }

    refreshSearchSidebar(){

        if(

            !this.pdfViewer

        ){

            return;

        }

        const data=

            this.pdfViewer.getSearchTreeViewModel();

        if(!data){

            return;

        }

        this.setSearchTree(data);

    }

    syncSearchSidebar(){

        this.refreshSearchSidebar();

    }

    hasSearchTree(){

        return this.searchTree.length>0;

    }

    scheduleSearchTreeRender(){

        if(this.renderPending){

            return;

        }

        this.renderPending=true;

        requestAnimationFrame(()=>{

            this.renderPending=false;

            this.renderSearchTree();

        });

    }

    bindSearchKeyboard(){

        document.addEventListener(

            "keydown",

            event=>{

                if(

                    !this.keyboardNavigationEnabled ||

                    !this.searchSidebarVisible ||

                    this.keyboardNavigationLocked

                ){

                    return;

                }

                this.handleSearchKeyboard(event);

            }

        );

    }

    handleSearchKeyboard(event){

        switch(event.key){

            case "ArrowUp":

                event.preventDefault();

                this.focusPreviousSearchNode();

                break;

            case "ArrowDown":

                event.preventDefault();

                this.focusNextSearchNode();

                break;

            case "ArrowLeft":

                event.preventDefault();

                this.collapseFocusedSearchNode();

                break;

            case "ArrowRight":

                event.preventDefault();

                this.expandFocusedSearchNode();

                break;

            case "Home":

                event.preventDefault();

                this.focusFirstSearchNode();

                break;

            case "End":

                event.preventDefault();

                this.focusLastSearchNode();

                break;

            case "Enter":

            case " ":

                event.preventDefault();

                this.activateFocusedSearchNode();

                break;

        }

    }

    focusFirstSearchNode(){

        if(!this.visibleSearchNodes.length){

            return;

        }

        this.setSearchTreeActive(

            this.visibleSearchNodes[0].id

        );

    }

    focusLastSearchNode(){

        if(!this.visibleSearchNodes.length){

            return;

        }

        this.setSearchTreeActive(

            this.visibleSearchNodes[

                this.visibleSearchNodes.length-1

            ].id

        );

    }

    focusNextSearchNode(){

        const index=

            this.visibleSearchNodes.findIndex(

                node=>node.id===this.activeSearchNode

            );

        if(index<0){

            this.focusFirstSearchNode();

            return;

        }

        if(index>=this.visibleSearchNodes.length-1){

            return;

        }

        this.setSearchTreeActive(

            this.visibleSearchNodes[index+1].id

        );

    }

    focusPreviousSearchNode(){

        const index=

            this.visibleSearchNodes.findIndex(

                node=>node.id===this.activeSearchNode

            );

        if(index<=0){

            return;

        }

        this.setSearchTreeActive(

            this.visibleSearchNodes[index-1].id

        );

    }

    expandFocusedSearchNode(){

        if(

            !this.activeSearchNode ||

            !this.pdfViewer

        ){

            return;

        }

        this.pdfViewer.expandSearchTreeNode(

            this.activeSearchNode

        );

    }

    collapseFocusedSearchNode(){

        if(

            !this.activeSearchNode ||

            !this.pdfViewer

        ){

            return;

        }

        this.pdfViewer.collapseSearchTreeNode(

            this.activeSearchNode

        );

    }

    activateFocusedSearchNode(){

        if(

            !this.activeSearchNode

        ){

            return;

        }

        this.selectSearchTreeNode(

            this.activeSearchNode

        );

    }

    getSearchTree(){

        return this.searchTree;

    }

    getSearchTreeView(){

        return this.searchTreeView;

    }

    getVisibleSearchNodes(){

        return this.visibleSearchNodes;

    }

    getSearchNode(id){

        return this.searchNodeIndex.get(id)||null;

    }

    isSearchSidebarVisible(){

        return this.searchSidebarVisible;

    }

    resetSearchSidebar(){

        this.clearSearchTree();

        this.hideSearchTreePanel();

        this.searchSidebarVisible=false;

        this.selectedSearchNode=null;

        this.activeSearchNode=null;

    }

    destroySearchSidebar(){

        this.resetSearchSidebar();

        this.searchNodeCache.clear();

        this.pdfViewer=null;

    }

    onSearchCompleted(){

        this.refreshSearchSidebar();

    }

    onSearchCleared(){

        this.resetSearchSidebar();

    }

    // ==========================================
    // OBTENER EL ÁRBOL
    // ==========================================

    getTaskTree() {

        return this.taskTree;

    }

    // ==========================================
    // LIMPIAR EL ÁRBOL
    // ==========================================

    clearTaskTree() {

        this.taskTree = [];

        this.currentTask = null;

        this.selectedTask = null;

        this.taskNodes.clear();

        this.expandedTasks.clear();

        this.clearTaskTreeView();

        this.hideTaskPanel();

    }

    // ==========================================
    // EXISTE ÁRBOL
    // ==========================================

    hasTaskTree() {

        return this.taskTree.length > 0;

    }

    // ==========================================
    // ESTADÍSTICAS DEL ÁRBOL
    // ==========================================

    getTaskTreeInfo() {

        let total = 0;

        const walk = (nodes) => {

            nodes.forEach(node => {

                total++;

                if (

                    Array.isArray(node.children) &&

                    node.children.length

                ) {

                    walk(node.children);

                }

            });

        };

        walk(this.taskTree);

        return {

            roots: this.taskTree.length,

            total

        };

    }

    // ==========================================
    // CREAR PANEL DEL ÍNDICE
    // ==========================================

    initializeTaskPanel() {

        if (this.taskPanel) {

            return;

        }

        this.taskPanel = document.createElement("div");

        this.taskPanel.className = "task-tree-panel";

        this.taskPanel.hidden = true;

        this.taskContainer = document.createElement("div");

        this.taskContainer.className = "task-tree";

        this.taskPanel.appendChild(this.taskContainer);

        this.petsList.parentNode.insertBefore(

            this.taskPanel,

            this.petsList

        );

    }

    initializeSearchTreePanel(){

        if(this.searchTreePanel){

            return;

        }

        this.searchTreePanel=document.createElement("div");

        this.searchTreePanel.className="search-tree-panel";

        this.searchTreePanel.hidden=true;

        this.searchTreeContainer=document.createElement("div");

        this.searchTreeContainer.className="search-tree";

        this.searchTreePanel.appendChild(

            this.searchTreeContainer

        );

        this.petsList.parentNode.insertBefore(

            this.searchTreePanel,

            this.petsList

        );

        this.bindSearchKeyboard();

    }

    // ==========================================
    // MOSTRAR PANEL
    // ==========================================

    showTaskPanel() {

        if (!this.taskPanel) {

            return;

        }

        this.taskPanel.hidden = false;

    }

    // ==========================================
    // OCULTAR PANEL
    // ==========================================

    hideTaskPanel() {

        if (!this.taskPanel) {

            return;

        }

        this.taskPanel.hidden = true;

    }

    // ==========================================
    // LIMPIAR PANEL DEL ÁRBOL
    // ==========================================

    clearTaskTreeView() {

        if (!this.taskContainer) {

            return;

        }

        this.taskContainer.innerHTML = "";

        this.taskNodes.clear();

    }

    // ==========================================
    // RENDER DEL ÁRBOL
    // ==========================================

    renderTaskTree() {

        if (!this.taskContainer) {

            return;

        }

        this.clearTaskTreeView();

        const fragment = document.createDocumentFragment();

        this.taskTree.forEach(node => {

            fragment.appendChild(

                this.createTaskNode(node)

            );

        });

        this.taskContainer.appendChild(fragment);

    }

    // ==========================================
    // CREAR NODO DEL ÁRBOL
    // ==========================================

    createTaskNode(node, level = 0) {

        const container = document.createElement("div");

        container.className = "task-node";

        container.dataset.id = node.id;

        container.dataset.level = level;

        // sangría
        container.style.marginLeft = `${level * 18}px`;

        const row = document.createElement("div");

        row.className = "task-node-row";

        // ------------------------------------

        const toggle = document.createElement("button");

        toggle.type = "button";

        toggle.className = "task-toggle";

        const hasChildren =

            Array.isArray(node.children)

            &&

            node.children.length > 0;

        toggle.textContent =

            hasChildren

                ? (

                    this.expandedTasks.has(node.id)

                        ? "▼"

                        : "▶"

                )

                : "";

        toggle.disabled = !hasChildren;

        row.appendChild(toggle);

        // ------------------------------------

        const title = document.createElement("button");

        title.type = "button";

        title.className = "task-node-title";

        title.textContent = node.title;

        row.appendChild(title);

        container.appendChild(row);

        this.taskNodes.set(

            node.id,

            container

        );

        // ------------------------------------

        const childrenContainer =

            document.createElement("div");

        childrenContainer.className =

            "task-children";

        if (

            hasChildren

        ) {

            if (

                !this.expandedTasks.has(node.id)

            ) {

                childrenContainer.hidden = true;

            }

            node.children.forEach(child => {

                childrenContainer.appendChild(

                    this.createTaskNode(

                        child,

                        level + 1

                    )

                );

            });

        }

        container.appendChild(

            childrenContainer

        );

        // ------------------------------------

        toggle.addEventListener(

            "click",

            e => {

                e.stopPropagation();

                this.toggleTaskNode(

                    node.id

                );

            }

        );

        title.addEventListener(

            "click",

            ()=>{

                this.selectTaskNode(

                    node.id

                );

            }

        );

        return container;

    }

    // ==========================================
    // ACTUALIZAR ÁRBOL
    // ==========================================

    refreshTaskTree() {

        if (

            !this.hasTaskTree()

        ) {

            return;

        }

        this.renderTaskTree();

    }

    // ==========================================
    // BUSCAR NODO
    // ==========================================

    getTaskNode(id) {

        return this.taskNodes.get(id) || null;

    }

    // ==========================================
    // EXPANDIR / CONTRAER
    // ==========================================

    toggleTaskNode(id){

        if(

            this.expandedTasks.has(id)

        ){

            this.expandedTasks.delete(id);

        }

        else{

            this.expandedTasks.add(id);

        }

        this.refreshTaskTree();

    }

    // ==========================================
    // SELECCIONAR NODO
    // ==========================================

    selectTaskNode(id){

        const node = this.findTaskById(id);

        if(!node){

            return;

        }

        this.selectedTask = id;

        this.expandParents(id);

        this.highlightTaskNode(id);

        this.scrollTaskNodeIntoView(id);

        if(typeof this.onTaskSelected === "function"){

            this.onTaskSelected(node.id);

        }

    }

    // ==========================================
    // RESALTAR NODO
    // ==========================================

    highlightTaskNode(id){

        if(

            this.activeTaskNode

        ){

            this.activeTaskNode.classList.remove(

                "active"

            );

        }

        const element =

            this.getTaskNode(id);

        if(!element){

            return;

        }

        element.classList.add(

            "active"

        );

        this.activeTaskNode =

            element;

    }

    // ==========================================
    // SCROLL HACIA EL NODO
    // ==========================================

    scrollTaskNodeIntoView(id){

        const element =

            this.getTaskNode(id);

        if(!element){

            return;

        }

        element.scrollIntoView({

            behavior:"smooth",

            block:"nearest"

        });

    }

    // ==========================================
    // BUSCAR TASK POR ID
    // ==========================================

    findTaskById(id){

        let result = null;

        const walk = nodes=>{

            for(const node of nodes){

                if(node.id===id){

                    result=node;

                    return;

                }

                if(node.children?.length){

                    walk(node.children);

                }

                if(result){

                    return;

                }

            }

        };

        walk(this.taskTree);

        return result;

    }

    // ==========================================
    // ACTUALIZAR CALLBACK
    // ==========================================

    setTaskSelectionListener(callback){

        this.onTaskSelected = callback;

    }

    // ==========================================
    // ACTUALIZAR TASK ACTUAL
    // ==========================================

    setCurrentTask(id){

        if(

            this.currentTask===id

        ){

            return;

        }

        this.currentTask=id;

        this.highlightTaskNode(id);

        this.scrollTaskNodeIntoView(id);

    }

    // ==========================================
    // LIMPIAR TASK ACTUAL
    // ==========================================

    clearCurrentTask(){

        this.currentTask = null;

        this.selectedTask = null;

        if(

            this.activeTaskNode

        ){

            this.activeTaskNode.classList.remove(

                "active"

            );

        }

        this.taskNodes.clear();

        this.expandedTasks.clear();

        this.activeTaskNode = null;

        this.clearTaskTreeView();

        this.hideTaskPanel();

    }

    // ==========================================
    // EXPANDIR PADRES
    // ==========================================

    expandParents(id){

        const walk = (nodes,parent=null)=>{

            for(const node of nodes){

                if(node.id===id){

                    if(parent){

                        this.expandedTasks.add(parent.id);

                    }

                    return true;

                }

                if(node.children?.length){

                    const found =

                        walk(

                            node.children,

                            node

                        );

                    if(found){

                        this.expandedTasks.add(

                            node.id

                        );

                        return true;

                    }

                }

            }

            return false;

        };

        walk(this.taskTree);

        this.refreshTaskTree();

    }

    // ==========================================
    // EXPANDIR TODO
    // ==========================================

    expandAllTasks(){

        const walk = nodes =>{

            nodes.forEach(node=>{

                if(

                    node.children?.length

                ){

                    this.expandedTasks.add(

                        node.id

                    );

                    walk(node.children);

                }

            });

        };

        walk(

            this.taskTree

        );

        this.refreshTaskTree();

    }

    // ==========================================
    // COLAPSAR TODO
    // ==========================================

    collapseAllTasks(){

        this.expandedTasks.clear();

        this.refreshTaskTree();

    }

    // ==========================================
    // EXPANDIR SOLO RAÍCES
    // ==========================================

    expandRootTasks(){

        this.expandedTasks.clear();

        this.taskTree.forEach(node=>{

            if(

                node.children?.length

            ){

                this.expandedTasks.add(

                    node.id

                );

            }

        });

        this.refreshTaskTree();

    }

    // ==========================================
    // SIDEBAR V2
    // CAMBIAR A VISTA ÁREAS
    // ==========================================

    showAreas(){

        this.viewMode="areas";

        if(this.currentAreaName){

            this.currentAreaName.textContent="Todos";

        }

        if(this.changeAreaBtn){

            this.changeAreaBtn.hidden=true;

        }

        if(this.searchInput){

            this.searchInput.disabled = true;

            this.searchInput.placeholder =
                "Seleccione un área";

        }

        this.render();

    }

    // ==========================================
    // SIDEBAR V2
    // CAMBIAR A VISTA PETS
    // ==========================================

    showPets(){

        this.viewMode="pets";

        if(this.changeAreaBtn){

            this.changeAreaBtn.hidden=false;

        }

        if(this.searchInput){

            this.searchInput.disabled = false;

            this.searchInput.placeholder =
                "Buscar PET o área...";

        }

        this.render();

    }

    // ==========================================
    // SIDEBAR V2
    // SELECCIONAR ÁREA
    // ==========================================

    selectArea(area){

        this.currentArea=area;

        if(this.currentAreaName){

            const areaConfig = AREA_CONFIG.find(
                a => a.id === area
            );

            this.currentAreaName.textContent =
                areaConfig?.nombre ?? area;

        }

        if(this.searchInput){

            this.searchInput.value="";

        }

        if(this.searchClear){

            this.searchClear.hidden=true;

        }

        this.showPets();

    }

    // ==========================================
    // SIDEBAR V2
    // RENDER ÁREAS
    // ==========================================

    renderAreas() {

        // Mostrar las tarjetas de áreas desde arriba.
        this.petsList.scrollTop = 0;
        this.petsList.scrollLeft = 0;

        // Mantener aquí el resto del código original.

        // Limpiar listado
        this.petsList.innerHTML = "";

        // Ya no existen tarjetas PET en esta vista
        this.cards = [];

        const frag = document.createDocumentFragment();

        AREA_CONFIG.forEach(area => {

            // ==========================
            // CONTADOR DE PETS
            // ==========================

            let total = this.config.pets.length;

            if (area.id !== "TODOS") {

                total = this.config.pets.filter(pet =>
                    Object.keys(pet.archivos).includes(area.id)
                ).length;

            }

            // ==========================
            // TARJETA
            // ==========================

            const card = document.createElement("button");

            card.className = "area-card";

            card.dataset.area = area.id;

            // ==========================================
            // COLOR DEL ÁREA
            // ==========================================

            card.style.setProperty(
                "--area-color",
                area.color
            );

            card.innerHTML = `

                <div class="area-card-header">

                    <div class="area-card-icon">

                        <img
                            src="icons/${area.icon}"
                            alt="${area.nombre}"
                            loading="lazy"
                            draggable="false"
                        >

                    </div>

                </div>

                <div class="area-card-title">

                    ${area.nombre}

                </div>

                <div class="area-card-count">

                    ${total} procedimientos

                </div>

            `;

            card.addEventListener("click", () => {

                this.selectArea(area.id);

            });

            if(area.id===this.currentArea){

                card.classList.add("selected");

            }

            frag.appendChild(card);

        });

        this.petsList.appendChild(frag);

        this.filteredPets=[...this.config.pets];

        this.updateCounter();

    }

    // ================================
    // 🔤 NORMALIZAR — quita tildes,
    // minúsculas, elimina prefijo numérico
    // ================================

    normalize(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    // ================================
    // BUSCADOR — PETS, FDS Y MANUALES
    // ================================

    initializeSearch() {

        this.searchInput?.addEventListener("input", () => {

            clearTimeout(this.searchTimeout);

            if (this.searchClear) {

                this.searchClear.hidden =
                    !this.searchInput.value;

            }

            this.searchTimeout = setTimeout(() => {

                if (this.bibliotecaActual === "pets") {

                    // Conservar el buscador original.
                    this.filterPets();

                } else {

                    // Buscador de FDS y Manuales.
                    this.filterDocumentos();

                }

            }, 120);

        });

        this.searchClear?.addEventListener("click", () => {

            clearTimeout(this.searchTimeout);

            this.searchInput.value = "";

            this.searchClear.hidden = true;

            this.searchInput.focus();

            if (this.bibliotecaActual === "pets") {

                this.filterPets();

            } else {

                this.filterDocumentos();

            }

        });

    }

    filterPets() {

        const raw   = this.searchInput?.value.trim() || "";
        const query = this.normalize(raw);

        let visible = 0;

        this.cards.forEach(({ card, pet }) => {
            let match = true;
            
            if (query) {
                const normNombre = this.normalize(pet.nombre);
                const matchName  = normNombre.includes(query);
                const matchArea  = Object.keys(pet.archivos)
                    .some(a => this.normalize(a).includes(query));
                match = matchName || matchArea;
            }

            const areaMatch =

                this.currentArea==="TODOS"

                ||

                Object.keys(pet.archivos)

                    .includes(this.currentArea);

            const show =

                match && areaMatch;
            card.style.display = show ? "" : "none";
            if (show) visible++;
        });

        this.renderEmptyState(visible === 0);
        this.updateCounter(visible);
    }

    // ==========================================
    // BUSCAR FDS Y MANUALES
    // ==========================================

    async filterDocumentos() {

        if (
            this.bibliotecaActual === "pets" ||
            !this.documentosManager
        ) {
            return;
        }

        const tipo = this.bibliotecaActual;

        const texto =
            this.searchInput?.value.trim() || "";

        // ======================================
        // SIN TEXTO DE BÚSQUEDA
        // ======================================

        if (!texto) {

            if (this.categoriaActual) {

                // Regresar a los documentos de
                // la categoría que estaba abierta.

                this.viewMode = "pets";

                if (this.currentAreaName) {

                    this.currentAreaName.textContent =
                        this.categoriaActual;

                }

                if (this.changeAreaBtn) {

                    this.changeAreaBtn.hidden = false;

                }

            } else {

                // Si estábamos en la pantalla
                // general, volver a las categorías.

                this.viewMode = "areas";

                if (this.currentAreaName) {

                    this.currentAreaName.textContent =
                        "Todas las categorías";

                }

                if (this.changeAreaBtn) {

                    this.changeAreaBtn.hidden = true;

                }

            }

            this.render();

            return;

        }

        // ======================================
        // BÚSQUEDA EN TODAS LAS CATEGORÍAS
        // ======================================

        try {

            const resultados =
                await this.documentosManager.buscarDocumentos(
                    texto,
                    null,
                    tipo
                );

            // Evitar mostrar resultados antiguos
            // si el usuario cambió de biblioteca
            // o modificó la búsqueda.

            if (
                tipo !== this.bibliotecaActual ||
                texto !== (this.searchInput?.value.trim() || "")
            ) {
                return;
            }

            this.viewMode = "pets";

            if (this.currentAreaName) {

                this.currentAreaName.textContent =
                    "Resultados de búsqueda";

            }

            if (this.changeAreaBtn) {

                this.changeAreaBtn.hidden = false;

            }

            this.renderDocumentos(resultados);

        } catch (error) {

            console.error(
                "Error al buscar documentos:",
                error
            );

            this.showToast(
                "No se pudo realizar la búsqueda.",
                "error"
            );

        }

    }

    // ================================
    // 📭 EMPTY STATE
    // ================================

    renderEmptyState(show) {
        let empty = this.petsList?.querySelector(".empty-search-state");

        if (show) {
            if (!empty) {
                empty = document.createElement("div");
                empty.className = "empty-search-state";
                empty.innerHTML = `
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="14" cy="14" r="10" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M22 22l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M10 14h8M14 10v8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.4"/>
                    </svg>
                    <p>Sin resultados</p>
                    <span>Intenta con otro término</span>
                `;
                this.petsList?.appendChild(empty);
            }
        } else if (empty) {
            empty.remove();
        }
    }

    // ==========================================
    // SIDEBAR V2
    // CONTADOR
    // ==========================================

    updateCounter(visibleCount) {

        if (!this.petsCounter) return;

        // ===============================
        // VISTA DE ÁREAS
        // ===============================

        if (this.viewMode === "areas") {

            const totalAreas = AREA_CONFIG.filter(
                area => area.id !== "TODOS"
            ).length;

            this.petsCounter.textContent =
                `${totalAreas} áreas`;

            return;

        }

        // ===============================
        // VISTA DE PETS
        // ===============================

        const total = this.filteredPets.length;

        const visible = visibleCount ?? total;

        if (visible === total) {

            this.petsCounter.textContent =
                `${total} procedimientos`;

        } else {

            this.petsCounter.textContent =
                `${visible} de ${total} procedimientos`;

        }

    }

    // ==========================================
    // SIDEBAR V2
    // RENDER PETS
    // ==========================================

    renderPets() {

        // Mostrar los procedimientos desde el principio.
        this.petsList.scrollTop = 0;
        this.petsList.scrollLeft = 0;

        // Mantener aquí el resto del código original.

        // ==========================================
        // LIMPIAR CONTENEDOR
        // ==========================================

        this.petsList.innerHTML = "";

        // Reiniciar tarjetas registradas
        this.cards = [];

        // ==========================================
        // OBTENER ÁREA ACTUAL
        // ==========================================

        const area = this.currentArea;

        // ==========================================
        // FILTRAR PETS
        // ==========================================

        this.filteredPets =

            area === "TODOS"

                ? [...this.config.pets]

                : this.config.pets.filter(pet =>

                    Object.keys(pet.archivos)
                        .includes(area)

                );

        // ==========================================
        // CREAR FRAGMENTO
        // ==========================================

        const fragment = document.createDocumentFragment();

        // ==========================================
        // RENDERIZAR TARJETAS
        // ==========================================

        this.filteredPets.forEach(pet => {

            const card = this.createPetCard(pet);

            fragment.appendChild(card);

        });

        // ==========================================
        // INSERTAR EN EL DOM
        // ==========================================

        this.petsList.appendChild(fragment);

        // ==========================================
        // CONTADOR
        // ==========================================

        this.updateCounter(this.filteredPets.length);

    }

    // ================================
    // 📚 EXTRACT VERSION
    // ================================

    extractVersionFromPath(path){

        const match =
            path.match(
                /(VERSION|VER|V)[\s_-]*(\d+)/i
            );

        return match
            ? match[2].padStart(2,"0")
            : null;
    }

    // ================================
    // 📦 CREATE CARD
    // ================================

    createPetCard(pet) {

        const card = document.createElement("div");

        card.className = "pet-card";
        card.setAttribute("role", "listitem");

        const numMatch = pet.nombre.match(/^(\d+)/);

        const petNum =
            numMatch
                ? `PET ${numMatch[1].padStart(3, "0")}`
                : "";

        const petName =
            pet.nombre
                .replace(/^\d+[-\s]*/, "")
                .trim();
        
        // ==========================================
        // ID DEL PET
        // ==========================================

        const firstPath =
            Object.values(pet.archivos)[0];

        const version =
            this.extractVersionFromPath(
                firstPath
            );

        // ==========================
        // NÚMERO PET
        // ==========================

        if(petNum){

            const petHeader =
                document.createElement("div");

            petHeader.className =
                "pet-number-row";

            const numEl =
                document.createElement("div");

            numEl.className =
                "pet-number";

            numEl.textContent =
                version
                    ? `${petNum} · VER. ${version}`
                    : petNum;

            petHeader.appendChild(numEl);

            card.appendChild(petHeader);
        }

        // ==========================
        // HEADER
        // ==========================

        const header =
            document.createElement("div");

        header.className =
            "pet-card-header";

        const title =
            document.createElement("div");

        title.className =
            "pet-title";

        title.textContent =
            petName;

        const chevron =
            document.createElement("div");

        chevron.className =
            "pet-chevron";

        chevron.innerHTML =
        `
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
            >
                <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        `;

        header.appendChild(title);
        header.appendChild(chevron);

        card.appendChild(header);

        // ==========================
        // ÁREA ACTIVA
        // ==========================

        const areaIndicator =
            document.createElement("div");

        areaIndicator.className =
            "pet-active-area";

        card.appendChild(areaIndicator);

        // ==========================
        // ÁREAS
        // ==========================

        const areasRow =
            document.createElement("div");

        areasRow.className =
            "areas-row areas-collapsed";

        // ------------------------------------------
        // CONTADOR DE ÁREAS
        // ------------------------------------------

        const areaCount =
            Object.keys(pet.archivos).length;

        const areasLabel =
            document.createElement("div");

        areasLabel.className =
            "areas-label";

        areasLabel.innerHTML = `
            <span>ÁREAS</span>
            <strong>${areaCount}</strong>
        `;

        areasRow.appendChild(
            areasLabel
        );

        // ------------------------------------------
        // BOTONES DE ÁREA
        // ------------------------------------------

        const areasButtons =
            document.createElement("div");

        areasButtons.className =
            "areas-buttons";

        Object.entries(
            pet.archivos
        ).forEach(
            ([area,path]) => {

                areasButtons.appendChild(

                    this.createAreaButton({

                        area,
                        path,

                        card,

                        areaIndicator,

                        petName:
                            pet.nombre,

                        areaName:
                            area
                    })
                );
            }
        );

        areasRow.appendChild(
            areasButtons
        );

        card.appendChild(
            areasRow
        );

        // ==========================
        // ACORDEÓN
        // ==========================

        header.addEventListener(
            "click",
            () => {

                const expanded =

                    card.classList.contains(
                        "expanded"
                    );

                // ==========================
                // CERRAR TODOS
                // ==========================

                this.cards.forEach(
                    item => {

                        item.card.classList.remove(
                            "expanded"
                        );

                        item.card.classList.remove(
                            "active"
                        );

                        item.areasRow.classList.add(
                            "areas-collapsed"
                        );

                        item.chevron.classList.remove(
                            "open"
                        );

                        const badge =
                            item.card.querySelector(
                                ".pet-active-area"
                            );

                        if(badge){

                            badge.textContent = "";

                            badge.classList.remove(
                                "visible"
                            );
                        }

                        item.card.querySelectorAll(
                            ".area-btn.active"
                        ).forEach(
                            btn => btn.classList.remove(
                                "active"
                            )
                        );
                    }
                );

                // ==========================
                // LIMPIAR REFERENCIAS
                // ==========================

                this.activeCard =
                    null;

                this.activeButton =
                    null;

                this.activeAreaLabel =
                    null;

                // ==========================
                // ABRIR ACTUAL
                // ==========================

                if(!expanded){

                    card.classList.add(
                        "expanded"
                    );

                    areasRow.classList.remove(
                        "areas-collapsed"
                    );

                    chevron.classList.add(
                        "open"
                    );
                }
            }
        );

        // ==========================
        // REGISTRO
        // ==========================

        this.cards.push({

            pet,

            card,

            areasRow,

            chevron
        });

        return card;
    }

    // ================================
    // 🔘 CREATE BUTTON
    // ================================

    createAreaButton({ area, path, card, areaIndicator, petName, areaName }) {

        const btn = document.createElement("button");
        btn.className    = "area-btn";
        btn.textContent  = area;
        btn.dataset.path = path;
        btn.title        = `${petName} — ${area}`;
        btn.setAttribute("aria-label", `Abrir ${petName}, área ${area}`);

        btn.addEventListener("click", async () => {
            
            try {
                this.setActive(card, btn, areaIndicator, area);

                localStorage.setItem("lastPDF",      path);
                localStorage.setItem("lastPetName",  petName);
                localStorage.setItem("lastAreaName", areaName);

                await this.onOpenPDF(path, petName, areaName);
            } catch (err) {
                console.error("❌ PDF ERROR:", err);
            }
        });

        return btn;
    }

    // ================================
    // 🎯 ACTIVE STATE + badge de área
    // ================================

    setActive(card, button, areaIndicator, area) {
        // limpiar anterior
        this.activeCard?.classList.remove("active");
        this.activeButton?.classList.remove("active");

        if (this.activeAreaLabel) {
            this.activeAreaLabel.textContent = "";
            this.activeAreaLabel.classList.remove("visible");
        }

        // activar nuevo
        card.classList.add("active");
        button.classList.add("active");

        if (areaIndicator && area) {
            areaIndicator.textContent = `Viendo: ${area}`;
            areaIndicator.classList.add("visible");
        }

        this.activeCard      = card;
        this.activeButton    = button;
        this.activeAreaLabel = areaIndicator;

        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // ==========================================
    // SOLICITUDES — PETS, FDS Y MANUALES
    // ==========================================

    openRequestPanel() {

        if (!this.requestPanel) return;

        const tipo = this.bibliotecaActual;

        this.solicitudes.setBiblioteca(tipo);

        this.requestVisible = true;

        // Abrir siempre en la vista «Todos».
        this.requestView = "todos";

        this.updateRequestView();

        // =====================================
        // ACTUALIZAR ENCABEZADO
        // =====================================

        const titulos = {
            pets: "Seleccionar procedimientos",
            fds: "Seleccionar FDS",
            manuales: "Seleccionar manuales"
        };

        if (this.requestTitle) {

            this.requestTitle.textContent =
                titulos[tipo];

        }

        if (this.requestAreaLabel) {

            this.requestAreaLabel.textContent =
                tipo === "pets" ? "Área" : "Categoría";

        }

        if (this.requestSearch) {

            this.requestSearch.value = "";

            this.requestSearch.placeholder =
                tipo === "pets"
                    ? "Buscar procedimiento..."
                    : tipo === "fds"
                        ? "Buscar FDS..."
                        : "Buscar manual...";

        }

        if (this.requestGeneralQuantity) {

            this.requestGeneralQuantity.value = 1;

        }

        // =====================================
        // GRUPO INICIAL
        // =====================================

        if (tipo === "pets") {

            this.requestArea =
                this.currentArea === "TODOS"
                    ? "C1"
                    : this.currentArea;

        } else {

            this.requestArea =
                this.categoriaActual || "";

        }

        // =====================================
        // MOSTRAR PANEL
        // =====================================

        this.requestPanel.hidden = false;

        this.requestPanel.setAttribute(
            "aria-hidden",
            "false"
        );

        this.renderRequestAreas();

        this.renderRequestPets();

        this.updateRequestCounter();

        // Evitar abrir el teclado automáticamente
        // cuando se utiliza un celular.
        if (window.innerWidth > 900) {

            requestAnimationFrame(() => {

                this.requestSearch?.focus();

            });

        }

    }


    // ==========================================
    // CERRAR PANEL
    // ==========================================

    closeRequestPanel() {

        if (!this.requestPanel) return;

        this.requestVisible = false;

        if (
            this.requestPanel.contains(
                document.activeElement
            )
        ) {

            document.activeElement.blur();

        }

        this.requestPanel.hidden = true;

        this.requestPanel.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    // ==========================================
    // MOSTRAR ÁREAS O CATEGORÍAS
    // ==========================================

    renderRequestAreas() {

        if (!this.requestAreaSelect) return;

        const tipo = this.bibliotecaActual;

        let grupos = [];

        if (tipo === "pets") {

            grupos = AREA_CONFIG

                .filter(area => area.id !== "TODOS")

                .map(area => ({

                    id: area.id,

                    nombre: area.nombre

                }));

        } else {

            grupos = [

                ...new Set(

                    this.documentosActuales
                        .map(documento => documento.categoria)
                        .filter(Boolean)

                )

            ]

            .sort((a, b) =>

                a.localeCompare(
                    b,
                    "es",
                    { numeric: true }
                )

            )

            .map(categoria => ({

                id: categoria,

                nombre: categoria

            }));

        }

        this.requestAreaSelect.replaceChildren();

        grupos.forEach(grupo => {

            const option =
                document.createElement("option");

            option.value = grupo.id;

            option.textContent = grupo.nombre;

            this.requestAreaSelect.appendChild(
                option
            );

        });

        const existe = grupos.some(
            grupo => grupo.id === this.requestArea
        );

        if (!existe) {

            this.requestArea =
                grupos[0]?.id || "";

        }

        this.requestAreaSelect.value =
            this.requestArea;

    }

    // ==========================================
    // VISTA: TODOS / SELECCIONADOS
    // ==========================================

    setRequestView(vista) {

        if (
            vista !== "todos" &&
            vista !== "seleccionados"
        ) {
            return;
        }

        if (this.requestView === vista) {
            return;
        }

        this.requestView = vista;

        this.updateRequestView();

        // Comenzar el listado desde arriba.
        if (this.requestPetsList) {

            this.requestPetsList.scrollTop = 0;

        }

        this.renderRequestPets();

    }


    // ==========================================
    // ACTUALIZAR LA INTERFAZ DE LAS VISTAS
    // ==========================================

    updateRequestView() {

        const seleccionados =
            this.requestView === "seleccionados";

        // Actualizar el botón activo.
        for (const [boton, activo] of [

            [this.requestViewAll, !seleccionados],

            [this.requestViewSelected, seleccionados]

        ]) {

            if (!boton) continue;

            boton.classList.toggle(
                "active",
                activo
            );

            boton.setAttribute(
                "aria-pressed",
                String(activo)
            );

        }

        // El selector de área o categoría
        // solo se muestra en «Todos».
        if (this.requestAreaContainer) {

            this.requestAreaContainer.hidden =
                seleccionados;

        }

        // El buscador y «Seleccionar todos»
        // solo se muestran en «Todos».
        if (this.requestTools) {

            this.requestTools.hidden =
                seleccionados;

        }

    }

    // ==========================================
    // OBTENER DOCUMENTOS DEL GRUPO ACTUAL
    // ==========================================

    getRequestDocuments() {

        const tipo = this.bibliotecaActual;

        // =====================================
        // PETS
        // =====================================

        if (tipo === "pets") {

            return this.config.pets

                .filter(pet =>

                    Object.prototype.hasOwnProperty.call(
                        pet.archivos || {},
                        this.requestArea
                    )

                )

                .map(pet => {

                    const path =
                        pet.archivos[this.requestArea];

                    const numero =
                        pet.nombre.match(/^\d+/)?.[0];

                    const codigo = numero

                        ? `PET ${numero.padStart(3, "0")}`

                        : pet.nombre;

                    return {

                        ...pet,

                        tipo: "pets",

                        codigo,

                        categoria: this.requestArea,

                        area: this.requestArea,

                        requestArea: this.requestArea,

                        path,

                        version:
                            this.extractVersionFromPath(
                                path
                            ) || "",

                        titulo:
                            pet.titulo ||
                            pet.nombre
                                .replace(/^\d+[-\s]*/, "")
                                .trim()

                    };

                })

                .sort((a, b) => {

                    const numeroA = Number(
                        a.codigo.match(/\d+/)?.[0] || 0
                    );

                    const numeroB = Number(
                        b.codigo.match(/\d+/)?.[0] || 0
                    );

                    return numeroA - numeroB;

                });

        }

        // =====================================
        // FDS Y MANUALES
        // =====================================

        return this.documentosActuales

            .filter(documento =>

                documento.categoria ===
                this.requestArea

            )

            .map(documento => ({

                ...documento,

                tipo

            }))

            .sort((a, b) =>

                a.nombre.localeCompare(
                    b.nombre,
                    "es",
                    { numeric: true }
                )

            );

    }


    // ==========================================
    // MOSTRAR DOCUMENTOS PARA SOLICITAR
    // ==========================================

    renderRequestPets() {

        if (!this.requestPetsList) return;

        const posicion =
            this.requestPetsList.scrollTop;

        this.requestPetsList.replaceChildren();

        // Determinar qué vista está activa.
        const seleccionados =
            this.requestView === "seleccionados";

        // En la vista «Seleccionados» no aplicamos
        // el filtro del buscador.
        const query = seleccionados

            ? ""

            : this.normalize(
                this.requestSearch?.value || ""
            );

        // Obtener los documentos según la vista.
        const documentos =

            (seleccionados

                ? this.solicitudes.obtenerSeleccionados(
                    this.bibliotecaActual
                )

                : this.getRequestDocuments()

            )

            .filter(documento => {

                if (!query) return true;

                const contenido = [

                    documento.codigo,

                    documento.id,

                    documento.nombre,

                    documento.titulo,

                    documento.fabricante,

                    documento.marca,

                    documento.modelo

                ]

                .filter(Boolean)

                .join(" ");

                return this.normalize(
                    contenido
                ).includes(query);

            });

        // =====================================
        // LISTA VACÍA
        // =====================================

        if (!documentos.length) {

            const empty =
                document.createElement("div");

            empty.className = "request-empty";

            empty.textContent = seleccionados

                ? "Todavía no hay documentos seleccionados."

                : "No se encontraron documentos.";

            this.requestPetsList.appendChild(
                empty
            );

            if (this.requestSelectAll) {

                this.requestSelectAll.checked = false;

            }

            this.updateRequestCounter();

            return;

        }

        const fragment =
            document.createDocumentFragment();

        // =====================================
        // CREAR CADA REGISTRO
        // =====================================

        documentos.forEach(documento => {

            const seleccionado =
                this.solicitudes.obtenerSeleccionado(
                    documento
                );

            const item =
                document.createElement("div");

            item.className = "request-pet";

            item.classList.toggle(
                "selected",
                Boolean(seleccionado)
            );

            // =================================
            // CHECKBOX
            // =================================

            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.className =
                "request-item-check";

            checkbox.checked =
                Boolean(seleccionado);

            checkbox.setAttribute(
                "aria-label",
                `Seleccionar ${documento.nombre}`
            );

            // =================================
            // INFORMACIÓN
            // =================================

            const info =
                document.createElement("div");

            info.className =
                "request-pet-info";

            const top =
                document.createElement("div");

            top.className =
                "request-pet-top";

            const codigo =
                document.createElement("span");

            codigo.className =
                "request-pet-code";

            codigo.textContent =
                documento.codigo ||
                documento.id?.replace(/^(FDS|MAN)-/i, "$1 ") ||
                documento.nombre;

            top.appendChild(codigo);

            if (documento.version) {

                const version =
                    document.createElement("span");

                version.className =
                    "request-pet-version";

                version.textContent =
                    `VER. ${documento.version}`;

                top.appendChild(version);

            }

            const nombre =
                document.createElement("div");

            nombre.className =
                "request-pet-name";

            nombre.textContent =
                documento.titulo ||
                documento.nombre;

            info.appendChild(top);

            info.appendChild(nombre);

            // Mostrar el grupo del documento
            // en la vista «Seleccionados».
            if (seleccionados) {

                const grupo =
                    document.createElement("span");

                grupo.className =
                    "request-selected-group";

                grupo.textContent =
                    documento.categoria ||
                    documento.area ||
                    "";

                if (grupo.textContent) {

                    info.appendChild(grupo);

                }

            }

            // =================================
            // CANTIDAD INDIVIDUAL
            // =================================

            const cantidad =
                document.createElement("div");

            cantidad.className =
                "request-item-quantity";

            cantidad.hidden =
                !seleccionado;

            const etiqueta =
                document.createElement("span");

            etiqueta.textContent = "Juegos";

            const reducir =
                document.createElement("button");

            reducir.type = "button";

            reducir.className =
                "request-qty-btn";

            reducir.textContent = "−";

            reducir.setAttribute(
                "aria-label",
                `Reducir cantidad de ${documento.nombre}`
            );

            const valor =
                document.createElement("span");

            valor.className =
                "request-qty-value";

            valor.textContent =
                seleccionado?.cantidad ?? 1;

            const incrementar =
                document.createElement("button");

            incrementar.type = "button";

            incrementar.className =
                "request-qty-btn";

            incrementar.textContent = "+";

            incrementar.setAttribute(
                "aria-label",
                `Incrementar cantidad de ${documento.nombre}`
            );

            reducir.disabled =
                !seleccionado ||
                seleccionado.cantidad <= 1;

            // =================================
            // EVENTOS DE CANTIDAD
            // =================================

            reducir.addEventListener(
                "click",
                () => {

                    this.solicitudes.reducir(
                        documento
                    );

                    const actual =
                        this.solicitudes.obtenerSeleccionado(
                            documento
                        );

                    valor.textContent =
                        actual?.cantidad ?? 1;

                    reducir.disabled =
                        !actual ||
                        actual.cantidad <= 1;

                }
            );

            incrementar.addEventListener(
                "click",
                () => {

                    this.solicitudes.incrementar(
                        documento
                    );

                    const actual =
                        this.solicitudes.obtenerSeleccionado(
                            documento
                        );

                    valor.textContent =
                        actual?.cantidad ?? 1;

                    reducir.disabled =
                        !actual ||
                        actual.cantidad <= 1;

                }
            );

            cantidad.append(
                etiqueta,
                reducir,
                valor,
                incrementar
            );

            info.appendChild(cantidad);

            // =================================
            // EVENTO DE SELECCIÓN
            // =================================

            checkbox.addEventListener(
                "change",
                () => {

                    this.toggleRequestPet(
                        documento,
                        checkbox.checked
                    );

                    item.classList.toggle(
                        "selected",
                        checkbox.checked
                    );

                    const actual =
                        this.solicitudes.obtenerSeleccionado(
                            documento
                        );

                    cantidad.hidden =
                        !actual;

                    valor.textContent =
                        actual?.cantidad ?? 1;

                    reducir.disabled =
                        !actual ||
                        actual.cantidad <= 1;

                    if (this.requestView === "seleccionados") {

                        // Al deseleccionar un documento,
                        // quitarlo inmediatamente de la lista.
                        this.renderRequestPets();

                    } else {

                        this.updateRequestSelectAll();

                    }

                }
            );

            item.append(
                checkbox,
                info
            );

            fragment.appendChild(item);

        });

        this.requestPetsList.appendChild(
            fragment
        );

        this.requestPetsList.scrollTop =
            posicion;

        this.updateRequestSelectAll();

        this.updateRequestCounter();

    }


    // ==========================================
    // SELECCIONAR O DESELECCIONAR
    // ==========================================

    toggleRequestPet(documento, selected) {

        if (selected) {

            this.solicitudes.seleccionar(
                documento
            );

        } else {

            this.solicitudes.deseleccionar(
                documento
            );

        }

    }


    // ==========================================
    // ACTUALIZAR SELECCIONAR TODOS
    // ==========================================

    updateRequestSelectAll() {

        if (!this.requestSelectAll) return;

        const checkboxes = [

            ...this.requestPetsList.querySelectorAll(
                ".request-item-check"
            )

        ];

        this.requestSelectAll.checked =

            checkboxes.length > 0 &&

            checkboxes.every(
                checkbox => checkbox.checked
            );

    }


    // ==========================================
    // SELECCIONAR O DESELECCIONAR TODOS
    // ==========================================

    toggleAllRequestPets() {

        if (this.requestView === "seleccionados") return;

        const checked =
            this.requestSelectAll.checked;

        const checkboxes =
            this.requestPetsList.querySelectorAll(
                ".request-item-check"
            );

        checkboxes.forEach(checkbox => {

            if (checkbox.checked !== checked) {

                checkbox.checked = checked;

                checkbox.dispatchEvent(
                    new Event("change")
                );

            }

        });

    }


    // ==========================================
    // ACTUALIZAR CONTADORES
    // ==========================================

    updateRequestCounter() {

        const totales =
            this.solicitudes.obtenerTotales(
                this.bibliotecaActual
            );

        if (this.requestCounter) {

            const total =
                totales.documentos;

            this.requestCounter.textContent =

                `${total} documento${total === 1 ? "" : "s"} seleccionado${total === 1 ? "" : "s"}`;

        }

        // Actualizar el número de la pestaña
        // «Seleccionados».
        if (this.requestSelectedBadge) {

            this.requestSelectedBadge.textContent =
                totales.documentos;

        }

        if (this.requestGamesCounter) {

            this.requestGamesCounter.textContent =

                `Total de juegos: ${totales.juegos}`;

        }

    }


    // ==========================================
    // LIMPIAR BIBLIOTECA ACTUAL
    // ==========================================

    clearRequest() {

        this.solicitudes.limpiar(
            this.bibliotecaActual
        );

        if (this.requestSearch) {

            this.requestSearch.value = "";

        }

        if (this.requestGeneralQuantity) {

            this.requestGeneralQuantity.value = 1;

        }

        if (this.requestSelectAll) {

            this.requestSelectAll.checked = false;

        }

        this.renderRequestPets();

        this.updateRequestCounter();

    }


    // ==========================================
    // GENERAR TEXTO PARA WHATSAPP
    // ==========================================

    generateRequestText() {

        return this.solicitudes.generarTexto(
            this.bibliotecaActual
        );

    }


    // ==========================================
    // COPIAR TEXTO
    // ==========================================

    async copyToClipboard(text) {

        return this.solicitudes.copiarTexto(
            text
        );

    }


    // ==========================================
    // COPIAR SOLICITUD
    // ==========================================

    async copyRequest() {

        const tipo =
            this.bibliotecaActual;

        const text =
            this.generateRequestText();

        if (!text) {

            this.showToast(
                "Selecciona al menos un documento.",
                "warning"
            );

            return;

        }

        const copied =
            await this.copyToClipboard(text);

        if (copied) {

            // Limpiar exclusivamente la biblioteca
            // cuya solicitud se ha copiado.
            this.solicitudes.limpiar(tipo);

            this.closeRequestPanel();

            this.showToast(
                "Solicitud copiada correctamente."
            );

        } else {

            this.showToast(
                "No fue posible copiar la solicitud.",
                "error"
            );

        }

    }

    // ==========================================
    // MOSTRAR TOAST
    // ==========================================

    showToast(message,type="success"){

        if(!this.toast)
            return;

        clearTimeout(

            this.toastTimer

        );

        this.toast.className =

            "toast";

        this.toast.classList.add(

            type

        );

        this.toastMessage.textContent =

            message;

        this.toast.classList.add(

            "show"

        );

        this.toastTimer =

            setTimeout(()=>{

                this.hideToast();

            },2500);

    }

    // ==========================================
    // OCULTAR TOAST
    // ==========================================

    hideToast(){

        if(!this.toast)
            return;

        this.toast.classList.remove(

            "show",

            "success",

            "warning",

            "error"

        );

    }
    
    // ================================
    // 💾 RESTAURAR ÚLTIMA SELECCIÓN
    // ================================

    restoreLastSelection() {

        const lastPDF =
            localStorage.getItem(
                "lastPDF"
            );

        if(!lastPDF)
            return;

        const btn =
            document.querySelector(
                `[data-path="${CSS.escape(lastPDF)}"]`
            );

        if(!btn)
            return;

        requestAnimationFrame(
            () => {

                const card =
                    btn.closest(
                        ".pet-card"
                    );

                const areasRow =
                    card?.querySelector(
                        ".areas-row"
                    );

                const chevron =
                    card?.querySelector(
                        ".pet-chevron"
                    );

                if(
                    card &&
                    areasRow &&
                    chevron
                ){

                    card.classList.add(
                        "expanded"
                    );

                    areasRow.classList.remove(
                        "areas-collapsed"
                    );

                    chevron.classList.add(
                        "open"
                    );
                }

                //btn.click();
            }
        );
    }

    /* =====================================================
        CAMBIAR BIBLIOTECA
    ===================================================== */

    async setBiblioteca(tipo) {

        if (!this.documentosManager) {

            throw new Error(
                "DocumentosManager no está configurado"
            );

        }

        // Validar y cargar antes de modificar la interfaz.
        // Si falla la carga, mantenemos la biblioteca anterior.

        const documentos = tipo === "pets"
            ? []
            : await this.documentosManager.getDocumentos(tipo);

        await this.documentosManager.cambiarBiblioteca(tipo);


        /* =====================================================
            01. ESTADO DE LA BIBLIOTECA
        ===================================================== */

        // Cerrar el panel anterior antes de
        // cambiar su contenido.
        if (this.requestVisible) {

            this.closeRequestPanel();

        }

        this.bibliotecaActual = tipo;

        // Conservar las selecciones de las otras
        // bibliotecas y actualizar la biblioteca activa.
        this.solicitudes.setBiblioteca(tipo);

        this.documentosActuales = documentos;

        this.categoriaActual = null;

        this.viewMode = "areas";

        this.currentArea = "TODOS";

        this.cards = [];

        this.filteredPets = [];

        this.activeCard = null;

        this.activeButton = null;

        this.activeAreaLabel = null;

        clearTimeout(this.searchTimeout);


        /* =====================================================
            02. BUSCADOR
        ===================================================== */

        if (this.searchInput) {

            this.searchInput.value = "";

            // En PETS se habilita al entrar
            // en la vista de procedimientos.
            //
            // En FDS y Manuales estará disponible
            // desde la pantalla de categorías.

            this.searchInput.disabled =
                tipo === "pets";

            const placeholders = {

                pets:
                    "Seleccione un área",

                fds:
                    "Buscar FDS, código o fabricante...",

                manuales:
                    "Buscar manual, marca o modelo..."

            };

            this.searchInput.placeholder =
                placeholders[tipo];

        }


        /* =====================================================
        03. BOTÓN CAMBIAR ÁREA / CATEGORÍA
        ===================================================== */

        if (this.changeAreaBtn) {

            this.changeAreaBtn.hidden = true;

            const texto =
                this.changeAreaBtn.querySelector("span");

            if (texto) {

                texto.textContent =
                    tipo === "pets"
                        ? "Cambiar área"
                        : "Cambiar categoría";

            }

            this.changeAreaBtn.setAttribute(
                "aria-label",
                tipo === "pets"
                    ? "Cambiar área"
                    : "Cambiar categoría"
            );

            this.changeAreaBtn.title =
                tipo === "pets"
                    ? "Cambiar área"
                    : "Cambiar categoría";

        }


        /* =====================================================
        04. ÁREA / CATEGORÍA ACTUAL
        ===================================================== */

        if (this.currentAreaName) {

            this.currentAreaName.textContent =
                tipo === "pets"
                    ? "Todos"
                    : "Todos";

        }

        const etiqueta = document.querySelector(
            "#currentAreaInfo .area-label"
        );

        if (etiqueta) {

            etiqueta.textContent =
                tipo === "pets"
                    ? "Área seleccionada"
                    : "Categoría seleccionada";

        }


        /* =====================================================
            05. LOGOTIPO Y TÍTULO
        ===================================================== */

        const titulos = {

            pets: {
                titulo: "PETS",
                subtitulo: "Procedimiento Escrito de Trabajo Seguro"
            },

            fds: {
                titulo: "FDS",
                subtitulo: "Fichas de Datos de Seguridad"
            },

            manuales: {
                titulo: "MANUALES",
                subtitulo: "Manuales Técnicos"
            }

        };

        const biblioteca = titulos[tipo];

        const logoTitle =
            document.getElementById("logoTitle");

        const logoSub =
            document.getElementById("logoSub");

        if (logoTitle) {

            logoTitle.textContent =
                biblioteca.titulo;

        }

        if (logoSub) {

            logoSub.textContent =
                biblioteca.subtitulo;

        }


        /* =====================================================
        06. BOTÓN DE SOLICITUDES
        ===================================================== */

        if (this.requestBtn) {

            // Las solicitudes de FDS y Manuales
            // se habilitarán al integrar solicitudes.js.

            // Habilitar las solicitudes de las
            // tres bibliotecas.

            this.requestBtn.disabled = false;

            const nombres = {

                pets: "Solicitar PETS",

                fds: "Solicitar FDS",

                manuales: "Solicitar Manuales"

            };

            const texto =
                this.requestBtn.querySelector("span");

            if (texto) {

                texto.textContent = nombres[tipo];

            }

            const descripciones = {

                pets: "Solicitar procedimientos",

                fds: "Solicitar fichas de seguridad",

                manuales: "Solicitar manuales técnicos"

            };

            this.requestBtn.title =
                descripciones[tipo];

            this.requestBtn.setAttribute(
                "aria-label",
                descripciones[tipo]
            );

        }


        /* =====================================================
            07. ACTUALIZAR EL VISOR
        ===================================================== */

        if (
            typeof this.onBibliotecaChange === "function"
        ) {

            this.onBibliotecaChange(tipo);

        }


        /* =====================================================
        08. MOSTRAR EL NUEVO CATÁLOGO
        ===================================================== */

        this.render();

    }


    /* =====================================================
    MOSTRAR CATEGORÍAS DOCUMENTALES
    ===================================================== */

    renderCategoriasDocumentales() {

        const categorias = [

            ...new Set(

                this.documentosActuales

                    .map(documento => documento.categoria)

                    .filter(Boolean)

            )

        ].sort((a, b) =>

            a.localeCompare(
                b,
                "es",
                { numeric: true }
            )

        );

        this.petsList.innerHTML = "";

        this.cards = [];

        const fragment =
            document.createDocumentFragment();

        if (!categorias.length) {

            const empty =
                document.createElement("div");

            empty.className = "empty-search-state";

            const mensaje =
                document.createElement("p");

            mensaje.textContent =
                "Todavía no hay documentos registrados.";

            empty.appendChild(mensaje);

            fragment.appendChild(empty);

        }

        categorias.forEach(categoria => {

            const total =
                this.documentosActuales.filter(
                    documento =>
                        documento.categoria === categoria
                ).length;

            const card =
                document.createElement("button");

            card.type = "button";

            card.className = "area-card";

            /* =====================================================
            IDENTIFICAR BIBLIOTECA DE LA TARJETA
            ===================================================== */

            if (this.bibliotecaActual === "fds") {

                card.classList.add(
                    "fds-category-card"
                );

            }

            if (this.bibliotecaActual === "manuales") {

                card.classList.add(
                    "manual-category-card"
                );

            }


            /* =====================================================
            NORMALIZAR NOMBRE DE LA CATEGORÍA
            ===================================================== */

            const categoriaNormalizada = String(categoria)

                .normalize("NFD")

                .replace(/[\u0300-\u036f]/g, "")

                .toLowerCase()

                .trim();


            /* =====================================================
            COLOR DE LA CATEGORÍA
            ===================================================== */

            let colores = null;

            if (this.bibliotecaActual === "fds") {

                colores =
                    FDS_CATEGORY_COLORS[categoriaNormalizada] || {
                        color: "#0D9488",
                        fondo: "#E0F2EF"
                    };

            }

            else if (this.bibliotecaActual === "manuales") {

                colores =
                    MANUALES_CATEGORY_COLORS[categoriaNormalizada] || {
                        color: "#2563EB",
                        fondo: "#E8F0FE"
                    };

            }


            if (colores) {

                card.style.setProperty(
                    "--area-color",
                    colores.color
                );

                card.style.setProperty(
                    "--category-icon-bg",
                    colores.fondo
                );

            }

            const header =
                document.createElement("div");

            header.className = "area-card-header";

            /* =====================================================
                ICONOS DE CATEGORÍAS DOCUMENTALES
            ===================================================== */

            const icono =
                document.createElement("div");

            icono.className = "area-card-icon";


            /* =====================================================
                ELEGIR PNG SEGÚN BIBLIOTECA
            ===================================================== */

            let archivo = null;

            if (this.bibliotecaActual === "fds") {

                archivo =
                    FDS_CATEGORY_ICONS[categoriaNormalizada]
                    || "otros-productos.png";

            }

            else if (this.bibliotecaActual === "manuales") {

                archivo =
                    MANUALES_CATEGORY_ICONS[categoriaNormalizada]
                    || "accesorios-automotrices.png";

            }


            /* =====================================================
            CREAR IMAGEN
            ===================================================== */

            if (archivo) {

                const imagen =
                    document.createElement("img");

                imagen.src =
                    `icons/${archivo}`;

                imagen.alt =
                    categoria;

                imagen.draggable =
                    false;

                imagen.loading =
                    "lazy";

                icono.appendChild(
                    imagen
                );

            }

            header.appendChild(icono);

            const info =
                document.createElement("div");

            info.className = "area-card-info";

            const title =
                document.createElement("div");

            title.className = "area-card-title";

            title.textContent = categoria;

            const count =
                document.createElement("div");

            count.className = "area-card-count";

            count.textContent =
                `${total} ${total === 1 ? "documento" : "documentos"}`;

            info.appendChild(title);

            info.appendChild(count);

            card.appendChild(header);

            card.appendChild(info);

            card.addEventListener("click", () => {

                this.selectCategoriaDocumental(
                    categoria
                );

            });

            fragment.appendChild(card);

        });

        this.petsList.appendChild(fragment);

        if (this.petsCounter) {

            this.petsCounter.textContent =
                `${categorias.length} categorías`;

        }

    }


    /* =====================================================
    SELECCIONAR CATEGORÍA DOCUMENTAL
    ===================================================== */

    selectCategoriaDocumental(categoria) {

        this.categoriaActual = categoria;

        this.viewMode = "pets";

        if (this.currentAreaName) {

            this.currentAreaName.textContent =
                categoria;

        }

        if (this.changeAreaBtn) {

            this.changeAreaBtn.hidden = false;

        }

        if (this.searchInput) {

            this.searchInput.disabled = false;

            this.searchInput.value = "";

            this.searchInput.placeholder =
                this.bibliotecaActual === "fds"
                    ? "Buscar FDS, código o fabricante..."
                    : "Buscar manual, marca o modelo...";

        }

        if (this.searchClear) {

            this.searchClear.hidden = true;

        }

        this.render();

    }


    /* =====================================================
        MOSTRAR DOCUMENTOS — FDS Y MANUALES
    ===================================================== */

    renderDocumentos(resultados = null) {

        // Limpiar las tarjetas anteriores.
        this.petsList.innerHTML = "";

        // Restablecer la posición del listado.
        this.petsList.scrollTop = 0;

        this.petsList.scrollLeft = 0;

        // Reiniciar las referencias de las tarjetas.
        this.cards = [];

        // Si recibimos resultados de una búsqueda,
        // mostrarlos sin filtrar por categoría.
        //
        // En caso contrario, mostrar únicamente
        // los documentos de la categoría abierta.

        const documentos = Array.isArray(resultados)

            ? resultados

            : this.documentosActuales.filter(
                documento =>
                    documento.categoria === this.categoriaActual
            );

        const fragment = document.createDocumentFragment();

        // ==========================================
        // SIN RESULTADOS
        // ==========================================

        if (!documentos.length) {

            const empty =
                document.createElement("div");

            empty.className =
                "empty-search-state";

            const mensaje =
                document.createElement("p");

            mensaje.textContent =
                resultados !== null
                    ? "No se encontraron documentos."
                    : "Esta categoría no tiene documentos.";

            empty.appendChild(mensaje);

            fragment.appendChild(empty);

        }

        documentos.forEach(documento => {

            // ==========================================
            // TARJETA
            // ==========================================

            const card = document.createElement("div");

            card.className = "pet-card document-card";

            card.setAttribute("role", "listitem");

            // ==========================================
            // CÓDIGO Y VERSIÓN
            // ==========================================

            const numero = document.createElement("div");

            numero.className = "pet-number-row";

            const codigo = document.createElement("span");

            codigo.className = "pet-number document-card-code";

            const identificador = (documento.id || "")
                .replace(/^FDS-/i, "FDS ")
                .replace(/^MAN-/i, "MAN ");

            const version = documento.version
                ? ` · VER. ${documento.version}`
                : "";

            codigo.textContent = identificador + version;

            numero.appendChild(codigo);

            card.appendChild(numero);

            // ==========================================
            // TÍTULO
            // ==========================================

            const header = document.createElement("div");

            header.className = "pet-card-header";

            const title = document.createElement("div");

            title.className = "pet-title document-card-title";

            title.textContent =
                documento.nombre || "Sin título";

            header.appendChild(title);

            card.appendChild(header);

            // ==========================================
            // INFORMACIÓN Y BOTÓN
            // ==========================================

            const footer = document.createElement("div");

            footer.className = "document-card-footer";

            const info = document.createElement("div");

            info.className = "document-card-info";

            if (this.bibliotecaActual === "fds") {

                info.textContent = [

                    documento.fabricante,

                    documento.presentacion

                ].filter(Boolean).join(" · ");

            } else {

                info.textContent = [

                    documento.marca,

                    documento.modelo

                ].filter(Boolean).join(" · ");

            }

            const boton = document.createElement("button");

            boton.type = "button";

            boton.className = "document-card-open";

            boton.textContent =
                this.bibliotecaActual === "fds"
                    ? "Ver FDS ↗"
                    : "Ver manual ↗";

            boton.setAttribute(
                "aria-label",
                `Abrir ${documento.nombre}`
            );

            boton.addEventListener("click", async () => {

                if (!documento.path) {

                    this.showToast(
                        "Este documento no tiene una ruta válida.",
                        "error"
                    );

                    return;

                }

                try {

                    this.petsList
                        .querySelectorAll(".document-card.active")
                        .forEach(elemento => {

                            elemento.classList.remove("active");

                        });

                    card.classList.add("active");

                    await this.onOpenPDF?.(

                        documento.path,

                        documento.nombre,

                        documento.categoria,

                        documento

                    );

                } catch (error) {

                    card.classList.remove("active");

                    console.error(
                        "Error al abrir el documento:",
                        error
                    );

                    this.showToast(
                        "No se pudo abrir el documento.",
                        "error"
                    );

                }

            });

            footer.appendChild(info);

            footer.appendChild(boton);

            card.appendChild(footer);

            fragment.appendChild(card);

        });

        this.petsList.appendChild(fragment);

        // ==========================================
        // CONTADOR
        // ==========================================

        if (this.petsCounter) {

            const total = documentos.length;

            this.petsCounter.textContent =
                `${total} ${total === 1
                    ? "documento"
                    : "documentos"}`;

        }

    }


    /* =====================================================
        REGRESAR A CATEGORÍAS
    ===================================================== */

    volverCategoriasDocumentales() {

        clearTimeout(this.searchTimeout);

        this.categoriaActual = null;

        this.viewMode = "areas";

        if (this.currentAreaName) {

            this.currentAreaName.textContent =
                "Todas las categorías";

        }

        if (this.changeAreaBtn) {

            this.changeAreaBtn.hidden = true;

        }

        if (this.searchInput) {

            this.searchInput.value = "";

            this.searchInput.disabled = false;

            this.searchInput.placeholder =
                this.bibliotecaActual === "fds"
                    ? "Buscar FDS, código o fabricante..."
                    : "Buscar manual, marca o modelo...";

        }

        if (this.searchClear) {

            this.searchClear.hidden = true;

        }

        this.render();

    }
}

