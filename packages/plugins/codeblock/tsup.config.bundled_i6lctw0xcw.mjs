var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// tsup.config.ts
import { defineConfig } from "tsup";
import defaultConfig from "tsup-config";
var tsup_config_default = defineConfig((options) => __spreadProps(__spreadValues({}, defaultConfig(options)), {
  entry: [
    "src/index.ts",
    "src/yjs.ts",
    "src/serializer/html.ts",
    "src/serializer/text.ts",
    "src/serializer/markdown.ts",
    "src/deserializer/html.ts",
    "src/deserializer/markdown.ts"
  ]
}));
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvdWJ1bnR1MjIvZWRpdG9yL2VkaXRhYmxlLW1haW4vcGFja2FnZXMvcGx1Z2lucy9jb2RlYmxvY2svdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL2hvbWUvdWJ1bnR1MjIvZWRpdG9yL2VkaXRhYmxlLW1haW4vcGFja2FnZXMvcGx1Z2lucy9jb2RlYmxvY2tcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL2hvbWUvdWJ1bnR1MjIvZWRpdG9yL2VkaXRhYmxlLW1haW4vcGFja2FnZXMvcGx1Z2lucy9jb2RlYmxvY2svdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xuaW1wb3J0IGRlZmF1bHRDb25maWcgZnJvbSAndHN1cC1jb25maWcnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhvcHRpb25zID0+ICh7XG4gIC4uLihkZWZhdWx0Q29uZmlnKG9wdGlvbnMpIGFzIGFueSksXG4gIGVudHJ5OiBbXG4gICAgJ3NyYy9pbmRleC50cycsXG4gICAgJ3NyYy95anMudHMnLFxuICAgICdzcmMvc2VyaWFsaXplci9odG1sLnRzJyxcbiAgICAnc3JjL3NlcmlhbGl6ZXIvdGV4dC50cycsXG4gICAgJ3NyYy9zZXJpYWxpemVyL21hcmtkb3duLnRzJyxcbiAgICAnc3JjL2Rlc2VyaWFsaXplci9odG1sLnRzJyxcbiAgICAnc3JjL2Rlc2VyaWFsaXplci9tYXJrZG93bi50cycsXG4gIF0sXG59KSlcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUF3VSxTQUFTLG9CQUFvQjtBQUNyVyxPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWEsYUFBWSxpQ0FDbEMsY0FBYyxPQUFPLElBRGE7QUFBQSxFQUV0QyxPQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
