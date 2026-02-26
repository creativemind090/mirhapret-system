interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  image,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'none',
      }}
    >
      <div
        style={{
          height: '280px',
          background: image || '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#999999',
          marginBottom: '16px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!image && 'Product Image'}
      </div>
      <div style={{ padding: '0 16px 16px 16px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
          {name}
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#666666', marginBottom: '12px' }}>
          {category}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000000' }}>
            PKR {price.toLocaleString()}
          </p>
          <button
            onClick={() => onAddToCart?.(id)}
            style={{
              padding: '6px 12px',
              background: '#000000',
              color: '#ffffff',
              border: '1px solid #000000',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
