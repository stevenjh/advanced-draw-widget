define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dojo/text!./templates/FillStylePicker.html',
            'dojo/i18n!../nls/resource',
            'dijit/form/Select',
            'xstyle/css!./css/FillStylePicker.css'

        ],
        function( declare,
                  lang,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  template,
                  i18n
            ) {

            var FillStylePicker = declare( [ _WidgetBase,
                _TemplatedMixin,
                _WidgetsInTemplateMixin
            ],
            {

                widgetsInTemplate: true,
                templateString: template,
                fillStyle: 'esriSFSSolid',
                i18n: i18n,
                label: 'Fill style:',

                constructor: function( options ) {

                    options = options || {};
                    lang.mixin( this, options );

                },

                postCreate: function () {

                    this.inherited( arguments );
                    this._set( 'fillStyle', this.fillStyle );

                },

                _setFillStyleAttr: function ( value ) {

                    this._updateSelectDijit( value );
                    this.fillStyle = value;

                },

                _updateSelectDijit: function ( value ) {

                    if ( this.selectDijit ) {
                        this.selectDijit.set( 'value', value );
                    }

                },

                _onSelectDijitChange: function( newValue ) {

                    this._set( 'fillStyle', newValue );

                }

            } );

            return FillStylePicker;

        }

);