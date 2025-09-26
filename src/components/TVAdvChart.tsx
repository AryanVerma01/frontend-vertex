// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget({ symbol }) {

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear any existing widgets to prevent duplicates on re-render
    if (container.current) {
      container.current.innerHTML = ""; 
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "BSE:${symbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "2",
        "hide_top_toolbar": true,
        "save_image": false,
        "support_host": "https://www.tradingview.com"
      }`;
    if (container.current) {
      container.current.appendChild(script);
    }
  }, [symbol]); // Add symbol to the dependency array

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "50%" }}>
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
