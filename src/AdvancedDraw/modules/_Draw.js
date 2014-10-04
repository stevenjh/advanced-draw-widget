define([
    // dojo base
    'dojo/_base/declare',
    'dojo/_base/lang',
    //'dojo/_base/array',

    // dom
    'dojo/html',

    // events
    //'dojo/topic',
    'dojo/on',

    // esri
    'esri/graphic'
], function (
    declare,
    lang,
    //array,

    html,

    //topic,
    on,

    Graphic
) {
    var _Draw = declare([], {

        _continousDraw: false,

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
            html.set(this.drawStatusNode, this.i18n[type]);
            // activate tb with type
            this._drawTb.activate(type);
        },

        _drawComplete: function (result) {
            if (!this._continousDraw) {
                this._drawCancel();
            }
            // the objects and props for creating graphic
            var geom = result.geometry,
                geoGeom = result.geographicGeometry,
                type = geom.type;
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

        },

        // initiate text draw
        _drawText: function (label) {
            this._setDrawButton('_drawText', null, label);
        },

        // initiate extent draw (converted to polygon)
        _drawRectangle: function (label) {
            this._setDrawButton('_drawRectangle', null, label);
        },

        // cancel drawing
        _drawCancel: function () {
            this._drawTb.deactivate();
            this.cancelButtonNode.set('disabled', true);
            html.set(this.drawStatusNode, this.i18n.none);
        }
    });

    return _Draw;
});