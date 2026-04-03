import React, { useContext, useState, useEffect } from "react";
import { FiX, FiLock, FiMail, FiUser, FiCheckCircle, FiShield } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const LoginPromptModal = () => {
  const {
    isLoginPromptOpen,
    loginPromptMessage,
    dismissLoginPrompt,
    signIn,
    signUp,
    signInWithGoogle,
    loginAndContinue,
    isLimitReached,
    limitType
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (isLoginPromptOpen || isLimitReached) return;
    setEmail("");
    setUsername("");
    setPassword("");
    setError("");
    setIsSignUp(false);
    setSignupSuccess(false);
    setAcceptedTerms(false);
  }, [isLoginPromptOpen, isLimitReached]);

  if (!isLoginPromptOpen && !isLimitReached) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedUsername = username.trim();

    if (!trimmedEmail || !trimmedPassword || (isSignUp && !trimmedUsername)) {
      setError("Please fill in all fields.");
      return;
    }

    if (isSignUp && !acceptedTerms) {
      setError("You must accept the Terms & Conditions.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      if (isSignUp) {
        await signUp(trimmedEmail, trimmedPassword, { username: trimmedUsername });
        setSignupSuccess(true);
      } else {
        await loginAndContinue(trimmedEmail, trimmedPassword);
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Google login failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
      >
        <button
          onClick={dismissLoginPrompt}
          className="absolute top-5 right-5 z-10 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
          aria-label="Close login popup"
        >
          <FiX size={18} />
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {signupSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                  <FiCheckCircle className="text-green-500 text-4xl" />
                </div>
                <h2 className="text-2xl font-black text-white mb-4">Welcome Aboard!</h2>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Signup successful! Please check your email to verify your account before logging in.
                </p>
                <button
                  onClick={() => setIsSignUp(false) || setSignupSuccess(false)}
                  className="mt-8 w-full bg-white text-black font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform active:scale-95"
                >
                  Continue to Login
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                    {isLimitReached ? "Limit Reached" : isSignUp ? "Join CineVerse" : "Welcome Back"}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">
                    {isLimitReached
                      ? `You've watched your 2 free ${limitType === "movie" ? "movies" : "episodes"}. Create an account to unlock everything!`
                      : isSignUp ? "Start your cinematic journey today." : loginPromptMessage}
                  </p>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black rounded-2xl py-3.5 font-bold transition-all mb-6 shadow-lg shadow-white/5 active:scale-95"
                >
                  <FcGoogle size={22} />
                  Continue with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">or email</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Email</span>
                    <div className="flex items-center gap-3 bg-zinc-800/50 border border-white/5 focus-within:border-red-600/50 rounded-2xl px-4 py-1 transition-all">
                      <FiMail className="text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent text-white py-3 outline-none text-sm placeholder:text-gray-700 font-medium"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Username</span>
                      <div className="flex items-center gap-3 bg-zinc-800/50 border border-white/5 focus-within:border-red-600/50 rounded-2xl px-4 py-1 transition-all">
                        <FiUser className="text-gray-500" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-transparent text-white py-3 outline-none text-sm placeholder:text-gray-700 font-medium"
                          placeholder="movie_buff_99"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Password</span>
                    <div className="flex items-center gap-3 bg-zinc-800/50 border border-white/5 focus-within:border-red-600/50 rounded-2xl px-4 py-1 transition-all">
                      <FiLock className="text-gray-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent text-white py-3 outline-none text-sm placeholder:text-gray-700 font-medium"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="flex items-start gap-3 py-2 px-1">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="w-4 h-4 rounded border-white/10 bg-zinc-800 text-red-600 focus:ring-red-600 focus:ring-offset-zinc-900"
                        />
                      </div>
                      <label htmlFor="terms" className="text-xs text-gray-500 leading-normal font-medium">
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          onClick={dismissLoginPrompt}
                          className="text-white hover:text-red-500 underline decoration-gray-700"
                        >
                          Terms & Conditions
                        </Link>
                        {" "}and acknowledge the risks of movie addiction.
                      </label>
                    </div>
                  )}

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-[10px] font-black uppercase tracking-wider px-1 text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (isSignUp && !acceptedTerms)}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-gray-600 text-white rounded-2xl py-4 font-black transition-all shadow-lg shadow-red-600/10 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isSignUp ? "Create Account" : "Login & Continue"}
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-white/5 space-y-4">
                  <p className="text-gray-500 text-xs font-medium">
                    {isSignUp ? "Already have an account?" : "New to CineVerse?"}{" "}
                    <button
                      onClick={() => setIsSignUp(!isSignUp) || setError("")}
                      className="text-white font-black hover:text-red-500 transition-colors ml-1"
                    >
                      {isSignUp ? "Log In" : "Sign Up"}
                    </button>
                  </p>

                  {isLimitReached && (
                    <button
                      onClick={() => {
                        dismissLoginPrompt();
                        navigate("/");
                      }}
                      className="w-full text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors py-2"
                    >
                      Wait, take me back Home
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
export default LoginPromptModal;
