define ( [
    'intern!object',
    'intern/chai!assert',
    'adw/widget/StylePicker'
], function (
        registerSuite,
        assert,
        Widget
) {

    var widget,actual,expected;

    var destroyWidget = function () {

        if ( widget ) {
            widget.destroy();
        }

    };

    registerSuite ( {
        name: 'StylePicker module test',

        setup: function () {

        },

        // before each test executes
        beforeEach: function() {

            widget = new Widget( { styleSet: 'fill' } );
            widget.startup();

        },

        afterEach: function () {

            console.log( 'expected/actual', expected, actual );
            destroyWidget();

        },

        // after the suite is done (all tests)
        teardown: function() {

            destroyWidget();

        },

        'constructorOptionsTest': function () {

            expected = 'esriSFSSolid';
            actual = widget.get( 'style' );

            assert.strictEqual (
                actual,
                expected,
                '.get( style ) should return first fill style option ( esriSFSSolid ).'
            );

        },

        'setValueTest': function () {

            expected = 'esriSFSCross';

            widget.selectDijit.set( 'value', expected );

            actual = widget.get( 'style' );

            assert.strictEqual (
                actual,
                expected,
                '.get( style ) should return style set by set selectDijit value.'
            );

        }
    } );

} );
