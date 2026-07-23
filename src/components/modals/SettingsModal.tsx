import React, { useState } from "react";
import { toast } from "react-toastify";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [graphicsQuality, setGraphicsQuality] = useState<"Low" | "High" | "Cyber Ultra">("Cyber Ultra");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0a0f1d] border border-[#00ff7b]/40 rounded-[28px] p-6 text-[#f0eeff] shadow-[0_0_50px_rgba(0,255,123,0.25)] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#00e5ff] animate-ping"></div>
            <h3 className="text-xl font-black uppercase tracking-tight cyan-glow">Cyber Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00ff7b]/20 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Toggles List */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center bg-[#070510] p-3.5 rounded-2xl border border-white/10">
            <div>
              <p className="font-bold text-xs text-white">Audio FX & Sound</p>
              <p className="text-[10px] text-gray-400">Play futuristic tap audio feedback</p>
            </div>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast.success(`Sound FX: ${!soundEnabled ? "Enabled" : "Disabled"}`);
              }}
              className={`w-12 h-7 rounded-full p-1 transition-all ${
                soundEnabled ? "bg-[#00ff7b]" : "bg-gray-700"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-black transition-all transform ${soundEnabled ? "translate-x-5" : ""}`}></div>
            </button>
          </div>

          <div className="flex justify-between items-center bg-[#070510] p-3.5 rounded-2xl border border-white/10">
            <div>
              <p className="font-bold text-xs text-white">Haptic Vibration</p>
              <p className="text-[10px] text-gray-400">Vibrate device on quantum tap strike</p>
            </div>
            <button
              onClick={() => {
                setHapticsEnabled(!hapticsEnabled);
                toast.success(`Haptics: ${!hapticsEnabled ? "Enabled" : "Disabled"}`);
              }}
              className={`w-12 h-7 rounded-full p-1 transition-all ${
                hapticsEnabled ? "bg-[#00ff7b]" : "bg-gray-700"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-black transition-all transform ${hapticsEnabled ? "translate-x-5" : ""}`}></div>
            </button>
          </div>

          <div className="bg-[#070510] p-3.5 rounded-2xl border border-white/10">
            <p className="font-bold text-xs text-white mb-1">Graphics VFX Mode</p>
            <p className="text-[10px] text-gray-400 mb-2">Adjust particle aura rendering quality</p>
            <div className="grid grid-cols-3 gap-2">
              {(["Low", "High", "Cyber Ultra"] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setGraphicsQuality(q)}
                  className={`py-1.5 rounded-xl text-[11px] font-black transition-all ${
                    graphicsQuality === q
                      ? "bg-[#00e5ff] text-black shadow-[0_0_12px_#00e5ff]"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#070510] p-4 rounded-2xl border border-[#00ff7b]/30 mb-4 space-y-2 text-xs">
          <p className="font-black text-[#00ff7b] uppercase flex items-center space-x-1.5">
            <span>📖</span> <span>DETAILED SETTINGS PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1.5 text-[11px] list-disc list-inside">
            <li>Configure <strong>Audio FX</strong> and <strong>Haptics</strong> for tactile gaming feedback.</li>
            <li>Select <strong>Cyber Ultra</strong> mode for full particle aura visual effects.</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#00ff7b] text-black font-black text-sm uppercase tracking-wider shadow-[0_0_20px_#00ff7b] hover:bg-[#31ff00] transition-all"
        >
          Save & Apply Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
