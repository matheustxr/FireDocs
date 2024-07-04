import React, { useState } from 'react';
import { Input, Button, Table, message } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Document {
  id: string;
  name: string;
  url: string;
  expirationDate: string; // Adiciona o campo de validade
}

const PublicPage: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleSearch = async () => {
    if (!cpf) {
      message.warning('Por favor, insira um CPF');
      return;
    }

    try {
      console.log('Buscando documentos para o CPF:', cpf);

      // Acessa a subcoleção 'files' diretamente com base no CPF
      const filesRef = collection(db, `documents/${cpf}/files`);
      const filesSnapshot = await getDocs(filesRef);

      if (!filesSnapshot.empty) {
        const docs = filesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Document[];

        setDocuments(docs);
        console.log('Documentos encontrados:', docs);
      } else {
        console.log('Nenhum documento encontrado para o CPF:', cpf);
        message.info('Nenhum documento encontrado para este CPF');
        setDocuments([]);
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      message.error('Erro ao buscar documentos');
      setDocuments([]);
    }
  };

  const columns = [
    { title: 'Nome do Documento', dataIndex: 'name', key: 'name' },
    { title: 'Data de Validade', dataIndex: 'expirationDate', key: 'expirationDate' }, // Coluna para a data de validade
    { title: 'Link', dataIndex: 'url', key: 'url', render: (text: string) => <a href={text} target="_blank" rel="noopener noreferrer">Baixar</a> },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2>Pesquisar Documentos por CPF</h2>
      <Input placeholder="Digite seu CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} className="mb-4" />
      <Button type="primary" onClick={handleSearch}>Pesquisar</Button>
      <Table columns={columns} dataSource={documents} rowKey="id" className="mt-4" />
    </div>
  );
};

export default PublicPage;
