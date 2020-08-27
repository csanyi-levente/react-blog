import React, { useState } from 'react';
import axios from 'axios';

export default ({ postId }) => {
    const [content, setContent] = useState('');
    const onSubmit = async (event) => {
        event.preventDefault();

        axios.post(`http://localhost:4001/posts/${postId}/comments`, {
            content
        });

        setContent('');
    };

    return <div>
                <form onSubmit={onSubmit} className="form-group">
                    <div style={{ marginBottom: '8px'}}>
                        <label>Comment</label>
                        <input type="text" value={content} onChange={e => setContent(e.target.value)}
                         className="form-control"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Comment</button>
                </form>
           </div>
}
