define( [
    'dojo/_base/declare'

], function( declare ) {

    var keyRing = {

        ADW_GRAPHIC_DRAW_ADD: 'adw/graphic/draw/add',
        ADW_GRAPHIC_DRAW_DELETE: 'adw/graphic/draw/delete',
        ADW_GRAPHIC_DRAW_EDIT: 'adw/graphic/draw/edit',
        ADW_GRAPHIC_SYMBOL_EDIT: 'adw/graphic/symbol/edit',
        ADW_SYMBOLS_DEFAULT_EDIT: 'adw/symbols/default/edit',
        ADW_LOAD: 'adw/load',
        ADW_UNLOAD: 'adw/unload'

    };

    var ADWTopicRegistry = declare( null, {

        get: function(key){
            return keyRing[key];
        },

        set: function(key, topic) {
            if ( !keyRing[key] ) {
                keyRing[key] = topic;
            }
        }

    } );

    if (!_instance) {
        var _instance = new ADWTopicRegistry();
    }

    return _instance;

} );