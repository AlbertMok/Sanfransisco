import { ListTemplate } from '../list/list'

export const UnorderedListTemplates: ListTemplate[] = [
  {
    key: 'default',
    depth: 3,
    render: ({ level }) => {
      const l = level % 3
      switch (l) {
        case 1:
          return { type: 'circle', text: `○` }
        case 2:
          return { type: 'square', text: `■` }
        default:
          return { type: 'disc', text: `●` }
      }
    },
  },
]
