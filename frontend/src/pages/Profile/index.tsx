import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdModeEdit, MdCancel } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import Swal from "sweetalert2";
import { IMaskInput } from "react-imask";

import Menu from "../../components/Menu";
import { useUser } from "../../contexts/useUser";
import { User } from "../../contexts/UserContext";
import {
  changePassword,
  deleteUser,
  updateUser,
  uploadUserPhoto,
} from "../../services/userService";
import { fetchImageAsObjectUrl } from "../../services/utils";
import { useEffect, useRef } from "react";

const Profile = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();

  const [name, setName] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const apiBase = import.meta.env.VITE_API_URL ?? "";
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const profileImageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.foto_perfil) return;
    fetchImageAsObjectUrl(apiBase, user.foto_perfil).then((url) => {
      if (profileImageRef.current) URL.revokeObjectURL(profileImageRef.current);
      profileImageRef.current = url;
      setProfileImage(url);
    });
    return () => {
      if (profileImageRef.current) URL.revokeObjectURL(profileImageRef.current);
    };
  }, [user?.foto_perfil, apiBase]);
  const [endereco, setEndereco] = useState(user?.endereco || "");
  const [telefone, setTelefone] = useState(user?.telefone || "");

  const handleLogout = async () => {
    Swal.fire({
      title: "Deseja mesmo sair da conta?",
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth");
      }
    });
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Deseja mesmo excluir sua conta?",
      text: "Essa ação não poderá ser desfeita.",
      icon: "warning",
      width: "90%",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#808080",
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      backdrop: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteUser();

        await Swal.fire({
          title: "Conta excluída!",
          text: "Sua conta foi excluída com sucesso.",
          icon: "success",
          confirmButtonText: "OK",
        });

        localStorage.removeItem("token");
        localStorage.removeItem("user"); // se estiver usando o localStorage
        navigate("/");
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        await Swal.fire({
          title: "Erro ao excluir conta",
          text: "Tente novamente mais tarde.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

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
    setEditMode(false);
  };

  const handleChangePassword = async () => {
    if (novaSenha !== confirmaSenha) {
      await Swal.fire({
        title: "Senhas não coincidem",
        text: "A nova senha e a confirmação devem ser iguais.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      await changePassword(senhaAtual, novaSenha);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmaSenha("");
      setPasswordMode(false);
      await Swal.fire({
        title: "Senha alterada com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      const detail = (error as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      await Swal.fire({
        title: "Erro ao alterar senha",
        text:
          detail === "Senha atual incorreta"
            ? "Senha atual incorreta."
            : "Tente novamente mais tarde.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const data = await uploadUserPhoto(formData);

        // Atualiza o User Context com o novo caminho da foto
        setUser({
          ...user,
          foto_perfil: data.url,
        } as User);

        // Mostra no componente a nova imagem
        const objUrl = await fetchImageAsObjectUrl(apiBase, data.url);
        if (profileImageRef.current)
          URL.revokeObjectURL(profileImageRef.current);
        profileImageRef.current = objUrl;
        setProfileImage(objUrl);

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
        <h2
          className="text-white text-2xl font-bold flex items-center gap-2 ml-5"
          onClick={() => navigate("/home")}
        >
          Meu Perfil
        </h2>
        <img
          src="/logo.png"
          onClick={() => navigate("/home")}
          alt="Logo"
          className="h-10 ml-4"
        />
      </header>

      {/* Área da Foto de Perfil */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <img
            src={profileImage || "/icon.png"}
            alt="Foto de Perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
          />
          <label
            htmlFor="upload"
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13l3 3 8-8m-6 5l-1.5 1.5m-6.5-6L5 8m3 5H6m6 6v-6"
              />
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
      <div className="flex-1 overflow-y-auto max-h-185">
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
                  onClick={
                    editMode ? handleCancelEdit : () => setEditMode(true)
                  }
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
                  onClick={
                    editMode ? handleCancelEdit : () => setEditMode(true)
                  }
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
                  onClick={
                    editMode ? handleCancelEdit : () => setEditMode(true)
                  }
                >
                  {editMode ? <MdCancel /> : <MdModeEdit />}
                </span>
              </div>
            </div>

            {/* Telefone */}
            <div className="mb-1">
              <label className="block text-sm text-white">Telefone</label>
              <div className="relative">
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={telefone}
                  unmask={false}
                  disabled={!editMode}
                  onAccept={(value) => setTelefone(value)}
                  className="w-full p-2 pr-10 bg-[#2c64dd] border-2 border-white rounded-lg text-white"
                  placeholder="(xx) xxxxx-xxxx"
                />
                <span
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                  onClick={
                    editMode ? handleCancelEdit : () => setEditMode(true)
                  }
                >
                  {editMode ? <MdCancel /> : <MdModeEdit />}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editMode && (
        <div className="flex justify-center mt-5">
          <button
            onClick={handleSaveChanges}
            className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-500 mr-4"
          >
            Salvar
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-red-700 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-500"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Alterar Senha */}
      {!editMode && (
        <div className="bg-transparent text-white px-6 pb-4">
          {!passwordMode ? (
            <button
              onClick={() => setPasswordMode(true)}
              className="w-full py-2 px-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Alterar senha
            </button>
          ) : (
            <div className="space-y-3">
              <h3 className="text-white font-bold text-center">
                Alterar senha
              </h3>
              <input
                type="password"
                className="w-full p-2 bg-[#2c64dd] border-2 border-white rounded-lg text-white placeholder-blue-200"
                placeholder="Senha atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
              <input
                type="password"
                className="w-full p-2 bg-[#2c64dd] border-2 border-white rounded-lg text-white placeholder-blue-200"
                placeholder="Nova senha (mínimo 8 caracteres)"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <input
                type="password"
                className="w-full p-2 bg-[#2c64dd] border-2 border-white rounded-lg text-white placeholder-blue-200"
                placeholder="Confirmar nova senha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setPasswordMode(false);
                    setSenhaAtual("");
                    setNovaSenha("");
                    setConfirmaSenha("");
                  }}
                  className="flex-1 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!editMode && (
        <div className="fixed bottom-0 left-0 w-full bg-[#2c64dd] px-4 py-4 z-30">
          <button
            className="block w-[75%] mx-auto py-2 px-4 bg-white text-blue-600 rounded-lg hover:bg-red-500 font-bold mb-3"
            onClick={handleLogout}
          >
            <IoMdExit className="inline-block mr-2" />
            Sair
          </button>
          <div className="text-center">
            <a
              href="#"
              className="text-white hover:underline"
              onClick={handleDeleteAccount}
            >
              Deseja excluir sua conta?{" "}
              <span className="underline text-gray-300">Clique aqui.</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
