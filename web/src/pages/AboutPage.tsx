import React from "react";

function AboutPage(): JSX.Element {
    return (
        <div style={{ height: '90vh', width: '99vw' }}>
            <h1 className="display-2">Coin Surfe<span className="vim-caret">r</span></h1>
            <div style={{ fontSize: '18px', backgroundColor: '#282a38', lineHeight: '36px', maxWidth: '700px', margin: '0 auto', padding: '16px 36px', borderRadius: '6px' }}>
                <p>Coin Surfer is an open-source project for automated cryptocurrency trading.</p>
                <p>This site is a live demo version of the visualization app using the example "AI threshold" surfer included in the project.</p>
                <p>The tab(s) above correspond with the product(s) that are currently being traded.</p>
                <p>To learn more, check out the project on <a href="https://github.com/husarms/coin-surfer#readme" target="_blank">GitHub</a>.</p>
            </div>
            <div style={{ marginTop: '36px', fontSize: '14px', color: '#a0a0a0' }}>
                <p>
                    Styling based on <a href="https://hackerthemes.com/bootstrap-themes/neon-glow/" target="_blank">Neon Glow by HackerThemes</a>
                </p>
            </div>
        </div>
    )
};

export default AboutPage;