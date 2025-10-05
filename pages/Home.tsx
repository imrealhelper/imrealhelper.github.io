
import React from 'react';

const Home: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold border-b-2 border-black pb-4 mb-8">
        Jin-Woo Im
      </h1>

      <div className="flex flex-col md:flex-row items-start md:gap-8">
        <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
          <img 
            src="https://jonghank.github.io/people/jhk-2024.jpg" 
            alt="A photograph for the blog" 
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="w-full md:w-2/3 prose max-w-none">
          <p className="text-xl leading-relaxed !mt-0">
            인하대학교 항공우주공학과 4학년에 재학중인 임진우입니다.
            <br />
            저는 최적화(Optimization)와 인공지능(AI) 기술에 깊은 관심을 가지고 있으며,
            이 두 분야의 융합을 통해 복잡한 항공우주 시스템의 문제를 해결하는 것을 목표로 하고 있습니다.
          </p>
          <p className="text-xl leading-relaxed mt-4">
            새로운 기술을 배우고 적용하는 과정을 즐기며, 이론적 지식을 바탕으로 실제적인 해결책을 만들어내는 것에 큰 보람을 느낍니다.
          </p>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">관심 분야</h2>
            <ul className="list-disc list-inside text-xl space-y-2">
              <li>항공우주 시스템 최적화 (Aerospace System Optimization)</li>
              <li>인공지능 기반 자율 항법 (AI-based Autonomous Navigation)</li>
              <li>강화학습을 이용한 제어 시스템 (Control Systems using Reinforcement Learning)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;