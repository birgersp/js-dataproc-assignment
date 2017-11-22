"use strict";

/**
 * Defines a tab of the app
 * @returns {TMTab}
 */
function TMTab() {

    let tab = this;

    this.container = null;
    this.id = null;
    this.tabLink = null;

    /**
     * Opens the tab
     */
    this.open = function() {
        tab.tabLink.click();
        tab.onOpen();
    };

    /**
     * Callback which is invoked when (after) the tab is openend
     */
    this.onOpen = function() {
    };
}
