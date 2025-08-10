export type Template = {
  id: string;
  name: string;
  thumbnail?: string;
  background: string;
  elements: TemplateElement[];
};

export interface TemplateElement {
  id: string;
  type: 'text' | 'sticker' | 'tag';
  src?: string;
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  fontSize?: number;
  backgroundColor?: string;
  color?: string;
  flipX?: boolean;
}

export interface TemplateElementAPI {
  id: string;
  type: 'text' | 'sticker' | 'tag';
  src?: string;
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  font_size?: number;
  background_color?: string;
  color?: string;
  flip_x?: boolean;
}
