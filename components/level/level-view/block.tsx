import { Position } from '../../../lib/types';
import useContext from '../context/hook';
import Sprite from '../../lib/sprite';

const Block = ({ position }: { position: Position }) => {
  const {
    state: { zoom },
  } = useContext();
  return <Sprite position={position} type="block" zoom={zoom} />;
};

export default Block;
