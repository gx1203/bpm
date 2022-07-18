export function generateMenu(title) {
  const hasKey = this.$te('menu.' + title)
  const translatedTitle = this.$t('menu.' + title)
  if (hasKey) {
    return translatedTitle
  }
  return title
}
