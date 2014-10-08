define([
    // dojo base
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/Stateful',

    // events
    'dojo/on',

    // esri toolbars
    'esri/toolbars/draw',
    'esri/toolbars/edit',

    // esri layers
    'esri/layers/GraphicsLayer',
    'esri/layers/FeatureLayer',

    // esri symbols the easy way
    'esri/symbols/jsonUtils',

    // menu
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem'
], function (
    declare,
    lang,
    Stateful,

    on,

    Draw,
    Edit,

    GraphicsLayer,
    FeatureLayer,

    symUtil,

    Menu,
    MenuItem,
    PopupMenuItem
) {
    var _Init = declare([], {
        // hash of layers
        _layers: {
            polygon: null,
            polyline: null,
            point: null,
            text: null,
            temp: null
        },

        _layersLoaded: false, // what is says

        // hash of symbols
        _symbols: {
            polygon: null,
            polyline: null,
            point: null,
            text: null,
            temp: null
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
            this.config = lang.mixin(this.defaultConfig, this.config || {});

            // check for loaded map and go
            if (this.map.loaded) {
                this._initialize(this.config, this.map);
            } else {
                this.map.on('load', lang.hitch(this, '_initialize', this.config, this.map));
            }
        },

        // fire it up
        _initialize: function (config, map) {
            // esri toolbars
            this._drawTb = new Draw(map);
            this._drawTb.on('draw-complete', lang.hitch(this, '_drawComplete'));
            this._editTb = new Edit(map);

            // init layers
            this._initLayers(config, map, this._layers);

            // default symbols from config
            this._symbols.polygon = symUtil.fromJson(config.defaultPolygonSymbol);
            this._symbols.polyline = symUtil.fromJson(config.defaultPolylineSymbol);
            this._symbols.point = symUtil.fromJson(config.defaultPointSymbol);
            this._symbols.text = symUtil.fromJson(config.defaultTextSymbol);
            this._symbols.temp = symUtil.fromJson(config.defaultTempSymbol);

            // init draw menu
            //   can be used elsewhere like a map context menu or a dropdown
            this._drawMenu = this._initDrawMenu();
            this.drawButtonNode.set('dropDown', this._drawMenu);
            this._drawButtonClickHandler = on(this.drawButtonNode, 'click', lang.hitch(this, '_draw', 'point', this.i18n.point));
        },

        // add feature layers, a graphic layer and add layers to map
        //   NOTES:
        //   spatial reference set by map unless WM where sr = 4326
        //   unlike symbols, layers have 
        _initLayers: function (config, map, _layers) {
            // mixin Stateful and possible custom/override methods (new Class?)
            var Layer = declare([FeatureLayer, Stateful]);

            // create layers
            // polygon
            _layers.polygon = new Layer({
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
                mode: 0 // SNAPSHOT
            });

            // polyline
            _layers.polyline = new Layer({
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
                mode: 0 // SNAPSHOT
            });

            // point
            _layers.point = new Layer({
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
                mode: 0 // SNAPSHOT
            });

            // text
            _layers.text = new Layer({
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
                mode: 0 // SNAPSHOT
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
        },

        // stick layers to proper position in the map's vectors stack
        _stickyLayers: function () {
            // pause and resume to avoid calling sticky layer reordering 
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

        // init draw menu
        _initDrawMenu: function () {
            var menu = new Menu(),
                i18n = this.i18n;
            menu.addChild(new MenuItem({
                label: i18n.point,
                onClick: lang.hitch(this, '_draw', 'point', i18n.point)
            }));
            menu.addChild(new MenuItem({
                label: i18n.polyline,
                onClick: lang.hitch(this, '_draw', 'polyline', i18n.polyline)
            }));
            menu.addChild(new MenuItem({
                label: i18n.polygon,
                onClick: lang.hitch(this, '_draw', 'polygon', i18n.polygon)
            }));
            menu.addChild(new MenuItem({
                label: i18n.text,
                onClick: lang.hitch(this, '_draw', 'text', i18n.text)
            }));
            var freehand = new Menu();
            freehand.addChild(new MenuItem({
                label: i18n.polyline,
                onClick: lang.hitch(this, '_draw', 'freehandpolyline', i18n.freehandpolyline)
            }));
            freehand.addChild(new MenuItem({
                label: i18n.polygon,
                onClick: lang.hitch(this, '_draw', 'freehandpolygon', i18n.freehandpolygon)
            }));
            freehand.startup();
            menu.addChild(new PopupMenuItem({
                label: i18n.freehand,
                popup: freehand
            }));
            var shapes = new Menu();
            shapes.addChild(new MenuItem({
                label: i18n.rectangle,
                onClick: lang.hitch(this, '_draw', 'extent', i18n.rectangle)
            }));
            shapes.addChild(new MenuItem({
                label: i18n.circle,
                onClick: lang.hitch(this, '_draw', 'circle', i18n.circle)
            }));
            shapes.startup();
            menu.addChild(new PopupMenuItem({
                label: i18n.shapes,
                popup: shapes
            }));
            menu.startup();
            return menu;
        }
    });

    return _Init;
});