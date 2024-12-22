import { Stage, Layer, Rect, Ellipse, Line, Circle } from 'react-konva';
import { TShapes } from '../App';

export type TDrawingCanvas = {
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
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
      className="rounded-md border-[1px]  bg-[#516285]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {/* 기존 Shapes 렌더링 */}
        {shapes.map((shape, index) => {
          switch (shape.drawMode) {
            case 'freeDraw':
              return (
                <Line
                  key={index}
                  points={shape.points}
                  stroke={shape.fillColor}
                  strokeWidth={shape.strokeWidth}
                />
              );
            case 'straightLine':
              return (
                <Line
                  key={index}
                  points={shape.points}
                  stroke={shape.fillColor}
                  strokeWidth={shape.strokeWidth}
                  lineCap="round"
                />
              );
            case 'ellipse':
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
            case 'rectangle':
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
            case 'polygon':
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
            {/* 기존 점들로 그려진 선 */}
            <Line
              points={currentShape.points}
              stroke="#3aa9ff"
              strokeWidth={3}
              lineCap="round"
              closed={false} // 다각형이 아직 미완성이므로 닫지 않음
            />

            {/* 점 표시 */}
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
