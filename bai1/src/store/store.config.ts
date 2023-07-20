export interface StoreRootConfig {
    dirname: string;
}

export interface StoreFeatureConfig {
    filename: string;
}

export type StoreConfig = Partial<StoreRootConfig & StoreFeatureConfig>;

export const STORE_CONFIG_TOKEN = '_STORE_CONFIG_TOKEN_';