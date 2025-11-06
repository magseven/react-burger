import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import type React from 'react';

import styles from './modal.module.css';

type TModalProps = {
  isOpen: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
};

type TModalOverlayProps = {
  onClick: () => void;
};

const ModalOverlay = ({ onClick }: TModalOverlayProps): React.JSX.Element => {
  return <div className={styles.overlay} onClick={onClick}></div>;
};

export const Modal = ({
  isOpen,
  onClick,
  title,
  children,
}: TModalProps): React.JSX.Element => {
  const modalRoot = document.getElementById('react-modals');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClick();
    };

    document.addEventListener('keydown', handleKeyDown);

    return (): void => document.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  if (!isOpen || !modalRoot) return <></>;

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClick={onClick} />
      <div className={`${styles.modal}`}>
        <div className={`${styles.header}`}>
          <p className={`text text_type_main-medium ml-4`}>{title}</p>
          <CloseIcon type="primary" onClick={onClick} />
        </div>
        {children}
      </div>
    </>,
    modalRoot
  );
};

export default Modal;
