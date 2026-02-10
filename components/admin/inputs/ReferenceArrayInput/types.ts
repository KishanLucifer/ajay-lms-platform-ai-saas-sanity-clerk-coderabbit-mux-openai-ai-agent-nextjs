export interface ReferenceArrayInputProps {
  documentId: string;
  documentType: string;
  projectId: string;
  dataset: string;
  path: string;
  label: string;
  referenceType: string;
}

export interface SanityReference {
  _type: "reference";
  _ref: string;
  _key: string;
}

