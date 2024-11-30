import { useState } from 'react';
import { storage, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { message, Upload, Button, DatePicker } from 'antd';
import { RcFile } from 'antd/es/upload';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import InputMask from 'react-input-mask';

export default function FormUploadFiles() {
  const [cpf, setCpf] = useState('');
  const [file, setFile] = useState<RcFile | null>(null);
  const [expirationDate, setExpirationDate] = useState<moment.Moment | null>(null);
  const [onUpload, setOnUpload] = useState(false);

  const isValidCpf = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    // Adicione lógica de validação completa do CPF aqui
    return true;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita o recarregamento da página
    if (!file || !cpf || !expirationDate) {
      message.warning('Por favor, preencha todos os campos e selecione um arquivo');
      return;
    }

    if (!isValidCpf(cpf)) {
      message.warning('CPF inválido');
      return;
    }

    setOnUpload(true);

    try {
      const storageRef = ref(storage, `documents/${cpf}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const formattedDate = expirationDate.format('DD/MM/YYYY');
      const fileRef = collection(db, `documents/${cpf}/files`);
      await addDoc(fileRef, {
        name: file.name,
        url,
        expirationDate: formattedDate,
      });

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

  return (
    <form onSubmit={handleUpload}>
      <h2>Upload de Documentos</h2>

      <InputMask
        required
        mask="999.999.999-99"
        placeholder="CPF do proprietário"
        onChange={(e) => setCpf(e.target.value)}
        value={cpf}
        className="mb-4 w-full py-2 px-2.5 border border-gray-500 rounded focus:outline-none focus:!border-blue-500"
      />

      <Upload
        beforeUpload={(file: RcFile) => {
          setFile(file);
          return false;
        }}
        onRemove={handleFileRemove}
        fileList={file ? [{ uid: '-1', name: file.name, status: 'done' }] : []}
        accept=".pdf"
      >
        <Button icon={<UploadOutlined />}>Selecionar Arquivo</Button>
      </Upload>

      <DatePicker
        format="DD/MM/YYYY"
        placeholder="Data de Validade"
        value={expirationDate}
        onChange={(date) => setExpirationDate(date)}
        className="mt-4 mb-4"
      />

      <Button
        type="primary"
        htmlType="submit"
        loading={onUpload}
        disabled={onUpload}
        className="ml-5 mt-4"
      >
        {onUpload ? 'Carregando...' : 'Carregar'}
      </Button>
    </form>
  );
}
