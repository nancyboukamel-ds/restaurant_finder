# 🏗️ Restaurant Finder - Project Structure

## 📁 Complete Directory Tree

```
RESTAURANT_FINDER/
└── restaurant-finder/
    ├── public/                          # Static assets served directly
    │
    ├── src/                             # Source code directory
    │   ├── __tests__/                   # Root-level tests
    │   │   └── App.test.tsx             # Main App component tests
    │   │
    │   ├── assets/                      # Static assets (images, fonts, etc.)
    │   │
    │   ├── components/                  # React components
    │   │   ├── __tests__/               # Component tests
    │   │   │   ├── Filters.test.tsx     # Filter component tests
    │   │   │   ├── RestaurantCard.test.tsx  # Card component tests
    │   │   │   └── SearchBar.test.tsx   # Search bar tests
    │   │   │
    │   │   ├── EmptyState.tsx           # Empty state UI (before search)
    │   │   ├── ErrorDisplay.tsx         # Error message display
    │   │   ├── Filters.tsx              # Cuisine & rating filters
    │   │   ├── LoadingSpinner.tsx       # Loading animation
    │   │   ├── RestaurantCard.tsx       # Individual restaurant display
    │   │   └── SearchBar.tsx            # Postcode search input
    │   │
    │   ├── services/                    # External API interactions
    │   │   ├── __tests__/
    │   │   │   └── restaurantApi.test.ts  # API service tests
    │   │   └── restaurantApi.ts         # Just Eat API service
    │   │
    │   ├── types/                       # TypeScript type definitions
    │   │   ├── __tests__/
    │   │   │   └── restaurant.test.ts   # Type tests
    │   │   └── restaurant.ts            # Restaurant interface
    │   │
    │   ├── utils/                       # Utility functions
    │   │   └── filterRestaurants.ts     # Restaurant filtering logic
    │   │
    │   ├── App.tsx                      # Main application component
    │   ├── index.css                    # Global CSS styles
    │   └── main.tsx                     # Application entry point
    │
    ├── .gitignore                       # Git ignore rules
    ├── eslint.config.js                 # ESLint configuration
    ├── index.html                       # HTML template
    ├── package-lock.json                # Locked dependency versions
    ├── package.json                     # Dependencies & scripts
    ├── postcss.config.js                # PostCSS configuration
    ├── README.md                        # Project documentation
    ├── server.js                        # Express backend proxy server
    ├── tailwind.config.js               # Tailwind CSS configuration
    ├── tsconfig.app.json                # TypeScript app config
    ├── tsconfig.json                    # TypeScript base config
    ├── tsconfig.node.json               # TypeScript Node.js config
    ├── vite.config.ts                   # Vite build configuration
    └── vitest.config.ts                 # Vitest test configuration
```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  SearchBar.tsx: User types "EC4M 7RF" and clicks search         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  App.tsx: handleSearch() called                                 │
│  - setLoading(true)                                             │
│  - setError(null)                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  restaurantApi.ts: fetchRestaurantByPostcode('EC4M7RF')         │
│  - Clean & validate postcode                                    │
│  - fetch('http://localhost:3001/api/restaurants/EC4M7RF')       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  server.js: Express proxy server                                │
│  - Receives request from frontend                               │
│  - Proxies to Just Eat API                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Just Eat Takeaway API                                          │
│  - Returns {restaurants: [...], filters: {...}}                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  restaurantApi.ts: Transform data                               │
│  - Map API format to our Restaurant interface                   │
│  - Return {restaurants: Restaurant[], filters: any}             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  App.tsx: Update state                                          │
│  - setAllRestaurants([2342 items])                              │
│  - setApiFilters({...})                                         │
│  - setFilteredRestaurants([first 10])                           │
│  - setLoading(false)                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Filters.tsx: Render filter UI                                  │
│  - Extract cuisine filters from apiFilters                      │
│  - Display cuisine chips alphabetically                         │
│  - Display rating slider                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  RestaurantCard.tsx (x10): Display results                      │
│  - Render each restaurant card                                  │
│  - Show name, cuisines, rating, address                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  USER APPLIES FILTER: Clicks "Pizza"                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Filters.tsx: toggleCuisine('pizza')                            │
│  - setSelectedCuisines(['pizza'])                               │
│  - useEffect triggers → onFilterChange()                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  App.tsx: handleFilterChange()                                  │
│  - Call filterRestaurants utility                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  filterRestaurants.ts: Apply filters                            │
│  - Filter by cuisine (Pizza)                                    │
│  - Filter by rating (if set)                                    │
│  - Sort by rating                                               │
│  - Return top 10                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  App.tsx: Update display                                        │
│  - setFilteredRestaurants([10 pizza places])                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  UI RE-RENDERS: Shows 10 pizza restaurants                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Framework** | React 18.2 | UI component library |
| **Language** | TypeScript 5.3 | Type-safe JavaScript |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **Build Tool** | Vite 5.0 | Fast dev server & bundler |
| **Testing** | Vitest | Unit testing framework |
| **Backend** | Node.js + Express | Proxy server for API calls |
| **API** | Just Eat Takeaway | Restaurant data source |
---

## 🚀 Scripts Reference

```bash
# Development
npm start              # Start both frontend (5173) and backend (3001)
npm run dev            # Frontend only (Vite dev server)
npm run server         # Backend only (Express server)

# Testing
npm test               # Run all tests with Vitest
npm run test:ui        # Open Vitest UI

# Building
npm run build          # Production build
npm run preview        # Preview production build

# Linting
npm run lint           # Run ESLint
```

---

## 🔧 Configuration Files Explained

### **vite.config.ts**
```typescript
// Configures Vite build tool
- Entry point: index.html
- React plugin integration
- Dev server port: 5173
- Build output: dist/
```

### **tailwind.config.js**
```javascript
// Tailwind CSS configuration
- Content paths: src/**/*.{ts,tsx}
- Theme customization
- Plugin configuration
```

### **tsconfig.json**
```json
// TypeScript compiler options
- Target: ES2020
- Module: ESNext
- Strict mode: enabled
- JSX: react-jsx
```

### **vitest.config.ts**
```typescript
// Test configuration
- Test environment: jsdom (browser simulation)
- Coverage provider: v8
- Global test utilities
```

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| **Total Components** | 6 |
| **Test Files** | 6 |
| **Type Definitions** | 2 interfaces |
| **Utility Functions** | 1 |
| **API Services** | 1 |
| **Configuration Files** | 10 |
| **Total Tests** | 21 passing |

---
