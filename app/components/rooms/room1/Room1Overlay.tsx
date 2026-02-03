'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { useRoom1UI } from './useRoom1UI';
import { useGameState } from '../../../hooks/useGameState';

// Category definitions
interface Category {
  id: string;
  name: string;
  nameVi: string;
  color: string;
  description: string;
  descriptionVi: string;
}

interface Item {
  id: string;
  text: string;
  textVi: string;
  categoryId: string;
}

const categories: Category[] = [
  {
    id: 'base',
    name: 'Economic Base',
    nameVi: 'Kinh Tế Cơ Sở',
    color: 'from-amber-600 to-amber-700',
    description: 'Productive forces and relations of production',
    descriptionVi: 'Lực lượng sản xuất và quan hệ sản xuất'
  },
  {
    id: 'superstructure',
    name: 'Superstructure',
    nameVi: 'Kiến Trúc Thượng Tầng',
    color: 'from-purple-600 to-purple-700',
    description: 'Politics, law, ideology, culture',
    descriptionVi: 'Chính trị, pháp luật, ý thức hệ, văn hóa'
  },
  {
    id: 'objective',
    name: 'Objective Conditions',
    nameVi: 'Điều Kiện Khách Quan',
    color: 'from-blue-600 to-blue-700',
    description: 'Material conditions for revolution',
    descriptionVi: 'Điều kiện vật chất cho cách mạng'
  },
  {
    id: 'subjective',
    name: 'Subjective Conditions',
    nameVi: 'Điều Kiện Chủ Quan',
    color: 'from-red-600 to-red-700',
    description: 'Consciousness and organization',
    descriptionVi: 'Ý thức và tổ chức'
  }
];

const items: Item[] = [
  // Base items
  { id: 'item1', text: 'Factory machinery', textVi: 'Máy móc nhà máy', categoryId: 'base' },
  { id: 'item2', text: 'Labor power', textVi: 'Sức lao động', categoryId: 'base' },
  { id: 'item3', text: 'Property ownership', textVi: 'Quyền sở hữu tài sản', categoryId: 'base' },
  
  // Superstructure items
  { id: 'item4', text: 'Legal system', textVi: 'Hệ thống pháp luật', categoryId: 'superstructure' },
  { id: 'item5', text: 'State apparatus', textVi: 'Bộ máy nhà nước', categoryId: 'superstructure' },
  { id: 'item6', text: 'Dominant ideology', textVi: 'Ý thức hệ thống trị', categoryId: 'superstructure' },
  
  // Objective items
  { id: 'item7', text: 'Developed productive forces', textVi: 'Lực lượng sản xuất phát triển', categoryId: 'objective' },
  { id: 'item8', text: 'Economic crisis', textVi: 'Khủng hoảng kinh tế', categoryId: 'objective' },
  { id: 'item9', text: 'Large proletariat class', textVi: 'Giai cấp vô sản đông đảo', categoryId: 'objective' },
  
  // Subjective items
  { id: 'item10', text: 'Class consciousness', textVi: 'Ý thức giai cấp', categoryId: 'subjective' },
  { id: 'item11', text: 'Revolutionary party', textVi: 'Đảng cách mạng', categoryId: 'subjective' },
  { id: 'item12', text: 'Political education', textVi: 'Giáo dục chính trị', categoryId: 'subjective' },
];

// Shuffle function
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Category Sorting Game component
function CategorySortingGame() {
  const showQuiz = useRoom1UI((s) => s.showQuiz);
  const closeQuiz = useRoom1UI((s) => s.closeQuiz);
  const { language, obtainRoom1Key, completeRoom } = useGameState();
  const [mounted, setMounted] = useState(false);

  // Shuffle items once on mount
  const [shuffledItems] = useState(() => shuffleArray(items));
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Check if game is complete
  useEffect(() => {
    if (Object.keys(placements).length === items.length) {
      setIsComplete(true);
    }
  }, [placements]);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (categoryId: string) => {
    if (draggedItem) {
      setPlacements(prev => ({ ...prev, [draggedItem]: categoryId }));
      setDraggedItem(null);
    }
  };

  const handleRemove = (itemId: string) => {
    setPlacements(prev => {
      const newPlacements = { ...prev };
      delete newPlacements[itemId];
      return newPlacements;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    items.forEach(item => {
      if (placements[item.id] === item.categoryId) {
        correct++;
      }
    });
    setCorrectCount(correct);
    setShowResults(true);
  };

  const handleComplete = () => {
    obtainRoom1Key();
    completeRoom(0);
    closeQuiz();
  };

  const handleRetry = () => {
    setPlacements({});
    setIsComplete(false);
    setShowResults(false);
    setCorrectCount(0);
  };

  const passed = correctCount >= items.length * 0.75; // 75% to pass

  if (!mounted || !showQuiz) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(220,38,38,0.3)]">
        <div className="flex justify-between items-center mb-6 border-b border-red-500/30 pb-4">
          <div>
            <h2 className="text-3xl font-display text-red-500 mb-1">
              {language === 'en' ? 'Marxist Theory Classification' : 'Phân Loại Lý Thuyết Mác-xít'}
            </h2>
            <p className="text-white/70 text-sm">
              {language === 'en' 
                ? 'Drag and drop concepts into their correct categories' 
                : 'Kéo và thả các khái niệm vào nhóm đúng'}
            </p>
          </div>
          <button onClick={closeQuiz} className="text-white/70 hover:text-white text-2xl">×</button>
        </div>

        {!showResults ? (
          <>
            {/* Categories Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {categories.map(category => {
                const itemsInCategory = Object.entries(placements)
                  .filter(([_, catId]) => catId === category.id)
                  .map(([itemId]) => items.find(i => i.id === itemId)!);

                return (
                  <div
                    key={category.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(category.id)}
                    className={`relative min-h-[280px] p-4 rounded-xl border-2 transition-all ${
                      draggedItem 
                        ? 'border-yellow-400 bg-gradient-to-br from-gray-800/80 to-gray-900/80 scale-[1.02]' 
                        : 'border-gray-600 bg-gradient-to-br from-gray-900/60 to-black/60'
                    }`}
                  >
                    {/* Category Header */}
                    <div className={`bg-gradient-to-r ${category.color} p-3 rounded-lg mb-3 shadow-lg`}>
                      <h3 className="text-white font-display font-bold text-lg text-center">
                        {language === 'en' ? category.name : category.nameVi}
                      </h3>
                      <p className="text-white/80 text-xs text-center mt-1">
                        {language === 'en' ? category.description : category.descriptionVi}
                      </p>
                    </div>

                    {/* Items in category */}
                    <div className="space-y-2 min-h-[180px]">
                      {itemsInCategory.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-gray-500 text-sm italic border-2 border-dashed border-gray-700 rounded-lg">
                          {language === 'en' ? 'Drop items here' : 'Thả items vào đây'}
                        </div>
                      ) : (
                        itemsInCategory.map(item => (
                          <div
                            key={item.id}
                            className="bg-gray-800/80 border border-gray-600 p-3 rounded-lg flex justify-between items-center hover:bg-gray-700/80 transition-colors group"
                          >
                            <span className="text-white/90 text-sm">
                              {language === 'en' ? item.text : item.textVi}
                            </span>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Available Items */}
            <div className="bg-gradient-to-br from-red-950/60 to-black/60 border-2 border-red-500/50 rounded-xl p-4 mb-6">
              <h3 className="text-red-400 font-display font-bold mb-3 flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                {language === 'en' ? 'Available Concepts' : 'Các Khái Niệm'}
                <span className="text-yellow-500">★</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {shuffledItems
                  .filter(item => !placements[item.id])
                  .map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 hover:border-yellow-500 p-4 rounded-lg cursor-move text-center transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                    >
                      <p className="text-white/90 text-sm font-medium">
                        {language === 'en' ? item.text : item.textVi}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Submit Button */}
            {isComplete && (
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-display text-lg rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-red-500/50 border border-red-500 font-bold"
              >
                {language === 'en' ? '✓ Submit Classification' : '✓ Nộp Bài Phân Loại'}
              </button>
            )}
          </>
        ) : (
          /* Results screen */
          <div>
            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {categories.map(category => {
                const itemsInCategory = items.filter(item => item.categoryId === category.id);
                
                return (
                  <div
                    key={category.id}
                    className="p-4 rounded-xl border-2 bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-600"
                  >
                    <div className={`bg-gradient-to-r ${category.color} p-3 rounded-lg mb-3`}>
                      <h3 className="text-white font-display font-bold text-lg text-center">
                        {language === 'en' ? category.name : category.nameVi}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {itemsInCategory.map(item => {
                        const isCorrect = placements[item.id] === category.id;
                        const userPlacement = placements[item.id];

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-green-900/40 border-green-500'
                                : 'bg-red-900/40 border-red-500'
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-white/90 text-sm">
                                {language === 'en' ? item.text : item.textVi}
                              </p>
                              {!isCorrect && (
                                <p className="text-yellow-400/70 text-xs mt-1">
                                  {language === 'en' ? 'Placed in: ' : 'Đã đặt vào: '}
                                  {categories.find(c => c.id === userPlacement)?.[language === 'en' ? 'name' : 'nameVi']}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Score Summary */}
            <div className="text-center space-y-6 mb-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                passed 
                  ? 'bg-gradient-to-br from-green-600 to-green-700 shadow-[0_0_40px_rgba(34,197,94,0.5)]' 
                  : 'bg-gradient-to-br from-red-600 to-red-700 shadow-[0_0_40px_rgba(239,68,68,0.5)]'
              }`}>
                <span className="text-5xl">
                  {passed ? '🎉' : '😞'}
                </span>
              </div>
              
              <div className={`inline-block px-8 py-4 rounded-lg border-2 ${
                passed 
                  ? 'bg-green-950/50 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]' 
                  : 'bg-red-950/50 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
              }`}>
                <p className="text-white text-3xl font-display font-bold">
                  {correctCount} / {items.length} {language === 'en' ? 'Correct' : 'Đúng'}
                </p>
                <p className="text-white/70 text-sm mt-1">
                  {Math.round((correctCount / items.length) * 100)}%
                </p>
              </div>
              
              <p className={`text-xl font-semibold ${passed ? 'text-green-300' : 'text-red-300'}`}>
                {passed 
                  ? (language === 'en' ? '★ Excellent! You understand Marxist categories! ★' : '★ Xuất sắc! Bạn đã hiểu các phạm trù Mác-xít! ★')
                  : (language === 'en' ? 'Need at least 75% correct to pass' : 'Cần đúng ít nhất 75% để hoàn thành')
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {passed && (
                <button 
                  onClick={handleComplete} 
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-display text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 border border-green-500"
                >
                  {language === 'en' ? '✓ Complete Room 1' : '✓ Hoàn thành Phòng 1'}
                </button>
              )}
              <button 
                onClick={handleRetry} 
                className={`${passed ? 'flex-1' : 'w-full'} px-8 py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-display text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/50 border border-red-500`}
              >
                {language === 'en' ? '↻ Try Again' : '↻ Thử lại'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// Exit button component
function ExitButton() {
  const [mounted, setMounted] = useState(false);
  const gameStarted = useRoom1UI((s) => s.gameStarted);
  const { setCurrentRoom } = useGameState();

  const handleExit = () => {
    if (confirm('Bạn có muốn thoát Room 1? / Exit Room 1?')) {
      setCurrentRoom(0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameStarted) {
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExit, gameStarted]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !gameStarted) return null;

  return createPortal(
    <button
      onClick={handleExit}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-red-800/80 hover:bg-red-700/90 border border-red-600 hover:border-red-500 rounded-lg transition-all duration-200 text-red-200 hover:text-red-100 text-sm font-mono"
      title="Quay về Intro (ESC)"
    >
      <X className="w-4 h-4" />
      <span>Thoát</span>
    </button>,
    document.body
  );
}

// Start screen
function StartScreen() {
  const gameStarted = useRoom1UI((s) => s.gameStarted);
  const startGame = useRoom1UI((s) => s.startGame);
  const { language } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || gameStarted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-red-900/90 to-black/90 border-2 border-red-600 rounded-lg p-8 max-w-2xl">
        <h1 className="text-4xl font-display text-red-500 mb-4 text-center">
          {language === 'en' ? 'Room 1: Revolutionary Foundation' : 'Phòng 1: Nền Tảng Cách Mạng'}
        </h1>
        
        <div className="text-red-100 space-y-3 mb-6">
          <p>
            <strong className="text-red-400">
              {language === 'en' ? 'Mission' : 'Nhiệm vụ'}:
            </strong><br/>
            {language === 'en' 
              ? 'Classify Marxist concepts into their correct categories to demonstrate your understanding of the foundational theory.'
              : 'Phân loại các khái niệm Mác-xít vào nhóm đúng để chứng minh bạn hiểu lý thuyết nền tảng.'}
          </p>
          
          <p className="text-sm">
            {language === 'en' 
              ? 'Drag and drop 12 concepts into 4 categories: Economic Base, Superstructure, Objective Conditions, and Subjective Conditions.'
              : 'Kéo và thả 12 khái niệm vào 4 nhóm: Kinh Tế Cơ Sở, Kiến Trúc Thượng Tầng, Điều Kiện Khách Quan và Điều Kiện Chủ Quan.'}
          </p>

          <p className="text-sm italic text-red-300">
            {language === 'en' 
              ? 'Need 75% correct to unlock the Revolutionary Key!'
              : 'Cần đúng 75% để mở khóa Chìa Khóa Cách Mạng!'}
          </p>
        </div>

        <button
          onClick={startGame}
          className="w-full px-6 py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-display text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/50 border border-red-500"
        >
          {language === 'en' ? 'Start Classification' : 'Bắt Đầu Phân Loại'}
        </button>
      </div>
    </div>,
    document.body
  );
}

export function Room1Overlay() {
  return (
    <>
      <CategorySortingGame />
      <StartScreen />
      <ExitButton />
    </>
  );
}
