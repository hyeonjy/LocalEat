'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEMPLATES } from '@/constants/template';
import type { Template } from '@/types/template';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import EditorHeader from '../../_components/EditorHeader';

const BASE_W = 495;
const BASE_H = 743;

const TABS = [
  { name: '템플릿', value: 'template' },
  { name: '텍스트', value: 'text' },
  { name: '스티커', value: 'sticker' },
] as const;

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
  const { canvasW, canvasH, scale } = useResponsiveCanvas();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [elements, setElements] = useState<any[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );

  // 템플릿 선택 시 요소 상태 초기화
  useEffect(() => {
    if (selectedTemplate) {
      setElements(selectedTemplate.elements.map((el) => ({ ...el })));
      setSelectedElementId(null);
    }
  }, [selectedTemplate]);

  // 이미지 업로드 시 요소 초기화
  useEffect(() => {
    if (image && !selectedTemplate) {
      setElements([]);
      setSelectedElementId(null);
    }
  }, [image, selectedTemplate]);

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
      const newEl = { ...el, id: newId, x: el.x + 20, y: el.y + 20 };
      // 복사 후 새 요소 선택
      setTimeout(() => setSelectedElementId(newId), 0);
      return [...prev, newEl];
    });
  };

  // 요소 클릭 핸들러
  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElementId(id);
  };

  // 캔버스 클릭 시 선택 해제
  const handleCanvasClick = () => {
    setSelectedElementId(null);
  };

  // 선택된 요소의 위치와 정보 계산
  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const selectedToolbarPos = selectedElement
    ? {
        top: selectedElement.y * scale.y - 30,
        left: selectedElement.x * scale.x,
        width: selectedElement.width,
      }
    : null;

  return (
    <>
      <EditorHeader />
      <div className="pt-[64px]">
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
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setImage(tpl.background);
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="text">
              <p className="pt-4 text-sm text-gray-400">
                텍스트 탭 콘텐츠 준비 중
              </p>
            </TabsContent>
            <TabsContent value="sticker">
              <p className="pt-4 text-sm text-gray-400">
                스티커 탭 콘텐츠 준비 중
              </p>
            </TabsContent>
          </Tabs>

          {/* canvas */}
          <main className="ml-[384px] flex h-[calc(100vh-65px)] flex-1 items-center justify-center bg-[#F5F5F5] py-10 pl-5">
            <div
              className="relative overflow-hidden rounded bg-white shadow-inner"
              style={{ width: canvasW, height: canvasH, aspectRatio: '9 / 16' }}
              onClick={handleCanvasClick}
            >
              {selectedToolbarPos && (
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

              {selectedTemplate ? (
                <>
                  {/* 배경 이미지 */}
                  <Image
                    src={selectedTemplate.background}
                    alt="template-bg"
                    width={canvasW}
                    height={canvasH}
                    className="h-full w-full select-none rounded object-cover"
                    draggable={false}
                  />
                  {/* 요소 */}
                  {elements.map((el) => {
                    const top = el.y * scale.y;
                    const left = el.x * scale.x;
                    const transformBase = `
                      translate(-50%, -50%)
                      scale(${scale.x}, ${scale.y})
                      ${el.rotation ? `rotate(${el.rotation}deg)` : ''}
                      ${el.flipX ? 'scaleX(-1)' : ''}
                    `;
                    const isSelected = el.id === selectedElementId;
                    if (el.type === 'sticker') {
                      return (
                        <div
                          key={el.id}
                          className="absolute cursor-pointer"
                          style={{
                            top,
                            left,
                            width: el.width,
                            height: el.height,
                            transform: transformBase,
                            zIndex: isSelected ? 10 : 1,
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
                      );
                    }
                    if (el.type === 'text') {
                      return (
                        <div
                          key={el.id}
                          className={`absolute flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-[10px] py-[6px] text-center ${isSelected ? 'ring-2 ring-[#FA4D09]' : ''}`}
                          style={{
                            top,
                            left,
                            height: el.height,
                            transform: transformBase,
                            color: el.color,
                            backgroundColor: el.backgroundColor,
                            zIndex: isSelected ? 10 : 1,
                          }}
                          onClick={(e) => handleElementClick(e, el.id)}
                        >
                          {el.content}
                        </div>
                      );
                    }
                    if (el.type === 'tag') {
                      return (
                        <div
                          key={el.id}
                          className={`absolute flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-[999px] border border-[#FA4D09] px-[10px] py-[4px] text-center ${isSelected ? 'ring-2 ring-[#FA4D09]' : ''}`}
                          style={{
                            top,
                            left,
                            height: el.height,
                            transform: transformBase,
                            color: el.color,
                            backgroundColor: el.backgroundColor,
                            zIndex: isSelected ? 10 : 1,
                          }}
                          onClick={(e) => handleElementClick(e, el.id)}
                        >
                          {el.content}
                        </div>
                      );
                    }
                  })}
                </>
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
                  이미지를 업로드하세요
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default StoryEditorPage;
