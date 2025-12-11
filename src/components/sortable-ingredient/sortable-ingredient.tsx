import { reorderIngredient } from '@/services/ctor-ingredients/reducer';
import { useAppDispatch } from '@/services/store';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { Identifier, XYCoord } from 'dnd-core';
import type { FC } from 'react';

import styles from './sortable-ingredient.module.css';

export type SortableIngredientProps = {
  id: string;
  text: string;
  index: number;
  thumbnail: string;
  price: number;
  type?: 'top' | 'bottom';
  isLocked?: boolean;
  extraClass?: string;
  handleClose?: () => void;
};

type DragItem = {
  index: number;
  id: string;
  type: string;
};

export const SortableIngredient: FC<SortableIngredientProps> = ({
  index,
  ...propsIngredient
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'ctor-ingredient',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      dispatch(reorderIngredient({ id: item.id, index: hoverIndex }));

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'ctor-ingredient',
    item: () => {
      return { id: propsIngredient.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      className={styles.burger_constructor_line}
      ref={ref}
      style={{ opacity }}
      data-handler2-id={handlerId}
    >
      <DragIcon type="primary" />
      <ConstructorElement {...propsIngredient} />
    </div>
  );
};
