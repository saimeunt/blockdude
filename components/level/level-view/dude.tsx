import { Direction } from '../../../lib/types';
import useContext from '../context/hook';
import Sprite from '../../lib/sprite';
import { isFinished } from '../context/level-state';

const Dude = () => {
  const {
    state: { level, zoom },
  } = useContext();
  return (
    <Sprite
      position={level.dude.position}
      type="dude"
      mirrorVertically={level.dude.direction === Direction.LEFT}
      opacity={isFinished(level) ? 0 : 1}
      zoom={zoom}
    />
  );
};

export default Dude;
