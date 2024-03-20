'use client'
import * as React from 'react'

import styled, { createGlobalStyle, css } from 'styled-components'
import { ExternalLink } from '@/components/external-link'
import { IconGitHub } from '@/components/icon/github'
import Image from 'next/image'
// import tw, { css, styled } from 'twin.macro'
import '@/utils/i18n'
import {
  EditableProvider,
  ContentEditable,
  useIsomorphicLayoutEffect,
  Placeholder,
  isTouchDevice,
  Editable,
  withEditable,
  parseDataTransfer,
  BlockSelectionArea,
  useBlockSelectionHooks,
} from '@everynote/editor'
import { Editor, createEditor, Range, Transforms, Element } from '@everynote/models'
import { MarkdownDeserializer } from '@everynote/deserializer'
import { withPlugins, useContextMenuEffect, ContextMenu, MentionUser } from '@everynote/plugins'
import { withYHistory, withYjs, YjsEditor, withYCursors, CursorData, useRemoteStates } from '@everynote/plugin-yjs'
import { WebsocketProvider } from '@everynote/yjs-websocket'
import { withHTMLSerializerTransform } from '@everynote/plugins/serializer/html'
import { withTextSerializerTransform } from '@everynote/plugins/serializer/text'
import { withMarkdownSerializerTransform, withMarkdownSerializerPlugin } from '@everynote/plugins/serializer/markdown'
import { withHTMLDeserializerTransform } from '@everynote/plugins/deserializer/html'
import { withMarkdownDeserializerTransform, withMarkdownDeserializerPlugin } from '@everynote/plugins/deserializer/markdown'

import { withHistory } from '@everynote/plugin-history'
// import { javascript as codemirrorJavascript } from '@codemirror/lang-javascript-next'
// import { html as codemirrorHtml } from '@codemirror/lang-html-next'
// import { css as codemirrorCss } from '@codemirror/lang-css-next'
import { withYCodeBlock } from '@everynote/plugin-codeblock'
import { ToolbarComponent, useToolbarEffect, withToolbar, Toolbar } from '@everynote/plugin-toolbar'
import { withInlineToolbar, useInlineToolbarEffect, InlineToolbar } from '@everynote/plugin-toolbar/inline'
import { withSideToolbar, useSideToolbarMenuEffect, SideToolbar } from '@everynote/plugin-toolbar/side'
import { withSlashToolbar, useSlashToolbarEffect, SlashToolbar } from '@everynote/plugin-toolbar/slash'
import { Switch, SwitchThumb, Icon, Tooltip } from '@everynote/ui'

import { createContextMenuItems } from '@/configs/context-menu-items'
import { createToolbarItems, defaultBackgroundColor, defaultFontColor } from '../../configs/toolbar-items'
import { createSideToolbarItems } from '@/configs/side-toolbar-items'
import { createInlineToolbarItems } from '@/configs/inline-toolbar-items'
import { checkMarkdownSyntax } from '@/configs/check-markdown-syntax'
import { createSlashToolbarItems } from '@/configs/slash-toolbar-items'
// import { initialValue } from '@/configs/initial-value'
import { initialValue } from '@/configs/default-content'

import { useTranslation } from 'react-i18next'

import randomColor from 'randomcolor'
import { faker } from '@faker-js/faker'
import * as Y from 'yjs'
import { useRouter } from 'next/navigation'

const CustomStyles = createGlobalStyle({
  body: {
    backgroundColor: `bg-white`,
  },
})

const StyledHeader = styled.div`bg-white text-base sticky top-0 z-50`

// 头部菜单栏
const StyledToolbar = styled(ToolbarComponent)``

// 编辑器容器
const StyledContainer = styled.div``

const StyledSwitch = styled(Switch)(({ checked }) => {
  return [
    css`
      background: ${checked ? '#44b492 !important;' : '#e2e8f0 !important;'};
    `,
  ]
})

const StyledSwitchThumb = styled(SwitchThumb)`
  transform: translateX(2px);
  will-change: transform;

  &[data-state='checked'] {
    transform: translateX(20px);
  }
`

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      YJS_SERVER: string
    }
  }
}

export default function Playground() {
  const router = useRouter()

  const local = 'zh-CN'

  const { t } = useTranslation()

  const [readOnly, setReadOnly] = React.useState(false)

  const [connected, setConnected] = React.useState(false)

  const [connecting, setConnection] = React.useState(false)

  const [enableCollaborative, setEnableCollaborative] = React.useState(false)

  const document = React.useMemo(() => new Y.Doc(), [])

  const provider = React.useMemo(() => {
    const provider =
      typeof window === 'undefined'
        ? null
        : new WebsocketProvider(process.env.YJS_SERVER, 'editable', document, {
            connect: false,
          })

    const handleStatus = (event: Record<'status', 'connecting' | 'connected' | 'disconnected'>) => {
      const { status } = event
      if (status === 'connected') {
        setConnected(true)
        setConnection(false)
      } else if (status === 'connecting') {
        setConnection(true)
      } else if (status === 'disconnected') {
        setConnected(false)
        setConnection(false)
      }
    }
    if (provider) provider.on('status', handleStatus)
    return provider
  }, [document])

  const editor = React.useMemo(() => {
    const { name } = faker
    const cursorData: CursorData = {
      color: randomColor({
        luminosity: 'dark',
        alpha: 1,
        format: 'hex',
      }),
      name: `${name.firstName()} ${name.lastName()}`,
      avatar: faker.image.avatar(),
    }

    const sharedType = document.get('content', Y.XmlText) as Y.XmlText

    let editor = withYjs(withEditable(createEditor()), sharedType, {
      autoConnect: false,
    })
    if (provider) {
      editor = withYCursors(editor, provider.awareness, {
        data: cursorData,
      })
    }

    editor = withHistory(editor)

    editor = withYHistory(editor)

    editor = withPlugins(editor, {
      fontSize: { defaultSize: '14px' },
      fontColor: { defaultColor: defaultFontColor },
      backgroundColor: { defaultColor: defaultBackgroundColor },
      mention: {
        onSearch: (value) => {
          return new Promise<MentionUser[]>((resolve) => {
            const users: MentionUser[] = []
            for (let i = 0; i < 20; i++) {
              users.push({
                id: i,
                name: faker.name.fullName(),
                avatar: faker.image.avatar(),
              })
            }
            resolve(users)
          })
        },
        match: () =>
          !Editor.above(editor, {
            match: (n) => Element.isElement(n) && !!n.type && n.type === 'title',
          }),
      },
      codeBlock: {
        languages: [
          {
            value: 'plain',
            content: 'Plain text',
          },
          // {
          //   value: 'javascript',
          //   content: 'JavaScript',
          //   plugin: codemirrorJavascript(),
          // },
          // {
          //   value: 'html',
          //   content: 'HTML',
          //   plugin: codemirrorHtml(),
          // },
          // {
          //   value: 'css',
          //   content: 'CSS',
          //   plugin: codemirrorCss(),
          // },
        ],
      },
    })
    if (provider) editor = withYCodeBlock(editor, document, provider.awareness)
    editor = withInlineToolbar(withToolbar(editor))

    // 如果不是触摸设备的话，就显示sideToolbar
    if (!isTouchDevice) {
      editor = withSideToolbar(editor, {
        match: (n) => !(Element.isElement(n) && !!n.type && n.type === 'title'),
      })
    }

    // slash menu
    editor = withSlashToolbar(editor, {
      match: () => !Editor.above(editor, { match: (n) => Element.isElement(n) && !!n.type && n.type === 'title' }),
    })

    return editor
  }, [document, provider])

  useIsomorphicLayoutEffect(() => {
    const unsubscribe = Placeholder.subscribe(editor, ([node]) => {
      if (Editable.isFocused(editor) && Editor.isBlock(editor, node) && !(Element.isElement(node) && !!node.type && node.type === 'title'))
        return () => t('playground.editor.block-placeholder')
    })
    return () => unsubscribe()
  }, [editor])

  // Connect editor and provider in useEffect to comply with concurrent mode
  // requirements.
  React.useEffect(() => {
    if (!provider) return
    if (enableCollaborative) {
      provider.connect()
    }
    return () => {
      provider.disconnect()
    }
  }, [provider, enableCollaborative])

  React.useEffect(() => {
    // window.__setPreferredTheme('light')
    if (connected) {
      YjsEditor.connect(editor)
    }
    return () => YjsEditor.disconnect(editor)
  }, [editor, connected])

  // 序列化
  useIsomorphicLayoutEffect(() => {
    withMarkdownDeserializerPlugin(editor) // Adds a markdown deserializer plugin to the editor
    withMarkdownSerializerPlugin(editor) // Adds a markdown serializer plugin to the editor
    withTextSerializerTransform(editor) // Adds a text serializer transform to the editor
    withHTMLSerializerTransform(editor) // Adds an HTML serializer transform to the editor
    withMarkdownSerializerTransform(editor) // Adds a markdown serializer transform to the editor
    withHTMLDeserializerTransform(editor) // Adds an HTML deserializer transform to the editor
    withMarkdownDeserializerTransform(editor) // Adds a markdown deserializer transform to the editor

    const { onPaste } = editor

    editor.onPaste = (event) => {
      const { clipboardData, type } = event
      if (!clipboardData || !editor.selection) return onPaste(event)
      const { text, fragment, html, files } = parseDataTransfer(clipboardData)
      const isPasteText = type === 'pasteText'
      if (!isPasteText && (fragment.length > 0 || files.length > 0)) {
        return onPaste(event)
      }
      if (Range.isExpanded(editor.selection)) {
        Transforms.delete(editor)
      }
      const anchor = Range.start(editor.selection)
      onPaste(event)
      // check markdown syntax
      if (checkMarkdownSyntax(text, html) && editor.selection) {
        const focus = Range.end(editor.selection)
        Promise.resolve().then(() => {
          const madst = MarkdownDeserializer.toMdastWithEditor(editor, text)
          const content = MarkdownDeserializer.transformWithEditor(editor, madst)
          editor.selection = {
            anchor,
            focus,
          }
          editor.insertFragment(content)
        })
      }
    }

    return () => {
      editor.onPaste = onPaste
    }
  }, [editor])

  // MENU
  useContextMenuEffect(() => {
    ContextMenu.setItems(editor, createContextMenuItems(editor))
  }, editor)

  useToolbarEffect(() => {
    Toolbar.setItems(editor, createToolbarItems(editor))
  }, editor)

  useInlineToolbarEffect(() => {
    InlineToolbar.setItems(editor, createInlineToolbarItems(editor))
  }, editor)

  useSideToolbarMenuEffect((...a) => {
    SideToolbar.setItems(editor, createSideToolbarItems(editor, ...a))
  }, editor)

  useSlashToolbarEffect((value) => {
    SlashToolbar.setItems(editor, createSlashToolbarItems(editor, value))
  }, editor)

  const remoteClients = useRemoteStates<CursorData>(editor)
  const [content, setContent] = React.useState('')
  return (
    <>
      <CustomStyles />
      {/* <Seo title={t('playground.title')} /> */}
      {/* 编辑器状态 */}
      <EditableProvider
        editor={editor}
        value={initialValue}
        onChange={(value) => {
          setContent(JSON.stringify(value))
        }}
      >
        {/* 头部 */}
        <StyledHeader id="header">
          {/* <button onClick={() => console.log(content)}>显示</button> */}
          <div className="flex justify-between py-3 px-6 text-base">
            <div className="flex text-2x flex-1 gap-3">
              <ExternalLink aria-label="Editable on Github" href="https://github.com/AlbertMok/Sanfransisco">
                <IconGitHub />
              </ExternalLink>
            </div>
            <div tw="flex gap-1 items-center">
              {Object.keys(remoteClients).map((id) => {
                const state = remoteClients[id]
                if (!state.data) return
                const { name, avatar } = state.data
                return (
                  <Tooltip key={id} content={name}>
                    <div tw="rounded-full w-7 h-7 overflow-hidden">
                      <Image alt={name} src={avatar ?? name} width={28} height={28} />
                    </div>
                  </Tooltip>
                )
              })}
              <div tw="flex items-center text-xs ml-3">
                <label htmlFor="collaboration-mode" tw="mr-2">
                  {connecting
                    ? t('playground.connecting')
                    : connected
                    ? t('playground.mode.collaboration') // 在locals文件夹中定义的模式
                    : t('playground.mode.local')}
                </label>
                {connecting && <Icon name="loading" />}
                {!connecting && (
                  <StyledSwitch
                    className="relative shadow w-10 rounded-full bg-link"
                    checked={enableCollaborative}
                    onChange={setEnableCollaborative}
                    id="collaboration-mode"
                  >
                    <StyledSwitchThumb className="block w-5 h-5 rounded-full bg-white shadow" />
                  </StyledSwitch>
                )}
              </div>
            </div>
          </div>
          <StyledToolbar
            className="flex justify-start overscroll-contain md:justify-center border border-solid border-t-gray-200 border-b-gray-200 py-2 px-2 md:px-6 overflow-auto"
            editor={editor}
            disabled={readOnly}
          />
        </StyledHeader>

        <BlockSelectionArea className="text-container" startAreas={'.text-container'}>
          <StyledContainer className="mt-2 md:mt-5 min-h-[80vh] bg-white w-full md:w-[800px] m-auto px-4 py-4 md:px-10 md:py-16 text-base">
            <ContentEditable lang={local ?? 'en-US'} readOnly={readOnly} placeholder={t('playground.editor.placeholder')} />
          </StyledContainer>
        </BlockSelectionArea>
      </EditableProvider>
    </>
  )
}
