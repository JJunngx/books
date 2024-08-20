import { createContext, useState } from "react";
const searchContext = createContext();
const checkoutData = createContext();
const SearchProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState({
    books: [],
    totalPrice: 0,
  });
  return (
    <checkoutData.Provider value={{ books, setBooks }}>
      <searchContext.Provider value={{ keyword, setKeyword }}>
        {children}
      </searchContext.Provider>
    </checkoutData.Provider>
  );
};
export { searchContext, checkoutData };
export default SearchProvider;
