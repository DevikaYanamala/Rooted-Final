import { createContext, useContext, useState, useMemo } from 'react';

const SearchTopPickContext = createContext(null);

export function SearchTopPickProvider({ children }) {
  const [topPickProductId, setTopPickProductId] = useState(null);

  const value = useMemo(
    () => ({ topPickProductId, setTopPickProductId }),
    [topPickProductId],
  );

  return (
    <SearchTopPickContext.Provider value={value}>
      {children}
    </SearchTopPickContext.Provider>
  );
}

export function useSearchTopPick() {
  const ctx = useContext(SearchTopPickContext);
  if (!ctx) {
    return {
      topPickProductId: null,
      setTopPickProductId: () => {},
    };
  }
  return ctx;
}
