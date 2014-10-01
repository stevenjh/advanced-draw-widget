define(['dojo/topic'], function (topic) {

    return {
        _map: null,

        initialize: function (map) {
            if (!map) {
                console.log('need a map');
            }
            this._map = map;
        }

    };

});