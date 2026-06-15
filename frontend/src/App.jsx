import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import CategoriesPage from './pages/CategoriesPage';
import CultureSelectorPage from './pages/CultureSelectorPage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import { AuthProvider } from './context/AuthContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { SearchTopPickProvider } from './context/SearchTopPickContext';
import { CartProvider } from './context/CartContext';
import { PreferencesProvider } from './context/PreferencesContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PreferencesProvider>
          <CartProvider>
            <ReviewsProvider>
              <SearchTopPickProvider>
                <ScrollToTop />
                <Routes>
                  {/* /login redirects to home — no login required for public demo */}
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route element={<Layout />}>
                    <Route path="/" element={<CategoriesPage />} />
                    <Route path="/culture" element={<CultureSelectorPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                  </Route>
                </Routes>
              </SearchTopPickProvider>
            </ReviewsProvider>
          </CartProvider>
        </PreferencesProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
