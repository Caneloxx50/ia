"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Brain, Heart, Sparkles } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-5 z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Tu terapeuta IA personalizada
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Un espacio seguro para expresar tus pensamientos y emociones con una IA diseñada para escucharte y apoyarte.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            onClick={() => router.push("/therapists")}
          >
            Comenzar ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full">
          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Apoyo Emocional</h3>
              <p className="text-gray-500">Conversaciones que te ayudan a procesar tus emociones y pensamientos.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Personalización Total</h3>
              <p className="text-gray-500">Adapta tu terapeuta virtual a tus preferencias y necesidades.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Voces Personalizadas</h3>
              <p className="text-gray-500">Utiliza modelos RVC para crear una experiencia única y personal.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-64 h-48 rounded-lg bg-gray-100 overflow-hidden">
                <img
                  src="/placeholder.svg?height=192&width=256"
                  alt="Personalización de terapeuta"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Personaliza tu terapeuta</h3>
                <p className="text-gray-600">
                  Elige entre diferentes estilos, personalidades y enfoques terapéuticos para encontrar el terapeuta
                  virtual que mejor se adapte a ti.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-64 h-48 rounded-lg bg-gray-100 overflow-hidden">
                <img
                  src="/placeholder.svg?height=192&width=256"
                  alt="Voces personalizadas"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Voces RVC personalizadas</h3>
                <p className="text-gray-600">
                  Utiliza tus propios modelos de voz RVC para dar a tu terapeuta virtual una voz única y personalizada.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-64 h-48 rounded-lg bg-gray-100 overflow-hidden">
                <img
                  src="/placeholder.svg?height=192&width=256"
                  alt="Interfaz intuitiva"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Interfaz intuitiva</h3>
                <p className="text-gray-600">
                  Una experiencia de chat limpia y minimalista diseñada para que puedas expresarte cómodamente.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-64 h-48 rounded-lg bg-gray-100 overflow-hidden">
                <img
                  src="/placeholder.svg?height=192&width=256"
                  alt="Acceso multiplataforma"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Acceso desde cualquier dispositivo</h3>
                <p className="text-gray-600">
                  Diseño adaptable que funciona perfectamente tanto en dispositivos móviles como en escritorio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Comienza tu viaje de bienestar hoy</h2>
          <p className="text-xl text-gray-600 mb-8">
            Explora diferentes terapeutas virtuales y encuentra el que mejor se adapte a tus necesidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push("/therapists")}
            >
              Explorar terapeutas
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all"
              onClick={() => router.push("/pricing")}
            >
              Ver planes y precios
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

