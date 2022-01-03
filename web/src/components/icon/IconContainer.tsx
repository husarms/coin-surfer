import React from "react";
import styles from "./IconContainer.module.scss";

const IconContainer: React.FC = ({ children }) => {
    return (
        <div className={styles.iconBlock}>
            <div className={styles.iconContainer}>
                {children}
            </div>
        </div>
    );
}

export default IconContainer;