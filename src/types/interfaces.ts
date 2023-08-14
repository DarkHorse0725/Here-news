interface IInvites {
  allowedLimit: number
  invited: number
}

export interface IUser {
  _id: string
  username: string
  displayName: string
  balance: number
  reputation: number
  parent?: IUser | string
  avatar?: string
  verified?: boolean
  userIdHash?: string
  useremail?: string
  invites?: IInvites
  introductoryPost?: IPost | any
  language?: string
  preferedLanguages?: string[]
  hasNewNotifications?: boolean
  verifiedBy?: any
  verificationReputation?: number
}

export interface IPublicUser {
  user: IUser
  totalPosts?: number
  totalUpvotes?: number
  totalDownvotes?: number
}

export interface IPost {
  _id: string
  userId: IUser
  title?: string
  text?: string
  images?: string[]
  meta?: {
    languageCodes?: string[]
    languages?: string[]
    tags?: string[]
    topics?: string[]
  }
  bookMarks?: string[]
  createdAt: Date
  upvotes: string[]
  downvotes: string[]
  totalVotes: number
  totalComments?: number
  preview?: {
    url: string
    favicon: string
    siteName?: string
    image: string
    title?: string
    description?: string
    youtubeId?: string
  }
  repliedTo?: IPost
  replies?: IPost[]
  totalReplies?: Number
  youtubeId?: string | undefined
  tips?: any
  type?: string
  postId: string
  permalink: string
}

export interface IComment {
  _id: string
  user: IUser
  post: IPost
  text: string
  createdAt: Date
  replyTo?: IComment
  replies?: IComment[]
}

export interface ILinkDetails {
  url: string
  favicon?: string
  siteName?: string
  image?: string
  title?: string
  description?: string
  youtubeId?: string
  sourcePost?: IPost
}

export interface IUploadedStatus {
  nameArray: string[]
  sizeArray: number[]
}

export interface ITranslateDataType {
  preTitle?: string
  preDescription?: string
  title?: string
  description?: string
  lang?: number
}
