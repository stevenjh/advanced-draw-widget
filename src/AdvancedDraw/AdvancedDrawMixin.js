define([
    // dojo base
    'dojo/_base/declare',
    'dojo/_base/lang',

    // menu
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',
], function (
    declare,
    lang,

    Menu,
    MenuItem,
    PopupMenuItem,
    MenuSeparator
) {
    
    var _AdvancedDrawMixin = declare([], {
        
        //////////////////////////////
        // options menu and friends //
        //////////////////////////////
        _optionsMenu: null,
        _initOptionsMenu: function () {
            var menu = new Menu();
            menu.addChild(new MenuItem({
                label: 'Delete All',
                title: 'Delete All Graphics'
            }));
            menu.addChild(new MenuSeparator());
            menu.addChild(new MenuItem({
                label: 'Import From File',
                title: 'Import From File'
            }));
            menu.addChild(new MenuItem({
                label: 'Export To File',
                title: 'Export To File'
            }));
            menu.addChild(new MenuSeparator());
            menu.addChild(new MenuItem({
                label: 'Settings',
                title: 'Draw Settings'
            }));
            menu.addChild(new MenuItem({
                label: 'Help',
                title: 'Draw Help'
            }));
            menu.startup();
            this.drawOptionsNode.set('dropDown', menu);
            this._optionsMenu = menu;
        }
    });

    return _AdvancedDrawMixin;
});