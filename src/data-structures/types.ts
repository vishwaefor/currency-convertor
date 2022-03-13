export type NodeValuePair<N> = {
  node: N;
  value: number;
};

export type Weight = {
  parent?: string; // for tracing the path
  value: number; // value
};
export type AdgacencyList<N> = { [key: string]: NodeValuePair<N>[] };

export type WeightsMap = { [key: string]: Weight };
