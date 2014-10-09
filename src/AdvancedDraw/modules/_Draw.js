define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/keys',
    'dojo/html',
    'dojo/dom',
    'dojo/dom-geometry',
    'dojo/dom-class',
    'dojo/on',
    'dijit/popup',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'esri/graphic',
    'esri/geometry/Polygon',
    'esri/geometry/screenUtils',
    'esri/symbols/jsonUtils',
    'esri/geometry/webMercatorUtils',
    './../widget/TextTooltipDialog'
], function (
    declare,
    lang,
    keys,
    html,
    dom,
    domGeom,
    domClass,
    on,
    popup,
    Menu,
    MenuItem,
    PopupMenuItem,
    Graphic,
    Polygon,
    screenUtils,
    symUtil,
    webMercatorUtils,
    TextTooltipDialog
) {
    var _Draw = declare([], {
        _continuousDraw: false, // one and done OR user cancel draw

        _isTextPoint: false, // flag to handle text when point for text draw completes

        postCreate: function () {
            this.inherited(arguments);

            // init draw keys
            this._initDrawKeys();

            // init snapping
            this._initSnapping();
        },

        // any keys wired up for drawing
        _initDrawKeys: function () {
            on(document, 'keypress', lang.hitch(this, function (evt) {
                //console.log(evt.keyCode);
                if (evt.keyCode && evt.keyCode === 99) {
                    var cNode = this.continuousToggleNode;
                    if (!cNode.get('disabled')) {
                        cNode.set('checked', (cNode.checked) ? false : true);
                    }
                }
                if (evt.keyCode && evt.keyCode === 115) {
                    var sNode = this.snappingToggleNode;
                    if (!sNode.get('disabled')) {
                        sNode.set('checked', (sNode.checked) ? false : true);
                    }
                }
            }));
        },

        // initiate standard geometry draw
        _draw: function (type, label) {
            // set the draw button
            this._setDrawButton('_draw', type, label);
            // deactivate tb if active
            if (this._drawTb._geometryType) {
                this._drawTb.deactivate();
            }
            // cancel button enabled
            this.cancelButtonNode.set('disabled', false);
            // snapping and continuous disabled
            this.snappingToggleNode.set('disabled', true);
            this.continuousToggleNode.set('disabled', true);
            // active tool text
            if (type === 'extent') {
                html.set(this.drawStatusNode, this.i18n.rectangle);
            } else if (type === 'text') {
                html.set(this.drawStatusNode, this.i18n.text);
                // this will be a text symbol
                this._isTextPoint = true;
                type = 'point';
            } else {
                html.set(this.drawStatusNode, this.i18n[type]);
            }
            // activate tb with type
            this._drawTb.activate(type);
        },

        // handle standard geometry draw complete
        _drawComplete: function (result) {
            // ??? how does text work w/ continuous draw?
            if (!this._continuousDraw) {
                this._drawCancel();
            }
            if (!this._isTextPoint) {
                // the objects and props for creating graphic
                var geom = result.geometry,
                    geoGeom = result.geographicGeometry,
                    type = geom.type;
                // convert extent to polygon
                if (type === 'extent') {
                    geom = this._extentToPolygon(geom);
                    if (geoGeom) {
                        geoGeom = this._extentToPolygon(geoGeom);
                    }
                    type = 'polygon';
                }
                // add the graphic to the appropriate layer w/ the appropriate

                var graphic = new Graphic(
                    (geoGeom) ? geoGeom : geom, // geometry
                    this._symbols[type], // symbol
                    {
                        OBJECTID: new Date().getTime(), // a unique id
                        draw_type: type,
                        draw_text_string: null
                    }, // attributes
                    null // no infoTemplate ever
                );

                this._layers[type].add(graphic);
            } else {
                if (!this._continuousDraw) {
                    this._isTextPoint = false;
                }
                this._drawText(result);
            }
        },

        // convert extent to polygon
        //   3.11 includes extent to polygon
        //   this is easier than checking for api version
        //   still need this for < 3.11 anyway
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

        // handle text
        _drawText: function (result) {
            // the objects and props for creating graphic
            var geom = result.geometry,
                geoGeom = result.geographicGeometry;
            // the graphic
            var graphic = new Graphic(
                (geoGeom) ? geoGeom : geom, // geometry
                this._symbols.text, // symbol
                {
                    OBJECTID: new Date().getTime(), // a unique id
                    draw_type: 'text',
                    draw_text_string: 'New Text'
                }, // attributes
                null // no infoTemplate ever
            );
            // extend the graphic object w/ its own tooltip dialog
            graphic._advancedDrawTextTooltipDialog = new TextTooltipDialog({
                _graphic: graphic,
                i18n: this.i18n
            });
            // add text graphic
            this._layers.text.add(graphic);
            // popup tooltip dialog
            //   use `result.geometry` and not `result.geographicGeometry`
            this._popupTextTooltip(this.map, graphic, geom);
        },

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
            //this._isTextPoint = false;
            this.cancelButtonNode.set('disabled', true);
            this.snappingToggleNode.set('disabled', false);
            this.continuousToggleNode.set('disabled', false);
            html.set(this.drawStatusNode, this.i18n.none);
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
            //   this includes adding graphics via import
            layer.on('graphic-add', lang.hitch(this, function (add) {
                this._addGraphicMenu(add.graphic);
            }));
        },

        // a meaty function to add a menu to the graphic object
        _addGraphicMenu: function (graphic) {
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
                        i18n: this.i18n
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

            // edit geometry
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
                onClick: lang.hitch(this, function() {
                    //this.undo.add(new DeleteGraphicOp({
                    //    layer: graphic.getLayer(),
                    //    graphic: graphic
                    //}));
                    graphic.getLayer().remove(graphic);
                })
            }));
            editMenu.startup();
            menu.addChild(new PopupMenuItem({
                label: 'Edit Geometry',
                popup: editMenu
            }));
            menu.addChild(new MenuItem({
                label: 'Move to Front',
                onClick: function() {
                    graphic.getDojoShape().moveToFront();
                }
            }));
            menu.addChild(new MenuItem({
                label: 'Move to Back',
                onClick: function() {
                    graphic.getDojoShape().moveToBack();
                }
            }));

            menu.startup();

            menu.on('focus', lang.hitch(this, '_identifyGraphic', graphic));

            graphic._advancedDrawMenu = menu;
        },

        ///////////////////
        // edit geometry //
        ///////////////////
        _editGraphicGeometry: function (graphic, tool, uniform) {

            //console.log(graphic, tool, uniform);

            var options = this.config._editGeometryOptions;
            if (tool === 4) {
                options.uniformScaling = uniform;
            }

            this._editTb.activate(tool, graphic, options);

            on.once(this.map, 'click', lang.hitch(this, function () {
                this._editTb.deactivate();
            }));

            /*var options = this.editOptions,
                startGeom = lang.clone(graphic.geometry);
            options.uniformScaling = (uniformScaling !== undefined) ? uniformScaling : options.uniformScaling;
            this.map.editToolbar.activate(tool, graphic, options);
            on.once(this.map, 'click', lang.hitch(this, function() {
                if (this.map.editToolbar.getCurrentState().isModified) {
                    this.undo.add(new EditGraphicOp({
                        graphic: graphic,
                        startGeom: startGeom,
                        endGeom: this.map.editToolbar.getCurrentState().graphic.geometry
                    }));
                }
                this.map.editToolbar.deactivate();
            }));*/
        },

        // identify graphic on menu focus
        _identifyGraphic: function(graphic) {
            var layer = this._layers.temp;
            layer.clear();
            layer.add(new Graphic(this.map.extent, symUtil.fromJson(this.config.defaultTempSymbol)));
            layer.add(new Graphic(graphic.geometry, graphic.symbol));
            setTimeout(function() {
                layer.clear();
            }, 1000);
        },

        //////////////////////////////////
        // snapping and continuous draw //
        //////////////////////////////////
        _initSnapping: function () {
            this.config._snappingOptions.snapPointSymbol = symUtil.fromJson(this.config._snappingOptions.snapPointSymbol);
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
        }

    });

    return _Draw;
});