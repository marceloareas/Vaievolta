import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../Login";
import Register from "../Register";

const AuthScreen = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#2c64dd]">
      <AnimatePresence mode="wait">
        {!showRegister && (
          <motion.div
            key="login"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10"
          >
            <Login onShowRegister={() => setShowRegister(true)} />
          </motion.div>
        )}

        {showRegister && (
          <motion.div
            key="register"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20"
          >
            <Register onBack={() => setShowRegister(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthScreen;
