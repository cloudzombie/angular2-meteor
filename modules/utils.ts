'use strict';

export declare type CallbacksObject = {
  onReady?: Function;
  onError?: Function;
  onStop?: Function;
}

export declare type MeteorCallbacks = ((...args) => any) | CallbacksObject;

export const subscribeEvents = ['onReady', 'onError', 'onStop'];

export function isMeteorCallbacks(callbacks: any): boolean {
  return _.isFunction(callbacks) || isCallbacksObject(callbacks);
}

// Checks if callbacks of {@link CallbacksObject} type.
export function isCallbacksObject(callbacks: any): boolean {
  return callbacks && subscribeEvents.some((event) => {
    return _.isFunction(callbacks[event]);
  });
};

export declare interface Zone {
  current: Zone;
  run(f: Function): any;
  scheduleMacroTask(name: string, callback: Function, data: any,
    customSchedule: Function, customCancel: Function);
};

declare const global;
export const g =
  typeof global === 'object' ? global :
    typeof window === 'object' ? window :
      typeof self === 'object' ? self : this;

export const gZone = g.Zone.current;
