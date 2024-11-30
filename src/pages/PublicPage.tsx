import React, { FormEvent, useState } from 'react';
import { Table, message} from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import InputMask from 'react-input-mask'; 

import { db } from '../firebase';

interface Document {
  id: string;
  name: string;
  url: string;
  expirationDate: string;
}

const PublicPage: React.FC = () => {
  const [cpf, setCpf] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = async () => {
    if (!cpf) {
      message.warning('Por favor, insira um CPF');
      return;
    }

    try {
      const filesRef = collection(db, `documents/${cpf}/files`);
      const filesSnapshot = await getDocs(filesRef);

      if (!filesSnapshot.empty) {
        const docs = filesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Document[];

        setDocuments(docs);
      } else {
        message.info('Nenhum documento encontrado para este CPF');
        setDocuments([]);
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      message.error('Erro ao buscar documentos');
      setDocuments([]);
    } finally {
      setTimeout(message.success(`Foram encontrados ${documents.length} para esse CPF.`), 800);
    }
  };

  const columns = [
    { 
      title: 'Nome do Documento', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text: string) => <div className="break-words">{text}</div>
    },
    { 
      title: 'Data de Validade', 
      dataIndex: 'expirationDate', 
      key: 'expirationDate', 
      render: (text: string) => <div className="break-words">{text}</div>
    },
    { 
      title: 'Link', 
      dataIndex: 'url', 
      key: 'url', 
      render: (text: string) => <a href={text} target="_blank" rel="noopener noreferrer">Baixar</a> 
    },
  ];

  return (
    <div className="container mx-auto p-4">

      <h2>Pesquisar Documentos por CPF <span className='text-sm text-[#616161c4] '>(Digite apenas os números)</span></h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <InputMask
          mask="999.999.999-99"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="mb-4 w-full py-2 px-2.5 border border-gray-500 rounded focus:outline-none focus:!border-blue-500"
          required
        />

        <button 
          type="submit" 
          className='mt-3 px-3 py-1 text-base bg-[#1677ff] text-white transition-all rounded'
        >
          Pesquisar
        </button>
      </form>
      
      <Table 
        columns={columns} 
        dataSource={documents} 
        rowKey="id" 
        className="w-full mt-4" 
        pagination={false}
        scroll={{ y: 300 }}
      />
    </div>
  );
};

export default PublicPage;
