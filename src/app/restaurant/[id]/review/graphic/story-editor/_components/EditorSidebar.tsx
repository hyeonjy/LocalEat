import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS } from '@/constants/storyEditor';
import { TEMPLATES } from '@/constants/template';
import type { Template } from '@/types/template';
import Image from 'next/image';
import StickerElement from './StickerElement';
import TagElement from './TagElement';
import TextElement from './TextElement';

interface EditorSidebarProps {
  onTemplateSelect: (template: Template) => void;
  addNewElement: (option: any) => void;
}

const EditorSidebar = ({
  onTemplateSelect,
  addNewElement,
}: EditorSidebarProps) => {
  return (
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
              onClick={() => onTemplateSelect(tpl)}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="text" className="mt-0">
        <div className="pt-5">
          <TextElement addNewElement={addNewElement} />
          <TagElement addNewElement={addNewElement} />
        </div>
      </TabsContent>

      <TabsContent value="sticker" className="mt-0">
        <StickerElement addNewElement={addNewElement} />
      </TabsContent>
    </Tabs>
  );
};

export default EditorSidebar;
