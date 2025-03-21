"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"

export default function PricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      name: "Gratuito",
      description: "Para comenzar a explorar",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Acceso a 1 terapeuta IA",
        "Conversaciones limitadas",
        "Personalización básica",
        "Voces predeterminadas",
      ],
      limitations: ["Sin modelos RVC personalizados", "Sin historial de conversaciones", "Soporte limitado"],
      cta: "Comenzar gratis",
      popular: false,
    },
    {
      name: "Premium",
      description: "Para uso personal",
      price: { monthly: 9.99, yearly: 99.99 },
      features: [
        "Acceso a todos los terapeutas IA",
        "Conversaciones ilimitadas",
        "Personalización completa",
        "Soporte para modelos RVC",
        "Historial de conversaciones",
        "Soporte prioritario",
      ],
      limitations: [],
      cta: "Comenzar prueba gratuita",
      popular: true,
    },
    {
      name: "Familiar",
      description: "Para toda la familia",
      price: { monthly: 19.99, yearly: 199.99 },
      features: [
        "Todo lo incluido en Premium",
        "Hasta 5 perfiles diferentes",
        "Terapeutas personalizados para cada perfil",
        "Análisis de bienestar familiar",
        "Soporte premium 24/7",
      ],
      limitations: [],
      cta: "Comenzar prueba gratuita",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" className="mb-8 flex items-center" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Planes y precios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades. Todos los planes incluyen una prueba gratuita de 7
            días.
          </p>

          <div className="flex items-center justify-center mt-8">
            <div className="bg-muted p-1 rounded-full flex items-center">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                className={`rounded-full ${billingCycle === "monthly" ? "" : "text-muted-foreground"}`}
                onClick={() => setBillingCycle("monthly")}
              >
                Mensual
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                className={`rounded-full ${billingCycle === "yearly" ? "" : "text-muted-foreground"}`}
                onClick={() => setBillingCycle("yearly")}
              >
                Anual <span className="ml-1 text-xs font-normal">(-16%)</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${plan.popular ? "border-primary shadow-lg relative" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Más popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-3xl font-bold">
                    {plan.price[billingCycle] === 0 ? "Gratis" : `${plan.price[billingCycle].toFixed(2)}€`}
                  </span>
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-muted-foreground ml-1">/{billingCycle === "monthly" ? "mes" : "año"}</span>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Incluye:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <>
                      <p className="font-medium text-muted-foreground mt-4">Limitaciones:</p>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation) => (
                          <li key={limitation} className="flex items-start text-muted-foreground">
                            <span className="mr-2">-</span>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${plan.popular ? "bg-primary" : ""}`}
                  onClick={() => router.push("/therapists")}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Preguntas frecuentes</h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            <div className="text-left">
              <h3 className="font-medium mb-2">¿Puedo cancelar mi suscripción en cualquier momento?</h3>
              <p className="text-gray-600">
                Sí, puedes cancelar tu suscripción en cualquier momento. Si cancelas, mantendrás el acceso hasta el
                final del período de facturación.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-2">¿Cómo funciona la prueba gratuita?</h3>
              <p className="text-gray-600">
                Todos los planes de pago incluyen una prueba gratuita de 7 días. No se te cobrará hasta que finalice el
                período de prueba.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-2">¿Qué son los modelos RVC?</h3>
              <p className="text-gray-600">
                Los modelos RVC (Retrieval-based Voice Conversion) te permiten personalizar la voz de tu terapeuta IA
                utilizando archivos de voz personalizados.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-2">¿Mis conversaciones son privadas?</h3>
              <p className="text-gray-600">
                Sí, todas tus conversaciones son privadas y seguras. No compartimos tus datos con terceros ni utilizamos
                tus conversaciones para entrenar modelos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

