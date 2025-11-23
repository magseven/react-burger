import { useDrop } from 'react-dnd';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

type DropTargetProps = {
  type: string;
  children: React.ReactNode;
  className?: string;
  onDropHandler: (ingredient: TIngredient) => void;
  onHoverHandler?: (flag: boolean) => void;
};

const DropTarget = ({
  type,
  className,
  children,
  onDropHandler,
  onHoverHandler,
}: DropTargetProps): React.JSX.Element => {
  const [, dropTarget] = useDrop({
    accept: type,
    drop(ingredient: TIngredient) {
      onDropHandler(ingredient);
    },
  });

  return (
    <div
      className={className}
      ref={dropTarget as unknown as React.Ref<HTMLDivElement>}
      onDragOver={() => onHoverHandler?.(true)}
      onDragLeave={() => onHoverHandler?.(false)}
    >
      {children}
    </div>
  );
};

export default DropTarget;
