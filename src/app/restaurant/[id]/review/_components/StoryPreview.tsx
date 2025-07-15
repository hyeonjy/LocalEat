import Image from 'next/image';

const StoryPreview = ({
  backgroundImage,
  elements,
  previewW,
  previewH,
}: {
  backgroundImage?: string;
  elements?: any[];
  previewW: number;
  previewH: number;
}) => {
  // 에디터와 동일한 기준 크기 사용
  const BASE_W = 495;
  const BASE_H = 743;

  const scale = {
    x: previewW / BASE_W,
    y: previewH / BASE_H,
  };

  if (!backgroundImage && (!elements || elements.length === 0)) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
        스토리 없음
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 배경 이미지 */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="story-background"
          fill
          className="object-cover"
          draggable={false}
        />
      )}

      {elements?.map((el) => {
        const scaledWidth = el.width * scale.x;
        const scaledHeight = el.height * scale.y;

        const scaledX = el.x * scale.x - scaledWidth / 2;
        const scaledY = el.y * scale.y - scaledHeight / 2;

        if (el.type === 'sticker') {
          return (
            <div
              key={el.id}
              className="absolute"
              style={{
                left: scaledX,
                top: scaledY,
                width: scaledWidth,
                height: scaledHeight,
                transform: `${el.rotation ? `rotate(${el.rotation}deg)` : ''} ${el.flipX ? 'scaleX(-1)' : ''}`,
              }}
            >
              <Image
                src={el.src}
                alt="sticker"
                width={scaledWidth}
                height={scaledHeight}
                className="h-full w-full select-none"
                draggable={false}
              />
            </div>
          );
        } else if (el.type === 'text') {
          return (
            <div
              key={el.id}
              className="absolute flex items-center justify-center overflow-hidden text-center"
              style={{
                left: scaledX,
                top: scaledY,
                width: scaledWidth,
                height: scaledHeight,
                color: el.color,
                backgroundColor: el.backgroundColor || el.background_color,
                transform: `${el.rotation ? `rotate(${el.rotation}deg)` : ''} ${el.flipX ? 'scaleX(-1)' : ''}`,
                fontSize: `${(el.fontSize || el.font_size || 14) * Math.pow(Math.min(scale.x, scale.y), 1.2)}px`,
                boxSizing: 'border-box',
                paddingLeft: `${10 * scale.x}px`,
                paddingRight: `${10 * scale.x}px`,
                paddingTop: `${6 * scale.y}px`,
                paddingBottom: `${6 * scale.y}px`,
              }}
            >
              <span className="select-none">{el.content}</span>
            </div>
          );
        } else if (el.type === 'tag') {
          return (
            <div
              key={el.id}
              className="absolute flex items-center justify-center border text-center"
              style={{
                left: scaledX,
                top: scaledY,
                width: scaledWidth,
                height: scaledHeight,
                color: el.color,
                backgroundColor: el.backgroundColor || el.background_color,
                borderColor: '#FA4D09',
                borderRadius: '999px',
                transform: `${el.rotation ? `rotate(${el.rotation}deg)` : ''} ${el.flipX ? 'scaleX(-1)' : ''}`,
                fontSize: `${(el.fontSize || el.font_size || 14) * Math.pow(Math.min(scale.x, scale.y), 1.2)}px`,
                boxSizing: 'border-box',
                paddingLeft: `${10 * scale.x}px`,
                paddingRight: `${10 * scale.x}px`,
                paddingTop: `${4 * scale.y}px`,
                paddingBottom: `${4 * scale.y}px`,
              }}
            >
              <span className="select-none">{el.content}</span>
            </div>
          );
        }
      })}
    </div>
  );
};

export default StoryPreview;
