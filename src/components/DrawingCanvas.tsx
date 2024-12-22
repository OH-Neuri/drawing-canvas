import { Stage, Layer, Rect, Ellipse, Line, Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { TShapes } from '../App';

/**
 * DrawingCanvas 컴포넌트 - 도형을 그릴 수 있는 캔버스
 * @component
 * @param {TDrawingCanvas} props - 컴포넌트에 전달되는 속성.
 * @param {function} props.handleMouseDown - 마우스 다운 이벤트 핸들러.
 * @param {function} props.handleMouseMove - 마우스 이동 이벤트 핸들러.
 * @param {function} props.handleMouseUp - 마우스 업 이벤트 핸들러.
 * @param {TShapes[]} props.shapes - 기존에 그려진 도형들의 목록.
 * @param {TShapes} props.currentShape - 현재 그리고 있는 도형의 상태.
 * @description
 * - `Stage`와 `Layer`를 사용하여 도형을 그릴 수 있는 캔버스를 제공합니다.
 * - 지원하는 도형 모드: 자유 그리기(freeDraw), 직선(straightLine), 타원(ellipse), 직사각형(rectangle), 다각형(polygon).
 */
export type TDrawingCanvas = {
  handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseUp: () => void;
  shapes: TShapes[];
  currentShape: TShapes;
};

export const DrawingCanvas = ({
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  shapes,
  currentShape,
}: TDrawingCanvas) => {
  return (
    <Stage
      width={1200}
      height={700}
      className="rounded-md border-[1px] border-gray-200 bg-[#ecedf1]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {/* 기존 Shapes 렌더링 */}
        {shapes.map((shape, index) => {
          switch (shape.drawMode) {
            case 'freeDraw': // 자유 그리기
              return (
                <Line
                  key={index}
                  points={shape.points}
                  stroke={shape.fillColor}
                  strokeWidth={shape.strokeWidth}
                />
              );
            case 'straightLine': // 직선
              return (
                <Line
                  key={index}
                  points={shape.points}
                  stroke={shape.fillColor}
                  strokeWidth={shape.strokeWidth}
                  lineCap="round"
                />
              );
            case 'ellipse': // 타원
              return (
                <Ellipse
                  key={index}
                  x={shape.points[0]}
                  y={shape.points[1]}
                  radiusX={shape.radiusX || 0}
                  radiusY={shape.radiusY || 0}
                  stroke={shape.fillColor}
                  strokeWidth={shape.strokeWidth}
                />
              );
            case 'rectangle': // 직사각형
              return (
                <Rect
                  key={index}
                  x={shape.points[0]}
                  y={shape.points[1]}
                  width={shape.width || 0}
                  height={shape.height || 0}
                  stroke={shape.fillColor}
                  strokeWidth={shape.strokeWidth}
                />
              );
            case 'polygon': // 다각형
              return (
                <Line
                  key={index}
                  points={shape.points}
                  stroke={shape.fillColor}
                  strokeWidth={shape.strokeWidth}
                  closed
                />
              );
            default:
              return null;
          }
        })}

        {/* 현재 드로잉 중인 Shape */}
        {currentShape && currentShape.drawMode === 'freeDraw' && (
          <Line
            points={currentShape.points}
            stroke={currentShape.fillColor}
            strokeWidth={currentShape.strokeWidth}
          />
        )}

        {currentShape && currentShape.drawMode === 'straightLine' && (
          <Line
            points={currentShape.points}
            stroke={currentShape.fillColor} // 현재 그리는 선의 색상
            strokeWidth={currentShape.strokeWidth}
            lineCap="round"
          />
        )}
        {currentShape && currentShape.drawMode === 'ellipse' && (
          <Ellipse
            x={currentShape.points[0]}
            y={currentShape.points[1]}
            radiusX={currentShape.radiusX || 0}
            radiusY={currentShape.radiusY || 0}
            stroke={currentShape.fillColor}
            strokeWidth={currentShape.strokeWidth}
            dash={[0, 0]} // 점선 스타일
            fill="transparent"
          />
        )}

        {currentShape && currentShape.drawMode === 'rectangle' && (
          <Rect
            x={currentShape.points[0]}
            y={currentShape.points[1]}
            width={currentShape.width}
            height={currentShape.height}
            stroke={currentShape.fillColor}
            strokeWidth={currentShape.strokeWidth}
            dash={[1, 0]} // 점선 스타일
          />
        )}

        {currentShape && currentShape.drawMode === 'polygon' && (
          <>
            {/* 현재 드로잉 중인 다각형의 선 */}
            <Line
              points={currentShape.points}
              stroke="#3aa9ff"
              strokeWidth={3}
              lineCap="round"
              closed={false} // 다각형이 아직 미완성이므로 닫지 않음
            />

            {/* 다각형의 각 점 */}
            {currentShape.points
              .reduce<number[][]>(
                (acc, _, i, arr) =>
                  i % 2 === 0 ? [...acc, [arr[i], arr[i + 1]]] : acc,
                []
              )
              .map(([x, y], index) => (
                <Circle
                  key={index}
                  x={x}
                  y={y}
                  radius={5}
                  fill="white"
                  stroke="#3aa9ff"
                  strokeWidth={2}
                />
              ))}
          </>
        )}
      </Layer>
    </Stage>
  );
};
