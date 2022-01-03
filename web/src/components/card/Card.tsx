import React from "react";
import classNames from "classnames";
import styles from "./Card.module.scss";

const Card: React.FC = ({ children }) => {
    return (
        <div className={classNames(styles.card, styles.borderPrimary)}>
            <div className={styles.cardBody}>
                {children}
            </div>
        </div>
    );
}

export default Card;