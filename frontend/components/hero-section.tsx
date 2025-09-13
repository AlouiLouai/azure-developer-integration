"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageCircle, Users, Building, Shield, Zap, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-primary-100/30" />

      <div className="container mx-auto text-center relative">
        {/* Badge */}
        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-primary-100 text-primary-700">
          <MessageCircle className="mr-2 h-4 w-4" />
          Enterprise Communication Platform
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-sans font-bold text-balance mb-6 leading-tight">
          Connect Your Team with{" "}
          <span className="text-blue-600">
            Seamless Communication
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform how your enterprise communicates with our secure messaging platform. Enable instant one-to-one
          conversations or create dedicated channels for teams, departments, and projects - all within your
          organization's secure environment.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="text-lg px-8 py-6 h-auto text-white"
            style={{ backgroundColor: "#2563eb" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            Start Messaging Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 h-auto bg-transparent border-primary-200 text-primary-700 hover:bg-primary-50"
          >
            <Users className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {[
            {
              title: "Direct Messaging",
              description:
                "Instant one-to-one conversations with colleagues. Share files, images, and collaborate in real-time with message history and search.",
              icon: <MessageCircle className="h-6 w-6 text-primary-600" />,
            },
            {
              title: "Team Channels",
              description:
                "Create organized channels for departments, projects, or topics. Keep conversations focused and accessible to the right team members.",
              icon: <Users className="h-6 w-6 text-primary-600" />,
            },
            {
              title: "Enterprise Security",
              description:
                "Bank-level encryption, compliance with industry standards, and administrative controls to keep your communications secure.",
              icon: <Shield className="h-6 w-6 text-primary-600" />,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-primary-100 rounded-lg p-6 text-left hover:shadow-lg transition-all duration-300 hover:border-primary-200"
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="font-sans font-semibold text-lg mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-primary-100 p-8 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Connect for Your Enterprise?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Lightning Fast",
                description: "Messages delivered instantly with real-time notifications and offline sync",
                icon: <Zap className="h-5 w-5 text-primary-600" />,
              },
              {
                title: "Global Scale",
                description: "Support for teams across multiple time zones with 99.9% uptime guarantee",
                icon: <Globe className="h-5 w-5 text-primary-600" />,
              },
              {
                title: "Easy Integration",
                description: "Seamlessly integrate with your existing enterprise tools and workflows",
                icon: <Building className="h-5 w-5 text-primary-600" />,
              },
            ].map((feature, index) => (
              <div key={index} className="text-left">
                <div className="flex items-center gap-3 mb-2">
                  {feature.icon}
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

