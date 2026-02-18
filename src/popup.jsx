import React, { useState, useEffect } from "react";
import {
  saveToStorage,
  getFromStorage,
} from "./controllers/storageController.js";
import { createRoot } from "react-dom/client";
import "./index.css";

// Icons as components for cleaner code
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

function Popup() {
  const [accounts, setAccounts] = useState([]);
  const [view, setView] = useState("list"); // 'list', 'form'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ label: "", loginId: "", pin: "" });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getFromStorage(["accounts"]).then((res) => {
      setAccounts(res.accounts || []);
    });
  }, []);

  const handleSave = () => {
    if (!formData.loginId || !formData.pin) {
      return;
    }
    let newAccounts;
    if (editingId) {
      newAccounts = accounts.map((acc) =>
        acc.id === editingId ? { ...formData, id: editingId } : acc
      );
    } else {
      newAccounts = [...accounts, { ...formData, id: Date.now().toString() }];
    }
    setAccounts(newAccounts);
    saveToStorage({ accounts: newAccounts });
    setView("list");
    setFormData({ label: "", loginId: "", pin: "" });
    setEditingId(null);
  };

  const handleEdit = (acc) => {
    setFormData(acc);
    setEditingId(acc.id);
    setView("form");
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const newAccounts = accounts.filter((a) => a.id !== deleteId);
      setAccounts(newAccounts);
      saveToStorage({ accounts: newAccounts });
      setDeleteId(null);
    }
  };

  const handleStart = async (acc) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab) {
      if (tab.url && tab.url.includes("auth.hiring.amazon.com")) {
        chrome.tabs.sendMessage(tab.id, { action: "START_LOGIN", data: acc }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Message error:", chrome.runtime.lastError);
            alert("Could not communicate with the page. Try refreshing the Amazon tab.");
          } else {
            console.log("Login started");
          }
        });
      } else {
        saveToStorage({ pendingLogin: acc }).then(() => {
          chrome.tabs.update(tab.id, { url: "https://auth.hiring.amazon.com/#/login" });
        });
      }
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 font-sans relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-6 pb-4 relative z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
            Login<span className="text-blue-600">Assistant</span>
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Amazon Hiring Automation</p>
        </div>
        {view === "list" && (
          <button
            onClick={() => {
              setView("form");
              setFormData({ label: "", loginId: "", pin: "" });
              setEditingId(null);
            }}
            className="group bg-white hover:bg-blue-600 border border-slate-200 hover:border-blue-600 text-slate-600 hover:text-white rounded-xl p-2 shadow-sm hover:shadow-md hover:shadow-blue-200 transition-all duration-300 active:scale-95"
            title="Add Account"
          >
            <PlusIcon />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 relative z-10 scrollbar-none">

        {view === "list" ? (
          <div className="space-y-4 pt-2">
            {accounts.length === 0 && (
              <div className="flex flex-col items-center justify-center pt-16 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-400">
                  <PlusIcon />
                </div>
                <p className="text-slate-900 font-medium text-sm">No accounts yet</p>
                <p className="text-slate-400 text-xs mt-1 text-center max-w-[200px]">
                  Add your Amazon credentials to get started with one-click login.
                </p>
              </div>
            )}

            {accounts.map((acc, index) => (
              <div
                key={acc.id}
                className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card Gradient Border Idea - Optional, using simplified left border */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-2xl"></div>

                <div className="flex justify-between items-start mb-3 pl-2">
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 text-sm truncate pr-2">
                      {acc.label || "Amazon Account"}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <p className="text-xs text-slate-500 truncate font-medium">
                        {acc.loginId}
                      </p>
                    </div>
                  </div>

                  {/* Actions - Always visible now */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(acc)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleStart(acc)}
                  className="w-full bg-slate-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-white font-medium text-xs py-2.5 rounded-xl shadow-sm hover:shadow-blue-500/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                >
                  <span className="font-semibold">Start Login</span>
                  <span className="group-hover/btn:translate-x-0.5 transition-transform duration-200">
                    <PlayIcon />
                  </span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Form View */
          <div className="pt-2 animate-[slideUp_0.3s_ease-out]">
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)] border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                {editingId ? "Edit Account" : "New Account"}
                <div className="h-px bg-slate-100 flex-1 ml-2"></div>
              </h2>

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 group-focus-within:text-blue-600 transition-colors">
                    Label (Optional)
                  </label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    placeholder="e.g. Work Account"
                    autoFocus
                  />
                </div>

                <div className="group">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 group-focus-within:text-blue-600 transition-colors">
                    Login ID / Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700"
                    value={formData.loginId}
                    onChange={(e) =>
                      setFormData({ ...formData, loginId: e.target.value })
                    }
                    placeholder="name@example.com"
                  />
                </div>

                <div className="group">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 group-focus-within:text-blue-600 transition-colors">
                    PIN <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-mono tracking-widest"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    placeholder="••••••"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-2">
                <button
                  onClick={() => setView("list")}
                  className="flex-1 text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  disabled={!formData.loginId || !formData.pin}
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Status Bar - Optional */}
      <div className="py-3 text-center border-t border-slate-100 bg-white/50 backdrop-blur-sm z-10">
        <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">
          Amazon Login Automation
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[85%] max-w-[300px] transform scale-100 animate-[scaleIn_0.2s_ease-out] border border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg mb-2 text-center">Delete Account?</h3>
            <p className="text-slate-500 text-xs mb-6 text-center leading-relaxed">
              Are you sure you want to remove this account? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("react-target"));
root.render(<Popup />);
