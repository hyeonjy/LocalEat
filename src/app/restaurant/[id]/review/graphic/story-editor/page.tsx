'use client';

import { useResponsiveCanvas } from '@/hooks/useResponsiveCanvas';
import { useStoryEditor } from '@/hooks/useStoryEditor';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import EditorHeader from './_components/EditorHeader';
import EditorSidebar from './_components/EditorSidebar';
import MobileEditorSidebar from './_components/MobileEditorSidebar';
import StoryCanvas from './_components/StoryCanvas';

const StoryEditorPage = () => {
  const router = useRouter();
  const { canvasW, canvasH, scale } = useResponsiveCanvas();
  const storyEditor = useStoryEditor();

  // 선택된 요소의 위치와 정보 계산
  const selectedElement = storyEditor.elements.find(
    (el) => el.id === storyEditor.selectedElementId,
  );
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

  const handleSaveStory = async () => {
    if (!storyEditor.canvasRef.current) {
      return;
    }

    // 모든 선택 및 편집 상태 초기화
    if (storyEditor.editingElementId) {
      storyEditor.handleTextSubmit();
    }
    // DOM 업데이트 대기
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const bgImage = storyEditor.selectedTemplate
        ? storyEditor.selectedTemplate.background
        : storyEditor.image;

      // 스토리 JSON 데이터 준비
      const storyData = {
        selectedTemplate: storyEditor.selectedTemplate,
        image: storyEditor.image,
        elements: storyEditor.elements,
        timestamp: Date.now(),
      };

      // 캔버스를 이미지로 변환 (전체 미리보기용)
      const canvas = await html2canvas(storyEditor.canvasRef.current, {
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
        onImageUpload={storyEditor.handleImageUpload}
        onSave={handleSaveStory}
      />
      <input
        ref={storyEditor.fileInputRef}
        type="file"
        accept="image/*"
        onChange={storyEditor.handleFileChange}
        className="hidden"
      />
      <div className="pt-[60px] md:pt-[82px]">
        <div className="relative w-full bg-[#F5F5F5]">
          {/* 데스크톱 레이아웃 */}
          <div className="relative hidden lg:mx-auto lg:flex lg:max-w-[1200px]">
            <div className="w-[384px] flex-shrink-0">
              <EditorSidebar
                onTemplateSelect={storyEditor.handleTemplateSelect}
                addNewElement={storyEditor.addNewElement}
              />
            </div>
            <div className="relative flex-1 overflow-hidden">
              <StoryCanvas
                storyEditor={storyEditor}
                canvasProps={{ canvasW, canvasH, scale }}
                selectedToolbarPos={selectedToolbarPos}
              />
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="block lg:hidden">
            <div className="relative mx-auto mb-[0px] flex h-[550px] w-full justify-center [@media(min-width:550px)]:h-[90vh]">
              <StoryCanvas
                storyEditor={storyEditor}
                canvasProps={{ canvasW, canvasH, scale }}
                selectedToolbarPos={selectedToolbarPos}
              />
            </div>
            <MobileEditorSidebar
              onTemplateSelect={storyEditor.handleTemplateSelect}
              addNewElement={storyEditor.addNewElement}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryEditorPage;
