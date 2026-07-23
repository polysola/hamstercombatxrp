import React from "react";

export interface NotificationItem {
  id: string;
  type: "bot" | "launch" | "reward" | "cipher" | "combo";
  title: string;
  message: string;
  time: string;
  unread: boolean;
  actionText?: string;
  onAction?: () => void;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearAll: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a0f1d] border border-[#00ff7b]/40 rounded-[28px] p-5 text-[#f0eeff] shadow-[0_0_50px_rgba(0,255,123,0.25)] relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-bounce">🔔</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight neon-green-glow leading-none">Notifications Center</h3>
              <span className="text-[9px] text-[#00ff7b] font-black tracking-widest uppercase">REAL-TIME SYSTEM ALERTS</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00ff7b]/20 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Clear All Action Bar */}
        {notifications.length > 0 && (
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-[10px] text-gray-400 font-bold">
              Total Notifications ({notifications.length})
            </span>
            <button
              onClick={onClearAll}
              className="text-[10px] text-[#ff8800] hover:text-white font-black uppercase tracking-wider transition-all"
            >
              Clear All Alerts
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-2.5 mb-4 max-h-[50vh] overflow-y-auto pr-1">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all relative ${
                  item.unread
                    ? "bg-[#070510] border-[#00ff7b]/40 shadow-[0_0_15px_rgba(0,255,123,0.15)]"
                    : "bg-[#070510]/60 border-white/5 opacity-80"
                }`}
              >
                {item.unread && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00ff7b] animate-ping"></div>
                )}

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0 text-xl">
                    {item.type === "bot" ? "🤖" : item.type === "launch" ? "🚀" : item.type === "reward" ? "🎁" : item.type === "cipher" ? "🔐" : "🎟️"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white truncate pr-2">{item.title}</h4>
                      <span className="text-[8px] text-gray-400 font-mono shrink-0">{item.time}</span>
                    </div>

                    <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">{item.message}</p>

                    {item.actionText && (
                      <button
                        onClick={() => {
                          if (item.onAction) item.onAction();
                          onClose();
                        }}
                        className="mt-2 px-3 py-1 rounded-xl bg-[#00ff7b]/20 hover:bg-[#00ff7b] hover:text-black border border-[#00ff7b]/40 text-[#00ff7b] font-black text-[10px] uppercase tracking-wider transition-all"
                      >
                        {item.actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-[#070510] rounded-2xl border border-white/5">
              <span className="text-3xl block mb-2 opacity-50">🔕</span>
              <p className="text-xs text-gray-400 font-bold">No new notifications at the moment.</p>
              <p className="text-[10px] text-gray-600 mt-1">Check back later for real-time mining alerts.</p>
            </div>
          )}
        </div>

        {/* 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#070510]/90 p-3.5 rounded-2xl border border-[#00e5ff]/30 mb-4 space-y-1.5 text-xs">
          <p className="font-black text-[#00e5ff] uppercase flex items-center space-x-1.5 text-[11px]">
            <span>📖</span> <span>DETAILED NOTIFICATIONS PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1 text-[10px] sm:text-[11px] list-disc list-inside">
            <li>Notifications capture <strong>Auto Bot offline rewards</strong>, daily quest reset reminders, and event alerts.</li>
            <li>Unread alerts display a glowing red indicator on the <strong>Header Bell 🔔</strong> icon.</li>
            <li>Click <strong>CLEAR ALL ALERTS</strong> to reset your inbox anytime.</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#00ff7b] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_#00ff7b] hover:bg-[#31ff00] transition-all"
        >
          Close Notifications
        </button>

      </div>
    </div>
  );
};

export default NotificationsModal;
