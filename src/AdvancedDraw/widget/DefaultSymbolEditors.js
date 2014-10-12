define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'src/AdvancedDraw/widget/SMSEditor',
            'src/AdvancedDraw/widget/SLSEditor',
            'src/AdvancedDraw/widget/SFSEditor',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dojo/text!./templates/DefaultSymbolEditors.html',
            'dojo/i18n!../nls/resource',
            'esri/symbols/jsonUtils',
            'xstyle/css!./css/DefaultSymbolEditors.css',
            'dijit/layout/StackContainer'

        ],
        function( declare,
                  lang,
                  SMSEditor,
                  SLSEditor,
                  SFSEditor,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  template,
                  i18n,
                  symUtil

            ) {

            var DefaultSymbolEditors = declare( [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

                i18n: i18n,
                templateString: template,
                widgetsInTemplate: true,
                baseClass: 'defaultSymbolEditors',

                constructor: function( options ) {

                    options = options || {};
                    lang.mixin( this, options );

                },

                startup: function () {

                    this.inherited( arguments );
                    this._createSMSEditor();
                    this._createSLSEditor();
                    this._createSFSEditor();

                },

                _createSMSEditor: function () {

                    this.smsEditor = new SMSEditor();
                    this.smsEditor.watch( 'symbol', lang.hitch( this, function ( name, oldValue, value ) {
                        console.log( 'default marker symbol updated: ', value );
                        if ( this.symbols ) {
                            console.log( 'updating default point sym' );
                            this.symbols.point = symUtil.fromJson ( value );
                        }
                    } ) );
                    this.stackContainerNode.addChild( this.smsEditor );
                    debugger
                    this.smsEditor.set( 'symbol', this.symbols.point.toJson() );
                },

                _createSLSEditor: function () {

                    this.slsEditor = new SLSEditor( null, this.slsEditorNode );
                    this.slsEditor.watch( 'symbol', function ( name, oldValue, value ) {
                        console.log( 'default line symbol updated: ', value );
                    } );
                    this.stackContainerNode.addChild( this.slsEditor );
                },

                _createSFSEditor: function () {

                    this.sfsEditor = new SFSEditor( null, this.sfsEditorNode );
                    this.sfsEditor.watch( 'symbol', function ( name, oldValue, value ) {
                        console.log( 'default fill symbol updated: ', value );
                    } );
                    this.stackContainerNode.addChild( this.sfsEditor );
                },

                showSMSEditor: function () {
                    this.stackContainerNode.selectChild( this.smsEditor );
                },

                showSLSEditor: function () {
                    this.stackContainerNode.selectChild( this.slsEditor );
                },

                showSFSEditor: function () {
                    this.stackContainerNode.selectChild( this.sfsEditor );
                }

            } );

            return DefaultSymbolEditors;

        }

);