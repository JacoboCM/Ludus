import { LitElement, html, css } from "lit";
import { fetchContent } from "../services/tmdbService";

export class MainSlider extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 600px;
      margin: -70px 0 20px 0;
      padding: 70px 0 70px 0;
      overflow: hidden;
    }

    .wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      scroll-behavior: smooth;
    }

    .item {
      flex: 0 0 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }

    .item a {
      display: block;
      width: 100%;
      height: 100%;
    }

    .item img {
      width: 100%;
      height: auto;
      max-height: 100%;
      opacity: 0.7;
    }

    .item .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 20px;
    }

    .item p {
      color: white;
      font-size: 32px;
      font-weight: bold;
      text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
      margin: 0;
    }

    .item .title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      margin-top: 10px;
      max-width: 800px;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
      opacity: 0.95;
    }

    .item .description {
      color: rgba(255, 255, 255, 0.85);
      font-size: 14px;
      line-height: 1.4;
      margin-top: 6px;
      max-width: 700px;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    }

    .dots {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 2;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      border: 2px solid rgba(255, 255, 255, 0.4);
      transition: all 0.3s ease;
    }

    .dot:hover {
      background: rgba(255, 255, 255, 0.6);
    }

    .dot.active {
      background: var(--color1);
      border: none;
    }

    .gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 150px;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.2) 40%,
        rgba(0, 0, 0, 0.5) 80%,
        var(--black) 100%
      );
      pointer-events: none;
      z-index: 1;
    }
  `;

  static properties = {
    items: { type: Array },
    currentIndex: { type: Number },
  };

  constructor() {
    super();
    this.items = [];
    this.currentIndex = 0;
    this.autoScrollInterval = null;
  }

  disconnectedCallback() {
    // Limpiar el intervalo cuando el componente es eliminado
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  updated(changedProps) {
    if (
      changedProps.has("items") &&
      this.items.length > 0 &&
      !this.autoScrollInterval
    ) {
      this.startAutoScroll();
    }
  }

  handleDotClick(index) {
    this.currentIndex = index;
    this.scrollToSlide(index);
    this.resetAutoScroll();
  }

  scrollToSlide(index) {
    const wrapper = this.shadowRoot?.querySelector(".wrapper");
    if (!wrapper) return;

    const slideWidth = wrapper.clientWidth;
    wrapper.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
      this.scrollToSlide(this.currentIndex);
    }, 5000);
  }

  resetAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
    this.startAutoScroll();
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.items.map(
          (item) => html`
            <div class="item">
              <a href="${item.link}">
                <img src="${item.image}" alt="${item.title}" />
                <div class="overlay">
                  <p class="title">${item.title}</p>
                  <p class="description">${item.description}</p>
                </div>
              </a>
            </div>
          `
        )}
      </div>
      <div class="dots">
        ${this.items.map(
          (_, index) => html`
            <span
              class="dot ${index === this.currentIndex ? "active" : ""}"
              @click=${() => this.handleDotClick(index)}
            ></span>
          `
        )}
      </div>
      <div class="gradient"></div>
    `;
  }
}

customElements.define("main-slider", MainSlider);

async function initializePage() {
  const slider = document.getElementById("slider-principal");
  let trendingMovies = [];
  let trendingShows = [];

  const path = window.location.pathname;

  if (path.includes("movies")) {
    // Obtener películas populares si estamos en la página de películas
    trendingMovies = await fetchContent("movie", "upcoming");
  } else if (path.includes("series")) {
    // Obtener series populares si estamos en la página de series
    trendingShows = await fetchContent("tv", "on_the_air");
  } else {
    trendingMovies = await fetchContent("movie", "top_rated");
  }

  const items = [...trendingMovies, ...trendingShows].map((item) => {
    const formattedItem = {
      title: item.title || item.name,
      image: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      link: `/detail.html?id=${item.id}&type=${
        path.includes("series") ? "tv" : "movie"
      }`,
      description:
        item.overview || item.description || "Descripción no disponible",
    };

    return formattedItem;
  });

  // Limitar a los primeros 10 elementos
  const limitedItems = items.slice(0, 10);

  slider.items = limitedItems;
}

document.addEventListener("DOMContentLoaded", initializePage);
