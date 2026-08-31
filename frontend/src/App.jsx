import { useState } from "react";
import Login from './Login';
import Chat from './Chat';

export default function App() {
  const [usuario, setUsuario] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <main className="app-container">
      {!usuario ? (
        <Login onLogin={(user) => setUsuario(user)} />
      ) : (
        <Chat usuario={usuario} onLogout={handleLogout} />
      )}
    </main>
  );
}