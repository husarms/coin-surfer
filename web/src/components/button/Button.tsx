import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

interface ButtonProps {
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
    return (
        <button className={classNames(styles.btn, styles.btnOutlinePrimary, styles.btnSm, 'text-mono')} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;