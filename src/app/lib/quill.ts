export type QuillEditorInstance = {
  theme: { tooltip: { root: Document } };
  getSelection(): { index: number };
  insertEmbed(index: number, type: string, downloadURL: string): void;
};

let quillLoaded = false;
export const dynamicImportQuill = async () => {
  if (quillLoaded) {
    return;
  }
  const Quill = (await import('quill')).default;
  const ImageResize = (await import('quill-image-resize')).default;
  const QuillImageDropAndPaste = (await import('quill-image-drop-and-paste'))
    .default;
  Quill.register('modules/imageResize', ImageResize);
  Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
  quillLoaded = true;
};
