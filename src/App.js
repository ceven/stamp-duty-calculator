import React, { Component } from "react";
import logo from "./stamp_duty.jpg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Stamp Duty Calculator</h1>
        </header>
        <StampDuty />
      </div>
    );
  }
}

class StampDuty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      duty: 0
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

  calculateDuty(v) {
    if (this.wrongValue()) {
      return 0;
    }
    if (v <= 14000) {
      return (v * 1.25) / 100;
    }
    if (v <= 30000) {
      return 175 + (1.5 * (v - 14000)) / 100;
    }
    if (v <= 80000) {
      return 415 + (1.75 * (v - 30000)) / 100;
    }
    if (v <= 300000) {
      return 1290 + (3.5 * (v - 80000)) / 100;
    }
    if (v <= 1000000) {
      return 8990 + (4.5 * (v - 300000)) / 100;
    }
    return 40490 + (5.5 * (v - 1000000)) / 100;
  }

  render() {
    return (
      <p>
        <h3>
          Enter dutiable value:
          <input
            className={this.wrongValue() ? "error" : ""}
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <br />
        </h3>
        <h3>
          {!this.wrongValue() && <label>Stamp duty is {this.state.duty}</label>}
          {this.wrongValue() && (
            <p className="error-msg">Please enter a positive number.</p>
          )}
        </h3>
        <footer>
          See{" "}
          <a href="https://www.revenue.nsw.gov.au/info/factsheet/duties/general/rates">
            NSW Duties Rates
          </a>
        </footer>
      </p>
    );
  }
}
export default App;
