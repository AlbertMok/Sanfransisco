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
  entry: ["src/html.ts", "src/text.ts", "src/markdown.ts"],
  external: ["mdast"]
}));
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvdWJ1bnR1MjIvZWRpdG9yL2VkaXRhYmxlLW1haW4vcGFja2FnZXMvc2VyaWFsaXplci90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvaG9tZS91YnVudHUyMi9lZGl0b3IvZWRpdGFibGUtbWFpbi9wYWNrYWdlcy9zZXJpYWxpemVyXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9ob21lL3VidW50dTIyL2VkaXRvci9lZGl0YWJsZS1tYWluL3BhY2thZ2VzL3NlcmlhbGl6ZXIvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xuaW1wb3J0IGRlZmF1bHRDb25maWcgZnJvbSAndHN1cC1jb25maWcnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhvcHRpb25zID0+ICh7XG4gIC4uLihkZWZhdWx0Q29uZmlnKG9wdGlvbnMpIGFzIGFueSksXG4gIGVudHJ5OiBbJ3NyYy9odG1sLnRzJywgJ3NyYy90ZXh0LnRzJywgJ3NyYy9tYXJrZG93bi50cyddLFxuICBleHRlcm5hbDogWydtZGFzdCddLFxufSkpXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBbVQsU0FBUyxvQkFBb0I7QUFDaFYsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhLGFBQVksaUNBQ2xDLGNBQWMsT0FBTyxJQURhO0FBQUEsRUFFdEMsT0FBTyxDQUFDLGVBQWUsZUFBZSxpQkFBaUI7QUFBQSxFQUN2RCxVQUFVLENBQUMsT0FBTztBQUNwQixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
