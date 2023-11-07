import { Flex, Modal } from 'antd';
import { srcType } from '../App';

type propsTypes = {
  isOpen: boolean;
  sources: srcType[];
  onClose: () => void;
};

const LogsModal = ({ isOpen, sources, onClose }: propsTypes) => {
  return (
    <Modal
      open={isOpen}
      title='Logs of canvas'
      onOk={onClose}
      cancelButtonProps={{ style: { display: 'none' } }}
      closable={false}
    >
      <Flex gap='middle' vertical>
        {!!sources.length &&
          sources.map((source) => (
            <div key={source.id}>
              <p>
                {`position: (x: ${source.position.x}, y: ${source.position.y});
                width: ${source.dimensions.width}, height: ${source.dimensions.height}`}
              </p>
            </div>
          ))}
      </Flex>
    </Modal>
  );
};

export default LogsModal;
