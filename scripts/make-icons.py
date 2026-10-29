"""Draw Cội's PNG icons (512 / apple-touch 180) with Pillow.

Same geometry as public/icon.svg: a four-node kinship glyph, lime on
forest, rendered at 4x and downsampled for clean edges.

    python3 scripts/make-icons.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parent.parent / "public"
SIZE = 1024
SCALE = 4

LIME = (217, 233, 168, 255)
DEEP = (12, 33, 24, 255)
GLYPH = (12, 33, 24)

# Geometry, in the 1024 unit space of icon.svg.
TOP = (512, 310, 62)
LEFT = (318, 626, 62)
MID = (512, 626, 62)
RIGHT = (706, 626, 62)
STEM = [(512, 372), (512, 544)]
BAR = [(318, 544), (706, 544)]
DROPS = [[(318, 544), (318, 564)], [(512, 544), (512, 564)], [(706, 544), (706, 564)]]
STROKE = 26


def build_base(size: int) -> Image.Image:
    """Vertical forest gradient with a soft lime bloom behind the glyph."""
    image = Image.new("RGBA", (size, size), (0, 0, 0, 255))
    pixels = image.load()
    for y in range(size):
        ratio = y / (size - 1)
        # 1E4535 -> 08170F
        r = int(30 - 22 * ratio)
        g = int(69 - 46 * ratio)
        b = int(53 - 38 * ratio)
        for x in range(size):
            pixels[x, y] = (r, g, b, 255)

    bloom = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bloom)
    cx, cy, radius = size * 0.5, size * 0.44, size * 0.46
    steps = 60
    for step in range(steps, 0, -1):
        alpha = int(10 + (1 - step / steps) * 24)
        r = radius * step / steps
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(217, 233, 168, alpha))
    return Image.alpha_composite(image, bloom)


def draw_icon(size: int) -> Image.Image:
    big = build_base(SIZE * SCALE)
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
        scaled = [(s(x), s(y)) for x, y in points]
        draw.line(scaled, fill=LIME, width=int(s(STROKE)), joint="curve")

    line(STEM)
    line(BAR)
    for drop in DROPS:
        line(drop)

    for cx, cy, radius in (TOP, LEFT, MID, RIGHT):
        circle(cx, cy, radius, outline=True)

    # the "you" node, filled
    circle(MID[0], MID[1], 24, outline=False)
    circle(TOP[0], TOP[1], 18, outline=False)

    return big.resize((size, size), Image.LANCZOS).convert("RGB")


def main() -> None:
    for name, size in (("icon-512.png", 512), ("apple-touch-icon.png", 180)):
        draw_icon(size).save(PUBLIC / name, optimize=True)
        print("wrote", PUBLIC / name)


if __name__ == "__main__":
    main()
