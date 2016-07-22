const CommentBox = React.createClass({
  render: function(){
    return(
      <div className="commentBox">
        CommentBox here.
      </div>
    );
  }
});
ReactDom.render(
  <CommentBox />,
  document.getElementsById('content')
);
