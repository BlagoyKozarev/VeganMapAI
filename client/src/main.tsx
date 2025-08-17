import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./sw-bust";

console.log('[MAIN] React app loading...');
createRoot(document.getElementById("root")!).render(<App />);
