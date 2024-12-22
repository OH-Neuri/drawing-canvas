import { useEffect, useRef, useState } from 'react';
import lineWidthImg from '../../src/assets/images/drawing/line-width.png';
import { TShapes } from '../App';

const strokeWidthOption = [
  { value: 5, img: lineWidthImg },
  { value: 10, img: lineWidthImg },
  { value: 20, img: lineWidthImg },
  { value: 30, img: lineWidthImg },
  { value: 40, img: lineWidthImg },
  { value: 50, img: lineWidthImg },
];

export type TDropdown = {
  currentShape: TShapes;
  handleChangeStrokeWidth: (strokeWidth: number) => void;
};

export const Dropdown = ({
  currentShape,
  handleChangeStrokeWidth,
}: TDropdown) => {
  const [isStrokeWidthOptionOpen, setIsStrokeWidthOptionOpen] =
    useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleDropdownClick = (strokeWidth: number) => {
    setIsStrokeWidthOptionOpen(false);
    handleChangeStrokeWidth(strokeWidth);
  };
  // 드롭다운 영역 밖 클릭 시 드롭다운 제거
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsStrokeWidthOptionOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsStrokeWidthOptionOpen((prev) => !prev)}
        className="bg-gray-200 rounded-md flex h-14 w-14 items-center justify-center"
      >
        <img src={lineWidthImg} alt="Line Width" height={30} width={30} />
      </button>
      {/* 옵션 드롭다운 */}
      {isStrokeWidthOptionOpen && (
        <div className="absolute bg-white z-10 ">
          {strokeWidthOption.map((option) => (
            <div
              className={`${option.value === currentShape.strokeWidth && 'bg-sky-500/50'} cursor-pointer flex border-[1px] w-52 h-16 border-gray-200 justify-between px-3 items-center gap-2`}
              key={option.value}
              onClick={() => handleDropdownClick(option.value)}
            >
              <div
                style={{
                  height: `${option.value}px`,
                  width: '120px',
                  backgroundColor: 'black',
                }}
              ></div>
              <span>{`${option.value}px`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
