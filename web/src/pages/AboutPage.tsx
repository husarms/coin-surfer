import React from "react";
import { Card, LayoutSingleColumn } from "../components";


function AboutPage(): JSX.Element {
    return (
        <LayoutSingleColumn>
            <h1 className="display-2 p-t-2xl p-b-m">Coin Surfe<span className="vim-caret">r</span></h1>
            <h1 className="display-5 p-b-2xl text-mono color-green">Let's go surfing.</h1>
            <Card>
                <div>
                    <p className="p-t-m p-b-l">Coin Surfer is an open-source project for automated cryptocurrency trading.</p>
                    <p className="p-b-l">This site is a live demo version of the visualization app using the example "AI threshold" surfer included in the project.</p>
                    <p className="p-b-l">The tab(s) above correspond with the product(s) that are currently being traded.</p>
                    <p className="p-b-s">To learn more, check out the project on <a href="https://github.com/husarms/coin-surfer#readme" target="_blank">GitHub</a>.</p>
                </div>
            </Card>
            <div className="p-t-3xl">
                <p className="text-mono fine-print">
                    Styling based on <a href="https://hackerthemes.com/bootstrap-themes/neon-glow/" target="_blank">Neon Glow by HackerThemes</a>
                </p>
            </div>
        </LayoutSingleColumn>
    )
};

export default AboutPage;