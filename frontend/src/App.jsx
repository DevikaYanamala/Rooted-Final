import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CategoriesPage from './pages/CategoriesPage';
import CultureSelectorPage from './pages/CultureSelectorPage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Protect routes that require login
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
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
                  <Route path="/login" element={<LoginPage />} />
                  <Route element={<Layout />}>
                    <Route path="/" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
                    <Route path="/culture" element={<ProtectedRoute><CultureSelectorPage /></ProtectedRoute>} />
                    <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                    <Route path="/product/:id" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
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
