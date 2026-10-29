"""Draw Cội's PNG icon (192, also used as the Apple touch icon) with Pillow.

Same geometry as public/icon.svg: a four-node kinship glyph, lime on a
flat forest tile — flat colour so the PNG stays tiny and the icon reads
at 60px on a home screen.

    python3 scripts/make-icons.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parent.parent / "public"
SIZE = 1024
SCALE = 4

LIME = (217, 233, 168, 255)
DEEP = (12, 33, 24, 255)

# Geometry, in the 1024 unit space of icon.svg.
TOP = (512, 310, 62)
LEFT = (318, 626, 62)
MID = (512, 626, 62)
RIGHT = (706, 626, 62)
STEM = [(512, 372), (512, 544)]
BAR = [(318, 544), (706, 544)]
DROPS = [[(318, 544), (318, 564)], [(512, 544), (512, 564)], [(706, 544), (706, 564)]]
STROKE = 26


def draw_icon(size: int = 192) -> Image.Image:
    big = Image.new("RGBA", (SIZE * SCALE, SIZE * SCALE), DEEP)
    draw = ImageDraw.Draw(big)

    def s(value: float) -> float:
        return value * SCALE

    def circle(cx: float, cy: float, radius: float, outline: bool) -> None:
        box = [s(cx - radius), s(cy - radius), s(cx + radius), s(cy + radius)]
        width = int(s(STROKE))
        if outline:
            draw.ellipse(box, fill=DEEP, outline=LIME, width=width)
        else:
            draw.ellipse(box, fill=LIME)

    def line(points: list[tuple[float, float]]) -> None:
        draw.line([(s(x), s(y)) for x, y in points], fill=LIME, width=int(s(STROKE)), joint="curve")

    line(STEM)
    line(BAR)
    for drop in DROPS:
        line(drop)

    for cx, cy, radius in (TOP, LEFT, MID, RIGHT):
        circle(cx, cy, radius, outline=True)

    # the "you" node, filled
    circle(MID[0], MID[1], 24, outline=False)
    circle(TOP[0], TOP[1], 18, outline=False)

    icon = big.resize((size, size), Image.LANCZOS).convert("RGB")
    return icon.quantize(colors=8, dither=Image.NONE).convert("RGB")


def main() -> None:
    draw_icon().save(PUBLIC / "icon-192.png", optimize=True)
    print("wrote", PUBLIC / "icon-192.png")


if __name__ == "__main__":
    main()
