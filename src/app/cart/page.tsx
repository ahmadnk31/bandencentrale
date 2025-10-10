"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Minus, 
  X, 
  ShoppingCart,
  ArrowLeft,
  Truck,
  Shield,
  Clock,
  CreditCard
} from "lucide-react";

const CartPage = () => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const shippingCost = state.total > 100 ? 0 : 15;
  const tax = state.total * 0.21; // 21% VAT
  const finalTotal = state.total + shippingCost + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-tire-dark mb-4">Your Cart is Empty</h1>
            <p className="text-tire-gray mb-8">
              Looks like you haven't added any tires to your cart yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push('/tires')} size="lg">
                Browse Tires
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} size="lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-tire-dark">
                Shopping Cart
              </h1>
              <p className="text-tire-gray mt-2">
                {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="hidden sm:flex"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {state.items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.selectedSize}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 shadow-lg border-0">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.images[0]?.src || "/api/placeholder/200/200"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-tire-dark">
                                {item.name}
                              </h3>
                              <p className="text-tire-gray">{item.brand}</p>
                              <p className="text-sm text-tire-gray">
                                Size: {item.selectedSize}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id, item.selectedSize)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-10 w-10 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                className="h-10 w-10 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-2xl font-bold text-tire-dark">
                                €{(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-tire-gray">
                                €{item.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Clear Cart */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/tires')}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="p-6 shadow-lg border-0 sticky top-6">
                <CardContent className="p-0 space-y-6">
                  <h3 className="text-2xl font-bold text-tire-dark">Order Summary</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-tire-gray">Subtotal</span>
                      <span className="font-semibold">€{state.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tire-gray">Shipping</span>
                      <span className="font-semibold">
                        {shippingCost === 0 ? 'Free' : `€${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tire-gray">VAT (21%)</span>
                      <span className="font-semibold">€{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-tire-dark">Total</span>
                      <span className="font-bold text-tire-dark">€{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                                  {/* Checkout Button */}
                <Button 
                  className="w-full bg-tire-gradient py-3 text-lg"
                  onClick={() => router.push('/checkout')}
                >
                  Proceed to Checkout
                </Button>

                  {/* Benefits */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-tire-dark">Your Benefits</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-tire-gray">
                        <Truck className="w-4 h-4 text-green-500" />
                        <span>Free shipping on orders over €100</span>
                      </div>
                      <div className="flex items-center gap-2 text-tire-gray">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>6-year warranty included</span>
                      </div>
                      <div className="flex items-center gap-2 text-tire-gray">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>Professional installation available</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-tire-dark">Promo Code</h4>
                    <div className="flex gap-2">
                      <Input placeholder="Enter promo code" className="flex-1" />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartPage;
