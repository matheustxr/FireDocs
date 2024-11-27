
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Input, Button, message } from 'antd';
import { useState } from 'react';

export default function FormLoginAdmin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginAdmin = async () => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			sessionStorage.setItem("userLogged", "true");
			message.success('Login realizado com sucesso');
		} catch (error) {
			console.error('Erro no login:', error);
			message.error('Erro no login, verifique suas credenciais');
		}
	};
	
	return (
		<>
			<h2>Login administrador</h2>

            <Input 
				placeholder="Email" 
				value={email} 
				onChange={(e) => setEmail(e.target.value)} 
				className="mb-4" 
			/>

            <Input.Password 
				placeholder="Senha" 
				value={password} 
				onChange={(e) => setPassword(e.target.value)}
				className="mb-4" 
			/>

            <Button type="primary" onClick={handleLoginAdmin}>Login</Button>
		</>
	)
}