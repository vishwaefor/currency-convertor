export type NodeValuePair<N> = {
  node: N;
  value: number;
};

export type Weight = {
  parent?: string;
  value: number;
};
export type AdgacencyList<N> = { [key: string]: NodeValuePair<N>[] };

export type WeightsMap = { [key: string]: Weight };
