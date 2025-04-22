import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/npm/lit@3.1.1/+esm";

export class LudusFooter extends LitElement {
  static styles = css`
    :host {
      display: block;
      --white: #efefef;
      --red: #e6190e;
    }

    .footer {
      background-color: rgba(12, 15, 17, 0.8);
      padding: 0.5rem;
      color: var(--white);
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      margin-top: 4rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 1rem;
    }

    .social-section {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .social-icons {
      display: flex;
      gap: 0.75rem;
    }

    .social-icon {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .social-icon img {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .social-icon span {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .social-icons img:hover {
      transform: scale(1.1);
    }

    .footer-links {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .footer-links a {
      color: var(--white);
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.2s ease;
      opacity: 0.8;
      white-space: nowrap;
    }

    .footer-links a:hover {
      color: var(--red);
      opacity: 1;
    }

    .copyright {
      font-size: 0.75rem;
      opacity: 0.6;
      white-space: nowrap;
      text-align: center;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .social-section {
        justify-content: center;
      }

      .footer-links {
        justify-content: center;
        flex-wrap: wrap;
      }

      .copyright {
        order: -1;
      }
    }
  `;

  render() {
    return html`
      <footer class="footer">
        <div class="footer-content">
          <section class="social-section">
            <div class="social-icons">
              <div class="social-icon">
                <img src="/assets/other_assets/ico_ig.png" alt="Instagram" />
                <span>Instagram</span>
              </div>
              <div class="social-icon">
                <img src="/assets/other_assets/ico_x.png" alt="X" />
                <span>X</span>
              </div>
              <div class="social-icon">
                <img src="/assets/other_assets/ico_yt.png" alt="Youtube" />
                <span>YouTube</span>
              </div>
              <div class="social-icon">
                <img src="/assets/other_assets/ico_twitch.png" alt="Twitch" />
                <span>Twitch</span>
              </div>
            </div>
          </section>

          <div class="copyright">
            <p>© 2024 Ludus</p>
          </div>

          <div class="footer-links">
            <a href="#">Contacto</a>
            <a href="#">Soporte</a>
            <a href="#">Términos</a>
            <a href="#">Privacidad</a>
            <a href="#">Acerca de</a>
            <a href="#">FAQ</a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("ludus-footer", LudusFooter);
