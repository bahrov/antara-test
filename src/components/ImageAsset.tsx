import { DraggableData, Position, Rnd } from 'react-rnd';
import { srcType } from '../App';

type propTypes = {
  source: srcType;
  onResize: (element: HTMLElement, position: Position, id: string) => void;
  onDrag: (param: DraggableData, id: string) => void;
};

const VideoAsset = ({ onDrag, onResize, source }: propTypes) => {
  return (
    <Rnd
      onDragStop={(_, data) => onDrag(data, source.id)}
      onResizeStop={(_, __, ref, ___, position) =>
        onResize(ref, position, source.id)
      }
      lockAspectRatio
      key={source.id}
      default={{
        x: 0,
        y: 0,
        width: source.dimensions.width,
        height: source.dimensions.height,
      }}
    >
      <div
        style={{
          background: `url(${source.url})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
        }}
      />
    </Rnd>
  );
};

export default VideoAsset;
