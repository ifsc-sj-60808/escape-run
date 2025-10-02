from PIL import Image
import numpy as np
import random

# Input symbol files
MAIN_SYMBOL = "squid-symbol.png"  # true (red)
CYAN_DECOY = "symbol-decoy1.png"  # cyan decoy
BLUE_DECOY = "symbol-decoy2.png"  # blue decoy
GREEN_DECOY = "symbol-decoy3.png"  # green decoy
OUTPUT_IMAGE = "symbols_with_decoys.png"

IMG_SIZE = (512, 512)


def load_symbol_mask(path, size):
    """Load symbol as boolean mask (dark + opaque pixels)."""
    symbol = Image.open(path).convert("LA").resize(size, Image.LANCZOS)
    l, a = symbol.split()
    l = np.array(l)
    a = np.array(a)
    return (a > 10) & (l < 128)


def generate_dithered_multi(main_mask, cyan_mask, blue_mask, green_mask, img_size):
    h, w = img_size
    img = np.zeros((h, w, 3), dtype=np.uint8)

    for y in range(h):
        for x in range(w):
            # Background noise: random dot in one channel
            base_choice = random.choice([0, 1, 2])  # R, G, B
            base_intensity = random.randint(40, 150)
            pixel = [0, 0, 0]
            pixel[base_choice] = base_intensity

            # Main RED symbol
            if main_mask[y, x] and random.random() < 0.6:
                pixel = [random.randint(120, 255), 0, 0]

            # Cyan decoy
            if cyan_mask[y, x] and random.random() < 0.6:
                pixel = [0, random.randint(120, 255), random.randint(120, 255)]

            # Blue decoy
            if blue_mask[y, x] and random.random() < 0.6:
                pixel = [0, 0, random.randint(120, 255)]

            # Green decoy
            if green_mask[y, x] and random.random() < 0.6:
                pixel = [0, random.randint(120, 255), 0]

            img[y, x] = pixel
    return img


def main():
    # Load symbol masks
    main_mask = load_symbol_mask(MAIN_SYMBOL, IMG_SIZE)
    cyan_mask = load_symbol_mask(CYAN_DECOY, IMG_SIZE)
    blue_mask = load_symbol_mask(BLUE_DECOY, IMG_SIZE)
    green_mask = load_symbol_mask(GREEN_DECOY, IMG_SIZE)

    # Generate dithered camouflage
    img = generate_dithered_multi(main_mask, cyan_mask, blue_mask, green_mask, IMG_SIZE)

    # Save result
    Image.fromarray(img).save(OUTPUT_IMAGE)
    print(
        "✅ Dithered image with red main + cyan/blue/green decoys saved:", OUTPUT_IMAGE
    )


if __name__ == "__main__":
    main()
