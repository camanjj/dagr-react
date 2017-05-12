import React, {Component} from 'react';
import Datetime from 'react-datetime'

export class DateRangeField extends Component {
  constructor(props) {
    super(props);
    this.state = {...props.formData};
  }

  onChange(name) {
    return (event) => {
      // console.log(event)
      this.setState({
        [name]: event.toDate()
      }, () => this.props.onChange(this.state));
    };
  }

  render() {
    console.log(this.props)
    const {before, after} = this.state;
    return (
      <div className="input-group">
        <Datetime className="input-group-addon" value={after} onChange={this.onChange("after")} />
        <p className="input-group-addon">{'<='} {this.props.schema.title} {'<='} </p>
        <Datetime className="input-group-addon" value={before} onChange={this.onChange("before")}/>
      </div>
    );
  }
}


export class IntRangeField extends Component {
  constructor(props) {
    super(props);
    this.state = {...props.formData};
  }

  onChange(name) {
    return (event) => {
      // console.log(event)
      this.setState({
        [name]: event.target.value === undefined ? undefined : parseInt(event.target.value)
      }, () => this.props.onChange(this.state));
    };
  }

  render() {
    console.log(this.props)
    const {low, high} = this.state;
    return (
      <div className="input-group">
        <input className="form-control" type="number" value={low} onChange={this.onChange("low")} />
        <p className="input-group-addon">{'<='} {this.props.schema.title} {'<='} </p>
        <input className="form-control" type="number" value={high} onChange={this.onChange("high")}/>
      </div>
    );
  }
}
