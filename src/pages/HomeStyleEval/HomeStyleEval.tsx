import { useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { questions } from './data/questions';
import { QuestionCard } from './components/QuestionCard';
import { ProgressBar } from './components/ProgressBar';
import { ResultPage } from './components/ResultPage';

type HomeStyleEvalProps = {
  onGoDeepEval?: () => void;
  onGoHome?: () => void;
};

export function HomeStyleEval({ onGoDeepEval, onGoHome }: HomeStyleEvalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [quantities, setQuantities] = useState<Record<string, Record<string, number>>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = useMemo(() => questions[currentIndex], [currentIndex]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setQuantities({});
    setTextAnswers({});
    setShowResult(false);
  };

  const canProceed = () => {
    const currentAns = answers[currentQuestion.id];
    if (currentQuestion.type === 'single') {
      return currentAns && currentAns.length > 0;
    }
    return true;
  };

  const handleOptionSelect = (optionId: string, delta?: number) => {
    if (currentQuestion.id === 'q9') {
      setQuantities((prev) => {
        const currentQuantities = prev[currentQuestion.id] || {};

        if (delta !== undefined) {
          const currentQty = currentQuantities[optionId] || 0;
          const newQty = Math.max(0, currentQty + delta);
          return { ...prev, [currentQuestion.id]: { ...currentQuantities, [optionId]: newQty } };
        }

        const currentAnswers = answers[currentQuestion.id] || [];
        let newAnswers = [...currentAnswers];
        if (newAnswers.includes(optionId)) {
          newAnswers = newAnswers.filter((id) => id !== optionId);
        } else {
          newAnswers.push(optionId);
        }
        setAnswers((p) => ({ ...p, [currentQuestion.id]: newAnswers }));
        return prev;
      });
    } else {
      setAnswers((prev) => {
        const currentAnswers = prev[currentQuestion.id] || [];
        if (currentQuestion.type === 'single') return { ...prev, [currentQuestion.id]: [optionId] };
        if (currentAnswers.includes(optionId)) return { ...prev, [currentQuestion.id]: currentAnswers.filter((id) => id !== optionId) };
        return { ...prev, [currentQuestion.id]: [...currentAnswers, optionId] };
      });
    }

    if (currentQuestion.type === 'single') {
      setTimeout(() => handleNext(), 400);
    }
  };

  const handleTextChange = (text: string) => {
    setTextAnswers((prev) => ({ ...prev, [currentQuestion.id]: text }));
  };

  return (
    <div className="min-h-screen bg-transparent text-stone-800 font-sans selection:bg-orange-200">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        {onGoHome && (
          <div className="mb-6">
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <Home size={14} />
              返回欢迎页
            </button>
          </div>
        )}
        <AnimatePresence mode="wait">
          {showResult ? (
            <div key="result">
              <ResultPage
                answers={answers}
                textAnswers={textAnswers}
                onRestart={handleRestart}
                onGoDeepEval={onGoDeepEval}
              />
            </div>
          ) : (
            <div key="question-container" className="w-full">
              <ProgressBar current={currentIndex + 1} total={questions.length} />

              <AnimatePresence mode="wait">
                <div key={currentQuestion.id}>
                  <QuestionCard
                    question={currentQuestion}
                    selectedOptions={answers[currentQuestion.id] || []}
                    selectedQuantities={quantities[currentQuestion.id] || {}}
                    textAnswer={textAnswers[currentQuestion.id]}
                    onOptionSelect={handleOptionSelect}
                    onTextChange={handleTextChange}
                  />
                </div>
              </AnimatePresence>

              <div className="flex justify-between items-center max-w-2xl mx-auto mt-12">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                    currentIndex === 0 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-500 hover:bg-stone-200/50 hover:text-stone-800'
                  }`}
                >
                  <ArrowLeft size={18} />
                  上一题
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${
                    !canProceed()
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-800 text-white hover:bg-stone-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {currentIndex === questions.length - 1 ? '查看结果' : '下一题'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

