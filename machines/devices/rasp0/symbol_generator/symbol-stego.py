from PIL import Image
import numpy as np

INPUT_SYMBOL = "squid_symbol.png"
OUTPUT_IMAGE = "squid_hidden_in_red.png"

IMG_SIZE = (512, 512)
ICON_SIZE = (256, 256)  # much bigger symbol
ICON_POS = (128, 128)  # centered-ish

NOISE_RANGE = (20, 60)  # darker gray background
SYMBOL_RED_BOOST = 40  # how much more red than background
BLEND_STRENGTH = 0.6  # how strongly to blend symbol edges


def load_symbol_mask(path, size):
    """Load symbol and return boolean mask for 'visible' pixels."""
    symbol = Image.open(path).convert("LA").resize(size, Image.LANCZOS)
    l, a = symbol.split()
    l = np.array(l)
    a = np.array(a)
    mask = (a > 10) & (l < 128)  # visible = dark & opaque
    return mask


def embed_symbol_hidden(mask, img_size, pos):
    """Embed symbol with subtle red boost, not obvious to naked eye."""
    h, w = img_size[1], img_size[0]

    # Base grayscale noise
    base = np.random.randint(NOISE_RANGE[0], NOISE_RANGE[1] + 1, (h, w), dtype=np.uint8)
    img = np.stack([base, base, base], axis=-1)

    mh, mw = mask.shape
    x0, y0 = pos
    x1, y1 = x0 + mw, y0 + mh

    region = img[y0:y1, x0:x1].astype(np.int16)

    # Apply subtle red boost where mask is true
    boost = np.zeros_like(region)
    boost[..., 0] = SYMBOL_RED_BOOST  # only boost red channel

    # Blend instead of replacing
    region[mask] = (
        region[mask] * (1 - BLEND_STRENGTH)
        + (region[mask] + boost[mask]) * BLEND_STRENGTH
    ).astype(np.uint8)

    img[y0:y1, x0:x1] = region.astype(np.uint8)

    return Image.fromarray(img)


def main():
    print("Loading symbol...")
    mask = load_symbol_mask(INPUT_SYMBOL, ICON_SIZE)

    print("Embedding hidden symbol...")
    img = embed_symbol_hidden(mask, IMG_SIZE, ICON_POS)

    img.save(OUTPUT_IMAGE)
    print("✅ Hidden image saved:", OUTPUT_IMAGE)


if __name__ == "__main__":
    main()
