import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

import { PDFViewer }
from "./pdf-viewer.js";

import { ZoomManager }
from "./zoom.js";

import { Sidebar }
from "./sidebar.js";

// ================================================================
// 🛑 PATCH: SILENCIAR ERRORES DE WORKER (AGREGAR AQUÍ)
// ================================================================

// ✅ Parchear la función ensureNotTerminated del worker
(function patchWorkerErrors() {
    // Crear un filtro para errores de worker
    const workerErrorFilter = (message) => {
        return message?.includes?.('Worker was terminated') ||
               message?.includes?.('Worker was destroyed') ||
               message?.includes?.('ensureNotTerminated');
    };

    // ✅ Capturar errores de promesas
    window.addEventListener('unhandledrejection', function(event) {
        const error = event.reason;
        const msg = error?.message || error?.toString?.() || '';
        
        if (workerErrorFilter(msg)) {
            event.preventDefault();
            event.stopPropagation();
            console.debug('⏹️ Worker error silenciado');
            return true;
        }
    });

    // ✅ Capturar errores de eventos
    window.addEventListener('error', function(event) {
        const msg = event.message || '';
        if (workerErrorFilter(msg)) {
            event.preventDefault();
            event.stopPropagation();
            console.debug('⏹️ Worker error silenciado');
            return true;
        }
    }, true);

    // ✅ Parchear console.error para filtrar errores de worker
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const msg = args.join(' ');
        if (workerErrorFilter(msg)) {
            // Silenciar completamente
            return;
        }
        originalConsoleError.apply(console, args);
    };

    //console.log('✅ Worker error filter installed');
})();

// =========================================================
// LOADERS PARA PETS
// =========================================================

// ================================
// LOADER DE INICIO (SPLASH)
// ================================

function showInitialSplash() {
    const splash = document.getElementById('initialSplash');
    if (splash) splash.classList.remove('hide');
}

function hideInitialSplash() {
    const splash = document.getElementById('initialSplash');
    if (splash) splash.classList.add('hide');
}

// ================================
// LOADER DE ÁREA (CARGA CON PORCENTAJE)
// ================================

class AreaLoader {
    constructor() {
        this.el = document.getElementById('areaLoader');
        this.icon = document.getElementById('loaderIcon');
        this.area = document.getElementById('loaderArea');
        this.total = document.getElementById('loaderTotal');
        this.fill = document.getElementById('loaderFill');
        this.percentage = document.getElementById('loaderPercentage');
        this.counter = document.getElementById('loaderCounter');
        this.petCode = document.getElementById('loaderPetCode');
        this.petTitle = document.getElementById('loaderPetTitle');
        this.list = document.getElementById('loaderList');
        this.loadedCount = document.getElementById('loaderLoadedCount');
        
        this.isActive = false;
        this.cancelRequested = false;
        this.pets = [];
        this.currentIndex = 0;
    }
    
    show(area, pets, icon = '🔄') {
        if (this.isActive) {
            this.cancelRequested = true;
            setTimeout(() => {
                this.cancelRequested = false;
                this.show(area, pets, icon);
            }, 150);
            return;
        }
        
        this.isActive = true;
        this.cancelRequested = false;
        this.pets = pets || [];
        this.currentIndex = 0;
        
        // Configurar UI
        this.icon.textContent = icon;
        this.area.textContent = area;
        this.total.textContent = `${this.pets.length} procedimientos`;
        this.fill.style.width = '0%';
        this.percentage.textContent = '0%';
        this.counter.textContent = `PET 000 de ${String(this.pets.length).padStart(3, '0')}`;
        this.petCode.textContent = 'Cargando...';
        this.petTitle.textContent = 'Preparando procedimientos...';
        this.loadedCount.textContent = `0 / ${this.pets.length}`;
        this.list.innerHTML = '';
        
        // Mostrar loader
        this.el.style.display = 'flex';
        
        // Iniciar carga
        this.loadNext();
    }
    
    loadNext() {
        if (this.cancelRequested || this.currentIndex >= this.pets.length) {
            this.complete();
            return;
        }
        
        const pet = this.pets[this.currentIndex];
        const total = this.pets.length;
        const current = this.currentIndex + 1;
        const progress = (current / total) * 100;
        
        // Actualizar barra
        this.fill.style.width = progress + '%';
        this.percentage.textContent = Math.round(progress) + '%';
        
        // Actualizar contador
        const currentStr = String(current).padStart(3, '0');
        const totalStr = String(total).padStart(3, '0');
        this.counter.textContent = `PET ${currentStr} de ${totalStr}`;
        this.loadedCount.textContent = `${current} / ${total}`;
        
        // Actualizar PET actual
        if (pet) {
            this.petCode.textContent = `${pet.id} · VER. ${pet.version || '01'}`;
            this.petTitle.textContent = pet.title || 'Sin título';
        }
        
        // Añadir a la lista
        this.addToList(pet, current);
        
        this.currentIndex++;
        
        // Velocidad variable
        const baseDelay = 80;
        const extraDelay = Math.max(0, (this.currentIndex / total) * 60);
        const delay = baseDelay + extraDelay;
        
        setTimeout(() => this.loadNext(), delay);
    }
    
    addToList(pet, index) {
        const item = document.createElement('div');
        item.className = 'loader-list-item';
        item.innerHTML = `
            <span class="item-icon">✅</span>
            <span class="item-code">${pet.id}</span>
            <span class="item-title">${this.truncate(pet.title || 'Sin título', 40)}</span>
            <span class="item-status">Cargado</span>
        `;
        this.list.appendChild(item);
        this.list.scrollTop = this.list.scrollHeight;
    }
    
    complete() {
        this.fill.style.width = '100%';
        this.percentage.textContent = '100%';
        this.petCode.textContent = '✅ Completado';
        this.petTitle.textContent = 'Todos los procedimientos cargados';
        
        setTimeout(() => {
            this.hide();
        }, 600);
    }
    
    hide() {
        this.el.style.display = 'none';
        this.isActive = false;
        this.cancelRequested = false;
        
        document.dispatchEvent(new CustomEvent('area-loaded', {
            detail: { area: this.area.textContent }
        }));
    }
    
    truncate(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// ================================
// LOADER DE DESCARGA DE PDF
// ================================

class PDFDownloadLoader {
    constructor() {
        this.el = document.getElementById('pdfDownloadLoader');
        this.petName = document.getElementById('downloadPetName');
        this.area = document.getElementById('downloadArea');
        this.fill = document.getElementById('downloadFill');
        this.percentage = document.getElementById('downloadPercentage');
        this.size = document.getElementById('downloadSize');
        this.speed = document.getElementById('downloadSpeed');
        this.petCode = document.getElementById('downloadPetCode');
        this.petTitle = document.getElementById('downloadPetTitle');
        
        this.isActive = false;
        this.startTime = 0;
        this.loadedBytes = 0;
        this.totalBytes = 0;
        this.lastUpdate = 0;
    }
    
    show(pet) {
        this.isActive = true;
        this.startTime = Date.now();
        this.loadedBytes = 0;
        this.totalBytes = 0;
        this.lastUpdate = 0;

        // =========================================================
        // 📍 ASEGURAR QUE EL LOADER PERTENEZCA AL VIEWER
        // =========================================================

        const viewerContainer = document.getElementById("viewerContainer");

        if (viewerContainer && this.el) {

            // Si el loader está fuera del visor,
            // moverlo dentro del contenedor correcto.
            if (this.el.parentElement !== viewerContainer) {
                viewerContainer.appendChild(this.el);
            }
        }

        // =========================================================
        // 📝 CONFIGURAR INFORMACIÓN
        // =========================================================

        this.petName.textContent =
            pet.name || 'Cargando PDF...';

        this.area.textContent =
            pet.area || '--';

        this.petCode.textContent =
            pet.code || 'PET --- · VER. --';

        this.petTitle.textContent =
            pet.title || 'Cargando procedimiento...';

        this.fill.style.width = '0%';

        this.percentage.textContent = '0%';

        this.size.textContent =
            '0.0 / 0.0 MB';

        this.speed.textContent =
            '-- KB/s';

        // =========================================================
        // 📐 LOADER = TODA EL ÁREA DEL VISOR
        // =========================================================

        this.el.style.display = 'flex';

        this.el.style.position = 'absolute';

        this.el.style.inset = '0';

        this.el.style.width = '100%';

        this.el.style.height = '100%';

        this.el.style.margin = '0';

        this.el.style.padding = '0';

        this.el.style.alignItems = 'center';

        this.el.style.justifyContent = 'center';

        this.el.style.zIndex = '999';

        this.el.style.flex = 'none';

        this.el.style.pointerEvents = 'auto';

        // =========================================================
        // 🖥️ OVERLAY
        // =========================================================

        const overlay =
            this.el.querySelector('.pdf-download-overlay');

        if (overlay) {

            overlay.style.position = 'absolute';

            overlay.style.inset = '0';

            overlay.style.width = '100%';

            overlay.style.height = '100%';

            overlay.style.margin = '0';

            overlay.style.padding = '0';

            overlay.style.pointerEvents = 'auto';
        }

        // =========================================================
        // 🎯 CARD CENTRADA
        // =========================================================

        const card =
            this.el.querySelector('.pdf-download-card');

        if (card) {

            card.style.position = 'relative';

            card.style.margin = '0';

            card.style.top = 'auto';

            card.style.left = 'auto';

            card.style.right = 'auto';

            card.style.bottom = 'auto';

            card.style.transform = 'none';

            card.style.alignSelf = 'center';

            card.style.pointerEvents = 'auto';
        }
    }
    
    update(loaded, total) {
        if (!this.isActive) return;
        
        this.loadedBytes = loaded;
        this.totalBytes = total;
        
        const progress = total > 0 ? (loaded / total) * 100 : 0;
        const progressStr = Math.round(progress);
        
        // Actualizar barra
        this.fill.style.width = progress + '%';
        this.percentage.textContent = progressStr + '%';
        
        // Actualizar tamaño
        const loadedMB = (loaded / (1024 * 1024)).toFixed(1);
        const totalMB = (total / (1024 * 1024)).toFixed(1);
        this.size.textContent = `${loadedMB} / ${totalMB} MB`;
        
        // Calcular velocidad
        const now = Date.now();
        if (now - this.lastUpdate > 500) {
            const elapsed = (now - this.startTime) / 1000;
            if (elapsed > 0) {
                const speed = (loaded / elapsed) / 1024;
                this.speed.textContent = speed < 1024 
                    ? `${Math.round(speed)} KB/s`
                    : `${(speed / 1024).toFixed(1)} MB/s`;
            }
            this.lastUpdate = now;
        }
        
        if (progress >= 100) {
            this.complete();
        }
    }
    
    complete() {
        this.fill.style.width = '100%';
        this.percentage.textContent = '100%';
        this.speed.textContent = '✅ Completado';
        
        setTimeout(() => {
            this.hide();
        }, 500);
    }
    
    hide() {
        this.el.style.display = 'none';
        this.isActive = false;
        
        document.dispatchEvent(new CustomEvent('pdf-download-complete'));
    }
    
    error(message) {
        this.percentage.textContent = '❌ Error';
        this.speed.textContent = message || 'Error al descargar';
        this.fill.style.width = '0%';
        this.fill.style.background = '#dc2626';
        
        setTimeout(() => {
            this.hide();
        }, 3000);
    }
}

// ================================
// FUNCIÓN PARA DESCARGAR PDF CON PROGRESO
// ================================

async function downloadPDFWithProgress(url, pet, onProgress) {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;
    
    while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (onProgress) {
            onProgress(loaded, total);
        }
    }
    
    const allChunks = new Uint8Array(loaded);
    let position = 0;
    for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
    }
    
    return allChunks.buffer;
}

// ================================
// INSTANCIAR LOADERS
// ================================

const areaLoader = new AreaLoader();
const downloadLoader = new PDFDownloadLoader();

// ✅ Exponer globalmente para debugging
window.downloadLoader = downloadLoader;

// ================================
// FUNCIÓN PARA OBTENER PETS POR ÁREA
// ================================

// ================================
// PROCESAMIENTO DE DATOS DE PETS DESDE CONFIG.JSON
// ================================

// ──────────────────────────────────────────────
// VARIABLE GLOBAL PARA ALMACENAR PETS
// ──────────────────────────────────────────────

let PETS_BY_AREA = {};
let ALL_PETS = [];

// ──────────────────────────────────────────────
// PROCESAR PETS DEL CONFIG
// ──────────────────────────────────────────────

function processPetsFromConfig(configData) {
    if (!configData || !configData.pets) {
        console.warn('⚠️ No se encontraron PETS en la configuración');
        return;
    }
    
    const petsConfig = configData.pets;
    const grouped = {};
    const all = [];
    
    petsConfig.forEach((pet) => {
        // Extraer número del PET desde el nombre
        const match = pet.nombre.match(/^(\d+)-/);
        const petNumber = match ? match[1] : '000';
        
        // Versión del PET
        const versionMatch = pet.nombre.match(/V(\d{2})/i);
        const version = versionMatch ? versionMatch[1] : '01';
        
        // Crear objeto base del PET
        const petData = {
            id: `PET ${petNumber}`,
            version: version,
            title: pet.nombre,
            nombre: pet.nombre,
            archivos: pet.archivos || {}
        };
        
        // Agregar a "Todos" si no existe
        if (!all.find(p => p.id === petData.id)) {
            all.push(petData);
        }
        
        // Procesar archivos por área
        const areas = Object.keys(pet.archivos || {});
        areas.forEach(area => {
            const cleanArea = area.trim();
            if (!grouped[cleanArea]) {
                grouped[cleanArea] = [];
            }
            
            // Verificar si ya existe este PET en esta área
            const exists = grouped[cleanArea].find(p => p.id === petData.id);
            if (!exists) {
                const areaPet = {
                    ...petData,
                    area: cleanArea,
                    path: pet.archivos[area]
                };
                grouped[cleanArea].push(areaPet);
            }
        });
    });
    
    grouped['Todos'] = all;
    PETS_BY_AREA = grouped;
    ALL_PETS = all;
    
    console.log(`✅ ${all.length} PETS procesados en ${Object.keys(grouped).length - 1} áreas`);
    return grouped;
}

// ================================
// FUNCIÓN PARA OBTENER PETS POR ÁREA (BAJO DEMANDA)
// ================================

function getPetsByArea(area) {
    // Si ya tenemos los datos, usarlos
    if (Object.keys(PETS_BY_AREA).length > 0) {
        return PETS_BY_AREA[area] || PETS_BY_AREA['Todos'] || [];
    }
    
    // Si no, procesar desde config
    if (config && config.pets) {
        processPetsFromConfig(config);
        return PETS_BY_AREA[area] || PETS_BY_AREA['Todos'] || [];
    }
    
    console.warn('⚠️ No hay datos de PETS disponibles');
    return [];
}

// ──────────────────────────────────────────────
// FUNCIÓN PARA OBTENER TODOS LOS PETS
// ──────────────────────────────────────────────

function getAllPets() {
    if (ALL_PETS.length === 0 && config) {
        processPetsFromConfig(config);
    }
    return ALL_PETS;
}

// ──────────────────────────────────────────────
// FUNCIÓN PARA OBTENER LISTA DE ÁREAS
// ──────────────────────────────────────────────

function getAreasList() {
    if (Object.keys(PETS_BY_AREA).length === 0 && config) {
        processPetsFromConfig(config);
    }
    return Object.keys(PETS_BY_AREA).filter(a => a !== 'Todos').sort();
}

// ──────────────────────────────────────────────
// FUNCIÓN PARA CONTAR PETS POR ÁREA
// ──────────────────────────────────────────────

function getPetCountByArea(area) {
    const pets = getPetsByArea(area);
    return pets ? pets.length : 0;
}

// ──────────────────────────────────────────────
// EXPONER FUNCIONES GLOBALMENTE
// ──────────────────────────────────────────────

window.getPetsByArea = getPetsByArea;
window.getAllPets = getAllPets;
window.getAreasList = getAreasList;
window.getPetCountByArea = getPetCountByArea;
window.PETS_BY_AREA = PETS_BY_AREA;
window.ALL_PETS = ALL_PETS;

// ================================
// FUNCIÓN PARA CAMBIAR ÁREA CON LOADER
// ================================

function changeAreaWithLoader(area) {
    const pets = getPetsByArea(area);
    const count = pets.length;
    const icon = area === 'Todos' ? '🚀' : '🔄';
    
    console.log(`📂 Cambiando a área: ${area} (${count} PETS)`);
    
    areaLoader.show(area, pets, icon);
    
    // Actualizar UI del sidebar
    const areaNameEl = document.getElementById('currentAreaName');
    if (areaNameEl) areaNameEl.textContent = area;
}

// ================================
// 🚀 START - INICIO RÁPIDO SIN CARGA MASIVA
// ================================

async function initializeAppWithLoader() {
    // Mostrar splash rápido
    showInitialSplash();
    
    try {
        // Cargar solo la configuración (sin PETS)
        config = await loadConfig();
        
        createSupabaseClient(config.supabaseUrl, config.supabaseKey);
        
        // Ocultar splash después de 800ms
        await new Promise(resolve => setTimeout(resolve, 800));
        hideInitialSplash();
        
        // Inicializar la app directamente (sin cargar todos los PETS)
        initializeApp();
        
        console.log('✅ App iniciada (carga bajo demanda)');
        
    } catch (error) {
        console.error('❌ Error al iniciar:', error);
        hideInitialSplash();
        showFatalError('No se pudo iniciar la aplicación', null);
    }
}

// ================================
// 🌍 GLOBALS
// ================================

let supabase  = null;
let viewer    = null;
let zoom      = null;
let sidebar   = null;
let config    = null;

let currentPath = null;
let loading     = false;
const versionCache = new Map();

const pdfCache = new Map();
const MAX_CACHE_SIZE = 10;

let isMobile = window.matchMedia("(max-width: 900px)").matches;

// ================================
// 🚀 START - CON LOADER DE INICIO
// ================================

window.addEventListener("DOMContentLoaded", initializeAppWithLoader);

// ================================
// 🚀 INIT APP
// ================================

async function initializeApp() {
    try {
        // No mostrar splash aquí, ya lo maneja initializeAppWithLoader
        // togglePDFSplash(true);

        pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.min.js";

        config = await loadConfig();

        createSupabaseClient(config.supabaseUrl, config.supabaseKey);

        const viewerContainer = document.getElementById("viewerContainer");
        const pdfViewerEl     = document.getElementById("pdfViewer");

        if (!viewerContainer || !pdfViewerEl) {
            throw new Error("Estructura HTML inválida");
        }

        viewer = new PDFViewer({
            container: viewerContainer,
            viewer: pdfViewerEl,
            onPageChange: (page, total) => {
                updatePageUI(page, total);
                syncSearchWithCurrentPage(page);
            }
        });

        zoom = new ZoomManager({ viewer });

        sidebar = new Sidebar({
            config,
            onOpenPDF: openPDF,
            onTaskSelected: handleTaskSelection
        });

        initializeKeyboard();
        initializeResize();
        initializeVisibility();
        initializeOnlineStatus();
        initializeMobileSidebar();
        initializePageNav();
        initializeExplorer();

        console.log("✅ APP READY");
        togglePDFSplash(false);

    } catch (error) {
        console.error("❌ INIT ERROR:", error);
        showFatalError("No se pudo iniciar el visor", null);
    }
}

// ================================
// 📖 EXPLORER
// ================================

let explorerOpen = false;

const explorer = {

    panel:null,

    overlay:null,

    button:null,

    close:null,

    tabs:[],

    title:null,

    subtitle:null,

    counter:null,

    activeTab:"steps",

    views:{},

    stepsView:null,

    searchView:null,

    // ===============================
    // BUSCADOR PDF
    // ===============================

    searchPanel:null,

    searchInput:null,

    searchClear:null,

    // Botones de navegación
    searchPrev:null,

    searchNext:null,

    // Información
    searchInfo:null,

    searchCounter:null,

    // Contenedores
    searchResults:null,

    searchList:null,

    searchEmpty:null,

    // Estado
    searchMatches:[],

    currentMatch:-1,

    searchTimer:null

};

function initializeExplorer(){

    explorer.panel =
        document.getElementById(
            "explorerPanel"
        );

    explorer.overlay =
        document.getElementById(
            "explorerOverlay"
        );

    explorer.button =
        document.getElementById(
            "explorerBtn"
        );

    explorer.close =
        document.getElementById(
            "closeExplorerBtn"
        );

    explorer.stepsView =
        document.getElementById(
            "stepsView"
        );

    explorer.searchView =
        document.getElementById(
            "searchView"
        );

    // ===============================
    // BUSCADOR PDF
    // ===============================

    explorer.searchPanel =
        document.getElementById(
            "pdfSearchPanel"
        );

    explorer.searchInput =
        document.getElementById(
            "pdfSearchInput"
        );

    explorer.searchClear =
        document.getElementById(
            "pdfSearchClear"
        );

    // -----------------------------
    // Navegación
    // -----------------------------

    explorer.searchPrev =
        document.getElementById(
            "pdfSearchPrev"
        );

    explorer.searchNext =
        document.getElementById(
            "pdfSearchNext"
        );

    // -----------------------------
    // Información
    // -----------------------------

    explorer.searchInfo =
        document.getElementById(
            "pdfSearchInfo"
        );

    explorer.searchCounter =
        document.getElementById(
            "pdfSearchCounter"
        );

    // -----------------------------
    // Contenedores
    // -----------------------------

    explorer.searchResults =
        document.getElementById(
            "pdfSearchResults"
        );

    explorer.searchList =
        document.getElementById(
            "pdfSearchList"
        );

    explorer.searchEmpty =
        document.getElementById(
            "pdfSearchEmpty"
        );

    explorer.title =
        document.getElementById(
            "explorerTitle"
        );

    explorer.subtitle =
        document.getElementById(
            "explorerSubtitle"
        );

    explorer.tabs = [

        ...document.querySelectorAll(
            ".explorer-tab"
        )

    ];

    explorer.button?.addEventListener(

        "click",

        toggleExplorer

    );

    explorer.close?.addEventListener(

        "click",

        closeExplorer

    );

    explorer.overlay?.addEventListener(

        "click",

        closeExplorer

    );

    explorer.views = {

        steps: explorer.stepsView,

        search: explorer.searchView

    };

    initializeExplorerEvents();

    if(!explorer.panel){

        console.warn(
            "Explorer Panel no encontrado."
        );

        return;

    }

}

// ================================
// EVENTOS EXPLORADOR
// ================================

function initializeExplorerEvents(){

    // -------------------------
    // Tabs
    // -------------------------

    explorer.tabs.forEach(tab=>{

        tab.addEventListener("click",()=>{

            const view =
                tab.dataset.view;

            changeExplorerTab(view);

        });

    });

    // -------------------------
    // Input
    // -------------------------

    explorer.searchInput?.addEventListener(

        "input",

        handleExplorerSearch

    );

    // -------------------------
    // Limpiar
    // -------------------------

    explorer.searchClear?.addEventListener(

        "click",

        clearExplorerSearch

    );

    // -------------------------
    // Navegación de resultados
    // -------------------------

    explorer.searchPrev?.addEventListener(

        "click",

        ()=>{

            navigateSearchResults(-1);

        }

    );

    explorer.searchNext?.addEventListener(

        "click",

        ()=>{

            navigateSearchResults(1);

        }

    );

    explorer.searchInput?.addEventListener(

        "keydown",

        event=>{

            switch(event.key){

                case "ArrowDown":

                    event.preventDefault();

                    navigateSearchResults(+1);

                    break;

                case "ArrowUp":

                    event.preventDefault();

                    navigateSearchResults(-1);

                    break;

                case "Enter":

                    event.preventDefault();

                    if(explorer.searchMatches.length){

                        openSearchResult(

                            explorer.currentMatch < 0
                                ? 0
                                : explorer.currentMatch

                        );

                    }

                    break;

                case "Escape":

                    clearExplorerSearch();

                    break;

            }

        }

    );
        // -------------------------
    // Eventos del PDFViewer
    // -------------------------

    document.addEventListener(

        "pdf-search-results",

        event=>{

            explorer.searchMatches =

                Array.isArray(event.detail)
                    ? event.detail
                    : [];

            renderSearchResults(

                explorer.searchInput?.value || ""

            );

        }

    );

    document.addEventListener(

        "pdf-search-active",

        event=>{

            const activeId = event.detail?.id;

            if(activeId == null){

                return;

            }

            const index =

                explorer.searchMatches.findIndex(

                    item => item.id === activeId

                );

            if(index < 0){

                return;

            }

            explorer.currentMatch = index;

            updateActiveSearchCard();

        }

    );

}

// ================================
// CAMBIAR TAB
// ================================

function changeExplorerTab(view){

    explorer.activeTab = view;

    explorer.tabs.forEach(tab=>{

        tab.classList.toggle(

            "active",

            tab.dataset.view===view

        );

    });

    Object.entries(explorer.views)

        .forEach(([key,el])=>{

            if(!el) return;

            el.hidden =
                key!==view;

        });

    if(view==="search"){

        explorer.searchInput?.focus();

    }

}

// ================================
// INPUT BUSCADOR
// ================================

function handleExplorerSearch(){

    clearTimeout(

        explorer.searchTimer

    );

    explorer.searchTimer =

        setTimeout(

            performExplorerSearch,

            250

        );

}

// ================================
// LIMPIAR BUSCADOR
// ================================

function clearExplorerSearch(){

    explorer.searchInput.value = "";

    explorer.searchMatches = [];

    explorer.currentMatch = -1;

    // -------------------------
    // Limpiar resultados
    // -------------------------

    if(explorer.searchResults){

        explorer.searchResults.innerHTML = "";

    }

    if(explorer.searchList){

        explorer.searchList.innerHTML = "";

    }

    // -------------------------
    // Estado vacío
    // -------------------------

    if(explorer.searchEmpty){

        explorer.searchEmpty.hidden = false;

    }

    // -------------------------
    // Información
    // -------------------------

    if(explorer.searchInfo){

        explorer.searchInfo.textContent = "";

        explorer.searchInfo.className = "";

    }

    // -------------------------
    // Contador
    // -------------------------

    if(explorer.searchCounter){

        explorer.searchCounter.textContent = "0 resultados";

    }

    explorer.searchInput?.focus();

    explorer.searchResults

        ?.querySelectorAll(

            ".pdf-search-card"

        )

        .forEach(card=>{

            card.classList.remove("active");

            card.removeAttribute("aria-current");

        });

    if(viewer?.clearSearchHighlight){

        viewer.clearSearchHighlight();

    }

}

// ================================
// BUSCAR
// ================================

async function performExplorerSearch(){

    const query =
        explorer.searchInput
            ?.value
            ?.trim();

    if(!query){

        clearExplorerSearch();

        return;

    }

    if(!viewer){

        return;

    }

    explorer.searchInfo.className =
        "pdf-search-info-loading";

    explorer.searchInfo.innerHTML = `

        <span class="pdf-search-spinner"></span>

        Buscando...

    `;

    if(explorer.searchResults){

        explorer.searchResults.innerHTML = "";

    }

    if(explorer.searchList){

        explorer.searchList.innerHTML = "";

    }

    if(explorer.searchEmpty){

        explorer.searchEmpty.hidden = true;

    }

    explorer.searchMatches = [];

    explorer.currentMatch = -1;

    try{

        // La búsqueda ahora la controla PDFViewer.
        // Los resultados llegarán mediante el evento
        // "pdf-search-results".

        await viewer.searchText(query);

    }

    catch(error){

        console.error(error);

        explorer.searchInfo.className =
            "pdf-search-info-error";

        explorer.searchInfo.textContent =
            "No se pudo realizar la búsqueda.";

    }

}

// ================================
// RENDER SEARCH RESULTS
// ================================

function renderSearchResults(query){

    if(!explorer.searchList){

        return;

    }

    const matches = explorer.searchMatches;

    // -------------------------
    // Limpiar lista
    // -------------------------

    explorer.searchList.innerHTML = "";

    // -------------------------
    // Sin resultados
    // -------------------------

    if(!matches.length){

        if(explorer.searchInfo){

            explorer.searchInfo.className =
                "pdf-search-info-error";

            explorer.searchInfo.textContent =
                "No se encontraron coincidencias.";

        }

        if(explorer.searchCounter){

            explorer.searchCounter.textContent =
                "0 resultados";

        }

        if(explorer.searchEmpty){

            explorer.searchEmpty.hidden = false;

        }

        return;

    }

    // -------------------------
    // Hay resultados
    // -------------------------

    if(explorer.searchInfo){

        explorer.searchInfo.className =
            "pdf-search-info-success";

        explorer.searchInfo.textContent =
            `${matches.length} coincidencias encontradas`;

    }

    if(explorer.searchCounter){

        explorer.searchCounter.textContent =
            `${matches.length} resultados`;

    }

    if(explorer.searchEmpty){

        explorer.searchEmpty.hidden = true;

    }

    // -------------------------
    // Crear tarjetas
    // -------------------------

    const fragment =
        document.createDocumentFragment();

    matches.forEach((match,index)=>{

        const card =

            createSearchCard(

                match,

                query,

                index

            );

        fragment.appendChild(card);

    });

    explorer.searchList.appendChild(fragment);

    // -------------------------
    // Primer resultado activo
    // -------------------------

    explorer.currentMatch = 0;

    updateActiveSearchCard();

    explorer.searchInput?.focus();

}

// ================================
// CREAR TARJETA
// ================================

function createSearchCard(match,query,index){

    const card =
        document.createElement("button");

    card.type = "button";

    card.className =
        "pdf-search-card";

    card.dataset.index = index;

    card.innerHTML = `

        <div class="pdf-search-page">

            Página ${match.page}

        </div>

        <div class="pdf-search-snippet">

            ${highlightSearchText(

                match.preview,

                query

            )}

        </div>

    `;

    card.addEventListener(

        "click",

        ()=>{

            openSearchResult(index);

        }

    );

    return card;

}

// ================================
// ABRIR RESULTADO
// ================================

async function openSearchResult(index){

    const result =
        explorer.searchMatches[index];

    if(!result){

        return;

    }

    explorer.currentMatch = index;

    updateActiveSearchCard();

    try{

        if(viewer?.goToSearchResult){

            await viewer.goToSearchResult(result.id);

            return;

        }

        if(viewer?.scrollToPage){

            await viewer.scrollToPage(result.page);

        }

        if(viewer?.highlightSearchResult){

            viewer.highlightSearchResult(result);

        }

    }

    catch(error){

        console.error(

            "SEARCH NAVIGATION ERROR",

            error

        );

    }

}

// ================================
// TARJETA ACTIVA
// ================================

function updateActiveSearchCard(){

    if(!explorer.searchList){

        return;

    }

    explorer.searchList

        .querySelectorAll(

            ".pdf-search-card"

        )

        .forEach(card=>{

            card.classList.remove("active");

            card.removeAttribute("aria-current");

        });

    const active =

        explorer.searchList.querySelector(

            `[data-index="${explorer.currentMatch}"]`

        );

    if(!active){

        return;

    }

    active.classList.add("active");

    active.setAttribute(

        "aria-current",

        "true"

    );

    active.scrollIntoView({

        block:"nearest",

        behavior:"smooth"

    });

}

// ================================
// NAVEGACIÓN RESULTADOS
// ================================

function navigateSearchResults(direction){

    if(!explorer.searchMatches.length){

        return;

    }

    let index =
        explorer.currentMatch + direction;

    if(index < 0){

        index = 0;

    }

    if(index >= explorer.searchMatches.length){

        index = explorer.searchMatches.length - 1;

    }

    if(index === explorer.currentMatch){

        return;

    }

    openSearchResult(index);

}

// ================================
// SINCRONIZAR BUSCADOR
// ================================

function syncSearchWithCurrentPage(page){

    if(

        !explorer.searchMatches.length

    ){

        return;

    }

    const index =

        explorer.searchMatches.findIndex(

            match => match.page === page

        );

    if(index === -1){

        return;

    }

    if(index === explorer.currentMatch){

        return;

    }

    explorer.currentMatch = index;

    updateActiveSearchCard();

}

// ================================
// RESULTADO ACTUAL
// ================================

function setCurrentSearchResult(index){

    explorer.currentMatch = index;

    updateActiveSearchCard();

}

// ================================
// RESALTAR TEXTO
// ================================

function highlightSearchText(text,query){

    if(!text){

        return "";

    }

    const escaped =
        query.replace(

            /[.*+?^${}()|[\]\\]/g,

            "\\$&"

        );

    return text.replace(

        new RegExp(

            escaped,

            "ig"

        ),

        value =>

            `<span class="pdf-search-highlight">${value}</span>`

    );

}

function toggleExplorer(){

    if(!explorer.panel) return;

    explorerOpen
        ? closeExplorer()
        : openExplorer();

}

function openExplorer(){

    if(!explorer.panel) return;

    explorerOpen = true;

    if(viewer?.pdfDoc){

        renderExplorer();

    }

    explorer.panel.hidden = false;

    explorer.overlay.hidden = false;

    explorer.panel.setAttribute(
        "aria-hidden",
        "false"
    );

    requestAnimationFrame(()=>{

        explorer.panel.classList.add("visible");

        explorer.overlay?.classList.add("visible");

    });

}

function closeExplorer(){

    if(!explorer.panel) return;

    explorerOpen = false;

    explorer.panel.classList.remove("visible");

    explorer.overlay?.classList.remove("visible");

    setTimeout(()=>{

        explorer.panel.hidden = true;

        explorer.overlay.hidden = true;

        explorer.panel.setAttribute(
            "aria-hidden",
            "true"
        );

    },300);

}

// ================================
// 📋 RENDER EXPLORER
// ================================

function renderExplorer(){

    if(!viewer) return;

    updateExplorerInfo();

    renderTaskSteps();

}

// ================================
// 📋 RENDER TASK STEPS
// ================================

function renderTaskSteps(){

    if(!explorer.stepsView) return;

    const steps = viewer?.getTaskSteps?.() || [];

    if(!Array.isArray(steps)){

        console.warn("TaskSteps inválido:", steps);

        return;

    }

    explorer.stepsView.innerHTML = "";

    // ---------------------------------
    // Actualizar contador
    // ---------------------------------

    const counter = document.getElementById("stepsCount");

    if(counter){

        counter.textContent =
            `${steps.length} ${steps.length === 1 ? "paso" : "pasos"}`;

    }

    // ---------------------------------
    // Estado vacío
    // ---------------------------------

    if(!steps.length){

        explorer.stepsView.innerHTML = `

            <div class="explorer-empty">

                <div class="explorer-empty-icon">

                    📄

                </div>

                <h3>

                    No se encontraron pasos

                </h3>

                <p>

                    Este PET no contiene una sección
                    de pasos de la tarea reconocible.

                </p>

            </div>

        `;

        return;

    }

    // ---------------------------------
    // Ordenar pasos
    // ---------------------------------

    const orderedSteps = [...steps].sort(

        (a,b)=>a.step-b.step

    );

    // ---------------------------------
    // Crear fragmento
    // ---------------------------------

    const fragment = document.createDocumentFragment();

    orderedSteps.forEach((step,index)=>{

        const card = renderStepCard(step);

        // Animación escalonada

        card.style.animationDelay = `${index * 40}ms`;

        fragment.appendChild(card);

    });

    explorer.stepsView.appendChild(fragment);

}

// ================================
// 📄 STEP CARD (NUEVO DISEÑO)
// ================================

// ================================
// 📄 STEP CARD (CON SUBSECCIONES)
// ================================

function renderStepCard(step) {

    const card = document.createElement("button");
    card.className = "explorer-step";
    card.type = "button";
    card.dataset.step = step.step;
    card.dataset.page = step.page;
    card.dataset.id = step.id;

    // Verificar si tiene items/subsecciones
    const hasItems = step.items && step.items.length > 0;

    card.innerHTML = `

        <div class="explorer-step-header">

            <div class="explorer-step-number">
                ${step.step}
            </div>

            <div class="explorer-step-body">

                <div class="explorer-step-title">
                    ${step.title}
                </div>

                <div class="explorer-step-page">

                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true">

                        <path
                            d="M7 3H15L20 8V21H7V3Z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linejoin="round"/>

                        <path
                            d="M15 3V8H20"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linejoin="round"/>

                    </svg>

                    Página ${step.page}

                </div>

            </div>

            <div class="explorer-step-arrow">

                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    class="arrow-icon">

                    <path
                        d="M9 6L15 12L9 18"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>

                </svg>

            </div>

        </div>

        ${hasItems ? `
            <div class="explorer-step-content" style="display: none;">

                <div class="explorer-step-items">

                    ${step.items.map((item, idx) => `
                        <div class="explorer-step-item">

                            <div class="explorer-item-number">${idx + 1}</div>

                            <div class="explorer-item-text">
                                ${escapeHtml(item.text)}
                            </div>

                            <div class="explorer-item-page">
                                Pág. ${item.page}
                            </div>

                        </div>
                    `).join('')}

                </div>

            </div>
        ` : ''}

    `;

    // EVENT: Click en el header para navegar
    const header = card.querySelector(".explorer-step-header");
    header.addEventListener("click", (e) => {
        e.stopPropagation();

        // Quitar selección anterior
        document
            .querySelectorAll(".explorer-step.active")
            .forEach(el => el.classList.remove("active"));

        // Seleccionar tarjeta
        card.classList.add("active");

        // Navegar al paso
        if (viewer?.goToTaskStep) {
            viewer.goToTaskStep(step.id);
        }
    });

    // EVENT: Click en la flecha para expandir/contraer
    if (hasItems) {
        const arrow = card.querySelector(".arrow-icon");
        const content = card.querySelector(".explorer-step-content");

        arrow.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();

            const isVisible = content.style.display !== "none";
            content.style.display = isVisible ? "none" : "block";

            // Rotar la flecha
            arrow.style.transform = isVisible ? "rotate(0deg)" : "rotate(90deg)";
        });
    }

    return card;
}

// ================================
// HELPER: Escapar HTML
// ================================

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ================================
// 📄 UPDATE EXPLORER INFO
// ================================

function updateExplorerInfo(){

    if(explorer.title){

        explorer.title.textContent =

            document.getElementById(

                "topBarPetName"

            )?.textContent || "PET";

    }

    if(explorer.subtitle){

        explorer.subtitle.textContent =

            document.getElementById(

                "topBarArea"

            )?.textContent || "";

    }

}

// ================================
// 🧹 CLEAR EXPLORER
// ================================

function clearExplorer(){

    explorer.stepsView?.replaceChildren();

    explorer.searchView?.replaceChildren();

    const counter = document.getElementById("stepsCount");

    if (counter) {

        counter.textContent = "0 pasos";

    }

    if(explorer.title){

        explorer.title.textContent = "Sin documento";

    }

    if(explorer.subtitle){

        explorer.subtitle.textContent = "";

    }

}

// ================================
// 📱 MOBILE SIDEBAR
// ================================

function initializeMobileSidebar() {

    const sidebarEl  = document.getElementById("sidebar");
    const menuButton = document.getElementById("mobileMenuBtn");
    const closeBtn   = document.getElementById("closeSidebarBtn");
    const overlay    = document.getElementById("sidebarOverlay");

    if (!sidebarEl) return;

    function openSidebar() {
        sidebarEl.classList.add("mobile-open");
        overlay?.classList.add("visible");
        menuButton?.setAttribute("aria-expanded", "true");
    }

    function closeSidebar() {
        sidebarEl.classList.remove("mobile-open");
        overlay?.classList.remove("visible");
        menuButton?.setAttribute("aria-expanded", "false");
    }

    menuButton?.addEventListener("click", openSidebar);
    closeBtn?.addEventListener("click",   closeSidebar);
    overlay?.addEventListener("click",    closeSidebar);

    sidebarEl.addEventListener("click", e => {
        if (!isMobile) return;
        if (e.target.classList.contains("area-btn")) {
            setTimeout(closeSidebar, 180);
        }
    });
}

// ================================
// 📄 OPEN PDF (VERSIÓN MEJORADA)
// ================================

async function openPDF(path, petName, areaName, petData) {
    try {
        if (loading && currentPath === path) return;

        loading = true;
        currentPath = path;

        hideFatalError?.();
        clearExplorer();
        clearExplorerSearch();

        viewer?.destroy?.();
        viewer?.clear?.();

        const container = document.getElementById("pdfContainer");
        if (container) {
            container.innerHTML = "";
        }

        toggleEmptyState(false);
        updateTopBar(petName, areaName);

        // ✅ Verificar si el PDF está en caché
        let pdfData = pdfCache.get(path);
        let fromCache = false;

        if (pdfData) {
            console.log(`📦 PDF en caché: ${petName}`);
            fromCache = true;
            
            // Mostrar loader brevemente para feedback visual
            downloadLoader.show({
                name: petName || 'Cargando PDF...',
                area: areaName || '--',
                code: petData?.id || petName || 'PET ---',
                title: petData?.title || 'Cargando procedimiento...'
            });
            
            // Simular progreso rápido
            let progress = 0;
            const fastLoad = setInterval(() => {
                progress += 25;
                if (progress >= 100) {
                    clearInterval(fastLoad);
                    downloadLoader.update(100, 100);
                    setTimeout(() => downloadLoader.hide(), 300);
                } else {
                    downloadLoader.update(progress * 0.5, 100);
                }
            }, 80);
            
            // Esperar a que termine la animación
            await new Promise(resolve => setTimeout(resolve, 600));
            
        } else {
            // ✅ Descargar PDF con progreso
            const pdfUrl = await buildPDFUrl(path);
            
            downloadLoader.show({
                name: petName || 'Cargando PDF...',
                area: areaName || '--',
                code: petData?.id || petName || 'PET ---',
                title: petData?.title || 'Cargando procedimiento...'
            });
            
            pdfData = await downloadPDFWithProgress(pdfUrl, petData, (loaded, total) => {
                downloadLoader.update(loaded, total);
            });
            
            // ✅ Guardar en caché
            if (pdfCache.size >= MAX_CACHE_SIZE) {
                // Eliminar el primer elemento (FIFO)
                const firstKey = pdfCache.keys().next().value;
                pdfCache.delete(firstKey);
                console.log(`🗑️ Caché lleno, eliminando: ${firstKey}`);
            }
            pdfCache.set(path, pdfData);
            //console.log(`💾 PDF cacheado: ${petName} (${pdfCache.size}/${MAX_CACHE_SIZE})`);
        }

        // Crear blob y cargar
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        
        downloadLoader.hide();
        await viewer.load(blobUrl);
        renderExplorer();
        
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    } catch (error) {
        // ... manejo de errores (mantener igual)
        const isWorkerError = 
            error?.message?.includes('Worker was terminated') ||
            error?.message?.includes('Worker was destroyed') ||
            error?.name === 'AbortException';

        if (isWorkerError) {
            console.debug('⏹️ Carga cancelada (cambio rápido de PET)');
            downloadLoader.hide();
            loading = false;
            return;
        }

        console.error("❌ PDF ERROR:", error);
        downloadLoader.error(error.message || 'Error al cargar el PDF');

        if (error?.message?.includes("expired") || error?.status === 400) {
            try {
                // ✅ Si falla, eliminar de caché y reintentar
                pdfCache.delete(path);
                const freshUrl = await buildPDFUrl(path);
                await viewer.load(freshUrl);
                downloadLoader.hide();
                return;
            } catch (e2) {
                if (e2?.message?.includes('Worker was terminated')) {
                    console.debug('⏹️ Reintento cancelado');
                    return;
                }
                console.error("❌ RETRY ERROR:", e2);
            }
        }

        clearExplorer();
        viewer?.destroy?.();
        viewer?.clear?.();

        const container = document.getElementById("pdfContainer");
        if (container) {
            container.innerHTML = "";
        }

        showFatalError("No se pudo abrir el PDF", path);

    } finally {
        loading = false;
    }
}

// ================================
// 📍 TASK SELECTION
// ================================

async function handleTaskSelection(taskId){

    if(!viewer){

        return;

    }

    try{

        await viewer.scrollToTask(taskId);

    }

    catch(error){

        console.error(

            "TASK NAVIGATION ERROR",

            error

        );

    }

}

// ================================
// 🔝 TOP BAR
// ================================

function updateTopBar(petName, areaName) {
    const nameEl = document.getElementById("topBarPetName");
    const areaEl = document.getElementById("topBarArea");
    if (nameEl) nameEl.textContent = petName  || "PET";
    if (areaEl) areaEl.textContent = areaName || "";
}

// ================================
// 📄 ESTADO VACÍO
// ================================

function toggleEmptyState(show) {
    document.getElementById("emptyState")?.classList.toggle("hidden", !show);
}

// ================================
// 🔢 NAVEGACIÓN DE PÁGINAS
// ================================

function initializePageNav() {

    const prevBtn   = document.getElementById("prevPage");
    const nextBtn   = document.getElementById("nextPage");
    const pageInput = document.getElementById("pageInput");
    
    function goToPage() {

        if (!viewer?.pdfDoc) return;

        const val = parseInt(pageInput.value, 10);

        if (
            !isNaN(val) &&
            val >= 1 &&
            val <= viewer.pdfDoc.numPages
        ) {
            viewer.scrollToPage(val);
        }
        else {
            pageInput.value = viewer.currentPage;
        }
    }

    prevBtn?.addEventListener("click", () => {
        if (!viewer?.pdfDoc) return;
        viewer.scrollToPage(viewer.currentPage - 1);
    });

    nextBtn?.addEventListener("click", () => {
        if (!viewer?.pdfDoc) return;
        viewer.scrollToPage(viewer.currentPage + 1);
    });

    pageInput?.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            goToPage();
        }
    });

    pageInput?.addEventListener("change", goToPage);

    pageInput?.addEventListener("blur", () => {

        if (!viewer?.pdfDoc)
            return;

        pageInput.value = viewer.currentPage;
    });
}

// ================================
// 🔢 UI DE PÁGINAS
// ================================

function updatePageUI(currentPage, totalPages) {
    const pageInput = document.getElementById("pageInput");
    const pageTotal = document.getElementById("pageTotal");
    const prevBtn   = document.getElementById("prevPage");
    const nextBtn   = document.getElementById("nextPage");

    if (pageInput) pageInput.value        = currentPage;
    if (pageTotal) pageTotal.textContent  = totalPages;
    if (prevBtn)   prevBtn.disabled       = currentPage <= 1;
    if (nextBtn)   nextBtn.disabled       = currentPage >= totalPages;
}

// ================================
// 🔐 SUPABASE
// ================================

function createSupabaseClient(url, key) {
    supabase = createClient(url, key);
}

async function loadConfig() {
    const r = await fetch("./config.json");
    if (!r.ok) throw new Error("No se pudo cargar config");
    const data = await r.json();
    
    return data;
}
// ================================
// ⏳ SPLASH LOADER
// ================================

function togglePDFSplash(show) {
    document.getElementById("pdfSplashLoader")
        ?.classList.toggle("show", show);
}

// ================================
// 🔗 SIGNED URL
// ================================

async function buildPDFUrl(path) {
    const { data, error } = await supabase
        .storage
        .from(config.bucket || "pets")
        .createSignedUrl(path, 3600);
    if (error) throw error;
    return data.signedUrl;
}

// ================================
// ⌨️ KEYBOARD
// ================================

function initializeKeyboard() {

    document.addEventListener("keydown", e => {

        const key = e.key;

        // Bloquear guardado e impresión
        if (e.ctrlKey && (key === "s" || key === "p")) {
            e.preventDefault();
            return;
        }

        // Zoom teclado — delegar a ZoomManager
        if (e.ctrlKey) {
            if (key === "+" || key === "=") {
                e.preventDefault();
                zoom?.step(+1);
            }
            if (key === "-") {
                e.preventDefault();
                zoom?.step(-1);
            }
            if (key === "0") {
                e.preventDefault();
                zoom?.zoomTo(1);
            }
            return;
        }

        // Flechas → páginas (solo si el foco no está en un input)
        if (document.activeElement?.tagName === "INPUT") return;

        if (key === "ArrowRight" || key === "ArrowDown") {
            viewer?.scrollToPage((viewer.currentPage || 0) + 1);
        }
        if (key === "ArrowLeft" || key === "ArrowUp") {
            viewer?.scrollToPage((viewer.currentPage || 0) - 1);
        }
    });
}

// ================================
// 📐 RESIZE
// ================================

function initializeResize() {

    let t = null;

    window.addEventListener("resize", () => {

        clearTimeout(t);
        isMobile = window.matchMedia("(max-width: 900px)").matches;

        const active = document.activeElement;

        if (
            active &&
            (
                active.id === "pageInput" ||
                active.tagName === "INPUT"
            )
        ){
            return;
        }

        t = setTimeout(() => {
            if (!viewer || !zoom) return;
            // Si estamos en modo fit, recalcular; si no, re-renderizar al zoom actual.
            // force=true → re-renderiza para reajustar nitidez aunque la escala sea igual.
            if (zoom.isFitMode) {
                zoom._calcFitScale().then(s => s && zoom.zoomTo(s));
            } else {
                viewer.setScale(zoom.targetZoom, null, true);
            }
        }, 280);

    }, { passive: true });
}

// ================================
// 👁️ VISIBILITY (renovar URL si expiró)
// ================================

function initializeVisibility() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) return;
        if (currentPath && viewer?.pdfDoc) {
            const age = Date.now() - (viewer.loadedAt || 0);
            if (age > 50 * 60 * 1000) {
                console.log("🔄 Renovando URL firmada...");
                if(currentPath){

                    buildPDFUrl(currentPath);

                }
            }
        }
    });
}

// ================================
// 🌐 ONLINE STATUS
// ================================

function initializeOnlineStatus() {
    window.addEventListener("offline", () => showLoading("Sin conexión"));
    window.addEventListener("online",  () => hideLoading());
}

/* // ================================
// ⏳ LOADING OVERLAY
// ================================

function showLoading(text) {
    let overlay = document.getElementById("loadingOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "loadingOverlay";
        overlay.innerHTML = `<div class="loader"></div><div class="loading-text">${text}</div>`;
        document.body.appendChild(overlay);
    }
    const el = overlay.querySelector(".loading-text");
    if (el) el.textContent = text;
    overlay.classList.add("show");
}

function hideLoading() {
    document.getElementById("loadingOverlay")?.classList.remove("show");
} */

// ================================
// 🚨 ERROR UI
// ================================

function showFatalError(message, retryPath) {

    let overlay = document.getElementById("errorOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "errorOverlay";
        overlay.style.cssText =
            "position:absolute;inset:0;z-index:600;display:flex;align-items:center;justify-content:center;";
        document.getElementById("viewerContainer")?.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div class="fatal-error">
            <div class="fatal-error-icon">⚠️</div>
            <div class="fatal-error-title">${message}</div>
            <div class="fatal-error-message">Verifica tu conexión o intenta con otro PET.</div>
            ${retryPath ? `<button class="fatal-error-retry" onclick="window.__retryPDF()">Reintentar</button>` : ""}
        </div>`;

    if (retryPath) {
        window.__retryPDF = () => {
            overlay.remove();
            currentPath = null;
            openPDF(retryPath);
        };
    }
}

function hideFatalError() {

    const overlay = document.getElementById("errorOverlay");

    if (overlay) {
        overlay.remove();
    }

    window.__retryPDF = null;

}

// ================================
// EXTRACT PDF VERSION
// ================================

async function extractPdfVersion(pdfUrl){

    try{

        const pdf =
            await pdfjsLib
                .getDocument(pdfUrl)
                .promise;

        const page =
            await pdf.getPage(1);

        const content =
            await page.getTextContent();

        const text =
            content.items
                .map(i => i.str)
                .join(" ");

        const match =
            text.match(
                /Versi[oó]n\s*N[°º]?\s*:?\s*(\d+)/i
            );

        return match
            ? match[1].padStart(2,"0")
            : null;

    }catch(err){

        console.error(
            "VERSION ERROR",
            err
        );

        return null;
    }
}

// ================================
// 🔒 BLOQUEAR MENÚ CONTEXTUAL
// ================================

document.addEventListener("contextmenu", e => e.preventDefault());

// ================================
// 🌍 DEBUG
// ================================

window.app = {
    getViewer()   { return viewer;   },
    getZoom()     { return zoom;     },
    getSidebar()  { return sidebar;  },
    getSupabase() { return supabase; }
};

// ================================
// 🛑 SILENCIAR ERRORES DE WORKER (GLOBAL)
// ================================

// Capturar errores de eventos
window.addEventListener('error', function(event) {
    const message = event.message || '';
    if (message.includes('Worker was terminated') ||
        message.includes('Worker was destroyed')) {
        event.preventDefault();
        event.stopPropagation();
        console.debug('⏹️ Error de worker silenciado (cambio rápido)');
        return;
    }
}, true);