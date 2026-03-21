import React from "react";
import { motion } from "framer-motion";
import { FiShield, FiFileText, FiLock } from "react-icons/fi";

const Terms = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full space-y-8"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-600/30">
                        <FiShield className="text-red-600 text-3xl" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Terms of Service</h1>
                    <p className="text-gray-500 font-medium">Last updated: March 13, 2026</p>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-12 space-y-10 leading-relaxed text-gray-300 backdrop-blur-sm">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FiFileText className="text-red-500" /> 1. Introduction
                        </h2>
                        <p>
                            Welcome to CineVerse. By accessing our website, you agree to be bound by these Terms and Conditions. Our platform provides a way to explore, track, and manage your movie and TV show library using data from TMDB.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FiLock className="text-red-500" /> 2. User Accounts
                        </h2>
                        <p>
                            When you create an account, you must provide us with information that is accurate. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FiShield className="text-red-500" /> 3. Data Privacy
                        </h2>
                        <p>
                            Your privacy is important to us. We use Supabase for authentication and profile management. We do not sell your personal data to third parties. For more details, refer to our Privacy Policy.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-white/5 text-sm text-gray-500 italic">
                        Note: This is a demonstration project. Actual legal terms would be much longer and more boring.
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default Terms;
