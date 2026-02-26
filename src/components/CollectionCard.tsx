interface CollectionCardProps {
  name: string;
  description: string;
  priceRange: string;
  image?: string;
  onClick?: () => void;
}

export default function CollectionCard({
  name,
  description,
  priceRange,
  image,
  onClick,
}: CollectionCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'none',
      }}
    >
      <div
        style={{
          height: '400px',
          background: image || '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: '#999999',
          marginBottom: '24px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!image && 'Collection Image'}
      </div>
      <div style={{ padding: '0 0 24px 0' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
          {name}
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#666666', marginBottom: '12px' }}>
          {description}
        </p>
        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#000000' }}>
          {priceRange}
        </p>
      </div>
    </div>
  );
}
