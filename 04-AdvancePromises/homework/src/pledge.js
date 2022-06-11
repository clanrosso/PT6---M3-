"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("executor in not a function");
  }

  this._state = "pending";
  this._value = undefined;
  this._handlerGroups = [];

  executor(this._internalResolve.bind(this), this._internalReject.bind(this));
}

$Promise.prototype._internalResolve = function (data) {
  if (this._state === "pending") {
    this._state = "fulfilled";
    this._value = data;
    this._callHandlers();
  }
};
$Promise.prototype._internalReject = function (error) {
  if (this._state === "pending") {
    this._state = "rejected";
    this._value = error;
    this._callHandlers();
  }
};

$Promise.prototype.then = function (successCb, errorCb) {
  if (typeof successCb !== "function") {
    successCb = null;
  }
  if (typeof errorCb !== "function") {
    errorCb = null;
  }
  let downstreamPromise = new $Promise(() => {});
  this._handlerGroups.push({ successCb, errorCb, downstreamPromise });
  if (this._state !== "pending") {
    this._callHandlers();
  }
  return downstreamPromise;
};

$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb);
};

$Promise.prototype._callHandlers = function () {
  while (this._handlerGroups.length > 0) {
    let actual = this._handlerGroups.shift();
    if (this._state === "fulfilled") {
      if (!actual.successCb) {
        actual.downstreamPromise._internalResolve(this._value);
      } else {
        try {
          let result = actual.successCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              (value) => {
                actual.downstreamPromise._internalResolve(value);
              },
              (err) => {
                actual.downstreamPromise._internalReject(err);
              }
            );
          } else {
            actual.downstreamPromise._internalResolve(result);
          }
        } catch (err) {
          actual.downstreamPromise._internalReject(err);
        }
      }
    }

    if (this._state === "rejected") {
      if (!actual.errorCb) {
        actual.downstreamPromise._internalReject(this._value);
      } else {
        try {
          let result = actual.errorCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              (value) => {
                actual.downstreamPromise._internalResolve(value);
              },
              (err) => {
                actual.downstreamPromise._internalReject(err);
              }
            );
          } else {
            actual.downstreamPromise._internalResolve(result);
          }
        } catch (err) {
          actual.downstreamPromise._internalReject(err);
        }
      }
    }
  }
};

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
