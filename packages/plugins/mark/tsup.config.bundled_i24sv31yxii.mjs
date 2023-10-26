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
    "src/index.tsx",
    "src/serializer/html.ts",
    "src/serializer/markdown.ts",
    "src/deserializer/html.ts",
    "src/deserializer/markdown.ts"
  ]
}));
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvdWJ1bnR1MjIvZWRpdG9yL1NhbmZyYW5zaXNjby9wYWNrYWdlcy9wbHVnaW5zL21hcmsvdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL2hvbWUvdWJ1bnR1MjIvZWRpdG9yL1NhbmZyYW5zaXNjby9wYWNrYWdlcy9wbHVnaW5zL21hcmtcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL2hvbWUvdWJ1bnR1MjIvZWRpdG9yL1NhbmZyYW5zaXNjby9wYWNrYWdlcy9wbHVnaW5zL21hcmsvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xyXG5pbXBvcnQgZGVmYXVsdENvbmZpZyBmcm9tICd0c3VwLWNvbmZpZydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhvcHRpb25zID0+ICh7XHJcbiAgLi4uKGRlZmF1bHRDb25maWcob3B0aW9ucykgYXMgYW55KSxcclxuICBlbnRyeTogW1xyXG4gICAgJ3NyYy9pbmRleC50c3gnLFxyXG4gICAgJ3NyYy9zZXJpYWxpemVyL2h0bWwudHMnLFxyXG4gICAgJ3NyYy9zZXJpYWxpemVyL21hcmtkb3duLnRzJyxcclxuICAgICdzcmMvZGVzZXJpYWxpemVyL2h0bWwudHMnLFxyXG4gICAgJ3NyYy9kZXNlcmlhbGl6ZXIvbWFya2Rvd24udHMnLFxyXG4gIF0sXHJcbn0pKVxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBc1QsU0FBUyxvQkFBb0I7QUFDblYsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhLGFBQVksaUNBQ2xDLGNBQWMsT0FBTyxJQURhO0FBQUEsRUFFdEMsT0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
