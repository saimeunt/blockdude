import { isKthBitSet } from '../../lib/utils';
/* import { MeshProps, Vector3 } from '@react-three/fiber';

import { isKthBitSet } from '../../lib/utils';
import { dudeData } from './sprite';

const dataToBriqPositions = (data: number[]) =>
  data.reduce<Vector3[]>((result, row, index) => {
    const positions: Vector3[] = [];
    for (let i = 8; i >= 1; i--) {
      const isBitSet = isKthBitSet(row, i);
      if (isBitSet) {
        positions.push([i - 4, 8 - index - 4, 0]);
      }
    }
    return [...result, ...positions];
  }, []);

const Briq = (props: MeshProps) => (
  <mesh
    {...props}
    ref={mesh}
    scale={active ? 1.5 : 1}
    onClick={(event) => setActive(!active)}
    onPointerOver={(event) => setHover(true)}
    onPointerOut={(event) => setHover(false)}
  >
    <boxGeometry />
    <meshStandardMaterial color={'hotpink'} />
  </mesh>
);

export const Dude = (props: MeshProps) => (
  <mesh>
    {dataToBriqPositions(dudeData).map((position) => (
      <Briq key={position.toString()} position={position} />
    ))}
  </mesh>
); */
