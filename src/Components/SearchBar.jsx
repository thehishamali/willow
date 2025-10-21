import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const resMen = await fetch("http://localhost:3001/men");
        const men = await resMen.json();
        const resWomen = await fetch("http://localhost:3001/women");
        const women = await resWomen.json();

        const menWithCategory = men.map(p => ({ ...p, category: "men" }));
        const womenWithCategory = women.map(p => ({ ...p, category: "women" }));
        setProducts([...menWithCategory, ...womenWithCategory]);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    fetchProducts();
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  }

  function handleNavigate(item) {
    setQuery("");
    setSuggestions([]);
    navigate(`/${item.category}/${item.id}`);
  }

  return (
    <div className="pt-5 relative">
      <div className="flex items-center border-b border-gray-400 focus-within:border-black transition">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className="w-full px-1 py-2 focus:outline-none text-sm"
        />
      </div>

      {suggestions.length > 0 && (
        <ul
          className="absolute left-0 w-full mt-1 max-h-80 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleNavigate(item)}
              className="px-2 py-1 cursor-pointer hover:text-gray-500 transition text-xs uppercase"
              style={{ textTransform: "uppercase" }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
