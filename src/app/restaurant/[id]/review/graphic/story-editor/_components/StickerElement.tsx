import Image from 'next/image';

const LOGO_OPTIONS = [
  {
    id: 'logo_orange',
    type: 'sticker',
    src: `/assets/stickers/sticker1.svg`,
  },
  {
    id: 'logo_green',
    type: 'sticker',
    src: `/assets/stickers/sticker2.svg`,
  },
  {
    id: 'logo_localeat',
    type: 'sticker',
    src: `/assets/stickers/sticker3.svg`,
  },
];

const STICKER_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
  id: `sticker_${i + 4}`,
  type: 'sticker',
  src: `/assets/stickers/sticker${i + 4}.svg`,
}));

type StickerElementProps = {
  addNewElement: (option: any) => void;
};

const StickerElement = ({ addNewElement }: StickerElementProps) => {
  return (
    <div className="pt-5">
      <div className="mb-6">
        <h3 className="mb-5 text-[16px] font-semibold leading-[130%]">로고</h3>
        <div className="flex gap-[6px]">
          {LOGO_OPTIONS.map((option) => (
            <div
              key={option.id}
              className="flex h-[108px] w-[108px] cursor-pointer items-center justify-center rounded-[12px] bg-[#FAFAFA]"
              onClick={() => addNewElement(option)}
            >
              <Image
                src={option.src}
                alt={option.id}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-5 text-[16px] font-semibold leading-[130%]">
          스티커
        </h3>
        <div className="grid w-[336px] grid-cols-3 gap-x-[6px] gap-y-[14px]">
          {STICKER_OPTIONS.map((option) => (
            <div
              key={option.id}
              className="flex h-[108px] w-[108px] cursor-pointer items-center justify-center rounded-[12px] bg-[#FAFAFA]"
              onClick={() => addNewElement(option)}
            >
              <Image
                src={option.src}
                alt={option.id}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickerElement;
