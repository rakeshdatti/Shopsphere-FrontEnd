function ProductSkeleton() {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        height: "250px",
        background: "#f3f3f3",
        animation: "pulse 1.5s infinite"
      }}
    >
      <div
        style={{
          height: "120px",
          background: "#ddd",
          marginBottom: "10px"
        }}
      />

      <div
        style={{
          height: "20px",
          background: "#ddd",
          marginBottom: "10px"
        }}
      />

      <div
        style={{
          height: "20px",
          width: "50%",
          background: "#ddd"
        }}
      />
    </div>
  );
}

export default ProductSkeleton;