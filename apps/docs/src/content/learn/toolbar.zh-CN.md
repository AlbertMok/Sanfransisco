---
title: 配置工具栏
---

<Intro>

这个页面将向您展示如何在 Editable 中配置使用工具栏。

</Intro>

## 步骤 1: 安装 `@everynote/plugin-toolbar` {/*step-1*/}

<TerminalBlock>

npm install @everynote/models @everynote/editor @everynote/plugins @everynote/plugin-toolbar

</TerminalBlock>

## 步骤 2: 导入工具栏 {/*step-2*/}

```js

import * as React from 'react'
import { createEditor } from '@everynote/models'
import { EditableProvider, ContentEditable, withEditable } from '@everynote/editor'
import { withPlugins } from '@everynote/plugins'
import { ToolbarComponent, useToolbarEffect, withToolbar, Toolbar } from '@everynote/plugin-toolbar'

```

## 步骤 3: 使用 `withToolbar` {/*step-3*/}

工具栏是一个插件，所以我们需要使用 `withToolbar` 将其添加到编辑器中。

```js
const App = () => {
  const editor = React.useMemo(() => {
    let editor = withEditable(createEditor())
    editor = withPlugins(editor)
    return withToolbar(editor)
  }, [])

  return (
    <EditableProvider editor={editor}>
      <ContentEditable />
    </EditableProvider>
  )
}

```

## 步骤 4: 使用 `ToolbarComponent` {/*step-4*/}

`ToolbarComponent` 是一个 React 组件，它将会渲染工具栏。

```js
const App = () => {
  const editor = React.useMemo(() => {
    let editor = withEditable(createEditor())
    editor = withPlugins(editor)
    return withToolbar(editor)
  }, [])

  return (
    <EditableProvider editor={editor}>
      <ToolbarComponent />
      <ContentEditable />
    </EditableProvider>
  )
}

```

## 步骤 5: 使用 `useToolbarEffect` {/*step-5*/}

`useToolbarEffect` 是一个 React Hook，在需要更新的时候会执行回调。

在回调的时候，我们可以通过 `Toolbar.setItems` 来更新工具栏的内容。

```js

const marks: [] = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'sub', 'sup']

const App = () => {
  const editor = React.useMemo(() => {
    let editor = withEditable(createEditor())
    editor = withPlugins(editor)
    return withToolbar(editor)
  }, [])

  useToolbarEffect(() => {
    Toolbar.setItems(editor, marks.map(mark => ({
      type: 'button',
      children: mark,
      active: MarkEditor.isActive(editor, mark),
      onToggle: () => {
        MarkEditor.toggle(editor, mark)
      }
    })))
  }, editor)

  return (
    <EditableProvider editor={editor}>
      <ToolbarComponent />
      <ContentEditable />
    </EditableProvider>
  )
}

```

`MarkEditor` 对象是 `@everynote/plugin-mark` 提供的，它可以帮助我们操作文本的样式。

因为它也属于常用的插件，已经集合在 `@everynote/plugins` 包中，所以你也可以从 `@everynote/plugins` 中导入。

```js
import { withPlugins, MarkEditor } from '@everynote/plugins'
```

## 尝试使用工具栏 {/*try-toolbar*/}

下面的沙箱已经使用了 `@everynote/plugin-toolbar`，您可以在其中尝试使用工具栏。

<Sandpack deps={['@everynote/plugins', '@everynote/plugin-toolbar']}>

```js
import * as React from 'react'
import { createEditor } from '@everynote/models'
import { EditableProvider, ContentEditable, withEditable } from '@everynote/editor'
import { withPlugins, MarkEditor } from '@everynote/plugins'
import { ToolbarComponent, useToolbarEffect, withToolbar, Toolbar } from '@everynote/plugin-toolbar'

const marks: [] = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'sub', 'sup']

export default function App() {
  const editor = React.useMemo(() => {
    let editor = withEditable(createEditor())
    editor = withPlugins(editor)
    return withToolbar(editor)
  }, [])

  useToolbarEffect(() => {
    Toolbar.setItems(editor, marks.map(mark => ({
      type: 'button',
      children: mark,
      active: MarkEditor.isActive(editor, mark),
      onToggle: () => {
        MarkEditor.toggle(editor, mark)
      }
    })))
  }, editor)

  return (
    <EditableProvider editor={editor}>
      <ToolbarComponent editor={editor} />
      <ContentEditable />
    </EditableProvider>
  )
}

```

</Sandpack>

In addition to the traditional toolbar, we also provide some other toolbar options:

- `inline` - Inline toolbar `@everynote/plugin-toolbar/inline`
- `side` - Side toolbar `@everynote/plugin-toolbar/side`
- `slash` - Shortcut toolbar `@everynote/plugin-toolbar/slash`

## Next Steps {/*next-steps*/}

Go to the [Context Menu](/learn/context-menu) guide to learn how to configure and use the context menu.
