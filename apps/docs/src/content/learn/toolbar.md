---
title: Configuring the Toolbar
---

<Intro>

This page will show you how to configure and use the toolbar in Editable.

</Intro>

## Step 1: Install `@everynote/plugin-toolbar` {/*step-1*/}

<TerminalBlock>

npm install @everynote/models @everynote/editor @everynote/plugins @everynote/plugin-toolbar

</TerminalBlock>

## Step 2: Import the Toolbar {/*step-2*/}

```js

import * as React from 'react'
import { createEditor } from '@everynote/models'
import { EditableProvider, ContentEditable, withEditable } from '@everynote/editor'
import { withPlugins } from '@everynote/plugins'
import { ToolbarComponent, useToolbarEffect, withToolbar, Toolbar } from '@everynote/plugin-toolbar'

```

## Step 3: Use `withToolbar` {/*step-3*/}

Since the toolbar is a plugin, we need to use `withToolbar` to add it to the editor.

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

## Step 4: Use `ToolbarComponent` {/*step-4*/}

`ToolbarComponent` is a React component that will render the toolbar.

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

## Step 5: Use `useToolbarEffect` {/*step-5*/}

`useToolbarEffect` is a React Hook that executes a callback when an update is needed.

In the callback, we can update the toolbar content by using `Toolbar.setItems`.

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

The `MarkEditor` object is provided by `@everynote/plugin-mark` and it can help us manipulate text styles.

Since it is also a common plugin, it is already included in the `@everynote/plugins` package, so you can also import it from `@everynote/plugins`.

```js
import { withPlugins, MarkEditor } from '@everynote/plugins'
```

## Try the Toolbar {/*try-toolbar*/}

The sandbox below already uses `@everynote/plugin-toolbar` and you can try using the toolbar in it.

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

除了传统的工具栏外，我们还提供了一些其他的工具栏:

- `inline` - 行内工具栏 `@everynote/plugin-toolbar/inline`
- `side` - 侧边工具栏 `@everynote/plugin-toolbar/side`
- `slash` - 快捷键工具栏 `@everynote/plugin-toolbar/slash`

## 下一步 {/*next-steps*/}

前往 [上下文菜单](/learn/context-menu) 指南了解如何配置使用上下文菜单。
