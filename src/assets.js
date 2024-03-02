import {
  Assets,
  extensions,
  ExtensionType,
  resolveTextureUrl,
  settings,
} from "pixi.js";

import manifest from "./manifest.json";

export const resolveJsonUrl = {
  extension: ExtensionType.ResolveParser,
  test: (value) =>
    settings.RETINA_PREFIX.test(value) && value.endsWith(".json"),
  parse: resolveTextureUrl.parse,
};

extensions.add(resolveJsonUrl);

export const initAssets = async () => {
  await Assets.init({ manifest });
  const gameBundles = manifest.bundles.map((item) => item.name);
  Assets.backgroundLoadBundle(gameBundles);

  const assets = await Assets.loadBundle(gameBundles);
  return assets.default ? assets.default : assets;
}

export const isBundleLoaded = (bundle) => {
  const bundleManifest = manifest.bundles.find((b) => b.name === bundle);

  if (!bundleManifest) {
    return false;
  }

  for (const asset of bundleManifest.assets) {
    if (!Assets.cache.has(asset.name)) {
      return false;
    }
  }

  return true;
}

export const areBundlesLoaded = (bundles) => {
  for (const name of bundles) {
    if (!isBundleLoaded(name)) {
      return false;
    }
  }

  return true;
}
