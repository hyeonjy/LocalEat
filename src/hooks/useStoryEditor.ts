import { BASE_H, BASE_W } from '@/constants/storyEditor';
import type { Template } from '@/types/template';
import { useEffect, useRef, useState } from 'react';

/** ===== Types ===== */
type BaseElement = {
  id: string;
  type: 'text' | 'tag' | 'sticker';
  x: number; // 원본 좌표계 기준 "중심" X
  y: number; // 원본 좌표계 기준 "중심" Y
  width: number; // 원본 좌표계의 너비
  height: number; // 원본 좌표계의 높이
  originalWidth: number;
  originalHeight: number;
  rotation?: number;
  flipX?: boolean;
};

type TextElement = BaseElement & {
  type: 'text';
  content: string;
  color: string;
  backgroundColor?: string;
  fontSize: number;
};

type TagElement = BaseElement & {
  type: 'tag';
  content: string;
  color: string;
  backgroundColor?: string;
  fontSize: number;
};

type StickerElement = BaseElement & {
  type: 'sticker';
  src: string;
};

export type StoryElement = TextElement | TagElement | StickerElement;

/** ===== Hook ===== */
export const useStoryEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [image, setImage] = useState<string | null>(null);
  const [elements, setElements] = useState<StoryElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // localStorage에서 스토리 데이터 복원
  useEffect(() => {
    const savedStoryData = localStorage.getItem('storyData');
    if (!savedStoryData) return;

    try {
      const storyData = JSON.parse(savedStoryData);
      if (Array.isArray(storyData.elements) && storyData.elements.length > 0) {
        setElements(storyData.elements);
      }
      if (storyData.selectedTemplate)
        setSelectedTemplate(storyData.selectedTemplate);
      if (storyData.image) setImage(storyData.image);
    } catch (error) {
      console.error('스토리 데이터 복원 실패:', error);
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
    let newElement: StoryElement | undefined;

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
      } as TextElement;
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
      } as TagElement;
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
      } as StickerElement;
    }

    if (newElement) {
      setElements((prev) => [...prev, newElement!]);
      setSelectedElementId(newId);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setImage(template.background);

    // 템플릿 요소는 "원본 좌표계(495x743)" 기준의 중심좌표(x,y)라고 가정
    const mapped = template.elements.map((el: any) => ({
      ...el,
      fontSize: el.fontSize || 14,
      originalWidth: el.width,
      originalHeight: el.height,
      x: el.x ?? BASE_W / 2,
      y: el.y ?? BASE_H / 2,
    })) as StoryElement[];

    setElements(mapped);
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
      const el = prev.find((it) => it.id === selectedElementId);
      if (!el) return prev;

      const newId = `${el.id}_${Date.now()}`;
      const newEl: StoryElement = {
        ...el,
        id: newId,
        x: el.x + 20,
        y: el.y + 20,
        originalWidth: el.width,
        originalHeight: el.height,
        ...(el.type !== 'sticker'
          ? { fontSize: (el as TextElement | TagElement).fontSize || 14 }
          : {}),
      } as StoryElement;

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
      setEditingText((element as TextElement | TagElement).content);
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
            el.id === editingElementId &&
            (el.type === 'text' || el.type === 'tag')
              ? ({ ...el, content: newText } as StoryElement)
              : el,
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
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImage(dataUrl);
      setSelectedTemplate(null);
      setElements([]);
      setSelectedElementId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = () => {
    setSelectedElementId(null);
    if (editingElementId) {
      handleTextSubmit();
    }
  };

  /** === 좌표/크기 업데이트: 외부는 "스케일된 값"을 넘기고, 여기서 1회 역변환 === */
  const updateElementPosition = (
    id: string,
    scaledLeft: number,
    scaledTop: number,
    scale: { x: number; y: number },
  ) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;
        const originalX = scaledLeft / scale.x + el.width / 2;
        const originalY = scaledTop / scale.y + el.height / 2;
        return { ...el, x: originalX, y: originalY };
      }),
    );
  };

  const updateElementSizeAndPosition = (
    id: string,
    scaledLeft: number,
    scaledTop: number,
    scaledWidth: number,
    scaledHeight: number,
    scale: { x: number; y: number },
  ) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;

        const originalWidth = scaledWidth / scale.x;
        const originalHeight = scaledHeight / scale.y;
        const originalX = scaledLeft / scale.x + originalWidth / 2;
        const originalY = scaledTop / scale.y + originalHeight / 2;

        const next: StoryElement = {
          ...el,
          x: originalX,
          y: originalY,
          width: originalWidth,
          height: originalHeight,
        };

        if (el.type === 'text' || el.type === 'tag') {
          const originalFontSize = 14;
          const baseW = el.originalWidth || el.width;
          const baseH = el.originalHeight || el.height;
          const widthRatio = originalWidth / baseW;
          const heightRatio = originalHeight / baseH;
          const scaleRatio = Math.min(widthRatio, heightRatio);
          (next as TextElement | TagElement).fontSize = Math.max(
            originalFontSize * scaleRatio,
            8,
          );
        }

        return next;
      }),
    );
  };

  return {
    // 상태
    selectedTemplate,
    image,
    elements,
    selectedElementId,
    editingElementId,
    editingText,

    // refs
    fileInputRef,
    canvasRef,

    // 핸들러
    addNewElement,
    handleTemplateSelect,
    handleDeleteElement,
    handleCopyElement,
    handleElementClick,
    handleElementDoubleClick,
    handleTextChange,
    handleTextSubmit,
    handleTextKeyDown,
    handleImageUpload,
    handleFileChange,
    handleCanvasClick,
    updateElementPosition,
    updateElementSizeAndPosition,
  };
};
