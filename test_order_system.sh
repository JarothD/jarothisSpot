#!/bin/bash

echo "Testing JarothisSpot Order System with InsufficientStockException handling..."

# Base URL
BASE_URL="http://localhost:8080"

# Register a test user
echo "1. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "phone": "1234567890"
  }')
echo "Register response: $REGISTER_RESPONSE"

# Login to get token
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')
echo "Login response: $LOGIN_RESPONSE"

# Extract token (simple extraction for testing)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

# Get products to find a product ID
echo "3. Getting products..."
PRODUCTS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/products")
echo "Products response (first 200 chars): ${PRODUCTS_RESPONSE:0:200}..."

# Add item to cart with very high quantity (likely to exceed stock)
echo "4. Adding high quantity item to cart..."
PRODUCT_ID="f422a4a5-942b-47d2-8ce5-c48818e98750"  # 1984 book
ADD_CART_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cart/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"quantity\": 1000
  }")
echo "Add to cart response: $ADD_CART_RESPONSE"

# Get cart to see what's in it
echo "5. Getting cart contents..."
CART_RESPONSE=$(curl -s -X GET "$BASE_URL/api/cart" \
  -H "Authorization: Bearer $TOKEN")
echo "Cart response: $CART_RESPONSE"

# Try to create order (should trigger InsufficientStockException)
echo "6. Attempting to create order (expecting stock conflict)..."
ORDER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/api/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemIds": []
  }')
echo "Order response: $ORDER_RESPONSE"

echo "Test completed!"
