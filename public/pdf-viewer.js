export class PDFViewer {

    constructor({ container, viewer, onPageChange }) {

        this.container    = container;
        this.viewer       = viewer;
        this.onPageChange = onPageChange || null;

        this.watermarkLayer =
            document.createElement("div");

        this.watermarkLayer.className =
            "pdf-watermark-layer";

        this.container.appendChild(
            this.watermarkLayer
        );

        this.pdfDoc     = null;
        this.scale      = 1;
        this.prevScale  = 1;
        this.pixelRatio = window.devicePixelRatio || 1;

        // Tipo de documento actualmente abierto:
        // pets | fds | manuales
        this.documentType =
            "pets";

        // Flag para suprimir el observer de render mientras el zoom anima
        this._zooming = false;

        this.currentPage = 1;
        this.loadedAt    = null;

        // ✅ NUEVAS VARIABLES: Control de carga para evitar conflictos
        this._loadId = 0;
        this._isLoading = false;
        this._pendingLoad = null;

        // ================================
        // 🔎 SEARCH ENGINE
        // ================================

        this.searchIndex = [];
        this.searchMatches = [];
        this.currentMatch = -1;

        // Coincidencia actualmente seleccionada
        this.activeSearchLocation = -1;

        // Total de coincidencias encontradas
        this.totalSearchLocations = 0;
        this.searchQuery = "";
        this.searchReady = false;

        // Texto por página
        this.pageTextCache = new Map();

        // Timer del buscador
        this.searchDebounce = null;

        // ================================
        // HIGHLIGHT ENGINE
        // ================================

        // (Reservado para el motor de resaltado basado en coordenadas)

        // ================================
        // ÍNDICE ESPACIAL DEL PDF
        // ================================

        // Coordenadas de todos los fragmentos de texto
        this.textCoordinates = new Map();

        // Fragmentos organizados por página
        this.pageTextFragments = new Map();

        // Coincidencias localizadas dentro del PDF
        this.searchLocations = [];

        // Capas HTML de resaltado por página
        this.highlightLayers = new Map();

        this.outlineTaskSteps = [];

        // ================================
        // 📚 SECCIONES DEL PET
        // ================================

        this.sections = {};

        this.procedureBlock = null;

        this.procedureType = null;

         // =====================================================
        // DOCUMENT OUTLINE ENGINE (V2)
        // =====================================================

        // Fragmentos originales pertenecientes al procedimiento
        this.outlineFragments = [];

        // Líneas reconstruidas del procedimiento
        this.outlineLines = [];

        // Árbol completo del documento
        this.outline = [];

        // Árbol jerárquico
        this.outlineTree = [];

        // Índice rápido
        this.outlineIndex = new Map();

        // Coordenadas físicas
        this.outlineLocations = new Map();

        // Rango del procedimiento
        this.outlineRange = {

            startPage: null,
            endPage: null,

            startIndex: null,
            endIndex: null

        };

        // Estilos detectados
        this.headingStyles = {

            normalSize:0,

            headingSize:0,

            boldFonts:new Set()

        };

        // Estadísticas
        this.outlineStats = {

            totalFragments:0,

            totalHeadings:0,

            totalLevels:0

        };

        // Pasos detectados
        this.taskSteps = [];

        // Índice rápido de encabezados
        this.taskMap = new Map();

        // Árbol jerárquico de procedimientos
        this.taskTree = [];

        // =====================================
        // SINCRONIZACIÓN CON EL SIDEBAR
        // =====================================

        // Referencia al Sidebar
        this.sidebar = null;

        // Nodo actualmente activo
        this.currentTaskNode = null;

        // Ubicación física de cada encabezado
        // id -> { page, x, y, title }
        this.taskLocations = new Map();

        // Evita emitir el mismo evento varias veces
        this.lastVisibleTask = null;

        // ================================================
        // CALLBACK DE SINCRONIZACIÓN CON EL SIDEBAR
        // ================================================

        this.onCurrentTaskChange = null;

        // Callback opcional cuando cambia el paso
        this.onTaskChange = null;
        
        // ── PAGE CACHE ──
        this.pages = [];

        // ── RENDER TASKS ──
        this.renderTasks = new Map();
        this.zoomTimeout = null;

        // ── OBSERVERS ──
        this.observer     = null;
        this.pageObserver = null;

        // Flag para suprimir el observer durante scroll programático
        this._scrolling = false;
        this._scrollEnd = null;

        this.initializeSearchShortcuts();
        this.initializeObserver();
        this.initializePageObserver();
    }

    // ================================
    // 👀 LAZY RENDER OBSERVER
    // ================================

    initializeObserver() {
        this.observer = new IntersectionObserver(
            entries => {
                if (!this.pdfDoc) return;
                if (this.pages.length === 0) return;
                if (this._zooming) return;   // no renderizar con escala vieja durante el gesto
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const pageNum = Number(entry.target.dataset.page);
                        this.renderVisiblePage(pageNum);
                    }
                });
            },
            {
                root:       this.container,
                rootMargin: "1200px 0px",
                threshold:  0
            }
        );
    }

    // ================================
    // 👀 PAGE TRACKING OBSERVER
    // ── FIX: ignorar disparos mientras
    //    _scrolling = true (scroll programático)
    // ================================

    initializePageObserver() {
        this.pageObserver = new IntersectionObserver(
            entries => {

                // Ignorar completamente si estamos en scroll programático o en zoom
                if (this._scrolling) return;
                if (this._zooming) return;

                let bestPage = null;
                let bestRatio = 0;

                this.pages.forEach(pageData => {

                    const rect =
                        pageData.pageDiv.getBoundingClientRect();

                    const visibleHeight =
                        Math.min(rect.bottom, window.innerHeight) -
                        Math.max(rect.top, 0);

                    const ratio =
                        visibleHeight / rect.height;

                    if (ratio > bestRatio) {

                        bestRatio = ratio;
                        bestPage = pageData.pageNum;

                    }

                });

                if (
                    bestPage &&
                    bestPage !== this.currentPage
                ) {

                    this.currentPage = bestPage;

                    this.onPageChange?.(
                        bestPage,
                        this.pdfDoc?.numPages || 0
                    );

                }
            },
            {
                root:      this.container,
                threshold: [0.15, 0.30, 0.45, 0.60]
            }
        );
    }

    // ================================
    // 📄 LOAD PDF
    // ================================

    async load(
        url,
        documentType = "pets"
    ) {

        const loadId =
            ++this._loadId;

        this._isLoading =
            true;


        try {

            // Cancelar una carga anterior.
            if (this.loadingTask) {

                try {

                    await this.loadingTask.destroy();

                }
                catch (error) {

                    console.warn(
                        "Carga anterior cancelada:",
                        error
                    );

                }

                this.loadingTask =
                    null;

            }


            // Limpiar documento anterior.
            this._cleanup();


            // =====================================
            // TIPO DEL NUEVO DOCUMENTO
            // =====================================

            this.documentType =
                documentType;


            if (
                loadId !==
                this._loadId
            ) {

                return;

            }

            // Abrir el nuevo PDF.
            const loadingTask = pdfjsLib.getDocument({
                url,
                withCredentials: false
            });

            this.loadingTask = loadingTask;

            const pdfDoc = await loadingTask.promise;

            if (loadId !== this._loadId) {
                return;
            }

            this.pdfDoc = pdfDoc;
            this.loadingTask = null;

            // =====================================
            // PRIORIDAD 1: PRIMERA PÁGINA
            // =====================================

            this.currentPage = 1;

            await this.createPage(1);

            if (loadId !== this._loadId) return;

            this.onPageChange?.(
                1,
                this.pdfDoc.numPages
            );

            // Mostrar la primera página antes
            // de procesar todo el documento.
            await this.renderVisiblePage(1);

            if (loadId !== this._loadId) return;

            // Dar una oportunidad al navegador
            // para actualizar la pantalla.
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    setTimeout(resolve, 0);
                });
            });

            if (loadId !== this._loadId) return;

            // =====================================
            // PRIORIDAD 2: RESTO DE PÁGINAS
            // =====================================

            for (
                let pageNum = 2;
                pageNum <= this.pdfDoc.numPages;
                pageNum++
            ) {

                if (loadId !== this._loadId) return;

                await this.createPage(pageNum);

            }

            if (loadId !== this._loadId) return;

            // =====================================
            // PRIORIDAD 3: ÍNDICE DE TEXTO
            // =====================================

            await this.buildTextIndex();

            if (loadId !== this._loadId) return;

            // =====================================
            // MOTOR EXCLUSIVO DE PETS
            // =====================================

            if (this.documentType === "pets") {

                // ---------------------------------
                // PROCEDIMIENTO
                // ---------------------------------

                this.extractProcedureBlock();

                this.normalizeProcedureBlock();

                this.detectProcedureType();

                this.parseProcedureBlock();


                // ---------------------------------
                // DOCUMENT OUTLINE
                // ---------------------------------

                this.extractProcedureRange();

                this.mergeFragmentsIntoLines();

                this.detectHeadingStyles();

                this.detectOutlineHeadings();

                this.buildOutlineTree();

                this.exportOutlineTasks();

            }
            else {

                // =================================
                // FDS / MANUALES
                // No utilizan estructura PETS
                // =================================

                this.procedureBlock =
                    null;

                this.procedureType =
                    null;

                this.taskSteps =
                    [];

                this.taskTree =
                    [];

                this.outlineFragments =
                    [];

                this.outlineLines =
                    [];

                this.outline =
                    [];

                this.outlineTree =
                    [];

                this.outlineTaskSteps =
                    [];

                this.outlineIndex.clear();

                this.outlineLocations.clear();

            }


            this.debugSearchIndex();

            if (loadId !== this._loadId) return;

            this.loadedAt = Date.now();

        } catch (error) {

            if (
                error?.name === "AbortException" ||
                error?.message?.includes("Worker was destroyed") ||
                error?.message?.includes("Worker was terminated")
            ) {
                return;
            }

            console.error("❌ PDF LOAD ERROR:", error);

            throw error;

        } finally {

            if (loadId === this._loadId) {
                this._isLoading = false;
                this.loadingTask = null;
            }

        }

    }

    // ================================
    // 🏗️ CREATE PAGE PLACEHOLDER
    // ================================

    async createPage(pageNum) {

        const page = await this.pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({
            scale: this.scale
        });

        const pageDiv = document.createElement("div");

        pageDiv.className = "pdf-page";
        pageDiv.dataset.page = pageNum;

        pageDiv.style.animationDelay =
            `${Math.min(pageNum * 30, 300)}ms`;

        // ===============================
        // LOADER DE PÁGINA
        // ===============================

        const loadingLayer =
            document.createElement("div");

        loadingLayer.className = "page-loader";

        loadingLayer.innerHTML = `
            <div class="page-loader-spinner"></div>
            <div class="page-loader-text">
                Página ${pageNum}
            </div>
        `;

        pageDiv.appendChild(loadingLayer);

        // ===============================
        // DIMENSIONES
        // ===============================

        pageDiv.style.width =
            `${viewport.width}px`;

        pageDiv.style.height =
            `${viewport.height}px`;

        pageDiv.style.minWidth = "0";
        pageDiv.style.minHeight = "0";

        /* =========================================
            ESCALA VISUAL DE LA PÁGINA
        ========================================= */

        pageDiv.style.setProperty(
            "--pdf-page-scale",
            this.scale
        );

        // ===============================
        // CANVAS
        // ===============================

        const canvas =
            document.createElement("canvas");

        canvas.style.opacity = "0";

        canvas.style.width =
            `${viewport.width}px`;

        canvas.style.height =
            `${viewport.height}px`;

        pageDiv.appendChild(canvas);

        // ===============================
        // CAPA DE HIGHLIGHTS
        // ===============================

        const highlightLayer =
            document.createElement("div");

        highlightLayer.className =
            "page-highlight-layer";

        pageDiv.appendChild(highlightLayer);

        this.highlightLayers.set(
            pageNum,
            highlightLayer
        );

        // ===============================
        // MARCA DE AGUA INTELLIALL
        // ===============================

        const watermark =
            document.createElement("div");

        watermark.className =
            "page-watermark";

        watermark.dataset.page =
            pageNum;

        // ===============================
        // URL DEL LOGO
        // ===============================

        const logoWatermarkUrl =
            new URL(
                "logo-watermark.png",
                document.baseURI
            ).href;

        // ===============================
        // POSICIONES UNIFORMES
        // ===============================

        const watermarkPositions = [];

        const columns = [
            12.5,
            37.5,
            62.5,
            87.5
        ];

        const rows = [
            12,
            50,
            88
        ];

        rows.forEach(y => {

            columns.forEach(x => {

                watermarkPositions.push({
                    x,
                    y
                });

            });

        });

        // ===============================
        // CREAR LOGOS
        // ===============================

        watermarkPositions.forEach(
            (position, index) => {

                const item =
                    document.createElement("div");

                item.className =
                    "watermark-item";

                item.dataset.index =
                    index;

                item.style.left =
                    `${position.x}%`;

                item.style.top =
                    `${position.y}%`;

                const img =
                    document.createElement("img");

                img.src =
                    logoWatermarkUrl;

                img.alt =
                    "";

                img.draggable =
                    false;

                img.loading =
                    "eager";

                img.onerror = () => {

                    console.error(
                        "❌ No se pudo cargar logo-watermark.png:",
                        logoWatermarkUrl
                    );

                };

                item.appendChild(img);

                watermark.appendChild(item);

            }
        );

        // ===============================
        // INSERTAR WATERMARK
        // ===============================

        pageDiv.appendChild(
            watermark
        );

        // ===============================
        // INSERTAR PÁGINA
        // ===============================

        this.viewer.appendChild(
            pageDiv
        );

        this.pages.push({

            pageNum,
            page,
            pageDiv,
            canvas,

            rendered: false,
            rendering: false,

            currentScale:
                this.scale

        });

        this.observer.observe(
            pageDiv
        );

        this.pageObserver.observe(
            pageDiv
        );
    }

    // ================================
    // 👀 RENDER VISIBLE PAGE
    // ================================

    async renderVisiblePage(pageNum) {

        const pageData = this.pages[pageNum - 1];

        if (!pageData || !this.pdfDoc) {
            return;
        }

        const targetScale = this.scale;

        // La página ya está renderizada a la escala correcta.
        if (
            pageData.rendered &&
            pageData.currentScale === targetScale
        ) {
            return;
        }

        // Evitar dos renderizados simultáneos
        // de la misma página y escala.
        if (
            pageData.rendering &&
            pageData.renderScale === targetScale &&
            pageData.renderPromise
        ) {
            return pageData.renderPromise;
        }

        // Cancelar un renderizado de escala anterior.
        const previousTask = this.renderTasks.get(pageNum);

        if (previousTask) {
            try {
                previousTask.cancel();
            } catch (error) {
                // La tarea puede haber terminado.
            }
        }

        const renderId = (pageData.renderId || 0) + 1;

        pageData.renderId = renderId;
        pageData.rendering = true;
        pageData.renderScale = targetScale;
        pageData.rendered = false;

        const renderPromise = (async () => {

            let renderTask = null;

            try {

                const { page, pageDiv } = pageData;

                const viewport = page.getViewport({
                    scale: targetScale
                });

                // Resolución moderada para reducir
                // el consumo de memoria.
                const pixelRatio = window.devicePixelRatio || 1;

                const renderScale =
                    window.innerWidth <= 768
                        ? Math.min(1.5, pixelRatio)
                        : Math.min(1.75, pixelRatio);

                const realWidth = Math.max(
                    1,
                    Math.floor(viewport.width * renderScale)
                );

                const realHeight = Math.max(
                    1,
                    Math.floor(viewport.height * renderScale)
                );

                // Un único canvas de renderizado.
                const newCanvas = document.createElement("canvas");

                newCanvas.width = realWidth;
                newCanvas.height = realHeight;

                newCanvas.style.opacity = "1";
                newCanvas.style.width = "100%";
                newCanvas.style.height = "100%";
                newCanvas.style.position = "absolute";
                newCanvas.style.inset = "0";

                const context = newCanvas.getContext(
                    "2d",
                    { alpha: false }
                );

                if (!context) {
                    throw new Error(
                        "No se pudo crear el contexto del canvas."
                    );
                }

                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";

                // Escalar el contexto para mantener
                // las dimensiones correctas del PDF.
                context.setTransform(
                    renderScale,
                    0,
                    0,
                    renderScale,
                    0,
                    0
                );

                renderTask = page.render({
                    canvasContext: context,
                    viewport
                });

                this.renderTasks.set(
                    pageNum,
                    renderTask
                );

                await renderTask.promise;

                // Evitar insertar un resultado antiguo
                // después de un cambio de zoom.
                if (
                    pageData.renderId !== renderId ||
                    this.scale !== targetScale ||
                    !pageDiv.isConnected
                ) {
                    newCanvas.width = 0;
                    newCanvas.height = 0;
                    return;
                }

                // Actualizar las dimensiones.
                pageDiv.style.width =
                    `${viewport.width}px`;

                pageDiv.style.height =
                    `${viewport.height}px`;

                // Sustituir únicamente el canvas.
                // No eliminar loaders, highlights
                // ni marcas de agua.
                pageDiv
                    .querySelectorAll("canvas")
                    .forEach(canvas => {
                        canvas.remove();
                        canvas.width = 0;
                        canvas.height = 0;
                    });

                pageDiv.appendChild(newCanvas);

                pageData.canvas = newCanvas;
                pageData.rendered = true;
                pageData.currentScale = targetScale;

                // Ocultar el indicador de esta página.
                const loader = pageDiv.querySelector(
                    ".page-loader"
                );

                if (loader) {
                    loader.classList.add("hide");
                }

                // Restaurar los resaltados, si existen.
                if (this.searchLocations.length) {
                    requestAnimationFrame(() => {

                        if (
                            pageData.renderId === renderId &&
                            pageData.rendered
                        ) {
                            this.renderPageHighlights(pageNum);
                        }

                    });
                }

            } catch (error) {

                if (
                    error?.name !== "RenderingCancelledException"
                ) {
                    console.error(
                        `❌ PAGE ${pageNum}`,
                        error
                    );
                }

            } finally {

                // No modificar el estado de un
                // renderizado más reciente.
                if (pageData.renderId === renderId) {

                    pageData.rendering = false;
                    pageData.renderPromise = null;

                    if (
                        this.renderTasks.get(pageNum) ===
                        renderTask
                    ) {
                        this.renderTasks.delete(pageNum);
                    }

                }

            }

        })();

        pageData.renderPromise = renderPromise;

        return renderPromise;

    }

    // ================================
    // 🔍 SET SCALE
    //
    // Reescrito: devuelve una promesa que resuelve cuando las
    // páginas visibles están pintadas a la nueva escala.
    //
    // `anchor` (opcional) = { clientX, clientY } — punto de la
    // pantalla que debe quedar FIJO tras el cambio de escala
    // (típicamente la posición del cursor en el wheel-zoom).
    // Si no se pasa, se usa el centro del contenedor.
    // ================================

    // ================================
    // 🔍 SET SCALE
    //
    // REESCRITO para eliminar el doble escalado (causa del temblor):
    //
    //   _commitGeometry()  → SÍNCRONO. Redimensiona los pageDiv y
    //                        ajusta el scroll EN EL MISMO FRAME. El
    //                        llamador (zoom.js) quita el transform
    //                        justo después, sin ventana intermedia.
    //
    //   _renderVisible()   → ASYNC. Repinta los canvas a nitidez real.
    //                        Invisible: las páginas ya están al tamaño
    //                        correcto; el bitmap viejo se ve estirado
    //                        una fracción de segundo (como Acrobat).
    // ================================

    // Cambia la geometría de forma síncrona y devuelve sin esperar render.
    // Devuelve true si hubo cambio real de escala.
    _commitGeometry(newScale, anchor = null, force = false) {

        if (!this.pdfDoc) return false;

        this.prevScale = this.scale;
        this.scale = Math.max(0.35, Math.min(newScale, 5));

        if (this.scale === this.prevScale && !force) return false;

        // Cancelar renders en vuelo (quedaron a la escala vieja)
        for (const task of this.renderTasks.values()) {
            try { task.cancel(); } catch {}
        }
        this.renderTasks.clear();
        clearTimeout(this.zoomTimeout);

        // ── Punto de anclaje ANTES de cambiar geometría ──
        const containerRect = this.container.getBoundingClientRect();
        const anchorX = anchor ? anchor.clientX - containerRect.left
                               : this.container.clientWidth / 2;
        const anchorY = anchor ? anchor.clientY - containerRect.top
                               : this.container.clientHeight / 2;

        const contentX =
            this.container.scrollLeft + anchorX;

        const contentY =
            this.container.scrollTop + anchorY;

        const ratio =
            this.scale / this.prevScale;

        // 1. Redimensionar TODOS los pageDiv (síncrono)
        this.pages.forEach(pageData => {

            pageData.rendered = false;

            const viewport =
                pageData.page.getViewport({
                    scale: this.scale
                });

            pageData.pageDiv.style.width =
                `${viewport.width}px`;

            pageData.pageDiv.style.height =
                `${viewport.height}px`;

            pageData.pageDiv.style.minWidth = "0";
            pageData.pageDiv.style.minHeight = "0";

            pageData.pageDiv.style.setProperty(
                "--pdf-page-scale",
                this.scale
            );

        });

        // 2. Compensar scroll para conservar el punto anclado (síncrono, mismo frame)
        if (anchor) {

            this.container.scrollLeft =
                (contentX * ratio) - anchorX;

            this.container.scrollTop =
                (contentY * ratio) - anchorY;
        }

        return true;
    }

    // Repinta las páginas visibles a nitidez real. Async, fuera del frame crítico.
    async _renderVisible() {
        const renderJobs = [];
        this.pages.forEach(pageData => {
            const rect = pageData.pageDiv.getBoundingClientRect();
            const visible = rect.bottom >= -800 &&
                            rect.top <= window.innerHeight + 800;
            if (visible) {
                renderJobs.push(this.renderVisiblePage(pageData.pageNum));
            }
        });
        await Promise.allSettled(renderJobs);

        if(this.searchLocations.length){

            this.renderHighlights();

        }

        const current =

            this.getCurrentSearchMatch();

        if(current){

            this.scrollToSearchMatch(
                current
            );

        }
    }

    // API antigua conservada para compatibilidad (resize, etc.):
    // hace el commit síncrono y luego el render async.
    async setScale(newScale, anchor = null, force = false) {
        const changed = this._commitGeometry(newScale, anchor, force);
        if (!changed) return;
        await this._renderVisible();
    }

    // ================================================
    // EVENTO DE CAMBIO DE BÚSQUEDA
    // ================================================

    notifySearchChanged(){

        const status =

            this.getSearchStatus();

        document.dispatchEvent(

            new CustomEvent(

                "pdf-search-change",

                {

                    detail:status

                }

            )

        );

    }

    // ================================================
    // ATAJOS DEL BUSCADOR
    // ================================================

    initializeSearchShortcuts(){

        document.addEventListener(
            "keydown",

            e=>{

                if(
                    e.key !== "Enter"
                ){

                    return;

                }

                const input =

                    document.activeElement;

                if(
                    !input ||
                    input.tagName !== "INPUT"
                ){

                    return;

                }

                if(e.shiftKey){

                    this.previousSearchMatch();

                }

                else{

                    this.nextSearchMatch();

                }

                e.preventDefault();

            }

        );

    }

    // ================================
    // 📐 FIT TO WIDTH
    // ================================

    async fitToWidth() {
        if (!this.pdfDoc) return;
        try {
            const page      = await this.pdfDoc.getPage(1);
            const viewport  = page.getViewport({ scale: 1 });
            const padding = window.innerWidth <= 768 ? 10 : 160;
            const available = (this.container.clientWidth || window.innerWidth) - padding;
            const fitScale  = available / viewport.width;

            const zoomLabel = document.getElementById("zoomLabel");
            if (zoomLabel) zoomLabel.textContent = `${Math.round(fitScale * 100)}%`;

            const pdfViewerEl = document.getElementById("pdfViewer");
            /* if (pdfViewerEl) {
                pdfViewerEl.style.transform       = `scale(${fitScale})`;
                pdfViewerEl.style.transformOrigin = "top center";
            } */

            await this.setScale(fitScale);

            if (window.app?.getZoom()) {
                window.app.getZoom().zoom = fitScale;
            }
        } catch (error) {
            console.error("❌ FIT WIDTH ERROR:", error);
        }
    }

    // ================================
    // 📄 SCROLL TO PAGE
    // ── FIX: activar flag _scrolling para
    //    suprimir el pageObserver durante el
    //    scroll, evitando el doble disparo.
    // ================================

    scrollToPage(pageNum) {

        if (!this.pdfDoc) return;

        const total  = this.pdfDoc.numPages;
        const target = Math.max(1, Math.min(pageNum, total));

        const pageData = this.pages[target - 1];
        if (!pageData) return;

        // 1. Actualizar estado y UI INMEDIATAMENTE (sin esperar al observer)
        this.currentPage = target;
        this.onPageChange?.(target, total);

        // 2. Suprimir pageObserver durante el scroll animado
        this._scrolling = true;
        clearTimeout(this._scrollEnd);

        // 3. Hacer el scroll
        const targetTop =
            pageData.pageDiv.offsetTop;

        this.container.scrollTo({
            top: targetTop,
            behavior: "smooth"
        });

        // 4. Reactivar pageObserver cuando el scroll termine (~600ms)
        //    El browser no emite un evento "scrollend" fiable en todos los browsers,
        //    así que usamos un timeout generoso.
        this._scrollEnd = setTimeout(() => {
            this._scrolling = false;
        }, 1200);
    }

    // ================================================
    // 📍 IR A UN PASO DEL PROCEDIMIENTO
    // ================================================
    async scrollToTask(taskId) {

        const location =
            this.taskLocations.get(taskId);

        if (!location) {

            console.warn(
                "Task no encontrado:",
                taskId
            );

            return false;

        }

        const pageData =
            this.pages[location.page - 1];

        if (!pageData) {

            return false;

        }

        await this.renderVisiblePage(
            location.page
        );

        const viewport =
            pageData.page.getViewport({
                scale: this.scale
            });

        let targetTop =
            pageData.pageDiv.offsetTop;

        if (
            location.x !== null &&
            location.y !== null
        ) {

            const [, top] =
                viewport.convertToViewportPoint(
                    location.x,
                    location.y
                );

            targetTop += top - 100;

        }

        this.currentPage =
            location.page;

        this.onPageChange?.(
            location.page,
            this.pdfDoc.numPages
        );

        this.currentTaskNode =
            taskId;

        this._scrolling = true;

        clearTimeout(
            this._scrollEnd
        );

        this.container.scrollTo({

            top: Math.max(0, targetTop),

            behavior: "smooth"

        });

        this._scrollEnd =
            setTimeout(() => {

                this._scrolling = false;

            }, 900);

        return true;

    }

    // ================================================
    // OBTENER UBICACIÓN DE UN PASO
    // ================================================
    getTaskLocation(taskId) {

        return this.taskLocations.get(taskId) || null;

    }

    // ================================================
    // VERIFICAR SI EXISTE UN PASO
    // ================================================
    hasTask(taskId) {

        return this.taskLocations.has(taskId);

    }

    // ================================================
    // ESTABLECER CALLBACK DE TASK ACTUAL
    // ================================================

    setCurrentTaskListener(callback){

        this.onCurrentTaskChange = callback;

    }

    // ================================================
    // NOTIFICAR CAMBIO DE PROCEDIMIENTO ACTUAL
    // ================================================

    notifyCurrentTask(taskId){

        // Evitar emitir el mismo procedimiento varias veces
        if(this.lastVisibleTask === taskId){

            return;

        }

        this.lastVisibleTask = taskId;

        this.currentTaskNode = taskId;

        // Notificar a la aplicación
        if(typeof this.onCurrentTaskChange === "function"){

            this.onCurrentTaskChange(taskId);

        }

    }

    // ================================================
    // 📍 IR A UNA COINCIDENCIA
    // ================================================

    async scrollToSearchMatch(match){

        if(!match){

            return;

        }

        const pageData =
            this.pages[match.page - 1];

        if(!pageData){

            return;

        }

        if(!pageData.pageDiv){

            return;

        }

        const viewport =
            pageData.page.getViewport({
                scale:this.scale
            });

        const [, top] =
            viewport.convertToViewportPoint(
                match.x,
                match.y
            );

        const targetTop =
            pageData.pageDiv.offsetTop +
            top -
            120;

        this.currentPage =
            match.page;

        this.onPageChange?.(
            match.page,
            this.pdfDoc.numPages
        );

        this._scrolling = true;

        clearTimeout(
            this._scrollEnd
        );

        await this.renderVisiblePage(
            match.page
        );

        this.container.scrollTo({

            top:Math.max(0,targetTop),

            behavior:"smooth"

        });

        this._scrollEnd =
            setTimeout(()=>{

                this._scrolling = false;

            },900);

    }

    // ================================================
    // 🧹 NORMALIZAR TEXTO
    // ================================================

    normalizeText(text = "") {

        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

    }

    // ================================================
    // 🔎 OBTENER TÉRMINOS ÚTILES DE BÚSQUEDA
    // ================================================

    getSearchTerms(query = "") {

        const normalized =
            this.normalizeText(query);

        if (!normalized) {

            return [];

        }

        const stopWords = new Set([

            "de",
            "del",
            "la",
            "las",
            "el",
            "los",
            "y",
            "o",
            "en",
            "para",
            "por",
            "con",
            "un",
            "una",
            "unos",
            "unas",
            "al"

        ]);

        const rawTerms =
            normalized
                .split(/\s+/)
                .filter(Boolean);

        /*
        * Si la consulta tiene varias palabras,
        * eliminamos conectores que no aportan
        * demasiado a la búsqueda.
        *
        * Ejemplo:
        *
        * "trabajos en altura"
        *
        * queda:
        *
        * ["trabajos", "altura"]
        */

        const usefulTerms =
            rawTerms.filter(term => {

                if (rawTerms.length === 1) {

                    return true;

                }

                return !stopWords.has(term);

            });

        /*
        * Evitar términos repetidos.
        */

        return [
            ...new Set(usefulTerms)
        ];

    }

    // ================================================
    // CLASIFICADOR DE ENCABEZADOS
    // ================================================
    classifyProcedureLine(
        text = ""
    ) {

        text =
            String(text || "")
                .replace(/\s+/g, " ")
                .trim();


        if (!text) {

            return null;

        }


        // ============================================
        // FUNCIÓN AUXILIAR:
        // ¿PARECE REALMENTE UN TÍTULO?
        // ============================================

        const looksLikeTitle =
            value => {

                const title =
                    String(value || "")
                        .trim();


                if (!title) {

                    return false;

                }


                // Un encabezado PET razonable no debería
                // ser un párrafo extremadamente largo.
                if (
                    title.length > 180
                ) {

                    return false;

                }


                // Frases claramente provenientes de texto
                // normal y no de encabezados.
                if (
                    /[.;]\s*$/.test(title)
                    &&
                    title.length > 45
                ) {

                    return false;

                }


                const letters =
                    title.replace(
                        /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g,
                        ""
                    );


                if (!letters.length) {

                    return true;

                }


                const uppercase =
                    letters.replace(
                        /[^A-ZÁÉÍÓÚÜÑ]/g,
                        ""
                    ).length;


                const ratio =
                    uppercase /
                    letters.length;


                // La mayoría de títulos de tus PETS
                // están escritos en mayúsculas.
                if (
                    ratio >= 0.55
                ) {

                    return true;

                }


                // También aceptar títulos cortos.
                const words =
                    title
                        .split(/\s+/)
                        .filter(Boolean);


                return (
                    words.length <= 8
                    &&
                    !/[.;]$/.test(title)
                );

            };


        // ============================================
        // 1. NUMERACIÓN DEL BLOQUE 4
        //
        // 4. PROCEDIMIENTO
        // 4.1. ACTIVIDADES PREVIAS
        // 4.2. PASOS DE LA TAREA
        // 4.2.1. ...
        // ============================================

        const decimal =
            text.match(

                /^(4(?:\.[1-9]\d*){0,4})\.?\s+(.+)$/

            );


        if (decimal) {

            const number =
                decimal[1];


            const title =
                decimal[2]
                    .replace(/\s+/g, " ")
                    .trim();

            // ============================================
            // DESCARTAR FILAS NUMÉRICAS DE TABLAS
            //
            // Ejemplo real:
            // 4.00 20.20
            // ============================================

            if (
                !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(title)
            ) {

                return null;

            }


            // ============================================
            // VALIDACIÓN ESPECIAL DEL NIVEL "4."
            //
            // "4. PROCEDIMIENTO"            → válido
            // "4. Equipos auxiliares..."    → NO válido
            //
            // Esto evita confundir listas numeradas
            // internas con encabezados del PET.
            // ============================================

            if (
                number === "4" &&
                !/^PROCEDIMIENTO\b/i.test(title)
            ) {

                return null;

            }


            // ============================================
            // VALIDACIÓN GENERAL
            // ============================================

            if (
                !title ||
                title.length > 180
            ) {

                return null;

            }


            const level =
                number
                    .split(".")
                    .length;


            let type =
                "decimal";


            if (
                /^(PROCEDIMIENTO|ACTIVIDADES|CONSIDERACIONES|PLANIFICACION|PLANIFICACIÓN|MOVILIZACION|MOVILIZACIÓN|DESMOVILIZACION|DESMOVILIZACIÓN|EJECUCION|EJECUCIÓN|FINALIZACION|FINALIZACIÓN|MEDIDAS|PASOS)/i
                    .test(title)
            ) {

                type =
                    "section";

            }


            return {

                type,

                level:
                    Math.min(
                        level,
                        5
                    ),

                match:
                    number

            };

        }


        // ============================================
        // 2. ROMANOS
        // ============================================

        const roman =
            text.match(

                /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+(.+)/i

            );


        if (roman) {

            const title =
                roman[2]
                    .trim();


            if (
                !looksLikeTitle(title)
            ) {

                return null;

            }


            return {

                type:
                    "roman",

                level:
                    2

            };

        }


        // ============================================
        // 3. LETRAS
        //
        // A. MEDIDAS...
        // B. PAPEL
        // C. CARTON
        // ============================================

        const letter =
            text.match(

                /^([A-ZÑ])\.\s+(.+)/

            );


        if (letter) {

            const rawTitle =
                letter[2]
                    .trim();


            // ============================================
            // NORMALIZAR SOLO PARA VALIDAR EL TÍTULO
            //
            // Ejemplos:
            //
            // Prueba de Aislamiento
            // Prueba de Continuidad.
            // Prueba de Resistencia de Contacto
            //
            // El punto final no debe impedir que sea
            // reconocido como encabezado.
            // ============================================

            const titleForValidation =
                rawTitle
                    .replace(
                        /[.;]\s*$/,
                        ""
                    )
                    .trim();


            if (
                !looksLikeTitle(
                    titleForValidation
                )
            ) {

                return null;

            }


            return {

                type:
                    "letter",

                level:
                    3

            };

        }


        // ============================================
        // 4. ENCABEZADOS SIN NUMERACIÓN
        // Solo se aceptan si realmente parecen títulos.
        // ============================================

        const genericHeaderRegex =
            /^(ACTIVIDADES|CONSIDERACIONES|MOVILIZACION|MOVILIZACIÓN|DESMOVILIZACION|DESMOVILIZACIÓN|EJECUCION|EJECUCIÓN|FINALIZACION|FINALIZACIÓN|MEDIDAS\s+DE\s+CONTROL|PASOS\s+DE\s+LA\s+TAREA|DESARROLLO)\b/i;


        if (
            genericHeaderRegex.test(text)
            &&
            looksLikeTitle(text)
            &&
            !/:$/.test(text)
        ) {

            return {

                type:
                    "generic",

                level:
                    2

            };

        }


        return null;

    }

    // ================================================
    // 📚 CONSTRUIR ÍNDICE DE TEXTO DEL PDF
    // ================================================

    async buildTextIndex() {

        if (!this.pdfDoc) return;

        //console.log("📖 Construyendo índice de texto...");

        // Reiniciar estructuras
        this.pageTextCache.clear();

        this.searchIndex = [];

        this.textCoordinates.clear();

        this.pageTextFragments.clear();

        this.searchLocations = [];

        this.searchReady = false;

        try {

            for (let pageNumber = 1; pageNumber <= this.pdfDoc.numPages; pageNumber++) {

                const page = await this.pdfDoc.getPage(pageNumber);

                const textContent = await page.getTextContent();

                const fragments = [];

                // =====================================
                // Reconstruir el texto respetando líneas
                // =====================================

                let pageText = "";

                let lastY = null;

                for (const item of textContent.items) {

                    fragments.push({

                        text: item.str,

                        x: item.transform[4],

                        y: item.transform[5],

                        width: item.width,

                        height: item.height,

                        fontSize: item.transform[0]

                    });

                    // Cuando cambia la coordenada Y,
                    // significa que comienza una nueva línea.
                    if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {

                        pageText += "\n";

                    }

                    pageText += item.str + " ";

                    lastY = item.transform[5];

                }

                pageText = pageText
                    .replace(/[ \t]+/g, " ")
                    .replace(/\n\s+/g, "\n")
                    .trim();

                // Guardar en caché
                this.pageTextCache.set(pageNumber, pageText);

                this.pageTextFragments.set(

                    pageNumber,

                    fragments

                );

                this.textCoordinates.set(

                    pageNumber,

                    fragments.map(fragment => ({

                        text: this.normalizeText(fragment.text),

                        x: fragment.x,

                        y: fragment.y,

                        width: fragment.width,

                        height: fragment.height,

                        fontSize: fragment.fontSize

                    }))

                );

                /*console.log(
                    `Página ${pageNumber}:`,
                    pageText.substring(0,150)
                );*/

                // Agregar al índice de búsqueda
                this.searchIndex.push({

                    page: pageNumber,

                    text: pageText,

                    normalized: this.normalizeText(pageText)

                });

            }

            this.searchReady = true;

            /*console.log(
                `✅ Índice creado (${this.searchIndex.length} páginas)`
            );*/

        }

        catch(error){

            console.error(
                "❌ Error creando índice del PDF",
                error
            );

            this.searchReady = false;

        }

    }

    // ================================================
    // 🔍 BUSCAR TEXTO DENTRO DEL PDF
    // BÚSQUEDA FLEXIBLE MULTIPALABRA
    // ================================================

    searchText(query) {

        // ============================================
        // REINICIAR ESTADO
        // ============================================

        this.searchMatches = [];

        this.currentMatch = -1;

        this.searchQuery = "";


        // ============================================
        // ÍNDICE NO DISPONIBLE
        // ============================================

        if (!this.searchReady) {

            console.warn(
                "⚠️ El índice de búsqueda aún no está listo."
            );

            this.searchLocations = [];

            this.totalSearchLocations = 0;

            this.activeSearchLocation = -1;

            this.clearAllHighlights();

            this.notifySearchChanged();

            return [];

        }


        // ============================================
        // CONSULTA VACÍA
        // ============================================

        if (!query || !query.trim()) {

            this.searchLocations = [];

            this.totalSearchLocations = 0;

            this.activeSearchLocation = -1;

            this.clearAllHighlights();

            this.notifySearchChanged();

            return [];

        }


        // ============================================
        // NORMALIZAR CONSULTA
        // ============================================

        const search =
            this.normalizeText(query);

        this.searchQuery = search;


        // ============================================
        // LOCALIZAR COINCIDENCIAS REALES
        // ============================================

        this.findSearchLocations(
            search
        );


        // ============================================
        // ORDENAR POR RELEVANCIA
        // ============================================

        this.sortSearchLocationsByRelevance(
            search
        );


        // ============================================
        // TOTAL
        // ============================================

        this.totalSearchLocations =
            this.searchLocations.length;


        this.activeSearchLocation =
            this.totalSearchLocations > 0
                ? 0
                : -1;


        // ============================================
        // AGRUPAR RESULTADOS POR PÁGINA
        // ============================================

        const pageResults =
            new Map();


        for (const location of this.searchLocations) {

            if (!pageResults.has(location.page)) {

                pageResults.set(
                    location.page,
                    []
                );

            }

            pageResults
                .get(location.page)
                .push(location);

        }


        const results = [];


        for (
            const [pageNumber, locations]
            of pageResults.entries()
        ) {

            const first =
                locations[0];


            results.push({

                page:
                    pageNumber,

                occurrences:
                    locations.length,

                preview:
                    first?.text || ""

            });

        }


        this.searchMatches = results;


        // ============================================
        // RESALTAR
        // ============================================

        this.renderHighlights();

        this.notifySearchChanged();


        // ============================================
        // INFORMAR AL SIDEBAR
        // ============================================

        document.dispatchEvent(

            new CustomEvent(

                "pdf-search-results",

                {

                    detail:
                        this.getDetailedSearchResults()

                }

            )

        );


        // ============================================
        // IR A PRIMER RESULTADO
        // ============================================

        if (
            this.activeSearchLocation >= 0
        ) {

            this.scrollToSearchMatch(

                this.searchLocations[
                    this.activeSearchLocation
                ]

            );

        }


        return results;

    }

    // ================================================
    // BÚSQUEDA DIFERIDA
    // ================================================

    searchTextDebounced(query, delay = 250){

        clearTimeout(
            this.searchDebounce
        );

        this.searchDebounce = setTimeout(()=>{

            this.searchText(query);

        }, delay);

    }

    // ================================================
    // 📋 BUSCAR LA SECCIÓN "PASOS DE LA TAREA"
    // ================================================

    findTaskStepsSection() {

        if (!this.searchReady) return null;

        const regex =

            /^\d+(\.\d+)?\.?\s+PASOS\s+DE\s+LA\s+TAREA/i;

        for (const page of this.searchIndex) {

            const lines = page.text.split("\n");

            for (const line of lines) {

                if (regex.test(line.trim())) {

                    return {

                        page: page.page,

                        title: line.trim()

                    };

                }

            }

        }

        return null;

    }

    // ================================================
    // 📋 EXTRAER BLOQUE DEL PROCEDIMIENTO (V2)
    // ================================================
    extractProcedureBlock() {

        this.procedureBlock = [];


        if (!this.searchReady) {

            console.warn(
                "⚠️ Índice de búsqueda no disponible."
            );

            return [];

        }


        // =====================================================
        // NORMALIZACIÓN COMPACTA CON MAPA DE POSICIONES
        //
        // Ejemplos:
        //
        // 4. PROCEDIMIENTO
        // 4. PROCEDIMI ENTO
        // 4 . PRO CEDIMIENTO
        // 4.
        // PROCEDIMIENTO
        //
        // todos terminan como:
        //
        // 4PROCEDIMIENTO
        //
        // Al mismo tiempo conservamos la posición de cada
        // carácter dentro del texto original.
        // =====================================================

        const compactWithMap = rawText => {

            const original =
                String(rawText || "");


            let compact =
                "";


            const map =
                [];


            for (
                let i = 0;
                i < original.length;
                i++
            ) {

                const normalizedCharacter =
                    original[i]

                        .normalize("NFD")

                        .replace(
                            /[\u0300-\u036f]/g,
                            ""
                        );


                for (
                    const character
                    of normalizedCharacter
                ) {

                    if (
                        /[A-Za-z0-9]/.test(
                            character
                        )
                    ) {

                        compact +=
                            character.toUpperCase();


                        map.push(i);

                    }

                }

            }


            return {

                original,

                compact,

                map

            };

        };


        // =====================================================
        // CLAVES ESTRUCTURALES
        // =====================================================

        const START_KEY =
            "4PROCEDIMIENTO";


        const END_KEY =
            "5RESTRICCIONES";


        // 4.1 se sigue comprobando sobre el texto original
        // porque así evitamos confundir números normales.

        const firstSubsectionRegex =
            /\b4\s*\.\s*1\s*\.?\s*/i;


        // =====================================================
        // 1. LOCALIZAR EL PROCEDIMIENTO REAL
        // =====================================================

        let startPageIndex =
            -1;


        let startCharacterIndex =
            -1;


        for (
            let pageIndex = 0;
            pageIndex < this.searchIndex.length;
            pageIndex++
        ) {

            const page =
                this.searchIndex[
                    pageIndex
                ];


            const pageText =
                String(
                    page.text || ""
                );


            const compactData =
                compactWithMap(
                    pageText
                );


            const {
                compact,
                map
            } = compactData;


            // =============================================
            // ¿EXISTE 4. PROCEDIMIENTO?
            // =============================================

            const compactStartIndex =
                compact.indexOf(
                    START_KEY
                );


            if (
                compactStartIndex === -1
            ) {

                continue;

            }


            // =============================================
            // DESCARTAR TABLA DE CONTENIDO
            //
            // Normalmente contiene:
            //
            // CONTENIDO
            // 1 OBJETIVO
            // ...
            // 4 PROCEDIMIENTO
            // 5 RESTRICCIONES
            // =============================================

            const isContentsPage =

                compact.includes(
                    "CONTENIDO"
                )

                &&

                compact.includes(
                    START_KEY
                )

                &&

                compact.includes(
                    END_KEY
                );


            if (isContentsPage) {

                continue;

            }


            // =============================================
            // OBTENER POSICIÓN ORIGINAL DEL "4"
            // =============================================

            const originalStartIndex =
                map[
                    compactStartIndex
                ];


            if (
                originalStartIndex ===
                undefined
            ) {

                continue;

            }


            // =============================================
            // CONFIRMAR QUE DESPUÉS EXISTE 4.1
            // EN LA MISMA PÁGINA
            // =============================================

            const afterProcedure =
                pageText.slice(
                    originalStartIndex
                );


            let hasFirstSubsection =
                firstSubsectionRegex.test(
                    afterProcedure
                );


            // =============================================
            // O EN LA PÁGINA SIGUIENTE
            // =============================================

            if (
                !hasFirstSubsection
                &&
                this.searchIndex[
                    pageIndex + 1
                ]
            ) {

                const nextPageText =
                    String(
                        this.searchIndex[
                            pageIndex + 1
                        ].text || ""
                    );


                hasFirstSubsection =
                    firstSubsectionRegex.test(
                        nextPageText
                    );

            }


            if (
                !hasFirstSubsection
            ) {

                continue;

            }


            // =============================================
            // PROCEDIMIENTO REAL ENCONTRADO
            // =============================================

            startPageIndex =
                pageIndex;


            startCharacterIndex =
                originalStartIndex;


            break;

        }


        // =====================================================
        // NO EXISTE UN PROCEDIMIENTO RECONOCIBLE
        // =====================================================

        if (
            startPageIndex === -1
        ) {

            console.warn(
                "⚠️ No se encontró el inicio real del bloque 4. PROCEDIMIENTO."
            );

            return [];

        }


        // =====================================================
        // 2. EXTRAER DESDE 4. PROCEDIMIENTO
        // HASTA 5. RESTRICCIONES
        // =====================================================

        for (
            let pageIndex =
                startPageIndex;

            pageIndex <
                this.searchIndex.length;

            pageIndex++
        ) {

            const page =
                this.searchIndex[
                    pageIndex
                ];


            let pageText =
                String(
                    page.text || ""
                );


            // =============================================
            // PRIMERA PÁGINA:
            // eliminar todo lo anterior al procedimiento
            // =============================================

            if (
                pageIndex ===
                startPageIndex
            ) {

                pageText =
                    pageText.slice(
                        startCharacterIndex
                    );

            }


            // =============================================
            // LOCALIZAR 5. RESTRICCIONES
            // USANDO TEXTO COMPACTO
            // =============================================

            const compactData =
                compactWithMap(
                    pageText
                );


            const compactEndIndex =
                compactData.compact.indexOf(
                    END_KEY
                );


            let reachedEnd =
                false;


            if (
                compactEndIndex !== -1
            ) {

                const originalEndIndex =
                    compactData.map[
                        compactEndIndex
                    ];


                if (
                    originalEndIndex !==
                    undefined
                ) {

                    pageText =
                        pageText.slice(
                            0,
                            originalEndIndex
                        );


                    reachedEnd =
                        true;

                }

            }


            // =============================================
            // RECONSTRUIR LÍNEAS
            // =============================================

            const lines =
                pageText

                    .split("\n")

                    .map(line =>

                        String(line || "")

                            .replace(
                                /\u00A0/g,
                                " "
                            )

                            .replace(
                                /\s+/g,
                                " "
                            )

                            .trim()

                    )

                    .filter(Boolean);


            // =============================================
            // GUARDAR CONTENIDO
            // =============================================

            for (
                let i = 0;
                i < lines.length;
                i++
            ) {

                let line =
                    lines[i];


                // =========================================
                // RECONSTRUIR NUMERACIÓN PARTIDA
                //
                // 4.2.
                // PASOS DE LA TAREA
                //
                // 4.2.1.
                // TRASLADO...
                // =========================================

                if (
                    /^4(?:\.\d+){0,4}\.?$/.test(
                        line
                    )
                    &&
                    lines[i + 1]
                ) {

                    line =
                        `${line} ${lines[i + 1]}`;


                    i++;

                }


                this.procedureBlock.push({

                    page:
                        page.page,

                    text:
                        line

                });

            }


            // =============================================
            // YA LLEGAMOS A 5. RESTRICCIONES
            // =============================================

            if (reachedEnd) {

                break;

            }

        }


        return this.procedureBlock;

    }

    // ================================================
    // 🧹 NORMALIZAR BLOQUE DEL PROCEDIMIENTO
    // ================================================
    normalizeProcedureBlock() {

        if (
            !Array.isArray(
                this.procedureBlock
            )
            ||
            !this.procedureBlock.length
        ) {

            console.warn(
                "⚠️ procedureBlock vacío."
            );

            return [];

        }


        const normalized = [];

        let pendingPrefix =
            null;


        const pushLine =
            (
                page,
                text
            ) => {

                const clean = String(text || "")

                    .replace(/\u00A0/g, " ")

                    .replace(/\s+/g, " ")

                    .replace(/\s+\./g, ".")

                    .replace(/\s+,/g, ",")

                    .replace(/\s+:/g, ":")

                    .trim();


                if (!clean) {

                    return;

                }


                normalized.push({

                    page,

                    text:
                        clean

                });

            };


        for (
            const item
            of this.procedureBlock
        ) {

            const page =
                item.page;


            let line =
                String(
                    item.text || ""
                )

                .replace(/\u00A0/g, " ")

                .replace(/\s+/g, " ")

                .trim();


            if (!line) {

                continue;

            }


            // ============================================
            // LIMPIAR NÚMERO DE PÁGINA PEGADO
            // AL INICIO DE UN ENCABEZADO DEL BLOQUE 4
            //
            // Ejemplo real:
            // 14 4.3.2 ALMACENAMIENTO...
            //
            // debe quedar:
            // 4.3.2 ALMACENAMIENTO...
            // ============================================

            line = line.replace(
                /^\d{1,3}\s+(?=4(?:\.\d+){1,4}\.?\s+)/,
                ""
            );


            // ======================================
            // IGNORAR ENCABEZADOS / PIES DE PÁGINA
            // ======================================

            if (
                /^Página\s+\d+/i.test(line)
                ||
                /^PET[-\s]/i.test(line)
                ||
                /^Código:/i.test(line)
                ||
                /^Versión:/i.test(line)
                ||
                /^CONFIDENCIAL:/i.test(line)
            ) {

                continue;

            }


            // ======================================
            // NUMERACIÓN SOLA
            //
            // 4.
            // 4.2.
            // 4.2.1.
            // ======================================

            if (
                /^4(?:\.\d+){0,4}\.?$/.test(
                    line
                )
            ) {

                if (pendingPrefix) {

                    pushLine(
                        pendingPrefix.page,
                        pendingPrefix.text
                    );

                }


                pendingPrefix = {

                    page,

                    text:
                        line

                };


                continue;

            }


            // ======================================
            // LETRA SOLA
            //
            // A.
            // B.
            // ======================================

            if (
                /^[A-ZÑ]\.$/.test(line)
            ) {

                if (pendingPrefix) {

                    pushLine(
                        pendingPrefix.page,
                        pendingPrefix.text
                    );

                }


                pendingPrefix = {

                    page,

                    text:
                        line

                };


                continue;

            }


            // ======================================
            // UNIR PREFIJO CON SU TÍTULO
            // ======================================

            if (pendingPrefix) {

                pushLine(

                    pendingPrefix.page,

                    `${pendingPrefix.text} ${line}`

                );


                pendingPrefix =
                    null;


                continue;

            }


            // ======================================
            // CONSERVAR TODO LO DEMÁS
            // ======================================

            pushLine(
                page,
                line
            );

        }


        if (pendingPrefix) {

            pushLine(

                pendingPrefix.page,

                pendingPrefix.text

            );

        }


        this.procedureBlock =
            normalized;


        return normalized;

    }

    // ================================================
    // 🔍 DETECTAR TIPO DE PROCEDIMIENTO
    // ================================================
    detectProcedureType() {

        if (
            !Array.isArray(this.procedureBlock) ||
            !this.procedureBlock.length
        ) {

            console.warn("⚠️ procedureBlock vacío.");

            this.procedureType = null;

            return null;

        }

        const stats = {

            roman: 0,

            decimal: 0,

            letters: 0,

            bullets: 0,

            generic: 0

        };

        for (const item of this.procedureBlock) {

            const text = item.text.trim();

            // I. II. III.
            if (/^(I|II|III|IV|V|VI|VII|VIII|IX|X)\./i.test(text)) {

                stats.roman++;

                continue;

            }

            // 4.2.1
            if (/^\d+(\.\d+){1,4}/.test(text)) {

                stats.decimal++;

                continue;

            }

            // A. B. C.
            if (/^[A-ZÑ]\./.test(text)) {

                stats.letters++;

                continue;

            }

            // • ► ✓ ➤
            if (/^[•●▪■►➤✓✔]/.test(text)) {

                stats.bullets++;

                continue;

            }

            stats.generic++;

        }

        const entries = Object.entries(stats);

        entries.sort((a, b) => b[1] - a[1]);

        const [type, count] = entries[0];

        const total = this.procedureBlock.length;

        const confidence = total
            ? Number((count / total).toFixed(2))
            : 0;

        this.procedureType = {

            type,

            confidence,

            stats

        };

        /*console.group("📊 PROCEDURE TYPE");

        console.table(stats);

        console.log("Tipo:", type);

        console.log("Confianza:", confidence);

        console.groupEnd();*/

        return this.procedureType;

    }

    // ================================================
    // 📋 PARSEAR PROCEDIMIENTO
    // ================================================
    parseProcedureBlock() {

        this.taskSteps = [];

        if (
            !Array.isArray(this.procedureBlock) ||
            !this.procedureBlock.length
        ) {

            console.warn("⚠️ procedureBlock vacío.");

            return [];

        }

        this.detectHeaders();

        this.attachItems();

        this.normalizeSteps();

        this.finalizeSteps();

        this.buildTaskTree();

        this.validateTaskTree();

        // Construir índice de ubicaciones
        this.buildTaskLocations();

        /*console.group("📋 TASK STEPS");

        console.table(

            this.taskSteps.map(step => ({

                id: step.id,

                page: step.page,

                title: step.title,

                items: step.items.length

            }))

        );

        console.groupEnd();*/

        return this.taskSteps;

    }

    // ================================================
    // DETECTAR ENCABEZADOS (JERÁRQUICO)
    // ================================================
    detectHeaders() {

       this.taskSteps = [];
       this.taskMap.clear();

        let id = 1;

        // Pila para construir la jerarquía
        const stack = [];

        for (const row of this.procedureBlock) {

            const text = row.text.trim();

            if (!text) {

                continue;

            }

            // Clasificar la línea
            const info = this.classifyProcedureLine(text);

            // No es un encabezado
            if (!info) {

                continue;

            }

            // -------------------------------------
            // Encontrar el padre según el nivel
            // -------------------------------------

            while (

                stack.length &&

                stack[stack.length - 1].level >= info.level

            ) {

                stack.pop();

            }

            const parent =

                stack.length

                    ? stack[stack.length - 1]

                    : null;

            // -------------------------------------
            // Crear nodo
            // -------------------------------------

            const node = {

                id: id++,

                page: row.page,

                title: text,

                headerType: info.type,

                level: info.level,

                parentId: parent ? parent.id : null,

                children: [],

                items: []

            };

            // Registrar hijo en el padre

            if (parent) {

                parent.children.push(node.id);

            }

            // Guardar nodo

            this.taskSteps.push(node);

            // Crear clave única
            const key = `${row.page}-${text}`;

            // Registrar en el índice
            this.taskMap.set(key, node);

            // El nodo pasa a ser el contexto actual

            stack.push(node);

        }

        /*console.group("🌳 PROCEDURE TREE");

        console.table(

            this.taskSteps.map(step => ({

                id: step.id,

                parent: step.parentId,

                level: step.level,

                type: step.headerType,

                title: step.title,

                children: step.children.join(", ")

            }))

        );

        console.groupEnd();*/

    }

    // ================================================
    // OBTENER PASO POR CLAVE
    // ================================================
    getTaskStep(page, title) {

        return this.taskMap.get(

            `${page}-${title}`

        ) || null;

    }

    // ================================================
    // ASOCIAR CONTENIDO A CADA PASO
    // ================================================
    attachItems() {

        if (!this.taskSteps.length) {

            return;

        }

        let currentStep = null;

        for (const row of this.procedureBlock) {

            const text = row.text.trim();

            if (!text) {

                continue;

            }

            // ---------------------------------
            // ¿Es un encabezado?
            // ---------------------------------

            const info = this.classifyProcedureLine(text);

            if (info) {

                const key = `${row.page}-${text}`;

                currentStep = this.getTaskStep(

                    row.page,

                    text

                );

                continue;

            }

            // ---------------------------------
            // Aún no existe un encabezado activo
            // ---------------------------------

            if (!currentStep) {

                continue;

            }

            // ---------------------------------
            // Ignorar títulos generales
            // ---------------------------------

            if (

                /^PROCEDIMIENTO$/i.test(text) ||

                /^PASOS\s+DE\s+LA\s+TAREA$/i.test(text)

            ) {

                continue;

            }

            // ---------------------------------
            // Agregar contenido al paso actual
            // ---------------------------------

            currentStep.items.push({

                page: row.page,

                text

            });

        }

        /*console.group("📋 STEP ITEMS");

        console.table(

            this.taskSteps.map(step => ({

                id: step.id,

                level: step.level,

                parent: step.parentId,

                title: step.title,

                items: step.items.length

            }))

        );

        console.groupEnd();*/

    }

    // ================================================
    // NORMALIZAR PASOS
    // ================================================
    normalizeSteps() {

        for (const step of this.taskSteps) {

            const normalizedItems = [];

            let previous = "";

            for (const item of step.items) {

                let text = item.text || "";

                // ---------------------------------
                // Espacios
                // ---------------------------------

                text = text
                    .replace(/\u00A0/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();

                // ---------------------------------
                // Limpiar viñetas repetidas
                // ---------------------------------

                text = text.replace(

                    /^[•●▪■►➤✓✔\-\*]+\s*/,

                    "• "

                );

                // ---------------------------------
                // Eliminar líneas vacías
                // ---------------------------------

                if (!text.length) {

                    continue;

                }

                // ---------------------------------
                // Ignorar textos demasiado pequeños
                // ---------------------------------

                if (text.length < 3) {

                    continue;

                }

                // ---------------------------------
                // Evitar duplicados consecutivos
                // ---------------------------------

                if (

                    previous.toLowerCase() ===
                    text.toLowerCase()

                ) {

                    continue;

                }

                previous = text;

                normalizedItems.push({

                    page: item.page,

                    text

                });

            }

            // ---------------------------------
            // Fusionar líneas partidas
            // ---------------------------------

            const merged = [];

            for (const item of normalizedItems) {

                if (!merged.length) {

                    merged.push(item);

                    continue;

                }

                const last = merged[merged.length - 1];

                const lastEndsSentence =

                    /[.;:]$/.test(last.text);

                const currentStartsBullet =

                    /^[•]/.test(item.text);

                if (

                    !lastEndsSentence &&

                    !currentStartsBullet

                ) {

                    last.text += " " + item.text;

                }

                else {

                    merged.push(item);

                }

            }

            step.items = merged;

        }

    }

    // ================================================
    // FINALIZAR PASOS
    // ================================================
    finalizeSteps() {

        const finalized = [];

        let id = 1;

        for (const step of this.taskSteps) {

            // ----------------------------
            // Validaciones
            // ----------------------------

            if (!step.title) {

                continue;

            }

            if (!Array.isArray(step.items)) {

                step.items = [];

            }

            // ----------------------------
            // Limpiar items vacíos
            // ----------------------------

            step.items = step.items.filter(item => {

                return (

                    item &&

                    item.text &&

                    item.text.trim().length > 0

                );

            });

            // ----------------------------
            // Normalizar título
            // ----------------------------

            const cleanTitle = step.title

            // eliminar líderes de puntos
            .replace(/\.{2,}\s*\d+$/, "")

            // eliminar página al final
            .replace(/\s+\d+$/, "")

            // espacios
            .replace(/\s+/g, " ")

            .trim();

            // ----------------------------
            // Preview
            // ----------------------------

            const preview =

                step.items.length

                    ? step.items[0].text

                    : "";

            // ----------------------------
            // Total palabras
            // ----------------------------

            let totalWords = 0;

            for (const item of step.items) {

                totalWords += item.text

                    .split(/\s+/)

                    .filter(Boolean)

                    .length;

            }

            finalized.push({

                // ---------------------------------
                // Identificación
                // ---------------------------------

                id,

                page: step.page,

                title: cleanTitle,

                shortTitle: cleanTitle

                    .replace(/^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s*/i, "")

                    .replace(/^\d+(\.\d+){1,4}\s*/, "")

                    .replace(/^[A-ZÑ]\.\s*/, "")

                    .trim(),

                // ---------------------------------
                // NUEVO
                // Mantener estructura jerárquica
                // ---------------------------------

                level: step.level,

                parentId: step.parentId,

                children: [...step.children],

                headerType: step.headerType,

                // ---------------------------------
                // Búsqueda
                // ---------------------------------

                searchKey:

                    this.normalizeText(cleanTitle),

                preview,

                // ---------------------------------
                // Estadísticas
                // ---------------------------------

                totalItems:

                    step.items.length,

                totalWords,

                expanded: false,

                // ---------------------------------
                // Contenido
                // ---------------------------------

                items: step.items

            });

            id++;

        }

        this.taskSteps = finalized;

        /*console.group("📋 FINAL TASK STEPS");

        console.table(

            this.taskSteps.map(step => ({

                id: step.id,

                page: step.page,

                level: step.level,

                parent: step.parentId,

                children: step.children.join(", "),

                type: step.headerType,

                title: step.title,

                items: step.totalItems,

                words: step.totalWords

            }))

        );

        console.groupEnd();*/

    }

    // ================================================
    // CONSTRUIR ÁRBOL DE PASOS
    // ================================================
    buildTaskTree() {

        const nodes = new Map();

        this.taskTree = [];

        // ---------------------------------------
        // Crear copia de cada nodo
        // ---------------------------------------

        for (const step of this.taskSteps) {

            nodes.set(step.id, {

                ...step,

                children: []

            });

        }

        // ---------------------------------------
        // Reconstruir jerarquía
        // ---------------------------------------

        for (const step of this.taskSteps) {

            const node = nodes.get(step.id);

            if (

                step.parentId === null ||

                !nodes.has(step.parentId)

            ) {

                this.taskTree.push(node);

                continue;

            }

            nodes

                .get(step.parentId)

                .children

                .push(node);

        }

        /*console.group("🌳 TASK TREE");

        console.dir(this.taskTree);

        console.groupEnd();*/

    }

    // ================================================
    // VALIDAR ÁRBOL
    // ================================================
    validateTaskTree() {

        const warnings = [];

        const ids = new Set(
            this.taskSteps.map(step => step.id)
        );

        for (const step of this.taskSteps) {

            // -----------------------------
            // Padre inexistente
            // -----------------------------

            if (

                step.parentId !== null &&

                !ids.has(step.parentId)

            ) {

                warnings.push({

                    type: "INVALID_PARENT",

                    step: step.title,

                    parent: step.parentId

                });

            }

            // -----------------------------
            // Nivel inválido
            // -----------------------------

            if (

                step.level < 1 ||

                step.level > 10

            ) {

                warnings.push({

                    type: "INVALID_LEVEL",

                    step: step.title,

                    level: step.level

                });

            }

            // -----------------------------
            // Sin contenido
            // -----------------------------

            if (

                !step.items.length &&

                !step.children.length

            ) {

                warnings.push({

                    type: "EMPTY_STEP",

                    step: step.title

                });

            }

        }

        /*if (warnings.length) {

            console.group("⚠️ TASK TREE WARNINGS");

            console.table(warnings);

            console.groupEnd();

        }
        else {

            console.log("✅ TaskTree validado correctamente.");

        }*/

        return warnings;

    }

    // ================================================
    // OBTENER ESTADÍSTICAS
    // ================================================
    getTaskStatistics() {

        let totalItems = 0;

        let totalWords = 0;

        for (const step of this.taskSteps) {

            totalItems += step.totalItems;

            totalWords += step.totalWords;

        }

        return {

            totalSteps: this.taskSteps.length,

            totalItems,

            totalWords,

            roots: this.taskTree.length

        };

    }

    // ================================================
    // OBTENER ÁRBOL COMPLETO
    // ================================================
    getTaskTree() {

        return this.taskTree;

    }

    // ================================================
    // CONSTRUIR UBICACIONES DEL TASK TREE
    // ================================================
    buildTaskLocations() {

        this.taskLocations.clear();

        const walk = nodes => {

            nodes.forEach(node => {

                const location = this.findTaskHeaderLocation(node);

                this.taskLocations.set(node.id, {

                    id: node.id,

                    page: node.page,

                    title: node.title,

                    level: node.level,

                    x: location?.x ?? null,

                    y: location?.y ?? null,

                    fragment: location?.fragment ?? null

                });

                if (
                    Array.isArray(node.children) &&
                    node.children.length
                ) {

                    walk(node.children);

                }

            });

        };

        walk(this.taskTree);

        /*console.group("📍 TASK LOCATIONS");

        console.table(
            [...this.taskLocations.values()]
        );

        console.groupEnd();*/

    }

    // ================================================
    // BUSCAR UBICACIÓN DEL ENCABEZADO
    // ================================================
    findTaskHeaderLocation(node) {

        const fragments =
            this.pageTextFragments.get(node.page);

        if (!fragments)
            return null;

        const target =
            this.normalizeText(node.title);

        let best = null;

        for (const fragment of fragments) {

            const text =
                this.normalizeText(fragment.text);

            if (text !== target)
                continue;

            // Ignorar líneas del índice
            if (/\.{3,}\d+$/.test(fragment.text))
                continue;

            // Ignorar títulos demasiado arriba
            if (fragment.y > 760)
                continue;

            best = {

                x: fragment.x,
                y: fragment.y,
                fragment

            };

            break;

        }

        return best;

    }

    // ================================================
    // OBTENER NODOS RAÍZ
    // ================================================
    getRootSteps() {

        return this.taskTree;

    }

    // ================================================
    // 📚 EXTRAER SECCIONES DEL PET
    // ================================================

    extractSections() {

        this.sections = {};

        if (!this.searchReady) {

            console.warn("⚠️ El índice aún no está listo.");

            return {};

        }

        const sectionPatterns = [

            "objetivo",
            "alcance",
            "responsabilidades",
            "equipos",
            "herramientas",
            "materiales",
            "epp",
            "pasos de la tarea",
            "riesgos",
            "controles",
            "restricciones",
            "anexos"

        ];

        for (const page of this.searchIndex) {

            const text = page.normalized;

            for (const section of sectionPatterns) {

                const index = text.indexOf(section);

                if (index === -1) continue;

                if (!this.sections[section]) {

                    this.sections[section] = {

                        page: page.page,

                        position: index,

                        preview: page.text.substring(

                            Math.max(0, index - 80),

                            Math.min(
                                page.text.length,
                                index + 300
                            )

                        )

                    };

                }

            }

        }

        /*console.log("📚 Secciones detectadas:");

        console.table(this.sections);*/

        return this.sections;

    }

    // ================================================
    // 📚 OBTENER UNA SECCIÓN
    // ================================================

    getSection(sectionName){

        if(!sectionName){

            return null;

        }

        return this.sections[
            sectionName.toLowerCase()
        ] || null;

    }

    // ================================================
    // LOCALIZAR COINCIDENCIAS
    // BÚSQUEDA FLEXIBLE + COORDENADAS EXACTAS
    // ================================================

    findSearchLocations(query) {

        this.searchLocations = [];


        // ============================================
        // CONSULTA VACÍA
        // ============================================

        if (!query) {

            return [];

        }


        const search =
            this.normalizeText(query);


        const terms =
            this.getSearchTerms(search);


        if (!terms.length) {

            return [];

        }


        /*
        * Evita que distintas ventanas de búsqueda
        * generen varias veces la misma coincidencia
        * física.
        */
        const duplicates =
            new Set();


        // ============================================
        // RECORRER PÁGINAS
        // ============================================

        for (const page of this.searchIndex) {

            const fragments =
                this.getPageCoordinates(
                    page.page
                );


            const rawFragments =
                this.getPageFragments(
                    page.page
                );


            if (!fragments.length) {

                continue;

            }


            const windows =
                this.buildSearchWindows(
                    page.page
                );


            for (const window of windows) {

                const normalized =
                    window.normalized;


                // ====================================
                // FRASE EXACTA
                // ====================================

                const exactMatch =
                    normalized.includes(
                        search
                    );


                // ====================================
                // TODAS LAS PALABRAS
                // ====================================

                const allTermsMatch =
                    terms.every(
                        term =>
                            normalized.includes(
                                term
                            )
                    );


                if (
                    !exactMatch &&
                    !allTermsMatch
                ) {

                    continue;

                }


                // ====================================
                // FRAGMENTOS DE ESTA VENTANA
                // ====================================

                const windowFragments =
                    fragments.slice(

                        window.startIndex,

                        window.endIndex + 1

                    );


                const matchedItems = [];

                const matchedItemKeys =
                    new Set();


                // ====================================
                // REGISTRAR UNA PALABRA EXACTA
                // DENTRO DE UN FRAGMENTO
                // ====================================

                const addMatchesForTerm =
                    (
                        term,
                        onlyFirst = false
                    ) => {

                        for (
                            let relativeIndex = 0;
                            relativeIndex <
                            windowFragments.length;
                            relativeIndex++
                        ) {

                            const fragment =
                                windowFragments[
                                    relativeIndex
                                ];


                            const fragmentText =
                                this.normalizeText(
                                    fragment.text || ""
                                );


                            if (!fragmentText) {

                                continue;

                            }


                            let position =
                                fragmentText.indexOf(
                                    term
                                );


                            while (
                                position !== -1
                            ) {

                                const absoluteIndex =

                                    window.startIndex +
                                    relativeIndex;


                                /*
                                * El fragmento de PDF puede
                                * contener varias palabras.
                                *
                                * Calculamos aproximadamente
                                * qué parte horizontal del
                                * fragmento corresponde al
                                * término encontrado.
                                */

                                // ============================================
                                // MEDIR EL ANCHO VISUAL REAL DEL TEXTO
                                // ============================================

                                const originalText =
                                    rawFragments[
                                        absoluteIndex
                                    ]?.text
                                    ||
                                    fragment.text
                                    ||
                                    "";


                                const normalizedOriginal =
                                    this.normalizeText(
                                        originalText
                                    );


                                /*
                                * Intentamos ubicar el término dentro
                                * del texto original normalizado.
                                */
                                const normalizedPosition =
                                    normalizedOriginal.indexOf(
                                        term
                                    );


                                let matchX =
                                    fragment.x;


                                let matchWidth =
                                    Math.max(
                                        fragment.width,
                                        2
                                    );


                                if (
                                    normalizedPosition !== -1 &&
                                    originalText.length
                                ) {

                                    // ========================================
                                    // CANVAS TEMPORAL PARA MEDIR TEXTO
                                    // ========================================

                                    if (!this._searchMeasureCanvas) {

                                        this._searchMeasureCanvas =
                                            document.createElement(
                                                "canvas"
                                            );

                                        this._searchMeasureContext =
                                            this._searchMeasureCanvas
                                                .getContext("2d");

                                    }


                                    const ctx =
                                        this._searchMeasureContext;


                                    if (ctx) {

                                        const fontSize =
                                            Math.max(
                                                fragment.fontSize || 12,
                                                6
                                            );


                                        ctx.font =
                                            `${fontSize}px Arial`;


                                        /*
                                        * Texto previo a la coincidencia.
                                        */
                                        const beforeText =
                                            normalizedOriginal.substring(
                                                0,
                                                normalizedPosition
                                            );


                                        /*
                                        * Texto exacto de la coincidencia.
                                        */
                                        const matchText =
                                            normalizedOriginal.substring(
                                                normalizedPosition,
                                                normalizedPosition +
                                                term.length
                                            );


                                        const totalMeasured =
                                            ctx.measureText(
                                                normalizedOriginal
                                            ).width;


                                        const beforeMeasured =
                                            ctx.measureText(
                                                beforeText
                                            ).width;


                                        const matchMeasured =
                                            ctx.measureText(
                                                matchText
                                            ).width;


                                        if (totalMeasured > 0) {

                                            const startRatio =
                                                beforeMeasured /
                                                totalMeasured;


                                            const widthRatio =
                                                matchMeasured /
                                                totalMeasured;


                                            // ========================================
                                            // PEQUEÑA COMPENSACIÓN VISUAL
                                            // ========================================

                                            const horizontalPadding =
                                                Math.max(
                                                    (fragment.fontSize || 12) * 0.015,
                                                    0.35
                                                );


                                            matchX =

                                                fragment.x +

                                                (
                                                    fragment.width *
                                                    startRatio
                                                )

                                                -

                                                horizontalPadding;


                                            matchWidth =

                                                Math.max(

                                                    (
                                                        fragment.width *
                                                        widthRatio
                                                    )

                                                    +

                                                    (
                                                        horizontalPadding * 2
                                                    ),

                                                    2

                                                );

                                        }

                                    }

                                }


                                const key = [

                                    page.page,

                                    absoluteIndex,

                                    term,

                                    position

                                ].join("-");


                                if (
                                    !matchedItemKeys.has(
                                        key
                                    )
                                ) {

                                    matchedItemKeys.add(
                                        key
                                    );


                                    matchedItems.push({

                                        fragmentIndex:
                                            absoluteIndex,

                                        term,

                                        text:

                                            rawFragments[
                                                absoluteIndex
                                            ]?.text

                                            ||

                                            fragment.text,

                                        x:
                                            matchX,

                                        y:
                                            fragment.y,

                                        width:
                                            matchWidth,

                                        height:
                                            fragment.height

                                    });

                                }


                                if (onlyFirst) {

                                    return true;

                                }


                                position =
                                    fragmentText.indexOf(

                                        term,

                                        position +
                                        Math.max(
                                            term.length,
                                            1
                                        )

                                    );

                            }

                        }


                        return false;

                    };


                // ====================================
                // UNA SOLA PALABRA
                // ====================================

                if (terms.length === 1) {

                    addMatchesForTerm(
                        terms[0],
                        false
                    );

                }

                // ====================================
                // VARIAS PALABRAS
                // ====================================

                else {

                    for (const term of terms) {

                        addMatchesForTerm(
                            term,
                            true
                        );

                    }

                }


                /*
                * Si la ventana coincide pero no
                * podemos relacionarla con ningún
                * fragmento físico, no creamos un
                * highlight falso.
                */

                if (!matchedItems.length) {

                    continue;

                }


                // ====================================
                // ORDEN FÍSICO
                // ====================================

                matchedItems.sort(
                    (a, b) =>
                        a.fragmentIndex -
                        b.fragmentIndex
                );


                // ====================================
                // EVITAR VENTANAS DUPLICADAS
                // ====================================

                const physicalKey =

                    `${page.page}:` +

                    matchedItems
                        .map(
                            item =>
                                `${item.fragmentIndex}-${item.term}-${Math.round(item.x * 10)}`
                        )
                        .join("|");


                if (
                    duplicates.has(
                        physicalKey
                    )
                ) {

                    continue;

                }


                duplicates.add(
                    physicalKey
                );


                // ====================================
                // ANCLA PARA NAVEGACIÓN
                // ====================================

                const anchor =
                    matchedItems[0];


                // ====================================
                // REGISTRAR RESULTADO
                // ====================================

                this.searchLocations.push({

                    id:
                        this.searchLocations.length,

                    page:
                        window.page,

                    index:
                        anchor.fragmentIndex,

                    endIndex:
                        window.endIndex,

                    text:
                        window.text,

                    /*
                    * Se mantienen estas propiedades
                    * porque scrollToSearchMatch(),
                    * getSearchContext() y ranking
                    * ya las utilizan.
                    */

                    x:
                        anchor.x,

                    y:
                        anchor.y,

                    width:
                        anchor.width,

                    height:
                        anchor.height,


                    /*
                    * NUEVO:
                    *
                    * posiciones físicas concretas
                    * que deben resaltarse.
                    */

                    matchedItems,


                    matchType:
                        exactMatch
                            ? "exact"
                            : "terms"

                });

            }

        }


        return this.searchLocations;

    }

    // ================================================
    // SIGUIENTE COINCIDENCIA
    // ================================================

    nextSearchMatch(){

        if(
            !this.searchLocations.length
        ){

            return null;

        }

        this.activeSearchLocation++;

        if(
            this.activeSearchLocation >=
            this.searchLocations.length
        ){

            this.activeSearchLocation = 0;

        }

        this.renderHighlights();
        this.notifySearchChanged();

        document.dispatchEvent(

            new CustomEvent(

                "pdf-search-active",

                {

                    detail:{

                        id:this.activeSearchLocation

                    }

                }

            )

        );

        const match =

            this.searchLocations[
                this.activeSearchLocation
            ];

        this.scrollToSearchMatch(match);

        return match;

    }

    // ================================================
    // COINCIDENCIA ANTERIOR
    // ================================================

    previousSearchMatch(){

        if(
            !this.searchLocations.length
        ){

            return null;

        }

        this.activeSearchLocation--;

        if(
            this.activeSearchLocation < 0
        ){

            this.activeSearchLocation =
                this.searchLocations.length - 1;

        }

        this.renderHighlights();
        this.notifySearchChanged();

        document.dispatchEvent(

            new CustomEvent(

                "pdf-search-active",

                {

                    detail:{

                        id:this.activeSearchLocation

                    }

                }

            )

        );

        const match =

            this.searchLocations[
                this.activeSearchLocation
            ];

        this.scrollToSearchMatch(match);

        return match;

    }

    // ================================================
    // 🔍 OBTENER RESULTADOS DE BÚSQUEDA
    // ================================================

    getSearchResults(){

        return [...this.searchMatches];

    }

    // ================================================
    // 📚 OBTENER SECCIONES PRINCIPALES DEL PET
    // ================================================

    getMainDocumentSections() {

        const sections = [];

        const registered =
            new Set();


        const validTitles =
            /^(OBJETIVO|RESPONSABLES|REQUERIMIENTOS|PROCEDIMIENTO|RESTRICCIONES|DOCUMENTOS|REGISTROS|ANEXOS|CONTROL)/i;


        for (const page of this.searchIndex) {

            const lines =
                page.text
                    .split("\n")
                    .map(line => line.trim())
                    .filter(Boolean);


            for (const line of lines) {

                /*
                * Ignorar entradas del índice:
                *
                * 4. PROCEDIMIENTO ............ 10
                */
                if (
                    /\.{3,}\s*\d+\s*$/.test(line)
                ) {

                    continue;

                }


                const match =
                    line.match(
                        /^([1-9])\.\s+(.+)/
                    );


                if (!match) {

                    continue;

                }


                const number =
                    match[1];


                const title =
                    match[2]
                        .replace(/\s+/g, " ")
                        .trim();


                if (
                    !validTitles.test(title)
                ) {

                    continue;

                }


                /*
                * Registrar solamente la primera
                * aparición real de cada sección.
                */
                if (
                    registered.has(number)
                ) {

                    continue;

                }


                registered.add(number);


                sections.push({

                    number,

                    page:
                        page.page,

                    title:
                        `${number}. ${title}`,

                    shortTitle:
                        title

                });

            }

        }


        return sections;

    }

    // ================================================
    // 🔎 OBTENER CONTEXTO DE UNA COINCIDENCIA
    // ================================================

    getSearchContext(location) {

        if (!location) {

            return {

                sectionTitle: "",
                sectionShortTitle: "",
                mainSectionTitle: "",
                sectionPath: []

            };

        }


        // ============================================
        // 1. SECCIÓN PRINCIPAL
        // ============================================

        const mainSections =
            this.getMainDocumentSections();


        let mainSection =
            null;


        for (const section of mainSections) {

            if (
                section.page <=
                location.page
            ) {

                mainSection =
                    section;

            }

            else {

                break;

            }

        }


        // ============================================
        // 2. CONTEXTO INTERNO DEL PROCEDIMIENTO
        // ============================================

        let outlineNode =
            null;


        /*
        * El outline corresponde principalmente
        * al bloque 4. PROCEDIMIENTO.
        */
        if (
            mainSection?.number === "4" &&
            Array.isArray(this.outline) &&
            this.outline.length
        ) {

            const ordered =
                [...this.outline]
                    .sort((a, b) => {

                        if (
                            a.page !== b.page
                        ) {

                            return (
                                a.page -
                                b.page
                            );

                        }

                        /*
                        * En coordenadas PDF:
                        * Y mayor = texto más arriba.
                        */
                        return (
                            b.y -
                            a.y
                        );

                    });


            for (const node of ordered) {

                const isBeforeMatch =

                    node.page <
                        location.page

                    ||

                    (
                        node.page ===
                            location.page

                        &&

                        node.y >=
                            location.y - 3
                    );


                if (
                    isBeforeMatch
                ) {

                    outlineNode =
                        node;

                    continue;

                }


                /*
                * Ya pasamos la posición
                * de la coincidencia.
                */
                if (
                    node.page >
                        location.page
                ) {

                    break;

                }

            }

        }


        // ============================================
        // 3. CREAR RUTA DEL ENCABEZADO
        // ============================================

        const sectionPath = [];


        if (outlineNode) {

            let current =
                outlineNode;


            const visited =
                new Set();


            while (
                current &&
                !visited.has(current.id)
            ) {

                visited.add(
                    current.id
                );


                sectionPath.unshift(

                    current.shortTitle ||
                    current.title

                );


                if (
                    current.parent === null ||
                    current.parent === undefined
                ) {

                    break;

                }


                current =
                    this.outlineIndex.get(
                        current.parent
                    );

            }

        }


        // ============================================
        // 4. RESULTADO
        // ============================================

        if (outlineNode) {

            return {

                sectionTitle:
                    outlineNode.title,

                sectionShortTitle:
                    outlineNode.shortTitle ||
                    outlineNode.title,

                mainSectionTitle:
                    mainSection?.title || "",

                sectionLevel:
                    outlineNode.level,

                sectionType:
                    outlineNode.type,

                sectionPath

            };

        }


        if (mainSection) {

            return {

                sectionTitle:
                    mainSection.title,

                sectionShortTitle:
                    mainSection.shortTitle,

                mainSectionTitle:
                    mainSection.title,

                sectionLevel:
                    1,

                sectionType:
                    "main",

                sectionPath: [
                    mainSection.shortTitle
                ]

            };

        }


        return {

            sectionTitle: "",
            sectionShortTitle: "",
            mainSectionTitle: "",
            sectionLevel: null,
            sectionType: null,
            sectionPath: []

        };

    }

    // ================================================
    // ⭐ CALCULAR RELEVANCIA DE UNA COINCIDENCIA
    // ================================================

    calculateSearchRelevance(
        location,
        query
    ) {

        if (
            !location ||
            !query
        ) {

            return 0;

        }


        const search =
            this.normalizeText(query);


        const terms =
            this.getSearchTerms(search);


        const context =
            this.getSearchContext(
                location
            );


        const sectionTitle =
            this.normalizeText(

                context.sectionTitle ||
                context.sectionShortTitle ||
                ""

            );


        const mainSectionTitle =
            this.normalizeText(

                context.mainSectionTitle ||
                ""

            );


        const resultText =
            this.normalizeText(
                location.text || ""
            );


        let score = 0;


        // ============================================
        // 1. FRASE EXACTA EN TÍTULO ESPECÍFICO
        // ============================================

        if (
            sectionTitle &&
            sectionTitle.includes(search)
        ) {

            score += 300;

        }


        // ============================================
        // 2. TODAS LAS PALABRAS EN TÍTULO ESPECÍFICO
        // ============================================

        if (
            sectionTitle &&
            terms.length &&
            terms.every(
                term =>
                    sectionTitle.includes(term)
            )
        ) {

            score += 220;

        }


        // ============================================
        // 3. FRASE EXACTA EN SECCIÓN PRINCIPAL
        // ============================================

        if (
            mainSectionTitle &&
            mainSectionTitle.includes(search)
        ) {

            score += 180;

        }


        // ============================================
        // 4. TODAS LAS PALABRAS EN SECCIÓN PRINCIPAL
        // ============================================

        if (
            mainSectionTitle &&
            terms.length &&
            terms.every(
                term =>
                    mainSectionTitle.includes(term)
            )
        ) {

            score += 140;

        }


        // ============================================
        // 5. FRASE EXACTA EN EL TEXTO ENCONTRADO
        // ============================================

        if (
            resultText.includes(search)
        ) {

            score += 100;

        }


        // ============================================
        // 6. TODAS LAS PALABRAS EN EL TEXTO
        // ============================================

        if (
            terms.length &&
            terms.every(
                term =>
                    resultText.includes(term)
            )
        ) {

            score += 70;

        }


        // ============================================
        // 7. TIPO DE COINCIDENCIA
        // ============================================

        if (
            location.matchType === "exact"
        ) {

            score += 30;

        }

        else if (
            location.matchType === "terms"
        ) {

            score += 15;

        }


        // ============================================
        // 8. BONUS POR CANTIDAD DE PALABRAS
        // ============================================

        const matchedTerms =
            terms.filter(
                term =>
                    resultText.includes(term) ||
                    sectionTitle.includes(term)
            );


        score +=
            matchedTerms.length * 10;


        return score;

    }

    // ================================================
    // ⭐ ORDENAR RESULTADOS POR RELEVANCIA
    // ================================================

    sortSearchLocationsByRelevance(
        query
    ) {

        if (
            !Array.isArray(
                this.searchLocations
            ) ||
            !this.searchLocations.length
        ) {

            return;

        }


        this.searchLocations.forEach(
            location => {

                location.relevance =
                    this.calculateSearchRelevance(
                        location,
                        query
                    );

            }
        );


        this.searchLocations.sort(
            (a, b) => {

                // ====================================
                // 1. MAYOR RELEVANCIA
                // ====================================

                if (
                    b.relevance !==
                    a.relevance
                ) {

                    return (
                        b.relevance -
                        a.relevance
                    );

                }


                // ====================================
                // 2. COINCIDENCIA EXACTA
                // ====================================

                if (
                    a.matchType !==
                    b.matchType
                ) {

                    if (
                        a.matchType ===
                        "exact"
                    ) {

                        return -1;

                    }

                    if (
                        b.matchType ===
                        "exact"
                    ) {

                        return 1;

                    }

                }


                // ====================================
                // 3. ORDEN DOCUMENTAL
                // ====================================

                if (
                    a.page !== b.page
                ) {

                    return (
                        a.page -
                        b.page
                    );

                }


                return (
                    a.index -
                    b.index
                );

            }
        );


        /*
        * IMPORTANTE:
        *
        * después de ordenar debemos volver
        * a numerar los IDs porque el sidebar
        * usa estos IDs para navegar.
        */

        this.searchLocations.forEach(
            (location, index) => {

                location.id =
                    index;

            }
        );

    }

    // ================================================
    // RESULTADOS DETALLADOS DEL BUSCADOR
    // CON CONTEXTO DEL PET
    // ================================================

    getDetailedSearchResults() {

        return this.searchLocations.map(
            location => {

                const context =
                    this.getSearchContext(
                        location
                    );


                return {

                    id:
                        location.id,

                    page:
                        location.page,

                    text:
                        location.text,

                    preview:

                        location.text.length > 140

                            ? location.text.substring(
                                0,
                                140
                            ) + "..."

                            : location.text,


                    // ================================
                    // TIPO DE COINCIDENCIA
                    // ================================

                    matchType:
                        location.matchType ||
                        "exact",

                    relevance:
                        location.relevance || 0,


                    // ================================
                    // CONTEXTO DEL PET
                    // ================================

                    sectionTitle:
                        context.sectionTitle,

                    sectionShortTitle:
                        context.sectionShortTitle,

                    mainSectionTitle:
                        context.mainSectionTitle,

                    sectionLevel:
                        context.sectionLevel,

                    sectionType:
                        context.sectionType,

                    sectionPath:
                        context.sectionPath

                };

            }

        );

    }

    // ================================================
    // IR A UN RESULTADO
    // ================================================

    goToSearchResult(id){

        const match =

            this.searchLocations.find(

                item=>item.id===id

            );

        if(!match){

            return false;

        }

        this.activeSearchLocation =

            this.searchLocations.indexOf(match);

        this.renderHighlights();

        this.notifySearchChanged();

        this.scrollToSearchMatch(match);

        return true;

    }

    // ================================================
    // OBTENER UBICACIONES DE COINCIDENCIAS
    // ================================================

    getSearchLocations(){

        return [...this.searchLocations];

    }

    getCurrentSearchMatch(){

        if(
            this.activeSearchLocation < 0
        ){

            return null;

        }

        return this.searchLocations[
            this.activeSearchLocation
        ];

    }

    getSearchStatus(){

        return {

            current:

                this.activeSearchLocation >= 0

                    ? this.activeSearchLocation + 1

                    : 0,

            total:

                this.searchLocations.length

        };

    }

    // ================================================
    // TOTAL DE RESULTADOS
    // ================================================

    getSearchCount(){

        return this.searchLocations.length;

    }

    // ================================================
    // 📄 OBTENER TEXTO DE UNA PÁGINA
    // ================================================

    getPageText(pageNumber){

        return this.pageTextCache.get(pageNumber) || "";

    }

    // ================================================
    // 🧪 DEBUG DEL ÍNDICE DE TEXTO
    // ================================================

    debugSearchIndex(){

        if(!this.searchReady){

            console.warn("Índice no construido.");

            return;

        }

        /*console.group("📚 SEARCH INDEX");

        this.searchIndex.forEach(page=>{

            console.group(

                `Página ${page.page}`

            );

            console.log(page.text);

            console.groupEnd();

        });

        console.groupEnd();*/

    }

    // ================================================
    // OBTENER FRAGMENTOS DE UNA PÁGINA
    // ================================================

    getPageFragments(pageNumber){

        return this.pageTextFragments.get(pageNumber) || [];

    }

    // ================================================
    // OBTENER COORDENADAS NORMALIZADAS
    // ================================================

    getPageCoordinates(pageNumber){

        return this.textCoordinates.get(pageNumber) || [];

    }

    // ================================================
    // CONSTRUIR VENTANAS DE BÚSQUEDA
    // ================================================

    buildSearchWindows(pageNumber){

        const fragments =
            this.getPageCoordinates(pageNumber);

        const windows = [];

        const MAX_WORDS = 8;

        for(let start = 0; start < fragments.length; start++){

            let combinedText = "";

            for(
                let end = start;
                end < Math.min(
                    fragments.length,
                    start + MAX_WORDS
                );
                end++
            ){

                if(combinedText){

                    combinedText += " ";

                }

                combinedText +=
                    fragments[end].text;

                windows.push({

                    page: pageNumber,

                    startIndex: start,

                    endIndex: end,

                    text: combinedText,

                    normalized: this.normalizeText(combinedText),

                    x: fragments[start].x,

                    y: fragments[start].y,

                    width:
                        fragments[end].x +
                        fragments[end].width -
                        fragments[start].x,

                    height: Math.max(

                        ...fragments
                            .slice(start,end+1)
                            .map(f=>f.height)

                    )

                });

            }

        }

        return windows;

    }

    // ================================================
    // DIBUJAR RESALTADOS EXACTOS DE UNA PÁGINA
    // ================================================

    renderPageHighlights(pageNumber) {

        this.clearHighlightLayer(
            pageNumber
        );


        const layer =
            this.highlightLayers.get(
                pageNumber
            );


        if (!layer) {

            return;

        }


        const pageData =
            this.pages[
                pageNumber - 1
            ];


        if (!pageData) {

            return;

        }


        // ============================================
        // GARANTIZAR QUE LA CAPA QUEDE
        // ENCIMA DEL CANVAS
        // ============================================

        layer.style.position =
            "absolute";

        layer.style.inset =
            "0";

        layer.style.width =
            "100%";

        layer.style.height =
            "100%";

        layer.style.zIndex =
            "40";

        layer.style.pointerEvents =
            "none";

        layer.style.overflow =
            "hidden";


        const viewport =

            pageData.page.getViewport({

                scale:
                    this.scale

            });


        // ============================================
        // RESULTADO ACTUAL
        // ============================================

        const activeLocation =

            this.activeSearchLocation >= 0

                ? this.searchLocations[
                    this.activeSearchLocation
                ]

                : null;


        // ============================================
        // COINCIDENCIAS DE ESTA PÁGINA
        // ============================================

        const pageLocations =

            this.searchLocations.filter(

                item =>
                    item.page === pageNumber

            );


        pageLocations.forEach(
            location => {


                /*
                * Con el nuevo motor usamos las
                * coordenadas individuales.
                *
                * El fallback permite que búsquedas
                * antiguas sigan funcionando.
                */

                const items =

                    Array.isArray(
                        location.matchedItems
                    )

                    &&

                    location.matchedItems.length

                        ? location.matchedItems

                        : [{

                            x:
                                location.x,

                            y:
                                location.y,

                            width:
                                location.width,

                            height:
                                location.height,

                            fragmentIndex:
                                location.index

                        }];


                items.forEach(
                    (item, itemIndex) => {


                        if (
                            item.x === undefined ||
                            item.y === undefined
                        ) {

                            return;

                        }


                        const marker =

                            document.createElement(
                                "div"
                            );


                        marker.className =
                            "pdf-search-highlight";


                        // ====================================
                        // RESULTADO ACTIVO
                        // ====================================

                        if (
                            activeLocation &&
                            activeLocation.id ===
                                location.id
                        ) {

                            marker.classList.add(
                                "active"
                            );

                        }


                        marker.dataset.page =
                            pageNumber;


                        marker.dataset.index =
                            location.index;


                        marker.dataset.match =
                            itemIndex;


                        // ====================================
                        // PDF → COORDENADAS DEL VIEWPORT
                        // ====================================

                        const [left, top] =

                            viewport
                                .convertToViewportPoint(

                                    item.x,

                                    item.y

                                );


                        const scaledWidth =

                            Math.max(

                                item.width *
                                viewport.scale,

                                3

                            );


                        const scaledHeight =

                            Math.max(

                                item.height *
                                viewport.scale,

                                8

                            );


                        // ====================================
                        // DIBUJAR RECTÁNGULO
                        // ====================================

                        marker.style.left =
                            `${left}px`;


                        marker.style.top =
                            `${top - scaledHeight}px`;


                        marker.style.width =
                            `${scaledWidth}px`;


                        marker.style.height =
                            `${scaledHeight}px`;


                        layer.appendChild(
                            marker
                        );

                    }

                );

            }

        );

    }

    // ================================================
    // DIBUJAR RESALTADOS
    // ================================================

    renderHighlights(){

        this.highlightLayers.forEach((_,page)=>{

            this.renderPageHighlights(page);

        });

    }

    // ================================================
    // LIMPIAR RESALTADOS VISUALES
    // ================================================

    clearHighlightLayer(pageNumber){

        const layer = this.highlightLayers.get(pageNumber);

        if(!layer){

            return;

        }

        layer.innerHTML = "";

    }

    // ================================================
    // LIMPIAR TODOS LOS RESALTADOS
    // ================================================

    clearAllHighlights(){

        this.highlightLayers.forEach(layer=>{

            layer.innerHTML = "";

        });

        document.dispatchEvent(

            new CustomEvent(

                "pdf-search-results",

                {

                    detail:[]

                }

            )

        );

    }

    // ================================
    // 📋 OBTENER PASOS DE LA TAREA
    // ================================

    getTaskSteps() {

        if (!Array.isArray(this.taskSteps)) {
            return [];
        }

        return this.taskSteps.map(step => ({
            id: step.id,
            step: step.id,
            title: step.title,
            page: step.page,
            items: step.items || [],
            level: step.level || 1,
            headerType: step.headerType,
            children: step.children || []
        }));

    }

    // ================================
    // 🎯 NAVEGAR A UN PASO DE TAREA
    // ================================

    goToTaskStep(stepId) {

        if (!stepId) {
            console.warn("❌ stepId no proporcionado");
            return false;
        }

        // Buscar el paso por ID
        const step = this.taskSteps.find(s => s.id === stepId);

        if (!step) {
            console.warn("❌ Paso no encontrado:", stepId);
            return false;
        }

        // Usar la función scrollToTask que ya existe
        return this.scrollToTask(stepId);

    }

    // =====================================================
    // DOCUMENT OUTLINE ENGINE
    // =====================================================

    resetOutline(){

        this.outlineFragments = [];

        this.outlineLines = [];

        this.outline = [];

        this.outlineTree = [];

        this.outlineTaskSteps = [];

        this.outlineIndex.clear();

        this.outlineLocations.clear();

        this.outlineRange = {

            startPage:null,
            endPage:null,

            startIndex:null,
            endIndex:null

        };

        this.outlineStats = {

            totalFragments:0,

            totalHeadings:0,

            totalLevels:0

        };

    }

    getOutline(){

        return this.outline;

    }

    getOutlineTree(){

        return this.outlineTree;

    }

    // =====================================================
    // OBTENER NODOS RAÍZ
    // =====================================================

    getOutlineRoots(){

        return this.outlineTree;

    }

    // =====================================================
    // OBTENER HIJOS
    // =====================================================

    getOutlineChildren(id){

        const node =

            this.getOutlineNode(id);

        if(!node){

            return [];

        }

        return node.children;

    }

    // =====================================================
    // OBTENER PADRE
    // =====================================================

    getOutlineParent(id){

        const node =

            this.getOutlineNode(id);

        if(!node){

            return null;

        }

        if(node.parent===null){

            return null;

        }

        return this.getOutlineNode(

            node.parent

        );

    }

    getOutlineNode(id){

        return this.outlineIndex.get(id) || null;

    }

    getOutlineLocation(id){

        return this.outlineLocations.get(id) || null;

    }

    debugOutline(){

        console.group(

            "DOCUMENT OUTLINE"

        );

        console.table(

            this.outline.map(node=>({

                id:node.id,

                title:node.title,

                level:node.level,

                parent:node.parent,

                children:node.children.length,

                page:node.page

            }))

        );

        console.groupEnd();

    }

    // =====================================================
    // EXTRAER RANGO DEL PROCEDIMIENTO
    // =====================================================

    extractProcedureRange() {

        this.resetOutline();

        if (!this.searchReady) {
            return;
        }

        const startRegex =
            /^\s*4(\.\d+)?\.?\s+PROCEDIMIENTO\b/i;

        const endRegex =
            /^\s*5(\.\d+)?\.?\s+RESTRICCIONES\b/i;

        let started = false;

        for (const page of this.searchIndex) {

            // Ignorar índice
            if (page.page === 1) {
                continue;
            }

            const fragments =
                this.pageTextFragments.get(page.page);

            if (!fragments) {
                continue;
            }

            for (let i = 0; i < fragments.length; i++) {

                const fragment = fragments[i];

                const text =
                    fragment.text.trim();

                if (!text) {
                    continue;
                }

                // Inicio del procedimiento
                if (!started) {

                    if (startRegex.test(text)) {

                        started = true;

                        this.outlineRange.startPage =
                            page.page;

                        this.outlineRange.startIndex =
                            i;

                    }

                }

                if (started) {

                    this.outlineFragments.push({

                        page: page.page,

                        index: i,

                        text: fragment.text,

                        x: fragment.x,

                        y: fragment.y,

                        width: fragment.width,

                        height: fragment.height,

                        fontSize: fragment.fontSize

                    });

                }

                // Fin del procedimiento
                if (
                    started &&
                    endRegex.test(text)
                ) {

                    this.outlineRange.endPage =
                        page.page;

                    this.outlineRange.endIndex =
                        i;

                    started = false;

                    break;

                }

            }

            if (!started && this.outlineRange.endPage) {
                break;
            }

        }

        this.outlineStats.totalFragments =
            this.outlineFragments.length;

        /*console.group("DOCUMENT OUTLINE RANGE");

        console.log("Rango:");

        console.table(this.outlineRange);

        console.log("Total Fragmentos:", this.outlineFragments.length);

        console.table(this.outlineFragments);

        console.groupEnd();*/

    }

    // =====================================================
    // RECONSTRUIR LÍNEAS DEL PROCEDIMIENTO
    // =====================================================

    mergeFragmentsIntoLines(){

        this.outlineLines = [];

        if(!this.outlineFragments.length){

            return;

        }

        const pages = new Map();

        for (const fragment of this.outlineFragments) {

            if (!pages.has(fragment.page)) {
                pages.set(fragment.page, []);
            }

            pages.get(fragment.page).push(fragment);

        }

        pages.forEach((fragments,page)=>{

            fragments.sort((a,b)=>{

                if(Math.abs(a.y-b.y)>2){

                    return b.y-a.y;

                }

                return a.x-b.x;

            });

            let current=null;

            for(const fragment of fragments){

                if(

                    !current ||

                    Math.abs(current.y-fragment.y)>3

                ){

                    current={

                        page,

                        y:fragment.y,

                        x:fragment.x,

                        width:fragment.width,

                        height:fragment.height,

                        fontSize:fragment.fontSize,

                        fragments:[fragment]

                    };

                    this.outlineLines.push(current);

                }

                else{

                    current.fragments.push(fragment);

                    current.width=

                        fragment.x+

                        fragment.width-

                        current.x;

                }

            }

        });

        this.outlineLines.forEach(line=>{

            line.fragments.sort((a,b)=>a.x-b.x);

            line.text=

                line.fragments

                    .map(f=>f.text)

                    .join(" ")

                    .replace(/\s+/g," ")

                    .trim();

        });

        /*console.group("DOCUMENT OUTLINE LINES");

        console.table(

            this.outlineLines.map(line=>({

                page:line.page,

                text:line.text,

                y:line.y,

                fragments:line.fragments.length

            }))

        );

        console.groupEnd();*/

    }

    // =====================================================
    // DETECTAR ESTILOS DEL DOCUMENTO
    // =====================================================

   detectHeadingStyles() {

        if (!this.outlineFragments.length) {

            return;

        }

        const histogram = new Map();

        for (const line of this.outlineLines) {

            const size = Math.round(line.fontSize);

            histogram.set(

                size,

                (histogram.get(size) || 0) + 1

            );

        }

        let normalSize = 0;

        let normalCount = 0;

        histogram.forEach((count, size) => {

            if (count > normalCount) {

                normalCount = count;

                normalSize = size;

            }

        });

        this.headingStyles.normalSize = normalSize;

        this.headingStyles.headingSize =

            Math.max(

                ...histogram.keys()

            );

        /*console.group("DOCUMENT STYLES");

        console.table(

            [...histogram.entries()].map(

                ([size, count]) => ({

                    size,

                    count

                })

            )

        );

        console.log(

            "Texto:",

            normalSize

        );

        console.log(

            "Encabezado:",

            this.headingStyles.headingSize

        );

        console.groupEnd();*/

    }

    // =====================================================
    // DETECTAR ENCABEZADOS
    // =====================================================

    detectOutlineHeadings() {

        this.outline = [];

        let id = 1;

        for (const line of this.outlineLines) {

            const text = line.text.trim();

            if (!text) {
                continue;
            }

            let level = null;

            let type = null;

            // -----------------------------
            // 4.2.1
            // -----------------------------

            if (/^\d+(\.\d+)+/.test(text)) {

                level =
                    text.match(/\./g).length;

                type = "decimal";

            }

            // -----------------------------
            // I.
            // -----------------------------

            else if (

                /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\./i.test(text)

            ) {

                level = 1;

                type = "roman";

            }

            // -----------------------------
            // A.
            // -----------------------------

            else if (

                /^[A-ZÑ]\./.test(text)

            ) {

                level = 3;

                type = "letter";

            }

            // -----------------------------
            // Encabezados visuales
            // -----------------------------

            else if (

                line.fontSize >=        // ✅ CORREGIDO: line en lugar de fragment
                this.headingStyles.headingSize

            ) {

                level = 2;

                type = "visual";

            }

            if (level === null) {
                continue;
            }

            const node = {

                id,

                title: text,

                shortTitle:

                    text

                        .replace(/^(\d+(\.\d+)*)\s*/, "")

                        .replace(/^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s*/i, "")

                        .replace(/^[A-ZÑ]\.\s*/, "")

                        .trim(),

                page: line.page,

                x: line.x,

                y: line.y,

                width: line.width,

                height: line.height,

                fontSize: line.fontSize,

                level,

                type,

                parent: null,

                children: []

            };

            this.outline.push(node);

            this.outlineIndex.set(
                id,
                node
            );

            this.outlineLocations.set(
                id,
                {

                    page: line.page,    // ✅ CORREGIDO: line.page
                    x: line.x,           // ✅ CORREGIDO: line.x
                    y: line.y            // ✅ CORREGIDO: line.y

                }

            );

            id++;

        }

        this.outlineStats.totalHeadings =
            this.outline.length;

        /*console.group(
            "DOCUMENT OUTLINE HEADINGS"
        );

        console.table(this.outline);

        console.groupEnd();*/

    }

    // =====================================================
    // CONSTRUIR ÁRBOL DEL DOCUMENTO
    // =====================================================

    buildOutlineTree(){

        this.outlineTree = [];

        if(!this.outline.length){

            return;

        }

        const stack = [];

        for(const node of this.outline){

            node.parent = null;

            const cloned = {

                ...node,

                children: []

            };

            while(

                stack.length &&

                stack[stack.length-1].level >= node.level

            ){

                stack.pop();

            }

            if(stack.length){

                node.parent =
                    stack[stack.length-1].id;

                stack[stack.length-1]
                    .children
                    .push(node);

            }

            else{

                this.outlineTree.push(node);

            }

            stack.push(node);

        }

        this.outlineStats.totalLevels =

            Math.max(

                ...this.outline.map(
                    n=>n.level
                )

            );

        /*console.group(

            "DOCUMENT OUTLINE TREE"

        );

        console.dir(

            this.outlineTree

        );

        console.groupEnd();*/

    }

    // =====================================================
    // EXPORTAR OUTLINE A TASK STEPS
    // =====================================================

    exportOutlineTasks() {

        const outlineSteps = [];

        const walk = (nodes, parent = null) => {

            nodes.forEach(node => {

                outlineSteps.push({

                    id: node.id,

                    page: node.page,

                    title: node.title,

                    shortTitle: node.shortTitle,

                    level: node.level,

                    parentId: parent,

                    headerType: node.type,

                    items: [],

                    children: node.children.map(
                        child => child.id
                    )

                });

                walk(node.children, node.id);

            });

        };

        walk(this.outlineTree);

        this.outlineTaskSteps = outlineSteps;

        /*console.group("TASK STEPS FROM OUTLINE");

        console.table(outlineSteps);

        console.groupEnd();*/

    }

    // ================================
    // 🧹 DESTROY
    // ================================

    destroy() {
        // ✅ Cancelar una carga de PDF que aún esté en progreso
        if (this.loadingTask) {
            try {
                this.loadingTask.destroy();
            } catch (e) {
                console.warn("No se pudo cancelar loadingTask", e);
            }
            this.loadingTask = null;
        }

        for (const task of this.renderTasks.values()) {
            try {
                task.cancel();
            } catch {}
        }

        this.renderTasks.clear();

        this.observer?.disconnect();
        this.pageObserver?.disconnect();

        this.viewer.innerHTML = "";

        // ================================
        // 🔎 SEARCH RESET
        // ================================

        this.searchIndex = [];
        this.searchMatches = [];
        this.currentMatch = -1;
        this.activeSearchLocation = -1;

        this.totalSearchLocations = 0;
        this.searchQuery = "";
        this.searchReady = false;
        this.pageTextCache.clear();
        this.textCoordinates.clear();

        this.pageTextFragments.clear();
        this.searchLocations = [];
        this.highlightLayers.clear();
        this.pages = [];
        this.sections = {};
        this.procedureBlock = null;
        this.procedureType = null;
        this.pdfDoc = null;
        this.documentType =
            "pets";
        this.taskSteps = [];
        this.taskMap.clear();
        this.taskTree = [];
        this.resetOutline();
        this.loadedAt = null;
        this.currentPage = 1;

        this._scrolling = false;
        this._zooming = false;
        this._isLoading = false;
        this._loadId = 0;

        clearTimeout(this.searchDebounce);
        clearTimeout(this._scrollEnd);
        clearTimeout(this.zoomTimeout);

        this.initializeObserver();
        this.initializePageObserver();
    }

    // ================================
    // 🧹 CLEANUP (para recargar sin romper el worker)
    // ================================

    _cleanup() {
        // ✅ NO destruir el worker, solo cancelar tareas de render
        for (const task of this.renderTasks.values()) {
            try {
                task.cancel();
            } catch {}
        }
        this.renderTasks.clear();

        // ✅ Desconectar observers
        this.observer?.disconnect();
        this.pageObserver?.disconnect();

        // ✅ Limpiar el viewer
        this.viewer.innerHTML = "";

        // ✅ Resetear estado (pero NO el worker)
        this.searchIndex = [];
        this.searchMatches = [];
        this.currentMatch = -1;
        this.activeSearchLocation = -1;
        this.totalSearchLocations = 0;
        this.searchQuery = "";
        this.searchReady = false;
        this.pageTextCache.clear();
        this.textCoordinates.clear();
        this.pageTextFragments.clear();
        this.searchLocations = [];
        this.highlightLayers.clear();
        this.pages = [];
        this.sections = {};
        this.procedureBlock = null;
        this.procedureType = null;
        this.pdfDoc = null;
        this.documentType =
            "pets";
        this.taskSteps = [];
        this.taskMap.clear();
        this.taskTree = [];
        this.resetOutline();
        this.loadedAt = null;
        this.currentPage = 1;
        this._scrolling = false;
        this._zooming = false;

        clearTimeout(this.searchDebounce);
        clearTimeout(this._scrollEnd);
        clearTimeout(this.zoomTimeout);

        this.initializeObserver();
        this.initializePageObserver();
    }
}