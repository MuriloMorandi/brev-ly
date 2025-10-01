import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type NotificationType = "success" | "error";

type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};

type NotificationContextType = {
  showNotification: (message: string, type?: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type }]);

      // remove depois de 3s
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {createPortal(
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
                n.type === "success" ? "bg-blue-base" : "bg-red-500"
              }`}
            >
              {n.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification deve ser usado dentro de <NotificationProvider>"
    );
  }
  return ctx;
}
