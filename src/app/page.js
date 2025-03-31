"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Cpu, Activity, Link, ArrowRight, MousePointer } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {    
    if (heroRef.current) {
      heroRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
  }, [scrollY]);

  const navigateToTool = () => {
    window.location.href = "/tool";
  };

  return (
    <main className="relative cursor-none">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 pt-16">
        <div 
          ref={heroRef}
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/hero-bg.jpg')", 
            opacity: 0.2,
          }}
        ></div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
          <h1 className="text-[10vw] md:text-[8vw] font-extrabold text-white leading-none tracking-tighter mb-4 text-center">
            <span className="block">Mock APIs,</span>
            <span className="block">Simplified</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl text-center mb-12 font-light">
            The ultimate tool for creating, testing, and sharing mock APIs.
          </p>
          
          <Button
            className="group px-8 py-6 text-lg bg-white text-blue-600 font-medium hover:bg-white/90 rounded-full flex items-center gap-2"
            onClick={navigateToTool}
          >
            Get Started
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <div className="absolute bottom-10 w-full flex justify-center animate-bounce">
            <MousePointer className="w-6 h-6 text-white/70" />
          </div>
        </div>
      </section>
      
      {/* Marquee Text */}
      <div className="py-12 bg-white overflow-hidden">
        <div className="whitespace-nowrap animate-marquee">
          <span className="text-7xl font-bold text-blue-600/10 mx-4">CREATE</span>
          <span className="text-7xl font-bold text-purple-600/10 mx-4">TEST</span>
          <span className="text-7xl font-bold text-indigo-700/10 mx-4">SHARE</span>
          <span className="text-7xl font-bold text-blue-600/10 mx-4">DEVELOP</span>
          <span className="text-7xl font-bold text-purple-600/10 mx-4">CREATE</span>
          <span className="text-7xl font-bold text-indigo-700/10 mx-4">TEST</span>
          <span className="text-7xl font-bold text-blue-600/10 mx-4">SHARE</span>
          <span className="text-7xl font-bold text-purple-600/10 mx-4">DEVELOP</span>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="w-full py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-24 text-center">Why <span className="text-blue-600">Choose</span> Mocktopus?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="group md:w-75">
              <div className="aspect-square md:h-70 bg-gray-100 rounded-3xl mb-10 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Cpu className="text-blue-600 w-20 h-20" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Instant Mock APIs</h3>
              <p className="text-gray-600">
                Create mock APIs in seconds with customizable endpoints, methods, and responses.
              </p>
            </div>
            
            <div className="group md:w-75">
              <div className="aspect-square md:h-70 bg-gray-100 rounded-3xl mb-10 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                <Activity className="text-purple-600 w-20 h-20" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Chaos Testing</h3>
              <p className="text-gray-600">
                Simulate real-world scenarios with chaos mode and adjustable response delays.
              </p>
            </div>
            
            <div className="group md:w-75">
              <div className="aspect-square md:h-70 bg-gray-100 rounded-3xl mb-10 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                <Link className="text-indigo-600 w-20 h-20" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Shareable URLs</h3>
              <p className="text-gray-600">
                Share your mock APIs with your team using unique, shareable URLs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-24 text-center">How It <span className="text-blue-600">Works</span>?</h2>
          
          <div className="relative">
            <div className="absolute top-0 left-1/2 h-full w-px bg-gray-200 -translate-x-1/2 md:block hidden"></div>
            
            <div className="space-y-40">
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-16 mb-10 md:mb-0">
                  <span className="inline-block text-6xl font-bold text-blue-600/20 mb-4">01</span>
                  <h3 className="text-3xl font-semibold mb-6">Configure</h3>
                  <p className="text-gray-600 text-lg">
                    Set up your API endpoint, HTTP method, status code, and response template with our intuitive interface.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="aspect-video bg-gray-100 rounded-lg">
                    <Image src="/configure.png" alt="Configure API" className="object-cover rounded-lg" width={306} height={390}/>
                  </div>
                </div>
              </div>
              
              <div className="md:flex items-center flex-row-reverse">
                <div className="md:w-1/2 md:pl-16 mb-10 md:mb-0">
                  <span className="inline-block text-6xl font-bold text-purple-600/20 mb-4">02</span>
                  <h3 className="text-3xl font-semibold mb-6">Generate</h3>
                  <p className="text-gray-600 text-lg">
                    Click &ldquo;Generate Mock API&rdquo; to create your mock API instantly and receive a unique endpoint.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="aspect-video bg-gray-100 rounded-lg">
                    <Image src="/generate.png" alt="Generate API" className="object-cover rounded-lg" width={306} height={390}/>
                  </div>
                </div>
              </div>
              
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-16 mb-10 md:mb-0">
                  <span className="inline-block text-6xl font-bold text-indigo-600/20 mb-4">03</span>
                  <h3 className="text-3xl font-semibold mb-6">Test & Share</h3>
                  <p className="text-gray-600 text-lg">
                    Use the mock API URL to test your frontend or share it with your team for seamless collaboration.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="aspect-video bg-gray-100 rounded-lg">
                    <Image src="/preview.png" alt="Test and Share API" className="object-cover rounded-lg" width={306} height={390}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-40 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl font-bold mb-10">Ready to Transform Your API Development?</h2>
          <p className="text-xl mb-12 font-light">
            Join thousands of developers who use Mocktopus to streamline their development and testing workflows.
          </p>
          <Button
            className="group px-10 py-6 text-lg bg-white text-blue-600 font-medium hover:bg-white/90 rounded-full flex items-center gap-2 mx-auto"
            onClick={navigateToTool}
          >
            Start Creating Mock APIs
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-16 bg-gray-900 text-white">
          <div className="pt-12 mt-12 border-t border-gray-800 text-gray-400 text-sm">
            <div className="flex flex-col items-start justify-center max-w-4xl mx-auto px-4">
            <div className="text-3xl font-bold mb-8">Mocktopus</div>
              <p className="text-gray-400 mb-6">
                The ultimate tool for creating, testing, and sharing mock APIs.
              </p>
                <a href="https://www.github.com/ferrary7" target="_blank" className="text-gray-400 hover:text-white transition-colors mb-6">GitHub</a>
            © {new Date().getFullYear()} Mocktopus. All rights reserved.
            </div>
          </div>
      </footer>
    </main>
  );
}
