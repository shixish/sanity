import {definePlugin} from 'sanity'

import {commentsUsEnglishLocaleBundle} from '../i18n'
import {CommentsDocumentLayout} from './document-layout'
import {CommentsField} from './field'
// import {CommentsInput} from './input'
import {commentsInspector} from './inspector'
import {CommentsStudioLayout} from './studio-layout'

export const comments = definePlugin({
  name: 'sanity/structure/comments',

  document: {
    inspectors: [commentsInspector],
    components: {
      unstable_layout: CommentsDocumentLayout,
    },
  },

  form: {
    components: {
      field: CommentsField,
      // The `CommentsInput` will be enabled when it is ready to be used.
      // input: CommentsInput,
    },
  },

  studio: {
    components: {
      layout: CommentsStudioLayout,
    },
  },

  i18n: {bundles: [commentsUsEnglishLocaleBundle]},
})
