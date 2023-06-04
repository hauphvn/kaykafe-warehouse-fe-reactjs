import React from 'react';
import './Button.scss';
import { Button as BaseButton } from 'antd';

interface ButtonPropsT {
  name: any;
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed' | 'ghost' | undefined;
  icon?: React.ReactNode;
  onClick?: (event?: any) => void;
  className?: string;
  isDisable?: boolean;
  iconSide?: 'left' | 'right';
}

export default function Button(props: ButtonPropsT) {
  const { name = '', type = 'primary', icon, onClick, className, isDisable, iconSide = 'right' } = props;
  return (
    <BaseButton
      type={type}
      onClick={onClick}
      className={`button-root ${className ? className : ''} ${icon ? '' : 'button-root-text-center'}`}
      disabled={isDisable}
    >
      <>
        {iconSide === 'left' ? (
          <>
            {icon} <div className="button-name">{name}</div>
          </>
        ) : (
          <>
            <div>{name}</div> {icon}
          </>
        )}
      </>
    </BaseButton>
  );
}
