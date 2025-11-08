# QR Code Offline Tools

<img src="public/favicon.svg" width="24" height="24" align="top"/> [`https://schmich.github.io/qr-code-offline-tools/qr.html`](https://schmich.github.io/qr-code-offline-tools/qr.html)

QR Code Offline Tools is a single static offline HTML page for encoding and decoding QR codes using images, text, copy-pasting, drag & drop, and file dialogs. It supports all image types supported by major browsers and can encode QR codes into SVG and PNG formats.

You can use the tool at the link above, or you can save the HTML page and run it locally. QR encoding and decoding is done using the [@zxing/browser](https://github.com/zxing-js/browser) library.

## Offline Security

The HTML page is completely self-contained with all of its scripts, styles, and required assets inlined. The page has a strict [content security policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) defined and enforced through a document `<meta>` tag. The CSP is defined approximately below with the page's inline style and script content hashed with integrity checking at runtime. No external connections, requests, or resources are allowed on the page.

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests; img-src blob:; script-src 'sha256-...'; style-src 'sha256-...'">
```

## Preview

![Screenshot](public/screenshot.webp)

## License

Copyright &copy; 2025 Chris Schmich\
MIT License. See [LICENSE](LICENSE) for details.
