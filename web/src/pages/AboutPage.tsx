import React from "react";
import { Button, Card, IconContainer, LayoutSingleColumn } from "../components";
import { FaGithub } from 'react-icons/fa';


function AboutPage(): JSX.Element {
    return (
        <LayoutSingleColumn>
            <h1 className="display-2 p-t-2xl p-b-m">Coin Surfe<span className="vim-caret">r</span></h1>
            <h1 className="display-5 p-b-2xl text-mono color-green">Let's go surfing.</h1>
            <Card>
                <div className="body-2">
                    <p className="p-t-m p-b-l">Coin Surfer is an open-source project for automated cryptocurrency trading.</p>
                    <p className="p-b-l">This site is a live demo version of the visualization app using the example "AI threshold" surfer included in the project.</p>
                    <p className="p-b-m">The tab(s) above correspond with the product(s) that are currently being traded.</p>
                </div>
            </Card>
            <Button size='large' shadow={true} className='m-t-3xl' onClick={() => window.open('https://github.com/husarms/coin-surfer#readme', '_blank')}>
                <IconContainer>
                    <FaGithub />Check it out on GitHub
                </IconContainer>
            </Button>
            <div className="p-t-3xl">
                <p className="text-mono fine-print">
                    Styling based on <a href="https://hackerthemes.com/bootstrap-themes/neon-glow/" target="_blank">Neon Glow by HackerThemes</a>
                </p>
            </div>
        </LayoutSingleColumn>
    )
};

export default AboutPage;