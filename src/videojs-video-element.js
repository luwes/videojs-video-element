// https://docs.videojs.com/
import { SuperVideoElement } from 'super-media-element';
import { loadScript, PublicPromise, createElement } from './utils.js';

const templateShadowDOM = document.createElement('template');
templateShadowDOM.innerHTML = `
<style>
  :host {
    position: relative;
    width: 100%;
  }
  div.video-js {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
</style>
`;

class VideojsVideoElement extends SuperVideoElement {
  static observedAttributes = [
    ...SuperVideoElement.observedAttributes,
    'stylesheet',
  ];

  constructor() {
    super();

    this.shadowRoot.append(templateShadowDOM.content.cloneNode(true));

    this.loadComplete = new PublicPromise();
  }

  async load() {
    if (this.hasLoaded) this.loadComplete = new PublicPromise();
    this.hasLoaded = true;

    // Wait 1 tick to allow other attributes to be set.
    await Promise.resolve();

    const options = {
      autoplay: this.autoplay,
      preload: this.preload ?? 'metadata',
      playsinline: this.playsInline,
      controls: this.controls,
      muted: this.defaultMuted,
    };

    if (!this.nativeEl) {
      const video = createElement('video', {
        class: `video-js ${this.className}`,
      });
      video.append(
        createElement('source', { src: this.src }),
        ...this.querySelectorAll('source'),
      );
      this.shadowRoot.append(video);

      // You can load the videojs script ahead of time if you like,
      // if it's not there we'll laaaaaaaaaaaazy load it.
      let videojs = globalThis.videojs;
      if (!videojs) {
        const scriptUrl = `https://unpkg.com/video.js@${this.version}/dist/video.min.js`;
        videojs = await loadScript(scriptUrl, 'videojs');
      }
      this.api = videojs(video, options);
    } else {
      this.api.src(this.src);
    }

    this.api.ready(() => {
      this.dispatchEvent(new Event('loadcomplete'));
      this.loadComplete.resolve();
    });

    await this.loadComplete;
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.querySelector('source')) {
      this.load();
    }

    const link = createElement('link', {
      href: `https://unpkg.com/video.js@${this.version}/dist/video-js.min.css`,
      rel: 'stylesheet',
      crossorigin: '',
    });
    this.shadowRoot.prepend(link);

    // There is a bug? in Chrome and Firefox where @font-face doesn't work in shadow dom.
    // Appending it in the document fixes the missing font icon issue.
    link.onload = () => {
      [...this.shadowRoot.styleSheets[0].cssRules]
        .filter(({ cssText }) => cssText.startsWith('@font-face'))
        .forEach(({ cssText }) => {
          document.head.append(createElement('style', {}, cssText));
        });
    }
  }

  async attributeChangedCallback(attrName, oldValue, newValue) {
    // This is required to come before the await for resolving loadComplete.
    switch (attrName) {
      case 'src': {
        this.load();
        return;
      }
      case 'stylesheet':
        this.shadowRoot.querySelector('#stylesheet')?.remove();
        if (newValue) {
          this.shadowRoot.append(
            createElement('link', {
              id: 'stylesheet',
              href: newValue,
              rel: 'stylesheet',
              crossorigin: '',
            })
          );
        }
        return;
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);

    // Don't await super.attributeChangedCallback above, it would resolve later.
    await this.loadComplete;

    switch (attrName) {
      case 'controls':
        this.api.controls(newValue != null);
        break;
      case 'poster':
        this.api.poster(newValue);
        break;
    }
  }

  // Override all methods for video.js so it calls its API directly.

  call(name, ...args) {
    return this.api?.[name]?.(...args);
  }

  get(prop) {
    return this.api?.[prop]?.();
  }

  set(prop, val) {
    this.api?.[prop]?.(val);
  }

  // If the getter from SuperVideoElement is overriden, it's required to define
  // the setter again too unless it's a readonly property! It's a JS thing.

  get version() {
    return this.getAttribute('version') ?? '7.19.2';
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(val) {
    if (this.src == val) return;
    this.setAttribute('src', val);
  }

  get controls() {
    return this.hasAttribute('controls');
  }

  set controls(val) {
    if (this.controls == val) return;

    if (val) {
      this.setAttribute('controls', '');
    } else {
      // Remove boolean attribute if false, 0, '', null, undefined.
      this.removeAttribute('controls');
    }
  }

  get poster() {
    return this.getAttribute('poster');
  }

  set poster(val) {
    if (this.poster == val) return;
    this.setAttribute('poster', `${val}`);
  }

  get stylesheet() {
    return this.getAttribute('stylesheet');
  }

  set stylesheet(val) {
    if (this.stylesheet == val) return;
    this.setAttribute('stylesheet', `${val}`);
  }
}

if (
  globalThis.customElements.get('videojs-video') ||
  globalThis.VideojsVideoElement
) {
  console.debug('VideojsVideoElement: <videojs-video> defined more than once.');
} else {
  globalThis.VideojsVideoElement = VideojsVideoElement;
  globalThis.customElements.define('videojs-video', VideojsVideoElement);
}

export default VideojsVideoElement;
