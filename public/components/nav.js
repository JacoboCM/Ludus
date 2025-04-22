import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/npm/lit@3.1.1/+esm";

export class LudusNav extends LitElement {
  static styles = css`
    :host {
      display: block;
      --color1: #e6190e;
      --color2: #e6552c;
      --color3: #e60e6a;
      --white: #efefef;
      --black: #0c0f11;
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      display: flex;
      align-items: center;
      z-index: 10;
      background-color: rgba(12, 15, 17, 0.4);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-list {
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      position: relative;
    }

    .nav-logo {
      position: absolute;
      left: 20px;
    }

    .nav-items {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      margin: 0 auto;
    }

    .nav-item {
      height: 100%;
      display: flex;
      align-items: center;
      margin: 0 5px;
    }

    .nav-link {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
    }

    .nav-logo__image {
      width: 30px;
      height: 30px;
      margin-right: 5px;
    }

    .nav-text {
      margin: 0;
      padding: 0 15px;
      height: 100%;
      display: flex;
      align-items: center;
      border-radius: 4px;
      color: var(--white);
      font-size: 1.1rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .nav-logo .nav-text {
      font-size: 1.5rem;
    }

    .nav-item:not(.nav-logo):hover .nav-text {
      background-image: linear-gradient(
        45deg,
        var(--color1),
        var(--color2),
        var(--color3)
      );
      color: var(--black);
      transform: scale(0.95);
    }

    .nav-item:not(.nav-logo):active .nav-text {
      transform: scale(0.9);
    }
  `;

  render() {
    return html`
      <nav class="navbar">
        <ul class="nav-list">
          <li class="nav-item nav-logo">
            <a class="nav-link" href="/">
              <img
                class="nav-logo__image"
                src="/assets/other_assets/ico_Ludus.png"
                alt="Ludus Logo"
              />
              <h2 class="nav-text">Ludus</h2>
            </a>
          </li>
          <div class="nav-items">
            <li class="nav-item">
              <a class="nav-link" href="/movies/index.html"
                ><h2 class="nav-text">Películas</h2></a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/series/index.html"
                ><h2 class="nav-text">Series</h2></a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/games/index.html"
                ><h2 class="nav-text">Videojuegos</h2></a
              >
            </li>
            <li class="nav-item"><h2 class="nav-text">Mi Lista</h2></li>
            <li class="nav-item">
              <a class="nav-link" href="/games/buscador.html"
                ><h2 class="nav-text">Buscador</h2></a
              >
            </li>
            <li class="nav-item"><h2 class="nav-text">Perfil</h2></li>
          </div>
        </ul>
      </nav>
    `;
  }
}

customElements.define("ludus-nav", LudusNav);
