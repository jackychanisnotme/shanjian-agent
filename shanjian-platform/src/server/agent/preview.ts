const secretKeyPattern = /apikey|api_key|authorization|password|token|secret|bearer/i
const secretValuePattern = /(sk-[a-zA-Z0-9_-]{6,}|Bearer\s+[a-zA-Z0-9._-]+)/g

export function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => redactSecrets(item))

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        secretKeyPattern.test(key) ? '[REDACTED]' : redactSecrets(item),
      ]),
    )
  }

  if (typeof value === 'string') {
    return value.replace(secretValuePattern, '[REDACTED]')
  }

  return value
}

export function createPreview(value: unknown, maxLength = 240): string {
  const serialized = stringifyForPreview(redactSecrets(value))

  if (serialized.length <= maxLength) return serialized

  return `${serialized.slice(0, maxLength)}...[已截断，请缩小查询范围]`
}

export function truncateResult(value: unknown, maxLength = 12000): { value: unknown; truncated: boolean } {
  const serialized = stringifyForPreview(redactSecrets(value))

  if (serialized.length <= maxLength) {
    return {
      value: redactSecrets(value),
      truncated: false,
    }
  }

  return {
    value: {
      _truncated: true,
      _hint: '工具结果过长，请缩小路径、关键词或过滤条件后重试。',
      preview: serialized.slice(0, maxLength),
    },
    truncated: true,
  }
}

function stringifyForPreview(value: unknown): string {
  if (typeof value === 'string') return value

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
