import React from 'react';
import { motion } from 'motion/react';

interface ResultPageProps {
  answers: Record<string, string[]>;
  textAnswers: Record<string, string>;
  onRestart: () => void;
  onGoDeepEval?: () => void;
}

type StyleProfile = {
  name: string;
  id: string;
  desc: string;
  scores: number[];
  quote: string;
  coreLabel: string;
  colorGene: string;
  suggestions: string;
};

const STYLE_PROFILES: StyleProfile[] = [
  {
    name: '纯粹极简派',
    id: 'DS01',
    desc: '现代简约风，追求极致的清爽与功能主义，浅色系。',
    scores: [5, 2, 1, 1, 4, 5, 1],
    quote: '您偏爱克制与留白，更相信“少即是多”。以功能与秩序为先，用极简的表达，容纳日常的高效与安宁。',
    coreLabel: '极简主义',
    colorGene: '中性色系',
    suggestions: '硬装：大面积留白，弱化复杂造型\n软装：低饱和织物、极简灯具\n收纳：隐藏式系统，保持界面干净',
  },
  {
    name: '奶油治愈家',
    id: 'DS02',
    desc: '治愈奶油风，低饱和度，圆润线条，奶咖色系。',
    scores: [4, 4, 4, 2, 4, 3, 4],
    quote: '您追求温柔且可持续的舒适感。更喜欢圆润的边界与柔和的光，让家像一块可以慢慢融化的奶油。',
    coreLabel: '治愈系',
    colorGene: '奶油色系',
    suggestions: '硬装：柔和弧线、浅米色墙面\n软装：绒感织物、奶咖/驼色单品\n灯光：低位氛围灯，避免强对比',
  },
  {
    name: '原木自然派',
    id: 'DS03',
    desc: '自然原木风，强调材料的原始温度，奶咖色系。',
    scores: [4, 4, 4, 3, 3, 3, 3],
    quote: '您更信赖自然材料带来的真实温度。喜欢木纹、肌理与阳光在空间里发生的微小变化，让家保持呼吸感。',
    coreLabel: '自然主义',
    colorGene: '原木色系',
    suggestions: '硬装：木饰面与自然肌理混搭\n软装：棉麻织物、藤编元素\n点缀：绿植与陶器，增强自然气息',
  },
  {
    name: '都市精英范',
    id: 'DS04',
    desc: '现代轻奢风，精致高级感，浅色系。',
    scores: [4, 2, 2, 2, 4, 4, 5],
    quote: '您欣赏现代都市的精致秩序。空间需要体面、利落、有质感的细节，让生活像一套被精心剪裁的西装。',
    coreLabel: '轻奢主义',
    colorGene: '浅色系',
    suggestions: '硬装：石材/金属点缀，比例克制\n软装：皮革、玻璃、线性灯具\n陈列：少而精，强调质感与层次',
  },
  {
    name: '意式格调家',
    id: 'DS05',
    desc: '意式极简风，克制而高级，大地色系。',
    scores: [3, 2, 2, 2, 5, 5, 5],
    quote: '您在克制里追求高级感。更偏好大地色与材质本身的力量，用低调的比例和细节，做出“懂行”的质感。',
    coreLabel: '意式极简',
    colorGene: '大地色系',
    suggestions: '硬装：大板材质、统一纹理\n软装：皮革与织物对比，线条简洁\n灯光：重点照明+洗墙，凸显材质',
  },
  {
    name: '浪漫生活家',
    id: 'DS06',
    desc: '浪漫轻法式，优雅与松弛并存，原木色。',
    scores: [4, 4, 3, 4, 2, 3, 4],
    quote: '您向往优雅但不紧绷的生活状态。喜欢温柔的线条、轻盈的装饰与有故事感的物件，让日常更像一段小电影。',
    coreLabel: '轻法式',
    colorGene: '原木色系',
    suggestions: '硬装：细线条石膏、法式门套\n软装：柔和花纹、轻量装饰\n点缀：黄铜小件，提升精致度',
  },
  {
    name: '摩登收藏家',
    id: 'DS07',
    desc: '摩登中古风，复古与现代的碰撞，大地色系。',
    scores: [3, 3, 4, 4, 2, 3, 2],
    quote: '您喜欢“旧物新生”的魅力。复古的温度与现代的效率在您家里相互平衡，收藏不是堆砌，而是精心挑选。',
    coreLabel: '中古主义',
    colorGene: '大地色系',
    suggestions: '硬装：木色/胡桃木，复古比例\n软装：皮革单椅、复古灯具\n陈列：留白+重点摆放，避免杂乱',
  },
  {
    name: '新中式雅客',
    id: 'DS08',
    desc: '雅致新中式，传统与现代的融合，浅色系。',
    scores: [4, 3, 4, 2, 3, 5, 3],
    quote: '您重视内敛的气韵与秩序。传统的比例、留白与材质，在现代语境里被重新组织，呈现出不张扬的高级。',
    coreLabel: '新中式',
    colorGene: '浅色系',
    suggestions: '硬装：木格栅、留白与对称\n软装：亚麻、陶器与水墨元素\n灯光：柔和漫反射，营造静气',
  },
  {
    name: '硬核个性派',
    id: 'DS09',
    desc: '硬朗工业风，冷冽与原始，深色系。',
    scores: [1, 1, 1, 3, 4, 2, 3],
    quote: '您更偏好硬朗直接的表达。裸露的结构、金属与混凝土的质感，让空间像一座可被使用的城市装置。',
    coreLabel: '工业风',
    colorGene: '深色系',
    suggestions: '硬装：裸顶/微水泥，金属线条\n软装：皮革、黑灰织物\n灯光：轨道灯与点光源，强调结构',
  },
  {
    name: '侘寂修行者',
    id: 'DS10',
    desc: '静谧侘寂风，残缺之美，深色系。',
    scores: [2, 2, 5, 1, 1, 2, 1],
    quote: '您珍惜时间留下的痕迹。家不必完美，粗粝的肌理与低饱和的色彩，反而让您更能安住当下。',
    coreLabel: '侘寂风',
    colorGene: '深色系',
    suggestions: '硬装：肌理墙面、微水泥地面\n软装：亚麻/粗陶，留出呼吸\n陈列：少而有分量，强调质朴',
  },
  {
    name: '南洋松弛派',
    id: 'DS11',
    desc: '南洋复古风，热带风情与复古，原木色。',
    scores: [3, 4, 5, 4, 2, 2, 4],
    quote: '您向往热带的松弛与明快。藤编、绿植与复古色块，让家像一间永远开着窗的度假屋。',
    coreLabel: '南洋复古',
    colorGene: '原木色系',
    suggestions: '硬装：白墙+木色，通透采光\n软装：藤编、绿植、复古花纹\n点缀：彩色器物，营造度假感',
  },
  {
    name: '经典传承派',
    id: 'DS12',
    desc: '优雅老钱风，经典与底蕴，大地色系。',
    scores: [2, 3, 4, 5, 1, 5, 5],
    quote: '您偏爱经得起时间检验的经典。克制的色彩、讲究的材质与比例，构成一种不喧哗的底蕴。',
    coreLabel: '经典主义',
    colorGene: '大地色系',
    suggestions: '硬装：护墙板、经典线脚\n软装：皮革与羊毛织物\n陈列：书籍与艺术品，强调传承感',
  },
  {
    name: '视觉冒险家',
    id: 'DS13',
    desc: '极繁主义风，大胆与个性，深色系。',
    scores: [3, 4, 3, 5, 3, 1, 4],
    quote: '您拒绝平庸与留白，“Less is Bore”。大胆的撞色、琳琅满目的收藏品，您用丰富的视觉元素，把家填满对生活的热爱。',
    coreLabel: '极繁主义',
    colorGene: '艺术色系',
    suggestions: '硬装：彩色墙漆、繁复壁纸、拱门\n软装：异形地毯、各色装饰画、天鹅绒家具',
  },
  {
    name: '理性构建者',
    id: 'DS14',
    desc: '包豪斯风格，理性与功能，浅色系。',
    scores: [5, 1, 1, 2, 5, 5, 2],
    quote: '您更相信结构与功能的逻辑。清晰的几何秩序与克制的颜色，让空间像一套严谨的系统，稳定而高效。',
    coreLabel: '包豪斯',
    colorGene: '浅色系',
    suggestions: '硬装：几何分割与比例控制\n软装：原色点缀，强调功能\n灯光：线性照明，避免花哨装饰',
  },
];

export function ResultPage({ answers, textAnswers, onRestart, onGoDeepEval }: ResultPageProps) {
  const mapScore = (optionId: string) => {
    const map: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5 };
    return map[optionId] || 3;
  };

  const userScores: number[] = [];
  for (let i = 1; i <= 7; i++) {
    const ans = answers[`q${i}`]?.[0];
    userScores.push(ans ? mapScore(ans) : 3);
  }

  const calculateDistance = (s1: number[], s2: number[]) =>
    Math.sqrt(s1.reduce((sum, val, i) => sum + Math.pow(val - s2[i], 2), 0));

  const results = STYLE_PROFILES.map((p) => ({
    ...p,
    distance: calculateDistance(userScores, p.scores),
  })).sort((a, b) => a.distance - b.distance);

  const bestMatch = results[0];
  const serialNo = '64282';

  const handleSave = () => {
    const payload = {
      createdAt: new Date().toISOString(),
      serialNo,
      result: {
        id: bestMatch.id,
        name: bestMatch.name,
        desc: bestMatch.desc,
        quote: bestMatch.quote,
        coreLabel: bestMatch.coreLabel,
        colorGene: bestMatch.colorGene,
        suggestions: bestMatch.suggestions,
      },
      inputs: {
        answers,
        textAnswers,
        userScores,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DREAM.ONE-风格测评-${bestMatch.id}-${serialNo}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-transparent text-stone-800 font-sans"
    >
      <div className="w-full max-w-[420px] mx-auto">
        <div className="bg-[#F7F4EE] shadow-[0_18px_40px_rgba(0,0,0,0.10)] rounded-[28px] overflow-hidden min-h-screen">
          <div className="relative h-[360px] w-full bg-stone-200">
            <img
              src={`https://picsum.photos/seed/${bestMatch.id}/900/1200`}
              alt={bestMatch.name}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
            <div className="absolute left-0 bottom-0 w-full px-8 pb-7">
              <h1 className="text-[44px] leading-[1.05] font-semibold tracking-[0.5px] text-white">
                {bestMatch.name}
              </h1>
            </div>
          </div>

          <div className="px-6 pt-6 pb-8">
            <div className="rounded-[18px] bg-[#F1EEE8] px-5 py-4">
              <div className="flex gap-4">
                <span className="w-[3px] rounded-full bg-[#C9B7A7] shrink-0" />
                <p className="text-[14px] leading-[1.9] text-stone-600">{bestMatch.quote}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <InfoRow label="风格核心" value={bestMatch.coreLabel} leftIcon={<StackIcon />} />
              <InfoRow
                label="色彩基因"
                value={bestMatch.colorGene}
                leftIcon={<PaletteIcon />}
                rightAddon={<GeneSwatch />}
              />
            </div>

            <div className="mt-5 rounded-[18px] bg-[#F1EEE8] px-5 py-4">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-stone-700">
                <span className="w-9 h-9 rounded-[14px] bg-[#EFEAE2] flex items-center justify-center">
                  <HammerIcon />
                </span>
                搭配建议
              </div>
              <div className="mt-4 text-[13px] leading-[1.9] text-stone-600 whitespace-pre-line">
                {bestMatch.suggestions}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-stone-300/30 flex items-end justify-between">
              <div>
                <div className="text-[12px] tracking-[0.28em] text-stone-500 font-semibold">DREAM.ONE</div>
                <div className="mt-1 text-[11px] text-stone-400">居住人格测评</div>
              </div>
              <div className="text-[11px] tracking-[0.08em] text-stone-300 font-semibold">NO.{serialNo}</div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-10 pt-6">
          <button
            type="button"
            onClick={handleSave}
            className="w-full flex items-center justify-between gap-3 rounded-2xl bg-[#2F2D2A] px-5 py-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] hover:bg-black transition-colors"
          >
            <div className="flex flex-col items-start">
              <div className="text-[15px] font-semibold">保存我的风格</div>
              <div className="text-[11px] text-white/70">下载风格报告，随时查看与分享</div>
            </div>
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <DownloadIcon />
            </span>
          </button>

          <button
            type="button"
            onClick={onGoDeepEval}
            disabled={!onGoDeepEval}
            className="w-full mt-4 rounded-2xl bg-[#E56C0A] text-white py-4 font-semibold hover:bg-[#D86307] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            注册继续
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3 text-stone-500 hover:text-stone-800 transition-colors font-medium"
          >
            <RotateIcon />
            重新测试
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v10m0 0l4-4m-4 4l-4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RotateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 10-3.3 6.9M21 12v7m0-7h-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoRow({
  label,
  value,
  leftIcon,
  rightAddon,
}: {
  label: string;
  value: string;
  leftIcon: React.ReactNode;
  rightAddon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[14px] bg-[#F1EEE8] px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-[14px] bg-[#EFEAE2] flex items-center justify-center shrink-0">
          {leftIcon}
        </span>
        <div className="text-[13px] text-stone-500 font-medium">{label}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {rightAddon ? <span className="shrink-0">{rightAddon}</span> : null}
        <div className="text-[14px] font-semibold text-stone-800">{value}</div>
      </div>
    </div>
  );
}

function GeneSwatch() {
  return (
    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C7A6FF] via-[#67C2FF] to-[#FFB36A] shadow-[0_2px_8px_rgba(0,0,0,0.10)]" />
  );
}

function StackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" stroke="#8C847B" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3.5 12 12 16.5 20.5 12" stroke="#8C847B" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3.5 16.5 12 21l8.5-4.5" stroke="#8C847B" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3a9 9 0 1 0 0 18c1.7 0 2.5-.9 2.5-2 0-1-.8-2-1.8-2H11a3 3 0 0 1 0-6h1.7c1 0 1.8-1 1.8-2 0-1.1-.8-2-2.5-2Z"
        stroke="#8C847B"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7.5 11.3h.01" stroke="#8C847B" strokeWidth="3" strokeLinecap="round" />
      <path d="M9 7.8h.01" stroke="#8C847B" strokeWidth="3" strokeLinecap="round" />
      <path d="M15.4 8.6h.01" stroke="#8C847B" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function HammerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14.5 4.5 19 9l-2 2-4.5-4.5 2-2Z" stroke="#8C847B" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12.5 6.5 5 14l5 5 7.5-7.5" stroke="#8C847B" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 20h6" stroke="#8C847B" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

