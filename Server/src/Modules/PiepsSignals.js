/**
 * @class PiepsSignalsClass
 * @classdesc A simple signal system that allows creating, connecting, disconnecting, deleting, and emitting signals.
 */
class PiepsSignalsClass {
    /**
     * @constructor
     * @description Creates a new instance of PiepsSignalsClass.
     */
    constructor() {
        /**
         * @private
         * @type {Map<string, function[]>}
         * @description Stores the signals and their associated callbacks.
         */
        this._signalContainer = new Map();
    }

    /**
     * @method hasSignal
     * @description Checks if a signal exists.
     * @param {string} signalName - The name of the signal to check.
     * @returns {boolean} - True if the signal exists, false otherwise.
     */
    hasSignal(signalName) {
        return this._signalContainer.has(signalName);
    }

    /**
     * @method createSignal
     * @description Creates and registers a new signal.
     * @param {string} signalName - The unique name of the signal.
     */
    createSignal(signalName) {
        if (this._signalContainer.has(signalName)) {
            console.warn(new Error(`Signal "${signalName}" already exists!`));
            return;
        }
        this._signalContainer.set(signalName, []); // Array for callbacks
    }

    /**
     * @method connectSignal
     * @description Connects a callback function to a registered signal.
     * @param {string} signalName - The name of the signal to connect the callback function to.
     * @param {function} callback - The function to execute when the signal is emitted.
     * @throws {Error} If the signal does not exist.
     */
    connectSignal(signalName, callback) {
        if (!callback || typeof callback !== 'function') {
            console.warn(new Error('Callback must be a function!'));
            return;
        }
        
        if (this._signalContainer.has(signalName)) {
            this._signalContainer.get(signalName).push(callback);
        } else {
            console.warn(new Error(`Signal "${signalName}" not found in storage!`));
        }
    }

    /**
     * @method disconnectSignal
     * @description Disconnects a callback function from a signal.
     * @param {string} signalName - The name of the signal to disconnect the callback function from.
     * @param {function} callbackToRemove - The callback function to disconnect.
     * @throws {Error} If the signal does not exist.
     */
    disconnectSignal(signalName, callbackToRemove) {
        if (!callbackToRemove || typeof callbackToRemove !== 'function') {
            console.warn(new Error('Callback to remove must be a function!'));
            return;
        }
        
        if (this._signalContainer.has(signalName)) {
            const callbacks = this._signalContainer.get(signalName);
            this._signalContainer.set(signalName, callbacks.filter(callback => callback !== callbackToRemove));
        } else {
            console.warn(new Error(`Signal "${signalName}" not found in storage!`));
        }
    }

    /**
     * @method deleteSignal
     * @description Deletes a signal from the signal system.
     * @param {string} signalName - The name of the signal to delete.
     * @throws {Error} If the signal does not exist.
     */
    deleteSignal(signalName) {
        if (this._signalContainer.has(signalName)) {
            this._signalContainer.delete(signalName);
        } else {
            console.warn(new Error(`Signal "${signalName}" not found in storage!`));
        }
    }

    /**
     * @method emitSignal
     * @description Emits a signal and executes the connected callback functions.
     * @param {string} signalName - The name of the signal to emit.
     * @param {...any} args - Additional arguments to pass to the callback functions.
     * @throws {Error} If the signal does not exist.
     */
    emitSignal(signalName, ...args) {
        if (this._signalContainer.has(signalName)) {
            const callbacks = this._signalContainer.get(signalName);
            callbacks.forEach(callback => callback(...args));
        } else {
            console.warn(new Error(`Signal "${signalName}" not found in storage!`));
        }
    }
}

/**
 * @type {PiepsSignalsClass}
 * @description An instance of PiepsSignalsClass used as a singleton.
 */
const PiepsSignals = new PiepsSignalsClass();

export default PiepsSignals;