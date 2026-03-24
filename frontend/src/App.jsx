import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import { ReviewsProvider } from './context/ReviewsContext';
import { SearchTopPickProvider } from './context/SearchTopPickContext';
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
    <ReviewsProvider>
      <SearchTopPickProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Route>
      </Routes>
      </SearchTopPickProvider>
    </ReviewsProvider>
  );
}
