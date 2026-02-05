import type React from 'react';

import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClick?: () => void;
};

const ModalOverlay = ({ onClick }: TModalOverlayProps): React.JSX.Element => {
  return (
    <div className={styles.overlay} onClick={onClick} data-testid="modal-overlay"></div>
  );
};

export default ModalOverlay;
