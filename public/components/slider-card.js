import { LitElement, html, css } from "lit";

export class SliderCard extends LitElement {
  static styles = css`
    .card {
      display: flex;
      flex-direction: column;
      flex: 0 0 calc(100% / 5);
      box-sizing: border-box;
      justify-content: center;
      padding: 10px;
      cursor: pointer;
      transition: transform 0.3s ease;
      position: relative;
    }

    .card:hover .card-info {
      opacity: 1;
      transform: translateY(0);
    }

    img {
      height: 230px;
      width: 180px;
      border-radius: 8px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
      opacity: 0.9;
      transition: transform 0.3s ease;
    }

    .card:hover img {
      transform: scale(1.05);
      opacity: 1;
    }

    .card-info {
      padding: 12px 8px;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.9) 0%,
        rgba(0, 0, 0, 0.7) 50%,
        transparent 100%
      );
      border-radius: 0 0 8px 8px;
      margin-top: -45px;
      position: relative;
      z-index: 1;
      opacity: 0.9;
      transform: translateY(10px);
      transition: all 0.3s ease;
      width: 100%;
      box-sizing: border-box;
    }

    .card-info h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      color: #fff;
      width: 100%;
      max-width: 180px; /* Match the image width */
    }

    .release-date {
      font-size: 0.85rem;
      margin: 6px 0;
      display: flex;
      align-items: center;
      gap: 4px;
      color: #ccc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .release-date::before {
      content: "📅";
      font-size: 0.9rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .rating .star {
      color: #ffd700;
      font-size: 1.1rem;
    }

    .rating span {
      font-weight: 600;
      font-size: 0.9rem;
      color: #fff;
    }

    @media (max-width: 768px) {
      .card {
        flex: 0 0 calc(100% / 3);
        width: 150px;
      }

      img {
        height: 200px;
        width: 150px;
      }

      .card-info h3 {
        max-width: 150px;
      }
    }

    @media (max-width: 480px) {
      .card {
        flex: 0 0 calc(100% / 2);
        width: 130px;
      }

      img {
        height: 180px;
        width: 130px;
      }

      .card-info h3 {
        max-width: 130px;
      }
    }
  `;

  static properties = {
    title: { type: String },
    imageUrl: { type: String },
    releaseDate: { type: String },
    rating: { type: Number },
    id: { type: Number },
    type: { type: String }, // 'movie' or 'tv'
  };

  constructor() {
    super();
    this.title = "";
    this.imageUrl = "";
    this.releaseDate = "";
    this.rating = 0;
    this.id = 0;
    this.type = "movie";
  }

  handleClick() {
    window.location.href = `/detail.html?id=${this.id}&type=${this.type}`;
  }

  render() {
    return html`
      <div class="card" @click=${this.handleClick}>
        <img src="${this.imageUrl}" alt="${this.title}" />
        <div class="card-info">
          <h3>${this.title}</h3>
          <p class="release-date">${this.releaseDate}</p>
          <div class="rating">
            <span class="star">★</span>
            <span>${this.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("slider-card", SliderCard);
