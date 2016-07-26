//commentbox.js
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/

const data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment from array"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment from array"}
];

const Comment = React.createClass({
  render:function(){
    const md = new Remarkable();
    return(
      <div classname="comment">
        <h2 classname="commentAuthor">
          {this.props.author}
        </h2>
        {md.render(this.props.children.toString())}
      </div>
    );
  }
});
const CommentList = React.createClass({
  render: function(){
    const commentNodes = this.props.data.map(function(comment){
      return(
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return(
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
const CommentForm = React.createClass({
  render: function(){
    return(
      <div className="commentForm">
        Comment form here.
      </div>
    );
  }
});
const CommentBox = React.createClass({
  render: function(){
    return(
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data ={this.props.data}/>
        <CommentForm />
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox data={data}/>,
  document.getElementById('comments')
);
