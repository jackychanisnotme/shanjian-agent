import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: '机构用户',
    plural: '机构用户',
  },
  admin: {
    useAsTitle: 'email',
    group: '系统管理',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '姓名',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: '角色',
      defaultValue: 'viewer',
      required: true,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '审核员', value: 'reviewer' },
        { label: '意向协调员', value: 'coordinator' },
        { label: '只读查看', value: 'viewer' },
      ],
    },
    {
      name: 'organizationName',
      type: 'text',
      label: '机构名称',
      required: true,
    },
  ],
}
