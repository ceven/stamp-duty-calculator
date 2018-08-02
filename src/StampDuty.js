import React from "react";
import "./StampDuty.css"

export class StampDuty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      duty: 0,
      dutiable: 'dutiable',
      url: '',
      image: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      duty: this.calculateDuty(event.target.value)
    });
  }

  wrongValue() {
    return isNaN(this.state.value) || this.state.value < 0;
  }

  render() {
    return (
        <div className="StampDuty">
            <img className="StampDuty_img" src={this.state.image} alt=''/>
      <p className="StampDuty_content">
        <h3>
          Enter {this.state.dutiable} value:
          <input
            className={this.wrongValue() ? "StampDuty_input StampDuty_error" : "StampDuty_input"}
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <br />
        </h3>
        <h3>
          {!this.wrongValue() && <label>Stamp duty is {this.state.duty}</label>}
          {this.wrongValue() && (
            <p className="StampDuty_error-msg">Please enter a positive number.</p>
          )}
        </h3>
        <p>
            {
                this.state.url && <div>
                    See{" "}
                    <a href={this.state.url}>
                        NSW {this.state.dutiable.charAt(0).toUpperCase()}{this.state.dutiable.substring(1)} Duty Rates
                    </a>

                </div>
            }
        </p>
      </p>
        </div>
    );
  }
}
