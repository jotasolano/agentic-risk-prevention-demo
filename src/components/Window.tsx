import React, { useState, useCallback } from 'react';
import '../styles/window.css';

interface WindowProps {
  title?: string;
  titleColor?: string;
  titleBarBg?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  focused?: boolean;
  onFocus?: () => void;
  onClose?: () => void;
}

export function Window({
  title,
  titleColor,
  titleBarBg,
  children,
  style,
  className = '',
  focused = false,
  onFocus,
  onClose,
}: WindowProps) {
  const [shaking, setShaking] = useState(false);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      // Gentle shake for no-op close
      setShaking(true);
      setTimeout(() => setShaking(false), 350);
    }
  }, [onClose]);

  return (
    <div
      className={`window ${focused ? 'window--focused' : 'window--unfocused'} ${shaking ? 'window--shaking' : ''} ${className}`}
      style={style}
      onMouseDown={onFocus}
    >
      <div className="window__titlebar" style={titleBarBg ? { background: titleBarBg } : undefined}>
        <div className="window__traffic-lights">
          <button
            className="traffic-light traffic-light--close"
            aria-label="Close window"
            onClick={handleClose}
          />
          <button
            className="traffic-light traffic-light--minimize"
            aria-label="Minimize window"
            onClick={() => {}}
          />
          <button
            className="traffic-light traffic-light--maximize"
            aria-label="Maximize window"
            onClick={() => {}}
          />
        </div>
        {title && (
          <div className="window__title" style={titleColor ? { color: titleColor } : undefined}>
            {title}
          </div>
        )}
      </div>
      <div className="window__body">
        {children}
      </div>
    </div>
  );
}
