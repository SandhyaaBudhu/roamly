import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
interface DemoState {
  saved: string[];
  toggleSaved: (id: string) => void;
  theme: string;
  toggleTheme: () => void;
  toast: (message: string) => void;
}
const Context = createContext<DemoState | null>(null);
function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function DemoProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>(() => {
    const s = read<unknown>("roamly-saved", []);
    return Array.isArray(s)
      ? s.filter((x): x is string => typeof x === "string")
      : [];
  });
  const [theme, setTheme] = useState(() =>
    read<string>("roamly-theme", "light") === "dark" ? "dark" : "light",
  );
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem("roamly-saved", JSON.stringify(saved));
    } catch {
      /* Private browsing remains usable. */
    }
  }, [saved]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("roamly-theme", JSON.stringify(theme));
    } catch {
      /* Theme still works in memory. */
    }
  }, [theme]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [message]);
  function toggleSaved(id: string) {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setMessage(
      saved.includes(id)
        ? "Removed from your saved places"
        : "A little inspiration, saved for later.",
    );
  }
  return (
    <Context.Provider
      value={{
        saved,
        toggleSaved,
        theme,
        toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
        toast: setMessage,
      }}
    >
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`toast ${message ? "show" : ""}`}
      >
        {message}
      </div>
    </Context.Provider>
  );
}
export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error("DemoProvider missing");
  return context;
}
