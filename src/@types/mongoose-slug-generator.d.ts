declare module 'mongoose-slug-generator' {
    import { Schema } from 'mongoose';

    interface SlugOptions {
        separator?: string;
        lang?: string;
        truncate?: number;
        backwardsCompatible?: boolean;
    }

    const mongooseSlugGenerator: (schema: Schema, options?: SlugOptions) => void;
    export = mongooseSlugGenerator;
}
