import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sparkles, Zap, BarChart3, Download, Shield, Palette, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Drag & Drop Builder",
      description: "Intuitive form builder with beautiful drag-and-drop interface",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Analytics",
      description: "Get intelligent insights and reports from your form data",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Comprehensive analytics dashboard with interactive charts",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Multiple Export Formats",
      description: "Export data in 14+ formats including PDF, Excel, and more",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with data validation",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Preview",
      description: "See your forms come to life with instant preview",
      color: "from-yellow-500 to-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/forms">View Forms</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Link href="/builder">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Form Builder
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                FormCraft AI
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Build beautiful, intelligent forms with drag-and-drop simplicity. Get AI-powered insights and export
                data in multiple formats.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6"
              >
                <Link href="/builder">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Building Forms
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/forms">View Examples</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">9+</div>
                <div className="text-sm text-muted-foreground">Field Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">14+</div>
                <div className="text-sm text-muted-foreground">Export Formats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">AI</div>
                <div className="text-sm text-muted-foreground">Powered Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, manage, and analyze forms with AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-4xl font-bold mb-4">Ready to build amazing forms?</CardTitle>
              <CardDescription className="text-xl mb-8">
                Join thousands of users creating beautiful, intelligent forms with FormCraft AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6"
                >
                  <Link href="/builder">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Started Free
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link href="/forms">View Examples</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free forever plan
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Setup in minutes
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <Logo className="justify-center mb-4" />
          <p className="text-muted-foreground">Built with ❤️ using Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}
