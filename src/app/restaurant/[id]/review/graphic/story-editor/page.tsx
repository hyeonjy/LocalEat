'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEMPLATES } from '@/constants/template';
import type { Template } from '@/types/template';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import EditorHeader from '../../_components/EditorHeader';

const BASE_W = 495;
const BASE_H = 743;

const TABS = [
  { name: '템플릿', value: 'template' },
  { name: '텍스트', value: 'text' },
  { name: '스티커', value: 'sticker' },
] as const;

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

// canvas 크기 및 스케일 계산
const useResponsiveCanvas = () => {
  const [{ w, h }, setSize] = useState({ w: BASE_W, h: BASE_H });
  const [scale, setScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const onResize = () => {
      const maxH = window.innerHeight - 100;
      const newH = Math.min(BASE_H, maxH);
      const newW = (newH * BASE_W) / BASE_H;
      setSize({ w: newW, h: newH });
      setScale({ x: newW / BASE_W, y: newH / BASE_H });
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { canvasW: w, canvasH: h, scale };
};

const StoryEditorPage = () => {
  const router = useRouter();
  const { canvasW, canvasH, scale } = useResponsiveCanvas();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [elements, setElements] = useState<any[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // localStorage에서 스토리 데이터 복원
  useEffect(() => {
    const savedStoryData = localStorage.getItem('storyData');
    if (savedStoryData) {
      try {
        const storyData = JSON.parse(savedStoryData);

        // 요소 복원
        if (storyData.elements && storyData.elements.length > 0) {
          setElements(storyData.elements);
        }

        // 템플릿 복원
        if (storyData.selectedTemplate) {
          setSelectedTemplate(storyData.selectedTemplate);
        }

        // 이미지 복원
        if (storyData.image) {
          setImage(storyData.image);
        }
      } catch (error) {
        console.error('스토리 데이터 복원 실패:', error);
      }
    }
  }, []);

  const calculateTagSize = (content: string, fontSize = 14) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return { width: 100, height: 32 };

    context.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    const textWidth = context.measureText(content).width;

    const paddingX = 20;
    const paddingY = 8;
    const borderWidth = 2;
    const margin = 10;

    return {
      width: Math.max(textWidth + paddingX + borderWidth + margin, 60),
      height: Math.max(fontSize + paddingY + borderWidth, 32),
    };
  };

  const addNewElement = (option: any) => {
    const newId = `${option.id}_${Date.now()}`;

    let newElement;

    if (option.type === 'text') {
      newElement = {
        id: newId,
        type: 'text',
        content: option.content,
        x: BASE_W / 2,
        y: BASE_H / 2,
        width: option.width,
        height: option.height,
        color: option.color,
        backgroundColor: option.backgroundColor,
        fontSize: 14,
        originalWidth: option.width,
        originalHeight: option.height,
      };
    } else if (option.type === 'tag') {
      const tagSize = calculateTagSize(option.content, 14);
      newElement = {
        id: newId,
        type: 'tag',
        content: option.content,
        x: BASE_W / 2,
        y: BASE_H / 2,
        width: tagSize.width,
        height: tagSize.height,
        color: option.color,
        backgroundColor: option.backgroundColor,
        fontSize: 14,
        originalWidth: tagSize.width,
        originalHeight: tagSize.height,
      };
    } else if (option.type === 'sticker') {
      newElement = {
        id: newId,
        type: 'sticker',
        src: option.src,
        x: BASE_W / 2,
        y: BASE_H / 2,
        width: 60,
        height: 60,
        originalWidth: 60,
        originalHeight: 60,
      };
    }

    if (newElement) {
      setElements((prev) => [...prev, newElement]);
      setSelectedElementId(newId);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setImage(template.background);
    setElements(
      template.elements.map((el) => ({
        ...el,
        fontSize: el.fontSize || 14,
        originalWidth: el.width,
        originalHeight: el.height,
      })),
    );
    setSelectedElementId(null);
  };

  const handleDeleteElement = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedElementId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  const handleCopyElement = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedElementId) return;
    setElements((prev) => {
      const el = prev.find((e) => e.id === selectedElementId);
      if (!el) return prev;

      const newId = el.id + '_' + Date.now();
      const newEl = {
        ...el,
        id: newId,
        x: el.x + 20,
        y: el.y + 20,
        originalWidth: el.width,
        originalHeight: el.height,
        fontSize: el.fontSize || 14,
      };

      setTimeout(() => setSelectedElementId(newId), 0);
      return [...prev, newEl];
    });
  };

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editingElementId && editingElementId !== id) {
      handleTextSubmit();
    }
    setSelectedElementId(id);
  };

  const handleElementDoubleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === id);
    if (element && (element.type === 'text' || element.type === 'tag')) {
      setEditingElementId(id);
      setEditingText(element.content);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value);
  };

  const handleTextSubmit = () => {
    if (editingElementId) {
      const newText = editingText.trim();
      if (newText) {
        setElements((prev) =>
          prev.map((el) =>
            el.id === editingElementId ? { ...el, content: newText } : el,
          ),
        );
      } else {
        window.alert('빈 텍스트는 허용되지 않습니다.');
      }
    }
    setEditingElementId(null);
    setEditingText('');
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setEditingElementId(null);
      setEditingText('');
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImage(dataUrl);
        setSelectedTemplate(null);
        setElements([]);
        setSelectedElementId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = () => {
    setSelectedElementId(null);
    if (editingElementId) {
      handleTextSubmit();
    }
  };

  const updateElementPosition = (id: string, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              x: (x + (el.width * scale.x) / 2) / scale.x,
              y: (y + (el.height * scale.y) / 2) / scale.y,
            }
          : el,
      ),
    );
  };

  const updateElementSizeAndPosition = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          const newElement = {
            ...el,
            x: (x + width / 2) / scale.x,
            y: (y + height / 2) / scale.y,
            width: width / scale.x,
            height: height / scale.y,
          };

          if (el.type === 'text' || el.type === 'tag') {
            const originalFontSize = 14;
            const originalWidth = el.originalWidth || el.width;
            const originalHeight = el.originalHeight || el.height;
            const widthRatio = width / scale.x / originalWidth;
            const heightRatio = height / scale.y / originalHeight;
            const scaleRatio = Math.min(widthRatio, heightRatio);
            newElement.fontSize = Math.max(originalFontSize * scaleRatio, 8);
          }

          return newElement;
        }
        return el;
      }),
    );
  };

  // 선택된 요소의 위치와 정보 계산
  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const selectedToolbarPos = selectedElement
    ? {
        top:
          selectedElement.y * scale.y -
          (selectedElement.height * scale.y) / 2 -
          10,
        left: selectedElement.x * scale.x,
        width: selectedElement.width,
      }
    : null;

  const resizeHandleStyles = {
    topLeft: {
      width: '12px',
      height: '12px',
      backgroundColor: '#fff',
      border: '2px solid #FA4D09',
      borderRadius: '50%',
      position: 'absolute' as const,
      top: '-6px',
      left: '-6px',
    },
    left: {
      width: '9px',
      height: '12px',
      backgroundColor: '#fff',
      border: '2px solid #FA4D09',
      borderRadius: '50%',
      position: 'absolute' as const,
      top: 'calc(50% - 6px)',
      left: '-5px',
    },
    bottomLeft: {
      width: '12px',
      height: '12px',
      backgroundColor: '#fff',
      border: '2px solid #FA4D09',
      borderRadius: '50%',
      position: 'absolute' as const,
      bottom: '-6px',
      left: '-6px',
    },
    topRight: {
      width: '12px',
      height: '12px',
      backgroundColor: '#fff',
      border: '2px solid #FA4D09',
      borderRadius: '50%',
      position: 'absolute' as const,
      top: '-6px',
      right: '-6px',
    },
    right: {
      width: '9px',
      height: '12px',
      backgroundColor: '#fff',
      border: '2px solid #FA4D09',
      borderRadius: '50%',
      position: 'absolute' as const,
      top: 'calc(50% - 6px)',
      right: '-5px',
    },
    bottomRight: {
      width: '12px',
      height: '12px',
      backgroundColor: '#fff',
      border: '2px solid #FA4D09',
      borderRadius: '50%',
      position: 'absolute' as const,
      bottom: '-6px',
      right: '-6px',
    },
  };

  const handleSaveStory = async () => {
    if (!canvasRef.current) {
      alert('canvasRef.current가 null입니다.');
      return;
    }

    // 모든 선택 및 편집 상태 초기화
    setSelectedElementId(null);
    if (editingElementId) {
      handleTextSubmit();
    }
    setEditingElementId(null);

    // DOM 업데이트 대기
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      // 배경 이미지 추출
      const bgImage = selectedTemplate ? selectedTemplate.background : image;

      // 스토리 JSON 데이터 준비
      const storyData = {
        selectedTemplate,
        image,
        elements,
        timestamp: Date.now(),
      };

      // 캔버스를 이미지로 변환 (전체 미리보기용)
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        scale: 1,
        useCORS: true,
        allowTaint: true,
      });

      // Canvas를 base64 데이터 URL로 변환 (JPEG 포맷으로 압축)
      const previewImage = canvas.toDataURL('image/jpeg', 0.8);

      localStorage.setItem('storyData', JSON.stringify(storyData));
      localStorage.setItem('storyPreviewImage', previewImage); // 전체 캔버스 이미지
      localStorage.setItem('storyBgImage', bgImage || ''); // 배경 이미지만
      router.back();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  return (
    <>
      <EditorHeader
        onImageUpload={handleImageUpload}
        onSave={handleSaveStory}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="pt-[82px]">
        <div className="relative mx-auto flex w-full xl:w-[1200px]">
          {/* 왼쪽 사이드바 */}
          <Tabs
            defaultValue="template"
            className="fixed top-[65px] z-10 h-[calc(100vh-65px)] w-[384px] overflow-y-auto border-r bg-white px-4 py-6"
          >
            <TabsList className="flex border-none">
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="w-1/3 rounded-none border-b border-b-[#C7C7CC] text-gray-400 data-[state=active]:border-[#FA4D09] data-[state=active]:shadow-none"
                >
                  {t.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="template">
              <div className="grid grid-cols-2 gap-4 pt-4">
                {TEMPLATES.map((tpl) => (
                  <Image
                    key={tpl.id}
                    src={tpl.thumbnail ?? tpl.background}
                    alt={tpl.name}
                    width={160}
                    height={220}
                    className="cursor-pointer rounded-lg object-cover shadow-md"
                    onClick={() => handleTemplateSelect(tpl)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-0">
              <div className="pt-5">
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

                <div>
                  <h3 className="mb-4 text-[16px] font-semibold leading-[130%]">
                    태그
                  </h3>
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sticker" className="mt-0">
              <div className="pt-5">
                <div className="mb-6">
                  <h3 className="mb-5 text-[16px] font-semibold leading-[130%]">
                    로고
                  </h3>
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
            </TabsContent>
          </Tabs>

          {/* canvas */}
          <main className="ml-[384px] flex h-[calc(100vh-65px)] flex-1 items-center justify-center bg-[#F5F5F5] py-10 pl-5">
            <div
              ref={canvasRef}
              className="relative overflow-visible rounded bg-white shadow-inner"
              style={{ width: canvasW, height: canvasH, aspectRatio: '9 / 16' }}
              onClick={handleCanvasClick}
            >
              {selectedToolbarPos && !editingElementId && (
                <div
                  className="absolute z-30 flex items-center gap-[12px] px-[12px] py-[8px]"
                  style={{
                    top: selectedToolbarPos.top,
                    left: selectedToolbarPos.left,
                    transform: 'translate(-50%, -100%)',
                    borderRadius: 24,
                    border: '1px solid #FCFCFD',
                    background: '#FFF',
                    boxShadow:
                      '0px 0px 16px 0px rgba(0,0,0,0.10), 0px 0px 4px 0px rgba(0,0,0,0.25)',
                    minWidth: '80px',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src="/assets/icons/copy.svg"
                    alt="복사"
                    width="24"
                    height="24"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => handleCopyElement(e)}
                  />
                  <Image
                    src="/assets/icons/delete.svg"
                    alt="삭제"
                    width="24"
                    height="24"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => handleDeleteElement(e)}
                  />
                </div>
              )}

              {/* 배경 이미지 */}
              {selectedTemplate ? (
                <Image
                  src={selectedTemplate.background}
                  alt="template-bg"
                  width={canvasW}
                  height={canvasH}
                  className="h-full w-full select-none rounded object-cover"
                  draggable={false}
                />
              ) : image ? (
                <Image
                  src={image}
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
              {elements.map((el) => {
                const width = el.width * scale.x;
                const height = el.height * scale.y;
                const x = el.x * scale.x - width / 2;
                const y = el.y * scale.y - height / 2;
                const isSelected = el.id === selectedElementId;

                if (el.type === 'sticker') {
                  return (
                    <Rnd
                      key={el.id}
                      position={{ x, y }}
                      size={{ width, height }}
                      enableResizing={isSelected}
                      disableDragging={!isSelected}
                      onDragStop={(e, data) => {
                        updateElementPosition(el.id, data.x, data.y);
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        updateElementSizeAndPosition(
                          el.id,
                          position.x,
                          position.y,
                          parseInt(ref.style.width),
                          parseInt(ref.style.height),
                        );
                      }}
                      onResize={(e, direction, ref, delta, position) => {
                        updateElementSizeAndPosition(
                          el.id,
                          position.x,
                          position.y,
                          parseInt(ref.style.width),
                          parseInt(ref.style.height),
                        );
                      }}
                      bounds="parent"
                      resizeHandleStyles={resizeHandleStyles}
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
                        onClick={(e) => handleElementClick(e, el.id)}
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
                  const isEditing = editingElementId === el.id;

                  return (
                    <Rnd
                      key={el.id}
                      position={{ x, y }}
                      size={{ width, height }}
                      enableResizing={isSelected && !isEditing}
                      disableDragging={!isSelected || isEditing}
                      onDragStop={(e, data) => {
                        updateElementPosition(el.id, data.x, data.y);
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        updateElementSizeAndPosition(
                          el.id,
                          position.x,
                          position.y,
                          parseInt(ref.style.width),
                          parseInt(ref.style.height),
                        );
                      }}
                      onResize={(e, direction, ref, delta, position) => {
                        updateElementSizeAndPosition(
                          el.id,
                          position.x,
                          position.y,
                          parseInt(ref.style.width),
                          parseInt(ref.style.height),
                        );
                      }}
                      bounds="parent"
                      resizeHandleStyles={resizeHandleStyles}
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
                        onClick={(e) => handleElementClick(e, el.id)}
                        onDoubleClick={(e) =>
                          handleElementDoubleClick(e, el.id)
                        }
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingText}
                            onChange={handleTextChange}
                            onKeyDown={handleTextKeyDown}
                            onBlur={handleTextSubmit}
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
                  const isEditing = editingElementId === el.id;
                  const tagWidth = width;
                  const tagHeight = height;

                  return (
                    <Rnd
                      default={{
                        x: 0,
                        y: 0,
                        width: el.width,
                        height: el.height,
                      }}
                      key={el.id}
                      position={{ x, y }}
                      size={{ width: tagWidth, height: tagHeight }}
                      enableResizing={isSelected && !isEditing}
                      disableDragging={!isSelected || isEditing}
                      onDragStop={(e, data) => {
                        updateElementPosition(el.id, data.x, data.y);
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        updateElementSizeAndPosition(
                          el.id,
                          position.x,
                          position.y,
                          parseInt(ref.style.width),
                          parseInt(ref.style.height),
                        );
                      }}
                      onResize={(e, direction, ref, delta, position) => {
                        updateElementSizeAndPosition(
                          el.id,
                          position.x,
                          position.y,
                          parseInt(ref.style.width),
                          parseInt(ref.style.height),
                        );
                      }}
                      bounds="parent"
                      resizeHandleStyles={resizeHandleStyles}
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
                        onClick={(e) => handleElementClick(e, el.id)}
                        onDoubleClick={(e) =>
                          handleElementDoubleClick(e, el.id)
                        }
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingText}
                            onChange={handleTextChange}
                            onKeyDown={handleTextKeyDown}
                            onBlur={handleTextSubmit}
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
              })}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default StoryEditorPage;
