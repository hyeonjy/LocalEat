export const BASE_W = 495;
export const BASE_H = 743;

export const TABS = [
  { name: '템플릿', value: 'template' },
  { name: '텍스트', value: 'text' },
  { name: '스티커', value: 'sticker' },
] as const;

export const RESIZE_HANDLE_STYLES = {
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
