export type ArticleType = {
  text: string,
  comments?: {
    id: string,
    text: string,
    date: string,
    likesCount: number,
    dislikesCount: number,
    user?: {
      id?: string,
      name?: string
    },
    myLike?: boolean,
    myDislike?: boolean,
    myViolate?: boolean,
  }[],
  commentsCount: number,
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string,
}
