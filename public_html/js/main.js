
"use strict";

// Libraries
include("thirdparty/jquery-3.2.1.min.js");
include("thirdparty/bootstrap.min.js");

function runApplication() {
    throw "Something went wrong!";
}

function displayError(error) {
//    alert(error);
    throw error;
}

function main() {
    try {
        runApplication();
    } catch (error) {
        displayError(error);
    }
}
