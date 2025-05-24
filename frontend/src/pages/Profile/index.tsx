import { useEffect, useState } from "react";
import { FiMail, FiLock, FiRefreshCcw } from "react-icons/fi";
import { MdModeEdit, MdCancel } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import Swal from "sweetalert2";
import Footer from "../Footer/index";
import Menu from "../../components/Menu";
import { useNavigate } from "react-router-dom";
import { useUser, User } from "../../contexts/UserContext";
import { updateUser } from "../../services/userService";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("********");
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState(password);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");

  const navigate = useNavigate();

  const { user, setUser } = useUser();

  useEffect
    (() => {
      if (user) {
        setName(user?.nome || "");
        setEmail(user?.email || "");
        setProfileImage(`http://localhost:8000${user?.foto_perfil}`);
      }
    }, [user]);

  const handleLogout = async () => {
    Swal.fire({
      title: "Deseja mesmo sair da conta ?",
      icon: "warning",
      width: "90%",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#808080",
      confirmButtonText: "Sair",
      cancelButtonText: "Cancelar",
      backdrop: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await Swal.fire({
          title: "Logout efetuado!",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }
      localStorage.removeItem("token");
      navigate("/");
    });
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Deseja mesmo excluir sua conta ?",
      text: "Essa ação não poderá ser desfeita.",
      icon: "warning",
      width: "90%",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#808080",
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      backdrop: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await Swal.fire({
          title: "Excluído!",
          text: "A conta foi excluída.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }

      // TODO: Adicionar lógica de exclusão no backend
    });
  };

  // const handleSaveChanges = async () => {
  //   setPassword(newPassword);
  //   setEditMode(false);
    
  //   await Swal.fire({
  //     title: "Alterações salvas!",
  //     icon: "success",
  //     width: "90%",
  //     backdrop: true,
  //     showConfirmButton: true,
  //     confirmButtonText: "OK",
  //   });
  // };

  const handleSaveChanges = async () => {
    try {
      const dadosAtualizados = {
        nome: name,
        endereco,
        telefone,
      };

      const data = await updateUser(dadosAtualizados);
      setUser(data.usuario); // atualiza o contexto com os novos dados
      setEditMode(false);

      await Swal.fire({
        title: "Alterações salvas!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      await Swal.fire({
        title: "Erro ao salvar",
        text: "Verifique os dados e tente novamente.",
        icon: "error",
      });
    }
  };

  const handleCancelEdit = async () => {
    setEditMode(false)
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const token = localStorage.getItem("token"); // ⬅️ pega o token salvo no login
        const response = await fetch("http://localhost:8000/upload/imagem", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ⬅️ envia o token no cabeçalho
          },
          body: formData,
        });
  
        if (!response.ok) throw new Error("Erro no upload da imagem");
  
        const data = await response.json();
  
        // Atualiza o User Context com o novo caminho da foto
        setUser({
          ...user,
          foto_perfil: data.url
        } as User);
  
        // Mostra no componente a nova imagem
        setProfileImage(`http://localhost:8000${data.url}`);
  
        Swal.fire({
          title: "Foto atualizada com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (err) {
        console.error("Erro ao fazer upload da imagem:", err);
        Swal.fire({
          title: "Erro ao salvar foto",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#2c64dd] text-white px-4 pt-20 pb-32 flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-center px-6 py-3 fixed top-1 left-0 bg-[#2c64dd] z-40">
        <Menu />
        <h2 className="text-white text-2xl font-bold flex items-center gap-2 ml-5" onClick={() => navigate("/home")}>
          Meu Perfil
        </h2>
        <img src="/logo.png" onClick={() => navigate("/home")} alt="Logo" className="h-10 ml-4" />
      </header>

      {/* Área da Foto de Perfil */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <img
            src={profileImage || "/loading.png"}
            alt="Foto de Perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
          />
          <label htmlFor="upload" className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l3 3 8-8m-6 5l-1.5 1.5m-6.5-6L5 8m3 5H6m6 6v-6" />
            </svg>
          </label>
          <input
            id="upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <p className="mt-2 text-sm text-white">Toque para alterar a foto</p>
      </div>


      {/* Formulário de perfil */}
      <div className="space-y-2">
        <div className="bg-transparent text-white pt-6 pl-6 pr-6 pb-3 rounded-lg shadow-none">
        <div className="mb-2">
          <label className="block text-sm text-white">Nome</label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 pr-10 bg-[#2c64dd] border-2 border-white rounded-lg text-white"
              placeholder="Digite seu nome"
              value={name}
              readOnly={!editMode}
              onChange={(e) => setName(e.target.value)}
            />
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
              onClick={editMode ? handleCancelEdit : () => setEditMode(true)}
            >
              {editMode ? <MdCancel /> : <MdModeEdit />}
            </span>
          </div>
        </div>

          {/* Email */}
          <div className="mb-2">
            <label className="block text-sm text-white">Email</label>
            <div className="relative">
              <input
                type="email"
                className="w-full p-2 pr-10 bg-[#2c64dd] border-2 border-white rounded-lg text-white"
                placeholder="Digite seu email"
                value={email}
                readOnly={!editMode}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                onClick={editMode ? handleCancelEdit : () => setEditMode(true)}
              >
                {editMode ? <MdCancel /> : <MdModeEdit />}
              </span>
            </div>
          </div>

          {/* Endereço */}
          <div className="mb-2">
            <label className="block text-sm text-white">Endereço</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 pr-10 bg-[#2c64dd] border-2 border-white rounded-lg text-white"
                placeholder="Rua, número, bairro"
                value={endereco}
                readOnly={!editMode}
                onChange={(e) => setEndereco(e.target.value)}
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                onClick={editMode ? handleCancelEdit : () => setEditMode(true)}
              >
                {editMode ? <MdCancel /> : <MdModeEdit />}
              </span>
            </div>
          </div>

          
          {/* Telefone */}
          <div className="mb-1">
            <label className="block text-sm text-white">Telefone</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 pr-10 bg-[#2c64dd] border-2 border-white rounded-lg text-white"
                placeholder="(xx) xxxxx-xxxx"
                value={telefone}
                readOnly={!editMode}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                onClick={editMode ? handleCancelEdit : () => setEditMode(true)}
              >
                {editMode ? <MdCancel /> : <MdModeEdit />}
              </span>
            </div>
          </div>
        </div>
      </div>

      {editMode && (
        <div className="flex justify-center">
          <button
            onClick={handleSaveChanges}
            className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-500"
          >
            Salvar
          </button>
        </div>
      )}

      {/* Rodapé fixo */}
      <div className="fixed bottom-2 left-0 w-full bg-[#2c64dd] px-4 py-4">
        <button
          className="block w-[75%] mx-auto py-2 px-4 bg-white text-blue-600 rounded-lg hover:bg-red-500 font-bold mb-6"
          onClick={handleLogout}
        >
          <IoMdExit className="inline-block mr-2" />
          Sair
        </button>
        <div className="text-center mt-3">
          <a
            href="#"
            className="text-white hover:underline"
            onClick={handleDeleteAccount}
          >
            Deseja excluir sua conta? <span className="underline text-gray-300">Clique aqui.</span>
          </a>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Profile;
