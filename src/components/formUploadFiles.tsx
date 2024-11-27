import { useState } from "react";
import { storage, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { message, Upload, Button, DatePicker } from "antd";
import { RcFile } from "antd/es/upload";
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import InputMask from 'react-input-mask'; 


export default function FormUploadFiles(){
	const [cpf, setCpf] = useState('');
	const [file, setFile] = useState<RcFile | null>(null);
	const [expirationDate, setExpirationDate] = useState<moment.Moment | null>(null);
	const [onUpload, setOnUpload] = useState(false);

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
			
			const formattedDate = expirationDate.format('DD/MM/YY');
			
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


	return (
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
	)
}