import { createContext, useContext, useState } from 'react';

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [communityReviews, setCommunityReviews] = useState({});

  const addReview = (productId, review) => {
    setCommunityReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), review],
    }));
  };

  return (
    <ReviewsContext.Provider value={{ communityReviews, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
