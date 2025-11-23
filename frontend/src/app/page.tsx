"use client";
import React, { useState, useEffect } from "react";
import ScrollWrapper from "./components/ScrollWrapper";
import ProductCard from "./components/ProductCard";
import { ProductCardSkeleton } from "./components/SkeletonLoading";
import api from "./utils/axios";
import FeaturesCardLayout from "./components/FeatureCardsLayout";
import { CategorySkeleton } from "../app/components/SkeletonLoading";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle category change
  const handleCategoryChange = async (categoryName: string) => {
    setSelectedCategory(categoryName);
    filterProducts(categoryName, searchQuery);
    setLoading(true);
    try {
      if (categoryName === "All Products") {
        const { data } = await api.get("/products");
        setProducts(data);
        setFilteredProducts(data);
      } else {
        const { data } = await api.get(`/products/category/${categoryName}`);
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (err) {
      setError("Failed to load category.");
    } finally {
      setLoading(false);
    }
  };

  // Filter by search only
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    filterProducts(selectedCategory, value);
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const filterProducts = (category: string, search: string) => {
    let updated = [...products];
    // filter by category
    if (category !== "All Products") {
      updated = updated.filter((p) => p.category === category);
    }
    // filter by search
    if (search.trim() !== "") {
      updated = updated.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredProducts(updated);
  };

  useEffect(() => {
    filterProducts(selectedCategory, searchQuery);
  }, [products]);

  return (
    <>
      <ScrollWrapper direction="fade">
        <section className="flex flex-col font-sans pt-20 pb-6 min-h-fit w-screen px-4 bg-white gap-8">

          {/* SEARCH BAR */}
          <div className="w-full flex justify-center px-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 border border-gray-300 rounded-lg px-4 ring-gray-500 focus:ring-2 focus:ring-black font-sans outline-none"
            />
          </div>

          <div className="flex md:flex-row flex-col gap-6 w-full max-w-7xl mx-auto">

            {/* CATEGORY LIST */}
            <div className="flex flex-col gap-3 p-4 sticky top-4 md:w-1/5 w-full rounded-xl border border-gray-100 shadow-sm bg-white">
              {loading ? (
                <CategorySkeleton />
              ) : (
                <>
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${selectedCategory === "All Products"
                      ? "bg-black text-white"
                      : "hover:bg-gray-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="All Products"
                      checked={selectedCategory === "All Products"}
                      onChange={() => handleCategoryChange("All Products")}
                    />
                    All Products
                  </label>

                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer capitalize ${selectedCategory === cat
                        ? "bg-black text-white"
                        : "hover:bg-gray-200"
                        }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </>
              )}
            </div>

            {/* PRODUCT GRID */}
            <div className="flex-1">
              {loading ? (
                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-96 text-red-700 p-6">
                  <h2 className="text-2xl font-semibold md:mb-2 mb-1">
                    Something went wrong!
                  </h2>
                  <div className="text-center font-sans text-gray-700 text-xl mt-10"> No products found. </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-600 text-center">No products found.</p>
              ) : (
                <div className="grid xl:grid-cols-3 md:grid-cols-2 justify-center items-center text-center grid-cols-1 gap-4">
                  {filteredProducts.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollWrapper>

      <ScrollWrapper direction="left">
        <FeaturesCardLayout />
      </ScrollWrapper>
    </>
  );
}
