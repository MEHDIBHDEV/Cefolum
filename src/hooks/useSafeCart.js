import { useCart } from '../context/CartContext'

export function useSafeCart() {
  try {
    return useCart()
  } catch (error) {
    return {
      addItem: () => {},
    }
  }
}

