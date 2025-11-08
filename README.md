# QR Code Offline Tools

> https://schmich.github.io/qr-code-offline-tools/qr.html

QR Code Offline Tools is a single static offline HTML page for encoding and decoding QR codes using images, text, copy-pasting, drag & drop, and file pickers. It supports all image types supported by major browsers and can encode QR codes into SVG and PNG formats.

You can use the tool at the link above, or you can save the HTML page and run it locally. QR encoding and decoding is done using the [@zxing/browser](https://github.com/zxing-js/browser) library.

## Security

The HTML page, [qr.html](https://schmich.github.io/qr-code-offline-tools/qr.html), is completely self-contained with all of its scripts, styles, and required assets inlined. The page has a strict [content security policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) defined and enforced through a `<meta>` tag. The CSP is defined approximately as follows with the page's inline style and script content hashed and enforced at runtime. No external connections or requests are allowed.

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests; img-src blob:; script-src 'sha256-...'; style-src 'sha256-...'">
```

## License

Copyright &copy; 2025 Chris Schmich\
MIT License. See [LICENSE](LICENSE) for details.