import useContext from '../context/hook';
import Sprite from '../../lib/sprite';

const Door = () => {
  const {
    state: {
      level: { door },
      zoom,
    },
  } = useContext();
  return <Sprite position={door} type="door" zoom={zoom} />;
};

export default Door;
