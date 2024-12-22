import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import Header from './components/Header';
import DrawingToolBar from './components/DrawingToolBar';
import { DrawingCanvas } from './components/DrawingCanvas';
import { KonvaEventObject } from 'konva/lib/Node';

/**
 * 캔버스에 그려진 도형의 타입 정의
 * @typedef {Object} TShapes
 * @property {string} drawMode - 그리기 모드 (예: 'freeDraw', 'polygon').
 * @property {number[]} points - 도형을 정의하는 점들의 배열.
 * @property {string} fillColor - 도형의 채우기 색상.
 * @property {number} strokeWidth - 도형의 테두리 두께.
 * @property {number} [radiusX] - 타원의 가로 반지름.
 * @property {number} [radiusY] - 타원의 세로 반지름.
 * @property {number} [width] - 직사각형의 너비.
 * @property {number} [height] - 직사각형의 높이.
 */
export type TShapes = {
  drawMode: string;
  points: number[];
  fillColor: string;
  strokeWidth: number;
  radiusX?: number;
  radiusY?: number;
  width?: number;
  height?: number;
};

/**
 * App 컴포넌트 - 도형 그리기 애플리케이션
 * @component
 * @description
 * - 도형을 생성, 수정, 삭제, 실행 취소(Undo), 다시 실행(Redo)할 수 있는 기능을 제공합니다.
 * - 로컬 스토리지를 활용하여 도형 상태를 저장하고 불러옵니다.
 * - 자유 그리기, 직선, 직사각형, 타원, 다각형 등의 도형 모드를 지원합니다.
 */
const App = () => {
  /**
   * 상태에 저장된 그려진 도형의 목록.
   * 로컬 스토리지에서 초기화하거나 빈 배열로 설정됨.
   */
  const [shapes, setShapes] = useState<TShapes[]>(() => {
    try {
      const storedShapes = localStorage.getItem('shapes');
      return storedShapes ? JSON.parse(storedShapes) : [];
    } catch (error) {
      console.error('Failed to parse shapes from localStorage:', error);
      return [];
    }
  });
  // 사용자가 현재 그리고 있는 도형.
  const [currentShape, setCurrentShape] = useState<TShapes>({
    drawMode: 'freeDraw',
    points: [0, 0],
    fillColor: '#1a1a1a',
    strokeWidth: 5,
  });
  // 사용자가 현재 그리고 있는지 여부
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  // Redo 기능을 위한 실행 취소된 도형의 히스토리
  const historyStep = useRef<TShapes[]>([]);

  /**
   * 그리기 모드를 변경하고 현재 도형 초기화
   * @param {string} mode - 새로운 그리기 모드.
   */
  const handleChangeShapeMode = (mode: string) => {
    switch (mode) {
      case 'polygon':
        setIsDrawing(true);
        setCurrentShape({
          drawMode: mode,
          points: [-50, -50],
          fillColor: currentShape.fillColor,
          strokeWidth: currentShape.strokeWidth,
          radiusX: 0,
          radiusY: 0,
          width: 0,
          height: 0,
        });
        break;
      default:
        setIsDrawing(false);
        setCurrentShape({
          drawMode: mode,
          points: [],
          fillColor: currentShape.fillColor,
          strokeWidth: currentShape.strokeWidth,
          radiusX: 0,
          radiusY: 0,
          width: 0,
          height: 0,
        });
    }
  };

  /**
   * 현재 도형의 채우기 색상 업데이트
   * @param {React.ChangeEvent<HTMLInputElement>} e - 입력 변경 이벤트.
   */
  const handleChangeShapeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (currentShape) {
      setCurrentShape((prev) => ({
        ...prev,
        fillColor: newColor,
      }));
    }
  };

  /**
   * 현재 도형의 테두리 두께 업데이트
   * @param {number} strokeWidth - 새로운 테두리 두께.
   */
  const handleChangeStrokeWidth = (strokeWidth: number) => {
    setCurrentShape((prev) => ({ ...prev, strokeWidth }));
  };

  /**
   * 마우스 다운 이벤트를 처리하여 도형 그리기 시작
   * @param {React.MouseEvent} e - 마우스 이벤트.
   */
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    setIsDrawing(true);

    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();

    if (!pointerPosition) return;
    const { x, y } = pointerPosition;

    switch (currentShape.drawMode) {
      case 'freeDraw': // 자유그리기
        setCurrentShape((prev) => ({
          ...prev,
          points: [x, y],
        }));
        break;

      case 'straightLine': //직선
        setCurrentShape((prev) => ({
          ...prev,
          points: [x, y, x, y], // 시작점과 임시 끝점 설정
        }));
        break;

      case 'ellipse': // 타원
      case 'rectangle': // 직사각형
        setCurrentShape((prev) => ({
          ...prev,
          points: [x, y],
        }));
        break;

      case 'polygon': //다각형
        // 첫 번째 점 근처를 클릭하면 다각형 완성
        if (
          currentShape.points.length >= 4 &&
          Math.sqrt(
            Math.pow(currentShape.points[0] - x, 2) +
              Math.pow(currentShape.points[1] - y, 2)
          ) < 10
        ) {
          setShapes([...shapes, currentShape]); // 다각형 저장
          historyStep.current = [];

          setCurrentShape((prev) => ({
            ...prev,
            points: [], // 초기화
          }));
          setIsDrawing(false);
          return;
        }

        // 첫 클릭에서 첫 점 추가
        if (currentShape.points.length === 0) {
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y],
          }));
        } else {
          // 이후 점 추가
          setCurrentShape((prev) => ({
            ...prev,
            points: [...prev.points, x, y],
          }));
          break;
        }
    }
  };

  /**
   * 마우스 이동 이벤트를 처리하여 현재 도형 업데이트
   * @param {React.MouseEvent} e - 마우스 이벤트.
   */
  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || currentShape.points.length === 0) return;

    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();

    if (!pointerPosition) return;
    const { x, y } = pointerPosition;

    switch (currentShape.drawMode) {
      // 자유그리기
      case 'freeDraw':
        setCurrentShape((prev) => ({
          ...prev,
          points: [...prev.points, x, y],
        }));
        break;

      case 'straightLine': // 직선
        setCurrentShape((prev) => ({
          ...prev,
          points: [prev.points[0], prev.points[1], x, y], // 시작점과 현재 마우스 위치로 업데이트
        }));
        break;

      case 'ellipse': // 타원
        const radiusX = Math.abs(x - currentShape.points[0]);
        const radiusY = Math.abs(y - currentShape.points[1]);
        setCurrentShape((prev) => ({
          ...prev,
          radiusX,
          radiusY,
        }));
        break;

      case 'rectangle': // 직사각형
        const width = x - currentShape.points[0];
        const height = y - currentShape.points[1];
        setCurrentShape((prev) => ({
          ...prev,
          width: Math.abs(width),
          height: Math.abs(height),
          points: [prev.points[0], prev.points[1]],
        }));
        break;

      case 'polygon': //다각형
        if (isDrawing && currentShape.points.length >= 0) {
          const updatedPoints = [
            ...currentShape.points.slice(0, -2), // 기존 점 유지
            x,
            y, // 현재 마우스 위치
          ];
          setCurrentShape((prev) => ({
            ...prev,
            points: updatedPoints,
          }));
        }
        break;
    }
  };

  // 마우스 업 이벤트 처리하여 도형 완성
  const handleMouseUp = () => {
    if (
      currentShape.drawMode !== 'polygon' &&
      (currentShape.points.length > 0 ||
        currentShape.width ||
        currentShape.radiusX)
    ) {
      setShapes([...shapes, currentShape]); // 도형이 완성되면 도형 리스트에 추가
      historyStep.current = [];
      setCurrentShape((prev) => ({
        // 현재 그려지고 있는 도형 초기화
        ...prev,
        points: [],
        radiusX: 0,
        radiusY: 0,
        width: 0,
        height: 0,
      }));
      setIsDrawing(false);
    }
  };

  // 모든 도형을 제거하고 현재 도형 초기화
  const handleRemoveShapes = () => {
    setShapes([]);
    historyStep.current = [];
    setCurrentShape((prev) => ({ ...prev, points: [0, 0] }));
  };

  // (Undo) 마지막으로 그려진 도형 실행 취소
  const handleClickUndo = () => {
    if (shapes.length === 0 || historyStep.current.length > 39) return;
    // 현재 상태에서 마지막 도형을 제거하고 새로운 상태를 설정
    setShapes((prevShapes) => {
      const lastShape = prevShapes[prevShapes.length - 1];
      if (!lastShape) return prevShapes;

      const undoShapes = prevShapes.slice(0, -1);
      historyStep.current.push(lastShape);

      return undoShapes;
    });
  };

  // (Redo) 실행 취소된 도형 다시 그리기
  const handleClickRedo = () => {
    setShapes((prev) => {
      const lastShape = historyStep.current.pop();
      if (!lastShape) return prev;

      return [...prev, lastShape];
    });
  };

  // `shapes` 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
  }, [shapes]);

  useEffect(() => {
    const handleUndoKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        console.log('실행취소' + JSON.stringify(currentShape));
        handleClickUndo();
      }
    };
    const handleRedoKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'y') {
        handleClickRedo();
      }
    };

    window.addEventListener('keydown', handleUndoKeyDown);
    window.addEventListener('keydown', handleRedoKeyDown);

    return () => {
      window.removeEventListener('keydown', handleUndoKeyDown);
      window.removeEventListener('keydown', handleRedoKeyDown);
    };
  }, []);

  return (
    <>
      <div className="mx-auto h-screen flex w-[1200px] flex-col gap-6 py-7 ">
        {/* 헤더 */}
        <Header />

        {/* Toolbar */}
        <DrawingToolBar
          shapes={shapes}
          currentShape={currentShape}
          historyStep={historyStep}
          handleChangeStrokeWidth={handleChangeStrokeWidth}
          handleRemoveShapes={handleRemoveShapes}
          handleClickUndo={handleClickUndo}
          handleClickRedo={handleClickRedo}
          handleChangeShapeMode={handleChangeShapeMode}
          handleChangeShapeColor={handleChangeShapeColor}
        />

        {/* Canvas */}
        <DrawingCanvas
          shapes={shapes}
          currentShape={currentShape}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
        />
      </div>
    </>
  );
};
export default App;
