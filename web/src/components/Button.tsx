import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

const Button = (props) => {
    return <button className={classNames(styles.btn, styles.btnOutlinePrimary, styles.btnSm, 'text-mono')} onClick={props.onClick}>{props.children}</button>
}

export default Button;