import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, List } from 'lucide-react';
import { FormData, initialFormData } from './types';
import {
  StepWelcome, Step4, Step5, Step6, Step6_1, Step7, Step8, Step9,
  Step10, Step11, Step12, Step13, Step14, Step15, Step16, Step17, Step18, Step19, Step20, Step21, StepSubmit
} from './components/steps';

export default function App() {
  const [data, setData] = useState<FormData>(initialFormData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const updateData = (fields: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  // Define the sequence of steps
  const getStepsSequence = () => {
    const sequence = [
      { id: 'welcome', title: '欢迎', qId: null, component: StepWelcome },
      { id: 'q2-4', title: '基础信息', qId: 'Q2-4', component: Step4 },
      { id: 'q2-5', title: '房屋现状', qId: 'Q2-5', component: Step5 },
      { id: 'q2-6', title: '核心成员', qId: 'Q2-6', component: Step6 },
      { id: 'q2-6-1', title: '家庭成员', qId: 'Q2-6-1', component: Step6_1 },
      { id: 'q2-7', title: '协作方式', qId: 'Q2-7', component: Step7 },
      { id: 'q2-8', title: '计划节奏', qId: 'Q2-8', component: Step8 },
      { id: 'q2-9', title: '空间规划', qId: 'Q2-9', component: Step9 },
      { id: 'q2-10', title: '成长变化', qId: 'Q2-10', component: Step10 },
      { id: 'q2-11', title: '烹饪习惯', qId: 'Q2-11', component: Step11 },
      { id: 'q2-12', title: '聚餐习惯', qId: 'Q2-12', component: Step12 },
      { id: 'q2-13', title: '客厅习惯', qId: 'Q2-13', component: Step13 },
      { id: 'q2-14', title: '储物重点', qId: 'Q2-14', component: Step14 },
      { id: 'q2-15', title: '卫浴偏好', qId: 'Q2-15', component: Step15 },
      { id: 'q2-16', title: '底线需求', qId: 'Q2-16', component: Step16 },
      { id: 'q2-17', title: '风水禁忌', qId: 'Q2-17', component: Step17 },
      { id: 'q2-18', title: '智能家居', qId: 'Q2-18', component: Step18 },
      { id: 'q2-19', title: '适老/无障碍', qId: 'Q2-19', component: Step19 },
      { id: 'q2-20', title: '旧物处理', qId: 'Q2-20', component: Step20 },
      { id: 'q2-21', title: '其他需求', qId: 'Q2-21', component: Step21 },
      { id: 'submit', title: '提交', qId: null, component: StepSubmit }
    ];

    return sequence;
  };

  const steps = getStepsSequence();
  const CurrentStepComponent = steps[currentStepIndex].component as React.FC<any>;

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-gray-900 font-sans flex flex-col relative">
      {/* Header */}
      <header className="w-full pt-8 pb-4 px-6 flex flex-col items-center relative z-50">
        <div className="w-full max-w-[800px] flex items-center justify-center relative">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`absolute left-0 w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center transition-colors ${isFirstStep ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-medium text-gray-900">深度定制测评</h1>

          {/* Progress Indicator */}
          {!isFirstStep && !isLastStep && (
            <button
              onClick={() => setShowMenu(true)}
              className="absolute right-0 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <List size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-500">
                <span className="text-[#D84936]">{currentStepIndex}</span> / {steps.length - 2}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Navigation Menu Modal */}
      <AnimatePresence>
        {showMenu && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">测评目录</h2>
                <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-1 gap-2">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => {
                        setCurrentStepIndex(index);
                        setShowMenu(false);
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                        currentStepIndex === index 
                          ? 'bg-[#D84936]/5 border border-[#D84936]/20' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStepIndex === index ? 'bg-[#D84936] text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {index}
                        </span>
                        <div className="flex flex-col items-start">
                          {step.qId && (
                            <span className="text-[10px] font-bold text-[#D84936] uppercase tracking-wider mb-0.5">
                              {step.qId}
                            </span>
                          )}
                          <span className={`font-medium ${currentStepIndex === index ? 'text-[#D84936]' : 'text-gray-700'}`}>
                            {step.title}
                          </span>
                        </div>
                      </div>
                      {currentStepIndex === index && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D84936]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <CurrentStepComponent 
            key={steps[currentStepIndex].id} 
            data={data} 
            updateData={updateData} 
            nextStep={nextStep} 
          />
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {!isLastStep && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
          <div className="max-w-[800px] mx-auto">
            <button
              onClick={nextStep}
              className="w-full bg-[#302E2B] text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-black transition-colors active:scale-[0.99]"
            >
              {isFirstStep ? '开启深度定制之旅' : '下一步'}
              {!isFirstStep && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
