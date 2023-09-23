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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvdWJ1bnR1MjIvZWRpdG9yL2VkaXRhYmxlLW1haW4vcGFja2FnZXMvcGx1Z2lucy9wbHVnaW5zL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9ob21lL3VidW50dTIyL2VkaXRvci9lZGl0YWJsZS1tYWluL3BhY2thZ2VzL3BsdWdpbnMvcGx1Z2luc1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vaG9tZS91YnVudHUyMi9lZGl0b3IvZWRpdGFibGUtbWFpbi9wYWNrYWdlcy9wbHVnaW5zL3BsdWdpbnMvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xuaW1wb3J0IGRlZmF1bHRDb25maWcgZnJvbSAndHN1cC1jb25maWcnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhvcHRpb25zID0+ICh7XG4gIC4uLihkZWZhdWx0Q29uZmlnKG9wdGlvbnMpIGFzIGFueSksXG4gIGVudHJ5OiBbXG4gICAgJ3NyYy9pbmRleC50cycsXG4gICAgJ3NyYy9zZXJpYWxpemVyL2h0bWwudHMnLFxuICAgICdzcmMvc2VyaWFsaXplci90ZXh0LnRzJyxcbiAgICAnc3JjL3NlcmlhbGl6ZXIvbWFya2Rvd24udHMnLFxuICAgICdzcmMvZGVzZXJpYWxpemVyL2h0bWwudHMnLFxuICAgICdzcmMvZGVzZXJpYWxpemVyL21hcmtkb3duLnRzJyxcbiAgXSxcbn0pKVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWtVLFNBQVMsb0JBQW9CO0FBQy9WLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYSxhQUFZLGlDQUNsQyxjQUFjLE9BQU8sSUFEYTtBQUFBLEVBRXRDLE9BQU87QUFBQSxJQUNMO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
