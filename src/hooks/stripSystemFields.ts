import type { CollectionBeforeOperationHook, CollectionBeforeValidateHook } from 'payload'

export const stripSystemFieldsHook: CollectionBeforeValidateHook = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return data
  }

  const mutableData = data as Record<string, unknown>
  delete mutableData.id
  delete mutableData._id
  delete mutableData.createdAt
  delete mutableData.updatedAt
  return mutableData
}

export const stripSystemFieldsBeforeOperation: CollectionBeforeOperationHook = ({
  args,
  operation,
}) => {
  if (!args || typeof args !== 'object' || !('data' in args)) {
    return
  }

  if (operation !== 'create' && operation !== 'update') {
    return
  }

  const currentData = (args as { data?: unknown }).data
  if (!currentData || typeof currentData !== 'object') {
    return
  }

  const mutableData = { ...(currentData as Record<string, unknown>) }
  delete mutableData.id
  delete mutableData._id
  delete mutableData.createdAt
  delete mutableData.updatedAt

  ;(args as { data?: unknown }).data = mutableData
  return
}

