'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEMPLATES } from '@/constants/template'; // 중심좌표 버전
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setSelectedTemplate(null);
    }
  };

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
            >
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
                  {selectedTemplate.elements.map((el) => {
                    const top = el.y * scale.y;
                    const left = el.x * scale.x;
                    const transformBase = `
                      translate(-50%, -50%)
                      scale(${scale.x}, ${scale.y})
                      ${el.rotation ? `rotate(${el.rotation}deg)` : ''}
                      ${el.flipX ? 'scaleX(-1)' : ''}
                    `;

                    if (el.type === 'sticker') {
                      return (
                        <img
                          key={el.id}
                          src={el.src}
                          alt="sticker"
                          className="absolute select-none"
                          style={{
                            top,
                            left,
                            width: el.width,
                            height: el.height,
                            transform: transformBase,
                          }}
                          draggable={false}
                        />
                      );
                    }

                    if (el.type === 'text') {
                      return (
                        <div
                          key={el.id}
                          className="absolute flex items-center justify-center overflow-hidden whitespace-nowrap px-[10px] py-[6px] text-center"
                          style={{
                            top,
                            left,
                            height: el.height,
                            transform: transformBase,
                            color: el.color,
                            backgroundColor: el.backgroundColor,
                          }}
                        >
                          {el.content}
                        </div>
                      );
                    }

                    if (el.type === 'tag') {
                      return (
                        <div
                          key={el.id}
                          className="absolute flex items-center justify-center overflow-hidden whitespace-nowrap rounded-[999px] border border-[#FA4D09] px-[10px] py-[4px] text-center"
                          style={{
                            top,
                            left,
                            height: el.height,
                            transform: transformBase,
                            color: el.color,
                            backgroundColor: el.backgroundColor,
                          }}
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
