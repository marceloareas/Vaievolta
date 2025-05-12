import { useState } from "react";
import { FiMail, FiLock, FiRefreshCcw } from "react-icons/fi";
import { IoMdExit } from "react-icons/io";
import Footer from "../Footer/index";
import Menu from "../../components/Menu";

const Profile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("jh.terencio@gmail.com");
  const [password, setPassword] = useState("********");
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState(password);

  const handleLogout = () => {
    // Aqui pode ser chamada a função para fazer logout do usuário
    alert("Você foi desconectado");
  };

  const handleDeleteAccount = () => {
    // Função para deletar a conta
    alert("Conta excluída");
  };

  const handleSaveChanges = () => {
    // Função para salvar as alterações
    setPassword(newPassword); // Salva a nova senha
    setEditMode(false);
    alert("Alterações salvas");
  };

  return (
    <div className="min-h-screen bg-[#2c64dd] text-white px-4 pt-28 pb-6 flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-center px-6 py-3 fixed top-1 left- bg-[#2c64dd] z-40">
        <Menu />
        <h2 className="text-white text-2xl font-bold flex items-center gap-2 ml-5">
          Meu Perfil
        </h2>
        <img src="/logo.png" alt="Logo" className="h-10 ml-4" />
      </header>

      {/* Formulário de perfil */}
      <div className="mt-20 space-y-6">
        <div className="bg-transparent text-white p-6 rounded-lg shadow-none">
          <div className="mb-4">
            <label className="block text-sm text-white">Nome</label>
            <div className="flex items-center justify-between">
              <input
                type="text"
                className="flex-1 p-2 bg-[#2c64dd] border-2 border-white rounded-lg text-white" // Borda mais grossa
                value={name}
                readOnly={!editMode}
                onChange={(e) => setName(e.target.value)}
              />
              {editMode ? (
                <FiRefreshCcw className="cursor-pointer text-white ml-2" onClick={handleSaveChanges} /> // Espaçamento entre ícone e borda
              ) : (
                <FiMail className="cursor-pointer text-white ml-2" onClick={() => setEditMode(true)} /> // Espaçamento entre ícone e borda
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-white">Email</label>
            <div className="flex items-center justify-between">
              <input
                type="email"
                className="flex-1 p-2 bg-[#2c64dd] border-2 border-white rounded-lg text-white" // Borda mais grossa
                value={email}
                readOnly={!editMode}
                onChange={(e) => setEmail(e.target.value)}
              />
              {editMode ? (
                <FiRefreshCcw className="cursor-pointer text-white ml-2" onClick={handleSaveChanges} /> // Espaçamento entre ícone e borda
              ) : (
                <FiMail className="cursor-pointer text-white ml-2" onClick={() => setEditMode(true)} /> // Espaçamento entre ícone e borda
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-white">Senha</label>
            <div className="flex items-center justify-between">
              <input
                type="password"
                className="flex-1 p-2 bg-[#2c64dd] border-2 border-white rounded-lg text-white" // Borda mais grossa
                value={newPassword}
                readOnly={!editMode}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {editMode ? (
                <FiRefreshCcw className="cursor-pointer text-white ml-2" onClick={handleSaveChanges} /> // Espaçamento entre ícone e borda
              ) : (
                <FiLock className="cursor-pointer text-white ml-2" onClick={() => setEditMode(true)} /> // Espaçamento entre ícone e borda
              )}
            </div>
          </div>

          {/* Botão de logout */}
          <div className="mt-6">
            <button
              className="w-full py-2 px-4 bg-white text-blue-600 rounded-lg hover:bg-red-500"
              onClick={handleLogout}
            >
              <IoMdExit className="inline-block mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Texto para exclusão da conta fora da caixa */}
      <div className="text-center mt-6">
        <a
          href="#"
          className="text-white hover:underline"
          onClick={handleDeleteAccount}
        >
          Deseja excluir sua conta? Clique aqui.
        </a>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Profile;
