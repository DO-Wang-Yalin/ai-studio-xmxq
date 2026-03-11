import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, List, Eye, EyeOff, Pencil } from 'lucide-react';
import { FormData, initialFormData } from './types';
import { WorkbenchPage } from './pages/WorkbenchPage'
import { LoginPage } from './pages/LoginPage'
import { ProjectPage } from './pages/ProjectPage'
import {
  StepWelcome,
  StepRegister,
  StepHomeStyleEval,
  StepDesignFeedback,
  StepDeepEval1,
  StepDeepEval2,
  Step3,
  Step3Sub,
  Step4,
  Step5,
  Step6,
  Step6_1,
  Step7,
  Step8,
  Step9,
  Step10,
  Step11,
  Step12,
  Step13,
  Step14,
  Step15,
  Step16,
  Step17,
  Step18,
  Step19,
  Step20,
  Step21,
  StepContract,
  StepPayment,
  StepBudgetConfirmPreview,
} from './components/steps';
import { DeepEvalFormProvider } from './components/DeepEvalFormContext';

type StepConfig = {
  id: string;
  title: string;
  qId: string | null;
  component: React.ComponentType<any>;
  hiddenByDefault?: boolean;
};

export default function App() {
  const [data, setData] = useState<FormData>(initialFormData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mode, setMode] = useState<'form' | 'login' | 'projects' | 'workbench'>('form');
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  /** 步骤显示/隐藏：key 为 step.id，true=显示 false=隐藏；未设置的步骤按 hiddenByDefault 取反 */
  const [stepVisibility, setStepVisibility] = useState<Record<string, boolean>>({});
  /** 目录里的标题/编码（qId）可编辑覆盖 */
  const [stepMetaOverrides, setStepMetaOverrides] = useState<Record<string, { title?: string; qId?: string | null }>>({});
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingQId, setEditingQId] = useState('');
  const STEP_META_STORAGE_KEY = 'ai-studio:stepMetaOverrides:v1';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STEP_META_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;
      setStepMetaOverrides(parsed);
    } catch {
      // ignore corrupted storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STEP_META_STORAGE_KEY, JSON.stringify(stepMetaOverrides));
    } catch {
      // ignore quota / private mode failures
    }
  }, [stepMetaOverrides]);

  const updateData = (fields: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  // Define the sequence of steps
  const getStepsSequence = (): StepConfig[] => {
    const sequence = [
      { id: 'welcome', title: '欢迎', qId: null, component: StepWelcome },
      { id: 'home-style-eval', title: '家居风格测评', qId: null, component: StepHomeStyleEval, hiddenByDefault: true },
      { id: 'design-feedback', title: '项目设计反馈', qId: null, component: StepDesignFeedback, hiddenByDefault: true },
      { id: 'register', title: '注册', qId: null, component: StepRegister },
      { id: 'deep-eval-2', title: '深度测评-2 您的信息', qId: 'DE-2', component: StepDeepEval2 },
      { id: 'deep-eval-1', title: '深度测评-1 项目概况', qId: 'DE-1', component: StepDeepEval1 },
      { id: 'q2-3', title: '预算范围', qId: 'Q2-3', component: Step3, hiddenByDefault: true },
      {
        id: 'budget-confirm-preview',
        title: '预算确认页预览',
        qId: null,
        component: StepBudgetConfirmPreview,
        hiddenByDefault: true,
      },
      { id: 'q3', title: '实效投入标准', qId: 'Q2-3-2', component: Step3Sub, hiddenByDefault: true },
      { id: 'contract', title: '意向金合同', qId: null, component: StepContract },
      { id: 'payment', title: '支付账号', qId: null, component: StepPayment },
      { id: 'q2-4', title: '房型资料同步', qId: 'Q2-4', component: Step4 },
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
    ];

    return sequence.map((s) => {
      const o = stepMetaOverrides[s.id];
      if (!o) return s;
      return {
        ...s,
        title: o.title ?? s.title,
        qId: o.qId ?? s.qId,
      };
    });
  };

  const steps = getStepsSequence();
  const designFeedbackStepIndex = steps.findIndex((s) => s.id === 'design-feedback');

  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-[#FFFDF3] text-gray-900 font-sans flex flex-col">
        <header className="w-full pt-8 pb-4 px-6 flex justify-center">
          <h1 className="text-2xl font-medium text-gray-900">登录</h1>
        </header>
        <main className="flex-1">
          <LoginPage
            onSuccess={() => setMode('projects')}
            onBack={() => setMode('form')}
          />
        </main>
      </div>
    );
  }

  if (mode === 'projects') {
    return (
      <div className="min-h-screen bg-[#FFFDF3] text-gray-900 font-sans flex flex-col">
        <header className="w-full pt-8 pb-4 px-6 flex justify-center">
          <h1 className="text-2xl font-medium text-gray-900">我的项目</h1>
        </header>
        <main className="flex-1">
          <ProjectPage
            onSelectProject={(project) => {
              setSelectedProject({ id: project.id, name: project.name });
              setMode('workbench');
            }}
            onBack={() => setMode('login')}
          />
        </main>
      </div>
    );
  }

  if (mode === 'workbench') {
    const userDisplayName = `${data.userName || '用户'}${data.userTitle || ''}`.trim()
    const projectName = selectedProject?.name ?? (data.projectName || data.projectLocation || '')
    return (
      <WorkbenchPage
        userDisplayName={userDisplayName}
        projectName={projectName}
        contractAccepted={data.contractAccepted}
        contractSignatureData={data.contractSignatureData}
        contractCustomText={data.contractCustomText}
        onExit={() => setMode('form')}
        onGoToFirstPage={() => {
          setMode('form')
          setCurrentStepIndex(0)
          setSelectedProject(null)
        }}
        onBackToProjects={() => {
          setMode('projects')
          setSelectedProject(null)
        }}
        onGoToDesignFeedback={() => {
          setMode('form')
          if (designFeedbackStepIndex >= 0) {
            setCurrentStepIndex(designFeedbackStepIndex)
          }
        }}
      />
    )
  }

  const isStepVisible = (step: StepConfig) => {
    if (step.id in stepVisibility) return stepVisibility[step.id];
    return !step.hiddenByDefault;
  };

  const toggleStepVisibility = (step: StepConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentVisible = isStepVisible(step);
    setStepVisibility((prev) => ({ ...prev, [step.id]: !currentVisible }));
  };

  const CurrentStepComponent = steps[currentStepIndex].component as React.FC<any>;
  const paymentStepIndex = steps.findIndex((s) => s.id === 'payment');
  const headerTitle =
    paymentStepIndex >= 0 && currentStepIndex <= paymentStepIndex
      ? '用户信息注册'
      : '项目深度需求测评';

  const goToStep = (stepId: string) => {
    const index = steps.findIndex((s) => s.id === stepId);
    if (index >= 0) setCurrentStepIndex(index);
  };

  const nextStep = () => {
    for (let i = currentStepIndex + 1; i < steps.length; i++) {
      if (isStepVisible(steps[i])) {
        setCurrentStepIndex(i);
        return;
      }
    }
  };

  const prevStep = () => {
    for (let i = currentStepIndex - 1; i >= 0; i--) {
      if (isStepVisible(steps[i])) {
        setCurrentStepIndex(i);
        return;
      }
    }
  };

  const visibleStepsCount = steps.filter((s) => isStepVisible(s)).length;
  const currentVisibleIndex = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => isStepVisible(s)).length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isContractStep = steps[currentStepIndex].id === 'contract';
  const isWelcomeStep = steps[currentStepIndex].id === 'welcome';
  const isRegisterStep = steps[currentStepIndex].id === 'register';
  const isDeepEvalStep = steps[currentStepIndex].id.startsWith('deep-eval');
  const isHomeStyleEvalStep = steps[currentStepIndex].id === 'home-style-eval';
  const isDesignFeedbackStep = steps[currentStepIndex].id === 'design-feedback';
  const progress = ((currentStepIndex) / (steps.length - 1)) * 100;

  return (
    <DeepEvalFormProvider>
    <div className="min-h-screen bg-[#FFFDF3] text-gray-900 font-sans flex flex-col relative">
      {/* Header（欢迎页/风格测评/设计反馈隐藏；注册页、DE 页面均显示目录） */}
      {!isWelcomeStep && !isHomeStyleEvalStep && !isDesignFeedbackStep && (
        <header className="w-full pt-8 pb-4 px-6 flex flex-col items-center relative z-50">
          <div className="w-full max-w-[800px] flex items-center justify-center relative">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={`absolute left-0 w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center transition-colors ${isFirstStep ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-medium text-gray-900">{headerTitle}</h1>

            {/* Progress Indicator */}
            {!isFirstStep && !isLastStep && (
              <button
                onClick={() => setShowMenu(true)}
                className="absolute right-0 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <List size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-500">
                  <span className="text-[#EF6B00]">{currentVisibleIndex}</span> / {visibleStepsCount}
                </span>
              </button>
            )}
          </div>
        </header>
      )}

      {/* Navigation Menu Modal */}
      <AnimatePresence>
        {showMenu && !isDesignFeedbackStep && (
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
                  {steps.map((step, index) => {
                    const visible = isStepVisible(step);
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all border ${
                          currentStepIndex === index
                            ? 'bg-[#EF6B00]/5 border-[#EF6B00]/20'
                            : visible ? 'hover:bg-gray-50 border-transparent' : 'bg-gray-50/80 border-gray-100 opacity-80'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentStepIndex(index);
                            setShowMenu(false);
                          }}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left"
                        >
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStepIndex === index ? 'bg-[#EF6B00] text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {index}
                          </span>
                          <div className="flex flex-col items-start min-w-0">
                            {step.qId && (
                              <span className="text-[10px] font-bold text-[#EF6B00] uppercase tracking-wider mb-0.5">
                                {step.qId}
                              </span>
                            )}
                            <span className={`font-medium truncate ${currentStepIndex === index ? 'text-[#EF6B00]' : visible ? 'text-gray-700' : 'text-gray-500'}`}>
                              {step.title}
                            </span>
                          </div>
                          {currentStepIndex === index && (
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#EF6B00]" />
                          )}
                        </button>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStepId(step.id);
                              setEditingTitle(step.title);
                              setEditingQId(step.qId ?? '');
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            title="编辑标题和编码"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleStepVisibility(step, e)}
                            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            title={visible ? '当前显示，点击隐藏' : '当前隐藏，点击显示'}
                          >
                            {visible ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Step Meta Modal */}
      <AnimatePresence>
        {editingStepId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStepId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900">编辑目录项</h3>
                <button
                  type="button"
                  onClick={() => setEditingStepId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800">标题</label>
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="例如：房屋现状"
                    className="w-full py-3.5 bg-[#FFF9E8] rounded-xl border-none focus:ring-2 focus:ring-[#EF6B00]/20 outline-none px-4 text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800">编码（可选）</label>
                  <input
                    value={editingQId}
                    onChange={(e) => setEditingQId(e.target.value)}
                    placeholder="例如：Q2-5（留空则不显示）"
                    className="w-full py-3.5 bg-[#FFF9E8] rounded-xl border-none focus:ring-2 focus:ring-[#EF6B00]/20 outline-none px-4 text-gray-800 placeholder-gray-400"
                  />
                  <p className="text-[11px] text-gray-500">
                    仅影响目录展示，不改变步骤跳转 id。
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStepId(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const stepId = editingStepId;
                    if (!stepId) return;
                    const nextTitle = editingTitle.trim() || editingTitle;
                    const nextQId = editingQId.trim();
                    setStepMetaOverrides((prev) => ({
                      ...prev,
                      [stepId]: {
                        ...prev[stepId],
                        title: nextTitle,
                        qId: nextQId ? nextQId : null,
                      },
                    }));
                    setEditingStepId(null);
                  }}
                  disabled={!editingTitle.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#EF6B00] text-sm font-medium text-white hover:bg-[#D85F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.99]"
                >
                  保存
                </button>
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
            prevStep={prevStep}
            goToStep={goToStep}
            goToWorkbench={() => setMode('workbench')}
            goToLogin={() => setMode('login')}
          />
        </AnimatePresence>
      </main>

      {/* Bottom Navigation（欢迎页、风格测评、注册页、深度测评页隐藏，深度测评有自带底部按钮） */}
      {!isLastStep &&
        !isContractStep &&
        !isWelcomeStep &&
        !isHomeStyleEvalStep &&
        !isDesignFeedbackStep &&
        !isRegisterStep &&
        !isDeepEvalStep && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
          <div className="max-w-[800px] mx-auto">
            <button
              onClick={nextStep}
              className="w-full bg-[#FF9C3E] text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-[#EF6B00] transition-colors active:scale-[0.99]"
            >
              {steps[currentStepIndex].id === 'payment'
                ? '完成支付并开始项目深度需求测评'
                : isFirstStep
                  ? '开启深度定制之旅'
                  : '下一步'}
              {steps[currentStepIndex].id !== 'payment' && !isFirstStep && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
    </DeepEvalFormProvider>
  );
}
