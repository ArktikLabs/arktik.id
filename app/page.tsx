'use client'

import React, { useState } from 'react'
import { Mail, Code, Zap, Shield, ArrowRight, CheckCircle, Linkedin, Github, Twitter, Facebook } from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            ARKTIK
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <a 
            href="https://linkedin.com/company/arktik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:bg-white/10 rounded-lg"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a 
            href="https://github.com/arktik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
          >
            <Github className="w-5 h-5" />
          </a>
          <a 
            href="https://x.com/arktik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:bg-white/10 rounded-lg"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a 
            href="https://facebook.com/arktik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-blue-500 transition-colors duration-300 hover:bg-white/10 rounded-lg"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Coming Soon
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Innovative
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Software Solutions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            We&apos;re crafting cutting-edge software solutions that transform businesses and drive innovation. 
            Get ready for something extraordinary.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-6xl mx-auto">
            <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Development</h3>
              <p className="text-slate-400 text-sm">Tailored software solutions built to your exact specifications and requirements.</p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Optimized</h3>
              <p className="text-slate-400 text-sm">Lightning-fast applications designed for optimal performance and user experience.</p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
              <p className="text-slate-400 text-sm">Bank-level security protocols to protect your data and ensure compliance.</p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-slate-400 text-sm">Round-the-clock technical support and maintenance for your peace of mind.</p>
            </div>
          </div>

          {/* Email Signup */}
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Be the first to know</h3>
            <p className="text-slate-400 mb-6">Join our waitlist and get exclusive early access to our platform.</p>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 flex items-center justify-center group"
                >
                  Notify Me
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center p-4 bg-green-500/20 border border-green-400/30 rounded-xl text-green-300">
                <CheckCircle className="w-5 h-5 mr-2" />
                Thanks! We&apos;ll keep you updated.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>&copy; 2025 Arktik. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span>Launching Q3 2025</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>In Development</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}