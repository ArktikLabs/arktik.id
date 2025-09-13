"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./button"
import { Card } from "./card"
import { Play, RotateCcw, Send, Zap } from "lucide-react"

export function InteractiveDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showApp, setShowApp] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isArktikTyping, setIsArktikTyping] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Dynamic scenario generation data
  const businessTypes = [
    { 
      type: "startup", 
      businesses: ["AI fitness app", "food delivery service", "productivity tool", "meditation app", "language learning app", "project management tool"],
      layouts: ["hero-features", "centered-cta", "stats-focused"],
      templates: {
        greeting: ["Hey! I need a landing page for my startup", "I want to build a startup website", "Can you create a landing page for my new company?"],
        question: "What's your startup about?",
        styles: ["Modern, clean, with dark theme", "Minimalist and professional", "Bold and innovative", "Clean with bright colors"],
        features: [
          [{ name: "Smart Features", color: "bg-lime-400" }, { name: "Analytics", color: "bg-blue-400" }],
          [{ name: "Easy Setup", color: "bg-green-400" }, { name: "24/7 Support", color: "bg-purple-400" }],
          [{ name: "Fast & Secure", color: "bg-cyan-400" }, { name: "Mobile Ready", color: "bg-orange-400" }]
        ]
      }
    },
    { 
      type: "portfolio", 
      businesses: ["graphic designer", "photographer", "web developer", "architect", "writer", "illustrator"],
      layouts: ["grid-showcase", "sidebar-list", "masonry-style"],
      templates: {
        greeting: ["I need a portfolio site ASAP", "Can you build my portfolio website?", "I want to showcase my work online"],
        question: "What's your profession?",
        styles: ["Minimal and creative", "Bold and artistic", "Clean and professional", "Modern with personality"],
        projects: [
          [{ name: "Brand Identity", type: "Design" }, { name: "Web Design", type: "UI/UX" }, { name: "Print Work", type: "Graphics" }],
          [{ name: "Architecture", type: "3D" }, { name: "Interior Design", type: "Space" }, { name: "Concept Art", type: "Visual" }],
          [{ name: "Photography", type: "Portrait" }, { name: "Product Shots", type: "Commercial" }, { name: "Events", type: "Lifestyle" }]
        ]
      }
    },
    { 
      type: "ecommerce", 
      businesses: ["handmade jewelry", "organic skincare", "vintage clothing", "artisan coffee", "home decor", "tech accessories"],
      layouts: ["product-grid", "featured-hero", "category-tabs"],
      templates: {
        greeting: ["Can you build an e-commerce store?", "I need an online shop", "I want to sell products online"],
        question: "What products are you selling?",
        styles: ["Elegant and luxurious", "Modern and clean", "Rustic and authentic", "Bold and vibrant"],
        products: [
          [{ name: "Premium Product", price: "$299" }, { name: "Bestseller", price: "$199" }, { name: "Essential", price: "$149" }],
          [{ name: "Luxury Item", price: "$499" }, { name: "Popular Choice", price: "$299" }, { name: "Starter Pack", price: "$99" }],
          [{ name: "Pro Version", price: "$399" }, { name: "Standard", price: "$249" }, { name: "Basic", price: "$179" }]
        ]
      }
    },
    // Add new business types with different layouts
    {
      type: "saas",
      businesses: ["CRM platform", "analytics dashboard", "team collaboration tool", "design system", "API management", "automation platform"],
      layouts: ["dashboard-preview", "feature-comparison", "integration-focused", "pricing-tiers", "api-docs"],
      templates: {
        greeting: ["I need a SaaS landing page", "Can you build a software platform site?", "I want to launch our B2B product"],
        question: "What kind of software do you offer?",
        styles: ["Professional and trustworthy", "Modern with data visualization", "Clean and enterprise-focused", "Bold and tech-forward"],
        features: [
          [{ name: "Enterprise Grade", color: "bg-blue-400" }, { name: "99.9% Uptime", color: "bg-green-400" }],
          [{ name: "Real-time Analytics", color: "bg-purple-400" }, { name: "API Access", color: "bg-cyan-400" }],
          [{ name: "Team Collaboration", color: "bg-orange-400" }, { name: "Advanced Security", color: "bg-red-400" }]
        ]
      }
    },
    {
      type: "agency",
      businesses: ["marketing agency", "design studio", "consulting firm", "development agency", "branding company", "digital transformation"],
      layouts: ["case-study", "team-focused", "service-grid", "testimonial-hero", "process-timeline"],
      templates: {
        greeting: ["We need an agency website", "Can you build our company site?", "I want to showcase our services"],
        question: "What kind of agency are you?",
        styles: ["Professional and corporate", "Creative and bold", "Minimal and sophisticated", "Colorful and energetic"],
        services: [
          [{ name: "Strategy", icon: "📊" }, { name: "Design", icon: "🎨" }, { name: "Development", icon: "⚡" }],
          [{ name: "Marketing", icon: "📈" }, { name: "Branding", icon: "✨" }, { name: "Consulting", icon: "🤝" }],
          [{ name: "SEO", icon: "🔍" }, { name: "Content", icon: "📝" }, { name: "Analytics", icon: "📊" }]
        ]
      }
    },
    {
      type: "restaurant",
      businesses: ["fine dining restaurant", "coffee shop", "food truck", "bakery", "pizzeria", "sushi bar"],
      layouts: ["menu-showcase", "reservation-focused", "photo-gallery", "delivery-app"],
      templates: {
        greeting: ["I need a restaurant website", "Can you build a food business site?", "I want customers to find our menu online"],
        question: "What type of food business do you run?",
        styles: ["Warm and inviting", "Modern and clean", "Rustic and authentic", "Elegant and upscale"],
        dishes: [
          [{ name: "Signature Dish", price: "$24", category: "Main" }, { name: "Chef's Special", price: "$18", category: "Appetizer" }],
          [{ name: "House Favorite", price: "$32", category: "Premium" }, { name: "Daily Fresh", price: "$16", category: "Soup" }],
          [{ name: "Seasonal Menu", price: "$28", category: "Seasonal" }, { name: "Dessert Special", price: "$12", category: "Sweet" }]
        ]
      }
    },
    {
      type: "fitness",
      businesses: ["gym", "yoga studio", "personal training", "pilates studio", "crossfit box", "wellness center"],
      layouts: ["class-schedule", "trainer-profiles", "membership-plans", "transformation-gallery"],
      templates: {
        greeting: ["I need a fitness website", "Can you build a gym site?", "I want to showcase our fitness programs"],
        question: "What kind of fitness business do you operate?",
        styles: ["Energetic and motivating", "Calm and zen", "Bold and powerful", "Clean and minimal"],
        programs: [
          [{ name: "Strength Training", duration: "45 min", level: "Beginner" }, { name: "HIIT Workout", duration: "30 min", level: "Advanced" }],
          [{ name: "Yoga Flow", duration: "60 min", level: "All Levels" }, { name: "Pilates Core", duration: "45 min", level: "Intermediate" }],
          [{ name: "CrossFit WOD", duration: "50 min", level: "Advanced" }, { name: "Meditation", duration: "20 min", level: "Beginner" }]
        ]
      }
    },
    {
      type: "education",
      businesses: ["online course platform", "coding bootcamp", "language school", "university", "tutoring service", "skill academy"],
      layouts: ["course-catalog", "instructor-focused", "learning-path", "certification-showcase", "student-dashboard"],
      templates: {
        greeting: ["I need an education platform", "Can you build a learning site?", "I want to sell online courses"],
        question: "What type of education do you provide?",
        styles: ["Professional and academic", "Modern and engaging", "Friendly and approachable", "Serious and credible"],
        courses: [
          [{ name: "Web Development", students: "2.5K", rating: "4.8" }, { name: "Data Science", students: "1.8K", rating: "4.9" }],
          [{ name: "Digital Marketing", students: "3.2K", rating: "4.7" }, { name: "UI/UX Design", students: "1.9K", rating: "4.8" }],
          [{ name: "Machine Learning", students: "1.4K", rating: "4.9" }, { name: "Business Strategy", students: "2.1K", rating: "4.6" }]
        ]
      }
    },
    {
      type: "realestate",
      businesses: ["residential real estate", "commercial properties", "property management", "real estate investment", "luxury homes", "rental platform"],
      layouts: ["property-search", "agent-profiles", "neighborhood-guide", "virtual-tours", "investment-calculator"],
      templates: {
        greeting: ["I need a real estate website", "Can you build a property site?", "I want to showcase properties online"],
        question: "What type of real estate business are you in?",
        styles: ["Professional and trustworthy", "Luxury and elegant", "Modern and sleek", "Warm and welcoming"],
        properties: [
          [{ type: "House", price: "$450K", bedrooms: "3", bathrooms: "2" }, { type: "Condo", price: "$320K", bedrooms: "2", bathrooms: "1" }],
          [{ type: "Townhouse", price: "$680K", bedrooms: "4", bathrooms: "3" }, { type: "Apartment", price: "$280K", bedrooms: "1", bathrooms: "1" }],
          [{ type: "Villa", price: "$1.2M", bedrooms: "5", bathrooms: "4" }, { type: "Studio", price: "$180K", bedrooms: "1", bathrooms: "1" }]
        ]
      }
    },
    {
      type: "healthcare",
      businesses: ["medical practice", "dental clinic", "therapy center", "wellness clinic", "telemedicine", "mental health platform"],
      layouts: ["appointment-booking", "doctor-profiles", "services-overview", "patient-portal", "health-resources"],
      templates: {
        greeting: ["I need a healthcare website", "Can you build a medical site?", "I want patients to book appointments online"],
        question: "What type of healthcare service do you provide?",
        styles: ["Clean and trustworthy", "Calming and professional", "Modern and accessible", "Warm and caring"],
        services: [
          [{ name: "General Checkup", duration: "30 min", price: "$150" }, { name: "Dental Cleaning", duration: "45 min", price: "$120" }],
          [{ name: "Therapy Session", duration: "60 min", price: "$200" }, { name: "Consultation", duration: "15 min", price: "$80" }],
          [{ name: "Wellness Exam", duration: "45 min", price: "$180" }, { name: "Mental Health", duration: "50 min", price: "$220" }]
        ]
      }
    }
  ]

  const colors = ["lime", "blue", "purple", "green", "orange", "pink", "cyan", "yellow", "rose", "indigo"]

  // Simple hash function to convert string to number
  const hashString = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Better seeded random number generator using Linear Congruential Generator
  const createSeededRandom = (seed: number) => {
    let currentSeed = seed % 2147483647
    if (currentSeed <= 0) currentSeed += 2147483646
    
    return () => {
      currentSeed = currentSeed * 16807 % 2147483647
      return (currentSeed - 1) / 2147483646
    }
  }

  // Generate scenario with optional seed (string or number)
  const generateRandomScenario = (seed?: string | number) => {
    const random = seed !== undefined ? 
      createSeededRandom(typeof seed === 'string' ? hashString(seed) : seed) :
      Math.random

    const businessType = businessTypes[Math.floor(random() * businessTypes.length)]
    const business = businessType.businesses[Math.floor(random() * businessType.businesses.length)]
    const greeting = businessType.templates.greeting[Math.floor(random() * businessType.templates.greeting.length)]
    const style = businessType.templates.styles[Math.floor(random() * businessType.templates.styles.length)]
    
    // Generate company name
    const firstNames = ["Alex", "Sarah", "Mike", "Luna", "Tech", "Creative", "Smart", "Pro", "Digital", "Modern"]
    const lastParts = ["Co", "Labs", "Studio", "Works", "Inc", "Solutions", "Hub", "Craft", "Design", "Group"]
    const companyName = random() > 0.5 ? 
      `${firstNames[Math.floor(random() * firstNames.length)]} ${lastParts[Math.floor(random() * lastParts.length)]}` :
      `${business.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')} ${lastParts[Math.floor(random() * lastParts.length)]}`

    const messages = [
      { user: greeting, time: 0 },
      { arktik: businessType.templates.question, time: 1000 },
      { user: `${random() > 0.5 ? "We're building" : "I'm working on"} ${business}`, time: 2000 },
      { arktik: `${random() > 0.5 ? "Perfect!" : "Cool!"} ${random() > 0.5 ? "What style do you prefer?" : "Any specific vibe you want?"}`, time: 3000 },
      { user: style, time: 4000 },
      { arktik: `${random() > 0.5 ? "Gotcha, give me a minute..." : random() > 0.5 ? "Perfect, creating it now..." : "On it, building your " + businessType.type + "..."}`, time: 5000 },
    ]

    // Generate app data based on business type
    const selectedLayout = businessType.layouts[Math.floor(random() * businessType.layouts.length)]
    
    let app: any = {
      title: businessType.type === "portfolio" ? 
        `${firstNames[Math.floor(random() * firstNames.length)]} ${lastParts[Math.floor(random() * lastParts.length)].replace(/s$/, '')} - ${business.charAt(0).toUpperCase() + business.slice(1)}` :
        `${companyName} - ${business.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      layout: selectedLayout,
      businessType: businessType.type,
      url: `${companyName.toLowerCase().replace(/\s+/g, '-')}.${businessType.type === 'ecommerce' ? 'shop' : businessType.type === 'saas' ? 'app' : 'com'}`
    }

    // Add type-specific content
    if (businessType.type === "startup") {
      app.description = `${random() > 0.5 ? "Transform your" : "Revolutionize your"} ${business.includes('app') ? 'digital experience' : business} with ${random() > 0.5 ? 'cutting-edge' : 'innovative'} technology`
      app.features = businessType.templates.features?.[Math.floor(random() * businessType.templates.features.length)] || []
    } else if (businessType.type === "portfolio") {
      app.description = `${random() > 0.5 ? "Award-winning" : "Creative"} ${business} ${random() > 0.5 ? "that tells your story" : "bringing ideas to life"}`
      app.projects = businessType.templates.projects?.[Math.floor(random() * businessType.templates.projects.length)] || []
      app.features = [
        { name: "Portfolio", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` },
        { name: "Contact", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` }
      ]
    } else if (businessType.type === "ecommerce") {
      app.description = `Discover ${random() > 0.5 ? "premium" : "unique"} ${business} ${random() > 0.5 ? "crafted with love" : "made with precision"}`
      app.products = businessType.templates.products?.[Math.floor(random() * businessType.templates.products.length)] || []
      app.features = [
        { name: "Shop Now", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` },
        { name: "Collections", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` }
      ]
    } else if (businessType.type === "saas") {
      app.description = `${random() > 0.5 ? "Enterprise-grade" : "Powerful"} ${business} ${random() > 0.5 ? "trusted by teams worldwide" : "built for modern businesses"}`
      app.features = businessType.templates.features?.[Math.floor(random() * businessType.templates.features.length)] || []
      app.stats = [
        { label: "Active Users", value: `${Math.floor(random() * 50 + 10)}K+` },
        { label: "Uptime", value: "99.9%" },
        { label: "Countries", value: `${Math.floor(random() * 80 + 20)}+` }
      ]
    } else if (businessType.type === "agency") {
      app.description = `${random() > 0.5 ? "Award-winning" : "Full-service"} ${business} ${random() > 0.5 ? "delivering exceptional results" : "driving business growth"}`
      app.services = businessType.templates.services?.[Math.floor(random() * businessType.templates.services.length)] || []
      app.features = [
        { name: "Get Quote", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` },
        { name: "Our Work", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` }
      ]
    } else if (businessType.type === "restaurant") {
      app.description = `${random() > 0.5 ? "Authentic" : "Fresh"} ${business} ${random() > 0.5 ? "serving delicious meals daily" : "with flavors you'll love"}`
      app.dishes = businessType.templates.dishes?.[Math.floor(random() * businessType.templates.dishes.length)] || []
      app.features = [
        { name: "Order Now", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` },
        { name: "Menu", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` }
      ]
      app.hours = "Mon-Sat 9AM-10PM"
    } else if (businessType.type === "fitness") {
      app.description = `${random() > 0.5 ? "Transform your fitness" : "Achieve your goals"} at our ${business} ${random() > 0.5 ? "with expert guidance" : "in a supportive environment"}`
      app.programs = businessType.templates.programs?.[Math.floor(random() * businessType.templates.programs.length)] || []
      app.features = [
        { name: "Join Now", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` },
        { name: "Classes", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` }
      ]
      app.memberCount = `${Math.floor(random() * 500 + 100)}+ Members`
    } else if (businessType.type === "education") {
      app.description = `${random() > 0.5 ? "Learn from experts" : "Master new skills"} at our ${business} ${random() > 0.5 ? "with hands-on projects" : "and get certified"}`
      app.courses = businessType.templates.courses?.[Math.floor(random() * businessType.templates.courses.length)] || []
      app.features = [
        { name: "Enroll Now", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` },
        { name: "Courses", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` }
      ]
      app.studentCount = `${Math.floor(random() * 10 + 5)}K+ Students`
    } else if (businessType.type === "realestate") {
      app.description = `${random() > 0.5 ? "Find your dream home" : "Discover prime properties"} in ${business} ${random() > 0.5 ? "with expert guidance" : "at the best prices"}`
      app.properties = businessType.templates.properties?.[Math.floor(random() * businessType.templates.properties.length)] || []
      app.features = [
        { name: "Search Homes", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` },
        { name: "Contact Agent", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` }
      ]
      app.listingCount = `${Math.floor(random() * 500 + 50)}+ Properties`
    } else if (businessType.type === "healthcare") {
      app.description = `${random() > 0.5 ? "Comprehensive healthcare" : "Quality medical care"} at our ${business} ${random() > 0.5 ? "with experienced professionals" : "for your wellbeing"}`
      app.services = businessType.templates.services?.[Math.floor(random() * businessType.templates.services.length)] || []
      app.features = [
        { name: "Book Appointment", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` },
        { name: "Services", color: `bg-${colors[Math.floor(random() * colors.length)]}-400` }
      ]
      app.patientCount = `${Math.floor(random() * 2000 + 500)}+ Patients Served`
    }

    return { messages, app }
  }

  // Generate scenarios array with optional variant
  const [generatedScenarios] = useState(() => {
    // Check for scenario variant parameter
    const variantParam = typeof window !== 'undefined' ? 
      new URLSearchParams(window.location.search).get('s') : null
    
    if (variantParam) {
      // Use the string directly, or convert to number if it's numeric
      const seedValue = isNaN(Number(variantParam)) ? variantParam : Number(variantParam)
      return [
        generateRandomScenario(seedValue),
        generateRandomScenario(typeof seedValue === 'string' ? seedValue + '1' : seedValue + 1000), 
        generateRandomScenario(typeof seedValue === 'string' ? seedValue + '2' : seedValue + 2000)
      ]
    }
    
    return [
      generateRandomScenario(),
      generateRandomScenario(), 
      generateRandomScenario()
    ]
  })

  // Select scenario from the generated ones - use seeded selection when seed is provided
  const [selectedScenarioIndex] = useState(() => {
    const variantParam = typeof window !== 'undefined' ? 
      new URLSearchParams(window.location.search).get('s') : null
    
    if (variantParam) {
      // Use deterministic selection based on the seed
      const seedValue = isNaN(Number(variantParam)) ? variantParam : Number(variantParam)
      const baseSeed = typeof seedValue === 'string' ? hashString(seedValue) : seedValue
      return Math.abs(baseSeed) % generatedScenarios.length
    }
    
    return Math.floor(Math.random() * generatedScenarios.length)
  })
  
  const selectedScenario = generatedScenarios[selectedScenarioIndex]
  
  const chatMessages = selectedScenario.messages

  const [visibleMessages, setVisibleMessages] = useState<typeof chatMessages>([])

  // Auto-scroll whenever messages change
  useEffect(() => {
    if (chatContainerRef.current && visibleMessages.length > 0) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
      }, 50)
    }
  }, [visibleMessages])

  // Auto-scroll when arktik typing indicator appears
  useEffect(() => {
    if (isArktikTyping && chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
      }, 50)
    }
  }, [isArktikTyping])

  useEffect(() => {
    if (!isPlaying) return

    let currentMessageIndex = 0

    const showNextMessage = () => {
      if (currentMessageIndex >= chatMessages.length) {
        // All messages shown, now show loader after a longer delay
        setTimeout(() => {
          setShowLoader(true)
          setTimeout(() => {
            setShowLoader(false)
            setShowApp(true)
          }, 2000)
        }, 1500)
        return
      }

      const message = chatMessages[currentMessageIndex]
      
      if (message.user) {
        // For user messages, show typing animation first
        setIsTyping(true)
        setTypingText("")
        
        const text = message.user
        let currentChar = 0
        
        const typeInterval = setInterval(() => {
          if (currentChar < text.length) {
            setTypingText(text.substring(0, currentChar + 1))
            currentChar++
          } else {
            clearInterval(typeInterval)
            // After typing is complete, send the message
            setTimeout(() => {
              setIsTyping(false)
              setTypingText("")
              setVisibleMessages((prev: typeof chatMessages) => [...prev, message])
              currentMessageIndex++
              // Wait for animation to complete before next message
              setTimeout(showNextMessage, 600)
            }, 300)
          }
        }, 50)
        
      } else {
        // For arktik messages, show typing indicator first
        setIsArktikTyping(true)
        setTimeout(() => {
          setIsArktikTyping(false)
          setVisibleMessages((prev: typeof chatMessages) => [...prev, message])
          currentMessageIndex++
          // Wait for animation to complete before next message  
          setTimeout(showNextMessage, 600)
        }, 800)
      }
    }

    // Start the sequence immediately
    showNextMessage()
  }, [isPlaying])

  const handlePlay = () => {
    if (isPlaying) return
    setIsPlaying(true)
    setVisibleMessages([])
    setShowApp(false)
  }


  const handleNewDemo = () => {
    // Generate new random scenario number and update URL
    const newScenario = Math.floor(Math.random() * 100000)
    const url = new URL(window.location.href)
    url.searchParams.set('s', newScenario.toString())
    
    // Store flag to auto-start after page reload
    sessionStorage.setItem('autoStartDemo', 'true')
    window.location.href = url.toString()
  }

  // Demo states: idle -> playing -> completed
  const isDemoCompleted = showApp
  const isDemoIdle = !isPlaying && visibleMessages.length === 0

  // Auto-start demo if flag is set in sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldAutoStart = sessionStorage.getItem('autoStartDemo')
      if (shouldAutoStart === 'true' && isDemoIdle) {
        // Remove the flag after starting
        sessionStorage.removeItem('autoStartDemo')
        
        // Start the demo
        setTimeout(() => {
          handlePlay()
        }, 100)
      }
    }
  }, [isDemoIdle])

  return (
    <div className="relative">
      {/* Glowing background wrapper */}
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 backdrop-blur-sm">
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-lime-400/20 via-transparent to-lime-400/20 rounded-2xl animate-pulse"></div>
        

        <div className="w-96 relative z-10">
          {showLoader ? (
            <Card className="bg-slate-800 border-slate-600 h-96 shadow-2xl animate-in fade-in duration-300">
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="relative flex justify-center">
                    <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 flex justify-center">
                      <div className="w-20 h-20 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-white font-medium text-lg">Creating your app...</div>
                    <div className="text-slate-400 text-sm">This will take just a moment</div>
                  </div>
                  <div className="flex gap-1 justify-center">
                    <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </Card>
          ) : !showApp ? (
            <Card className="bg-slate-800 border-slate-600 h-96 shadow-2xl animate-in fade-in duration-300">
              <div className="p-4 border-b border-slate-600 flex items-center gap-3">
                <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-slate-900" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm"><span className="text-lime-green">arktik</span> team</div>
                  <div className="text-xs text-green-400">● online</div>
                </div>
              </div>
              
              <div ref={chatContainerRef} className="p-4 h-64 overflow-y-auto space-y-3">
                {visibleMessages.map((message: typeof chatMessages[0], index: number) => (
                  <div key={index} className={`flex ${message.user ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.user 
                        ? 'bg-lime-400 text-slate-900' 
                        : 'bg-slate-700 text-white'
                    }`}>
                      {message.user || message.arktik}
                    </div>
                  </div>
                ))}
                {isArktikTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 px-3 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 py-2 border-t border-slate-600">
                <div className="flex gap-2">
                  <input 
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg text-sm placeholder-slate-400"
                    placeholder={isTyping ? "" : "Message arktik team..."}
                    value={typingText}
                    disabled
                  />
                  <Button size="sm" disabled className={`${isTyping ? 'bg-lime-500 animate-pulse' : 'bg-lime-400'} text-slate-900`}>
                    <Send className={`w-4 h-4 ${isTyping ? 'animate-bounce' : ''}`} />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-slate-800 border-slate-600 h-96 overflow-hidden animate-in slide-in-from-bottom-4 duration-700 shadow-2xl">
              <div className="p-3 border-b border-slate-600 flex items-center gap-2 bg-slate-900">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-xs text-slate-400 ml-2">{selectedScenario.app.url}</div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 h-full">
                {/* STARTUP LAYOUTS */}
                {selectedScenario.app.layout === "hero-features" && (
                  <div className="space-y-4">
                    <div className="bg-lime-400 h-8 w-32 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-lg">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-sm">{selectedScenario.app.description}</div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {selectedScenario.app.features?.map((feature: any, index: number) => (
                        <div key={index} className="bg-slate-700 h-16 rounded-lg p-3">
                          <div className={`${feature.color} w-6 h-6 rounded mb-2`}></div>
                          <div className="text-white text-xs font-medium">{feature.name}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button className="bg-lime-400 text-slate-900 text-sm px-6 py-2 rounded-lg font-medium hover:bg-lime-300 transition-colors duration-200">
                        Get Started
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "centered-cta" && (
                  <div className="text-center space-y-4 flex flex-col items-center justify-center h-full">
                    <div className="bg-lime-400 h-10 w-40 rounded animate-pulse mx-auto"></div>
                    <div className="text-white font-bold text-xl">{selectedScenario.app.title?.split(' - ')[0]}</div>
                    <div className="text-slate-300 text-sm max-w-xs">{selectedScenario.app.description}</div>
                    
                    <div className="flex gap-2 mt-6">
                      <Button className="bg-lime-400 text-slate-900 text-sm px-8 py-3 rounded-lg font-medium hover:bg-lime-300 transition-colors duration-200">
                        Try Free
                      </Button>
                      <Button className="bg-transparent border border-slate-600 text-white text-sm px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors duration-200">
                        Learn More
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "stats-focused" && (
                  <div className="space-y-3">
                    <div className="bg-lime-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-slate-700 rounded-lg p-2 text-center">
                        <div className="text-lime-green font-bold text-lg">10K+</div>
                        <div className="text-white text-xs">Users</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-2 text-center">
                        <div className="text-lime-green font-bold text-lg">99.9%</div>
                        <div className="text-white text-xs">Uptime</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button className="bg-lime-400 text-slate-900 text-sm px-6 py-2 rounded-lg font-medium hover:bg-lime-300 transition-colors duration-200 w-full">
                        Start Building
                      </Button>
                    </div>
                  </div>
                )}

                {/* PORTFOLIO LAYOUTS */}
                {selectedScenario.app.layout === "grid-showcase" && (
                  <div className="space-y-3">
                    <div className="bg-purple-400 h-6 w-24 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {selectedScenario.app.projects?.map((project: any, index: number) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-2 aspect-square flex flex-col justify-center items-center">
                          <div className="text-white text-xs font-medium text-center">{project.name}</div>
                          <div className="text-purple-400 text-xs">{project.type}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button className="bg-purple-400 text-slate-900 text-xs px-4 py-2 rounded font-medium hover:bg-purple-300 transition-colors duration-200">
                        View All
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "sidebar-list" && (
                  <div className="space-y-3">
                    <div className="bg-purple-400 h-6 w-24 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      {selectedScenario.app.projects?.map((project: any, index: number) => (
                        <div key={index} className="flex justify-between items-center bg-slate-700 rounded-lg p-2">
                          <div className="text-white text-xs font-medium">{project.name}</div>
                          <div className="text-purple-400 text-xs">{project.type}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button className="bg-purple-400 text-slate-900 text-xs px-4 py-1 rounded font-medium hover:bg-purple-300 transition-colors duration-200">
                        Contact
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "masonry-style" && (
                  <div className="space-y-3">
                    <div className="bg-purple-400 h-6 w-24 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      {selectedScenario.app.projects?.map((project: any, index: number) => (
                        <div key={index} className={`bg-slate-700 rounded-lg p-2 ${index === 1 ? 'h-16' : 'h-12'} flex items-center justify-between`}>
                          <div className="text-white text-xs font-medium">{project.name}</div>
                          <div className="text-purple-400 text-xs">{project.type}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <Button className="bg-purple-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-purple-300 transition-colors duration-200 w-full">
                        Explore Work
                      </Button>
                    </div>
                  </div>
                )}

                {/* ECOMMERCE LAYOUTS */}
                {selectedScenario.app.layout === "product-grid" && (
                  <div className="space-y-3">
                    <div className="bg-yellow-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {selectedScenario.app.products?.slice(0, 2).map((product: any, index: number) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-2">
                          <div className="w-full h-8 bg-slate-600 rounded mb-2"></div>
                          <div className="text-white text-xs font-medium">{product.name}</div>
                          <div className="text-yellow-400 text-xs font-bold">{product.price}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <Button className="bg-yellow-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-yellow-300 transition-colors duration-200 w-full">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "featured-hero" && (
                  <div className="space-y-3">
                    <div className="bg-yellow-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="w-full h-16 bg-slate-600 rounded mb-2"></div>
                      <div className="text-white text-sm font-medium">Featured Product</div>
                      <div className="text-yellow-400 text-lg font-bold">$299</div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button className="bg-yellow-400 text-slate-900 text-xs px-4 py-2 rounded font-medium hover:bg-yellow-300 transition-colors duration-200">
                        Buy Now
                      </Button>
                      <Button className="bg-transparent border border-slate-600 text-white text-xs px-4 py-2 rounded font-medium hover:bg-slate-800 transition-colors duration-200">
                        View All
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "category-tabs" && (
                  <div className="space-y-3">
                    <div className="bg-yellow-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="flex gap-1 mt-4">
                      <div className="bg-yellow-400 text-slate-900 text-xs px-3 py-1 rounded font-medium">New</div>
                      <div className="bg-slate-700 text-white text-xs px-3 py-1 rounded font-medium">Popular</div>
                      <div className="bg-slate-700 text-white text-xs px-3 py-1 rounded font-medium">Sale</div>
                    </div>

                    <div className="space-y-2">
                      {selectedScenario.app.products?.map((product: any, index: number) => (
                        <div key={index} className="flex justify-between items-center bg-slate-700 rounded-lg p-2">
                          <div>
                            <div className="text-white text-xs font-medium">{product.name}</div>
                            <div className="text-yellow-400 text-xs font-bold">{product.price}</div>
                          </div>
                          <div className="w-8 h-6 bg-slate-600 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SAAS LAYOUTS */}
                {selectedScenario.app.layout === "dashboard-preview" && (
                  <div className="space-y-3">
                    <div className="bg-blue-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="flex gap-2 mb-2">
                        <div className="bg-blue-400 h-2 w-16 rounded"></div>
                        <div className="bg-green-400 h-2 w-12 rounded"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="bg-slate-600 h-8 rounded"></div>
                        <div className="bg-slate-600 h-8 rounded"></div>
                        <div className="bg-slate-600 h-8 rounded"></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button className="bg-blue-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-blue-300 transition-colors duration-200 w-full">
                        Start Free Trial
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "feature-comparison" && (
                  <div className="space-y-3">
                    <div className="bg-blue-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      {selectedScenario.app.features?.map((feature: any, index: number) => (
                        <div key={index} className="flex justify-between items-center bg-slate-700 rounded-lg p-2">
                          <div className="text-white text-xs font-medium">{feature.name}</div>
                          <div className="text-green-400 text-xs">✓</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <Button className="bg-blue-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-blue-300 transition-colors duration-200 w-full">
                        Compare Plans
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "integration-focused" && (
                  <div className="space-y-3">
                    <div className="bg-blue-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="text-center mt-4">
                      <div className="text-white text-xs mb-2">Integrates with:</div>
                      <div className="flex justify-center gap-2">
                        <div className="w-6 h-6 bg-slate-600 rounded"></div>
                        <div className="w-6 h-6 bg-slate-600 rounded"></div>
                        <div className="w-6 h-6 bg-slate-600 rounded"></div>
                        <div className="w-6 h-6 bg-slate-600 rounded"></div>
                      </div>
                    </div>

                    {selectedScenario.app.stats && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {selectedScenario.app.stats.map((stat: any, index: number) => (
                          <div key={index} className="bg-slate-700 rounded-lg p-2 text-center">
                            <div className="text-blue-400 font-bold text-sm">{stat.value}</div>
                            <div className="text-white text-xs">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4">
                      <Button className="bg-blue-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-blue-300 transition-colors duration-200 w-full">
                        Get API Key
                      </Button>
                    </div>
                  </div>
                )}

                {/* AGENCY LAYOUTS */}
                {selectedScenario.app.layout === "case-study" && (
                  <div className="space-y-3">
                    <div className="bg-orange-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="text-white text-xs font-medium mb-1">Latest Project</div>
                      <div className="text-orange-400 text-sm font-bold">250% ROI Increase</div>
                      <div className="text-slate-300 text-xs">E-commerce redesign</div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button className="bg-orange-400 text-slate-900 text-xs px-4 py-2 rounded font-medium hover:bg-orange-300 transition-colors duration-200">
                        View Case Study
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "team-focused" && (
                  <div className="space-y-3">
                    <div className="bg-orange-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="text-center mt-4">
                      <div className="text-white text-xs mb-2">Our Expert Team</div>
                      <div className="flex justify-center gap-1">
                        <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                        <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                        <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                      </div>
                      <div className="text-orange-400 text-xs mt-1">15+ Years Experience</div>
                    </div>

                    <div className="mt-4">
                      <Button className="bg-orange-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-orange-300 transition-colors duration-200 w-full">
                        Meet the Team
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "service-grid" && (
                  <div className="space-y-3">
                    <div className="bg-orange-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="grid grid-cols-3 gap-1 mt-4">
                      {selectedScenario.app.services?.map((service: any, index: number) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-2 text-center">
                          <div className="text-lg mb-1">{service.icon}</div>
                          <div className="text-white text-xs font-medium">{service.name}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <Button className="bg-orange-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-orange-300 transition-colors duration-200 w-full">
                        Get Quote
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "testimonial-hero" && (
                  <div className="space-y-3">
                    <div className="bg-orange-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4 border-l-4 border-orange-400">
                      <div className="text-white text-xs italic mb-2">"Amazing results! Revenue increased by 300% in just 6 months."</div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-600 rounded-full"></div>
                        <div>
                          <div className="text-orange-400 text-xs font-medium">Sarah Johnson</div>
                          <div className="text-slate-400 text-xs">CEO, TechCorp</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 mt-4">
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-orange-400 font-bold text-sm">150+</div>
                        <div className="text-white text-xs">Projects</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-orange-400 font-bold text-sm">98%</div>
                        <div className="text-white text-xs">Success</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-orange-400 font-bold text-sm">24h</div>
                        <div className="text-white text-xs">Response</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "process-timeline" && (
                  <div className="space-y-3">
                    <div className="bg-orange-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-slate-900 text-xs font-bold">1</div>
                        <div>
                          <div className="text-white text-xs font-medium">Discovery</div>
                          <div className="text-slate-400 text-xs">Understand your goals</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                        <div>
                          <div className="text-white text-xs font-medium">Strategy</div>
                          <div className="text-slate-400 text-xs">Plan the approach</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                        <div>
                          <div className="text-white text-xs font-medium">Execution</div>
                          <div className="text-slate-400 text-xs">Deliver results</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button className="bg-orange-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-orange-300 transition-colors duration-200 w-full">
                        Start Project
                      </Button>
                    </div>
                  </div>
                )}

                {/* NEW SAAS LAYOUTS */}
                {selectedScenario.app.layout === "pricing-tiers" && (
                  <div className="space-y-3">
                    <div className="bg-blue-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-slate-700 rounded-lg p-3 border-2 border-transparent">
                        <div className="text-white text-xs font-medium mb-1">Starter</div>
                        <div className="text-blue-400 text-lg font-bold mb-2">$29/mo</div>
                        <div className="space-y-1">
                          <div className="text-slate-300 text-xs">✓ 10K requests</div>
                          <div className="text-slate-300 text-xs">✓ Basic support</div>
                        </div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3 border-2 border-blue-400">
                        <div className="text-blue-400 text-xs font-medium mb-1">Pro</div>
                        <div className="text-blue-400 text-lg font-bold mb-2">$99/mo</div>
                        <div className="space-y-1">
                          <div className="text-slate-300 text-xs">✓ 100K requests</div>
                          <div className="text-slate-300 text-xs">✓ Priority support</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button className="bg-blue-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-blue-300 transition-colors duration-200 w-full">
                        Choose Plan
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "api-docs" && (
                  <div className="space-y-3">
                    <div className="bg-blue-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-800 rounded-lg p-3 mt-4 border border-slate-600">
                      <div className="text-green-400 text-xs font-mono mb-2">GET /api/users</div>
                      <div className="text-slate-400 text-xs mb-2">Fetch user data</div>
                      <div className="bg-slate-900 rounded p-2">
                        <div className="text-blue-300 text-xs font-mono">curl -X GET https://api.example.com/users</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-blue-400 font-bold text-sm">99.9%</div>
                        <div className="text-white text-xs">Uptime</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-blue-400 font-bold text-sm">&lt;100ms</div>
                        <div className="text-white text-xs">Response</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* RESTAURANT LAYOUTS */}
                {selectedScenario.app.layout === "menu-showcase" && (
                  <div className="space-y-3">
                    <div className="bg-amber-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      {selectedScenario.app.dishes?.map((dish: any, index: number) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-2 flex justify-between items-center">
                          <div>
                            <div className="text-white text-xs font-medium">{dish.name}</div>
                            <div className="text-amber-400 text-xs">{dish.category}</div>
                          </div>
                          <div className="text-amber-400 font-bold text-xs">{dish.price}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-amber-400 text-xs font-medium">{selectedScenario.app.hours}</div>
                    </div>

                    <div className="mt-4">
                      <Button className="bg-amber-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-amber-300 transition-colors duration-200 w-full">
                        Order Online
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "reservation-focused" && (
                  <div className="space-y-3">
                    <div className="bg-amber-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="text-white text-xs font-medium mb-2">Make a Reservation</div>
                      <div className="space-y-2">
                        <div className="bg-slate-800 rounded px-2 py-1">
                          <div className="text-slate-400 text-xs">Date: Today</div>
                        </div>
                        <div className="bg-slate-800 rounded px-2 py-1">
                          <div className="text-slate-400 text-xs">Time: 7:00 PM</div>
                        </div>
                        <div className="bg-slate-800 rounded px-2 py-1">
                          <div className="text-slate-400 text-xs">Guests: 2 people</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button className="bg-amber-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-amber-300 transition-colors duration-200 w-full">
                        Book Table
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "photo-gallery" && (
                  <div className="space-y-3">
                    <div className="bg-amber-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-slate-700 rounded-lg h-16 flex items-center justify-center">
                        <div className="w-8 h-8 bg-slate-600 rounded"></div>
                      </div>
                      <div className="bg-slate-700 rounded-lg h-16 flex items-center justify-center">
                        <div className="w-8 h-8 bg-slate-600 rounded"></div>
                      </div>
                      <div className="bg-slate-700 rounded-lg h-12 flex items-center justify-center col-span-2">
                        <div className="w-16 h-6 bg-slate-600 rounded"></div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-amber-400 text-xs font-medium">Visit us today!</div>
                      <div className="text-slate-300 text-xs">{selectedScenario.app.hours}</div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "delivery-app" && (
                  <div className="space-y-3">
                    <div className="bg-amber-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-green-600 rounded-lg p-2 text-center">
                      <div className="text-white text-xs font-medium">🚚 Free Delivery</div>
                      <div className="text-green-100 text-xs">Orders over $25</div>
                    </div>

                    <div className="space-y-1 mt-4">
                      {selectedScenario.app.dishes?.slice(0, 2).map((dish: any, index: number) => (
                        <div key={index} className="bg-slate-700 rounded p-2 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-600 rounded"></div>
                            <div>
                              <div className="text-white text-xs font-medium">{dish.name}</div>
                              <div className="text-amber-400 text-xs font-bold">{dish.price}</div>
                            </div>
                          </div>
                          <Button className="bg-amber-400 text-slate-900 text-xs px-2 py-1 rounded font-medium hover:bg-amber-300">
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FITNESS LAYOUTS */}
                {selectedScenario.app.layout === "class-schedule" && (
                  <div className="space-y-3">
                    <div className="bg-red-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      {selectedScenario.app.programs?.map((program: any, index: number) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-2">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-white text-xs font-medium">{program.name}</div>
                            <div className="text-red-400 text-xs">{program.duration}</div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-slate-400 text-xs">{program.level}</div>
                            <div className="text-slate-400 text-xs">9:00 AM</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-red-400 text-xs font-medium">{selectedScenario.app.memberCount}</div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "trainer-profiles" && (
                  <div className="space-y-3">
                    <div className="bg-red-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
                          <div>
                            <div className="text-white text-xs font-medium">Mike Johnson</div>
                            <div className="text-red-400 text-xs">Certified Trainer</div>
                          </div>
                        </div>
                        <div className="text-slate-300 text-xs">5+ years experience in strength training</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
                          <div>
                            <div className="text-white text-xs font-medium">Sarah Kim</div>
                            <div className="text-red-400 text-xs">Yoga Instructor</div>
                          </div>
                        </div>
                        <div className="text-slate-300 text-xs">Specializing in Vinyasa and Hatha yoga</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "membership-plans" && (
                  <div className="space-y-3">
                    <div className="bg-red-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="text-white text-xs font-medium mb-1">Basic</div>
                        <div className="text-red-400 text-lg font-bold mb-2">$29/mo</div>
                        <div className="space-y-1">
                          <div className="text-slate-300 text-xs">✓ Gym access</div>
                          <div className="text-slate-300 text-xs">✓ Locker room</div>
                        </div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3 border-2 border-red-400">
                        <div className="text-red-400 text-xs font-medium mb-1">Premium</div>
                        <div className="text-red-400 text-lg font-bold mb-2">$59/mo</div>
                        <div className="space-y-1">
                          <div className="text-slate-300 text-xs">✓ All classes</div>
                          <div className="text-slate-300 text-xs">✓ Personal trainer</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-red-400 text-xs font-medium">{selectedScenario.app.memberCount}</div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "transformation-gallery" && (
                  <div className="space-y-3">
                    <div className="bg-red-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-slate-700 rounded-lg p-3 text-center">
                        <div className="w-full h-12 bg-slate-600 rounded mb-2"></div>
                        <div className="text-white text-xs font-medium">Before</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3 text-center">
                        <div className="w-full h-12 bg-red-400 rounded mb-2"></div>
                        <div className="text-red-400 text-xs font-medium">After</div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="text-white text-xs font-medium mb-1">Success Story</div>
                      <div className="text-slate-300 text-xs">"Lost 30 pounds in 6 months with amazing trainers!"</div>
                      <div className="text-red-400 text-xs mt-1">- Jessica M.</div>
                    </div>
                  </div>
                )}

                {/* EDUCATION LAYOUTS */}
                {selectedScenario.app.layout === "course-catalog" && (
                  <div className="space-y-3">
                    <div className="bg-indigo-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      {selectedScenario.app.courses?.map((course: any, index: number) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-2">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-white text-xs font-medium">{course.name}</div>
                            <div className="flex items-center gap-1">
                              <div className="text-yellow-400 text-xs">★</div>
                              <div className="text-slate-300 text-xs">{course.rating}</div>
                            </div>
                          </div>
                          <div className="text-indigo-400 text-xs">{course.students} students enrolled</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-indigo-400 text-xs font-medium">{selectedScenario.app.studentCount}</div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "instructor-focused" && (
                  <div className="space-y-3">
                    <div className="bg-indigo-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-12 h-12 bg-slate-600 rounded-full"></div>
                        <div>
                          <div className="text-white text-xs font-medium">Dr. Sarah Wilson</div>
                          <div className="text-indigo-400 text-xs">Lead Instructor</div>
                          <div className="text-slate-300 text-xs">PhD in Computer Science</div>
                        </div>
                      </div>
                      <div className="text-slate-300 text-xs">"10+ years teaching experience with industry expertise"</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-indigo-400 font-bold text-sm">15+</div>
                        <div className="text-white text-xs">Courses</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-indigo-400 font-bold text-sm">4.9</div>
                        <div className="text-white text-xs">Rating</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-indigo-400 font-bold text-sm">50K+</div>
                        <div className="text-white text-xs">Students</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "learning-path" && (
                  <div className="space-y-3">
                    <div className="bg-indigo-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center text-slate-900 text-xs font-bold">1</div>
                        <div>
                          <div className="text-white text-xs font-medium">Fundamentals</div>
                          <div className="text-slate-400 text-xs">Learn the basics • 2 weeks</div>
                        </div>
                        <div className="ml-auto text-green-400 text-xs">✓</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center text-slate-900 text-xs font-bold">2</div>
                        <div>
                          <div className="text-white text-xs font-medium">Intermediate</div>
                          <div className="text-slate-400 text-xs">Build projects • 4 weeks</div>
                        </div>
                        <div className="ml-auto bg-indigo-400 rounded px-2 py-1 text-slate-900 text-xs">Current</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                        <div>
                          <div className="text-slate-400 text-xs font-medium">Advanced</div>
                          <div className="text-slate-500 text-xs">Master level • 6 weeks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "certification-showcase" && (
                  <div className="space-y-3">
                    <div className="bg-indigo-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg p-3 mt-4 text-center">
                      <div className="text-white text-xs font-medium mb-1">🏆 Certification</div>
                      <div className="text-white text-sm font-bold">Certified Developer</div>
                      <div className="text-indigo-100 text-xs">Industry Recognized</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-indigo-400 font-bold text-sm">95%</div>
                        <div className="text-white text-xs">Pass Rate</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-indigo-400 font-bold text-sm">3 months</div>
                        <div className="text-white text-xs">Duration</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "student-dashboard" && (
                  <div className="space-y-3">
                    <div className="bg-indigo-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="text-white text-xs font-medium mb-2">Your Progress</div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-slate-300 text-xs">Course Completion</div>
                        <div className="text-indigo-400 text-xs font-medium">75%</div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-indigo-400 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-indigo-400 font-bold text-sm">12</div>
                        <div className="text-white text-xs">Lessons Done</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-indigo-400 font-bold text-sm">4</div>
                        <div className="text-white text-xs">Projects Built</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* REAL ESTATE LAYOUTS */}
                {selectedScenario.app.layout === "property-search" && (
                  <div className="space-y-3">
                    <div className="bg-emerald-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-2 mb-4">
                      <div className="text-white text-xs font-medium mb-2">Search Properties</div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="bg-slate-800 rounded px-2 py-1 text-center">
                          <div className="text-slate-400 text-xs">$200K+</div>
                        </div>
                        <div className="bg-slate-800 rounded px-2 py-1 text-center">
                          <div className="text-slate-400 text-xs">2+ beds</div>
                        </div>
                        <div className="bg-slate-800 rounded px-2 py-1 text-center">
                          <div className="text-slate-400 text-xs">Any area</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedScenario.app.properties?.slice(0, 2).map((property: any, index: number) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-2">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <div className="text-white text-xs font-medium">{property.type}</div>
                              <div className="text-slate-400 text-xs">{property.bedrooms} bed • {property.bathrooms} bath</div>
                            </div>
                            <div className="text-emerald-400 font-bold text-xs">{property.price}</div>
                          </div>
                          <div className="w-full h-8 bg-slate-600 rounded mt-1"></div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-emerald-400 text-xs font-medium">{selectedScenario.app.listingCount}</div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "agent-profiles" && (
                  <div className="space-y-3">
                    <div className="bg-emerald-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-12 h-12 bg-slate-600 rounded-full"></div>
                        <div>
                          <div className="text-white text-xs font-medium">Jennifer Smith</div>
                          <div className="text-emerald-400 text-xs">Licensed Real Estate Agent</div>
                          <div className="text-slate-300 text-xs">15+ years experience</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="text-center">
                          <div className="text-emerald-400 font-bold text-sm">150+</div>
                          <div className="text-white text-xs">Sales</div>
                        </div>
                        <div className="text-center">
                          <div className="text-emerald-400 font-bold text-sm">4.9</div>
                          <div className="text-white text-xs">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-emerald-400 font-bold text-sm">$2M+</div>
                          <div className="text-white text-xs">Volume</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "neighborhood-guide" && (
                  <div className="space-y-3">
                    <div className="bg-emerald-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="text-white text-xs font-medium mb-2">Downtown Area</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="text-slate-300 text-xs">Avg. Price</div>
                          <div className="text-emerald-400 text-xs font-medium">$450K</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-slate-300 text-xs">Walk Score</div>
                          <div className="text-emerald-400 text-xs font-medium">95/100</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-slate-300 text-xs">Schools</div>
                          <div className="text-emerald-400 text-xs font-medium">Excellent</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-xs">🏪</div>
                        <div className="text-white text-xs">Shopping</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-xs">🚊</div>
                        <div className="text-white text-xs">Transit</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2 text-center">
                        <div className="text-xs">🏫</div>
                        <div className="text-white text-xs">Schools</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "virtual-tours" && (
                  <div className="space-y-3">
                    <div className="bg-emerald-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4 relative">
                      <div className="w-full h-20 bg-slate-600 rounded mb-2 flex items-center justify-center">
                        <div className="text-slate-400 text-xs">360° Virtual Tour</div>
                      </div>
                      <div className="absolute top-4 right-4 bg-emerald-400 rounded px-2 py-1">
                        <div className="text-slate-900 text-xs font-medium">LIVE</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      <div className="bg-slate-700 rounded p-1 text-center">
                        <div className="w-full h-8 bg-slate-600 rounded mb-1"></div>
                        <div className="text-white text-xs">Kitchen</div>
                      </div>
                      <div className="bg-slate-700 rounded p-1 text-center">
                        <div className="w-full h-8 bg-slate-600 rounded mb-1"></div>
                        <div className="text-white text-xs">Living</div>
                      </div>
                      <div className="bg-slate-700 rounded p-1 text-center">
                        <div className="w-full h-8 bg-slate-600 rounded mb-1"></div>
                        <div className="text-white text-xs">Bedroom</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "investment-calculator" && (
                  <div className="space-y-3">
                    <div className="bg-emerald-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="text-white text-xs font-medium mb-2">Investment Analysis</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="text-slate-300 text-xs">Property Value</div>
                          <div className="text-white text-xs font-medium">$450,000</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-slate-300 text-xs">Monthly Rent</div>
                          <div className="text-emerald-400 text-xs font-medium">$2,800</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-slate-300 text-xs">Cap Rate</div>
                          <div className="text-emerald-400 text-xs font-medium">7.5%</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-slate-300 text-xs">Cash Flow</div>
                          <div className="text-emerald-400 text-xs font-medium">+$1,200/mo</div>
                        </div>
                      </div>
                    </div>

                    <Button className="bg-emerald-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-emerald-300 transition-colors duration-200 w-full">
                      Calculate ROI
                    </Button>
                  </div>
                )}

                {/* HEALTHCARE LAYOUTS */}
                {selectedScenario.app.layout === "appointment-booking" && (
                  <div className="space-y-3">
                    <div className="bg-teal-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="text-white text-xs font-medium mb-2">Book Appointment</div>
                      <div className="space-y-2">
                        <div className="bg-slate-800 rounded px-2 py-1">
                          <div className="text-slate-400 text-xs">Select Service</div>
                          <div className="text-white text-xs">General Consultation</div>
                        </div>
                        <div className="bg-slate-800 rounded px-2 py-1">
                          <div className="text-slate-400 text-xs">Choose Date</div>
                          <div className="text-white text-xs">Tomorrow, 2:00 PM</div>
                        </div>
                        <div className="bg-slate-800 rounded px-2 py-1">
                          <div className="text-slate-400 text-xs">Doctor</div>
                          <div className="text-teal-400 text-xs">Dr. Sarah Johnson</div>
                        </div>
                      </div>
                    </div>

                    <Button className="bg-teal-400 text-slate-900 text-xs px-6 py-2 rounded font-medium hover:bg-teal-300 transition-colors duration-200 w-full">
                      Confirm Booking
                    </Button>
                  </div>
                )}

                {selectedScenario.app.layout === "doctor-profiles" && (
                  <div className="space-y-3">
                    <div className="bg-teal-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
                          <div>
                            <div className="text-white text-xs font-medium">Dr. Michael Chen</div>
                            <div className="text-teal-400 text-xs">Cardiologist</div>
                          </div>
                        </div>
                        <div className="text-slate-300 text-xs mb-1">15+ years experience</div>
                        <div className="flex items-center gap-2">
                          <div className="text-yellow-400 text-xs">★ 4.9</div>
                          <div className="text-slate-400 text-xs">Available Today</div>
                        </div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
                          <div>
                            <div className="text-white text-xs font-medium">Dr. Lisa Park</div>
                            <div className="text-teal-400 text-xs">Pediatrician</div>
                          </div>
                        </div>
                        <div className="text-slate-300 text-xs mb-1">10+ years experience</div>
                        <div className="flex items-center gap-2">
                          <div className="text-yellow-400 text-xs">★ 4.8</div>
                          <div className="text-slate-400 text-xs">Next: Tomorrow</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "services-overview" && (
                  <div className="space-y-3">
                    <div className="bg-teal-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      {selectedScenario.app.services?.map((service: any, index: number) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-2">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-white text-xs font-medium">{service.name}</div>
                            <div className="text-teal-400 font-bold text-xs">{service.price}</div>
                          </div>
                          <div className="text-slate-400 text-xs">{service.duration}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-teal-400 text-xs font-medium">{selectedScenario.app.patientCount}</div>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "patient-portal" && (
                  <div className="space-y-3">
                    <div className="bg-teal-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mt-4">
                      <div className="text-white text-xs font-medium mb-2">Your Health Dashboard</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-slate-300 text-xs">Upcoming Appointment</div>
                          <div className="text-teal-400 text-xs font-medium">Tomorrow 2PM</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-slate-300 text-xs">Test Results</div>
                          <div className="bg-green-600 rounded px-2 py-1 text-white text-xs">Available</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-slate-300 text-xs">Prescription</div>
                          <div className="text-slate-400 text-xs">Refill needed</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button className="bg-teal-400 text-slate-900 text-xs px-3 py-2 rounded font-medium hover:bg-teal-300">
                        View Records
                      </Button>
                      <Button className="bg-slate-600 text-white text-xs px-3 py-2 rounded font-medium hover:bg-slate-500">
                        Contact Doctor
                      </Button>
                    </div>
                  </div>
                )}

                {selectedScenario.app.layout === "health-resources" && (
                  <div className="space-y-3">
                    <div className="bg-teal-400 h-6 w-28 rounded animate-pulse"></div>
                    <div className="text-white font-bold text-base">{selectedScenario.app.title}</div>
                    <div className="text-slate-300 text-xs">{selectedScenario.app.description}</div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="text-white text-xs font-medium mb-1">Health Articles</div>
                        <div className="text-slate-300 text-xs mb-2">"5 Tips for Better Heart Health"</div>
                        <div className="text-teal-400 text-xs">Read more →</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="text-white text-xs font-medium mb-1">Wellness Tips</div>
                        <div className="text-slate-300 text-xs mb-2">"Managing Stress in Daily Life"</div>
                        <div className="text-teal-400 text-xs">Read more →</div>
                      </div>
                    </div>

                    <div className="bg-teal-700 rounded-lg p-3 text-center">
                      <div className="text-teal-100 text-xs font-medium">📞 24/7 Health Hotline</div>
                      <div className="text-white text-xs">(555) 123-HEALTH</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Dynamic floating button */}
        <div className="absolute top-4 right-4 z-20">
          {isDemoIdle && (
            <div className="group relative">
              <Button
                onClick={handlePlay}
                size="sm"
                className="w-10 h-10 rounded-full bg-lime-400 text-slate-900 hover:bg-lime-300 shadow-lg transition-all duration-200"
              >
                <Play className="w-4 h-4" />
              </Button>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Start demo
              </div>
            </div>
          )}
          
          {isDemoCompleted && (
            <div className="group relative">
              <Button
                onClick={handleNewDemo}
                size="sm"
                className="w-10 h-10 rounded-full bg-slate-700 text-white hover:bg-slate-600 shadow-lg transition-all duration-200 animate-in fade-in"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Try another demo
              </div>
            </div>
          )}
        </div>


        <div className="mt-6 text-center text-sm text-slate-400 relative z-10">
          From chat to app in seconds • Powered by <span className="text-lime-green">arktik</span>
        </div>
      </div>
    </div>
  )
}