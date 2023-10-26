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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvdWJ1bnR1MjIvZWRpdG9yL1NhbmZyYW5zaXNjby9wYWNrYWdlcy9wbHVnaW5zL2NvZGVibG9jay90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvaG9tZS91YnVudHUyMi9lZGl0b3IvU2FuZnJhbnNpc2NvL3BhY2thZ2VzL3BsdWdpbnMvY29kZWJsb2NrXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9ob21lL3VidW50dTIyL2VkaXRvci9TYW5mcmFuc2lzY28vcGFja2FnZXMvcGx1Z2lucy9jb2RlYmxvY2svdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xyXG5pbXBvcnQgZGVmYXVsdENvbmZpZyBmcm9tICd0c3VwLWNvbmZpZydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhvcHRpb25zID0+ICh7XHJcbiAgLi4uKGRlZmF1bHRDb25maWcob3B0aW9ucykgYXMgYW55KSxcclxuICBlbnRyeTogW1xyXG4gICAgJ3NyYy9pbmRleC50cycsXHJcbiAgICAnc3JjL3lqcy50cycsXHJcbiAgICAnc3JjL3NlcmlhbGl6ZXIvaHRtbC50cycsXHJcbiAgICAnc3JjL3NlcmlhbGl6ZXIvdGV4dC50cycsXHJcbiAgICAnc3JjL3NlcmlhbGl6ZXIvbWFya2Rvd24udHMnLFxyXG4gICAgJ3NyYy9kZXNlcmlhbGl6ZXIvaHRtbC50cycsXHJcbiAgICAnc3JjL2Rlc2VyaWFsaXplci9tYXJrZG93bi50cycsXHJcbiAgXSxcclxufSkpXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFxVSxTQUFTLG9CQUFvQjtBQUNsVyxPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWEsYUFBWSxpQ0FDbEMsY0FBYyxPQUFPLElBRGE7QUFBQSxFQUV0QyxPQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
