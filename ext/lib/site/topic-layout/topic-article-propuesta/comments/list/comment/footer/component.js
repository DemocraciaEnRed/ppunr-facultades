import React from 'react'
import t from 't-component'

export default function CommentFooter (props) {
  return (
    <footer className='actions'>
      {/* <div className='votes'>
        <span className='score'>
          <span>{props.score} Me gusta</span>
          {' '}
        </span>
        {!props.isOwner && (
          <button
            className={`upvote ${props.upvoted ? 'active' : ''}`}
            onClick={props.upvoted ? props.onUnvote : props.onUpvote}
            disabled={!props.enabled}>
            <i className='icon-like' />
          </button>
        )}
        {!props.isOwner && (
          <button
            className={`downvote ${props.downvoted ? 'active' : ''}`}
            onClick={props.downvoted ? props.onUnvote : props.onDownvote}
            disabled={!props.enabled}>
            <i className='icon-dislike' />
          </button>
        )}
      </div> */}
      <div className='replies-score'>
        {(props.enabled || props.repliesCount > 0) &&
          <button
            className='reply'
            title={t('comments.arguments.reply')}
            onClick={props.onToggleReplies}>
            <i className='icon-reply-all' /> <u>Responder</u>
            {
              !!props.repliesCount &&
              (
                <span className='score'>
                  {' '}
                  <span>({props.repliesCount})</span>
                  {/* <small>
                    {
                      props.repliesCount === 1 ? t('comments.reply') : t('comments.replies')
                    }
                  </small> */}
                </span>
              )
            }
          </button>
        }
      </div>
    </footer>
  )
}
