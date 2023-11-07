import './App.css';
import VideoAsset from './components/VideoAsset';
import ImageAsset from './components/ImageAsset';
import { v4 } from 'uuid';
import { Button, Input, Space } from 'antd';
import { Dimensions, getImageSize } from 'react-image-size';
import { DraggableData, Position } from 'react-rnd';
import { KeyboardEvent, useCallback, useState } from 'react';
import LogsModal from './components/LogsModal';

export type srcType = {
  dimensions: Dimensions;
  position: { x: number; y: number };
  id: string;
  type: 'image' | 'video';
  url: string;
};

function App() {
  const [sources, setSources] = useState<srcType[]>([]);
  const [logsShown, setLogsShown] = useState(false);
  const [url, setUrl] = useState('');
  const [playAll, setPlayAll] = useState(false);

  const checkUrl = useCallback(
    async (
      url: string
    ): Promise<
      'image' | 'video' | 'error' | 'invalid url' | 'unknown content'
    > => {
      try {
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+([/?].*)?)?$/;
        const imagePattern = /\.(jpg|jpeg|png|gif|bmp)$/i;
        const videoPattern = /\.(mp4|webm|avi|mov|mkv)$/i;
        const isValid = urlPattern.test(url);
        if (!isValid) return 'invalid url';

        if (imagePattern.test(url)) {
          return 'image';
        }
        if (videoPattern.test(url)) {
          return 'video';
        }
        return 'unknown content';
      } catch (error) {
        console.error('Error checking URL:', error);
      }
      return 'error';
    },
    []
  );

  const setTheUrl = useCallback(async () => {
    try {
      if (url) {
        const type = await checkUrl(url);
        if (type === 'image' || type === 'video') {
          let dimensions: Dimensions;
          if (type === 'image') {
            dimensions = await getImageSize(url);
          } else {
            dimensions = { width: 200, height: 85 };
          }
          setSources((prev) => [
            ...prev,
            { position: { x: 0, y: 0 }, dimensions, url, id: v4(), type },
          ]);
          setUrl('');
        } else {
          alert(type);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [checkUrl, url]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if ('code' in event && event.code === 'Enter') {
        setTheUrl();
      }
    },
    [setTheUrl]
  );

  const onDrag = (param: DraggableData, id: string) => {
    const prevState = [...sources];
    const index = prevState.findIndex((source) => source.id === id);
    if (index < 0) alert('Something went wrong...');
    prevState[index].position = { x: param.x, y: param.y };
    setSources([...prevState]);
  };

  const onResize = (element: HTMLElement, position: Position, id: string) => {
    const prevState = [...sources];
    const index = prevState.findIndex((source) => source.id === id);
    if (index < 0) alert('Something went wrong...');
    prevState[index].position = { ...position };
    prevState[index].dimensions = {
      width: parseInt(element.style.width),
      height: parseInt(element.style.height),
    };
    setSources([...prevState]);
  };

  return (
    <>
      <header>
        <Space.Compact>
          <Input
            value={url}
            addonBefore='https://'
            placeholder='Link to your video or image'
            onKeyDown={onKeyDown}
            onChange={(event) => setUrl(event.target.value)}
          />
          <Button type='primary' onClick={setTheUrl}>
            ADD
          </Button>
        </Space.Compact>

        <Button
          style={{ marginLeft: '1rem' }}
          type='primary'
          onClick={() => setLogsShown(true)}
        >
          Show logs
        </Button>
        <Button
          style={{ marginLeft: '1rem' }}
          type='primary'
          onClick={() => setPlayAll((prev) => !prev)}
        >
          {playAll ? 'Pause' : 'Play'}
        </Button>
        <LogsModal
          isOpen={logsShown}
          sources={sources}
          onClose={() => setLogsShown(false)}
        />
      </header>
      <main>
        {sources.map((source) => {
          if (source.type === 'video') {
            return (
              <VideoAsset
                onDrag={onDrag}
                onResize={onResize}
                source={source}
                play={playAll}
                key={source.id}
              />
            );
          }
          if (source.type === 'image') {
            return (
              <ImageAsset
                onDrag={onDrag}
                onResize={onResize}
                source={source}
                key={source.id}
              />
            );
          }
        })}
      </main>
    </>
  );
}

export default App;
