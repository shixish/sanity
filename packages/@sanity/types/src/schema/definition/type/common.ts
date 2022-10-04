import {ComponentType, ReactElement, ReactNode} from 'react'
import {ConditionalProperty} from '../../types'
import {ObjectOptions} from './object'

export type FieldsetDefinition = {
  name: string
  title?: string
  description?: string
  hidden?: ConditionalProperty
  readOnly?: ConditionalProperty
  options?: ObjectOptions
}

export type FieldGroupDefinition = {
  name: string
  title?: string
  icon?: ComponentType | ReactNode
  default?: boolean
}

export interface BaseSchemaDefinition {
  name: string
  title?: string
  description?: string | ReactElement
  hidden?: ConditionalProperty
  readOnly?: ConditionalProperty
  icon?: ComponentType | ReactNode
  components?: {
    diff?: ComponentType<any> // @todo: use `DiffProps` here
    field?: ComponentType<any> // @todo: use `FieldProps` here
    input?: ComponentType<any> // @todo: use `InputProps` here
    item?: ComponentType<any> // @todo: use `ItemProps` here
    preview?: ComponentType<any> // @todo: use `PreviewProps` here
  }
  validation?: unknown
  initialValue?: unknown
}

export interface TitledListValue<V = unknown> {
  _key?: string
  title: string
  value?: V
}

export interface EnumListProps<V = unknown> {
  list?: Array<TitledListValue<V> | V>
  layout?: 'radio' | 'dropdown'
  direction?: 'horizontal' | 'vertical'
}
