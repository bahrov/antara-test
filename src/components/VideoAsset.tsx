import { Player, PlayerReference } from 'video-react';
import { srcType } from '../App';
import { useEffect, useRef } from 'react';
import { DraggableData, Position, Rnd } from 'react-rnd';

import 'video-react/dist/video-react.css';

type propTypes = {
  source: srcType;
  onResize: (element: HTMLElement, position: Position, id: string) => void;
  onDrag: (param: DraggableData, id: string) => void;
  play: boolean;
};

const VideoAsset = ({ onDrag, onResize, play, source }: propTypes) => {
  const playerRef = useRef<PlayerReference>(null);

  useEffect(() => {
    if (!playerRef?.current) return;

    if ('actions' in playerRef.current)
      try {
        if (play) {
          //@ts-expect-error this is a legacy ref
          playerRef.current.actions?.play();
        } else {
          //@ts-expect-error this is a legacy ref
          playerRef.current.actions?.pause();
        }
      } catch (error) {
        alert("Couldn't perform play/stop");
      }
  }, [play]);
  return (
    <Rnd
      key={source.id}
      onDragStop={(_, data) => onDrag(data, source.id)}
      onResizeStop={(_, __, ref, ___, position) =>
        onResize(ref, position, source.id)
      }
      lockAspectRatio
      default={{
        x: 0,
        y: 0,
        width: '100%',
        height: 'auto',
      }}
    >
      <div>
        <Player ref={playerRef} playsInline src={source.url} />
      </div>
    </Rnd>
  );
};

export default VideoAsset;
