define( [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    '../../widget/ADWTopicRegistry',
    'dojo/text!./templates/Logging.html',
    'dijit/form/Textarea',
    'xstyle/css!./css/Logging.css'
], function( declare,
          lang,
          topic,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          adwTopics,
          template
    ) {

    var Logging = declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

        hasUI: true,
        templateString: template,
        widgetsInTemplate: true,
        baseClass: 'loggingExtension',

        constructor: function ( params ) {

            params = params || { drawLayers: [] };
            lang.mixin( this, params );

        },

        postCreate: function () {

            this.inherited( arguments );

        },

        startup: function () {

            this.inherited( arguments );

            this._updateLogMessages( 'Number of layers: ' + Object.keys( this.drawLayers ).length );

            this._addSubscriptions();

        },

        _addSubscriptions: function () {

            topic.subscribe( adwTopics.get( 'ADW_GRAPHIC_DRAW_ADD' ), lang.hitch( this, function () {
                this._updateLogMessages( adwTopics.get( 'ADW_GRAPHIC_DRAW_ADD' ), arguments );
            } ) );

            topic.subscribe( adwTopics.get( 'ADW_GRAPHIC_SYMBOL_EDIT' ), lang.hitch( this, function () {
                this._updateLogMessages( adwTopics.get( 'ADW_GRAPHIC_SYMBOL_EDIT' ), arguments );
            } ) );

            topic.subscribe( adwTopics.get( 'ADW_GRAPHIC_DRAW_DELETE' ), lang.hitch( this, function () {
                this._updateLogMessages( adwTopics.get( 'ADW_GRAPHIC_DRAW_DELETE' ), arguments );
            } ) );

            topic.subscribe( adwTopics.get( 'ADW_GRAPHIC_DRAW_EDIT' ), lang.hitch( this, function () {
                this._updateLogMessages( adwTopics.get( 'ADW_GRAPHIC_DRAW_EDIT' ), arguments );
            } ) );

            topic.subscribe( adwTopics.get( 'ADW_SYMBOLS_DEFAULT_EDIT' ), lang.hitch( this, function () {
                this._updateLogMessages( adwTopics.get( 'ADW_SYMBOLS_DEFAULT_EDIT' ), arguments );
            } ) );

        },

        _updateLogMessages: function ( message, params ) {

            var messages = message + '\n\n' + this.logMessagesArea.get( 'value' );
            this.logMessagesArea.set( 'value', messages );
            this.logMessagesArea.resize();

            console.log( message, params );

        }

    } );

    return Logging;

} );