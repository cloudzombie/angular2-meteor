'use strict';
var async_1 = require('@angular/core/src/facade/async');
var utils_1 = require('./utils');
var DataObserver = (function () {
    function DataObserver() {
    }
    DataObserver.pushCb = function (callbacks) {
        var _this = this;
        check(callbacks, Match.Where(utils_1.isMeteorCallbacks));
        var completer = async_1.PromiseWrapper.completer();
        var dequeue = function (promise) {
            var index = _this._promises.indexOf(promise);
            if (index !== -1) {
                _this._promises.splice(index, 1);
            }
        };
        var queue = function (promise) {
            _this._promises.push(promise);
        };
        var promise = completer.promise;
        if (utils_1.isCallbacksObject(callbacks)) {
            var origin_1 = callbacks;
            var object = {
                onError: function (err) {
                    origin_1.onError(err);
                    completer.resolve({ err: err });
                    dequeue(promise);
                },
                onReady: function (result) {
                    origin_1.onReady(result);
                    completer.resolve({ result: result });
                    dequeue(promise);
                },
                onStop: function (err) {
                    origin_1.onStop(err);
                    completer.resolve({ err: err });
                    dequeue(promise);
                }
            };
            queue(promise);
            return object;
        }
        var newCallback = function (err, result) {
            callbacks(err, result);
            completer.resolve({ err: err, result: result });
            dequeue(promise);
        };
        queue(promise);
        return newCallback;
    };
    DataObserver.onReady = function (resolve) {
        Promise.all(this._promises).then(resolve);
    };
    DataObserver.cbLen = function () {
        return this._promises.length;
    };
    DataObserver._promises = [];
    return DataObserver;
}());
exports.DataObserver = DataObserver;
