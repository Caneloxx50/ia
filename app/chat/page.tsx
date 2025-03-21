"use client"; // Asegúrate de que esto esté al principio si estás usando Next.js

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, Send, Volume2, VolumeX, Settings, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: string;
  content: string;
  id: string;
}
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// Simple response patterns for the custom AI
const RESPONSE_PATTERNS = [
  {
    keywords: ["triste", "deprimido", "depresión", "mal"],
    responses: [
      "Entiendo que te sientes triste. ¿Podrías contarme más sobre lo que te está afectando?",
      "Lamento que estés pasando por un momento difícil. ¿Desde cuándo te sientes así?",
      "Es normal sentirse así a veces. ¿Hay algo específico que haya desencadenado estos sentimientos?",
    ],
  },
  {
    keywords: ["ansioso", "ansiedad", "nervioso", "preocupado"],
    responses: [
      "La ansiedad puede ser muy difícil de manejar. ¿Qué situaciones te generan más ansiedad?",
      "Respira profundamente. ¿Puedes identificar qué pensamientos te generan esta ansiedad?",
      "Es comprensible sentirse ansioso. ¿Has probado alguna técnica de relajación que te haya funcionado antes?",
    ],
  },
  {
    keywords: ["trabajo", "estrés", "laboral", "jefe"],
    responses: [
      "El estrés laboral es muy común. ¿Qué aspectos de tu trabajo te resultan más difíciles?",
      "Encontrar balance entre trabajo y vida personal es importante. ¿Cómo es tu rutina diaria?",
      "Entiendo que el trabajo puede ser abrumador. ¿Has podido hablar con alguien en tu entorno laboral sobre esto?",
    ],
  },
  {
    keywords: ["relación", "pareja", "amor", "ruptura", "novio", "novia"],
    responses: [
      "Las relaciones pueden ser complicadas. ¿Cómo te sientes respecto a esta situación?",
      "Entiendo que esto es difícil. ¿Qué aspectos de la relación te preocupan más?",
      "Es normal tener dificultades en las relaciones. ¿Has podido comunicar tus sentimientos a la otra persona?",
    ],
  },
  {
    keywords: ["familia", "padres", "hijos", "hermanos"],
    responses: [
      "Las dinámicas familiares pueden ser complejas. ¿Cómo es tu relación con tu familia?",
      "Entiendo que las situaciones familiares pueden ser difíciles. ¿Hay algún conflicto específico que te preocupe?",
      "Las relaciones familiares son importantes. ¿Cómo te gustaría que fueran las cosas con tu familia?",
    ],
  },
]

// Default fallback responses
const DEFAULT_RESPONSES = [
  "Entiendo. ¿Podrías contarme más sobre eso?",
  "¿Cómo te hace sentir esa situación?",
  "Es interesante lo que mencionas. ¿Desde cuándo te sientes así?",
  "¿Hay algo más que quieras compartir sobre esta experiencia?",
  "¿Qué crees que podría ayudarte en este momento?",
  "Gracias por compartir eso conmigo. ¿Cómo puedo apoyarte mejor?",
]

// Respuestas según el estilo de conversación
const STYLE_RESPONSES = {
  friendly: [
    "Entiendo cómo te sientes. A veces yo también me he sentido así.",
    "Estoy aquí para escucharte, puedes contarme lo que quieras.",
    "Me alegra que confíes en mí para hablar de esto.",
    "Vamos paso a paso, ¿te parece bien?",
  ],
  professional: [
    "Basado en lo que describes, podríamos explorar algunas estrategias específicas.",
    "Desde una perspectiva terapéutica, este tipo de situaciones suelen responder bien a...",
    "Vamos a analizar los factores que pueden estar contribuyendo a esta situación.",
    "Le sugiero que consideremos las siguientes opciones...",
  ],
  motivational: [
    "¡Puedes superar esto! Tienes más fortaleza de la que crees.",
    "Cada pequeño paso es un avance importante. ¡Sigamos adelante!",
    "Visualiza cómo te sentirás cuando hayas superado este obstáculo.",
    "Confío en tu capacidad para encontrar soluciones creativas a este desafío.",
  ],
  reflective: [
    "Tomemos un momento para reflexionar sobre lo que esto significa para ti.",
    "¿Qué crees que tu yo del futuro pensaría sobre esta situación?",
    "A veces, el silencio y la contemplación nos dan las respuestas que buscamos.",
    "Observa tus pensamientos como si fueran nubes pasando por el cielo.",
  ],
}

export default function ChatPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Cargar la configuración del terapeuta
  const [therapistConfig, setTherapistConfig] = useState<any>(null)

  useEffect(() => {
    // Cargar la configuración del localStorage
    const savedConfig = localStorage.getItem("therapistConfig")
    if (savedConfig) {
      setTherapistConfig(JSON.parse(savedConfig))
    } else {
      // Si no hay configuración, redirigir a la página de selección
      router.push("/therapists")
    }
  }, [router])

 {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [transcript, setTranscript] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [voiceSettings, setVoiceSettings] = useState({
      pitch: 1,
      rate: 1,
      volume: 1,
    });
  

  // Actualizar la configuración de voz cuando se carga la configuración del terapeuta
  useEffect(() => {
    if (therapistConfig && therapistConfig.voiceSettings) {
      setVoiceSettings(therapistConfig.voiceSettings)
    }
  }, [therapistConfig])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simple custom AI implementation
  const generateResponse = (userMessage: string) => {
    if (!therapistConfig) return DEFAULT_RESPONSES[0]

    // Convert to lowercase for easier matching
    const message = userMessage.toLowerCase()

    // Check for keyword matches
    for (const pattern of RESPONSE_PATTERNS) {
      for (const keyword of pattern.keywords) {
        if (message.includes(keyword)) {
          // Return a random response from the matching pattern
          const randomIndex = Math.floor(Math.random() * pattern.responses.length)
          return pattern.responses[randomIndex]
        }
      }
    }

    // If no keywords match, return a response based on conversation style
    const styleResponses =
      STYLE_RESPONSES[therapistConfig.conversationStyle as keyof typeof STYLE_RESPONSES] || DEFAULT_RESPONSES
    const randomIndex = Math.floor(Math.random() * styleResponses.length)
    return styleResponses[randomIndex]
  }

// Speech recognition setup
useEffect(() => {
  if (typeof window !== "undefined") {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "es-ES";

      recognition.onresult = (event: any) => {  // Añadir tipo 'any' para evitar el error
        const current = event.resultIndex;
        const result = event.results[current];
        const transcript = result[0].transcript;
        setTranscript(transcript);
        setInput(transcript);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      if (isListening) {
        recognition.start();
      }

      return () => {
        recognition.stop();
      };
    }
  }
}, [isListening]);

  // Text-to-speech function with VITS/RVC simulation
  const speakText = async (text: string) => {
    if (!audioEnabled || typeof window === "undefined" || !therapistConfig) return

    setIsGeneratingAudio(true)

    try {
      // Si se está usando un modelo de voz personalizado
      if (therapistConfig.useCustomVoice && therapistConfig.voiceModelId) {
        // Llamada a la API de TTS (simulada)
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            voiceId: therapistConfig.voiceModelId,
            settings: voiceSettings,
          }),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Error al generar el audio")
        }

        toast({
          title: "Audio generado con VITS",
          description: `Modelo: ${therapistConfig.voiceModelName} - Tiempo: ${data.processingTime}`,
        })

        // En una implementación real, aquí se reproduciría el archivo de audio devuelto
        // Por ahora, usamos la API de Web Speech como fallback
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.pitch = voiceSettings.pitch
        utterance.rate = voiceSettings.rate
        utterance.volume = voiceSettings.volume

        // Seleccionar una voz en español si está disponible
        const voices = window.speechSynthesis.getVoices()
        const spanishVoices = voices.filter((voice) => voice.lang.includes("es"))
        if (spanishVoices.length > 0) {
          utterance.voice = spanishVoices[0]
        }

        utterance.onend = () => {
          setIsGeneratingAudio(false)
        }

        window.speechSynthesis.speak(utterance)
      } else {
        // Usar Web Speech API para la voz predeterminada
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.pitch = voiceSettings.pitch
        utterance.rate = voiceSettings.rate
        utterance.volume = voiceSettings.volume

        // Seleccionar una voz en español si está disponible
        const voices = window.speechSynthesis.getVoices()
        const spanishVoices = voices.filter((voice) => voice.lang.includes("es"))
        if (spanishVoices.length > 0) {
          utterance.voice = spanishVoices[0]
        }

        utterance.onend = () => {
          setIsGeneratingAudio(false)
        }

        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("Error al reproducir audio:", error)
      toast({
        title: "Error al generar audio",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
      setIsGeneratingAudio(false)
    }
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleListening = () => {
    setIsListening(!isListening)
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    if (audioEnabled) {
      window.speechSynthesis.cancel()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const playAudio = (audioUrl: string) => {
    try {
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error("Error al reproducir audio:", error);
        toast({
          title: "Error de reproducción",
          description: "No se pudo reproducir el audio. Intenta recargar la página.",
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error("Error al crear objeto Audio:", error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !therapistConfig) return;
  
    if (isListening) {
      setIsListening(false);
    }
  
    // Agregar el mensaje del usuario
    const userMessage = {
      role: "user",
      content: input,
      id: Date.now().toString(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
  
    try {
      // Enviar el mensaje al backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
  
      // Agregar la respuesta del asistente
      const aiMessage = {
        role: "assistant",
        content: data.message,
        id: (Date.now() + 1).toString(),
      };
  
      setMessages((prev) => [...prev, aiMessage]);
  
      // Reproducir el audio
      if (data.audio_url) {
        playAudio(data.audio_url);
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
  
      const errorMessage = {
        role: "assistant",
        content: "Hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        id: (Date.now() + 1).toString(),
      };
  
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Si no hay configuración de terapeuta, mostrar un mensaje de carga
  if (!therapistConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="mr-1" onClick={() => router.push("/therapists")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={therapistConfig.image} alt="AI Therapist" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{therapistConfig.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{therapistConfig.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleAudio}
                className="rounded-full"
                disabled={isGeneratingAudio}
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajustes de voz</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="voice-pitch">Tono</Label>
                        <span className="text-sm text-muted-foreground">{voiceSettings.pitch.toFixed(1)}</span>
                      </div>
                      <Slider
                        id="voice-pitch"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={[voiceSettings.pitch]}
                        onValueChange={(value) => setVoiceSettings({ ...voiceSettings, pitch: value[0] })}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="voice-rate">Velocidad</Label>
                        <span className="text-sm text-muted-foreground">{voiceSettings.rate.toFixed(1)}</span>
                      </div>
                      <Slider
                        id="voice-rate"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={[voiceSettings.rate]}
                        onValueChange={(value) => setVoiceSettings({ ...voiceSettings, rate: value[0] })}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="voice-volume">Volumen</Label>
                        <span className="text-sm text-muted-foreground">{voiceSettings.volume.toFixed(1)}</span>
                      </div>
                      <Slider
                        id="voice-volume"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[voiceSettings.volume]}
                        onValueChange={(value) => setVoiceSettings({ ...voiceSettings, volume: value[0] })}
                      />
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-medium">Modelo de voz: {therapistConfig.voiceModelName}</p>
                      {therapistConfig.useCustomVoice ? (
                        <p className="text-xs text-green-600">Modelo VITS/RVC personalizado</p>
                      ) : (
                        <p className="text-xs text-gray-500">Usando voz predeterminada</p>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[60vh] overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <p className="mb-4">Hola, soy {therapistConfig.name}. ¿En qué puedo ayudarte hoy?</p>
              <p>Puedes contarme lo que te preocupa y estoy aquí para escucharte.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"} message-entry`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={therapistConfig.image} alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 ml-2 mt-1">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>TÚ</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={therapistConfig.image} alt="AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={isListening ? "Escuchando..." : "Escribe tu mensaje..."}
              className="flex-grow"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleListening}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button type="submit" disabled={isLoading || !input}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}}