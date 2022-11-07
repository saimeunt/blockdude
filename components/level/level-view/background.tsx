import { indexToPosition } from '../../../lib/utils';
import useContext from '../context/hook';
import { SpritePath } from '../../lib/sprite';

const LevelBackground = () => {
  const {
    state: { level, zoom },
  } = useContext();
  return (
    <svg
      width={level.width * 8 * zoom}
      height={level.height * 8 * zoom}
      viewBox={`0 -0.5 ${level.width * 8} ${level.height * 8}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <SpritePath id="background-brick" type="brick" />
      </defs>
      <rect width={level.width * 8 * zoom} height={level.height * 8 * zoom} fill="#fff" />
      {level.bricks.map((brick, index) => {
        if (!brick) {
          return null;
        }
        const { x, y } = indexToPosition(index, level.width);
        return <use key={`${x} ${y}`} href="#background-brick" x={x * 8} y={y * 8} />;
      })}
    </svg>
  );
};

export default LevelBackground;
