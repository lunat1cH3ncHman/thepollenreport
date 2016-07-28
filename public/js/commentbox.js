//commentbox.js
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/

const Comment = React.createClass({
  render:function(){
    const md = new Remarkable();
    return(
      <div className="comment">
        <h2 className="commentAuthor">
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
  getInitialState: function(){
    return{author: '', text: ''};
  },
  handleAuthorChange: function(e){
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e){
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e){
    //Stop browser default submit
    e.preventDefault();
    let author = this.state.author.trim();
    let text =  this.state.text.trim();
    if (!text || !author){
      return;
    }
    let id = Date.now();
    this.props.onContentSubmit({id: id.toString(), author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function(){
    return(
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="What you want to say..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});
const CommentBox = React.createClass({
  loadCommentsFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment){
    console.log(comment);
    console.log(this.state.data);

    console.log("After with stringify " + JSON.stringify(this.state.data));

    this.state.data.push(comment);
    console.log("-" + JSON.stringify(this.state.data) + "-");
    console.log("After with stringify " + JSON.stringify(this.state.data));
    $.ajax({
      url: this.props.sendCommentUrl,
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(this.state.data),
      contentType: "application/json",
      success: function(data) {
        console.log(data);
        console.log("After sending " + JSON.stringify(this.state.data));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.sendCommentUrl, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function(){
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function(){
    return(
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onContentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox
    url="https://s3-eu-west-1.amazonaws.com/thepollenreport/comments.json"
    sendCommentUrl="http://localhost:3000/api/v1/comments"
    pollInterval={2000}/>,
  document.getElementById('comments')
);
