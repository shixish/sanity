import {SanityClient} from '@sanity/client'
import {ObjectSchemaType, Path, Schema, SchemaType, ValidationMarker} from '@sanity/types'
import {render} from '@testing-library/react'
import React, {FocusEvent} from 'react'
import {
  createPatchChannel,
  FieldMember,
  FIXME,
  PatchArg,
  PatchEvent,
  StudioFormBuilderProvider,
  useFormState,
} from '../../src/form'
import {FormState} from '../../src/form/store/useFormState'
import {EMPTY_ARRAY} from '../../src/form/utils/empty'
import {useSchema} from '../../src/hooks'
import {FormFieldPresence} from '../../src/presence'
import {createSchema} from '../../src/schema'
import {createMockSanityClient} from '../mocks/mockSanityClient'
import {TestProvider} from './TestProvider'
import {TestRenderProps} from './types'

export interface TestRenderInputContext {
  client: SanityClient
  formState: FormState
}

export interface TestRenderInputProps {
  compareValue: unknown
  focusPath: Path
  focusRef: React.Ref<FIXME>
  id: string
  level: number
  onBlur: (event: FocusEvent) => void
  onChange: (path: PatchArg | PatchEvent) => void
  onFocus: (event: FocusEvent) => void
  onPathBlur: (path: Path) => void
  onPathFocus: (path: Path) => void
  path: Path
  presence: FormFieldPresence[]
  readOnly: boolean | undefined
  schemaType: SchemaType
  validation: ValidationMarker[]
  value: unknown
}

export type TestRenderInputCallback = (
  inputProps: TestRenderInputProps,
  context: TestRenderInputContext
) => React.ReactElement

export function renderInput(props: {
  fieldDefinition: Schema.TypeDefinition
  props?: TestRenderProps
  render: TestRenderInputCallback
}) {
  const {render: initialRender, fieldDefinition, props: initialTestProps} = props
  const name = fieldDefinition.name

  const client = createMockSanityClient() as unknown as SanityClient
  const patchChannel = createPatchChannel()

  const focusRef = jest.fn()
  const onBlur = jest.fn()
  const onChange = jest.fn()
  const onFocus = jest.fn()
  const onPathBlur = jest.fn()
  const onPathFocus = jest.fn()
  const onPathOpen = jest.fn()
  const onFieldGroupSelect = jest.fn()
  const onSetFieldSetCollapsed = jest.fn()
  const onSetPathCollapsed = jest.fn()

  function TestForm(renderProps: TestRenderProps & {render: TestRenderInputCallback}) {
    const {
      documentValue,
      focusPath = EMPTY_ARRAY,
      openPath = EMPTY_ARRAY,
      presence = EMPTY_ARRAY,
      render: renderFn,
      validation = EMPTY_ARRAY,
    } = renderProps

    const schema = useSchema()
    const docType = schema.get('test') as ObjectSchemaType | undefined

    if (!docType) throw new Error(`no document type: test`)

    const formState = useFormState(docType, {
      value: documentValue as any,
      focusPath,
      collapsedPaths: undefined,
      expandedFieldSets: undefined,
      fieldGroupState: undefined,
      openPath,
    })

    if (!formState) {
      throw new Error('no form state')
    }

    const fieldMember = formState.members.find((m) => m.kind === 'field' && m.name === name) as
      | FieldMember
      | undefined

    if (!fieldMember) {
      throw new Error(`no field member: ${name}`)
    }

    const {level, path, readOnly, schemaType} = fieldMember.field

    return (
      <StudioFormBuilderProvider
        __internal_patchChannel={patchChannel}
        changesOpen={false}
        compareValue={formState.compareValue}
        focusPath={formState.focusPath}
        focused={formState.focused}
        groups={formState.groups || EMPTY_ARRAY}
        id={formState.id}
        members={formState.members || EMPTY_ARRAY}
        onChange={onChange}
        onPathBlur={onPathBlur}
        onPathFocus={onPathFocus}
        onPathOpen={onPathOpen}
        onFieldGroupSelect={onFieldGroupSelect}
        onSetFieldSetCollapsed={onSetFieldSetCollapsed}
        onSetPathCollapsed={onSetPathCollapsed}
        presence={presence}
        readOnly={formState.readOnly}
        schemaType={docType}
        validation={validation}
        value={undefined}
      >
        {renderFn(
          {
            compareValue: formState.compareValue?.[name],
            focusPath: formState.focusPath,
            focusRef,
            id: formState.id || name,
            level,
            onBlur,
            onChange,
            onFocus,
            onPathBlur,
            onPathFocus,
            path,
            presence,
            readOnly,
            schemaType,
            validation,
            value: formState.value?.[name],
          },
          {client, formState}
        )}
      </StudioFormBuilderProvider>
    )
  }

  const schema = createSchema({
    name: 'test',
    types: [{type: 'document', name: 'test', fields: [fieldDefinition]}],
  })

  const result = render(
    <TestProvider client={client} schema={schema}>
      <TestForm {...initialTestProps} render={initialRender} />
    </TestProvider>
  )

  function rerender(subsequentRender: TestRenderInputCallback) {
    render(
      <TestProvider client={client} schema={schema}>
        <TestForm {...initialTestProps} render={subsequentRender} />
      </TestProvider>
    )
  }

  return {
    focusRef,
    onBlur,
    onChange,
    onFocus,
    onPathBlur,
    onPathFocus,
    onFieldGroupSelect,
    onSetFieldSetCollapsed,
    rerender,
    result,
  }
}