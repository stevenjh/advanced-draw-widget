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

    var _AdvancedDrawInit = declare([], {

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
            this._editTb = new Edit(map);

            // init layers
            this._layers = [];
            this._initLayers(config, map, this._layers);

            // default symbols from config
            this._defaultPolygonSymbol = symUtil.fromJson(config.defaultPolygonSymbol);
            this._defaultPolylineSymbol = symUtil.fromJson(config.defaultPolylineSymbol);
            this._defaultPointSymbol = symUtil.fromJson(config.defaultPointSymbol);
            this._defaultTextSymbol = symUtil.fromJson(config.defaultTextSymbol);
            this._defaultTempSymbol = symUtil.fromJson(config.defaultTempSymbol);

            // init draw menu
            //   can be used elsewhere like a map context menu or a dropdown
            this._drawMenu = this._initDrawMenu();
            this.drawButtonNode.set('dropDown', this._drawMenu);
            this._drawButtonClickHandler = on(this.drawButtonNode, 'click', lang.hitch(this, '_draw', 'point', 'Point'));
        },

        // add feature layers, a graphic layer and add layers to map
        //   NOTES:
        //   spatial reference set by map unless WM where sr = 4326
        _initLayers: function (config, map, layers) {
            // mixin Stateful and possible custom/override methods (new Class?)
            var Layer = declare([FeatureLayer, Stateful]);

            // create layers
            // polygon
            this._polygonLayer = new Layer({
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
            layers.push(this._polygonLayer);

            // polyline
            this._polylineLayer = new Layer({
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
            layers.push(this._polylineLayer);

            // point
            this._pointLayer = new Layer({
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
            layers.push(this._pointLayer);

            // text
            this._textLayer = new Layer({
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
            layers.push(this._textLayer);

            // temp layer is just a graphics layer
            this._tempLayer = new GraphicsLayer({
                id: 'advanced_draw_temp'
            });
            layers.push(this._tempLayer);

            // wire up _stickyLayers()
            if (this.stickyLayers) {
                this._stickyLayersHandler = on.pausable(this.map, 'layer-add, layer-reorder, layers-add-result', lang.hitch(this, '_stickyLayers'));
            }

            // whether or not layers are sticky index them properly
            //   sticky layers will get double checked in _stickyaLyers()
            if ((this.stickyLayers && this.stickyPosition === 'bottom') || !this.stickyLayers) {
                map.addLayer(this._polygonLayer, 0);
                map.addLayer(this._polylineLayer, 1);
                map.addLayer(this._pointLayer, 2);
                map.addLayer(this._textLayer, 3);
                map.addLayer(this._tempLayer, 4);
            } else {
                var idx = map.graphicsLayerIds.length;
                map.addLayer(this._polygonLayer, idx);
                map.addLayer(this._polylineLayer, idx + 1);
                map.addLayer(this._pointLayer, idx + 2);
                map.addLayer(this._textLayer, idx + 3);
                map.addLayer(this._tempLayer, idx + 4);
            }
        },

        // stick layers to proper position in the map's vectors stack
        _stickyLayers: function () {
            // pause and resume to avoid calling sticky layer reordering 
            this._stickyLayersHandler.pause();
            var map = this.map;
            if (this.stickyPosition === 'bottom') {
                map.reorderLayer(this._polygonLayer, 0);
                map.reorderLayer(this._polylineLayer, 1);
                map.reorderLayer(this._pointLayer, 2);
                map.reorderLayer(this._textLayer, 3);
                map.reorderLayer(this._tempLayer, 4);
            } else {
                var idx = map.graphicsLayerIds.length - 4;
                map.reorderLayer(this._polygonLayer, idx);
                map.reorderLayer(this._polylineLayer, idx + 1);
                map.reorderLayer(this._pointLayer, idx + 2);
                map.reorderLayer(this._textLayer, idx + 3);
                map.reorderLayer(this._tempLayer, idx + 4);
            }
            this._stickyLayersHandler.resume();
        },

        // init draw menu
        _initDrawMenu: function () {
            var menu = new Menu();
            menu.addChild(new MenuItem({
                label: 'Point',
                onClick: lang.hitch(this, '_draw', 'point', 'Point')
            }));
            menu.addChild(new MenuItem({
                label: 'Polyline',
                onClick: lang.hitch(this, '_draw', 'polyline', 'Polyline')
            }));
            menu.addChild(new MenuItem({
                label: 'Polygon',
                onClick: lang.hitch(this, '_draw', 'polygon', 'Polygon')
            }));
            menu.addChild(new MenuItem({
                label: 'Text',
                onClick: lang.hitch(this, '_drawText', 'Text')
            }));
            var freehand = new Menu();
            freehand.addChild(new MenuItem({
                label: 'Polyline',
                onClick: lang.hitch(this, '_draw', 'freehandpolyline', 'Freehand Polyline')
            }));
            freehand.addChild(new MenuItem({
                label: 'Polygon',
                onClick: lang.hitch(this, '_draw', 'freehandpolygon', 'Freehand Polygon')
            }));
            freehand.startup();
            menu.addChild(new PopupMenuItem({
                label: 'Freehand',
                popup: freehand
            }));
            var shapes = new Menu();
            shapes.addChild(new MenuItem({
                label: 'Rectangle',
                onClick: lang.hitch(this, '_drawRectangle', 'Rectangle')
            }));
            shapes.addChild(new MenuItem({
                label: 'Circle',
                onClick: lang.hitch(this, '_draw', 'circle', 'Circle')
            }));
            shapes.startup();
            menu.addChild(new PopupMenuItem({
                label: 'Shapes',
                popup: shapes
            }));
            menu.startup();
            return menu;
        }
    });

    return _AdvancedDrawInit;
});