import { useRef } from 'react';
import { useEventListener } from 'usehooks-ts';

import useContext from './context/hook';
import { Direction } from '../../lib/types';
import { canMove, canClimb, canLiftBlock, canDropBlock } from './context/level-state';
import { canControl } from './context/reducer';

const KeyboardHandler = () => {
  const { state, turn, move, climb, liftBlock, dropBlock, undo, redo } = useContext();
  const { level } = state;
  const documentRef = useRef<Document>(document);
  useEventListener(
    'keydown',
    (event) => {
      if (
        event.shiftKey ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        !['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'KeyU', 'KeyR'].includes(event.code)
      ) {
        return;
      }
      event.preventDefault();
      if (!canControl(state)) {
        return;
      }
      switch (event.code) {
        case 'ArrowRight':
        case 'ArrowLeft': {
          if (canMove(level, event.code === 'ArrowRight' ? Direction.RIGHT : Direction.LEFT)) {
            move(event.code === 'ArrowRight' ? Direction.RIGHT : Direction.LEFT);
          } else if (
            event.code === 'ArrowRight'
              ? level.dude.direction !== Direction.RIGHT
              : level.dude.direction !== Direction.LEFT
          ) {
            turn(event.code === 'ArrowRight' ? Direction.RIGHT : Direction.LEFT);
          }
          break;
        }
        case 'ArrowUp': {
          if (canClimb(level)) {
            climb();
          }
          break;
        }
        case 'ArrowDown': {
          if (canLiftBlock(level)) {
            liftBlock();
          } else if (canDropBlock(level)) {
            dropBlock();
          }
          break;
        }
        case 'KeyU': {
          undo();
          break;
        }
        case 'KeyR': {
          redo();
          break;
        }
      }
    },
    documentRef,
  );
  return null;
};

export default KeyboardHandler;
