define([
    'dijit/_WidgetBase', // widget mixins and template
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./AdvancedDraw/templates/AdvancedDraw.html',

    './AdvancedDraw/advancedDrawConfig', // default config and i18n
    'dojo/i18n!./AdvancedDraw/nls/resource',

    'dojo/_base/declare', // dojo base
    'dojo/_base/lang',

    'dojo/on', // events
    //'dojo/topic',

    'dojo/keys', // keys

    'dojo/html', // dom
    'dojo/dom',
    'dojo/dom-geometry',
    'dojo/dom-class',

    // esri
    'esri/toolbars/draw', // toolbars
    'esri/toolbars/edit',
    'esri/layers/GraphicsLayer', // layers
    'esri/layers/FeatureLayer',
    'esri/symbols/jsonUtils', // symbols
    'esri/graphic', // graphic
    'esri/geometry/Polygon', // geometry
    'esri/geometry/screenUtils',
    'esri/geometry/webMercatorUtils',
    'esri/undoManager', // undo

    './AdvancedDraw/undo/addGraphicOp', // undo operations
    './AdvancedDraw/undo/deleteGraphicOp',
    './AdvancedDraw/undo/editGeometryGraphicOp',

    './AdvancedDraw/widget/TextTooltipDialog', // advanced draw widgets
    './AdvancedDraw/widget/DefaultSymbolEditors',

    'dijit/popup', // programmatic dijits
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',

    // in template dijits and css
    'dijit/layout/StackContainer',
    'dijit/layout/TabContainer',
    'dijit/layout/ContentPane',
    'dijit/Toolbar',
    'dijit/form/CheckBox',
    'dijit/form/Button',
    'dijit/form/DropDownButton',
    'dijit/form/ComboButton',
    'dijit/form/ToggleButton',
    'xstyle/css!./AdvancedDraw/css/AdvancedDraw.css'
], function (
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    template,
    advancedDrawConfig,
    i18n,
    declare,
    lang,
    on,
    //topic,
    keys,
    html,
    dom,
    domGeom,
    domClass,
    Draw,
    Edit,
    GraphicsLayer,
    FeatureLayer,
    symbolUtils,
    Graphic,
    Polygon,
    screenUtils,
    webMercatorUtils,
    UndoManager,
    AddGraphicOp,
    DeleteGraphicOp,
    EditGeometryGraphicOp,
    TextTooltipDialog,
    DefaultSymbolEditors,
    popup,
    Menu,
    MenuItem,
    PopupMenuItem
) {
    var AdvancedDraw = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // widget
        templateString: template,
        baseClass: 'AdvancedDrawWidget',
        // params mixin
        _params: {
            map: null, // class params
            config: null,
            stickyLayers: true,
            stickyPosition: 'bottom',
            _layers: {
                polygon: null,
                polyline: null,
                point: null,
                text: null,
                temp: null
            }, // hash of layers
            _layersLoaded: false, // what is says
            _symbols: {
                polygon: null,
                polyline: null,
                point: null,
                text: null,
                temp: null
            }, // hash of symbols
            _continuousDraw: false, // one and done OR user cancel draw
            _isTextPoint: false, // flag to handle text on draw-complete
            _drawMenu: null, // primary draw menu
            _undo: null, // undo manager
            //undocumented or unused
            manualLayerLoad: false // unused - enhancement - don't _initLayers when true - add public method to init layers at devs discretion
        },

        constructor: function (params) {
            // mixin params
            lang.mixin(this, this._params, params || {});

            // i18n for widget template
            this.i18n = i18n;
        },

        postCreate: function () {
            this.inherited(arguments);
            // map is required
            if (!this.map) {
                console.log('hey...advanced draw needs a map');
                this.destroy();
                return;
            }
            // check for bad params
            if (this.stickyLayers !== true && this.stickyLayers !== false) {
                this.stickyLayers = true;
            }
            if (this.stickyPosition !== 'top' && this.stickyPosition !== 'bottom') {
                this.stickyPosition = 'bottom';
            }
            // stack containers in templated widgets must be started - bug?
            this.stackNode.startup();
            // config mixin
            this.config = lang.mixin(advancedDrawConfig, this.config || {});
            // check for loaded map and go
            if (this.map.loaded) {
                this._initialize(this.config, this.map);
            } else {
                this.map.on('load', lang.hitch(this, '_initialize', this.config, this.map));
            }
        },

        //////////////////////////////////////////////////////
        // initialize toolbars, layers, symbols, menus, etc //
        //////////////////////////////////////////////////////
        _initialize: function (config, map) {
            // esri toolbars
            this._drawTb = new Draw(map);
            this._drawTb.on('draw-complete', lang.hitch(this, '_drawComplete'));
            this._editTb = new Edit(map);
            // init layers
            this._initLayers(config, map, this._layers);
            // default symbols from config
            this._initDefaultSymbols(config);
            // init draw menu
            //   can be used elsewhere like a map context menu or a dropdown
            this._drawMenu = this._initDrawMenu();
            this.drawButton.set('dropDown', this._drawMenu);

            // init options menu

            // init draw keys
            this._initDrawKeys();
            // init snapping
            this._initSnapping();
            // undo manager and wire up controls
            this._undo = new UndoManager({
                maxOperations: -1
            });
            this.undoButton.on('click', lang.hitch(this, function () {
                this._undo.undo();
            }));
            this.redoButton.on('click', lang.hitch(this, function () {
                this._undo.redo();
            }));
        },

        // create draw layers and add to map
        //   NOTES:
        //   spatial reference set by map unless WM where wkid: 4326 
        _initLayers: function (config, map, _layers) {
            // polygon
            _layers.polygon = new FeatureLayer({
                layerDefinition: lang.mixin(config._layerDefinition, {
                    geometryType: 'esriGeometryPolygon',
                    name: 'AdvancedDrawPolygon'
                }),
                featureSet: {
                    features: []
                },
                showLegend: false
            }, {
                id: 'advanced_draw_polygon',
                mode: 0
            });
            // polyline
            _layers.polyline = new FeatureLayer({
                layerDefinition: lang.mixin(config._layerDefinition, {
                    geometryType: 'esriGeometryPolyline',
                    name: 'AdvancedDrawPolyline'
                }),
                featureSet: {
                    features: []
                },
                showLegend: false
            }, {
                id: 'advanced_draw_polyline',
                mode: 0
            });
            // point
            _layers.point = new FeatureLayer({
                layerDefinition: lang.mixin(config._layerDefinition, {
                    geometryType: 'esriGeometryPoint',
                    name: 'AdvancedDrawPoint'
                }),
                featureSet: {
                    features: []
                },
                showLegend: false
            }, {
                id: 'advanced_draw_point',
                mode: 0
            });
            // text
            _layers.text = new FeatureLayer({
                layerDefinition: lang.mixin(config._layerDefinition, {
                    geometryType: 'esriGeometryPoint',
                    name: 'AdvancedDrawText'
                }),
                featureSet: {
                    features: []
                },
                showLegend: false
            }, {
                id: 'advanced_draw_text',
                mode: 0
            });
            // temp layer is just a graphics layer
            _layers.temp = new GraphicsLayer({
                id: 'advanced_draw_temp'
            });
            // wire up _stickyLayers()
            if (this.stickyLayers) {
                this._stickyLayersHandler = on.pausable(this.map, 'layer-add, layer-reorder, layers-add-result', lang.hitch(this, '_stickyLayers'));
            }
            // whether or not layers are sticky index them properly
            //   sticky layers will get double checked in _stickyaLyers()
            if ((this.stickyLayers && this.stickyPosition === 'bottom') || !this.stickyLayers) {
                map.addLayer(_layers.polygon, 0);
                map.addLayer(_layers.polyline, 1);
                map.addLayer(_layers.point, 2);
                map.addLayer(_layers.text, 3);
                map.addLayer(_layers.temp, 4);
            } else {
                var idx = map.graphicsLayerIds.length;
                map.addLayer(_layers.polygon, idx);
                map.addLayer(_layers.polyline, idx + 1);
                map.addLayer(_layers.point, idx + 2);
                map.addLayer(_layers.text, idx + 3);
                map.addLayer(_layers.temp, idx + 4);
            }
            // true
            this._layersLoaded = true;
            // init layer events
            for (var i in _layers) {
                if (_layers.hasOwnProperty(i) && i !== 'temp') {
                    this._initLayerMenuEvents(_layers[i]);
                }
            }
        },

        // stick layers to proper position in the map's vectors stack
        _stickyLayers: function () {
            this._stickyLayersHandler.pause();
            var map = this.map,
                _layers = this._layers;
            if (this.stickyPosition === 'bottom') {
                map.addLayer(_layers.polygon, 0);
                map.addLayer(_layers.polyline, 1);
                map.addLayer(_layers.point, 2);
                map.addLayer(_layers.text, 3);
                map.addLayer(_layers.temp, 4);
            } else {
                var idx = map.graphicsLayerIds.length - 4;
                map.addLayer(_layers.polygon, idx);
                map.addLayer(_layers.polyline, idx + 1);
                map.addLayer(_layers.point, idx + 2);
                map.addLayer(_layers.text, idx + 3);
                map.addLayer(_layers.temp, idx + 4);
            }
            this._stickyLayersHandler.resume();
        },

        // init default symbol and editors
        _initDefaultSymbols: function (config) {
            this._symbols.polygon = symbolUtils.fromJson(config.defaultPolygonSymbol);
            this._symbols.polyline = symbolUtils.fromJson(config.defaultPolylineSymbol);
            this._symbols.point = symbolUtils.fromJson(config.defaultPointSymbol);
            this._symbols.text = symbolUtils.fromJson(config.defaultTextSymbol);
            this._symbols.temp = symbolUtils.fromJson(config.defaultTempSymbol);

            this._defaultSymbolEditors = new DefaultSymbolEditors({
                symbols: this._symbols
            }, this.defaultSymbolEditorsNode);
            this._defaultSymbolEditors.startup();
        },

        // init draw menu
        _initDrawMenu: function () {
            var menu = new Menu();
            menu.addChild(new MenuItem({
                label: i18n.point,
                onClick: lang.hitch(this, '_draw', 'point')
            }));
            menu.addChild(new MenuItem({
                label: i18n.polyline,
                onClick: lang.hitch(this, '_draw', 'polyline')
            }));
            menu.addChild(new MenuItem({
                label: i18n.polygon,
                onClick: lang.hitch(this, '_draw', 'polygon')
            }));
            menu.addChild(new MenuItem({
                label: i18n.text,
                onClick: lang.hitch(this, '_draw', 'text')
            }));
            var freehand = new Menu();
            freehand.addChild(new MenuItem({
                label: i18n.polyline,
                onClick: lang.hitch(this, '_draw', 'freehandpolyline')
            }));
            freehand.addChild(new MenuItem({
                label: i18n.polygon,
                onClick: lang.hitch(this, '_draw', 'freehandpolygon')
            }));
            freehand.startup();
            menu.addChild(new PopupMenuItem({
                label: i18n.freehand,
                popup: freehand
            }));
            var shapes = new Menu();
            shapes.addChild(new MenuItem({
                label: i18n.rectangle,
                onClick: lang.hitch(this, '_draw', 'extent')
            }));
            shapes.addChild(new MenuItem({
                label: i18n.circle,
                onClick: lang.hitch(this, '_draw', 'circle')
            }));
            shapes.startup();
            menu.addChild(new PopupMenuItem({
                label: i18n.shapes,
                popup: shapes
            }));
            menu.startup();
            return menu;
        },

        // init options menu
        _initOptionsMenu: function () {
            var menu = new Menu();
            menu.addChild(new MenuItem({
                label: i18n.point
            }));

            menu.startup();
            return menu;
        },

        //////////////////
        // draw methods //
        //////////////////
        // any keys wired up for drawing
        _initDrawKeys: function () {
            on(document, 'keypress', lang.hitch(this, function (evt) {
                //console.log(evt.keyCode);
                // press 'C' key to toggle continuous draw
                if (evt.keyCode && evt.keyCode === 99) {
                    var cNode = this.continuousToggleNode;
                    if (!cNode.get('disabled')) {
                        cNode.set('checked', (cNode.checked) ? false : true);
                    }
                }
                // press 'S' key to toggle snapping
                if (evt.keyCode && evt.keyCode === 115) {
                    var sNode = this.snappingToggleNode;
                    if (!sNode.get('disabled')) {
                        sNode.set('checked', (sNode.checked) ? false : true);
                    }
                }
            }));
        },

        // housekeeping and activate draw toolbar
        _draw: function (type) {
            if (this._drawTb._geometryType) {
                this._drawTb.deactivate();
            }
            switch (type) {
            case 'point':
                this._defaultSymbolEditors.showSMSEditor();
                break;
            case 'polyline':
            case 'freehandpolyline':
                this._defaultSymbolEditors.showSLSEditor();
                break;
            case 'polygon':
            case 'freehandpolygon':
            case 'extent':
            case 'circle':
                this._defaultSymbolEditors.showSFSEditor();
                break;
            default:
                this._defaultSymbolEditors.showSMSEditor();
                break;
            }
            this.cancelButton.set('disabled', false);
            this.snappingToggleNode.set('disabled', true);
            this.continuousToggleNode.set('disabled', true);
            if (type === 'extent') {
                html.set(this.drawStatusNode, i18n.rectangle);
            } else if (type === 'text') {
                html.set(this.drawStatusNode, i18n.text);
                // this point will be a text symbol
                this._isTextPoint = true;
                type = 'point';
            } else {
                html.set(this.drawStatusNode, i18n[type]);
            }
            // activate tb with type
            this._drawTb.activate(type);
        },

        // draw-complete callback
        _drawComplete: function (result) {
            if (!this._continuousDraw) {
                this._drawCancel();
            }
            // if text handle with _drawText()
            if (this._isTextPoint) {
                if (!this._continuousDraw) {
                    this._isTextPoint = false;
                }
                this._drawText(result);
            } else {
                var geom = result.geometry,
                    geoGeom = result.geographicGeometry,
                    type = geom.type;
                if (type === 'extent') {
                    geom = this._extentToPolygon(geom);
                    if (geoGeom) {
                        geoGeom = this._extentToPolygon(geoGeom);
                    }
                    type = 'polygon';
                }
                var graphic = new Graphic(
                    (geoGeom) ? geoGeom : geom,
                    this._symbols[type], {
                        OBJECTID: new Date().getTime(),
                        draw_type: type,
                        draw_text_string: null
                    },
                    null
                );
                this._layers[type].add(graphic);
                this._undo.add(new AddGraphicOp({
                    layer: graphic.getLayer(),
                    graphic: graphic
                }));
            }
        },

        // convert extent to polygon
        _extentToPolygon: function (geom) {
            var polygon = new Polygon(geom.spatialReference);
            polygon.addRing([
                [geom.xmin, geom.ymax],
                [geom.xmax, geom.ymax],
                [geom.xmax, geom.ymin],
                [geom.xmin, geom.ymin],
                [geom.xmin, geom.ymax]
            ]);
            return polygon;
        },

        // draw-complete callback for text
        _drawText: function (result) {
            var geom = result.geometry,
                geoGeom = result.geographicGeometry;
            var graphic = new Graphic(
                (geoGeom) ? geoGeom : geom, // geometry
                this._symbols.text, // symbol
                {
                    OBJECTID: new Date().getTime(),
                    draw_type: 'text',
                    draw_text_string: 'New Text'
                },
                null
            );
            // extend the graphic object w/ its own tooltip dialog
            graphic._advancedDrawTextTooltipDialog = new TextTooltipDialog({
                _graphic: graphic,
                i18n: i18n
            });
            // add text graphic
            this._layers.text.add(graphic);
            // never use geographic geometry unless map sr 4326
            this._popupTextTooltip(this.map, graphic, geom);
        },

        // determine true screen position of text symbol and popup tooltip
        _popupTextTooltip: function (map, graphic, geom) {
            var sp = screenUtils.toScreenGeometry(map.extent, map.width, map.height, geom),
                mp = domGeom.position(dom.byId(map.id), false);
            popup.open({
                popup: graphic._advancedDrawTextTooltipDialog,
                x: sp.x + mp.x + this.config._textTooltipDialogOffset.x,
                y: sp.y + mp.y + this.config._textTooltipDialogOffset.y
            });
        },

        // cancel drawing
        _drawCancel: function () {
            this._drawTb.deactivate();
            this.cancelButton.set('disabled', true);
            this.snappingToggleNode.set('disabled', false);
            this.continuousToggleNode.set('disabled', false);
            html.set(this.drawStatusNode, i18n.none);
        },

        //////////////////
        // graphic menu //
        //////////////////
        _initLayerMenuEvents: function (layer) {
            // b/c graphic dom nodes are created and destroyed as they enter/exit
            //   the map extent the menu must be bound/unbound on mouse-over/-out
            layer.on('mouse-over', function (evt) {
                evt.graphic._advancedDrawMenu.bindDomNode(evt.graphic.getDojoShape().getNode());
            });
            layer.on('mouse-out', function (evt) {
                evt.graphic._advancedDrawMenu.unBindDomNode(evt.graphic.getDojoShape().getNode());
            });
            // the graphic menu will always be added automatically
            layer.on('graphic-add', lang.hitch(this, function (add) {
                this._addGraphicMenu(add.graphic);
            }));
        },

        // a meaty function to add a menu to the graphic object
        _addGraphicMenu: function (graphic) {
            if (graphic._advancedDrawMenu) {
                return;
            }
            var map = this.map,
                type = graphic.attributes.draw_type,
                menu = new Menu({
                    contextMenuForWindow: false,
                    leftClickToOpen: false
                });
            // edit text symbol text
            if (type === 'text') {
                // add text tooltip to imported text
                if (!graphic._advancedDrawTextTooltipDialog) {
                    graphic._advancedDrawTextTooltipDialog = new TextTooltipDialog({
                        graphic: graphic,
                        i18n: i18n
                    });
                    graphic._textTooltip.textNode.set('value', graphic.symbol.text);
                }
                var geom = (map.spatialReference.isWebMercator()) ? webMercatorUtils.geographicToWebMercator(graphic.geometry) : graphic.geometry;
                menu.addChild(new MenuItem({
                    label: 'Edit Text',
                    onClick: lang.hitch(this, '_popupTextTooltip', map, graphic, geom)
                }));
            }
            // edit symbol
            menu.addChild(new MenuItem({
                label: 'Edit Symbol'
            }));
            // edit geometry adding applicable operations to menu
            var editMenu = new Menu();
            var Edit = this._editTb.constructor;
            editMenu.addChild(new MenuItem({
                label: 'Move',
                onClick: lang.hitch(this, '_editGraphicGeometry', graphic, Edit.MOVE)
            }));
            if (type === 'polyline' || type === 'polygon') {
                editMenu.addChild(new MenuItem({
                    label: 'Edit Vertices',
                    onClick: lang.hitch(this, '_editGraphicGeometry', graphic, Edit.EDIT_VERTICES)
                }));
                var scaleMenu = new Menu();
                scaleMenu.addChild(new MenuItem({
                    label: 'Uniform Scale',
                    onClick: lang.hitch(this, '_editGraphicGeometry', graphic, Edit.SCALE, true)
                }));
                scaleMenu.addChild(new MenuItem({
                    label: 'Freeform Scale',
                    onClick: lang.hitch(this, '_editGraphicGeometry', graphic, Edit.SCALE, false)
                }));
                scaleMenu.startup();
                editMenu.addChild(new PopupMenuItem({
                    label: 'Scale',
                    popup: scaleMenu
                }));
                editMenu.addChild(new MenuItem({
                    label: 'Rotate',
                    onClick: lang.hitch(this, '_editGraphicGeometry', graphic, Edit.ROTATE)
                }));
            }
            editMenu.addChild(new MenuItem({
                label: 'Delete',
                onClick: lang.hitch(this, '_deleteGraphic', graphic)
            }));
            editMenu.startup();
            menu.addChild(new PopupMenuItem({
                label: 'Edit Geometry',
                popup: editMenu
            }));
            menu.addChild(new MenuItem({
                label: 'Move to Front',
                onClick: function () {
                    graphic.getDojoShape().moveToFront();
                }
            }));
            menu.addChild(new MenuItem({
                label: 'Move to Back',
                onClick: function () {
                    graphic.getDojoShape().moveToBack();
                }
            }));
            menu.startup();
            menu.on('focus', lang.hitch(this, '_identifyGraphic', graphic));
            graphic._advancedDrawMenu = menu;
        },

        ///////////////////////////
        // edit graphic geometry //
        ///////////////////////////
        _editGraphicGeometry: function (graphic, tool, uniform) {
            var options = this.config._editGeometryOptions;
            if (tool === 4) {
                options.uniformScaling = uniform;
            }
            var startGeom = lang.clone(graphic.geometry); // a clean starting geometry
            this._editTb.activate(tool, graphic, options);
            on.once(this.map, 'click', lang.hitch(this, function () {
                if (this._editTb.getCurrentState().isModified) {
                    this._undo.add(new EditGeometryGraphicOp({
                        graphic: graphic,
                        startGeom: startGeom,
                        endGeom: this._editTb.getCurrentState().graphic.geometry
                    }));
                }
                this._editTb.deactivate();
            }));
        },

        // identify graphic on menu focus
        _identifyGraphic: function (graphic) {
            var layer = this._layers.temp;
            layer.clear();
            layer.add(new Graphic(this.map.extent, symbolUtils.fromJson(this.config.defaultTempSymbol)));
            layer.add(new Graphic(graphic.geometry, graphic.symbol));
            setTimeout(function () {
                layer.clear();
            }, 1000);
        },

        // delete a graphic
        _deleteGraphic: function (graphic) {
            var layer = graphic.getLayer();
            this._undo.add(new DeleteGraphicOp({
                layer: layer,
                graphic: graphic
            }));
            layer.remove(graphic);
        },

        //////////////////////////////////
        // snapping and continuous draw //
        //////////////////////////////////
        _initSnapping: function () {
            this.config._snappingOptions.snapPointSymbol = symbolUtils.fromJson(this.config._snappingOptions.snapPointSymbol);
            this.config._snappingOptions.snapKey = keys.CTRL;
            this.map.enableSnapping(this.config._snappingOptions);
            this.map.on('layer-add, layers-add-result', lang.hitch(this, '_toggleSnapping'));
        },
        _toggleSnapping: function () {
            var node = this.snappingToggleNode;
            if (node.checked) {
                this.map.enableSnapping(this.config._snappingOptions);
                domClass.add(node.iconNode, 'fa-check');
            } else {
                this.map.disableSnapping();
                domClass.remove(node.iconNode, 'fa-check');
            }
        },
        _toggleContinuousDraw: function () {
            var node = this.continuousToggleNode;
            if (node.checked) {
                this._continuousDraw = true;
                domClass.add(node.iconNode, 'fa-check');
            } else {
                this._continuousDraw = false;
                domClass.remove(node.iconNode, 'fa-check');
            }
        },

        ////////////////////
        // widget methods //
        ////////////////////
        // select a pane in the stack container
        //   simply calling or as a click evt callback will return to default pane
        _setPane: function (pane, evt) {
            this.stackNode.selectChild((evt) ? pane : this.defaultPane);
        }
    });

    return AdvancedDraw;
});