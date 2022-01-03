import React from "react";
import styles from "./LayoutSingleColumn.module.scss";

const LayoutSingleColumn: React.FC = ({children }) => {
    return (
        <div className={styles.grid}>
            <div className={styles.gridItem}>{children}</div>     
        </div>
    );
}

export default LayoutSingleColumn;