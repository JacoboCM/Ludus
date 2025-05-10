import { LitElement, html, css } from "lit";

export class SliderArrows extends LitElement {
  static styles = css`
    .arrow-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: transparent;
      color: var(--color1);
      border: none;
      font-size: 4rem;
      cursor: pointer;
      z-index: 10;
      width: 30px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .arrow-left {
      left: -40px;
    }

    .arrow-right {
      right: -40px;
    }
  `;

  static properties = {
    target: { type: String },
  };

  constructor() {
    super();
    this.target = "";
  }

  handleLeftClick() {
    const slider = document.getElementById(this.target);
    if (slider) {
      slider.scrollBy({
        left: -slider.clientWidth,
        behavior: "smooth",
      });
    }
  }

  handleRightClick() {
    const slider = document.getElementById(this.target);
    if (slider) {
      slider.scrollBy({
        left: slider.clientWidth,
        behavior: "smooth",
      });
    }
  }

  render() {
    return html`
      <button class="arrow-btn arrow-left" @click=${this.handleLeftClick}>
        ‹
      </button>
      <button class="arrow-btn arrow-right" @click=${this.handleRightClick}>
        ›
      </button>
    `;
  }
}

customElements.define("slider-arrows", SliderArrows);
