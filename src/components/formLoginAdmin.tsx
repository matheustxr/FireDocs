import { FormEvent, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Input, message } from 'antd';

export default function FormLoginAdmin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLoginAdmin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      sessionStorage.setItem("userLogged", "true");

      message.success('Login realizado com sucesso');

      window.location.reload();
    } catch (error) {
      console.error('Erro no login:', error);

      message.error('Erro no login, verifique suas credenciais');
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleLoginAdmin();
  };
	
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login administrador</h2>

      <Input 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="mb-4" 
        required
      />

      <Input.Password 
        placeholder="Senha" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4" 
        required
      />

      <button 
        type="submit"
        onClick={handleLoginAdmin}
        className='px-3 py-1 text-base bg-[#1677ff] text-white transition-all rounded'
      >
				Login
      </button>
    </form>
  );
}
