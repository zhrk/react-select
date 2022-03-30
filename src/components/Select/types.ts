interface Meta {
  search: string;
  scrollToBottomCount: number;
}

export type Option = { value: string | number; label: string };
export type Options = Option[];
export type Value = Option | null;

export type OnChange = (value: Value) => void;
export type OnMultiChange = (value: Options | []) => void;

export type GetOptions = (meta: Meta) => Promise<Options>;

export type Creating = boolean;
