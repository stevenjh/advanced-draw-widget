define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dojo/text!./templates/LineStylePicker.html',
            'dojo/i18n!../nls/resource',
            'dijit/form/Select',
            'xstyle/css!./css/LineStylePicker.css'

        ],
        function( declare,
                  lang,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  template,
                  i18n
            ) {

            var LineStylePicker = declare( [ _WidgetBase,
                _TemplatedMixin,
                _WidgetsInTemplateMixin
            ],
            {

                widgetsInTemplate: true,
                templateString: template,
                lineStyle: 'esriSLSDash',
                i18n: i18n,
                label: 'Line style:',

                constructor: function( options ) {

                    options = options || {};
                    lang.mixin( this, options );

                },

                postCreate: function () {

                    this.inherited( arguments );
                    this._set( 'lineStyle', this.lineStyle );

                },

                _setLineStyleAttr: function ( value ) {

                    this._updateSelectDijit( value );
                    this.lineStyle = value;

                },

                _updateSelectDijit: function ( value ) {

                    if ( this.selectDijit ) {
                        this.selectDijit.set( 'value', value );
                    }

                },

                _onSelectDijitChange: function( newValue ) {

                    this._set( 'lineStyle', newValue );

                }

            } );

            return LineStylePicker;

        }

);