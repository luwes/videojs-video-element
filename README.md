# `<videojs-video>` [![Version](https://img.shields.io/npm/v/videojs-video-element)](https://www.npmjs.com/package/videojs-video-element) [![Badge size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/videojs-video-element/+esm?compression=gzip&label=gzip)](https://cdn.jsdelivr.net/npm/videojs-video-element/+esm)

A custom element (web component) for Video.js.

The element API matches the HTML5 `<video>` tag, so it can be easily swapped with other media, and be compatible with other UI components that work with the video tag.

One of the goals was to have `<videojs-video>` seamlessly integrate with [Media Chrome](https://github.com/muxinc/media-chrome).

> 🙋 Looking for a YouTube video element? Check out [`<youtube-video>`](https://github.com/muxinc/youtube-video-element).

## Example ([CodeSandbox](https://codesandbox.io/s/videojs-video-element-usb0dn))

<!-- prettier-ignore -->
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/videojs-video-element@0.2/+esm"></script>
<videojs-video controls src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"></videojs-video>
```

## Installing

`<videojs-video>` is packaged as a javascript module (es6) only, which is supported by all evergreen browsers and Node v12+.

### Loading into your HTML using `<script>`

<!-- prettier-ignore -->
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/videojs-video-element@0.2/+esm"></script>
```

### Adding to your app via `npm`

```bash
npm install videojs-video-element --save
```

Include in your app javascript (e.g. src/App.js)

```js
import 'videojs-video-element';
```

This will register the custom elements with the browser so they can be used as HTML.

## Related

- [Media Chrome](https://github.com/muxinc/media-chrome) Your media player's dancing suit. 🕺
- [`<youtube-video>`](https://github.com/muxinc/youtube-video-element) A web component for the YouTube player.
- [`<vimeo-video>`](https://github.com/luwes/vimeo-video-element) A web component for the Vimeo player.
- [`<wistia-video>`](https://github.com/luwes/wistia-video-element) A web component for the Wistia player.
- [`<jwplayer-video>`](https://github.com/luwes/jwplayer-video-element) A web component for the JW player.
- [`<hls-video>`](https://github.com/muxinc/hls-video-element) A web component for playing HTTP Live Streaming (HLS) videos.
- [`castable-video`](https://github.com/muxinc/castable-video) Cast your video element to the big screen with ease!
- [`<mux-player>`](https://github.com/muxinc/elements/tree/main/packages/mux-player) The official Mux-flavored video player web component.
- [`<mux-video>`](https://github.com/muxinc/elements/tree/main/packages/mux-video) A Mux-flavored HTML5 video element w/ hls.js and Mux data builtin.
