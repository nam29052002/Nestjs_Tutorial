import { DynamicModule, Module } from "@nestjs/common";
import { StoreService } from "./store.service";
import { STORE_CONFIG_TOKEN, StoreConfig, StoreFeatureConfig, StoreRootConfig } from "./store.config";

let rootStoreConfig: StoreConfig;
const DEFAULT_STORE_DIRNAME = 'store';
const DEFAULT_FILE_DIRNAME = 'data.json';

@Module({
    providers: [StoreService],
    exports: [StoreService]
})
class RootStoreModule {}

@Module({
    /*providers: [
        StoreService,
        {
            provide: '_STORE_CONFIG_',
            useValue: {
                dirname: 'store',
                filename: 'data.json'
            } as StoreConfig
        }
    ],
    exports: [StoreService]*/
})
export class StoreModule {
    public static forRoot(storeConfig?: StoreRootConfig): DynamicModule {
        console.log('1');
        rootStoreConfig = StoreModule.createConfig(storeConfig);
        return {
            module: StoreModule,
            providers: [
                {
                    provide: STORE_CONFIG_TOKEN,
                    useValue: rootStoreConfig
                }
            ],
        };
    }

    public static forFeature(storeConfig?: StoreFeatureConfig): DynamicModule {
        console.log(storeConfig.filename);
        const token = 'STORE_SERVICE_' + storeConfig.filename;
        return {
            module: StoreModule,
            providers: [
                {
                    provide: token,
                    useFactory: () => {
                        const featureStoreConfig = StoreModule.createConfig({...rootStoreConfig, ...storeConfig});
                        return new StoreService(featureStoreConfig);
                    }
                }
            ],
            exports: [token]
        };
    }

    private static createConfig(config: StoreConfig): StoreConfig {
        const defaultConfig: StoreConfig = {
            dirname: DEFAULT_STORE_DIRNAME,
            filename: DEFAULT_FILE_DIRNAME
        }
        // return Object.assign(defaultConfig, config);
        return {...defaultConfig, ...config};
    }
}
