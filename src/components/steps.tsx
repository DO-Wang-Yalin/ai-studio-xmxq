import React from 'react';
import { FormData } from '../types';
import { StepWrapper, TextInput, RadioCard, CheckboxCard, SegmentedRadio, IconRadioCard, SquareRadioCard, SquareCheckboxCard, Counter, SubQuestion } from './ui';
import { 
  Check, MapPin, Target, FileText, Sun, CloudSun, Cloud, Moon, Maximize, Square, Minimize, 
  Wind, Fan, CloudRain, VolumeX, Volume1, Volume2, VolumeX as VolumeMute,
  Wifi, Zap, Lightbulb, Music, ShieldCheck, Cpu, AirVent, Droplets, Thermometer, 
  Lock, Waves, Trash2, Bath, Flame, Bot, Palette, Archive
} from 'lucide-react';

interface StepProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  nextStep: () => void;
}

export const StepWelcome = ({ nextStep }: StepProps) => (
  <StepWrapper
    title="开启深度定制之旅"
    subtitle="作为种子用户，你的档案会被我们保存，上线后直接同步到产品里。我们不会用它打扰你；"
  >
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-24 h-24 bg-[#302E2B] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-8 shadow-lg">
        D.O
      </div>
      <p className="text-gray-500 text-center max-w-md leading-relaxed">
        为了生成针对您房型的深度分析报告（如：精确的预算分配树、完整的布局方案等），请您认真填写真实项目需求相关信息。
      </p>
    </div>
  </StepWrapper>
);

export const Step0 = ({ data, updateData }: StepProps) => (
  <StepWrapper title="基础信息" subtitle="请完善您的个人信息，以便我们提供专属服务">
    <div className="space-y-6">
      <TextInput label="姓名" value={data.userName} onChange={(v: string) => updateData({ userName: v })} placeholder="请输入您的姓名" />
      <SegmentedRadio 
        label="称呼" 
        value={data.userTitle} 
        onChange={(v: string) => updateData({ userTitle: v })}
        options={['先生', '女士', '保密']} 
      />
      <div className="space-y-3">
        <SubQuestion className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          年龄段
        </SubQuestion>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['20-30岁', '31-40岁', '41-50岁', '50岁以上'].map(opt => (
            <SquareRadioCard
              key={opt}
              label={opt}
              selected={data.userAgeRange === opt}
              onClick={() => updateData({ userAgeRange: opt })}
            />
          ))}
        </div>
      </div>
      <TextInput label="身高" type="number" value={data.userHeight} onChange={(v: string) => updateData({ userHeight: v })} placeholder="例如: 175" suffix="cm" />
      <TextInput label="行业/工作特质" value={data.userIndustry} onChange={(v: string) => updateData({ userIndustry: v })} placeholder="例如: IT/互联网、金融、自由职业" />
      <TextInput label="所在城市" value={data.userCity} onChange={(v: string) => updateData({ userCity: v })} placeholder="例如: 上海市" icon={MapPin} />
      <TextInput label="联系电话" type="tel" value={data.userPhone} onChange={(v: string) => updateData({ userPhone: v })} placeholder="请输入手机号码" />
    </div>
  </StepWrapper>
);

export const Step1 = ({ data, updateData }: StepProps) => (
  <StepWrapper title="项目概况" subtitle="作为种子用户，你的档案会被我们保存，上线后直接同步到产品里。我们不会用它打扰你；">
    <div className="space-y-6">
      <SegmentedRadio 
        label="项目类型" 
        value={data.projectType} 
        onChange={(v: string) => updateData({ projectType: v })}
        options={['独栋别墅', '平层公寓', '复式联排']} 
      />
      <TextInput 
        label="项目城市" 
        value={data.projectLocation} 
        onChange={(v: string) => updateData({ projectLocation: v })} 
        placeholder="点击右侧按钮获取定位或手动输入..." 
        icon={MapPin}
        suffixIcon={Target}
      />
      <TextInput 
        label="实际面积" 
        type="number" 
        value={data.projectArea} 
        onChange={(v: string) => updateData({ projectArea: v })} 
        placeholder="请输入..." 
        suffix="m²" 
      />
      <div className="space-y-3">
        <SubQuestion className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          每平方米项目造价
        </SubQuestion>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'A', label: '精工全案高定 (5,000 - 8,000)' },
            { value: 'B', label: '豪华奢享方案 (8,000 - 12,000)' },
            { value: 'C', label: '顶奢私享空间 (12,000 - 20,000)' },
            { value: 'D', label: '艺术殿堂级定制 (20,000 以上)' },
            { value: 'E', label: '了解更多高性价比方案' }
          ].map(opt => (
            <RadioCard
              key={opt.value}
              label={opt.label}
              selected={data.budgetStandard === opt.value}
              onClick={() => updateData({ budgetStandard: opt.value })}
            />
          ))}
        </div>
      </div>
    </div>
  </StepWrapper>
);

export const Step2 = ({ data, updateData }: StepProps) => (
  <StepWrapper title="房屋现状" subtitle="了解房屋的基本情况">
    <div className="space-y-6">
      <TextInput label="项目名称/小区" value={data.projectName} onChange={(v: string) => updateData({ projectName: v })} placeholder="例如: 汤臣一品" />
      <SegmentedRadio 
        label="房屋类型" 
        value={data.houseType} 
        onChange={(v: string) => updateData({ houseType: v })}
        options={['新房', '二手房', '老房翻新']} 
      />
      <SegmentedRadio 
        label="房屋现状" 
        value={data.houseCondition} 
        onChange={(v: string) => updateData({ houseCondition: v })}
        options={['毛坯', '精装', '老旧装修']} 
      />
    </div>
  </StepWrapper>
);

export const Step3 = ({ data, updateData, nextStep }: StepProps) => {
  const options = [
    { value: 'A', label: 'A. 精工全案高定', desc: '深度全屋高定系统。包含高性能机电设备集成与复杂的工艺节点，呈现出极强的专业设计感。（5,000 - 8,000）' },
    { value: 'B', label: 'B. 豪华奢享方案', desc: '极致选材标准。大面积使用进口石材、顶级涂料及设计师款家具。工艺细节经得起推敲。（8,000 -12,000）' },
    { value: 'C', label: 'C. 顶奢私享空间', desc: '选用国际顶级一线品牌家具与主材，涉及大量非标异形定制。专为追求极致感官体验打造。（12,000 -20,000）' },
    { value: 'D', label: 'D. 艺术殿堂级定制', desc: '不设限的极致表达。包含孤品级艺术单品集成、全球稀缺物料。具有高度收藏价值。（20,000 以上）' },
    { value: 'E', label: 'E. 了解更多高性价比及基础焕新方案', desc: '点击跳转至实效投入标准' }
  ];

  return (
    <StepWrapper title="Q2-3：预算范围" subtitle="关于这个未来的家，您更倾向于哪种“建设标准”？">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(opt => (
          <RadioCard
            key={opt.value}
            label={opt.label}
            description={opt.desc}
            selected={data.budgetStandard === opt.value}
            onClick={() => {
              updateData({ budgetStandard: opt.value });
              if (opt.value === 'E') {
                nextStep(); // Auto advance to sub-step
              }
            }}
          />
        ))}
      </div>
    </StepWrapper>
  );
};

export const Step3Sub = ({ data, updateData }: StepProps) => {
  const options = [
    { value: 'A', label: 'A. 极简焕新基础', desc: '侧重于空间的功能恢复与基础环保。选用高性价比的成熟工业化标准品。（1,000 - 2,000）' },
    { value: 'B', label: 'B. 经济实用标准', desc: '主流住宅的首选。选用国内一线大厂品牌主材，平衡功能性与基本审美。（2,000 - 3,000）' },
    { value: 'C', label: 'C. 主流品质进阶', desc: '在满足功能的基础上追求质感提升。开始引入局部个性化材质。（3,000 - 4,000）' },
    { value: 'D', label: 'D. 精致视觉全案', desc: '设计还原度的重要标准。包含完整的设计造型逻辑，支撑较高要求的风格落地。（4,000 - 5,000）' }
  ];

  return (
    <StepWrapper title="Q3：实效投入标准" subtitle="根据您的居住规划，以下哪种“实效投入标准”更符合您的预期？">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(opt => (
          <RadioCard
            key={opt.value}
            label={opt.label}
            description={opt.desc}
            selected={data.budgetSubStandard === opt.value}
            onClick={() => updateData({ budgetSubStandard: opt.value })}
          />
        ))}
      </div>
    </StepWrapper>
  );
};

export const Step4 = ({ data, updateData }: StepProps) => (
  <StepWrapper title="房型资料同步" subtitle="开启深度分析">
    <div className="space-y-6">
      <div className="space-y-3">
        <SubQuestion className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          上传户型图
        </SubQuestion>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <p className="text-gray-500 mb-4">点击或拖拽上传户型图</p>
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
            选择文件
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <SubQuestion className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          上传现场视频/照片
        </SubQuestion>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <p className="text-gray-500 mb-4">点击或拖拽上传现场视频/照片</p>
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
            选择文件
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-400 text-center pt-4">此步骤也可稍后在产品里补充</p>
    </div>
  </StepWrapper>
);

export const Step5 = ({ data, updateData }: StepProps) => (
  <StepWrapper title="Q2-5：房屋现状评估" subtitle="采光、层高、通风、噪音情况">
    <div className="space-y-4">
      <div className="space-y-1">
        <SubQuestion className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          采光情况
        </SubQuestion>
        <div className="grid grid-cols-4 gap-2">
          <IconRadioCard icon={Sun} label="极佳" description="全天有光" selected={data.lighting === '极佳，全天有阳光'} onClick={() => updateData({ lighting: '极佳，全天有阳光' })} />
          <IconRadioCard icon={CloudSun} label="良好" description="半天有光" selected={data.lighting === '良好，半天有阳光'} onClick={() => updateData({ lighting: '良好，半天有阳光' })} />
          <IconRadioCard icon={Cloud} label="一般" description="需开灯辅助" selected={data.lighting === '一般，需要开灯'} onClick={() => updateData({ lighting: '一般，需要开灯' })} />
          <IconRadioCard icon={Moon} label="较差" description="依赖人工照明" selected={data.lighting === '较差，采光受限'} onClick={() => updateData({ lighting: '较差，采光受限' })} />
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 space-y-1">
        <SubQuestion className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          层高情况
        </SubQuestion>
        <SegmentedRadio
          options={[
            { label: '宽敞 (2.8m+)', value: '2.8米以上 (宽敞)' },
            { label: '标准 (2.6-2.8m)', value: '2.6-2.8米 (标准)' },
            { label: '偏低 (2.6m-)', value: '2.6米以下 (偏低)' }
          ]}
          value={data.ceilingHeight}
          onChange={(val: string) => updateData({ ceilingHeight: val })}
        />
      </div>

      <div className="pt-3 border-t border-gray-100 space-y-1">
        <SubQuestion className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          通风情况
        </SubQuestion>
        <div className="grid grid-cols-4 gap-2">
          <IconRadioCard icon={Wind} label="南北通透" description="对流极佳" selected={data.ventilation === '南北通透'} onClick={() => updateData({ ventilation: '南北通透' })} />
          <IconRadioCard icon={Fan} label="通风良好" description="流通顺畅" selected={data.ventilation === '通风良好'} onClick={() => updateData({ ventilation: '通风良好' })} />
          <IconRadioCard icon={CloudRain} label="单面通风" description="需加强循环" selected={data.ventilation === '单面通风'} onClick={() => updateData({ ventilation: '单面通风' })} />
          <IconRadioCard icon={VolumeMute} label="通风较差" description="依赖新风" selected={data.ventilation === '通风较差'} onClick={() => updateData({ ventilation: '通风较差' })} />
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 space-y-1">
        <SubQuestion className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          噪音情况
        </SubQuestion>
        <div className="grid grid-cols-4 gap-2">
          <IconRadioCard icon={VolumeX} label="非常安静" description="无明显噪音" selected={data.noise === '非常安静'} onClick={() => updateData({ noise: '非常安静' })} />
          <IconRadioCard icon={Volume1} label="偶有噪音" description="偶尔有轻微声音" selected={data.noise === '偶有噪音'} onClick={() => updateData({ noise: '偶有噪音' })} />
          <IconRadioCard icon={Volume2} label="临街/较吵" description="能听到车流声" selected={data.noise === '临街/较吵'} onClick={() => updateData({ noise: '临街/较吵' })} />
          <IconRadioCard icon={VolumeMute} label="非常吵闹" description="需深度隔音" selected={data.noise === '非常吵闹'} onClick={() => updateData({ noise: '非常吵闹' })} />
        </div>
      </div>
    </div>
  </StepWrapper>
);

export const Step6 = ({ data, updateData }: StepProps) => {
  const options = [
    { value: 'A', label: '男主人' },
    { value: 'B', label: '女主人' },
    { value: 'C', label: '长辈/长住家属' }
  ];

  const getSpaceOptions = () => {
    switch (data.role) {
      case 'A':
        return [
          { label: '智能书房', desc: '需要高效办公与游戏娱乐的平衡。' },
          { label: '客厅影音中心', desc: '追求极致的视听感受。' },
          { label: '社交餐厨', desc: '喜欢邀请朋友回家小酌。' }
        ];
      case 'B':
        return [
          { label: '梦幻衣帽间', desc: '需要博物馆级别的陈列与分类。' },
          { label: '全能厨房', desc: '享受烹饪与家人互动的时光。' },
          { label: '主卧疗愈区', desc: '追求极致包裹感的睡眠环境。' }
        ];
      case 'C':
        return [
          { label: '阳光卧室', desc: '极致的采光与通风要求。' },
          { label: '茶室/宁静角', desc: '一个可以独处、饮茶或阅读的地方。' },
          { label: '独立卫浴', desc: '强调安全性与便捷性。' }
        ];
      default:
        return [];
    }
  };

  const spaceOptions = getSpaceOptions();

  const toggleSpace = (space: string) => {
    const current = data.favoriteSpace || [];
    if (current.includes(space)) {
      updateData({ favoriteSpace: current.filter((s: string) => s !== space) });
    } else {
      updateData({ favoriteSpace: [...current, space] });
    }
  };

  return (
    <StepWrapper title="Q2-6：核心成员角色">
      <div className="space-y-8">
        <div className="space-y-4">
          <SubQuestion className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
            为了提供更符合您生活习惯的设计逻辑，请问您在未来的家中是哪类核心成员？
          </SubQuestion>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {options.map(opt => (
              <RadioCard
                key={opt.value}
                label={opt.label}
                selected={data.role === opt.value}
                onClick={() => {
                  if (data.role !== opt.value) {
                    updateData({ role: opt.value, favoriteSpace: [] });
                  }
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <SubQuestion className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
            在这个家里，哪个空间是您愿意花费最多心思（或待得最久）的？
          </SubQuestion>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.role ? (
              spaceOptions.map(opt => (
                <CheckboxCard
                  key={opt.label}
                  label={opt.label}
                  description={opt.desc}
                  selected={(data.favoriteSpace || []).includes(opt.label)}
                  onClick={() => toggleSpace(opt.label)}
                />
              ))
            ) : (
              <div className="col-span-full text-sm text-gray-400 bg-gray-50 p-4 rounded-xl text-center border border-dashed border-gray-200">
                请先选择上方的核心成员角色，以解锁专属空间推荐
              </div>
            )}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};

export const Step6_1 = ({ data, updateData }: StepProps) => {
  const members = [
    { id: 'daughter', label: '女儿', emoji: '👧' },
    { id: 'son', label: '儿子', emoji: '👦' },
    { id: 'cat', label: '猫猫', emoji: '🐱' },
    { id: 'dog', label: '狗狗', emoji: '🐶' }
  ];

  const spacesMap: Record<string, { title: string; desc: string; options: string[] }> = {
    daughter: {
      title: '女儿的空间需求',
      desc: '设计逻辑支撑 (SDI系统)：关注照明护眼、环保等级、成长可变性。',
      options: ['梦幻公主房', '独立书画区', '乐器练琴房', '超大储衣空间']
    },
    son: {
      title: '儿子的空间需求',
      desc: '设计逻辑支撑 (SDI系统)：关注耐划耐磨材料、电源插座布局、隔音。',
      options: ['乐高/积木区', '运动攀爬墙', '电脑电竞区', '独立手作台']
    },
    cat: {
      title: '猫猫的空间需求',
      desc: '设计逻辑支撑 (SDI系统)：关注新风除味、防抓材质、垂直动线。',
      options: ['猫墙/跑道', '嵌入式猫砂盆', '阳台封窗', '独立喂食区']
    },
    dog: {
      title: '狗狗的空间需求',
      desc: '设计逻辑支撑 (SDI系统)：关注地面防滑、防撞角设计、低位插座。',
      options: ['进门洗脚池', '独立卧榻', '宠物互动区', '扫拖机器人基地']
    }
  };

  const toggleMember = (id: string) => {
    const current = data.additionalMembers || [];
    if (current.includes(id)) {
      updateData({ additionalMembers: current.filter((m: string) => m !== id) });
    } else {
      updateData({ additionalMembers: [...current, id] });
    }
  };

  const toggleSpace = (memberId: string, space: string) => {
    const key = `${memberId}Spaces` as keyof FormData;
    const current = (data[key] as string[]) || [];
    if (current.includes(space)) {
      updateData({ [key]: current.filter((s: string) => s !== space) });
    } else {
      updateData({ [key]: [...current, space] });
    }
  };

  return (
    <StepWrapper title="Q2-6 附加：其他家庭成员">
      <div className="space-y-6">
        <div className="space-y-4">
          <SubQuestion className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
            有其他成员你想记录他们的活动空间吗？
          </SubQuestion>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {members.map(m => {
              const isSelected = (data.additionalMembers || []).includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleMember(m.id)}
                  className={`w-full flex flex-col items-center justify-center text-center p-4 rounded-xl transition-all duration-300 ${
                    isSelected 
                      ? 'bg-white ring-2 ring-[#D84936] shadow-[0_2px_10px_rgba(216,73,54,0.12)] transform scale-[1.02]' 
                      : 'bg-white hover:bg-gray-50 shadow-[0_1px_5px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors duration-300 text-2xl ${
                    isSelected ? 'bg-[#D84936]/10' : 'bg-[#F4F3F0]'
                  }`}>
                    {m.emoji}
                  </div>
                  <h3 className={`text-sm font-bold transition-colors duration-300 ${
                    isSelected ? 'text-[#D84936]' : 'text-gray-800'
                  }`}>
                    {m.label}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>

        {(data.additionalMembers || []).length > 0 && (
          <div className="space-y-4 pt-6 border-t border-gray-100">
            {(data.additionalMembers || []).map((memberId: string) => {
              const config = spacesMap[memberId];
              if (!config) return null;
              const selectedSpaces = (data[`${memberId}Spaces` as keyof FormData] as string[]) || [];
              
              return (
                <div key={memberId} className="space-y-3 bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-lg">{members.find(m => m.id === memberId)?.emoji}</span>
                      {config.title}
                    </h4>
                    <p className="text-xs text-[#D84936] mt-1.5 bg-[#D84936]/5 inline-block px-2 py-1 rounded-md">
                      {config.desc}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {config.options.map(opt => (
                      <CheckboxCard
                        key={opt}
                        label={opt}
                        selected={selectedSpaces.includes(opt)}
                        onClick={() => toggleSpace(memberId, opt)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StepWrapper>
  );
};

export const Step7 = ({ data, updateData }: StepProps) => {
  const options = [
    { value: 'A', label: '独立决策', desc: '我可以全权决定，追求效率，希望沟通直接精准。' },
    { value: 'B', label: '深度共创', desc: '我与家人共同参与，重大决策需内部达成共识。' },
    { value: 'C', label: '贴心参谋', desc: '我仅负责协助，最终决策由主要使用者决定。' }
  ];

  return (
    <StepWrapper title="Q2-7：沟通协作方式">
      <div className="space-y-6">
        <div className="space-y-4">
          <SubQuestion className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
            在未来的项目推进中，我们应如何更好地与您及家人协作？
          </SubQuestion>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {options.map(opt => (
              <RadioCard
                key={opt.value}
                label={opt.label}
                description={opt.desc}
                selected={data.collaboration === opt.value}
                onClick={() => updateData({ collaboration: opt.value })}
              />
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <SubQuestion className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
            您希望的参与方式是什么样的？
          </SubQuestion>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SquareRadioCard label="全程参与，把控细节" selected={data.involvement === 'high'} onClick={() => updateData({ involvement: 'high' })} />
            <SquareRadioCard label="抓大放小，定期确认" selected={data.involvement === 'medium'} onClick={() => updateData({ involvement: 'medium' })} />
            <SquareRadioCard label="全权委托，拎包入住" selected={data.involvement === 'low'} onClick={() => updateData({ involvement: 'low' })} />
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};

export const Step8 = ({ data, updateData }: StepProps) => (
  <StepWrapper title="Q2-8：计划节奏" subtitle="您的入住与完工预期">
    <div className="space-y-4">
      <div className="space-y-3">
        <SubQuestion className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          期望完工时间
        </SubQuestion>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['3个月内', '3-6个月', '半年到一年', '一年以上'].map(opt => (
            <SquareRadioCard
              key={opt}
              label={opt}
              selected={data.timeline === opt}
              onClick={() => updateData({ timeline: opt })}
            />
          ))}
        </div>
      </div>
    </div>
  </StepWrapper>
);

export const Step9 = ({ data, updateData }: StepProps) => {
  const groups = [
    { title: '公区', items: ['客厅', '餐厅'] },
    { title: '厨房', items: ['开放厨房', '封闭厨房'] },
    { title: '卧室', items: ['主卧室', '次卧室', '小孩卧室', '老人卧室'] },
    { title: '卫浴', items: ['主卫浴室', '公卫浴室', '次卫浴室'] },
    { title: '其他', items: ['书房', '花园'] }
  ];

  const allOptions = groups.flatMap(g => g.items);

  const parseCoreSpaces = (str: string) => {
    const counts: Record<string, number> = {};
    allOptions.forEach(opt => counts[opt] = 0);
    
    if (!str) return counts;
    
    allOptions.forEach(key => {
      const match = str.match(new RegExp(`(\\d+)${key}`));
      if (match) {
        counts[key] = parseInt(match[1]);
      }
    });
    
    return counts;
  };

  const counts = parseCoreSpaces(data.coreSpaces);

  const updateCount = (key: string, val: number) => {
    const newCounts = { ...counts, [key]: val };
    const newStr = allOptions
      .filter(name => newCounts[name] > 0)
      .map(name => `${newCounts[name]}${name}`)
      .join('');
    updateData({ coreSpaces: newStr });
  };

  return (
    <StepWrapper title="Q2-9：核心空间规划数量" subtitle="核心空间数量需求及未来规划">
      <div className="space-y-8">
        {groups.map(group => (
          <div key={group.title} className="space-y-3">
            <SubQuestion className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
              {group.title}
            </SubQuestion>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.items.map((name) => (
                <Counter
                  key={name}
                  label={name}
                  value={counts[name]}
                  onChange={(v: number) => updateCount(name, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </StepWrapper>
  );
};

export const Step10 = ({ data, updateData }: StepProps) => {
  const habits = [
    '经常做饭 (重油烟)',
    '偶尔做饭 (轻食/简餐)',
    '基本点外卖 (外出就餐)'
  ];
  
  const kitchens = [
    '不需要 (一个厨房足够)',
    '需要中西分厨',
    '需要独立辅食区 (轻食区)'
  ];

  return (
    <StepWrapper title="Q2-10：烹饪习惯" subtitle="了解您的厨房使用需求">
      <div className="space-y-10">
        <div className="space-y-4">
          <SubQuestion className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
            吃饭是比较喜欢做饭还是点外卖?
          </SubQuestion>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {habits.map(opt => {
              const { title, desc } = parseLabel(opt);
              const valueMap: Record<string, string> = {
                '经常做饭': 'heavy',
                '偶尔做饭': 'light',
                '基本点外卖': 'none'
              };
              return (
                <SquareRadioCard
                  key={opt}
                  label={title}
                  description={desc}
                  selected={data.cookingHabit === valueMap[title]}
                  onClick={() => updateData({ cookingHabit: valueMap[title] })}
                />
              );
            })}
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <SubQuestion className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
            是否会因为口味不同而分别烹饪?需要第二个厨房?
          </SubQuestion>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {kitchens.map(opt => {
              const { title, desc } = parseLabel(opt);
              const valueMap: Record<string, string> = {
                '不需要': 'no',
                '需要中西分厨': 'yes_split',
                '需要独立辅食区': 'yes_light'
              };
              return (
                <SquareRadioCard
                  key={opt}
                  label={title}
                  description={desc}
                  selected={data.secondKitchen === valueMap[title]}
                  onClick={() => updateData({ secondKitchen: valueMap[title] })}
                />
              );
            })}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};

export const Step11 = ({ data, updateData }: StepProps) => (
  <StepWrapper title="Q2-11：社交习惯" subtitle="是否经常有朋友聚会？">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <SquareRadioCard label="经常" description="喜欢在家招待朋友" selected={data.partyFrequency === 'high'} onClick={() => updateData({ partyFrequency: 'high' })} />
      <SquareRadioCard label="偶尔" description="三五好友小聚" selected={data.partyFrequency === 'medium'} onClick={() => updateData({ partyFrequency: 'medium' })} />
      <SquareRadioCard label="很少" description="更喜欢安静独处" selected={data.partyFrequency === 'low'} onClick={() => updateData({ partyFrequency: 'low' })} />
    </div>
  </StepWrapper>
);

export const Step12 = ({ data, updateData }: StepProps) => (
  <StepWrapper title="Q2-12：聚餐习惯" subtitle="就餐人数需求">
    <div className="space-y-6">
      <div className="space-y-3">
        <SubQuestion className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          平时几人就餐？
        </SubQuestion>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['1-2人', '3-4人', '5-6人', '6人以上'].map(opt => (
            <SquareRadioCard
              key={opt}
              label={opt}
              selected={data.diningCount === opt}
              onClick={() => updateData({ diningCount: opt })}
            />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <SubQuestion className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          逢年过节最多需要容纳几人？
        </SubQuestion>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['4-6人', '7-10人', '10人以上'].map(opt => (
            <SquareRadioCard
              key={opt}
              label={opt}
              selected={data.festivalDiningCount === opt}
              onClick={() => updateData({ festivalDiningCount: opt })}
            />
          ))}
        </div>
      </div>
    </div>
  </StepWrapper>
);

export const Step13 = ({ data, updateData }: StepProps) => {
  const options = [
    { id: 'media', label: '影音娱乐', desc: '看电视、投影大片、沉浸式视听' },
    { id: 'kids', label: '亲子互动', desc: '陪伴孩子玩耍、爬行、亲子游戏' },
    { id: 'work', label: '办公学习', desc: '阅读、居家工作、辅导孩子作业' },
    { id: 'social', label: '社交会客', desc: '招待亲友、下午茶、聚会聊天' },
    { id: 'fitness', label: '健身运动', desc: '瑜伽、拉伸、体感游戏' },
    { id: 'relax', label: '冥想放松', desc: '独处、听音乐、发呆、放空' }
  ];

  const toggleFeature = (id: string) => {
    const current = data.livingRoomFeature || [];
    if (current.includes(id)) {
      updateData({ livingRoomFeature: current.filter(i => i !== id) });
    } else {
      updateData({ livingRoomFeature: [...current, id] });
    }
  };

  return (
    <StepWrapper title="Q2-13：客厅活动习惯" subtitle="您希望在客厅，主要的家庭活动是什么（可多选）">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map(opt => (
          <SquareRadioCard
            key={opt.id}
            label={opt.label}
            description={opt.desc}
            selected={(data.livingRoomFeature || []).includes(opt.id)}
            onClick={() => toggleFeature(opt.id)}
          />
        ))}
      </div>
    </StepWrapper>
  );
};

export const Step14 = ({ data, updateData }: StepProps) => {
  const options = [
    '大量鞋履/包柜',
    '衣帽间/衣柜系统',
    '厨房餐储收纳',
    '展示性收纳（书籍、收藏品）',
    '儿童玩具收纳',
    '清洁工具/家政柜'
  ];

  const toggleOption = (opt: string) => {
    const current = data.storageFocus || [];
    if (current.includes(opt)) {
      updateData({ storageFocus: current.filter(item => item !== opt) });
    } else {
      updateData({ storageFocus: [...current, opt] });
    }
  };

  return (
    <StepWrapper title="Q2-14：收纳重点" subtitle="请选择您最关注的收纳区域（可多选）">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map(opt => (
          <SquareRadioCard
            key={opt}
            label={opt}
            selected={(data.storageFocus || []).includes(opt)}
            onClick={() => toggleOption(opt)}
          />
        ))}
      </div>
    </StepWrapper>
  );
};

export const Step15 = ({ data, updateData }: StepProps) => {
  const options = [
    '必须彻底干湿分离 (洗手台外置)',
    '常规干湿分离 (淋浴房/浴帘)',
    '无特殊要求'
  ];

  return (
    <StepWrapper title="Q2-15：干湿分离" subtitle="卫生间干湿分离需求">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map(opt => {
          const { title, desc } = parseLabel(opt);
          const valueMap: Record<string, string> = {
            '必须彻底干湿分离': 'strict',
            '常规干湿分离': 'normal',
            '无特殊要求': 'none'
          };
          return (
            <SquareRadioCard
              key={opt}
              label={title}
              description={desc}
              selected={data.dryWetSeparation === valueMap[title]}
              onClick={() => updateData({ dryWetSeparation: valueMap[title] })}
            />
          );
        })}
      </div>
    </StepWrapper>
  );
};

export const Step16 = ({ data, updateData }: StepProps) => {
  const [showWarning, setShowWarning] = React.useState(false);
  const options = [
    '绝对要环保（哪怕多花钱，也要进场就能住，没味儿、没甲醛）',
    '家里要极静（睡觉怕吵，受不了邻居动静或马路噪音）',
    '收纳够强大（空间利用率要高，东西放得下、找得到，拒绝杂乱）',
    '颜值即正义（一定要美观、高级，哪怕牺牲一点实用性，也要保证视觉上的极致呈现）',
    '严格控预算（说好花多少就花多少，不能一直超支）',
    '必须按时住（工期不能拖，定好了什么时候完工就得完工）'
  ];

  const toggleOption = (opt: string) => {
    const current = data.bottomLine || [];
    if (current.includes(opt)) {
      updateData({ bottomLine: current.filter(item => item !== opt) });
      setShowWarning(false);
    } else {
      if (current.length >= 2) {
        setShowWarning(true);
        return;
      }
      updateData({ bottomLine: [...current, opt] });
      setShowWarning(false);
    }
  };

  return (
    <StepWrapper title="Q2-16：底线与妥协" subtitle="这个家的“底线”，您最不能妥协的是？">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <SubQuestion className="flex items-center gap-2 mb-0!">
            <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
            这个家的“底线”，您最不能妥协的是？
          </SubQuestion>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${data.bottomLine.length >= 2 ? 'bg-[#D84936]/10 text-[#D84936]' : 'bg-gray-100 text-gray-500'}`}>
              已选 {data.bottomLine.length}/2
            </span>
            {showWarning && (
              <span className="text-xs text-[#D84936] animate-pulse font-bold">
                最多只能选择2项哦！
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {options.map(opt => {
            const { title, desc } = parseLabel(opt);
            return (
              <SquareRadioCard
                key={opt}
                label={title}
                description={desc}
                selected={(data.bottomLine || []).includes(opt)}
                onClick={() => toggleOption(opt)}
              />
            );
          })}
        </div>
      </div>
    </StepWrapper>
  );
};

const parseLabel = (text: string) => {
  const index = text.indexOf('（');
  const index2 = text.indexOf('(');
  const finalIndex = index !== -1 ? index : index2;
  
  if (finalIndex !== -1) {
    const endChar = index !== -1 ? '）' : ')';
    const endIndex = text.lastIndexOf(endChar);
    return {
      title: text.substring(0, finalIndex).trim(),
      desc: text.substring(finalIndex + 1, endIndex !== -1 ? endIndex : text.length).trim()
    };
  }
  return { title: text, desc: '' };
};

export const Step17 = ({ data, updateData }: StepProps) => {
  const options = [
    { label: '没讲究，怎么舒服怎么来', desc: '纯科学布局，追求空间利用率和动线最优' },
    { label: '避开大众忌讳就行', desc: '比如开门不直接撞见阳台、床头不靠窗、卫生间门不对床等常规避讳' },
    { label: '有比较看重的特定要求', desc: '比如一定要有独立玄关/影壁、特定的财位摆放、或者某间房必须给谁住' },
    { label: '我有专门的方案，需配合执行', desc: '已经请了专业人士看过，有具体的方位图和尺寸要求，设计师需全盘配合' }
  ];

  return (
    <StepWrapper title="Q2-17：风水布局" subtitle="关于新家的“风水布局”，您有特殊讲究吗？">
      <div className="space-y-6">
        <SubQuestion className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#D84936] rounded-full"></div>
          关于新家的“风水布局”，您有特殊讲究吗？
        </SubQuestion>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map(opt => (
            <RadioCard
              key={opt.label}
              label={opt.label}
              description={opt.desc}
              selected={data.fengshui === opt.label}
              onClick={() => updateData({ fengshui: opt.label })}
            />
          ))}
        </div>
      </div>
    </StepWrapper>
  );
};

export const Step18 = ({ data, updateData }: StepProps) => {
  const options = [
    { label: '全屋网络覆盖', icon: Wifi, desc: '每一个角落 Wi-Fi 信号都满格，刷剧不卡顿' },
    { label: '一键场景控制', icon: Zap, desc: '离家一键关全屋灯，回家自动开启迎宾模式' },
    { label: '氛围灯光调控', icon: Lightbulb, desc: '灯光可以调明暗、换冷暖，甚至随音乐律动' },
    { label: '隐形背景音乐', icon: Music, desc: '天花板里藏喇叭，让音乐像空气一样弥漫全屋' },
    { label: '24h 居家安防', icon: ShieldCheck, desc: '智能门锁、可视对讲，出门在外也能监控安全' },
    { label: '家电自动联动', icon: Cpu, desc: '传感器感应到人自动开空调，下雨自动关窗户' },
    { label: '遮阳自动系统', icon: Sun, desc: '早上窗帘定时开启，阳光太晒时遮阳帘自动降下' }
  ];

  const toggleOption = (label: string) => {
    updateData({ smartHomeOptions: label });
  };

  return (
    <StepWrapper title="Q2-18：智能需求" subtitle="您对新家的“智能程度”有什么期待？">
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {options.slice(0, 3).map(opt => (
            <SquareRadioCard
              key={opt.label}
              label={opt.label}
              icon={opt.icon}
              description={opt.desc}
              selected={data.smartHomeOptions === opt.label}
              onClick={() => toggleOption(opt.label)}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {options.slice(3).map(opt => (
            <SquareRadioCard
              key={opt.label}
              label={opt.label}
              icon={opt.icon}
              description={opt.desc}
              selected={data.smartHomeOptions === opt.label}
              onClick={() => toggleOption(opt.label)}
            />
          ))}
        </div>
      </div>
    </StepWrapper>
  );
};

export const Step19 = ({ data, updateData }: StepProps) => {
  const options = [
    { label: '新风系统', icon: Wind },
    { label: '中央空调', icon: AirVent },
    { label: '全空气系统', icon: Cloud },
    { label: '全屋净水', icon: Droplets },
    { label: '地暖系统', icon: Thermometer }
  ];

  const toggleOption = (opt: string) => {
    updateData({ comfortSystems: opt });
  };

  return (
    <StepWrapper title="Q2-19：系统选择" subtitle="请问您计划为新家配置哪些舒适系统？">
      <div className="grid grid-cols-3 gap-3">
        {options.map(opt => (
          <SquareRadioCard
            key={opt.label}
            label={opt.label}
            icon={opt.icon}
            selected={data.comfortSystems === opt.label}
            onClick={() => toggleOption(opt.label)}
          />
        ))}
      </div>
    </StepWrapper>
  );
};

export const Step20 = ({ data, updateData }: StepProps) => {
  const options = [
    { label: '智能门锁', icon: Lock },
    { label: '洗碗机', icon: Waves },
    { label: '厨房垃圾处理器', icon: Trash2 },
    { label: '智能马桶盖', icon: Bath },
    { label: '蒸烤箱', icon: Flame },
    { label: '扫拖机器人', icon: Bot },
    { label: '干衣机', icon: Wind }
  ];

  const toggleOption = (opt: string) => {
    updateData({ devices: opt });
  };

  return (
    <StepWrapper title="Q2-20：设备需求" subtitle="计划购入的家电设备">
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {options.slice(0, 3).map(opt => (
            <SquareRadioCard
              key={opt.label}
              label={opt.label}
              icon={opt.icon}
              selected={data.devices === opt.label}
              onClick={() => toggleOption(opt.label)}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {options.slice(3).map(opt => (
            <SquareRadioCard
              key={opt.label}
              label={opt.label}
              icon={opt.icon}
              selected={data.devices === opt.label}
              onClick={() => toggleOption(opt.label)}
            />
          ))}
        </div>
      </div>
    </StepWrapper>
  );
};

export const Step21 = ({ data, updateData }: StepProps) => {
  const options = [
    '无障碍需求',
    '旧家具留存',
    '儿童成长性需求',
    '亲友留宿需求',
    '未来1–2年是否可能出现居住变化（添娃/父母同住/远程办公）'
  ];

  const toggleOption = (opt: string) => {
    updateData({ otherNeedsOptions: opt });
  };

  return (
    <StepWrapper title="Q2-21：个性需求" subtitle="其他特殊需求">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map(opt => (
            <SquareRadioCard
              key={opt}
              label={opt}
              selected={data.otherNeedsOptions === opt}
              onClick={() => toggleOption(opt)}
            />
          ))}
        </div>
        
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <TextInput label="其他补充需求" value={data.otherNeeds} onChange={(v: string) => updateData({ otherNeeds: v })} placeholder="任何其他想告诉我们的" />
        </div>
      </div>
    </StepWrapper>
  );
};

export const StepSubmit = ({ data }: StepProps) => (
  <StepWrapper title="用户注册与签约" subtitle="如您对我们的服务感兴趣，请您注册并填写真实信息，我们将开启您的专属服务">
    <div className="space-y-8">
      <div className="bg-[#F4F3F0] p-8 rounded-3xl">
        <h3 className="font-medium text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-5 bg-[#D84936] rounded-full"></div>
          确认您的联系信息
        </h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span>姓名</span>
            <span className="font-medium text-gray-900">{data.userName || '未填写'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span>电话</span>
            <span className="font-medium text-gray-900">{data.userPhone || '未填写'}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span>城市</span>
            <span className="font-medium text-gray-900">{data.userCity || '未填写'}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4">
        <button className="w-full bg-white border-2 border-[#302E2B] text-[#302E2B] py-4 rounded-xl font-medium text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          意向金支付合同确认
        </button>
        <button className="w-full bg-[#D84936] text-white py-4 rounded-xl font-medium text-lg hover:bg-[#c2412f] transition-colors shadow-lg shadow-red-500/20">
          提交需求并注册
        </button>
      </div>
      
      <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
        <Check size={12} /> 点击提交即表示您同意我们的隐私政策与服务条款
      </p>
    </div>
  </StepWrapper>
);
