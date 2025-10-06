const STORAGE_KEY = 'cefolum_cart_v1'

const isBrowser = () => typeof window !== 'undefined'

const getStoredCart = () => {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to parse cart from storage', error)
    return []
  }
}

const persistCart = (items) => {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to persist cart', error)
  }
}

export const cartStorage = {
  load: getStoredCart,
  save: persistCart,
}

export const cartActions = {
  add(items, product, quantity = 1) {
    const next = [...items]
    const existing = next.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 99)
    } else {
      next.push({
        id: product.id,
        title: product.title,
        price: product.salePrice ?? product.price,
        basePrice: product.price,
        salePrice: product.salePrice,
        image: product.image,
        quantity: Math.min(quantity, 99),
      })
    }
    return next
  },
  remove(items, id) {
    return items.filter((item) => item.id !== id)
  },
  update(items, id, quantity) {
    const value = Math.max(1, Math.min(quantity, 99))
    return items.map((item) => (item.id === id ? { ...item, quantity: value } : item))
  },
  clear() {
    return []
  },
}

export const cartSelectors = {
  count(items) {
    return items.reduce((acc, item) => acc + item.quantity, 0)
  },
  subtotal(items) {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0)
  },
}

