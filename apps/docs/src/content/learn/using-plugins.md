---
title: Using Plugins
---

<Intro>

This page will show you how to integrate the Editable plugins into your editor.

</Intro>

## Step 1: Install `@everynote/plugins` {/*step-1*/}

This is a collection of commonly used plugins that can be used in the same way as other individual plugins.

<TerminalBlock>

npm install @everynote/models @everynote/editor @everynote/plugins

</TerminalBlock>

## Step 2: Import the plugin {/*step-2*/}

```js

import * as React from 'react'
import { createEditor } from '@everynote/models'
import { EditableProvider, ContentEditable, withEditable } from '@everynote/editor'
import { withPlugins } from '@everynote/plugins'

```

## Step 3: Use `withPlugins` {/*step-3*/}

```js
const App = () => {
  const editor = React.useMemo(() => {
    const editor = withEditable(createEditor())
    return withPlugins(editor)
  }, [])

  return (
    <EditableProvider editor={editor}>
      <ContentEditable />
    </EditableProvider>
  )
}

```

## Try using plugins {/*try-plugins*/}

The following sandbox has already used `@everynote/plugins`. You can try using the plugins in it.

The plugin has implemented related functions such as `keyboard shortcuts`, `markdown syntax`, etc. You can try:

- Use `Ctrl + B` to make the selected text bold
- Input `#` + `space` to convert the text to a heading
- ...

<Sandpack deps={['@everynote/plugins']}>

```js
import * as React from 'react'
import { createEditor } from '@everynote/models'
import { EditableProvider, ContentEditable, withEditable } from '@everynote/editor'
import { withPlugins } from '@everynote/plugins'

export default function App() {
  const editor = React.useMemo(() => {
    const editor = withEditable(createEditor())
    return withPlugins(editor)
  }, [])

  return (
    <EditableProvider editor={editor}>
      <ContentEditable />
    </EditableProvider>
  )
}

```

</Sandpack>

## Next Steps {/*next-steps*/}

Go to the [Toolbar](/learn/toolbar) guide to learn how to configure and use the toolbar.
