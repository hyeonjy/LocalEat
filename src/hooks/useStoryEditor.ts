import { BASE_H, BASE_W } from '@/constants/storyEditor';
import type { Template } from '@/types/template';
import { useEffect, useRef, useState } from 'react';

export const useStoryEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [image, setImage] = useState<string | null>(null);
  const [elements, setElements] = useState<any[]>([]);
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
    if (savedStoryData) {
      try {
        const storyData = JSON.parse(savedStoryData);
        if (storyData.elements && storyData.elements.length > 0) {
          setElements(storyData.elements);
        }
        if (storyData.selectedTemplate) {
          setSelectedTemplate(storyData.selectedTemplate);
        }
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

  const updateElementPosition = (
    id: string,
    x: number,
    y: number,
    scale: { x: number; y: number },
  ) => {
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
    scale: { x: number; y: number },
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
