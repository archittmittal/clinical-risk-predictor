import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Clock, X, MessageSquare, Heart, Zap, ArrowLeft, ChevronUp } from 'lucide-react';

interface SupportProps {
  isOpen: boolean;
  onClose: () => void;
}

const Support: React.FC<SupportProps> = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<'email' | 'phone' | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide scroll-to-top button
  const handleScroll = () => {
    if (contentRef.current) {
      setShowScrollTop(contentRef.current.scrollTop > 100);
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Contact Information
  const EMAIL = 'support@clinicalriskpredictor.health';
  const PHONE_DISPLAY = '1-800-RISK-HELP'; // 1-800-7475-4357
  const WEBSITE = 'www.clinicalriskpredictor.ai';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with smooth animation */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'bg-black/30 dark:bg-black/50 opacity-100' : 'bg-black/0 dark:bg-black/0 opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal Container with smooth animation */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header with Gradient */}
          <div className="relative h-32 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 right-2 w-20 h-20 bg-white rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-300 rounded-full blur-3xl" />
            </div>
            <div className="relative h-full flex items-end p-6">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <Heart className="text-pink-200" size={28} />
                  We're Here to Help
                </h2>
                <p className="text-blue-100 mt-1 text-sm">24/7 Support for Your Clinical Needs</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 z-10 p-2.5 bg-white/20 hover:bg-white/40 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110 active:scale-95 group shadow-lg"
              aria-label="Close support"
              title="Close (ESC)"
            >
              <X size={20} className="text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div 
            ref={contentRef}
            onScroll={handleScroll}
            className="p-6 sm:p-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-slate-100 dark:scrollbar-track-slate-800 relative"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-blue-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                <Clock size={24} className="text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Response Time</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Under 2 Hours</p>
              </div>
              <div className="bg-green-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                <Zap size={24} className="text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Availability</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">24/7 Online</p>
              </div>
              <div className="bg-purple-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                <MessageSquare size={24} className="text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Languages</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">Multi-lingual</p>
              </div>
            </div>

            {/* Contact Options */}
            <div className="space-y-4 mb-8">
              {/* Email Option */}
              <div
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedOption === 'email'
                    ? 'border-blue-500 bg-blue-50 dark:bg-slate-700/50 dark:border-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
                onClick={() => setSelectedOption(selectedOption === 'email' ? null : 'email')}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Mail size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Email Support</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      For detailed inquiries and documentation
                    </p>
                    {selectedOption === 'email' && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">📧 Email Address:</p>
                        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg">
                          <code className="text-sm font-mono text-blue-600 dark:text-blue-400 font-semibold">
                            {EMAIL}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(EMAIL);
                              alert('Email copied to clipboard!');
                            }}
                            className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Option */}
              <div
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedOption === 'phone'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-slate-700/50 dark:border-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
                onClick={() => setSelectedOption(selectedOption === 'phone' ? null : 'phone')}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Phone size={24} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Toll-Free Hotline</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      For immediate assistance and urgent issues
                    </p>
                    {selectedOption === 'phone' && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">📞 Toll-Free Number:</p>
                        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg">
                          <code className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            {PHONE_DISPLAY}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(PHONE_DISPLAY);
                              alert('Phone number copied to clipboard!');
                            }}
                            className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-xs text-slate-600 dark:text-slate-400">
                          💡 Dial <span className="font-semibold">1-800-7475-4357</span> or use the mnemonic <span className="font-semibold text-emerald-600 dark:text-emerald-400">1-800-RISK-HELP</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 mb-8">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                >
                  <span className="text-lg">❓</span> Frequently Asked Questions
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                >
                  <span className="text-lg">📚</span> Knowledge Base & Documentation
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                >
                  <span className="text-lg">🐛</span> Report an Issue
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                >
                  <span className="text-lg">💬</span> Community Forum
                </a>
              </div>
            </div>

            {/* Footer Info */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization</p>
                  <p>Clinical Risk Predictor</p>
                  <p>AI-Powered Clinical Decision Support</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Web</p>
                  <p className="text-blue-600 dark:text-blue-400">{WEBSITE}</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">Available 24/7/365</p>
                </div>
              </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-20 right-8 z-50 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Scroll to top"
                title="Back to top"
              >
                <ChevronUp size={20} />
              </button>
            )}
          </div>

          {/* Close Button at Bottom */}
          <div className="px-6 sm:px-8 pb-6 flex gap-3 border-t border-slate-200 dark:border-slate-700 pt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-200 hover:shadow-md active:scale-95 flex items-center justify-center gap-2 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                window.location.href = `mailto:${EMAIL}?subject=Clinical Risk Predictor Support Request`;
              }}
              className="flex-1 px-4 py-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Mail size={18} className="group-hover:scale-110 transition-transform duration-200" />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
