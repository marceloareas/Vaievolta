import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/riodejaneiro.jpg';
// import { EyeOutline, EyeOffOutline } from 'react-ionicons';
import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword || !cargo) {
        Swal.fire({
          title: 'Campos obrigatórios!',
          text: 'Por favor, preencha todos os campos.',
          icon: 'warning',
        });
        return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      await api.post('/register', { username, password, cargo });

      Swal.fire({
        title: 'Sucesso!',
        text: 'Usuário registrado com sucesso!',
        icon: 'success',
        confirmButtonText: 'Ir para login',
      });

      navigate('/');
    } catch (error: any) {
        Swal.fire({
            title: 'Erro!',
            text: error?.response?.data?.detail || 'Erro ao registrar usuário.',
            icon: 'error',
        });
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${logo})` }}
    >
      <div className="bg-white/20 backdrop-blur-sm rounded-lg shadow-lg p-8 flex flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-semibold text-white">Registro de Usuário</h2>

        <input
          type="text"
          placeholder="Login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-lg w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-white text-white" 
        />

        <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="px-4 py-2 rounded-lg w-64 border border-gray-300 bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
            <option value="" disabled hidden className="text-gray-400 bg-gray-800">Selecione o cargo</option>
            <option value="admin" className="text-black">Admin</option>
            <option value="analista" className="text-black">Analista</option>
            <option value="colaborador" className="text-black">Colaborador</option>
        </select>

        <div className="relative w-64">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                className="px-4 py-2 pr-10 rounded-lg w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-white text-white bg-transparent"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
            >
                
            </button>
        </div>

        <div className="relative w-64">
            <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                className="px-4 py-2 pr-10 rounded-lg w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-white text-white bg-transparent"
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
            >
                {/* {showConfirmPassword ? (
                <EyeOffOutline color={"#fff"} width="20px" height="20px" />
                ) : (
                <EyeOutline color={"#fff"} width="20px" height="20px" />
                )} */}
            </button>
        </div>

        {error && (
          <p className="text-red-300 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleRegister}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md"
        >
          Cadastrar
        </button>
      </div>

      <footer className="absolute bottom-4">
        <div className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg shadow-sm">
          © Desenvolvido por <strong>CTEC</strong>
        </div>
      </footer>
    </div>
  );
};

export default Register;
