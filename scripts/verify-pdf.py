"""Render QA PDFs and make contact sheets. Optional: pdfplumber, Pillow, Poppler.

Usage: python scripts/verify-pdf.py <qa-directory> --poppler <pdftoppm-executable>
Contact sheets support visual review; the margin scan alone cannot certify layout.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import argparse
import json
import subprocess

import pdfplumber
from PIL import Image, ImageDraw

parser = argparse.ArgumentParser()
parser.add_argument("directory", type=Path)
parser.add_argument("--poppler", default="pdftoppm")
args = parser.parse_args()
root = args.directory.resolve()
summary = {}


def review(pdf):
    folder = root / (pdf.stem + "-render")
    folder.mkdir(exist_ok=True)
    subprocess.run([args.poppler, "-r", "85", "-png", str(pdf), str(folder / "page")], check=True, capture_output=True)
    with pdfplumber.open(pdf) as document:
        pages_count = len(document.pages)
        outside, missing = [], []
        for number, page in enumerate(document.pages, 1):
            if "\ufffd" in (page.extract_text() or ""):
                missing.append(number)
            if not pdf.stem.startswith("enunciados"):
                bad = [char for char in page.chars if char["x0"] < 40 or char["x1"] > page.width - 40 or char["top"] < 15 or char["bottom"] > page.height - 15]
                if bad:
                    outside.append({"page": number, "text": "".join(char["text"] for char in bad)[:100]})
        summary[pdf.name] = {"pages": pages_count, "outside_margins": outside, "replacement_characters": missing}
    # Enumerate exactly the pages in this PDF, ignoring stale PNGs from a longer run.
    pad = len(str(pages_count))
    pages = [folder / f"page-{number:0{pad}d}.png" for number in range(1, pages_count + 1)]
    for start in range(0, len(pages), 12):
        sheet = Image.new("RGB", (1416, 1590), "#c9c9c9")
        drawing = ImageDraw.Draw(sheet)
        for index, png in enumerate(pages[start:start + 12]):
            image = Image.open(png).convert("RGB")
            image.thumbnail((338, 493))
            x, y = (index % 4) * 354 + 8, (index // 4) * 530 + 25
            sheet.paste(image, (x, y))
            drawing.text((x, y - 18), f"{pdf.stem} {start + index + 1}", fill="black")
        sheet.save(root / f"{pdf.stem}-sheet-{start // 12 + 1}.png")


with ThreadPoolExecutor(max_workers=3) as workers:
    list(workers.map(review, root.glob("*.pdf")))
(root / "qa-summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(summary, ensure_ascii=True, indent=2))
if any(result["outside_margins"] or result["replacement_characters"] for result in summary.values()):
    raise SystemExit(1)
