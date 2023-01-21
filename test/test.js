import { fixture, assert, aTimeout } from '@open-wc/testing';

describe('<videojs-video>', () => {
  it('has a video like API', async function () {
    this.timeout(10000);

    const player = await fixture(`<videojs-video
      src="https://stream.mux.com/xLGf7y8cRquv7QXoDB02zEe6centwKfVmUOiPSY02JhCE/low.mp4"
    ></videojs-video>`);

    await player.loadComplete;

    assert.equal(player.paused, true, 'is paused on initialization');
    assert(!player.ended, 'is not ended');

    assert(!player.loop, 'loop is false by default');
    player.loop = true;
    assert(player.loop, 'loop is true');

    assert.equal(player.volume, 1, 'is all turned up');
    player.volume = 0.5;
    assert.equal(player.volume, 0.5, 'is half volume');

    player.muted = true;
    assert(player.muted, 'is muted');

    if (player.duration == null || Number.isNaN(player.duration)) {
      await promisify(player.addEventListener.bind(player))('durationchange');
    }

    assert.equal(Math.round(player.duration), 115, `is 115s long`);

    const loadComplete = player.loadComplete;

    player.src =
      'https://stream.mux.com/1EFcsL5JET00t00mBv01t00xt00T4QeNQtsXx2cKY6DLd7RM/low.mp4';
    await player.loadComplete;

    assert(
      loadComplete != player.loadComplete,
      'creates a new promise after new src'
    );

    if (player.duration == null || Number.isNaN(player.duration)) {
      await promisify(player.addEventListener.bind(player))('durationchange');
    }

    assert.equal(Math.round(player.duration), 20, `is 20s long`);

    player.src =
      'https://stream.mux.com/ERDtGClvKFcaBm01psUirD1tGcV4NeTqEtRNf1Zy87800/low.mp4';
    await player.loadComplete;

    if (player.duration == null || Number.isNaN(player.duration)) {
      await promisify(player.addEventListener.bind(player))('durationchange');
    }

    assert.equal(Math.round(player.duration), 90, `is 90s long`);

    try {
      await player.play();
    } catch (error) {
      console.warn(error);
    }
    assert(!player.paused, 'is playing after player.play()');

    await aTimeout(1000);

    assert.equal(String(Math.round(player.currentTime)), 1, 'is about 1s in');

    player.playbackRate = 2;
    await aTimeout(1000);

    assert.equal(String(Math.round(player.currentTime)), 3, 'is about 3s in');
  });
});

export function promisify(fn) {
  return (...args) =>
    new Promise((resolve) => {
      fn(...args, (...res) => {
        if (res.length > 1) resolve(res);
        else resolve(res[0]);
      });
    });
}
