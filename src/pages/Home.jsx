import useProducts from "../hooks/useProducts"
import ProductCard from "../components/ProductCard"
import { useMemo, useState, useEffect } from "react"
import ProductSkeleton from "../components/ProductSkeleton"
import "../styles/home.css"

function Home() {
    const { Products, loading, error } = useProducts()
    const productsPerPage = 8
    const [visibleCount, setVisibleCount] = useState(productsPerPage)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")

    const categories = ["all", ...new Set(Products.map(p => p.category))]

    const filteredProducts = useMemo(() => {
        return Products
            .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
            .filter(p => category === "all" ? true : p.category === category)
    }, [Products, search, category])

    const currentProducts = filteredProducts.slice(0, visibleCount)

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop + 100 >=
                document.documentElement.scrollHeight) {
                setVisibleCount(prev => Math.min(prev + productsPerPage, filteredProducts.length))
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [filteredProducts.length])

    useEffect(() => {
        setVisibleCount(productsPerPage)
    }, [search, category])

    if (loading) {
        return (
            <div className="filter-bar">
                <div className="product-slider">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    if (error) return <h2 style={{ color: "red", padding: 40 }}>{error}</h2>

    return (
        <div className="filter-bar">

            {/* ── HERO BANNER ── */}
            <div className="home-hero">
                <div className="hero-text">
                    <div className="hero-eyebrow">New arrivals · Free delivery</div>
                    <h1 className="hero-title">
                        Shop the <span>Latest</span><br />
                        Trends Today
                    </h1>
                    <p className="hero-sub">
                        Discover thousands of products across all categories,
                        handpicked for quality and value.
                    </p>
                </div>
                <div className="hero-badge">
                    <div className="hero-badge-item">
                        <span className="hero-badge-num">{Products.length}+</span>
                        <span className="hero-badge-label">Products</span>
                    </div>
                    <div className="hero-badge-item">
                        <span className="hero-badge-num">{categories.length - 1}</span>
                        <span className="hero-badge-label">Categories</span>
                    </div>
                </div>
            </div>

            {/* ── FILTERS ── */}
            <div className="filter-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="category-box">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── SECTION LABEL ── */}
            <h2 className="products-title">
                {search || category !== "all"
                    ? `${filteredProducts.length} results found`
                    : "All Products"}
            </h2>

            {/* ── PRODUCT GRID ── */}
            <div className="product-slider">
                {currentProducts.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3>No products found</h3>
                        <p>Try a different search term or category</p>
                    </div>
                ) : (
                    currentProducts.map((product) => (
                        <div key={product.id || product.id} className="product-slide">
                            <ProductCard product={product} />
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}

export default Home
