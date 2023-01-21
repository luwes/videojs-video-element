export default {
  nodeResolve: true,
  groups: [
    {
      name: 'lazy-upgrade',
      files: 'test/**/*test.js',
      testRunnerHtml: testFramework =>
        `<html>
          <head>
            <script type="importmap">
              {
                "imports": {
                  "super-media-element": "https://cdn.jsdelivr.net/npm/super-media-element"
                }
              }
            </script>
            <script type="module" src="./videojs-video-element.js"></script>
            <script type="module" src="${testFramework}"></script>
          </head>
          <body></body>
        </html>`,
    },
  ],
};
