define ( [
    'intern!object',
    'intern/chai!assert',
    'dojo/topic',
    'adw/widget/_ADWNotificationsMixin'
], function (
    registerSuite,
    assert,
    topic,
    _ADWNotificationsMixin
) {

    var _mixin;

    registerSuite ( {
        name: '_ADWNotificationMixin test suite',

        setup: function () {
            _mixin = new _ADWNotificationsMixin();
        },

        // before each test executes
        beforeEach: function() {
            // do nothing
        },

        // after the suite is done (all tests)
        teardown: function() {
            _mixin = null;
        },

        'Test default symbol updated notification method': function () {

            var dfd = this.async(5000);
            var oldSymbol = { name: 'Old symbol' };
            var newSymbol = { name: 'New symbol' };

            var callback = function() {

                assert.isDefined(
                    arguments[ 0 ].oldSymbol,
                    'Handler functions subscribing to \'adw/symbols/default/edit\' should receive the old symbol as a property of the first argument ');

                assert.isDefined(
                    arguments[ 0 ].newSymbol,
                    'Handler functions subscribing to \'adw/symbols/default/edit\' should receive the new symbol as the second argument '
                );

                assert.deepEqual(
                    oldSymbol,
                    arguments[ 0 ].oldSymbol,
                    'Should receive the oldSymbol test value as first argument'
                );

                assert.deepEqual(
                    newSymbol,
                    arguments[ 0 ].newSymbol,
                    'Should receive the newSymbol test value as second argument'
                );

            };

            topic.subscribe( 'adw/symbols/default/edit', dfd.callback( callback ) );

            _mixin.sendDefaultSymbolUpdatedNotification( oldSymbol, newSymbol );

        },

        'Test graphic added notification method': function () {

            var dfd = this.async(5000);
            var graphic = { name: 'New graphic' };

            var callback = function() {

                assert.isDefined(
                    arguments[ 0 ].graphic,
                    'Handler functions subscribing to \'adw/symbols/default/edit\' should receive the new graphic as the first argument ');

                assert.deepEqual(
                    graphic,
                    arguments[ 0 ].graphic,
                    'Should receive the graphic test value as first argument'
                );

            };

            topic.subscribe( 'adw/graphic/draw/add', dfd.callback( callback ) );

            _mixin.sendGraphicAddedNotification( graphic );

        },

        'Test graphic deleted notification method': function () {

            var dfd = this.async(5000);
            var graphic = { name: 'New graphic' };

            var callback = function() {

                assert.isDefined(
                    arguments[ 0 ].graphic,
                    'Handler functions subscribing to \'adw/graphic/draw/delete\' should receive the deleted graphic as the first argument ');

                assert.deepEqual(
                    graphic,
                    arguments[ 0 ].graphic,
                    'Should receive the graphic test value as first argument'
                );

            };

            topic.subscribe( 'adw/graphic/draw/delete', dfd.callback( callback ) );

            _mixin.sendGraphicDeletedNotification( graphic );

        },

        'Test graphic symbol edited notification method': function () {

            var dfd = this.async(5000);
            var graphic = { name: 'New graphic' };
            var oldSymbol = { name: 'Old symbol' };
            var newSymbol = { name: 'New symbol' };

            var callback = function() {

                assert.isDefined(
                    arguments[ 0 ].graphic,
                    'Handler functions subscribing to \'adw/graphic/draw/delete\' should receive the graphic as the first argument ');

                assert.isDefined(
                    arguments[ 0 ].oldSymbol,
                    'Handler functions subscribing to \'adw/graphic/draw/delete\' should receive the graphic\'s previous symbol as the second argument ');

                assert.isDefined(
                    arguments[ 0 ].newSymbol,
                    'Handler functions subscribing to \'adw/graphic/draw/delete\' should receive the graphic\'s new symbol as the third argument ');

                assert.deepEqual(
                    graphic,
                    arguments[ 0 ].graphic,
                    'Should receive the graphic test value as first argument'
                );

                assert.deepEqual(
                    oldSymbol,
                    arguments[ 0 ].oldSymbol,
                    'Should receive the oldSymbol test value as first argument'
                );

                assert.deepEqual(
                    newSymbol,
                    arguments[ 0 ].newSymbol,
                    'Should receive the newSymbol test value as first argument'
                );

            };

            topic.subscribe( 'adw/graphic/symbol/edit', dfd.callback( callback ) );

            _mixin.sendGraphicSymbolEditedNotification( graphic, oldSymbol, newSymbol );

        },

        'Test graphic geometry edited notification method': function () {

            var dfd = this.async(5000);
            var graphic = { name: 'New graphic' };
            var oldGeom = { name: 'Old geometry' };
            var newGeom = { name: 'New geometry' };

            var callback = function() {

                assert.isDefined(
                    arguments[ 0].graphic,
                    'Handler functions subscribing to \'adw/graphic/draw/edit\' should receive the graphic as the first argument ');

                assert.isDefined(
                    arguments[ 0 ].oldGeometry,
                    'Handler functions subscribing to \'adw/graphic/draw/edit\' should receive the graphic\'s previous geometry as the second argument ');

                assert.isDefined(
                    arguments[ 0 ].newGeometry,
                    'Handler functions subscribing to \'adw/graphic/draw/edit\' should receive the graphic\'s new geometry as the third argument ');

                assert.deepEqual(
                    graphic,
                    arguments[ 0 ].graphic,
                    'Should receive the graphic test value as first argument'
                );

                assert.deepEqual(
                    oldGeom,
                    arguments[ 0 ].oldGeometry,
                    'Should receive the oldGeom test value as first argument'
                );

                assert.deepEqual(
                    newGeom,
                    arguments[ 0 ].newGeometry,
                    'Should receive the newGeom test value as first argument'
                );

            };

            topic.subscribe( 'adw/graphic/draw/edit', dfd.callback( callback ) );

            _mixin.sendGraphicGeometryEditedNotification( graphic, oldGeom, newGeom );

        }

    } );

} );
