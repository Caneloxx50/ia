import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message) return; // No hacer nada si el mensaje está vacío

    setIsLoading(true); // Activar el indicador de carga

    try {
      // Hacer una solicitud POST a la API de FastAPI
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }), // Enviar el mensaje en el cuerpo de la solicitud
      });

      const data = await res.json(); // Obtener la respuesta de la API
      setResponse(data.message); // Mostrar la respuesta en la interfaz
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setResponse("Hubo un error al enviar el mensaje.");
    } finally {
      setIsLoading(false); // Desactivar el indicador de carga
    }
  };

  return (
    <div>
      {/* Campo de entrada para el mensaje */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje"
        disabled={isLoading} // Deshabilitar el input mientras se carga
      />

      {/* Botón para enviar el mensaje */}
      <button onClick={handleSendMessage} disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar"}
      </button>

      {/* Mostrar la respuesta de la API */}
      <p>{response}</p>
    </div>
  );
}