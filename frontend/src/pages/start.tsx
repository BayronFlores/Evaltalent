'use client';

import { motion } from 'framer-motion';
import { Button } from '../components/common/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/common/card';
import {
  Building2,
  Users,
  BarChart3,
  Target,
  CheckCircle,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
// import Image from 'next/image';

export function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Gestión de Usuarios',
      description:
        'Sistema completo de roles: Administradores, Managers y Empleados con permisos específicos.',
    },
    {
      icon: Target,
      title: 'Evaluaciones 360°',
      description:
        'Evaluaciones completas con autoevaluación, evaluación de manager y evaluación entre pares.',
    },
    {
      icon: BarChart3,
      title: 'Reportes y Analytics',
      description:
        'Dashboards interactivos con métricas de desempeño y reportes exportables en PDF.',
    },
    {
      icon: CheckCircle,
      title: 'Plantillas Personalizables',
      description:
        'Plantillas predefinidas de evaluación adaptables a diferentes roles y departamentos.',
    },
    {
      icon: Award,
      title: 'Ciclos de Evaluación',
      description:
        'Gestión completa de ciclos con fechas, asignaciones y seguimiento automático.',
    },
    {
      icon: Building2,
      title: 'Recomendaciones',
      description:
        'Sistema inteligente de recomendaciones de capacitación basado en resultados.',
    },
  ];

  const benefits = [
    'Digitalización completa del proceso de evaluación',
    'Transparencia y trazabilidad en las evaluaciones',
    'Reducción de tiempo administrativo en un 80%',
    'Mejora en la comunicación entre equipos',
    'Decisiones basadas en datos concretos',
    'Interfaz intuitiva y fácil de usar',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                EvalTalent
              </span>
            </div>
            <Link to="/login">
              <Button>
                Iniciar Sesión
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Gestión de <span className="text-primary">Evaluaciones</span>{' '}
                  de Desempeño
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Digitaliza y optimiza los procesos de evaluación de talento
                  humano en tu empresa con EvalTalent, la plataforma integral
                  para gestión de desempeño.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Ver Demo
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100+</div>
                  <div className="text-sm text-gray-600">
                    Empresas Confiando
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5000+</div>
                  <div className="text-sm text-gray-600">
                    Evaluaciones Realizadas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-gray-600">
                    Satisfacción de Usuarios
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <BarChart3 className="h-20 w-20 text-primary mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dashboard Interactivo
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Visualiza métricas y KPIs en tiempo real
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">
                    Evaluación Completada
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4"
              >
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Nuevo Logro</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Funcionalidades Completas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para gestionar evaluaciones de desempeño de
              manera eficiente y profesional
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  ¿Por qué elegir EvalTalent?
                </h2>
                <p className="text-xl text-gray-600">
                  Optimiza los procesos de evaluación de tu empresa y toma
                  decisiones basadas en datos concretos
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <Link to="/login">
                <Button size="lg">
                  Comenzar Evaluación Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">95%</div>
                    <div className="text-sm text-gray-600">
                      Reducción en tiempo de gestión
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">40%</div>
                    <div className="text-sm text-gray-600">
                      Mejora en productividad
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-gray-600">
                      Transparencia en evaluaciones
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-orange-600">
                      24/7
                    </div>
                    <div className="text-sm text-gray-600">
                      Disponibilidad del sistema
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-black">
              ¿Listo para transformar las evaluaciones en tu empresa?
            </h2>
            <p className="text-xl text-blue-500">
              Únete a más de 100 empresas que ya confían en EvalTalent para
              gestionar el desempeño de sus equipos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Empezar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-white">EvalTalent</span>
              </div>
              <p className="text-gray-400">
                Plataforma integral para la gestión de evaluaciones de desempeño
                empresarial
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Funcionalidades
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Integraciones
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Estado del Sistema
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 EvalTalent. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
