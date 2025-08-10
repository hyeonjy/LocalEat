const TAG_OPTIONS = [
  {
    id: 'tag_filled',
    type: 'tag',
    content: '@ 가게명',
    color: '#FFFFFF',
    backgroundColor: '#FA4D09',
    name: '가게명 태그',
  },
  {
    id: 'tag_outline',
    type: 'tag',
    content: '# 키워드',
    color: '#FA4D09',
    backgroundColor: '#FFFFFF',
    name: '키워드 태그',
  },
];

type TagElementProps = {
  addNewElement: (option: any) => void;
};

const TagElement = ({ addNewElement }: TagElementProps) => {
  return (
    <>
      <h3 className="mb-4 text-[16px] font-semibold leading-[130%]">태그</h3>
      <div className="flex gap-3">
        {TAG_OPTIONS.map((option) => (
          <div
            key={option.id}
            className="w-[120px] cursor-pointer rounded-[12px] bg-[#FAFAFA] p-5 text-center transition-colors"
            onClick={() => addNewElement(option)}
          >
            <div
              className="h-[29px] w-[80px] rounded-full border border-current px-[10px] py-1 text-[15px] font-normal leading-[130%]"
              style={{
                color: option.color,
                backgroundColor: option.backgroundColor,
              }}
            >
              {option.content}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TagElement;
