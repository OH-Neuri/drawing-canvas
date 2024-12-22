import { useEffect, useRef, useState } from 'react';

import Header from './components/Header';
import DrawingToolBar from './components/DrawingToolBar';
import { DrawingCanvas } from './components/DrawingCanvas';
import { KonvaEventObject } from 'konva/lib/Node';

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

const App = () => {
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
    fillColor: '#FFFFFF',
    strokeWidth: 5,
  });
  // 사용자가 현재 그리고 있는지 여부
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  // Redo 기능을 위한 실행 취소된 도형의 히스토리
  const historyStep = useRef<TShapes[]>([]);

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

  const handleChangeShapeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (currentShape) {
      setCurrentShape((prev) => ({
        ...prev,
        fillColor: newColor,
      }));
    }
  };

  const handleChangeStrokeWidth = (strokeWidth: number) => {
    setCurrentShape((prev) => ({ ...prev, strokeWidth }));
  };

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

    // shape 에서 pop
    const lastShape = shapes[shapes.length - 1];
    const undoShapes = shapes.slice(0, -1);
    setShapes(undoShapes);
    // historyStep 에서 push
    historyStep.current.push(lastShape);
  };

  // (Redo) 실행 취소된 도형 다시 그리기
  const handleClickRedo = () => {
    const lastShape = historyStep.current.pop();
    if (lastShape) setShapes((prev) => [...prev, lastShape]);
  };

  // `shapes` 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
  }, [shapes]);

  return (
    <>
      <div className="mx-auto h-screen flex w-[1200px] flex-col gap-6 py-5 ">
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
