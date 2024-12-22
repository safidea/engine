import { PostRequest, type PostRequestParams } from './Post'

export class PatchRequest extends PostRequest {
  constructor(params: PostRequestParams) {
    super(params)
  }
}
