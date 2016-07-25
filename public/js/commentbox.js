const CommentBox = React.createClass({
  render: function(){
    return(
      <div className="commentBox">
        Comment box here.
      </div>
    );
  }
});
ReactDom.render(
  <CommentBox />,
  document.getElementsById('content')
);
