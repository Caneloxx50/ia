"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight, Upload, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Definición de los terapeutas disponibles (igual que en la página anterior)
const therapists = [
  {
    id: "cognitive",
    name: "Dra. Elena Martínez",
    specialty: "Terapia Cognitivo-Conductual",
    description:
      "Especializada en ayudarte a identificar y cambiar patrones de pensamiento negativos. Enfoque práctico y orientado a soluciones.",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Ansiedad", "Depresión", "Estrés"],
    style: "Profesional",
  },
  {
    id: "emotional",
    name: "Dr. Carlos Vega",
    specialty: "Apoyo Emocional",
    description:
      "Centrado en proporcionar un espacio seguro para explorar y procesar tus emociones. Enfoque cálido y empático.",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Emociones", "Duelo", "Relaciones"],
    style: "Empático",
  },
  {
    id: "motivational",
    name: "Dra. Laura Sánchez",
    specialty: "Coaching Motivacional",
    description: "Enfocada en ayudarte a alcanzar tus metas y superar obstáculos. Estilo motivador y energético.",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Motivación", "Metas", "Desarrollo personal"],
    style: "Motivador",
  },
  {
    id: "mindfulness",
    name: "Dr. Miguel Ángel Rojas",
    specialty: "Mindfulness y Meditación",
    description:
      "Especializado en técnicas de atención plena y meditación para reducir el estrés y aumentar la conciencia.",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Mindfulness", "Meditación", "Relajación"],
    style: "Tranquilo",
  },
]

// Estilos de conversación disponibles
const conversationStyles = [
  { id: "friendly", name: "Amigable", description: "Tono cálido y cercano, como hablar con un amigo" },
  { id: "professional", name: "Profesional", description: "Tono formal y estructurado, enfocado en soluciones" },
  { id: "motivational", name: "Motivador", description: "Tono energético y positivo, orientado a la acción" },
  { id: "reflective", name: "Reflexivo", description: "Tono tranquilo y contemplativo, promueve la introspección" },
]

// Estilos visuales disponibles
const visualStyles = [
  { id: "realistic", name: "Realista", description: "Apariencia humana natural y realista" },
  { id: "minimalist", name: "Minimalista", description: "Diseño simple y moderno con líneas limpias" },
  { id: "anime", name: "Anime", description: "Estilo de ilustración inspirado en el anime japonés" },
  { id: "abstract", name: "Abstracto", description: "Representación no figurativa con formas y colores" },
]

export default function CustomizePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  // Encontrar el terapeuta seleccionado
  const selectedTherapist = therapists.find((t) => t.id === params.id) || therapists[0]

  // Estados para la personalización
  const [therapistName, setTherapistName] = useState(selectedTherapist.name)
  const [therapistImage, setTherapistImage] = useState(selectedTherapist.image)
  const [conversationStyle, setConversationStyle] = useState("friendly")
  const [visualStyle, setVisualStyle] = useState("realistic")
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 1,
    rate: 1,
    volume: 1,
  })

  // Estados para los archivos RVC
  const [rvcIndexFile, setRvcIndexFile] = useState<File | null>(null)
  const [rvcPthFile, setRvcPthFile] = useState<File | null>(null)
  const [rvcModelName, setRvcModelName] = useState("")

  // Referencias para los inputs de archivo
  const imageInputRef = useRef<HTMLInputElement>(null)
  const rvcIndexInputRef = useRef<HTMLInputElement>(null)
  const rvcPthInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setTherapistImage(e.target.result.toString())
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const handleRvcIndexUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setRvcIndexFile(file)

      // Extraer nombre del modelo del nombre del archivo
      const fileName = file.name
      const modelName = fileName.replace(".index", "").replace(".bin", "")
      setRvcModelName(modelName)

      toast({
        title: "Archivo Index cargado",
        description: `${file.name} se ha cargado correctamente.`,
      })
    }
  }

  const handleRvcPthUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setRvcPthFile(file)

      toast({
        title: "Archivo PTH cargado",
        description: `${file.name} se ha cargado correctamente.`,
      })
    }
  }

  const handleContinue = () => {
    // Guardar la configuración en localStorage para usarla en el chat
    const therapistConfig = {
      id: selectedTherapist.id,
      name: therapistName,
      image: therapistImage,
      specialty: selectedTherapist.specialty,
      conversationStyle,
      visualStyle,
      voiceSettings,
      rvcModelName: rvcModelName || "Default Voice",
      hasRvcModel: !!rvcIndexFile,
    }

    localStorage.setItem("therapistConfig", JSON.stringify(therapistConfig))

    // Navegar a la página de chat
    router.push("/chat")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-8 flex items-center" onClick={() => router.push("/therapists")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la selección
        </Button>

        <h1 className="text-3xl font-bold mb-2">Personaliza tu terapeuta</h1>
        <p className="text-gray-600 mb-8">Adapta {selectedTherapist.name} a tus preferencias</p>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="appearance">Apariencia</TabsTrigger>
            <TabsTrigger value="voice">Voz</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del perfil</CardTitle>
                <CardDescription>Personaliza el nombre y el estilo de conversación de tu terapeuta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="therapist-name">Nombre del terapeuta</Label>
                  <Input id="therapist-name" value={therapistName} onChange={(e) => setTherapistName(e.target.value)} />
                </div>

                <div className="space-y-4">
                  <Label>Estilo de conversación</Label>
                  <RadioGroup
                    value={conversationStyle}
                    onValueChange={setConversationStyle}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {conversationStyles.map((style) => (
                      <div key={style.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={style.id} id={`style-${style.id}`} className="mt-1" />
                        <div className="grid gap-1">
                          <Label htmlFor={`style-${style.id}`} className="font-medium">
                            {style.name}
                          </Label>
                          <p className="text-sm text-gray-500">{style.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apariencia visual</CardTitle>
                <CardDescription>Personaliza la imagen y el estilo visual de tu terapeuta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Imagen del terapeuta</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={therapistImage} />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" onClick={() => imageInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir imagen
                    </Button>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Estilo visual</Label>
                  <RadioGroup
                    value={visualStyle}
                    onValueChange={setVisualStyle}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {visualStyles.map((style) => (
                      <div key={style.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={style.id} id={`visual-${style.id}`} className="mt-1" />
                        <div className="grid gap-1">
                          <Label htmlFor={`visual-${style.id}`} className="font-medium">
                            {style.name}
                          </Label>
                          <p className="text-sm text-gray-500">{style.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de voz</CardTitle>
                <CardDescription>Personaliza la voz de tu terapeuta con modelos RVC y ajustes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Modelo de voz RVC</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Archivo Index (requerido)</p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => rvcIndexInputRef.current?.click()} className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Subir archivo Index
                        </Button>
                        <input
                          type="file"
                          ref={rvcIndexInputRef}
                          onChange={handleRvcIndexUpload}
                          accept=".index,.bin"
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {rvcIndexFile ? (
                          <span className="flex items-center text-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            {rvcIndexFile.name}
                          </span>
                        ) : (
                          "Ningún archivo seleccionado"
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Archivo PTH (opcional)</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => rvcPthInputRef.current?.click()}
                          className="w-full"
                          disabled={!rvcIndexFile}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Subir archivo PTH
                        </Button>
                        <input
                          type="file"
                          ref={rvcPthInputRef}
                          onChange={handleRvcPthUpload}
                          accept=".pth"
                          onChange={handleRvcPthUpload}
                          accept=".pth"
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {rvcPthFile ? (
                          <span className="flex items-center text-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            {rvcPthFile.name}
                          </span>
                        ) : (
                          "Ningún archivo seleccionado (opcional)"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium mb-1">Nombre del modelo: {rvcModelName || "Sin modelo"}</p>
                    <p className="text-xs text-gray-500">El nombre se extrae automáticamente del archivo index</p>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button size="lg" onClick={handleContinue} className="flex items-center">
            Continuar al chat
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

