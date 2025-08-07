"use client";

import { useEffect } from "react";

export default function SelectionHighlight() {
  useEffect(() => {
    // Create style element for dynamic selection styles
    const style = document.createElement("style");
    style.innerHTML = `
      /* Enhanced selection highlighting with bright text */
      ::selection {
        background: rgba(91, 141, 238, 0.6) !important;
        color: #ffffff !important;
        text-shadow: 0 0 8px rgba(91, 141, 238, 1),
                     0 0 12px rgba(91, 141, 238, 0.8),
                     0 0 16px rgba(91, 141, 238, 0.6);
      }
      
      ::-moz-selection {
        background: rgba(91, 141, 238, 0.6) !important;
        color: #ffffff !important;
        text-shadow: 0 0 8px rgba(91, 141, 238, 1),
                     0 0 12px rgba(91, 141, 238, 0.8),
                     0 0 16px rgba(91, 141, 238, 0.6);
      }
      
      /* Specific overrides for different elements with bright white text */
      p::selection, span::selection, div::selection, 
      h1::selection, h2::selection, h3::selection,
      li::selection, a::selection, strong::selection,
      em::selection, code::selection, button::selection {
        background: rgba(91, 141, 238, 0.65) !important;
        color: #ffffff !important;
        font-weight: 500 !important;
        text-shadow: 0 0 6px rgba(91, 141, 238, 1),
                     0 0 10px rgba(91, 141, 238, 0.8);
      }
      
      p::-moz-selection, span::-moz-selection, div::-moz-selection,
      h1::-moz-selection, h2::-moz-selection, h3::-moz-selection,
      li::-moz-selection, a::-moz-selection, strong::-moz-selection,
      em::-moz-selection, code::-moz-selection, button::-moz-selection {
        background: rgba(91, 141, 238, 0.65) !important;
        color: #ffffff !important;
        font-weight: 500 !important;
        text-shadow: 0 0 6px rgba(91, 141, 238, 1),
                     0 0 10px rgba(91, 141, 238, 0.8);
      }
      
      /* Code blocks get purple tint with bright white text */
      pre ::selection, pre code::selection {
        background: rgba(155, 135, 245, 0.7) !important;
        color: #ffffff !important;
        font-weight: 500 !important;
        text-shadow: 0 0 4px rgba(155, 135, 245, 1);
      }
      
      pre ::-moz-selection, pre code::-moz-selection {
        background: rgba(155, 135, 245, 0.7) !important;
        color: #ffffff !important;
        font-weight: 500 !important;
        text-shadow: 0 0 4px rgba(155, 135, 245, 1);
      }
      
      /* Special handling for gradient text */
      .painterly-gradient::selection {
        background: rgba(245, 10, 170, 0.6) !important;
        -webkit-text-fill-color: #ffffff !important;
        color: #ffffff !important;
        font-weight: 600 !important;
        text-shadow: 0 0 8px rgba(245, 10, 170, 1);
      }
      
      .painterly-gradient::-moz-selection {
        background: rgba(245, 10, 170, 0.6) !important;
        -webkit-text-fill-color: #ffffff !important;
        color: #ffffff !important;
        font-weight: 600 !important;
        text-shadow: 0 0 8px rgba(245, 10, 170, 1);
      }
    `;
    
    document.head.appendChild(style);
    
    // Cleanup
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null;
}