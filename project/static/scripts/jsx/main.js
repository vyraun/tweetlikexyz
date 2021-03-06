var React = require('react');
var ReactDOM = require('react-dom');
var MultiSelect = require('react-bootstrap-multiselect');
var request = require('request');
var SERVER_URL = 'http://tweetlike.xyz/';
//var SERVER_URL = 'http://127.0.0.1:5000/';

var PageLayout = React.createClass({
  updatePhrase: function(dict){
    value = dict['xyzfy_phrase'];
    this.setState({
      'quote': value
    });
  },

  getInitialState: function(){
    return {quote: ""};
  },

  componentDidMount: function() {
    request({url: SERVER_URL+'random'}, function(error, response, body){
      result = JSON.parse(body);
      this.setState({
        'quote': result['text']
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function(){
    return (
      <div className="row">
        <div className="col-md-6 border-right">
          <TweetForm updatePhrase={this.updatePhrase}/>
        </div>

        <div className="col-md-6">
          <span className="fancyMcFancy"><NewPhrase quote={this.state.quote}/></span>
        </div>
      </div>
    )
  }

})

// Our column things
var TweetForm = React.createClass({
  handleSubmit: function(event){
    // No refresh page
    event.preventDefault();

    // Get person value
    var person = ReactDOM.findDOMNode(this.refs.peopleSelect).value; 
    var phrase = ReactDOM.findDOMNode(this.refs.phraseInput).value;

    // RESTFUL
    var data = {
      'person': person,
      'phrase': phrase
    };

    request.post({url: SERVER_URL+'xyzfy', form: data}, function (error, response, body){
      result = JSON.parse(body);
      this.props.updatePhrase(result);
    }.bind(this));
  },

  render: function() {
    return (
        <form action="" onSubmit={this.handleSubmit}>
          <h3>tweet like:</h3>
          {this.renderMultiselect("peopleSelect")} <br/>
          <h3>phrase to mimic:</h3>
          {this.renderTextArea("phraseInput")}<br/>
          <input type="submit" className="btn btn-default" value="xyz-fy" />
        </form>
    );
  },

  // People selector
  renderMultiselect: function(id){
    var options = ["shakespeare", "eminem", "donald trump"].map(function(name){
      return {label: name, value: name}
    });

    return <MultiSelect data={options} id={id} ref={id} />
  },

  // Phrase input
  renderTextArea: function(id){
    return (<textarea required="true" className="form-control" rows="15" maxLength="140" id={id} ref={id} />);
  }
})

// Xyz-fied Phrase output
var NewPhrase = React.createClass({
  render: function(){
    return (<p>"{this.props.quote}"</p>)
  }
})

ReactDOM.render(
  <PageLayout/>,
  document.getElementById("content")
);