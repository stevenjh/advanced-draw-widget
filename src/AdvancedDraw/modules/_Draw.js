define([
    // dojo base
    'dojo/_base/declare',
    'dojo/_base/lang',
    //'dojo/_base/array',

    // dom
    'dojo/html',
    'dojo/dom',
    'dojo/dom-geometry',

    // events
    //'dojo/topic',
    'dojo/on',

    // dijit
    'dijit/popup',

    // esri
    'esri/graphic',
    'esri/geometry/Polygon',
    'esri/geometry/screenUtils',

    // widgets
    './../widget/TextTooltipDialog'
], function (
    declare,
    lang,
    //array,

    html,
    dom,
    domGeom,

    //topic,
    on,

    popup,

    Graphic,
    Polygon,
    screenUtils,

    TextTooltipDialog
) {
    var _Draw = declare([], {

        _continousDraw: false,

        _isTextPoint: false,

        postCreate: function () {
            this.inherited(arguments);

            // init draw keys
            this._initDrawKeys();
        },

        // any keys wired up for drawing
        _initDrawKeys: function () {
            on(document, 'keydown', lang.hitch(this, function (evt) {
                //console.log(evt);
                if (evt.keyCode && evt.keyCode === 67) {
                    this._continousDraw = true;
                }
            }));
            on(document, 'keyup', lang.hitch(this, function () {
                this._continousDraw = false;
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
            if (!this._continousDraw) {
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
                this._layers[type].add(new Graphic(
                    (geoGeom) ? geoGeom : geom, // geometry
                    this._symbols[type], // symbol
                    {
                        OBJECTID: new Date().getTime(), // a unique id
                        draw_type: type,
                        draw_text_string: null
                    }, // attributes
                    null // no infoTemplate ever
                ));
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
            // map and screen geometry
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
            html.set(this.drawStatusNode, this.i18n.none);
        }
    });

    return _Draw;
});