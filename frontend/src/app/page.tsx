"use client";
import React, { useState, useEffect } from "react";
import ScrollWrapper from "./components/ScrollWrapper";
import ProductCard from "./components/ProductCard";
import { ProductCardSkeleton } from "./components/SkeletonLoading";
import api from "./utils/axios";
import FeaturesCardLayout from "./components/FeatureCardsLayout";
import { CategorySkeleton } from "../app/components/SkeletonLoading";

interface Product {
  _id: number;
  name: string;
  price: number;
  image: string;
  category: {
    _id: string;
    name: string;
  };
  rating: string;
  numReviews: number;
}

interface Category {
  _id: string;
  name: string;
}

export default function Page() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");

  // 
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // 
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (err) {
        console.log("Error fetching categories");
      }
    };
    loadCategories();
  }, []);

  //
  const applyFilters = (category: string, search: string) => {
    let updated = [...allProducts];

    if (category !== "All Products") {
      updated = updated.filter((p) => p.category?.name == category);
      console.log(updated)
    }

    if (search.trim() !== "") {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(updated);
  };

  // Category filter
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    applyFilters(cat, searchQuery);
  };

  // Search filter
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    applyFilters(selectedCategory, value);
  };

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

            {/* CATEGORY SIDEBAR */}
            <div className="flex flex-col gap-3 p-4 sticky top-4 md:w-1/5 w-full rounded-xl border shadow-gray-100 shadow-sm bg-white">
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
                      checked={selectedCategory === "All Products"}
                      onChange={() => handleCategoryChange("All Products")}
                    />
                    All Products
                  </label>

                  {categories.map((cat) => (
                    <label
                      key={cat._id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer capitalize ${selectedCategory === cat.name
                          ? "bg-black text-white"
                          : "hover:bg-gray-200"
                        }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.name}
                        checked={selectedCategory === cat.name}
                        onChange={() => handleCategoryChange(cat.name)}
                      />
                      {cat.name}
                    </label>
                  ))}
                </>
              )}
            </div>

            {/* PRODUCT GRID */}
            <div className="flex-1">
              {loading ? (
                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-96 text-red-700 p-6">
                  <h2 className="text-2xl font-semibold">Something went wrong!</h2>
                  <div className="text-gray-700 text-xl mt-10">
                    No products found.
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-600 text-center">No products found.</p>
              ) : (
                <div className="flex flex-wrap md:justify-normal justify-center gap-5">
                  {filteredProducts.map((item) => (
                    <ProductCard key={item._id} product={item} />
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
