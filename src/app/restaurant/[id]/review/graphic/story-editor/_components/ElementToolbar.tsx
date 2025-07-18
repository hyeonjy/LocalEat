import Image from 'next/image';

interface ElementToolbarProps {
  position: {
    top: number;
    left: number;
  };
  onCopy: (e?: React.MouseEvent) => void;
  onDelete: (e?: React.MouseEvent) => void;
}

const ElementToolbar = ({
  position,
  onCopy,
  onDelete,
}: ElementToolbarProps) => {
  return (
    <div
      className="absolute z-30 flex items-center gap-[12px] px-[12px] py-[8px]"
      style={{
        top: position.top,
        left: position.left,
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
        onClick={onCopy}
      />
      <Image
        src="/assets/icons/delete.svg"
        alt="삭제"
        width="24"
        height="24"
        style={{ cursor: 'pointer' }}
        onClick={onDelete}
      />
    </div>
  );
};

export default ElementToolbar;
