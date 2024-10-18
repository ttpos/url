export interface GitHubUser {
  id: number // User ID
  login: string // User login name
  email: string | null // User's email, can be null
  avatar_url: string // URL of the user's avatar
  node_id: string // User node ID
  gravatar_id: string // Gravatar ID (usually an empty string)
  url: string // API URL
  html_url: string // GitHub URL
  followers_url: string // User's followers API URL
  following_url: string // User's following API URL
  gists_url: string // User's gists API URL
  starred_url: string // User's starred API URL
  subscriptions_url: string // User's subscriptions API URL
  organizations_url: string // User's organizations API URL
  repos_url: string // User's repositories API URL
  events_url: string // User's events API URL
  received_events_url: string // User's received events API URL
  type: 'User' | 'Organization' // User type, can be 'User' or 'Organization'
  site_admin: boolean // Whether the user is a site admin
  name: string | null // User's name, can be null
  company: string | null // User's company, can be null
  blog: string | null // User's blog, can be null
  location: string | null // User's location, can be null
  hireable: boolean // Whether the user is hireable
  bio: string | null // User's bio, can be null
  twitter_username: string | null // User's Twitter username, can be null
  notification_email: string | null // User's notification email, can be null
  public_repos: number // Number of public repositories
  public_gists: number // Number of public gists
  followers: number // Number of followers
  following: number // Number of users the person is following
  created_at: string // Creation date (ISO 8601 format)
  updated_at: string // Last update date (ISO 8601 format)
}
