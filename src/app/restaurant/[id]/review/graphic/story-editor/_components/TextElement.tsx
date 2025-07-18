const TEXT_BOX_OPTIONS = [
  {
    id: 'text_black_bg',
    type: 'text',
    content: '간단한 후기를 추가해주세요!',
    width: 280,
    height: 33,
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#000000',
  },
  {
    id: 'text_white_bg',
    type: 'text',
    content: '간단한 후기를 추가해주세요!',
    width: 280,
    height: 33,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
];

type TextElementProps = {
  addNewElement: (option: any) => void;
};

const TextElement = ({ addNewElement }: TextElementProps) => {
  return (
    <div className="mb-5">
      <h3 className="mb-4 text-[16px] font-semibold leading-[130%]">
        텍스트 박스
      </h3>
      <div className="flex flex-col gap-4">
        {TEXT_BOX_OPTIONS.map((option) => (
          <div
            key={option.id}
            className="w-[337px] cursor-pointer rounded-[12px] bg-[#FAFAFA] p-5 text-center transition-colors"
            onClick={() => addNewElement(option)}
          >
            <div
              className="box-border h-[33px] w-[199px] px-[10px] py-[6px] text-center text-[15px] font-normal leading-[130%]"
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
    </div>
  );
};

export default TextElement;
