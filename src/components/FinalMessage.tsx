'use client'

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import CustomVideoPlayer from './CustomVideoPlayer';

const FinalMessage: React.FC = () => {
  const [showContent, setShowContent] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    // After 8 seconds, hide the content and show the dialog
    const timer = setTimeout(() => {
      setShowContent(false);
      setShowDialog(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleShowProposal = () => {
    setShowDialog(false);
    setShowProposal(true);
  };

  const handleResponse = (answer: string) => {
    setResponse(answer);
    setShowProposal(false);
  };

  // Messages array for floating text
  const messages = Array(30).fill(null).map((_, index) => ({
    text: index % 2 === 0 ? 'Eu te amo' : 'Eu te amo muito',
    animationClass: `animate-float-${index % 5}`,
    position: {
      left: `${Math.random() * 80}%`,
      top: `${Math.random() * 80}%`,
    },
  }));

  if (response) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        {response === 'yes' ? (
          <div className="relative w-full max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="relative rounded-xl overflow-hidden shadow-2xl mb-4">
              <CustomVideoPlayer src="/src/assets/darling.mp4" />
            </div>
            
            <div className="text-center mt-4 bg-white/80 dark:bg-gray-800/80 px-6 py-3 rounded-full backdrop-blur-sm">
              <p className="text-pink-600 dark:text-pink-400 font-semibold text-lg">
                ❤️ Obrigado por dizer sim! ❤️
              </p>
            </div>
            
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute animate-float-${i % 5} text-pink-500`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0.6,
                  }}
                >
                  ❤️
                </div>
              ))}
            </div>
          </div>
        ) : (
          <img
            src="https://www.omelete.com.br/webstories/animes-para-chorar/assets/2.gif"
            alt="Sad GIF"
            className="max-w-full max-h-full rounded-lg"
          />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Original content */}
      {showContent && (
        <>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`absolute ${message.animationClass} flex items-center gap-2`}
              style={{
                left: message.position.left,
                top: message.position.top,
                opacity: 0.7,
              }}
            >
              <span className="text-pink-500 dark:text-pink-400 font-semibold text-lg">
                {message.text}
              </span>
              <Heart className="text-pink-500 dark:text-pink-400" size={16} fill="#EC4899" />
            </div>
          ))}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
            <div className="animate-float bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 p-8 rounded-lg shadow-lg">
              <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4">
                Feliz Aniversário! ✨
              </h1>
              <p className="text-2xl text-pink-500 dark:text-pink-400">
                Eu te amo infinitamente! ❤️
              </p>
            </div>
          </div>
        </>
      )}

      {/* Dialog for last message */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-pink-600 dark:text-pink-400">
              Você quer ver a última mensagem?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleShowProposal}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Sim, quero ver!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Proposal animation */}
      {showProposal && (
        <div className="fixed inset-0 flex flex-col items-center justify-center space-y-8 animate-slide-up">
          <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            Quer namorar comigo? ❤️
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => handleResponse('yes')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl"
            >
              Sim
            </Button>
            <Button
              onClick={() => handleResponse('no')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-xl"
            >
              Não
            </Button>
          </div>
        </div>
      )}

      {/* Add slide-up animation */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FinalMessage;