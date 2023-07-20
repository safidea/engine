interface LinkDto {
  type: 'link'
  href: string
  text: string
}

interface ParagraphDto {
  type: 'paragraph'
  text: string
}

export type ComponentDto = LinkDto | ParagraphDto
