import { getKeys } from '../utils/object'
import { resolveName } from '../services/resolver'
import Payload from '../classes/Payload'

/**
 * Utility function to grab keys for state
 *
 * @param   {Object|Function|Array|String}   state   State object, state function, array or string of key names
 * @returns {Array}
 */
function getStateKeys (state) {
  return getKeys(state instanceof Function ? state() : state)
}

/**
 * Helper function to mass-create default getter functions for an existing state object
 *
 * Note that you don't need to create top-level getter functions if using $store.get(...)
 *
 * @param   {Object|Function|Array|String}   state   State object, state function, array or string of key names
 */
export function makeGetters (state) {
  return getStateKeys(state)
    .reduce(function (obj, key) {
      const getter = resolveName('getters', key, options)
      obj[getter] = function (state) {
        return state[key]
      }
      return obj
    }, {})
}

/**
 * Helper function to mass-create default mutation functions for an existing state object
 *
 * @param   {Object|Function|Array|String}   state   State object, state function, array or string of key names
 */
export function makeMutations (state) {
  return getStateKeys(state)
    .reduce(function (obj, key) {
      const mutation = resolveName('mutations', key, options)
      obj[mutation] = function (state, value) {
        value instanceof Payload
          ? value.update(state[key])
          : state[key] = value
      }
      return obj
    }, {})
}

/**
 * Helper function to mass-create default actions functions for an existing state object
 *
 * @param   {Object|Function|Array|String}   state   State object, state function, array or string of key names
 */
export function makeActions (state) {
  return getStateKeys(state)
    .reduce(function (obj, key) {
      const action = resolveName('actions', key, options)
      const mutation = resolveName('mutations', key, options)
      obj[action] = function ({commit}, value) {
        commit(mutation, value)
      }
      return obj
    }, {})
}

export default {
  getters: makeGetters,
  mutations: makeMutations,
  actions: makeActions,
}
