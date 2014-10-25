define( [
    '../../../dojo/_base/declare',
    'dojo/topic'

], function(
    declare,
    topic
    ) {

    var _TopicMixin = declare( null, {

        publish: function () {
            topic.publish( arguments );
        },

        subscribe: function ( channel, callBack ) {
            this.own( topic.subscribe( channel, callBack ) );
        }

    } );

    return _TopicMixin;

} );