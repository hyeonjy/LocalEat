import { cn } from '@/lib/utils';

type KeywordCategory = {
  title: string;
  width: string;
  keywords: string[];
};

const KEYWORD_CATEGORIES: KeywordCategory[] = [
  {
    title: '서비스/만족도',
    width: '151px',
    keywords: [
      '또 오고 싶어요❤️',
      '응대가 친절해요🤫',
      '음식이 빨리 나와요🪷',
      '웨이팅 관리가 잘돼요🧔',
      '주차가 편해요🚗',
      '위치 찾기 쉬워요📍',
      '예약이 쉬워요📞',
    ],
  },
  {
    title: '음식/맛',
    width: '243px',
    keywords: [
      '식감이 좋아요🥑',
      '신선해요🥒',
      '다이어트식이에요🥗',
      '양이 많아요🍣',
      '이국적이에요🪷',
      '깔끔해요🍜',
      '자극적이에요🥓',
      '국물이 진해요🍲',
      '집밥 같아요🍚',
      '시원해요🍺',
      '매워요🌶️',
      '부드러워요🍞',
      '가성비 최고예요🪙',
      '고급스러워요🎀',
    ],
  },
  {
    title: '분위기/공간',
    width: '279px',
    keywords: [
      '가족이랑 가기 좋아요🌻',
      '작업하기 좋아요🥨',
      '데이트 장소로 좋아요🌛',
      '혼밥하기 좋아요🙆',
      '사진 찍기 좋아요📷',
      '로컬 느낌이 나요🕵️‍',
      '반려동물 동반 가능해요🐶',
      '깨끗해요🧼',
      '현지인만 아는👀',
      '밤 늦게도 열어요🌛',
      '단골이 많아요🧑‍🤝‍🧑',
      '조용해서 좋아요🤫',
      '인테리어가 멋져요✨',
      '공간이 넓어요🪑',
    ],
  },
];

type KeywordSelectionProps = {
  keywords: string[];
  onKeywordToggle: (keyword: string) => void;
};

const KeywordSelection = ({
  keywords,
  onKeywordToggle,
}: KeywordSelectionProps) => {
  return (
    <section className="mt-[32px] w-[772px] rounded-[50px] bg-[#FDF8F6] px-[33px] py-[40px]">
      <h2 className="mb-[24px] text-[20px] font-semibold leading-[130%]">
        키워드를 선택해주세요.
      </h2>

      <div className="flex gap-[16px]">
        {KEYWORD_CATEGORIES.map((category) => (
          <div key={category.title}>
            <h2 className="mb-[16px] text-[18px] font-semibold leading-[130%]">
              {category.title}
            </h2>
            <div
              className="flex flex-wrap gap-x-[6px] gap-y-[14px]"
              style={{ width: category.width }}
            >
              {category.keywords.map((keyword) => {
                const isSelected = keywords.includes(keyword);
                return (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => onKeywordToggle(keyword)}
                    className={cn(
                      'h-[36px] whitespace-nowrap rounded-[20px] border px-[10px] py-[6px] text-[14px] font-normal leading-[100%] text-[#2E2E32]',
                      isSelected
                        ? 'box-border border-[#FA4D09] bg-[#FEEDE6]'
                        : 'box-border border-[#C7C7CC] bg-white',
                    )}
                  >
                    {keyword}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <input type="hidden" name="keywords" value={keywords} />
    </section>
  );
};

export default KeywordSelection;
