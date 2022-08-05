import {Pagination} from './components/Pagination'
import {Post} from './components/Post'
import {PostHeader} from './components/PostHeader'
import {PostText} from './components/PostText'
import {PostForm} from './components/PostForm'
import {getHomePosts, getPost, getPostRequest, getPosts} from './services/getPosts'
import {addComment} from './services/addComment'
import {addPost} from './services/addPost'
import {deletePost, switchPostLock, updatePost} from './services/updatePost'

export {
  Pagination,
  Post,
  PostHeader,
  PostText,
  PostForm,
  getHomePosts,
  getPosts,
  getPost,
  getPostRequest,
  addComment,
  addPost,
  updatePost,
  deletePost,
  switchPostLock
}