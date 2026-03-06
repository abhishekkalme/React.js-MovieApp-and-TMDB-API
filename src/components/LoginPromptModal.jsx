import React, { useContext, useState, useEffect } from "react";
import { FiX, FiLock, FiUser } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

const LoginPromptModal = () => {
  const {
    isLoginPromptOpen,
    loginPromptMessage,
    dismissLoginPrompt,
    loginAndContinue
  } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoginPromptOpen) return;
    setUsername("");
    setPassword("");
    setError("");
  }, [isLoginPromptOpen]);

  if (!isLoginPromptOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Enter username and password.");
      return;
    }

    setError("");
    loginAndContinue(trimmedUsername, trimmedPassword);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={dismissLoginPrompt}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Close login popup"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-white text-xl font-semibold mb-2">Login Required</h2>
        <p className="text-gray-400 text-sm mb-5">{loginPromptMessage}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="text-xs text-gray-400 mb-1 block">Username</span>
            <div className="flex items-center gap-2 bg-zinc-800 border border-white/10 rounded-lg px-3">
              <FiUser className="text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-white py-2.5 outline-none"
                placeholder="Enter username"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs text-gray-400 mb-1 block">Password</span>
            <div className="flex items-center gap-2 bg-zinc-800 border border-white/10 rounded-lg px-3">
              <FiLock className="text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white py-2.5 outline-none"
                placeholder="Enter password"
              />
            </div>
          </label>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-semibold transition"
          >
            Login & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPromptModal;
