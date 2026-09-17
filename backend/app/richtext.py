"""Convert Canvas HTML into a small block structure the frontend can render safely:
[{"kind": "heading" | "paragraph",
  "runs": [{"text": ..., "href"?: ..., "bold"?: true, "highlight"?: true}]}]"""

import re
from html.parser import HTMLParser

_BLOCK_TAGS = {"p", "div", "li", "blockquote", "tr", "br", "h1", "h2", "h3", "h4", "h5", "h6"}
_HEADING_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6"}
_URL_RE = re.compile(r"https?://[^\s<>\"']+")
_HIGHLIGHT_RE = re.compile(r"background(?:-color)?\s*:", re.I)


class _BlockParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks: list[dict] = []
        self._runs: list[dict] = []
        self._kind = "paragraph"
        self._href: str | None = None
        self._bold = 0
        # Stack of open tags, each marking whether it turned on a highlight
        self._highlight: list[bool] = []

    def _style(self) -> dict:
        style = {}
        if self._href:
            style["href"] = self._href
        if self._bold:
            style["bold"] = True
        if any(self._highlight):
            style["highlight"] = True
        return style

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self._highlight.append(bool(_HIGHLIGHT_RE.search(attrs.get("style") or "")))
        if tag in _BLOCK_TAGS:
            self._flush()
            if tag in _HEADING_TAGS:
                self._kind = "heading"
        elif tag == "a":
            href = attrs.get("href")
            if href and href.startswith(("http://", "https://", "mailto:")):
                self._href = href
        elif tag in ("strong", "b"):
            self._bold += 1

    def handle_endtag(self, tag):
        if self._highlight:
            self._highlight.pop()
        if tag in _BLOCK_TAGS:
            self._flush()
            self._kind = "paragraph"
        elif tag == "a":
            self._href = None
        elif tag in ("strong", "b"):
            self._bold = max(0, self._bold - 1)

    def handle_data(self, data):
        style = self._style()
        if self._href:
            self._runs.append({"text": data, **style})
            return
        # Autolink bare URLs in plain text
        pos = 0
        for m in _URL_RE.finditer(data):
            self._runs.append({"text": data[pos : m.start()], **style})
            self._runs.append({"text": m.group(), **style, "href": m.group()})
            pos = m.end()
        self._runs.append({"text": data[pos:], **style})

    def _flush(self):
        runs: list[dict] = []
        for run in self._runs:
            text = re.sub(r"\s+", " ", run["text"])
            if not text:
                continue
            style = {k: v for k, v in run.items() if k != "text"}
            if runs and {k: v for k, v in runs[-1].items() if k != "text"} == style:
                runs[-1]["text"] += text
            else:
                runs.append({"text": text, **style})
        self._runs = []
        if runs:
            runs[0]["text"] = runs[0]["text"].lstrip()
            runs[-1]["text"] = runs[-1]["text"].rstrip()
            runs = [r for r in runs if r["text"]]
        if runs:
            self.blocks.append({"kind": self._kind, "runs": runs})


def html_to_blocks(html: str) -> list[dict]:
    parser = _BlockParser()
    parser.feed(html)
    parser.close()
    parser._flush()
    return parser.blocks


def blocks_to_text(blocks: list[dict]) -> str:
    return " ".join(run["text"] for block in blocks for run in block["runs"])
