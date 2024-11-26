// TreasureHunt.tsx

import React, { useState, useEffect, Suspense } from 'react';
import { Heart, Music, Palette, Stars, Calendar, Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FinalMessage from './FinalMessage';

// Estilos de animação personalizados
const customAnimations = `
  @keyframes float-0 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(10px, -10px) rotate(5deg); }
    50% { transform: translate(0, -20px) rotate(0deg); }
    75% { transform: translate(-10px, -10px) rotate(-5deg); }
  }

  @keyframes float-1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(-15px, -15px) rotate(-5deg); }
    50% { transform: translate(0, -25px) rotate(0deg); }
    75% { transform: translate(15px, -15px) rotate(5deg); }
  }

  @keyframes float-2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(20px, -5px) rotate(3deg); }
    50% { transform: translate(0, -15px) rotate(0deg); }
    75% { transform: translate(-20px, -5px) rotate(-3deg); }
  }

  @keyframes float-3 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(-8px, -20px) rotate(-8deg); }
    50% { transform: translate(0, -30px) rotate(0deg); }
    75% { transform: translate(8px, -20px) rotate(8deg); }
  }

  @keyframes float-4 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(12px, -12px) rotate(6deg); }
    50% { transform: translate(0, -22px) rotate(0deg); }
    75% { transform: translate(-12px, -12px) rotate(-6deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-float-0 { animation: float-0 6s ease-in-out infinite; }
  .animate-float-1 { animation: float-1 7s ease-in-out infinite; }
  .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
  .animate-float-3 { animation: float-3 9s ease-in-out infinite; }
  .animate-float-4 { animation: float-4 10s ease-in-out infinite; }
  .animate-float { animation: float-0 5s ease-in-out infinite; }
  .animate-fade-in { animation: fadeIn 2s ease-out; }
`;

// Adicionando os estilos ao head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = customAnimations;
  document.head.appendChild(style);
}

interface Phase {
  question: string;
  hint: string;
  answer: string;
}

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => (
  <div className="fixed inset-0 w-full min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
      {children}
    </div>
  </div>
);

const TreasureHunt: React.FC = () => {
  // Estado para gerenciar o tema
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPrefs = window.localStorage.getItem('theme');
      if (typeof storedPrefs === 'string') {
        return storedPrefs as 'light' | 'dark';
      }
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Efeito para aplicar a classe 'dark' ao elemento <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Estados existentes
  const [currentPhase, setCurrentPhase] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showVoucher, setShowVoucher] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Fases do jogo
  const phases: Phase[] = [
    {
      question: "Em que data a gente se conheceu?",
      hint: "Foi naquele DM especial no Twitter... 🎵",
      answer: "02/08/2024"
    },
    {
      question: "Em que data fizemos nossa primeira call e quanto tempo ela durou? Responda neste formato: dia/mês/ano espaço hora, exemplo: 14/12/2001 1 hora",
      hint: "As estrelas estavam lindas naquela noite... ✨",
      answer: "06/08/2024 1 hora"
    },
    {
      question: "Qual é o seu apelido carinhoso que só eu uso com você?",
      hint: "Começou depois daquele dia engraçado... 💝",
      answer: "meu bem"
    }
  ];

  const formatDate = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formata a data automaticamente
    let formattedDate = '';
    if (numbers.length > 0) {
      // Adiciona o dia
      formattedDate = numbers.substring(0, 2);
      
      // Adiciona o mês
      if (numbers.length > 2) {
        formattedDate += '/' + numbers.substring(2, 4);
      }
      
      // Adiciona o ano
      if (numbers.length > 4) {
        formattedDate += '/' + numbers.substring(4, 8);
      }
    }
    
    return formattedDate;
  };

  // Para a segunda fase, vamos criar uma função específica que inclui a hora
  const formatDateWithTime = (value: string) => {
    // Separa a data da hora se houver espaço
    let [datePart, timePart] = value.split(' ');
    
    // Formata a parte da data
    const formattedDate = formatDate(datePart || '');
    
    // Adiciona automaticamente o espaço quando a data está completa
    if (formattedDate.length === 10 && !value.includes(' ')) {
      return `${formattedDate} `;
    }
    
    // Se tiver a parte da hora
    if (timePart) {
      // Verifica se é um número
      const hourNumber = timePart.match(/^\d+/);
      if (hourNumber) {
        // Se for apenas o número, adiciona " hora" automaticamente
        if (timePart === hourNumber[0]) {
          return `${formattedDate} ${hourNumber[0]} hora`;
        }
      }
      return `${formattedDate} ${timePart}`;
    }
    
    return formattedDate;
  };

  // Função para lidar com as respostas
  const handleAnswer = (phase: number, answer: string) => {
    let formattedAnswer = answer;
    
    if (phase === 0) {
      formattedAnswer = formatDate(answer);
    } else if (phase === 1) {
      // Se for a segunda fase, aplica a formatação especial
      formattedAnswer = formatDateWithTime(answer);
    }
    
    const newAnswers = { ...answers, [phase]: formattedAnswer };
    setAnswers(newAnswers);

    // Verifica se a resposta está correta
    if (formattedAnswer.toLowerCase() === phases[phase].answer.toLowerCase()) {
      if (phase === phases.length - 1) {
        setShowVoucher(true);
      } else {
        setCurrentPhase(currentPhase + 1);
      }
    }
  };

  // Componente Voucher
  const Voucher: React.FC = () => (
    <PageContainer>
      <div className="w-full max-w-lg">
        <Card className="relative border-4 border-pink-300 transform hover:scale-105 transition-transform duration-300 bg-white dark:bg-gray-800">
          <div className="absolute -top-4 -left-4">
            <Heart className="text-pink-500" size={32} fill="#EC4899" />
          </div>
          <div className="absolute -top-4 -right-4">
            <Heart className="text-pink-500" size={32} fill="#EC4899" />
          </div>
          <div className="absolute -bottom-4 -left-4">
            <Heart className="text-pink-500" size={32} fill="#EC4899" />
          </div>
          <div className="absolute -bottom-4 -right-4">
            <Heart className="text-pink-500" size={32} fill="#EC4899" />
          </div>

          <CardHeader>
            <CardTitle className="text-center text-pink-600 dark:text-pink-400">
              ✨ Cupom Especial de Aniversário ✨
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-pink-300 p-4 rounded-lg bg-white dark:bg-gray-700">
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
                Este cupom dá direito a:
              </p>
              <p className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4">
                Um dia inteiro com o Matheus fazendo TUDO que você quiser! 💝
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-300 italic">
                *Válido quando quiser
                <br />
                *Sem limites de pedidos
                <br />
                *Com todo meu amor
              </div>
            </div>
            <Button
              onClick={() => setShowExtra(true)}
              className="w-full mt-6 bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
            >
              Descobrir Surpresa Extra! ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );

  // Componente ExtraPhase
  const ExtraPhase: React.FC = () => {
    const [selectedDialog, setSelectedDialog] = useState<string | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [viewedItems, setViewedItems] = useState<Set<string>>(new Set());
    const [showSurpriseVideo, setShowSurpriseVideo] = useState(false);

    const handleDialogClose = () => {
      // Adiciona o item atual ao conjunto de itens vistos
      if (selectedDialog) {
        const newViewedItems = new Set(viewedItems);
        newViewedItems.add(selectedDialog);
        setViewedItems(newViewedItems);

        // Se todos os itens foram vistos e está fechando o último dialog
        if (newViewedItems.size === 4) {
          // Pequeno delay para mostrar o vídeo surpresa após fechar o dialog atual
          setTimeout(() => {
            setShowSurpriseVideo(true);
          }, 500);
        }
      }
      setSelectedDialog(null);
    };

    const dialogContent: Record<string, React.ReactNode> = {
      music: (
        <div className="w-full aspect-video">
          <video
            controls
            className="w-full h-full rounded-lg"
            src="/src/assets/music-video.mp4"
          />
        </div>
      ),
      color: (
        <div className="text-center py-8">
          <span className="text-yellow-400 text-4xl font-bold">
            Amarelo
          </span>
        </div>
      ),
      smile: (
        <div className="w-full">
          <img
            src="/src/assets/img/smile.jpeg"
            alt="Sorriso"
            className="w-full rounded-lg"
          />
        </div>
      ),
      moments: (
        <div className="w-full">
          <Carousel className="w-full max-w-3xl mx-auto px-12">
            <CarouselContent>
              {[1, 2, 3].map((index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card
                      className="border-0 shadow-none bg-transparent cursor-pointer transform transition-transform hover:scale-105"
                      onClick={() => {
                        const audio = new Audio('/src/assets/click.mp3');
                        audio.play();
                        setExpandedImage(`/src/assets/img/moment${index}.jpeg`);
                      }}
                    >
                      <CardContent className="flex items-center justify-center p-0">
                        <img
                          src={`/src/assets/img/moment${index}.jpeg`}
                          alt={`Momento ${index}`}
                          className="w-full h-96 object-contain rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-purple-500 hover:text-purple-600 bg-purple-100 hover:bg-purple-200 -ml-4" />
            <CarouselNext className="text-purple-500 hover:text-purple-600 bg-purple-100 hover:bg-purple-200 -mr-4" />
          </Carousel>

          <Dialog open={!!expandedImage} onOpenChange={() => setExpandedImage(null)}>
            <DialogContent className="max-w-5xl max-h-[90vh] bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-0 [&>button]:bg-purple-500 [&>button]:text-white [&>button]:hover:bg-purple-600 dark:[&>button]:bg-purple-600 dark:[&>button]:hover:bg-purple-700 [&>button]:transition-colors [&>button]:rounded-md">
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={expandedImage || ''}
                  alt="Momento expandido"
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ),
    };

    const Item = ({
      icon,
      title,
      description,
      onClick,
    }: {
      icon: React.ReactNode;
      title: string;
      description: string;
      onClick: () => void;
    }) => (
      <div
        className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:scale-105 transition-transform duration-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={onClick}
      >
        <div className="text-purple-500">{icon}</div>
        <div>
          <h3 className="font-bold text-purple-600 dark:text-purple-400">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    );

    return (
      <PageContainer>
        <div className="w-full max-w-lg">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-purple-600 dark:text-purple-400">
                Coisas Que Me Fazem Amar Você ❤️
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Item
                icon={<Music />}
                title="Sua Música Favorita"
                description="Aquela que você sempre canta..."
                onClick={() => setSelectedDialog('music')}
              />
              <Item
                icon={<Palette />}
                title="Sua Cor Favorita"
                description="A que combina com seus olhos..."
                onClick={() => setSelectedDialog('color')}
              />
              <Item
                icon={<Stars />}
                title="Seu Jeito Único"
                description="O modo como você sorri..."
                onClick={() => setSelectedDialog('smile')}
              />
              <Item
                icon={<Calendar />}
                title="Nossos Momentos"
                description="Cada segundo ao seu lado..."
                onClick={() => setSelectedDialog('moments')}
              />

              <div className="text-center">
                <p className="text-lg text-purple-600 dark:text-purple-400 font-bold">
                  Feliz Aniversário, meu amor! ❤️
                </p>
              </div>

              {/* Diálogo para os itens */}
              <Dialog open={selectedDialog !== null} onOpenChange={handleDialogClose}>
                <DialogContent className="max-w-3xl bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 [&>button]:bg-purple-500 [&>button]:text-white [&>button]:hover:bg-purple-600 dark:[&>button]:bg-purple-600 dark:[&>button]:hover:bg-purple-700 [&>button]:transition-colors [&>button]:rounded-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {selectedDialog === 'music' ? 'Sua Música' :
                        selectedDialog === 'color' ? 'Sua Cor Favorita' :
                          selectedDialog === 'smile' ? 'Seu Sorriso' :
                            'Nossos Momentos'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="p-4">
                    {selectedDialog && dialogContent[selectedDialog]}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Diálogo para o vídeo surpresa */}
              <Dialog open={showSurpriseVideo} onOpenChange={(open) => {
                if (!open) {
                  setShowSurpriseVideo(false);
                  // Pequeno delay antes de mostrar a mensagem final
                  setTimeout(() => setShowFinalMessage(true), 500);
                }
              }}>
                <DialogContent className="max-w-4xl bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 [&>button]:bg-purple-500 [&>button]:text-white [&>button]:hover:bg-purple-600 dark:[&>button]:bg-purple-600 dark:[&>button]:hover:bg-purple-700 [&>button]:transition-colors [&>button]:rounded-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400 text-center">
                      ✨ Uma Surpresa Especial Para Você ✨
                    </DialogTitle>
                  </DialogHeader>
                  <div className="p-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <video
                        className="w-full h-full rounded-lg"
                        controls
                        autoPlay
                        src="/src/assets/surprise-video.mp4"
                      />
                    </div>
                    <p className="text-center mt-4 text-lg text-purple-600 dark:text-purple-400 font-medium">
                      Espero que tenha gostado de todas as surpresas! Te amo muito! ❤️
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  };

  // Lógica de renderização condicional
  return (
    <>
      {/* Botão de alternância de tema */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-yellow-500"
        >
          {theme === 'light' ? (
            <Moon className="w-6 h-6 text-gray-800" />
          ) : (
            <Sun className="w-6 h-6 text-yellow-400" />
          )}
        </button>
      </div>

      {/* Renderização condicional */}
      {showFinalMessage ? (
        <Suspense fallback={<div className="w-full h-screen bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800" />}>
          <FinalMessage />
        </Suspense>
      ) : showExtra ? (
        <ExtraPhase />
      ) : showVoucher ? (
        <Voucher />
      ) : (
        // Renderização padrão (fase inicial do jogo)
        <PageContainer>
          <div className="w-full max-w-lg">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-center text-pink-600 dark:text-pink-400">
                  Caça ao Tesouro do Amor 💝
                </CardTitle>
                <p className="text-center text-gray-600 dark:text-gray-300">
                  Fase {currentPhase + 1} de {phases.length}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-700 dark:text-gray-200">
                  {phases[currentPhase].question}
                </p>
                <p className="text-sm text-gray-500 italic dark:text-gray-400">
                  {phases[currentPhase].hint}
                </p>

                <Input
                  type="text"
                  placeholder="Sua resposta..."
                  className="border-pink-300 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  onChange={(e) => handleAnswer(currentPhase, e.target.value)}
                  value={answers[currentPhase] || ''}
                  maxLength={currentPhase === 1 ? 20 : 10} // Limite maior para a fase com hora
                />
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      )}
    </>
  );
};

export default TreasureHunt;
