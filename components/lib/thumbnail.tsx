import { LevelData } from '../../lib/types';
import { SpritePath } from './sprite';
import { decodeLevelData, indexToPosition } from '../../lib/utils';

const Thumbnail = ({ level }: { level: LevelData }) => {
  const { bricks, blocks, door, dude } = decodeLevelData(level);
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 -0.5 ${level.width * 8} ${level.height * 8}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <SpritePath id="thumbnail-brick" type="brick" />
        <SpritePath id="thumbnail-block" type="block" />
        <SpritePath id="thumbnail-door" type="door" />
        <SpritePath id="thumbnail-dude" type="dude" />
      </defs>
      <rect width={level.width * 8} height={level.height * 8} fill="#fff" />
      {bricks.map((brick, index) => {
        if (!brick) {
          return null;
        }
        const { x, y } = indexToPosition(index, level.width);
        return <use key={`${x} ${y}`} href="#thumbnail-brick" x={x * 8} y={y * 8} />;
      })}
      {blocks.map(({ x, y }) => (
        <use key={`${x} ${y}`} href="#thumbnail-block" x={x * 8} y={y * 8} />
      ))}
      <use key={`${door.x} ${door.y}`} href="#thumbnail-door" x={door.x * 8} y={door.y * 8} />
      <use key={`${dude.x} ${dude.y}`} href="#thumbnail-dude" x={dude.x * 8} y={dude.y * 8} />
    </svg>
  );
};

export default Thumbnail;
