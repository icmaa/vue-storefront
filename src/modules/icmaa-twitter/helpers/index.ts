export const twitterify = (text: string): string => {
  return text
    .replace(/\n/, '<br/>')
    .replace(/([\w]+?:\/\/[\w]+[^\s\n\r\t<\s]*)/, '<a href="$1" target="_blank">$1</a>')
    .replace(/((www|ftp)\.[^\s\t\n\r<\s]*)/, '<a href="https://$1" target="_blank">$1</a>')
    .replace(/@(\w+)/, '<a href="https://www.twitter.com/$1" target="_blank">@$1</a>')
    .replace(/#(\w+)/, '<a href="https://search.twitter.com/search?q=$1" target="_blank">#$1</a>')
}
