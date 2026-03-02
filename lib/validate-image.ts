/**
 * Validates if a URL points to a valid, loadable image
 * by attempting to load it in a browser Image element.
 */
export const validateImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Basic URL format check first
    try {
      new URL(url);
    } catch {
      resolve(false);
      return;
    }

    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
