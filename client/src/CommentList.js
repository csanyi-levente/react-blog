import React from 'react';

export default ({ comments }) => {

    const renderedComments = comments.map(comment => {
        let content;

        if (comment.status === 'pending') {
            content = "This comment awaiting for moderation.";
        }
        if (comment.status === 'rejected') {
            content = "This comment was rejected.";
        }
        if (comment.status === 'approved') {
            content = comment.content;
        }

        return <li key={comment.id}>{content}</li>;
    });

    return <ul>
        {renderedComments}
    </ul>
};
