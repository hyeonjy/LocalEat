import { RESIZE_HANDLE_STYLES } from '@/constants/storyEditor';
import Image from 'next/image';
import { Rnd } from 'react-rnd';
import ElementToolbar from './ElementToolbar';

interface StoryCanvasProps {
  storyEditor: any;
  canvasProps: {
    canvasW: number;
    canvasH: number;
    scale: { x: number; y: number };
  };
  selectedToolbarPos: { top: number; left: number; width: number } | null;
}

const StoryCanvas = ({
  storyEditor,
  canvasProps,
  selectedToolbarPos,
}: StoryCanvasProps) => {
  const { canvasW, canvasH, scale } = canvasProps;

  return (
    <main className="ml-[384px] flex h-[calc(100vh-65px)] flex-1 items-center justify-center bg-[#F5F5F5] py-10 pl-5">
      <div
        ref={storyEditor.canvasRef}
        className="relative overflow-visible rounded bg-white shadow-inner"
        style={{ width: canvasW, height: canvasH, aspectRatio: '9 / 16' }}
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
          />
        ) : storyEditor.image ? (
          <Image
            src={storyEditor.image}
            alt="uploaded"
            className="h-full w-full select-none rounded object-cover"
            width={canvasW}
            height={canvasH}
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            템플릿을 선택하거나 텍스트/스티커를 추가하세요
          </div>
        )}

        {/* 요소들 */}
        {storyEditor.elements.map((el: any) => {
          const width = el.width * scale.x;
          const height = el.height * scale.y;
          const x = el.x * scale.x - width / 2;
          const y = el.y * scale.y - height / 2;
          const isSelected = el.id === storyEditor.selectedElementId;

          if (el.type === 'sticker') {
            return (
              <Rnd
                key={el.id}
                position={{ x, y }}
                size={{ width, height }}
                enableResizing={isSelected}
                disableDragging={!isSelected}
                onDragStop={(e, data) => {
                  storyEditor.updateElementPosition(
                    el.id,
                    data.x,
                    data.y,
                    scale,
                  );
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    position.x,
                    position.y,
                    parseInt(ref.style.width),
                    parseInt(ref.style.height),
                    scale,
                  );
                }}
                onResize={(e, direction, ref, delta, position) => {
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    position.x,
                    position.y,
                    parseInt(ref.style.width),
                    parseInt(ref.style.height),
                    scale,
                  );
                }}
                bounds="parent"
                resizeHandleStyles={RESIZE_HANDLE_STYLES}
                renderDirections={['nw', 'w', 'sw', 'ne', 'e', 'se']}
                style={{
                  border: isSelected ? '1px solid #FA4D09' : 'none',
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
            const isEditing = storyEditor.editingElementId === el.id;

            return (
              <Rnd
                key={el.id}
                position={{ x, y }}
                size={{ width, height }}
                enableResizing={isSelected && !isEditing}
                disableDragging={!isSelected || isEditing}
                onDragStop={(e, data) => {
                  storyEditor.updateElementPosition(
                    el.id,
                    data.x,
                    data.y,
                    scale,
                  );
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    position.x,
                    position.y,
                    parseInt(ref.style.width),
                    parseInt(ref.style.height),
                    scale,
                  );
                }}
                onResize={(e, direction, ref, delta, position) => {
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    position.x,
                    position.y,
                    parseInt(ref.style.width),
                    parseInt(ref.style.height),
                    scale,
                  );
                }}
                bounds="parent"
                resizeHandleStyles={RESIZE_HANDLE_STYLES}
                renderDirections={['nw', 'w', 'sw', 'ne', 'e', 'se']}
                style={{
                  border: isSelected ? '1px solid #FA4D09' : 'none',
                }}
              >
                <div
                  className="flex h-full w-full items-center justify-center overflow-hidden px-[10px] py-[6px] text-center"
                  style={{
                    color: el.color,
                    backgroundColor: el.backgroundColor,
                    transform: `${el.rotation ? `rotate(${el.rotation}deg)` : ''} ${el.flipX ? 'scaleX(-1)' : ''}`,
                    boxSizing: 'border-box',
                    fontSize: `${(el.fontSize || 14) * Math.pow(Math.min(scale.x, scale.y), 1.2)}px`,
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
                        fontSize: `${(el.fontSize || 14) * Math.pow(Math.min(scale.x, scale.y), 1.2)}px`,
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
            const isEditing = storyEditor.editingElementId === el.id;

            return (
              <Rnd
                key={el.id}
                position={{ x, y }}
                size={{ width, height }}
                enableResizing={isSelected && !isEditing}
                disableDragging={!isSelected || isEditing}
                onDragStop={(e, data) => {
                  storyEditor.updateElementPosition(
                    el.id,
                    data.x,
                    data.y,
                    scale,
                  );
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    position.x,
                    position.y,
                    parseInt(ref.style.width),
                    parseInt(ref.style.height),
                    scale,
                  );
                }}
                onResize={(e, direction, ref, delta, position) => {
                  storyEditor.updateElementSizeAndPosition(
                    el.id,
                    position.x,
                    position.y,
                    parseInt(ref.style.width),
                    parseInt(ref.style.height),
                    scale,
                  );
                }}
                bounds="parent"
                resizeHandleStyles={RESIZE_HANDLE_STYLES}
                renderDirections={['nw', 'w', 'sw', 'ne', 'e', 'se']}
                style={{
                  border: isSelected ? '1px solid #FA4D09' : 'none',
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
                    fontSize: `${(el.fontSize || 14) * Math.pow(Math.min(scale.x, scale.y), 1.2)}px`,
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
                        fontSize: `${(el.fontSize || 14) * Math.pow(Math.min(scale.x, scale.y), 1.2)}px`,
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
