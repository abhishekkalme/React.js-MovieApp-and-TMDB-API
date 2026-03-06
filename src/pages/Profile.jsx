import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { SavedContext } from "../context/SavedContext";
import MovieCard from "../components/MovieCard";
import { PRESET_AVATARS, MESSAGES } from "../constants";
import { Link } from "react-router-dom";
import { FiEdit3, FiGlobe, FiGrid, FiSettings, FiCheck } from "react-icons/fi";

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { savedItems } = useContext(SavedContext);

  const [activeTab, setActiveTab] = useState("mylist");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.username || "Explorer");
  const [editAvatar, setEditAvatar] = useState(user?.avatar || "");

  const handleSaveProfile = () => {
    updateProfile({ username: editName, avatar: editAvatar });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 md:px-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full"
      >

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 bg-zinc-900/40 p-8 rounded-2xl border border-white/5">
          <div className="relative group">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-2xl border-4 border-zinc-800" />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-red-600 to-red-900 flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-zinc-900">
                {user.username ? user.username.charAt(0).toUpperCase() : "E"}
              </div>
            )}
            <button onClick={() => setIsEditing(!isEditing)} className="absolute bottom-0 right-0 bg-red-600 w-10 h-10 rounded-full flex items-center justify-center border-4 border-black text-xs font-bold hover:bg-white hover:text-red-600 transition shadow-lg">
              <FiEdit3 size={16} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="flex flex-col gap-5 mt-2 max-w-lg mx-auto md:mx-0">
                <div className="space-y-2">
                  <p className="text-xs uppercase font-black tracking-widest text-gray-500 mb-2">Cool Avatars</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AVATARS.map(avatar => (
                      <button
                        key={avatar.id}
                        onClick={() => setEditAvatar(avatar.url)}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${editAvatar === avatar.url ? "border-red-600 scale-110 shadow-lg shadow-red-600/20" : "border-white/5 hover:border-white/20"}`}
                      >
                        <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                        {editAvatar === avatar.url && (
                          <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                            <FiCheck className="text-white" size={20} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-500 px-1">Display Name</p>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Username"
                      className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition shadow-inner text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-500 px-1">Custom Avatar URL</p>
                    <input
                      type="text"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="Custom Image URL"
                      className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition shadow-inner text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button onClick={handleSaveProfile} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-black transition text-sm flex-1 shadow-lg shadow-red-600/20">Save Changes</button>
                  <button onClick={() => setIsEditing(false)} className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-2xl font-black transition text-sm flex-1 border border-white/5">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold">{user.username || "Explorer"}</h1>
                <p className="text-gray-400 mt-2">Premium Member • Joined {new Date(user.loggedInAt || Date.now()).getFullYear()}</p>
              </>
            )}
          </div>
        </div>


        <div className="border-b border-white/5 mb-8 flex space-x-10">
          <button
            onClick={() => setActiveTab("mylist")}
            className={`font-black uppercase tracking-widest text-xs pb-4 transition flex items-center gap-2 ${activeTab === "mylist" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500 hover:text-white"}`}
          >
            <FiGrid /> My WatchList ({savedItems.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`font-black uppercase tracking-widest text-xs pb-4 transition flex items-center gap-2 ${activeTab === "settings" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500 hover:text-white"}`}
          >
            <FiSettings /> Settings
          </button>
        </div>


        {activeTab === "mylist" && (
          <div>
            {savedItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {savedItems.map((item) => (
                  <MovieCard key={item.id} movie={item} type={item.media_type || (item.title ? "movie" : "tv")} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-6">
                  <FiGlobe size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Feeling adventurous?</h3>
                <p className="text-gray-500 text-sm max-w-xs mb-8">{MESSAGES.WATCHLIST_EMPTY}</p>
                <Link
                  to="/search"
                  className="flex items-center gap-2 bg-red-600/10 text-red-500 px-8 py-3.5 rounded-2xl font-black border border-red-600/30 hover:bg-red-600 hover:text-white transition-all hover:scale-105"
                >
                  Explore New Titles
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-zinc-900/40 p-8 rounded-xl border border-white/5 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white bg-zinc-800 px-4 py-3 rounded-lg border border-white/5">user@cineverse.app</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Plan</p>
                <p className="text-white bg-zinc-800 px-4 py-3 rounded-lg border border-white/5 flex justify-between items-center">
                  Cineverse Premium
                  <span className="text-xs bg-red-600 px-2 py-1 rounded text-white font-bold tracking-wide">ACTIVE</span>
                </p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <button className="text-gray-400 hover:text-white transition text-sm">Reset Password</button>
                <br />
                <button className="text-red-500 hover:text-red-400 transition text-sm mt-4">Delete Account</button>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default Profile;
