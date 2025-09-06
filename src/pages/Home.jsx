import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);

      // 1. Fetch all categories
      const { data, error } = await supabase
        .from("products")
        .select("category, image_url");

      if (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        setLoading(false);
        return;
      }

      // 2. Deduplicate categories
      const dedup = Array.from(
        new Set(data.map((r) => r.category).filter(Boolean))
      );
      setCategories(dedup);

      // 3. Pick one image per category (first product found)
      const catImgMap = {};
      dedup.forEach((cat) => {
        const product = data.find((p) => p.category === cat && p.image_url);
        catImgMap[cat] =
          product?.image_url ||
          "https://via.placeholder.com/400x250?text=Category";
      });
      setCategoryImages(catImgMap);

      setLoading(false);
    }

    loadCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Categories</h1>
      <div className="row">
        {categories.map((cat) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={cat}>
            <Link
              to={`/category/${encodeURIComponent(cat)}`}
              className="text-decoration-none"
            >
              <div className="card shadow-lg h-100 border-0">
                <img
                  src={categoryImages[cat]}
                  className="card-img-top rounded"
                  alt={cat}
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-dark">{cat}</h5>
                  <button className="btn btn-outline-primary btn-sm">
                    Explore
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
