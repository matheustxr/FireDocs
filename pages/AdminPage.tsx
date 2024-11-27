import React, { useState } from 'react';
import { Input, Button, Upload, message, DatePicker, Form } from 'antd';
import InputMask from 'react-input-mask'; 
import { UploadOutlined } from '@ant-design/icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { auth, storage, db } from '../firebase';
import { RcFile } from 'antd/lib/upload';
import moment from 'moment';

const AdminPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [file, setFile] = useState<RcFile | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [expirationDate, setExpirationDate] = useState<moment.Moment | null>(null);
  const [onUpload, setOnUpload] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
      message.success('Login realizado com sucesso');
    } catch (error) {
      console.error('Erro no login:', error);
      message.error('Erro no login, verifique suas credenciais');
    }
  };

  const handleUpload = async () => {
    if (!file || !cpf || !expirationDate) {
      message.warning('Por favor, preencha todos os campos e selecione um arquivo');
      return;
    }
    
    setOnUpload(true);
    
    try {
      console.log('Iniciando upload do arquivo:', file.name);
      const storageRef = ref(storage, `documents/${cpf}/${file.name}`);
      console.log('Referência do storage definida:', storageRef);

      await uploadBytes(storageRef, file);
      console.log('Upload feito com sucesso');

      const url = await getDownloadURL(storageRef);
      console.log('URL do arquivo obtida:', url);

      // Formata a data de validade
      const formattedDate = expirationDate.format('DD/MM/YY');

      // Adiciona o arquivo à subcoleção 'files' do CPF no Firestore
      const fileRef = collection(db, `documents/${cpf}/files`);
      await addDoc(fileRef, {
        name: file.name,
        url,
        expirationDate: formattedDate,
      });
      console.log('Dados do arquivo adicionados ao Firestore com sucesso');

      message.success('Arquivo carregado com sucesso');
      setCpf('');
      setFile(null);
      setExpirationDate(null);
    } catch (error) {
      console.error('Erro ao carregar o arquivo:', error);
      message.error('Erro ao carregar o arquivo');
    } finally {
      setOnUpload(false);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evita o comportamento padrão
      if (!loggedIn) {
        handleLogin();
      } else {
        handleUpload();
      }
    }
  };

  return (
    <div className="container mx-auto p-5 md:px-10 lg:px-14 xl:16">
      <Form onKeyDown={handleKeyPress}>
        {!loggedIn ? (
          <>
            <h2>Admin Login</h2>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />
            <Input.Password placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
            <Button type="primary" onClick={handleLogin}>Login</Button>
          </>
        ) : (
          <>
            <h2>Upload de Documentos</h2>
            <InputMask 
              mask="999.999.999-99"
              placeholder="CPF do proprietário" 
              value={cpf} 
              onChange={(e) => {setCpf(e.target.value),  console.log(e.target.value)}} 
              className="mb-4 w-full py-1 px-2 border border-gray-500 rounded-lg focus:border-blue-500"
            />

            <Upload 
              beforeUpload={(file: RcFile) => { setFile(file); return false; }} 
              onRemove={handleFileRemove} 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              fileList={file ? [file as any] : []}
            >
              <Button icon={<UploadOutlined />}>Selecionar Arquivo</Button>
            </Upload>
            <DatePicker
              format="DD/MM/YY"
              placeholder="Data de Validade"
              value={expirationDate}
              onChange={(date) => setExpirationDate(date)}
              className="mt-4 mb-4"
            />
            <button 
              onClick={handleUpload} 
              className={`ml-3 mt-4 px-3 py-1 text-base transition-all rounded ${onUpload ? "bg-gray-400 tex-black" : "bg-[#1677ff] text-white"}`}
              disabled={onUpload}
            >
              {onUpload ? "Carregando..." : "Carregar"}
            </button>
          </>
        )}
      </Form>
    </div>
  );
};

export default AdminPage;
