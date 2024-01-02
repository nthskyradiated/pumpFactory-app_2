
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:5555/",
 documents: ['src/**/*.graphql'],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript"]
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
