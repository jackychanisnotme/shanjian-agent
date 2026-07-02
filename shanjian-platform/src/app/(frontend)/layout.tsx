import React from 'react'
import './styles.css'

export const metadata = {
  description: '公益机构大病救助项目系统',
  title: '善见 Platform',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="zh-CN">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
