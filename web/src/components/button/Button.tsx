import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

interface ButtonProps {
    size?: 'small' | 'large';
    shadow?: boolean;
    icon?: boolean;
    className?: string;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ size, shadow, icon, className, onClick, children }) => {
    return (
        <button className={classNames(
            styles.btn,
            styles.btnOutlinePrimary,
            'text-mono',
            className,
            {
                [styles.btnSm]: size === 'small',
                [styles.btnLg]: size === 'large',
                [styles.btnShadow]: shadow,
            })}
            onClick={onClick}
        >
            {
                icon 
                ? (<div style={{display: 'flex', alignItems: 'center'}}>{children}</div>) 
                : children
            }
        </button >
    );
}

export default Button;