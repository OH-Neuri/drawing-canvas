import { useEffect, useRef, useState } from 'react';

import Header from './components/Header';
import DrawingToolBar from './components/DrawingToolBar';
import { DrawingCanvas } from './components/DrawingCanvas';

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
  // 현재 그려진 도형 리스트
  const [shapes, setShapes] = useState<TShapes[]>(() =>
    JSON.parse(localStorage.getItem('shapes') || '[]')
  );
  // 현재 그려지고 있는 도형
  const [currentShape, setCurrentShape] = useState<TShapes>({
    drawMode: 'freeDraw',
    points: [0, 0],
    fillColor: '#FFFFFF',
    strokeWidth: 5,
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const historyStep = useRef<TShapes[]>([]);

  const handleChangeShapeMode = (mode: string) => {
    const isPolygonMode = mode === 'polygon';

    setIsDrawing(isPolygonMode);
    setCurrentShape({
      drawMode: mode,
      points: isPolygonMode ? [-50, -50] : [],
      fillColor: currentShape.fillColor,
      strokeWidth: currentShape.strokeWidth,
      radiusX: 0,
      radiusY: 0,
      width: 0,
      height: 0,
    });
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
    setCurrentShape({ ...currentShape, strokeWidth });
  };

  const handleMouseDown = (e: any) => {
    setIsDrawing(true);

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (pointerPosition) {
      const { x, y } = pointerPosition;

      switch (currentShape.drawMode) {
        case 'freeDraw':
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y],
          }));
          break;

        case 'straightLine':
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y, x, y], // 시작점과 임시 끝점 설정
          }));
          break;

        case 'ellipse':
        case 'rectangle':
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y],
          }));
          break;

        case 'polygon':
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
          }
          break;
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || currentShape.points.length === 0) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (pointerPosition) {
      const { x, y } = pointerPosition;

      switch (currentShape.drawMode) {
        case 'freeDraw':
          setCurrentShape((prev) => ({
            ...prev,
            points: [...prev.points, x, y],
          }));
          break;

        case 'straightLine':
          setCurrentShape((prev) => ({
            ...prev,
            points: [prev.points[0], prev.points[1], x, y], // 시작점과 현재 마우스 위치로 업데이트
          }));
          break;

        case 'ellipse':
          const radiusX = Math.abs(x - currentShape.points[0]);
          const radiusY = Math.abs(y - currentShape.points[1]);
          setCurrentShape((prev) => ({
            ...prev,
            radiusX,
            radiusY,
          }));
          break;

        case 'rectangle':
          const width = x - currentShape.points[0];
          const height = y - currentShape.points[1];
          setCurrentShape((prev) => ({
            ...prev,
            width: Math.abs(width),
            height: Math.abs(height),
            points: [prev.points[0], prev.points[1]],
          }));
          break;

        case 'polygon':
          if (isDrawing && currentShape.points.length >= 2) {
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
    }
  };

  const handleMouseUp = () => {
    if (
      currentShape.drawMode !== 'polygon' &&
      (currentShape.points.length > 0 ||
        currentShape.width ||
        currentShape.radiusX)
    ) {
      setShapes([...shapes, currentShape]);
      historyStep.current = [];
      setCurrentShape((prev) => ({
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

  const handleRemoveShapes = () => {
    setShapes([]);
    historyStep.current = [];
    setCurrentShape({ ...currentShape, points: [0, 0] });
  };

  // undo
  const handleClickUndo = () => {
    if (shapes.length === 0) return;
    if (historyStep.current.length > 39) return;

    // shape 에서 pop
    const lastShape = shapes[shapes.length - 1];
    const undoShapes = shapes.slice(0, -1);
    setShapes(undoShapes);
    // historyStep 에서 push
    historyStep.current.push(lastShape);
  };

  // redo
  const handleClickRedo = () => {
    if (historyStep.current.length === 0) return;

    const lastShape = historyStep.current.pop();
    if (!lastShape) return;
    setShapes([...shapes, lastShape]);
  };

  // 도형 추가될 때 마다 로컬스트로지에 저장
  useEffect(() => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
  }, [shapes]);

  return (
    <>
      <div className="mx-auto h-screen flex w-[1200px] flex-col gap-6 py-5 ">
        {/* 헤더 */}
        <Header />

        {/* Nav */}
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
