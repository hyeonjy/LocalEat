import { RESIZE_HANDLE_STYLES } from '@/constants/storyEditor';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import ElementToolbar from './ElementToolbar';

interface StoryCanvasProps {
  storyEditor: any;
  canvasProps: {
    canvasW: number;
    canvasH: number;
    scale: { x: number; y: number }; // 사용 안 해도 유지
  };
  selectedToolbarPos: { top: number; left: number; width: number } | null;
}

const BASE_W = 495;
const BASE_H = 743;

const StoryCanvas = ({
  storyEditor,
  canvasProps,
  selectedToolbarPos,
}: StoryCanvasProps) => {
  const { canvasW, canvasH } = canvasProps;

  const getScaleFromDOM = () => {
    const rect = storyEditor.canvasRef?.current?.getBoundingClientRect();
    if (rect?.width && rect?.height) {
      return { x: rect.width / BASE_W, y: rect.height / BASE_H };
    }
    return { x: canvasW / BASE_W, y: canvasH / BASE_H };
  };

  const [actualScale, setActualScale] = useState(() => getScaleFromDOM());
  const roRef = useRef<ResizeObserver | null>(null);

  /** 1) 레이아웃 페인트 전에 DOM 크기 선측정 (템플릿/이미지 교체 직후도 정확히) */
  useLayoutEffect(() => {
    setActualScale(getScaleFromDOM());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasW, canvasH, storyEditor.selectedTemplate, storyEditor.image]);

  /** 2) 캔버스 DOM 사이즈 변화를 정밀 추적 */
  useEffect(() => {
    if (!storyEditor.canvasRef?.current) return;
    const el = storyEditor.canvasRef.current;

    roRef.current?.disconnect();
    roRef.current = new ResizeObserver(() => {
      setActualScale(getScaleFromDOM());
    });
    roRef.current.observe(el);
    return () => {
      roRef.current?.disconnect();
      roRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyEditor.canvasRef?.current]);

  /** 3) Rnd가 내부 캐시 때문에 가끔 위치를 고집하는 문제를 피하기 위해 scale 키로 강제 리마운트 */
  const scaleKey = useMemo(
    () =>
      `${Math.round(actualScale.x * 1000)}x${Math.round(actualScale.y * 1000)}`,
    [actualScale.x, actualScale.y],
  );

  return (
    <main className="flex h-[550px] w-[300px] items-center justify-center bg-[#F5F5F5] lg:h-[calc(100vh-65px)] lg:py-10 [@media(min-width:550px)]:h-[90vh] [@media(min-width:550px)]:w-full">
      <div
        ref={storyEditor.canvasRef}
        className="story-canvas relative overflow-visible rounded bg-white shadow-inner"
        style={{ width: canvasW, height: canvasH }}
        onClick={storyEditor.handleCanvasClick}
      >
        {/* 툴바 */}
        {selectedToolbarPos && !storyEditor.editingElementId && (
          <ElementToolbar
            position={selectedToolbarPos}
            onCopy={storyEditor.handleCopyElement}
            onDelete={storyEditor.handleDeleteElement}
          />
        )}

        {/* 배경 이미지 */}
        {storyEditor.selectedTemplate ? (
          <Image
            src={storyEditor.selectedTemplate.background}
            alt="template-bg"
            width={canvasW}
            height={canvasH}
            className="h-full w-full select-none rounded object-cover"
            draggable={false}
            priority
          />
        ) : storyEditor.image ? (
          <Image
            src={storyEditor.image}
            alt="uploaded"
            className="h-full w-full select-none rounded object-cover"
            width={canvasW}
            height={canvasH}
            draggable={false}
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            템플릿을 선택하거나 텍스트/스티커를 추가하세요
          </div>
        )}

        {/* 요소들 */}
        {storyEditor.elements.map((el: any) => {
          const scaledWidth = el.width * actualScale.x;
          const scaledHeight = el.height * actualScale.y;
          const scaledX = (el.x - el.width / 2) * actualScale.x; // 좌상단 X
          const scaledY = (el.y - el.height / 2) * actualScale.y; // 좌상단 Y
          const isSelected = el.id === storyEditor.selectedElementId;
          const isEditing = storyEditor.editingElementId === el.id;

          const commonRndProps = {
            key: `${el.id}-${scaleKey}`, // 스케일 변할 때마다 강제 리마운트
            position: { x: scaledX, y: scaledY },
            size: { width: scaledWidth, height: scaledHeight },
            bounds: 'parent' as const,
            resizeHandleStyles: RESIZE_HANDLE_STYLES,
            renderDirections: ['nw', 'w', 'sw', 'ne', 'e', 'se'] as any,
            style: { border: isSelected ? '1px solid #FA4D09' : 'none' },
          };

          if (el.type === 'sticker') {
            return (
              <Rnd
                {...commonRndProps}
                enableResizing={isSelected}
                disableDragging={!isSelected}
                onDragStop={(e, data) => {
                  storyEditor.updateElementPosition(
                    el.id,
                    data.x,
                    data.y,
                    actualScale,
                  );
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const scaledLeft = position.x;
                  const scaledTop = position.y;
                  const scaledW = parseInt(ref.style.width, 10);
                  const scaledH = parseInt(ref.style.height, 10);
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    scaledLeft,
                    scaledTop,
                    scaledW,
                    scaledH,
                    actualScale,
                  );
                }}
                onResize={(e, direction, ref, delta, position) => {
                  const scaledLeft = position.x;
                  const scaledTop = position.y;
                  const scaledW = parseInt(ref.style.width, 10);
                  const scaledH = parseInt(ref.style.height, 10);
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    scaledLeft,
                    scaledTop,
                    scaledW,
                    scaledH,
                    actualScale,
                  );
                }}
              >
                <div
                  className="h-full w-full cursor-pointer"
                  style={{
                    transform: `${el.rotation ? `rotate(${el.rotation}deg)` : ''} ${el.flipX ? 'scaleX(-1)' : ''}`,
                  }}
                  onClick={(e) => storyEditor.handleElementClick(e, el.id)}
                >
                  <Image
                    src={el.src}
                    alt="sticker"
                    width={el.width}
                    height={el.height}
                    className="h-full w-full select-none"
                    draggable={false}
                  />
                </div>
              </Rnd>
            );
          }

          if (el.type === 'text') {
            return (
              <Rnd
                {...commonRndProps}
                enableResizing={isSelected && !isEditing}
                disableDragging={!isSelected || isEditing}
                onDragStop={(e, data) => {
                  storyEditor.updateElementPosition(
                    el.id,
                    data.x,
                    data.y,
                    actualScale,
                  );
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const scaledLeft = position.x;
                  const scaledTop = position.y;
                  const scaledW = parseInt(ref.style.width, 10);
                  const scaledH = parseInt(ref.style.height, 10);
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    scaledLeft,
                    scaledTop,
                    scaledW,
                    scaledH,
                    actualScale,
                  );
                }}
                onResize={(e, direction, ref, delta, position) => {
                  const scaledLeft = position.x;
                  const scaledTop = position.y;
                  const scaledW = parseInt(ref.style.width, 10);
                  const scaledH = parseInt(ref.style.height, 10);
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    scaledLeft,
                    scaledTop,
                    scaledW,
                    scaledH,
                    actualScale,
                  );
                }}
              >
                <div
                  className="flex h-full w-full items-center justify-center overflow-hidden px-[10px] py-[6px] text-center"
                  style={{
                    color: el.color,
                    backgroundColor: el.backgroundColor,
                    transform: `${el.rotation ? `rotate(${el.rotation}deg)` : ''} ${el.flipX ? 'scaleX(-1)' : ''}`,
                    boxSizing: 'border-box',
                    fontSize: `${(el.fontSize || 14) * Math.min(actualScale.x, actualScale.y)}px`,
                  }}
                  onClick={(e) => storyEditor.handleElementClick(e, el.id)}
                  onDoubleClick={(e) =>
                    storyEditor.handleElementDoubleClick(e, el.id)
                  }
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={storyEditor.editingText}
                      onChange={storyEditor.handleTextChange}
                      onKeyDown={storyEditor.handleTextKeyDown}
                      onBlur={storyEditor.handleTextSubmit}
                      autoFocus
                      className="w-full bg-transparent text-center outline-none"
                      style={{
                        color: el.color,
                        fontSize: `${(el.fontSize || 14) * Math.pow(Math.min(actualScale.x, actualScale.y), 1.2)}px`,
                      }}
                    />
                  ) : (
                    <span className="cursor-pointer select-none">
                      {el.content}
                    </span>
                  )}
                </div>
              </Rnd>
            );
          }

          if (el.type === 'tag') {
            return (
              <Rnd
                {...commonRndProps}
                enableResizing={isSelected && !isEditing}
                disableDragging={!isSelected || isEditing}
                onDragStop={(e, data) => {
                  storyEditor.updateElementPosition(
                    el.id,
                    data.x,
                    data.y,
                    actualScale,
                  );
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const scaledLeft = position.x;
                  const scaledTop = position.y;
                  const scaledW = parseInt(ref.style.width, 10);
                  const scaledH = parseInt(ref.style.height, 10);
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    scaledLeft,
                    scaledTop,
                    scaledW,
                    scaledH,
                    actualScale,
                  );
                }}
                onResize={(e, direction, ref, delta, position) => {
                  const scaledLeft = position.x;
                  const scaledTop = position.y;
                  const scaledW = parseInt(ref.style.width, 10);
                  const scaledH = parseInt(ref.style.height, 10);
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    scaledLeft,
                    scaledTop,
                    scaledW,
                    scaledH,
                    actualScale,
                  );
                }}
              >
                <div
                  className="flex h-full w-full items-center justify-center rounded-[999px] border border-[#FA4D09] px-[10px] py-[4px] text-center"
                  style={{
                    color: el.color,
                    backgroundColor: el.backgroundColor,
                    transform: `${el.rotation ? `rotate(${el.rotation}deg)` : ''} ${el.flipX ? 'scaleX(-1)' : ''}`,
                    boxSizing: 'border-box',
                    width: '100%',
                    fontSize: `${(el.fontSize || 14) * Math.min(actualScale.x, actualScale.y)}px`,
                  }}
                  onClick={(e) => storyEditor.handleElementClick(e, el.id)}
                  onDoubleClick={(e) =>
                    storyEditor.handleElementDoubleClick(e, el.id)
                  }
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={storyEditor.editingText}
                      onChange={storyEditor.handleTextChange}
                      onKeyDown={storyEditor.handleTextKeyDown}
                      onBlur={storyEditor.handleTextSubmit}
                      autoFocus
                      className="w-full bg-transparent text-center outline-none"
                      style={{
                        color: el.color,
                        fontSize: `${(el.fontSize || 14) * Math.pow(Math.min(actualScale.x, actualScale.y), 1.2)}px`,
                      }}
                    />
                  ) : (
                    <span className="cursor-pointer select-none">
                      {el.content}
                    </span>
                  )}
                </div>
              </Rnd>
            );
          }

          return null;
        })}
      </div>
    </main>
  );
};

export default StoryCanvas;
