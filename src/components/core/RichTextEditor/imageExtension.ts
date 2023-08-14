import { PasteRule } from '@remirror/pm/paste-rules'
import { ImageExtension } from 'remirror/extensions'

/**
 * This extension handles the images pasted directly from other websites, so it only handles img tags, the image file upload is being
 * handled in the file extension
 * Potential TODO: Shift both the image uploads and image tags under the image extension
 * Potential TODO 2: Shift the properties from the class instantiation to the default properties by using "extension" decorator
 */
export class CustomImageExtension extends ImageExtension {
  /**
   * Overrides the original implementation of the paste rules to prevent the image FILES from being handled by this extension
   */
  createPasteRules(): PasteRule[] {
    return []
  }
}
