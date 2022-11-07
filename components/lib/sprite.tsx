import { Position } from '../../lib/types';
import { isKthBitSet } from '../../lib/utils';

const brickData = [
  0b11111011, //
  0b11111011,
  0b00000000,
  0b11111110,
  0b11111110,
  0b00000000,
  0b11111011,
  0b11111011,
];

const blockData = [
  0b11111111, //
  0b10000001,
  0b10000001,
  0b10000001,
  0b10000001,
  0b10000001,
  0b10000001,
  0b11111111,
];

const doorData = [
  0b01111110, //
  0b01000010,
  0b01000010,
  0b01000110,
  0b01000010,
  0b01000010,
  0b01000010,
  0b01111110,
];

export const dudeData = [
  0b00111000, //
  0b01111110,
  0b01001000,
  0b01000100,
  0b00101000,
  0b01010100,
  0b00010000,
  0b01101100,
];

export const dataToPathData = (data: number[]) =>
  data
    .map((row, index) => {
      let result = '';
      let x = 0;
      let h = 0;
      for (let i = 8; i >= 1; i--) {
        const isBitSet = isKthBitSet(row, i);
        if (isBitSet) {
          if (h === 0) {
            x = 8 - i;
          }
          h += 1;
        } else {
          if (h > 0) {
            result += `M${x} ${index}h${h}`;
          }
          h = 0;
        }
      }
      if (h > 0) {
        result += `M${x} ${index}h${h}`;
      }
      return result;
    })
    .join('');

export const SpritePath = ({
  id,
  type,
  color = '#000',
}: {
  id?: string;
  type: 'brick' | 'block' | 'door' | 'dude';
  color?: string;
}) => {
  const pathData = {
    brick: dataToPathData(brickData),
    block: dataToPathData(blockData),
    door: dataToPathData(doorData),
    dude: dataToPathData(dudeData),
  };
  return <path id={id} stroke={color} d={pathData[type]} />;
};

const Sprite = ({
  position: { x, y },
  type,
  mirrorVertically = false,
  opacity = 1,
  zoom = 1,
}: {
  position: Position;
  type: 'brick' | 'block' | 'door' | 'dude';
  mirrorVertically?: boolean;
  opacity?: number;
  zoom?: number;
}) => {
  return (
    <svg
      width={8 * zoom}
      height={8 * zoom}
      viewBox="0 -0.5 8 8"
      style={{
        position: 'absolute',
        left: x * 8 * zoom,
        top: y * 8 * zoom,
        opacity,
        transition: 'left 200ms, top 200ms, opacity 200ms',
        transform: mirrorVertically ? 'scale(-1, 1)' : 'none',
        zIndex: type === 'block' ? 1 : 0,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {type === 'block' && <rect y="-0.5" width="8" height="8" fill="#fff" />}
      <SpritePath type={type} />
    </svg>
  );
};

export default Sprite;
