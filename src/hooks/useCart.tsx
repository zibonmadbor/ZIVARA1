import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface AppliedCoupon {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  discountAmount: number;
}

const CART_STORAGE_KEY = "zivara_cart";
const COUPON_STORAGE_KEY = "zivara_coupon";

const CartContext = createContext<CartContextType | undefined>(undefined);

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getStoredCoupon(): AppliedCoupon | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(COUPON_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function saveCoupon(coupon: AppliedCoupon | null) {
  if (coupon) {
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
  } else {
    localStorage.removeItem(COUPON_STORAGE_KEY);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCouponState] = useState<AppliedCoupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart and coupon from localStorage on mount
  useEffect(() => {
    setItems(getStoredCart());
    setAppliedCouponState(getStoredCoupon());
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever items change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveCart(items);
    }
  }, [items, isLoaded]);

  const setAppliedCoupon = useCallback((coupon: AppliedCoupon | null) => {
    setAppliedCouponState(coupon);
    saveCoupon(coupon);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "id" | "quantity">, quantity: number = 1) => {
    setItems((prev) => {
      // Check if item already exists with same size/color
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
      );

      if (existingIndex > -1) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      // Add new item
      return [
        ...prev,
        {
          ...item,
          id: `${item.productId}-${item.size || "default"}-${item.color || "default"}-${Date.now()}`,
          quantity,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, [setAppliedCoupon]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Validate coupon against min_order_amount
  useEffect(() => {
    if (appliedCoupon && subtotal < appliedCoupon.min_order_amount) {
      setAppliedCoupon(null);
    }
  }, [subtotal, appliedCoupon, setAppliedCoupon]);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "percentage") {
      discountAmount = subtotal * (appliedCoupon.discount_value / 100);
    } else if (appliedCoupon.discount_type === "fixed") {
      discountAmount = Math.min(subtotal, appliedCoupon.discount_value);
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        total,
        itemCount,
        appliedCoupon,
        setAppliedCoupon,
        discountAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
