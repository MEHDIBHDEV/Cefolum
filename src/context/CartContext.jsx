import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { cartActions, cartSelectors, cartStorage } from '../lib/cart'

const CartContext = createContext()

const initialState = {
  items: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload }
    case 'ADD':
      return { ...state, items: cartActions.add(state.items, action.payload.product, action.payload.quantity) }
    case 'REMOVE':
      return { ...state, items: cartActions.remove(state.items, action.payload.id) }
    case 'UPDATE':
      return { ...state, items: cartActions.update(state.items, action.payload.id, action.payload.quantity) }
    case 'CLEAR':
      return { ...state, items: cartActions.clear() }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const items = cartStorage.load()
    if (items.length) {
      dispatch({ type: 'HYDRATE', payload: items })
    }
  }, [])

  useEffect(() => {
    cartStorage.save(state.items)
  }, [state.items])

  const value = useMemo(() => {
    const count = cartSelectors.count(state.items)
    const subtotal = cartSelectors.subtotal(state.items)
    return {
      items: state.items,
      count,
      subtotal,
      addItem: (product, quantity = 1) => dispatch({ type: 'ADD', payload: { product, quantity } }),
      removeItem: (id) => dispatch({ type: 'REMOVE', payload: { id } }),
      updateItem: (id, quantity) => dispatch({ type: 'UPDATE', payload: { id, quantity } }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}

