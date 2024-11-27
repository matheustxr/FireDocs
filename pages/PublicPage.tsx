import React, { useState } from 'react';
import { Button, Table, message, Form } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import Lottie from 'react-lottie-player';
import InputMask from 'react-input-mask'; 

import { db } from '../firebase';
import certificado from '../assets/animations/animatimacao-certificado.json';
import wpp from '../assets/images/whatsapp.png';

interface Document {
  id: string;
  name: string;
  url: string;
  expirationDate: string;
}

const PublicPage: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);

  const formatCpf = (cpf: string) => {
    const cleanedCpf = cpf.replace(/\D/g, ''); 
    return cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleSearch = async () => {
    if (!cpf) {
      message.warning('Por favor, insira um CPF');
      return;
    }

    try {
      const formattedCpf = formatCpf(cpf);
      const filesRef = collection(db, `documents/${formattedCpf}/files`);
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
    }
  };

  const handleFinish = (values: { cpf: string }) => {
    setCpf(values.cpf); // Atualiza o CPF a partir do formulário
    console.log(cpf);
    handleSearch(); // Chama a função de busca
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
      <div className='mb-10 flex flex-col-reverse md:flex-row gap-5 md:gap-10 justify-around'>
        <div className='w-full md:w-1/3 '>
          <Lottie
            play
            loop
            animationData={certificado}
            className='w-full mx-auto '
          />
        </div>

        <div className='w-full md:w-2/3 max-w-[700px] flex flex-col gap-3 justify-center'>
          <h1 className='text-3xl font-semibold text-[#750101] title-certificados'>
            Olá, seja bem-vindo à página de certificados
          </h1>
          <p>
            Após concluir o curso, pedimos um prazo de 7 dias para a emissão do seu certificado. Informe seu CPF na barra de 
            pesquisa e clique em "Buscar". Uma vez encontrado seu nome na lista de resultados, clique no link para visualizar e 
            baixar seu certificado no formato PDF. Verifique todas as informações cuidadosamente antes de fazer o download.
          </p>

          <a 
            href="https://api.whatsapp.com/send/?phone=553498937919&amp;text=Ol%C3%A1%2C+vim+atrav%C3%A9s+da+plataforma+e+gostaria+de+tirar+uma+d%C3%BAvida." 
            target="_blank" 
            className="py-2 px-5 w-[200px] flex items-center justify-between text-white font-semibold bg-[#29a71a] rounded animate-bounce"
          >
            WHATSAPP
            <img 
              src={wpp} 
              alt="icone whatsapp" 
              className="w-10"
            />
          </a>
        </div>
      </div>

      <h2>Pesquisar Documentos por CPF <span className='text-sm text-[#616161c4] '>(Digite apenas os números)</span></h2>
      
      <Form onFinish={handleFinish} className="mb-4">
        <Form.Item name="cpf" rules={[{ required: true, message: 'Por favor, insira um CPF válido' }]}>
          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className='w-full py-1 px-2 border border-gray-500 rounded-lg focus:border-blue-500 '
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Pesquisar</Button>
        </Form.Item>
      </Form>
      
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
