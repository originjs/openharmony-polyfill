/**
 * The EventTarget interface is implemented by objects that can receive events and may have listeners 
 * for them. In other words, any target of events implements the three methods associated with this interface.
 */
export class EventTarget {
    /**
     * Creates a new EventTarget object instance.
     */
    constructor() { }

    /**
     * Registers an event handler of a specific event type on the EventTarget.
     * @param {*} type 
     * @param {*} listener 
     */
    addEventListener(type, listener) {
        if (this._listeners === undefined) {
            this._listeners = {};
        }
        let listeners = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    }

    /**
     * Removes an event listener from the EventTarget.
     * @param {*} type 
     * @param {*} listener 
     */
    removeEventListener(type, listener) {
        if (this._listeners === undefined) {
            return;
        }
        let listenerArray = this._listeners[type];
        if (listenerArray) {
            let index = listenerArray.indexOf(listener);
            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    }

    /**
     * Dispatches an event to this EventTarget.
     * @param {*} event 
     */
    dispatchEvent(event) {
        if (this._listeners === undefined) {
            return;
        }
        let listenerArray = this._listeners[event.type];
        if (listenerArray) {
            event.target = this;
            let array = listenerArray.slice(0);
            for (let i = 0; i < array.length; i++) {
                array[i].call(this, event);
            }
        }
    }
}
