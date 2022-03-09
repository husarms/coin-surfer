import React from "react";
import styles from "./BoundedWaveLoader.module.scss";

function Wave(): JSX.Element {
    return (
        <div>
            <svg className={styles.waves} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g className={styles.parallax}>
                    <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(0,97,255,0.4)" />
                    <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(0,97,255,0.6)" />
                    <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(96,239,255,0.4)" />
                    <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(96,239,255,0.6)" />
                </g>
            </svg>
        </div>
    );
}

export default Wave;