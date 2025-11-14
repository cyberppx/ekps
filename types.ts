
export interface ImageFile {
  name: string;
  type: string;
  size: number;
  base64: string;
}

export interface EditAction {
  id: string;
  name: string;
  prompt: string;
  loadingMessage: string;
}

export interface EditCategory {
  name: string;
  actions: EditAction[];
}
