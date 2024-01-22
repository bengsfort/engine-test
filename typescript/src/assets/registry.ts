import { ImageLoader } from 'three';

import { makeLoggers } from '../utils/logging';

import gridTexture from './textures/grid.png';

const { info, warn, error } = makeLoggers('Assets', 'Registry');

// 1x1 0xff00ff pixel
const TEXTURE_FALLBACK = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxJREFUeJxj+M/wHwAEAAH/Igo68AAAAABJRU5ErkJggg==`;

const textureRegistry = {
  grid: gridTexture,
} as const;

export type TextureAsset = keyof typeof textureRegistry;

class AssetLoader {
  #loadedMap = new Map<TextureAsset, HTMLImageElement>();
  #isLoaded = false;
  #loadedPromise: Promise<boolean> | null = null;
  #loader = new ImageLoader();

  public get loaded(): boolean {
    return this.#isLoaded;
  }

  public waitReady(): Promise<boolean> {
    if (this.#loadedPromise === null) {
      return this.load();
    }

    return this.#loadedPromise;
  }

  public load(): Promise<boolean> {
    if (this.#loadedPromise !== null) {
      return this.#loadedPromise;
    }

    this.#loadedPromise = this.#loadAssets();
    return this.#loadedPromise;
  }

  public getTexture(asset: TextureAsset): HTMLImageElement | undefined {
    if (!this.#isLoaded) {
      throw new Error('Assets not loaded');
    }

    const texture = this.#loadedMap.get(asset);
    if (!texture) {
      warn(`Texture ${asset} not found`);
    }

    return texture;
  }

  // @todo (Matti) - Would be wise to actually expose whether a texture loaded or not
  async #loadAssets(): Promise<boolean> {
    const results = [];
    let fallback: HTMLImageElement;

    try {
      fallback = await this.#loader.loadAsync(TEXTURE_FALLBACK);
    } catch (err) {
      error(`Critical failure: could not load fallback texture!`, err);
      this.#isLoaded = false;
      return false;
    }

    for (const [name, url] of Object.entries(textureRegistry)) {
      results.push(
        new Promise((resolve, reject) => {
          this.#loader.load(
            url,
            (texture) => {
              this.#loadedMap.set(name as TextureAsset, texture);
              info(`Loaded texture asset ${name}`);
              resolve(true);
            },
            undefined,
            (err) => {
              error(`Error loading ${name}:`, err);
              this.#loadedMap.set(name as TextureAsset, fallback);
              reject(err);
            },
          );
        }),
      );
    }

    await Promise.allSettled(results);

    this.#isLoaded = true;
    return true;
  }
}

export const assetRegistry = new AssetLoader();
