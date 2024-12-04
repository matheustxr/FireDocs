import React from 'react';

interface Document {
  id: string;
  name: string;
  url: string;
  expirationDate: string;
}

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  if (documents.length === 0) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      {documents.map((doc) => (
        <div
          key={doc.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p><strong>Nome:</strong> {doc.name}</p>
          <p>
            <strong>URL:</strong>{' '}
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              {doc.url}
            </a>
          </p>
          <p><strong>Expiration date:</strong> {doc.expirationDate}</p>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
