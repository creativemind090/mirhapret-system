# Ecommerce Store - TODO

## 🔴 CRITICAL (Blocks checkout)
- [x] Product Detail Page
- [x] Shopping Cart Page
- [x] User Authentication (Login/Register with dummy credentials)
- [x] Checkout Flow (5-step with validation)
- [ ] Payment Gateway Integration
- [x] Order Confirmation Page
- [x] Add to Cart Functionality
- [x] OTP Email Verification

## 🟠 HIGH (Core functionality)
- [x] User Profile Page (with shipping & billing address)
- [x] Order History Page (with order details modal)
- [x] Product Listing & Filtering
- [x] Unified Page Header (across all pages)
- [x] Cart Sidebar (slide-in animation)
- [x] Sign In Page (Login, Register, Forgot Password)
- [x] Order Tracking (with Mapbox integration)
- [ ] API Integration (Connect to backend endpoints)

## 🟡 MEDIUM (Enhancement)
- [x] Promotions & Discounts (with discount badges and pricing)
- [x] Promo Code Application (with mock codes: SAVE10, SAVE20, WELCOME)
- [x] Product Search
- [x] Advanced Filtering (by price, size, category)
- [x] Contact Page
- [x] About Page
- [x] Wishlist Feature (add/remove products, heart icon toggle)

## 🔵 LOW (Polish)
- [x] Product Image Gallery (vertical carousel)
- [x] Size Guide Modal
- [x] Product Discount Badges (10% off on select items)
- [x] Out-of-Stock Handling (disabled controls, wishlist-only option)
- [x] Image Zoom on Hover (product detail page)
- [x] Floating Chat Widget (with WhatsApp integration)
- [ ] Performance Optimization
- [ ] Return/Exchange Flow
- [ ] Live Chat Support

## ✅ COMPLETED FEATURES
- Product detail page with image carousel and size selection
- Image zoom on hover (smooth, non-intrusive UX)
- Floating chat widget with chatbot and WhatsApp integration
- Shopping cart with localStorage persistence
- Multi-step checkout with form validation (regex patterns)
- Auto-fill checkout form with logged-in user data
- Promo code application with discount calculation (mock codes: SAVE10, SAVE20, WELCOME)
- Product search functionality
- Advanced filtering (by price range, size, category)
- Product discount badges (10% off on select items)
- Out-of-stock product handling (disabled quantity controls, wishlist-only option)
- Wishlist feature (add/remove products, heart icon toggle)
- My Wishlist page with product grid and remove functionality
- OTP verification system
- User authentication context with dummy credentials
- My Profile page with editable personal, contact, shipping & billing info
- Settings section with notification preferences (email notifications, newsletter subscription)
- My Orders page with order details modal and received date
- Order tracking with Mapbox integration (shows order location on map)
- Unified header component used across all pages
- Cart sidebar with smooth animations
- Sign in page with login, register, and forgot password tabs
- About and Contact pages

## 📊 BACKEND FEATURES AVAILABLE
- [x] Orders Module (Create, Read, Update, Delete)
- [x] Products Module (Create, Read, Update, Delete)
- [x] Categories Module (Create, Read, Update, Delete) - *Admin only*
- [x] Promotions Module (Create, Read, Update, Delete)
- [x] Inventory Module (Track stock levels) - *Admin only*
- [x] Auth Module (Login, Register, JWT)
- [x] Analytics Module (Track metrics) - *Admin only*
- [x] Cloudinary Integration (Image uploads)
- [x] Wishlist Module (entity exists, ready for API implementation)

## 🔗 FRONTEND API INTEGRATION GAPS
- [ ] Connect Products API
- [ ] Connect Orders API
- [ ] Connect Auth API (Login/Register)
- [ ] Connect Promotions API
- [ ] Connect Wishlist API

## 📝 NOTES
- Category Management & Inventory Management are admin-only tasks (handled in admin app)
- Analytics tracking is admin-only (handled in admin app)
- Currently using dummy data and localStorage for persistence
- Ready for backend API integration
- Wishlist entity confirmed in backend (apps/backend/src/entities/wishlist.entity.ts)
- Out-of-stock items: pret-3 and desire-2 (demo purposes)
- Discount items: pret-1 has 10% off (demo purposes)
