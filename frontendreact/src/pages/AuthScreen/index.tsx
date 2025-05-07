import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../Login";
import Register from "../Register";
import ForgotPassword from "../ForgotPassword";

const AuthScreen = () => {
  const [telaAtiva, setTelaAtiva] = useState<"login" | "register" | "forgot">("login");

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#2c64dd]">
      <AnimatePresence mode="wait">
        {telaAtiva === "login" && (
          <motion.div
            key="login"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10"
          >
            <Login onShowRegister={() => setTelaAtiva("register")} onShowForgotPassword={() => setTelaAtiva("forgot")} />
          </motion.div>
        )}

        {telaAtiva === "register" && (
          <motion.div
            key="register"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20"
          >
            <Register onBack={() => setTelaAtiva("login")} />
          </motion.div>
        )}

        {telaAtiva === "forgot" && (
          <motion.div
            key="register"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20"
          >
            <ForgotPassword onBack={() => setTelaAtiva("login")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthScreen;
