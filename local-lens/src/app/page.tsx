"use client";
import React from 'react';
import { MapPin, Calendar, MessageSquare, Newspaper, Facebook, Twitter, Instagram } from 'lucide-react';

export default function LocalLensLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">LocalLens</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">Browse as Guest</button>
              <button className="text-blue-600 hover:text-blue-700">Log In</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  What's Happening{' '}
                  <span className="text-blue-600">Near You</span>{' '}
                  Right Now
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Discover local conversations, events, news, and trends from{' '}
                  <span className="text-blue-600">Reddit</span>,{' '}
                  <span className="text-blue-400">Twitter</span>,{' '}
                  <span className="text-green-600">Google Events</span>, and local news sources - all in one place.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Get Started Free
                </button>
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    ▶
                  </div>
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Real-time updates
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Multiple sources
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Location based
                </div>
              </div>
            </div>

            {/* Right Content - Globe with Floating Icons */}
            <div className="relative flex justify-center items-center">
              {/* Main Globe with floating animation */}
              <div className="relative animate-float">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 rounded-full shadow-2xl relative overflow-hidden">
                  {/* Globe dots pattern */}
                  <div className="absolute inset-0 opacity-30">
                      {[...Array(50)].map((_, i) => {
                        // Use the index to create consistent "random" positions
                        const left = ((i * 37) % 100);
                        const top = ((i * 71) % 100);
                        const delay = ((i * 0.1) % 2);
                        
                        return (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                            style={{
                              left: `${left}%`,
                              top: `${top}%`,
                              animationDelay: `${delay}s`
                            }}
                          />
                        );
                      })}
                    </div>
                  {/* Continents silhouette */}
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-1/4 left-1/3 w-16 h-12 bg-green-400 rounded-full transform rotate-12"></div>
                    <div className="absolute top-2/3 right-1/4 w-12 h-8 bg-green-400 rounded-full transform -rotate-45"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-8 h-6 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Floating Icons Around Globe */}
              {/* Social Media Icon - Top Left */}
              <div className="absolute top-8 left-8 animate-float-delay-1">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* News Icon - Top Right */}
              <div className="absolute top-12 right-4 animate-float-delay-2">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Event Icon - Right */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-float-delay-3">
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Location Icon - Bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-float-delay-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Additional floating icon - Left */}
              <div className="absolute left-4 top-2/3 animate-float-delay-5">
                <div className="w-6 h-6 bg-purple-500 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything Local, All in One Place
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay connected with your community through real-time aggregation of local content from multiple platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Reddit Posts */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reddit Posts</h3>
              <p className="text-gray-600">
                Local subreddit discussions and community conversations
              </p>
            </div>

            {/* Social Updates */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Twitter className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Updates</h3>
              <p className="text-gray-600">
                Real-time tweets and social media buzz from your area
              </p>
            </div>

            {/* Local Events */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Events</h3>
              <p className="text-gray-600">
                Upcoming events, meetups and activities near you
              </p>
            </div>

            {/* Local News */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local News</h3>
              <p className="text-gray-600">
                Breaking news and updates from local sources
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Explore Your Local Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users discovering what's happening in their neighborhood
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Exploring Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Browse as Guest
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LocalLens</h3>
              <p className="text-gray-400">
                Discover what's happening near you with our local aggregation platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 LocalLens. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delay-1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-delay-2 {
          0%, 100% {
            transform: translateY(-5px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-delay-3 {
          0%, 100% {
            transform: translateY(-3px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes float-delay-4 {
          0%, 100% {
            transform: translateY(-2px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delay-5 {
          0%, 100% {
            transform: translateY(-4px);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delay-1 {
          animation: float-delay-1 3.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-float-delay-2 {
          animation: float-delay-2 4.2s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-delay-3 {
          animation: float-delay-3 3.8s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .animate-float-delay-4 {
          animation: float-delay-4 4.1s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-float-delay-5 {
          animation: float-delay-5 3.6s ease-in-out infinite;
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
}