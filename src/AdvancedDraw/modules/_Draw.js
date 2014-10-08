define([
    // dojo base
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/keys',
    // dom
    'dojo/html',
    'dojo/dom',
    'dojo/dom-geometry',
    'dojo/dom-class',
    // events
    'dojo/on',
    // dijit
    'dijit/popup',
    // esri
    'esri/graphic',
    'esri/geometry/Polygon',
    'esri/geometry/screenUtils',
    'esri/symbols/jsonUtils',
    'esri/SnappingManager',
    // widgets
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
    Graphic,
    Polygon,
    screenUtils,
    symUtil,
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
                        //OBJECTID: new Date().getTime(), // a unique id
                        draw_type: type,
                        draw_text_string: null
                    }, // attributes
                    null // no infoTemplate ever
                );

                this._layers[type].add(graphic);
            } else {
                this._isTextPoint = false;
                this._drawText(result);
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
            // add text graphic
            this._layers.text.add(graphic);
            // extend the graphic object w/ its own tooltip dialog
            graphic._textTooltipDialog = new TextTooltipDialog({
                _graphic: graphic,
                i18n: this.i18n
            });
            // map and screen geometry for placing tooltip
            //   use `result.geometry` and not `result.geographicGeometry`
            var map = this.map,
                sp = screenUtils.toScreenGeometry(map.extent, map.width, map.height, geom),
                mp = domGeom.position(dom.byId(map.id), false);
            // popup tooltip dialog
            popup.open({
                popup: graphic._textTooltipDialog,
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