"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Play, Pause, Volume2, ChevronLeft, ChevronRight, Upload, Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Definición de los terapeutas disponibles con más detalles
const therapists = [
  {
    id: "cognitive",
    name: "Dra. Elena Martínez",
    specialty: "Terapia Cognitivo-Conductual",
    description:
      "Especializada en ayudarte a identificar y cambiar patrones de pensamiento negativos. Enfoque práctico y orientado a soluciones.",
    longDescription:
      "La Dra. Elena utiliza técnicas de terapia cognitivo-conductual para ayudarte a reconocer patrones de pensamiento negativos y transformarlos en perspectivas más constructivas. Su enfoque es estructurado y basado en evidencia, ideal para personas que buscan resultados tangibles y herramientas prácticas para gestionar la ansiedad, depresión o estrés.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Ansiedad", "Depresión", "Estrés", "Autoestima"],
    style: "Profesional",
    voicePreview:
      "Hola, soy la Dra. Elena Martínez. Mi enfoque es ayudarte a identificar patrones de pensamiento que pueden estar afectando tu bienestar. Trabajaremos juntos para desarrollar estrategias prácticas.",
    personalities: ["Analítica", "Estructurada", "Directa", "Empática"],
    styleOptions: ["Profesional", "Formal", "Directa"],
    visualStyles: ["Realista", "Profesional", "Minimalista"],
  },
  {
    id: "emotional",
    name: "Dr. Carlos Vega",
    specialty: "Apoyo Emocional",
    description:
      "Centrado en proporcionar un espacio seguro para explorar y procesar tus emociones. Enfoque cálido y empático.",
    longDescription:
      "El Dr. Carlos crea un espacio seguro donde puedes explorar tus emociones sin juicios. Su enfoque está basado en la escucha activa y la validación emocional, ayudándote a procesar experiencias difíciles y desarrollar una mayor inteligencia emocional. Es ideal para personas que buscan apoyo durante momentos de crisis, duelo o transiciones de vida.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Emociones", "Duelo", "Relaciones", "Trauma"],
    style: "Empático",
    voicePreview:
      "Hola, soy el Dr. Carlos Vega. Mi enfoque se centra en crear un espacio seguro donde puedas expresar y explorar tus emociones. Estoy aquí para escucharte y acompañarte en tu proceso.",
    personalities: ["Cálido", "Comprensivo", "Paciente", "Intuitivo"],
    styleOptions: ["Empático", "Cálido", "Reflexivo"],
    visualStyles: ["Cálido", "Acogedor", "Expresivo"],
  },
  {
    id: "motivational",
    name: "Dra. Laura Sánchez",
    specialty: "Coaching Motivacional",
    description: "Enfocada en ayudarte a alcanzar tus metas y superar obstáculos. Estilo motivador y energético.",
    longDescription:
      "La Dra. Laura combina técnicas de psicología positiva y coaching para ayudarte a identificar tus fortalezas, establecer metas claras y desarrollar planes de acción efectivos. Su estilo energético y orientado a resultados te ayudará a mantener la motivación y superar los obstáculos que encuentres en el camino. Ideal para personas buscando crecimiento personal o profesional.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Motivación", "Metas", "Desarrollo personal", "Productividad"],
    style: "Motivador",
    voicePreview:
      "Hola, soy la Dra. Laura Sánchez. Mi enfoque es ayudarte a descubrir tu potencial y alcanzar tus metas. Juntos identificaremos tus fortalezas y crearemos estrategias para superar cualquier obstáculo.",
    personalities: ["Energética", "Positiva", "Inspiradora", "Práctica"],
    styleOptions: ["Motivador", "Dinámico", "Positivo"],
    visualStyles: ["Vibrante", "Moderno", "Dinámico"],
  },
  {
    id: "mindfulness",
    name: "Dr. Miguel Ángel Rojas",
    specialty: "Mindfulness y Meditación",
    description:
      "Especializado en técnicas de atención plena y meditación para reducir el estrés y aumentar la conciencia.",
    longDescription:
      "El Dr. Miguel integra prácticas de mindfulness, meditación y técnicas de relajación para ayudarte a cultivar una mayor conciencia del momento presente. Su enfoque tranquilo y contemplativo te guiará para reducir el estrés, mejorar tu concentración y desarrollar una relación más equilibrada con tus pensamientos y emociones. Ideal para quienes buscan calma interior y autoconocimiento.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Mindfulness", "Meditación", "Relajación", "Estrés"],
    style: "Tranquilo",
    voicePreview:
      "Hola, soy el Dr. Miguel Ángel Rojas. Mi enfoque se basa en la atención plena y la meditación para ayudarte a encontrar calma y claridad en tu vida diaria. Aprenderemos a estar presentes en cada momento.",
    personalities: ["Sereno", "Contemplativo", "Centrado", "Sabio"],
    styleOptions: ["Tranquilo", "Contemplativo", "Pausado"],
    visualStyles: ["Sereno", "Natural", "Minimalista"],
  },
  {
    id: "holistic",
    name: "Dra. Sofía Mendoza",
    specialty: "Terapia Holística",
    description:
      "Integra diferentes enfoques terapéuticos para abordar el bienestar físico, mental y espiritual como un todo.",
    longDescription:
      "La Dra. Sofía adopta un enfoque integral que considera todos los aspectos de tu ser: mente, cuerpo y espíritu. Combina técnicas de diversas tradiciones terapéuticas para crear un plan personalizado que promueva el equilibrio y la armonía en todas las áreas de tu vida. Ideal para quienes buscan un enfoque más completo y alternativo para su bienestar.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Holístico", "Bienestar", "Equilibrio", "Integración"],
    style: "Integrativo",
    voicePreview:
      "Hola, soy la Dra. Sofía Mendoza. Mi enfoque holístico considera todos los aspectos de tu ser para ayudarte a encontrar equilibrio y armonía. Exploraremos diferentes caminos hacia tu bienestar integral.",
    personalities: ["Intuitiva", "Equilibrada", "Acogedora", "Espiritual"],
    styleOptions: ["Holístico", "Integrativo", "Armonioso"],
    visualStyles: ["Orgánico", "Armónico", "Fluido"],
  },
  {
    id: "creative",
    name: "Dr. Alejandro Torres",
    specialty: "Terapia Creativa",
    description: "Utiliza técnicas artísticas y creativas para explorar emociones y promover la expresión personal.",
    longDescription:
      "El Dr. Alejandro incorpora elementos de arteterapia, escritura expresiva y otras modalidades creativas para ayudarte a explorar y expresar emociones que pueden ser difíciles de verbalizar. Su enfoque lúdico y experimental te invita a descubrir nuevas perspectivas y soluciones innovadoras a tus desafíos. Ideal para personas que disfrutan de la creatividad o buscan formas alternativas de autoexpresión.",
    image: "/placeholder.svg?height=400&width=400",
    tags: ["Creatividad", "Expresión", "Innovación", "Arte"],
    style: "Creativo",
    voicePreview:
      "Hola, soy el Dr. Alejandro Torres. Mi enfoque utiliza la creatividad como herramienta terapéutica para explorar tus emociones y descubrir nuevas perspectivas. Juntos encontraremos formas únicas de expresión.",
    personalities: ["Creativo", "Imaginativo", "Flexible", "Curioso"],
    styleOptions: ["Creativo", "Expresivo", "Exploratorio"],
    visualStyles: ["Artístico", "Colorido", "Expresivo"],
  },
]

// Tipos para los archivos de voz
interface VoiceModel {
  id: string
  name: string
  files: {
    index?: File
    pth?: File
  }
  status: "idle" | "uploading" | "processing" | "ready" | "error"
  progress: number
  error?: string
}

export default function TherapistsPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Estados para la selección y personalización
  const [selectedTherapist, setSelectedTherapist] = useState(therapists[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 1,
    rate: 1,
    volume: 1,
  })
  const [selectedPersonality, setSelectedPersonality] = useState(therapists[0].personalities[0])
  const [selectedStyle, setSelectedStyle] = useState(therapists[0].styleOptions[0])
  const [selectedVisualStyle, setSelectedVisualStyle] = useState(therapists[0].visualStyles[0])
  const [useCustomVoice, setUseCustomVoice] = useState(false)
  const [voiceModels, setVoiceModels] = useState<VoiceModel[]>([])
  const [activeVoiceModel, setActiveVoiceModel] = useState<string | null>(null)
  const [customVoiceName, setCustomVoiceName] = useState("")

  // Referencias
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const indexFileInputRef = useRef<HTMLInputElement>(null)
  const pthFileInputRef = useRef<HTMLInputElement>(null)

  // Actualizar el terapeuta seleccionado cuando cambia el índice
  useEffect(() => {
    setSelectedTherapist(therapists[currentIndex])
    setSelectedPersonality(therapists[currentIndex].personalities[0])
    setSelectedStyle(therapists[currentIndex].styleOptions[0])
    setSelectedVisualStyle(therapists[currentIndex].visualStyles[0])

    // Detener la reproducción de audio si está activa
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [currentIndex])

  // Función para navegar entre terapeutas
  const navigateTherapist = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? therapists.length - 1 : prev - 1))
    } else {
      setCurrentIndex((prev) => (prev === therapists.length - 1 ? 0 : prev + 1))
    }
  }

  // Función para reproducir la vista previa de voz
  const toggleVoicePreview = async () => {
    if (isPlaying) {
      // Detener la reproducción
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    setIsGeneratingAudio(true)

    try {
      if (useCustomVoice && activeVoiceModel) {
        // Simulación de generación de audio con modelo personalizado
        const selectedModel = voiceModels.find((model) => model.id === activeVoiceModel)

        if (!selectedModel || selectedModel.status !== "ready") {
          throw new Error("El modelo de voz no está listo")
        }

        // Llamada a la API de TTS (simulada)
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: selectedTherapist.voicePreview,
            voiceId: activeVoiceModel,
            settings: voiceSettings,
          }),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Error al generar el audio")
        }

        toast({
          title: "Audio generado con VITS",
          description: `Modelo: ${selectedModel.name} - Tiempo: ${data.processingTime}`,
        })

        // En una implementación real, aquí se reproduciría el archivo de audio devuelto
        // Por ahora, usamos la API de Web Speech como fallback
        const utterance = new SpeechSynthesisUtterance(selectedTherapist.voicePreview)
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
          setIsPlaying(false)
        }

        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
      } else {
        // Usar Web Speech API para la voz predeterminada
        const utterance = new SpeechSynthesisUtterance(selectedTherapist.voicePreview)
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
          setIsPlaying(false)
        }

        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error al reproducir audio:", error)
      toast({
        title: "Error al generar audio",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  // Manejar la carga de archivos de voz
  const handleFileUpload = (type: "index" | "pth", file: File) => {
    // Crear un ID único para el modelo si es un archivo index
    if (type === "index") {
      const modelId = `model_${Date.now()}`
      const modelName = file.name.replace(".index", "").replace(".bin", "")

      setVoiceModels((prev) => [
        ...prev,
        {
          id: modelId,
          name: modelName,
          files: {
            index: file,
          },
          status: "uploading",
          progress: 0,
        },
      ])

      // Simular proceso de carga y procesamiento
      simulateModelProcessing(modelId)

      // Establecer nombre personalizado
      setCustomVoiceName(modelName)
    } else if (type === "pth" && activeVoiceModel) {
      // Añadir archivo pth al modelo activo
      setVoiceModels((prev) =>
        prev.map((model) =>
          model.id === activeVoiceModel ? { ...model, files: { ...model.files, pth: file } } : model,
        ),
      )

      toast({
        title: "Archivo PTH añadido",
        description: `${file.name} se ha añadido al modelo ${voiceModels.find((m) => m.id === activeVoiceModel)?.name}`,
      })
    }
  }

  // Simular el procesamiento del modelo
  const simulateModelProcessing = (modelId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10

      if (progress <= 100) {
        setVoiceModels((prev) =>
          prev.map((model) =>
            model.id === modelId ? { ...model, progress, status: progress < 100 ? "processing" : "ready" } : model,
          ),
        )
      } else {
        clearInterval(interval)

        // Establecer como modelo activo
        setActiveVoiceModel(modelId)

        toast({
          title: "Modelo de voz listo",
          description: `El modelo ${voiceModels.find((m) => m.id === modelId)?.name} está listo para usar`,
        })
      }
    }, 500)
  }

  // Función para seleccionar y continuar con el terapeuta
  const handleSelectTherapist = () => {
    // Guardar la configuración en localStorage
    const therapistConfig = {
      id: selectedTherapist.id,
      name: selectedTherapist.name,
      image: selectedTherapist.image,
      specialty: selectedTherapist.specialty,
      personality: selectedPersonality,
      conversationStyle: selectedStyle,
      visualStyle: selectedVisualStyle,
      voiceSettings,
      useCustomVoice,
      voiceModelId: activeVoiceModel,
      voiceModelName: activeVoiceModel
        ? voiceModels.find((m) => m.id === activeVoiceModel)?.name || "Voz personalizada"
        : "Voz predeterminada",
    }

    localStorage.setItem("therapistConfig", JSON.stringify(therapistConfig))

    // Navegar a la página de chat
    router.push("/chat")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Audio element for voice preview */}
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" className="flex items-center" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Elige tu terapeuta IA ideal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada terapeuta tiene un estilo único de conversación y enfoque terapéutico. Explora y personaliza tu
            experiencia para encontrar el apoyo que mejor se adapte a ti.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Therapist showcase - Left side (3 columns) */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/10">
              {/* Navigation arrows */}
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
                onClick={() => navigateTherapist("prev")}
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>

              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
                onClick={() => navigateTherapist("next")}
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>

              {/* Therapist image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={selectedTherapist.image} alt={selectedTherapist.name} className="object-cover" />
                    <AvatarFallback>
                      {selectedTherapist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Voice preview button */}
                  <button
                    className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all"
                    onClick={toggleVoicePreview}
                    disabled={isGeneratingAudio}
                  >
                    {isGeneratingAudio ? (
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-6 w-6 text-primary" />
                    ) : (
                      <Play className="h-6 w-6 text-primary" />
                    )}
                  </button>
                </div>
              </div>

              {/* Pagination indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {therapists.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-gray-300"}`}
                    onClick={() => setCurrentIndex(index)}
                  ></div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedTherapist.name}</h2>
                  <p className="text-primary font-medium">{selectedTherapist.specialty}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTherapist.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-6">{selectedTherapist.longDescription}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="bg-primary/5">
                  <span className="font-normal">{selectedStyle}</span>
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  <span className="font-normal">{selectedPersonality}</span>
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  <span className="font-normal">{selectedVisualStyle}</span>
                </Badge>
              </div>

              <Button className="w-full py-6 text-lg rounded-lg" onClick={handleSelectTherapist}>
                Seleccionar este terapeuta
              </Button>
            </div>
          </div>

          {/* Customization panel - Right side (2 columns) */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Personaliza tu experiencia</h3>

                <Tabs defaultValue="personality" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="personality">Personalidad</TabsTrigger>
                    <TabsTrigger value="voice">Voz</TabsTrigger>
                    <TabsTrigger value="visual">Apariencia</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personality" className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Personalidad</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTherapist.personalities.map((personality) => (
                          <Button
                            key={personality}
                            variant={selectedPersonality === personality ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => setSelectedPersonality(personality)}
                          >
                            {personality}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Estilo de conversación</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTherapist.styleOptions.map((style) => (
                          <Button
                            key={style}
                            variant={selectedStyle === style ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => setSelectedStyle(style)}
                          >
                            {style}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="voice" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch id="custom-voice" checked={useCustomVoice} onCheckedChange={setUseCustomVoice} />
                        <Label htmlFor="custom-voice">Usar voz personalizada (VITS/RVC)</Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        onClick={toggleVoicePreview}
                        disabled={isGeneratingAudio}
                      >
                        {isGeneratingAudio ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Volume2 className="h-4 w-4 mr-1" />
                        )}
                        Probar voz
                      </Button>
                    </div>

                    {useCustomVoice ? (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium">Modelo de voz VITS/RVC</h4>

                        {/* Modelos cargados */}
                        {voiceModels.length > 0 && (
                          <div className="space-y-3 mb-4">
                            <h5 className="text-sm font-medium">Modelos disponibles</h5>
                            {voiceModels.map((model) => (
                              <div
                                key={model.id}
                                className={`p-3 rounded-lg border ${activeVoiceModel === model.id ? "border-primary bg-primary/5" : "border-gray-200"}`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <div className="font-medium">{model.name}</div>
                                  {model.status === "ready" ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      Listo
                                    </Badge>
                                  ) : model.status === "error" ? (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      Error
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      Procesando
                                    </Badge>
                                  )}
                                </div>

                                {model.status === "processing" || model.status === "uploading" ? (
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span>Procesando modelo...</span>
                                      <span>{model.progress}%</span>
                                    </div>
                                    <Progress value={model.progress} className="h-2" />
                                  </div>
                                ) : model.status === "ready" ? (
                                  <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-500">
                                      {model.files.pth ? "Index + PTH" : "Solo Index"}
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={
                                        activeVoiceModel === model.id ? "bg-primary text-primary-foreground" : ""
                                      }
                                      onClick={() => setActiveVoiceModel(model.id)}
                                    >
                                      {activeVoiceModel === model.id ? "Seleccionado" : "Seleccionar"}
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="text-xs text-red-500">
                                    {model.error || "Error al procesar el modelo"}
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="p-0 h-auto text-xs"
                                      onClick={() => simulateModelProcessing(model.id)}
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Reintentar
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Formulario para cargar nuevo modelo */}
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium">Cargar nuevo modelo</h5>

                          <div className="space-y-2">
                            <Label htmlFor="voice-name">Nombre del modelo (opcional)</Label>
                            <Input
                              id="voice-name"
                              placeholder="Mi voz personalizada"
                              value={customVoiceName}
                              onChange={(e) => setCustomVoiceName(e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Archivo Index (requerido)</p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => indexFileInputRef.current?.click()}
                                  className="w-full"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Subir archivo Index
                                </Button>
                                <input
                                  type="file"
                                  ref={indexFileInputRef}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileUpload("index", e.target.files[0])
                                    }
                                  }}
                                  accept=".index,.bin"
                                  className="hidden"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm font-medium">Archivo PTH (opcional)</p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => pthFileInputRef.current?.click()}
                                  className="w-full"
                                  disabled={!activeVoiceModel}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Subir archivo PTH
                                </Button>
                                <input
                                  type="file"
                                  ref={pthFileInputRef}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileUpload("pth", e.target.files[0])
                                    }
                                  }}
                                  accept=".pth"
                                  className="hidden"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                            <p className="font-medium mb-1">Nota sobre la integración VITS/RVC</p>
                            <p>
                              Para una implementación completa, se requiere un servidor backend con Python que procese
                              los modelos VITS/RVC. Esta interfaz simula la carga y procesamiento de modelos para
                              demostración.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
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
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="visual" className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Estilo visual</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTherapist.visualStyles.map((style) => (
                          <Button
                            key={style}
                            variant={selectedVisualStyle === style ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => setSelectedVisualStyle(style)}
                          >
                            {style}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Vista previa</h4>
                      <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Avatar className="w-24 h-24 mx-auto mb-3">
                            <AvatarImage
                              src={selectedTherapist.image}
                              alt={selectedTherapist.name}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {selectedTherapist.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm text-gray-500">Estilo: {selectedVisualStyle}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="bg-gray-50 p-6">
                <Button className="w-full" onClick={handleSelectTherapist}>
                  Continuar con este terapeuta
                </Button>
              </CardFooter>
            </Card>

            {/* Chat preview */}
            <Card className="mt-6 shadow-lg overflow-hidden">
              <div className="bg-primary/10 p-4">
                <h3 className="font-medium">Vista previa de conversación</h3>
              </div>
              <CardContent className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={selectedTherapist.image} alt={selectedTherapist.name} />
                      <AvatarFallback>
                        {selectedTherapist.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <p>Hola, soy {selectedTherapist.name}. ¿En qué puedo ayudarte hoy?</p>
                    </div>
                  </div>

                  <div className="flex items-start justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                      <p>Últimamente me he sentido un poco {selectedTherapist.tags[0].toLowerCase()}.</p>
                    </div>
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Usuario" />
                      <AvatarFallback>TÚ</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={selectedTherapist.image} alt={selectedTherapist.name} />
                      <AvatarFallback>
                        {selectedTherapist.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <p>
                        Entiendo que te sientas así.{" "}
                        {selectedTherapist.id === "cognitive"
                          ? "Podemos explorar qué pensamientos están contribuyendo a esta sensación."
                          : selectedTherapist.id === "emotional"
                            ? "Es importante validar y procesar estas emociones."
                            : selectedTherapist.id === "motivational"
                              ? "¡Juntos podemos encontrar estrategias para superar esto!"
                              : "Respiremos profundamente y exploremos esta sensación con atención plena."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

