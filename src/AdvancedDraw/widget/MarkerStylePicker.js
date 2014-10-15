define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dojo/text!./templates/MarkerStylePicker.html',
            'dojo/i18n!../nls/resource',
            'dijit/form/Select',
            'xstyle/css!./css/MarkerStylePicker.css'

        ],
        function( declare,
                  lang,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  template,
                  i18n
            ) {

            var MarkerStylePicker = declare( [ _WidgetBase,
                _TemplatedMixin,
                _WidgetsInTemplateMixin
            ],
            {

                widgetsInTemplate: true,
                templateString: template,
                markerStyle: 'esriSMSCircle',
                i18n: i18n,
                label: 'Marker style',

                constructor: function( options ) {

                    options = options || {};
                    lang.mixin( this, options );

                },

                postCreate: function () {

                    this.inherited( arguments );
                    this._set( 'markerStyle', this.markerStyle );

                },

                _setMarkerStyleAttr: function ( value ) {

                    this._updateSelectDijit( value );
                    this.markerStyle = value;

                },

                _updateSelectDijit: function ( value ) {

                    if ( this.selectDijit ) {
                        this.selectDijit.set( 'value', value );
                    }

                },

                _onSelectDijitChange: function( newValue ) {

                    this._set( 'markerStyle', newValue );

                }

            } );

            return MarkerStylePicker;

        }

);